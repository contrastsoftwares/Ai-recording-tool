"use client";

import { useState, useEffect } from "react";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentNotes } from "@/components/dashboard/recent-notes";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour < 17) return "Good afternoon!";
  return "Good evening!";
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Welcome back!");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your studies
        </p>
      </div>

      {/* Stats */}
      <StatsOverview />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      {/* Recent Notes */}
      <RecentNotes />
    </div>
  );
}
