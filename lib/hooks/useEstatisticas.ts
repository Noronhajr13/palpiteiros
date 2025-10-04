'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'

interface EstatisticasGeral {
  totalPalpites: number
  palpitesCorretos: number
  acertosExatos: number
  aproveitamento: number
  pontosTotais: number
  totalBoloes: number
}

interface EstatisticasPeriodo {
  total: number
  corretos: number
  exatos: number
  aproveitamento: number
}

interface EstatisticasTime {
  time: string
  jogos: number
  acertos: number
  pontos: number
  aproveitamento: number
}

interface EstatisticasBolao {
  nome: string
  palpites: number
  acertos: number
  pontos: number
  aproveitamento: number
}

interface EstatisticasCompletas {
  geral: EstatisticasGeral
  ultimoMes: EstatisticasPeriodo
  ultimoTrimestre: EstatisticasPeriodo
  porTime: EstatisticasTime[]
  porBolao: EstatisticasBolao[]
}

interface UseEstatisticasReturn {
  estatisticas: EstatisticasCompletas | null
  loading: boolean
  error: string | null
  recarregar: () => Promise<void>
}

export function useEstatisticas(periodo: 'all' | 'month' | 'quarter' = 'all'): UseEstatisticasReturn {
  const { user, isAuthenticated } = useAuthStore()
  const [estatisticas, setEstatisticas] = useState<EstatisticasCompletas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarEstatisticas = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/usuario/estatisticas?periodo=${periodo}`, {
        headers: {
          'x-user-id': user.id
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas')
      }

      const data = await response.json()
      setEstatisticas(data)
      
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
      setError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  const recarregar = async () => {
    await carregarEstatisticas()
  }

  useEffect(() => {
    carregarEstatisticas()
  }, [isAuthenticated, user, periodo])

  return {
    estatisticas,
    loading,
    error,
    recarregar
  }
}