"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Pencil,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type Theme = "light" | "dark";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function getStoredSetting<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(`setting-${key}`);
  if (stored === null) return defaultValue;
  try { return JSON.parse(stored); } catch { return defaultValue; }
}

function storeSetting(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`setting-${key}`, JSON.stringify(value));
}

export default function SettingsPage() {
  const t = useTranslation();
  const { setTheme: setAppTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(() => getStoredSetting("name", "Student User"));
  const [email, setEmail] = useState(() => getStoredSetting("email", "student@university.edu"));

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme: Theme = mounted ? (resolvedTheme as Theme) ?? "dark" : "dark";
  const [language, setLanguage] = useState(() => getStoredSetting("language", "english"));
  const [autoFlashcards, setAutoFlashcards] = useState(() => getStoredSetting("autoFlashcards", false));
  const [autoPracticeTests, setAutoPracticeTests] = useState(() => getStoredSetting("autoPracticeTests", false));

  // Persist settings to localStorage on change
  useEffect(() => { storeSetting("language", language); }, [language]);
  useEffect(() => { storeSetting("autoFlashcards", autoFlashcards); }, [autoFlashcards]);
  useEffect(() => { storeSetting("autoPracticeTests", autoPracticeTests); }, [autoPracticeTests]);

  const handleSaveProfile = useCallback(() => {
    storeSetting("name", name);
    storeSetting("email", email);
  }, [name, email]);

  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: t.settings.light, icon: Sun },
    { value: "dark", label: t.settings.dark, icon: Moon },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.settings.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.profile}</CardTitle>
          <CardDescription>
            {t.settings.profileDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground shadow-sm transition-colors hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t.settings.profilePhoto}</p>
              <p className="text-xs text-muted-foreground">
                {t.settings.profilePhotoDesc}
              </p>
            </div>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.settings.fullName}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student User"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t.settings.email}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
            />
          </div>

          <Button className="w-full sm:w-auto" onClick={handleSaveProfile}>{t.settings.saveChanges}</Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.appearance}</CardTitle>
          <CardDescription>
            {t.settings.appearanceDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setAppTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-accent/50",
                  activeTheme === value
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    activeTheme === value ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    activeTheme === value ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Note Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.notePreferences}</CardTitle>
          <CardDescription>
            {t.settings.notePreferencesDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Default language */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t.settings.defaultLanguage}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.settings.defaultLanguageDesc}
              </p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
              <option value="korean">Korean</option>
            </select>
          </div>

          <Separator />

          {/* Auto-generate flashcards */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t.settings.autoFlashcards}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.settings.autoFlashcardsDesc}
              </p>
            </div>
            <Toggle checked={autoFlashcards} onChange={setAutoFlashcards} />
          </div>

          <Separator />

          {/* Auto-generate practice tests */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {t.settings.autoPracticeTests}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.settings.autoPracticeTestsDesc}
              </p>
            </div>
            <Toggle checked={autoPracticeTests} onChange={setAutoPracticeTests} />
          </div>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.account}</CardTitle>
          <CardDescription>
            {t.settings.accountDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t.settings.exportAllData}
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              {t.settings.deleteAccount}
            </Button>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Contrast AI v1.0.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
