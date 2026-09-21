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
      color: "text-primary bg-primary/10",
      bar: "bg-primary",
    },
    {
      label: t.dashboard.favorites,
      value: favorites,
      icon: Star,
      color: "text-warning bg-warning/10",
      bar: "bg-warning",
    },
    {
      label: t.dashboard.withFlashcards,
      value: withFlashcards,
      icon: Layers,
      color: "text-foreground bg-foreground/10",
      bar: "bg-foreground/50",
    },
    {
      label: t.dashboard.withTests,
      value: withTests,
      icon: ClipboardCheck,
      color: "text-success bg-success/10",
      bar: "bg-success",
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
              "relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-4",
              "transition-colors hover:border-primary/25"
            )}
          >
            {/* Colored left accent — differentiates each stat */}
            <span className={cn("absolute left-0 top-0 h-full w-1", stat.bar)} />
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
