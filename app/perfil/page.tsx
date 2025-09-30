'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserProfile } from '@/lib/hooks/useUserProfile'
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect'
import { FadeIn, ScaleOnHover } from "@/components/ui/animations"
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Crown, 
  Target, 
  Award,
  Settings,
  BarChart3
} from 'lucide-react'

export default function PerfilPage() {
  const { user } = useAuthStore()
  const { profile, loading } = useUserProfile()
  
  useAuthRedirect()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Usuário não encontrado</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Header do Perfil Premium */}
          <FadeIn>
            <ScaleOnHover scale={1.02}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {profile?.nome || 'Usuário'}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      
                      <div className="flex gap-4">
                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1">
                          🟢 Online
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                          🏆 Palpiteiro Pro
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Button variant="outline" className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50">
                        <Settings className="h-4 w-4 mr-2" />
                        Editar Perfil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </FadeIn>

          {/* Estatísticas Premium */}
          <FadeIn delay={0.2}>
            <ScaleOnHover scale={1.02}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Estatísticas de Performance
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Seu desempenho nos palpites e bolões
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <ScaleOnHover scale={1.05}>
                      <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/20 rounded-lg border border-green-500/30 group">
                        <div className="p-3 bg-green-500/20 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="h-8 w-8 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{profile?.estatisticas?.totalBoloes || 0}</p>
                        <p className="text-sm text-green-300 font-medium">Total de Bolões</p>
                      </div>
                    </ScaleOnHover>
                    
                    <ScaleOnHover scale={1.05}>
                      <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-600/20 rounded-lg border border-blue-500/30 group">
                        <div className="p-3 bg-blue-500/20 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Target className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{profile?.estatisticas?.aproveitamento || 0}%</p>
                        <p className="text-sm text-blue-300 font-medium">Taxa de Acertos</p>
                      </div>
                    </ScaleOnHover>
                    
                    <ScaleOnHover scale={1.05}>
                      <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-600/20 rounded-lg border border-yellow-500/30 group">
                        <div className="p-3 bg-yellow-500/20 rounded-full w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Crown className="h-8 w-8 text-yellow-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{profile?.estatisticas?.ranking || '-'}º</p>
                        <p className="text-sm text-yellow-300 font-medium">Melhor Posição</p>
                      </div>
                    </ScaleOnHover>
                  </div>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </FadeIn>

          {/* Conquistas Premium */}
          <FadeIn delay={0.3}>
            <ScaleOnHover scale={1.02}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/5 via-orange-600/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    Conquistas & Badges
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Suas conquistas e marcos alcançados
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 p-2">
                      🏆 Primeiro Lugar
                    </Badge>
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 p-2">
                      🎯 Palpiteiro Expert
                    </Badge>
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30 p-2">
                      🔥 Sequência de 10
                    </Badge>
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 p-2">
                      ⭐ 100 Palpites
                    </Badge>
                    <Badge variant="secondary" className="bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30 p-2">
                      👑 Rei dos Bolões
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </FadeIn>

          {/* Informações da Conta Premium */}
          <FadeIn delay={0.4}>
            <ScaleOnHover scale={1.02}>
              <Card className="bg-gray-800/30 backdrop-blur-sm border-gray-700/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 via-blue-600/5 to-gray-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    Informações da Conta
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Detalhes e configurações da sua conta
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <User className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">ID do Usuário</p>
                        <p className="text-sm text-gray-400">Identificador único da sua conta</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {user?.id || 'N/A'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Membro desde</p>
                        <p className="text-sm text-gray-400">Data de criação da conta</p>
                      </div>
                    </div>
                    <p className="text-gray-300 font-medium">
                      {new Date().toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Status da Conta</p>
                        <p className="text-sm text-gray-400">Estado atual da sua conta</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500/30">
                      🟢 Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </ScaleOnHover>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
