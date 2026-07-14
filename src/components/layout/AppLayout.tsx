'use client';

import { ImageUploader } from '@/components/upload/ImageUploader';
import { ProcessingControls } from '@/components/processing/ProcessingControls';
import { ColorPalette } from '@/components/processing/ColorPalette';
import { PatternCanvas } from '@/components/pattern/PatternCanvas';
import { PatternChart } from '@/components/pattern/PatternChart';
import { StitchMapper } from '@/components/stitches/StitchMapper';
import { MaterialLibrary } from '@/components/materials/MaterialLibrary';
import { KnitPreview3D } from '@/components/preview/KnitPreview3D';
import { ExportPanel } from '@/components/export/ExportPanel';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { usePatternStore } from '@/stores/patternStore';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Wand2,
  Eye,
  Download,
  Grid,
  Grid3X3,
  RefreshCw,
  Settings,
  Layers,
  Palette,
  ChevronRight,
  ChevronLeft,
  Hash,
  Crosshair,
  Grid2X2,
  Puzzle,
  Play,
  Edit3,
  Move,
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Undo,
  Redo,
} from 'lucide-react';

type ViewMode = 'editor' | 'chart' | 'preview';
type MobileTab = 'import' | 'pattern' | 'preview' | 'export';
type LeftPanelTab = 'import' | 'settings';
type RightPanelTab = 'stitches' | 'materials' | 'export';

