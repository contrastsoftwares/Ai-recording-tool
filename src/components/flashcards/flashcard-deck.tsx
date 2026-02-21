"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers, Play, Trophy, Keyboard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FlashcardSingle } from "@/components/flashcards/flashcard-single";
import { FlashcardProgress } from "@/components/flashcards/flashcard-progress";
import { aiService } from "@/lib/ai-service";
import type { FlashcardResult } from "@/lib/ai-service";

interface FlashcardDeckProps {
  noteId: string;
  noteContent?: string;
}

type StudyMode = "browse" | "session" | "complete";

interface SessionStats {
  reviewed: number;
  easy: number;
  medium: number;
  hard: number;
  startTime: number;
}

export function FlashcardDeck({ noteId, noteContent }: FlashcardDeckProps) {
  const [cards, setCards] = useState<FlashcardResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>("browse");
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    reviewed: 0, easy: 0, medium: 0, hard: 0, startTime: Date.now(),
  });

  const totalCards = cards.length;
  const sessionCards = cards.filter((c) => c.timesReviewed < 3);
  const activeCards = studyMode === "session" ? sessionCards : cards;
  const activeTotal = activeCards.length;

  const handleGenerate = useCallback(async () => {
    if (!noteContent) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const result = await aiService.generateFlashcards(noteContent);
      setCards(result);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate flashcards.");
    } finally {
      setIsGenerating(false);
    }
  }, [noteContent]);

  const goToNext = useCallback(() => {
    setIsFlipped(false);
    if (studyMode === "session" && sessionStats.reviewed + 1 >= activeTotal) {
      setStudyMode("complete");
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % activeTotal);
  }, [activeTotal, studyMode, sessionStats.reviewed]);

  const goToPrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeTotal) % activeTotal);
  }, [activeTotal]);

  const toggleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

  const handleDifficulty = useCallback((difficulty: "easy" | "medium" | "hard") => {
    setSessionStats((prev) => ({ ...prev, reviewed: prev.reviewed + 1, [difficulty]: prev[difficulty] + 1 }));
    goToNext();
  }, [goToNext]);

  const startStudySession = useCallback(() => {
    setStudyMode("session");
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ reviewed: 0, easy: 0, medium: 0, hard: 0, startTime: Date.now() });
  }, []);

  const exitSession = useCallback(() => {
    setStudyMode("browse");
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
      else if (e.key === " ") { e.preventDefault(); toggleFlip(); }
      else if (isFlipped && studyMode === "session") {
        if (e.key === "1") { e.preventDefault(); handleDifficulty("easy"); }
        else if (e.key === "2") { e.preventDefault(); handleDifficulty("medium"); }
        else if (e.key === "3") { e.preventDefault(); handleDifficulty("hard"); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, toggleFlip, isFlipped, studyMode, handleDifficulty]);

  // No cards yet - show generate button
  if (cards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-16">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Layers className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {isGenerating ? "Generating flashcards..." : "No flashcards yet"}
        </h3>
        <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
          {isGenerating
            ? "AI is creating flashcards from your notes. This may take a moment."
            : "Generate flashcards from your notes to start studying with spaced repetition."}
        </p>
        {generateError && (
          <p className="mb-4 text-sm text-destructive">{generateError}</p>
        )}
        {isGenerating ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Button onClick={handleGenerate} disabled={!noteContent}>
            <Layers className="mr-2 h-4 w-4" />
            Generate Flashcards
          </Button>
        )}
      </div>
    );
  }

  // Session complete
  if (studyMode === "complete") {
    const timeSpent = Math.round((Date.now() - sessionStats.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const mastered = cards.filter((c) => c.timesReviewed >= 3).length;
    const learning = cards.filter((c) => c.timesReviewed > 0 && c.timesReviewed < 3).length;
    const notStarted = cards.filter((c) => c.timesReviewed === 0).length;

    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-12">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <Trophy className="h-8 w-8 text-success" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-foreground">Session Complete!</h3>
        <p className="text-sm text-muted-foreground mb-6">
          You reviewed {sessionStats.reviewed} cards in {minutes > 0 ? `${minutes}m ` : ""}{seconds}s
        </p>
        <div className="flex gap-4 mb-8">
          <div className="text-center"><p className="text-2xl font-bold text-success">{sessionStats.easy}</p><p className="text-xs text-muted-foreground">Easy</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-warning">{sessionStats.medium}</p><p className="text-xs text-muted-foreground">Medium</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-destructive">{sessionStats.hard}</p><p className="text-xs text-muted-foreground">Hard</p></div>
        </div>
        <FlashcardProgress total={totalCards} mastered={mastered} learning={learning} notStarted={notStarted} />
        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={exitSession}>Back to Deck</Button>
          {sessionStats.hard > 0 && <Button onClick={startStudySession}>Review Hard Cards</Button>}
        </div>
      </div>
    );
  }

  const currentCard = activeCards[currentIndex];
  if (!currentCard) return null;

  const mastered = cards.filter((c) => c.timesReviewed >= 3).length;
  const learning = cards.filter((c) => c.timesReviewed > 0 && c.timesReviewed < 3).length;
  const notStarted = cards.filter((c) => c.timesReviewed === 0).length;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Flashcards ({totalCards})</h2>
          {studyMode === "browse" ? (
            <Button size="sm" onClick={startStudySession} className="gap-2"><Play className="h-3.5 w-3.5" />Study Session</Button>
          ) : (
            <Button size="sm" variant="outline" onClick={exitSession}>Exit Session</Button>
          )}
        </div>
        <FlashcardProgress total={totalCards} mastered={mastered} learning={learning} notStarted={notStarted} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <p className="mb-6 text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {activeTotal}
          {studyMode === "session" && <span className="ml-2 text-xs text-primary">Study Session</span>}
        </p>
        <FlashcardSingle front={currentCard.front} back={currentCard.back} isFlipped={isFlipped} onFlip={toggleFlip} />

        {isFlipped && (
          <div className="mt-6 flex gap-3">
            <button onClick={() => handleDifficulty("easy")} className={cn("rounded-lg px-5 py-2 text-sm font-medium transition-colors", "bg-success/10 text-success hover:bg-success/20")}>
              Easy {studyMode === "session" && <span className="text-xs opacity-60 ml-1">(1)</span>}
            </button>
            <button onClick={() => handleDifficulty("medium")} className={cn("rounded-lg px-5 py-2 text-sm font-medium transition-colors", "bg-warning/10 text-warning hover:bg-warning/20")}>
              Medium {studyMode === "session" && <span className="text-xs opacity-60 ml-1">(2)</span>}
            </button>
            <button onClick={() => handleDifficulty("hard")} className={cn("rounded-lg px-5 py-2 text-sm font-medium transition-colors", "bg-destructive/10 text-destructive hover:bg-destructive/20")}>
              Hard {studyMode === "session" && <span className="text-xs opacity-60 ml-1">(3)</span>}
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" size="icon" onClick={goToPrev} className="h-10 w-10 rounded-full"><ChevronLeft className="h-5 w-5" /></Button>
          <Button variant="outline" onClick={toggleFlip} className="gap-2 rounded-full px-6"><RotateCcw className="h-4 w-4" />Flip</Button>
          <Button variant="outline" size="icon" onClick={goToNext} className="h-10 w-10 rounded-full"><ChevronRight className="h-5 w-5" /></Button>
        </div>
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><Keyboard className="h-3 w-3" />Space to flip</span>
          <span className="text-[10px] text-muted-foreground">Arrows to navigate</span>
          {studyMode === "session" && <span className="text-[10px] text-muted-foreground">1/2/3 for difficulty</span>}
        </div>
      </div>
    </div>
  );
}
