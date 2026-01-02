// src/i18n/useTranslation.js
import { useLanguage } from "./LanguageProvider";

export default function useTranslation() {
  const { t, lang, setLanguage } = useLanguage();
  return { t, lang, setLanguage };
}
