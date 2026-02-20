"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Restore answers from sessionStorage
  useEffect(() => {
    if (!test) return;
    const saved = sessionStorage.getItem(`test-answers-${test.id}`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }
  }, [test]);

  // Auto-save answers to sessionStorage
  useEffect(() => {
    if (!test) return;
    sessionStorage.setItem(`test-answers-${test.id}`, JSON.stringify(answers));
  }, [answers, test]);

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

  const scrollToQuestion = useCallback((questionId: string) => {
    const el = questionRefs.current.get(questionId);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  function handleSubmit() {
    if (!test) return;

    let correct = 0;
    for (const question of test.questions) {
      const userAnswer = answers[question.id]?.trim().toLowerCase() ?? "";
      const correctAnswer = question.correctAnswer.trim().toLowerCase();

      if (question.type === "short-answer") {
        if (userAnswer.length > 0) {
          correct += 0;
        }
      } else {
        if (userAnswer === correctAnswer) {
          correct++;
        }
      }
    }

    const gradableQuestions = test.questions.filter(
      (q) => q.type !== "short-answer"
    );
    const total = gradableQuestions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    setScore({ correct, total, percentage });
    setTestState("results");
    // Clear saved answers
    sessionStorage.removeItem(`test-answers-${test.id}`);
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

  // Get question state for navigation pill
  const getQuestionState = (questionId: string) => {
    const question = test.questions.find((q) => q.id === questionId);
    if (!question) return "unanswered";
    const userAnswer = answers[questionId]?.trim() ?? "";

    if (testState === "review") {
      if (!userAnswer) return "unanswered";
      const isCorrect = userAnswer.toLowerCase() === question.correctAnswer.trim().toLowerCase();
      if (question.type === "short-answer") return "answered";
      return isCorrect ? "correct" : "incorrect";
    }

    return userAnswer ? "answered" : "unanswered";
  };

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

        {/* Question navigation strip */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {test.questions.map((question, index) => {
            const state = getQuestionState(question.id);
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => scrollToQuestion(question.id)}
                className={cn(
                  "h-7 w-7 rounded-md text-xs font-medium transition-all",
                  "flex items-center justify-center",
                  state === "unanswered" && "bg-muted text-muted-foreground hover:bg-muted/80",
                  state === "answered" && "bg-primary text-primary-foreground",
                  state === "correct" && "bg-success text-success-foreground",
                  state === "incorrect" && "bg-destructive text-destructive-foreground"
                )}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
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
          <div
            key={question.id}
            ref={(el) => {
              if (el) questionRefs.current.set(question.id, el);
            }}
          >
            <QuestionCard
              question={{
                ...question,
                userAnswer: answers[question.id],
              }}
              index={index}
              onAnswer={handleAnswer}
              showResult={testState === "review"}
            />
          </div>
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
