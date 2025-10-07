# Backend Sistema de Autorização - MongoDB

## ✅ APIs Implementadas (7/7)

### 1. GET /api/bolao/explorar
**Descrição:** Lista bolões públicos e com código de acesso

**Autenticação:** Requerida

**Response:**
```json
{
  "success": true,
  "boloes": [
    {
      "id": "string",
      "nome": "string",
      "descricao": "string",
      "codigo": "string",
      "admin": "userId",
      "adminNome": "string",
      "maxParticipantes": "number",
      "participantes": [
        {
          "id": "userId",
          "nome": "string",
          "avatar": "string | null",
          "pontos": "number",
          "posicao": "number",
          "status": "aprovado | pendente | recusado | bloqueado",
          "solicitadoEm": "ISO8601",
          "aprovadoEm": "ISO8601 | null"
        }
      ],
      "totalJogos": "number",
      "status": "ativo | finalizado",
      "tipoAcesso": "publico | privado | codigo",
      "criadoEm": "ISO8601",
      "premios": "object | null"
    }
  ]
}
```

**Lógica:**
- Busca bolões com `tipoAcesso` IN ['publico', 'codigo']
- Popula informações de admin e participantes
- Conta jogos de cada bolão
- Retorna apenas bolões descobríveis

---

### 2. POST /api/bolao/solicitar-entrada
**Descrição:** Solicita entrada em um bolão

**Autenticação:** Requerida

**Body:**
```json
{
  "bolaoId": "string",
  "userId": "string",
  "userName": "string",
  "userAvatar": "string | null",
  "codigo": "string (opcional, apenas para tipo 'codigo')"
}
```

**Validações:**
1. Bolão existe e está ativo
2. Usuário não solicitou entrada anteriormente
3. Bolão não está lotado (apenas aprovados contam)
4. Se `tipoAcesso === 'codigo'`, valida código

**Lógica:**
- Se `entradaAutomatica === true`: cria participante com `status: 'aprovado'`
- Se `entradaAutomatica === false`: cria participante com `status: 'pendente'`

**Response:**
```json
{
  "success": true,
  "aprovadoAutomaticamente": "boolean",
  "message": "string"
}
```

---

### 3. POST /api/bolao/cancelar-solicitacao
**Descrição:** Cancela solicitação pendente

**Autenticação:** Requerida

**Body:**
```json
{
  "bolaoId": "string",
  "userId": "string"
}
```

**Validações:**
1. Participação existe
2. Status é 'pendente'

**Lógica:**
- Deleta registro da collection `participantes`

---

### 4. GET /api/bolao/[id]/solicitacoes
**Descrição:** Lista solicitações pendentes (admin only)

**Autenticação:** Requerida + Admin do bolão

**Response:**
```json
{
  "success": true,
  "solicitacoes": [
    {
      "id": "userId",
      "nome": "string",
      "email": "string",
      "avatar": "string | null",
      "pontos": "number",
      "posicao": "number",
      "status": "pendente",
      "solicitadoEm": "ISO8601"
    }
  ]
}
```

**Validações:**
1. Usuário é admin do bolão

**Lógica:**
- Filtra participantes com `status: 'pendente'`
- Ordena por `solicitadoEm` ASC
- Popula dados do usuário

---

### 5. POST /api/bolao/[id]/aprovar-participante
**Descrição:** Aprova solicitação pendente

**Autenticação:** Requerida + Admin

**Body:**
```json
{
  "userId": "string"
}
```

**Validações:**
1. Usuário é admin
2. Participante existe e está pendente
3. Bolão não está lotado

**Lógica:**
- Atualiza status para 'aprovado'
- Define `aprovadoEm` com timestamp atual
- Calcula próxima posição no ranking

---

### 6. POST /api/bolao/[id]/recusar-participante
**Descrição:** Recusa solicitação pendente

**Autenticação:** Requerida + Admin

**Body:**
```json
{
  "userId": "string"
}
```

**Validações:**
1. Usuário é admin
2. Participante existe e está pendente

**Lógica:**
- Atualiza status para 'recusado'
- Mantém registro no banco (histórico)

---

### 7. POST /api/bolao/[id]/bloquear-participante
**Descrição:** Bloqueia participante (qualquer status)

**Autenticação:** Requerida + Admin

**Body:**
```json
{
  "userId": "string"
}
```

**Validações:**
1. Usuário é admin
2. Participante existe

**Lógica:**
- Atualiza status para 'bloqueado'
- Define `bloqueadoEm` com timestamp atual
- Remove acesso ao bolão

---

## 📊 Alterações no MongoDB

### Collection: `boloes`
**Novos campos necessários:**
```typescript
{
  tipoAcesso: 'publico' | 'privado' | 'codigo', // OBRIGATÓRIO
  entradaAutomatica: boolean,                    // OBRIGATÓRIO (apenas se tipoAcesso !== 'privado')
  codigo: string                                 // OBRIGATÓRIO (apenas se tipoAcesso === 'codigo')
}
```

### Collection: `participantes`
**Novos campos necessários:**
```typescript
{
  status: 'aprovado' | 'pendente' | 'recusado' | 'bloqueado', // OBRIGATÓRIO (default: 'aprovado' para retrocompatibilidade)
  solicitadoEm: Date,         // OBRIGATÓRIO (quando criado)
  aprovadoEm: Date | null,    // OPCIONAL (apenas quando status === 'aprovado')
  bloqueadoEm: Date | null    // OPCIONAL (apenas quando status === 'bloqueado')
}
```

---

## 🔄 Migração de Dados Existentes

