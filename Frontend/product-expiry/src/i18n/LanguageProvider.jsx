// src/i18n/LanguageProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import translations from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLang }) {
  const [lang, setLang] = useState(
    initialLang || localStorage.getItem("expiryLanguage") || "en"
  );

  // sync to browser + html tag
  useEffect(() => {
    localStorage.setItem("expiryLanguage", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
