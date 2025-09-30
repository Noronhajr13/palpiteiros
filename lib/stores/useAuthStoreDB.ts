import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string | null
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true })
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        set({ 
          user: data.user, 
          isAuthenticated: true,
          loading: false
        })
        return true
      }

      set({ loading: false })
      return false
    } catch (error) {
      console.error('Erro no login:', error)
      set({ loading: false })
      return false
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  register: async (name: string, email: string, password: string) => {
    set({ loading: true })
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Auto login após registro
        set({ 
          user: data.user, 
          isAuthenticated: true,
          loading: false
        })
        return true
      }

      set({ loading: false })
      return false
    } catch (error) {
      console.error('Erro no registro:', error)
      set({ loading: false })
      return false
    }
  }
}))