import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ImageState {
  originalImage: HTMLImageElement | null;
  originalImageData: ImageData | null;
  fileName: string;
  dimensions: { width: number; height: number };
  fileSize: number;
  isLoading: boolean;
  error: string | null;
  setImage: (img: HTMLImageElement, imageData: ImageData, file: File) => void;
  clearImage: () => void;
}

export const useImageStore = create<ImageState>()(
  persist(
    (set) => ({
      originalImage: null,
      originalImageData: null,
      fileName: '',
      dimensions: { width: 0, height: 0 },
      fileSize: 0,
      isLoading: false,
      error: null,
      setImage: (img, imageData, file) =>
        set({
          originalImage: img,
          originalImageData: imageData,
          fileName: file.name,
          dimensions: { width: img.width, height: img.height },
          fileSize: file.size,
          error: null,
        }),
      clearImage: () =>
        set({
          originalImage: null,
          originalImageData: null,
          fileName: '',
          dimensions: { width: 0, height: 0 },
          fileSize: 0,
        }),
    }),
    {
      name: 'loomscape-image',
      partialize: (state) => ({
        fileName: state.fileName,
        dimensions: state.dimensions,
        fileSize: state.fileSize,
      }),
    }
  )
);
