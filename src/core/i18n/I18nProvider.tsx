"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./index";
import { createClient } from "@/core/supabase/client";
import { StoreHydrator } from "@/components/StoreHydrator";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        // 1. Check localStorage cache first (instant, no network)
        const cached = typeof window !== "undefined" ? localStorage.getItem("angez_lang") : null;
        if (cached && ["en", "ar", "fr"].includes(cached)) {
          i18n.changeLanguage(cached);
        }

        // 2. Then sync from Supabase (updates cache if different)
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from("users")
            .select("language")
            .eq("id", session.user.id)
            .single();

          if (profile?.language) {
            i18n.changeLanguage(profile.language);
            localStorage.setItem("angez_lang", profile.language);
          }
        }
      } catch (e) {
        console.warn("[I18nProvider] Language fetch failed:", e);
      }
      setMounted(true);
    };

    fetchLanguage();

    const handleLangChange = (lng: string) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLangChange);
    return () => i18n.off("languageChanged", handleLangChange);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {/* Triggers Zustand store rehydration from localStorage, client-only */}
      <StoreHydrator />
      {children}
    </I18nextProvider>
  );
}
