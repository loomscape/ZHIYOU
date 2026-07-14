'use client';

import { useState } from 'react';
import { usePatternStore } from '@/stores/patternStore';
import { useTranslation } from '@/hooks/useTranslation';
import { clsx } from 'clsx';
import { Panel } from '@/components/ui/Panel';
import { Paintbrush } from 'lucide-react';

export function ColorPalette() {
  const { palette, selectedColorIndex, setSelectedColorIndex, colorMode, singleYarnColor, setSingleYarnColor } = usePatternStore();
  const { t } = useTranslation();
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (palette.length === 0) {
    return null;
  }

  return (
    <Panel title={t('colorsPanel.title')}>
      <div className="flex items-center gap-2 text-text-secondary mb-3">
        <Paintbrush className="w-4 h-4" />
        <span className="text-xs font-semibold">{t('colorsPanel.palette')}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {colorMode === 'single' ? (
          <>
            {/* Single color mode: Lace (white) and Solid (user's yarn color) */}
            {/* Lace - white/镂空 */}
            <button
              onClick={() => setSelectedColorIndex(1)}
              className={clsx(
                'w-9 h-9 rounded-[12px] border-2 transition-all hover:scale-110 relative overflow-hidden',
                selectedColorIndex === 1
                  ? 'border-sky-thread ring-2 ring-sky-thread/30 scale-110'
                  : 'border-soft-linen hover:border-sky-thread/50'
              )}
              style={{ backgroundColor: '#FFFFFF' }}
              title={t('colorsPanel.lace')}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 font-medium">○</span>
            </button>
            
            {/* Solid - user's yarn color */}
            <div className="relative">
              <button
                onClick={() => setSelectedColorIndex(0)}
                className={clsx(
                  'w-9 h-9 rounded-[12px] border-2 transition-all hover:scale-110',
                  selectedColorIndex === 0
                    ? 'border-sky-thread ring-2 ring-sky-thread/30 scale-110'
                    : 'border-soft-linen hover:border-sky-thread/50'
                )}
                style={{ backgroundColor: singleYarnColor }}
                title={t('colorsPanel.solid')}
              />
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[8px] text-gray-500 hover:bg-gray-100"
                title={t('colorsPanel.changeColor')}
              >
                ✎
              </button>
            </div>
            
            {/* Color picker popup */}
            {showColorPicker && (
              <div className="absolute z-50 mt-2 p-2 bg-white rounded-lg shadow-xl border border-gray-200">
                <input
                  type="color"
                  value={singleYarnColor}
                  onChange={(e) => setSingleYarnColor(e.target.value)}
                  className="w-20 h-20 cursor-pointer rounded-lg"
                />
                <div className="mt-2">
                  <input
                    type="text"
                    value={singleYarnColor}
                    onChange={(e) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        setSingleYarnColor(e.target.value);
                      }
                    }}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                  />
                </div>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="mt-2 w-full px-3 py-1.5 text-xs bg-sky-thread text-white rounded-lg hover:bg-sky-thread/90"
                >
                  OK
                </button>
              </div>
            )}
          </>
        ) : (
          /* Multi color mode: regular palette */
          palette.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColorIndex(index)}
              className={clsx(
                'w-9 h-9 rounded-[12px] border-2 transition-all hover:scale-110',
                selectedColorIndex === index
                  ? 'border-sky-thread ring-2 ring-sky-thread/30 scale-110'
                  : 'border-soft-linen hover:border-sky-thread/50'
              )}
              style={{ backgroundColor: color }}
              title={`${t('colorsPanel.palette')} ${index + 1}`}
            />
          ))
        )}
      </div>
    </Panel>
  );
}
