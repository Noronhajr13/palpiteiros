# Sistema de Autorização de Bolões - Documentação Completa

## 📋 Visão Geral

Sistema completo para explorar bolões públicos e gerenciar solicitações de entrada com aprovação por parte do administrador do bolão.

---

## 🔑 Status de Participantes

### Estados Possíveis:

```typescript
type StatusParticipante = 'pendente' | 'aprovado' | 'bloqueado' | 'recusado'
```

| Status | Descrição | Pode Palpitar? | Aparece no Ranking? |
|--------|-----------|----------------|---------------------|
| `pendente` | Solicitação aguardando aprovação | ❌ Não | ❌ Não |
| `aprovado` | Participante autorizado | ✅ Sim | ✅ Sim |
| `bloqueado` | Bloqueado pelo admin | ❌ Não | ❌ Não |
| `recusado` | Solicitação recusada | ❌ Não | ❌ Não |

---

## 📦 Estrutura de Dados

### Interface ParticipanteComStatus

```typescript
export interface ParticipanteComStatus {
  id: string
  nome: string
  avatar?: string | null
  pontos: number
  posicao: number
  status: 'pendente' | 'aprovado' | 'bloqueado' | 'recusado'
  solicitadoEm?: string      // Data da solicitação
  aprovadoEm?: string         // Data da aprovação
}
```

### Interface BolaoPublico

```typescript
export interface BolaoPublico {
  id: string
  nome: string
  descricao: string
  codigo: string
  admin: string               // ID do admin
  adminNome: string           // Nome do admin
  maxParticipantes: number
  participantes: ParticipanteComStatus[]
  totalJogos: number
  status: 'ativo' | 'finalizado' | 'pausado'
  tipoAcesso: 'publico' | 'privado' | 'codigo'
  criadoEm: string
  premios?: {
    primeiro?: string
    segundo?: string
    terceiro?: string
  }
}
```

---

## 🎯 Tipos de Acesso aos Bolões

### 1. Público (publico)
- **Visível para todos** na página de exploração
- **Solicitação de entrada** enviada automaticamente
- **Requer aprovação** do administrador
- ✅ **Entrada automática** se bolão configurado para isso

### 2. Com Código (codigo)
- **Visível para todos** na página de exploração
- **Requer código** para solicitar entrada
- **Solicitação de entrada** enviada após validar código
- **Requer aprovação** do administrador

### 3. Privado (privado)
- **NÃO aparece** na listagem pública
- **Apenas por convite** direto do admin
- **Código obrigatório** para entrar

---

## 🚀 Componentes Criados

### 1. Página: `/explorar-boloes`

**Arquivo:** `app/explorar-boloes/page.tsx`

**Funcionalidades:**
- ✅ Listagem de bolões públicos e com código
- ✅ Busca por nome, descrição, admin ou código
- ✅ Filtros por tipo de acesso e status
- ✅ Indicador de status do usuário em cada bolão
- ✅ Solicitação de entrada
- ✅ Cancelamento de solicitação pendente

**Filtros Disponíveis:**

```typescript
// Tipo de Acesso
- Todos
- Público (entrada com aprovação)
- Com Código (requer código + aprovação)

// Status do Bolão
- Todos
- Ativos (em andamento)
- Finalizados (encerrados)
```

**Estados do Card para o Usuário:**

```typescript
// Se é admin do bolão
→ Badge: "Você é o administrador"

// Se já participa (aprovado)
→ Badge verde: "Participando"
→ Botão: Nenhum (já está dentro)

// Se tem solicitação pendente
→ Badge amarelo: "Aguardando aprovação"
→ Botão: "Cancelar Solicitação"

// Se foi bloqueado
→ Badge vermelho: "Bloqueado"
→ Botão: Nenhum (bloqueado)

// Se foi recusado
→ Badge cinza: "Recusado"
→ Botão: Nenhum (recusado)

// Se bolão está lotado
→ Badge cinza: "Bolão lotado"
→ Botão: Nenhum (sem vagas)

// Se bolão não está ativo
→ Badge: "Finalizado" ou "Pausado"
→ Botão: Nenhum (inativo)

// Pode solicitar entrada (público)
→ Botão verde: "Solicitar Entrada"

// Pode solicitar entrada (com código)
→ Botão amarelo: "Entrar com Código"
→ Campo de código aparece ao clicar
```

