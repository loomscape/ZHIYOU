import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  PatternGrid,
  StitchType,
  ToolType,
  DitherMode,
  ColorCount,
  ColorMode,
  Resolution,
  FinishedSize,
  Gauge,
  UnitSystem,
} from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'studio';
}

interface SavedProject {
  id: string;
  name: string;
  thumbnail: string;
  grid: PatternGrid;
  palette: string[];
  stitchMapping: [number, StitchType][];
  createdAt: string;
  updatedAt: string;
}

interface PatternState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  
  // Saved Projects
  savedProjects: SavedProject[];
  
  // Grid & Editor
  grid: PatternGrid | null;
  selectedColorIndex: number;
  selectedTool: ToolType;
  history: PatternGrid[];
  future: PatternGrid[];
  colorCount: ColorCount;
  colorMode: ColorMode;
  singleYarnColor: string;
  ditherMode: DitherMode;
  resolution: Resolution;
  stitchMapping: Map<number, StitchType>;
  palette: string[];
  finishedSize: FinishedSize;
  gauge: Gauge;
  overlayLayers: {
    grid: boolean;
    symbols: boolean;
    numbers: boolean;
    center: boolean;
  };
  workMode: boolean;
  isEditMode: boolean;
  guideLineX: number;
  guideLineY: number;
  savedGuideLineX: number;
  savedGuideLineY: number;
  autoFollow: boolean;
  
  // Actions
  login: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  saveProject: (name: string) => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  setGrid: (grid: PatternGrid) => void;
  updateCell: (x: number, y: number, colorIndex: number) => void;
  setSelectedColorIndex: (index: number) => void;
  setSelectedTool: (tool: ToolType) => void;
  setColorCount: (count: ColorCount) => void;
  setColorMode: (mode: ColorMode) => void;
  setSingleYarnColor: (color: string) => void;
  setDitherMode: (mode: DitherMode) => void;
  setResolution: (resolution: Resolution) => void;
  setStitchMapping: (colorIndex: number, stitch: StitchType) => void;
  setPalette: (palette: string[]) => void;
  setFinishedSize: (size: Partial<FinishedSize>) => void;
  setFinishedSizeFromImage: (imageWidth: number, imageHeight: number) => void;
  setGauge: (gauge: Partial<Gauge>) => void;
  setUnit: (unit: UnitSystem) => void;
  toggleOverlay: (layer: 'grid' | 'symbols' | 'numbers' | 'center') => void;
  setWorkMode: (active: boolean) => void;
  setIsEditMode: (active: boolean) => void;
  toggleEditMode: () => void;
  saveGuidePosition: () => void;
  restoreGuidePosition: () => void;
  toggleAutoFollow: () => void;
  setGuideLineX: (x: number) => void;
  setGuideLineY: (y: number) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  clearGrid: () => void;
}

