'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trophy, ArrowLeft, Gift, Loader2, Plus, Target, ChevronDown, ChevronUp } from "lucide-react"
import { ParticipantSelector } from '@/components/bolao/ParticipantSelector'
import { GameManager, type Jogo } from '@/components/bolao/GameManager'
import { toast } from "sonner"

export default function CriarBolaoPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    maxParticipantes: '10',
    premio1: '',
    premio2: '',
    premio3: '',
    // Regras de Pontuação Personalizadas
    pontosPlacarExato: '3',
    pontosResultadoCerto: '5',
    pontosGolsExatos: '2',
  })
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPontuacao, setShowPontuacao] = useState(false)
  
  // Redirecionar se não autenticado
  if (status === 'unauthenticated') {
    redirect('/')
  }

  // Loading state enquanto verifica sessão
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
      toast.success('Bolão criado com sucesso!', {
        description: `${formData.nome} - ${jogos.length} jogos cadastrados`
      })
      
      // Simular criação (aqui você integraria com a API/DB)
      console.log('Dados do bolão:', {
        ...formData,
        jogos,
        criador: user
      })
      
      setTimeout(() => {
        router.push('/meus-boloes')
      }, 1500)
    } catch {
      setErrors({ general: 'Erro ao criar bolão. Tente novamente.' })
      toast.error('Erro ao criar bolão')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro do campo
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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
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
                  placeholder="Ex: Copa do Mundo 2024 - Família Silva"
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
                  placeholder="Ex: Bolão da família para os jogos da copa. Boa sorte a todos!"
                  value={formData.descricao}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={200}
                  rows={3}
                />
              </div>

              <ParticipantSelector
                value={formData.maxParticipantes}
                onChange={(value) => setFormData(prev => ({ ...prev, maxParticipantes: value }))}
                disabled={loading}
                error={errors.maxParticipantes}
              />
            </CardContent>
          </Card>

          {/* Premiação */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Gift className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                Premiação (Opcional)
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure os prêmios para os melhores colocados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="premio1" className="text-foreground">🥇 1º Lugar</Label>
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
                <Label htmlFor="premio2" className="text-foreground">🥈 2º Lugar</Label>
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
                <Label htmlFor="premio3" className="text-foreground">🥉 3º Lugar</Label>
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
            </CardContent>
          </Card>

          {/* Pontuação Personalizada */}
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
                Defina quantos pontos cada tipo de acerto vale (Padrão: 10/5/2)
              </CardDescription>
            </CardHeader>
            {showPontuacao && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pontosPlacarExato" className="text-foreground">
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
                    <Label htmlFor="pontosResultadoCerto" className="text-foreground">
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
                    <Label htmlFor="pontosGolsExatos" className="text-foreground">
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
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">💡 Sugestões:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Padrão:</strong> 10 / 5 / 2 (recomendado)</p>
                    <p><strong>Moderado:</strong> 15 / 7 / 3</p>
                    <p><strong>Agressivo:</strong> 20 / 10 / 5</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Cadastro de Jogos */}
          <GameManager
            games={jogos}
            onChange={setJogos}
            disabled={loading}
            bolaoNome={formData.nome}
          />

          {/* Erro Geral */}
          {errors.general && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {errors.general}
            </div>
          )}

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
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
