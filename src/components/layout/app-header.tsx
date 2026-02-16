"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/notes": "My Notes",
  "/photo-solver": "Photo Solver",
  "/recorder": "Recorder",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Prefix match for nested routes
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path + "/")) return title;
  }

  return "Contrast AI";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 lg:px-6",
        "h-16 shrink-0 border-b border-border bg-background/95 backdrop-blur-sm",
        "supports-backdrop-filter:bg-background/80"
      )}
    >
      {/* Left: Mobile menu button + Page title */}
      <div className="flex items-center gap-3">
        <button
          className="flex lg:hidden items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground truncate">
          {title}
        </h1>
      </div>

      {/* Center/Right: Search */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes, recordings..."
            className={cn(
              "w-full h-9 rounded-lg bg-muted/50 pl-9 pr-4 text-sm",
              "placeholder:text-muted-foreground/60",
              "border border-transparent",
              "focus:outline-none focus:border-primary/30 focus:bg-background",
              "transition-colors duration-150"
            )}
            readOnly
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search button */}
        <button
          className="flex sm:hidden items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notification bell */}
        <button
          className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
          aria-label="User menu"
        >
          CA
        </button>
      </div>
    </header>
  );
}
