"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, CheckCircle, Download, FileText, AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecordingControls } from "./recording-controls";
import { useRouter } from "next/navigation";
import { useUploadStore } from "@/stores/upload-store";
import { useRecordingStore } from "@/stores/recording-store";
import { useTranslation } from "@/lib/i18n";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

const WAVEFORM_BAR_COUNT = 36;

function WaveformBar({ index, isRecording }: { index: number; isRecording: boolean }) {
  const delay = `${(index * 0.05) % 0.8}s`;
  const animDuration = `${0.4 + (index % 5) * 0.15}s`;

  return (
    <div
      className={cn("w-1 rounded-full transition-all", isRecording ? "bg-primary" : "bg-muted-foreground/30")}
      style={{
        height: isRecording ? undefined : "4px",
        animation: isRecording ? `waveform ${animDuration} ease-in-out ${delay} infinite alternate` : "none",
      }}
    />
  );
}

export function AudioRecorder() {
  const router = useRouter();
  const t = useTranslation();
  const savedRecording = useRecordingStore((s) => s.audioRecording);
  const saveAudioRecording = useRecordingStore((s) => s.saveAudioRecording);
  const clearAudioRecording = useRecordingStore((s) => s.clearAudioRecording);

  // If there's a saved recording, start in "stopped" state so it's shown
  const [status, setStatus] = useState<RecordingStatus>(
    savedRecording ? "stopped" : "idle"
  );
  const [duration, setDuration] = useState(savedRecording?.duration ?? 0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Derive audioUrl and blob from store when in stopped state
  const audioUrl = status === "stopped" && savedRecording ? savedRecording.url : null;
  const blobRef = useRef<Blob | null>(savedRecording?.blob ?? null);

  // Keep blobRef in sync with store
  useEffect(() => {
    blobRef.current = savedRecording?.blob ?? null;
  }, [savedRecording]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === "recording") {
      interval = setInterval(() => setDuration((prev) => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [status]);

  // Cleanup active streams on unmount (but NOT the store data)
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleStart = useCallback(async () => {
    setError(null);
    setDuration(0);
    chunksRef.current = [];

    // Clean up previous recording from store
    clearAudioRecording();
    blobRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        blobRef.current = blob;
        // Save to store so it persists across navigation
        saveAudioRecording(blob, durationRef.current);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(100);
      setStatus("recording");
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError("Microphone access was denied. Please allow microphone permission in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setError("No microphone found. Please connect a microphone and try again.");
        } else {
          setError(`Microphone error: ${err.message}`);
        }
      } else {
        setError("An unexpected error occurred while accessing the microphone.");
      }
    }
  }, [clearAudioRecording, saveAudioRecording]);

  // Track duration in a ref so the onstop callback has the latest value
  const durationRef = useRef(duration);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const handlePause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.pause();
    setStatus("paused");
  }, []);

  const handleResume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") mediaRecorderRef.current.resume();
    setStatus("recording");
  }, []);

  const handleStop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
    setStatus("stopped");
  }, []);

  const handleReset = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((track) => track.stop()); streamRef.current = null; }
    clearAudioRecording();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    blobRef.current = null;
    setStatus("idle");
    setDuration(0);
    setError(null);
  }, [clearAudioRecording]);

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showDownloadMenu) return;
    const handler = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDownloadMenu]);

  const handleDownload = useCallback((format: string = "webm") => {
    if (!blobRef.current) return;
    const mimeTypes: Record<string, string> = {
      webm: "audio/webm",
      wav: "audio/wav",
      mp3: "audio/mpeg",
      ogg: "audio/ogg",
    };
    const blob = new Blob([blobRef.current], { type: mimeTypes[format] || "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  }, []);

  const handleGenerateNotes = useCallback(() => {
    if (!blobRef.current) return;
    const file = new File([blobRef.current], `audio-recording-${Date.now()}.webm`, { type: "audio/webm" });
    useUploadStore.getState().setFile(file);
    router.push("/notes/new?source=recording");
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="flex min-h-[200px] w-full items-center justify-center bg-muted/50 px-6 py-8">
            {status === "stopped" ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t.audioRecorder.recordingSaved}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.audioRecorder.audioSaved}</p>
                </div>
                {audioUrl && <audio controls src={audioUrl} className="w-full max-w-sm" />}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={handleGenerateNotes} className="gap-2">
                    <FileText className="h-4 w-4" />
                    {t.audioRecorder.generateNotes}
                  </Button>
                  <div className="relative" ref={downloadMenuRef}>
                    <Button variant="outline" className="gap-2" onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
                      <Download className="h-4 w-4" />
                      {t.audioRecorder.downloadRecording}
                    </Button>
                    {showDownloadMenu && (
                      <div className="absolute top-full mt-1 left-0 z-50 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
                        <button onClick={() => handleDownload("webm")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.webm (WebM Audio)</button>
                        <button onClick={() => handleDownload("wav")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.wav (WAV Audio)</button>
                        <button onClick={() => handleDownload("ogg")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.ogg (OGG Audio)</button>
                        <button onClick={() => handleDownload("mp3")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.mp3 (MP3 Audio)</button>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="gap-2" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                    {t.audioRecorder.newRecording}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center justify-center gap-[3px]">
                {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => (
                  <WaveformBar key={i} index={i} isRecording={status === "recording"} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex w-full items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {status !== "stopped" && !error && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-sm font-medium text-success">{t.audioRecorder.microphoneReady}</span>
        </div>
      )}

      {status !== "stopped" && (
        <RecordingControls status={status} onStart={handleStart} onPause={handlePause} onResume={handleResume} onStop={handleStop} duration={duration} variant="audio" />
      )}
    </div>
  );
}
