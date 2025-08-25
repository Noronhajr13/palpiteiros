'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface HistoricoPalpite {
  id: string
  bolaoId: string
  bolaoNome: string
  timeA: string
  timeB: string
  palpiteA: number
  palpiteB: number
  resultadoA?: number
  resultadoB?: number
  pontos: number
  status: 'correto-exato' | 'correto-resultado' | 'erro' | 'pendente'
  rodada: number
  data: string
  campeonato: string
}

interface HistoricoFilters {
  status: string
  bolao: string
  time: string
  periodo: string
}

interface HistoricoStats {
  total: number
  acertosExatos: number
  acertosResultado: number
  erros: number
  pendentes: number
  aproveitamento: number
  pontosTotais: number
}

interface HistoricoData {
  palpites: HistoricoPalpite[]
  filteredPalpites: HistoricoPalpite[]
  stats: HistoricoStats
  filters: HistoricoFilters
  loading: boolean
  searchTerm: string
  updateFilters: (newFilters: Partial<HistoricoFilters>) => void
  updateSearchTerm: (term: string) => void
  exportData: () => void
}

/**
 * Hook customizado para gerenciar histórico de palpites
 * Centraliza lógica de carregamento, filtros e estatísticas
 */
export function useHistoricoPalpites(): HistoricoData {
  const { user } = useAuthStore()
  
  const [palpites, setPalpites] = useState<HistoricoPalpite[]>([])
  const [filteredPalpites, setFilteredPalpites] = useState<HistoricoPalpite[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<HistoricoFilters>({
    status: 'todos',
    bolao: 'todos',
    time: 'todos',
    periodo: 'todos'
  })

  // Mock data para histórico
  useEffect(() => {
    const mockPalpites: HistoricoPalpite[] = [
      {
        id: '1',
        bolaoId: 'bolao1',
        bolaoNome: 'Família 2024',
        timeA: 'Flamengo',
        timeB: 'Vasco',
        palpiteA: 2,
        palpiteB: 1,
        resultadoA: 2,
        resultadoB: 1,
        pontos: 10,
        status: 'correto-exato',
        rodada: 15,
        data: '2024-08-15',
        campeonato: 'Brasileirão 2024'
      },
      {
        id: '2',
        bolaoId: 'bolao1',
        bolaoNome: 'Família 2024',
        timeA: 'Palmeiras',
        timeB: 'São Paulo',
        palpiteA: 1,
        palpiteB: 0,
        resultadoA: 2,
        resultadoB: 0,
        pontos: 5,
        status: 'correto-resultado',
        rodada: 16,
        data: '2024-08-18',
        campeonato: 'Brasileirão 2024'
      },
      {
        id: '3',
        bolaoId: 'bolao2',
        bolaoNome: 'Copa dos Amigos',
        timeA: 'Corinthians',
        timeB: 'Santos',
        palpiteA: 0,
        palpiteB: 2,
        resultadoA: 1,
        resultadoB: 0,
        pontos: 0,
        status: 'erro',
        rodada: 8,
        data: '2024-08-10',
        campeonato: 'Copa do Brasil 2024'
      }
    ]

    // Carrega histórico
    const loadHistorico = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setPalpites(mockPalpites)
      } catch (err) {
        console.error('Erro ao carregar histórico:', err)
      } finally {
        setLoading(false)
      }
    }

    loadHistorico()
  }, [user])

  // Aplica filtros e busca
  useEffect(() => {
    let filtered = [...palpites]

    // Filtro por status
    if (filters.status !== 'todos') {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    // Filtro por bolão
    if (filters.bolao !== 'todos') {
      filtered = filtered.filter(p => p.bolaoId === filters.bolao)
    }

    // Busca por time
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.timeA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.timeB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bolaoNome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPalpites(filtered)
  }, [palpites, filters, searchTerm])

  // Calcula estatísticas
  const stats: HistoricoStats = {
    total: palpites.length,
    acertosExatos: palpites.filter(p => p.status === 'correto-exato').length,
    acertosResultado: palpites.filter(p => p.status === 'correto-resultado').length,
    erros: palpites.filter(p => p.status === 'erro').length,
    pendentes: palpites.filter(p => p.status === 'pendente').length,
    aproveitamento: palpites.length > 0 
      ? Math.round(((palpites.filter(p => p.status.includes('correto')).length) / palpites.length) * 100)
      : 0,
    pontosTotais: palpites.reduce((sum, p) => sum + p.pontos, 0)
  }

  // Atualiza filtros
  const updateFilters = (newFilters: Partial<HistoricoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Atualiza termo de busca
  const updateSearchTerm = (term: string) => {
    setSearchTerm(term)
  }

  // Exporta dados
  const exportData = () => {
    const csvData = filteredPalpites.map(p => ({
      Data: p.data,
      Bolao: p.bolaoNome,
      Jogo: `${p.timeA} x ${p.timeB}`,
      Palpite: `${p.palpiteA}-${p.palpiteB}`,
      Resultado: p.resultadoA !== undefined ? `${p.resultadoA}-${p.resultadoB}` : 'Pendente',
      Status: p.status,
      Pontos: p.pontos
    }))

    // Simula download CSV
    console.log('Exportando dados:', csvData)
    alert('Dados exportados! (Em produção seria feito download do CSV)')
  }

  return {
    palpites,
    filteredPalpites,
    stats,
    filters,
    loading,
    searchTerm,
    updateFilters,
    updateSearchTerm,
    exportData
  }
}
