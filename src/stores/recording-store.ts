"use client";

import { create } from "zustand";

interface SavedRecording {
  blob: Blob;
  url: string;
  duration: number;
  mimeType: string;
}

interface RecordingState {
  audioRecording: SavedRecording | null;
  screenRecording: SavedRecording | null;

  saveAudioRecording: (blob: Blob, duration: number) => void;
  saveScreenRecording: (blob: Blob, duration: number) => void;
  clearAudioRecording: () => void;
  clearScreenRecording: () => void;
}

export const useRecordingStore = create<RecordingState>((set, get) => ({
  audioRecording: null,
  screenRecording: null,

  saveAudioRecording: (blob: Blob, duration: number) => {
    const prev = get().audioRecording;
    if (prev) {
      URL.revokeObjectURL(prev.url);
    }
    const url = URL.createObjectURL(blob);
    set({
      audioRecording: { blob, url, duration, mimeType: blob.type },
    });
  },

  saveScreenRecording: (blob: Blob, duration: number) => {
    const prev = get().screenRecording;
    if (prev) {
      URL.revokeObjectURL(prev.url);
    }
    const url = URL.createObjectURL(blob);
    set({
      screenRecording: { blob, url, duration, mimeType: blob.type },
    });
  },

  clearAudioRecording: () => {
    const prev = get().audioRecording;
    if (prev) {
      URL.revokeObjectURL(prev.url);
    }
    set({ audioRecording: null });
  },

  clearScreenRecording: () => {
    const prev = get().screenRecording;
    if (prev) {
      URL.revokeObjectURL(prev.url);
    }
    set({ screenRecording: null });
  },
}));
