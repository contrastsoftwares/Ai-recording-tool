"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Camera,
  Mic,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTranslation, useLanguage } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { useNotesStore } from "@/stores/notes-store";

const languageOptions: { key: Language; label: string }[] = [
  { key: "english", label: "English" },
  { key: "spanish", label: "Espanol" },
  { key: "french", label: "Francais" },
  { key: "german", label: "Deutsch" },
  { key: "chinese", label: "\u4E2D\u6587" },
  { key: "japanese", label: "\u65E5\u672C\u8A9E" },
  { key: "korean", label: "\uD55C\uAD6D\uC5B4" },
];

const navIcons = [
  { key: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
  { key: "myNotes" as const, href: "/notes", icon: FileText },
  { key: "photoSolver" as const, href: "/photo-solver", icon: Camera },
  { key: "recorder" as const, href: "/recorder", icon: Mic },
  { key: "settings" as const, href: "/settings", icon: Settings },
];

// Custom event to communicate collapsed state to layout
const SIDEBAR_COLLAPSE_EVENT = "sidebar-collapse";

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setCollapsed((e as CustomEvent).detail.collapsed);
    };
    window.addEventListener(SIDEBAR_COLLAPSE_EVENT, handler);
    return () => window.removeEventListener(SIDEBAR_COLLAPSE_EVENT, handler);
  }, []);

  return collapsed;
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const t = useTranslation();
  const [currentLang, setLang] = useLanguage();
  const notes = useNotesStore((s) => s.notes);

  const recentNotes = useMemo(
    () =>
      [...notes]
        .sort((a, b) => {
          const aTime = new Date(a.lastAccessedAt || a.updatedAt || a.createdAt).getTime();
          const bTime = new Date(b.lastAccessedAt || b.updatedAt || b.createdAt).getTime();
          return bTime - aTime;
        })
        .slice(0, 10),
    [notes]
  );

  const favoriteNotes = useMemo(
    () => notes.filter((n) => n.isFavorite),
    [notes]
  );

  const currentLangLabel =
    languageOptions.find((l) => l.key === currentLang)?.label || "English";

  // Broadcast collapsed state changes
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      window.dispatchEvent(
        new CustomEvent(SIDEBAR_COLLAPSE_EVENT, { detail: { collapsed: next } })
      );
      return next;
    });
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langDropdownOpen]);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        "transition-[width] duration-300 ease-in-out overflow-hidden"
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
          "flex items-center h-[68px] border-b border-sidebar-border shrink-0",
          collapsed ? "justify-center" : "px-5 gap-3"
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

      {/* Navigation + Recent Notes + Favorites (scrollable area) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <ul className="flex flex-col gap-1">
          {navIcons.map((item) => {
            const hrefPath = item.href.split("?")[0];
            const isActive =
              pathname === hrefPath || pathname.startsWith(hrefPath + "/");
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

        {/* Recent Notes */}
        {!collapsed && recentNotes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-sidebar-border">
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recent
              </span>
            </div>
            <ul className="flex flex-col gap-0.5">
              {recentNotes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === `/notes/${note.id}` && "bg-primary/10 text-primary"
                    )}
                    title={note.title}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {note.title.length > 24
                        ? note.title.slice(0, 24) + "..."
                        : note.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Favorites */}
        {!collapsed && favoriteNotes.length > 0 && (
          <div className="mt-4 pt-3 border-t border-sidebar-border">
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <Star className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Favorites
              </span>
            </div>
            <ul className="flex flex-col gap-0.5">
              {favoriteNotes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === `/notes/${note.id}` && "bg-primary/10 text-primary"
                    )}
                    title={note.title}
                  >
                    <Star className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {note.title.length > 24
                        ? note.title.slice(0, 24) + "..."
                        : note.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-1 shrink-0">
        <ThemeToggle collapsed={collapsed} />

        {/* Language switcher */}
        <div className="relative" ref={langDropdownRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full",
              "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? currentLangLabel : undefined}
            aria-label="Change language"
          >
            <Globe className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{currentLangLabel}</span>}
          </button>

          {langDropdownOpen && (
            <div
              className={cn(
                "absolute z-50 rounded-lg border border-border bg-popover shadow-md py-1",
                collapsed ? "left-full ml-2 bottom-0" : "bottom-full mb-1 left-0 right-0"
              )}
            >
              {languageOptions.map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => {
                    setLang(lang.key);
                    setLangDropdownOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    currentLang === lang.key
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapsed}
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