---

### 2. Componente: `BolaoPublicoCard`

**Arquivo:** `components/bolao/BolaoPublicoCard.tsx`

**Props:**

```typescript
interface BolaoPublicoCardProps {
  bolao: BolaoPublico
  statusUsuario: ParticipanteComStatus | null
  onSolicitarEntrada: (bolaoId: string, codigo?: string) => Promise<void>
  onCancelarSolicitacao: (bolaoId: string) => Promise<void>
  userId: string
}
```

**Recursos:**
- ✅ Badge de status do usuário
- ✅ Indicador de tipo de acesso (público/código)
- ✅ Informações do bolão (admin, vagas, jogos)
- ✅ Premiação (se houver)
- ✅ Botão de ação contextual
- ✅ Campo de código (para bolões com código)
- ✅ Loading states

**Visual do Card:**

```
┌─────────────────────────────────────────────────┐
│ 🏆 🔓 [Badge Status]           [Status Bolão]   │
│                                                  │
│ Nome do Bolão                                   │
│ Descrição do bolão aqui...                      │
│                                                  │
│ 👤 Admin      #️⃣ CODIGO                        │
│ 👥 12/20      📅 38 jogos                       │
│                                                  │
│ 🎁 Premiação                                     │
│   🥇 R$ 500                                      │
│   🥈 R$ 300                                      │
│                                                  │
│ [Botão de Ação Contextual]                      │
└─────────────────────────────────────────────────┘
```

---

### 3. Componente: `PainelAprovacao`

**Arquivo:** `components/bolao/PainelAprovacao.tsx`

**Props:**

```typescript
interface PainelAprovacaoProps {
  bolaoId: string
  isAdmin: boolean
}
```

**Funcionalidades:**
- ✅ Lista solicitações pendentes
- ✅ Aprovar participante
- ✅ Recusar participante
- ✅ Bloquear participante
- ✅ Badge com contador de pendências
- ✅ Loading states
- ✅ Toast notifications

**Visual:**

```
┌─────────────────────────────────────────────────┐
│ 👥 Solicitações de Entrada [3]                  │
│ Aprove ou recuse novos participantes            │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ 👤 João Silva                               │ │
│ │ 🕐 Solicitado em 04/10/2025                 │ │
│ │                [✓ Aprovar] [✗ Recusar]      │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ 👤 Maria Santos                             │ │
│ │ 🕐 Solicitado em 04/10/2025                 │ │
│ │                [✓ Aprovar] [✗ Recusar]      │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Fluxos de Uso

### Fluxo 1: Usuário Entra em Bolão Público

```mermaid
Usuário → Explorar Bolões → Buscar/Filtrar
     → Ver Card → "Solicitar Entrada"
     → Solicitação Criada (status: pendente)
     → Aguarda Aprovação do Admin
     
Admin → Painel de Aprovação → Ver Solicitação
     → "Aprovar" → Status: aprovado
     
Usuário → Pode fazer palpites ✅
```

### Fluxo 2: Usuário Entra em Bolão com Código

```mermaid
Usuário → Explorar Bolões → Buscar/Filtrar
     → Ver Card → "Entrar com Código"
     → Campo de Código Aparece
     → Digita Código → "Confirmar"
     → Valida Código
     → Solicitação Criada (status: pendente)
     → Aguarda Aprovação do Admin
     
Admin → Painel de Aprovação → Ver Solicitação
     → "Aprovar" → Status: aprovado
     
Usuário → Pode fazer palpites ✅
```

### Fluxo 3: Admin Recusa Participante

```mermaid
Admin → Painel de Aprovação → Ver Solicitação
     → "Recusar" → Status: recusado
     
Usuário → Badge "Recusado" no card
       → Não pode mais solicitar entrada
