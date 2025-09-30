'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ArrowLeft, Medal, Target, TrendingUp, Crown, Award, Star } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { RankingSkeleton } from '@/components/ui/loading-skeletons'
import { BolaoBreadcrumbs, BreadcrumbCard } from '@/components/ui/breadcrumbs'

interface RankingPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RankingPage({ params }: RankingPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { selecionarBolao, bolaoAtual } = useBolaoStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/entrar')
      return
    }

    const loadData = async () => {
      setLoading(true)
      const { id } = await params
      selecionarBolao(id)
      
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1200))
      setLoading(false)
    }
    
    loadData()
  }, [isAuthenticated, params, router, selecionarBolao])

  const getPosicaoIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Crown className="h-5 w-5 text-accent" />
      case 2:
        return <Award className="h-5 w-5 text-muted-foreground" />
      case 3:
        return <Medal className="h-5 w-5 text-primary" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{posicao}</span>
    }
  }

  const getPosicaoColor = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'bg-accent/20 border-accent/50 shadow-lg'
      case 2:
        return 'bg-muted/20 border-border shadow-lg'
      case 3:
        return 'bg-primary/20 border-primary/50 shadow-lg'
      default:
        return 'bg-card border-border shadow-md hover:shadow-lg'
    }
  }

  const calcularEstatisticas = () => {
    if (!bolaoAtual) return null

    const totalJogos = bolaoAtual.jogos.filter(j => j.status === 'finalizado').length
    const totalParticipantes = bolaoAtual.participantes.length
    const mediaAcertos = totalParticipantes > 0 
      ? bolaoAtual.participantes.reduce((acc, p) => acc + p.palpitesCorretos, 0) / totalParticipantes 
      : 0

    const melhorParticipante = bolaoAtual.participantes
      .sort((a, b) => a.posicao - b.posicao)[0]

    return {
      totalJogos,
      totalParticipantes,
      mediaAcertos: Math.round(mediaAcertos * 10) / 10,
      melhorParticipante
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading || !bolaoAtual) {
    return (
      <div className="min-h-screen bg-background">
        <RankingSkeleton />
      </div>
    )
  }

  if (!bolaoAtual) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Bolão não encontrado</h2>
            <p className="text-muted-foreground mb-4">O bolão que você está procurando não existe.</p>
            <Button asChild>
              <Link href="/meus-boloes">Voltar aos Meus Bolões</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const participantesOrdenados = [...bolaoAtual.participantes].sort((a, b) => a.posicao - b.posicao)
  const minhaPosicao = participantesOrdenados.findIndex(p => p.id === user.id) + 1
  const estatisticas = calcularEstatisticas()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-md shadow-lg border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-accent/20 transition-colors">
                <Link href={`/bolao/${bolaoAtual.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 gradient-primary rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Ranking
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">{bolaoAtual.nome}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600">#{bolaoAtual.codigo}</div>
              <div className="text-xs text-gray-500">
                {bolaoAtual.participantes.length} participantes
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbCard>
            <BolaoBreadcrumbs 
              bolaoNome={bolaoAtual.nome}
              bolaoId={bolaoAtual.id}
              currentPage="ranking"
            />
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Estatísticas Gerais */}
        {estatisticas && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Jogos Finalizados</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">{estatisticas.totalJogos}</div>
                <p className="text-xs text-gray-600 font-medium">
                  de {bolaoAtual.jogos.length} jogos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Participantes</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{estatisticas.totalParticipantes}</div>
                <p className="text-xs text-gray-600 font-medium">
                  máx. {bolaoAtual.maxParticipantes}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Média de Acertos</CardTitle>
                <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">{estatisticas.mediaAcertos}</div>
                <p className="text-xs text-gray-600 font-medium">por participante</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Líder Atual</CardTitle>
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent truncate">
                  {estatisticas.melhorParticipante?.nome || '-'}
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {estatisticas.melhorParticipante?.pontos || 0} pontos
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Minha Posição Destacada */}
        {minhaPosicao > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border-0 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sua Posição Atual
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      #{minhaPosicao}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600 font-medium">Continue assim! 🎯</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {participantesOrdenados[minhaPosicao - 1]?.pontos || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">pontos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ranking Completo */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Classificação Geral
                </CardTitle>
                <CardDescription className="font-medium">
                  Ranking completo do bolão 🏆
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {participantesOrdenados.map((participante) => {
                const isCurrentUser = participante.id === user.id
                const aproveitamento = participante.totalPalpites > 0 
                  ? Math.round((participante.palpitesCorretos / participante.totalPalpites) * 100)
                  : 0

                return (
                  <div
                    key={participante.id}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                      getPosicaoColor(participante.posicao)
                    } ${isCurrentUser ? 'ring-2 ring-blue-400/50 shadow-xl scale-[1.01]' : 'hover:shadow-xl'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center justify-center w-14 h-14 relative">
                          {participante.posicao <= 3 ? (
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                              participante.posicao === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                              participante.posicao === 2 ? 'bg-gradient-to-r from-gray-400 to-slate-500' :
                              'bg-gradient-to-r from-orange-400 to-amber-500'
                            }`}>
                              {getPosicaoIcon(participante.posicao)}
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 flex items-center justify-center shadow-md">
                              <span className="text-lg font-bold text-blue-600">#{participante.posicao}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {participante.avatar && (
                            <Image
                              src={participante.avatar}
                              alt={participante.nome}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                            />
                          )}
                          <div>
                            <div className={`text-lg font-bold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                              {participante.nome}
                              {isCurrentUser && (
                                <span className="ml-3 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                                  VOCÊ 🎯
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 font-medium mt-1">
                              🎯 {participante.palpitesCorretos} acertos de {participante.totalPalpites} 
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                                aproveitamento >= 80 ? 'bg-green-100 text-green-700' :
                                aproveitamento >= 60 ? 'bg-blue-100 text-blue-700' :
                                aproveitamento >= 40 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {aproveitamento}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-4xl font-bold ${
                          participante.posicao === 1 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent' :
                          participante.posicao === 2 ? 'bg-gradient-to-r from-gray-500 to-slate-600 bg-clip-text text-transparent' :
                          participante.posicao === 3 ? 'bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent' :
                          'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'
                        }`}>
                          {participante.pontos}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">pontos</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Premiação (se existir) */}
        {bolaoAtual.premios && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Premiação
              </CardTitle>
              <CardDescription>
                Prêmios para os melhores colocados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {bolaoAtual.premios?.geral?.primeiro && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="font-bold text-yellow-800">1º Lugar</div>
                    <div className="text-sm text-yellow-700">{bolaoAtual.premios.geral.primeiro}</div>
                  </div>
                )}
                
                {bolaoAtual.premios?.geral?.segundo && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <Award className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="font-bold text-gray-800">2º Lugar</div>
                    <div className="text-sm text-gray-700">{bolaoAtual.premios.geral.segundo}</div>
                  </div>
                )}
                
                {bolaoAtual.premios?.geral?.terceiro && (
                  <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <Medal className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="font-bold text-orange-800">3º Lugar</div>
                    <div className="text-sm text-orange-700">{bolaoAtual.premios.geral.terceiro}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="mt-12 flex gap-6 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href={`/bolao/${bolaoAtual.id}/palpites`}>
              <Target className="h-5 w-5 mr-2" />
              Fazer Palpites 🎯
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="border-2 border-blue-200 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link href={`/bolao/${bolaoAtual.id}`}>
              <Trophy className="h-5 w-5 mr-2" />
              Voltar ao Bolão
            </Link>
          </Button>
        </div>
      </main>
    </div>
  )
}