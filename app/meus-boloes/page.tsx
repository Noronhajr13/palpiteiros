'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, TrendingUp, Plus, LogOut, Target, Award, Hash, ChevronRight, BarChart3, User, History } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useBolaoStore } from '@/lib/stores/useBolaoStore'
import { BoloesListSkeleton } from '@/components/ui/loading-skeletons'
import { EmptyBoloesList } from '@/components/ui/empty-states'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function MeusBoloes() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { boloes, carregarBoloes } = useBolaoStore()
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/entrar')
      return
    }
    
    const loadData = async () => {
      setLoading(true)
      setStatsLoading(true)
      
      // Simular carregamento dos dados
      await new Promise(resolve => setTimeout(resolve, 1000))
      carregarBoloes()
      
      // Simular carregamento das estatísticas
      await new Promise(resolve => setTimeout(resolve, 800))
      setStatsLoading(false)
      setLoading(false)
    }
    
    loadData()
  }, [isAuthenticated, router, carregarBoloes])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Filtrar bolões onde o usuário participa
  const meusBoloes = boloes.filter(bolao => 
    bolao.participantes.some(p => p.id === user?.id)
  )

  const estatisticas = {
    totalBoloes: meusBoloes.length,
    totalPontos: meusBoloes.reduce((acc, bolao) => {
      const participante = bolao.participantes.find(p => p.id === user?.id)
      return acc + (participante?.pontos || 0)
    }, 0),
    melhorPosicao: meusBoloes.length > 0 
      ? Math.min(...meusBoloes.map(bolao => {
          const participante = bolao.participantes.find(p => p.id === user?.id)
          return participante?.posicao || 999
        }))
      : 0,
    palpitesCorretos: meusBoloes.reduce((acc, bolao) => {
      const participante = bolao.participantes.find(p => p.id === user?.id)
      return acc + (participante?.palpitesCorretos || 0)
    }, 0)
  }

  if (!isAuthenticated || !user) {
    return null // ou um loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Palpiteiros</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Olá, {user.name}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <Link href="/perfil">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/estatisticas">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Estatísticas
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/historico">
                  <History className="h-4 w-4 mr-2" />
                  Histórico
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/criar-bolao">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Bolão
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/entrar-bolao">
                  <Users className="h-4 w-4 mr-2" />
                  Entrar em Bolão
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            // Skeleton para estatísticas
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Estatísticas reais
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bolões Ativos
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{estatisticas.totalBoloes}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Pontos
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{estatisticas.totalPontos}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Melhor Posição
                  </CardTitle>
                  <Award className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {estatisticas.melhorPosicao > 0 ? `${estatisticas.melhorPosicao}º` : '-'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Palpites Corretos
                  </CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{estatisticas.palpitesCorretos}</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Lista de Bolões */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Meus Bolões</h2>
          </div>

          {loading ? (
            <BoloesListSkeleton />
          ) : meusBoloes.length === 0 ? (
            <EmptyBoloesList />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {meusBoloes.map((bolao) => {
                const meuParticipante = bolao.participantes.find(p => p.id === user.id)
                const aproveitamento = meuParticipante?.totalPalpites 
                  ? Math.round((meuParticipante.palpitesCorretos / meuParticipante.totalPalpites) * 100)
                  : 0
                
                return (
                  <Link key={bolao.id} href={`/bolao/${bolao.id}`}>
                    <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border-none shadow-lg hover:scale-105 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                              {bolao.nome}
                            </CardTitle>
                            <CardDescription className="text-gray-600 text-sm leading-relaxed">
                              {bolao.descricao}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <Hash className="h-3 w-3" />
                            {bolao.codigo}
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {bolao.participantes.length}/{bolao.maxParticipantes} pessoas
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Posição e Pontos */}
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                              <Award className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-700">
                                {meuParticipante?.posicao}º Posição
                              </div>
                              <div className="text-xs text-gray-500">
                                no ranking geral
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-blue-600">
                              {meuParticipante?.pontos || 0}
                            </div>
                            <div className="text-xs text-gray-500">pontos</div>
                          </div>
                        </div>

                        {/* Estatísticas */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200/50">
                            <div className="text-lg font-bold text-green-600">
                              {meuParticipante?.palpitesCorretos || 0}
                            </div>
                            <div className="text-xs text-gray-600">acertos</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200/50">
                            <div className="text-lg font-bold text-purple-600">
                              {aproveitamento}%
                            </div>
                            <div className="text-xs text-gray-600">aproveitamento</div>
                          </div>
                        </div>

                        {/* Progresso */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Palpites realizados</span>
                            <span>{meuParticipante?.totalPalpites || 0}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(((meuParticipante?.totalPalpites || 0) / 10) * 100, 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-center gap-2 text-sm text-blue-600 group-hover:text-blue-700 font-medium">
                            <Target className="h-4 w-4" />
                            <span>Fazer novos palpites</span>
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Explore mais funcionalidades do Palpiteiros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                <Link href="/criar-bolao">
                  <Plus className="h-6 w-6" />
                  <span className="font-medium">Criar Novo Bolão</span>
                  <span className="text-xs text-gray-600">Configure seu próprio torneio</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
                <Link href="/entrar-bolao">
                  <Users className="h-6 w-6" />
                  <span className="font-medium">Entrar em Bolão</span>
                  <span className="text-xs text-gray-600">Use um código para participar</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}