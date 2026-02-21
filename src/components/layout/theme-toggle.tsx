"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
          "text-muted-foreground transition-colors",
          collapsed && "justify-center px-0"
        )}
        aria-label="Toggle theme"
      >
        <Moon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>Dark</span>}
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-0"
      )}
      aria-label={`Current theme: ${isDark ? "Dark" : "Light"}. Click to switch.`}
      title={`Theme: ${isDark ? "Dark" : "Light"}`}
    >
      {isDark ? (
        <Moon className="h-5 w-5 shrink-0" />
      ) : (
        <Sun className="h-5 w-5 shrink-0" />
      )}
      {!collapsed && <span>{isDark ? "Dark" : "Light"}</span>}
    </button>
  );
}
