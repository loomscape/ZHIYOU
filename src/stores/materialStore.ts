import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Material } from '@/types';
import { DEFAULT_MATERIALS } from '@/types';

interface MaterialState {
  materials: Material[];
  selectedMaterialIndex: number;
  setSelectedMaterialIndex: (index: number) => void;
  updateMaterial: (index: number, updates: Partial<Material>) => void;
}

export const useMaterialStore = create<MaterialState>()(
  persist(
    (set) => ({
      materials: DEFAULT_MATERIALS,
      selectedMaterialIndex: 0,
      setSelectedMaterialIndex: (index) => set({ selectedMaterialIndex: index }),
      updateMaterial: (index, updates) =>
        set((state) => ({
          materials: state.materials.map((m, i) => (i === index ? { ...m, ...updates } : m)),
        })),
    }),
    {
      name: 'loomscape-material',
    }
  )
);
