"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Eye, Trophy, Star, Sparkles } from "lucide-react";

interface TestResultsProps {
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  onRetake: () => void;
  onReview: () => void;
}

function getGrade(percentage: number): { letter: string; color: string } {
  if (percentage >= 90) return { letter: "A", color: "text-success" };
  if (percentage >= 80) return { letter: "B", color: "text-primary" };
  if (percentage >= 70) return { letter: "C", color: "text-warning" };
  if (percentage >= 60) return { letter: "D", color: "text-orange-500" };
  return { letter: "F", color: "text-destructive" };
}

function getPerformanceMessage(percentage: number): string {
  if (percentage >= 90) return "Excellent work!";
  if (percentage >= 80) return "Great job!";
  if (percentage >= 70) return "Good effort!";
  if (percentage >= 60) return "Not bad, keep practicing!";
  return "Keep studying, you'll get there!";
}

export function TestResults({ score, onRetake, onReview }: TestResultsProps) {
  const grade = getGrade(score.percentage);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset =
    circumference - (score.percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Decorative dots for high scores */}
      {score.percentage >= 90 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute rounded-full opacity-20 animate-pulse",
                i % 3 === 0 && "bg-primary",
                i % 3 === 1 && "bg-success",
                i % 3 === 2 && "bg-warning"
              )}
              style={{
                width: `${8 + (i % 4) * 4}px`,
                height: `${8 + (i % 4) * 4}px`,
                left: `${10 + (i * 7.5) % 80}%`,
                top: `${5 + ((i * 13) % 30)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration icon for high scores */}
      {score.percentage >= 90 && (
        <div className="flex items-center gap-2 text-warning">
          <Star className="h-5 w-5 fill-warning" />
          <Trophy className="h-8 w-8 fill-warning" />
          <Star className="h-5 w-5 fill-warning" />
        </div>
      )}

      {/* Circular progress */}
      <div className="relative">
        <svg width="180" height="180" className="-rotate-90">
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-1000 ease-out",
              score.percentage >= 70 ? "text-success" : "text-destructive"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">
            {Math.round(score.percentage)}%
          </span>
          <span className="text-xs text-muted-foreground mt-1">Score</span>
        </div>
      </div>

      {/* Score text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground">
          {Number.isInteger(score.correct) ? score.correct : score.correct.toFixed(1)} out of {score.total} correct
        </p>

        {/* Grade badge */}
        <Badge
          variant="outline"
          className={cn(
            "text-lg px-4 py-1 font-bold",
            grade.color
          )}
        >
          Grade: {grade.letter}
        </Badge>
      </div>

      {/* Performance message */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-5 py-3">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <p className="text-sm font-medium text-foreground">
          {getPerformanceMessage(score.percentage)}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          variant="outline"
          onClick={onReview}
          className="flex-1 gap-2"
        >
          <Eye className="h-4 w-4" />
          Review Answers
        </Button>
        <Button onClick={onRetake} className="flex-1 gap-2">
          <RotateCcw className="h-4 w-4" />
          Retake Test
        </Button>
      </div>
    </div>
  );
}
