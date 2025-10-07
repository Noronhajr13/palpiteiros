'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Trophy,
  Users,
  Calendar,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Gift,
  TrendingUp,
  Hash,
  User,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { ParticipanteComStatus, BolaoPublico } from '@/app/explorar-boloes/page'

interface BolaoPublicoCardProps {
  bolao: BolaoPublico
  statusUsuario: ParticipanteComStatus | null
  onSolicitarEntrada: (bolaoId: string, codigo?: string) => Promise<void>
  onCancelarSolicitacao: (bolaoId: string) => Promise<void>
  userId: string
}

export function BolaoPublicoCard({
  bolao,
  statusUsuario,
  onSolicitarEntrada,
  onCancelarSolicitacao,
  userId
}: BolaoPublicoCardProps) {
  const [mostrarCodigo, setMostrarCodigo] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)

  const isAdmin = bolao.admin === userId
  const participantesAprovados = bolao.participantes.filter(p => p.status === 'aprovado').length
  const isLotado = participantesAprovados >= bolao.maxParticipantes
  const isAtivo = bolao.status === 'ativo'

  const handleSolicitarEntrada = async () => {
    if (bolao.tipoAcesso === 'codigo' && !codigo.trim()) {
      return
    }

    setLoading(true)
    try {
      await onSolicitarEntrada(
        bolao.id,
        bolao.tipoAcesso === 'codigo' ? codigo.toUpperCase() : undefined
      )
      setCodigo('')
      setMostrarCodigo(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelarSolicitacao = async () => {
    setLoading(true)
    try {
      await onCancelarSolicitacao(bolao.id)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (!statusUsuario) return null

    switch (statusUsuario.status) {
      case 'aprovado':
        return (
          <div className="flex items-center gap-1 text-xs bg-green-500/10 text-green-600 dark:text-green-500 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3" />
            Participando
          </div>
        )
      case 'pendente':
        return (
          <div className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            Pendente
          </div>
        )
      case 'bloqueado':
        return (
          <div className="flex items-center gap-1 text-xs bg-red-500/10 text-red-600 dark:text-red-500 px-2 py-1 rounded-full">
            <UserX className="h-3 w-3" />
            Bloqueado
          </div>
        )
      case 'recusado':
        return (
          <div className="flex items-center gap-1 text-xs bg-gray-500/10 text-gray-600 dark:text-gray-500 px-2 py-1 rounded-full">
            <XCircle className="h-3 w-3" />
            Recusado
          </div>
        )
      default:
        return null
    }
  }

  const getAcaoButton = () => {
    // Se é admin, não mostra botão de ação
    if (isAdmin) {
      return (
        <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-2 rounded-lg">
          <UserCheck className="h-4 w-4" />
          Você é o administrador
        </div>
      )
    }

    // Se já está participando (aprovado)
    if (statusUsuario?.status === 'aprovado') {
      return (
        <div className="flex items-center gap-2 text-sm bg-green-500/10 text-green-600 dark:text-green-500 px-3 py-2 rounded-lg">
          <CheckCircle className="h-4 w-4" />
          Você participa deste bolão
        </div>
      )
    }

    // Se tem solicitação pendente
    if (statusUsuario?.status === 'pendente') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4" />
            Aguardando aprovação
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelarSolicitacao}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cancelando...
              </>
            ) : (
              'Cancelar Solicitação'
            )}
          </Button>
        </div>
      )
    }

    // Se foi bloqueado
    if (statusUsuario?.status === 'bloqueado') {
      return (
        <div className="flex items-center gap-2 text-sm bg-red-500/10 text-red-600 dark:text-red-500 px-3 py-2 rounded-lg">
          <UserX className="h-4 w-4" />
          Você foi bloqueado neste bolão
        </div>
      )
    }

    // Se foi recusado
    if (statusUsuario?.status === 'recusado') {
      return (
        <div className="flex items-center gap-2 text-sm bg-gray-500/10 text-gray-600 dark:text-gray-500 px-3 py-2 rounded-lg">
          <XCircle className="h-4 w-4" />
          Sua solicitação foi recusada
        </div>
      )
    }

    // Se o bolão está lotado
    if (isLotado) {
      return (
        <div className="flex items-center gap-2 text-sm bg-muted text-muted-foreground px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          Bolão lotado
        </div>
      )
    }

    // Se o bolão não está ativo
    if (!isAtivo) {
      return (
        <div className="flex items-center gap-2 text-sm bg-muted text-muted-foreground px-3 py-2 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          Bolão {bolao.status === 'finalizado' ? 'finalizado' : 'pausado'}
        </div>
      )
    }

    // Pode solicitar entrada
    if (bolao.tipoAcesso === 'codigo') {
      return (
        <div className="space-y-2">
          {!mostrarCodigo ? (
            <Button
              onClick={() => setMostrarCodigo(true)}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={loading}
            >
              <Lock className="h-4 w-4 mr-2" />
              Entrar com Código
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-foreground">
                  Código de Acesso
                </Label>
                <Input
                  id="codigo"
                  placeholder="Digite o código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  maxLength={8}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMostrarCodigo(false)
                    setCodigo('')
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSolicitarEntrada}
                  disabled={!codigo.trim() || loading}
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Confirmar'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )
    }

    // Bolão público - entrada direta com aprovação
    return (
      <Button
        onClick={handleSolicitarEntrada}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Solicitando...
          </>
        ) : (
          <>
            <Unlock className="h-4 w-4 mr-2" />
            Solicitar Entrada
          </>
        )}
      </Button>
    )
  }

  return (
    <Card className="border-border hover:border-primary/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <div className="flex items-center gap-2 flex-wrap">
              {bolao.tipoAcesso === 'publico' ? (
                <Unlock className="h-4 w-4 text-green-500" />
              ) : (
                <Lock className="h-4 w-4 text-yellow-500" />
              )}
              {getStatusBadge()}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            bolao.status === 'ativo'
              ? 'bg-green-500/10 text-green-600 dark:text-green-500'
              : bolao.status === 'finalizado'
              ? 'bg-gray-500/10 text-gray-600 dark:text-gray-500'
              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
          }`}>
            {bolao.status === 'ativo' ? 'Ativo' : bolao.status === 'finalizado' ? 'Finalizado' : 'Pausado'}
          </div>
        </div>
        
        <CardTitle className="text-foreground line-clamp-1">
          {bolao.nome}
        </CardTitle>
        
        <CardDescription className="text-muted-foreground line-clamp-2 min-h-[40px]">
          {bolao.descricao || 'Sem descrição'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">{bolao.adminNome}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Hash className="h-4 w-4" />
            <span className="font-mono">{bolao.codigo}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participantesAprovados}/{bolao.maxParticipantes}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{bolao.totalJogos} jogos</span>
          </div>
        </div>

        {/* Prêmios */}
        {bolao.premios && (bolao.premios.primeiro || bolao.premios.segundo || bolao.premios.terceiro) && (
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Gift className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
              Premiação
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {bolao.premios.primeiro && <div>🥇 {bolao.premios.primeiro}</div>}
              {bolao.premios.segundo && <div>🥈 {bolao.premios.segundo}</div>}
              {bolao.premios.terceiro && <div>🥉 {bolao.premios.terceiro}</div>}
            </div>
          </div>
        )}

        {/* Botão de Ação */}
        {getAcaoButton()}
      </CardContent>
    </Card>
  )
}
