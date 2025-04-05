'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = 'solar-way-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Сначала проверяем localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (savedLanguage && (savedLanguage === 'uk' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
      return;
    }

    // Если в localStorage нет сохраненного языка, используем язык браузера
    const browserLang = navigator.language.split('-')[0];
    const initialLang = browserLang === 'uk' ? 'uk' : 'en';
    setLanguage(initialLang);
    localStorage.setItem(LANGUAGE_KEY, initialLang);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLang = prev === 'uk' ? 'en' : 'uk';
      localStorage.setItem(LANGUAGE_KEY, newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
} 