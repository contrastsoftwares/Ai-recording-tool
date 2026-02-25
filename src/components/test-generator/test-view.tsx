"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "@/components/test-generator/question-card";
import { TestResults } from "@/components/test-generator/test-results";
import { aiService } from "@/lib/ai-service";
import type { TestQuestion } from "@/lib/ai-service";
import {
  Clock,
  FileQuestion,
  CheckSquare,
  ArrowLeft,
  Sparkles,
  Loader2,
  ListChecks,
  Zap,
  RefreshCw,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface TestViewProps {
  noteId: string;
  noteContent?: string;
}

type TestState = "idle" | "choosing" | "taking" | "results" | "review";
type TestMode = "full" | "short";

interface TestData {
  title: string;
  questions: TestQuestion[];
}

interface AiGrade {
  score: "correct" | "partial" | "incorrect";
  feedback: string;
}

export function TestView({ noteId, noteContent }: TestViewProps) {
  // Persist test data in localStorage
  const [test, setTest] = useState<TestData | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(`test-data-${noteId}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [testState, setTestState] = useState<TestState>(() => {
    if (typeof window === "undefined") return "idle";
    const saved = localStorage.getItem(`test-data-${noteId}`);
    return saved ? "choosing" : "idle";
  });
  const [testMode, setTestMode] = useState<TestMode>("full");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);
  const [aiGrades, setAiGrades] = useState<Record<string, AiGrade>>({});
  const questionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Persist test data
  useEffect(() => {
    if (test) {
      localStorage.setItem(`test-data-${noteId}`, JSON.stringify(test));
    }
  }, [test, noteId]);

  // Get questions based on mode
  const activeQuestions = useMemo(() => {
    if (!test) return [];
    if (testMode === "full") return test.questions;
    // Quick quiz: exclude short-answer questions, take ~30% of the rest, min 5, max 10
    const nonShortAnswer = test.questions.filter((q) => q.type !== "short-answer");
    const shortCount = Math.max(5, Math.min(10, Math.ceil(nonShortAnswer.length * 0.3)));
    const step = nonShortAnswer.length / shortCount;
    const picked: TestQuestion[] = [];
    for (let i = 0; i < shortCount && i < nonShortAnswer.length; i++) {
      picked.push(nonShortAnswer[Math.floor(i * step)]);
    }
    return picked;
  }, [test, testMode]);

  const handleGenerate = useCallback(async () => {
    if (!noteContent) return;
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const result = await aiService.generateTest(noteContent);
      setTest(result);
      setTestState("choosing");
      setAnswers({});
      setElapsedSeconds(0);
      setScore(null);
      setAiGrades({});
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate test.");
    } finally {
      setIsGenerating(false);
    }
  }, [noteContent]);

  // Restore answers from localStorage
  useEffect(() => {
    if (testState !== "taking" || !test) return;
    const saved = localStorage.getItem(`test-answers-${noteId}-${testMode}`);
    if (saved) {
      try { setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [test, noteId, testMode, testState]);

  // Auto-save answers
  useEffect(() => {
    if (testState !== "taking" || !test) return;
    localStorage.setItem(`test-answers-${noteId}-${testMode}`, JSON.stringify(answers));
  }, [answers, test, noteId, testMode, testState]);

  // Timer
  useEffect(() => {
    if (testState !== "taking" || !test) return;
    const interval = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [testState, test]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const scrollToQuestion = useCallback((questionId: string) => {
    questionRefs.current.get(questionId)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const startTest = useCallback((mode: TestMode) => {
    setTestMode(mode);
    setAnswers({});
    setElapsedSeconds(0);
    setScore(null);
    setAiGrades({});
    setTestState("taking");
  }, []);

  async function handleSubmit() {
    if (!test) return;
    setTestState("results");
    localStorage.removeItem(`test-answers-${noteId}-${testMode}`);

    // Grade non-short-answer questions immediately
    let correct = 0;
    const totalQuestions = activeQuestions.length;
    for (const question of activeQuestions) {
      if (question.type === "short-answer") continue;
      const userAnswer = answers[question.id]?.trim().toLowerCase() ?? "";
      const correctAnswer = question.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) correct++;
    }

    // Show initial score (without short answers)
    const shortAnswerQuestions = activeQuestions.filter((q) => q.type === "short-answer");
    setScore({ correct, total: totalQuestions, percentage: totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0 });

    // Grade short answers via AI, then update score
    if (shortAnswerQuestions.length > 0) {
      const grades: Record<string, AiGrade> = {};
      for (const question of shortAnswerQuestions) {
        if (!answers[question.id]?.trim()) continue;
        try {
          const grade = await aiService.gradeShortAnswer(
            question.question,
            question.correctAnswer,
            answers[question.id]
          );
          grades[question.id] = grade;
          setAiGrades((prev) => ({ ...prev, [question.id]: grade }));
        } catch {
          grades[question.id] = { score: "incorrect", feedback: "Unable to grade this answer. Please review manually." };
          setAiGrades((prev) => ({
            ...prev,
            [question.id]: grades[question.id],
          }));
        }
      }

      // Recalculate score including AI-graded short answers
      let updatedCorrect = correct;
      for (const question of shortAnswerQuestions) {
        const grade = grades[question.id];
        if (grade?.score === "correct") updatedCorrect += 1;
        else if (grade?.score === "partial") updatedCorrect += 0.5;
      }
      setScore({
        correct: updatedCorrect,
        total: totalQuestions,
        percentage: totalQuestions > 0 ? Math.round((updatedCorrect / totalQuestions) * 100) : 0,
      });
    }
  }

  function handleRetake() {
    setAnswers({});
    setElapsedSeconds(0);
    setScore(null);
    setAiGrades({});
    setTestState("taking");
  }

  function handleReview() { setTestState("review"); }

  // No test yet - show generate button
  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {isGenerating ? "Generating practice test..." : "No Practice Test Yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {isGenerating
              ? "AI is creating a comprehensive test from your content. This may take a moment."
              : "Generate a practice test to start testing your knowledge."}
          </p>
        </div>
        {generateError && <p className="text-sm text-destructive">{generateError}</p>}
        {isGenerating ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Button className="gap-2" onClick={handleGenerate} disabled={!noteContent}>
            <Sparkles className="h-4 w-4" />
            Generate Practice Test
          </Button>
        )}
      </div>
    );
  }

  // Test mode selection screen
  if (testState === "choosing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-8">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">{test.title}</h3>
          <p className="text-sm text-muted-foreground">
            {test.questions.length} questions generated. Choose your test mode.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          {/* Full Test */}
          <button
            type="button"
            onClick={() => startTest("full")}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Full Test</p>
              <p className="text-xs text-muted-foreground mt-1">
                All {test.questions.length} questions
              </p>
              <p className="text-xs text-muted-foreground">
                Comprehensive coverage
              </p>
            </div>
          </button>

          {/* Short Test */}
          <button
            type="button"
            onClick={() => startTest("short")}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">Quick Quiz</p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(5, Math.min(10, Math.ceil(test.questions.filter((q) => q.type !== "short-answer").length * 0.3)))} questions
              </p>
              <p className="text-xs text-muted-foreground">
                Fast knowledge check
              </p>
            </div>
          </button>
        </div>

        {/* Regenerate button */}
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            localStorage.removeItem(`test-data-${noteId}`);
            setTest(null);
            setTestState("idle");
            handleGenerate();
          }}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Generate New Questions
        </Button>
      </div>
    );
  }

  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(answers).filter((key) => answers[key]?.trim().length > 0).length;
  const allAnswered = answeredCount === totalQuestions;

  // Results
  if (testState === "results" && score) {
    return (
      <div className="relative rounded-xl border border-border bg-card p-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-foreground">{test.title}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">Completed in {formatDuration(elapsedSeconds)}</p>
            <Badge variant="secondary" className="text-xs">
              {testMode === "full" ? "Full Test" : "Quick Quiz"}
            </Badge>
          </div>
        </div>
        <TestResults score={score} onRetake={handleRetake} onReview={handleReview} />
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" className="gap-2" onClick={() => setTestState("choosing")}>
            Choose Different Mode
          </Button>
        </div>
      </div>
    );
  }

  const getQuestionState = (questionId: string) => {
    const question = activeQuestions.find((q) => q.id === questionId);
    if (!question) return "unanswered";
    const userAnswer = answers[questionId]?.trim() ?? "";
    if (testState === "review") {
      if (!userAnswer) return "unanswered";
      if (question.type === "short-answer") {
        const grade = aiGrades[questionId];
        if (!grade) return "answered";
        if (grade.score === "correct") return "correct";
        if (grade.score === "partial") return "answered";
        return "incorrect";
      }
      const isCorrect = userAnswer.toLowerCase() === question.correctAnswer.trim().toLowerCase();
      return isCorrect ? "correct" : "incorrect";
    }
    return userAnswer ? "answered" : "unanswered";
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 rounded-xl border border-border bg-card/95 backdrop-blur-sm p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {testState === "review" && (
              <Button variant="ghost" size="icon" onClick={() => setTestState("results")}><ArrowLeft className="h-4 w-4" /></Button>
            )}
            <div>
              <h2 className="text-base font-bold text-foreground">{test.title}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <Badge variant="secondary" className="text-xs">
                  {testMode === "full" ? "Full Test" : "Quick Quiz"}
                </Badge>
                {testState === "review" ? (
                  <Badge variant="secondary" className="text-xs">Review Mode</Badge>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatDuration(elapsedSeconds)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><CheckSquare className="h-3.5 w-3.5" />{answeredCount} / {totalQuestions} answered</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {testState === "taking" && (
              <Button onClick={handleSubmit} disabled={!allAnswered} className="gap-2" size="sm">
                <CheckSquare className="h-4 w-4" />Submit Test
              </Button>
            )}
            {testState === "review" && (
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setTestState("choosing")}>
                Back to Modes
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {activeQuestions.map((question, index) => {
            const state = getQuestionState(question.id);
            return (
              <button key={question.id} type="button" onClick={() => scrollToQuestion(question.id)}
                className={cn("h-7 w-7 rounded-md text-xs font-medium transition-all flex items-center justify-center",
                  state === "unanswered" && "bg-muted text-muted-foreground hover:bg-muted/80",
                  state === "answered" && "bg-primary text-primary-foreground",
                  state === "correct" && "bg-success text-success-foreground",
                  state === "incorrect" && "bg-destructive text-destructive-foreground"
                )} title={`Question ${index + 1}`}>{index + 1}</button>
            );
          })}
        </div>

        {testState === "taking" && (
          <div className="mt-3"><Progress value={answeredCount} max={totalQuestions} className="h-1.5" /></div>
        )}
      </div>

      <div className="space-y-4">
        {activeQuestions.map((question, index) => (
          <div key={question.id} ref={(el) => { if (el) questionRefs.current.set(question.id, el); }}>
            <QuestionCard
              question={{ ...question, userAnswer: answers[question.id], aiGrade: aiGrades[question.id] }}
              index={index}
              onAnswer={handleAnswer}
              showResult={testState === "review"}
            />
          </div>
        ))}
      </div>

      {testState === "taking" && (
        <div className={cn("flex justify-center pb-4", !allAnswered && "opacity-50")}>
          <Button onClick={handleSubmit} disabled={!allAnswered} size="lg" className="gap-2 px-8">
            <CheckSquare className="h-4 w-4" />Submit Test
          </Button>
        </div>
      )}
    </div>
  );
}
