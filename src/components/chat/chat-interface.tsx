"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockConversations } from "@/lib/mock-data";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import type { Message } from "@/types/chat";

interface ChatInterfaceProps {
  noteId: string;
}

const suggestedQuestions = [
  "Summarize the key points from this note",
  "Explain the most important concept",
  "What are common exam questions on this topic?",
  "Create a study plan for this material",
];

export function ChatInterface({ noteId }: ChatInterfaceProps) {
  const conversation = mockConversations.find((c) => c.noteId === noteId);
  const [messages, setMessages] = useState<Message[]>(
    conversation?.messages ?? []
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    (content: string) => {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Simulate AI response after delay
      setTimeout(() => {
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content:
            "I'd be happy to help you with that! Based on your notes, here are the key insights I found:\n\n" +
            "The material covers several important concepts that are worth reviewing. " +
            "I recommend focusing on the core definitions and their relationships to build a strong understanding.\n\n" +
            "Would you like me to go deeper into any specific area, or shall I generate flashcards to help you study?",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 1500);
    },
    []
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
              Ask me anything about your notes
            </h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              I can summarize, explain, quiz you, or help you study. Just ask!
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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSubmit={handleSend} />
    </div>
  );
}
