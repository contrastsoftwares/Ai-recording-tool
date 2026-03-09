"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Layers,
  ClipboardCheck,
  ScrollText,
  Video,
  Headphones,
  Link2,
  Image,
  File,
  Calendar,
  Tag,
  Download,
  Share2,
  Star,
  Trash2,
  Pencil,
  Check,
  X,
  Info,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn, formatDate, getLocaleCode } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TranscriptPanel } from "@/components/notes/transcript-panel";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/components/notes/rich-text-editor").then((m) => ({ default: m.RichTextEditor })),
  { ssr: false, loading: () => <div className="p-8 text-center text-muted-foreground">...</div> }
);

import { AiStatusIndicator } from "@/components/notes/ai-status-indicator";
import { ChatInterface } from "@/components/chat/chat-interface";
import { FlashcardDeck } from "@/components/flashcards/flashcard-deck";
import { TestView } from "@/components/test-generator/test-view";

import { useTranslation, useLanguage } from "@/lib/i18n";
import { useNotesStore } from "@/stores/notes-store";
import type { UploadType, NoteFormat } from "@/types/note";

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

// Only show transcript tab for audio/video sources
const mediaSourceTypes = new Set(["audio", "video"]);

type TabId = "notes" | "chat" | "flashcards" | "test" | "transcript";

