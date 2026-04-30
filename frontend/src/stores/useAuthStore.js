import { create } from 'zustand';
import { loginAPI, logoutAPI, obtenerPerfilAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  usuario: null,
  isAuthenticated: false,
  estaAutenticado: false,
  loading: true,
  cargando: true,
  error: null,

  setSession: (user) => set({
    user,
    usuario: user,
    isAuthenticated: !!user,
    estaAutenticado: !!user,
  }),

  login: async (email, password) => {
    set({ loading: true, cargando: true, error: null });
    try {
      const data = await loginAPI(email, password);
      if (!data.success || !data.user) {
        throw new Error(data.message || 'Credenciales invalidas');
      }
      get().setSession(data.user);
      set({ loading: false, cargando: false });
      return data.user;
    } catch (error) {
      set({
        user: null,
        usuario: null,
        isAuthenticated: false,
        estaAutenticado: false,
        loading: false,
        cargando: false,
        error: error.message,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true, cargando: true, error: null });
    try {
      await logoutAPI();
    } finally {
      set({
        user: null,
        usuario: null,
        isAuthenticated: false,
        estaAutenticado: false,
        loading: false,
        cargando: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    set({ loading: true, cargando: true, error: null });
    try {
      const data = await obtenerPerfilAPI();
      const user = data.success ? data.user : null;
      get().setSession(user);
      set({ loading: false, cargando: false });
      return user;
    } catch {
      set({
        user: null,
        usuario: null,
        isAuthenticated: false,
        estaAutenticado: false,
        loading: false,
        cargando: false,
      });
      return null;
    }
  },

  refrescarPerfil: async () => get().checkAuth(),
  esAdmin: () => get().user?.role === 'admin',
  esEmpleado: () => get().user?.role === 'employee',
}));
