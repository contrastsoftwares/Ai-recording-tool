"use client";

import { cn } from "@/lib/utils";
import type { NoteFormat } from "@/types/note";

interface NoteViewerProps {
  content: string;
  formats: NoteFormat[];
}

export function NoteViewer({ content, formats }: NoteViewerProps) {
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let orderedItems: string[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-1.5 my-3 ml-4">
            {listItems.map((item, i) => (
              <li
                key={i}
                className="text-sm text-foreground leading-relaxed list-disc pl-1"
              >
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
              <li
                key={i}
                className="text-sm text-foreground leading-relaxed list-decimal pl-1"
              >
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

      // Table rows
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        // Check if it's a separator row (|---|---|)
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
          inTable = true;
          continue;
        }
        inTable = true;
        const cells = trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Empty line
      if (trimmed === "") {
        flushList();
        flushOrderedList();
        continue;
      }

      // Headings
      if (trimmed.startsWith("#### ")) {
        flushList();
        flushOrderedList();
        elements.push(
          <h4
            key={`h4-${i}`}
            className="text-sm font-semibold text-foreground mt-5 mb-2"
          >
            {trimmed.slice(5)}
          </h4>
        );
        continue;
      }
      if (trimmed.startsWith("### ")) {
        flushList();
        flushOrderedList();
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-base font-semibold text-foreground mt-6 mb-2"
          >
            {trimmed.slice(4)}
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith("## ")) {
        flushList();
        flushOrderedList();
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xl font-bold text-foreground mt-6 mb-3"
          >
            {trimmed.slice(3)}
          </h2>
        );
        continue;
      }
      if (trimmed.startsWith("# ")) {
        flushList();
        flushOrderedList();
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-2xl font-bold text-foreground mt-6 mb-3"
          >
            {trimmed.slice(2)}
          </h1>
        );
        continue;
      }

      // Unordered list items
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushOrderedList();
        listItems.push(trimmed.slice(2));
        continue;
      }

      // Ordered list items
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
      if (orderedMatch) {
        flushList();
        orderedItems.push(orderedMatch[2]);
        continue;
      }

      // Regular paragraph
      flushList();
      flushOrderedList();
      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm text-foreground/90 leading-relaxed my-2"
        >
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }

    flushList();
    flushOrderedList();
    flushTable();

    return elements;
  };

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Handle bold text
    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={cn("max-w-none")}>
      {/* Format badges */}
      {formats.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 pb-4 border-b border-border">
          {formats.map((format) => (
            <span
              key={format}
              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {format.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          ))}
        </div>
      )}

      {/* Rendered content */}
      <div>{renderContent()}</div>
    </div>
  );
}
