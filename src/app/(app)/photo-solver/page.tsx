"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SolutionSteps } from "@/components/photo-solver/solution-steps";
import { renderMessageContent } from "@/components/chat/chat-message";
import { aiService } from "@/lib/ai-service";
import type { SolvePhotoResult } from "@/lib/ai-service";
import {
  Camera,
  Upload,
  ImageIcon,
  Loader2,
  Send,
  User,
  Bot,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";

interface FollowUpMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function PhotoSolverPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolvePhotoResult | null>(null);
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadedFileName(file.name);
    setShowSolution(false);
    setIsLoading(true);
    setError(null);
    setFollowUpMessages([]);
    setSolution(null);

    try {
      const result = await aiService.solvePhoto(file);
      setSolution(result);
      setShowSolution(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze the image.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendFollowUp = useCallback(async () => {
    if (!followUpInput.trim() || !solution) return;

    const userMessage: FollowUpMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: followUpInput.trim(),
    };

    setFollowUpMessages((prev) => [...prev, userMessage]);
    setFollowUpInput("");
    setIsFollowUpLoading(true);

    try {
      const context = `Problem: ${solution.problem}\n\nSolution Steps:\n${solution.steps.map((s) => `${s.stepNumber}. ${s.title}: ${s.explanation}${s.math ? ` (${s.math})` : ""}`).join("\n")}\n\nFinal Answer: ${solution.finalAnswer}`;

      const allMessages = [
        ...followUpMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: followUpInput.trim() },
      ];

      const response = await aiService.chat(context, allMessages);

      const assistantMessage: FollowUpMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: response,
      };
      setFollowUpMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: FollowUpMessage = {
        id: `msg-${Date.now()}-err`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setFollowUpMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsFollowUpLoading(false);
    }
  }, [followUpInput, solution, followUpMessages]);

  function handleReset() {
    setUploadedFile(null);
    setUploadedFileName(null);
    setShowSolution(false);
    setIsLoading(false);
    setError(null);
    setSolution(null);
    setFollowUpMessages([]);
    setFollowUpInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const hasContent = uploadedFile !== null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Photo Solver</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Take a photo or upload an image of any problem and get step-by-step solutions
        </p>
      </div>

      <div className={cn("grid gap-6", hasContent ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-1")}>
        {/* Left side - Upload area + Follow-up chat */}
        <div className="space-y-4">
          <div className={cn("relative rounded-xl border-2 border-dashed border-border bg-card transition-all", !hasContent && "min-h-[320px]", hasContent && "min-h-[180px]")}>
            {hasContent && (
              <button onClick={handleReset} className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}

            {!hasContent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-6 rounded-xl">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <input type="file" accept="image/*" capture="environment" className="hidden" id="photo-solver-camera" onChange={handleFileUpload} />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground text-center">Take a photo or upload an image</p>
                <p className="text-sm text-muted-foreground mt-1 text-center">of any math, science, or academic problem</p>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => document.getElementById("photo-solver-camera")?.click()}>
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{uploadedFileName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Problem image uploaded</p>
              </div>
            )}
          </div>

          {/* Follow-up chat moved under the photo */}
          {showSolution && solution && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Ask a Follow-up Question</h3>

              {followUpMessages.length > 0 && (
                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto scrollbar-thin">
                  {followUpMessages.map((msg) => (
                    <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}>
                      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                      </div>
                      <div className={cn("rounded-lg px-3 py-2 text-sm max-w-[80%]", msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                        {msg.role === "assistant" ? renderMessageContent(msg.content) : msg.content}
                      </div>
                    </div>
                  ))}
                  {isFollowUpLoading && (
                    <div className="flex gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  disabled={isFollowUpLoading}
                />
                <Button onClick={handleSendFollowUp} disabled={!followUpInput.trim() || isFollowUpLoading} size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Solution (extended to fill full height) */}
        {hasContent && (
          <div className="space-y-4">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border bg-card">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium text-foreground">Analyzing your problem...</p>
                <p className="text-xs text-muted-foreground mt-1">Using AI to identify and solve the problem</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Solution display - no follow-up section here, it's on the left now */}
            {showSolution && solution && (
              <div className="space-y-4">
                {/* Subject badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="default">{solution.subject}</Badge>
                  <Badge variant="secondary">{solution.subjectDetail}</Badge>
                  <Sparkles className="h-4 w-4 text-primary ml-1" />
                </div>

                {/* Problem statement */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Problem</h3>
                  <p className="text-sm text-muted-foreground">{solution.problem}</p>
                </div>

                {/* Steps - takes up the full remaining space */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Step-by-Step Solution</h3>
                  <SolutionSteps steps={solution.steps} finalAnswer={solution.finalAnswer} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
