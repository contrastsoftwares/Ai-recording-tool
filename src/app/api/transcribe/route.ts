import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const response = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: file,
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const segments = ((response as unknown as Record<string, unknown>).segments as Array<{ start: number; end: number; text: string }> ?? []).map((seg) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    }));

    return NextResponse.json({
      transcript: response.text,
      segments,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed. Please try again." },
      { status: 500 }
    );
  }
}
