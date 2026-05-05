import { create } from 'zustand';
import { loginAPI, logoutAPI, obtenerPerfilAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  setSession: (user) => set({
    user,
    isAuthenticated: !!user,
  }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginAPI(email, password);
      if (!data.success || !data.user) {
        throw new Error(data.message || 'Credenciales invalidas');
      }
      get().setSession(data.user);
      set({ loading: false });
      return data.user;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error.message,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logoutAPI();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const data = await obtenerPerfilAPI();
      const user = data.success ? data.user : null;
      get().setSession(user);
      set({ loading: false });
      return user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return null;
    }
  },

  refrescarPerfil: async () => get().checkAuth(),
  esAdmin: () => get().user?.role === 'admin',
  esEmpleado: () => get().user?.role === 'employee',
}));
