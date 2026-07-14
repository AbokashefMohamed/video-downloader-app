import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import ar from "./ar.json";
import sv from "./sv.json";
import it from "./it.json";
import es from "./es.json";
import fr from "./fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      sv: { translation: sv },
      it: { translation: it },
      es: { translation: es },
      fr: { translation: fr },
    },
    supportedLngs: ["en", "ar", "sv", "it", "es", "fr"],
    fallbackLng: "en",
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    returnNull: false,
    returnEmptyString: false,
    debug: import.meta.env.DEV,
  });

  i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
});

export default i18n;