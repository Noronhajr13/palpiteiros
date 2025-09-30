'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, TrendingUp, Plus, LogOut, Target, Award, Hash, ChevronRight, BarChart3, User, History, Star, Zap, Crown } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useDashboardDataAPI } from '@/lib/hooks/useDashboardDataAPI'
import { BoloesListSkeleton } from '@/components/ui/loading-skeletons'
import { EmptyBoloesList } from '@/components/ui/empty-states'
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect'
import { FadeIn, ScaleOnHover } from '@/components/ui/animations'

export default function MeusBoloes() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
    const { boloes, stats, loading, statsLoading } = useDashboardDataAPI()
  
  // Hook de redirecionamento automático
  useAuthRedirect()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Filtrar bolões onde o usuário participa
  const meusBoloes = boloes.filter(bolao => 
    bolao.participantes?.some(p => p.id === user?.id)
  )

  if (!user) {
    return null // ou um loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Premium com Glassmorphism */}
      <FadeIn direction="down">
        <header className="bg-card/30 backdrop-blur-xl border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="bg-card p-3 rounded-full gradient-primary">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Palpiteiros
                  </h1>
                  <p className="text-muted-foreground font-medium">Olá, {user.name}! 👋</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ScaleOnHover scale={1.05}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="border-border text-muted-foreground hover:bg-destructive/20 hover:border-destructive hover:text-destructive transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </ScaleOnHover>
              </div>
            </div>
          </div>
        </header>
      </FadeIn>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Stats com Gradientes Premium */}
          <FadeIn delay={0.1}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold gradient-text mb-2">
                Seu Dashboard
              </h2>
              <p className="text-muted-foreground text-lg">Acompanhe seu desempenho e gerencie seus bolões</p>
            </div>
          </FadeIn>

          {/* Estatísticas Premium com Animações */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScaleOnHover scale={1.05}>
                <Card className="bg-card/80 border-border backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Bolões</CardTitle>
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {statsLoading ? (
                      <div className="h-8 bg-muted/50 rounded animate-pulse" />
                    ) : (
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.totalBoloes}</div>
                    )}
                    <p className="text-accent text-sm font-medium">+12% este mês</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>

              <ScaleOnHover scale={1.05}>
                <Card className="bg-card/80 border-border backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total de Palpites</CardTitle>
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {statsLoading ? (
                      <div className="h-8 bg-muted/50 rounded animate-pulse" />
                    ) : (
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.totalPalpites}</div>
                    )}
                    <p className="text-accent text-sm font-medium">Todos enviados</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>

              <ScaleOnHover scale={1.05}>
                <Card className="bg-card/80 border-border backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Aproveitamento</CardTitle>
                    <div className="p-2 bg-primary/20 rounded-full">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {statsLoading ? (
                      <div className="h-8 bg-muted/50 rounded animate-pulse" />
                    ) : (
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.aproveitamento}%</div>
                    )}
                    <p className="text-accent text-sm font-medium">Acima da média</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>

              <ScaleOnHover scale={1.05}>
                <Card className="bg-card/80 border-border backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Melhor Posição</CardTitle>
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {statsLoading ? (
                      <div className="h-8 bg-muted/50 rounded animate-pulse" />
                    ) : (
                      <div className="text-3xl font-bold text-foreground mb-1">{stats.melhorColocacao || '-'}º</div>
                    )}
                    <p className="text-accent text-sm font-medium">🏆 Top performer</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </div>
          </FadeIn>

          {/* Ações Rápidas Premium */}
          <FadeIn delay={0.3}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Ações Rápidas</h3>
              <p className="text-muted-foreground">Tudo que você precisa em um clique</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/criar-bolao">
                <ScaleOnHover scale={1.08}>
                  <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/50 hover:border-blue-400/70 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="flex items-center justify-center p-8 relative z-10">
                      <div className="text-center">
                        <div className="mb-4 p-3 bg-white/10 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Plus className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-semibold text-lg">Criar Bolão</p>
                        <p className="text-accent text-sm mt-1">Organize seu campeonato</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </Link>

              <Link href="/entrar-bolao">
                <ScaleOnHover scale={1.08}>
                  <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500/50 hover:border-green-400/70 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="flex items-center justify-center p-8 relative z-10">
                      <div className="text-center">
                        <div className="mb-4 p-3 bg-white/10 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Hash className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-semibold text-lg">Entrar no Bolão</p>
                        <p className="text-accent text-sm mt-1">Use um código de convite</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </Link>

              <Link href="/estatisticas">
                <ScaleOnHover scale={1.08}>
                  <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500/50 hover:border-purple-400/70 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="flex items-center justify-center p-8 relative z-10">
                      <div className="text-center">
                        <div className="mb-4 p-3 bg-white/10 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                          <BarChart3 className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-semibold text-lg">Estatísticas</p>
                        <p className="text-purple-100 text-sm mt-1">Análise detalhada</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </Link>

              <Link href="/perfil">
                <ScaleOnHover scale={1.08}>
                  <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-orange-500/50 hover:border-orange-400/70 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="flex items-center justify-center p-8 relative z-10">
                      <div className="text-center">
                        <div className="mb-4 p-3 bg-white/10 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-semibold text-lg">Perfil</p>
                        <p className="text-orange-100 text-sm mt-1">Configurações pessoais</p>
                      </div>
                    </CardContent>
                  </Card>
                </ScaleOnHover>
              </Link>
            </div>
          </FadeIn>

          {/* Lista de Bolões Premium */}
          <FadeIn delay={0.4}>
            <Card className="bg-card/80 backdrop-blur-sm border-border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      Meus Bolões
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-lg mt-1">
                      Gerencie seus bolões e acompanhe seu desempenho em tempo real
                    </CardDescription>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{meusBoloes.length} bolão{meusBoloes.length !== 1 ? 's' : ''} ativo{meusBoloes.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <BoloesListSkeleton />
                ) : meusBoloes.length === 0 ? (
                  <EmptyBoloesList />
                ) : (
                  <div className="space-y-6">
                    {meusBoloes.map((bolao, index) => {
                      const participante = bolao.participantes?.find(p => p.id === user?.id)
                      
                      return (
                        <FadeIn key={bolao.id} delay={0.5 + index * 0.1}>
                          <ScaleOnHover scale={1.02}>
                            <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-gray-600/50 hover:border-gray-500/70 transition-all duration-300 group relative overflow-hidden">
                              {/* Background Gradient Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              
                              <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                      <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-50"></div>
                                        <div className="relative bg-card p-3 rounded-lg">
                                          <Trophy className="h-6 w-6 text-yellow-400" />
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                          {bolao.nome}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-full font-medium">
                                            {bolao.status}
                                          </span>
                                          {participante?.posicao && participante.posicao <= 3 && (
                                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-bold flex items-center gap-1">
                                              <Crown className="h-3 w-3" />
                                              Top {participante.posicao}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                      <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                          <Users className="h-4 w-4 text-primary" />
                                          <span className="text-muted-foreground text-sm">Participantes</span>
                                        </div>
                                        <p className="text-foreground font-bold text-lg">
                                          {bolao.participantes?.length || 0}
                                        </p>
                                      </div>
                                      
                                      <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                          <Award className="h-4 w-4 text-primary" />
                                          <span className="text-muted-foreground text-sm">Posição</span>
                                        </div>
                                        <p className="text-foreground font-bold text-lg">
                                          {participante?.posicao || '-'}º
                                        </p>
                                      </div>
                                      
                                      <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                          <Target className="h-4 w-4 text-primary" />
                                          <span className="text-muted-foreground text-sm">Pontos</span>
                                        </div>
                                        <p className="text-foreground font-bold text-lg">
                                          {participante?.pontos || 0}
                                        </p>
                                      </div>
                                      
                                      <div className="text-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                          <TrendingUp className="h-4 w-4 text-primary" />
                                          <span className="text-muted-foreground text-sm">Taxa</span>
                                        </div>
                                        <p className="text-foreground font-bold text-lg">
                                          {participante && participante.totalPalpites > 0 
                                            ? Math.round((participante.palpitesCorretos / participante.totalPalpites) * 100)
                                            : 0
                                          }%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col gap-3 ml-6">
                                    <Link href={`/bolao/${bolao.id}/palpites`}>
                                      <ScaleOnHover scale={1.05}>
                                        <Button 
                                          size="lg" 
                                          className="gradient-primary text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                          <Target className="h-5 w-5 mr-2" />
                                          Palpitar
                                        </Button>
                                      </ScaleOnHover>
                                    </Link>
                                    
                                    <Link href={`/bolao/${bolao.id}`}>
                                      <ScaleOnHover scale={1.05}>
                                        <Button 
                                          variant="outline" 
                                          size="lg" 
                                          className="border-border text-muted-foreground hover:bg-accent/50 hover:border-accent transition-all duration-300 px-6 py-3"
                                        >
                                          <ChevronRight className="h-5 w-5" />
                                        </Button>
                                      </ScaleOnHover>
                                    </Link>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </ScaleOnHover>
                        </FadeIn>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Links Rápidos Premium */}
          <FadeIn delay={0.6}>
            <div className="flex justify-center">
              <Link href="/historico">
                <ScaleOnHover scale={1.05}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-border text-muted-foreground hover:bg-accent/20 hover:border-accent transition-all duration-300 px-8 py-4 text-lg"
                  >
                    <History className="h-5 w-5 mr-3" />
                    Ver Histórico Completo
                    <Zap className="h-4 w-4 ml-2 text-yellow-400" />
                  </Button>
                </ScaleOnHover>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
