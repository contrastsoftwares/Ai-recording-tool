import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map app language names to BCP 47 locale codes
const localeMap: Record<string, string> = {
  english: "en-US",
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  chinese: "zh-CN",
  japanese: "ja-JP",
  korean: "ko-KR",
};

const relativeTimeLabels: Record<string, { justNow: string; mAgo: string; hAgo: string; dAgo: string }> = {
  english: { justNow: "Just now", mAgo: "m ago", hAgo: "h ago", dAgo: "d ago" },
  spanish: { justNow: "Ahora", mAgo: "m", hAgo: "h", dAgo: "d" },
  french: { justNow: "À l'instant", mAgo: "min", hAgo: "h", dAgo: "j" },
  german: { justNow: "Gerade", mAgo: "Min.", hAgo: "Std.", dAgo: "T." },
  chinese: { justNow: "刚刚", mAgo: "分钟前", hAgo: "小时前", dAgo: "天前" },
  japanese: { justNow: "たった今", mAgo: "分前", hAgo: "時間前", dAgo: "日前" },
  korean: { justNow: "방금", mAgo: "분 전", hAgo: "시간 전", dAgo: "일 전" },
};

export function getLocaleCode(language?: string): string {
  return localeMap[language || "english"] || "en-US";
}

export function formatDate(date: Date | string, language?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  const labels = relativeTimeLabels[language || "english"] || relativeTimeLabels.english;

  if (minutes < 1) return labels.justNow;
  if (minutes < 60) return `${minutes}${labels.mAgo}`;
  if (hours < 24) return `${hours}${labels.hAgo}`;
  if (days < 7) return `${days}${labels.dAgo}`;
  return d.toLocaleDateString(getLocaleCode(language), { month: "short", day: "numeric" });
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
