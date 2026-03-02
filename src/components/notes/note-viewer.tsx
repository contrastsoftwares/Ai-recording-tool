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
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)|(\*(.+?)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <strong key={match.index} className="font-bold text-foreground bg-primary/5 px-0.5 rounded">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground"
        >
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      parts.push(
        <em key={match.index} className="italic">
          {match[6]}
        </em>
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
    let listItems: string[] = [];
    let orderedItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let headingCounter = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-1.5 my-3 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-sm text-foreground leading-relaxed list-disc pl-1">
                {renderInlineFormatting(item)}
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
          <ol key={`ol-${elements.length}`} className="space-y-1.5 my-3 ml-4">
            {orderedItems.map((item, i) => (
              <li key={i} className="text-sm text-foreground leading-relaxed list-decimal pl-1">
                {renderInlineFormatting(item)}
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
          <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {headerRow.map((cell, i) => (
                    <th key={i} className="px-4 py-2 text-left font-medium text-foreground">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 text-muted-foreground">
                        {cell.trim()}
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

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
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

      if (trimmed === "") {
        flushList();
        flushOrderedList();
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
      if (headingMatch) {
        flushList();
        flushOrderedList();
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const headingId = `heading-${headingCounter}`;
        headingCounter++;
        const classes: Record<number, string> = {
          1: "text-2xl font-bold text-foreground mt-6 mb-3",
          2: "text-xl font-bold text-foreground mt-6 mb-3",
          3: "text-base font-semibold text-foreground mt-6 mb-2",
          4: "text-sm font-semibold text-foreground mt-5 mb-2",
        };
        const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
        elements.push(
          <Tag key={`h-${i}`} className={classes[level]} data-heading-id={headingId}>
            {text}
          </Tag>
        );
        continue;
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        flushList();
        flushOrderedList();
        const quoteText = trimmed.slice(2);
        elements.push(
          <blockquote key={`bq-${i}`} className="my-3 border-l-4 border-primary/40 bg-primary/5 px-4 py-2.5 rounded-r-lg">
            <p className="text-sm text-foreground/90 leading-relaxed italic">
              {renderInlineFormatting(quoteText)}
            </p>
          </blockquote>
        );
        continue;
      }

      // Unordered list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushOrderedList();
        listItems.push(trimmed.slice(2));
        continue;
      }

      // Sub-list items
      if (/^\s+[-*]\s/.test(line)) {
        const subItem = line.replace(/^\s+[-*]\s/, "");
        listItems.push(subItem);
        continue;
      }

      // Ordered list items
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (orderedMatch) {
        flushList();
        orderedItems.push(orderedMatch[2]);
        continue;
      }

      flushList();
      flushOrderedList();
      elements.push(
        <p key={`p-${i}`} className="text-sm text-foreground/90 leading-relaxed my-2">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }

    flushList();
    flushOrderedList();
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

        <div ref={contentRef} className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
