"use client";

import { AppSidebar, useSidebarCollapsed } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useSidebarCollapsed();
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Ambient light — fixed gold blooms behind every app page */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary/[0.06] via-primary/[0.015] to-transparent" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/[0.06] blur-[130px] animate-float" />
        <div className="absolute -right-32 -top-48 h-[560px] w-[560px] rounded-full bg-primary/[0.05] blur-[140px] animate-float animation-delay-300" />
        <div className="grain-overlay absolute inset-0 opacity-[0.025] mix-blend-soft-light" />
      </div>

      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Main content area - offset for sidebar on desktop */}
      <div
        className="relative z-10 flex flex-1 flex-col min-w-0"
        style={{
          marginLeft: isLg
            ? sidebarCollapsed
              ? "var(--sidebar-width-collapsed)"
              : "var(--sidebar-width)"
            : undefined,
        }}
      >
        {/* Top header */}
        <AppHeader />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>
    </div>
  );
}
