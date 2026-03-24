import { create } from 'zustand'

interface UIState {
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  toggleCommandPalette: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}))
