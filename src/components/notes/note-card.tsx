"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  FileText,
  Link2,
  Headphones,
  Image,
  File,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNotesStore } from "@/stores/notes-store";
import { useTranslation } from "@/lib/i18n";
import type { Note, UploadType } from "@/types/note";

const sourceConfig: Record<
  UploadType,
  { label: string; icon: React.ElementType; color: string }
> = {
  video: { label: "Video", icon: Video, color: "text-blue-500 bg-blue-500/10" },
  pdf: { label: "PDF", icon: FileText, color: "text-red-500 bg-red-500/10" },
  link: { label: "Link", icon: Link2, color: "text-emerald-500 bg-emerald-500/10" },
  audio: { label: "Audio", icon: Headphones, color: "text-amber-500 bg-amber-500/10" },
  image: { label: "Image", icon: Image, color: "text-violet-500 bg-violet-500/10" },
  document: { label: "Document", icon: File, color: "text-slate-500 bg-slate-500/10" },
};

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const t = useTranslation();
  const toggleFavorite = useNotesStore((s) => s.toggleFavorite);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const source = sourceConfig[note.sourceType];
  const SourceIcon = source.icon;

  // Strip markdown formatting for preview
  const plainContent = note.content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/- /g, "")
    .replace(/\n/g, " ")
    .trim();

  return (
    <>
      <Link
        href={`/notes/${note.id}`}
        className={cn(
          "group relative flex flex-col rounded-xl border border-border bg-card p-4",
          "transition-all duration-200",
          "hover:scale-[1.02] hover:shadow-lg hover:border-primary/30"
        )}
      >
        {/* Source badge & favorite */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
              source.color
            )}
          >
            <SourceIcon className="h-3 w-3" />
            {source.label}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(note.id);
            }}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            aria-label={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                note.isFavorite
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-1.5 line-clamp-2 leading-snug">
          {note.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {truncate(plainContent, 100)}
        </p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <div className="mt-auto pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)}
          </p>
        </div>

        {/* Delete button - appears on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="absolute bottom-3 right-3 p-1.5 rounded-md bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
          aria-label="Delete note"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </Link>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={`${t.noteDetail.delete} "${note.title}"?`}
        description={t.common.confirmDelete}
        confirmLabel={t.noteDetail.delete}
        cancelLabel={t.common.cancel}
        onConfirm={() => deleteNote(note.id)}
      />
    </>
  );
}
