import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { theme } from 'antd';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  getAlgorithm: () => typeof theme.defaultAlgorithm;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',

      toggleTheme: () => {
        set((state) => ({
          mode: state.mode === 'light' ? 'dark' : 'light',
        }));
      },

      setTheme: (mode: ThemeMode) => {
        set({ mode });
      },

      getAlgorithm: () => {
        const currentMode = get().mode;
        return currentMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
