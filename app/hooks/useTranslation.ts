'use client';

import { useLanguage } from './useLanguage';
import { translations } from '../i18n/translations';

type TranslationFunction = (key: string) => string;

export function useTranslation(): TranslationFunction {
  const { language } = useLanguage();

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
} 