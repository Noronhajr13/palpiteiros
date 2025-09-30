'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Target, TrendingUp, Zap, Shield, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import { FadeIn, ScaleOnHover } from "@/components/ui/animations"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Moderno */}
      <FadeIn direction="down">
        <header className="container mx-auto px-4 py-6 sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                Palpiteiros
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ScaleOnHover scale={1.05}>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-surface transition-all duration-300" asChild>
                  <Link href="/entrar">Entrar</Link>
                </Button>
              </ScaleOnHover>
              <ScaleOnHover scale={1.05}>
                <Button className="gradient-primary shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <Link href="/cadastrar">Cadastrar</Link>
                </Button>
              </ScaleOnHover>
            </div>
          </div>
        </header>
      </FadeIn>

      {/* Hero Section Premium */}
      <section className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-surface backdrop-blur-sm border border-border rounded-full px-6 py-3 mb-8">
              <Star className="h-4 w-4 text-primary fill-current" />
              <span className="text-sm font-medium text-foreground">
                Bolões entre amigos
              </span>
            </div>
          </FadeIn>

          {/* Main Title */}
          <FadeIn delay={0.2}>
            <h1 className="text-6xl md:text-7xl font-black text-foreground mb-6 leading-tight tracking-tight">
              Seus palpites,
              <br />
              <span className="gradient-text">
                suas vitórias
              </span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.3}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais divertida para criar bolões com amigos, 
              fazer palpites e competir em tempo real. 
              <span className="font-semibold text-foreground">100% gratuito.</span>
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <ScaleOnHover scale={1.05}>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-4 h-auto gradient-primary shadow-xl hover:shadow-2xl transition-all duration-300" 
                  asChild
                >
                  <Link href="/criar-bolao">
                    <Trophy className="mr-2 h-5 w-5" />
                    Criar Meu Bolão
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </ScaleOnHover>
              <ScaleOnHover scale={1.05}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-4 h-auto border-2 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 hover:text-white transition-all duration-300" 
                  asChild
                >
                  <Link href="/entrar-bolao">
                    <Users className="mr-2 h-5 w-5" />
                    Entrar em Bolão
                  </Link>
                </Button>
              </ScaleOnHover>
            </div>
          </FadeIn>

          {/* Social Proof */}
          <FadeIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-gray-800"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-gray-800"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-gray-800"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white">
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
          </FadeIn>
        </div>
      </section>

      {/* Features Premium */}
      <section className="bg-gray-900/50 backdrop-blur-sm py-24">
        <div className="container mx-auto px-4">
          <FadeIn delay={0.1}>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Por que escolher o Palpiteiros?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                A experiência mais completa para seus bolões entre amigos
              </p>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0.2}>
              <ScaleOnHover scale={1.05}>
                <Card className="text-center border-blue-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500/10 to-indigo-600/20 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Super Fácil</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base text-gray-300 leading-relaxed">
                      Interface intuitiva e moderna. Crie seu bolão em 
                      <span className="font-semibold text-blue-400"> menos de 2 minutos</span> 
                      e convide amigos com um código simples.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </FadeIn>

            <FadeIn delay={0.3}>
              <ScaleOnHover scale={1.05}>
                <Card className="text-center border-green-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-500/10 to-emerald-600/20 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Tempo Real</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base text-gray-300 leading-relaxed">
                      Acompanhe rankings atualizados instantaneamente, 
                      <span className="font-semibold text-green-400"> estatísticas detalhadas</span> 
                      e saiba quem domina o bolão.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </FadeIn>

            <FadeIn delay={0.4}>
              <ScaleOnHover scale={1.05}>
                <Card className="text-center border-purple-500/30 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-500/10 to-violet-600/20 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white">Totalmente Seguro</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base text-gray-300 leading-relaxed">
                      Dados protegidos e bolões 
                      <span className="font-semibold text-purple-400"> 100% privados</span>. 
                      Apenas quem tem o código consegue participar.
                    </CardDescription>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </FadeIn>
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
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                50k+
              </div>
              <div className="text-blue-100 font-medium">Palpites Realizados</div>
              <div className="text-blue-200 text-sm mt-1">E crescendo!</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                2.5k+
              </div>
              <div className="text-blue-100 font-medium">Bolões Ativos</div>
              <div className="text-blue-200 text-sm mt-1">Agora mesmo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                15k+
              </div>
              <div className="text-blue-100 font-medium">Usuários Felizes</div>
              <div className="text-blue-200 text-sm mt-1">5 ⭐ de avaliação</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Dark Premium */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-green-600/5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 text-white rounded-full px-6 py-3 mb-8">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-semibold">100% Gratuito Sempre</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h3 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                Pronto para 
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  {" "}dominar{" "}
                </span>
                seus bolões?
              </h3>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Junte-se a milhares de pessoas que já estão se divertindo e 
                <span className="font-semibold text-white"> ganhando </span>
                com seus palpites certeiros!
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ScaleOnHover scale={1.05}>
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300" 
                    asChild
                  >
                    <Link href="/cadastrar">
                      <Target className="mr-3 h-6 w-6" />
                      Começar Agora - É Grátis!
                      <ChevronRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                </ScaleOnHover>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.5}>
              <p className="text-sm text-gray-400 mt-6 flex items-center justify-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                ✨ Sem pegadinhas, sem mensalidades, sem complicação
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-gray-900/80 backdrop-blur-sm py-12 border-t border-gray-700/50">
        <div className="container mx-auto px-4">
          <FadeIn delay={0.1}>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  Palpiteiros
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                A plataforma mais divertida para bolões entre amigos. 
                Simples, seguro e 100% gratuito.
              </p>
              <div className="flex items-center gap-6 mb-8 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-green-400" />
                  100% Gratuito
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-blue-400" />
                  Totalmente Seguro
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-purple-400" />
                  Suporte 24/7
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                © 2024 Palpiteiros. Feito com ❤️ para os verdadeiros palpiteiros.
              </div>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  )
}
