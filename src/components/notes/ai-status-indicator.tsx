"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProcessingStore, type ProcessingTaskType } from "@/stores/processing-store";

const taskLabels: Record<ProcessingTaskType, string> = {
  transcribe: "Transcribing",
  notes: "Generating notes",
  flashcards: "Generating flashcards",
  test: "Generating test",
  chat: "Thinking",
};

export function AiStatusIndicator({ noteId }: { noteId: string }) {
  const { tasks } = useProcessingStore();
  const [completedTask, setCompletedTask] = useState<string | null>(null);

  const activeTasks = Array.from(tasks.values()).filter(
    (t) => t.noteId === noteId
  );

  useEffect(() => {
    if (activeTasks.length === 0 && completedTask) {
      const timer = setTimeout(() => setCompletedTask(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTasks.length, completedTask]);

  if (activeTasks.length === 0 && !completedTask) return null;

  if (completedTask && activeTasks.length === 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success animate-fade-in-up">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {completedTask}
      </div>
    );
  }

  const current = activeTasks[0];
  const label = current.label || taskLabels[current.type];

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-violet/10 px-3 py-1 text-xs font-medium text-violet">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      <span>{label}</span>
      {current.progress > 0 && current.progress < 100 && (
        <span className="text-violet/70">{Math.round(current.progress)}%</span>
      )}
      <span className="typing-cursor" />
    </div>
  );
}
