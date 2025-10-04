'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Target, Calendar, Trophy, Save, Check } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { usePalpites } from '@/lib/hooks/usePalpites'
import { useJogos } from '@/lib/hooks/useJogos'
import { toast } from "sonner"

interface PalpitesPageProps {
  params: Promise<{ id: string }>
}

export default function PalpitesPage({ params }: PalpitesPageProps) {
  const { user, isAuthenticated } = useAuthStore()
  const { bolaoAtual } = useBolaoStore()
  const [bolaoId, setBolaoId] = useState<string>('')
  const [palpitesForm, setPalpitesForm] = useState<{[key: string]: {placarA: string, placarB: string}}>({})
  const [salvandoPalpites, setSalvandoPalpites] = useState<Set<string>>(new Set())

  const { jogos } = useJogos(bolaoId)
  const { palpites, loading, salvarPalpite, getPalpiteJogo, estatisticas } = usePalpites(user?.id || '', bolaoId)

  useEffect(() => {
    params.then(({ id }) => {
      setBolaoId(id)
    })
  }, [params])

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

  if (!isAuthenticated) {
    return null
  }

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
                Aguarde a disponibilização dos próximos jogos
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
