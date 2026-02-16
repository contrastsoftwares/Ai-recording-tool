"use client";

import { cn } from "@/lib/utils";
import { Mic, Monitor, Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

interface RecordingControlsProps {
  status: RecordingStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  duration: number;
  variant?: "screen" | "audio";
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function RecordingControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  duration,
  variant = "audio",
}: RecordingControlsProps) {
  const IconComponent = variant === "screen" ? Monitor : Mic;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Recording indicator */}
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-opacity duration-300",
          status === "recording" ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
        <span className="text-red-500">Recording...</span>
      </div>

      {/* Duration timer */}
      <div className="font-mono text-5xl font-bold tracking-wider text-foreground">
        {formatTimer(duration)}
      </div>

      {/* Central record button */}
      <div className="flex items-center justify-center">
        {status === "idle" || status === "stopped" ? (
          <button
            onClick={onStart}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <IconComponent className="h-8 w-8" />
            {/* Outer ring */}
            <span className="absolute inset-0 rounded-full border-4 border-red-500/30" />
          </button>
        ) : status === "recording" ? (
          <button
            onClick={onStop}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-xl active:scale-95"
          >
            <Square className="h-7 w-7 fill-current" />
            {/* Pulsing ring */}
            <span className="absolute inset-0 animate-ping rounded-full border-4 border-red-500/40" style={{ animationDuration: "1.5s" }} />
            <span className="absolute inset-0 rounded-full border-4 border-red-500/30" />
          </button>
        ) : (
          /* Paused */
          <button
            onClick={onResume}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background text-primary shadow-lg transition-all duration-200 hover:bg-primary/10 hover:shadow-xl active:scale-95"
          >
            <Play className="h-8 w-8 fill-current ml-1" />
          </button>
        )}
      </div>

      {/* Control buttons row */}
      <div
        className={cn(
          "flex items-center gap-4 transition-all duration-300",
          status === "recording" || status === "paused"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        {status === "recording" ? (
          <Button
            variant="outline"
            size="lg"
            onClick={onPause}
            className="gap-2 rounded-full px-6"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        ) : status === "paused" ? (
          <Button
            variant="outline"
            size="lg"
            onClick={onResume}
            className="gap-2 rounded-full px-6"
          >
            <Play className="h-4 w-4" />
            Resume
          </Button>
        ) : null}

        <Button
          variant="destructive"
          size="lg"
          onClick={onStop}
          className="gap-2 rounded-full px-6"
        >
          <Square className="h-4 w-4" />
          Stop
        </Button>
      </div>
    </div>
  );
}
