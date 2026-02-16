"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { Question } from "@/types/test";

interface QuestionCardProps {
  question: Question;
  index: number;
  onAnswer: (id: string, answer: string) => void;
  showResult: boolean;
}

const typeLabels: Record<string, string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True/False",
  "short-answer": "Short Answer",
  "fill-blank": "Fill in the Blank",
};

const optionLabels = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  index,
  onAnswer,
  showResult,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(
    question.userAnswer ?? ""
  );

  function handleAnswer(answer: string) {
    if (showResult) return;
    setSelectedAnswer(answer);
    onAnswer(question.id, answer);
  }

  function isCorrect() {
    if (question.type === "short-answer") return null;
    return (
      selectedAnswer.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase()
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all",
        showResult && isCorrect() === true && "border-success/50",
        showResult && isCorrect() === false && "border-destructive/50"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {index + 1}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {typeLabels[question.type]}
            </Badge>
            {showResult && isCorrect() === true && (
              <Badge variant="success" className="text-xs gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Correct
              </Badge>
            )}
            {showResult && isCorrect() === false && (
              <Badge variant="destructive" className="text-xs gap-1">
                <XCircle className="h-3 w-3" />
                Incorrect
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium leading-relaxed">
            {question.question}
          </p>
        </div>
      </div>

      {/* Answer Area */}
      <div className="px-5 pb-5 pl-16">
        {/* Multiple Choice */}
        {question.type === "multiple-choice" && question.options && (
          <div className="grid gap-2">
            {question.options.map((option, i) => {
              const label = optionLabels[i];
              const isSelected = selectedAnswer === label;
              const isCorrectOption = question.correctAnswer === label;

              return (
                <button
                  key={label}
                  onClick={() => handleAnswer(label)}
                  disabled={showResult}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-border p-3 text-left text-sm transition-all",
                    "hover:bg-accent hover:border-primary/30",
                    !showResult && isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    showResult && isCorrectOption && "border-success bg-success/10",
                    showResult && isSelected && !isCorrectOption && "border-destructive bg-destructive/10",
                    showResult && "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                      !showResult && isSelected && "border-primary bg-primary text-primary-foreground",
                      !showResult && !isSelected && "border-muted-foreground/30",
                      showResult && isCorrectOption && "border-success bg-success text-success-foreground",
                      showResult && isSelected && !isCorrectOption && "border-destructive bg-destructive text-destructive-foreground"
                    )}
                  >
                    {label}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* True/False */}
        {question.type === "true-false" && (
          <div className="flex gap-3">
            {["True", "False"].map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = question.correctAnswer === option;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={cn(
                    "flex-1 rounded-lg border border-border p-4 text-center text-sm font-semibold transition-all",
                    "hover:bg-accent hover:border-primary/30",
                    !showResult && isSelected && "border-primary bg-primary/5 ring-1 ring-primary/20",
                    showResult && isCorrectOption && "border-success bg-success/10 text-success",
                    showResult && isSelected && !isCorrectOption && "border-destructive bg-destructive/10 text-destructive",
                    showResult && "cursor-default"
                  )}
                >
                  {option}
                  {showResult && isCorrectOption && (
                    <CheckCircle2 className="h-4 w-4 mx-auto mt-1 text-success" />
                  )}
                  {showResult && isSelected && !isCorrectOption && (
                    <XCircle className="h-4 w-4 mx-auto mt-1 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Short Answer */}
        {question.type === "short-answer" && (
          <div className="space-y-2">
            <Textarea
              value={selectedAnswer}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={3}
              disabled={showResult}
              className="resize-none"
            />
            {showResult && (
              <div className="rounded-lg border border-success/30 bg-success/10 p-3">
                <p className="text-xs font-semibold text-success mb-1">
                  Suggested Answer:
                </p>
                <p className="text-sm text-foreground">
                  {question.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Fill in the Blank */}
        {question.type === "fill-blank" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={selectedAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer..."
                disabled={showResult}
                className={cn(
                  "max-w-xs",
                  showResult && isCorrect() === true && "border-success",
                  showResult && isCorrect() === false && "border-destructive"
                )}
              />
              {showResult && isCorrect() === true && (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              )}
              {showResult && isCorrect() === false && (
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
              )}
            </div>
            {showResult && isCorrect() === false && (
              <p className="text-sm text-success">
                Correct answer:{" "}
                <span className="font-semibold">
                  {question.correctAnswer}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Explanation */}
        {showResult && (
          <div className="mt-4 flex gap-2 rounded-lg bg-muted/50 p-3">
            <Lightbulb className="h-4 w-4 shrink-0 text-warning mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-0.5">
                Explanation
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
