"use client"

import { Fragment } from "react"
import Link from "next/link"
import { ChevronRight, Home, Trophy, Target, Medal, Users, Plus } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  active?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
          )}
          
          {item.href && !item.active ? (
            <Link 
              href={item.href}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div className={`flex items-center gap-1 ${item.active ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

// Breadcrumb específico para páginas do bolão
interface BolaoBreadcrumbsProps {
  bolaoNome: string
  bolaoId: string
  currentPage: "overview" | "palpites" | "ranking"
  className?: string
}

export function BolaoBreadcrumbs({ 
  bolaoNome, 
  bolaoId, 
  currentPage,
  className = "" 
}: BolaoBreadcrumbsProps) {
  const baseItems: BreadcrumbItem[] = [
    {
      label: "Início",
      href: "/meus-boloes",
      icon: <Home className="h-3 w-3" />
    },
    {
      label: "Meus Bolões",
      href: "/meus-boloes",
      icon: <Trophy className="h-3 w-3" />
    },
    {
      label: bolaoNome,
      href: currentPage === "overview" ? undefined : `/bolao/${bolaoId}`,
      active: currentPage === "overview"
    }
  ]

  // Adicionar página específica se não for overview
  if (currentPage !== "overview") {
    const pageConfig = {
      palpites: {
        label: "Palpites",
        icon: <Target className="h-3 w-3" />
      },
      ranking: {
        label: "Ranking", 
        icon: <Medal className="h-3 w-3" />
      }
    }

    baseItems.push({
      label: pageConfig[currentPage].label,
      icon: pageConfig[currentPage].icon,
      active: true
    })
  }

  return <Breadcrumbs items={baseItems} className={className} />
}

// Breadcrumb para páginas de ação
interface ActionBreadcrumbsProps {
  action: "criar-bolao" | "entrar-bolao"
  className?: string
}

export function ActionBreadcrumbs({ action, className = "" }: ActionBreadcrumbsProps) {
  const actionConfig = {
    "criar-bolao": {
      label: "Criar Bolão",
      icon: <Plus className="h-3 w-3" />
    },
    "entrar-bolao": {
      label: "Entrar em Bolão",
      icon: <Users className="h-3 w-3" />
    }
  }

  const items: BreadcrumbItem[] = [
    {
      label: "Início",
      href: "/meus-boloes",
      icon: <Home className="h-3 w-3" />
    },
    {
      label: "Meus Bolões",
      href: "/meus-boloes",
      icon: <Trophy className="h-3 w-3" />
    },
    {
      label: actionConfig[action].label,
      icon: actionConfig[action].icon,
      active: true
    }
  ]

  return <Breadcrumbs items={items} className={className} />
}

// Breadcrumb card com estilo visual
interface BreadcrumbCardProps {
  children: React.ReactNode
  className?: string
}

export function BreadcrumbCard({ children, className = "" }: BreadcrumbCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

// Hook para gerar breadcrumbs automaticamente baseado na URL
export function useBreadcrumbs(pathname: string, bolaoData?: { id: string, nome: string }) {
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'meus-boloes')) {
    // Página inicial - sem breadcrumbs
    return null
  }

  // Página de criar bolão
  if (segments[0] === 'criar-bolao') {
    return <ActionBreadcrumbs action="criar-bolao" />
  }

  // Página de entrar em bolão  
  if (segments[0] === 'entrar-bolao') {
    return <ActionBreadcrumbs action="entrar-bolao" />
  }

  // Páginas do bolão
  if (segments[0] === 'bolao' && segments[1] && bolaoData) {
    let currentPage: "overview" | "palpites" | "ranking" = "overview"
    
    if (segments[2] === 'palpites') currentPage = "palpites"
    if (segments[2] === 'ranking') currentPage = "ranking"

    return (
      <BolaoBreadcrumbs 
        bolaoNome={bolaoData.nome}
        bolaoId={bolaoData.id}
        currentPage={currentPage}
      />
    )
  }

  return null
}