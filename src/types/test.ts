export type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "fill-blank";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
}

export interface PracticeTest {
  id: string;
  noteId: string;
  title: string;
  questions: Question[];
  createdAt: string;
  completedAt?: string;
  score?: {
    correct: number;
    total: number;
    percentage: number;
  };
}
