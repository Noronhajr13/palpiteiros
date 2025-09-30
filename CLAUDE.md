### IMPORTANTE

**Sempre responda em português**

# 🎯 PALPITEIROS - PROJETO ATUAL

## ✅ TECH STACK ATUAL

### 🚀 **Frontend:**
- **Framework:** Next.js 15.5.0 (App Router)
- **React:** 19.1.0 + TypeScript 5
- **Estilização:** Tailwind CSS 4 + shadcn/ui
- **Estado:** Zustand 5.0.8
- **Formulários:** React Hook Form + Zod 4.1.0
- **Animações:** Framer Motion 12.23.12
- **Gráficos:** Recharts 3.1.2
- **Notificações:** Sonner 2.0.7 + React Hot Toast
- **Ícones:** Lucide React 0.541.0

### 🗄️ **Backend:**
- **Database:** SQLite local (dev.db)
- **ORM:** Prisma 6.16.2
- **APIs:** Next.js API Routes
- **Runtime:** Node.js + tsx 4.20.6

### 🏗️ **Arquitetura:**
- **Client-Server:** Separação completa
- **APIs:** RESTful com fetch()
- **Estado:** Zustand stores baseados em APIs
- **Database:** Prisma apenas no servidor
- **Scripts:** Utilitários CLI com tsx

## 📊 STATUS ATUAL DO PROJETO

### ✅ **Migração Completa:**
- ❌ **Supabase removido** totalmente
- ✅ **SQLite + Prisma** implementado
- ✅ **5 tabelas criadas:** users, boloes, participantes, jogos, palpites
- ✅ **APIs funcionais:** auth + bolões
- ✅ **Build funcionando:** 18 rotas compilando
- ✅ **Arquitetura correta:** Client/Server separados

### 🎯 **Funcionalidades Ativas:**
- ✅ **Autenticação:** Login/Registro com banco real
- ✅ **Bolões:** CRUD completo via APIs
- ✅ **Palpites:** Sistema implementado
- ✅ **Dashboard:** Estatísticas dinâmicas
- ✅ **Ranking:** Participantes e pontuação
- ✅ **Scripts:** Utilitários para gestão de dados

### 🧪 **Dados de Teste:**
- ✅ **Usuário:** `noronhajf22@gmail.com` / `1234`
- ✅ **1 bolão** com 10 jogos criado
- ✅ **Seed script** funcional

## 🏗️ ESTRUTURA COMPLETA DO PROJETO

```
palpiteiros/
├── 🗄️ prisma/                    # Database
│   ├── schema.prisma             # ✅ Schema SQLite 5 tabelas
│   ├── seed.ts                   # ✅ Script de população
│   └── dev.db                    # ✅ Banco SQLite local
│
├── 🚀 app/                       # Next.js App Router
│   ├── api/                      # ✅ Server-side APIs
│   │   ├── auth/
│   │   │   ├── login/route.ts    # ✅ API Login
│   │   │   └── register/route.ts # ✅ API Registro
│   │   └── bolao/
│   │       ├── criar/route.ts    # ✅ API Criar bolão
│   │       ├── entrar/route.ts   # ✅ API Entrar bolão
│   │       └── listar/route.ts   # ✅ API Listar bolões
│   │
│   ├── page.tsx                  # ✅ Landing page
│   ├── entrar/page.tsx           # ✅ Login
│   ├── cadastrar/page.tsx        # ✅ Registro
│   ├── meus-boloes/page.tsx      # ✅ Dashboard
│   ├── criar-bolao/page.tsx      # ✅ Criar bolão
│   ├── entrar-bolao/page.tsx     # ✅ Entrar bolão
│   ├── bolao/[id]/
│   │   ├── page.tsx              # ✅ Página do bolão
│   │   ├── palpites/page.tsx     # ✅ Interface palpites
│   │   └── ranking/page.tsx      # ✅ Ranking
│   ├── estatisticas/page.tsx     # ✅ Estatísticas
│   ├── historico/page.tsx        # ✅ Histórico
│   └── perfil/page.tsx           # ✅ Perfil usuário
│
├── 🧩 lib/                       # Utilitários
│   ├── prisma.ts                 # ✅ Cliente Prisma
│   ├── stores/                   # ✅ Zustand Stores
│   │   ├── useAuthStoreDB.ts     # ✅ Auth via API
│   │   ├── useBolaoStoreAPI.ts   # ✅ Bolões via API
│   │   ├── useAuthStore.ts       # ✅ Auth mock (backup)
│   │   └── useBolaoStore.ts      # ✅ Bolões mock (backup)
│   ├── hooks/                    # ✅ Custom Hooks
│   │   ├── useDashboardDataAPI.ts# ✅ Dashboard com APIs
│   │   ├── useAuthRedirect.ts    # ✅ Redirecionamento
│   │   ├── useFormHandler.ts     # ✅ Formulários
│   │   └── outros...
│   └── utils.ts                  # ✅ Utilitários gerais
│
├── 🎨 components/ui/             # shadcn/ui + customizados
│   ├── button.tsx                # ✅ Botões
│   ├── card.tsx                  # ✅ Cards
│   ├── dialog.tsx                # ✅ Modais
│   ├── form.tsx                  # ✅ Formulários
│   ├── animations.tsx            # ✅ Animações
│   ├── loading-skeletons.tsx     # ✅ Loading states
│   ├── empty-states.tsx          # ✅ Estados vazios
│   └── outros...
│
└── 🔧 scripts/                   # CLI Utilitários
    ├── inserir-jogos.ts          # ✅ Inserir jogos
    ├── templates-jogos.ts        # ✅ Templates jogos
    ├── finalizar-jogos.ts        # ✅ Finalizar jogos
    ├── listar-jogos.ts           # ✅ Listar jogos
    ├── verificar-usuario.ts      # ✅ Debug usuário
    ├── verificar-boloes.ts       # ✅ Debug bolões
    └── teste-login.ts            # ✅ Teste login
```

