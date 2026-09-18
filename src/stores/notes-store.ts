"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Note } from "@/types/note";
import { idbStorage } from "@/lib/idb-storage";

interface NotesState {
  notes: Note[];
  activeNote: Note | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
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
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
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
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ notes: state.notes }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Returns true once the notes store has finished loading from IndexedDB.
 * Use this to avoid showing "no notes" / "note not found" during async hydration.
 * Starts false on both server and first client render (no hydration mismatch),
 * then flips true once IndexedDB has loaded.
 */
export function useNotesHydrated(): boolean {
  return useNotesStore((s) => s.hasHydrated);
}
