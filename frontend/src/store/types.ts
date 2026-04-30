export interface User {
  id: string
  name: string
  email: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  projectId?: string
}
