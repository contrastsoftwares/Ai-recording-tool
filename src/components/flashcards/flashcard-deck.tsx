"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Layers, Keyboard, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FlashcardSingle } from "@/components/flashcards/flashcard-single";
import { aiService } from "@/lib/ai-service";
import type { FlashcardResult } from "@/lib/ai-service";

interface FlashcardDeckProps {
  noteId: string;
  noteContent?: string;
}

export function FlashcardDeck({ noteId, noteContent }: FlashcardDeckProps) {
  // Persist flashcards in localStorage so they survive tab switches
  const [cards, setCards] = useState<FlashcardResult[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(`flashcards-${noteId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [troubleCards, setTroubleCards] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem(`trouble-cards-${noteId}`);
    if (saved) {
      try { return new Set(JSON.parse(saved)); } catch { return new Set(); }
    }
    return new Set();
  });
  const [showTroubleOnly, setShowTroubleOnly] = useState(false);

  const activeCards = showTroubleOnly
    ? cards.filter((c) => troubleCards.has(c.id))
    : cards;
  const activeTotal = activeCards.length;
  const troubleCount = cards.filter((c) => troubleCards.has(c.id)).length;

  // Persist flashcards to localStorage
  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem(`flashcards-${noteId}`, JSON.stringify(cards));
    }
  }, [cards, noteId]);

  // Persist trouble cards
  useEffect(() => {
    localStorage.setItem(`trouble-cards-${noteId}`, JSON.stringify([...troubleCards]));
  }, [troubleCards, noteId]);

  const handleGenerate = useCallback(async () => {
    if (!noteContent) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const result = await aiService.generateFlashcards(noteContent);
      setCards(result);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate flashcards.");
    } finally {
      setIsGenerating(false);
    }
  }, [noteContent]);

  const goToNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeTotal);
  }, [activeTotal]);

  const goToPrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeTotal) % activeTotal);
  }, [activeTotal]);

  const toggleFlip = useCallback(() => setIsFlipped((prev) => !prev), []);

  const toggleTrouble = useCallback(() => {
    const card = activeCards[currentIndex];
    if (!card) return;
    setTroubleCards((prev) => {
      const next = new Set(prev);
      if (next.has(card.id)) {
        next.delete(card.id);
      } else {
        next.add(card.id);
      }
      return next;
    });
  }, [activeCards, currentIndex]);

  // Keyboard shortcuts (only when not typing in an input/textarea)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
      else if (e.key === " ") { e.preventDefault(); toggleFlip(); }
      else if (e.key === "t" || e.key === "T") { e.preventDefault(); toggleTrouble(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, toggleFlip, toggleTrouble]);

  // Reset index when switching views
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [showTroubleOnly]);

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
            ? "AI is creating flashcards from your content. This may take a moment."
            : "Generate flashcards from your content to start studying."}
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

  // Show trouble-only view but no trouble cards marked
  if (showTroubleOnly && activeTotal === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-16">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No trouble cards</h3>
        <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
          You haven&apos;t marked any cards as trouble yet. Mark cards you find difficult to review them here.
        </p>
        <Button variant="outline" onClick={() => setShowTroubleOnly(false)}>
          Show All Cards
        </Button>
      </div>
    );
  }

  const currentCard = activeCards[currentIndex];
  if (!currentCard) return null;
  const isCurrentTrouble = troubleCards.has(currentCard.id);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Flashcards ({cards.length})
            {troubleCount > 0 && (
              <span className="ml-2 text-sm font-normal text-warning">
                {troubleCount} marked as trouble
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {troubleCount > 0 && (
              <Button
                size="sm"
                variant={showTroubleOnly ? "default" : "outline"}
                onClick={() => setShowTroubleOnly(!showTroubleOnly)}
                className="gap-2"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {showTroubleOnly ? "Show All" : "Trouble Only"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <p className="mb-6 text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {activeTotal}
          {showTroubleOnly && <span className="ml-2 text-xs text-warning">Trouble Cards</span>}
        </p>
        <FlashcardSingle front={currentCard.front} back={currentCard.back} isFlipped={isFlipped} onFlip={toggleFlip} />

        <div className="mt-6">
          <button
            onClick={toggleTrouble}
            className={cn(
              "rounded-lg px-5 py-2 text-sm font-medium transition-colors",
              isCurrentTrouble
                ? "bg-warning/20 text-warning"
                : "bg-muted text-muted-foreground hover:bg-warning/10 hover:text-warning"
            )}
          >
            <AlertTriangle className="inline h-4 w-4 mr-1.5 -mt-0.5" />
            {isCurrentTrouble ? "Marked as Trouble" : "Mark as Trouble"}
            <span className="text-xs opacity-60 ml-1.5">(T)</span>
          </button>
        </div>
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
          <span className="text-[10px] text-muted-foreground">T for trouble</span>
        </div>
      </div>
    </div>
  );
}