export function AppLayout() {
  const { grid, overlayLayers, toggleOverlay, workMode, setWorkMode, isEditMode, toggleEditMode, selectedTool, setSelectedTool, undo, redo, history, future } = usePatternStore();
  const { processImage } = useImageProcessor();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('editor');
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('pattern');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('settings');
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('stitches');
  const prevWorkModeRef = useRef(false);

  useEffect(() => {
    if (workMode && !prevWorkModeRef.current) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    } else if (!workMode && prevWorkModeRef.current) {
      setLeftPanelOpen(true);
      setRightPanelOpen(true);
    }
    prevWorkModeRef.current = workMode;
  }, [workMode]);

  const handleRegenerate = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await processImage(file);
      }
    };
    input.click();
  };

  const mobileTabs: { id: MobileTab; icon: typeof ImageIcon; label: string }[] = [
    { id: 'import', icon: ImageIcon, label: t('nav.import') },
    { id: 'pattern', icon: Wand2, label: t('nav.pattern') },
    { id: 'preview', icon: Eye, label: t('nav.preview') },
    { id: 'export', icon: Download, label: t('nav.export') },
  ];

  const rightPanelTabs: { id: RightPanelTab; icon: typeof Layers; label: string }[] = [
    { id: 'stitches', icon: Layers, label: t('stitchesPanel.title') },
    { id: 'materials', icon: Palette, label: t('yarnPanel.title') },
    { id: 'export', icon: Download, label: t('nav.export') },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-cloud-white overflow-hidden relative">
      {/* Canvas Background */}
      <div className="absolute inset-0 canvas-bg pointer-events-none" />

      {/* Desktop Layout */}
      <div className="hidden md:flex relative h-full w-full">
        {/* Left Floating Toolbar */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          {/* Home Button */}
          <Link
            href="/"
            className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-sky-thread to-mint-yarn flex items-center justify-center shadow-md mb-2 hover:scale-110 active:scale-95 transition-transform"
            title="回到主页"
          >
            <span className="text-white text-base">❤</span>
          </Link>

          {/* Toggle Left Panel */}
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="w-10 h-10 bg-pure-white/90 floating-panel rounded-[14px] shadow-md border border-soft-linen/50 flex items-center justify-center text-text-secondary hover:text-graphite transition-colors mt-2"
            title={leftPanelOpen ? 'Hide panel' : 'Show panel'}
          >
            {leftPanelOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Left Floating Panel */}
        <div
          className={clsx(
            'absolute left-20 top-6 bottom-6 z-10 transition-all duration-300 ease-out',
            leftPanelOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
          )}
        >
          <div className="w-72 h-full bg-pure-white/95 floating-panel rounded-[24px] shadow-xl border border-soft-linen/50 overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center gap-1 p-3 border-b border-soft-linen/50">
              <button
                onClick={() => setLeftPanelTab('import')}
                className={clsx(
                  'flex-1 py-2 px-3 rounded-[12px] text-xs font-semibold transition-all',
                  leftPanelTab === 'import'
                    ? 'bg-sky-thread text-white shadow-sm'
                    : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                )}
              >
                <ImageIcon className="w-4 h-4 inline mr-1.5" />
                {t('nav.import')}
              </button>
              <button
                onClick={() => setLeftPanelTab('settings')}
                className={clsx(
                  'flex-1 py-2 px-3 rounded-[12px] text-xs font-semibold transition-all',
                  leftPanelTab === 'settings'
                    ? 'bg-sky-thread text-white shadow-sm'
                    : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                )}
              >
                <Settings className="w-4 h-4 inline mr-1.5" />
                {t('settingsPanel.title')}
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {leftPanelTab === 'import' && (
                <ImageUploader />
              )}
              {leftPanelTab === 'settings' && (
                <>
                  <ProcessingControls />
                  <ColorPalette />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Top Toolbar - Floating - Hidden in work mode */}
          {!workMode && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-pure-white/90 floating-panel px-1.5 py-1.5 rounded-[16px] shadow-lg border border-soft-linen/50 flex items-center gap-1">
              <button
                onClick={() => setViewMode('editor')}
                className={clsx(
                  'px-4 py-2 text-xs font-semibold rounded-[12px] transition-all',
                  viewMode === 'editor'
                    ? 'bg-gradient-to-r from-sky-thread to-mint-yarn text-white shadow-sm'
                    : 'text-text-secondary hover:text-graphite'
                )}
              >
                <Grid className="w-4 h-4 inline mr-1.5" />
                {t('views.stitchGrid')}
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={clsx(
                  'px-4 py-2 text-xs font-semibold rounded-[12px] transition-all',
                  viewMode === 'chart'
                    ? 'bg-gradient-to-r from-sky-thread to-mint-yarn text-white shadow-sm'
                    : 'text-text-secondary hover:text-graphite'
                )}
              >
                <Grid3X3 className="w-4 h-4 inline mr-1.5" />
                {t('views.knittingChart')}
              </button>
              {grid && (
                <>
                  <div className="w-px h-5 bg-soft-linen mx-1" />
                  <button
                    onClick={() => setViewMode('preview')}
                    className={clsx(
                      'px-4 py-2 text-xs font-semibold rounded-[12px] transition-all',
                      viewMode === 'preview'
                        ? 'bg-gradient-to-r from-coral-stitch to-lavender-loop text-white shadow-sm'
                        : 'text-text-secondary hover:text-graphite'
                    )}
                  >
                    <Eye className="w-4 h-4 inline mr-1.5" />
                    {t('views.crochetPreview')}
                  </button>
                </>
              )}
            </div>

            {/* Overlay Layers - Only show in editor mode */}
            {viewMode === 'editor' && grid && !workMode && (
              <div className="bg-pure-white/90 floating-panel px-2 py-1.5 rounded-[16px] shadow-lg border border-soft-linen/50 flex items-center gap-1">
                <button
                  onClick={() => toggleOverlay('grid')}
                  className={clsx(
                    'w-9 h-9 rounded-[12px] flex items-center justify-center transition-all',
                    overlayLayers.grid
                      ? 'bg-gradient-to-br from-sky-thread to-mint-yarn text-white shadow-sm'
                      : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                  )}
                  title="Grid"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleOverlay('symbols')}
                  className={clsx(
                    'w-9 h-9 rounded-[12px] flex items-center justify-center transition-all',
                    overlayLayers.symbols
                      ? 'bg-gradient-to-br from-sky-thread to-mint-yarn text-white shadow-sm'
                      : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                  )}
                  title="Symbols"
                >
                  <Puzzle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleOverlay('numbers')}
                  className={clsx(
                    'w-9 h-9 rounded-[12px] flex items-center justify-center transition-all',
                    overlayLayers.numbers
                      ? 'bg-gradient-to-br from-sky-thread to-mint-yarn text-white shadow-sm'
                      : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                  )}
                  title="Row/Column Numbers"
                >
                  <Hash className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleOverlay('center')}
                  className={clsx(
                    'w-9 h-9 rounded-[12px] flex items-center justify-center transition-all',
                    overlayLayers.center
                      ? 'bg-gradient-to-br from-coral-stitch to-lavender-loop text-white shadow-sm'
                      : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                  )}
                  title="Center Crosshair"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Edit Mode Toggle + Tools - Only show in editor mode with grid */}
            {viewMode === 'editor' && grid && !workMode && (
              <div className="bg-pure-white/90 floating-panel px-1.5 py-1.5 rounded-[16px] shadow-lg border border-soft-linen/50 flex items-center gap-1">
                <button
                  onClick={toggleEditMode}
                  className={clsx(
                    'px-3.5 h-9 rounded-[12px] flex items-center gap-1.5 transition-all',
                    isEditMode
                      ? 'bg-gradient-to-r from-sky-thread to-mint-yarn text-white shadow-sm'
                      : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                  )}
                >
                  {isEditMode ? <Edit3 className="w-3.5 h-3.5" /> : <Move className="w-3.5 h-3.5" />}
                  <span className="text-xs font-semibold">
                    {isEditMode ? '编辑模式' : '浏览模式'}
                  </span>
                </button>

                {isEditMode && (
                  <>
                    <div className="w-px h-5 bg-soft-linen mx-0.5" />
                    <div className="flex items-center gap-0.5">
                      {[
                        { type: 'pencil' as const, icon: Pencil, label: 'Pencil' },
                        { type: 'eraser' as const, icon: Eraser, label: 'Eraser' },
                        { type: 'fill' as const, icon: PaintBucket, label: 'Fill' },
                        { type: 'eyedropper' as const, icon: Pipette, label: 'Eyedropper' },
                      ].map(({ type, icon: Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => setSelectedTool(type)}
                          title={label}
                          className={clsx(
                            'w-8 h-8 flex items-center justify-center rounded-[10px] transition-all',
                            selectedTool === type
                              ? 'bg-gradient-to-br from-sky-thread to-mint-yarn text-white shadow-md'
                              : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/50'
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}

                      <div className="w-px h-5 bg-soft-linen/50 mx-0.5" />

                      <button
                        onClick={undo}
                        disabled={history.length === 0}
                        className={clsx(
                          'w-8 h-8 flex items-center justify-center rounded-[10px] transition-all',
                          history.length === 0
                            ? 'text-soft-linen cursor-not-allowed'
                            : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/50'
                        )}
                        title="Undo"
                      >
                        <Undo className="w-4 h-4" />
                      </button>
                      <button
                        onClick={redo}
                        disabled={future.length === 0}
                        className={clsx(
                          'w-8 h-8 flex items-center justify-center rounded-[10px] transition-all',
                          future.length === 0
                            ? 'text-soft-linen cursor-not-allowed'
                            : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/50'
                        )}
                        title="Redo"
                      >
                        <Redo className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Work Mode Start Button - Only show in editor mode with grid */}
            {viewMode === 'editor' && grid && !workMode && (
              <button
                onClick={() => setWorkMode(true)}
                className="h-10 px-5 rounded-[14px] bg-gradient-to-r from-coral-stitch to-lavender-loop text-white shadow-lg flex items-center gap-2 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span className="text-sm font-bold">开始吧！</span>
              </button>
            )}
          </div>
          )}

          {/* Canvas */}
          <div className="w-full h-full">
            {viewMode === 'editor' ? (
              <PatternCanvas />
            ) : viewMode === 'chart' ? (
              <PatternChart />
            ) : (
              <KnitPreview3D />
            )}
          </div>

          {/* Bottom Info Bar - Floating */}
          {grid && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-pure-white/90 floating-panel px-5 py-2.5 rounded-full shadow-lg border border-soft-linen/50 flex items-center gap-4">
                <span className="text-xs font-medium text-text-secondary">
                  <span className="text-graphite font-semibold">{grid.width}</span> × <span className="text-graphite font-semibold">{grid.height}</span> {t('chart.stitches')}
                </span>
                <div className="w-px h-4 bg-soft-linen" />
                <span className="text-xs text-text-secondary">
                  {grid.palette.length} {t('colorsPanel.title')}
                </span>
                <div className="w-px h-4 bg-soft-linen" />
                <button
                  onClick={handleRegenerate}
                  className="text-xs font-medium text-sky-thread hover:text-sky-thread-hover transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t('importPanel.title')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Floating Panel */}
        <div
          className={clsx(
            'absolute right-20 top-6 bottom-6 z-10 transition-all duration-300 ease-out',
            rightPanelOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
          )}
        >
          <div className="w-80 h-full bg-pure-white/95 floating-panel rounded-[24px] shadow-xl border border-soft-linen/50 overflow-hidden flex flex-col">
            {/* Panel Header - Tab Icons */}
            <div className="flex items-center justify-around p-2 border-b border-soft-linen/50">
              {rightPanelTabs.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setRightPanelTab(id)}
                  className={clsx(
                    'w-10 h-10 rounded-[12px] flex items-center justify-center transition-all',
                    rightPanelTab === id
                      ? 'bg-sky-thread text-white shadow-sm'
                      : 'text-text-secondary hover:text-graphite hover:bg-soft-linen/30'
                  )}
                  title={id.charAt(0).toUpperCase() + id.slice(1)}
                >
                  <Icon className="w-4.5 h-4.5" />
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {rightPanelTab === 'stitches' && (
                <StitchMapper />
              )}
              {rightPanelTab === 'materials' && (
                <MaterialLibrary />
              )}
              {rightPanelTab === 'export' && (
                <ExportPanel />
              )}
            </div>
          </div>
        </div>

        {/* Right Toggle Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="w-10 h-10 bg-pure-white/90 floating-panel rounded-[14px] shadow-md border border-soft-linen/50 flex items-center justify-center text-text-secondary hover:text-graphite transition-colors"
            title={rightPanelOpen ? 'Hide panel' : 'Show panel'}
          >
            {rightPanelOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 flex flex-col md:hidden overflow-hidden relative">
        {/* Top Bar - Floating */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          <Link
            href="/"
            className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-sky-thread to-mint-yarn flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
            title="回到主页"
          >
            <span className="text-white text-sm">❤</span>
          </Link>
          {grid && (
            <div className="bg-pure-white/90 floating-panel px-3 py-1.5 rounded-full shadow-md border border-soft-linen/50">
              <span className="text-[11px] font-medium text-text-secondary">
                <span className="text-graphite font-semibold">{grid.width}</span>×<span className="text-graphite font-semibold">{grid.height}</span>
              </span>
            </div>
          )}
        </div>

        {/* Pattern Tab - Canvas */}
        {activeMobileTab === 'pattern' && (
          <div className="flex-1 flex flex-col overflow-hidden pt-16 pb-20">
            {/* View Toggle - Floating */}
            <div className="flex justify-center mb-3">
              <div className="bg-pure-white/90 floating-panel px-1 py-1 rounded-[14px] shadow-md border border-soft-linen/50 flex items-center gap-0.5">
                <button
                  onClick={() => setViewMode('editor')}
                  className={clsx(
                    'px-2.5 py-1.5 text-[10px] font-semibold rounded-[10px] transition-all',
                    viewMode === 'editor'
                      ? 'bg-sky-thread text-white shadow-sm'
                      : 'text-text-secondary'
                  )}
                >
                  {t('views.stitchGrid')}
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={clsx(
                    'px-2.5 py-1.5 text-[10px] font-semibold rounded-[10px] transition-all',
                    viewMode === 'chart'
                      ? 'bg-sky-thread text-white shadow-sm'
                      : 'text-text-secondary'
                  )}
                >
                  {t('views.knittingChart')}
                </button>
                {grid && (
                  <button
                    onClick={() => setViewMode('preview')}
                    className={clsx(
                      'px-2.5 py-1.5 text-[10px] font-semibold rounded-[10px] transition-all',
                      viewMode === 'preview'
                        ? 'bg-gradient-to-r from-coral-stitch to-lavender-loop text-white shadow-sm'
                        : 'text-text-secondary'
                    )}
                  >
                    {t('views.crochetPreview')}
                  </button>
                )}
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-hidden px-4">
              {viewMode === 'editor' ? (
                <PatternCanvas />
              ) : viewMode === 'chart' ? (
                <PatternChart />
              ) : (
                <KnitPreview3D />
              )}
            </div>

            {/* Floating Toolbar - Left side - Only show in editor mode */}
            {viewMode === 'editor' && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                <div className="bg-pure-white/90 floating-panel rounded-[16px] p-1.5 shadow-lg border border-soft-linen/50 space-y-1.5">
                  {grid && (
                    <>
                      <button
                        onClick={() => toggleOverlay('grid')}
                        className={clsx(
                          'w-9 h-9 rounded-[10px] flex items-center justify-center transition-all',
                          overlayLayers.grid
                            ? 'bg-sky-thread text-white'
                            : 'text-text-secondary'
                        )}
                      >
                        <Grid2X2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleOverlay('symbols')}
                        className={clsx(
                          'w-9 h-9 rounded-[10px] flex items-center justify-center transition-all',
                          overlayLayers.symbols
                            ? 'bg-sky-thread text-white'
                            : 'text-text-secondary'
                        )}
                      >
                        <Puzzle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleOverlay('numbers')}
                        className={clsx(
                          'w-9 h-9 rounded-[10px] flex items-center justify-center transition-all',
                          overlayLayers.numbers
                            ? 'bg-sky-thread text-white'
                            : 'text-text-secondary'
                        )}
                      >
                        <Hash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleOverlay('center')}
                        className={clsx(
                          'w-9 h-9 rounded-[10px] flex items-center justify-center transition-all',
                          overlayLayers.center
                            ? 'bg-coral-stitch text-white'
                            : 'text-text-secondary'
                        )}
                      >
                        <Crosshair className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Tabs */}
        {activeMobileTab === 'import' && (
          <div className="flex-1 overflow-y-auto p-4 pt-16 pb-20 space-y-4">
            <ImageUploader />
          </div>
        )}

        {/* Pattern Tab - Canvas with Settings */}
        {activeMobileTab === 'pattern' && (
          <div className="flex-1 flex flex-col overflow-hidden pt-16 pb-20">
            {/* Settings below canvas */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
              <ProcessingControls />
              <ColorPalette />
            </div>
          </div>
        )}

        {activeMobileTab === 'preview' && (
          <div className="flex-1 overflow-y-auto p-4 pt-16 pb-20 space-y-4">
            <KnitPreview3D />
            <StitchMapper />
            <MaterialLibrary />
          </div>
        )}

        {activeMobileTab === 'export' && (
          <div className="flex-1 overflow-y-auto p-4 pt-16 pb-20">
            <ExportPanel />
          </div>
        )}

        {/* Bottom Navigation - Floating */}
        <div className="absolute bottom-3 left-3 right-3 z-20">
          <div className="bg-pure-white/90 floating-panel rounded-[20px] shadow-xl border border-soft-linen/50 px-2 py-2">
            <div className="flex items-center justify-around">
              {mobileTabs.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveMobileTab(id)}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 px-4 py-2 rounded-[14px] transition-all',
                    activeMobileTab === id
                      ? 'bg-gradient-to-br from-sky-thread to-mint-yarn text-white shadow-md'
                      : 'text-text-secondary'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
