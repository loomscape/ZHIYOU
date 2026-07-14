'use client';

import { LANGUAGES } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-pure-white/80 backdrop-blur-md border border-soft-linen hover:bg-pure-white transition-all shadow-sm"
      >
        <Globe className="w-4 h-4 text-text-secondary" />
        <span className="text-sm font-medium text-graphite hidden sm:inline">
          {currentLang.native}
        </span>
        <span className="text-lg leading-none sm:hidden">{currentLang.flag}</span>
        <ChevronDown className={clsx(
          'w-4 h-4 text-text-secondary transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-pure-white rounded-[16px] border border-soft-linen shadow-lg py-2 z-50 min-w-[160px] overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as Language);
                setIsOpen(false);
              }}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-2.5 hover:bg-soft-linen/50 transition-colors text-left',
                language === lang.code && 'bg-sky-thread/10 text-sky-thread font-semibold'
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <div>
                <div className={clsx(
                  'text-sm font-medium',
                  language === lang.code ? 'text-sky-thread' : 'text-graphite'
                )}>
                  {lang.native}
                </div>
                <div className="text-[10px] text-text-secondary">{lang.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
