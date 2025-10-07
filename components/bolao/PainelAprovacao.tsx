'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { ParticipanteComStatus } from '@/app/explorar-boloes/page'

interface PainelAprovacaoProps {
  bolaoId: string
  isAdmin: boolean
}

interface SolicitacaoPendente extends ParticipanteComStatus {
  email?: string
}

export function PainelAprovacao({ bolaoId, isAdmin }: PainelAprovacaoProps) {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoPendente[]>([])
  const [loading, setLoading] = useState(true)
  const [processando, setProcessando] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin) {
      carregarSolicitacoes()
    }
  }, [bolaoId, isAdmin])

  const carregarSolicitacoes = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bolao/${bolaoId}/solicitacoes`)
      if (response.ok) {
        const data = await response.json()
        setSolicitacoes(data.solicitacoes || [])
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    } finally {
      setLoading(false)
    }
  }

  const aprovarParticipante = async (userId: string) => {
    setProcessando(userId)
    try {
      const response = await fetch(`/api/bolao/${bolaoId}/aprovar-participante`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        toast.success('Participante aprovado!', {
          description: 'O usuário já pode fazer seus palpites'
        })
        carregarSolicitacoes()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao aprovar participante')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao aprovar participante')
    } finally {
      setProcessando(null)
    }
  }

  const recusarParticipante = async (userId: string) => {
    setProcessando(userId)
    try {
      const response = await fetch(`/api/bolao/${bolaoId}/recusar-participante`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        toast.success('Participante recusado')
        carregarSolicitacoes()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao recusar participante')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao recusar participante')
    } finally {
      setProcessando(null)
    }
  }

  const bloquearParticipante = async (userId: string) => {
    setProcessando(userId)
    try {
      const response = await fetch(`/api/bolao/${bolaoId}/bloquear-participante`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        toast.success('Participante bloqueado')
        carregarSolicitacoes()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao bloquear participante')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao bloquear participante')
    } finally {
      setProcessando(null)
    }
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <Card className="border-border">
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Carregando solicitações...</p>
        </CardContent>
      </Card>
    )
  }

  const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'pendente')

  if (solicitacoesPendentes.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" />
            Solicitações de Entrada
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Gerencie quem pode participar do seu bolão
          </CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
          <p className="text-sm text-muted-foreground">
            Nenhuma solicitação pendente
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="h-5 w-5 text-primary" />
          Solicitações de Entrada
          <span className="ml-2 px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs rounded-full">
            {solicitacoesPendentes.length}
          </span>
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Aprove ou recuse novos participantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {solicitacoesPendentes.map((solicitacao) => (
          <div
            key={solicitacao.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
          >
            <div className="flex items-center gap-3 flex-1">
              {solicitacao.avatar ? (
                <img
                  src={solicitacao.avatar}
                  alt={solicitacao.nome}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
              )}
              
              <div className="flex-1">
                <p className="font-medium text-foreground">{solicitacao.nome}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Solicitado em {new Date(solicitacao.solicitadoEm || '').toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => aprovarParticipante(solicitacao.id)}
                disabled={processando !== null}
                className="bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20 hover:bg-green-500/20"
              >
                {processando === solicitacao.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => recusarParticipante(solicitacao.id)}
                disabled={processando !== null}
                className="bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20 hover:bg-red-500/20"
              >
                {processando === solicitacao.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Recusar
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
