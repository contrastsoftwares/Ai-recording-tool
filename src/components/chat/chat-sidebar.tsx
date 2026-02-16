"use client";

import { Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, truncate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNewChat?: () => void;
}

function groupConversations(conversations: Conversation[]) {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const yesterdayStart = todayStart - 86400000;
  const weekStart = todayStart - 7 * 86400000;

  const groups: {
    label: string;
    conversations: Conversation[];
  }[] = [
    { label: "Today", conversations: [] },
    { label: "Yesterday", conversations: [] },
    { label: "This Week", conversations: [] },
    { label: "Older", conversations: [] },
  ];

  const sorted = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  for (const conv of sorted) {
    const time = new Date(conv.updatedAt).getTime();
    if (time >= todayStart) {
      groups[0].conversations.push(conv);
    } else if (time >= yesterdayStart) {
      groups[1].conversations.push(conv);
    } else if (time >= weekStart) {
      groups[2].conversations.push(conv);
    } else {
      groups[3].conversations.push(conv);
    }
  }

  return groups.filter((g) => g.conversations.length > 0);
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: ChatSidebarProps) {
  const groups = groupConversations(conversations);

  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {groups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.conversations.map((conv) => {
                const isActive = conv.id === activeId;
                const lastMessage =
                  conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1]
                    : null;

                return (
                  <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={cn(
                      "group flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                      isActive
                        ? "border-l-2 border-l-primary bg-primary/5"
                        : "hover:bg-accent"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MessageSquare
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "truncate text-sm font-medium",
                            isActive
                              ? "text-primary"
                              : "text-foreground"
                          )}
                        >
                          {truncate(conv.title, 28)}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(conv.updatedAt)}
                      </span>
                    </div>
                    {lastMessage && (
                      <p className="pl-5.5 truncate text-xs text-muted-foreground">
                        {truncate(lastMessage.content, 40)}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
