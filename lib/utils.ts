import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utilitários de Performance e Manutenibilidade
 */

// Debounce para otimizar performance em inputs
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle para limitar execução de funções
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Simular delay de API de forma consistente
export const simulateApiDelay = (min: number = 500, max: number = 2000): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

// Formatador de códigos de bolão
export const formatBolaoCode = (code: string): string => {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

// Gerador de códigos únicos
export const generateBolaoCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Validador de email simples
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Formatador de pontuação
export const formatPoints = (points: number): string => {
  return points.toLocaleString('pt-BR')
}

// Calculador de aproveitamento
export const calculateAproveitamento = (acertos: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((acertos / total) * 100)
}

// Função para copiar texto para clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}

// Formatador de data brasileiro
export const formatDateBR = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Truncar texto com reticências
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Classe CSS condicional para erros
export const fieldErrorClass = (error?: string): string => {
  return error ? 'border-red-500 focus:border-red-500' : ''
}

// Gerador de avatares placeholder
export const generateAvatarUrl = (name: string): string => {
  const encodedName = encodeURIComponent(name)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=random`
}