'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar,
  Trophy,
  Target,
  Camera,
  Edit,
  Save,
  X,
  Settings,
  BarChart3
} from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStore'
import { ThemeToggle, ThemeSettings } from '@/components/ui/theme-toggle'
import { BreadcrumbCard } from '@/components/ui/breadcrumbs'
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  joinedAt: string
  stats: {
    totalBoloes: number
    totalPontos: number
    melhorPosicao: number
    aproveitamento: number
    sequenciaAtual: number
    melhorSequencia: number
  }
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      jogos: boolean
      resultados: boolean
    }
    privacy: {
      perfilPublico: boolean
      estatisticasPublicas: boolean
      historicoPalpites: boolean
    }
    tema: string
  }
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  }>
}

export default function PerfilPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  // const [activeTab, setActiveTab] = useState<'geral' | 'notificacoes' | 'privacidade' | 'tema'>('geral')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/entrar')
      return
    }

    // Simular carregamento do perfil
    const loadProfile = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data - em produção viria da API
      const mockProfile: UserProfile = {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        avatar: user!.avatar,
        bio: "Apaixonado por futebol e palpites certeiros! 🏆⚽",
        location: "São Paulo, SP",
        joinedAt: "2024-01-15",
        stats: {
          totalBoloes: 5,
          totalPontos: 1247,
          melhorPosicao: 1,
          aproveitamento: 67,
          sequenciaAtual: 3,
          melhorSequencia: 8
        },
        preferences: {
          notifications: {
            email: true,
            push: true,
            jogos: true,
            resultados: true
          },
          privacy: {
            perfilPublico: true,
            estatisticasPublicas: true,
            historicoPalpites: false
          },
          tema: 'system'
        },
        badges: [
          {
            id: '1',
            name: 'Primeiro Palpite',
            description: 'Fez seu primeiro palpite',
            icon: '🎯',
            unlockedAt: '2024-01-15',
            rarity: 'common'
          },
          {
            id: '2', 
            name: 'Sequência de Ouro',
            description: 'Acertou 5 palpites seguidos',
            icon: '🔥',
            unlockedAt: '2024-02-10',
            rarity: 'rare'
          },
          {
            id: '3',
            name: 'Mestre dos Palpites',
            description: 'Ficou em 1º lugar em um bolão',
            icon: '👑',
            unlockedAt: '2024-03-01',
            rarity: 'epic'
          }
        ]
      }
      
      setProfile(mockProfile)
      setFormData({
        name: mockProfile.name,
        bio: mockProfile.bio || '',
        location: mockProfile.location || ''
      })
      setLoading(false)
    }

    loadProfile()
  }, [isAuthenticated, router, user])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (profile) {
        setProfile({
          ...profile,
          name: formData.name,
          bio: formData.bio,
          location: formData.location
        })
      }
      
      setEditMode(false)
      toast.success('Perfil atualizado com sucesso! ✨')
    } catch {
      toast.error('Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = () => {
    toast.info('Upload de avatar em breve! 📷')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/meus-boloes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  👤 Meu Perfil
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gerencie suas informações pessoais
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!editMode && (
                <Button onClick={() => setEditMode(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbCard>
            <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              <Link 
                href="/meus-boloes" 
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <span>🏠</span>
                <span>Início</span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link 
                href="/meus-boloes" 
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <span>🏆</span>
                <span>Meus Bolões</span>
              </Link>
              <span className="text-gray-400">/</span>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                <span>👤</span>
                <span>Perfil</span>
              </div>
            </nav>
          </BreadcrumbCard>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header do perfil */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {editMode && (
                    <button
                      onClick={handleAvatarChange}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </button>
                  )}
                </div>

                {/* Info básica */}
                <div className="flex-1 text-center md:text-left">
                  {editMode ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Conte um pouco sobre você..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Localização</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Cidade, Estado"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={saving}>
                          {saving ? (
                            <>Salvando...</>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={() => setEditMode(false)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                      {profile.bio && (
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {profile.email}
                        </div>
                        {profile.location && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {profile.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Membro desde {new Date(profile.joinedAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Stats resumidas */}
                {!editMode && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{profile.stats.totalBoloes}</div>
                      <div className="text-xs text-gray-500">Bolões</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{profile.stats.totalPontos}</div>
                      <div className="text-xs text-gray-500">Pontos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{profile.stats.melhorPosicao}º</div>
                      <div className="text-xs text-gray-500">Melhor</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{profile.stats.aproveitamento}%</div>
                      <div className="text-xs text-gray-500">Acertos</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!editMode && (
            <>
              {/* Conquistas */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    🏆 Conquistas ({profile.badges.length})
                  </CardTitle>
                  <CardDescription>
                    Badges desbloqueados pela sua dedicação nos palpites
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg ${getBadgeColor(badge.rarity)} relative overflow-hidden`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{badge.icon}</div>
                          <div>
                            <h4 className="font-semibold">{badge.name}</h4>
                            <p className="text-sm opacity-90">{badge.description}</p>
                            <p className="text-xs opacity-75 mt-1">
                              {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configurações de tema */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    🎨 Aparência
                  </CardTitle>
                  <CardDescription>
                    Personalize como o Palpiteiros aparece para você
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ThemeSettings />
                </CardContent>
              </Card>

              {/* Estatísticas detalhadas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    📊 Estatísticas Detalhadas
                  </CardTitle>
                  <CardDescription>
                    Seu desempenho nos bolões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Sequência atual</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          🔥 {profile.stats.sequenciaAtual} acertos
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Melhor sequência</span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          ⭐ {profile.stats.melhorSequencia} acertos
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/estatisticas">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Ver Estatísticas Completas
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}