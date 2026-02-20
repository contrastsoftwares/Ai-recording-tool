"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { renderInlineFormatting } from "@/components/notes/note-viewer";
import type { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

/**
 * Renders message content with basic markdown support:
 * - Bold (**text**)
 * - Inline code (`code`)
 * - Numbered lists (1. item)
 * - Bullet lists (- item or * item)
 * - Line breaks preserved
 */
function renderMessageContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let bulletItems: string[] = [];
  let orderedItems: string[] = [];

  const flushBulletList = () => {
    if (bulletItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-1.5 ml-4 space-y-0.5">
          {bulletItems.map((item, i) => (
            <li key={i} className="list-disc pl-1 text-sm leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      bulletItems = [];
    }
  };

  const flushOrderedList = () => {
    if (orderedItems.length > 0) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="my-1.5 ml-4 space-y-0.5">
          {orderedItems.map((item, i) => (
            <li key={i} className="list-decimal pl-1 text-sm leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ol>
      );
      orderedItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line: flush lists and add spacing
    if (trimmed === "") {
      flushBulletList();
      flushOrderedList();
      // Add a small break for paragraph separation
      if (elements.length > 0) {
        elements.push(<div key={`br-${i}`} className="h-2" />);
      }
      continue;
    }

    // Bullet list items (- or *)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushOrderedList();
      bulletItems.push(trimmed.slice(2));
      continue;
    }

    // Ordered list items (1. 2. etc.)
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (orderedMatch) {
      flushBulletList();
      orderedItems.push(orderedMatch[2]);
      continue;
    }

    // Regular text line
    flushBulletList();
    flushOrderedList();
    elements.push(
      <span key={`line-${i}`} className="block text-sm leading-relaxed">
        {renderInlineFormatting(trimmed)}
      </span>
    );
  }

  // Flush any remaining lists
  flushBulletList();
  flushOrderedList();

  return elements;
}

export function ChatMessage({ message, isLast = false }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AI avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn("flex max-w-[75%] flex-col gap-1", isUser && "items-end")}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-muted text-foreground",
            isLast && !isUser && "typing-cursor"
          )}
        >
          {isUser
            ? message.content.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < message.content.split("\n").length - 1 && <br />}
                </span>
              ))
            : renderMessageContent(message.content)}
        </div>

        {/* Timestamp */}
        <span className="px-1 text-[11px] text-muted-foreground">
          {formatDate(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
