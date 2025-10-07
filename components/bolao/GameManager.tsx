'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'

export interface Jogo {
  id: string
  bolao: string
  campeonato: string
  rodada: string
  timeCasa: string
  timeFora: string
  data: string
  horario: string
}

interface GameManagerProps {
  games: Jogo[]
  onChange: (games: Jogo[]) => void
  disabled?: boolean
  bolaoNome?: string // Nome do bolão para preencher automaticamente
}

export function GameManager({ games, onChange, disabled, bolaoNome }: GameManagerProps) {
  const [bolao, setBolao] = useState(bolaoNome || '')
  const [campeonato, setCampeonato] = useState('')
  const [rodada, setRodada] = useState('')
  const [timeCasa, setTimeCasa] = useState('')
  const [timeFora, setTimeFora] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')

  const handleAddGame = () => {
    if (!bolao.trim() || !campeonato.trim() || !rodada.trim() || !timeCasa.trim() || !timeFora.trim() || !data || !horario) {
      toast.error('Preencha todos os campos obrigatórios do jogo')
      return
    }

    const novoJogo: Jogo = {
      id: Date.now().toString(),
      bolao: bolao.trim(),
      campeonato: campeonato.trim(),
      rodada: rodada.trim(),
      timeCasa: timeCasa.trim(),
      timeFora: timeFora.trim(),
      data,
      horario
    }

    onChange([...games, novoJogo])
    
    // Limpar campos (exceto bolao que pode ser reutilizado)
    setCampeonato('')
    setRodada('')
    setTimeCasa('')
    setTimeFora('')
    setData('')
    setHorario('')
    
    toast.success('Jogo adicionado com sucesso!')
  }

  const handleRemoveGame = (id: string) => {
    onChange(games.filter(jogo => jogo.id !== id))
    toast.success('Jogo removido')
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Jogos do Bolão
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Adicione os jogos que farão parte do bolão (opcional, pode adicionar depois)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário de Adicionar Jogo */}
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="space-y-2">
            <Label htmlFor="bolao" className="text-foreground">Bolão *</Label>
            <Input
              id="bolao"
              placeholder="Ex: Brasileirão 2024"
              value={bolao}
              onChange={(e) => setBolao(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campeonato" className="text-foreground">Campeonato *</Label>
            <Input
              id="campeonato"
              placeholder="Ex: Brasileiro Série A"
              value={campeonato}
              onChange={(e) => setCampeonato(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rodada" className="text-foreground">Rodada *</Label>
            <Input
              id="rodada"
              placeholder="Ex: Rodada 1, Oitavas, etc."
              value={rodada}
              onChange={(e) => setRodada(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeCasa" className="text-foreground">Time da Casa *</Label>
            <Input
              id="timeCasa"
              placeholder="Ex: Flamengo"
              value={timeCasa}
              onChange={(e) => setTimeCasa(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeFora" className="text-foreground">Time Visitante *</Label>
            <Input
              id="timeFora"
              placeholder="Ex: Palmeiras"
              value={timeFora}
              onChange={(e) => setTimeFora(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data" className="text-foreground">Data *</Label>
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="horario" className="text-foreground">Horário *</Label>
            <Input
              id="horario"
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              disabled={disabled}
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="button"
              onClick={handleAddGame}
              disabled={disabled}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Jogo
            </Button>
          </div>
        </div>

        {/* Lista de Jogos Adicionados */}
        {games.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              Jogos Cadastrados ({games.length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {games.map((jogo, index) => (
                <div
                  key={jogo.id}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">#{index + 1}</span>
                      <span>{jogo.timeCasa}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span>{jogo.timeFora}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">{jogo.campeonato}</span> • {jogo.rodada}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(jogo.data).toLocaleDateString('pt-BR')} às {jogo.horario}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGame(jogo.id)}
                    disabled={disabled}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {games.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Nenhum jogo cadastrado ainda</p>
            <p className="text-xs mt-1">Adicione jogos usando o formulário acima</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
