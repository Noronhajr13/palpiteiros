'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft, Users, Gift, Loader2, Plus, Target, Medal, ChevronDown, ChevronUp } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { FormProgress } from '@/components/ui/progress-indicators'
import { ActionBreadcrumbs, BreadcrumbCard } from '@/components/ui/breadcrumbs'
import { toast } from "sonner"

export default function CriarBolaoPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { criarBolao } = useBolaoStore()
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    maxParticipantes: '20',
    premio1: '',
    premio2: '',
    premio3: '',
    // Regras de Pontuação Personalizadas
    pontosPlacarExato: '10',
    pontosResultadoCerto: '5',
    pontosGolsExatos: '2',
    // Premiação por Fases
    premioPrimeiraTurno: '',
    premioSegundoTurno: '',
    premioFaseGrupos: '',
    premioMataMataTurno: '',
    // Configurações Avançadas
    permitirPalpiteTardio: false,
    multiplicadorFinalJogo: '1',
    bonusSequencia: '0'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPremiacaoFases, setShowPremiacaoFases] = useState(false)
  
  // Calcular progresso do formulário
  const calculateFormProgress = () => {
    let completedFields = 0
    const totalFields = 8 // Campos obrigatórios + opcionais principais
    
    // Campos obrigatórios
    if (formData.nome.trim()) completedFields++
    if (formData.descricao.trim()) completedFields++
    if (formData.maxParticipantes) completedFields++
    
    // Campos opcionais
    if (formData.premio1.trim()) completedFields++
    if (formData.pontosPlacarExato) completedFields++
    if (formData.pontosResultadoCerto) completedFields++
    
    // Configurações avançadas
    if (showAdvanced) completedFields++
    if (showPremiacaoFases) completedFields++
    
    return Math.min(completedFields, totalFields)
  }

  if (!isAuthenticated) {
    router.push('/entrar')
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do bolão é obrigatório'
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória'
    }

    const maxParticipantes = parseInt(formData.maxParticipantes)
    if (isNaN(maxParticipantes) || maxParticipantes < 2) {
      newErrors.maxParticipantes = 'Mínimo 2 participantes'
    } else if (maxParticipantes > 100) {
      newErrors.maxParticipantes = 'Máximo 100 participantes'
    }

    // Validar pontuação personalizada
    const pontosPlacarExato = parseInt(formData.pontosPlacarExato)
    if (isNaN(pontosPlacarExato) || pontosPlacarExato < 0 || pontosPlacarExato > 50) {
      newErrors.pontosPlacarExato = 'Entre 0 e 50 pontos'
    }

    const pontosResultadoCerto = parseInt(formData.pontosResultadoCerto)
    if (isNaN(pontosResultadoCerto) || pontosResultadoCerto < 0 || pontosResultadoCerto > 25) {
      newErrors.pontosResultadoCerto = 'Entre 0 e 25 pontos'
    }

    const multiplicador = parseFloat(formData.multiplicadorFinalJogo)
    if (isNaN(multiplicador) || multiplicador < 1 || multiplicador > 5) {
      newErrors.multiplicadorFinalJogo = 'Entre 1.0 e 5.0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Construir objeto de premiação completo
      let premios: {
        geral?: {
          primeiro: string
          segundo?: string
          terceiro?: string
        }
        fases?: {
          primeiroTurno?: string
          segundoTurno?: string
          faseGrupos?: string
          mataMata?: string
        }
      } | undefined = undefined
      
      if (formData.premio1.trim() || formData.premioPrimeiraTurno.trim() || formData.premioFaseGrupos.trim()) {
        premios = {
          geral: {
            primeiro: formData.premio1 || '',
            segundo: formData.premio2 || '',
            terceiro: formData.premio3 || ''
          },
          fases: {
            primeiroTurno: formData.premioPrimeiraTurno || '',
            segundoTurno: formData.premioSegundoTurno || '',
            faseGrupos: formData.premioFaseGrupos || '',
            mataMata: formData.premioMataMataTurno || ''
          }
        }
      }

      // Configurações avançadas de pontuação
      const configuracoesPontuacao = {
        placarExato: parseInt(formData.pontosPlacarExato),
        resultadoCerto: parseInt(formData.pontosResultadoCerto),
        golsExatos: parseInt(formData.pontosGolsExatos),
        multiplicadorFinal: parseFloat(formData.multiplicadorFinalJogo),
        bonusSequencia: parseInt(formData.bonusSequencia),
        permitePalpiteTardio: formData.permitirPalpiteTardio
      }

      const novoId = await criarBolao({
        nome: formData.nome,
        descricao: formData.descricao,
        maxParticipantes: parseInt(formData.maxParticipantes),
        premios,
        configuracoesPontuacao
      }, {
        id: user!.id,
        nome: user!.name,
        avatar: user!.avatar
      })
      
      toast.success('Bolão criado com sucesso!', {
        description: 'Agora você pode convidar seus amigos'
      })
      
      // Redirecionar para o bolão criado
      setTimeout(() => {
        router.push(`/bolao/${novoId}`)
      }, 1000)
    } catch {
      setErrors({ general: 'Erro ao criar bolão. Tente novamente.' })
      toast.error('Erro ao criar bolão', {
        description: 'Tente novamente em alguns instantes'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbCard>
            <ActionBreadcrumbs action="criar-bolao" />
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <FormProgress 
            totalSteps={8}
            currentStep={calculateFormProgress()}
            stepTitles={["Informações", "Premiação", "Avançado"]}
            className="bg-card p-6 rounded-xl shadow-lg border border-border"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Configure as informações principais do seu bolão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Bolão *</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Ex: Copa do Mundo 2024 - Família Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={100}
                />
                {errors.nome && (
                  <p className="text-sm text-red-600">{errors.nome}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  type="text"
                  placeholder="Ex: Bolão da família para os jogos da copa"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  maxLength={200}
                />
                {errors.descricao && (
                  <p className="text-sm text-red-600">{errors.descricao}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipantes">Máximo de Participantes *</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <Input
                    id="maxParticipantes"
                    name="maxParticipantes"
                    type="number"
                    min="2"
                    max="100"
                    value={formData.maxParticipantes}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-600">pessoas</span>
                </div>
                {errors.maxParticipantes && (
                  <p className="text-sm text-red-600">{errors.maxParticipantes}</p>
                )}
                <p className="text-xs text-gray-500">
                  Entre 2 e 100 participantes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Premiação (Opcional) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-yellow-600" />
                Premiação (Opcional)
              </CardTitle>
              <CardDescription>
                Configure os prêmios para os melhores colocados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="premio1">🥇 1º Lugar</Label>
                <Input
                  id="premio1"
                  name="premio1"
                  type="text"
                  placeholder="Ex: R$ 100, Troféu, Jantar..."
                  value={formData.premio1}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="premio2">🥈 2º Lugar</Label>
                <Input
                  id="premio2"
                  name="premio2"
                  type="text"
                  placeholder="Ex: R$ 50, Medalha..."
                  value={formData.premio2}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="premio3">🥉 3º Lugar</Label>
                <Input
                  id="premio3"
                  name="premio3"
                  type="text"
                  placeholder="Ex: R$ 20, Certificado..."
                  value={formData.premio3}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <p className="text-xs text-gray-500">
                A premiação é opcional e serve apenas para motivar os participantes
              </p>
            </CardContent>
          </Card>

          {/* Premiação por Fases (Avançado) */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-blue-600" />
                  <CardTitle>Premiação por Fases (Avançado)</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPremiacaoFases(!showPremiacaoFases)}
                  disabled={loading}
                >
                  {showPremiacaoFases ? (
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
              <CardDescription>
                Configure prêmios específicos para diferentes fases do campeonato
              </CardDescription>
            </CardHeader>
            {showPremiacaoFases && (
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="premioPrimeiraTurno">🏆 Campeão 1º Turno</Label>
                    <Input
                      id="premioPrimeiraTurno"
                      name="premioPrimeiraTurno"
                      type="text"
                      placeholder="Ex: R$ 50, Medalha..."
                      value={formData.premioPrimeiraTurno}
                      onChange={handleChange}
                      disabled={loading}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premioSegundoTurno">🏆 Campeão 2º Turno</Label>
                    <Input
                      id="premioSegundoTurno"
                      name="premioSegundoTurno"
                      type="text"
                      placeholder="Ex: R$ 50, Medalha..."
                      value={formData.premioSegundoTurno}
                      onChange={handleChange}
                      disabled={loading}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premioFaseGrupos">⚽ Melhor na Fase de Grupos</Label>
                    <Input
                      id="premioFaseGrupos"
                      name="premioFaseGrupos"
                      type="text"
                      placeholder="Ex: R$ 30, Troféu..."
                      value={formData.premioFaseGrupos}
                      onChange={handleChange}
                      disabled={loading}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="premioMataMataTurno">🎯 Melhor no Mata-Mata</Label>
                    <Input
                      id="premioMataMataTurno"
                      name="premioMataMataTurno"
                      type="text"
                      placeholder="Ex: R$ 30, Certificado..."
                      value={formData.premioMataMataTurno}
                      onChange={handleChange}
                      disabled={loading}
                      maxLength={100}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Premiações por fases permitem mais engajamento durante todo o campeonato
                </p>
              </CardContent>
            )}
          </Card>

          {/* Regras de Pontuação (Avançado) */}
          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50/30 to-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <CardTitle>Regras de Pontuação (Avançado)</CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  disabled={loading}
                >
                  {showAdvanced ? (
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
              <CardDescription>
                Personalize o sistema de pontuação do seu bolão
              </CardDescription>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pontosPlacarExato" className="flex items-center gap-2">
                      🎯 Placar Exato
                      {errors.pontosPlacarExato && (
                        <span className="text-xs text-red-600">*</span>
                      )}
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
                      <p className="text-xs text-red-600">{errors.pontosPlacarExato}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pontosResultadoCerto" className="flex items-center gap-2">
                      ⚽ Resultado Certo
                      {errors.pontosResultadoCerto && (
                        <span className="text-xs text-red-600">*</span>
                      )}
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
                      <p className="text-xs text-red-600">{errors.pontosResultadoCerto}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pontosGolsExatos">🥅 Gols Exatos (Bônus)</Label>
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
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="multiplicadorFinalJogo" className="flex items-center gap-2">
                      🔥 Multiplicador Final/Decisivo
                      {errors.multiplicadorFinalJogo && (
                        <span className="text-xs text-red-600">*</span>
                      )}
                    </Label>
                    <Input
                      id="multiplicadorFinalJogo"
                      name="multiplicadorFinalJogo"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.multiplicadorFinalJogo}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-center font-bold"
                    />
                    {errors.multiplicadorFinalJogo && (
                      <p className="text-xs text-red-600">{errors.multiplicadorFinalJogo}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Ex: 2x pontos em finais
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bonusSequencia">🎊 Bônus Sequência</Label>
                    <Input
                      id="bonusSequencia"
                      name="bonusSequencia"
                      type="number"
                      min="0"
                      max="20"
                      value={formData.bonusSequencia}
                      onChange={handleChange}
                      disabled={loading}
                      className="text-center font-bold"
                    />
                    <p className="text-xs text-gray-500">
                      Pontos extra por acertos seguidos
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      id="permitirPalpiteTardio"
                      name="permitirPalpiteTardio"
                      type="checkbox"
                      checked={formData.permitirPalpiteTardio}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="permitirPalpiteTardio" className="text-sm">
                      ⏰ Permitir palpites até o início do jogo (não recomendado)
                    </Label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Exemplos de Configuração:</h4>
                  <div className="text-sm text-accent space-y-1">
                    <p><strong>Conservador:</strong> 10 / 5 / 1 / 1x / 0</p>
                    <p><strong>Moderado:</strong> 15 / 7 / 2 / 1.5x / 3</p>
                    <p><strong>Agressivo:</strong> 20 / 10 / 3 / 2x / 5</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Erro Geral */}
          {errors.general && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {errors.general}
            </div>
          )}

          {/* Botões */}
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
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Bolão
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Preview do Código */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm">ℹ️ Como Funcionará</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. Após criar o bolão, você receberá um <strong>código único</strong></p>
            <p>2. Compartilhe este código com seus amigos</p>
            <p>3. Eles poderão entrar no bolão usando este código</p>
            <p>4. Você será o <strong>administrador</strong> do bolão</p>
            <p>5. Todos poderão fazer palpites e ver o ranking em tempo real</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}