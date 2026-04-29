import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import axios from '../api/axios'
import { Task } from './types'

export interface TasksState {
  tasks: Task[]
  filters: { q?: string; completed?: boolean; projectId?: string | null }
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (payload: Partial<Task>) => Promise<void>
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setFilters: (filters: Partial<TasksState['filters']>) => void
}

export const useTaskStore = create<TasksState>()(
  persist(
    devtools((set: any, get: any) => ({
      tasks: [],
      filters: {},
      loading: false,
      error: null,

      fetchTasks: async () => {
        set({ loading: true, error: null })
        const attempt = async (retries: number) => {
          try {
            const res = await axios.get('/tasks')
            set({ tasks: res.data, loading: false })
          } catch (err: any) {
            if (retries > 0) {
              await new Promise((r) => setTimeout(r, 500))
              return attempt(retries - 1)
            } else {
              set({ error: err?.response?.data?.message ?? err?.message ?? 'Failed to fetch tasks', loading: false })
            }
          }
        }
        await attempt(2)
      },

      createTask: async (payload: Partial<Task>) => {
        set({ loading: true, error: null })
        const attempt = async (retries: number) => {
          try {
            const res = await axios.post('/tasks', payload)
            const newTask: Task = res.data
            set((state: any) => ({ tasks: [...state.tasks, newTask], loading: false }))
          } catch (err: any) {
            if (retries > 0) {
              await new Promise((r) => setTimeout(r, 500))
              return attempt(retries - 1)
            } else {
              throw err
            }
          }
        }
        try {
          await attempt(2)
        } catch (err: any) {
          set({ error: err?.response?.data?.message ?? err?.message ?? 'Failed to create task', loading: false })
        }
      },

      updateTask: async (id: string, patch: Partial<Task>) => {
        set({ loading: true, error: null })
        const attempt = async (retries: number) => {
          try {
            const res = await axios.put(`/tasks/${id}`, patch)
            const updated: Task = res.data
            set((state: any) => ({ tasks: state.tasks.map((t: any) => (t.id === id ? updated : t)), loading: false }))
          } catch (err: any) {
            if (retries > 0) {
              await new Promise((r) => setTimeout(r, 500))
              return attempt(retries - 1)
            } else {
              throw err
            }
          }
        }
        try {
          await attempt(2)
        } catch (err: any) {
          set({ error: err?.response?.data?.message ?? err?.message ?? 'Failed to update task', loading: false })
        }
      },

      deleteTask: async (id: string) => {
        set({ loading: true, error: null })
        const attempt = async (retries: number) => {
          try {
            await axios.delete(`/tasks/${id}`)
            set((state: any) => ({ tasks: state.tasks.filter((t: any) => t.id !== id), loading: false }))
          } catch (err: any) {
            if (retries > 0) {
              await new Promise((r) => setTimeout(r, 500))
              return attempt(retries - 1)
            } else {
              throw err
            }
          }
        }
        try {
          await attempt(2)
        } catch (err: any) {
          set({ error: err?.response?.data?.message ?? err?.message ?? 'Failed to delete task', loading: false })
        }
      },

      setFilters: (filters: Partial<TasksState['filters']>) => set((state: any) => ({
        filters: { ...state.filters, ...filters },
      })),
    })), { name: 'tasks-storage' }
  )
)
