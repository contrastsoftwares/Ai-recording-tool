"use client";

import { create } from "zustand";
import type { Recording, RecordingType, RecordingStatus } from "@/types/recording";

interface ActiveRecording {
  type: RecordingType;
  status: RecordingStatus;
  duration: number;
}

interface RecordingState {
  recordings: Recording[];
  activeRecording: ActiveRecording | null;
  startRecording: (type: RecordingType) => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  tick: () => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  recordings: [],
  activeRecording: null,
  startRecording: (type) =>
    set({ activeRecording: { type, status: "recording", duration: 0 } }),
  pauseRecording: () =>
    set((state) =>
      state.activeRecording
        ? { activeRecording: { ...state.activeRecording, status: "paused" } }
        : state
    ),
  resumeRecording: () =>
    set((state) =>
      state.activeRecording
        ? { activeRecording: { ...state.activeRecording, status: "recording" } }
        : state
    ),
  stopRecording: () =>
    set((state) =>
      state.activeRecording
        ? { activeRecording: { ...state.activeRecording, status: "stopped" } }
        : state
    ),
  tick: () =>
    set((state) =>
      state.activeRecording?.status === "recording"
        ? {
            activeRecording: {
              ...state.activeRecording,
              duration: state.activeRecording.duration + 1,
            },
          }
        : state
    ),
}));