export const usePatternStore = create<PatternState>()(
  persist(
    (set, get) => ({
      // Auth State
      isAuthenticated: false,
      user: null,
      
      // Saved Projects
      savedProjects: [],
      
      // Grid State
      grid: null,
      selectedColorIndex: 0,
      selectedTool: 'pencil',
      history: [],
      future: [],
      colorCount: 8,
      colorMode: 'multi',
      singleYarnColor: '#FF6B6B',
      ditherMode: 'floyd-steinberg',
      resolution: 80,
      stitchMapping: new Map(),
      palette: [],
      finishedSize: { width: 20, height: 25, unit: 'cm' },
      gauge: { stitchesPerUnit: 10, rowsPerUnit: 14, unit: 'cm' },
      overlayLayers: {
        grid: true,
        symbols: false,
        numbers: false,
        center: false,
      },
      workMode: false,
      isEditMode: false,
      guideLineX: 0,
      guideLineY: 0,
      savedGuideLineX: 0,
      savedGuideLineY: 0,
      autoFollow: true,
      
      // Auth Actions
      login: async (email: string, password: string, name?: string) => {
        // Mock login - in production, this would call an API
        const user: User = {
          id: crypto.randomUUID(),
          name: name || email.split('@')[0],
          email,
          plan: 'free',
        };
        set({ isAuthenticated: true, user });
      },
      
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      
      // Project Actions
      saveProject: (name: string) => {
        const { grid, palette, stitchMapping, savedProjects, user } = get();
        if (!grid) return;
        
        const project: SavedProject = {
          id: crypto.randomUUID(),
          name: name || `Project ${savedProjects.length + 1}`,
          thumbnail: '',
          grid: JSON.parse(JSON.stringify(grid)),
          palette: [...palette],
          stitchMapping: Array.from(stitchMapping.entries()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set({ savedProjects: [...savedProjects, project] });
      },
      
      loadProject: (id: string) => {
        const { savedProjects } = get();
        const project = savedProjects.find(p => p.id === id);
        if (!project) return;
        
        set({
          grid: project.grid,
          palette: project.palette,
          stitchMapping: new Map(project.stitchMapping),
        });
      },
      
      deleteProject: (id: string) => {
        const { savedProjects } = get();
        set({ savedProjects: savedProjects.filter(p => p.id !== id) });
      },
      
      duplicateProject: (id: string) => {
        const { savedProjects } = get();
        const project = savedProjects.find(p => p.id === id);
        if (!project) return;
        
        const newProject: SavedProject = {
          ...project,
          id: crypto.randomUUID(),
          name: `${project.name} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set({ savedProjects: [...savedProjects, newProject] });
      },
      
      setGrid: (grid) => {
        get().saveToHistory();
        set({ grid, future: [] });
      },

      updateCell: (x, y, colorIndex) => {
        const { grid, saveToHistory } = get();
        if (!grid) return;

        saveToHistory();
        const newCells = grid.cells.map((row, ry) =>
          row.map((cell, cx) => (cx === x && ry === y ? colorIndex : cell))
        );

        set({
          grid: { ...grid, cells: newCells },
          future: [],
        });
      },

      setSelectedColorIndex: (index) => set({ selectedColorIndex: index }),
      setSelectedTool: (tool) => set({ selectedTool: tool }),
      setColorCount: (count) => set({ colorCount: count }),
      setColorMode: (mode) => set({ colorMode: mode }),
      setSingleYarnColor: (color) => set({ singleYarnColor: color }),
      setDitherMode: (mode) => set({ ditherMode: mode }),
      setResolution: (resolution) => set({ resolution }),
      setPalette: (palette) => set({ palette }),
      setStitchMapping: (colorIndex, stitch) => {
        const { stitchMapping } = get();
        const newMapping = new Map(stitchMapping);
        newMapping.set(colorIndex, stitch);
        set({ stitchMapping: newMapping });
      },
      setFinishedSize: (size) => {
        const { finishedSize } = get();
        set({ finishedSize: { ...finishedSize, ...size } });
      },
      setFinishedSizeFromImage: (imageWidth: number, imageHeight: number) => {
        const { finishedSize, gauge } = get();
        // 根据图片比例计算网格尺寸，保持一个合理的基准（比如高度200针）
        const baseStitches = 200;
        const aspectRatio = imageWidth / imageHeight;
        const targetHeight = baseStitches;
        const targetWidth = Math.round(baseStitches * aspectRatio);
        // 反算成品尺寸
        const newWidth = Math.round(targetWidth / gauge.stitchesPerUnit);
        const newHeight = Math.round(targetHeight / gauge.rowsPerUnit);
        set({ finishedSize: { ...finishedSize, width: newWidth, height: newHeight } });
      },
      setGauge: (gauge) => {
        const { gauge: currentGauge } = get();
        set({ gauge: { ...currentGauge, ...gauge } });
      },
      setUnit: (unit) => {
        const { finishedSize, gauge } = get();
        set({
          finishedSize: { ...finishedSize, unit },
          gauge: { ...gauge, unit },
        });
      },
      toggleOverlay: (layer) => {
        const { overlayLayers } = get();
        set({
          overlayLayers: { ...overlayLayers, [layer]: !overlayLayers[layer] },
        });
      },
      setWorkMode: (active) => {
        const { grid, guideLineX, guideLineY } = get();
        if (active && grid) {
          set({
            workMode: true,
            guideLineX: grid.width - 1,
            guideLineY: grid.height - 1,
          });
        } else {
          set({ workMode: false });
        }
      },
      setIsEditMode: (active) => set({ isEditMode: active }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      setGuideLineX: (x) => set({ guideLineX: x }),
      setGuideLineY: (y) => set({ guideLineY: y }),
      saveGuidePosition: () => {
        const { guideLineX, guideLineY } = get();
        set({ savedGuideLineX: guideLineX, savedGuideLineY: guideLineY });
      },
      restoreGuidePosition: () => {
        const { savedGuideLineX, savedGuideLineY } = get();
        set({ guideLineX: savedGuideLineX, guideLineY: savedGuideLineY });
      },
      toggleAutoFollow: () => set((state) => ({ autoFollow: !state.autoFollow })),
      saveToHistory: () => {
        const { grid, history } = get();
        if (grid) {
          set({ history: [...history.slice(-20), JSON.parse(JSON.stringify(grid))] });
        }
      },
      undo: () => {
        const { history, grid, future } = get();
        if (history.length === 0) return;

        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        if (grid) {
          set({
            history: newHistory,
            grid: previous,
            future: [JSON.parse(JSON.stringify(grid)), ...future],
          });
        }
      },

      redo: () => {
        const { future, grid, history } = get();
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        if (grid) {
          set({
            future: newFuture,
            grid: next,
            history: [...history, JSON.parse(JSON.stringify(grid))],
          });
        }
      },

      clearGrid: () =>
        set({
          grid: null,
          history: [],
          future: [],
          stitchMapping: new Map(),
          palette: [],
        }),
    }),
    {
      name: 'loomscape-pattern',
      partialize: (state) => ({
        // Auth
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        savedProjects: state.savedProjects,
        // Settings
        colorCount: state.colorCount,
        ditherMode: state.ditherMode,
        resolution: state.resolution,
        stitchMapping: Array.from(state.stitchMapping.entries()),
        finishedSize: state.finishedSize,
        gauge: state.gauge,
        overlayLayers: state.overlayLayers,
        guideLineX: state.guideLineX,
        guideLineY: state.guideLineY,
        savedGuideLineX: state.savedGuideLineX,
        savedGuideLineY: state.savedGuideLineY,
        colorMode: state.colorMode,
        singleYarnColor: state.singleYarnColor,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      merge: (persisted: any, current) => ({
        ...current,
        stitchMapping: new Map(persisted?.stitchMapping || []),
      }),
    }
  )
);
