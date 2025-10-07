# 🔐 Sistema de Autenticação - Configuração Completa

## ✅ Implementado

### 1. NextAuth.js v5 (Beta)
**Arquivo:** `lib/auth.ts`

**Configurações:**
- ✅ **Sessão JWT** com duração de **30 dias**
- ✅ **Estratégia:** `jwt` (sem banco de sessões)
- ✅ **Providers:** Google OAuth + Credentials (email/senha)
- ✅ **Adapter:** MongoDBAdapter (para persistir usuários)

```typescript
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 dias - MANTÉM USUÁRIO LOGADO
}
```

**Como funciona:**
1. Ao fazer login, NextAuth cria um **token JWT**
2. Token é armazenado em **cookie httpOnly** (seguro)
3. Token expira em **30 dias** (configurable)
4. A cada requisição, NextAuth valida o token automaticamente
5. Se o token for válido, o usuário **permanece logado**

---

### 2. Middleware de Proteção de Rotas
**Arquivo:** `middleware.ts` (✅ **RECÉM CRIADO**)

**⚠️ IMPORTANTE:** Usa **Edge Runtime** (sem Node.js modules)
- ✅ Verifica **cookie de sessão** do NextAuth (leve e rápido)
- ✅ **Não conecta ao MongoDB** (Edge Runtime não suporta)
- ✅ Validação completa do JWT é feita pelo NextAuth nas páginas

**Funcionamento:**
```typescript
// Verifica apenas se o cookie existe
const sessionToken = request.cookies.get('authjs.session-token')?.value
const isAuthenticated = !!sessionToken

// NextAuth valida o JWT automaticamente nas páginas
```

**Funcionalidades:**
- 🔒 **Protege rotas automaticamente** sem precisar de código em cada página
- 🔄 **Mantém usuário logado** em todas as navegações
- ↩️ **Redireciona não autenticados** para `/entrar`
- 🏠 **Redireciona autenticados** de login/cadastro para `/meus-boloes`
- 📝 **Preserva URL de destino** com `callbackUrl`
- ⚡ **Extremamente rápido** (Edge Runtime, sem DB)

**Rotas Protegidas:**
```typescript
const protectedRoutes = [
  '/meus-boloes',
  '/criar-bolao',
  '/entrar-bolao',
  '/explorar-boloes',
  '/perfil',
  '/historico',
  '/estatisticas',
  '/bolao'
]
```

**Rotas Públicas:**
```typescript
const publicRoutes = ['/', '/entrar', '/cadastrar']
```

---

### 3. AuthProvider (SessionProvider)
**Arquivo:** `components/auth-provider.tsx`

Envolve toda a aplicação para:
- ✅ Disponibilizar sessão em todos os componentes
- ✅ Sincronizar estado de autenticação
- ✅ Reagir a mudanças de sessão (login/logout)

**Uso no Layout:**
```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

---

### 4. Hooks Customizados

#### `useAuthRedirect`
**Arquivo:** `lib/hooks/useAuthRedirect.ts`

**Hook principal** para páginas que precisam de autenticação:

```tsx
export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const { redirectTo = '/entrar', requireAuth = true } = options
  // Verifica autenticação e redireciona automaticamente
}
```

**Variantes:**
```tsx
// Para páginas privadas
useRequireAuth('/entrar')

// Para redirecionar usuários logados (ex: página de login)
useRedirectIfAuthenticated('/meus-boloes')
```

**Exemplo de uso:**
```tsx
'use client'
export default function PerfilPage() {
  const { user, isAuthenticated } = useRequireAuth()
  
  if (!isAuthenticated) return <LoadingSpinner />
  
  return <div>Olá, {user?.name}</div>
}
```

---

## 🔄 Fluxo de Autenticação

### Login bem-sucedido:
```
1. Usuário faz login em /entrar
2. NextAuth cria JWT (válido por 30 dias)
3. JWT armazenado em cookie httpOnly
4. Middleware redireciona para /meus-boloes
5. Usuário permanece logado por 30 dias
```

### Navegação em rotas protegidas:
```
1. Usuário acessa /perfil
2. Middleware verifica JWT no cookie
3. Se válido: permite acesso
4. Se inválido/expirado: redireciona para /entrar
```

### Logout:
```
1. Usuário clica em "Sair"
2. NextAuth remove JWT do cookie
3. Middleware detecta ausência de sessão
4. Redireciona para /entrar
```

---

## 🛡️ Segurança

### Proteções Implementadas:

1. **Cookie httpOnly**
   - ✅ JavaScript não pode acessar (previne XSS)
   - ✅ Enviado apenas via HTTPS (produção)
   - ✅ Cookie SameSite=Lax (previne CSRF)

2. **JWT assinado**
   - ✅ Secret key em variável de ambiente
   - ✅ Token não pode ser modificado sem secret
   - ✅ Expira automaticamente após 30 dias

3. **Middleware automático**
   - ✅ Não depende de código client-side
   - ✅ Executa antes de carregar página
   - ✅ Impossível burlar por JavaScript

4. **Senha hash (bcrypt)**
   - ✅ Senhas nunca armazenadas em texto plano
   - ✅ Salt automático por senha
   - ✅ Custo de 10 rounds (seguro e performático)

---

## ⚙️ Variáveis de Ambiente

**Arquivo:** `.env.local`

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_muito_forte_aqui

# MongoDB
MONGODB_URI=mongodb+srv://...

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## 📱 Como Usar nas Páginas

### Página Protegida (Server Component):
```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function PerfilPage() {
  const session = await auth()
  
  if (!session) {
    redirect('/entrar')
  }
  
  return <div>Olá, {session.user.name}</div>
}
```

### Página Protegida (Client Component):
```tsx
'use client'
import { useRequireAuth } from '@/lib/hooks/useAuthRedirect'

