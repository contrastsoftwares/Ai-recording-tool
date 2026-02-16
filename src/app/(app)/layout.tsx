import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Main content area - offset for sidebar on desktop */}
      <div
        className="flex flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out lg:ml-[var(--sidebar-width)]"
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
