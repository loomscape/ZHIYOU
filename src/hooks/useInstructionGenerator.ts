'use client';

import type { PatternGrid, StitchType, Instruction } from '@/types';
import { STITCH_LIBRARY } from '@/types';
import type { Language } from '@/lib/i18n';

const STITCH_ABBREV: Record<StitchType, Record<Language, string>> = STITCH_LIBRARY.reduce(
  (acc, stitch) => {
    acc[stitch.id] = {
      'zh-CN': stitch.abbreviation.toUpperCase(),
      'zh-TW': stitch.abbreviation.toUpperCase(),
      en: stitch.abbreviation.toUpperCase(),
      ja: stitch.abbreviation.toUpperCase(),
      ko: stitch.abbreviation.toUpperCase(),
    };
    return acc;
  },
  {} as Record<StitchType, Record<Language, string>>
);

export function useInstructionGenerator() {
  const generateInstructions = (
    grid: PatternGrid,
    stitchMapping: Map<number, StitchType>,
    language: Language = 'en'
  ): Instruction[] => {
    const instructions: Instruction[] = [];

    for (let row = 0; row < grid.height; row++) {
      const groups: { stitch: StitchType; count: number; colorIndex: number }[] = [];
      let currentStitch: StitchType | null = null;
      let currentColor = -1;
      let count = 0;

      for (let col = 0; col < grid.width; col++) {
        const colorIndex = grid.cells[row][col];
        const stitch = stitchMapping.get(colorIndex) || 'single';

        if (stitch === currentStitch && colorIndex === currentColor) {
          count++;
        } else {
          if (currentStitch !== null) {
            groups.push({ stitch: currentStitch, count, colorIndex: currentColor });
          }
          currentStitch = stitch;
          currentColor = colorIndex;
          count = 1;
        }
      }
      if (currentStitch !== null) {
        groups.push({ stitch: currentStitch, count, colorIndex: currentColor });
      }

      const stitchStr = groups
        .map((g) => {
          const abbrev = STITCH_ABBREV[g.stitch]?.[language] || '?';
          return g.count > 1 ? `${abbrev}${g.count}` : abbrev;
        })
        .join(', ');

      instructions.push({
        rowNumber: row + 1,
        stitches: stitchStr,
      });
    }

    return instructions;
  };

  return { generateInstructions };
}
