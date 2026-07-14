'use client';

import { useCallback } from 'react';
import { useImageStore } from '@/stores/imageStore';
import { usePatternStore } from '@/stores/patternStore';
import { loadImage, imageToImageData, resizeImageData, imageDataToGrid } from '@/lib/imageProcessor';
import { quantizeColors } from '@/lib/colorQuantizer';
import { applyDithering } from '@/lib/dithering';
import { STITCH_LIBRARY, type StitchType } from '@/types';

export function useImageProcessor() {
  const { setImage, originalImageData, clearImage } = useImageStore();
  const { colorCount, colorMode, singleYarnColor, ditherMode, resolution, finishedSize, gauge, setGrid, setPalette, setStitchMapping, setFinishedSizeFromImage } =
    usePatternStore();

  const generateFromImageData = useCallback(
    (imageData: ImageData) => {
      const resizedData = resizeImageData(imageData, 800);
      
      const targetWidth = Math.max(1, Math.round(finishedSize.width * gauge.stitchesPerUnit));
      const targetHeight = Math.max(1, Math.round(finishedSize.height * gauge.rowsPerUnit));

      const { cells } = imageDataToGrid(resizedData, resolution, targetWidth, targetHeight);
      
      let palette: string[];
      let processedCells: number[][];
      
      if (colorMode === 'single') {
        // Single color mode: user color + white (lace)
        // palette[0] = user's yarn color (solid)
        // palette[1] = white (lace)
        palette = [singleYarnColor, '#FFFFFF'];
        
        // Convert to grayscale first, then to binary
        const grayCells = cells.map(row => 
          row.map(pixel => {
            const r = (pixel >> 16) & 0xff;
            const g = (pixel >> 8) & 0xff;
            const b = pixel & 0xff;
            const gray = r * 0.299 + g * 0.587 + b * 0.114;
            return gray; // 0-255 grayscale value
          })
        );
        
        // Apply dithering - this converts grayscale to binary using the palette
        if (ditherMode === 'none') {
          // Simple threshold
          processedCells = grayCells.map(row => 
            row.map(gray => gray > 128 ? 1 : 0) // 1 = white (lace), 0 = yarn color (solid)
          );
        } else {
          // Use dithering with binary palette
          // Create binary palette for dithering: [yarnColor, white]
          const binaryPalette = [singleYarnColor, '#FFFFFF'];
          processedCells = applyDithering(
            grayCells.map(row => row.map(gray => (Math.round(gray) << 16) | (Math.round(gray) << 8) | Math.round(gray))),
            binaryPalette,
            ditherMode
          );
        }
        
        // Set stitch mapping: 0 = yarn color (solid), 1 = white (lace)
        setStitchMapping(0, 'single');
        setStitchMapping(1, 'lace');
      } else {
        // Multi color mode: use quantized colors
        palette = quantizeColors(resizedData, colorCount);
        processedCells = applyDithering(cells, palette, ditherMode);
        
        // Set default stitch mappings
        const defaultStitches: StitchType[] = ['single', 'double', 'halfDouble', 'treble', 'chain', 'slip', 'popcorn', 'cluster3', 'picot', 'shell', 'vStitch', 'crossed', 'knit', 'purl', 'rib', 'seed', 'cable', 'lace'];
        for (let i = 0; i < palette.length; i++) {
          const stitchId = defaultStitches[i % defaultStitches.length];
          const stitch = STITCH_LIBRARY.find((s) => s.id === stitchId);
          if (stitch) {
            setStitchMapping(i, stitch.id);
          }
        }
      }

      setGrid({
        width: targetWidth,
        height: targetHeight,
        cells: processedCells,
        resolution,
        palette,
      });
      setPalette(palette);
    },
    [colorCount, colorMode, singleYarnColor, ditherMode, resolution, finishedSize, gauge, setGrid, setPalette, setStitchMapping]
  );

  const processImage = useCallback(
    async (file: File) => {
      const img = await loadImage(file);
      const imageData = imageToImageData(img);
      setImage(img, imageData, file);
      // 根据图片尺寸自动设置成品尺寸比例
      setFinishedSizeFromImage(img.width, img.height);
      generateFromImageData(imageData);
    },
    [setImage, generateFromImageData, setFinishedSizeFromImage]
  );

  const regenerateGrid = useCallback(() => {
    if (originalImageData) {
      generateFromImageData(originalImageData);
    }
  }, [originalImageData, generateFromImageData]);

  const clearAll = useCallback(() => {
    clearImage();
    setGrid({
      width: 0,
      height: 0,
      cells: [],
      resolution: 80,
      palette: [],
    });
    setPalette([]);
  }, [clearImage, setGrid, setPalette]);

  return { processImage, regenerateGrid, clearAll };
}

