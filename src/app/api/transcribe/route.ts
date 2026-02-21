import { NextRequest } from "next/server";
import openai from "@/lib/openai";
import { writeFile, readFile, mkdir, readdir, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const MAX_DIRECT_SIZE = 24 * 1024 * 1024; // 24MB (margin below 25MB Whisper limit)
const CHUNK_DURATION_SECS = 600; // 10 minutes per chunk

export const maxDuration = 300; // 5 min timeout (for Vercel deployments)

/**
 * Resolve the ffmpeg binary path.
 * Tries system ffmpeg first, then the ffmpeg-static npm package.
 */
async function getFFmpegPath(): Promise<string> {
  // 1. System ffmpeg
  try {
    await execFileAsync("ffmpeg", ["-version"], { timeout: 5000 });
    return "ffmpeg";
  } catch {
    // not on PATH
  }

  // 2. ffmpeg-static npm package
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const staticPath = require("ffmpeg-static");
    if (staticPath) return staticPath as string;
  } catch {
    // not installed
  }

  throw new Error(
    "ffmpeg is required for files over 25 MB. " +
      "Install it from https://ffmpeg.org or run: npm install ffmpeg-static"
  );
}

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

/** Transcribe a single audio buffer with Whisper. */
async function transcribeChunk(buffer: Buffer, filename: string) {
  const file = new File([buffer], filename, { type: "audio/mpeg" });
  return openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });
}

// ── Small‑file handler (unchanged behaviour) ────────────────────────────────

async function transcribeSmallFile(file: File) {
  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const segments = (
    (response as unknown as Record<string, unknown>).segments as Array<{
      start: number;
      end: number;
      text: string;
    }> ?? []
  ).map((seg) => ({
    start: seg.start,
    end: seg.end,
    text: seg.text.trim(),
  }));

  return Response.json({ transcript: response.text, segments });
}

// ── Large‑file handler (split → transcribe chunks → stream progress) ────────

function transcribeLargeFile(file: File) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      const tempDir = join(tmpdir(), `transcribe-${Date.now()}`);

      try {
        await mkdir(tempDir, { recursive: true });

        // ── Write uploaded file to disk ──────────────────────────────────
        send({
          type: "progress",
          message: "Preparing audio for transcription...",
          percent: 5,
        });

        const inputPath = join(tempDir, "input");
        const arrayBuffer = await file.arrayBuffer();
        await writeFile(inputPath, Buffer.from(arrayBuffer));

        // ── Resolve ffmpeg ──────────────────────────────────────────────
        const ffmpegPath = await getFFmpegPath();

        // ── Split into chunks ───────────────────────────────────────────
        send({
          type: "progress",
          message: "Splitting audio into chunks...",
          percent: 8,
        });

        const chunkPattern = join(tempDir, "chunk_%03d.mp3");
        await execFileAsync(
          ffmpegPath,
          [
            "-i",
            inputPath,
            "-f",
            "segment",
            "-segment_time",
            String(CHUNK_DURATION_SECS),
            "-vn", // strip video track
            "-ac",
            "1", // mono
            "-ar",
            "16000", // 16 kHz (speech‑optimised)
            "-ab",
            "64k", // 64 kbps
            chunkPattern,
          ],
          { timeout: 300_000 } // 5 min for splitting
        );

        // ── List chunk files ────────────────────────────────────────────
        const chunkFiles = (await readdir(tempDir))
          .filter((f) => f.startsWith("chunk_") && f.endsWith(".mp3"))
          .sort()
          .map((f) => join(tempDir, f));

        const totalChunks = chunkFiles.length;
        let fullTranscript = "";
        const allSegments: TranscriptSegment[] = [];
        let timeOffset = 0;

        send({
          type: "progress",
          message: `Transcribing ${totalChunks} chunk(s)...`,
          percent: 10,
        });

        // ── Transcribe each chunk ───────────────────────────────────────
        for (let i = 0; i < totalChunks; i++) {
          const chunkPct = 10 + Math.round(((i + 0.5) / totalChunks) * 85);
          send({
            type: "progress",
            message: `Transcribing part ${i + 1} of ${totalChunks}...`,
            percent: chunkPct,
            chunk: i + 1,
            totalChunks,
          });

          const chunkBuffer = await readFile(chunkFiles[i]);
          const response = await transcribeChunk(
            chunkBuffer,
            `chunk_${i}.mp3`
          );

          // Append transcript
          if (fullTranscript && response.text) fullTranscript += " ";
          fullTranscript += response.text;

          // Merge segments with corrected timestamps
          const rawSegments =
            (
              response as unknown as Record<string, unknown>
            ).segments as Array<{
              start: number;
              end: number;
              text: string;
            }> ?? [];

          for (const seg of rawSegments) {
            allSegments.push({
              start: seg.start + timeOffset,
              end: seg.end + timeOffset,
              text: seg.text.trim(),
            });
          }

          // Advance offset by the last segment's end time (or chunk duration)
          const lastSeg = rawSegments.at(-1);
          timeOffset += lastSeg ? lastSeg.end : CHUNK_DURATION_SECS;
        }

        // ── Send final result ───────────────────────────────────────────
        send({
          type: "result",
          transcript: fullTranscript,
          segments: allSegments,
        });
      } catch (error: unknown) {
        console.error("Chunked transcription error:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Transcription failed. Please try again.";
        send({ type: "error", error: message });
      } finally {
        // Clean up temp directory
        await rm(tempDir, { recursive: true, force: true }).catch(() => {});
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
    },
  });
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size <= MAX_DIRECT_SIZE) {
      return transcribeSmallFile(file);
    }

    return transcribeLargeFile(file);
  } catch (error) {
    console.error("Transcription error:", error);
    return Response.json(
      { error: "Transcription failed. Please try again." },
      { status: 500 }
    );
  }
}
