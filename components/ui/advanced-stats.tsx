"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import {
  Trophy,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Zap,
  Star
} from "lucide-react"

// Interface para dados de estatísticas
interface StatsData {
  pontosPorRodada: Array<{ rodada: number; pontos: number; media: number }>
  distribuicaoAcertos: Array<{ tipo: string; quantidade: number; cor: string }>
  performanceMensal: Array<{ mes: string; pontos: number; posicao: number }>
  comparacaoParticipantes: Array<{ nome: string; pontos: number; aproveitamento: number }>
  habilidades: Array<{ habilidade: string; valor: number; maximo: number }>
}

// Cores para gráficos
const CHART_COLORS = {
  primary: '#3B82F6',
  success: '#10B981', 
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6'
}

const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

// Componente principal de estatísticas avançadas
interface AdvancedStatsProps {
  userId: string
  bolaoId?: string
  data: StatsData
  className?: string
}

export function AdvancedStats({ userId, bolaoId, data, className = '' }: AdvancedStatsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Estatísticas Avançadas
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Análise detalhada da sua performance
          </p>
        </div>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pontos"
          value="1,247"
          change="+12%"
          icon={Trophy}
          color="text-yellow-600"
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <StatCard
          title="Média por Rodada"
          value="8.3"
          change="+2.1"
          icon={Target}
          color="text-blue-600"
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard
          title="Aproveitamento"
          value="67%"
          change="+5%"
          icon={TrendingUp}
          color="text-green-600" 
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard
          title="Posição Média"
          value="3.2"
          change="-0.8"
          icon={Award}
          color="text-purple-600"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pontos por rodada */}
        <PerformanceChart data={data.pontosPorRodada} />
        
        {/* Distribuição de acertos */}
        <AccuracyPieChart data={data.distribuicaoAcertos} />
      </div>

      {/* Análises avançadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar de habilidades */}
        <SkillsRadarChart data={data.habilidades} />
        
        {/* Comparação com outros participantes */}
        <ComparisonChart data={data.comparacaoParticipantes} />
        
        {/* Performance mensal */}
        <MonthlyTrendChart data={data.performanceMensal} />
      </div>

      {/* Insights e recomendações */}
      <InsightsPanel data={data} />
    </div>
  )
}

// Card de estatística resumida
interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

function StatCard({ title, value, change, icon: Icon, color, bgColor }: StatCardProps) {
  const isPositive = change.startsWith('+')
  
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        <p className={`text-xs ${
          isPositive ? 'text-green-600' : 'text-red-600'
        } flex items-center mt-1`}>
          <span>{change} vs período anterior</span>
        </p>
      </CardContent>
    </Card>
  )
}

