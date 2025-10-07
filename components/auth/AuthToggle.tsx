'use client'

interface AuthToggleProps {
  isLogin: boolean
  onToggle: () => void
}

export function AuthToggle({ isLogin, onToggle }: AuthToggleProps) {
  return (
    <div className="text-center text-sm">
      <button
        type="button"
        onClick={onToggle}
        className="text-foreground hover:text-primary hover:underline font-medium transition-colors"
      >
        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
      </button>
    </div>
  )
}
