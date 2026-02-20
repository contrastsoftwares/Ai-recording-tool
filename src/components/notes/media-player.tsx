"use client";

import { useState, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";

interface MediaPlayerProps {
  type: "video" | "audio";
  title: string;
  currentTime?: number;
  duration?: number;
  onTimeUpdate?: (time: number) => void;
}

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function MediaPlayer({
  type,
  title,
  currentTime = 0,
  duration = 150,
  onTimeUpdate,
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      onTimeUpdate?.(newTime);
    },
    [onTimeUpdate]
  );

  const handleSkip = useCallback(
    (seconds: number) => {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      onTimeUpdate?.(newTime);
    },
    [currentTime, duration, onTimeUpdate]
  );

  const cycleSpeed = () => {
    const currentIdx = speeds.indexOf(playbackSpeed);
    const nextIdx = (currentIdx + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  // Waveform bars for audio mode
  const waveformBars = Array.from({ length: 60 }, (_, i) => {
    const barProgress = (i / 60) * 100;
    const isActive = barProgress <= progress;
    const height = Math.random() * 24 + 8;
    return { height, isActive };
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {type === "video" ? (
        /* Video player area */
        <div className="relative bg-black aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
            <p className="text-white/60 text-sm">{title}</p>
          </div>
        </div>
      ) : (
        /* Audio waveform visualization */
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-end justify-center gap-[2px] h-12">
            {waveformBars.map((bar, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-150",
                  bar.isActive
                    ? "bg-primary"
                    : "bg-muted-foreground/20"
                )}
                style={{ height: `${bar.height}px` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 py-3 space-y-2">
        {/* Seek bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono w-10 text-right">
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="seek-bar flex-1"
          />
          <span className="text-xs text-muted-foreground font-mono w-10">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleSkip(-10)}
              title="Back 10s"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-10 w-10 rounded-full p-0"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleSkip(10)}
              title="Forward 10s"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <button
            type="button"
            onClick={cycleSpeed}
            className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
}
