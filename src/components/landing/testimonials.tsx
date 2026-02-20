import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CS Student at MIT",
    initials: "SC",
    quote:
      "Contrast AI completely changed how I study. I record my lectures and have perfect notes ready in minutes. My grades went up a full letter grade.",
    rating: 5,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Marcus Johnson",
    role: "Pre-Med at Stanford",
    initials: "MJ",
    quote:
      "The flashcard generation is insane. I used to spend hours making Anki cards. Now I upload my lecture recording and get a full deck instantly.",
    rating: 5,
    color: "bg-violet/10 text-violet",
  },
  {
    name: "Emily Rodriguez",
    role: "Law Student at Harvard",
    initials: "ER",
    quote:
      "The AI chat feature is like having a personal tutor on demand. I can ask questions about my notes and get clear, contextual answers every time.",
    rating: 5,
    color: "bg-success/10 text-success",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-warning text-warning"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Students Are Saying
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from real students who use Contrast AI every day.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className={cn(
                "group relative rounded-xl border border-border bg-card p-6 transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
              )}
            >
              {/* Star rating */}
              <StarRating rating={testimonial.rating} />

              {/* Quote */}
              <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className={testimonial.color}>
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