## 🎯 ESTRATÉGIA PRÓXIMA FASE

### 🚀 **Prioridades Imediatas:**

1. **🐛 Correções de Build**
   - Resolver warnings de ESLint (`_jogoId`, `_placarA`, etc.)
   - Corrigir `ReferenceError: location is not defined` em páginas SSR
   - Otimizar performance e bundle size

2. **🔧 Refinamentos de API**
   - Implementar API de palpites (`/api/palpites/salvar`)
   - Adicionar validações de entrada mais robustas
   - Implementar middleware de autenticação

3. **✨ Funcionalidades Pendentes**
   - Sistema de pontuação automática
   - Notificações em tempo real
   - Upload de imagens de perfil
   - Histórico detalhado de palpites

4. **📱 Melhorias de UX**
   - Loading states mais inteligentes
   - Feedback visual aprimorado
   - Mobile experience refinado
   - Otimizações de performance

### 🏗️ **Arquitetura Sólida:**
- ✅ Client/Server separation
- ✅ API-based communication  
- ✅ Type-safe database operations
- ✅ Scalable project structure

### 📊 **Métricas Atuais:**
- **Build:** ✅ 18 rotas compilando
- **Performance:** ✅ 102kB shared bundle
- **TypeScript:** ✅ Zero errors, apenas warnings
- **Database:** ✅ 5 tabelas relacionais
- **APIs:** ✅ 5 endpoints funcionais

### MELHORIAS FUTURAS

- **Geração de Regras Contextuais:**
Se você identificar contextos ou padrões específicos que provavelmente serão reutilizados em conversas futuras, adicione uma nova linha, começando com❗Regra recomendada: seguida dos detalhes da regra. Isso ajuda a manter a consistência e a aproveitar o contexto anterior em interações futuras.

- **Sugestão de Refatoração Proativa:**
Ao analisar exemplos de código, se forem identificados potenciais gargalos de desempenho ou problemas de manutenibilidade, proponha proativamente sugestões de refatoração ou otimização de código. Essas propostas devem ser prefixadas com um emoji 🤔 (por exemplo, "🤔 Proposta de Refatoração: ...") para identificá-las facilmente. No entanto, não implemente essas alterações imediatamente; aguarde a confirmação explícita na próxima resposta antes de aplicar quaisquer modificações.

❗**Regra recomendada:** Para projetos Next.js com Zustand, sempre criar hooks customizados para padrões que aparecem em 3+ componentes, incluindo: autenticação com redirecionamento, estados de loading, e manipulação de formulários.

❗**Regra recomendada:** Usar TypeScript rigoroso sem 'any' types, implementar debounce/throttle para otimização de performance, e criar utilitários reutilizáveis para formatação e validação.

❗**Regra recomendada:** Antes da integração backend, sempre refatorar código repetitivo em hooks customizados para facilitar a migração dos dados mock para API real.

