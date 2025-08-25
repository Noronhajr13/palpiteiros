'use client'

import { useState, useEffect } from 'react'
import { useBolaoStore, Bolao } from '@/lib/stores/useBolaoStore'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface DashboardStats {
  totalBoloes: number
  totalPalpites: number
  totalAcertos: number
  aproveitamento: number
  posicaoMedia: number
  melhorColocacao: number
}

interface DashboardData {
  boloes: Bolao[]
  stats: DashboardStats
  loading: boolean
  statsLoading: boolean
  error: string | null
}

/**
 * Hook customizado para gerenciar dados do dashboard
 * Centraliza a lógica de carregamento de bolões e estatísticas
 */
export function useDashboardData(): DashboardData {
  const { boloes, carregarBoloes } = useBolaoStore()
  const { user } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalBoloes: 0,
    totalPalpites: 0,
    totalAcertos: 0,
    aproveitamento: 0,
    posicaoMedia: 0,
    melhorColocacao: 0
  })

  // Carrega bolões do usuário
  useEffect(() => {
    const loadBoloes = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        setError(null)
        // Simula delay de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000))
        carregarBoloes()
      } catch (err) {
        setError('Erro ao carregar bolões')
        console.error('Erro ao carregar bolões:', err)
      } finally {
        setLoading(false)
      }
    }

    loadBoloes()
  }, [user, carregarBoloes])

  // Calcula estatísticas quando bolões são carregados
  useEffect(() => {
    const calculateStats = async () => {
      if (!user || boloes.length === 0) {
        setStatsLoading(false)
        return
      }

      try {
        setStatsLoading(true)
        
        // Simula delay de API para estatísticas
        await new Promise(resolve => setTimeout(resolve, 800))
        
        let totalPalpites = 0
        let totalAcertos = 0
        const posicoes: number[] = []
        
        boloes.forEach(bolao => {
          const participante = bolao.participantes?.find((p: { id: string }) => p.id === user.id)
          if (participante) {
            totalPalpites += participante.totalPalpites || 0
            totalAcertos += participante.palpitesCorretos || 0
            if (participante.posicao) {
              posicoes.push(participante.posicao)
            }
          }
        })

        const aproveitamento = totalPalpites > 0 ? (totalAcertos / totalPalpites) * 100 : 0
        const posicaoMedia = posicoes.length > 0 ? posicoes.reduce((a, b) => a + b, 0) / posicoes.length : 0
        const melhorColocacao = posicoes.length > 0 ? Math.min(...posicoes) : 0

        setStats({
          totalBoloes: boloes.length,
          totalPalpites,
          totalAcertos,
          aproveitamento: Math.round(aproveitamento),
          posicaoMedia: Math.round(posicaoMedia),
          melhorColocacao
        })
      } catch (err) {
        setError('Erro ao calcular estatísticas')
        console.error('Erro ao calcular estatísticas:', err)
      } finally {
        setStatsLoading(false)
      }
    }

    calculateStats()
  }, [boloes, user])

  return {
    boloes,
    stats,
    loading,
    statsLoading,
    error
  }
}
