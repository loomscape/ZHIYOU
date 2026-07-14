'use client';

import { useEffect, useRef, useState } from 'react';
import { usePatternStore } from '@/stores/patternStore';
import { useTranslation } from '@/hooks/useTranslation';
import { RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

export function KnitPreview3D() {
  const { grid, palette } = usePatternStore();
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!grid || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    ctx.scale(dpr, dpr);

    // Stitch size based on container
    const stitchW = 12 * scale;
    const stitchH = 10 * scale;

    const totalWidth = grid.width * stitchW;
    const totalHeight = grid.height * stitchH;

    // Center if no offset
    let drawOffsetX = offset.x;
    let drawOffsetY = offset.y;
    if (offset.x === 0 && offset.y === 0) {
      drawOffsetX = (displayWidth - totalWidth) / 2;
      drawOffsetY = (displayHeight - totalHeight) / 2;
    }

    // Background
    ctx.fillStyle = '#faf8f3';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Draw fabric shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#fff';
    ctx.fillRect(drawOffsetX - 4, drawOffsetY - 4, totalWidth + 8, totalHeight + 8);
    ctx.restore();

    // Draw each stitch (row by row, bottom to top for crochet feel)
    for (let row = grid.height - 1; row >= 0; row--) {
      for (let col = 0; col < grid.width; col++) {
        const colorIndex = grid.cells[row][col];
        const color = palette[colorIndex] || '#ccc';
        const x = drawOffsetX + col * stitchW;
        const y = drawOffsetY + (grid.height - 1 - row) * stitchH;

        // Adjust color for 3D effect
        const baseColor = hexToRgb(color);
        
        // Highlight (top-left)
        const highlightColor = `rgb(${Math.min(255, baseColor.r + 40)}, ${Math.min(255, baseColor.g + 40)}, ${Math.min(255, baseColor.b + 40)})`;
        // Shadow (bottom-right)
        const shadowColor = `rgb(${Math.max(0, baseColor.r - 30)}, ${Math.max(0, baseColor.g - 30)}, ${Math.max(0, baseColor.b - 30)})`;

        // Draw stitch loop (U-shape with 3D effect)
        ctx.save();
        ctx.beginPath();

        const pad = 1;
        const w = stitchW - pad * 2;
        const h = stitchH - pad * 1;

        // U-shape stitch (like crochet single stitch)
        ctx.moveTo(x + pad, y + pad + h * 0.3);
        ctx.quadraticCurveTo(x + pad, y + pad, x + pad + w * 0.2, y + pad);
        ctx.lineTo(x + pad + w * 0.8, y + pad);
        ctx.quadraticCurveTo(x + pad + w, y + pad, x + pad + w, y + pad + h * 0.3);
        ctx.lineTo(x + pad + w * 0.85, y + pad + h);
        ctx.quadraticCurveTo(x + pad + w * 0.5, y + pad + h * 0.9, x + pad + w * 0.15, y + pad + h);
        ctx.closePath();

        // Fill with gradient for 3D effect
        const gradient = ctx.createLinearGradient(x, y, x + stitchW, y + stitchH);
        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, shadowColor);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner highlight line
        ctx.beginPath();
        ctx.strokeStyle = highlightColor;
        ctx.lineWidth = 0.8;
        ctx.moveTo(x + pad + w * 0.25, y + pad + 1);
        ctx.quadraticCurveTo(x + pad + w * 0.5, y + pad + 0.5, x + pad + w * 0.75, y + pad + 1);
        ctx.stroke();

        // Bottom V shape
        ctx.beginPath();
        ctx.strokeStyle = shadowColor;
        ctx.lineWidth = 0.6;
        ctx.moveTo(x + pad + w * 0.35, y + pad + h * 0.85);
        ctx.lineTo(x + pad + w * 0.5, y + pad + h * 0.7);
        ctx.lineTo(x + pad + w * 0.65, y + pad + h * 0.85);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Fabric edge shadow (vignette)
    const edgeGradient = ctx.createRadialGradient(
      displayWidth / 2, displayHeight / 2, Math.min(totalWidth, totalHeight) * 0.4,
      displayWidth / 2, displayHeight / 2, Math.max(totalWidth, totalHeight) * 0.7
    );
    edgeGradient.addColorStop(0, 'rgba(255,255,255,0)');
    edgeGradient.addColorStop(1, 'rgba(250,248,243,0.8)');
    ctx.fillStyle = edgeGradient;
    ctx.fillRect(0, 0, displayWidth, displayHeight);

  }, [grid, palette, scale, offset]);

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 200, g: 200, b: 200 };
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.2), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  if (!grid) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🧶</div>
          <p className="text-text-secondary text-sm font-medium">{t('empty.noPreview')}</p>
          <p className="text-text-secondary/60 text-xs mt-2">{t('previewPanel.uploadHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} className="block" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setScale(prev => Math.min(prev * 1.2, 5))}
          className="w-9 h-9 rounded-[12px] bg-pure-white/90 shadow-lg border border-soft-linen/50 flex items-center justify-center text-text-secondary hover:text-graphite hover:bg-pure-white transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale(prev => Math.max(prev * 0.8, 0.2))}
          className="w-9 h-9 rounded-[12px] bg-pure-white/90 shadow-lg border border-soft-linen/50 flex items-center justify-center text-text-secondary hover:text-graphite hover:bg-pure-white transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="w-9 h-9 rounded-[12px] bg-pure-white/90 shadow-lg border border-soft-linen/50 flex items-center justify-center text-text-secondary hover:text-graphite hover:bg-pure-white transition-all"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div className="absolute bottom-4 left-4 bg-pure-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-soft-linen/50 text-xs text-text-secondary flex items-center gap-2">
        <Move className="w-3.5 h-3.5" />
        <span>Drag to move • Scroll to zoom</span>
      </div>
    </div>
  );
}
