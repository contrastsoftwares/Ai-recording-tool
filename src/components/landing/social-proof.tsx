"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Layers, Clock, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: FileText,
    target: 1000000,
    label: "Notes",
    display: "1M+",
    color: "text-primary",
  },
  {
    icon: Layers,
    target: 500000,
    label: "Flashcards",
    display: "500K+",
    color: "text-violet",
  },
  {
    icon: Clock,
    target: 50000,
    label: "Hours Saved",
    display: "50K+",
    color: "text-success",
  },
];

const universities = [
  "Stanford University",
  "MIT",
  "Harvard",
  "UC Berkeley",
  "Yale",
  "Princeton",
];

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = target / (duration / 16);
    let raf: number;

    function step() {
      start += increment;
      if (start >= target) {
        setCount(target);
        return;
      }
      setCount(Math.floor(start));
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, target, duration]);

  return count;
}

function formatCount(value: number): string {
  if (value >= 1000000) {
    const m = value / 1000000;
    return m >= 1 ? `${m.toFixed(m % 1 === 0 ? 0 : 1)}M+` : `${Math.floor(value / 1000)}K+`;
  }
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K+`;
  }
  return `${value}+`;
}

export function SocialProof() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5" />
            Loved by Students
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary via-violet to-violet bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            Students
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Students and professionals around the world rely on Contrast AI to
            study smarter.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, i) => {
            const count = useCountUp(stat.target, isVisible);
            return (
              <div
                key={i}
                className={cn(
                  "group relative flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
                  isVisible && "animate-fade-in-up",
                  i === 0 && "animation-delay-100",
                  i === 1 && "animation-delay-200",
                  i === 2 && "animation-delay-300"
                )}
                style={{ opacity: isVisible ? undefined : 0 }}
              >
                <div
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10",
                    stat.color
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn("mt-4 text-4xl font-bold tracking-tight", stat.color)}>
                  {isVisible ? formatCount(count) : "0"}
                </div>
                <div className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* University logos placeholder */}
        <div className="mt-16">
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
            Used by students at top universities
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {universities.map((uni) => (
              <div
                key={uni}
                className="flex h-10 items-center justify-center rounded-md bg-muted/60 px-6"
              >
                <span className="text-sm font-medium text-muted-foreground/60">
                  {uni}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
