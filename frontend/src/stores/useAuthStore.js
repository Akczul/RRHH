import { create } from 'zustand';
import { loginAPI, logoutAPI, obtenerPerfilAPI } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  sessionRevision: 0,

  setSession: (user) => set((state) => ({
    user,
    isAuthenticated: !!user,
    sessionRevision: state.sessionRevision + 1,
  })),

  clearSession: (updates = {}) => set((state) => ({
    user: null,
    isAuthenticated: false,
    sessionRevision: state.sessionRevision + 1,
    ...updates,
  })),

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
      get().clearSession({
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
      get().clearSession({
        loading: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    const startedRevision = get().sessionRevision;
    set({ loading: true, error: null });
    try {
      const data = await obtenerPerfilAPI();
      const user = data.success ? data.user : null;

      if (get().sessionRevision !== startedRevision) {
        set({ loading: false });
        return get().user;
      }

      get().setSession(user);
      set({ loading: false });
      return user;
    } catch {
      if (get().sessionRevision !== startedRevision) {
        set({ loading: false });
        return get().user;
      }

      get().clearSession({ loading: false });
      return null;
    }
  },

  refrescarPerfil: async () => get().checkAuth(),
  esAdmin: () => get().user?.role === 'admin',
  esEmpleado: () => get().user?.role === 'employee',
}));
