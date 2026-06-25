import { createContext, useContext, useState } from "react";
import { LANG_CODES, translations } from "../i18n/translations";

const LanguageContext = createContext({ language: "English", setLanguage: () => {}, t: (k) => k });

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("sp-language") ?? "English"
  );

  const setAndPersist = (lang) => {
    localStorage.setItem("sp-language", lang);
    setLanguage(lang);
  };

  const t = (key, vars = {}) => {
    const code = LANG_CODES[language] ?? "en";
    let str = translations[code]?.[key] ?? translations.en?.[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setAndPersist, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
