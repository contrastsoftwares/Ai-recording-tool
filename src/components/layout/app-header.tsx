"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/stores/notes-store";
import { useTranslation } from "@/lib/i18n";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const notes = useNotesStore((s) => s.notes);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive page title from translations
  const pageTitleMap: Record<string, string> = {
    "/dashboard": t.nav.dashboard,
    "/notes": t.nav.myNotes,
    "/photo-solver": t.nav.photoSolver,
    "/recorder": t.nav.audioRecorder,
    "/screen-recording": t.nav.screenRecording,
    "/settings": t.nav.settings,
  };

  function getPageTitle(p: string): string {
    if (pageTitleMap[p]) return pageTitleMap[p];
    for (const [path, title] of Object.entries(pageTitleMap)) {
      if (p.startsWith(path + "/")) return title;
    }
    return t.sidebar.brand;
  }

  const title = getPageTitle(pathname);

  const filteredNotes = searchQuery.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for Cmd/Ctrl+K focus-search event
  useEffect(() => {
    function handleFocusSearch() {
      inputRef.current?.focus();
      setShowResults(true);
    }
    window.addEventListener("focus-search", handleFocusSearch);
    return () => window.removeEventListener("focus-search", handleFocusSearch);
  }, []);

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
          aria-label={t.header.menu}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground truncate">
          {title}
        </h1>
      </div>

      {/* Center/Right: Search */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t.header.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className={cn(
              "w-full h-9 rounded-lg bg-muted/50 pl-9 pr-8 text-sm",
              "placeholder:text-muted-foreground/60",
              "border border-transparent",
              "focus:outline-none focus:border-primary/30 focus:bg-background",
              "transition-colors duration-150"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setShowResults(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Search results dropdown */}
          {showResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredNotes.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {t.header.noNotesFound} &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      router.push(`/notes/${note.id}`);
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{note.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {note.sourceType} &middot; {note.tags.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
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
          aria-label={t.header.notifications}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
          aria-label={t.header.userMenu}
        >
          CA
        </button>
      </div>
    </header>
  );
}
