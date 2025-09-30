'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  Eye,
  Hash,
  Trophy
} from "lucide-react"
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'
import { useHistoricoPalpites } from '@/lib/hooks/useHistoricoPalpites'
import { BreadcrumbCard } from '@/components/ui/breadcrumbs'
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect'

export default function HistoricoPage() {
  const { user } = useAuthStore()
  const {
    filteredPalpites,
    stats,
    filters,
    loading,
    searchTerm,
    updateFilters,
    updateSearchTerm,
    exportData
  } = useHistoricoPalpites()

  // Hook de redirecionamento automático
  useAuthRedirect()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correto-exato':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'correto-resultado':
        return <Target className="h-4 w-4 text-blue-400" />
      case 'erro':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      'correto-exato': { label: 'Exato', class: 'bg-green-600 text-white' },
      'correto-resultado': { label: 'Resultado', class: 'bg-blue-600 text-white' },
      'erro': { label: 'Erro', class: 'bg-red-600 text-white' },
      'pendente': { label: 'Pendente', class: 'bg-yellow-600 text-white' }
    }
    
    const config = configs[status as keyof typeof configs] || { label: status, class: 'bg-gray-600 text-white' }
    
    return (
      <Badge className={config.class}>
        {config.label}
      </Badge>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <BreadcrumbCard>
            <Link href="/meus-boloes" className="text-gray-400 hover:text-gray-300">
              Dashboard
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-100">Histórico</span>
          </BreadcrumbCard>

          {/* Header */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-gray-100 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Histórico de Palpites
                  </CardTitle>
                  <p className="text-gray-400 mt-1">
                    Acompanhe todos os seus palpites e resultados
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Estatísticas Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-100">{stats.total}</p>
                  <p className="text-sm text-gray-400">Total</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{stats.acertosExatos}</p>
                  <p className="text-sm text-gray-400">Exatos</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{stats.acertosResultado}</p>
                  <p className="text-sm text-gray-400">Resultado</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{stats.erros}</p>
                  <p className="text-sm text-gray-400">Erros</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{stats.aproveitamento}%</p>
                  <p className="text-sm text-gray-400">Aproveitamento</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Busca */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Time, bolão..."
                      value={searchTerm}
                      onChange={(e) => updateSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilters({ status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="correto-exato">Exatos</option>
                    <option value="correto-resultado">Resultado</option>
                    <option value="erro">Erros</option>
                    <option value="pendente">Pendentes</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Bolão</label>
                  <select
                    value={filters.bolao}
                    onChange={(e) => updateFilters({ bolao: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="bolao1">Família 2024</option>
                    <option value="bolao2">Copa dos Amigos</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Período</label>
                  <select
                    value={filters.periodo}
                    onChange={(e) => updateFilters({ periodo: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todo período</option>
                    <option value="ultima-semana">Última semana</option>
                    <option value="ultimo-mes">Último mês</option>
                    <option value="ultimo-ano">Último ano</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Palpites */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">
                Palpites ({filteredPalpites.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Carregando histórico...</p>
                </div>
              ) : filteredPalpites.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Nenhum palpite encontrado
                  </h3>
                  <p className="text-gray-500">
                    Tente ajustar os filtros ou fazer alguns palpites
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPalpites.map((palpite) => (
                    <Card key={palpite.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium text-gray-100">
                                {palpite.timeA} x {palpite.timeB}
                              </h3>
                              {getStatusIcon(palpite.status)}
                              {getStatusBadge(palpite.status)}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Bolão</p>
                                <p className="text-gray-100 font-medium">{palpite.bolaoNome}</p>
                              </div>
                              
                              <div>
                                <p className="text-gray-400">Seu Palpite</p>
                                <p className="text-gray-100 font-medium">
                                  {palpite.palpiteA} - {palpite.palpiteB}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-gray-400">Resultado</p>
                                <p className="text-gray-100 font-medium">
                                  {palpite.resultadoA !== undefined 
                                    ? `${palpite.resultadoA} - ${palpite.resultadoB}` 
                                    : 'Pendente'
                                  }
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-gray-400">Pontos</p>
                                <p className="text-gray-100 font-medium">
                                  {palpite.pontos} pts
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(palpite.data).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                Rodada {palpite.rodada}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {palpite.campeonato}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link href={`/bolao/${palpite.bolaoId}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Bolão
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botão Voltar */}
          <div className="flex justify-start">
            <Link href="/meus-boloes">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
