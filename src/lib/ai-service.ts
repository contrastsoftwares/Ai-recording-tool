import type { NoteFormat } from "@/types/note";
import type { QuestionType } from "@/types/test";

// ---------------------------------------------------------------------------
// AI Service – calls real API routes (server-side OpenAI)
// ---------------------------------------------------------------------------

export interface TranscribeResult {
  transcript: string;
  segments: Array<{ start: number; end: number; text: string }>;
}

export interface GenerateNotesResult {
  title: string;
  content: string;
  tags: string[];
}

export interface ExtractContentResult {
  content: string;
  title?: string;
  sourceType: string;
}

export interface SolvePhotoResult {
  subject: string;
  subjectDetail: string;
  problem: string;
  steps: Array<{
    stepNumber: number;
    title: string;
    explanation: string;
    math?: string;
  }>;
  finalAnswer: string;
}

export interface FlashcardResult {
  id: string;
  front: string;
  back: string;
  difficulty: string;
  timesReviewed: number;
  lastReviewed: string | null;
}

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TranscribeProgress {
  message: string;
  percent: number;
  chunk?: number;
  totalChunks?: number;
}

export const aiService = {
  /** Transcribe audio/video file via Whisper (supports streaming progress for large files) */
  async transcribe(
    file: File,
    onProgress?: (data: TranscribeProgress) => void
  ): Promise<TranscribeResult> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Transcription failed");
    }

    const contentType = res.headers.get("content-type") || "";

    // Streaming NDJSON response for large files (chunked transcription)
    if (contentType.includes("application/x-ndjson") && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let result: TranscribeResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);

          if (event.type === "progress" && onProgress) {
            onProgress(event as TranscribeProgress);
          } else if (event.type === "result") {
            result = {
              transcript: event.transcript,
              segments: event.segments,
            };
          } else if (event.type === "error") {
            throw new Error(event.error);
          }
        }
      }

      if (!result) {
        throw new Error("Transcription failed: no result received");
      }
      return result;
    }

    // Standard JSON response for small files
    return res.json();
  },

  /** Generate notes from content */
  async generateNotes(
    content: string,
    formats: NoteFormat[],
    title?: string,
    length?: string
  ): Promise<GenerateNotesResult> {
    const res = await fetch("/api/generate-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, formats, title, length: length || "medium" }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Note generation failed");
    }

    return res.json();
  },

  /** Extract content from URL or file (YouTube, article, PDF, document) */
  async extractContent(
    input: { url: string } | { file: File },
    type?: string
  ): Promise<ExtractContentResult> {
    const formData = new FormData();
    if ("url" in input) {
      formData.append("url", input.url);
    } else {
      formData.append("file", input.file);
    }
    if (type) formData.append("type", type);

    const res = await fetch("/api/extract-content", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Content extraction failed");
    }

    return res.json();
  },

  /** Chat with AI about note content */
  async chat(
    noteContent: string,
    messages: Array<{ role: string; content: string }>
  ): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteContent, messages }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Chat failed");
    }

    const data = await res.json();
    return data.content;
  },

  /** Solve a problem from an image */
  async solvePhoto(image: File): Promise<SolvePhotoResult> {
    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/solve-photo", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Photo solving failed");
    }

    return res.json();
  },

  /** Generate flashcards from note content */
  async generateFlashcards(noteContent: string): Promise<FlashcardResult[]> {
    const res = await fetch("/api/generate-flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteContent }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Flashcard generation failed");
    }

    const data = await res.json();
    return data.cards;
  },

  /** Generate a practice test from note content */
  async generateTest(
    noteContent: string
  ): Promise<{ title: string; questions: TestQuestion[] }> {
    const res = await fetch("/api/generate-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteContent }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Test generation failed");
    }

    return res.json();
  },

  /** Grade a short-answer question using AI */
  async gradeShortAnswer(
    question: string,
    correctAnswer: string,
    userAnswer: string
  ): Promise<{ score: "correct" | "partial" | "incorrect"; feedback: string }> {
    const res = await fetch("/api/grade-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, correctAnswer, userAnswer }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Grading failed");
    }

    return res.json();
  },
};
