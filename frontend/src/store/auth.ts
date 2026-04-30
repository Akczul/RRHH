import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import axios from '../api/axios'
import { User, LoginDto, RegisterDto } from './types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  error: string | null
  login: (creds: LoginDto) => Promise<void>
  register: (creds: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    devtools((set: any, get: any) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null,

      login: async (creds: LoginDto) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post('/auth/login', creds)
          const user: User = res.data.user
          set({ user, isAuthenticated: true, token: null, loading: false })
        } catch (err: any) {
          const msg = err?.response?.data?.message ?? err?.message ?? 'Login failed'
          set({ error: msg, loading: false })
        }
      },

      register: async (creds: RegisterDto) => {
        set({ loading: true, error: null })
        try {
          const res = await axios.post('/auth/register', creds)
          const user: User = res.data.user
          set({ user, isAuthenticated: true, token: null, loading: false })
        } catch (err: any) {
          const msg = err?.response?.data?.message ?? err?.message ?? 'Registration failed'
          set({ error: msg, loading: false })
        }
      },

      logout: async () => {
        try {
          await axios.post('/auth/logout')
        } catch {
          // ignore errors; always clear local state
        }
        set({ user: null, isAuthenticated: false, token: null })
      },

      checkSession: async () => {
        try {
          const res = await axios.get('/auth/profile')
          const user: User = res.data.user
          set({ user, isAuthenticated: true })
          return true
        } catch {
          set({ user: null, isAuthenticated: false })
          return false
        }
      },

      clearError: () => set({ error: null }),
    })),
    { name: 'auth-storage', partialize: (state: any) => ({ isAuthenticated: state.isAuthenticated }) }
  )
)
)