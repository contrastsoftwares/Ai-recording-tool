"use client";

import { useState } from "react";
import {
  List,
  AlignLeft,
  LayoutGrid,
  ListOrdered,
  Key,
  FileText,
  Clock,
  HelpCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NoteFormat } from "@/types/note";

export type NoteLength = "short" | "medium" | "long";

interface FormatOption {
  id: NoteFormat;
  label: string;
  description: string;
  icon: React.ElementType;
}

const formatOptions: FormatOption[] = [
  {
    id: "bullet-points",
    label: "Bullet Points",
    description: "Concise bullet point summaries",
    icon: List,
  },
  {
    id: "sentences",
    label: "Sentences",
    description: "Full paragraph explanations",
    icon: AlignLeft,
  },
  {
    id: "cornell",
    label: "Cornell Notes",
    description: "Two-column: cues + notes + summary",
    icon: LayoutGrid,
  },
  {
    id: "outline",
    label: "Outline",
    description: "Hierarchical numbered structure",
    icon: ListOrdered,
  },
  {
    id: "key-concepts",
    label: "Key Concepts",
    description: "Terms and definitions",
    icon: Key,
  },
  {
    id: "summary",
    label: "Summary",
    description: "Brief overview of main points",
    icon: FileText,
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "Chronological event sequence",
    icon: Clock,
  },
  {
    id: "qa-format",
    label: "Q&A Format",
    description: "Question and answer pairs",
    icon: HelpCircle,
  },
];

const lengthOptions: { id: NoteLength; label: string; description: string }[] = [
  {
    id: "short",
    label: "Short",
    description: "Brief and concise notes",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Balanced detail level",
  },
  {
    id: "long",
    label: "Long",
    description: "Full detailed notes",
  },
];

interface FormatSelectorProps {
  onFormatsChange?: (formats: NoteFormat[]) => void;
  onLengthChange?: (length: NoteLength) => void;
}

export function FormatSelector({ onFormatsChange, onLengthChange }: FormatSelectorProps) {
  const [selectedFormats, setSelectedFormats] = useState<NoteFormat[]>([]);
  const [selectedLength, setSelectedLength] = useState<NoteLength>("medium");

  const toggleFormat = (formatId: NoteFormat) => {
    const updated = selectedFormats.includes(formatId)
      ? selectedFormats.filter((id) => id !== formatId)
      : [...selectedFormats, formatId];
    setSelectedFormats(updated);
    onFormatsChange?.(updated);
  };

  const handleLengthChange = (length: NoteLength) => {
    setSelectedLength(length);
    onLengthChange?.(length);
  };

  return (
    <div className="space-y-6">
      {/* Note length selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Note Length
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how detailed your notes should be
        </p>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {lengthOptions.map((option) => {
            const isSelected = selectedLength === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleLengthChange(option.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center",
                  "transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <p
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {option.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note format selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Choose Note Format
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select one or more formats — AI will blend them intelligently
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {formatOptions.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormats.includes(format.id);

            return (
              <button
                key={format.id}
                type="button"
                onClick={() => toggleFormat(format.id)}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left",
                  "transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {format.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {format.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
