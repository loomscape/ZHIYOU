'use client';

import { useExportStore } from '@/stores/exportStore';
import { translations, type Language, type TranslationKeys } from '@/lib/i18n';

export function useTranslation() {
  const { language, setLanguage } = useExportStore();

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return path;
      }
    }
    return typeof value === 'string' ? value : path;
  };

  return {
    t,
    language: language as Language,
    setLanguage: (lang: Language) => setLanguage(lang),
    translations: translations[language] as TranslationKeys,
  };
}
