'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, CheckCircle2, XCircle, Minus, ChevronLeft, ChevronRight } from "lucide-react"
import { useSession } from 'next-auth/react'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'

interface BolaoPageProps {
  params: Promise<{ id: string }>
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

  const calcularEstatisticas = () => {
    const total = palpites.length
    const realizados = palpites.filter(p => p.jogo.status === 'finalizado').length
    const acertos = palpites.filter(p => p.acertou).length
    const pendentes = palpites.filter(p => p.jogo.status !== 'finalizado').length

    return { total, realizados, acertos, pendentes }
  }

  const stats = calcularEstatisticas()

  const getResultadoIcon = (palpite: Palpite) => {
    if (palpite.jogo.status !== 'finalizado') {
      return <Minus className="h-5 w-5 text-muted-foreground" />
    }
    
    if (palpite.acertou) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }
    
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getResultadoBadge = (palpite: Palpite) => {
    if (palpite.jogo.status !== 'finalizado') {
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">Pendente</Badge>
    }
    
    if (palpite.acertou) {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/50">Acertou</Badge>
    }
    
    return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/50">Errou</Badge>
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

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Acertos</p>
                <p className="text-3xl font-bold text-green-500">{stats.acertos}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Realizados</p>
                <p className="text-3xl font-bold text-purple-500">{stats.realizados}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.pendentes}</p>
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
            {palpites.map((palpite) => (
              <Card
                key={palpite.id}
                className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* Time A */}
                    <div className="flex-1 text-right">
                      <p className="font-bold text-lg mb-2">{palpite.jogo.timeA}</p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-muted-foreground">Seu palpite:</span>
                        <Badge variant="outline" className="text-lg font-bold">
                          {palpite.placarA}
                        </Badge>
                      </div>
                      {palpite.jogo.status === 'finalizado' && (
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <span className="text-sm text-muted-foreground">Resultado:</span>
                          <Badge className="text-lg font-bold bg-primary/10 text-primary">
                            {palpite.jogo.placarA}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* VS e Ícone */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-full bg-accent/20">
                        {getResultadoIcon(palpite)}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">VS</span>
                      {palpite.pontos !== undefined && palpite.pontos > 0 && (
                        <Badge className="gradient-primary text-white">
                          +{palpite.pontos} pts
                        </Badge>
                      )}
                    </div>

                    {/* Time B */}
                    <div className="flex-1 text-left">
                      <p className="font-bold text-lg mb-2">{palpite.jogo.timeB}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-lg font-bold">
                          {palpite.placarB}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Seu palpite</span>
                      </div>
                      {palpite.jogo.status === 'finalizado' && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="text-lg font-bold bg-primary/10 text-primary">
                            {palpite.jogo.placarB}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Resultado</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="hidden md:block">
                      {getResultadoBadge(palpite)}
                    </div>
                  </div>

                  {/* Status Mobile */}
                  <div className="md:hidden mt-4 flex justify-center">
                    {getResultadoBadge(palpite)}
                  </div>

                  {/* Data do Jogo */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      {new Date(palpite.jogo.data).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
