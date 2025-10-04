'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Users, Target, TrendingUp, Medal } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'
import { useRanking } from '@/lib/hooks/useRanking'

interface RankingPageProps {
  params: Promise<{ id: string }>
}

export default function RankingPage({ params }: RankingPageProps) {
  const { user, isAuthenticated } = useAuthStore()
  const { bolaoAtual } = useBolaoStore()
  const [bolaoId, setBolaoId] = useState<string>('')

  const { ranking, loading } = useRanking(bolaoId)

  useEffect(() => {
    params.then(({ id }) => {
      setBolaoId(id)
    })
  }, [params])

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
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Ranking
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  {bolaoAtual?.nome || 'Carregando...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-card/80 border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Classificação
              </div>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {ranking.length} participantes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Carregando ranking...</p>
              </div>
            ) : ranking.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum dado disponível
                </h3>
                <p className="text-muted-foreground">
                  Aguarde os participantes fazerem seus palpites
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ranking.map((participante) => (
                  <div 
                    key={participante.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      participante.userId === user?.id 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        participante.posicao === 1 ? 'bg-yellow-500 text-white' :
                        participante.posicao === 2 ? 'bg-gray-500 text-white' :
                        participante.posicao === 3 ? 'bg-amber-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        <span className="font-bold">#{participante.posicao}</span>
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          participante.userId === user?.id ? 'text-primary' : 'text-foreground'
                        }`}>
                          {participante.nome}
                          {participante.userId === user?.id && (
                            <Badge variant="outline" className="ml-2 text-xs">Você</Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {participante.palpitesCorretos}/{participante.totalPalpites} acertos • {participante.aproveitamento}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{participante.pontos}</div>
                      <p className="text-xs text-muted-foreground">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
