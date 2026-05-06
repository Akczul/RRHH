import { create } from 'zustand';

let nextId = 1;

export const useToastStore = create((set, get) => ({
  toasts: [],

  /**
   * Muestra una notificacion toast.
   * @param {Object} opts
   * @param {'success'|'error'|'warning'|'info'} [opts.type='info']
   * @param {string} [opts.title]
   * @param {string} [opts.msg]
   * @param {number} [opts.duration=4500]  ms (0 = no auto-cerrar)
   */
  push: (opts = {}) => {
    const id = nextId++;
    const toast = {
      id,
      type: opts.type || 'info',
      title: opts.title || '',
      msg: opts.msg || '',
      duration: opts.duration ?? 4500,
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (toast.duration > 0) {
      setTimeout(() => get().dismiss(id), toast.duration);
    }
    return id;
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}));

// Helpers de conveniencia
export const toast = {
  success: (title, msg, duration) =>
    useToastStore.getState().push({ type: 'success', title, msg, duration }),
  error: (title, msg, duration) =>
    useToastStore.getState().push({ type: 'error', title, msg, duration }),
  warning: (title, msg, duration) =>
    useToastStore.getState().push({ type: 'warning', title, msg, duration }),
  info: (title, msg, duration) =>
    useToastStore.getState().push({ type: 'info', title, msg, duration }),
};
