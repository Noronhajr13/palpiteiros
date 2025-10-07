import { Label } from '@/components/ui/label'
import { Users } from 'lucide-react'

interface ParticipantSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: string
}

const participantOptions = [
  { value: '2', label: '2 participantes (Duelo)' },
  { value: '5', label: '5 participantes (Pequeno)' },
  { value: '10', label: '10 participantes (Médio)' },
  { value: '15', label: '15 participantes (Grande)' },
  { value: '20', label: '20 participantes (Extra Grande)' },
  { value: '30', label: '30 participantes (Corporativo)' },
  { value: '50', label: '50 participantes (Comunidade)' },
  { value: '100', label: '100 participantes (Mega)' },
]

export function ParticipantSelector({ value, onChange, disabled, error }: ParticipantSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="maxParticipantes" className="text-foreground font-medium">
        Número de Participantes *
      </Label>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <select
          id="maxParticipantes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {participantOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">
        Escolha quantos participantes poderão entrar no bolão
      </p>
    </div>
  )
}