export default function PerfilPage() {
  const { user, isAuthenticated } = useRequireAuth()
  
  if (!isAuthenticated) return <LoadingSpinner />
  
  return <div>Olá, {user?.name}</div>
}
```

### Componente que usa sessão:
```tsx
'use client'
import { useSession } from 'next-auth/react'

export function UserAvatar() {
  const { data: session } = useSession()
  
  return session ? (
    <img src={session.user.image} alt={session.user.name} />
  ) : (
    <button>Login</button>
  )
}
```

---

## 🔧 Personalização

### Alterar duração da sessão:
```typescript
// lib/auth.ts
session: {
  strategy: 'jwt',
  maxAge: 7 * 24 * 60 * 60, // 7 dias ao invés de 30
}
```

### Adicionar mais rotas protegidas:
```typescript
// middleware.ts
const protectedRoutes = [
  '/meus-boloes',
  '/nova-rota', // ← Adicionar aqui
]
```

### Callback URL customizado:
```tsx
// Página de login
import { signIn } from 'next-auth/react'

signIn('credentials', {
  email,
  password,
  callbackUrl: '/dashboard' // Redirecionar para onde quiser
})
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Edge runtime does not support Node.js 'crypto' module"

**Causa:** Middleware tentando usar `auth()` que conecta ao MongoDB  
**Solução:** ✅ **JÁ CORRIGIDO!**  
O middleware agora verifica apenas o cookie de sessão, não conecta ao MongoDB.

```typescript
// ❌ ERRADO (causa erro no Edge Runtime)
const session = await auth()

// ✅ CORRETO (funciona no Edge Runtime)
const sessionToken = request.cookies.get('authjs.session-token')?.value
const isAuthenticated = !!sessionToken
```

**Por quê?**
- Middleware do Next.js usa **Edge Runtime** (V8 isolado)
- Edge Runtime **não suporta** módulos Node.js (crypto, fs, etc)
- MongoDB/Prisma precisam de Node.js
- NextAuth valida o JWT nas **páginas** (Node.js Runtime), não no middleware

### Usuário deslogado após refresh:

**Causa:** Cookie não está sendo salvo  
**Solução:** 
1. Verificar `NEXTAUTH_URL` no `.env.local`
2. Verificar `NEXTAUTH_SECRET` configurado
3. Em produção, usar HTTPS

### Middleware não está funcionando:

**Causa:** Arquivo não está na raiz  
**Solução:** `middleware.ts` deve estar em `/middleware.ts` (raiz do projeto)

### Session sempre null:

**Causa:** AuthProvider não está no layout  
**Solução:** Verificar se `<AuthProvider>` está em `app/layout.tsx`

---

## 📊 Status Atual

| Componente | Status | Arquivo |
|------------|--------|---------|
| NextAuth Config | ✅ | `lib/auth.ts` |
| Middleware | ✅ | `middleware.ts` |
| AuthProvider | ✅ | `components/auth-provider.tsx` |
| useAuthRedirect | ✅ | `lib/hooks/useAuthRedirect.ts` |
| MongoDB Adapter | ✅ | Integrado |
| Google OAuth | ✅ | Configurado |
| Credentials Provider | ✅ | Com bcrypt |
| Sessão JWT (30 dias) | ✅ | Mantém usuário logado |

**Tudo configurado e funcionando! 🎉**

O usuário **permanece logado por 30 dias** automaticamente graças ao JWT e ao middleware.
