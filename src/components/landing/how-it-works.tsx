import { Upload, Settings2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload or Record",
    description:
      "Upload a video, PDF, link, or record directly in-app.",
    color: "bg-primary/10 text-primary border-primary/20",
    numberColor: "bg-primary text-white",
  },
  {
    number: 2,
    icon: Settings2,
    title: "Choose Your Format",
    description:
      "Pick from bullet points, Cornell notes, outlines, and more — or mix and match.",
    color: "bg-violet/10 text-violet border-violet/20",
    numberColor: "bg-violet text-white",
  },
  {
    number: 3,
    icon: GraduationCap,
    title: "Study Smarter",
    description:
      "Chat with AI about your notes, generate flashcards, and take practice tests.",
    color: "bg-success/10 text-success border-success/20",
    numberColor: "bg-success text-white",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From upload to mastery in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line - desktop only */}
          <div className="absolute top-24 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] hidden h-0.5 bg-gradient-to-r from-primary via-violet to-success lg:block" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow-lg",
                    step.numberColor
                  )}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "mt-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border",
                    step.color
                  )}
                >
                  <step.icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
