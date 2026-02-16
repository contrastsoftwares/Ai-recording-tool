"use client";

import { useState } from "react";
import { Monitor, Mic, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScreenRecorder } from "@/components/recorder/screen-recorder";
import { AudioRecorder } from "@/components/recorder/audio-recorder";
import Link from "next/link";

type RecorderTab = "screen" | "audio";

const mockRecordings = [
  {
    id: "1",
    type: "screen" as const,
    title: "Lecture Recording - Feb 14",
    duration: "45:23",
    date: "Feb 14, 2026",
  },
  {
    id: "2",
    type: "audio" as const,
    title: "Study Group Discussion",
    duration: "32:10",
    date: "Feb 13, 2026",
  },
  {
    id: "3",
    type: "screen" as const,
    title: "Lab Session - Chemistry 101",
    duration: "1:12:45",
    date: "Feb 12, 2026",
  },
];

export default function RecorderPage() {
  const [activeTab, setActiveTab] = useState<RecorderTab>("screen");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recorder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Record your screen or audio and generate AI-powered notes.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-lg bg-muted p-1">
          <button
            onClick={() => setActiveTab("screen")}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              activeTab === "screen"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Monitor className="h-4 w-4" />
            Screen Recording
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              activeTab === "audio"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Mic className="h-4 w-4" />
            Audio Recording
          </button>
        </div>
      </div>

      {/* Recorder content */}
      <div className="mt-6">
        {activeTab === "screen" ? <ScreenRecorder /> : <AudioRecorder />}
      </div>

      {/* Recent Recordings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Recordings
        </h2>
        <div className="grid gap-3">
          {mockRecordings.map((recording) => (
            <Card key={recording.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {/* Type icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    recording.type === "screen"
                      ? "bg-primary/10 text-primary"
                      : "bg-violet/10 text-violet"
                  )}
                >
                  {recording.type === "screen" ? (
                    <Monitor className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </div>

                {/* Recording info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {recording.title}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recording.duration}
                    </span>
                    <span>{recording.date}</span>
                  </div>
                </div>

                {/* Generate Notes button */}
                <Button asChild variant="outline" size="sm" className="shrink-0 gap-1.5">
                  <Link href="/dashboard">
                    <FileText className="h-3.5 w-3.5" />
                    Generate Notes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
