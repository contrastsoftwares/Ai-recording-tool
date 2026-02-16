"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/test-generator/question-card";
import { TestResults } from "@/components/test-generator/test-results";
import { mockPracticeTests } from "@/lib/mock-data";
import {
  Clock,
  FileQuestion,
  CheckSquare,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface TestViewProps {
  noteId: string;
}

type TestState = "taking" | "results" | "review";

export function TestView({ noteId }: TestViewProps) {
  const test = mockPracticeTests.find((t) => t.noteId === noteId);

  const [testState, setTestState] = useState<TestState>("taking");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState<{
    correct: number;
    total: number;
    percentage: number;
  } | null>(null);

  // Timer
  useEffect(() => {
    if (testState !== "taking") return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [testState]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  function handleSubmit() {
    if (!test) return;

    let correct = 0;
    for (const question of test.questions) {
      const userAnswer = answers[question.id]?.trim().toLowerCase() ?? "";
      const correctAnswer = question.correctAnswer.trim().toLowerCase();

      if (question.type === "short-answer") {
        // For short answer, give credit (simplified check)
        if (userAnswer.length > 0) {
          correct += 0; // Manual grading needed
        }
      } else {
        if (userAnswer === correctAnswer) {
          correct++;
        }
      }
    }

    // Count non-short-answer questions for percentage
    const gradableQuestions = test.questions.filter(
      (q) => q.type !== "short-answer"
    );
    const total = gradableQuestions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    setScore({ correct, total, percentage });
    setTestState("results");
  }

  function handleRetake() {
    setAnswers({});
    setElapsedSeconds(0);
    setScore(null);
    setTestState("taking");
  }

  function handleReview() {
    setTestState("review");
  }

  // No test found state
  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            No Practice Test Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Generate a practice test from your notes to start testing your
            knowledge.
          </p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Practice Test
        </Button>
      </div>
    );
  }

  const totalQuestions = test.questions.length;
  const answeredCount = Object.keys(answers).filter(
    (key) => answers[key].trim().length > 0
  ).length;
  const allAnswered = answeredCount === totalQuestions;

  // Results state
  if (testState === "results" && score) {
    return (
      <div className="relative rounded-xl border border-border bg-card p-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-foreground">{test.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Completed in {formatDuration(elapsedSeconds)}
          </p>
        </div>
        <TestResults
          score={score}
          onRetake={handleRetake}
          onReview={handleReview}
        />
      </div>
    );
  }

  // Taking / Review state
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="sticky top-0 z-10 rounded-xl border border-border bg-card/95 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {testState === "review" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTestState("results")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h2 className="text-base font-bold text-foreground">
                {test.title}
              </h2>
              <div className="flex items-center gap-3 mt-0.5">
                {testState === "review" ? (
                  <Badge variant="secondary" className="text-xs">
                    Review Mode
                  </Badge>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(elapsedSeconds)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckSquare className="h-3.5 w-3.5" />
                      {answeredCount} / {totalQuestions} answered
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {testState === "taking" && (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="gap-2"
              size="sm"
            >
              <CheckSquare className="h-4 w-4" />
              Submit Test
            </Button>
          )}
        </div>

        {/* Progress bar */}
        {testState === "taking" && (
          <div className="mt-3">
            <Progress
              value={answeredCount}
              max={totalQuestions}
              className="h-1.5"
            />
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {test.questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={{
              ...question,
              userAnswer: answers[question.id],
            }}
            index={index}
            onAnswer={handleAnswer}
            showResult={testState === "review"}
          />
        ))}
      </div>

      {/* Bottom submit (visible when scrolled) */}
      {testState === "taking" && (
        <div
          className={cn(
            "flex justify-center pb-4",
            !allAnswered && "opacity-50"
          )}
        >
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            size="lg"
            className="gap-2 px-8"
          >
            <CheckSquare className="h-4 w-4" />
            Submit Test
          </Button>
        </div>
      )}
    </div>
  );
}
