"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  Plus,
  RotateCcw,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

const MAX_IMAGES = 20;
const STORAGE_KEY = "photo-solver-session";

interface FollowUpMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface StoredImage {
  name: string;
  type: string;
  dataUrl: string;
}

interface StoredSession {
  images: StoredImage[];
  solution: SolvePhotoResult | null;
  followUpMessages: FollowUpMessage[];
}

/** Convert a File to a storable object with a data URL */
function fileToStoredImage(file: File): Promise<StoredImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        dataUrl: reader.result as string,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Convert a stored image back into a File */
function storedImageToFile(stored: StoredImage): File {
  const arr = stored.dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || stored.type;
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], stored.name, { type: mime });
}

function saveSession(session: StoredSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage might be full or unavailable; silently fail
  }
}

function loadSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function PhotoSolverPage() {
  const t = useTranslation();

  // Core state
  const [uploadedImages, setUploadedImages] = useState<StoredImage[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolvePhotoResult | null>(null);
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // ---- Restore session from sessionStorage on mount ----
  useEffect(() => {
    const stored = loadSession();
    if (stored) {
      setUploadedImages(stored.images);
      setSolution(stored.solution);
      setFollowUpMessages(stored.followUpMessages);
      if (stored.solution) {
        setShowSolution(true);
      }
    }
    setHydrated(true);
  }, []);

  // ---- Persist to sessionStorage whenever important state changes ----
  useEffect(() => {
    if (!hydrated) return;
    saveSession({
      images: uploadedImages,
      solution,
      followUpMessages,
    });
  }, [uploadedImages, solution, followUpMessages, hydrated]);

  // ---- Handle adding files (initial or additional) ----
  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = MAX_IMAGES - uploadedImages.length;
      if (remaining <= 0) {
        setError(`Maximum ${MAX_IMAGES} images allowed per session.`);
        return;
      }
      const toAdd = fileArray.slice(0, remaining);
      if (toAdd.length < fileArray.length) {
        setError(`Only ${remaining} more image(s) can be added (max ${MAX_IMAGES}).`);
      } else {
        setError(null);
      }

      const newStored = await Promise.all(toAdd.map(fileToStoredImage));
      setUploadedImages((prev) => [...prev, ...newStored]);
    },
    [uploadedImages.length]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      addFiles(files);
      // Reset input so re-selecting the same file works
      e.target.value = "";
    },
    [addFiles]
  );

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ---- Solve ----
  const handleSolve = useCallback(async () => {
    if (uploadedImages.length === 0) return;
    setIsLoading(true);
    setError(null);
    setShowSolution(false);
    setSolution(null);
    setFollowUpMessages([]);

    try {
      const files = uploadedImages.map(storedImageToFile);
      const result = await aiService.solvePhoto(files);
      setSolution(result);
      setShowSolution(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze the image(s).";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImages]);

  // ---- Follow-up chat ----
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
        content: response.content,
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

  // ---- New Session (full reset + storage cleanup) ----
  function handleNewSession() {
    setUploadedImages([]);
    setShowSolution(false);
    setIsLoading(false);
    setError(null);
    setSolution(null);
    setFollowUpMessages([]);
    setFollowUpInput("");
    clearSession();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (addMoreInputRef.current) addMoreInputRef.current.value = "";
  }

  const hasImages = uploadedImages.length > 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.photoSolver.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.photoSolver.subtitle}
          </p>
        </div>
        {hasImages && (
          <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={handleNewSession}>
            <RotateCcw className="h-4 w-4" />
            {t.photoSolver.newSession}
          </Button>
        )}
      </div>

      <div className={cn("grid gap-6", hasImages ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-1")}>
        {/* Left side - Upload area + thumbnails + Follow-up chat */}
        <div className="space-y-4">
          {/* Upload area */}
          <div className={cn("relative rounded-xl border-2 border-dashed border-border bg-card transition-all", !hasImages && "min-h-[320px]")}>
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              ref={addMoreInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              id="photo-solver-camera"
              onChange={handleFileUpload}
            />

            {!hasImages ? (
              <div className="flex flex-col items-center justify-center h-full py-12 px-6 rounded-xl">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground text-center">{t.photoSolver.takeOrUpload}</p>
                <p className="text-sm text-muted-foreground mt-1 text-center">{t.photoSolver.ofAnyProblem}</p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {t.photoSolver.uploadUpTo}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                    {t.photoSolver.uploadImages}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => document.getElementById("photo-solver-camera")?.click()}>
                    <Camera className="h-4 w-4" />
                    {t.photoSolver.takePhoto}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {/* Thumbnail grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={`${img.name}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                        title={t.photoSolver.removeImage}
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                        <p className="text-[10px] text-white truncate">{img.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add more button */}
                  {uploadedImages.length < MAX_IMAGES && (
                    <button
                      onClick={() => addMoreInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-1 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{t.photoSolver.addMore}</span>
                    </button>
                  )}
                </div>

                {/* Image count + solve button */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {uploadedImages.length} / {MAX_IMAGES} {t.photoSolver.imagesLabel}
                  </p>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={handleSolve}
                    disabled={isLoading || uploadedImages.length === 0}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {t.photoSolver.solveNow}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Follow-up chat moved under the photo */}
          {showSolution && solution && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t.photoSolver.askFollowUp}</h3>

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
                        {t.photoSolver.thinking}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder={t.photoSolver.followUpPlaceholder}
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

        {/* Right side - Solution */}
        {hasImages && (
          <div className="space-y-4">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border bg-card">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm font-medium text-foreground">{t.photoSolver.analyzing}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.photoSolver.analyzingSubtext}</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Solution display */}
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
                  <h3 className="text-sm font-semibold text-foreground mb-2">{t.photoSolver.problem}</h3>
                  <p className="text-sm text-muted-foreground">{solution.problem}</p>
                </div>

                {/* Steps */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">{t.photoSolver.stepByStep}</h3>
                  <SolutionSteps steps={solution.steps} finalAnswer={solution.finalAnswer} />
                </div>
              </div>
            )}

            {/* Prompt to solve if images uploaded but no solution yet */}
            {!isLoading && !showSolution && !error && (
              <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border bg-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{t.photoSolver.readyToSolve}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.photoSolver.clickSolve}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
