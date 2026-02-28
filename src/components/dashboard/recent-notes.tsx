"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useNotesStore } from "@/stores/notes-store";
import { NoteCard } from "@/components/notes/note-card";
import { useTranslation } from "@/lib/i18n";

export function RecentNotes() {
  const t = useTranslation();
  const notes = useNotesStore((s) => s.notes);
  const recentNotes = useMemo(
    () =>
      [...notes]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6),
    [notes]
  );

  if (recentNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {t.dashboard.noNotesYet}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {t.dashboard.noNotesDesc}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{t.dashboard.recentNotes}</h2>
        <Link
          href="/notes"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t.dashboard.viewAll}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentNotes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
