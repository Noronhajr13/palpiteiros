# Migração: Jogos com IDs dos Times

## Descrição da Mudança

Alteramos a estrutura de armazenamento dos jogos para usar **IDs dos times** em vez de apenas strings com os nomes. Isso melhora a normalização do banco de dados e permite relacionamentos mais robustos.

## Estrutura Anterior

```typescript
interface Jogo {
  id: string
  timeA: string // Nome do time (ex: "Flamengo")
  timeB: string // Nome do time (ex: "Palmeiras")
  data: string
  rodada: number
  status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
  placarA: number | null
  placarB: number | null
}
```

## Nova Estrutura

```typescript
interface Jogo {
  id: string
  timeAId: string    // ID do time A no banco
  timeBId: string    // ID do time B no banco
  timeA?: string     // Nome do time A (mantido para compatibilidade)
  timeB?: string     // Nome do time B (mantido para compatibilidade)
  data: string
  rodada: number
  status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
  placarA: number | null
  placarB: number | null
}
```

## Benefícios

### 1. Normalização do Banco de Dados
- ✅ Evita duplicação de nomes de times
- ✅ Facilita atualizações (ex: mudança de nome do time)
- ✅ Permite relacionamentos mais consistentes

### 2. Integridade Referencial
- ✅ Garante que os times existem na base de dados
- ✅ Permite validações mais rigorosas
- ✅ Facilita consultas relacionadas

### 3. Melhor Performance
- ✅ Índices em IDs são mais eficientes que strings
- ✅ Consultas JOIN ficam mais rápidas
- ✅ Reduz tamanho dos documentos

### 4. Funcionalidades Futuras
- ✅ Estatísticas por time
- ✅ Histórico de confrontos
- ✅ Escudos e informações adicionais dos times
- ✅ Rankings de times

## Compatibilidade

### Retrocompatibilidade
A implementação mantém os campos `timeA` e `timeB` (nomes) por compatibilidade:
- APIs antigas continuam funcionando
- Dados legados são mantidos
- Migração gradual é possível

### Prioridade de Dados
A API prioriza IDs sobre nomes:
```typescript
// Se ambos estiverem presentes, usa o ID
if (timeAId) {
  // Usa timeAId para buscar dados do time
} else if (timeA) {
  // Fallback para o nome (compatibilidade)
}
```

## Mudanças Implementadas

### 1. Interface de Jogos
**Arquivos alterados:**
- `/app/bolao/[id]/jogos/page.tsx`
- `/lib/hooks/useJogos.ts`
- `/components/modals/EditarJogoModal.tsx`
- `/components/modals/ExcluirJogoModal.tsx`

### 2. APIs Atualizadas
**Rotas modificadas:**
- `POST /api/jogos/criar` - Aceita `timeAId` e `timeBId`
- `PUT /api/jogos/[id]` - Atualiza IDs e nomes dos times
- `GET /api/jogos` - Retorna IDs e nomes

### 3. Formulários
**Página de Jogos:**
- Selects agora usam `value={time.id}` em vez de `value={time.nome}`
- Estado `novoJogo` usa `timeAId` e `timeBId`
- Validação garante que times são diferentes por ID

### 4. CSV Import
**Atualização necessária:**
- Template CSV agora pode aceitar IDs ou nomes
- Parser prioriza IDs se disponíveis
- Fallback para nomes mantém compatibilidade

## Exemplo de Uso

### Criar Jogo (Novo Formato)
```typescript
const novoJogo = {
  timeAId: "68e1f6b1509c2bf972781cf1", // ID do Flamengo
  timeBId: "68e1f6b1509c2bf972781cf2", // ID do Palmeiras
  timeA: "Flamengo",  // Opcional, mas recomendado
  timeB: "Palmeiras", // Opcional, mas recomendado
  data: "2024-01-15T16:00:00",
  rodada: 1,
  status: "agendado"
}
```

### Consultar Jogos
```typescript
// API retorna ambos os formatos
{
  id: "jogo123",
  timeAId: "68e1f6b1509c2bf972781cf1",
  timeBId: "68e1f6b1509c2bf972781cf2",
  timeA: "Flamengo",
  timeB: "Palmeiras",
  // ... outros campos
}
```

## Migração de Dados Existentes

### Script de Migração (Futuro)
```typescript
// Pseudocódigo para migrar jogos existentes
async function migrarJogos() {
  const jogos = await db.collection('jogos').find({ timeAId: { $exists: false } })
  
  for (const jogo of jogos) {
    // Buscar ID do time pelo nome
    const timeA = await db.collection('times').findOne({ nome: jogo.timeA })
    const timeB = await db.collection('times').findOne({ nome: jogo.timeB })
    
    if (timeA && timeB) {
      await db.collection('jogos').updateOne(
        { _id: jogo._id },
        { 
          $set: { 
            timeAId: timeA._id.toString(),
            timeBId: timeB._id.toString()
          }
        }
      )
    }
  }
}
```

## Validações

### Ao Criar Jogo
```typescript
// Validar que os times existem
if (timeAId) {
  const timeA = await db.collection('times').findOne({ _id: new ObjectId(timeAId) })
  if (!timeA) {
    throw new Error('Time A não encontrado')
  }
}
```

### Ao Atualizar Jogo
```typescript
// Validar que os times são diferentes
if (timeAId === timeBId) {
  throw new Error('Os times devem ser diferentes')
}
```

## Próximos Passos

1. **Migrar Dados Legados**
   - Criar script de migração para jogos existentes
   - Executar em ambiente de desenvolvimento
   - Validar resultados antes de produção

2. **Atualizar Outras Entidades**
   - Considerar usar IDs em palpites
   - Normalizar referências em ranking
   - Atualizar estatísticas

3. **Melhorar Performance**
   - Criar índices compostos (timeAId, timeBId)
   - Otimizar consultas de jogos por time
   - Implementar cache de nomes dos times

4. **Documentação**
   - Atualizar API docs
   - Criar guia de migração para desenvolvedores
   - Documentar schema do MongoDB

## Testes Recomendados

- [ ] Criar jogo com IDs válidos
- [ ] Criar jogo sem IDs (fallback para nomes)
- [ ] Editar jogo atualizando IDs
- [ ] Validar que times diferentes são obrigatórios
- [ ] Testar importação CSV com IDs
- [ ] Testar importação CSV com nomes
- [ ] Verificar exibição correta na interface
- [ ] Testar palpites em jogos com IDs
