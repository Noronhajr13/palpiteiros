'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Calendar, Target, TrendingUp, ArrowLeft, Share2, Copy, CheckCircle, UserMinus } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { BolaoPageSkeleton } from '@/components/ui/loading-skeletons'
import { EmptyProximosJogos } from '@/components/ui/empty-states'
import { ShareBolaoDialog, LeaveBolaoDialog } from '@/components/ui/confirmation-dialog'
import { BolaoBreadcrumbs, BreadcrumbCard } from '@/components/ui/breadcrumbs'
import { toast } from "sonner"

interface BolaoPageProps {
  params: Promise<{
    id: string
  }>
}

export default function BolaoPage({ params }: BolaoPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { selecionarBolao, bolaoAtual } = useBolaoStore()
  const [copiado, setCopiado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [leavingBolao, setLeavingBolao] = useState(false)

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
      await new Promise(resolve => setTimeout(resolve, 600))
      setLoading(false)
    }
    
    loadData()
  }, [isAuthenticated, params, router, selecionarBolao])

  const copiarCodigo = async () => {
    if (bolaoAtual) {
      await navigator.clipboard.writeText(bolaoAtual.codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  const handleLeaveBolao = async () => {
    if (!bolaoAtual || !user) return
    
    setLeavingBolao(true)
    
    try {
      // Simular API call para sair do bolão
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Você saiu do bolão!', {
        description: 'Redirecionando para seus bolões...'
      })
      
      setTimeout(() => {
        router.push('/meus-boloes')
      }, 1000)
      
    } catch {
      toast.error('Erro ao sair do bolão', {
        description: 'Tente novamente em alguns instantes'
      })
    } finally {
      setLeavingBolao(false)
      setLeaveDialogOpen(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading || !bolaoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <BolaoPageSkeleton />
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
            <p className="text-muted-foreground mb-4">O bolão que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link href="/meus-boloes">Voltar aos Meus Bolões</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const meuParticipante = bolaoAtual.participantes.find(p => p.id === user.id)
  const jogosProximos = bolaoAtual.jogos
    .filter(jogo => jogo.status === 'agendado')
    .slice(0, 3)
  const jogosFinalizados = bolaoAtual.jogos
    .filter(jogo => jogo.status === 'finalizado')
    .length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-md shadow-lg border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-accent/20 transition-colors">
                <Link href="/meus-boloes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 gradient-primary rounded-xl shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    {bolaoAtual.nome}
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium mt-1">{bolaoAtual.descricao}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right bg-card/80 p-4 rounded-xl border border-border">
                <div className="text-lg font-bold text-blue-600">#{bolaoAtual.codigo}</div>
                <div className="text-xs text-gray-600 font-medium">
                  {bolaoAtual.participantes.length}/{bolaoAtual.maxParticipantes} participantes
                </div>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={copiarCodigo}
                className={`gap-2 transition-all duration-300 ${
                  copiado 
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                    : 'border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                {copiado ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                {copiado ? 'Copiado! ✨' : 'Copiar Código'}
              </Button>
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
              currentPage="overview"
            />
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats do Usuário */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Minha Posição</CardTitle>
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg">
                <Trophy className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent">
                {meuParticipante?.posicao || '-'}º
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">
                de {bolaoAtual.participantes.length} participantes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Meus Pontos</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                {meuParticipante?.pontos || 0}
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {meuParticipante?.palpitesCorretos || 0} acertos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Jogos Finalizados</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">{jogosFinalizados}</div>
              <p className="text-xs text-gray-600 font-medium mt-1">
                de {bolaoAtual.jogos.length} jogos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Aproveitamento</CardTitle>
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">
                {meuParticipante?.totalPalpites 
                  ? Math.round((meuParticipante.palpitesCorretos / meuParticipante.totalPalpites) * 100)
                  : 0
                }%
              </div>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {meuParticipante?.totalPalpites || 0} palpites
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ações Principais */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ações Rápidas
                  </CardTitle>
                  <CardDescription className="font-medium">
                    O que você quer fazer agora? 🏆
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Button className="w-full justify-start h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl" asChild>
                <Link href={`/bolao/${bolaoAtual.id}/palpites`}>
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <Target className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">Fazer Palpites 🎯</div>
                    <div className="text-sm text-white/90 font-medium">
                      Aposte nos próximos jogos e ganhe pontos
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start h-20 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.02] rounded-xl shadow-md hover:shadow-lg" asChild>
                <Link href={`/bolao/${bolaoAtual.id}/ranking`}>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mr-4">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-800">Ver Ranking 🏆</div>
                    <div className="text-sm text-gray-600 font-medium">
                      Classificação completa do bolão
                    </div>
                  </div>
                </Link>
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-20 border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300 transform hover:scale-[1.02] rounded-xl shadow-md hover:shadow-lg" 
                  onClick={() => setShareDialogOpen(true)}
                >
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg mr-4">
                    <Share2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-800">Convidar Amigos 📲</div>
                    <div className="text-sm text-gray-600 font-medium">
                      Compartilhe o código #{bolaoAtual.codigo}
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start h-20 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 transform hover:scale-[1.02] rounded-xl shadow-md hover:shadow-lg" 
                  onClick={() => setLeaveDialogOpen(true)}
                >
                  <div className="p-3 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg mr-4">
                    <UserMinus className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-800">Sair do Bolão 🚪</div>
                    <div className="text-sm text-gray-600 font-medium">
                      Deixar este bolão
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Jogos */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Próximos Jogos
                  </CardTitle>
                  <CardDescription className="font-medium">
                    Jogos que você pode palpitar ⚽
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {jogosProximos.length === 0 ? (
                <EmptyProximosJogos />
              ) : (
                <div className="space-y-4">
                  {jogosProximos.map((jogo) => (
                    <div key={jogo.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 mb-1">
                          ⚽ {jogo.timeA} <span className="text-gray-400 font-normal">vs</span> {jogo.timeB}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          🏆 Rodada {jogo.rodada} • {new Date(jogo.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {new Date(jogo.data).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">🕔 Horário</div>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-6 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" asChild>
                    <Link href={`/bolao/${bolaoAtual.id}/palpites`}>
                      🎯 Ver Todos os Jogos
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top 3 Ranking */}
        <Card className="mt-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-b border-yellow-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  🏆 Top 3 do Ranking
                </CardTitle>
                <CardDescription className="font-medium">
                  Os melhores palpiteiros do bolão
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {bolaoAtual.participantes
                .sort((a, b) => a.posicao - b.posicao)
                .slice(0, 3)
                .map((participante, index) => {
                  const getPodiumColors = (pos: number) => {
                    switch(pos) {
                      case 0: return 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-200'
                      case 1: return 'bg-gradient-to-r from-gray-400 to-slate-500 shadow-lg shadow-gray-200'
                      case 2: return 'bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg shadow-orange-200'
                      default: return 'bg-gradient-to-r from-blue-400 to-purple-500'
                    }
                  }
                  const getPodiumEmoji = (pos: number) => {
                    switch(pos) {
                      case 0: return '🥇'
                      case 1: return '🥈'
                      case 2: return '🥉'
                      default: return '🏅'
                    }
                  }
                  
                  return (
                    <div key={participante.id} className={`flex items-center gap-6 p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${index === 0 ? 'bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-100 border-2 border-yellow-200 shadow-xl' : index === 1 ? 'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 border-2 border-gray-200 shadow-lg' : 'bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-2 border-orange-200 shadow-lg'}`}>
                      <div className={`w-14 h-14 rounded-full ${getPodiumColors(index)} flex items-center justify-center text-white font-bold text-xl`}>
                        {getPodiumEmoji(index)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-800">{participante.nome}</div>
                        <div className="text-sm text-gray-600 font-medium mt-1">
                          🎯 {participante.palpitesCorretos} acertos de {participante.totalPalpites} palpites
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-600 to-amber-700 bg-clip-text text-transparent' :
                          index === 1 ? 'bg-gradient-to-r from-gray-600 to-slate-700 bg-clip-text text-transparent' :
                          'bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent'
                        }`}>{participante.pontos}</div>
                        <div className="text-sm text-gray-600 font-medium">pontos</div>
                      </div>
                    </div>
                  )
                })}
            </div>
            <Button variant="outline" className="w-full mt-8 border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" asChild>
              <Link href={`/bolao/${bolaoAtual.id}/ranking`}>
                🏆 Ver Ranking Completo
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      <ShareBolaoDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        bolaoNome={bolaoAtual.nome}
        codigoBolao={bolaoAtual.codigo}
      />

      <LeaveBolaoDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        bolaoNome={bolaoAtual.nome}
        onConfirm={handleLeaveBolao}
        loading={leavingBolao}
      />
    </div>
  )
}