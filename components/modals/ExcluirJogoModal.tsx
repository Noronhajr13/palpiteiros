'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface Jogo {
  id: string
  timeAId?: string
  timeBId?: string
  timeA: string
  timeB: string
  data: string
  rodada: number
}

interface ExcluirJogoModalProps {
  jogo: Jogo | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function ExcluirJogoModal({ jogo, isOpen, onClose, onConfirm, loading = false }: ExcluirJogoModalProps) {
  if (!isOpen || !jogo) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card/95 backdrop-blur border border-border rounded-lg w-full max-w-md">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Excluir Jogo</h2>
            </div>
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
            <p className="text-muted-foreground">
              Tem certeza que deseja excluir este jogo? Esta ação não pode ser desfeita.
            </p>
            
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Confronto:</span>
                  <span className="font-medium text-foreground">{jogo.timeA} vs {jogo.timeB}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rodada:</span>
                  <span className="font-medium text-foreground">{jogo.rodada}ª rodada</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data:</span>
                  <span className="font-medium text-foreground">
                    {new Date(jogo.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Só é possível excluir jogos que ainda não possuem palpites.
              </p>
            </div>
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
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Excluindo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Excluir Jogo
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
