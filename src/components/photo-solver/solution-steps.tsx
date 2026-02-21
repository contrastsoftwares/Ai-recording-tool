"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle2 } from "lucide-react";
export interface SolutionStep {
  stepNumber: number;
  title: string;
  explanation: string;
  math?: string;
}

interface SolutionStepsProps {
  steps: SolutionStep[];
  finalAnswer: string;
}

export function SolutionSteps({ steps, finalAnswer }: SolutionStepsProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(
    new Set(steps.map((_, i) => i))
  );

  function toggleStep(index: number) {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="space-y-0">
      {/* Steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[17px] top-6 bottom-6 w-0.5 bg-border" />

        <div className="space-y-3">
          {steps.map((step, index) => {
            const isExpanded = expandedSteps.has(index);

            return (
              <div key={index} className="relative flex gap-4">
                {/* Step number circle */}
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-sm">
                  {index + 1}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0 pb-2">
                  <button
                    onClick={() => toggleStep(index)}
                    className="flex items-center gap-2 w-full text-left group"
                  >
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h4>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.explanation}
                      </p>
                      {step.math && (
                        <div className="rounded-lg bg-muted/60 border border-border px-4 py-3">
                          <code className="text-sm font-mono text-foreground whitespace-pre-wrap">
                            {step.math}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Answer */}
      <div className="relative flex gap-4 mt-4">
        {/* Answer circle */}
        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground shadow-sm">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        {/* Answer content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-lg border border-success/30 bg-success/10 p-4">
            <p className="text-xs font-semibold text-success uppercase tracking-wide mb-1">
              Final Answer
            </p>
            <p className="text-sm font-mono font-semibold text-foreground">
              {finalAnswer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
