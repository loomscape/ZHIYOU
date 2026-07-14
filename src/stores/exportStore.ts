import { create } from 'zustand';
import type { Instruction } from '@/types';
import type { Language } from '@/lib/i18n';

interface ExportState {
  instructions: Instruction[];
  language: Language;
  isGenerating: boolean;
  setInstructions: (instructions: Instruction[]) => void;
  setLanguage: (lang: Language) => void;
  setIsGenerating: (generating: boolean) => void;
}

const getDefaultLanguage = (): Language => {
  if (typeof window === 'undefined') return 'zh-CN';
  const saved = localStorage.getItem('loomscape-language');
  if (saved && ['zh-CN', 'zh-TW', 'en', 'ja', 'ko'].includes(saved)) {
    return saved as Language;
  }
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) return 'zh-TW';
  if (browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ko')) return 'ko';
  return 'en';
};

export const useExportStore = create<ExportState>()((set) => ({
  instructions: [],
  language: getDefaultLanguage(),
  isGenerating: false,
  setInstructions: (instructions) => set({ instructions }),
  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('loomscape-language', language);
    }
    set({ language });
  },
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
