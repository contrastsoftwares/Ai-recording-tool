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
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import type { NoteFormat } from "@/types/note";

export type NoteLength = "short" | "medium" | "long";

interface FormatOption {
  id: NoteFormat;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface FormatSelectorProps {
  onFormatsChange?: (formats: NoteFormat[]) => void;
  onLengthChange?: (length: NoteLength) => void;
}

export function FormatSelector({ onFormatsChange, onLengthChange }: FormatSelectorProps) {
  const t = useTranslation();
  const [selectedFormats, setSelectedFormats] = useState<NoteFormat[]>([]);
  const [selectedLength, setSelectedLength] = useState<NoteLength>("medium");

  const formatOptions: FormatOption[] = [
    {
      id: "ai-decide",
      label: t.formatSelector.aiDecide || "AI Decide",
      description: t.formatSelector.aiDecideDesc || "Let AI choose the best format for your content",
      icon: Sparkles,
    },
    {
      id: "bullet-points",
      label: t.formatSelector.bulletPoints,
      description: t.formatSelector.bulletPointsDesc,
      icon: List,
    },
    {
      id: "sentences",
      label: t.formatSelector.sentences,
      description: t.formatSelector.sentencesDesc,
      icon: AlignLeft,
    },
    {
      id: "cornell",
      label: t.formatSelector.cornellNotes,
      description: t.formatSelector.cornellNotesDesc,
      icon: LayoutGrid,
    },
    {
      id: "outline",
      label: t.formatSelector.outline,
      description: t.formatSelector.outlineDesc,
      icon: ListOrdered,
    },
    {
      id: "key-concepts",
      label: t.formatSelector.keyConcepts,
      description: t.formatSelector.keyConceptsDesc,
      icon: Key,
    },
    {
      id: "summary",
      label: t.formatSelector.summary,
      description: t.formatSelector.summaryDesc,
      icon: FileText,
    },
    {
      id: "timeline",
      label: t.formatSelector.timeline,
      description: t.formatSelector.timelineDesc,
      icon: Clock,
    },
    {
      id: "qa-format",
      label: t.formatSelector.qaFormat,
      description: t.formatSelector.qaFormatDesc,
      icon: HelpCircle,
    },
  ];

  const lengthOptions: { id: NoteLength; label: string; description: string }[] = [
    {
      id: "short",
      label: t.formatSelector.short,
      description: t.formatSelector.shortDesc,
    },
    {
      id: "medium",
      label: t.formatSelector.medium,
      description: t.formatSelector.mediumDesc,
    },
    {
      id: "long",
      label: t.formatSelector.long,
      description: t.formatSelector.longDesc,
    },
  ];

  const toggleFormat = (formatId: NoteFormat) => {
    let updated: NoteFormat[];
    if (formatId === "ai-decide") {
      // AI-decide is mutually exclusive — toggle it alone
      updated = selectedFormats.includes("ai-decide") ? [] : ["ai-decide"];
    } else {
      // Selecting a specific format deselects ai-decide
      const withoutAi = selectedFormats.filter((id) => id !== "ai-decide");
      updated = withoutAi.includes(formatId)
        ? withoutAi.filter((id) => id !== formatId)
        : [...withoutAi, formatId];
    }
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
          {t.formatSelector.noteLength}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t.formatSelector.lengthDesc}
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
          {t.formatSelector.chooseFormat}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t.formatSelector.formatDesc}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {formatOptions.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormats.includes(format.id);
            const isAiDecide = format.id === "ai-decide";

            return (
              <button
                key={format.id}
                type="button"
                onClick={() => toggleFormat(format.id)}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left",
                  "transition-all duration-200",
                  isAiDecide && !isSelected && "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10",
                  isAiDecide && isSelected && "border-primary bg-primary/10 shadow-md ring-1 ring-primary/20",
                  !isAiDecide && isSelected && "border-primary bg-primary/5 shadow-sm",
                  !isAiDecide && !isSelected && "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
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
