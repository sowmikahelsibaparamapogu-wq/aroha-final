import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES, getTranslation } from '../utils/translations';

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('aroha_lang');
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem('aroha_lang', newLang);
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(key, lang) || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
