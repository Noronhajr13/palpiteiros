import { useState, useEffect } from 'react'

interface ParticipanteRanking {
  id: string
  userId: string
  nome: string
  avatar?: string | null
  pontos: number
  posicao: number
  palpitesCorretos: number
  totalPalpites: number
  aproveitamento: number
}

interface EstatisticasRanking {
  totalParticipantes: number
  totalPalpites: number
  totalAcertos: number
  pontuacaoMedia: number
}

interface ConfiguracoesBolao {
  nome: string
  placarExato: number
  resultadoCerto: number
  golsExatos: number
  multiplicadorFinal: number
  bonusSequencia: number
}

interface RankingData {
  ranking: ParticipanteRanking[]
  estatisticas: EstatisticasRanking
  configuracoes: ConfiguracoesBolao
}

export function useRanking(bolaoId: string) {
  const [data, setData] = useState<RankingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRanking = async () => {
    if (!bolaoId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/ranking/${bolaoId}`)
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao carregar ranking')
      }

      setData(responseData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const getPosicaoUsuario = (userId: string) => {
    return data?.ranking.find(p => p.userId === userId)
  }

  const getTop3 = () => {
    return data?.ranking.slice(0, 3) || []
  }

  const getRankingCompleto = () => {
    return data?.ranking || []
  }

  useEffect(() => {
    fetchRanking()
  }, [bolaoId])

  return {
    ranking: data?.ranking || [],
    estatisticas: data?.estatisticas,
    configuracoes: data?.configuracoes,
    loading,
    error,
    fetchRanking,
    getPosicaoUsuario,
    getTop3,
    getRankingCompleto
  }
}