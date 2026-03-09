"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { Copy, Check, List, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NoteFormat } from "@/types/note";

interface NoteViewerProps {
  content: string;
  formats: NoteFormat[];
}

interface TocItem {
  id: string;
  level: number;
  text: string;
}

export function renderInlineFormatting(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // Handle: **bold**, `code`, *italic*, ~~strikethrough~~, [links](url), __underline__
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)|(\*(.+?)\*)|(__(.+?)__)|(~~(.+?)~~)|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      // **bold** - more prominent
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `code`
      parts.push(
        <code
          key={match.index}
          className="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono text-foreground"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      // *italic*
      parts.push(
        <em key={match.index} className="italic text-foreground/80">
          {match[6]}
        </em>
      );
    } else if (match[7]) {
      // __underline__
      parts.push(
        <span key={match.index} className="underline decoration-primary/40 underline-offset-2">
          {match[8]}
        </span>
      );
    } else if (match[9]) {
      // ~~strikethrough~~
      parts.push(
        <span key={match.index} className="line-through text-muted-foreground">
          {match[10]}
        </span>
      );
    } else if (match[11]) {
      // [link](url)
      parts.push(
        <a key={match.index} href={match[12]} target="_blank" rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80">
          {match[11]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function NoteViewer({ content, formats }: NoteViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [];
    const lines = content.split("\n");
    let counter = 0;
    lines.forEach((line) => {
      const trimmed = line.trim();
      let level = 0;
      let text = "";
      if (trimmed.startsWith("#### ")) { level = 4; text = trimmed.slice(5); }
      else if (trimmed.startsWith("### ")) { level = 3; text = trimmed.slice(4); }
      else if (trimmed.startsWith("## ")) { level = 2; text = trimmed.slice(3); }
      else if (trimmed.startsWith("# ")) { level = 1; text = trimmed.slice(2); }
      if (level > 0 && text) {
        items.push({ id: `heading-${counter}`, level, text });
        counter++;
      }
    });
    return items;
  }, [content]);

  const scrollToHeading = (id: string) => {
    const el = contentRef.current?.querySelector(`[data-heading-id="${id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: { text: string; indent: number }[] = [];
    let orderedItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let headingCounter = 0;
    let blockquoteLines: string[] = [];

    const flushBlockquote = () => {
      if (blockquoteLines.length > 0) {
        elements.push(
          <blockquote key={`bq-${elements.length}`} className="my-5 border-l-4 border-primary/50 bg-primary/5 dark:bg-primary/10 px-5 py-3.5 rounded-r-xl">
            {blockquoteLines.map((line, i) => (
              <p key={i} className="text-sm text-foreground/90 leading-relaxed italic">
                {renderInlineFormatting(line)}
              </p>
            ))}
          </blockquote>
        );
        blockquoteLines = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-2 my-4 ml-1">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed"
                style={{ paddingLeft: `${item.indent * 16}px` }}>
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                <span>{renderInlineFormatting(item.text)}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushOrderedList = () => {
      if (orderedItems.length > 0) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-2 my-4 ml-1 counter-reset-list">
            {orderedItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{renderInlineFormatting(item)}</span>
              </li>
            ))}
          </ol>
        );
        orderedItems = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(1);
        elements.push(
          <div key={`table-${elements.length}`} className="my-6 overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border bg-primary/5 dark:bg-primary/10">
                  {headerRow.map((cell, i) => (
                    <th key={i} className="px-4 py-3 text-left font-semibold text-primary text-xs uppercase tracking-wider">
                      {renderInlineFormatting(cell.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, i) => (
                  <tr key={i} className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2.5 text-foreground/80">
                        {renderInlineFormatting(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Horizontal rules
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        flushList();
        flushOrderedList();
        flushBlockquote();
        elements.push(
          <hr key={`hr-${i}`} className="my-8 border-border" />
        );
        continue;
      }

      // Tables
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        flushList();
        flushOrderedList();
        flushBlockquote();
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
          inTable = true;
          continue;
        }
        inTable = true;
        const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Empty lines
      if (trimmed === "") {
        flushList();
        flushOrderedList();
        flushBlockquote();
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
      if (headingMatch) {
        flushList();
        flushOrderedList();
        flushBlockquote();
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const headingId = `heading-${headingCounter}`;
        headingCounter++;

        if (level === 1) {
          elements.push(
            <h1 key={`h-${i}`} className="text-2xl font-bold text-foreground mt-8 mb-4 pb-2 border-b-2 border-primary/20" data-heading-id={headingId}>
              {renderInlineFormatting(text)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2 key={`h-${i}`} className="text-xl font-bold text-primary mt-8 mb-3 flex items-center gap-2" data-heading-id={headingId}>
              <span className="h-5 w-1 bg-primary rounded-full" />
              {renderInlineFormatting(text)}
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={`h-${i}`} className="text-base font-semibold text-foreground mt-5 mb-2" data-heading-id={headingId}>
              {renderInlineFormatting(text)}
            </h3>
          );
        } else {
          elements.push(
            <h4 key={`h-${i}`} className="text-sm font-semibold text-foreground/80 mt-4 mb-1.5 uppercase tracking-wide" data-heading-id={headingId}>
              {renderInlineFormatting(text)}
            </h4>
          );
        }
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        flushList();
        flushOrderedList();
        blockquoteLines.push(trimmed.slice(2));
        continue;
      } else {
        flushBlockquote();
      }

      // Unordered list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushOrderedList();
        flushBlockquote();
        listItems.push({ text: trimmed.slice(2), indent: 0 });
        continue;
      }

      // Sub-list items (indented)
      if (/^\s+[-*]\s/.test(line)) {
        const indent = Math.floor((line.length - line.trimStart().length) / 2);
        const subItem = line.replace(/^\s+[-*]\s/, "");
        listItems.push({ text: subItem, indent: Math.min(indent, 3) });
        continue;
      }

      // Ordered list items
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (orderedMatch) {
        flushList();
        flushBlockquote();
        orderedItems.push(orderedMatch[2]);
        continue;
      }

      flushList();
      flushOrderedList();
      flushBlockquote();
      elements.push(
        <p key={`p-${i}`} className="text-sm text-foreground/85 leading-[1.75] my-2">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }

    flushList();
    flushOrderedList();
    flushBlockquote();
    flushTable();

    return elements;
  };

  return (
    <div className={cn("max-w-none relative")}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {formats.map((format) => (
              <span
                key={format}
                className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {format.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tocItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToc(!showToc)}
              className={cn("h-8 w-8 p-0", showToc && "bg-muted")}
              title="Table of Contents"
            >
              <List className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        {showToc && tocItems.length > 0 && (
          <nav className="hidden sm:block w-48 shrink-0 sticky top-0 self-start">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Contents
            </p>
            <div className="space-y-0.5">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    "flex items-center gap-1 w-full text-left text-xs rounded-md px-2 py-1",
                    "text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                    "truncate"
                  )}
                  style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                >
                  <ChevronRight className="h-3 w-3 shrink-0" />
                  <span className="truncate">{item.text}</span>
                </button>
              ))}
            </div>
          </nav>
        )}

        <div ref={contentRef} className="flex-1 min-w-0 note-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
