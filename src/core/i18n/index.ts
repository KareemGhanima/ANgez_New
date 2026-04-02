import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLocale from "./locales/en.json";
import arLocale from "./locales/ar.json";
import frLocale from "./locales/fr.json";

const resources = {
  en: enLocale,
  ar: arLocale,
  fr: frLocale,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language, we'll try to override it dynamically later with Supabase
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
