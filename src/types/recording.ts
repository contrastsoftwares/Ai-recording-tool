export type RecordingType = "screen" | "audio";
export type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

export interface Recording {
  id: string;
  type: RecordingType;
  title: string;
  duration: number;
  status: RecordingStatus;
  createdAt: string;
  blobUrl?: string;
  noteId?: string;
}
