import { useEffect, useCallback } from 'react'
import { useBolaoStoreDB } from '@/lib/stores/useBolaoStoreAPI'
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'

export function useDashboardDataAPI() {
  const { user } = useAuthStore()
  const { boloes, loading, carregarBoloes } = useBolaoStoreDB()

  const loadBoloes = useCallback(() => {
    if (user?.id) {
      carregarBoloes(user.id)
    }
  }, [user?.id, carregarBoloes])

  // Carregar bolões quando usuário estiver disponível
  useEffect(() => {
    loadBoloes()
  }, [loadBoloes])

  // Calcular estatísticas
  const stats = {
    totalBoloes: boloes.length,
    totalParticipantes: boloes.reduce((acc, bolao) => acc + bolao.participantes.length, 0),
    totalPalpites: boloes.reduce((acc, bolao) => {
      const userParticipante = bolao.participantes.find(p => p.id === user?.id)
      return acc + (userParticipante?.totalPalpites || 0)
    }, 0),
    aproveitamento: Math.round(boloes.length > 0 ? boloes.reduce((acc, bolao) => {
      const userParticipante = bolao.participantes.find(p => p.id === user?.id)
      if (userParticipante && userParticipante.totalPalpites > 0) {
        return acc + ((userParticipante.palpitesCorretos / userParticipante.totalPalpites) * 100)
      }
      return acc
    }, 0) / boloes.length : 0),
    melhorColocacao: boloes.length > 0 ? Math.min(...boloes.map(bolao => {
      const userParticipante = bolao.participantes.find(p => p.id === user?.id)
      return userParticipante?.posicao || 999
    }).filter(pos => pos !== 999)) : null
  }

  return {
    boloes,
    stats,
    loading,
    statsLoading: loading,
    loadBoloes
  }
}