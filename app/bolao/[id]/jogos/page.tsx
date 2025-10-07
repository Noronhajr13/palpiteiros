'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar, Trophy, Target, Edit, Trash2, Shield } from "lucide-react"
import { useSession } from 'next-auth/react'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { useJogos } from '@/lib/hooks/useJogos'
import { EditarJogoModal } from '@/components/modals/EditarJogoModal'
import { ExcluirJogoModal } from '@/components/modals/ExcluirJogoModal'
import { toast } from "sonner"

interface Time {
  id: string
  nome: string
  escudo: string | null
  sigla: string
  cidade?: string | null
  estado?: string | null
}

interface Jogo {
  id: string
  timeAId?: string
  timeBId?: string
  timeA: string
  timeB: string
  data: string
  rodada: number
  status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
  placarA: number | null
  placarB: number | null
}

interface JogosPageProps {
  params: Promise<{ id: string }>
}

export default function JogosPage({ params }: JogosPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { bolaoAtual, selecionarBolao } = useBolaoStore()
  const [bolaoId, setBolaoId] = useState<string>('')
  const [times, setTimes] = useState<Time[]>([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  const [campeonatoNome, setCampeonatoNome] = useState('')
  const [novoJogo, setNovoJogo] = useState({
    timeAId: '',
    timeBId: '',
    data: '',
    rodada: 1,
    status: 'agendado',
    placarA: '',
    placarB: ''
  })

  // Estados para os modais
  const [jogoParaEditar, setJogoParaEditar] = useState<Jogo | null>(null)
  const [jogoParaExcluir, setJogoParaExcluir] = useState<Jogo | null>(null)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)

  const { jogos: jogosExistentes, loading, adicionarJogo, atualizarJogo, excluirJogo } = useJogos(bolaoId)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar')
      return
    }

    if (status === 'authenticated') {
      params.then(({ id }) => {
        console.log('🎯 Carregando página de jogos para bolão:', id)
        setBolaoId(id)
        selecionarBolao(id)
      })
    }
  }, [params, status, router, selecionarBolao])

  // Carregar times do campeonato quando bolaoAtual mudar
  useEffect(() => {
    const carregarTimes = async () => {
      if (!bolaoAtual?.campeonatoId) {
        console.log('⚠️ Bolão sem campeonato associado')
        return
      }

      setLoadingTimes(true)
      try {
        const response = await fetch(`/api/campeonatos/${bolaoAtual.campeonatoId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao carregar campeonato')
        }

        const data = await response.json()
        if (data.success && data.campeonato?.times) {
          setTimes(data.campeonato.times)
          setCampeonatoNome(data.campeonato.nome)
        }
      } catch (error) {
        toast.error('Erro ao carregar times do campeonato')
      } finally {
        setLoadingTimes(false)
      }
    }

    carregarTimes()
  }, [bolaoAtual])

  const handleAddJogo = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que os times são diferentes
    if (novoJogo.timeAId === novoJogo.timeBId) {
      toast.error('Os times devem ser diferentes!', {
        description: 'Selecione times diferentes para Time A e Time B'
      })
      return
    }

    try {
      // Buscar nomes dos times
      const timeA = times.find(t => t.id === novoJogo.timeAId)
      const timeB = times.find(t => t.id === novoJogo.timeBId)

      // Converter placares para número se existirem
      const jogoParaAdicionar = {
        timeAId: novoJogo.timeAId,
        timeBId: novoJogo.timeBId,
        timeA: timeA?.nome || novoJogo.timeAId,
        timeB: timeB?.nome || novoJogo.timeBId,
        data: novoJogo.data,
        rodada: novoJogo.rodada,
        status: novoJogo.status,
        placarA: novoJogo.placarA ? parseInt(novoJogo.placarA) : undefined,
        placarB: novoJogo.placarB ? parseInt(novoJogo.placarB) : undefined
      }
      
      await adicionarJogo(jogoParaAdicionar)
      
      toast.success('Jogo adicionado com sucesso!', {
        description: `${timeA?.nome || 'Time A'} vs ${timeB?.nome || 'Time B'}`
      })
      
      setNovoJogo({
        timeAId: '',
        timeBId: '',
        data: '',
        rodada: novoJogo.rodada,
        status: 'agendado',
        placarA: '',
        placarB: ''
      })
    } catch (error) {
      toast.error('Erro ao adicionar jogo', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }
  }

  // Funções para abrir modais
  const handleEditarJogo = (jogo: Jogo) => {
    setJogoParaEditar(jogo)
    setModalEditarAberto(true)
  }

  const handleExcluirJogo = (jogo: Jogo) => {
    setJogoParaExcluir(jogo)
    setModalExcluirAberto(true)
  }

  // Função para salvar edição
  const handleSalvarEdicao = async (jogoId: string, dadosAtualizados: Partial<Jogo>) => {
    await atualizarJogo(jogoId, dadosAtualizados)
    setModalEditarAberto(false)
    setJogoParaEditar(null)
  }

  // Função para confirmar exclusão
  const handleConfirmarExclusao = async () => {
    if (jogoParaExcluir) {
      await excluirJogo(jogoParaExcluir.id)
      setModalExcluirAberto(false)
      setJogoParaExcluir(null)
    }
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/90 backdrop-blur-sm shadow-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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
                    Gerenciar Jogos
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    {bolaoAtual?.nome || 'Carregando...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Jogos</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{jogosExistentes.length}</div>
                <p className="text-xs text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Agendados</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {jogosExistentes.filter(j => j.status === 'agendado').length}
                </div>
                <p className="text-xs text-muted-foreground">Próximos jogos</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Finalizados</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {jogosExistentes.filter(j => j.status === 'finalizado').length}
                </div>
                <p className="text-xs text-muted-foreground">Com resultados</p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Rodadas</CardTitle>
                <Trophy className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {Math.max(...jogosExistentes.map(j => j.rodada), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Atual</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/80 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Adicionar Jogo
              </CardTitle>
              <CardDescription>
                {campeonatoNome ? `Selecione os times do campeonato ${campeonatoNome}` : 'Cadastre um novo jogo manualmente'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddJogo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeA" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Time A
                    </Label>
                    {times.length > 0 ? (
                      <select
                        id="timeA"
                        value={novoJogo.timeAId}
                        onChange={(e) => setNovoJogo(prev => ({ ...prev, timeAId: e.target.value }))}
                        required
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione o time A</option>
                        {times.map((time) => (
                          <option key={time.id} value={time.id}>
                            {time.nome} ({time.sigla})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id="timeA"
                        value={novoJogo.timeAId}
                        onChange={(e) => setNovoJogo(prev => ({ ...prev, timeAId: e.target.value }))}
                        placeholder={loadingTimes ? "Carregando times..." : "ID do Time A"}
                        required
                        disabled={loadingTimes}
                        className="bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeB" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Time B
                    </Label>
                    {times.length > 0 ? (
                      <select
                        id="timeB"
                        value={novoJogo.timeBId}
                        onChange={(e) => setNovoJogo(prev => ({ ...prev, timeBId: e.target.value }))}
                        required
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione o time B</option>
                        {times.map((time) => (
                          <option key={time.id} value={time.id}>
                            {time.nome} ({time.sigla})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id="timeB"
                        value={novoJogo.timeBId}
                        onChange={(e) => setNovoJogo(prev => ({ ...prev, timeBId: e.target.value }))}
                        placeholder={loadingTimes ? "Carregando times..." : "Ex: Palmeiras"}
                        required
                        disabled={loadingTimes}
                        className="bg-input border-border text-foreground"
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data e Hora</Label>
                    <Input
                      id="data"
                      type="datetime-local"
                      value={novoJogo.data}
                      onChange={(e) => setNovoJogo(prev => ({ ...prev, data: e.target.value }))}
                      required
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rodada">Rodada</Label>
                    <Input
                      id="rodada"
                      type="number"
                      min="1"
                      value={novoJogo.rodada}
                      onChange={(e) => setNovoJogo(prev => ({ ...prev, rodada: parseInt(e.target.value) }))}
                      required
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={novoJogo.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
                        setNovoJogo(prev => ({ 
                          ...prev, 
                          status: newStatus,
                          // Limpar placares se não for finalizado
                          placarA: newStatus === 'finalizado' ? prev.placarA : '',
                          placarB: newStatus === 'finalizado' ? prev.placarB : ''
                        }))
                      }}
                      className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="agendado">Agendado</option>
                      <option value="finalizado">Finalizado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="adiado">Adiado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placarA">Placar Time A</Label>
                    <Input
                      id="placarA"
                      type="number"
                      min="0"
                      value={novoJogo.placarA}
                      onChange={(e) => setNovoJogo(prev => ({ ...prev, placarA: e.target.value }))}
                      placeholder="Ex: 2"
                      disabled={novoJogo.status !== 'finalizado'}
                      className="bg-input border-border text-foreground disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placarB">Placar Time B</Label>
                    <Input
                      id="placarB"
                      type="number"
                      min="0"
                      value={novoJogo.placarB}
                      onChange={(e) => setNovoJogo(prev => ({ ...prev, placarB: e.target.value }))}
                      placeholder="Ex: 1"
                      disabled={novoJogo.status !== 'finalizado'}
                      className="bg-input border-border text-foreground disabled:opacity-50"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="gradient-primary text-white"
                >
                  {loading ? 'Adicionando...' : 'Adicionar Jogo'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Jogos Cadastrados
                </div>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  {jogosExistentes.length} jogos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jogosExistentes.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardDescription>
                Nenhum jogo cadastrado
              </CardDescription>
              <p className="text-muted-foreground">
                Adicione jogos manualmente usando o formulário acima
              </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jogosExistentes.map((jogo, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Badge 
                          variant={jogo.status === 'finalizado' ? 'default' : 'secondary'}
                          className="min-w-[80px] justify-center"
                        >
                          Rodada {jogo.rodada}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {jogo.timeA} vs {jogo.timeB}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(jogo.data).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={jogo.status === 'finalizado' ? 'default' : 'outline'}
                        >
                          {jogo.status?.charAt(0).toUpperCase() + jogo.status?.slice(1) || 'Agendado'}
                        </Badge>
                        {jogo.status === 'finalizado' && jogo.placarA !== undefined && jogo.placarB !== undefined && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {jogo.placarA} x {jogo.placarB}
                          </Badge>
                        )}
                        
                        {/* Botões de Ação */}
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditarJogo(jogo)}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            title="Editar jogo"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExcluirJogo(jogo)}
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            title="Excluir jogo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modais */}
      <EditarJogoModal
        jogo={jogoParaEditar}
        isOpen={modalEditarAberto}
        onClose={() => {
          setModalEditarAberto(false)
          setJogoParaEditar(null)
        }}
        onSave={handleSalvarEdicao}
        loading={loading}
      />

      <ExcluirJogoModal
        jogo={jogoParaExcluir}
        isOpen={modalExcluirAberto}
        onClose={() => {
          setModalExcluirAberto(false)
          setJogoParaExcluir(null)
        }}
        onConfirm={handleConfirmarExclusao}
        loading={loading}
      />
    </div>
  )
}
