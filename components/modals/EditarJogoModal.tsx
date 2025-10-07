'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Save } from 'lucide-react'

interface Jogo {
  id: string
  timeAId?: string
  timeBId?: string
  timeA: string
  timeB: string
  data: string
  rodada: number
  status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
  placarA: number | null
  placarB: number | null
}

interface DadosJogoAtualizado {
  timeAId?: string
  timeBId?: string
  timeA?: string
  timeB?: string
  data: string
  rodada: number
  status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
  placarA: number | null
  placarB: number | null
}

interface EditarJogoModalProps {
  jogo: Jogo | null
  isOpen: boolean
  onClose: () => void
  onSave: (jogoId: string, dadosAtualizados: DadosJogoAtualizado) => Promise<void>
  loading?: boolean
}

export function EditarJogoModal({ jogo, isOpen, onClose, onSave, loading = false }: EditarJogoModalProps) {
  const [formData, setFormData] = useState<{
    timeA: string
    timeB: string
    data: string
    rodada: number
    status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
    placarA: string
    placarB: string
  }>({
    timeA: '',
    timeB: '',
    data: '',
    rodada: 1,
    status: 'agendado',
    placarA: '',
    placarB: ''
  })

  // Carregar dados do jogo quando o modal abrir
  useEffect(() => {
    if (isOpen && jogo) {
      const dataFormatada = new Date(jogo.data).toISOString().slice(0, 16)
      
      setFormData({
        timeA: jogo.timeA,
        timeB: jogo.timeB,
        data: dataFormatada,
        rodada: jogo.rodada,
        status: jogo.status,
        placarA: jogo.placarA?.toString() || '',
        placarB: jogo.placarB?.toString() || ''
      })
    }
  }, [isOpen, jogo])

  const handleSave = async () => {
    if (!jogo) return

    try {
      let dadosParaEnvio: DadosJogoAtualizado

      // Só incluir placares se o status for finalizado
      if (formData.status === 'finalizado') {
        dadosParaEnvio = {
          timeA: formData.timeA.trim(),
          timeB: formData.timeB.trim(),
          data: formData.data,
          rodada: formData.rodada,
          status: formData.status,
          placarA: parseInt(formData.placarA) || 0,
          placarB: parseInt(formData.placarB) || 0
        }
      } else {
        dadosParaEnvio = {
          timeA: formData.timeA.trim(),
          timeB: formData.timeB.trim(),
          data: formData.data,
          rodada: formData.rodada,
          status: formData.status,
          placarA: null,
          placarB: null
        }
      }

      await onSave(jogo.id, dadosParaEnvio)
      onClose()
    } catch {
      // Erro já tratado no hook
    }
  }

  if (!isOpen || !jogo) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card/95 backdrop-blur border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Editar Jogo</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeA">Time A</Label>
                <Input
                  id="timeA"
                  value={formData.timeA}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeA: e.target.value }))}
                  disabled={loading}
                  className="bg-input border-border"
                  placeholder="Ex: Flamengo"
                />
              </div>
              <div>
                <Label htmlFor="timeB">Time B</Label>
                <Input
                  id="timeB"
                  value={formData.timeB}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeB: e.target.value }))}
                  disabled={loading}
                  className="bg-input border-border"
                  placeholder="Ex: Palmeiras"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data e Hora</Label>
                <Input
                  id="data"
                  type="datetime-local"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  disabled={loading}
                  className="bg-input border-border"
                />
              </div>
              <div>
                <Label htmlFor="rodada">Rodada</Label>
                <Input
                  id="rodada"
                  type="number"
                  min="1"
                  value={formData.rodada}
                  onChange={(e) => setFormData(prev => ({ ...prev, rodada: parseInt(e.target.value) || 1 }))}
                  disabled={loading}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => {
                  const novoStatus = e.target.value as 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
                  setFormData(prev => ({ 
                    ...prev, 
                    status: novoStatus,
                    placarA: novoStatus !== 'finalizado' ? '' : prev.placarA,
                    placarB: novoStatus !== 'finalizado' ? '' : prev.placarB
                  }))
                }}
                disabled={loading}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
              >
                <option value="agendado">Agendado</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
                <option value="adiado">Adiado</option>
              </select>
            </div>

            {formData.status === 'finalizado' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <Label htmlFor="placarA" className="text-primary">Placar Time A</Label>
                  <Input
                    id="placarA"
                    type="number"
                    min="0"
                    value={formData.placarA}
                    onChange={(e) => setFormData(prev => ({ ...prev, placarA: e.target.value }))}
                    disabled={loading}
                    className="bg-input border-border"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="placarB" className="text-primary">Placar Time B</Label>
                  <Input
                    id="placarB"
                    type="number"
                    min="0"
                    value={formData.placarB}
                    onChange={(e) => setFormData(prev => ({ ...prev, placarB: e.target.value }))}
                    disabled={loading}
                    className="bg-input border-border"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !formData.timeA || !formData.timeB}
              className="flex-1 gradient-primary"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
