"use client";

import { create } from "zustand";
import type { Note } from "@/types/note";
import { mockNotes } from "@/lib/mock-data";

interface NotesState {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  toggleFavorite: (noteId: string) => void;
  addNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: mockNotes,
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
}));
