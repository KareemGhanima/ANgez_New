"use client";

import { useEffect, useLayoutEffect } from "react";
import { useGameStore } from "@/store/gameStore";

const RTL_LANGUAGES = ["ar"];

const FONTS = {
  ar: "'Cairo', sans-serif",
  en: "'Inter', sans-serif",
  fr: "'Inter', sans-serif",
};

// Use useLayoutEffect on client to avoid flash, but fall back to useEffect on server
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useRTL() {
  const language = useGameStore(s => s.profile?.language ?? "en");
  const isRTL = RTL_LANGUAGES.includes(language);

  useIsomorphicLayoutEffect(() => {
    const html = document.documentElement;
    html.dir = isRTL ? "rtl" : "ltr";
    html.lang = language;

    // Swap font family on the root element
    html.style.fontFamily = FONTS[language as keyof typeof FONTS] ?? FONTS.en;

    // Optionally add a class for RTL-specific Tailwind overrides
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
