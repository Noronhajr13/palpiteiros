'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Target, TrendingUp, Zap, Shield, Star, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Palpiteiros
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900" asChild>
              <Link href="/entrar">Entrar</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
              <Link href="/cadastrar">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              #1 em bolões entre amigos
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Seus palpites,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent">
              suas vitórias
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A plataforma mais divertida para criar bolões com amigos, 
            fazer palpites e competir em tempo real. 
            <span className="font-semibold text-gray-900">100% gratuito.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-10 py-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" 
              asChild
            >
              <Link href="/criar-bolao">
                <Trophy className="mr-2 h-5 w-5" />
                Criar Meu Bolão
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-4 h-auto border-2 hover:bg-white hover:shadow-lg transition-all duration-300" 
              asChild
            >
              <Link href="/entrar-bolao">
                <Users className="mr-2 h-5 w-5" />
                Entrar em Bolão
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                  +15k
                </div>
              </div>
              <span>usuários felizes</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
              <span className="ml-1">4.9/5 de avaliação</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher o Palpiteiros?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A experiência mais completa para seus bolões entre amigos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Super Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Interface intuitiva e moderna. Crie seu bolão em 
                  <span className="font-semibold text-blue-600"> menos de 2 minutos</span> 
                  e convide amigos com um código simples.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Acompanhe rankings atualizados instantaneamente, 
                  <span className="font-semibold text-green-600"> estatísticas detalhadas</span> 
                  e saiba quem domina o bolão.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Totalmente Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 leading-relaxed">
                  Dados protegidos e bolões 
                  <span className="font-semibold text-purple-600"> 100% privados</span>. 
                  Apenas quem tem o código consegue participar.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Números que impressionam
            </h3>
            <p className="text-blue-100 text-lg">
              Milhares de pessoas já escolheram o Palpiteiros
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                50k+
              </div>
              <div className="text-blue-100 font-medium">Palpites Realizados</div>
              <div className="text-blue-200 text-sm mt-1">E crescendo!</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                2.5k+
              </div>
              <div className="text-blue-100 font-medium">Bolões Ativos</div>
              <div className="text-blue-200 text-sm mt-1">Agora mesmo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                15k+
              </div>
              <div className="text-blue-100 font-medium">Usuários Felizes</div>
              <div className="text-blue-200 text-sm mt-1">5 ⭐ de avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2 mb-8">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold">100% Gratuito Sempre</span>
            </div>
            
            <h3 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Pronto para 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}dominar{" "}
              </span>
              seus bolões?
            </h3>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de pessoas que já estão se divertindo e 
              <span className="font-semibold text-gray-900"> ganhando </span>
              com seus palpites certeiros!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105" 
                asChild
              >
                <Link href="/cadastrar">
                  <Target className="mr-3 h-6 w-6" />
                  Começar Agora - É Grátis!
                  <ChevronRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              ✨ Sem pegadinhas, sem mensalidades, sem complicação
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Palpiteiros
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              A plataforma mais divertida para bolões entre amigos. 
              Simples, seguro e 100% gratuito.
            </p>
            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
              <span>100% Gratuito</span>
              <span>•</span>
              <span>Totalmente Seguro</span>
              <span>•</span>
              <span>Suporte 24/7</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2024 Palpiteiros. Feito com ❤️ para os verdadeiros palpiteiros.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
