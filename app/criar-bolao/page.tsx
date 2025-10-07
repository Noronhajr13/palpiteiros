'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trophy, ArrowLeft, Gift, Loader2, Target, ChevronDown, ChevronUp, Globe, Zap } from "lucide-react"
import { ParticipantSelector } from '@/components/bolao/ParticipantSelector'
import { toast } from "sonner"

interface Campeonato {
  id: string
  nome: string
  pais: string
  logo?: string
  participantes: Array<{
    timeId: string
    nome: string
    sigla: string
    escudo?: string
  }>
}

export default function CriarBolaoPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [loadingCampeonatos, setLoadingCampeonatos] = useState(true)
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    campeonatoId: '',
    maxParticipantes: '20',
    
    tipoPremiacaoTurno: false,
    tipoPremiacaoGeral: true,
    premioTurno1: '',
    premioTurno2: '',
    premioGeral1: '',
    premioGeral2: '',
    premioGeral3: '',
    
    modalidadeFaseGrupos: false,
    modalidadeMataMata: false,
    
    pontosPlacarExato: '5',
    pontosResultadoCerto: '3',
    pontosGolsExatos: '1',
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPontuacao, setShowPontuacao] = useState(false)
  const [showPremiacao, setShowPremiacao] = useState(true)
  const [showModalidade, setShowModalidade] = useState(false)
  
  if (status === 'unauthenticated') {
    redirect('/')
  }

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await fetch('/api/campeonatos')
        const data = await response.json()
        
        if (data.success) {
          setCampeonatos(data.campeonatos || [])
        }
      } catch (error) {
        console.error('Erro ao carregar campeonatos:', error)
        toast.error('Erro ao carregar campeonatos')
      } finally {
        setLoadingCampeonatos(false)
      }
    }

    if (status === 'authenticated') {
      fetchCampeonatos()
    }
  }, [status])

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

  const user = session?.user
  if (!user) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do bolão é obrigatório'
    }

    if (!formData.campeonatoId) {
      newErrors.campeonatoId = 'Selecione um campeonato'
    }

    const maxParticipantes = parseInt(formData.maxParticipantes)
    if (isNaN(maxParticipantes) || maxParticipantes < 2) {
      newErrors.maxParticipantes = 'Mínimo 2 participantes'
    } else if (maxParticipantes > 100) {
      newErrors.maxParticipantes = 'Máximo 100 participantes'
    }

    const pontosPlacarExato = parseInt(formData.pontosPlacarExato)
    if (isNaN(pontosPlacarExato) || pontosPlacarExato < 0 || pontosPlacarExato > 50) {
      newErrors.pontosPlacarExato = 'Entre 0 e 50 pontos'
    }

    const pontosResultadoCerto = parseInt(formData.pontosResultadoCerto)
    if (isNaN(pontosResultadoCerto) || pontosResultadoCerto < 0 || pontosResultadoCerto > 25) {
      newErrors.pontosResultadoCerto = 'Entre 0 e 25 pontos'
    }

    const pontosGolsExatos = parseInt(formData.pontosGolsExatos)
    if (isNaN(pontosGolsExatos) || pontosGolsExatos < 0 || pontosGolsExatos > 10) {
      newErrors.pontosGolsExatos = 'Entre 0 e 10 pontos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bolao/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          descricao: formData.descricao,
          campeonatoId: formData.campeonatoId,
          maxParticipantes: parseInt(formData.maxParticipantes),
          adminId: user.id,
          
          premiacao: {
            porTurno: formData.tipoPremiacaoTurno,
            porGeral: formData.tipoPremiacaoGeral,
            turno1: formData.premioTurno1 || null,
            turno2: formData.premioTurno2 || null,
            geral1: formData.premioGeral1 || null,
            geral2: formData.premioGeral2 || null,
            geral3: formData.premioGeral3 || null,
          },
          
          modalidade: {
            faseGrupos: formData.modalidadeFaseGrupos,
            mataMata: formData.modalidadeMataMata,
          },
          
          configuracoesPontuacao: {
            placarExato: parseInt(formData.pontosPlacarExato),
            resultadoCerto: parseInt(formData.pontosResultadoCerto),
            golsExatos: parseInt(formData.pontosGolsExatos),
          },
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao criar bolão')
      }

      toast.success('Bolão criado com sucesso!', {
        description: `Agora cadastre os jogos do ${formData.nome}`
      })

      router.push(`/bolao/${data.bolao.id}/jogos`)
      
    } catch (error) {
      console.error('Erro ao criar bolão:', error)
      setErrors({ general: error instanceof Error ? error.message : 'Erro ao criar bolão. Tente novamente.' })
      toast.error('Erro ao criar bolão')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const campeonatoSelecionado = campeonatos.find(c => c.id === formData.campeonatoId)

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/meus-boloes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Criar Novo Bolão</h1>
                <p className="text-sm text-muted-foreground">Configure seu bolão personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure as informações principais do seu bolão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-foreground font-medium">Nome do Bolão *</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex: Brasileirão 2025 - Galera do Trabalho"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={100}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-foreground font-medium">Descrição (Opcional)</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Ex: Bolão dos amigos do escritório. Boa sorte!"
                  value={formData.descricao}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={200}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campeonatoId" className="text-foreground font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Campeonato *
                </Label>
                <select
                  id="campeonatoId"
                  name="campeonatoId"
                  value={formData.campeonatoId}
                  onChange={handleChange}
                  disabled={loading || loadingCampeonatos}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {loadingCampeonatos ? 'Carregando campeonatos...' : 'Selecione um campeonato'}
                  </option>
                  {campeonatos.map((campeonato) => (
                    <option key={campeonato.id} value={campeonato.id}>
                      {campeonato.nome} - {campeonato.pais} ({campeonato.participantes?.length || 0} times)
                    </option>
                  ))}
                </select>
                {errors.campeonatoId && (
                  <p className="text-sm text-destructive">{errors.campeonatoId}</p>
                )}
                {campeonatoSelecionado && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ✓ {campeonatoSelecionado.participantes?.length || 0} times disponíveis para cadastro de jogos
                  </p>
                )}
              </div>

              <ParticipantSelector
                value={formData.maxParticipantes}
                onChange={(value) => setFormData(prev => ({ ...prev, maxParticipantes: value }))}
                disabled={loading}
                error={errors.maxParticipantes}
              />
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <CardTitle className="text-foreground">Premiação</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPremiacao(!showPremiacao)}
                  disabled={loading}
                >
                  {showPremiacao ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Configurar
                    </>
                  )}
                </Button>
              </div>
              <CardDescription className="text-muted-foreground">
                Configure os prêmios por turno ou por classificação geral
              </CardDescription>
            </CardHeader>
            {showPremiacao && (
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">Tipo de Premiação</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="tipoPremiacaoTurno"
                        name="tipoPremiacaoTurno"
                        checked={formData.tipoPremiacaoTurno}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="tipoPremiacaoTurno" className="text-sm text-foreground">
                        Premiação por Turno (1º e 2º turno)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="tipoPremiacaoGeral"
                        name="tipoPremiacaoGeral"
                        checked={formData.tipoPremiacaoGeral}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="tipoPremiacaoGeral" className="text-sm text-foreground">
                        Premiação Geral (Classificação final)
                      </label>
                    </div>
                  </div>
                </div>

                {formData.tipoPremiacaoTurno && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground text-sm">🏆 Premiação por Turno</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="premioTurno1" className="text-foreground text-sm">1º Turno</Label>
                        <Input
                          id="premioTurno1"
                          name="premioTurno1"
                          type="text"
                          placeholder="Ex: R$ 50"
                          value={formData.premioTurno1}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premioTurno2" className="text-foreground text-sm">2º Turno</Label>
                        <Input
                          id="premioTurno2"
                          name="premioTurno2"
                          type="text"
                          placeholder="Ex: R$ 50"
                          value={formData.premioTurno2}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.tipoPremiacaoGeral && (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground text-sm">🎖️ Premiação Geral</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="premioGeral1" className="text-foreground text-sm">🥇 1º Lugar</Label>
                        <Input
                          id="premioGeral1"
                          name="premioGeral1"
                          type="text"
                          placeholder="Ex: R$ 200, Troféu..."
                          value={formData.premioGeral1}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premioGeral2" className="text-foreground text-sm">🥈 2º Lugar</Label>
                        <Input
                          id="premioGeral2"
                          name="premioGeral2"
                          type="text"
                          placeholder="Ex: R$ 100, Medalha..."
                          value={formData.premioGeral2}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="premioGeral3" className="text-foreground text-sm">🥉 3º Lugar</Label>
                        <Input
                          id="premioGeral3"
                          name="premioGeral3"
                          type="text"
                          placeholder="Ex: R$ 50, Certificado..."
                          value={formData.premioGeral3}
                          onChange={handleChange}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">Modalidade</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModalidade(!showModalidade)}
                  disabled={loading}
                >
                  {showModalidade ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Configurar
                    </>
                  )}
                </Button>
              </div>
              <CardDescription className="text-muted-foreground">
                Para copas e torneios com fases especiais
              </CardDescription>
            </CardHeader>
            {showModalidade && (
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="modalidadeFaseGrupos"
                    name="modalidadeFaseGrupos"
                    checked={formData.modalidadeFaseGrupos}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="modalidadeFaseGrupos" className="text-sm text-foreground">
                    Fase de Grupos
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="modalidadeMataMata"
                    name="modalidadeMataMata"
                    checked={formData.modalidadeMataMata}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="modalidadeMataMata" className="text-sm text-foreground">
                    Mata-Mata (Oitavas, Quartas, Semi, Final)
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Essas opções ajudam a organizar melhor os jogos de copas e torneios eliminatórios
                </p>
              </CardContent>
            )}
          </Card>

          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">Pontuação Personalizada</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPontuacao(!showPontuacao)}
                  disabled={loading}
                >
                  {showPontuacao ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Personalizar
                    </>
                  )}
                </Button>
              </div>
              <CardDescription className="text-muted-foreground">
                Defina quantos pontos cada tipo de acerto vale (Padrão: 5/3/1)
              </CardDescription>
            </CardHeader>
            {showPontuacao && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pontosPlacarExato" className="text-foreground text-sm">
                      🎯 Placar Exato
                    </Label>
                    <Input
                      id="pontosPlacarExato"
                      name="pontosPlacarExato"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.pontosPlacarExato}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-center font-bold"
                    />
                    {errors.pontosPlacarExato && (
                      <p className="text-xs text-destructive">{errors.pontosPlacarExato}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pontosResultadoCerto" className="text-foreground text-sm">
                      ⚽ Resultado Certo
                    </Label>
                    <Input
                      id="pontosResultadoCerto"
                      name="pontosResultadoCerto"
                      type="number"
                      min="0"
                      max="25"
                      value={formData.pontosResultadoCerto}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-center font-bold"
                    />
                    {errors.pontosResultadoCerto && (
                      <p className="text-xs text-destructive">{errors.pontosResultadoCerto}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pontosGolsExatos" className="text-foreground text-sm">
                      🥅 Gols Exatos
                    </Label>
                    <Input
                      id="pontosGolsExatos"
                      name="pontosGolsExatos"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.pontosGolsExatos}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-center font-bold"
                    />
                    {errors.pontosGolsExatos && (
                      <p className="text-xs text-destructive">{errors.pontosGolsExatos}</p>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2 text-sm">💡 Sugestões:</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Padrão:</strong> 5 / 3 / 1 (recomendado)</p>
                    <p><strong>Moderado:</strong> 10 / 5 / 2</p>
                    <p><strong>Agressivo:</strong> 15 / 7 / 3</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {errors.general && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {errors.general}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>ℹ️ Próximo passo:</strong> Após criar o bolão, você será direcionado para cadastrar os jogos do campeonato selecionado.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading || loadingCampeonatos}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-4 w-4" />
                  Criar Bolão
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
