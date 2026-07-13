"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "@/lib/translations";
import { useParams, useRouter, usePathname } from 'next/navigation';

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const langFromUrl = (params?.lang as Language) || "en";
  const [language, setLanguageState] = useState<Language>(langFromUrl);

  useEffect(() => {
    if (langFromUrl !== language && ['en', 'hi', 'te'].includes(langFromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(langFromUrl);
      document.documentElement.lang = langFromUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFromUrl]);

  const handleSetLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    
    if (pathname) {
      if (pathname === '/') {
        router.push(`/${lang}`);
      } else {
        const segments = pathname.split('/');
        if (['en', 'hi', 'te'].includes(segments[1])) {
          segments[1] = lang;
          router.push(segments.join('/'));
        } else {
          router.push(`/${lang}${pathname}`);
        }
      }
    } else {
      router.push(`/${lang}`);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
