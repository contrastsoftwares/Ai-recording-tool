"use client";

import { useState } from "react";
import { Search, PanelRightClose, PanelRightOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TranscriptSegment } from "@/types/note";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function TranscriptPanel({ segments }: TranscriptPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSegments = segments.filter((segment) =>
    segment.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Toggle button */}
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
          {/* Search */}
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

          {/* Segments */}
          <ScrollArea className="h-[400px]">
            <div className="p-3 space-y-1">
              {filteredSegments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {searchQuery ? "No matching segments found" : "No transcript available"}
                </p>
              ) : (
                filteredSegments.map((segment, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3 rounded-lg px-3 py-2",
                      "hover:bg-muted/50 transition-colors cursor-pointer group"
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center rounded-md px-1.5 py-0.5",
                        "bg-muted text-xs font-mono text-muted-foreground",
                        "group-hover:bg-primary/10 group-hover:text-primary",
                        "transition-colors h-fit mt-0.5"
                      )}
                    >
                      {formatTimestamp(segment.start)}
                    </span>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {segment.speaker && (
                        <span className="font-medium text-foreground mr-1">
                          {segment.speaker}:
                        </span>
                      )}
                      {segment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
