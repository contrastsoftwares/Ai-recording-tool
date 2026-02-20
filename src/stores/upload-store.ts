"use client";

import { create } from "zustand";

interface UploadState {
  file: File | null;
  url: string | null;
  fileType: string | null;
  isUploading: boolean;
  progress: number;
  setFile: (file: File) => void;
  setUrl: (url: string) => void;
  clear: () => void;
  setProgress: (progress: number) => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  file: null,
  url: null,
  fileType: null,
  isUploading: false,
  progress: 0,
  setFile: (file) =>
    set({
      file,
      url: null,
      fileType: file.type || null,
      isUploading: false,
      progress: 0,
    }),
  setUrl: (url) =>
    set({
      file: null,
      url,
      fileType: "link",
      isUploading: false,
      progress: 0,
    }),
  clear: () =>
    set({
      file: null,
      url: null,
      fileType: null,
      isUploading: false,
      progress: 0,
    }),
  setProgress: (progress) =>
    set({
      progress,
      isUploading: progress > 0 && progress < 100,
    }),
}));
