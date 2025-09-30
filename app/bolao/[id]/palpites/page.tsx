'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trophy, ArrowLeft, Target, Clock, CheckCircle, Loader2, Save, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore, Jogo, Palpite } from '@/lib/stores/useBolaoStoreAPI'
import { PalpitesSkeleton } from '@/components/ui/loading-skeletons'
import { EmptyPalpites } from '@/components/ui/empty-states'
import { PalpitesProgress } from '@/components/ui/progress-indicators'
import { BolaoBreadcrumbs, BreadcrumbCard } from '@/components/ui/breadcrumbs'

interface PalpitesPageProps {
  params: Promise<{
    id: string
  }>
}

interface PalpiteForm {
  [jogoId: string]: {
    placarA: string
    placarB: string
  }
}

export default function PalpitesPage({ params }: PalpitesPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { selecionarBolao, bolaoAtual, salvarPalpite } = useBolaoStore()
  const [palpitesForm, setPalpitesForm] = useState<PalpiteForm>({})
  const [salvandoPalpites, setSalvandoPalpites] = useState<Set<string>>(new Set())
  const [palpitesSalvos, setPalpitesSalvos] = useState<Set<string>>(new Set())
  const [rodadaAtual, setRodadaAtual] = useState(1)
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
    }
    
    loadData()
  }, [isAuthenticated, params, router, selecionarBolao])

  useEffect(() => {
    if (bolaoAtual && user) {
      // Carregar palpites existentes do usuário
      const palpitesExistentes: PalpiteForm = {}
      
      bolaoAtual.palpites
        .filter(palpite => palpite.userId === user.id)
        .forEach(palpite => {
          palpitesExistentes[palpite.jogoId] = {
            placarA: palpite.placarA.toString(),
            placarB: palpite.placarB.toString()
          }
        })
      
      setPalpitesForm(palpitesExistentes)
    }
  }, [bolaoAtual, user])

  const handlePalpiteChange = (jogoId: string, campo: 'placarA' | 'placarB', valor: string) => {
    // Permitir apenas números
    if (valor === '' || /^\d+$/.test(valor)) {
      setPalpitesForm(prev => ({
        ...prev,
        [jogoId]: {
          ...prev[jogoId],
          [campo]: valor
        }
      }))
    }
  }

  const salvarPalpiteIndividual = async (jogo: Jogo) => {
    const palpite = palpitesForm[jogo.id]
    
    if (!palpite || palpite.placarA === '' || palpite.placarB === '') {
      return
    }

    setSalvandoPalpites(prev => new Set(prev).add(jogo.id))

    try {
      // TODO: Implementar API de palpites quando estiver pronta
      const sucesso = await salvarPalpite()

      if (sucesso) {
        setPalpitesSalvos(prev => new Set(prev).add(jogo.id))
        setTimeout(() => {
          setPalpitesSalvos(prev => {
            const newSet = new Set(prev)
            newSet.delete(jogo.id)
            return newSet
          })
        }, 2000)
      }
    } finally {
      setSalvandoPalpites(prev => {
        const newSet = new Set(prev)
        newSet.delete(jogo.id)
        return newSet
      })
    }
  }

  const podeApostar = (jogo: Jogo) => {
    return jogo.status === 'agendado' && new Date(jogo.data) > new Date()
  }

  const getPalpiteExistente = (jogoId: string): Palpite | undefined => {
    return bolaoAtual?.palpites.find(p => p.jogoId === jogoId && p.userId === user?.id)
  }

  const calcularPontos = (jogo: Jogo, palpite: Palpite): number => {
    if (jogo.status !== 'finalizado' || !jogo.placarA !== undefined || !jogo.placarB !== undefined) {
      return 0
    }

    // Acertou o placar exato
    if (palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB) {
      return 10
    }

    // Acertou o vencedor
    const vencedorReal = jogo.placarA! > jogo.placarB! ? 'A' : jogo.placarA! < jogo.placarB! ? 'B' : 'E'
    const vencedorPalpite = palpite.placarA > palpite.placarB ? 'A' : palpite.placarA < palpite.placarB ? 'B' : 'E'
    
    if (vencedorReal === vencedorPalpite) {
      return 5
    }

    return 0
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading || !bolaoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <PalpitesSkeleton />
      </div>
    )
  }

  if (!bolaoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bolão não encontrado</h2>
            <p className="text-gray-600 mb-4">O bolão que você está procurando não existe.</p>
            <Button asChild>
              <Link href="/meus-boloes">Voltar aos Meus Bolões</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const jogosPorRodada = bolaoAtual.jogos.reduce((acc, jogo) => {
    if (!acc[jogo.rodada]) {
      acc[jogo.rodada] = []
    }
    acc[jogo.rodada].push(jogo)
    return acc
  }, {} as Record<number, Jogo[]>)

  const rodadas = Object.keys(jogosPorRodada).map(Number).sort((a, b) => a - b)
  const jogosRodadaAtual = jogosPorRodada[rodadaAtual] || []
  const totalRodadas = rodadas.length

  const navegarRodada = (direcao: 'anterior' | 'proxima') => {
    const indiceAtual = rodadas.indexOf(rodadaAtual)
    if (direcao === 'anterior' && indiceAtual > 0) {
      setRodadaAtual(rodadas[indiceAtual - 1])
    } else if (direcao === 'proxima' && indiceAtual < rodadas.length - 1) {
      setRodadaAtual(rodadas[indiceAtual + 1])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Seus Palpites
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">{bolaoAtual.nome}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbCard>
            <BolaoBreadcrumbs 
              bolaoNome={bolaoAtual.nome}
              bolaoId={bolaoAtual.id}
              currentPage="palpites"
            />
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Instruções */}
        <Card className="mb-8 bg-card/80 border border-border shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl gradient-text">
              Sistema de Pontuação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="p-4 bg-accent/80 rounded-2xl shadow-lg mb-3">
                  <div className="text-3xl font-bold text-white">10</div>
                  <div className="text-sm text-accent-foreground font-medium">PONTOS</div>
                </div>
                <div className="text-sm font-semibold text-foreground">Placar Exato</div>
                <div className="text-xs text-muted-foreground">Acertou tudo!</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="p-4 bg-primary/80 rounded-2xl shadow-lg mb-3">
                  <div className="text-3xl font-bold text-white">5</div>
                  <div className="text-sm text-primary-foreground font-medium">PONTOS</div>
                </div>
                <div className="text-sm font-semibold text-foreground">Resultado Correto</div>
                <div className="text-xs text-muted-foreground">Acertou o vencedor</div>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-200">
                <div className="p-4 bg-muted rounded-2xl shadow-lg mb-3">
                  <div className="text-3xl font-bold text-muted-foreground">0</div>
                  <div className="text-sm text-muted-foreground font-medium">PONTOS</div>
                </div>
                <div className="text-sm font-semibold text-foreground">Palpite Errado</div>
                <div className="text-xs text-muted-foreground">Mais sorte na próxima!</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progresso dos Palpites */}
        <PalpitesProgress 
          totalJogos={bolaoAtual.jogos.filter(jogo => jogo.status !== 'finalizado').length}
          palpitesFeitos={bolaoAtual.palpites.filter(p => p.userId === user?.id).length}
          className="mb-8"
        />

        {/* Navegação de Rodadas */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5 border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navegarRodada('anterior')}
                disabled={rodadas.indexOf(rodadaAtual) === 0}
                className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                Rodada Anterior
              </Button>

              <div className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🏆 Rodada {rodadaAtual}
                </CardTitle>
                <CardDescription className="font-medium mt-1">
                  {jogosRodadaAtual.length} jogo{jogosRodadaAtual.length > 1 ? 's' : ''} • {rodadas.indexOf(rodadaAtual) + 1} de {totalRodadas} rodadas
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navegarRodada('proxima')}
                disabled={rodadas.indexOf(rodadaAtual) === rodadas.length - 1}
                className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
              >
                Próxima Rodada
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Jogos da Rodada Atual */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Jogos da Rodada {rodadaAtual}
                </CardTitle>
                <CardDescription className="font-medium">
                  Faça seus palpites aqui! 🎯
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {jogosRodadaAtual.length === 0 ? (
              <EmptyPalpites />
            ) : (
              <div className="space-y-6">
                {jogosRodadaAtual.map((jogo) => {
                  const palpiteExistente = getPalpiteExistente(jogo.id)
                      const palpiteForm = palpitesForm[jogo.id] || { placarA: '', placarB: '' }
                      const podeApostarNeste = podeApostar(jogo)
                      const estaSalvando = salvandoPalpites.has(jogo.id)
                      const foiSalvo = palpitesSalvos.has(jogo.id)
                      const pontos = palpiteExistente ? calcularPontos(jogo, palpiteExistente) : 0

                      return (
                        <div key={jogo.id} className="relative border border-gray-100 rounded-2xl p-6 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
                          {/* Status Badge - Floating */}
                          <div className="absolute -top-2 -right-2">
                            {jogo.status === 'finalizado' && (
                              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                Finalizado
                              </div>
                            )}
                            {jogo.status === 'em_andamento' && (
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                Ao Vivo
                              </div>
                            )}
                            {jogo.status === 'agendado' && (
                              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                Agendado
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mb-6">
                            <div className="flex-1">
                              <div className="text-lg font-bold text-gray-900 mb-2">
                                {jogo.timeA} <span className="text-gray-400 font-normal">vs</span> {jogo.timeB}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                                <Clock className="h-4 w-4 text-blue-500" />
                                {new Date(jogo.data).toLocaleString('pt-BR')}
                              </div>
                            </div>
                            
                            {jogo.status === 'finalizado' && palpiteExistente && (
                              <div className="text-right bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                <div className="text-2xl font-bold text-green-600 mb-1">+{pontos} pts</div>
                                <div className="text-xs text-gray-600 font-medium">
                                  Resultado: <span className="font-bold">{jogo.placarA} x {jogo.placarB}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Resultado Real (se finalizado) */}
                          {jogo.status === 'finalizado' && (
                            <div className="text-center mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                              <div className="text-sm text-gray-600 mb-2 font-medium">⚽ Resultado Final</div>
                              <div className="text-2xl font-bold text-gray-800">
                                {jogo.timeA} <span className="text-green-600">{jogo.placarA}</span> 
                                <span className="text-gray-400 mx-2">×</span> 
                                <span className="text-green-600">{jogo.placarB}</span> {jogo.timeB}
                              </div>
                            </div>
                          )}

                          {/* Formulário de Palpite */}
                          <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-6 rounded-xl border border-blue-100/50">
                            <div className="text-center mb-4">
                              <h3 className="text-sm font-semibold text-gray-700 mb-1">Seu Palpite</h3>
                              <div className="text-xs text-gray-500">Digite o placar que você acredita</div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-6">
                              <div className="flex-1 text-center">
                                <div className="text-sm font-bold text-gray-800 mb-3 p-2 bg-white rounded-lg border">
                                  {jogo.timeA}
                                </div>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  value={palpiteForm.placarA}
                                  onChange={(e) => handlePalpiteChange(jogo.id, 'placarA', e.target.value)}
                                  className="w-20 h-16 text-center text-2xl font-bold mx-auto border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all rounded-xl shadow-lg"
                                  disabled={!podeApostarNeste || estaSalvando}
                                  placeholder="0"
                                  maxLength={2}
                                />
                              </div>

                              <div className="text-3xl font-bold text-gray-400 animate-pulse">×</div>

                              <div className="flex-1 text-center">
                                <div className="text-sm font-bold text-gray-800 mb-3 p-2 bg-white rounded-lg border">
                                  {jogo.timeB}
                                </div>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  value={palpiteForm.placarB}
                                  onChange={(e) => handlePalpiteChange(jogo.id, 'placarB', e.target.value)}
                                  className="w-20 h-16 text-center text-2xl font-bold mx-auto border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all rounded-xl shadow-lg"
                                  disabled={!podeApostarNeste || estaSalvando}
                                  placeholder="0"
                                  maxLength={2}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Botão Salvar / Status */}
                          <div className="mt-6 text-center">
                            {podeApostarNeste ? (
                              <Button
                                onClick={() => salvarPalpiteIndividual(jogo)}
                                disabled={
                                  estaSalvando || 
                                  !palpiteForm.placarA || 
                                  !palpiteForm.placarB ||
                                  palpiteForm.placarA === '' || 
                                  palpiteForm.placarB === ''
                                }
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                              >
                                {estaSalvando ? (
                                  <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Salvando Palpite...
                                  </>
                                ) : foiSalvo ? (
                                  <>
                                    <CheckCircle className="mr-2 h-5 w-5" />
                                    Palpite Salvo! ✨
                                  </>
                                ) : (
                                  <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Confirmar Palpite 🎯
                                  </>
                                )}
                              </Button>
                            ) : (
                              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                {jogo.status === 'finalizado' ? (
                                  palpiteExistente ? (
                                    <div className="text-green-700 font-semibold">
                                      ✅ Seu palpite: <span className="text-green-800 font-bold">{palpiteExistente.placarA} × {palpiteExistente.placarB}</span>
                                    </div>
                                  ) : (
                                    <div className="text-gray-600">
                                      😔 Você não fez palpite para este jogo
                                    </div>
                                  )
                                ) : (
                                  <div className="text-orange-700 font-semibold">
                                    ⏰ Prazo para palpitar encerrado
                                  </div>
                                )}
                              </div>
                            )}
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