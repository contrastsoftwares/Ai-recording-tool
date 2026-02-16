import { cn } from "@/lib/utils";

interface FlashcardProgressProps {
  total: number;
  mastered: number;
  learning: number;
  notStarted: number;
}

export function FlashcardProgress({
  total,
  mastered,
  learning,
  notStarted,
}: FlashcardProgressProps) {
  const masteredPct = total > 0 ? (mastered / total) * 100 : 0;
  const learningPct = total > 0 ? (learning / total) * 100 : 0;
  const notStartedPct = total > 0 ? (notStarted / total) * 100 : 0;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {masteredPct > 0 && (
          <div
            className="bg-success transition-all duration-500"
            style={{ width: `${masteredPct}%` }}
          />
        )}
        {learningPct > 0 && (
          <div
            className="bg-warning transition-all duration-500"
            style={{ width: `${learningPct}%` }}
          />
        )}
        {notStartedPct > 0 && (
          <div
            className="bg-muted-foreground/30 transition-all duration-500"
            style={{ width: `${notStartedPct}%` }}
          />
        )}
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">
            Mastered ({mastered})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">
            Learning ({learning})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="text-xs text-muted-foreground">
            Not Started ({notStarted})
          </span>
        </div>
      </div>

      {/* Summary text */}
      <p className={cn("mt-1.5 text-sm font-medium text-foreground")}>
        {mastered} of {total} cards mastered
      </p>
    </div>
  );
}
