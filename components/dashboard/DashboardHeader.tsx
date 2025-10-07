'use client'

import { Button } from '@/components/ui/button'
import { Trophy, LogOut } from 'lucide-react'
import { ScaleOnHover, FadeIn } from '@/components/ui/animations'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <FadeIn direction="down">
      <header className="bg-card/30 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-primary p-3 rounded-full">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Palpiteiros
                </h1>
                <p className="text-muted-foreground font-medium">Olá, {userName}! 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ScaleOnHover scale={1.05}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-border text-muted-foreground hover:bg-destructive/20 hover:border-destructive hover:text-destructive transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </ScaleOnHover>
            </div>
          </div>
        </div>
      </header>
    </FadeIn>
  )
}
