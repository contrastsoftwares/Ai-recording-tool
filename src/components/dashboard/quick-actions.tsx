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
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      hoverBorder: "hover:border-blue-500/40",
      span: true,
    },
    {
      title: t.dashboard.photoSolverAction,
      description: t.dashboard.photoSolverDesc,
      icon: Camera,
      href: "/photo-solver",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      hoverBorder: "hover:border-violet-500/40",
      span: false,
    },
    {
      title: t.dashboard.recordScreen,
      description: t.dashboard.recordScreenDesc,
      icon: Monitor,
      href: "/recorder?mode=screen",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      hoverBorder: "hover:border-emerald-500/40",
      span: false,
    },
    {
      title: t.dashboard.recordAudio,
      description: t.dashboard.recordAudioDesc,
      icon: Mic,
      href: "/recorder?mode=audio",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      hoverBorder: "hover:border-amber-500/40",
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
              "group flex items-start gap-4 rounded-xl border border-border bg-card p-5",
              "transition-all duration-200",
              "hover:scale-[1.02] hover:shadow-lg",
              action.hoverBorder,
              action.span && "md:col-span-2"
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
