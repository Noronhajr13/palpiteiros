'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Upload, Download, Calendar, Trophy, Target, Edit, Trash2 } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { useJogos } from '@/lib/hooks/useJogos'
import { EditarJogoModal } from '@/components/modals/EditarJogoModal'
import { ExcluirJogoModal } from '@/components/modals/ExcluirJogoModal'
import { toast } from "sonner"

interface Jogo {
  id: string
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
  const { isAuthenticated } = useAuthStore()
  const { bolaoAtual } = useBolaoStore()
  const [bolaoId, setBolaoId] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [novoJogo, setNovoJogo] = useState({
    timeA: '',
    timeB: '',
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

  const { jogos: jogosExistentes, loading, adicionarJogo, atualizarJogo, excluirJogo, importarJogos } = useJogos(bolaoId)

  useEffect(() => {
    params.then(({ id }) => {
      setBolaoId(id)
    })
  }, [params])

  const handleAddJogo = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Converter placares para número se existirem
      const jogoParaAdicionar = {
        timeA: novoJogo.timeA,
        timeB: novoJogo.timeB,
        data: novoJogo.data,
        rodada: novoJogo.rodada,
        status: novoJogo.status,
        placarA: novoJogo.placarA ? parseInt(novoJogo.placarA) : undefined,
        placarB: novoJogo.placarB ? parseInt(novoJogo.placarB) : undefined
      }
      
      await adicionarJogo(jogoParaAdicionar)
      
      toast.success('Jogo adicionado com sucesso!', {
        description: `${novoJogo.timeA} vs ${novoJogo.timeB}`
      })
      
      setNovoJogo({
        timeA: '',
        timeB: '',
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      toast.success('Arquivo selecionado!', {
        description: `${file.name} - ${(file.size / 1024).toFixed(1)} KB`
      })
    }
  }

  const handleImportCsv = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo primeiro!')
      return
    }

    try {
      const text = await selectedFile.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        toast.error('Arquivo CSV deve ter pelo menos o cabeçalho e uma linha de dados')
        return
      }

      // Validar cabeçalho
      const header = lines[0].toLowerCase()
      const expectedColumns = ['time a', 'time b', 'data', 'rodada', 'status', 'placara', 'placarb']
      const hasValidHeader = expectedColumns.every(col => 
        header.includes(col.replace(' ', '')) || header.includes(col)
      )

      if (!hasValidHeader) {
        toast.error('Cabeçalho do CSV inválido. Use o template fornecido.', {
          description: 'Colunas esperadas: Time A, Time B, Data, Rodada, Status, PlacarA, PlacarB'
        })
        return
      }

      // Processar linhas de dados
      const jogosParaImportar = []
      let jogosComErro = 0

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split(',')
        if (columns.length < 4) {
          jogosComErro++
          continue
        }

        const [timeA, timeB, data, rodada, status = 'agendado', placarA = '', placarB = ''] = columns.map(col => col.trim())
        
        if (timeA && timeB && data && rodada) {
          jogosParaImportar.push({
            timeA,
            timeB,
            data,
            rodada: parseInt(rodada) || 1,
            status: status || 'agendado',
            placarA: placarA ? parseInt(placarA) : undefined,
            placarB: placarB ? parseInt(placarB) : undefined
          })
        } else {
          jogosComErro++
        }
      }

      if (jogosParaImportar.length === 0) {
        toast.error('Nenhum jogo válido encontrado no arquivo')
        return
      }

      // Importar jogos usando a API
      const result = await importarJogos(jogosParaImportar)
      
      toast.success(`${result.count} jogos importados com sucesso!`, {
        description: jogosComErro > 0 ? `${jogosComErro} linhas com erro foram ignoradas` : 'Todos os jogos foram processados'
      })
      
