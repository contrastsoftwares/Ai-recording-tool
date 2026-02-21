"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import {
  SendHorizonal,
  Layers,
  ClipboardCheck,
  FileText,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

const quickActions = [
  { label: "Generate Flashcards", icon: Layers },
  { label: "Create Practice Test", icon: ClipboardCheck },
  { label: "Summarize", icon: FileText },
  { label: "Explain Further", icon: HelpCircle },
];

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-expand textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const handleQuickAction = (label: string) => {
    onSubmit(label);
  };

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Quick action pills */}
      <div className="mb-3 flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.label)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5",
              "text-xs font-medium text-muted-foreground",
              "transition-colors hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <action.icon className="h-3.5 w-3.5" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your notes..."
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-border bg-muted/50 px-4 py-2.5",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "scrollbar-thin"
          )}
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
