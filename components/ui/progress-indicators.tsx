"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, AlertCircle, Clock, Trophy } from "lucide-react"

interface ProgressStep {
  id: string
  title: string
  description?: string
  status: "completed" | "current" | "pending" | "error"
}

interface StepProgressProps {
  steps: ProgressStep[]
  className?: string
}

export function StepProgress({ steps, className = "" }: StepProgressProps) {
  const completedSteps = steps.filter(step => step.status === "completed").length
  const progressPercentage = (completedSteps / steps.length) * 100

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "current":
        return (
          <div className="h-5 w-5 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          </div>
        )
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case "completed":
        return "text-green-600"
      case "error":
        return "text-red-600"  
      case "current":
        return "text-blue-600"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Progresso</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            {getStepIcon(step)}
            <div className="flex-1 min-w-0">
              <div className={`font-medium ${getStepColor(step)}`}>
                {step.title}
              </div>
              {step.description && (
                <div className="text-sm text-gray-500 mt-1">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Progress Indicator para formulários
interface FormProgressProps {
  totalSteps: number
  currentStep: number
  stepTitles?: string[]
  className?: string
}

export function FormProgress({ 
  totalSteps, 
  currentStep, 
  stepTitles, 
  className = "" 
}: FormProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>Passo {currentStep} de {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% completo</span>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      {stepTitles && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`text-center p-2 rounded ${
                index + 1 === currentStep 
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : index + 1 < currentStep
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              {title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente específico para progresso de palpites
interface PalpitesProgressProps {
  totalJogos: number
  palpitesFeitos: number
  className?: string
}

export function PalpitesProgress({ 
  totalJogos, 
  palpitesFeitos, 
  className = "" 
}: PalpitesProgressProps) {
  const progressPercentage = totalJogos > 0 ? (palpitesFeitos / totalJogos) * 100 : 0
  
  const getProgressColor = () => {
    if (progressPercentage >= 80) return "bg-green-500"
    if (progressPercentage >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getProgressText = () => {
    if (progressPercentage === 100) return "🏆 Todos os palpites feitos!"
    if (progressPercentage >= 80) return "🔥 Quase lá!"
    if (progressPercentage >= 50) return "👍 Boa, continue assim!"
    if (progressPercentage > 0) return "⚡ Você começou bem!"
    return "🎯 Comece seus palpites!"
  }

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Progresso dos Palpites
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm font-medium">
          <span>{palpitesFeitos} de {totalJogos} palpites</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="relative">
          <Progress value={progressPercentage} className="h-3" />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center text-sm font-medium text-gray-700">
          {getProgressText()}
        </div>
      </CardContent>
    </Card>
  )
}

// Progress para ranking/posição
interface RankingProgressProps {
  posicaoAtual: number
  totalParticipantes: number
  pontosAtual: number
  proximaPosicaoPontos?: number
  className?: string
}

export function RankingProgress({ 
  posicaoAtual, 
  totalParticipantes, 
  pontosAtual, 
  proximaPosicaoPontos,
  className = "" 
}: RankingProgressProps) {
  // Calcular progresso baseado na posição (invertido - 1º lugar = 100%)
  const progressPercentage = ((totalParticipantes - posicaoAtual + 1) / totalParticipantes) * 100
  
  const getPositionColor = () => {
    if (posicaoAtual === 1) return "bg-yellow-500"
    if (posicaoAtual <= 3) return "bg-blue-500"
    if (posicaoAtual <= totalParticipantes / 2) return "bg-green-500"
    return "bg-gray-500"
  }

  const getPositionText = () => {
    if (posicaoAtual === 1) return "🏆 Você está em 1º!"
    if (posicaoAtual <= 3) return `🏅 ${posicaoAtual}º lugar - Pódium!`
    if (posicaoAtual <= totalParticipantes / 2) return `👍 ${posicaoAtual}º lugar - Boa posição!`
    return `📈 ${posicaoAtual}º lugar - Vamos subir!`
  }

  return (
    <Card className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Sua Posição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {posicaoAtual}º de {totalParticipantes}
          </span>
          <span className="text-lg font-bold text-yellow-600">
            {pontosAtual} pts
          </span>
        </div>
        
        <div className="relative">
          <Progress value={progressPercentage} className="h-3" />
          <div 
            className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getPositionColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-center text-sm font-medium text-gray-700">
          {getPositionText()}
        </div>
        
        {proximaPosicaoPontos && proximaPosicaoPontos > pontosAtual && (
          <div className="text-xs text-gray-600 text-center bg-gray-50 p-2 rounded">
            📊 Próxima posição: {proximaPosicaoPontos - pontosAtual} pontos
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Mini progress bar simples
interface MiniProgressProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: "default" | "success" | "warning" | "danger"
  className?: string
}

export function MiniProgress({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true, 
  color = "default",
  className = "" 
}: MiniProgressProps) {
  const percentage = (value / max) * 100

  const getColorClass = () => {
    switch (color) {
      case "success": return "bg-green-500"
      case "warning": return "bg-yellow-500"
      case "danger": return "bg-red-500"
      default: return "bg-blue-500"
    }
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-xs text-gray-600">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}