### Opção 1: Via MongoDB Compass / Studio 3T
```javascript
// Atualizar bolões existentes (padrão privado)
db.boloes.updateMany(
  { tipoAcesso: { $exists: false } },
  {
    $set: {
      tipoAcesso: 'privado',
      entradaAutomatica: true
    }
  }
)

// Atualizar participantes existentes (aprovar retroativamente)
db.participantes.updateMany(
  { status: { $exists: false } },
  {
    $set: {
      status: 'aprovado',
      solicitadoEm: new Date(),
      aprovadoEm: new Date()
    }
  }
)
```

### Opção 2: Via API de Migração
Criar endpoint temporário:
```typescript
// app/api/migrate/add-authorization-fields/route.ts
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST() {
  const db = await getDatabase()
  
  // Migrar bolões
  await db.collection('boloes').updateMany(
    { tipoAcesso: { $exists: false } },
    {
      $set: {
        tipoAcesso: 'privado',
        entradaAutomatica: true
      }
    }
  )
  
  // Migrar participantes
  await db.collection('participantes').updateMany(
    { status: { $exists: false } },
    {
      $set: {
        status: 'aprovado',
        solicitadoEm: new Date(),
        aprovadoEm: new Date()
      }
    }
  )
  
  return NextResponse.json({ success: true })
}
```

**Executar uma vez:**
```bash
curl -X POST http://localhost:3000/api/migrate/add-authorization-fields
```

**Depois deletar o arquivo de migração.**

---

## 🧪 Testes Recomendados

### 1. Explorar Bolões
```bash
curl -X GET http://localhost:3000/api/bolao/explorar \
  -H "Cookie: authjs.session-token=SEU_TOKEN"
```

### 2. Solicitar Entrada (Público)
```bash
curl -X POST http://localhost:3000/api/bolao/solicitar-entrada \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=SEU_TOKEN" \
  -d '{
    "bolaoId": "BOLAO_ID",
    "userId": "USER_ID",
    "userName": "João Silva",
    "userAvatar": null
  }'
```

### 3. Solicitar Entrada (Código)
```bash
curl -X POST http://localhost:3000/api/bolao/solicitar-entrada \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=SEU_TOKEN" \
  -d '{
    "bolaoId": "BOLAO_ID",
    "userId": "USER_ID",
    "userName": "João Silva",
    "userAvatar": null,
    "codigo": "ABC123"
  }'
```

### 4. Ver Solicitações (Admin)
```bash
curl -X GET http://localhost:3000/api/bolao/BOLAO_ID/solicitacoes \
  -H "Cookie: authjs.session-token=ADMIN_TOKEN"
```

### 5. Aprovar Participante
```bash
curl -X POST http://localhost:3000/api/bolao/BOLAO_ID/aprovar-participante \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=ADMIN_TOKEN" \
  -d '{"userId": "USER_ID"}'
```

---

## 🔐 Segurança

### Implementado:
✅ Autenticação via NextAuth em todas as rotas  
✅ Validação de admin em rotas administrativas  
✅ Validação de código para bolões restritos  
✅ Verificação de lotação antes de aprovar  
✅ Validação de status antes de ações  

### Recomendações Futuras:
- Rate limiting (ex: 10 solicitações/minuto por usuário)
- Log de ações administrativas (aprovar/recusar/bloquear)
- Notificações (email/push) quando solicitação é aprovada/recusada
- Histórico de mudanças de status

---

## 📝 Status de Implementação

| Componente | Status | Arquivo |
|------------|--------|---------|
| GET /explorar | ✅ | `app/api/bolao/explorar/route.ts` |
| POST /solicitar-entrada | ✅ | `app/api/bolao/solicitar-entrada/route.ts` |
| POST /cancelar-solicitacao | ✅ | `app/api/bolao/cancelar-solicitacao/route.ts` |
| GET /[id]/solicitacoes | ✅ | `app/api/bolao/[id]/solicitacoes/route.ts` |
| POST /[id]/aprovar-participante | ✅ | `app/api/bolao/[id]/aprovar-participante/route.ts` |
| POST /[id]/recusar-participante | ✅ | `app/api/bolao/[id]/recusar-participante/route.ts` |
| POST /[id]/bloquear-participante | ✅ | `app/api/bolao/[id]/bloquear-participante/route.ts` |
| Frontend - Explorar | ✅ | `app/explorar-boloes/page.tsx` |
| Frontend - Card Bolão | ✅ | `components/bolao/BolaoPublicoCard.tsx` |
| Frontend - Painel Admin | ✅ | `components/bolao/PainelAprovacao.tsx` |
| Documentação Sistema | ✅ | `SISTEMA_AUTORIZACAO_BOLOES.md` |
| Migração MongoDB | ⏳ | Precisa executar scripts |

---

## 🚀 Próximos Passos

1. **Executar migração de dados** (escolher Opção 1 ou 2)
2. **Testar fluxo completo:**
   - Criar bolão público
   - Solicitar entrada
   - Aprovar/recusar solicitações
3. **Atualizar criar-bolao para incluir novos campos**
4. **Adicionar notificações** (opcional)
5. **Deploy em produção**

---

## 💾 Backup Antes da Migração

**IMPORTANTE:** Faça backup do banco antes de executar migrações!

```bash
# MongoDB Atlas: usar interface web para criar snapshot
# MongoDB local:
mongodump --uri="mongodb://localhost:27017/palpiteiros" --out=./backup-$(date +%Y%m%d)
```

---

**Desenvolvido com MongoDB + Next.js 15 + TypeScript**
