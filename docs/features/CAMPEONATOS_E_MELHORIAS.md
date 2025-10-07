# 🏆 Sistema de Campeonatos e Times - Documentação Completa

## 📋 Visão Geral

Sistema completo de gerenciamento de campeonatos e times com MongoDB, permitindo normalização de dados e melhor organização dos jogos.

---

## 🗄️ Estrutura de Dados MongoDB

### Collection: `times`
```javascript
{
  _id: ObjectId,
  nome: String,              // Nome completo do time
  escudo: String?,           // URL do escudo/logo
  sigla: String,             // Sigla de 3 letras (ex: FLA, PAL, COR)
  fundacao: String?,         // Ano de fundação
  estadio: String?,          // Nome do estádio
  cidade: String?,           // Cidade sede
  estado: String?,           // UF (ex: RJ, SP)
  ativo: Boolean,            // Se o time está ativo
  criadoPor: String,         // ID do usuário criador
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `campeonatos`
```javascript
{
  _id: ObjectId,
  nome: String,              // Ex: Brasileirão Série A
  ano: Number,               // Ex: 2024
  divisao: String?,          // Ex: Série A, Série B
  pais: String,              // Ex: Brasil
  logo: String?,             // URL do logo do campeonato
  status: String,            // planejado | em_andamento | finalizado
  dataInicio: Date?,
  dataFim: Date?,
  participantes: [           // Array de times participantes
    {
      timeId: String         // ID do time (referência)
    }
  ],
  criadoPor: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `jogos` (ATUALIZADA - Recomendação)
```javascript
{
  _id: ObjectId,
  bolaoId: String,           // ID do bolão
  campeonatoId: String,      // ID do campeonato (referência)
  rodada: String,            // Ex: "1", "2", "Oitavas"
  timeCasaId: String,        // ID do time casa (referência)
  timeForaId: String,        // ID do time fora (referência)
  data: String,              // YYYY-MM-DD
  horario: String,           // HH:MM
  placar: {                  // Resultado (após jogo)
    casa: Number?,
    fora: Number?
  },
  status: String,            // agendado | ao_vivo | finalizado | adiado
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 APIs Disponíveis

### Times

#### `GET /api/times`
Lista todos os times cadastrados.

**Response:**
```json
{
  "success": true,
  "times": [
    {
      "id": "...",
      "nome": "Flamengo",
      "escudo": "https://...",
      "sigla": "FLA",
      "fundacao": "1895",
      "estadio": "Maracanã",
      "cidade": "Rio de Janeiro",
      "estado": "RJ",
      "ativo": true
    }
  ]
}
```

#### `POST /api/times`
Cria um novo time.

**Body:**
```json
{
  "nome": "Flamengo",
  "sigla": "FLA",
  "escudo": "https://...",
  "fundacao": "1895",
  "estadio": "Maracanã",
  "cidade": "Rio de Janeiro",
  "estado": "RJ"
}
```

#### `GET /api/times/[id]`
Busca um time específico.

#### `PUT /api/times/[id]`
Atualiza um time.

#### `DELETE /api/times/[id]`
Deleta um time (verifica se não está sendo usado).

---

### Campeonatos

#### `GET /api/campeonatos`
Lista todos os campeonatos com dados dos times participantes.

**Response:**
```json
{
  "success": true,
  "campeonatos": [
    {
      "id": "...",
      "nome": "Brasileirão Série A",
      "ano": 2024,
      "divisao": "Série A",
      "pais": "Brasil",
      "status": "em_andamento",
      "participantes": [
        {
          "timeId": "...",
          "nome": "Flamengo",
          "escudo": "https://...",
          "sigla": "FLA"
        }
      ],
      "totalTimes": 20
    }
  ]
}
```

#### `POST /api/campeonatos`
Cria um novo campeonato.

**Body:**
```json
{
  "nome": "Brasileirão Série A",
  "ano": 2024,
  "divisao": "Série A",
  "pais": "Brasil",
  "logo": "https://...",
  "status": "planejado",
  "dataInicio": "2024-04-13",
  "dataFim": "2024-12-08",
  "participantes": [
    { "timeId": "..." },
    { "timeId": "..." }
  ]
}
```

#### `GET /api/campeonatos/[id]`
Busca um campeonato específico.

#### `PUT /api/campeonatos/[id]`
Atualiza um campeonato.

#### `DELETE /api/campeonatos/[id]`
Deleta um campeonato (verifica se não possui jogos).

---

## 🎨 Páginas Criadas

### `/times` - Gerenciamento de Times
- ✅ Listagem em cards com escudos
- ✅ Criação/edição em modal
- ✅ Campos completos (nome, sigla, escudo, fundação, estádio, cidade, estado)
- ✅ Validação de duplicidade
- ✅ Proteção contra exclusão (verifica uso em campeonatos/jogos)

### `/campeonatos` - Gerenciamento de Campeonatos
- ✅ Listagem em cards com logos
- ✅ Criação/edição em modal
- ✅ Seleção visual de times participantes
- ✅ Status visual (Planejado, Em Andamento, Finalizado)
- ✅ Preview dos times participantes
- ✅ Validação de duplicidade (nome + ano)

---

## 🚀 Próximos Passos de Integração

### 1. Atualizar GameManager Component
O componente `components/bolao/GameManager.tsx` precisa ser atualizado para usar selects ao invés de inputs de texto:

```tsx
// ANTES (texto livre)
<Input placeholder="Time da Casa" value={timeCasa} />

// DEPOIS (select com times do campeonato)
<Select value={timeCasaId}>
  {timesParticipantes.map(time => (
    <SelectItem key={time.id} value={time.id}>
      <div className="flex items-center gap-2">
        {time.escudo && <img src={time.escudo} className="w-5 h-5" />}
        {time.nome}
      </div>
    </SelectItem>
  ))}
</Select>
```

### 2. Atualizar API de Jogos
Modificar `/api/jogos/route.ts` para trabalhar com IDs ao invés de textos:

```typescript
// Salvar jogo com IDs
{
  bolaoId,
  campeonatoId,  // ID ao invés de nome
  rodada,
  timeCasaId,    // ID ao invés de nome
  timeForaId,    // ID ao invés de nome
  data,
  horario
}

// Ao retornar, fazer join com collections
const jogos = await db.collection('jogos').aggregate([
  {
    $lookup: {
      from: 'times',
      localField: 'timeCasaId',
      foreignField: '_id',
      as: 'timeCasa'
    }
  },
  // ... similar para timeFora e campeonato
])
```

### 3. Script de Migração (OPCIONAL)
Se já tiver jogos cadastrados com texto, criar migração:

```typescript
// scripts/migrate-jogos-to-ids.ts
import { getDatabase } from '@/lib/mongodb'

async function migrate() {
  const db = await getDatabase()
  
  // 1. Buscar todos os jogos com texto
  const jogos = await db.collection('jogos').find({
    timeCasa: { $type: 'string' }
  }).toArray()
  
  // 2. Para cada jogo, encontrar times correspondentes
  for (const jogo of jogos) {
    const timeCasa = await db.collection('times').findOne({
      nome: { $regex: new RegExp(`^${jogo.timeCasa}$`, 'i') }
    })
    
    const timeFora = await db.collection('times').findOne({
      nome: { $regex: new RegExp(`^${jogo.timeFora}$`, 'i') }
    })
    
    if (timeCasa && timeFora) {
      await db.collection('jogos').updateOne(
        { _id: jogo._id },
        {
          $set: {
            timeCasaId: timeCasa._id.toString(),
            timeForaId: timeFora._id.toString()
          },
          $unset: {
            timeCasa: '',
            timeFora: ''
          }
        }
      )
    }
  }
}
```

---

## 💡 SUGESTÕES DE MELHORIAS PARA O PROJETO

### 🔥 Prioridade Alta (Impacto Imediato)

#### 1. **Sistema de Notificações em Tempo Real**
```typescript
// lib/pusher.ts - Usando Pusher ou Socket.io
import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Notificar quando:
// - Novo participante entra no bolão (admin recebe)
// - Participante aprovado/recusado (usuário recebe)
// - Novo jogo adicionado ao bolão
// - Prazo de palpite próximo do fim (1h antes)
// - Resultado do jogo atualizado
// - Ranking atualizado após rodada
```

#### 2. **Sistema de Pontuação Customizável**
```typescript
// Por bolão, permitir admin configurar:
interface ConfigPontuacao {
  acertoPlacarExato: number      // Ex: 5 pontos
  acertoVencedor: number          // Ex: 3 pontos
  acertoEmpate: number            // Ex: 3 pontos
  acertoDiferenca: number         // Ex: 1 ponto
  bonusRodadaCompleta: number     // Ex: +2 se acertar todos
}
```

#### 3. **Dashboard com Estatísticas Avançadas**
```typescript
// Métricas do usuário:
- Taxa de acerto geral (%)
- Melhor rodada (mais pontos)
- Sequência atual de acertos
- Comparação com média do bolão
- Gráfico de evolução por rodada
- Heatmap de acertos por time
- Palpite mais ousado (maior diferença do placar real)
```

#### 4. **Palpites Rápidos com IA**
```typescript
// Sugerir palpites baseado em:
- Histórico do usuário
- Desempenho dos times
- Confrontos anteriores
- Mandante/visitante

// Botão: "Sugerir Palpites Inteligentes"
```

---

### 🎯 Prioridade Média (Melhoria de UX)

#### 5. **Modo Escuro Completo**
```typescript
// Usar next-themes
import { ThemeProvider } from 'next-themes'

// Toggle no header
<Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? <Sun /> : <Moon />}
</Button>
```

#### 6. **PWA (Progressive Web App)**
```typescript
// next.config.ts
import withPWA from 'next-pwa'

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true
})

