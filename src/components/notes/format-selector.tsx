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

interface FormatSelectorProps {
  onFormatsChange?: (formats: NoteFormat[]) => void;
}

export function FormatSelector({ onFormatsChange }: FormatSelectorProps) {
  const [selectedFormats, setSelectedFormats] = useState<NoteFormat[]>([]);

  const toggleFormat = (formatId: NoteFormat) => {
    const updated = selectedFormats.includes(formatId)
      ? selectedFormats.filter((id) => id !== formatId)
      : [...selectedFormats, formatId];
    setSelectedFormats(updated);
    onFormatsChange?.(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Choose Note Format
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select one or more formats — AI will blend them intelligently
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              {/* Checkmark */}
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
  );
}
