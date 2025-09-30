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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header Premium */}
        <FadeIn direction="down">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Palpiteiros
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta! 👋</h2>
            <p className="text-gray-300">Entre com sua conta para continuar palpitando</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ScaleOnHover scale={1.02}>
            <Card className="shadow-2xl bg-gray-800/30 backdrop-blur-sm border-gray-700/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-blue-400" />
                  Fazer Login
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Entre com seu email e senha para acessar seus bolões
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-200 font-medium">Senha</Label>
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
                        className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300" 
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
                  <p className="text-gray-300">
                    Ainda não tem conta?{' '}
                    <Link 
                      href="/cadastrar" 
                      className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                      Cadastre-se aqui
                    </Link>
                  </p>
                </div>

                {/* Demo credentials Premium */}
                <FadeIn delay={0.2}>
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-lg">
                    <p className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      🎯 Dados para teste:
                    </p>
                    <div className="text-sm text-blue-200 space-y-2 bg-gray-800/30 p-3 rounded border border-blue-500/10">
                      <p><strong className="text-blue-300">Email:</strong> joao@palpiteiros.com</p>
                      <p><strong className="text-blue-300">Senha:</strong> 123456</p>
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
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
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