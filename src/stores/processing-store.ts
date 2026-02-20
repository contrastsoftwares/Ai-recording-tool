"use client";

import { create } from "zustand";

export type ProcessingTaskType = "transcribe" | "notes" | "flashcards" | "test" | "chat";

export interface ProcessingTask {
  noteId: string;
  type: ProcessingTaskType;
  progress: number;
  label: string;
}

interface ProcessingState {
  tasks: Map<string, ProcessingTask>;
  addTask: (id: string, task: ProcessingTask) => void;
  updateProgress: (id: string, progress: number) => void;
  removeTask: (id: string) => void;
  clearAll: () => void;
}

export const useProcessingStore = create<ProcessingState>((set) => ({
  tasks: new Map(),
  addTask: (id, task) =>
    set((state) => {
      const next = new Map(state.tasks);
      next.set(id, task);
      return { tasks: next };
    }),
  updateProgress: (id, progress) =>
    set((state) => {
      const next = new Map(state.tasks);
      const existing = next.get(id);
      if (existing) {
        next.set(id, { ...existing, progress });
      }
      return { tasks: next };
    }),
  removeTask: (id) =>
    set((state) => {
      const next = new Map(state.tasks);
      next.delete(id);
      return { tasks: next };
    }),
  clearAll: () => set({ tasks: new Map() }),
}));