```

### Fluxo 4: Admin Bloqueia Participante

```mermaid
Admin → Painel de Aprovação → Ver Participante
     → "Bloquear" → Status: bloqueado
     
Participante → Perde acesso aos palpites
            → Badge "Bloqueado" no card
            → Não aparece no ranking
```

---

## 📡 APIs Necessárias

### 1. GET `/api/bolao/explorar`

**Retorna:** Lista de bolões públicos e com código

```typescript
Response: {
  boloes: BolaoPublico[]
}
```

**Filtros automáticos:**
- Bolões com `tipoAcesso: 'publico'` ou `'codigo'`
- Não retorna bolões privados

---

### 2. POST `/api/bolao/solicitar-entrada`

**Body:**
```typescript
{
  bolaoId: string
  userId: string
  userName: string
  userAvatar?: string
  codigo?: string  // Apenas para bolões com código
}
```

**Response:**
```typescript
{
  success: true
  aprovadoAutomaticamente?: boolean
}
```

**Validações:**
- ✅ Bolão existe
- ✅ Usuário não participa
- ✅ Bolão não está lotado
- ✅ Código correto (se tipo 'codigo')
- ✅ Bolão está ativo

---

### 3. POST `/api/bolao/cancelar-solicitacao`

**Body:**
```typescript
{
  bolaoId: string
  userId: string
}
```

**Ação:** Remove solicitação pendente

---

### 4. GET `/api/bolao/[id]/solicitacoes`

**Retorna:** Solicitações pendentes do bolão

```typescript
Response: {
  solicitacoes: ParticipanteComStatus[]
}
```

**Filtro:** Apenas participantes com `status: 'pendente'`

---

### 5. POST `/api/bolao/[id]/aprovar-participante`

**Body:**
```typescript
{
  userId: string
}
```

**Ação:** 
- Muda status para `'aprovado'`
- Define `aprovadoEm`
- Envia notificação ao usuário

---

### 6. POST `/api/bolao/[id]/recusar-participante`

**Body:**
```typescript
{
  userId: string
}
```

**Ação:**
- Muda status para `'recusado'`
- Envia notificação ao usuário

---

### 7. POST `/api/bolao/[id]/bloquear-participante`

**Body:**
```typescript
{
  userId: string
}
```

**Ação:**
- Muda status para `'bloqueado'`
- Remove do ranking
- Impede novos palpites

---

## 🎨 Badges e Indicadores Visuais

### Status do Usuário

```tsx
// Aprovado
<Badge className="bg-green-500/10 text-green-600">
  <CheckCircle /> Participando
</Badge>

// Pendente
<Badge className="bg-yellow-500/10 text-yellow-600">
  <Clock /> Aguardando Aprovação
</Badge>

// Bloqueado
<Badge className="bg-red-500/10 text-red-600">
  <UserX /> Bloqueado
</Badge>

// Recusado
<Badge className="bg-gray-500/10 text-gray-600">
  <XCircle /> Recusado
</Badge>
```

### Tipo de Acesso

```tsx
// Público
<Unlock className="text-green-500" />

// Com Código
<Lock className="text-yellow-500" />
```

### Status do Bolão

```tsx
// Ativo
<Badge className="bg-green-500/10 text-green-600">
  Ativo
</Badge>

// Finalizado
<Badge className="bg-gray-500/10 text-gray-600">
  Finalizado
</Badge>

// Pausado
<Badge className="bg-yellow-500/10 text-yellow-600">
  Pausado
</Badge>
```

---

## 🔐 Permissões e Regras

### Regras de Solicitação

1. **Usuário NÃO pode solicitar se:**
   - Já participa (qualquer status)
   - Bolão lotado
   - Bolão finalizado ou pausado
   - Foi bloqueado anteriormente

2. **Solicitação automática aprovada se:**
   - Bolão configurado para entrada automática
   - Código correto (se tipo 'codigo')
   - Há vagas disponíveis

3. **Admin pode:**
   - Aprovar solicitações pendentes
   - Recusar solicitações pendentes
   - Bloquear participantes aprovados
   - Desbloquear participantes bloqueados

---

## 📊 Integração com Dashboard

### Atualização no `ActionCard`

```tsx
// ANTES: Entrar no Bolão (código direto)
<ActionCard
  href="/entrar-bolao"
  title="Entrar no Bolão"
  subtitle="Use um código de convite"
  icon={Hash}
  variant="success"
