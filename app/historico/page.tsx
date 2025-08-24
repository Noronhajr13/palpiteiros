'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  Hash
} from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { BreadcrumbCard } from '@/components/ui/breadcrumbs'

interface HistoricoItem {
  id: string
  bolaoNome: string
  bolaoId: string
  jogo: {
    timeA: string
    timeB: string
    data: string
    rodada: number
    campeonato: string
  }
  palpite: {
    placarA: number
    placarB: number
  }
  resultado?: {
    placarA: number
    placarB: number
  }
  pontos: number
  status: 'correto_exato' | 'correto_resultado' | 'incorreto' | 'pendente'
  tipo: 'placar_exato' | 'resultado' | 'erro'
}

const HISTORICO_MOCK: HistoricoItem[] = [
  {
    id: '1',
    bolaoNome: 'Copa dos Amigos 2024',
    bolaoId: 'copa-amigos',
    jogo: {
      timeA: 'Brasil',
      timeB: 'Argentina',
      data: '2024-08-20T21:00:00Z',
      rodada: 15,
      campeonato: 'Copa América'
    },
    palpite: { placarA: 2, placarB: 1 },
    resultado: { placarA: 2, placarB: 1 },
    pontos: 10,
    status: 'correto_exato',
    tipo: 'placar_exato'
  },
  {
    id: '2',
    bolaoNome: 'Brasileirão Família',
    bolaoId: 'brasileirao-familia',
    jogo: {
      timeA: 'Flamengo',
      timeB: 'Palmeiras',
      data: '2024-08-18T16:00:00Z',
      rodada: 23,
      campeonato: 'Brasileirão'
    },
    palpite: { placarA: 1, placarB: 0 },
    resultado: { placarA: 2, placarB: 0 },
    pontos: 5,
    status: 'correto_resultado',
    tipo: 'resultado'
  },
  {
    id: '3',
    bolaoNome: 'Champions League',
    bolaoId: 'champions-league',
    jogo: {
      timeA: 'Barcelona',
      timeB: 'Real Madrid',
      data: '2024-08-15T16:45:00Z',
      rodada: 3,
      campeonato: 'Champions League'
    },
    palpite: { placarA: 2, placarB: 1 },
    resultado: { placarA: 0, placarB: 3 },
    pontos: 0,
    status: 'incorreto',
    tipo: 'erro'
  },
  {
    id: '4',
    bolaoNome: 'Copa dos Amigos 2024',
    bolaoId: 'copa-amigos',
    jogo: {
      timeA: 'França',
      timeB: 'Espanha',
      data: '2024-08-25T18:00:00Z',
      rodada: 16,
      campeonato: 'Copa América'
    },
    palpite: { placarA: 1, placarB: 2 },
    pontos: 0,
    status: 'pendente',
    tipo: 'erro'
  }
]

