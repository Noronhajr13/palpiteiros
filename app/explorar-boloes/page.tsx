'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ArrowLeft, 
  Trophy, 
  Users, 
  Lock, 
  Unlock,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  Globe
} from "lucide-react"
import { toast } from "sonner"
import { BolaoPublicoCard } from '@/components/bolao/BolaoPublicoCard'

// Tipos
export interface ParticipanteComStatus {
  id: string
  nome: string
  avatar?: string | null
  pontos: number
  posicao: number
  status: 'pendente' | 'aprovado' | 'bloqueado' | 'recusado'
  solicitadoEm?: string
  aprovadoEm?: string
}

export interface BolaoPublico {
  id: string
  nome: string
  descricao: string
  codigo: string
  admin: string
  adminNome: string
  maxParticipantes: number
  participantes: ParticipanteComStatus[]
  totalJogos: number
  status: 'ativo' | 'finalizado' | 'pausado'
  tipoAcesso: 'publico' | 'privado' | 'codigo'
  criadoEm: string
  premios?: {
    primeiro?: string
    segundo?: string
    terceiro?: string
  }
}

export default function ExplorarBoloesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [boloes, setBoloes] = useState<BolaoPublico[]>([])
  const [boloesExibidos, setBoloesExibidos] = useState<BolaoPublico[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroAcesso, setFiltroAcesso] = useState<'todos' | 'publico' | 'codigo'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'finalizado'>('ativo')

  const user = session?.user

  // Carregar bolões disponíveis
  useEffect(() => {
    if (user) {
      carregarBoloes()
    }
  }, [user])

  // Aplicar filtros
  useEffect(() => {
    let resultado = boloes

    // Filtro de busca
    if (busca.trim()) {
      resultado = resultado.filter(bolao =>
        bolao.nome.toLowerCase().includes(busca.toLowerCase()) ||
        bolao.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        bolao.adminNome.toLowerCase().includes(busca.toLowerCase()) ||
        bolao.codigo.toLowerCase().includes(busca.toLowerCase())
      )
    }

    // Filtro de tipo de acesso
    if (filtroAcesso !== 'todos') {
      resultado = resultado.filter(bolao => bolao.tipoAcesso === filtroAcesso)
    }

    // Filtro de status
    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(bolao => bolao.status === filtroStatus)
    }

    setBoloesExibidos(resultado)
  }, [busca, filtroAcesso, filtroStatus, boloes])

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Usuário não autenticado</div>
      </div>
    )
  }

  const carregarBoloes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bolao/explorar')
      if (response.ok) {
        const data = await response.json()
        setBoloes(data.boloes || [])
      } else {
        toast.error('Erro ao carregar bolões')
      }
    } catch (error) {
      console.error('Erro ao carregar bolões:', error)
      toast.error('Erro ao carregar bolões')
    } finally {
      setLoading(false)
    }
  }

  const solicitarEntrada = async (bolaoId: string, codigo?: string) => {
    try {
      const response = await fetch('/api/bolao/solicitar-entrada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bolaoId,
          userId: user.id,
          userName: user.name,
          userAvatar: user.image,
          codigo
        })
      })

      const data = await response.json()

      if (response.ok) {
        if (data.aprovadoAutomaticamente) {
          toast.success('Entrada aprovada!', {
            description: 'Você já pode fazer seus palpites 🎯'
          })
          router.push('/meus-boloes')
        } else {
          toast.success('Solicitação enviada!', {
            description: 'Aguarde a aprovação do administrador'
          })
          carregarBoloes()
        }
      } else {
        toast.error(data.error || 'Erro ao solicitar entrada')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao solicitar entrada')
    }
  }

  const cancelarSolicitacao = async (bolaoId: string) => {
    try {
      const response = await fetch('/api/bolao/cancelar-solicitacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bolaoId,
          userId: user.id
        })
      })

      if (response.ok) {
        toast.success('Solicitação cancelada')
        carregarBoloes()
      } else {
        toast.error('Erro ao cancelar solicitação')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao cancelar solicitação')
    }
  }

  const getStatusUsuario = (bolao: BolaoPublico): ParticipanteComStatus | null => {
    return bolao.participantes.find(p => p.id === user.id) || null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/meus-boloes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Explorar Bolões
                </h1>
                <p className="text-sm text-muted-foreground">
                  Descubra e participe de bolões públicos
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        {/* Busca e Filtros */}
        <Card className="mb-6 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Search className="h-5 w-5 text-primary" />
              Buscar Bolões
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, descrição, admin ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  <Filter className="h-4 w-4 inline mr-1" />
                  Tipo de Acesso
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filtroAcesso === 'todos' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroAcesso('todos')}
                    className="flex-1"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filtroAcesso === 'publico' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroAcesso('publico')}
                    className="flex-1"
                  >
                    <Unlock className="h-4 w-4 mr-1" />
                    Público
                  </Button>
                  <Button
                    variant={filtroAcesso === 'codigo' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroAcesso('codigo')}
                    className="flex-1"
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Com Código
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  <Trophy className="h-4 w-4 inline mr-1" />
                  Status
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={filtroStatus === 'todos' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('todos')}
                    className="flex-1"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filtroStatus === 'ativo' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('ativo')}
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Ativos
                  </Button>
                  <Button
                    variant={filtroStatus === 'finalizado' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('finalizado')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Finalizados
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Carregando bolões...</p>
          </div>
        ) : boloesExibidos.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum bolão encontrado
              </h3>
              <p className="text-muted-foreground mb-4">
                {busca.trim() 
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Não há bolões disponíveis no momento'}
              </p>
              {busca.trim() && (
                <Button variant="outline" onClick={() => setBusca('')}>
                  Limpar Busca
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {boloesExibidos.length} {boloesExibidos.length === 1 ? 'bolão encontrado' : 'bolões encontrados'}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boloesExibidos.map((bolao) => (
                <BolaoPublicoCard
                  key={bolao.id}
                  bolao={bolao}
                  statusUsuario={getStatusUsuario(bolao)}
                  onSolicitarEntrada={solicitarEntrada}
                  onCancelarSolicitacao={cancelarSolicitacao}
                  userId={user.id || ''}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
