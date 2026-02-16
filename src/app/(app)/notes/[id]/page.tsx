"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteViewer } from "@/components/notes/note-viewer";
import { TranscriptPanel } from "@/components/notes/transcript-panel";
import { mockNotes, mockTranscriptSegments, mockConversations } from "@/lib/mock-data";
import type { UploadType } from "@/types/note";

const sourceIcons: Record<UploadType, React.ElementType> = {
  video: Video,
  audio: Headphones,
  pdf: FileText,
  link: Link2,
  image: Image,
  document: File,
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

  const note = mockNotes.find((n) => n.id === noteId);
  const conversations = mockConversations.filter((c) => c.noteId === noteId);

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

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 pb-4 border-b border-border shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {note.title}
          </h1>
          <p className="text-xs text-muted-foreground">
            {formatDate(note.createdAt)}
          </p>
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
                <div className="rounded-xl border border-border bg-card p-6">
                  <NoteViewer content={note.content} formats={note.formats} />
                </div>
                {(note.sourceType === "video" || note.sourceType === "audio") && (
                  <TranscriptPanel segments={mockTranscriptSegments} />
                )}
              </div>
            )}

            {activeTab === "chat" && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                  <MessageSquare className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Chat Interface
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Ask questions about your notes, get explanations, and explore
                  topics with AI. This feature will be built separately.
                </p>
              </div>
            )}

            {activeTab === "flashcards" && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                  <Layers className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Flashcards
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  AI-generated flashcards for active recall practice. Review and
                  master the key concepts from your notes. This feature will be built separately.
                </p>
              </div>
            )}

            {activeTab === "test" && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 px-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                  <ClipboardCheck className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Practice Test
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Auto-generated practice tests to evaluate your understanding.
                  Multiple choice, true/false, and short answer questions. This feature will be built separately.
                </p>
              </div>
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <SourceIcon className="h-4 w-4 text-muted-foreground" />
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
