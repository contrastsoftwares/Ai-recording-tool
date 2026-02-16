"use client";

import { create } from "zustand";
import type { Conversation, Message } from "@/types/chat";
import { mockConversations } from "@/lib/mock-data";

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  createConversation: (noteId: string, title: string) => Conversation;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: mockConversations as Conversation[],
  activeConversation: null,
  setActiveConversation: (conv) => set({ activeConversation: conv }),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...(c.messages || []), message], updatedAt: new Date().toISOString() }
          : c
      ),
    })),
  createConversation: (noteId, title) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      noteId,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      activeConversation: newConv,
    }));
    return newConv;
  },
}));
