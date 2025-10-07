'use client'

import { Trophy } from 'lucide-react'

interface LoginHeaderProps {
  isLogin: boolean
}

export function LoginHeader({ isLogin }: LoginHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-primary hover:bg-primary-hover rounded-2xl flex items-center justify-center shadow-lg transition-colors">
          <Trophy className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-foreground">
        Palpiteiros
      </h1>
      <p className="text-muted-foreground">
        {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
      </p>
    </div>
  )
}
