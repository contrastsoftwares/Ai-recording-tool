"use client";

import Link from "next/link";
import { Upload, Camera, Monitor, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

export function QuickActions() {
  const t = useTranslation();

  const actions = [
    {
      title: t.dashboard.uploadAndGenerate,
      description: t.dashboard.uploadAndGenerateDesc,
      icon: Upload,
      href: "/notes/new",
      color: "text-primary",
      bgColor: "bg-primary/10",
      hoverBorder: "hover:border-primary/40",
      span: true,
    },
    {
      title: t.dashboard.photoSolverAction,
      description: t.dashboard.photoSolverDesc,
      icon: Camera,
      href: "/photo-solver",
      color: "text-foreground",
      bgColor: "bg-foreground/10",
      hoverBorder: "hover:border-primary/40",
      span: false,
    },
    {
      title: t.dashboard.recordScreen,
      description: t.dashboard.recordScreenDesc,
      icon: Monitor,
      href: "/recorder?mode=screen",
      color: "text-success",
      bgColor: "bg-success/10",
      hoverBorder: "hover:border-success/40",
      span: false,
    },
    {
      title: t.dashboard.recordAudio,
      description: t.dashboard.recordAudioDesc,
      icon: Mic,
      href: "/recorder?mode=audio",
      color: "text-warning",
      bgColor: "bg-warning/10",
      hoverBorder: "hover:border-warning/40",
      span: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.title}
            href={action.href}
            className={cn(
              "group flex items-start gap-4 rounded-xl bg-card p-5",
              action.span ? "glow-soft md:col-span-2" : "card-lit border border-border"
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                action.bgColor,
                "transition-transform duration-200 group-hover:scale-110"
              )}
            >
              <Icon className={cn("h-6 w-6", action.color)} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {action.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
