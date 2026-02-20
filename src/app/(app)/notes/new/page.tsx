"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  SlidersHorizontal,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadZone } from "@/components/notes/upload-zone";
import { FormatSelector } from "@/components/notes/format-selector";
import { useNotesStore } from "@/stores/notes-store";
import type { NoteFormat, Note } from "@/types/note";

type Step = "upload" | "format" | "processing" | "done";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "format", label: "Format", icon: SlidersHorizontal },
  { id: "processing", label: "Processing", icon: Sparkles },
];

const processingMessages = [
  "Analyzing your content...",
  "Extracting key information...",
  "Generating transcript...",
  "Organizing notes...",
  "Applying formatting...",
  "Finalizing your notes...",
];

export default function NewNotePage() {
  const router = useRouter();
  const addNote = useNotesStore((state) => state.addNote);

  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState(
    processingMessages[0]
  );

  const handleUploadComplete = useCallback(() => {
    setCurrentStep("format");
  }, []);

  const handleFormatSelected = useCallback(() => {
    setCurrentStep("processing");
  }, []);

  // Simulated processing effect
  useEffect(() => {
    if (currentStep !== "processing") return;

    setProgress(0);
    setProcessingMessage(processingMessages[0]);

    let currentProgress = 0;
    const totalDuration = 4000; // 4 seconds total
    const intervalMs = 80;
    const increment = 100 / (totalDuration / intervalMs);

    const interval = setInterval(() => {
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Create the note and redirect
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title: "Untitled Notes",
          content:
            "# AI-Generated Notes\n\n" +
            "## Key Points\n\n" +
            "- The material covers several foundational concepts that are essential for understanding this topic.\n" +
            "- Important terminology and definitions have been identified and organized below.\n" +
            "- Relationships between concepts are highlighted to support deeper comprehension.\n\n" +
            "## Detailed Notes\n\n" +
            "The primary subject introduces core principles that form the foundation for more advanced study. " +
            "Understanding these basics is critical before moving on to applied topics.\n\n" +
            "Key definitions include the fundamental terms used throughout this field. " +
            "Each concept builds upon the previous one, creating a logical progression of knowledge.\n\n" +
            "## Summary\n\n" +
            "This material provides a comprehensive overview of the topic, covering essential concepts, " +
            "terminology, and their practical applications. Review the key points above for exam preparation.",
          formats: ["bullet-points"] as NoteFormat[],
          sourceType: "video",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          isFavorite: false,
        };

        addNote(newNote);
        setCurrentStep("done");

        // Redirect to the new note after a brief delay
        setTimeout(() => {
          router.push(`/notes/${newNote.id}`);
        }, 1200);
      }

      setProgress(Math.min(currentProgress, 100));

      // Update processing message based on progress
      const messageIndex = Math.min(
        Math.floor((currentProgress / 100) * processingMessages.length),
        processingMessages.length - 1
      );
      setProcessingMessage(processingMessages[messageIndex]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [currentStep, addNote, router]);

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => router.push("/notes")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create New Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your content and let AI generate notes for you
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep || step.id === "done";
          const isCompleted =
            currentStep === "done" || idx < stepIndex;

          return (
            <div key={step.id} className="flex items-center gap-2">
              {idx > 0 && (
                <div
                  className={cn(
                    "hidden sm:block h-px w-8 transition-colors",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "hidden sm:inline text-sm font-medium",
                    isActive || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {/* Step 1: Upload */}
        {currentStep === "upload" && (
          <div className="space-y-6">
            <UploadZone />
            <div className="flex justify-end">
              <Button onClick={handleUploadComplete} size="lg">
                Continue to Format Selection
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Format selection */}
        {currentStep === "format" && (
          <div className="space-y-6">
            <FormatSelector />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleFormatSelected} size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Notes
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {currentStep === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              Generating Your Notes
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {processingMessage}
            </p>

            <div className="w-full max-w-md space-y-2">
              <Progress value={progress} />
              <p className="text-center text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Done (briefly shown before redirect) */}
        {currentStep === "done" && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Notes Generated Successfully!
            </h3>
            <p className="text-sm text-muted-foreground">
              Redirecting to your new notes...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
