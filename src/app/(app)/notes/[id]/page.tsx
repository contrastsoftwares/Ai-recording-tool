"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Layers,
  ClipboardCheck,
  Video,
  Headphones,
  Link2,
  Image,
  File,
  Calendar,
  Tag,
  RefreshCw,
  Download,
  Share2,
  MessagesSquare,
  Star,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteViewer } from "@/components/notes/note-viewer";
import { TranscriptPanel } from "@/components/notes/transcript-panel";
import { MediaPlayer } from "@/components/notes/media-player";
import { AiStatusIndicator } from "@/components/notes/ai-status-indicator";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FlashcardDeck } from "@/components/flashcards/flashcard-deck";
import { TestView } from "@/components/test-generator/test-view";
import { mockTranscriptSegments, mockConversations } from "@/lib/mock-data";
import { useNotesStore } from "@/stores/notes-store";
import type { UploadType } from "@/types/note";

const sourceIcons: Record<UploadType, React.ElementType> = {
  video: Video,
  audio: Headphones,
  pdf: FileText,
  link: Link2,
  image: Image,
  document: File,
};

const sourceColors: Record<UploadType, string> = {
  video: "text-blue-500 bg-blue-500/10",
  audio: "text-amber-500 bg-amber-500/10",
  pdf: "text-red-500 bg-red-500/10",
  link: "text-emerald-500 bg-emerald-500/10",
  image: "text-violet-500 bg-violet-500/10",
  document: "text-slate-500 bg-slate-500/10",
};

const tabs = [
  { id: "notes", label: "Notes", icon: FileText },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "test", label: "Test", icon: ClipboardCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function NoteWorkspacePage() {
  const params = useParams();
  const noteId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabId>("notes");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [currentTime, setCurrentTime] = useState(-1);
  const { toggleFavorite } = useNotesStore();
  const notes = useNotesStore((s) => s.notes);

  const note = notes.find((n) => n.id === noteId);
  const conversations = mockConversations.filter((c) => c.noteId === noteId);

  const handleStartEditTitle = useCallback(() => {
    if (note) {
      setEditedTitle(note.title);
      setIsEditingTitle(true);
    }
  }, [note]);

  const handleSaveTitle = useCallback(() => {
    // In a real app this would update the store
    setIsEditingTitle(false);
  }, []);

  const handleCancelEditTitle = useCallback(() => {
    setIsEditingTitle(false);
    setEditedTitle("");
  }, []);

  const handleTimestampClick = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Note not found
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-4">
          The note you are looking for does not exist or has been removed.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const SourceIcon = sourceIcons[note.sourceType];
  const wordCount = note.content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Top bar */}
      <div className="flex items-start gap-3 pb-4 border-b border-border shrink-0">
        <Link
          href="/notes"
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors mt-0.5"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="min-w-0 flex-1">
          {/* Editable title */}
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-1 flex-1">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") handleCancelEditTitle();
                  }}
                />
                <Button variant="ghost" size="sm" onClick={handleSaveTitle} className="h-8 w-8 p-0">
                  <Check className="h-4 w-4 text-success" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancelEditTitle} className="h-8 w-8 p-0">
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditTitle}
                className="group flex items-center gap-2 text-left"
              >
                <h1 className="text-lg font-semibold text-foreground truncate">
                  {note.title}
                </h1>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", sourceColors[note.sourceType])}>
              <SourceIcon className="h-3 w-3" />
              {note.sourceType.charAt(0).toUpperCase() + note.sourceType.slice(1)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(note.createdAt)}
            </span>
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <AiStatusIndicator noteId={noteId} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => toggleFavorite(noteId)}
            title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={cn("h-4 w-4", note.isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Share">
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Export">
            <Download className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-0 lg:gap-4 overflow-hidden mt-4">
        {/* Left panel: Conversations sidebar (desktop only) */}
        <div className="hidden lg:flex flex-col w-64 shrink-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Conversations
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6 px-2">
                  No conversations yet. Start chatting to ask questions about this note.
                </p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    className={cn(
                      "w-full flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 text-left",
                      "hover:bg-muted transition-colors"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground line-clamp-1">
                      {conv.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(conv.updatedAt)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="p-2 border-t border-border">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              New Conversation
            </Button>
          </div>
        </div>

        {/* Center panel: Tabbed content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-muted p-1 shrink-0 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {activeTab === "notes" && (
              <div className="space-y-6">
                {/* Media player for video/audio notes */}
                {(note.sourceType === "video" || note.sourceType === "audio") && (
                  <MediaPlayer
                    type={note.sourceType as "video" | "audio"}
                    title={note.title}
                    currentTime={currentTime}
                    onTimeUpdate={setCurrentTime}
                  />
                )}

                <div className="rounded-xl border border-border bg-card p-6">
                  <NoteViewer content={note.content} formats={note.formats} />
                </div>
                {(note.sourceType === "video" || note.sourceType === "audio") && (
                  <TranscriptPanel
                    segments={mockTranscriptSegments}
                    currentTime={currentTime}
                    onTimestampClick={handleTimestampClick}
                  />
                )}
              </div>
            )}

            {activeTab === "chat" && (
              <div className="rounded-xl border border-border bg-card overflow-hidden h-[calc(100vh-16rem)]">
                <ChatInterface noteId={noteId} noteContent={note.content} />
              </div>
            )}

            {activeTab === "flashcards" && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <FlashcardDeck noteId={noteId} noteContent={note.content} />
              </div>
            )}

            {activeTab === "test" && (
              <TestView noteId={noteId} noteContent={note.content} />
            )}
          </div>
        </div>

        {/* Right panel: Note info sidebar (desktop only) */}
        <div className="hidden lg:flex flex-col w-80 shrink-0 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">
              Note Info
            </span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-5">
              {/* Source type */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Source
                </label>
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", sourceColors[note.sourceType].split(" ")[1])}>
                    <SourceIcon className={cn("h-4 w-4", sourceColors[note.sourceType].split(" ")[0])} />
                  </div>
                  <span className="text-sm text-foreground capitalize">
                    {note.sourceType}
                  </span>
                </div>
                {note.sourceUrl && (
                  <a
                    href={note.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block"
                  >
                    {note.sourceUrl}
                  </a>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Word count */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Stats
                </label>
                <p className="text-sm text-foreground">{wordCount} words</p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Formats used */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Formats
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {note.formats.map((format) => (
                    <span
                      key={format}
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {format
                        .replace("-", " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </label>
                <div className="space-y-1.5">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Notes
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-sm"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
