export type NoteFormat =
  | "bullet-points"
  | "sentences"
  | "cornell"
  | "outline"
  | "key-concepts"
  | "summary"
  | "timeline"
  | "qa-format";

export type NoteLength = "short" | "medium" | "long";

export type UploadType = "video" | "audio" | "pdf" | "link" | "image" | "document";

export interface NoteFormatOption {
  id: NoteFormat;
  label: string;
  description: string;
  icon: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  formats: NoteFormat[];
  sourceType: UploadType;
  sourceUrl?: string;
  transcript?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
}

export interface Transcript {
  id: string;
  noteId: string;
  text: string;
  timestamps: TranscriptSegment[];
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}
