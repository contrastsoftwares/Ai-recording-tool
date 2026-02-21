"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Pencil,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

export default function SettingsPage() {
  const { theme: currentTheme, setTheme: setAppTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("Student User");
  const [email, setEmail] = useState("student@university.edu");
  const [noteFormat, setNoteFormat] = useState("markdown");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme: Theme = mounted ? (resolvedTheme as Theme) ?? "dark" : "dark";
  const [language, setLanguage] = useState("english");
  const [autoFlashcards, setAutoFlashcards] = useState(true);
  const [autoPracticeTests, setAutoPracticeTests] = useState(false);
  const [audioQuality, setAudioQuality] = useState("high");
  const [autoUpload, setAutoUpload] = useState(true);
  const [recordingCountdown, setRecordingCountdown] = useState(true);

  const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                CA
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-muted-foreground shadow-sm transition-colors hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Profile Photo</p>
              <p className="text-xs text-muted-foreground">
                Click the edit button to change your avatar.
              </p>
            </div>
          </div>

          <Separator />

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Full Name
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
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
            />
          </div>

          <Button className="w-full sm:w-auto">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
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
          <CardTitle>Note Preferences</CardTitle>
          <CardDescription>
            Configure how your AI-generated notes are created.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Default note format */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Default Note Format
              </p>
              <p className="text-xs text-muted-foreground">
                Choose the default format for generated notes.
              </p>
            </div>
            <select
              value={noteFormat}
              onChange={(e) => setNoteFormat(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="markdown">Markdown</option>
              <option value="plain">Plain Text</option>
              <option value="rich">Rich Text</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <Separator />

          {/* Default language */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Default Language
              </p>
              <p className="text-xs text-muted-foreground">
                Language for generated notes and summaries.
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
            </select>
          </div>

          <Separator />

          {/* Auto-generate flashcards */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-generate Flashcards
              </p>
              <p className="text-xs text-muted-foreground">
                Automatically create flashcards from your notes.
              </p>
            </div>
            <Toggle checked={autoFlashcards} onChange={setAutoFlashcards} />
          </div>

          <Separator />

          {/* Auto-generate practice tests */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-generate Practice Tests
              </p>
              <p className="text-xs text-muted-foreground">
                Automatically create practice tests from your notes.
              </p>
            </div>
            <Toggle checked={autoPracticeTests} onChange={setAutoPracticeTests} />
          </div>
        </CardContent>
      </Card>

      {/* Recording Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recording Preferences</CardTitle>
          <CardDescription>
            Configure recording behavior and quality settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Default audio quality */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Default Audio Quality
              </p>
              <p className="text-xs text-muted-foreground">
                Higher quality uses more storage space.
              </p>
            </div>
            <select
              value={audioQuality}
              onChange={(e) => setAudioQuality(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Separator />

          {/* Auto-upload recordings */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-upload Recordings
              </p>
              <p className="text-xs text-muted-foreground">
                Automatically upload recordings after they finish.
              </p>
            </div>
            <Toggle checked={autoUpload} onChange={setAutoUpload} />
          </div>

          <Separator />

          {/* Recording countdown */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Recording Countdown
              </p>
              <p className="text-xs text-muted-foreground">
                Show a 3-second countdown before recording starts.
              </p>
            </div>
            <Toggle checked={recordingCountdown} onChange={setRecordingCountdown} />
          </div>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Manage your account data and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export All Data
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Account
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
