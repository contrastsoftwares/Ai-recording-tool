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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Main content area - offset for sidebar on desktop */}
      <div
        className="flex flex-1 flex-col min-w-0 transition-[margin] duration-300 ease-in-out"
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
