"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  CheckCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
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

interface UploadZoneProps {
  onFileSelected?: (file: File) => void;
  onUrlSubmitted?: (url: string) => void;
}

export function UploadZone({ onFileSelected, onUrlSubmitted }: UploadZoneProps) {
  const router = useRouter();
  const t = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [activeMethod, setActiveMethod] = useState<InputMethod>("file");
  const [urlValue, setUrlValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelected?.(file);
    }
  }, [onFileSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelected?.(file);
    }
  }, [onFileSelected]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUrlGenerate = useCallback(() => {
    if (urlValue.trim()) {
      onUrlSubmitted?.(urlValue.trim());
    }
  }, [urlValue, onUrlSubmitted]);

  const inputMethods: { id: InputMethod; label: string; icon: React.ElementType }[] = [
    { id: "file", label: t.uploadZone.fileUpload, icon: Upload },
    { id: "url", label: t.uploadZone.pasteUrl, icon: Link2 },
    { id: "record", label: t.uploadZone.record, icon: Mic },
  ];

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*,.pdf,.doc,.docx,image/*"
        className="hidden"
        onChange={handleFileChange}
      />

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
        <>
          {selectedFile ? (
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-primary bg-primary/5 p-8">
              <button
                onClick={handleClearFile}
                className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <p className="text-base font-medium text-foreground mb-1">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div
              onClick={handleBrowseClick}
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
                {isDragging ? t.uploadZone.dropHere : t.uploadZone.dropOrClick}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.uploadZone.supportedFormats}
              </p>
            </div>
          )}
        </>
      )}

      {/* URL input */}
      {activeMethod === "url" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-2">
            <Link2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {t.uploadZone.urlDesc}
          </p>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder={t.uploadZone.urlPlaceholder}
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && urlValue.trim()) {
                  handleUrlGenerate();
                }
              }}
              className="flex-1"
            />
            <Button disabled={!urlValue.trim()} onClick={handleUrlGenerate}>
              {t.uploadZone.generate}
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
                {t.uploadZone.recordDesc}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.uploadZone.recordSubDesc}
              </p>
            </div>
            <Link href="/recorder">
              <Button>
                <Mic className="h-4 w-4 mr-2" />
                {t.uploadZone.openRecorder}
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
