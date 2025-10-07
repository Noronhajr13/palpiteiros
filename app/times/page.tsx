'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Edit, Trash2, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface Time {
  id: string
  nome: string
  escudo?: string
  sigla: string
  fundacao?: string
  estadio?: string
  cidade?: string
  estado?: string
  ativo: boolean
}

export default function TimesPage() {
  const [times, setTimes] = useState<Time[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTime, setEditingTime] = useState<Time | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    escudo: ''
  })

  useEffect(() => {
    carregarTimes()
  }, [])

  const carregarTimes = async () => {
    try {
      const response = await fetch('/api/times')
      const data = await response.json()
      
      if (data.success) {
        setTimes(data.times)
      }
    } catch (error) {
      toast.error('Erro ao carregar times')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingTime ? `/api/times/${editingTime.id}` : '/api/times'
      const method = editingTime ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingTime ? 'Time atualizado!' : 'Time criado!')
        setDialogOpen(false)
        resetForm()
        carregarTimes()
      } else {
        toast.error(data.error || 'Erro ao salvar time')
      }
    } catch (error) {
      toast.error('Erro ao salvar time')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este time?')) return

    try {
      const response = await fetch(`/api/times/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        toast.success('Time excluído!')
        carregarTimes()
      } else {
        toast.error(data.error || 'Erro ao excluir time')
      }
    } catch (error) {
      toast.error('Erro ao excluir time')
    }
  }

  const openEditDialog = (time: Time) => {
    setEditingTime(time)
    setFormData({
      nome: time.nome,
      escudo: time.escudo || ''
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingTime(null)
    setFormData({
      nome: '',
      escudo: ''
    })
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
          <h1 className="text-3xl font-bold">Gerenciar Times</h1>
          <p className="text-gray-600">Cadastre e gerencie os times que participarão dos campeonatos</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Time
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-900 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">{editingTime ? 'Editar Time' : 'Novo Time'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                Preencha os dados do time. Campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="nome" className="text-gray-200">Nome do Time *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Flamengo"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="escudo" className="text-gray-200">URL do Escudo</Label>
                  <Input
                    id="escudo"
                    type="url"
                    value={formData.escudo}
                    onChange={(e) => setFormData({ ...formData, escudo: e.target.value })}
                    placeholder="https://exemplo.com/escudo.png"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTime ? 'Atualizar' : 'Criar'} Time
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {times.map((time) => (
          <Card key={time.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {time.escudo ? (
                    <img src={time.escudo} alt={time.nome} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{time.nome}</CardTitle>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(time)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(time.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {times.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum time cadastrado</h3>
          <p className="text-gray-500">Clique em &quot;Novo Time&quot; para começar</p>
        </div>
      )}
    </div>
  )
}
