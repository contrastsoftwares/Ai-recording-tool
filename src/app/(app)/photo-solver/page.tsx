"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SolutionSteps } from "@/components/photo-solver/solution-steps";
import { mockPhotoSolverExamples } from "@/lib/mock-data";
import type { PhotoSolverExample } from "@/lib/mock-data";
import {
  Camera,
  Upload,
  ImageIcon,
  Loader2,
  Send,
  BookOpen,
  Zap,
  User,
  Bot,
  Sparkles,
  X,
} from "lucide-react";

interface FollowUpMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const mockFollowUpResponses: Record<string, string> = {
  default:
    "That's a great question! The key concept here is to break down the problem into smaller, manageable steps. Each step builds on the previous one, making the overall solution clearer and easier to understand. Would you like me to elaborate on any specific step?",
};

export default function PhotoSolverPage() {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>(
    []
  );
  const [followUpInput, setFollowUpInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentExample: PhotoSolverExample | undefined =
    mockPhotoSolverExamples.find((e) => e.id === selectedExample);

  function handleExampleClick(exampleId: string) {
    setSelectedExample(exampleId);
    setShowSolution(false);
    setIsLoading(true);
    setFollowUpMessages([]);
    setUploadedFileName(null);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setShowSolution(true);
    }, 2000);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setSelectedExample("calculus"); // default to calculus for demo
    setShowSolution(false);
    setIsLoading(true);
    setFollowUpMessages([]);

    setTimeout(() => {
      setIsLoading(false);
      setShowSolution(true);
    }, 2000);
  }

  function handleSendFollowUp() {
    if (!followUpInput.trim()) return;

    const userMessage: FollowUpMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: followUpInput.trim(),
    };

    setFollowUpMessages((prev) => [...prev, userMessage]);
    setFollowUpInput("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: FollowUpMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: mockFollowUpResponses.default,
      };
      setFollowUpMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  }

  function handleReset() {
    setSelectedExample(null);
    setShowSolution(false);
    setIsLoading(false);
    setFollowUpMessages([]);
    setFollowUpInput("");
    setUploadedFileName(null);
  }

  const hasContent = selectedExample !== null || uploadedFileName !== null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Photo Solver</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Take a photo or upload an image of any problem and get step-by-step
          solutions
        </p>
      </div>

      <div
        className={cn(
          "grid gap-6",
          hasContent ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-1"
        )}
      >
        {/* Left side - Upload area */}
        <div className="space-y-4">
          {/* Upload zone */}
          <div
            className={cn(
              "relative rounded-xl border-2 border-dashed border-border bg-card transition-all",
              !hasContent && "min-h-[320px]",
              hasContent && "min-h-[180px]"
            )}
          >
            {/* Reset button when content shown */}
            {hasContent && (
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {!hasContent ? (
              <label className="flex flex-col items-center justify-center h-full py-12 px-6 cursor-pointer hover:bg-accent/30 transition-colors rounded-xl">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground text-center">
                  Take a photo or upload an image
                </p>
                <p className="text-sm text-muted-foreground mt-1 text-center">
                  of any math, science, or academic problem
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </label>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {uploadedFileName
                    ? uploadedFileName
                    : `Example: ${currentExample?.label}`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Problem image uploaded
                </p>
              </div>
            )}
          </div>

          {/* Example chips */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Or try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {mockPhotoSolverExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => handleExampleClick(example.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all",
                    "hover:bg-accent hover:border-primary/30",
                    selectedExample === example.id &&
                      "border-primary bg-primary/5 ring-1 ring-primary/20"
                  )}
                >
                  {example.id === "calculus" ? (
                    <BookOpen className="h-4 w-4 text-primary" />
                  ) : (
                    <Zap className="h-4 w-4 text-warning" />
                  )}
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Solution */}
        {hasContent && (
          <div className="space-y-4">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border bg-card">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium text-foreground">
                  Analyzing your problem...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Identifying subject and generating solution
                </p>
              </div>
            )}

            {/* Solution display */}
            {showSolution && currentExample && (
              <div className="space-y-4">
                {/* Subject badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="default">{currentExample.subject}</Badge>
                  <Badge variant="secondary">
                    {currentExample.subjectDetail}
                  </Badge>
                  <Sparkles className="h-4 w-4 text-primary ml-1" />
                </div>

                {/* Steps */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Step-by-Step Solution
                  </h3>
                  <SolutionSteps
                    steps={currentExample.steps}
                    finalAnswer={currentExample.finalAnswer}
                  />
                </div>

                {/* Follow-up section */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Ask a Follow-up Question
                  </h3>

                  {/* Messages */}
                  {followUpMessages.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-thin">
                      {followUpMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex gap-2.5",
                            msg.role === "user" && "flex-row-reverse"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {msg.role === "user" ? (
                              <User className="h-3.5 w-3.5" />
                            ) : (
                              <Bot className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div
                            className={cn(
                              "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      placeholder="e.g., Can you explain step 2 in more detail?"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendFollowUp();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendFollowUp}
                      disabled={!followUpInput.trim()}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
