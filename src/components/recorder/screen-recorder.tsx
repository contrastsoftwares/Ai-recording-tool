"use client";

import { useState, useEffect, useCallback } from "react";
import { Monitor, CheckCircle, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RecordingControls } from "./recording-controls";
import Link from "next/link";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

export function ScreenRecorder() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [duration, setDuration] = useState(0);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [quality, setQuality] = useState<"720p" | "1080p">("1080p");

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
      {/* Screen preview area */}
      <Card className="w-full overflow-hidden">
        <CardContent className="p-0">
          <div
            className={cn(
              "relative flex aspect-video w-full items-center justify-center bg-muted/50",
              status === "recording" && "ring-2 ring-red-500/50"
            )}
          >
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
                    Your screen recording has been saved successfully.
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
              /* Preview placeholder */
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Monitor
                  className={cn(
                    "h-12 w-12",
                    status === "recording" && "text-red-500"
                  )}
                />
                <p className="text-sm font-medium">
                  {status === "recording"
                    ? "Recording your screen..."
                    : status === "paused"
                      ? "Recording paused"
                      : "Your screen will appear here"}
                </p>
                {status === "recording" && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    REC
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recording controls */}
      {status !== "stopped" && (
        <RecordingControls
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          duration={duration}
          variant="screen"
        />
      )}

      {/* Settings row */}
      {(status === "idle" || status === "stopped") && (
        <div className="flex w-full flex-wrap items-center justify-center gap-6">
          {/* Audio toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm font-medium text-foreground">
              Include Audio
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={includeAudio}
              onClick={() => setIncludeAudio(!includeAudio)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                includeAudio ? "bg-primary" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
                  includeAudio ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </label>

          {/* Quality selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Quality</span>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as "720p" | "1080p")}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
