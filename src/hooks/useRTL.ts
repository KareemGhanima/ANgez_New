"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

const RTL_LANGUAGES = ["ar"];

const FONTS: Record<string, string> = {
  ar: "var(--font-cairo), 'Cairo', sans-serif",
  en: "var(--font-inter), 'Inter', sans-serif",
  fr: "var(--font-inter), 'Inter', sans-serif",
};

export function useRTL() {
  // ✅ Safe: default 'en' prevents any SSR mismatch
  const language = useGameStore(s => s.profile?.language ?? "en");
  const isRTL = RTL_LANGUAGES.includes(language);

  // ✅ useEffect (not useLayoutEffect) — runs only on client, zero SSR
  useEffect(() => {
    const html = document.documentElement;
    html.dir = isRTL ? "rtl" : "ltr";
    html.lang = language;
    html.style.fontFamily = FONTS[language] ?? FONTS.en;

    if (isRTL) {
      html.classList.add("rtl");
      html.classList.remove("ltr");
    } else {
      html.classList.add("ltr");
      html.classList.remove("rtl");
    }
  }, [language, isRTL]);

  return { isRTL, language };
}