      // Limpar arquivo selecionado
      setSelectedFile(null)
      const fileInput = document.getElementById('csvFile') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error) {
      console.error('Erro ao processar CSV:', error)
      toast.error('Erro ao processar arquivo', {
        description: error instanceof Error ? error.message : 'Verifique se o arquivo está no formato correto'
      })
    }
  }

  const downloadTemplate = () => {
    const csvContent = "Time A,Time B,Data,Rodada,Status,PlacarA,PlacarB\n" +
                      "Flamengo,Palmeiras,2024-01-15 16:00,1,agendado,,\n" +
                      "Corinthians,São Paulo,2024-01-15 18:30,1,finalizado,2,1\n" +
                      "Santos,Vasco,2024-01-16 20:00,1,agendado,,"
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template-jogos.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Template baixado!')
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

  const handleImportBrasileirao = async () => {
    if (!bolaoId) {
      toast.error('ID do bolão não encontrado!')
      return
    }

    try {
      // Pegar valores dos inputs
      const rodadaInicioInput = document.getElementById('rodadaInicio') as HTMLInputElement
      const rodadaFimInput = document.getElementById('rodadaFim') as HTMLInputElement
      const substituirSelect = document.getElementById('substituir') as HTMLSelectElement

      const rodadaInicio = parseInt(rodadaInicioInput.value) || 1
      const rodadaFim = parseInt(rodadaFimInput.value) || 3
      const substituirExistentes = substituirSelect.value === 'true'

      if (rodadaInicio > rodadaFim) {
        toast.error('Rodada inicial deve ser menor ou igual à rodada final!')
        return
      }

      if (rodadaInicio < 1 || rodadaFim > 38) {
        toast.error('Rodadas devem estar entre 1 e 38!')
        return
      }

      toast.info('Iniciando importação do Brasileirão...')

      const response = await fetch('/api/jogos/importar-brasileirao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : ''
        },
        body: JSON.stringify({
          bolaoId,
          rodadaInicio,
          rodadaFim,
          substituirExistentes
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro na importação')
      }

      toast.success('Jogos do Brasileirão importados com sucesso!', {
        description: `Rodadas ${rodadaInicio} a ${rodadaFim} processadas`
      })

      // Recarregar jogos
      window.location.reload()

    } catch (error) {
      console.error('Erro ao importar do Brasileirão:', error)
      toast.error('Erro ao importar jogos do Brasileirão', {
        description: error instanceof Error ? error.message : 'Verifique sua conexão e tente novamente'
      })
    }
  }

  if (!isAuthenticated) {
    router.push('/entrar')
    return null
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
                Cadastre um novo jogo manualmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddJogo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeA">Time A</Label>
                    <Input
                      id="timeA"
                      value={novoJogo.timeA}
                      onChange={(e) => setNovoJogo(prev => ({ ...prev, timeA: e.target.value }))}
                      placeholder="Ex: Flamengo"
                      required
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeB">Time B</Label>
                    <Input
                      id="timeB"
                      value={novoJogo.timeB}
                      onChange={(e) => setNovoJogo(prev => ({ ...prev, timeB: e.target.value }))}
                      placeholder="Ex: Palmeiras"
                      required
                      className="bg-input border-border text-foreground"
                    />
                  </div>
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
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Importar Jogos (CSV/Excel)
              </CardTitle>
              <CardDescription>
                Importe múltiplos jogos de uma vez usando um arquivo CSV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="bg-input border-border text-foreground"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Formatos aceitos: CSV, Excel (.xlsx, .xls)
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-primary mt-1 font-medium">
                        ✓ {selectedFile.name} selecionado
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={downloadTemplate}
                    className="border-border text-muted-foreground hover:bg-accent/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Template
                  </Button>
                </div>
                
                {selectedFile && (
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleImportCsv}
                      disabled={loading}
                      className="gradient-primary text-white"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {loading ? 'Importando...' : 'Importar Jogos'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        const fileInput = document.getElementById('csvFile') as HTMLInputElement
                        if (fileInput) fileInput.value = ''
                      }}
                      className="border-border text-muted-foreground hover:bg-accent/20"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Importar do Brasileirão
              </CardTitle>
              <CardDescription>
                Extraia jogos automaticamente do site da Globo Esporte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rodadaInicio">Rodada Inicial</Label>
                    <Input
                      id="rodadaInicio"
                      type="number"
                      min="1"
                      max="38"
                      defaultValue="1"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rodadaFim">Rodada Final</Label>
                    <Input
                      id="rodadaFim"
                      type="number"
                      min="1"
                      max="38"
                      defaultValue="3"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="substituir">Substituir Existentes</Label>
                    <select
                      id="substituir"
                      className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleImportBrasileirao}
                    disabled={loading}
                    className="gradient-primary text-white"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    {loading ? 'Importando...' : 'Importar do Brasileirão'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://ge.globo.com/futebol/brasileirao-serie-a/', '_blank')}
                    className="border-border text-muted-foreground hover:bg-accent/20"
                  >
                    Ver Fonte
                  </Button>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-accent">Como funciona:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Extrai jogos diretamente do site da Globo Esporte</li>
                        <li>• Inclui datas, horários e resultados atualizados</li>
                        <li>• Times são normalizados automaticamente</li>
                        <li>• Ideal para criar bolões do Brasileirão rapidamente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum jogo cadastrado
                  </h3>
                  <p className="text-muted-foreground">
                    Adicione jogos manualmente ou importe via CSV
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
