'use client';

import { usePatternStore } from '@/stores/patternStore';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useImageStore } from '@/stores/imageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Select } from '@/components/ui/Select';
import { Panel } from '@/components/ui/Panel';
import { useEffect, useRef } from 'react';
import type { ColorCount, ColorMode, DitherMode, Resolution, UnitSystem } from '@/types';
import { Palette, Sparkles, Ruler, Gauge } from 'lucide-react';

export function ProcessingControls() {
  const {
    colorCount,
    colorMode,
    ditherMode,
    resolution,
    finishedSize,
    gauge,
    setColorCount,
    setColorMode,
    setDitherMode,
    setResolution,
    setFinishedSize,
    setGauge,
    setUnit,
  } = usePatternStore();
  const { originalImageData } = useImageStore();
  const { regenerateGrid } = useImageProcessor();
  const { t } = useTranslation();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (originalImageData) {
      regenerateGrid();
    }
  }, [
    colorCount,
    colorMode,
    ditherMode,
    resolution,
    finishedSize.width,
    finishedSize.height,
    finishedSize.unit,
    gauge.stitchesPerUnit,
    gauge.rowsPerUnit,
    gauge.unit,
    originalImageData,
    regenerateGrid,
  ]);

  const unitLabel = finishedSize.unit === 'cm' ? t('settingsPanel.cm') : t('settingsPanel.inch');
  const calculatedWidth = Math.round(finishedSize.width * gauge.stitchesPerUnit);
  const calculatedHeight = Math.round(finishedSize.height * gauge.rowsPerUnit);

  const colorModeOptions = [
    { value: 'multi', label: t('settingsPanel.colorModeMulti') },
    { value: 'single', label: t('settingsPanel.colorModeSingle') },
  ];

  const colorCountOptions = [
    { value: 2, label: `2 ${t('colorsPanel.title')}` },
    { value: 4, label: `4 ${t('colorsPanel.title')}` },
    { value: 8, label: `8 ${t('colorsPanel.title')}` },
    { value: 16, label: `16 ${t('colorsPanel.title')}` },
    { value: 32, label: `32 ${t('colorsPanel.title')}` },
  ];

  const ditherOptions = [
    { value: 'none', label: t('settingsPanel.ditherNone') },
    { value: 'floyd-steinberg', label: t('settingsPanel.ditherFloyd') },
    { value: 'bayer', label: t('settingsPanel.ditherBayer') },
  ];

  const resolutionOptions = [
    { value: 40, label: '40 × 40' },
    { value: 80, label: '80 × 80' },
    { value: 120, label: '120 × 120' },
    { value: 160, label: '160 × 160' },
    { value: 200, label: '200 × 200' },
  ];

  const unitOptions = [
    { value: 'cm', label: t('settingsPanel.cm') },
    { value: 'inch', label: t('settingsPanel.inch') },
  ];

  return (
    <Panel title={t('settingsPanel.title')}>
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-secondary">
            <Palette className="w-4 h-4" />
            <span className="text-xs font-semibold">{t('colorsPanel.palette')}</span>
          </div>
          <Select
            label={t('settingsPanel.colorMode')}
            options={colorModeOptions}
            value={colorMode}
            onChange={(v) => setColorMode(v as ColorMode)}
          />
          {colorMode === 'multi' && (
            <Select
              label={t('settingsPanel.colorCount')}
              options={colorCountOptions}
              value={colorCount}
              onChange={(v) => setColorCount(parseInt(v) as ColorCount)}
            />
          )}
          <Select
            label={t('settingsPanel.ditherMode')}
            options={ditherOptions}
            value={ditherMode}
            onChange={(v) => setDitherMode(v as DitherMode)}
          />
          <Select
            label={t('settingsPanel.resolution')}
            options={resolutionOptions}
            value={resolution}
            onChange={(v) => setResolution(parseInt(v) as Resolution)}
          />
        </div>

        <div className="pt-4 border-t border-soft-linen">
          <div className="flex items-center gap-2 text-text-secondary mb-3">
            <Ruler className="w-4 h-4" />
            <span className="text-xs font-semibold">{t('settingsPanel.finishedSize')}</span>
          </div>
          <div className="space-y-3">
            <Select
              label={t('settingsPanel.unit')}
              options={unitOptions}
              value={finishedSize.unit}
              onChange={(v) => setUnit(v as UnitSystem)}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{t('settingsPanel.width')} ({unitLabel})</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  step={0.5}
                  value={finishedSize.width}
                  onChange={(e) => setFinishedSize({ width: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2.5 bg-pure-white border border-soft-linen rounded-[14px] text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-sky-thread focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{t('settingsPanel.height')} ({unitLabel})</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  step={0.5}
                  value={finishedSize.height}
                  onChange={(e) => setFinishedSize({ height: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2.5 bg-pure-white border border-soft-linen rounded-[14px] text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-sky-thread focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-soft-linen">
          <div className="flex items-center gap-2 text-text-secondary mb-3">
            <Gauge className="w-4 h-4" />
            <span className="text-xs font-semibold">{t('settingsPanel.gauge')}</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{t('settingsPanel.stitchesPerUnit')}</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  step={0.5}
                  value={gauge.stitchesPerUnit}
                  onChange={(e) => setGauge({ stitchesPerUnit: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2.5 bg-pure-white border border-soft-linen rounded-[14px] text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-sky-thread focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-text-secondary">{t('settingsPanel.rowsPerUnit')}</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  step={0.5}
                  value={gauge.rowsPerUnit}
                  onChange={(e) => setGauge({ rowsPerUnit: parseFloat(e.target.value) || 0 })}
                  className="px-3 py-2.5 bg-pure-white border border-soft-linen rounded-[14px] text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-sky-thread focus:border-transparent"
                />
              </div>
            </div>
            <div className="text-xs text-text-secondary bg-mint-yarn/10 rounded-[12px] px-3 py-2.5 border border-mint-yarn/20">
              <span className="font-medium text-graphite">{calculatedWidth}</span> {t('chart.stitches')} ×{' '}
              <span className="font-medium text-graphite">{calculatedHeight}</span> {t('chart.rows')}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