// Permitir instalação no celular
// Notificações push
// Funcionar offline (cache de dados)
```

#### 7. **Sistema de Badges/Conquistas**
```typescript
interface Badge {
  id: string
  nome: string
  descricao: string
  icone: string
  criterio: {
    tipo: 'acertos_seguidos' | 'placar_exato' | 'primeiro_lugar' | 'participacao'
    valor: number
  }
}

// Exemplos:
// 🎯 "Certeiro" - 5 placares exatos seguidos
// 🔥 "Em Chamas" - 10 acertos seguidos
// 👑 "Campeão" - Ganhou um bolão
// 📊 "Analista" - 100 palpites feitos
```

#### 8. **Exportação de Dados**
```typescript
// Botão no perfil/ranking
<Button onClick={exportarDados}>
  Exportar Relatório (PDF/Excel)
</Button>

// Gerar PDF com:
// - Histórico completo de palpites
// - Estatísticas detalhadas
// - Gráficos de desempenho
// - Comparação com outros participantes
```

---

### 🚀 Prioridade Baixa (Features Avançadas)

#### 9. **Marketplace de Bolões Públicos**
```typescript
// Página de descoberta
/explorar
- Listar bolões públicos
- Filtros: campeonato, região, nível
- Sistema de avaliação (⭐)
- Top bolões da semana
- Bolões recomendados (IA)
```

#### 10. **Sistema de Prêmios/Recompensas**
```typescript
interface Premio {
  id: string
  bolaoId: string
  tipo: 'dinheiro' | 'produto' | 'voucher'
  descricao: string
  valor: number
  criterio: '1_lugar' | '3_primeiros' | 'mais_acertos_rodada'
  patrocinador?: string
}

