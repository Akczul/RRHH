import { create } from 'zustand';
import { obtenerDepartamentosAPI, obtenerPosicionesAPI } from '../services/api';

export const useCatalogStore = create((set, get) => ({
  departments: [],
  positions: [],
  loading: false,
  error: null,
  loaded: false, 

  fetchCatalogs: async () => {
    if (get().loaded) return; 

    set({ loading: true, error: null });
    try {
      const [departmentsResponse, positionsResponse] = await Promise.all([
        obtenerDepartamentosAPI(),
        obtenerPosicionesAPI(),
      ]);

      const departments = departmentsResponse.categories ?? [];
      const positions = positionsResponse.products ?? [];
      set({ departments, positions, loading: false, loaded: true }); 
      return { departments, positions };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetCatalogs: () => set({ loaded: false }), 
}));
