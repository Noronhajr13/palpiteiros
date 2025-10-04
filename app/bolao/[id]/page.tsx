'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Calendar, Target, TrendingUp, ArrowLeft, Share2 } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useBolaoStoreDB as useBolaoStore } from '@/lib/stores/useBolaoStoreAPI'

interface BolaoPageProps {
  params: Promise<{ id: string }>
}

export default function BolaoPage({ params }: BolaoPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { selecionarBolao, bolaoAtual } = useBolaoStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/entrar')
      return
    }

    const loadData = async () => {
      setLoading(true)
      const { id } = await params
      selecionarBolao(id)
      await new Promise(resolve => setTimeout(resolve, 600))
      setLoading(false)
    }
    
    loadData()
  }, [isAuthenticated, params, router, selecionarBolao])

  if (!isAuthenticated || !user || loading || !bolaoAtual) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/90 backdrop-blur-md shadow-lg border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/meus-boloes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 gradient-primary rounded-xl shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    {bolaoAtual.nome}
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {bolaoAtual.descricao}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl mb-8">
          <CardHeader className="bg-accent/10 border-b border-border">
            <CardTitle className="text-xl gradient-text">Ações Rápidas</CardTitle>
            <CardDescription className="text-muted-foreground">
              O que você quer fazer agora?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button className="w-full justify-start h-20 gradient-primary text-white" asChild>
              <Link href={`/bolao/${bolaoAtual.id}/palpites`}>
                <Target className="h-8 w-8 mr-4" />
                <div className="text-left">
                  <div className="font-bold text-lg">Fazer Palpites 🎯</div>
                  <div className="text-sm opacity-90">Dê seus palpites</div>
                </div>
              </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 border-border hover:bg-accent/20" asChild>
                <Link href={`/bolao/${bolaoAtual.id}/ranking`}>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-bold text-foreground">Ver Ranking</div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-20 border-border hover:bg-accent/20" asChild>
                <Link href={`/bolao/${bolaoAtual.id}/jogos`}>
                  <div className="text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-bold text-foreground">Gerenciar Jogos</div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-20 border-border hover:bg-accent/20">
                <div className="text-center">
                  <Share2 className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-bold text-foreground">Convidar Amigos</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
