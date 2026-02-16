"use client";

import Link from "next/link";
import { Play, FileText, MessageSquare, Sparkles, Layers, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Note Taking
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Turn Any Lecture Into{" "}
            <span className="bg-gradient-to-r from-primary via-violet to-violet bg-clip-text text-transparent">
              Smart Notes
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Record, upload, and transform your lectures and meetings into
            AI-powered notes, flashcards, and study materials — all in one
            place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              )}
            >
              Get Started Free
            </Link>
            <button
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background px-8 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:-translate-y-0.5"
              )}
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </button>
          </div>

          {/* App Preview Mockup */}
          <div className="relative mt-16 w-full max-w-5xl sm:mt-20">
            {/* Gradient border effect */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-violet to-primary opacity-20 blur-sm" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
              {/* Fake title bar */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-warning/60" />
                  <div className="h-3 w-3 rounded-full bg-success/60" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="mx-auto h-5 w-64 rounded-md bg-muted" />
                </div>
              </div>

              {/* Fake app content */}
              <div className="flex min-h-[350px] sm:min-h-[420px]">
                {/* Sidebar */}
                <div className="hidden w-56 border-r border-border bg-muted/30 p-4 sm:block">
                  <div className="mb-6 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Contrast AI</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { icon: FileText, label: "My Notes", active: true },
                      { icon: MessageSquare, label: "AI Chat", active: false },
                      { icon: Layers, label: "Flashcards", active: false },
                      { icon: Mic, label: "Recorder", active: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                          item.active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="h-5 w-48 rounded bg-foreground/10" />
                      <div className="mt-2 h-3 w-32 rounded bg-muted-foreground/20" />
                    </div>
                    <div className="h-8 w-24 rounded-md bg-primary/10" />
                  </div>

                  {/* Fake note cards */}
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { title: "Biology Lecture 12", tag: "Notes", color: "bg-primary/10 text-primary" },
                      { title: "Calculus Review", tag: "Flashcards", color: "bg-violet/10 text-violet" },
                      { title: "History Midterm", tag: "Practice Test", color: "bg-success/10 text-success" },
                      { title: "Physics Lab Report", tag: "Notes", color: "bg-warning/10 text-warning" },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border bg-background p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="h-4 w-32 rounded bg-foreground/10" />
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", card.color)}>
                            {card.tag}
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="h-2.5 w-full rounded bg-muted" />
                          <div className="h-2.5 w-4/5 rounded bg-muted" />
                          <div className="h-2.5 w-3/5 rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
