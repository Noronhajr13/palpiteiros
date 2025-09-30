'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'

interface UseAuthRedirectOptions {
  redirectTo?: string
  requireAuth?: boolean
  onRedirect?: () => void
}

/**
 * Hook customizado para gerenciar autenticação e redirecionamento
 * Elimina a repetição do padrão useEffect + router.push em múltiplos componentes
 */
export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const { 
    redirectTo = '/entrar', 
    requireAuth = true, 
    onRedirect 
  } = options
  
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      onRedirect?.()
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo, requireAuth, onRedirect])

  return {
    user,
    isAuthenticated,
    isReady: requireAuth ? isAuthenticated : true
  }
}

/**
 * Hook específico para páginas que requerem autenticação
 * Simplifica ainda mais o uso comum
 */
export function useRequireAuth(redirectTo?: string) {
  return useAuthRedirect({ 
    redirectTo, 
    requireAuth: true 
  })
}

/**
 * Hook para páginas públicas que redirecionam usuários autenticados
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/meus-boloes') {
  return useAuthRedirect({ 
    redirectTo, 
    requireAuth: false 
  })
}
