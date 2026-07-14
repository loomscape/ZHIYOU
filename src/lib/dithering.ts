import type { DitherMode } from '@/types';
import { findClosestColor } from './colorQuantizer';

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map(row => row.map(v => v / 16 - 0.5));

export function applyDithering(
  cells: number[][],
  palette: string[],
  mode: DitherMode
): number[][] {
  if (mode === 'none') {
    return cells.map(row => row.map(color => findClosestColor(color, palette)));
  }

  const height = cells.length;
  const width = cells[0].length;
  const result: number[][] = Array.from({ length: height }, () => Array(width).fill(0));
  const errors: number[][][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => [0, 0, 0])
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const oldColor = cells[y][x];
      const oldR = ((oldColor >> 16) & 0xff) + errors[y][x][0];
      const oldG = ((oldColor >> 8) & 0xff) + errors[y][x][1];
      const oldB = (oldColor & 0xff) + errors[y][x][2];
      const quantizedColor = (Math.max(0, Math.min(255, Math.round(oldR))) << 16) |
        (Math.max(0, Math.min(255, Math.round(oldG))) << 8) |
        Math.max(0, Math.min(255, Math.round(oldB)));

      result[y][x] = findClosestColor(quantizedColor, palette);

      const newColor = parseInt(palette[result[y][x]].slice(1), 16);
      const newR = (newColor >> 16) & 0xff;
      const newG = (newColor >> 8) & 0xff;
      const newB = newColor & 0xff;

      const errR = oldR - newR;
      const errG = oldG - newG;
      const errB = oldB - newB;

      if (mode === 'floyd-steinberg') {
        const diffuse = (dx: number, dy: number, factor: number) => {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            errors[ny][nx][0] += errR * factor;
            errors[ny][nx][1] += errG * factor;
            errors[ny][nx][2] += errB * factor;
          }
        };
        diffuse(1, 0, 7 / 16);
        diffuse(-1, 1, 3 / 16);
        diffuse(0, 1, 5 / 16);
        diffuse(1, 1, 1 / 16);
      } else if (mode === 'bayer') {
        const threshold = BAYER_4X4[y % 4][x % 4];
        const factor = 1.5;
        const neighbors = [
          [1, 0], [-1, 1], [0, 1], [1, 1]
        ];
        for (const [dx, dy] of neighbors) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const weight = dy === 0 ? 0.25 : 0.125;
            errors[ny][nx][0] += errR * weight * factor + threshold * errR;
            errors[ny][nx][1] += errG * weight * factor + threshold * errG;
            errors[ny][nx][2] += errB * weight * factor + threshold * errB;
          }
        }
      }
    }
  }

  return result;
}
