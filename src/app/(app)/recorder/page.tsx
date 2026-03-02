"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Monitor, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenRecorder } from "@/components/recorder/screen-recorder";
import { AudioRecorder } from "@/components/recorder/audio-recorder";
import { useTranslation } from "@/lib/i18n";

type RecorderTab = "screen" | "audio";

function RecorderContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "screen" ? "screen" : "audio";
  const [activeTab, setActiveTab] = useState<RecorderTab>(initialTab);
  const t = useTranslation();

  // Sync tab with URL changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "screen" || tab === "audio") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {activeTab === "screen" ? t.screenRecorder.title : t.audioRecorder.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeTab === "screen" ? t.screenRecorder.subtitle : t.audioRecorder.subtitle}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-lg bg-muted p-1">
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
        </div>
      </div>

      {/* Recorder content */}
      <div className="mt-6">
        {activeTab === "screen" ? <ScreenRecorder /> : <AudioRecorder />}
      </div>
    </div>
  );
}

export default function RecorderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <RecorderContent />
    </Suspense>
  );
}
