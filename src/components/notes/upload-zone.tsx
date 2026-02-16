"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  CloudUpload,
  Upload,
  Link2,
  Mic,
  FileVideo,
  FileText,
  Music,
  FileSpreadsheet,
  Image,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type InputMethod = "file" | "url" | "record";

const fileTypeBadges = [
  { label: "MP4", icon: FileVideo, color: "text-blue-500 bg-blue-500/10" },
  { label: "PDF", icon: FileText, color: "text-red-500 bg-red-500/10" },
  { label: "MP3", icon: Music, color: "text-amber-500 bg-amber-500/10" },
  { label: "DOCX", icon: FileSpreadsheet, color: "text-indigo-500 bg-indigo-500/10" },
  { label: "JPG", icon: Image, color: "text-violet-500 bg-violet-500/10" },
  { label: "URL", icon: Globe, color: "text-emerald-500 bg-emerald-500/10" },
];

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMethod, setActiveMethod] = useState<InputMethod>("file");
  const [urlValue, setUrlValue] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Decorative only - no actual upload
  }, []);

  const inputMethods: { id: InputMethod; label: string; icon: React.ElementType }[] = [
    { id: "file", label: "File Upload", icon: Upload },
    { id: "url", label: "Paste URL", icon: Link2 },
    { id: "record", label: "Record", icon: Mic },
  ];

  return (
    <div className="space-y-4">
      {/* Input method tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {inputMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setActiveMethod(method.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
                activeMethod === method.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{method.label}</span>
            </button>
          );
        })}
      </div>

      {/* File upload drop zone */}
      {activeMethod === "file" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12",
            "transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/40 hover:bg-muted/50"
          )}
        >
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <CloudUpload
              className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <p className="text-base font-medium text-foreground mb-1">
            {isDragging ? "Drop your files here" : "Drop files here or click to browse"}
          </p>
          <p className="text-sm text-muted-foreground">
            Videos, PDFs, Audio, Documents, Images
          </p>
        </div>
      )}

      {/* URL input */}
      {activeMethod === "url" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-2">
            <Link2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Paste a YouTube link, article URL, or any web page
          </p>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              className="flex-1"
            />
            <Button disabled={!urlValue.trim()}>
              Generate
            </Button>
          </div>
        </div>
      )}

      {/* Record option */}
      {activeMethod === "record" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Mic className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground mb-1">
                Record audio or screen
              </p>
              <p className="text-sm text-muted-foreground">
                Capture a lecture, meeting, or screen recording
              </p>
            </div>
            <Link href="/recorder">
              <Button>
                <Mic className="h-4 w-4 mr-2" />
                Open Recorder
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* File type badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {fileTypeBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
                badge.color
              )}
            >
              <Icon className="h-3 w-3" />
              {badge.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
