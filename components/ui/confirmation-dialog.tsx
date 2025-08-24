"use client"

import { ReactNode, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, XCircle, Loader2, Share, Copy } from "lucide-react"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "success" | "warning"
  onConfirm: () => void | Promise<void>
  loading?: boolean
  icon?: ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onConfirm,
  loading = false,
  icon
}: ConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
  }

  const getIcon = () => {
    if (icon) return icon

    switch (variant) {
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      default:
        return <Info className="h-6 w-6 text-blue-600" />
    }
  }

  const getButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive"
      case "success":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={handleConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Hook para facilitar o uso
export function useConfirmationDialog() {
  const [state, setState] = useState<Omit<ConfirmationDialogProps, 'onOpenChange'>>({
    open: false,
    title: "",
    description: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    variant: "default",
    onConfirm: () => {},
    loading: false
  })

  const showConfirmation = (options: Omit<ConfirmationDialogProps, 'open' | 'onOpenChange'>) => {
    setState({
      ...options,
      open: true
    })
  }

  const hideConfirmation = () => {
    setState({ ...state, open: false })
  }

  const setLoading = (loading: boolean) => {
    setState({ ...state, loading })
  }

  return {
    ...state,
    showConfirmation,
    hideConfirmation,
    setLoading
  }
}

// Dialog específico para sair do bolão
interface LeaveBolaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bolaoNome: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

export function LeaveBolaoDialog({ 
  open, 
  onOpenChange, 
  bolaoNome, 
  onConfirm, 
  loading 
}: LeaveBolaoDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sair do Bolão"
      description={`Tem certeza que deseja sair do bolão &quot;${bolaoNome}&quot;? Você perderá todos os seus palpites e não poderá mais participar.`}
      confirmText="Sim, Sair do Bolão"
      cancelText="Cancelar"
      variant="destructive"
      onConfirm={onConfirm}
      loading={loading}
    />
  )
}

// Dialog específico para deletar bolão
interface DeleteBolaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bolaoNome: string
  onConfirm: () => void | Promise<void>
  loading?: boolean
}

export function DeleteBolaoDialog({ 
  open, 
  onOpenChange, 
  bolaoNome, 
  onConfirm, 
  loading 
}: DeleteBolaoDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Excluir Bolão"
      description={`Tem certeza que deseja excluir o bolão &quot;${bolaoNome}&quot;? Esta ação não pode ser desfeita e todos os participantes perderão acesso.`}
      confirmText="Sim, Excluir Bolão"
      cancelText="Cancelar"
      variant="destructive"
      onConfirm={onConfirm}
      loading={loading}
    />
  )
}

// Dialog de compartilhamento
interface ShareBolaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bolaoNome: string
  codigoBolao: string
}

export function ShareBolaoDialog({ 
  open, 
  onOpenChange, 
  bolaoNome, 
  codigoBolao 
}: ShareBolaoDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    const text = `🏆 Venha participar do bolão "${bolaoNome}"!\n\n📋 Código: ${codigoBolao}\n\n🎯 Entre no Palpiteiros e use este código para participar!`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Share className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle>Compartilhar Bolão</DialogTitle>
          </div>
          <DialogDescription>
            Convide seus amigos para participar do bolão &quot;{bolaoNome}&quot;
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-600">Código do Bolão</div>
              <div className="text-2xl font-bold font-mono tracking-wider text-blue-600">
                {codigoBolao}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Como participar:</p>
              <ol className="space-y-1 text-xs">
                <li>1. Acesse o Palpiteiros</li>
                <li>2. Clique em &quot;Entrar em Bolão&quot;</li>
                <li>3. Digite o código: <strong>{codigoBolao}</strong></li>
                <li>4. Comece a fazer seus palpites!</li>
              </ol>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Fechar
          </Button>
          <Button onClick={copyToClipboard} className="w-full sm:w-auto">
            {copied ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copiar Convite
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}