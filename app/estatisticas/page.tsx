'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share, Calendar, Filter } from "lucide-react"
import { useSession } from 'next-auth/react'
import { AdvancedStats } from '@/components/ui/advanced-stats'
import { BreadcrumbCard } from '@/components/ui/breadcrumbs'
import { useEstatisticas } from '@/lib/hooks/useEstatisticas'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Trophy, Target, BarChart3 } from "lucide-react"

export default function EstatisticasPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [timeRange, setTimeRange] = useState<'all' | 'month' | 'quarter'>('all')
  
  const { estatisticas, loading, error } = useEstatisticas(timeRange)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const user = session?.user
  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
            
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
            
            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                  📊 Estatísticas Avançadas
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Análise completa da sua performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filtro de tempo */}
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'all' | 'month' | 'quarter')}
                className="px-3 py-2 text-sm border border-gray-600 rounded-lg bg-gray-700 text-gray-100"
              >
                <option value="all">Todo período</option>
                <option value="month">Último mês</option>
                <option value="quarter">Último trimestre</option>
              </select>

              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              
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
                <span>📊</span>
                <span>Estatísticas</span>
              </div>
            </nav>
          </BreadcrumbCard>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando estatísticas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Erro ao carregar estatísticas</p>
          </div>
        ) : estatisticas ? (
          <div className="space-y-8">
            {/* Cards de Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Total de Palpites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.geral.totalPalpites}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Taxa de Acertos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{estatisticas.geral.aproveitamento}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Acertos Exatos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{estatisticas.geral.acertosExatos}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Pontos Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{estatisticas.geral.pontosTotais}</div>
                </CardContent>
              </Card>
            </div>

            {/* Top Times */}
            {estatisticas.porTime.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Melhor Performance por Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estatisticas.porTime.slice(0, 5).map((time, index) => (
                      <div key={time.time} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{time.time}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{time.aproveitamento}%</div>
                          <div className="text-sm text-muted-foreground">{time.acertos}/{time.jogos}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Performance por Bolão */}
            {estatisticas.porBolao.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Bolão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estatisticas.porBolao.map((bolao, index) => (
                      <div key={bolao.nome} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">{bolao.nome}</div>
                          <div className="text-sm text-muted-foreground">{bolao.palpites} palpites</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{bolao.aproveitamento}%</div>
                          <div className="text-sm text-muted-foreground">{bolao.pontos} pontos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
        
        {/* Footer da página */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📈 Quer melhorar ainda mais?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Análise Histórica
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Veja padrões nos seus acertos e erros ao longo do tempo
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Filter className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Filtros Avançados
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Analise por campeonato, time, horário e muito mais
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Share className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Compare com Amigos
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Veja como você se sai comparado aos outros participantes
                </p>
              </div>
            </div>
            
            <Button className="mt-6" size="lg">
              <Link href="/meus-boloes" className="flex items-center gap-2">
                🏆 Voltar aos Meus Bolões
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}