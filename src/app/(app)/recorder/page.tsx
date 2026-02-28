"use client";

import { useState } from "react";
import { Monitor, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenRecorder } from "@/components/recorder/screen-recorder";
import { AudioRecorder } from "@/components/recorder/audio-recorder";
import { useTranslation } from "@/lib/i18n";

type RecorderTab = "screen" | "audio";

export default function RecorderPage() {
  const [activeTab, setActiveTab] = useState<RecorderTab>("audio");
  const t = useTranslation();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.audioRecorder.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.audioRecorder.subtitle}
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
            {t.nav.screenRecording}
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
            {t.nav.audioRecorder}
          </button>
        </div>
      </div>

      {/* Recorder content */}
      <div className="mt-6">
        {activeTab === "screen" ? <ScreenRecorder /> : <AudioRecorder />}
      </div>
    </div>
  );
}
