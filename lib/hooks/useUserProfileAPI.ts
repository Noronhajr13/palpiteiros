'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'

interface UserProfile {
  id: string
  nome: string
  email: string
  criadoEm: string
  estatisticas: {
    totalBoloes: number
    boloesAtivos: number
    totalPalpites: number
    palpitesCorretos: number
    aproveitamento: number
    ranking: number | null
  }
  conquistas: Array<{
    nome: string
    icone: string
  }>
  boloesRecentes: Array<{
    id: string
    nome: string
    posicao: number
    pontos: number
  }>
}

interface ProfileData {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  atualizarPerfil: (nome: string) => Promise<boolean>
  recarregarPerfil: () => Promise<void>
}

export function useUserProfile(): ProfileData {
  const { user, isAuthenticated } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarPerfil = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/usuario/perfil', {
        headers: {
          'x-user-id': user.id
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar perfil')
      }

      const perfilData = await response.json()
      setProfile(perfilData)
      
    } catch (err) {
      console.error('Erro ao carregar perfil:', err)
      setError('Erro ao carregar perfil do usuário')
    } finally {
      setLoading(false)
    }
  }

  const atualizarPerfil = async (nome: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false
    }

    try {
      setError(null)
      
      const response = await fetch('/api/usuario/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ nome })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil')
      }

      // Recarregar perfil após atualização
      await carregarPerfil()
      return true
      
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err)
      setError('Erro ao atualizar perfil')
      return false
    }
  }

  const recarregarPerfil = async () => {
    await carregarPerfil()
  }

  useEffect(() => {
    carregarPerfil()
  }, [isAuthenticated, user])

  return {
    profile,
    loading,
    error,
    atualizarPerfil,
    recarregarPerfil
  }
}