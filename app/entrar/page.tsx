'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Eye, EyeOff, Loader2, LogIn, ArrowLeft } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { toast } from "sonner"
import { FadeIn, ScaleOnHover } from "@/components/ui/animations"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const success = await login(formData.email, formData.password)
      
      if (success) {
        toast.success('Login realizado com sucesso!', {
          description: 'Redirecionando para o dashboard...'
        })
        setTimeout(() => {
          router.push('/meus-boloes')
        }, 1000)
      } else {
        setError('Email ou senha incorretos')
        toast.error('Erro no login', {
          description: 'Verifique suas credenciais e tente novamente'
        })
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.')
      toast.error('Ops! Algo deu errado', {
        description: 'Tente novamente em alguns instantes'
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      <div className="absolute top-0 left-0 w-full h-1 gradient-primary"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header Moderno */}
        <FadeIn direction="down">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">
                Palpiteiros
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Bem-vindo de volta! 👋</h2>
            <p className="text-muted-foreground">Entre com sua conta para continuar palpitando</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ScaleOnHover scale={1.02}>
            <Card className="shadow-2xl bg-card backdrop-blur-sm border-border relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-foreground text-xl flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-primary" />
                  Fazer Login
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Entre com seu email e senha para acessar seus bolões
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all duration-300 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <FadeIn>
                      <div className="text-sm text-red-300 bg-red-900/30 border border-red-700/50 p-4 rounded-lg backdrop-blur-sm">
                        {error}
                      </div>
                    </FadeIn>
                  )}

                  <ScaleOnHover scale={1.02}>
                    <Button 
                      type="submit" 
                      className="w-full gradient-primary text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </ScaleOnHover>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    Ainda não tem conta?{' '}
                    <Link 
                      href="/cadastrar" 
                      className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300"
                    >
                      Cadastre-se aqui
                    </Link>
                  </p>
                </div>

                {/* Demo credentials Premium */}
                <FadeIn delay={0.2}>
                  <div className="mt-6 p-4 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-lg">
                    <p className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                      🎯 Dados para teste:
                    </p>
                    <div className="text-sm text-muted-foreground space-y-2 bg-muted/30 p-3 rounded border border-accent/10">
                      <p><strong className="text-accent">Email:</strong> joao@palpiteiros.com</p>
                      <p><strong className="text-accent">Senha:</strong> 123456</p>
                    </div>
                  </div>
                </FadeIn>
              </CardContent>
            </Card>
          </ScaleOnHover>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-6 text-center">
            <ScaleOnHover scale={1.05}>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </ScaleOnHover>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}