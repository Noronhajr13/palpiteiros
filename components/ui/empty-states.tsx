"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Trophy, 
  Target, 
  Plus, 
  Calendar,
  TrendingUp,
  Search,
  FileX,
  AlertCircle,
  Medal,
  Star
} from "lucide-react"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline"
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline"
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = ""
}: EmptyStateProps) {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <CardContent className="space-y-6">
        {icon && (
          <div className="flex justify-center">
            {icon}
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {description}
          </p>
        </div>

        {(action || secondaryAction) && (
          <div className="flex gap-3 justify-center flex-col sm:flex-row">
            {action && (
              action.href ? (
                <Button asChild variant={action.variant || "default"}>
                  <Link href={action.href}>
                    {action.label}
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant={action.variant || "default"}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              )
            )}
            
            {secondaryAction && (
              secondaryAction.href ? (
                <Button asChild variant={secondaryAction.variant || "outline"}>
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant={secondaryAction.variant || "outline"}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Empty State específico para lista de bolões vazia
export function EmptyBoloesList() {
  return (
    <EmptyState
      icon={
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="h-12 w-12 text-blue-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <Plus className="h-4 w-4 text-yellow-800" />
          </div>
        </div>
      }
      title="Nenhum bolão encontrado"
      description="Você ainda não participa de nenhum bolão. Que tal criar um ou entrar em um existente?"
      action={{
        label: "🏆 Criar Meu Primeiro Bolão",
        href: "/criar-bolao",
        variant: "default"
      }}
      secondaryAction={{
        label: "👥 Entrar em Bolão",
        href: "/entrar-bolao",
        variant: "outline"
      }}
      className="bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 border-2 border-blue-100 hover:shadow-lg transition-all duration-300"
    />
  )
}

// Empty State para jogos próximos
export function EmptyProximosJogos() {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-1">Nenhum jogo agendado</h4>
        <p className="text-sm text-gray-500">Os próximos jogos aparecerão aqui</p>
      </div>
    </div>
  )
}

// Empty State para ranking quando não há participantes
export function EmptyRanking() {
  return (
    <EmptyState
      icon={
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
            <Medal className="h-10 w-10 text-yellow-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        </div>
      }
      title="Nenhum participante ainda"
      description="Convide seus amigos para começar a competição! O ranking aparecerá quando houver pelo menos um participante com palpites."
      action={{
        label: "📱 Convidar Amigos",
        onClick: () => console.log('Abrir share dialog')
      }}
      className="bg-gradient-to-br from-yellow-50/50 via-white to-orange-50/50 border-2 border-yellow-100"
    />
  )
}

// Empty State para palpites quando não há jogos
export function EmptyPalpites() {
  return (
    <EmptyState
      icon={
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Target className="h-10 w-10 text-green-600" />
        </div>
      }
      title="Nenhum jogo disponível"
      description="Ainda não há jogos para fazer palpites nesta rodada. Aguarde os jogos serem adicionados pelo administrador."
      className="bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50 border-2 border-green-100"
    />
  )
}

// Empty State para busca sem resultados
export function EmptySearchResults() {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
      }
      title="Nenhum resultado encontrado"
      description="Tente usar termos diferentes ou verifique se a busca está correta."
      className="bg-gray-50/50 border border-gray-200"
    />
  )
}

// Empty State para erro genérico
export function EmptyError() {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
      }
      title="Ops! Algo deu errado"
      description="Não conseguimos carregar as informações. Tente novamente em alguns instantes."
      action={{
        label: "🔄 Tentar Novamente",
        onClick: () => window.location.reload()
      }}
      className="bg-gradient-to-br from-red-50/50 via-white to-pink-50/50 border-2 border-red-100"
    />
  )
}

// Empty State para dados não encontrados  
export function EmptyNotFound() {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
          <FileX className="h-8 w-8 text-gray-400" />
        </div>
      }
      title="Conteúdo não encontrado"
      description="A página ou recurso que você está procurando não existe ou foi removido."
      action={{
        label: "🏠 Voltar ao Início",
        href: "/meus-boloes"
      }}
      className="bg-gray-50/50 border border-gray-200"
    />
  )
}

// Empty State comemorativo para quando está tudo perfeito
export function EmptySuccess({ 
  title = "Tudo certo por aqui!", 
  description = "Não há nada pendente no momento. Continue assim!" 
}) {
  return (
    <EmptyState
      icon={
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Star className="h-10 w-10 text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <Trophy className="h-4 w-4 text-yellow-800" />
          </div>
        </div>
      }
      title={title}
      description={description}
      className="bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50 border-2 border-green-100"
    />
  )
}

// Empty State para estatísticas quando não há dados
export function EmptyStats() {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
        <TrendingUp className="h-8 w-8 text-purple-500" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-700 mb-1">Sem dados ainda</h4>
        <p className="text-sm text-gray-500">Faça alguns palpites para ver suas estatísticas aqui</p>
      </div>
    </div>
  )
}