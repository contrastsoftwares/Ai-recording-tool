"use client";

import { FileText, Layers, ClipboardCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/stores/notes-store";
import { useTranslation } from "@/lib/i18n";

export function StatsOverview() {
  const t = useTranslation();
  const notes = useNotesStore((s) => s.notes);

  const totalNotes = notes.length;
  const favorites = notes.filter((n) => n.isFavorite).length;
  const withFlashcards = notes.filter((n) => n.formats?.includes("key-concepts") || n.formats?.includes("qa-format")).length;
  const withTests = notes.filter((n) => n.formats?.includes("qa-format")).length;

  const stats = [
    {
      label: t.dashboard.totalNotes,
      value: totalNotes,
      icon: FileText,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: t.dashboard.favorites,
      value: favorites,
      icon: Star,
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      label: t.dashboard.withFlashcards,
      value: withFlashcards,
      icon: Layers,
      color: "text-violet-500 bg-violet-500/10",
    },
    {
      label: t.dashboard.withTests,
      value: withTests,
      icon: ClipboardCheck,
      color: "text-emerald-500 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card p-4",
              "transition-colors"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                stat.color
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
