# Migração Prisma → MongoDB - Concluída

## 📋 Resumo da Migração

Este documento registra a migração completa do projeto de **Prisma ORM** para **MongoDB Native Driver**.

---

## ✅ APIs Migradas

### 1. `/api/palpites` (GET e POST)
**Antes (Prisma):**
- `prisma.participante.findUnique` com composite key
- `prisma.jogo.findFirst` com where complexo
- `prisma.palpite.upsert` com composite key
- `prisma.palpite.findMany` com include e orderBy aninhado

**Depois (MongoDB):**
- `db.collection('participantes').findOne` com query composto
- `db.collection('jogos').findOne` com ObjectId
- `db.collection('palpites').updateOne` com upsert: true
- Aggregation pipeline com $lookup para jogos, $sort e $project

### 2. `/api/jogos/criar` (POST)
**Antes (Prisma):**
- `prisma.bolao.findUnique`
- `prisma.jogo.create`

**Depois (MongoDB):**
- `db.collection('boloes').findOne` com ObjectId
- `db.collection('jogos').insertOne`
- Retorna `insertedId.toString()`

### 3. `/api/bolao/[id]` (GET)
**Antes (Prisma):**
- `prisma.bolao.findUnique` com 4 includes aninhados:
  - admin (select)
  - participantes (include user)
  - jogos (orderBy)
  - palpites (include user e jogo)

**Depois (MongoDB):**
- Busca bolão principal
- Query separada para admin com projection
- Aggregation com $lookup para participantes + users
- Query para jogos com sort
- Aggregation com double $lookup para palpites (users + jogos)
- Monta resposta combinando todos os dados

### 4. `/api/ranking/[bolaoId]` (GET)
**Antes (Prisma):**
- `prisma.participante.findMany` com include user e orderBy múltiplo
- `prisma.bolao.findUnique` com select

**Depois (MongoDB):**
- Aggregation pipeline com $lookup para users
- $sort múltiplo (posicao, pontos, palpitesCorretos)
- Query separada para configurações do bolão
- Validação de ObjectId antes de usar

---

## 🗑️ Arquivos/Dependências Removidos

### package.json
- ❌ `@prisma/client: ^6.16.2`
- ❌ `prisma: ^6.16.2`
- ❌ `sqlite3: ^5.1.7` (banco antigo)

### Scripts removidos
- ❌ `db:seed` - Prisma seed
- ❌ `db:reset` - Prisma reset
- ❌ `db:studio` - Prisma Studio
- ❌ Seção `"prisma": { "seed": ... }`

---

## ⚠️ Scripts Legados (Não Migrados)

Os seguintes scripts ainda contêm referências ao Prisma, mas **NÃO são utilizados** no fluxo principal da aplicação:

- `scripts/verificar-usuario.ts` - Script de diagnóstico
- `scripts/verificar-boloes.ts` - Script de diagnóstico
- ~~`scripts/importar-brasileirao.ts`~~ - **REMOVIDO** (funcionalidade de importação descontinuada)
- ~~`lib/scrapers/brasileirao-crawler.ts`~~ - **REMOVIDO** (funcionalidade de scraping descontinuada)

**Ação Recomendada:**
- Scripts de diagnóstico podem ser deletados se não forem mais necessários
- Scripts de importação foram completamente removidos do projeto

---

## 🔄 Padrões de Conversão Estabelecidos

### 1. Queries Simples

**Prisma:**
```typescript
const item = await prisma.model.findUnique({ where: { id } })
```

**MongoDB:**
```typescript
const db = await getDatabase()
const item = await db.collection('collection').findOne({ 
  _id: new ObjectId(id) 
})
```

### 2. Queries com Include (Relações)

**Prisma:**
```typescript
const items = await prisma.model.findMany({
  where: { userId },
  include: { user: true }
})
```

**MongoDB:**
```typescript
const items = await db.collection('collection').aggregate([
  { $match: { userId } },
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $unwind: '$user' }
]).toArray()
```

### 3. Upsert

**Prisma:**
```typescript
const item = await prisma.model.upsert({
  where: { id },
  update: { ...data },
  create: { ...data }
})
```

**MongoDB:**
```typescript
const existing = await db.collection('collection').findOne({ id })

if (existing) {
  await db.collection('collection').updateOne(
    { _id: existing._id },
    { $set: { ...data, updatedAt: new Date() } }
  )
} else {
  const result = await db.collection('collection').insertOne({
    ...data,
    createdAt: new Date()
  })
}
```

### 4. Insert e Retornar ID

**Prisma:**
```typescript
const item = await prisma.model.create({ data: {...} })
return item.id
```

**MongoDB:**
```typescript
const result = await db.collection('collection').insertOne({...})
return result.insertedId.toString()
```

### 5. OrderBy Múltiplo

**Prisma:**
```typescript
orderBy: [
  { campo1: 'asc' },
  { campo2: 'desc' }
]
```

**MongoDB:**
```typescript
.sort({ campo1: 1, campo2: -1 })

// Ou em aggregation:
{ $sort: { campo1: 1, campo2: -1 } }
```

---

## 🎯 Próximos Passos

### Imediato:
1. ✅ Testar todas as APIs migradas
2. ✅ Verificar se não há erros de compilação
3. ⏳ Rodar `npm install` para atualizar lock file
4. ⏳ Testar aplicação end-to-end

### Opcional:
- Deletar ou migrar scripts legados
- Deletar pasta `prisma/` se ainda existir
- Atualizar README.md com nova stack

---

## 📊 Comparação de Performance

### Vantagens MongoDB Nativo:
- ✅ Sem camada de abstração extra (Prisma)
- ✅ Queries mais otimizadas para MongoDB
- ✅ Controle total sobre aggregations
- ✅ Menos dependências no projeto
- ✅ Bundle size menor

### Considerações:
- Código mais verboso em alguns casos
- Necessidade de validações manuais de ObjectId
- Necessidade de construir manualmente queries complexas

---

## 🔧 Comandos Úteis

```bash
# Instalar dependências atualizadas
npm install

# Verificar erros
npm run lint

# Testar MongoDB
npm run test:mongodb

# Rodar aplicação
npm run dev
```

---

## 📝 Checklist Final

- [x] 4 APIs migradas para MongoDB
- [x] Prisma removido do package.json
- [x] Scripts Prisma removidos
- [x] SQLite removido
- [x] Padrões de conversão documentados
- [ ] npm install executado
- [ ] Testes end-to-end realizados
- [ ] Scripts legados avaliados
- [ ] README atualizado

---

**Migração realizada em:** 2025
**Responsável:** Claude AI + Noronha
**Status:** ✅ Concluída - Aguardando testes
