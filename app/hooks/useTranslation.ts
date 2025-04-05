'use client';

import { useMemo } from 'react';
import { translations } from '../i18n/translations';
import { useLanguageContext } from '../contexts/LanguageContext';

export function useTranslation() {
  const { language } = useLanguageContext();

  // Используем useMemo для создания функции перевода, которая будет пересоздаваться при изменении языка
  return useMemo(() => {
    return (key: string): string => {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    };
  }, [language]);
} 