export default function NoteWorkspacePage() {
  const t = useTranslation();
  const [lang] = useLanguage();
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "notes", label: t.noteDetail.notes, icon: FileText },
    { id: "chat", label: t.noteDetail.chat, icon: MessageSquare },
    { id: "flashcards", label: t.noteDetail.flashcards, icon: Layers },
    { id: "test", label: t.noteDetail.test, icon: ClipboardCheck },
    { id: "transcript", label: t.noteDetail.transcript, icon: ScrollText },
  ];
  const [activeTab, setActiveTab] = useState<TabId>("notes");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showNoteInfo, setShowNoteInfo] = useState(false);
  const updateNote = useNotesStore((s) => s.updateNote);
  const { toggleFavorite, deleteNote, accessNote } = useNotesStore();
  const notes = useNotesStore((s) => s.notes);

  const note = notes.find((n) => n.id === noteId);

  // Track note access for "recent notes" ordering
  useEffect(() => {
    if (noteId) {
      accessNote(noteId);
    }
  }, [noteId, accessNote]);

  // Scroll position preservation per tab
  const scrollPositions = useRef<Record<string, number>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = useCallback((newTab: TabId) => {
    // Save current scroll position
    if (contentRef.current) {
      scrollPositions.current[activeTab] = contentRef.current.scrollTop;
    }
    setActiveTab(newTab);
  }, [activeTab]);

  // Restore scroll position when tab changes
  useEffect(() => {
    if (contentRef.current) {
      const savedPosition = scrollPositions.current[activeTab] || 0;
      contentRef.current.scrollTop = savedPosition;
    }
  }, [activeTab]);

  const handleStartEditTitle = useCallback(() => {
    if (note) {
      setEditedTitle(note.title);
      setIsEditingTitle(true);
    }
  }, [note]);

  const handleSaveTitle = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const handleCancelEditTitle = useCallback(() => {
    setIsEditingTitle(false);
    setEditedTitle("");
  }, []);

  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = useCallback((format: "txt" | "md" | "html" | "pdf") => {
    if (!note) return;
    const safeTitle = note.title.replace(/[^a-z0-9\u4e00-\u9fff\uac00-\ud7af\u3040-\u309f\u30a0-\u30ff]/gi, "_");

    if (format === "txt") {
      // Plain text: strip markdown
      const plain = note.content
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/~~(.*?)~~/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      const blob = new Blob([`${note.title}\n${"=".repeat(note.title.length)}\n\n${plain}`], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, `${safeTitle}.txt`);
    } else if (format === "md") {
      // Markdown
      const blob = new Blob([`# ${note.title}\n\n${note.content}`], { type: "text/markdown;charset=utf-8" });
      downloadBlob(blob, `${safeTitle}.md`);
    } else if (format === "html") {
      // HTML with styling
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${note.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #1a1a1a; }
    h1 { border-bottom: 2px solid #e5e5e5; padding-bottom: 0.5rem; }
    h2 { color: #2563eb; margin-top: 2rem; }
    h3 { color: #4b5563; }
    ul, ol { padding-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
    blockquote { border-left: 4px solid #3b82f6; margin: 1rem 0; padding: 0.5rem 1rem; background: #eff6ff; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; }
    th { background: #f3f4f6; font-weight: 600; }
    code { background: #f3f4f6; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>${note.title}</h1>
  ${note.content}
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      downloadBlob(blob, `${safeTitle}.html`);
    } else if (format === "pdf") {
      // Open HTML in new window for browser Print > Save as PDF
      const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${note.title}</title>
<style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:800px;margin:0 auto;padding:2rem;line-height:1.6;color:#1a1a1a;}h1{border-bottom:2px solid #e5e5e5;padding-bottom:.5rem;}h2{color:#2563eb;margin-top:2rem;}h3{color:#4b5563;}ul,ol{padding-left:1.5rem;}li{margin-bottom:.25rem;}blockquote{border-left:4px solid #3b82f6;margin:1rem 0;padding:.5rem 1rem;background:#eff6ff;}table{border-collapse:collapse;width:100%;margin:1rem 0;}th,td{border:1px solid #d1d5db;padding:.5rem;text-align:left;}th{background:#f3f4f6;font-weight:600;}</style>
</head><body><h1>${note.title}</h1>${note.content}
<script>window.onload=function(){window.print();}</script></body></html>`;
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
    setShowExportMenu(false);
  }, [note]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  }, []);

  const handleDelete = useCallback(() => {
    deleteNote(noteId);
    router.push("/notes");
  }, [noteId, deleteNote, router]);

  // Handle chatbot note edits
  const handleChatEditNote = useCallback((action: "append" | "replace", content: string) => {
    if (!note) return;
    if (action === "append") {
      updateNote(noteId, { content: note.content + "\n\n" + content });
    } else {
      updateNote(noteId, { content });
    }
  }, [note, noteId, updateNote]);

  // Raw content for on-demand transcript generation
  const transcriptContent = note?.rawContent || note?.transcript || "";

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t.noteDetail.noteNotFound}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {t.noteDetail.noteNotFoundDesc}
        </p>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.noteDetail.backToDashboard}
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
              <div className="flex items-center gap-2">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                  onClick={() => toggleFavorite(noteId)}
                  title={note.isFavorite ? t.noteDetail.removeFromFavorites : t.noteDetail.addToFavorites}
                >
                  <Star className={cn("h-4 w-4", note.isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                </Button>
              </div>
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
              {formatDate(note.createdAt, lang)}
            </span>
            <span className="text-xs text-muted-foreground">{wordCount} {t.noteDetail.words}</span>
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
          {/* Note info hover */}
          <div
            className="relative"
            onMouseEnter={() => setShowNoteInfo(true)}
            onMouseLeave={() => setShowNoteInfo(false)}
          >
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
            {showNoteInfo && (
              <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-xl border border-border bg-card shadow-lg p-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.noteDetail.source}</label>
                  <div className="flex items-center gap-2">
                    <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", sourceColors[note.sourceType].split(" ")[1])}>
                      <SourceIcon className={cn("h-3 w-3", sourceColors[note.sourceType].split(" ")[0])} />
                    </div>
                    <span className="text-sm text-foreground capitalize">{note.sourceType}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.noteDetail.created}</label>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{new Date(note.createdAt).toLocaleDateString(getLocaleCode(lang), { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.noteDetail.stats}</label>
                  <p className="text-sm text-foreground">{wordCount} {t.noteDetail.words}</p>
                </div>
                {note.tags.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.noteDetail.tags}</label>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          <Tag className="h-2.5 w-2.5 mr-0.5" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.noteDetail.formats}</label>
                  <div className="flex flex-wrap gap-1">
                    {note.formats.map((format) => {
                      const formatLabels: Record<string, string> = {
                        "bullet-points": t.formatSelector.bulletPoints,
                        sentences: t.formatSelector.sentences,
                        cornell: t.formatSelector.cornellNotes,
                        outline: t.formatSelector.outline,
                        "key-concepts": t.formatSelector.keyConcepts,
                        summary: t.formatSelector.summary,
                        timeline: t.formatSelector.timeline,
                        "qa-format": t.formatSelector.qaFormat,
                      };
                      return (
                        <span key={format} className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                          {formatLabels[format] || format.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowExportMenu(!showExportMenu)} title={t.noteDetail.export}>
              <Download className="h-4 w-4 text-muted-foreground" />
            </Button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
                <button onClick={() => handleExport("txt")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.txt (Plain Text)</button>
                <button onClick={() => handleExport("md")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.md (Markdown)</button>
                <button onClick={() => handleExport("html")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.html (Web Page)</button>
                <button onClick={() => handleExport("pdf")} className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">.pdf (Print to PDF)</button>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleShare} title={t.noteDetail.share}>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(true)} title={t.noteDetail.delete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="default"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.noteDetail.chat}</span>
          </Button>
        </div>
      </div>

      {/* Main content area - no conversations sidebar */}
      <div className="flex flex-1 gap-0 lg:gap-4 overflow-hidden mt-4">
        {/* Center panel: Tabbed content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-muted p-1 shrink-0 mb-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              // Only show transcript tab for audio/video sources
              if (tab.id === "transcript" && !mediaSourceTypes.has(note.sourceType)) return null;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap",
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

          {/* Tab content - all rendered but hidden to preserve state/scroll */}
          <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-thin">
            <div className={activeTab === "notes" ? "" : "hidden"}>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <RichTextEditor
                  content={note.content}
                  onChange={(html) => updateNote(noteId, { content: html })}
                />
              </div>
            </div>

            {/* Chat tab (full-width, shares same memory as sidebar chat via localStorage) */}
            <div className={activeTab === "chat" ? "h-full" : "hidden"}>
              <div className="rounded-xl border border-border bg-card overflow-hidden h-[calc(100vh-16rem)]">
                <ChatInterface noteId={noteId} noteContent={note.content} onEditNote={handleChatEditNote} />
              </div>
            </div>

            <div className={activeTab === "flashcards" ? "" : "hidden"}>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <FlashcardDeck noteId={noteId} noteContent={note.rawContent || note.content} />
              </div>
            </div>

            <div className={activeTab === "test" ? "" : "hidden"}>
              <TestView noteId={noteId} noteContent={note.rawContent || note.content} />
            </div>

            {mediaSourceTypes.has(note.sourceType) && (
              <div className={activeTab === "transcript" ? "" : "hidden"}>
                <TranscriptPanel noteId={noteId} rawContent={transcriptContent} />
              </div>
            )}
          </div>
        </div>

        {/* Right panel: Persistent AI Chat sidebar */}
        {showChat && (
          <div className="hidden lg:flex flex-col w-96 shrink-0 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{t.noteDetail.chat}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowChat(false)}>
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatInterface noteId={noteId} noteContent={note.content} onEditNote={handleChatEditNote} />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={`${t.noteDetail.delete} "${note.title}"?`}
        description={t.common.confirmDelete}
        confirmLabel={t.noteDetail.delete}
        cancelLabel={t.common.cancel}
        onConfirm={handleDelete}
      />
    </div>
  );
}
