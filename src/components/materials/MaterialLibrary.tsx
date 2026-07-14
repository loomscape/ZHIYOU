'use client';

import { useMaterialStore } from '@/stores/materialStore';
import { YARN_LIBRARY } from '@/types';
import type { YarnCategory, YarnFiber } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { Panel } from '@/components/ui/Panel';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

type FiberFilter = 'all' | YarnFiber | 'specialty';

const FIBER_FILTER_IDS: FiberFilter[] = ['all', 'cotton', 'wool', 'acrylic', 'blend', 'specialty'];

const CATEGORY_LABEL_KEYS: Record<YarnCategory, string> = {
  lace: 'yarnPanel.categories.lace',
  superFine: 'yarnPanel.categories.superFine',
  fine: 'yarnPanel.categories.fine',
  light: 'yarnPanel.categories.light',
  medium: 'yarnPanel.categories.medium',
  bulky: 'yarnPanel.categories.bulky',
  superBulky: 'yarnPanel.categories.superBulky',
  jumbo: 'yarnPanel.categories.jumbo',
};

export function MaterialLibrary() {
  const { materials, selectedMaterialIndex, setSelectedMaterialIndex, updateMaterial } = useMaterialStore();
  const { t, language } = useTranslation();
  const [fiberFilter, setFiberFilter] = useState<FiberFilter>('all');
  const [showDetail, setShowDetail] = useState(true);

  const filteredYarns = fiberFilter === 'all'
    ? YARN_LIBRARY
    : fiberFilter === 'specialty'
    ? YARN_LIBRARY.filter((y) => ['linen', 'silk', 'mohair', 'cashmere', 'modal', 'bamboo', 'tshirt', 'chenille'].includes(y.fiber))
    : YARN_LIBRARY.filter((y) => y.fiber === fiberFilter);

  const selectedYarn = YARN_LIBRARY[selectedMaterialIndex] || YARN_LIBRARY[0];

  const getFiberFilterLabel = (filter: FiberFilter): string => {
    return t(`yarnPanel.filters.${filter}`);
  };

  return (
    <Panel title={t('yarnPanel.title')}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-text-secondary">
          <Palette className="w-4 h-4" />
          <span className="text-xs font-semibold">
            {t('yarnPanel.subtitle')}
          </span>
        </div>

        {/* Fiber Filter */}
        <div className="flex gap-1 flex-wrap">
          {FIBER_FILTER_IDS.map((f) => (
            <button
              key={f}
              onClick={() => setFiberFilter(f)}
              className={clsx(
                'px-2 py-1 text-[10px] font-semibold rounded-[8px] transition-all',
                fiberFilter === f
                  ? 'bg-sky-thread text-white shadow-sm'
                  : 'bg-soft-linen/50 text-text-secondary hover:bg-soft-linen'
              )}
            >
              {getFiberFilterLabel(f)}
            </button>
          ))}
        </div>

        {/* Yarn Grid */}
        <div className="grid grid-cols-4 gap-2">
          {filteredYarns.map((yarn, i) => {
            const realIndex = YARN_LIBRARY.findIndex((y) => y.id === yarn.id);
            return (
              <button
                key={yarn.id}
                onClick={() => setSelectedMaterialIndex(realIndex)}
                className={clsx(
                  'flex flex-col items-center gap-1 p-2 rounded-[14px] transition-all',
                  selectedMaterialIndex === realIndex
                    ? 'bg-sky-thread/10 ring-2 ring-sky-thring scale-105'
                    : 'bg-pure-white hover:bg-soft-linen/50 border border-soft-linen/50'
                )}
                title={yarn.name[language]}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-sm border-2 border-pure-white"
                  style={{ backgroundColor: yarn.color }}
                />
                <span className="text-[9px] font-semibold text-graphite truncate w-full text-center leading-tight">
                  {yarn.name[language]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Yarn Detail */}
        {showDetail && selectedYarn && (
          <div className="pt-3 border-t border-soft-linen space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full shadow-md border-2 border-pure-white flex-shrink-0"
                style={{ backgroundColor: selectedYarn.color }}
              />
              <div>
              <h4 className="text-sm font-semibold text-graphite">
                {selectedYarn.name[language]}
              </h4>
              <p className="text-[11px] text-text-secondary">
                {t(CATEGORY_LABEL_KEYS[selectedYarn.category])}
              </p>
            </div>
            </div>

            {selectedYarn.description && (
              <p className="text-xs text-text-secondary leading-relaxed">
                {selectedYarn.description[language]}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              {selectedYarn.recommendedHook && (
                <div className="bg-mint-yarn/10 rounded-[10px] p-2 border border-mint-yarn/20">
                  <div className="text-[10px] text-text-secondary mb-0.5">
                    {t('yarnPanel.recommendedHook')}
                  </div>
                  <div className="text-xs font-semibold text-graphite">
                    {selectedYarn.recommendedHook}
                  </div>
                </div>
              )}
              {selectedYarn.recommendedNeedle && (
                <div className="bg-lavender-loop/10 rounded-[10px] p-2 border border-lavender-loop/20">
                  <div className="text-[10px] text-text-secondary mb-0.5">
                    {t('yarnPanel.recommendedNeedle')}
                  </div>
                  <div className="text-xs font-semibold text-graphite">
                    {selectedYarn.recommendedNeedle}
                  </div>
                </div>
              )}
            </div>

            {/* Properties */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>{t('yarnPanel.thickness')}</span>
                  <span>{Math.round(materials[selectedMaterialIndex]?.thickness * 100 || 70)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={materials[selectedMaterialIndex]?.thickness ?? selectedYarn.thickness}
                  onChange={(e) => updateMaterial(selectedMaterialIndex, { thickness: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-soft-linen rounded-full appearance-none cursor-pointer accent-sky-thread"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>{t('yarnPanel.elasticity')}</span>
                  <span>{Math.round(materials[selectedMaterialIndex]?.elasticity * 100 || 50)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={materials[selectedMaterialIndex]?.elasticity ?? selectedYarn.elasticity}
                  onChange={(e) => updateMaterial(selectedMaterialIndex, { elasticity: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-soft-linen rounded-full appearance-none cursor-pointer accent-sky-thread"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-text-secondary mb-1">
                  <span>{t('yarnPanel.fuzziness')}</span>
                  <span>{Math.round(materials[selectedMaterialIndex]?.fuzziness * 100 || 30)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={materials[selectedMaterialIndex]?.fuzziness ?? selectedYarn.fuzziness}
                  onChange={(e) => updateMaterial(selectedMaterialIndex, { fuzziness: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-soft-linen rounded-full appearance-none cursor-pointer accent-sky-thread"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
