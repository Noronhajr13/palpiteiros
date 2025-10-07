'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, CheckCircle2, XCircle, Minus, ChevronLeft, ChevronRight, Trophy, TrendingUp, Activity } from "lucide-react"
import { useSession } from 'next-auth/react'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import Image from 'next/image'

interface BolaoPageProps {
  params: Promise<{ id: string }>
}

interface Time {
  id: string
  nome: string
  escudo: string | null
  sigla: string
}

interface Palpite {
  id: string
  jogoId: string
  placarA: number
  placarB: number
  pontos?: number
  acertou?: boolean
  jogo: {
    id: string
    timeA: string
    timeB: string
    timeAId?: string
    timeBId?: string
    data: Date
    rodada: number
    status: string
    placarA?: number | null
    placarB?: number | null
  }
}

export default function MeusPalpitesPage({ params }: BolaoPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { selecionarBolao, bolaoAtual } = useBolaoStore()
  const [loading, setLoading] = useState(true)
  const [palpites, setPalpites] = useState<Palpite[]>([])
  const [rodadaAtual, setRodadaAtual] = useState(1)
  const totalRodadas = 38
  const [loadingPalpites, setLoadingPalpites] = useState(false)
  const [bolaoId, setBolaoId] = useState('')
  const [times, setTimes] = useState<Record<string, Time>>({})

  // Carregar times do campeonato
  useEffect(() => {
    const carregarTimes = async () => {
      if (!bolaoAtual?.campeonatoId) return

      try {
        const response = await fetch(`/api/campeonatos/${bolaoAtual.campeonatoId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.campeonato?.times) {
            const timesMap: Record<string, Time> = {}
            data.campeonato.times.forEach((time: Time) => {
              timesMap[time.id] = time
            })
            setTimes(timesMap)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar times:', error)
      }
    }

    carregarTimes()
  }, [bolaoAtual])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar')
      return
    }

    if (status === 'authenticated') {
      const loadData = async () => {
        setLoading(true)
        const { id } = await params
        setBolaoId(id)
        selecionarBolao(id)
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      }
      
      loadData()
    }
  }, [status, params, router, selecionarBolao])

  // Carregar palpites da rodada
  useEffect(() => {
    if (!session?.user || !bolaoId || !rodadaAtual) return

    const carregarPalpites = async () => {
      setLoadingPalpites(true)
      try {
        const userId = (session.user as { _id?: string; id?: string })._id || (session.user as { _id?: string; id?: string }).id
        
        const response = await fetch(`/api/palpites?userId=${userId}&bolaoId=${bolaoId}&rodada=${rodadaAtual}`)
        
        if (response.ok) {
          const data = await response.json()
          setPalpites(data)
        }
      } catch (error) {
        console.error('Erro ao carregar palpites:', error)
      } finally {
        setLoadingPalpites(false)
      }
    }

    carregarPalpites()
  }, [session, bolaoId, rodadaAtual])

  if (status === 'loading' || loading || !bolaoAtual) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const proximaRodada = () => {
    if (rodadaAtual < totalRodadas) {
      setRodadaAtual(rodadaAtual + 1)
    }
  }

  const rodadaAnterior = () => {
    if (rodadaAtual > 1) {
      setRodadaAtual(rodadaAtual - 1)
    }
  }

  // Função para verificar se acertou o palpite
  const verificarAcerto = (palpite: Palpite): boolean => {
    if (palpite.jogo.status !== 'finalizado') return false
    if (palpite.jogo.placarA === null || palpite.jogo.placarB === null) return false
    
    // Acertou o placar exato
    return palpite.placarA === palpite.jogo.placarA && palpite.placarB === palpite.jogo.placarB
  }

  const calcularEstatisticas = () => {
    const total = palpites.length
    const realizados = palpites.filter(p => p.jogo.status === 'finalizado').length
    const acertos = palpites.filter(p => verificarAcerto(p)).length
    const pendentes = palpites.filter(p => p.jogo.status !== 'finalizado').length

    return { total, realizados, acertos, pendentes }
  }

  const stats = calcularEstatisticas()

  const getResultadoIcon = (palpite: Palpite) => {
    if (palpite.jogo.status !== 'finalizado') {
      return <Minus className="h-6 w-6 text-muted-foreground" />
    }
    
    if (verificarAcerto(palpite)) {
      return <CheckCircle2 className="h-6 w-6 text-green-500" />
    }
    
    return <XCircle className="h-6 w-6 text-red-500" />
  }

  const getResultadoBadge = (palpite: Palpite) => {
    if (palpite.jogo.status !== 'finalizado') {
      return (
        <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 font-semibold">
          <Activity className="h-3 w-3 mr-1" />
          Aguardando
        </Badge>
      )
    }
    
    if (verificarAcerto(palpite)) {
      return (
        <Badge className="bg-green-500/20 text-green-500 border-green-500/50 font-semibold">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Acertou
        </Badge>
      )
    }
    
    return (
      <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/50 font-semibold">
        <XCircle className="h-3 w-3 mr-1" />
        Errou
      </Badge>
    )
  }

  const getEscudoTime = (timeId?: string, nomeTime?: string) => {
    if (timeId && times[timeId]?.escudo) {
      return times[timeId].escudo
    }
    return null
  }

  const getSiglaTime = (timeId?: string, nomeTime?: string) => {
    if (timeId && times[timeId]?.sigla) {
      return times[timeId].sigla
    }
    // Pegar primeiras 3 letras do nome como fallback
    return nomeTime?.substring(0, 3).toUpperCase() || '???'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/90 backdrop-blur-md shadow-lg border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/bolao/${bolaoAtual.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 gradient-primary rounded-xl shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Meus Palpites
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {bolaoAtual.nome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Estatísticas Gerais - Design Moderno */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-xs text-muted-foreground mb-1 font-medium">Total Palpites</p>
                <p className="text-4xl font-black bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20 hover:border-green-500/40 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-xs text-muted-foreground mb-1 font-medium">Acertos</p>
                <p className="text-4xl font-black bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent">
                  {stats.acertos}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-xs text-muted-foreground mb-1 font-medium">Finalizados</p>
                <p className="text-4xl font-black bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent">
                  {stats.realizados}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-yellow-500/20 hover:border-yellow-500/40 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full"></div>
            <CardContent className="pt-6 relative z-10">
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-xs text-muted-foreground mb-1 font-medium">Aguardando</p>
                <p className="text-4xl font-black bg-gradient-to-br from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  {stats.pendentes}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegação de Rodadas */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={rodadaAnterior}
                disabled={rodadaAtual === 1}
                className="hover:bg-accent/20"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Anterior
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Rodada</p>
                <p className="text-4xl font-bold gradient-text">{rodadaAtual}</p>
              </div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={proximaRodada}
                disabled={rodadaAtual === totalRodadas}
                className="hover:bg-accent/20"
              >
                Próxima
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Palpites */}
        {loadingPalpites ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando palpites...</p>
            </div>
          </div>
        ) : palpites.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl">
            <CardContent className="py-12">
              <div className="text-center">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-bold mb-2">Nenhum palpite nesta rodada</h3>
                <p className="text-muted-foreground mb-6">
                  Você ainda não fez palpites para a rodada {rodadaAtual}
                </p>
                <Button className="gradient-primary text-white" asChild>
                  <Link href={`/bolao/${bolaoAtual.id}/palpites`}>
                    Fazer Palpites
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {palpites.map((palpite) => {
              const escudoTimeA = getEscudoTime(palpite.jogo.timeAId, palpite.jogo.timeA)
              const escudoTimeB = getEscudoTime(palpite.jogo.timeBId, palpite.jogo.timeB)
              const siglaTimeA = getSiglaTime(palpite.jogo.timeAId, palpite.jogo.timeA)
              const siglaTimeB = getSiglaTime(palpite.jogo.timeBId, palpite.jogo.timeB)
              const acertou = verificarAcerto(palpite)
              const finalizado = palpite.jogo.status === 'finalizado'
              
              return (
              <Card
                key={palpite.id}
                className={`group relative overflow-hidden transition-all duration-300 ${
                  finalizado 
                    ? acertou 
                      ? 'bg-gradient-to-br from-green-500/5 to-green-600/10 border-green-500/30 hover:border-green-500/50' 
                      : 'bg-gradient-to-br from-red-500/5 to-red-600/10 border-red-500/30 hover:border-red-500/50'
                    : 'bg-card/80 backdrop-blur-sm border-border hover:border-primary/30'
                } shadow-lg hover:shadow-xl`}
              >
                {/* Badge de Status no Canto */}
                <div className="absolute top-3 right-3 z-10">
                  {getResultadoBadge(palpite)}
                </div>

                <CardContent className="p-6">
                  {/* Container Principal - Layout Horizontal Moderno */}
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center">
                    
                    {/* TIME A - Lado Esquerdo */}
                    <div className="flex flex-col items-center gap-3">
                      {/* Escudo ou Sigla */}
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-primary/30 transition-colors">
                        {escudoTimeA ? (
                          <div className="relative w-16 h-16">
                            <Image
                              src={escudoTimeA}
                              alt={palpite.jogo.timeA}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-muted-foreground/50">
                            {siglaTimeA}
                          </span>
                        )}
                      </div>
                      
                      {/* Nome do Time */}
                      <p className="font-bold text-base text-center line-clamp-2 min-h-[2.5rem]">
                        {palpite.jogo.timeA}
                      </p>
                      
                      {/* Placares */}
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">Palpite</span>
                          <Badge 
                            variant="outline" 
                            className="text-2xl font-black px-4 py-2 min-w-[60px] justify-center bg-background"
                          >
                            {palpite.placarA}
                          </Badge>
                        </div>
                        
                        {finalizado && (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium">Real</span>
                            <Badge 
                              className={`text-2xl font-black px-4 py-2 min-w-[60px] justify-center ${
                                palpite.placarA === palpite.jogo.placarA
                                  ? 'bg-green-500/20 text-green-500 border-green-500/50'
                                  : 'bg-red-500/20 text-red-500 border-red-500/50'
                              }`}
                            >
                              {palpite.jogo.placarA}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DIVISOR CENTRAL - VS e Ícone */}
                    <div className="flex flex-col items-center gap-3 px-4">
                      {/* Ícone de Resultado */}
                      <div className={`p-4 rounded-2xl transition-all ${
                        finalizado
                          ? acertou
                            ? 'bg-green-500/20 ring-2 ring-green-500/30'
                            : 'bg-red-500/20 ring-2 ring-red-500/30'
                          : 'bg-muted/50'
                      }`}>
                        {getResultadoIcon(palpite)}
                      </div>
                      
                      {/* VS */}
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-black text-muted-foreground/50">VS</span>
                        {palpite.pontos !== undefined && palpite.pontos > 0 && (
                          <Badge className="gradient-primary text-white font-bold px-3 py-1">
                            <Trophy className="h-3 w-3 mr-1" />
                            {palpite.pontos}
                          </Badge>
                        )}
                      </div>

                      {/* Linha Vertical Decorativa */}
                      <div className="h-16 w-0.5 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                    </div>

                    {/* TIME B - Lado Direito */}
                    <div className="flex flex-col items-center gap-3">
                      {/* Escudo ou Sigla */}
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden border-2 border-border group-hover:border-primary/30 transition-colors">
                        {escudoTimeB ? (
                          <div className="relative w-16 h-16">
                            <Image
                              src={escudoTimeB}
                              alt={palpite.jogo.timeB}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-muted-foreground/50">
                            {siglaTimeB}
                          </span>
                        )}
                      </div>
                      
                      {/* Nome do Time */}
                      <p className="font-bold text-base text-center line-clamp-2 min-h-[2.5rem]">
                        {palpite.jogo.timeB}
                      </p>
                      
                      {/* Placares */}
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="text-2xl font-black px-4 py-2 min-w-[60px] justify-center bg-background"
                          >
                            {palpite.placarB}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-medium">Palpite</span>
                        </div>
                        
                        {finalizado && (
                          <div className="flex items-center justify-center gap-2">
                            <Badge 
                              className={`text-2xl font-black px-4 py-2 min-w-[60px] justify-center ${
                                palpite.placarB === palpite.jogo.placarB
                                  ? 'bg-green-500/20 text-green-500 border-green-500/50'
                                  : 'bg-red-500/20 text-red-500 border-red-500/50'
                              }`}
                            >
                              {palpite.jogo.placarB}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-medium">Real</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rodapé - Data e Informações */}
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">
                        {new Date(palpite.jogo.data).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(palpite.jogo.data).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {acertou && finalizado && (
                      <div className="flex items-center gap-2 text-green-500 font-semibold text-sm">
                        <TrendingUp className="h-4 w-4" />
                        <span>Placar Exato!</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
        )}
      </main>
    </div>
  )
}
