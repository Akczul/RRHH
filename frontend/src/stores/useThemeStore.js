import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const applyTheme = (isDark) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDark);
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: true,
      initTheme: () => applyTheme(get().isDark),
      setTheme: (isDark) => {
        applyTheme(isDark);
        set({ isDark });
      },
      toggleTheme: () => get().setTheme(!get().isDark),
    }),
    {
      name: 'corphr-theme',
      partialize: (state) => ({ isDark: state.isDark }),
      onRehydrateStorage: () => (state) => {
        applyTheme(state?.isDark ?? true);
      },
    },
  ),
);