// Gráfico de performance por rodada
function PerformanceChart({ data }: { data: StatsData['pontosPorRodada'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChartIcon className="h-5 w-5 text-blue-600" />
          Performance por Rodada
        </CardTitle>
        <CardDescription>
          Evolução dos seus pontos ao longo das rodadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rodada" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name === 'pontos' ? 'Seus Pontos' : 'Média Geral']}
              labelFormatter={(label) => `Rodada ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="pontos" 
              stroke={CHART_COLORS.primary} 
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="media" 
              stroke={CHART_COLORS.warning} 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Gráfico pizza de distribuição de acertos
function AccuracyPieChart({ data }: { data: StatsData['distribuicaoAcertos'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-green-600" />
          Distribuição de Acertos
        </CardTitle>
        <CardDescription>
          Como você está acertando seus palpites
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="quantidade"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor || PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Radar de habilidades
function SkillsRadarChart({ data }: { data: StatsData['habilidades'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Análise de Habilidades
        </CardTitle>
        <CardDescription>
          Seus pontos fortes e fracos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="habilidade" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Habilidade"
              dataKey="valor"
              stroke={CHART_COLORS.purple}
              fill={CHART_COLORS.purple}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Comparação com outros participantes
function ComparisonChart({ data }: { data: StatsData['comparacaoParticipantes'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-600" />
          vs Outros Participantes
        </CardTitle>
        <CardDescription>
          Sua posição no grupo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="nome" type="category" width={60} />
            <Tooltip />
            <Bar dataKey="pontos" fill={CHART_COLORS.success} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Tendência mensal
function MonthlyTrendChart({ data }: { data: StatsData['performanceMensal'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-cyan-600" />
          Tendência Mensal
        </CardTitle>
        <CardDescription>
          Evolução ao longo dos meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="pontos" 
              stroke={CHART_COLORS.info}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Panel de insights
function InsightsPanel({ data }: { data: StatsData }) {
  const insights = [
    {
      type: 'positive',
      icon: Star,
      title: 'Ponto Forte',
      description: 'Você tem 85% de acerto em jogos de final de semana!',
      action: 'Continue focando nos jogos de sábado e domingo'
    },
    {
      type: 'warning',
      icon: Zap,
      title: 'Área de Melhoria',
      description: 'Seus placares exatos estão abaixo da média do grupo',
      action: 'Analise mais os históricos dos times antes de palpitar'
    },
    {
      type: 'info',
      icon: TrendingUp,
      title: 'Tendência',
      description: 'Sua performance melhorou 23% nas últimas 3 rodadas',
      action: 'Mantenha a estratégia atual!'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>🧠 Insights Personalizados</CardTitle>
        <CardDescription>
          Recomendações baseadas na sua performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            const colors = {
              positive: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300', icon: 'text-green-600' },
              warning: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300', icon: 'text-yellow-600' },
              info: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600' }
            }
            
            const color = colors[insight.type as keyof typeof colors]
            
            return (
              <div key={index} className={`p-4 rounded-lg ${color.bg} border`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-white/80 dark:bg-gray-800/80`}>
                    <Icon className={`h-5 w-5 ${color.icon}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${color.text}`}>{insight.title}</h4>
                    <p className={`text-sm ${color.text} mt-1`}>{insight.description}</p>
                    <p className={`text-xs ${color.text} mt-2 font-medium`}>
                      💡 {insight.action}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Hook para gerar dados mock de estatísticas
export function useStatsData(userId: string, bolaoId?: string): StatsData {
  // Em produção, isso viria de uma API
  return {
    pontosPorRodada: [
      { rodada: 1, pontos: 8, media: 6.2 },
      { rodada: 2, pontos: 12, media: 7.1 },
      { rodada: 3, pontos: 6, media: 8.3 },
      { rodada: 4, pontos: 15, media: 9.1 },
      { rodada: 5, pontos: 9, media: 7.8 },
      { rodada: 6, pontos: 11, media: 8.9 },
      { rodada: 7, pontos: 13, media: 9.5 },
      { rodada: 8, pontos: 7, media: 8.2 }
    ],
    distribuicaoAcertos: [
      { tipo: 'Placar Exato', quantidade: 12, cor: CHART_COLORS.success },
      { tipo: 'Resultado Correto', quantidade: 28, cor: CHART_COLORS.primary },
      { tipo: 'Errou Tudo', quantidade: 15, cor: CHART_COLORS.danger }
    ],
    performanceMensal: [
      { mes: 'Jan', pontos: 87, posicao: 4 },
      { mes: 'Fev', pontos: 92, posicao: 3 },
      { mes: 'Mar', pontos: 78, posicao: 5 },
      { mes: 'Abr', pontos: 95, posicao: 2 },
      { mes: 'Mai', pontos: 88, posicao: 4 }
    ],
    comparacaoParticipantes: [
      { nome: 'João', pontos: 134, aproveitamento: 78 },
      { nome: 'Maria', pontos: 127, aproveitamento: 73 },
      { nome: 'Pedro', pontos: 119, aproveitamento: 69 },
      { nome: 'Ana', pontos: 112, aproveitamento: 65 },
      { nome: 'Carlos', pontos: 98, aproveitamento: 58 }
    ],
    habilidades: [
      { habilidade: 'Placares', valor: 65, maximo: 100 },
      { habilidade: 'Resultados', valor: 82, maximo: 100 },
      { habilidade: 'Casa/Fora', valor: 74, maximo: 100 },
      { habilidade: 'Finais de Semana', valor: 89, maximo: 100 },
      { habilidade: 'Grandes Jogos', valor: 71, maximo: 100 },
      { habilidade: 'Azarão', valor: 56, maximo: 100 }
    ]
  }
}