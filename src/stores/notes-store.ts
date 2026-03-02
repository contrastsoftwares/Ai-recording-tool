"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Note } from "@/types/note";

interface NotesState {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  toggleFavorite: (noteId: string) => void;
  addNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  accessNote: (noteId: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      activeNote: null,
      setActiveNote: (note) => set({ activeNote: note }),
      toggleFavorite: (noteId) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
          ),
        })),
      addNote: (note) =>
        set((state) => ({
          notes: [note, ...state.notes],
        })),
      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        })),
      updateNote: (noteId, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        })),
      accessNote: (noteId) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === noteId ? { ...n, lastAccessedAt: new Date().toISOString() } : n
          ),
        })),
    }),
    {
      name: "contrast-ai-notes",
    }
  )
);
