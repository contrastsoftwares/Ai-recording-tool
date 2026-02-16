"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = ["light", "dark", "system"] as const;

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme();
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
        <Monitor className="h-5 w-5 shrink-0" />
        {!collapsed && <span>System</span>}
      </button>
    );
  }

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as (typeof themes)[number]);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const icon =
    theme === "light" ? (
      <Sun className="h-5 w-5 shrink-0" />
    ) : theme === "dark" ? (
      <Moon className="h-5 w-5 shrink-0" />
    ) : (
      <Monitor className="h-5 w-5 shrink-0" />
    );

  const label =
    theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-0"
      )}
      aria-label={`Current theme: ${label}. Click to switch.`}
      title={`Theme: ${label}`}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
