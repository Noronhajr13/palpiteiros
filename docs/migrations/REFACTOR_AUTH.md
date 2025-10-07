# Refatoração de Autenticação - NextAuth

## 📋 Resumo

Todas as páginas do projeto foram padronizadas para usar **NextAuth** (`useSession`) em vez do Zustand `useAuthStore`.

## ✅ Páginas Refatoradas

| Página | Status | Observações |
|--------|--------|-------------|
| `/meus-boloes` | ✅ Completo | Usa NextAuth + carrega bolões corretamente |
| `/bolao/[id]` | ✅ Completo | Usa NextAuth |
| `/bolao/[id]/jogos` | ✅ Completo | Usa NextAuth + auto-carrega jogos |
| `/bolao/[id]/palpites` | ✅ Completo | Usa NextAuth |
| `/bolao/[id]/ranking` | ✅ Completo | Usa NextAuth |
| `/entrar-bolao` | ✅ Completo | Usa NextAuth |
| `/perfil` | ✅ Completo | Usa NextAuth |
| `/estatisticas` | ✅ Completo | Usa NextAuth |

## 🔄 Padrão Implementado

### Antes (useAuthStore - Zustand):
```tsx
import { useAuthStore } from '@/lib/stores/useAuthStoreDB'

export default function Page() {
  const { user, isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    router.push('/entrar')
    return null
  }
  
  // user.id pode ser undefined
}
```

### Depois (useSession - NextAuth):
```tsx
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/entrar')
    }
  }, [status, router])
  
  if (status === 'loading') {
    return <LoadingSpinner />
  }
  
  const user = session?.user
  if (!user) return null
  
  // user.id sempre existe se user existe
}
```

## 🎯 Benefícios

1. **Fonte Única de Verdade**: NextAuth é a única fonte de autenticação
2. **Sincronização Automática**: Não há discrepância entre Zustand e NextAuth
3. **Type Safety**: TypeScript garante que user.id existe
4. **Loading States**: States de loading consistentes
5. **Redirecionamento Confiável**: useEffect garante redirecionamento correto

## 📦 Hooks Afetados

Os seguintes hooks ainda usam `useAuthStore` e precisam ser refatorados ou ter seus usos substituídos:

- `lib/hooks/useUserProfileAPI.ts` - Usa useAuthStore
- `lib/hooks/useHistoricoPalpitesAPI.ts` - Usa useAuthStore

**Ação**: Considerar passar `userId` como parâmetro em vez de buscar do store.

## 🚀 Próximos Passos

1. ✅ Refatorar página de gerenciamento de jogos para usar times do campeonato
2. ⏳ Adicionar seletor de times (dropdown) em vez de input manual
3. ⏳ Carregar times do campeonato associado ao bolão
4. ⏳ Validar se times selecionados pertencem ao campeonato
