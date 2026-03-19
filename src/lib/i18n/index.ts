"use client";

import { useCallback, useState, useEffect } from "react";
import { translations, type Language, type Translations } from "./translations";

function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "english";
  try {
    const stored = localStorage.getItem("setting-language");
    if (stored) {
      const parsed = JSON.parse(stored) as string;
      if (parsed in translations) return parsed as Language;
    }
  } catch {}
  return "english";
}

// Simple event-based reactivity for language changes
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

// Patch localStorage so that language changes from Settings are picked up globally
if (typeof window !== "undefined") {
  const origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (key: string, value: string) => {
    origSetItem(key, value);
    if (key === "setting-language") {
      notifyListeners();
    }
  };
}

/**
 * Hook that returns the current language, using a mounted-state pattern
 * to avoid hydration mismatches.
 *
 * On the server and during the first client render, returns "english"
 * so SSR HTML and the initial hydration pass produce identical markup.
 * After mount, reads the real language from localStorage and subscribes
 * to changes.
 */
function useCurrentLanguage(): Language {
  const [lang, setLang] = useState<Language>("english");

  useEffect(() => {
    // After mount, read the stored language
    setLang(getStoredLanguage());

    // Subscribe to language changes (e.g. from Settings page)
    const listener = () => setLang(getStoredLanguage());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return lang;
}

/**
 * Returns translations for the current language.
 *
 * Uses a mounted-state pattern: the first render always returns English
 * translations (matching SSR), then updates to the user's stored language
 * after mount. This guarantees no hydration mismatch.
 */
export function useTranslation(): Translations {
  const lang = useCurrentLanguage();
  return translations[lang];
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const lang = useCurrentLanguage();

  const setLangFn = useCallback((newLang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("setting-language", JSON.stringify(newLang));
    }
    // notifyListeners is called automatically by the patched localStorage.setItem
  }, []);

  return [lang, setLangFn];
}

export { useCurrentLanguage };
export type { Language, Translations };
