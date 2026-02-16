import {
  FileText,
  Camera,
  MessageSquare,
  Layers,
  ClipboardCheck,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FileText,
    title: "Smart Notes",
    description:
      "Upload videos, PDFs, or links and get AI-generated notes in your preferred format.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Camera,
    title: "Photo Solver",
    description:
      "Snap a photo of any problem and get step-by-step solutions for any subject.",
    color: "bg-violet/10 text-violet",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    description:
      "Ask questions about your notes and get instant, contextual answers.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description:
      "Auto-generate flashcard decks from your notes for effective studying.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: ClipboardCheck,
    title: "Practice Tests",
    description:
      "Generate quizzes and exams to test your knowledge before the real thing.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Mic,
    title: "Built-in Recorder",
    description:
      "Record lectures and meetings directly in-app — screen or audio.",
    color: "bg-primary/10 text-primary",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Study Smarter
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful AI tools designed to help you learn faster and retain more.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className={cn(
                "group relative rounded-xl border border-border bg-card p-6 transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "inline-flex h-12 w-12 items-center justify-center rounded-lg",
                  feature.color
                )}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
