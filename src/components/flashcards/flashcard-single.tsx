"use client";

import { cn } from "@/lib/utils";

interface FlashcardSingleProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashcardSingle({
  front,
  back,
  isFlipped,
  onFlip,
}: FlashcardSingleProps) {
  return (
    <div
      className="perspective-1000 mx-auto h-[260px] w-full max-w-[400px] cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-[600ms]",
          "[transform-style:preserve-3d]",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front face */}
        <div
          className={cn(
            "backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-lg",
          )}
        >
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Question
            </p>
            <p className="text-lg font-medium text-card-foreground leading-relaxed">
              {front}
            </p>
          </div>
        </div>

        {/* Back face */}
        <div
          className={cn(
            "backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-lg",
          )}
        >
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-primary mb-3">
              Answer
            </p>
            <p className="text-base text-card-foreground leading-relaxed whitespace-pre-line">
              {back}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
