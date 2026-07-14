'use client';

import { usePatternStore } from '@/stores/patternStore';
import { useTranslation } from '@/hooks/useTranslation';
import { STITCH_LIBRARY } from '@/types';
import type { StitchType } from '@/types';
import { useRef, useEffect, useState } from 'react';

export function PatternChart() {
  const { grid, palette, stitchMapping, finishedSize, gauge } = usePatternStore();
  const { t, language } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const PAGE_WIDTH = 612;
  const PAGE_HEIGHT = 792;
  const MARGIN_X = 50;
  const CHART_START_X = 70;
  const CHART_START_Y = 100;
  const TITLE_Y = 50;

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const padding = 32;
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;
      const newScale = Math.min(
        availableWidth / PAGE_WIDTH,
        availableHeight / PAGE_HEIGHT,
        1.2
      );
      setScale(Math.max(0.3, newScale));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = PAGE_WIDTH * dpr;
    canvas.height = PAGE_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);

    const maxChartWidth = PAGE_WIDTH - 150;
    const maxChartHeight = PAGE_HEIGHT - 200;
    const cellSize = Math.min(maxChartWidth / grid.width, maxChartHeight / grid.height, 12);
    const chartWidth = grid.width * cellSize;
    const chartHeight = grid.height * cellSize;

    const getStitchSymbol = (colorIndex: number): string => {
      const stitch = stitchMapping.get(colorIndex) as StitchType;
      if (!stitch) return '';
      const stitchInfo = STITCH_LIBRARY.find((s) => s.id === stitch);
      return stitchInfo?.symbol || '';
    };

    const chartTitle = t('chart.title');
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 24px "Times New Roman", serif';
    ctx.fillText(
      chartTitle,
      MARGIN_X,
      TITLE_Y + 20
    );

    ctx.fillStyle = '#666';
    ctx.font = '10px Helvetica, Arial, sans-serif';
    const sizeLabel = t('chart.size');
    const gaugeLabel = t('chart.gauge');
    const stLabel = t('chart.stitches');
    const rowLabel = t('chart.rows');
    const unitLabel = finishedSize.unit === 'inch' ? t('settingsPanel.inch') : t('settingsPanel.cm');
    const sizeText = `${sizeLabel}: ${finishedSize.width} x ${finishedSize.height} ${unitLabel}  |  ${gaugeLabel}: ${gauge.stitchesPerUnit}${stLabel}/${unitLabel} x ${gauge.rowsPerUnit}${rowLabel}/${unitLabel}`;
    ctx.fillText(sizeText, MARGIN_X, TITLE_Y + 40);

    // 填充所有格子颜色
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const colorIndex = grid.cells[y][x];
        const color = palette[colorIndex] || '#FFFFFF';
        const px = CHART_START_X + x * cellSize;
        const py = CHART_START_Y + y * cellSize;

        ctx.fillStyle = color;
        ctx.fillRect(px, py, cellSize, cellSize);
      }
    }

    // 绘制细网格线 - 每一针都有
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 0.75;
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(CHART_START_X + x * cellSize, CHART_START_Y);
      ctx.lineTo(CHART_START_X + x * cellSize, CHART_START_Y + chartHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(CHART_START_X, CHART_START_Y + y * cellSize);
      ctx.lineTo(CHART_START_X + chartWidth, CHART_START_Y + y * cellSize);
      ctx.stroke();
    }

    // 绘制粗网格线 - 每10针
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    for (let i = 0; i <= Math.ceil(grid.width / 10); i++) {
      const x = CHART_START_X + i * 10 * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, CHART_START_Y);
      ctx.lineTo(x, CHART_START_Y + chartHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= Math.ceil(grid.height / 10); i++) {
      const y = CHART_START_Y + i * 10 * cellSize;
      ctx.beginPath();
      ctx.moveTo(CHART_START_X, y);
      ctx.lineTo(CHART_START_X + chartWidth, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(CHART_START_X, CHART_START_Y, chartWidth, chartHeight);

    if (cellSize >= 6) {
      ctx.fillStyle = '#1A1A1A';
      ctx.font = `${Math.floor(cellSize * 0.6)}px Helvetica, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let y = 0; y < grid.height; y++) {
        for (let x = 0; x < grid.width; x++) {
          const symbol = getStitchSymbol(grid.cells[y][x]);
          if (symbol) {
            const px = CHART_START_X + x * cellSize + cellSize / 2;
            const py = CHART_START_Y + y * cellSize + cellSize / 2;
            ctx.fillText(symbol, px, py);
          }
        }
      }
    }

    const colStep = Math.max(1, Math.floor(grid.width / 10));
    const rowStep = Math.max(1, Math.floor(grid.height / 10));

    ctx.fillStyle = '#666';
    ctx.font = '8px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let x = 0; x < grid.width; x++) {
      const colNum = grid.width - x;
      const shouldShow = colNum % colStep === 0 || x === 0 || x === grid.width - 1;
      if (shouldShow) {
        ctx.fillText(
          String(colNum),
          CHART_START_X + x * cellSize + cellSize / 2,
          CHART_START_Y - 12
        );
      }
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < grid.height; y++) {
      const rowNum = y + 1;
      const shouldShow = rowNum % rowStep === 0 || y === 0 || y === grid.height - 1;
      if (shouldShow) {
        ctx.fillText(
          String(rowNum),
          CHART_START_X + chartWidth + 6,
          CHART_START_Y + y * cellSize + cellSize / 2
        );
      }
    }

    const legendY = CHART_START_Y + chartHeight + 30;

    const symbolKeyLabel = t('chart.symbolKey');
    const knitStitch = STITCH_LIBRARY.find(s => s.id === 'knit');
    const purlStitch = STITCH_LIBRARY.find(s => s.id === 'purl');
    const laceStitch = STITCH_LIBRARY.find(s => s.id === 'lace');
    const cableStitch = STITCH_LIBRARY.find(s => s.id === 'cable');
    
    const knitLabel = knitStitch ? knitStitch.name[language] : 'Knit';
    const purlLabel = purlStitch ? purlStitch.name[language] : 'Purl';
    const laceLabel = laceStitch ? laceStitch.name[language] : 'Lace';
    const cableLabel = cableStitch ? cableStitch.name[language] : 'Cable';

    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 12px "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(
      symbolKeyLabel,
      MARGIN_X,
      legendY
    );

    const legendItems = [
      { symbol: '', label: knitLabel },
      { symbol: 'o', label: purlLabel },
      { symbol: '◇', label: laceLabel },
      { symbol: '#', label: cableLabel },
    ];

    ctx.font = '10px Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#333';
    legendItems.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const lx = MARGIN_X + col * 250;
      const ly = legendY + 20 + row * 20;

      ctx.strokeStyle = '#B3B3B3';
      ctx.lineWidth = 0.5;
      ctx.fillStyle = '#FFF';
      ctx.fillRect(lx, ly, 16, 16);
      ctx.strokeRect(lx, ly, 16, 16);

      if (item.symbol) {
        ctx.fillStyle = '#1A1A1A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.symbol, lx + 8, ly + 8);
      }

      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, lx + 24, ly + 8);
    });
  }, [grid, palette, stitchMapping, language, finishedSize, gauge]);

  if (!grid) {
    return (
      <div ref={containerRef} className="w-full h-full flex items-center justify-center p-4">
        <div className="bg-pure-white rounded-[20px] border border-soft-linen shadow-sm flex items-center justify-center" style={{ width: 500, height: 647 }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-[20px] bg-gradient-to-br from-lavender-loop/20 to-sky-thread/20 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-text-secondary text-sm font-medium">{t('empty.noPattern')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-auto p-4">
      <div
        className="bg-white shadow-lg rounded-[4px] flex-shrink-0"
        style={{
          width: PAGE_WIDTH * scale,
          height: PAGE_HEIGHT * scale,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            borderRadius: '4px',
          }}
        />
      </div>
    </div>
  );
}
