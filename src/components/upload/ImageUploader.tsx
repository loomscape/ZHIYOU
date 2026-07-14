'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useImageStore } from '@/stores/imageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export function ImageUploader() {
  const { processImage } = useImageProcessor();
  const { fileName, dimensions, fileSize, clearImage } = useImageStore();
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert(t('importPanel.invalidFormat'));
      return;
    }
    setIsProcessing(true);
    try {
      await processImage(file);
    } catch (err) {
      console.error('Failed to process image:', err);
      alert(t('common.error'));
    }
    setIsProcessing(false);
  }, [processImage, t]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (fileName) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-pure-white rounded-[16px] border border-soft-linen shadow-sm">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-sky-thread/20 to-mint-yarn/20 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-sky-thread" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-graphite truncate">{fileName}</p>
            <p className="text-xs text-text-secondary">
              {dimensions.width} x {dimensions.height} • {formatFileSize(fileSize)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearImage}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={clsx(
        'border-2 border-dashed rounded-[20px] p-6 text-center transition-all cursor-pointer',
        isDragging
          ? 'border-sky-thread bg-sky-thread/5 scale-[1.02]'
          : 'border-soft-linen hover:border-sky-thread/50 hover:bg-pure-white'
      )}
    >
      <input
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleInputChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer block">
        <div className="flex flex-col items-center gap-3">
          <div className={clsx(
            'w-16 h-16 rounded-[20px] flex items-center justify-center transition-all',
            isProcessing
              ? 'bg-gradient-to-br from-sky-thread/20 to-mint-yarn/20'
              : 'bg-gradient-to-br from-butter-yellow/20 to-coral-stitch/20'
          )}>
            {isProcessing ? (
              <Sparkles className="w-7 h-7 text-sky-thread animate-pulse" />
            ) : (
              <Upload className="w-7 h-7 text-coral-stitch" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-graphite">
              {isProcessing ? t('settingsPanel.spinning') : t('importPanel.dropHint')}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {t('importPanel.supportedFormats')}
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}
