"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ScrollText, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/lib/i18n";

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface TranscriptPanelProps {
  noteId: string;
  rawContent: string;
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function parseContentIntoSegments(content: string): TranscriptSegment[] {
  if (!content) return [];

  // Try to parse as JSON first (real Whisper transcript segments)
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].start !== undefined) {
      return parsed;
    }
  } catch {
    // Not JSON, fall through to text parsing
  }

  // Split content into sentences and distribute timestamps based on word count
  // Average speaking rate: ~150 words per minute = 2.5 words/sec
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  let currentTime = 0;
  return sentences.map((text) => {
    const trimmedText = text.trim();
    const wordCount = trimmedText.split(/\s+/).length;
    const estimatedDuration = Math.max(2, Math.min(15, Math.round(wordCount / 2.5)));
    const segment = {
      start: currentTime,
      end: currentTime + estimatedDuration,
      text: trimmedText,
    };
    currentTime += estimatedDuration;
    return segment;
  });
}

export function TranscriptPanel({ noteId, rawContent }: TranscriptPanelProps) {
  const t = useTranslation();
  const [segments, setSegments] = useState<TranscriptSegment[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(`transcript-${noteId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Persist segments to localStorage
  useEffect(() => {
    if (segments.length > 0) {
      localStorage.setItem(`transcript-${noteId}`, JSON.stringify(segments));
    }
  }, [segments, noteId]);

  const handleGenerate = useCallback(() => {
    if (!rawContent) {
      setError(t.transcript.noContent);
      return;
    }
    setIsGenerating(true);
    setError(null);

    // Parse the raw content into transcript segments
    setTimeout(() => {
      try {
        const parsed = parseContentIntoSegments(rawContent);
        setSegments(parsed);
      } catch {
        setError(t.transcript.failed);
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  }, [rawContent, t]);

  const filteredSegments = segments.filter((segment) =>
    segment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Empty state: show generate button
  if (segments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          {isGenerating ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium text-foreground">{t.transcript.generating}</p>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
                <ScrollText className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {t.transcript.title}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                {t.transcript.generateDesc}
              </p>
              {error && (
                <div className="flex items-center gap-2 mb-4 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <Button onClick={handleGenerate} className="gap-2">
                <ScrollText className="h-4 w-4" />
                {t.transcript.generate}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.transcript.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-3 space-y-1">
          {filteredSegments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {searchQuery ? t.transcript.noMatching : t.transcript.noTranscript}
            </p>
          ) : (
            filteredSegments.map((segment, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted/50 border-l-2 border-transparent"
              >
                <span
                  className={cn(
                    "shrink-0 inline-flex items-center rounded-md px-1.5 py-0.5",
                    "text-xs font-mono h-fit mt-0.5",
                    "bg-muted text-muted-foreground"
                  )}
                >
                  {formatTimestamp(segment.start)}
                </span>
                <p className="text-sm text-foreground/90 leading-relaxed flex-1">
                  {segment.text}
                </p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
