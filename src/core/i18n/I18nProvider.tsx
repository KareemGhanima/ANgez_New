"use client";

import { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./index";
import { createClient } from "@/core/supabase/client";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check user's preferred language from DB
    const fetchLanguage = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("users")
          .select("language")
          .eq("id", session.user.id)
          .single();

        if (profile?.language) {
          i18n.changeLanguage(profile.language);
          document.documentElement.dir = profile.language === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = profile.language;
        }
      }
      setMounted(true);
    };

    fetchLanguage();

    // Listen to changes in language to update document direction dynamically
    const handleLangChange = (lng: string) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLangChange);

    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [supabase]);

  if (!mounted) {
    // Avoid hydration mismatch by not rendering until we know the translation state
    // Alternatively, we could render children with initial static translations
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
