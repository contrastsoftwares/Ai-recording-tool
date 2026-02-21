"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload,
  SlidersHorizontal,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadZone } from "@/components/notes/upload-zone";
import { FormatSelector } from "@/components/notes/format-selector";
import { useNotesStore } from "@/stores/notes-store";
import { useUploadStore } from "@/stores/upload-store";
import { aiService } from "@/lib/ai-service";
import type { NoteFormat, Note, UploadType } from "@/types/note";

type Step = "upload" | "format" | "processing" | "done";

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "format", label: "Format", icon: SlidersHorizontal },
  { id: "processing", label: "Processing", icon: Sparkles },
];

function NewNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addNote = useNotesStore((state) => state.addNote);
  const uploadStore = useUploadStore();

  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [progress, setProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<NoteFormat[]>([]);

  // Track uploaded content
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const processingRef = useRef(false);

  // Check if coming from recorder with a pre-loaded file
  useEffect(() => {
    const source = searchParams.get("source");
    if (source === "recording" && uploadStore.file) {
      setSelectedFile(uploadStore.file);
      setCurrentStep("format");
    }
  }, [searchParams, uploadStore.file]);

  const handleFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
    setSelectedUrl(null);
    setError(null);
  }, []);

  const handleUrlSubmitted = useCallback((url: string) => {
    setSelectedUrl(url);
    setSelectedFile(null);
    setError(null);
  }, []);

  const handleUploadComplete = useCallback(() => {
    if (!selectedFile && !selectedUrl) {
      setError("Please upload a file or paste a URL first.");
      return;
    }
    setError(null);
    setCurrentStep("format");
  }, [selectedFile, selectedUrl]);

  const handleFormatsChange = useCallback((formats: NoteFormat[]) => {
    setSelectedFormats(formats);
  }, []);

  const handleGenerateNotes = useCallback(async () => {
    if (selectedFormats.length === 0) {
      setError("Please select at least one note format.");
      return;
    }
    if (processingRef.current) return;
    processingRef.current = true;

    setError(null);
    setCurrentStep("processing");
    setProgress(0);

    try {
      let content = "";
      let title: string | undefined;
      let sourceType: UploadType = "document";

      // Step 1: Extract content
      if (selectedUrl) {
        setProcessingMessage("Extracting content from URL...");
        setProgress(10);

        const extracted = await aiService.extractContent({ url: selectedUrl });
        content = extracted.content;
        title = extracted.title;
        sourceType = (extracted.sourceType as UploadType) || "link";
        setProgress(30);
      } else if (selectedFile) {
        const fileType = selectedFile.type;

        if (fileType.startsWith("audio/") || fileType.startsWith("video/")) {
          // Transcribe audio/video (streams progress for large files)
          setProcessingMessage("Transcribing your recording...");
          setProgress(10);

          const transcribeResult = await aiService.transcribe(
            selectedFile,
            (data) => {
              setProcessingMessage(data.message);
              // Map streaming percent (5-95) into our UI range (10-40)
              setProgress(10 + (data.percent / 100) * 30);
            }
          );
          content = transcribeResult.transcript;
          title = selectedFile.name.replace(/\.[^.]+$/, "");
          sourceType = fileType.startsWith("audio/") ? "audio" : "video";
          setProgress(40);
        } else if (fileType === "application/pdf") {
          // Extract PDF text
          setProcessingMessage("Extracting text from PDF...");
          setProgress(10);

          const extracted = await aiService.extractContent(
            { file: selectedFile },
            "pdf"
          );
          content = extracted.content;
          title = extracted.title;
          sourceType = "pdf";
          setProgress(30);
        } else if (fileType.startsWith("image/")) {
          // For images, we'll generate notes describing what's in the image
          setProcessingMessage("Analyzing image...");
          setProgress(10);

          const solution = await aiService.solvePhoto(selectedFile);
          content = `Problem: ${solution.problem}\n\nSteps:\n${solution.steps.map((s) => `${s.stepNumber}. ${s.title}: ${s.explanation}`).join("\n")}\n\nFinal Answer: ${solution.finalAnswer}`;
          title = solution.problem.slice(0, 60);
          sourceType = "image";
          setProgress(30);
        } else {
          // Text/document files
          setProcessingMessage("Reading document...");
          setProgress(10);

          const extracted = await aiService.extractContent({
            file: selectedFile,
          });
          content = extracted.content;
          title = extracted.title;
          sourceType = "document";
          setProgress(30);
        }
      }

      if (!content) {
        throw new Error(
          "No content could be extracted. Please try a different file or URL."
        );
      }

      // Step 2: Generate notes
      setProcessingMessage("Generating AI-powered notes...");
      setProgress(50);

      const notesResult = await aiService.generateNotes(
        content,
        selectedFormats,
        title
      );

      setProgress(80);
      setProcessingMessage("Finalizing your notes...");

      // Step 3: Create note and save to store
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: notesResult.title || title || "Untitled Notes",
        content: notesResult.content,
        formats: selectedFormats,
        sourceType,
        sourceUrl: selectedUrl || undefined,
        transcript: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: notesResult.tags || [],
        isFavorite: false,
      };

      addNote(newNote);
      setProgress(100);
      setCurrentStep("done");

      // Clear upload store
      uploadStore.clear();

      // Redirect to the new note
      setTimeout(() => {
        router.push(`/notes/${newNote.id}`);
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setCurrentStep("format");
    } finally {
      processingRef.current = false;
    }
  }, [selectedFormats, selectedUrl, selectedFile, addNote, router, uploadStore]);

  const hasContent = selectedFile !== null || selectedUrl !== null;
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
          const isCompleted = currentStep === "done" || idx < stepIndex;

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

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Step content */}
      <div className="min-h-[400px]">
        {/* Step 1: Upload */}
        {currentStep === "upload" && (
          <div className="space-y-6">
            <UploadZone
              onFileSelected={handleFileSelected}
              onUrlSubmitted={handleUrlSubmitted}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleUploadComplete}
                size="lg"
                disabled={!hasContent}
              >
                Continue to Format Selection
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Format selection */}
        {currentStep === "format" && (
          <div className="space-y-6">
            {/* Show what was uploaded */}
            <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
              <p className="text-sm text-foreground">
                <span className="font-medium">Source: </span>
                {selectedFile ? selectedFile.name : selectedUrl}
              </p>
            </div>

            <FormatSelector onFormatsChange={handleFormatsChange} />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleGenerateNotes}
                size="lg"
                disabled={selectedFormats.length === 0}
              >
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

export default function NewNotePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <NewNoteContent />
    </Suspense>
  );
}
