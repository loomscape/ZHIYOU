'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import {
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Undo,
  Redo,
  X,
  Bookmark,
  RotateCcw,
  Target,
} from 'lucide-react';
import { clsx } from 'clsx';
import { usePatternStore } from '@/stores/patternStore';
import { STITCH_LIBRARY } from '@/types';
import type { ToolType } from '@/types';

const BASE_CELL_SIZE = 24;
const MIN_SCALE = 0.1;
const MAX_SCALE = 4;

const TOOLS: { type: ToolType; icon: typeof Pencil; label: string }[] = [
  { type: 'pencil', icon: Pencil, label: 'Pencil' },
  { type: 'eraser', icon: Eraser, label: 'Eraser' },
  { type: 'fill', icon: PaintBucket, label: 'Fill' },
  { type: 'eyedropper', icon: Pipette, label: 'Eyedropper' },
];

export function PatternCanvas() {
  const {
    grid,
    palette,
    stitchMapping,
    selectedColorIndex,
    selectedTool,
    overlayLayers,
    updateCell,
    setSelectedTool,
    undo,
    redo,
    history,
    future,
    workMode,
    isEditMode,
    guideLineX,
    guideLineY,
    setWorkMode,
    setGuideLineX,
    setGuideLineY,
    saveGuidePosition,
    restoreGuidePosition,
    autoFollow,
    toggleAutoFollow,
  } = usePatternStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [draggingGuide, setDraggingGuide] = useState<'x' | 'y' | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const cellSize = BASE_CELL_SIZE;
  const offsetX = 80;
  const offsetY = 80;

  const getStitchSymbol = useCallback(
    (colorIndex: number): string => {
      const stitch = stitchMapping.get(colorIndex);
      if (!stitch) return '';
      const stitchInfo = STITCH_LIBRARY.find((s) => s.id === stitch);
      return stitchInfo?.symbol || '';
    },
    [stitchMapping]
  );

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 200, g: 200, b: 200 };
  }

  useEffect(() => {
    if (!grid || !containerRef.current) return;

    const container = containerRef.current;
    const chartWidth = grid.width * cellSize + offsetX * 2;
    const chartHeight = grid.height * cellSize + offsetY * 2;

    const scaleX = (container.clientWidth - 40) / chartWidth;
    const scaleY = (container.clientHeight - 40) / chartHeight;
    const fitScale = Math.min(scaleX, scaleY, 1);

    setScale(fitScale);
    setOffset({
      x: (container.clientWidth - chartWidth * fitScale) / 2,
      y: (container.clientHeight - chartHeight * fitScale) / 2,
    });
  }, [grid, workMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const chartWidth = grid.width * cellSize;
    const chartHeight = grid.height * cellSize;
    const totalWidth = chartWidth + offsetX * 2;
    const totalHeight = chartHeight + offsetY * 2;

    canvas.width = totalWidth * dpr;
    canvas.height = totalHeight * dpr;
    canvas.style.width = `${totalWidth}px`;
    canvas.style.height = `${totalHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, totalWidth, totalHeight);

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const colorIndex = grid.cells[y][x];
        let color = palette[colorIndex] || '#FFFFFF';
        
        if (workMode) {
          const rgb = hexToRgb(color);
          const dimFactor = 0.45;
          color = `rgb(${Math.floor(rgb.r * dimFactor)}, ${Math.floor(rgb.g * dimFactor)}, ${Math.floor(rgb.b * dimFactor)})`;
        }
        
        ctx.fillStyle = color;
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
      }
    }

    if (overlayLayers.grid) {
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= grid.width; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + i * cellSize, offsetY);
        ctx.lineTo(offsetX + i * cellSize, offsetY + chartHeight);
        ctx.stroke();
      }
      for (let i = 0; i <= grid.height; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * cellSize);
        ctx.lineTo(offsetX + chartWidth, offsetY + i * cellSize);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= grid.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(offsetX + i * cellSize, offsetY);
        ctx.lineTo(offsetX + i * cellSize, offsetY + chartHeight);
        ctx.stroke();
      }
      for (let i = 0; i <= grid.height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * cellSize);
        ctx.lineTo(offsetX + chartWidth, offsetY + i * cellSize);
        ctx.stroke();
      }
    }

    if (overlayLayers.symbols) {
      ctx.fillStyle = '#1A1A1A';
      const fontSize = Math.max(10, Math.floor(cellSize * 0.6));
      ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          const colorIndex = grid.cells[y][x];
          const symbol = getStitchSymbol(colorIndex) || (colorIndex + 1).toString();
          ctx.fillText(
            symbol,
            offsetX + x * cellSize + cellSize / 2,
            offsetY + y * cellSize + cellSize / 2
          );
        }
      }
    }

    if (overlayLayers.numbers) {
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const colStep = 10;
      for (let x = 0; x <= grid.width; x += colStep) {
        const label = (grid.width - x).toString();
        ctx.fillText(label, offsetX + x * cellSize, offsetY - 35);
        ctx.fillText(label, offsetX + x * cellSize, offsetY + chartHeight + 35);
      }

      ctx.textAlign = 'right';
      for (let y = 0; y <= grid.height; y += colStep) {
        const label = (grid.height - y).toString();
        ctx.fillText(label, offsetX - 20, offsetY + y * cellSize);
      }

      ctx.textAlign = 'left';
      for (let y = 0; y <= grid.height; y += colStep) {
        const label = (grid.height - y).toString();
        ctx.fillText(label, offsetX + chartWidth + 20, offsetY + y * cellSize);
      }
    }

    if (overlayLayers.center) {
      const centerX = offsetX + chartWidth / 2;
      const centerY = offsetY + chartHeight / 2;

      ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);

      ctx.beginPath();
      ctx.moveTo(centerX, offsetY - 45);
      ctx.lineTo(centerX, offsetY + chartHeight + 45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(offsetX - 45, centerY);
      ctx.lineTo(offsetX + chartWidth + 45, centerY);
      ctx.stroke();

      ctx.setLineDash([]);

      ctx.fillStyle = '#FF6464';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FF6464';
      ctx.font = 'bold 13px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('X', offsetX + chartWidth + 50, centerY - 4);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('Y', centerX, offsetY - 50);
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, chartWidth, chartHeight);
  }, [grid, palette, overlayLayers, getStitchSymbol, workMode]);

  const screenToCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container || !grid) return null;

      const rect = container.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const canvasX = (mouseX - offset.x) / scale - offsetX;
      const canvasY = (mouseY - offset.y) / scale - offsetY;

      const cellX = Math.floor(canvasX / cellSize);
      const cellY = Math.floor(canvasY / cellSize);

      if (cellX >= 0 && cellX < grid.width && cellY >= 0 && cellY < grid.height) {
        return { x: cellX, y: cellY };
      }
      return null;
    },
    [grid, scale, offset]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!grid) return;

      if (draggingGuide) return;

      if (e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        if (workMode && autoFollow) toggleAutoFollow();
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
      }

      if (e.button === 0 && e.altKey) {
        setIsPanning(true);
        if (workMode && autoFollow) toggleAutoFollow();
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
      }

      if (e.button !== 0) return;
      if (isPanning) return;

      if (workMode) return;

      if (!isEditMode) return;

      const cell = screenToCanvas(e.clientX, e.clientY);
      if (!cell) return;

      setIsDrawing(true);
      const currentColor = grid.cells[cell.y][cell.x];

      if (selectedTool === 'pencil') {
        if (currentColor !== selectedColorIndex) {
          updateCell(cell.x, cell.y, selectedColorIndex);
        }
      } else if (selectedTool === 'eraser') {
        updateCell(cell.x, cell.y, 0);
      }
    },
    [grid, selectedTool, selectedColorIndex, screenToCanvas, updateCell, isPanning, isEditMode, workMode, draggingGuide, autoFollow, toggleAutoFollow]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingGuide && grid) {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const canvasX = (mouseX - offset.x) / scale - offsetX;
        const canvasY = (mouseY - offset.y) / scale - offsetY;

        if (draggingGuide === 'x') {
          const col = Math.max(0, Math.min(grid.width, Math.round(canvasX / cellSize)));
          setGuideLineX(col);
        } else if (draggingGuide === 'y') {
          const row = Math.max(0, Math.min(grid.height, Math.round(canvasY / cellSize)));
          setGuideLineY(row);
        }
        return;
      }

      if (isPanning) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        setOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
      }

      if (!isDrawing || !grid) return;
      if (!isEditMode) return;

      const cell = screenToCanvas(e.clientX, e.clientY);
      if (!cell) return;

      const currentColor = grid.cells[cell.y][cell.x];

      if (selectedTool === 'pencil') {
        if (currentColor !== selectedColorIndex) {
          updateCell(cell.x, cell.y, selectedColorIndex);
        }
      } else if (selectedTool === 'eraser') {
        updateCell(cell.x, cell.y, 0);
      }
    },
    [isPanning, isDrawing, grid, selectedTool, selectedColorIndex, screenToCanvas, updateCell, isEditMode, draggingGuide, scale, offset, setGuideLineX, setGuideLineY]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    setIsPanning(false);
    setDraggingGuide(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * zoomFactor));

      const scaleChange = newScale / scale;
      const newOffsetX = mouseX - (mouseX - offset.x) * scaleChange;
      const newOffsetY = mouseY - (mouseY - offset.y) * scaleChange;

      setScale(newScale);
      setOffset({ x: newOffsetX, y: newOffsetY });
    },
    [scale, offset]
  );

  const handleDoubleClick = useCallback(() => {
    if (!grid || !containerRef.current) return;

    const container = containerRef.current;
    const chartWidth = grid.width * cellSize + offsetX * 2;
    const chartHeight = grid.height * cellSize + offsetY * 2;

    const scaleX = (container.clientWidth - 40) / chartWidth;
    const scaleY = (container.clientHeight - 40) / chartHeight;
    const fitScale = Math.min(scaleX, scaleY, 1);

    setScale(fitScale);
    setOffset({
      x: (container.clientWidth - chartWidth * fitScale) / 2,
      y: (container.clientHeight - chartHeight * fitScale) / 2,
    });
  }, [grid]);

  // Auto follow - center canvas on guide lines
  useEffect(() => {
    if (!workMode || !autoFollow || !grid || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const guideXPixel = offsetX + guideLineX * cellSize;
    const guideYPixel = offsetY + guideLineY * cellSize;

    const newOffsetX = containerWidth / 2 - guideXPixel * scale;
    const newOffsetY = containerHeight / 2 - guideYPixel * scale;

    setOffset({ x: newOffsetX, y: newOffsetY });
  }, [workMode, autoFollow, guideLineX, guideLineY, grid, scale, cellSize, offsetX, offsetY]);

  // Keyboard shortcuts for work mode
  useEffect(() => {
    if (!workMode || !grid) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      e.preventDefault();

      switch (e.key) {
        case ' ': {
          if (guideLineX > 0) {
            setGuideLineX(guideLineX - 1);
          } else if (guideLineY > 0) {
            setGuideLineX(grid.width - 1);
            setGuideLineY(guideLineY - 1);
          }
          break;
        }
        case 'ArrowLeft': {
          if (guideLineX > 0) {
            setGuideLineX(guideLineX - 1);
          }
          break;
        }
        case 'ArrowRight': {
          if (guideLineX < grid.width - 1) {
            setGuideLineX(guideLineX + 1);
          }
          break;
        }
        case 'ArrowUp': {
          if (guideLineY > 0) {
            setGuideLineY(guideLineY - 1);
          }
          break;
        }
        case 'ArrowDown': {
          if (guideLineY < grid.height - 1) {
            setGuideLineY(guideLineY + 1);
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [workMode, grid, guideLineX, guideLineY, setGuideLineX, setGuideLineY]);

  const chartWidth = grid ? grid.width * cellSize : 0;
  const chartHeight = grid ? grid.height * cellSize : 0;
  const guideLineXPixel = offsetX + guideLineX * cellSize;
  const guideLineYPixel = offsetY + guideLineY * cellSize;

  if (!grid) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-md aspect-square flex items-center justify-center bg-pure-white rounded-[20px] border border-soft-linen shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-[20px] bg-gradient-to-br from-butter-yellow/20 to-coral-stitch/20 flex items-center justify-center">
              <span className="text-2xl">🧵</span>
            </div>
            <p className="text-text-secondary text-sm font-medium">Drop an image to start weaving</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'w-full h-full overflow-hidden relative',
        workMode ? 'bg-graphite' : 'bg-soft-linen/30'
      )}
      style={{
        cursor: isPanning
          ? 'grabbing'
          : draggingGuide
          ? 'grabbing'
          : isEditMode
          ? 'crosshair'
          : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      {/* Work Mode - Close Button + Guide Lines */}
      {workMode && (
        <>
          {/* Top Bar */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
            <div className="bg-graphite/80 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-white/10 flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">行</span>
                <span className="text-sm font-bold text-mint-yarn">
                  {grid.height - guideLineY}
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">列</span>
                <span className="text-sm font-bold text-sky-thread">
                  {grid.width - guideLineX}
                </span>
              </div>
            </div>

            {/* Auto Follow Toggle */}
            <button
              onClick={toggleAutoFollow}
              className={clsx(
                'w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-all',
                autoFollow
                  ? 'bg-mint-yarn/20 border-mint-yarn/50 text-mint-yarn'
                  : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20 hover:text-white'
              )}
              title="自动跟随"
            >
              <Target className="w-4 h-4" />
            </button>

            {/* Save Position */}
            <button
              onClick={saveGuidePosition}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
              title="保存坐标"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Restore Position */}
            <button
              onClick={restoreGuidePosition}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
              title="恢复坐标"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Exit Work Mode */}
            <button
              onClick={() => setWorkMode(false)}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
              title="退出工作模式"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* X Guide Line (vertical) */}
          <div
            className="absolute z-20 cursor-ew-resize"
            style={{
              left: offset.x + guideLineXPixel * scale - 10,
              top: offset.y,
              width: 20,
              height: (chartHeight + offsetY * 2) * scale,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDraggingGuide('x');
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-sky-thread/70"
              style={{ boxShadow: '0 0 8px rgba(98, 198, 255, 0.5)' }}
            />
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sky-thread text-white text-xs font-bold flex items-center justify-center shadow-lg"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {grid.width - guideLineX}
            </div>
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sky-thread text-white text-xs font-bold flex items-center justify-center shadow-lg"
              style={{ transform: 'translate(-50%, 50%)' }}
            >
              {grid.width - guideLineX}
            </div>
          </div>

          {/* Y Guide Line (horizontal) */}
          <div
            className="absolute z-20 cursor-ns-resize"
            style={{
              top: offset.y + guideLineYPixel * scale - 10,
              left: offset.x,
              height: 20,
              width: (chartWidth + offsetX * 2) * scale,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDraggingGuide('y');
            }}
          >
            <div
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-mint-yarn/70"
              style={{ boxShadow: '0 0 8px rgba(126, 231, 193, 0.5)' }}
            />
            <div
              className="absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-mint-yarn text-graphite text-xs font-bold flex items-center justify-center shadow-lg"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {grid.height - guideLineY}
            </div>
            <div
              className="absolute -right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-mint-yarn text-graphite text-xs font-bold flex items-center justify-center shadow-lg"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              {grid.height - guideLineY}
            </div>
          </div>
        </>
      )}

      <canvas
        ref={canvasRef}
        className={clsx(
          'absolute bg-pure-white rounded-[16px] shadow-lg border transition-shadow duration-200',
          workMode
            ? 'border-white/20 shadow-2xl'
            : isEditMode
            ? 'border-sky-thread/40 shadow-xl shadow-sky-thread/10'
            : 'border-soft-linen'
        )}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      />

      {/* Scale indicator */}
      {!workMode && (
        <div className="absolute bottom-4 left-4 bg-pure-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[12px] shadow-md border border-soft-linen/50 text-xs font-medium text-text-secondary pointer-events-none z-10">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Work Mode - Scale indicator */}
      {workMode && (
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-[12px] border border-white/10 text-xs font-medium text-white/70 pointer-events-none z-10">
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* Edit Mode Indicator - bottom right */}
      {isEditMode && !workMode && (
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-sky-thread to-mint-yarn text-white px-3 py-1.5 rounded-[12px] shadow-lg text-xs font-semibold pointer-events-none flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
          编辑模式已激活
        </div>
      )}
    </div>
  );
}
