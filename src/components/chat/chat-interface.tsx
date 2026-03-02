"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { useTranslation } from "@/lib/i18n";
import { aiService } from "@/lib/ai-service";
import type { Message } from "@/types/chat";

interface ChatInterfaceProps {
  noteId: string;
  noteContent?: string;
}

export function ChatInterface({ noteId, noteContent }: ChatInterfaceProps) {
  const t = useTranslation();
  const suggestedQuestions = [
    t.chat.suggestSummarize,
    t.chat.suggestExplain,
    t.chat.suggestExamQuestions,
    t.chat.suggestStudyPlan,
  ];
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(`chat-messages-${noteId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem(`chat-messages-${noteId}`, JSON.stringify(messages));
  }, [messages, noteId]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await aiService.chat(noteContent || "", allMessages);

        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch {
        const errorMessage: Message = {
          id: `msg-${Date.now()}-err`,
          role: "assistant",
          content: t.chat.error,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, noteContent, t]
  );

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex h-full flex-col items-center justify-center px-4 py-12">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {t.chat.welcome}
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              {t.chat.welcomeSub}
            </p>

            {/* Suggested questions */}
            <div className="flex max-w-lg flex-wrap justify-center gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestedQuestion(question)}
                  className={cn(
                    "rounded-full border border-border bg-background px-4 py-2",
                    "text-sm text-muted-foreground",
                    "transition-colors hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages list */
          <div className="space-y-4 px-4 py-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">{t.chat.thinking}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSubmit={handleSend} disabled={isLoading} />
    </div>
  );
}
