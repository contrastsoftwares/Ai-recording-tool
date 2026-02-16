"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, CheckCircle, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecordingControls } from "./recording-controls";
import Link from "next/link";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

const WAVEFORM_BAR_COUNT = 36;

function WaveformBar({ index, isRecording }: { index: number; isRecording: boolean }) {
  // Each bar gets a unique delay and animation duration for a natural look
  const delay = `${(index * 0.05) % 0.8}s`;
  const animDuration = `${0.4 + (index % 5) * 0.15}s`;

  return (
    <div
      className={cn(
        "w-1 rounded-full transition-all",
        isRecording ? "bg-primary" : "bg-muted-foreground/30"
      )}
      style={{
        height: isRecording ? undefined : "4px",
        animation: isRecording
          ? `waveform ${animDuration} ease-in-out ${delay} infinite alternate`
          : "none",
      }}
    />
  );
}

export function AudioRecorder() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === "recording") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  const handleStart = useCallback(() => {
    setDuration(0);
    setStatus("recording");
  }, []);

  const handlePause = useCallback(() => {
    setStatus("paused");
  }, []);

  const handleResume = useCallback(() => {
    setStatus("recording");
  }, []);

  const handleStop = useCallback(() => {
    setStatus("stopped");
  }, []);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setDuration(0);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Waveform visualization area */}
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="flex min-h-[200px] w-full items-center justify-center bg-muted/50 px-6 py-8">
            {status === "stopped" ? (
              /* Success message */
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Recording saved!
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your audio recording has been saved successfully.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button asChild className="gap-2">
                    <Link href="/dashboard">
                      <FileText className="h-4 w-4" />
                      Generate Notes
                    </Link>
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleReset}>
                    <Download className="h-4 w-4" />
                    Download Recording
                  </Button>
                </div>
              </div>
            ) : (
              /* Waveform bars */
              <div className="flex w-full items-center justify-center gap-[3px]">
                {Array.from({ length: WAVEFORM_BAR_COUNT }).map((_, i) => (
                  <WaveformBar
                    key={i}
                    index={i}
                    isRecording={status === "recording"}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Microphone status indicator */}
      {status !== "stopped" && (
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-sm font-medium text-success">
            Microphone ready
          </span>
        </div>
      )}

      {/* Recording controls */}
      {status !== "stopped" && (
        <RecordingControls
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          duration={duration}
          variant="audio"
        />
      )}
    </div>
  );
}
