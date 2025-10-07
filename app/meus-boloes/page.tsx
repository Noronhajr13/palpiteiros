'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Target, BarChart3, User, History, Star, Crown } from "lucide-react"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useBolaoStoreDB } from '@/lib/stores/useBolaoStoreAPI'
import { BoloesListSkeleton } from '@/components/ui/loading-skeletons'
import { EmptyBoloesList } from '@/components/ui/empty-states'
import { FadeIn } from '@/components/ui/animations'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { ActionCard } from '@/components/dashboard/ActionCard'
import { BolaoCard } from '@/components/dashboard/BolaoCard'

export default function MeusBoloes() {
  const { data: session, status } = useSession()
  const { boloes, loading, carregarBoloes } = useBolaoStoreDB()
  
  const user = session?.user

  // Carregar bolões quando o usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Carregando bolões para user:', user.id)
      carregarBoloes(user.id)
    }
  }, [user?.id, carregarBoloes])

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

  // Debug: Verificar estrutura dos dados
  console.log('👤 User ID da sessão:', user.id)
  console.log('📦 Total de bolões carregados:', boloes.length)
  console.log('🔍 Estrutura dos bolões:', boloes.map((b) => ({
    id: b.id,
    nome: b.nome,
    totalParticipantes: b.participantes?.length,
    participantes: b.participantes?.map((p) => ({ id: p.id, nome: p.nome }))
  })))

  // Filtrar bolões onde o usuário participa
  const meusBoloes = boloes.filter((bolao) => {
    const participa = bolao.participantes?.some((p) => {
      console.log(`🔎 Comparando participante ${p.id} com user ${user.id}`)
      return p.id === user.id
    })
    console.log(`📋 Bolão "${bolao.nome}": usuário participa? ${participa}`)
    return participa
  })
  
  console.log('✅ Meus bolões filtrados:', meusBoloes.length)

  // Calcular estatísticas
  const stats = {
    totalBoloes: meusBoloes.length,
    totalPalpites: meusBoloes.reduce((acc: number, bolao) => {
      const userParticipante = bolao.participantes.find((p) => p.id === user?.id)
      return acc + (userParticipante?.totalPalpites || 0)
    }, 0),
    aproveitamento: Math.round(meusBoloes.length > 0 ? meusBoloes.reduce((acc: number, bolao) => {
      const userParticipante = bolao.participantes.find((p) => p.id === user?.id)
      if (userParticipante && userParticipante.totalPalpites && userParticipante.totalPalpites > 0) {
        return acc + ((userParticipante.palpitesCorretos || 0) / userParticipante.totalPalpites * 100)
      }
      return acc
    }, 0) / meusBoloes.length : 0),
    melhorColocacao: meusBoloes.length > 0 ? Math.min(...meusBoloes.map((bolao) => {
      const userParticipante = bolao.participantes.find((p) => p.id === user?.id)
      return userParticipante?.posicao || 999
    }).filter((pos: number) => pos !== 999)) : null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader userName={user.name || 'Usuário'} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero */}
          <FadeIn delay={0.1}>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold gradient-text mb-2">
                Meus Bolões
              </h2>
              <p className="text-muted-foreground text-lg">Gerencie e acompanhe todos os seus bolões</p>
            </div>
          </FadeIn>

          {/* Estatísticas */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total de Bolões"
                value={stats.totalBoloes}
                subtitle="+12% este mês"
                icon={Trophy}
                loading={loading}
              />
              <StatCard
                title="Total de Palpites"
                value={stats.totalPalpites}
                subtitle="Todos enviados"
                icon={Target}
                loading={loading}
              />
              <StatCard
                title="Aproveitamento"
                value={`${stats.aproveitamento}%`}
                subtitle="Acima da média"
                icon={TrendingUp}
                loading={loading}
              />
              <StatCard
                title="Melhor Posição"
                value={stats.melhorColocacao ? `${stats.melhorColocacao}º` : '-'}
                subtitle="🏆 Top performer"
                icon={Crown}
                loading={loading}
              />
            </div>
          </FadeIn>

          {/* Ações Rápidas - Removidas criar/entrar bolão (existem em outras páginas) */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard
                href="/estatisticas"
                title="Estatísticas"
                subtitle="Análise detalhada"
                icon={BarChart3}
                variant="purple"
              />
              <ActionCard
                href="/historico"
                title="Histórico"
                subtitle="Ver histórico completo"
                icon={History}
                variant="success"
              />
              <ActionCard
                href="/perfil"
                title="Perfil"
                subtitle="Configurações pessoais"
                icon={User}
                variant="warning"
              />
            </div>
          </FadeIn>

          {/* Lista de Bolões */}
          <FadeIn delay={0.4}>
            <Card className="backdrop-blur-sm border-border overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-lg">
                        <Trophy className="h-6 w-6 text-primary-foreground" />
                      </div>
                      Meus Bolões
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-lg mt-1">
                      Gerencie seus bolões e acompanhe seu desempenho em tempo real
                    </CardDescription>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{meusBoloes.length} bolão{meusBoloes.length !== 1 ? 's' : ''} ativo{meusBoloes.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <BoloesListSkeleton />
                ) : meusBoloes.length === 0 ? (
                  <EmptyBoloesList />
                ) : (
                  <div className="space-y-6">
                    {meusBoloes.map((bolao, index) => (
                      <BolaoCard
                        key={bolao.id}
                        bolao={bolao}
                        userId={user?.id || ''}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>


        </div>
      </div>
    </div>
  )
}