/>

// DEPOIS: Explorar Bolões (listagem pública)
<ActionCard
  href="/explorar-boloes"
  title="Explorar Bolões"
  subtitle="Descubra bolões públicos"
  icon={Hash}
  variant="success"
/>
```

---

## ✨ Recursos Extras Implementados

### 1. Busca Inteligente
- Nome do bolão
- Descrição
- Nome do admin
- Código do bolão

### 2. Filtros Múltiplos
- Tipo de acesso (todos/público/código)
- Status (todos/ativo/finalizado)

### 3. Loading States
- Skeleton screens
- Spinners contextuais
- Disabled states

### 4. Toast Notifications
- Sucesso ao solicitar entrada
- Aprovação automática
- Erros de validação
- Confirmações de ações do admin

### 5. Empty States
- Nenhum bolão encontrado
- Sem solicitações pendentes
- Sem resultados na busca

---

## 🎯 Próximos Passos

### Backend (APIs a implementar):
1. ✅ GET `/api/bolao/explorar`
2. ✅ POST `/api/bolao/solicitar-entrada`
3. ✅ POST `/api/bolao/cancelar-solicitacao`
4. ✅ GET `/api/bolao/[id]/solicitacoes`
5. ✅ POST `/api/bolao/[id]/aprovar-participante`
6. ✅ POST `/api/bolao/[id]/recusar-participante`
7. ✅ POST `/api/bolao/[id]/bloquear-participante`

### Banco de Dados (Schema):
```typescript
// Adicionar ao modelo Participante
interface Participante {
  // ... campos existentes
  status: 'pendente' | 'aprovado' | 'bloqueado' | 'recusado'
  solicitadoEm: Date
  aprovadoEm?: Date
  bloqueadoEm?: Date
}

// Adicionar ao modelo Bolao
interface Bolao {
  // ... campos existentes
  tipoAcesso: 'publico' | 'privado' | 'codigo'
  entradaAutomatica: boolean  // Se true, aprova automaticamente
}
```

### Notificações (opcional):
- Email ao admin quando há nova solicitação
- Email ao usuário quando aprovado/recusado
- Notificações in-app

---

## 📝 Exemplo de Uso Completo

```tsx
// 1. Usuário navega para explorar bolões
<Link href="/explorar-boloes">
  <Button>Explorar Bolões</Button>
</Link>

// 2. Página carrega bolões públicos
GET /api/bolao/explorar
// Retorna 15 bolões públicos e com código

// 3. Usuário filtra por "Brasileiro"
setBusca("Brasileiro")
// Exibe 3 resultados

// 4. Usuário clica em "Solicitar Entrada"
onSolicitarEntrada(bolaoId)
POST /api/bolao/solicitar-entrada
// Solicitação criada com status: pendente

// 5. Admin recebe notificação
// Admin abre painel de aprovação
<PainelAprovacao bolaoId={bolaoId} isAdmin={true} />

// 6. Admin aprova participante
POST /api/bolao/{bolaoId}/aprovar-participante
// Status muda para: aprovado

// 7. Usuário pode fazer palpites ✅
```

---

## 🎨 Customizações de Estilo

Todos os componentes seguem o **sistema de cores CSS variables**:

```css
/* Light Mode */
--background: #FAFBFC
--card: #FFFFFF
--primary: #141B25
--border: #E5E7EB

/* Dark Mode */
--background: #000000
--card: #121212
--primary: gradient(blue → purple)
--border: #2A2A2A
```

**Sem cores hardcoded** - 100% temático! 🎨

---

**Criado em:** 04/10/2025  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para implementação de APIs
