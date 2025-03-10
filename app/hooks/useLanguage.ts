'use client';

import { useState, useEffect } from 'react';

type Language = 'uk' | 'en';

const LANGUAGE_KEY = 'solar-way-language';

export function useLanguage() {
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

  return { language, toggleLanguage };
} 