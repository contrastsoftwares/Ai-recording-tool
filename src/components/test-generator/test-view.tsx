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
  X,
} from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

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

interface SavedResults {
  score: { correct: number; total: number; percentage: number };
  answers: Record<string, string>;
  aiGrades: Record<string, AiGrade>;
  elapsedSeconds: number;
  testMode: TestMode;
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TestView({ noteId, noteContent }: TestViewProps) {
  const t = useTranslation();
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
  // Track quiz version to allow re-generating quick quiz questions
  const [quizVersion, setQuizVersion] = useState(0);
  // Saved results so user can return to them from mode chooser
  const [savedResults, setSavedResults] = useState<SavedResults | null>(null);

  // Persist test data
  useEffect(() => {
    if (test) {
      localStorage.setItem(`test-data-${noteId}`, JSON.stringify(test));
    }
  }, [test, noteId]);

  // Get questions based on mode, scrambled for both modes
  const activeQuestions = useMemo(() => {
    if (!test) return [];

    if (testMode === "full") {
      // Full test: all questions, scrambled order
      return shuffle(test.questions);
    }

    // Quick quiz: exclude short-answer, pick ~30% with weighted selection, scrambled
    const nonShortAnswer = test.questions.filter((q) => q.type !== "short-answer");
    const quizSize = Math.max(5, Math.min(10, Math.ceil(nonShortAnswer.length * 0.3)));

    // Load question frequency data from localStorage for weighted selection
    let questionFreq: Record<string, number> = {};
    try {
      questionFreq = JSON.parse(localStorage.getItem(`question-freq-${noteId}`) || "{}");
    } catch {
      questionFreq = {};
    }

    // Weighted selection: sort by frequency (ascending) so least-shown questions come first
    // Add jitter to break ties randomly
    const sortedByFreq = [...nonShortAnswer].sort((a, b) => {
      const freqA = questionFreq[a.id] || 0;
      const freqB = questionFreq[b.id] || 0;
      if (freqA !== freqB) return freqA - freqB;
      return Math.random() - 0.5; // random tie-breaking
    });

    // Pick the least-shown questions up to quizSize
    const picked = sortedByFreq.slice(0, quizSize);

    return shuffle(picked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, testMode, quizVersion]);

  // Shuffle MCQ options for each question (stable per quiz version)
  const shuffledOptionsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const q of activeQuestions) {
      if (q.type === "multiple-choice" && q.options) {
        map[q.id] = shuffle(q.options);
      }
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestions]);

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
      setSavedResults(null);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Failed to generate test.");
    } finally {
      setIsGenerating(false);
    }
  }, [noteContent]);

  const handleRegenerate = useCallback(async () => {
    if (!noteContent) return;
    // Clear existing test data from localStorage
    localStorage.removeItem(`test-data-${noteId}`);
    localStorage.removeItem(`test-answers-${noteId}-full`);
    localStorage.removeItem(`test-answers-${noteId}-short`);
    localStorage.removeItem(`question-freq-${noteId}`);
    localStorage.removeItem(`prev-quiz-ids-${noteId}`);
    setTest(null);
    setSavedResults(null);
    setScore(null);
    setAiGrades({});
    setAnswers({});
    // Now generate fresh
    await handleGenerate();
  }, [noteContent, noteId, handleGenerate]);

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
    // Clear saved answers so stale answers don't get restored by the useEffect
    localStorage.removeItem(`test-answers-${noteId}-${mode}`);
    // Force re-compute of quiz questions when starting (for scramble)
    setQuizVersion((v) => v + 1);
    setTestState("taking");
  }, [noteId]);

  // Update question frequency tracking when taking a quick quiz
  useEffect(() => {
    if (testState === "taking" && testMode === "short" && activeQuestions.length > 0) {
      // Update frequency counts
      let questionFreq: Record<string, number> = {};
      try {
        questionFreq = JSON.parse(localStorage.getItem(`question-freq-${noteId}`) || "{}");
      } catch {
        questionFreq = {};
      }
      for (const q of activeQuestions) {
        questionFreq[q.id] = (questionFreq[q.id] || 0) + 1;
      }
      localStorage.setItem(`question-freq-${noteId}`, JSON.stringify(questionFreq));

      // Also save prev quiz IDs for backward compat
      localStorage.setItem(
        `prev-quiz-ids-${noteId}`,
        JSON.stringify(activeQuestions.map((q) => q.id))
      );
    }
  }, [testState, testMode, activeQuestions, noteId]);

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
          grades[question.id] = { score: "incorrect", feedback: t.test.unableToGrade };
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

  function handleReview() { setTestState("review"); }

  // Save current results and go to mode chooser
  function handleGoToChooser() {
    if (score) {
      setSavedResults({
        score,
        answers,
        aiGrades,
        elapsedSeconds,
        testMode,
      });
    }
    setTestState("choosing");
  }

  // Restore saved results
  function handleRestoreResults() {
    if (savedResults) {
      setScore(savedResults.score);
      setAnswers(savedResults.answers);
      setAiGrades(savedResults.aiGrades);
      setElapsedSeconds(savedResults.elapsedSeconds);
      setTestMode(savedResults.testMode);
      setTestState("results");
    }
  }

  // No test yet - show generate button
  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2 mx-auto">
          <h3 className="text-lg font-semibold text-foreground">
            {isGenerating ? t.test.generating : t.test.noPracticeTest}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {isGenerating
              ? t.test.generatingDesc
              : t.test.generateDesc}
          </p>
        </div>
        {generateError && <p className="text-sm text-destructive">{generateError}</p>}
        {isGenerating ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Button className="gap-2" onClick={handleGenerate} disabled={!noteContent}>
            <Sparkles className="h-4 w-4" />
            {t.test.generate}
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
            {`${test.questions.length} ${t.test.questionsGenerated}`}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          {/* Full Test */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => startTest("full")}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all text-center w-full"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ListChecks className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{t.test.fullTest}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {`${t.test.allQuestions} (${test.questions.length})`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.test.comprehensive}
                </p>
              </div>
            </button>
          </div>

          {/* Short Test + Remake Quiz under it */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => startTest("short")}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 hover:border-primary/50 hover:bg-primary/5 transition-all text-center w-full"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{t.test.quickQuiz}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.max(5, Math.min(10, Math.ceil(test.questions.filter((q) => q.type !== "short-answer").length * 0.3)))} {t.test.allQuestions}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.test.newMix}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* View Last Results / Remake All actions */}
        <div className="flex flex-col items-center gap-3">
          {savedResults && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleRestoreResults}
            >
              <CheckSquare className="h-4 w-4" />
              {t.test.viewLastResults}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleRegenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {t.test.remakeQuiz}
          </Button>
        </div>
      </div>
    );
  }

  const totalQuestions = activeQuestions.length;
  const activeQuestionIds = new Set(activeQuestions.map((q) => q.id));
  const answeredCount = Object.keys(answers).filter((key) => activeQuestionIds.has(key) && answers[key]?.trim().length > 0).length;
  const allAnswered = answeredCount === totalQuestions;

  // Results
  if (testState === "results" && score) {
    return (
      <div className="relative rounded-xl border border-border bg-card p-6">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-foreground">{test.title}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">{t.test.completedIn} {formatDuration(elapsedSeconds)}</p>
            <Badge variant="secondary" className="text-xs">
              {testMode === "full" ? t.test.fullTest : t.test.quickQuiz}
            </Badge>
          </div>
        </div>
        <TestResults score={score} onRemake={handleRegenerate} onReview={handleReview} onRetry={() => startTest(testMode)} />
        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" className="gap-2" onClick={handleGoToChooser}>
            {t.test.chooseDifferentMode}
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
                  {testMode === "full" ? t.test.fullTest : t.test.quickQuiz}
                </Badge>
                {testState === "review" ? (
                  <Badge variant="secondary" className="text-xs">{t.test.reviewMode}</Badge>
                ) : (
                  <>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{formatDuration(elapsedSeconds)}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><CheckSquare className="h-3.5 w-3.5" />{answeredCount} / {totalQuestions} {t.test.answered}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {testState === "taking" && (
              <Button onClick={handleSubmit} disabled={!allAnswered} className="gap-2" size="sm">
                <CheckSquare className="h-4 w-4" />{t.test.submitTest}
              </Button>
            )}
            {testState === "review" && (
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setTestState("choosing")}>
                {t.test.backToModes}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30"
              onClick={() => setTestState("choosing")}
              title={t.test.exitQuiz}
            >
              <X className="h-4 w-4" />
            </Button>
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
                )} title={`${t.test.question} ${index + 1}`}>{index + 1}</button>
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
              question={{
                ...question,
                options: shuffledOptionsMap[question.id] || question.options,
                userAnswer: answers[question.id],
                aiGrade: aiGrades[question.id],
              }}
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
            <CheckSquare className="h-4 w-4" />{t.test.submitTest}
          </Button>
        </div>
      )}
    </div>
  );
}
