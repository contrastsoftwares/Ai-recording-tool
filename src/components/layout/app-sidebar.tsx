"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Camera,
  Mic,
  Monitor,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTranslation } from "@/lib/i18n";

const navIcons = [
  { key: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "myNotes" as const, href: "/notes", icon: FileText },
  { key: "photoSolver" as const, href: "/photo-solver", icon: Camera },
  { key: "audioRecorder" as const, href: "/recorder", icon: Mic },
  { key: "screenRecording" as const, href: "/screen-recording", icon: Monitor },
  { key: "settings" as const, href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const t = useTranslation();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        "transition-all duration-300 ease-in-out"
      )}
      style={{
        width: collapsed
          ? "var(--sidebar-width-collapsed)"
          : "var(--sidebar-width)",
      }}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-5 border-b border-sidebar-border",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-base font-bold tracking-tight truncate">
              {t.sidebar.brand}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {t.sidebar.subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <ul className="flex flex-col gap-1">
          {navIcons.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            const label = t.nav[item.key];

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-1">
        <ThemeToggle collapsed={collapsed} />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full",
            "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center px-0"
          )}
          aria-label={collapsed ? t.sidebar.expandSidebar : t.sidebar.collapseSidebar}
          title={collapsed ? t.sidebar.expandSidebar : t.sidebar.collapseSidebar}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5 shrink-0" />
          ) : (
            <PanelLeftClose className="h-5 w-5 shrink-0" />
          )}
          {!collapsed && <span>{t.sidebar.collapse}</span>}
        </button>
      </div>
    </aside>
  );
}
