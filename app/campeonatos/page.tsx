'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Edit, Trash2, Trophy, Users, Calendar, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface Time {
  id: string
  nome: string
  escudo?: string
}

interface Participante {
  timeId: string
  nome: string
  escudo?: string
  sigla: string
}

interface Campeonato {
  id: string
  nome: string
  pais: string
  logo?: string
  participantes: Participante[]
  totalTimes: number
}

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
  const [times, setTimes] = useState<Time[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCampeonato, setEditingCampeonato] = useState<Campeonato | null>(null)
  const [timesSelecionados, setTimesSelecionados] = useState<string[]>([])

  const [formData, setFormData] = useState<{
    nome: string
    pais: string
    logo: string
  }>({
    nome: '',
    pais: 'Brasil',
    logo: ''
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [campeonatosRes, timesRes] = await Promise.all([
        fetch('/api/campeonatos'),
        fetch('/api/times')
      ])

      const [campeonatosData, timesData] = await Promise.all([
        campeonatosRes.json(),
        timesRes.json()
      ])

      if (campeonatosData.success) setCampeonatos(campeonatosData.campeonatos)
      if (timesData.success) setTimes(timesData.times)
    } catch (error) {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (timesSelecionados.length === 0) {
      toast.error('Selecione pelo menos um time participante')
      return
    }

    try {
      const participantes = timesSelecionados.map(timeId => ({ timeId }))

      const url = editingCampeonato 
        ? `/api/campeonatos/${editingCampeonato.id}` 
        : '/api/campeonatos'
      const method = editingCampeonato ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, participantes })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingCampeonato ? 'Campeonato atualizado!' : 'Campeonato criado!')
        setDialogOpen(false)
        resetForm()
        carregarDados()
      } else {
        toast.error(data.error || 'Erro ao salvar campeonato')
      }
    } catch (error) {
      toast.error('Erro ao salvar campeonato')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este campeonato?')) return

    try {
      const response = await fetch(`/api/campeonatos/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        toast.success('Campeonato excluído!')
        carregarDados()
      } else {
        toast.error(data.error || 'Erro ao excluir campeonato')
      }
    } catch (error) {
      toast.error('Erro ao excluir campeonato')
    }
  }

  const openEditDialog = (campeonato: Campeonato) => {
    setEditingCampeonato(campeonato)
    setFormData({
      nome: campeonato.nome,
      pais: campeonato.pais,
      logo: campeonato.logo || ''
    })
    setTimesSelecionados(campeonato.participantes.map(p => p.timeId))
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingCampeonato(null)
    setTimesSelecionados([])
    setFormData({
      nome: '',
      pais: 'Brasil',
      logo: ''
    })
  }

  const toggleTime = (timeId: string) => {
    setTimesSelecionados(prev => 
      prev.includes(timeId) 
        ? prev.filter(id => id !== timeId)
        : [...prev, timeId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Campeonatos</h1>
          <p className="text-gray-600">Crie e organize os campeonatos da sua plataforma</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Campeonato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">{editingCampeonato ? 'Editar Campeonato' : 'Novo Campeonato'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                Configure o campeonato e selecione os times participantes.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="nome" className="text-gray-200">Nome do Campeonato *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Brasileirão Série A"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="pais" className="text-gray-200">País</Label>
                  <Input
                    id="pais"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    placeholder="Ex: Brasil"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="logo" className="text-gray-200">URL do Logo</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://exemplo.com/logo.png"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-gray-200">Times Participantes * ({timesSelecionados.length} selecionados)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto p-2 border rounded-md bg-gray-800 border-gray-600">
                  {times.map(time => (
                    <div
                      key={time.id}
                      onClick={() => toggleTime(time.id)}
                      className={`
                        flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                        ${timesSelecionados.includes(time.id) 
                          ? 'bg-blue-600 border-blue-400 border-2 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 border border-gray-500 text-gray-200'
                        }
                      `}
                    >
                      {time.escudo ? (
                        <img src={time.escudo} alt={time.nome} className="w-6 h-6 object-contain" />
                      ) : (
                        <Shield className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingCampeonato ? 'Atualizar' : 'Criar'} Campeonato
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campeonatos.map((campeonato) => (
          <Card key={campeonato.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {campeonato.logo ? (
                    <img src={campeonato.logo} alt={campeonato.nome} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <CardTitle className="text-lg">{campeonato.nome}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(campeonato)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(campeonato.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {campeonato.totalTimes} time(s)
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-2">Times participantes:</p>
                  <div className="flex flex-wrap gap-1">
                    {campeonato.participantes.slice(0, 20).map((p) => (
                      <div
                        key={p.timeId}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs"
                        title={p.nome}
                      >
                        {p.escudo && (
                          <img src={p.escudo} alt={p.nome} className="w-8 h-8 object-contain" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campeonatos.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum campeonato cadastrado</h3>
          <p className="text-gray-500">Clique em &quot;Novo Campeonato&quot; para começar</p>
        </div>
      )}
    </div>
  )
}
