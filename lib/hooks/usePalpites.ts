import { useState, useEffect } from 'react'

interface Palpite {
  id: string
  jogoId: string
  userId: string
  bolaoId: string
  placarA: number
  placarB: number
  pontos?: number | null
  createdAt: string
  updatedAt: string
  jogo?: {
    id: string
    timeA: string
    timeB: string
    data: string
    rodada: number
    status: string
    placarA?: number | null
    placarB?: number | null
  }
}

interface NovoPalpite {
  jogoId: string
  placarA: number
  placarB: number
}

export function usePalpites(userId: string, bolaoId: string) {
  const [palpites, setPalpites] = useState<Palpite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPalpites = async () => {
    if (!userId || !bolaoId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/palpites?userId=${userId}&bolaoId=${bolaoId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar palpites')
      }

      setPalpites(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const salvarPalpite = async (novoPalpite: NovoPalpite) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/palpites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bolaoId,
          ...novoPalpite
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar palpite')
      }

      // Atualizar lista de palpites
      await fetchPalpites()
      
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getPalpiteJogo = (jogoId: string) => {
    return palpites.find(p => p.jogoId === jogoId)
  }

  const estatisticas = {
    totalPalpites: palpites.length,
    palpitesCorretos: palpites.filter(p => p.pontos && p.pontos > 0).length,
    aproveitamento: palpites.length > 0 
      ? Math.round((palpites.filter(p => p.pontos && p.pontos > 0).length / palpites.length) * 100)
      : 0,
    pontosTotais: palpites.reduce((acc, p) => acc + (p.pontos || 0), 0)
  }

  useEffect(() => {
    fetchPalpites()
  }, [userId, bolaoId])

  return {
    palpites,
    loading,
    error,
    fetchPalpites,
    salvarPalpite,
    getPalpiteJogo,
    estatisticas
  }
}