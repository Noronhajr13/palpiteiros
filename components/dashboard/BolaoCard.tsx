import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScaleOnHover, FadeIn } from '@/components/ui/animations'
import { Trophy, Users, Award, Target, TrendingUp, ChevronRight, Crown } from 'lucide-react'

interface Participante {
  id: string
  nome: string
  pontos: number
  posicao?: number
  totalPalpites: number
  palpitesCorretos: number
}

interface Bolao {
  id: string
  nome: string
  status: string
  participantes?: Participante[]
}

interface BolaoCardProps {
  bolao: Bolao
  userId: string
  index: number
}

export function BolaoCard({ bolao, userId, index }: BolaoCardProps) {
  const participante = bolao.participantes?.find(p => p.id === userId)
  const taxaAcerto = participante && participante.totalPalpites > 0 
    ? Math.round((participante.palpitesCorretos / participante.totalPalpites) * 100)
    : 0

  return (
    <FadeIn delay={0.5 + index * 0.1}>
      <ScaleOnHover scale={1.02}>
        <Card className="relative overflow-hidden group border-border hover:border-primary/50 transition-all duration-300">
          {/* Background Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur opacity-50"></div>
                    <div className="relative bg-card p-3 rounded-lg border border-border">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {bolao.nome}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full font-medium">
                        {bolao.status}
                      </span>
                      {participante?.posicao && participante.posicao <= 3 && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-bold flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Top {participante.posicao}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground text-sm">Participantes</span>
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {bolao.participantes?.length || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground text-sm">Posição</span>
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {participante?.posicao || '-'}º
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground text-sm">Pontos</span>
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {participante?.pontos || 0}
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground text-sm">Taxa</span>
                    </div>
                    <p className="text-foreground font-bold text-lg">
                      {taxaAcerto}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 ml-6">
                <Link href={`/bolao/${bolao.id}/palpites`}>
                  <ScaleOnHover scale={1.05}>
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      Palpitar
                    </Button>
                  </ScaleOnHover>
                </Link>
                
                <Link href={`/bolao/${bolao.id}`}>
                  <ScaleOnHover scale={1.05}>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-border text-muted-foreground hover:bg-accent/50 hover:border-accent transition-all duration-300 px-6 py-3"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </ScaleOnHover>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScaleOnHover>
    </FadeIn>
  )
}
