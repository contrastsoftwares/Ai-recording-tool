"use client";

import { useState, useEffect, useCallback } from "react";
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

export function useTranslation(): Translations {
  const [lang, setLang] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    const handler = () => setLang(getStoredLanguage());
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  return translations[lang];
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const [lang, setLangState] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    const handler = () => setLangState(getStoredLanguage());
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const setLang = useCallback((newLang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("setting-language", JSON.stringify(newLang));
    }
    setLangState(newLang);
  }, []);

  return [lang, setLang];
}

export type { Language, Translations };
