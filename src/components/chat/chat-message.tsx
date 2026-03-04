"use client";

import { Sparkles } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { renderInlineFormatting } from "@/components/notes/note-viewer";
import type { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

/** Clean LaTeX delimiters from text */
function cleanLatex(text: string): string {
  return text
    .replace(/\\\((.+?)\\\)/g, "$1")
    .replace(/\\\[(.+?)\\\]/g, "$1");
}

/**
 * Renders message content with markdown support:
 * - Headings (## text)
 * - Bold (**text**)
 * - Inline code (`code`)
 * - Numbered lists (1. item)
 * - Bullet lists (- item or * item)
 * - LaTeX notation stripped
 * - Proper paragraph spacing
 */
export function renderMessageContent(content: string): React.ReactNode {
  // Clean LaTeX delimiters
  const cleaned = cleanLatex(content);
  const lines = cleaned.split("\n");
  const elements: React.ReactNode[] = [];
  let bulletItems: string[] = [];
  let orderedItems: string[] = [];

  const flushBulletList = () => {
    if (bulletItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 ml-4 space-y-1">
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
        <ol key={`ol-${elements.length}`} className="my-2 ml-4 space-y-1">
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
      if (elements.length > 0) {
        elements.push(<div key={`br-${i}`} className="h-3" />);
      }
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      flushBulletList();
      flushOrderedList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const classes: Record<number, string> = {
        1: "text-base font-bold mt-3 mb-1",
        2: "text-sm font-bold mt-3 mb-1",
        3: "text-sm font-semibold mt-2 mb-1",
        4: "text-sm font-medium mt-2 mb-1",
      };
      elements.push(
        <p key={`h-${i}`} className={classes[level] || classes[2]}>
          {renderInlineFormatting(text)}
        </p>
      );
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
      <p key={`line-${i}`} className="text-sm leading-relaxed my-0.5">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  }

  flushBulletList();
  flushOrderedList();

  return elements;
}

export function ChatMessage({ message, isLast = false }: ChatMessageProps) {
  const [currentLang] = useLanguage();
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
          {formatDate(message.timestamp, currentLang)}
        </span>
      </div>
    </div>
  );
}
