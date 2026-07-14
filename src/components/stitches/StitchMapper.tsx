'use client';

import { usePatternStore } from '@/stores/patternStore';
import { STITCH_LIBRARY } from '@/types';
import type { StitchType } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Panel } from '@/components/ui/Panel';
import { Shapes, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

type StitchCategory = 'all' | 'basic' | 'texture' | 'lace' | 'knitting';

const CATEGORY_IDS: StitchCategory[] = ['all', 'basic', 'texture', 'lace', 'knitting'];

export function StitchMapper() {
  const { palette, stitchMapping, setStitchMapping } = usePatternStore();
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<StitchCategory>('all');
  const [expandedColor, setExpandedColor] = useState<number | null>(0);

  const filteredStitches = activeCategory === 'all'
    ? STITCH_LIBRARY
    : STITCH_LIBRARY.filter((s) => s.category === activeCategory);

  if (palette.length === 0) {
    return null;
  }

  const getStitchSymbol = (type: StitchType): string => {
    return STITCH_LIBRARY.find((s) => s.id === type)?.symbol || '';
  };

  const getCategoryLabel = (cat: StitchCategory): string => {
    return t(`stitchesPanel.categories.${cat}`);
  };

  return (
    <Panel title={t('stitchesPanel.title')}>
      <div className="flex items-center gap-2 text-text-secondary mb-3">
        <Shapes className="w-4 h-4" />
        <span className="text-xs font-semibold">
          {t('stitchesPanel.subtitle')}
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-3 flex-wrap">
        {CATEGORY_IDS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'px-2.5 py-1 text-[11px] font-semibold rounded-[10px] transition-all',
              activeCategory === cat
                ? 'bg-sky-thread text-white shadow-sm'
                : 'bg-soft-linen/50 text-text-secondary hover:bg-soft-linen'
            )}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Color - Stitch Mapping */}
      <div className="space-y-2">
        {palette.map((color, index) => {
          const currentStitch = stitchMapping.get(index) || 'single';
          const currentStitchInfo = STITCH_LIBRARY.find((s) => s.id === currentStitch);
          const isExpanded = expandedColor === index;

          return (
            <div key={index} className="border border-soft-linen rounded-[14px] overflow-hidden">
              {/* Selected Row */}
              <button
                onClick={() => setExpandedColor(isExpanded ? null : index)}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-soft-linen/30 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-[10px] border-2 border-soft-linen flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-graphite flex items-center gap-2">
                    <span className="text-lg leading-none w-6 text-center">
                      {currentStitchInfo?.symbol || '○'}
                    </span>
                    <span>{currentStitchInfo?.name[language] || currentStitch}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary">
                    {currentStitchInfo?.abbreviation.toUpperCase()}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-text-secondary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                )}
              </button>

              {/* Expanded Stitch Grid */}
              {isExpanded && (
                <div className="border-t border-soft-linen p-2 bg-cloud-white/50">
                  <div className="grid grid-cols-3 gap-1.5">
                    {filteredStitches.map((stitch) => (
                      <button
                        key={stitch.id}
                        onClick={() => {
                          setStitchMapping(index, stitch.id);
                          setExpandedColor(null);
                        }}
                        className={clsx(
                          'flex flex-col items-center gap-0.5 p-2 rounded-[12px] transition-all',
                          currentStitch === stitch.id
                            ? 'bg-sky-thread text-white shadow-md scale-105'
                            : 'bg-pure-white text-graphite hover:bg-soft-linen/50 border border-soft-linen/50'
                        )}
                        title={stitch.description[language]}
                      >
                        <span className="text-lg leading-none">{stitch.symbol}</span>
                        <span className="text-[9px] font-semibold truncate w-full text-center">
                          {stitch.abbreviation}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
