"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  Video,
  FileText,
  Link2,
  Headphones,
  Image,
  File,
  Star,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NoteCard } from "@/components/notes/note-card";
import { useNotesStore } from "@/stores/notes-store";
import type { UploadType } from "@/types/note";

const sourceFilters: { value: UploadType | "all"; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: FolderOpen },
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Headphones },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "link", label: "Link", icon: Link2 },
  { value: "image", label: "Image", icon: Image },
  { value: "document", label: "Document", icon: File },
];

type SortOption = "newest" | "oldest" | "alphabetical";

export default function NotesPage() {
  const { notes } = useNotesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<UploadType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [notes]);

  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Source filter
    if (sourceFilter !== "all") {
      result = result.filter((note) => note.sourceType === sourceFilter);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((note) => note.isFavorite);
    }

    // Tag filter
    if (selectedTags.size > 0) {
      result = result.filter((note) =>
        note.tags.some((tag) => selectedTags.has(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [notes, searchQuery, sourceFilter, showFavoritesOnly, selectedTags, sortBy]);

  const cycleSortBy = () => {
    setSortBy((prev) => {
      if (prev === "newest") return "oldest";
      if (prev === "oldest") return "alphabetical";
      return "newest";
    });
  };

  const sortLabel = sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "A-Z";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {notes.length} {notes.length === 1 ? "note" : "notes"} total
          </p>
        </div>
        <Link href="/notes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New</span>
          </Button>
        </Link>
      </div>

      {/* Search & filters */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Source type pills */}
          <div className="flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            {sourceFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setSourceFilter(filter.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    sourceFilter === filter.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Favorites toggle */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              showFavoritesOnly
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className={cn("h-3 w-3", showFavoritesOnly && "fill-current")} />
            Favorites
          </button>

          {/* Sort toggle */}
          <button
            type="button"
            onClick={cycleSortBy}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortLabel}
          </button>
        </div>

        {/* Tag chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
                  selectedTags.has(tag)
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes grid */}
      {filteredAndSortedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No notes found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            {searchQuery || sourceFilter !== "all" || showFavoritesOnly || selectedTags.size > 0
              ? "Try adjusting your filters or search query."
              : "Get started by uploading a lecture, recording, or document."}
          </p>
          {!searchQuery && sourceFilter === "all" && !showFavoritesOnly && selectedTags.size === 0 && (
            <Link href="/notes/new" className="mt-4">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Note
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
