"use client";

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import {
  SendHorizonal,
  Layers,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Paperclip,
  X,
  ImageIcon,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

interface ChatInputProps {
  onSubmit: (message: string, files?: File[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const t = useTranslation();
  const quickActions = [
    { label: t.chat.generateFlashcards, icon: Layers },
    { label: t.chat.createPracticeTest, icon: ClipboardCheck },
    { label: t.chat.summarize, icon: FileText },
    { label: t.chat.explainFurther, icon: HelpCircle },
  ];
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    onSubmit(trimmed || "Please analyze the attached file(s).", attachedFiles.length > 0 ? attachedFiles : undefined);
    setInput("");
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, attachedFiles, onSubmit]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const handleQuickAction = (label: string) => {
    onSubmit(label);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files].slice(0, 5));
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    return File;
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

      {/* Attached files preview */}
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <div key={`${file.name}-${index}`} className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2 py-1">
                <FileIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-foreground truncate max-w-[120px]">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* File upload button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx,.md"
          multiple
          onChange={handleFileSelect}
        />

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={t.chat.askPlaceholder}
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
          disabled={(!input.trim() && attachedFiles.length === 0) || disabled}
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
