'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, ArrowLeft, Users, Hash, Loader2, LogIn, AlertCircle } from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { useBolaoStore } from '@/lib/stores/useBolaoStore'
import { ActionBreadcrumbs, BreadcrumbCard } from '@/components/ui/breadcrumbs'
import { toast } from "sonner"

export default function EntrarBolaoPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { entrarBolao } = useBolaoStore()
  
  const [formData, setFormData] = useState({
    codigo: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isAuthenticated) {
    router.push('/entrar')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.codigo.trim()) {
      setError('Código do bolão é obrigatório')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const sucesso = await entrarBolao(formData.codigo.trim().toUpperCase(), {
        id: user!.id,
        nome: user!.name,
        avatar: user!.avatar
      })
      
      if (sucesso) {
        setSuccess('Você entrou no bolão com sucesso!')
        toast.success('Entrou no bolão!', {
          description: 'Agora você pode fazer seus palpites 🎯'
        })
        setTimeout(() => {
          router.push('/meus-boloes')
        }, 1500)
      } else {
        const errorMsg = 'Código não encontrado, bolão lotado ou você já participa deste bolão'
        setError(errorMsg)
        toast.error('Não foi possível entrar', {
          description: 'Verifique o código e tente novamente'
        })
      }
    } catch {
      setError('Erro ao entrar no bolão. Tente novamente.')
      toast.error('Erro na conexão', {
        description: 'Tente novamente em alguns instantes'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    // Converter para maiúscula e limitar caracteres
    const codigoFormatado = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8)
    
    setFormData({ codigo: codigoFormatado })
    
    // Limpar mensagens quando o usuário digitar
    if (error) setError('')
    if (success) setSuccess('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/meus-boloes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Entrar em Bolão</h1>
                <p className="text-sm text-gray-600">Use um código para participar</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbCard>
            <ActionBreadcrumbs action="entrar-bolao" />
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Como entrar em um bolão?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
                <Hash className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Peça o <strong>código do bolão</strong> para o administrador
                </p>
                <p className="text-sm text-gray-600">
                  O código tem <strong>6-8 caracteres</strong> (ex: ABC123, FAM2024)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Digite o Código</CardTitle>
              <CardDescription>
                Insira o código do bolão que você recebeu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código do Bolão</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="codigo"
                      name="codigo"
                      type="text"
                      placeholder="Ex: FAM2024"
                      value={formData.codigo}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      className="pl-9 text-center text-lg font-mono tracking-wider"
                      maxLength={8}
                      autoComplete="off"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {formData.codigo.length}/8 caracteres
                  </p>
                </div>

                {/* Mensagens */}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md text-center">
                    ✅ {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || formData.codigo.length < 3}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar no Bolão
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Códigos de Exemplo para Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🎯 Para Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Códigos disponíveis para teste:</strong></p>
                <div className="bg-gray-50 p-3 rounded-md font-mono text-center space-y-1">
                  <div 
                    className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                    onClick={() => setFormData({ codigo: 'FAM2024' })}
                  >
                    <code>FAM2024</code> - Brasileirão 2024 - Família
                  </div>
                  <div 
                    className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                    onClick={() => setFormData({ codigo: 'COPA24' })}
                  >
                    <code>COPA24</code> - Copa América 2024
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Clique em um código para usar
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alternativa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Não tem um código?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Crie seu próprio bolão e convide seus amigos!
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/criar-bolao">
                  <Trophy className="mr-2 h-4 w-4" />
                  Criar Meu Bolão
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}