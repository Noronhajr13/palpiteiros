import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

// Mock users database
const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@palpiteiros.com',
    password: '123456',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2', 
    name: 'Maria Santos',
    email: 'maria@palpiteiros.com',
    password: '123456',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
]

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (user) {
      const { password: userPassword, ...userWithoutPassword } = user
      console.log('Login successful, password removed from response:', userPassword ? 'exists' : 'missing')
      set({ 
        user: userWithoutPassword, 
        isAuthenticated: true 
      })
      return true
    }
    
    return false
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  register: async (name: string, email: string, password: string) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Verificar se usuário já existe
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return false
    }
    
    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000000000)}?w=100&h=100&fit=crop&crop=face`
    }
    
    mockUsers.push(newUser)
    
    // Auto login após registro  
    const { password: newUserPassword, ...userWithoutPassword } = newUser
    console.log('User registered successfully, password removed from state:', newUserPassword ? 'exists' : 'missing')
    set({ 
      user: userWithoutPassword, 
      isAuthenticated: true 
    })
    
    return true
  }
}))