"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentNotes } from "@/components/dashboard/recent-notes";

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
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Stats */}
      <StatsOverview />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t.dashboard.quickActions}
        </h2>
        <QuickActions />
      </div>

      {/* Recent Notes */}
      <RecentNotes />
    </div>
  );
}
