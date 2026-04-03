import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLocale from "./locales/en.json";
import arLocale from "./locales/ar.json";
import frLocale from "./locales/fr.json";

// ── Read cached language from localStorage (avoids Supabase round-trip on boot) ──
function getCachedLanguage(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("angez_lang") ?? "en";
}

const resources = {
  en: enLocale,
  ar: arLocale,
  fr: frLocale,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getCachedLanguage(),
    fallbackLng: "en",
    supportedLngs: ["en", "ar", "fr"],
    interpolation: {
      escapeValue: false,
    },
    // Cache translations in localStorage via i18next's built-in mechanism
    // (we handle this manually above — language pref)
    pluralSeparator: "_",
    // Arabic uses complex plural rules (1/2/3-10/11+)
    // i18next handles Islamic/Arabic plurals automatically when lng='ar'
  });

export default i18n;
