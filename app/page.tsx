'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { LoginHeader } from '@/components/auth/LoginHeader'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { SocialLogin } from '@/components/auth/SocialLogin'
import { AuthToggle } from '@/components/auth/AuthToggle'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Email ou senha incorretos')
        return
      }

      toast.success('Login realizado com sucesso!')
      router.push('/meus-boloes')
    } catch (error) {
      toast.error('Erro ao processar requisição')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erro ao criar conta')
        return
      }

      toast.success('Conta criada com sucesso!')
      
      // Login automático
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/meus-boloes')
      }
    } catch (error) {
      toast.error('Erro ao processar requisição')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/meus-boloes' })
    } catch (error) {
      toast.error('Erro ao fazer login com Google')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-muted/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-muted/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-muted/10 rounded-full blur-3xl" />
      </div>

      {/* Toggle de tema */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Card de Login */}
      <Card className="w-full max-w-md relative z-10 shadow-xl">
        <div className="p-8 space-y-6">
          <LoginHeader isLogin={isLogin} />

          {isLogin ? (
            <LoginForm onSubmit={handleLogin} loading={loading} />
          ) : (
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          )}

          <SocialLogin onGoogleLogin={handleGoogleLogin} loading={googleLoading} />

          <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
        </div>
      </Card>
    </div>
  )
}