// Integração com PIX para distribuição automática
```

#### 11. **Chat por Bolão**
```typescript
// Chat em tempo real dentro do bolão
interface Mensagem {
  id: string
  bolaoId: string
  userId: string
  texto: string
  timestamp: Date
  tipo: 'normal' | 'palpite' | 'reacao'
}

// Features:
// - Reações a mensagens
// - Compartilhar palpites
// - GIFs/Stickers
// - Canais por rodada
```

#### 12. **Modo Competição ao Vivo**
```typescript
// Durante jogos ao vivo:
interface JogoAoVivo {
  jogoId: string
  minuto: number
  placarAtual: { casa: number, fora: number }
  eventos: Array<{
    tipo: 'gol' | 'cartao' | 'substituicao'
    minuto: number
    jogador: string
  }>
}

// Atualizar pontuação em tempo real
// Mostrar quem está ganhando/perdendo pontos
// Animações quando alguém acerta
```

#### 13. **Sistema de Ligas/Divisões**
```typescript
// Dividir participantes em ligas
interface Liga {
  nome: 'Diamante' | 'Platina' | 'Ouro' | 'Prata' | 'Bronze'
  minPontos: number
  maxParticipantes: number
}

// Promoção/rebaixamento automático por temporada
// Premiação diferenciada por liga
```

#### 14. **Análise Preditiva com IA**
```typescript
// Dashboard de insights
interface Insight {
  tipo: 'tendencia' | 'alerta' | 'oportunidade'
  mensagem: string
  confianca: number // 0-100%
}

