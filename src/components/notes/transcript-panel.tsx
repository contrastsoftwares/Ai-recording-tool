"use client";

import { useState, useRef, useCallback } from "react";
import { Search, PanelRightClose, PanelRightOpen, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TranscriptSegment } from "@/types/note";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  currentTime?: number;
  onTimestampClick?: (time: number) => void;
}

const speakerColors = [
  "text-blue-600 dark:text-blue-400",
  "text-violet-600 dark:text-violet-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-amber-600 dark:text-amber-400",
  "text-rose-600 dark:text-rose-400",
];

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TranscriptPanel({ segments, currentTime = -1, onTimestampClick }: TranscriptPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const speakerColorMap = new Map<string, string>();
  let colorIdx = 0;
  segments.forEach((seg) => {
    if (seg.speaker && !speakerColorMap.has(seg.speaker)) {
      speakerColorMap.set(seg.speaker, speakerColors[colorIdx % speakerColors.length]);
      colorIdx++;
    }
  });

  const filteredSegments = segments.filter((segment) =>
    segment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const isActive = (segment: TranscriptSegment) =>
    currentTime >= segment.start && currentTime < segment.end;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
          "text-muted-foreground hover:text-foreground hover:bg-muted",
          "transition-colors mb-2"
        )}
      >
        {isOpen ? (
          <>
            <PanelRightClose className="h-4 w-4" />
            Hide Transcript
          </>
        ) : (
          <>
            <PanelRightOpen className="h-4 w-4" />
            Show Transcript
          </>
        )}
      </button>

      {isOpen && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transcript..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div ref={scrollRef} className="p-3 space-y-1">
              {filteredSegments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {searchQuery ? "No matching segments found" : "No transcript available"}
                </p>
              ) : (
                filteredSegments.map((segment, index) => {
                  const active = isActive(segment);
                  const isBookmarked = bookmarks.has(index);
                  const speakerColor = segment.speaker
                    ? speakerColorMap.get(segment.speaker)
                    : undefined;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3 rounded-lg px-3 py-2 transition-all cursor-pointer group",
                        active
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "hover:bg-muted/50 border-l-2 border-transparent",
                        isBookmarked && !active && "bg-amber-500/5 border-l-amber-400/50"
                      )}
                      onClick={() => onTimestampClick?.(segment.start)}
                    >
                      <span
                        className={cn(
                          "shrink-0 inline-flex items-center rounded-md px-1.5 py-0.5",
                          "text-xs font-mono h-fit mt-0.5 transition-colors",
                          active
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}
                      >
                        {formatTimestamp(segment.start)}
                      </span>

                      <p className="text-sm text-foreground/90 leading-relaxed flex-1">
                        {segment.speaker && (
                          <span className={cn("font-medium mr-1", speakerColor)}>
                            {segment.speaker}:
                          </span>
                        )}
                        {segment.text}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(index, e)}
                        className={cn(
                          "shrink-0 p-1 rounded-md transition-all self-start",
                          isBookmarked
                            ? "text-amber-500 opacity-100"
                            : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-amber-500"
                        )}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark this segment"}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-3.5 w-3.5 fill-current" />
                        ) : (
                          <Bookmark className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
