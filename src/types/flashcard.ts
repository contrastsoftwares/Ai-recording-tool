export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed?: string;
  timesReviewed: number;
}

export interface FlashcardDeck {
  id: string;
  noteId: string;
  title: string;
  cards: Flashcard[];
  createdAt: string;
  progress: {
    total: number;
    mastered: number;
    learning: number;
    notStarted: number;
  };
}
