"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentNotes } from "@/components/dashboard/recent-notes";
import { GhostLogo } from "@/components/brand/ghost-logo";

export default function DashboardPage() {
  const t = useTranslation();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t.dashboard.goodMorning);
    else if (hour < 17) setGreeting(t.dashboard.goodAfternoon);
    else setGreeting(t.dashboard.goodEvening);
  }, [t]);

  return (
    <div className="space-y-8">
      {/* Welcome hero band — the page's featured gold-glow moment */}
      <div className="glow-card rounded-2xl">
        <div className="relative overflow-hidden rounded-2xl bg-card/60 px-6 py-7">
          <div className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 opacity-[0.08] sm:block">
            <GhostLogo size={130} />
          </div>
          <div className="relative">
            <div className="accent-bar mb-3" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {greeting}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {t.dashboard.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsOverview />

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="h-4 w-1 rounded-full bg-primary" />
          {t.dashboard.quickActions}
        </h2>
        <QuickActions />
      </div>

      {/* Recent Notes */}
      <RecentNotes />
    </div>
  );
}
