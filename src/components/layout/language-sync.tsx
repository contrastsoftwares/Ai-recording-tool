"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

/**
 * Map internal language keys to BCP 47 lang codes used by the
 * <html lang="…"> attribute. This helps the browser apply the
 * correct font shaping, line-breaking, and accessibility rules.
 */
const langCodeMap: Record<string, string> = {
  english: "en",
  spanish: "es",
  french: "fr",
  german: "de",
  chinese: "zh-CN",
  japanese: "ja",
  korean: "ko",
};

/**
 * Invisible component that keeps the document's `lang` attribute
 * and a `data-lang` attribute in sync with the user's chosen language.
 *
 * The `data-lang` attribute is used by CSS to adjust the font stack
 * for CJK languages (see globals.css).
 */
export function LanguageSync() {
  const [currentLang] = useLanguage();

  useEffect(() => {
    const code = langCodeMap[currentLang] || "en";
    document.documentElement.lang = code;
    document.documentElement.setAttribute("data-lang", currentLang);
  }, [currentLang]);

  return null;
}
