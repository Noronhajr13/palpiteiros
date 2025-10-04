'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'

interface HistoricoPalpite {
  id: string
  jogo: {
    id: string
    data: string
    rodada: number
    timeA: string
    timeB: string
    placarA: number | null
    placarB: number | null
    status: string
    bolao: {
      id: string
      nome: string
    }
  }
  palpite: {
    placarA: number
    placarB: number
  }
  status: 'correto-exato' | 'correto-resultado' | 'erro' | 'pendente'
  pontos: number
  data: string
}

interface HistoricoFilters {
  status: string
  bolao: string
  periodo: string
}

interface HistoricoStats {
  totalPalpites: number
  acertosExatos: number
  acertosResultado: number
  erros: number
  pendentes: number
  aproveitamento: number
  pontosTotais: number
}

interface Bolao {
  id: string
  nome: string
}

interface HistoricoData {
  palpites: HistoricoPalpite[]
  filteredPalpites: HistoricoPalpite[]
  stats: HistoricoStats
  boloes: Bolao[]
  filters: HistoricoFilters
  loading: boolean
  searchTerm: string
  updateFilters: (newFilters: Partial<HistoricoFilters>) => void
  updateSearchTerm: (term: string) => void
  exportData: () => void
}

export function useHistoricoPalpites(): HistoricoData {
  const { user, isAuthenticated } = useAuthStore()
  const [palpites, setPalpites] = useState<HistoricoPalpite[]>([])
  const [filteredPalpites, setFilteredPalpites] = useState<HistoricoPalpite[]>([])
  const [stats, setStats] = useState<HistoricoStats>({
    totalPalpites: 0,
    acertosExatos: 0,
    acertosResultado: 0,
    erros: 0,
    pendentes: 0,
    aproveitamento: 0,
    pontosTotais: 0
  })
  const [boloes, setBoloes] = useState<Bolao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<HistoricoFilters>({
    status: '',
    bolao: '',
    periodo: ''
  })

  const carregarHistorico = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (filters.bolao) params.append('bolaoId', filters.bolao)
      if (filters.status) params.append('status', filters.status)
      
      const response = await fetch(`/api/usuario/historico?${params.toString()}`, {
        headers: {
          'x-user-id': user.id
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar histórico')
      }

      const data = await response.json()
      setPalpites(data.palpites)
      setStats(data.estatisticas)
      setBoloes(data.boloes)
      
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<HistoricoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term)
  }

  const applyFilters = () => {
    let filtered = [...palpites]

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.jogo.timeA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.jogo.timeB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.jogo.bolao.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPalpites(filtered)
  }

  const exportData = () => {
    const csvData = filteredPalpites.map(p => ({
      Data: new Date(p.jogo.data).toLocaleDateString('pt-BR'),
      Bolao: p.jogo.bolao.nome,
      Jogo: `${p.jogo.timeA} x ${p.jogo.timeB}`,
      Palpite: `${p.palpite.placarA}-${p.palpite.placarB}`,
      Resultado: p.jogo.placarA !== null ? `${p.jogo.placarA}-${p.jogo.placarB}` : 'Pendente',
      Status: p.status,
      Pontos: p.pontos,
      Rodada: p.jogo.rodada
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `historico-palpites-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  useEffect(() => {
    carregarHistorico()
  }, [isAuthenticated, user, filters.bolao, filters.status])

  useEffect(() => {
    applyFilters()
  }, [palpites, searchTerm])

  return {
    palpites,
    filteredPalpites,
    stats,
    boloes,
    filters,
    loading,
    searchTerm,
    updateFilters,
    updateSearchTerm,
    exportData
  }
}