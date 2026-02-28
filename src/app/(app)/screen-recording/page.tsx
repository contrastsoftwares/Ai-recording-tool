"use client";

import { ScreenRecorder } from "@/components/recorder/screen-recorder";
import { useTranslation } from "@/lib/i18n";

export default function ScreenRecordingPage() {
  const t = useTranslation();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.screenRecorder.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.screenRecorder.subtitle}
        </p>
      </div>

      {/* Screen Recorder */}
      <ScreenRecorder />
    </div>
  );
}
