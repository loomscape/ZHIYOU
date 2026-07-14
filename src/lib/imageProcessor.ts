export interface ImageProcessorResult {
  imageData: ImageData;
  width: number;
  height: number;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function imageToImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function resizeImageData(
  imageData: ImageData,
  maxSize: number
): ImageData {
  const { width, height, data } = imageData;
  const scale = Math.min(maxSize / width, maxSize / height, 1);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Failed to get temp canvas context');
  tempCtx.putImageData(imageData, 0, 0);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);

  return ctx.getImageData(0, 0, newWidth, newHeight);
}

export function imageDataToGrid(
  imageData: ImageData,
  resolution: number,
  targetWidth?: number,
  targetHeight?: number
): { cells: number[][]; width: number; height: number } {
  const { width, height, data } = imageData;
  const cols = targetWidth || resolution;
  const rows = targetHeight || resolution;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const cells: number[][] = [];

  for (let y = 0; y < rows; y++) {
    const row: number[] = [];
    for (let x = 0; x < cols; x++) {
      const startX = Math.floor(x * cellWidth);
      const startY = Math.floor(y * cellHeight);
      const endX = Math.floor((x + 1) * cellWidth);
      const endY = Math.floor((y + 1) * cellHeight);

      let r = 0,
        g = 0,
        b = 0,
        count = 0;
      for (let py = startY; py < endY && py < height; py++) {
        for (let px = startX; px < endX && px < width; px++) {
          const i = (py * width + px) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }
      row.push(
        count > 0
          ? (Math.floor(r / count) << 16) | (Math.floor(g / count) << 8) | Math.floor(b / count)
          : 0
      );
    }
    cells.push(row);
  }

  return { cells, width: cols, height: rows };
}
