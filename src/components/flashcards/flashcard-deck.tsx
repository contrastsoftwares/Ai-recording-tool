"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockFlashcardDecks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { FlashcardSingle } from "@/components/flashcards/flashcard-single";
import { FlashcardProgress } from "@/components/flashcards/flashcard-progress";

interface FlashcardDeckProps {
  noteId: string;
}

export function FlashcardDeck({ noteId }: FlashcardDeckProps) {
  const deck = mockFlashcardDecks.find((d) => d.noteId === noteId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const totalCards = deck?.cards.length ?? 0;

  const goToNext = useCallback(() => {
    if (!deck) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.cards.length);
  }, [deck]);

  const goToPrev = useCallback(() => {
    if (!deck) return;
    setIsFlipped(false);
    setCurrentIndex(
      (prev) => (prev - 1 + deck.cards.length) % deck.cards.length
    );
  }, [deck]);

  const toggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleDifficulty = useCallback(() => {
    // Mark difficulty and advance to next card
    goToNext();
  }, [goToNext]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, toggleFlip]);

  // No deck found state
  if (!deck) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-16">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Layers className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No flashcards yet
        </h3>
        <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
          Generate flashcards from your notes to start studying with spaced
          repetition.
        </p>
        <Button>
          <Layers className="mr-2 h-4 w-4" />
          Generate Flashcards
        </Button>
      </div>
    );
  }

  const currentCard = deck.cards[currentIndex];

  return (
    <div className="flex h-full flex-col">
      {/* Header: title + progress */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {deck.title}
        </h2>
        <FlashcardProgress
          total={deck.progress.total}
          mastered={deck.progress.mastered}
          learning={deck.progress.learning}
          notStarted={deck.progress.notStarted}
        />
      </div>

      {/* Card area */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {/* Card counter */}
        <p className="mb-6 text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {totalCards}
        </p>

        {/* Flashcard */}
        <FlashcardSingle
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={toggleFlip}
        />

        {/* Difficulty buttons (show after flip) */}
        {isFlipped && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleDifficulty}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                "bg-success/10 text-success hover:bg-success/20"
              )}
            >
              Easy
            </button>
            <button
              onClick={handleDifficulty}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                "bg-warning/10 text-warning hover:bg-warning/20"
              )}
            >
              Medium
            </button>
            <button
              onClick={handleDifficulty}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                "bg-destructive/10 text-destructive hover:bg-destructive/20"
              )}
            >
              Hard
            </button>
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-4 border-t border-border px-6 py-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          className="h-10 w-10 rounded-full"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          onClick={toggleFlip}
          className="gap-2 rounded-full px-6"
        >
          <RotateCcw className="h-4 w-4" />
          Flip
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="h-10 w-10 rounded-full"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
