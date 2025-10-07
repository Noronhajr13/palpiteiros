'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Calendar, Trophy, Save, Check } from "lucide-react"
import { useSession } from 'next-auth/react'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { usePalpites } from '@/lib/hooks/usePalpites'
import { useJogos } from '@/lib/hooks/useJogos'
import { toast } from "sonner"

interface PalpitesPageProps {
  params: Promise<{ id: string }>
}

export default function PalpitesPage({ params }: PalpitesPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { bolaoAtual, selecionarBolao } = useBolaoStore()
  const [bolaoId, setBolaoId] = useState<string>('')
  const [palpitesForm, setPalpitesForm] = useState<{[key: string]: {placarA: string, placarB: string}}>({})
  const [salvandoPalpites, setSalvandoPalpites] = useState<Set<string>>(new Set())

  const { jogos } = useJogos(bolaoId)
  const { palpites, loading, salvarPalpite, getPalpiteJogo, estatisticas } = usePalpites(session?.user?.id || '', bolaoId)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar')
      return
    }

    if (status === 'authenticated') {
      params.then(({ id }) => {
        console.log('🎯 Carregando página de palpites para bolão:', id)
        setBolaoId(id)
        selecionarBolao(id)
      })
    }
  }, [params, status, router, selecionarBolao])

  const handleSalvarPalpite = async (jogoId: string) => {
    const palpiteForm = palpitesForm[jogoId]
    if (!palpiteForm || !palpiteForm.placarA || !palpiteForm.placarB) {
      toast.error('Preencha os dois placares!')
      return
    }

    setSalvandoPalpites(prev => new Set([...prev, jogoId]))

    try {
      await salvarPalpite({
        jogoId,
        placarA: parseInt(palpiteForm.placarA),
        placarB: parseInt(palpiteForm.placarB)
      })

      toast.success('Palpite salvo com sucesso!')
      
      // Limpar form após salvar
      setPalpitesForm(prev => {
        const newForm = { ...prev }
        delete newForm[jogoId]
        return newForm
      })
    } catch (error) {
      toast.error('Erro ao salvar palpite', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setSalvandoPalpites(prev => {
        const newSet = new Set(prev)
        newSet.delete(jogoId)
        return newSet
      })
    }
  }

  const handlePalpiteChange = (jogoId: string, campo: 'placarA' | 'placarB', valor: string) => {
    setPalpitesForm(prev => ({
      ...prev,
      [jogoId]: {
        ...prev[jogoId],
        [campo]: valor
      }
    }))
  }

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

  if (!bolaoId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando informações do bolão...</p>
        </div>
      </div>
    )
  }

  const user = session?.user
  if (!user) return null

  // Filtrar jogos disponíveis para palpite (agendados e não finalizados)
  const jogosDisponiveis = jogos.filter(jogo => 
    jogo.status === 'agendado' && new Date(jogo.data) > new Date()
  )

  // Organizar jogos por rodada
  const jogosPorRodada = jogosDisponiveis.reduce((acc, jogo) => {
    if (!acc[jogo.rodada]) {
      acc[jogo.rodada] = []
    }
    acc[jogo.rodada].push(jogo)
    return acc
  }, {} as Record<number, typeof jogosDisponiveis>)

  const rodadasOrdenadas = Object.keys(jogosPorRodada).map(Number).sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/90 backdrop-blur-sm shadow-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/bolao/${bolaoAtual?.id || ''}`}>
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
                  Fazer Palpites
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  {bolaoAtual?.nome || 'Carregando...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando jogos...</p>
          </div>
        ) : jogosDisponiveis.length === 0 ? (
          <Card className="bg-card/80 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Próximos Jogos
              </CardTitle>
              <CardDescription>
                Faça seus palpites para os jogos disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum jogo disponível para palpites
                </h3>
                <p className="text-muted-foreground">
                  {jogos.length === 0 
                    ? 'Ainda não há jogos cadastrados neste bolão'
                    : 'Todos os jogos já foram finalizados ou estão fora do prazo para palpites'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {rodadasOrdenadas.map(rodada => (
              <Card key={rodada} className="bg-card/80 border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Rodada {rodada}
                  </CardTitle>
                  <CardDescription>
                    {jogosPorRodada[rodada].length} {jogosPorRodada[rodada].length === 1 ? 'jogo disponível' : 'jogos disponíveis'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jogosPorRodada[rodada].map(jogo => {
                    const palpiteExistente = getPalpiteJogo(jogo.id)
                    const palpiteForm = palpitesForm[jogo.id] || { placarA: '', placarB: '' }
                    const isSalvando = salvandoPalpites.has(jogo.id)
                    
                    return (
                      <div key={jogo.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(jogo.data).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {palpiteExistente && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <Check className="h-3 w-3 mr-1" />
                              Palpite Registrado
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                          {/* Time A */}
                          <div className="text-right">
                            <p className="font-semibold text-lg">{jogo.timeA}</p>
                          </div>

                          {/* Placar */}
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="99"
                              className="w-16 text-center font-bold text-lg"
                              placeholder="0"
                              value={palpiteForm.placarA}
                              onChange={(e) => handlePalpiteChange(jogo.id, 'placarA', e.target.value)}
                              disabled={isSalvando}
                            />
                            <span className="text-2xl font-bold text-muted-foreground">×</span>
                            <Input
                              type="number"
                              min="0"
                              max="99"
                              className="w-16 text-center font-bold text-lg"
                              placeholder="0"
                              value={palpiteForm.placarB}
                              onChange={(e) => handlePalpiteChange(jogo.id, 'placarB', e.target.value)}
                              disabled={isSalvando}
                            />
                          </div>

                          {/* Time B */}
                          <div className="text-left">
                            <p className="font-semibold text-lg">{jogo.timeB}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => handleSalvarPalpite(jogo.id)}
                            disabled={isSalvando || (!palpiteForm.placarA && !palpiteForm.placarB)}
                            className="gap-2"
                          >
                            {isSalvando ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Salvando...
                              </>
                            ) : palpiteExistente ? (
                              <>
                                <Check className="h-4 w-4" />
                                Atualizar Palpite
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4" />
                                Salvar Palpite
                              </>
                            )}
                          </Button>
                        </div>

                        {palpiteExistente && (
                          <div className="mt-2 text-sm text-muted-foreground text-right">
                            Último palpite: {palpiteExistente.placarA} × {palpiteExistente.placarB}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
