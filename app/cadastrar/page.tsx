'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Eye, EyeOff, Loader2, User, Mail, Lock, UserPlus, ArrowLeft } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { toast } from "sonner"
import { FadeIn, ScaleOnHover } from "@/components/ui/animations"

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const success = await register(formData.name, formData.email, formData.password)
      
      if (success) {
        toast.success('Conta criada com sucesso!', {
          description: 'Bem-vindo ao Palpiteiros! 🎉'
        })
        setTimeout(() => {
          router.push('/meus-boloes')
        }, 1000)
      } else {
        setErrors({ email: 'Este email já está em uso' })
        toast.error('Email já cadastrado', {
          description: 'Tente fazer login ou use outro email'
        })
      }
    } catch {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' })
      toast.error('Erro no cadastro', {
        description: 'Tente novamente em alguns instantes'
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-accent/5"></div>
      <div className="absolute top-0 left-0 w-full h-1 gradient-primary"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header Premium */}
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Crie sua conta 🚀</h2>
            <p className="text-muted-foreground">Junte-se aos milhares de palpiteiros!</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ScaleOnHover scale={1.02}>
            <Card className="shadow-2xl bg-card backdrop-blur-sm border-border relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-foreground text-xl flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Cadastrar
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Preencha os dados abaixo para criar sua conta
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all duration-300 pl-10"
                      />
                    </div>
                    {errors.name && (
                      <FadeIn>
                        <p className="text-sm text-destructive">{errors.name}</p>
                      </FadeIn>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all duration-300 pl-10"
                      />
                    </div>
                    {errors.email && (
                      <FadeIn>
                        <p className="text-sm text-destructive">{errors.email}</p>
                      </FadeIn>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all duration-300 pl-10 pr-12"
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
                    {errors.password && (
                      <FadeIn>
                        <p className="text-sm text-destructive">{errors.password}</p>
                      </FadeIn>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite a senha novamente"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 transition-all duration-300 pl-10 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <FadeIn>
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      </FadeIn>
                    )}
                  </div>

                  {errors.general && (
                    <FadeIn>
                      <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-4 rounded-lg backdrop-blur-sm">
                        {errors.general}
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
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-5 w-5" />
                          Criar Conta
                        </>
                      )}
                    </Button>
                  </ScaleOnHover>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link 
                      href="/entrar" 
                      className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300"
                    >
                      Faça login aqui
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScaleOnHover>
        </FadeIn>

        <FadeIn delay={0.2}>
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