// Exemplos:
// "Você costuma subestimar o Flamengo como visitante"
// "Seus palpites em jogos de quinta-feira têm 70% de acerto"
// "Considere apostar mais alto no time X baseado em seu histórico"
```

---

## 📱 Melhorias de UI/UX

### Design System Melhorado
```typescript
// Criar componentes reutilizáveis
/components/shared/
  - StatCard.tsx (cards de estatísticas)
  - UserAvatar.tsx (avatar com fallback)
  - ScoreDisplay.tsx (placar visual)
  - RankingBadge.tsx (medalhas 1º, 2º, 3º)
  - TrendIndicator.tsx (↗️ subindo, ↘️ caindo)
  - EmptyState.tsx (estados vazios ilustrados)
```

### Micro-interações
```typescript
// Adicionar animações sutis com Framer Motion
import { motion } from 'framer-motion'

// Exemplos:
// - Card que pulsa quando atualizado
// - Confete ao ganhar rodada
// - Shake ao errar palpite
// - Slide in/out nas transições
```

### Responsividade Avançada
```typescript
// Melhorias mobile:
- Bottom Navigation (ícones fixos)
- Swipe gestures (arrastar para atualizar)
- Drawer lateral (menu)
- Cards mais compactos
- Font scaling automático
```

---

## 🔒 Melhorias de Segurança

### Rate Limiting
```typescript
// Proteger APIs contra abuso
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // max requests
})

// Por usuário, por IP
```

### Auditoria
```typescript
// Log de ações importantes
interface AuditLog {
  userId: string
  acao: string
  recurso: string
  detalhes: any
  ip: string
  timestamp: Date
}

// Rastrear:
// - Criação/exclusão de bolões
// - Aprovação/recusa de participantes
// - Alteração de palpites (se permitido)
// - Mudanças de configuração
```

### Validação Avançada
```typescript
// Usar Zod para schemas
import { z } from 'zod'

const CriarBolaoSchema = z.object({
  nome: z.string().min(3).max(100),
  descricao: z.string().max(500).optional(),
  tipoAcesso: z.enum(['publico', 'privado', 'codigo']),
  codigo: z.string().length(6).regex(/^[A-Z0-9]+$/).optional()
})

// Validar no frontend E backend
```

---

## 📊 Analytics e Métricas

### Implementar Google Analytics 4
```typescript
// lib/gtag.ts
export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url
  })
}

// Eventos personalizados
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}

// Rastrear:
// - Bolões criados
// - Taxa de conversão (visitante → participante)
// - Palpites por rodada
// - Tempo médio de sessão
// - Páginas mais visitadas
```

---

## 🎨 Conclusão

O projeto está com uma base sólida! As principais melhorias recomendadas são:

**✅ Implementar AGORA:**
1. Sistema de Times/Campeonatos (✅ FEITO!)
2. Notificações em tempo real
3. Pontuação customizável

**🔄 Implementar em breve:**
4. Dashboard com estatísticas
5. Modo escuro
6. PWA (app instalável)

**🚀 Roadmap futuro:**
7. Sistema de badges
8. Chat por bolão
9. Modo ao vivo
10. IA preditiva

Quer que eu implemente alguma dessas melhorias agora?