export default function HistoricoPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [filtros, setFiltros] = useState({
    search: '',
    bolao: 'todos',
    status: 'todos',
    periodo: '30'
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/entrar')
      return
    }

    // Simular carregamento do histórico
    const loadHistorico = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHistorico(HISTORICO_MOCK)
      setLoading(false)
    }

    loadHistorico()
  }, [isAuthenticated, router])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'correto_exato':
        return {
          badge: 'Placar Exato',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-4 w-4" />,
          emoji: '🎯'
        }
      case 'correto_resultado':
        return {
          badge: 'Resultado',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Target className="h-4 w-4" />,
          emoji: '✅'
        }
      case 'incorreto':
        return {
          badge: 'Errou',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="h-4 w-4" />,
          emoji: '❌'
        }
      case 'pendente':
        return {
          badge: 'Pendente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="h-4 w-4" />,
          emoji: '⏳'
        }
      default:
        return {
          badge: 'Desconhecido',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="h-4 w-4" />,
          emoji: '❓'
        }
    }
  }

  const historicoFiltrado = historico.filter(item => {
    const matchesSearch = item.jogo.timeA.toLowerCase().includes(filtros.search.toLowerCase()) ||
                         item.jogo.timeB.toLowerCase().includes(filtros.search.toLowerCase()) ||
                         item.bolaoNome.toLowerCase().includes(filtros.search.toLowerCase())
    
    const matchesBolao = filtros.bolao === 'todos' || item.bolaoId === filtros.bolao
    const matchesStatus = filtros.status === 'todos' || item.status === filtros.status

    return matchesSearch && matchesBolao && matchesStatus
  })

  const estatisticas = {
    total: historico.length,
    acertosExatos: historico.filter(h => h.status === 'correto_exato').length,
    acertosResultado: historico.filter(h => h.status === 'correto_resultado').length,
    erros: historico.filter(h => h.status === 'incorreto').length,
    pendentes: historico.filter(h => h.status === 'pendente').length,
    totalPontos: historico.reduce((acc, h) => acc + h.pontos, 0)
  }

  const aproveitamento = estatisticas.total > 0 
    ? ((estatisticas.acertosExatos + estatisticas.acertosResultado) / (estatisticas.total - estatisticas.pendentes)) * 100
    : 0

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/meus-boloes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  📋 Histórico de Palpites
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Todos os seus palpites e resultados
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbCard>
            <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <Link 
                href="/meus-boloes" 
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <span>🏠</span>
                <span>Início</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                href="/meus-boloes" 
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <span>🏆</span>
                <span>Meus Bolões</span>
              </Link>
              <span className="text-gray-400">/</span>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                <span>📋</span>
                <span>Histórico</span>
              </div>
            </nav>
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Estatísticas gerais */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{estatisticas.total}</div>
                <div className="text-sm text-gray-500">Total Palpites</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{estatisticas.acertosExatos}</div>
                <div className="text-sm text-gray-500">Placares Exatos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{estatisticas.acertosResultado}</div>
                <div className="text-sm text-gray-500">Resultados</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(aproveitamento)}%</div>
                <div className="text-sm text-gray-500">Aproveitamento</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{estatisticas.totalPontos}</div>
                <div className="text-sm text-gray-500">Total Pontos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Buscar por time ou bolão..."
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full"
                />
              </div>
              <select 
                value={filtros.bolao}
                onChange={(e) => setFiltros(prev => ({ ...prev, bolao: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="todos">Todos os bolões</option>
                <option value="copa-amigos">Copa dos Amigos</option>
                <option value="brasileirao-familia">Brasileirão Família</option>
                <option value="champions-league">Champions League</option>
              </select>
              <select 
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="todos">Todos os status</option>
                <option value="correto_exato">Placar Exato</option>
                <option value="correto_resultado">Resultado</option>
                <option value="incorreto">Incorretos</option>
                <option value="pendente">Pendentes</option>
              </select>
              <select 
                value={filtros.periodo}
                onChange={(e) => setFiltros(prev => ({ ...prev, periodo: e.target.value }))}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 3 meses</option>
                <option value="todos">Todo período</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de histórico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Histórico ({historicoFiltrado.length} palpites)</span>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historicoFiltrado.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum palpite encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ajuste os filtros para encontrar outros palpites
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historicoFiltrado.map((item) => {
                  const statusConfig = getStatusConfig(item.status)
                  
                  return (
                    <div
                      key={item.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={statusConfig.color}>
                            {statusConfig.emoji} {statusConfig.badge}
                          </Badge>
                          <span className="font-semibold text-green-600 text-lg">
                            +{item.pontos} pts
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(item.jogo.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Jogo */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            ⚽ {item.jogo.timeA} vs {item.jogo.timeB}
                          </h4>
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <div>🏆 {item.jogo.campeonato}</div>
                            <div>📅 Rodada {item.jogo.rodada}</div>
                            <div>
                              <Link
                                href={`/bolao/${item.bolaoId}`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <Hash className="h-3 w-3 inline mr-1" />
                                {item.bolaoNome}
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Seu palpite */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            🎯 Seu Palpite
                          </h4>
                          <div className="text-2xl font-bold text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            {item.palpite.placarA} × {item.palpite.placarB}
                          </div>
                        </div>

                        {/* Resultado real */}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {item.resultado ? '⚽ Resultado Final' : '⏳ Aguardando'}
                          </h4>
                          {item.resultado ? (
                            <div className="text-2xl font-bold text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              {item.resultado.placarA} × {item.resultado.placarB}
                            </div>
                          ) : (
                            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-700 dark:text-yellow-300">
                              Jogo ainda não começou
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}