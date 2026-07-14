interface ColorBox {
  colors: number[];
  minR: number;
  maxR: number;
  minG: number;
  maxG: number;
  minB: number;
  maxB: number;
}

function getColorBox(colors: number[]): ColorBox {
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
  for (const color of colors) {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    minR = Math.min(minR, r); maxR = Math.max(maxR, r);
    minG = Math.min(minG, g); maxG = Math.max(maxG, g);
    minB = Math.min(minB, b); maxB = Math.max(maxB, b);
  }
  return { colors, minR, maxR, minG, maxG, minB, maxB };
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const rangeR = box.maxR - box.minR;
  const rangeG = box.maxG - box.minG;
  const rangeB = box.maxB - box.minB;

  let sortKey: (c: number) => number;
  if (rangeR >= rangeG && rangeR >= rangeB) {
    sortKey = (c) => (c >> 16) & 0xff;
  } else if (rangeG >= rangeR && rangeG >= rangeB) {
    sortKey = (c) => (c >> 8) & 0xff;
  } else {
    sortKey = (c) => c & 0xff;
  }

  box.colors.sort((a, b) => sortKey(a) - sortKey(b));
  const mid = Math.floor(box.colors.length / 2);
  return [
    getColorBox(box.colors.slice(0, mid)),
    getColorBox(box.colors.slice(mid)),
  ];
}

function getAverageColor(box: ColorBox): number {
  let r = 0, g = 0, b = 0;
  for (const color of box.colors) {
    r += (color >> 16) & 0xff;
    g += (color >> 8) & 0xff;
    b += color & 0xff;
  }
  const len = box.colors.length;
  return ((Math.round(r / len) << 16) | (Math.round(g / len) << 8) | Math.round(b / len));
}

export function quantizeColors(imageData: ImageData, numColors: number): string[] {
  const { width, height, data } = imageData;
  const colorMap = new Map<number, number>();

  for (let i = 0; i < data.length; i += 4) {
    const color = ((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
    colorMap.set(color, (colorMap.get(color) || 0) + 1);
  }

  let boxes: ColorBox[] = [getColorBox(Array.from(colorMap.keys()))];

  while (boxes.length < numColors) {
    let maxVolume = 0;
    let maxBoxIndex = 0;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const volume = (box.maxR - box.minR + 1) * (box.maxG - box.minG + 1) * (box.maxB - box.minB + 1);
      if (volume > maxVolume) {
        maxVolume = volume;
        maxBoxIndex = i;
      }
    }

    if (boxes[maxBoxIndex].colors.length <= 1) break;

    const [box1, box2] = splitBox(boxes[maxBoxIndex]);
    boxes.splice(maxBoxIndex, 1, box1, box2);
  }

  return boxes.map(getAverageColor).map((c) => `#${c.toString(16).padStart(6, '0')}`);
}

export function findClosestColor(color: number, palette: string[]): number {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;

  let minDist = Infinity;
  let closest = 0;

  for (let i = 0; i < palette.length; i++) {
    const p = parseInt(palette[i].slice(1), 16);
    const pr = (p >> 16) & 0xff;
    const pg = (p >> 8) & 0xff;
    const pb = p & 0xff;
    const dist = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }

  return closest;
}
