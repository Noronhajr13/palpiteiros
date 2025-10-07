# 🔄 REFATORAÇÃO - Tela de Criar Bolão

## 📋 Mudanças Solicitadas

### ✅ Campos Mantidos
- Nome do bolão
- Descrição
- Número de participantes
- Pontuação personalizada

### ✨ Novos Campos/Recursos
1. **Premiação Flexível**
   - ☑️ Premiação por Turno (1º e 2º turno)
   - ☑️ Premiação Geral (1º, 2º, 3º lugar)

2. **Modalidade (para Copas)**
   - ☑️ Fase de Grupos
   - ☑️ Mata-Mata

3. **Escolha de Campeonato** (⚠️ CRÍTICO)
   - Select com campeonatos cadastrados
   - Busca da `/api/campeonatos`
   - Armazena `campeonatoId` no bolão

### ❌ Removido
- Cadastro de jogos na mesma tela
- GameManager component

---

## 🏗️ Nova Arquitetura

### Fluxo Proposto:
```
1. /criar-bolao
   └─> Criar bolão com campeonato selecionado
   └─> Redireciona para → /bolao/[id]/jogos

2. /bolao/[id]/jogos (NOVA PÁGINA)
   └─> Gerenciar jogos do bolão
   └─> Usa times do campeonato selecionado
   └─> GameManager atualizado com refs
```

---

## 🔧 Arquivos a Modificar

### 1. Frontend

#### `/app/criar-bolao/page.tsx` ✏️
```typescript
// Novos states
const [campeonatos, setCampeonatos] = useState<Campeonato[]>([])
const [formData, setFormData] = useState({
  nome: '',
  descricao: '',
  campeonatoId: '',  // NOVO
  maxParticipantes: '20',
  
  // Premiação
  tipoPremiacaoTurno: false,  // NOVO
  tipoPremiacaoGeral: true,   // NOVO
  premioTurno1: '',           // NOVO
  premioTurno2: '',           // NOVO
  premioGeral1: '',
  premioGeral2: '',
  premioGeral3: '',
  
  // Modalidade
  modalidadeFaseGrupos: false,  // NOVO
  modalidadeMataMata: false,    // NOVO
  
  // Pontuação
  pontosPlacarExato: '5',
  pontosResultadoCerto: '3',
  pontosGolsExatos: '1',
})

// Carregar campeonatos
useEffect(() => {
  fetch('/api/campeonatos')
    .then(res => res.json())
    .then(data => setCampeonatos(data.campeonatos))
}, [])

// Submit
const handleSubmit = async () => {
  const response = await fetch('/api/bolao/criar', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      descricao,
      campeonatoId,  // NOVO
      maxParticipantes,
      adminId: user.id,
      premiacao: {    // NOVO
        porTurno,
        porGeral,
        turno1, turno2,
        geral1, geral2, geral3
      },
      modalidade: {   // NOVO
        faseGrupos,
        mataMata
      },
      configuracoesPontuacao
    })
  })
  
  // Redirecionar para gerenciar jogos
  router.push(`/bolao/${data.bolao.id}/jogos`)
}
```

#### `/app/bolao/[id]/jogos/page.tsx` 🆕 (CRIAR)
```typescript
'use client'

export default function GerenciarJogosPage({ params }) {
  const [bolao, setBolao] = useState(null)
  const [campeonato, setCampeonato] = useState(null)
  const [timesParticipantes, setTimesParticipantes] = useState([])
  const [jogos, setJogos] = useState([])

  useEffect(() => {
    // Carregar bolão
    fetch(`/api/bolao/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setBolao(data.bolao)
        
        // Carregar campeonato e times
        return fetch(`/api/campeonatos/${data.bolao.campeonatoId}`)
      })
      .then(res => res.json())
      .then(data => {
        setCampeonato(data.campeonato)
        setTimesParticipantes(data.campeonato.participantes)
      })
  }, [params.id])

  return (
    <div>
      <h1>Gerenciar Jogos - {bolao?.nome}</h1>
      <p>Campeonato: {campeonato?.nome}</p>
      
      {/* GameManager atualizado */}
      <GameManagerV2 
        bolaoId={params.id}
        campeonatoId={bolao?.campeonatoId}
        timesDisponiveis={timesParticipantes}
        jogos={jogos}
        onJogosChange={setJogos}
      />
      
      <Button onClick={salvarJogos}>
        Salvar Jogos e Finalizar
      </Button>
    </div>
  )
}
```

---

### 2. Backend

#### `/app/api/bolao/criar/route.ts` ✏️
```typescript
export async function POST(request: NextRequest) {
  const { 
    nome, 
    descricao, 
    campeonatoId,  // NOVO
    maxParticipantes, 
    adminId,
    premiacao,     // NOVO
    modalidade,    // NOVO
    configuracoesPontuacao
  } = await request.json()

  // Validar campeonato existe
  const campeonato = await db.collection('campeonatos')
    .findOne({ _id: new ObjectId(campeonatoId) })
  
  if (!campeonato) {
    return NextResponse.json(
      { error: 'Campeonato não encontrado' },
      { status: 404 }
    )
  }

  const novoBolao = {
    nome,
    descricao,
    campeonatoId,  // NOVO
    codigo: gerarCodigo(),
    adminId,
    maxParticipantes,
    status: 'ativo',
    
    // Premiação
    premiacao: {
      porTurno: premiacao?.porTurno || false,
      porGeral: premiacao?.porGeral || true,
      turno1: premiacao?.turno1 || null,
      turno2: premiacao?.turno2 || null,
      geral1: premiacao?.geral1 || null,
      geral2: premiacao?.geral2 || null,
      geral3: premiacao?.geral3 || null,
    },
    
    // Modalidade
    modalidade: {
      faseGrupos: modalidade?.faseGrupos || false,
      mataMata: modalidade?.mataMata || false,
    },
    
    // Pontuação
    placarExato: configuracoesPontuacao?.placarExato || 5,
    resultadoCerto: configuracoesPontuacao?.resultadoCerto || 3,
    golsExatos: configuracoesPontuacao?.golsExatos || 1,
    
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('boloes').insertOne(novoBolao)
  
  // Auto-participação do admin
  await db.collection('participantes').insertOne({
    userId: adminId,
    bolaoId: result.insertedId.toString(),
    pontos: 0,
    status: 'aprovado',
    createdAt: new Date()
  })

  return NextResponse.json({
    success: true,
    bolao: {
      id: result.insertedId.toString(),
      nome,
      codigo: novoBolao.codigo
    }
  })
}
```

#### `/app/api/bolao/[id]/jogos/route.ts` 🆕 (CRIAR)
```typescript
// GET - Buscar jogos do bolão
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = await getDatabase()
  
  const jogos = await db.collection('jogos')
    .find({ bolaoId: id })
    .sort({ data: 1, horario: 1 })
    .toArray()

  // Popular com dados dos times
  const jogosComTimes = await Promise.all(
    jogos.map(async (jogo) => {
      const [timeCasa, timeFora] = await Promise.all([
        db.collection('times').findOne({ _id: new ObjectId(jogo.timeCasaId) }),
        db.collection('times').findOne({ _id: new ObjectId(jogo.timeForaId) })
      ])
      
      return {
        ...jogo,
        id: jogo._id.toString(),
        timeCasa: {
          id: timeCasa._id.toString(),
          nome: timeCasa.nome,
          escudo: timeCasa.escudo
        },
        timeFora: {
          id: timeFora._id.toString(),
          nome: timeFora.nome,
          escudo: timeFora.escudo
        }
      }
    })
  )

  return NextResponse.json({
    success: true,
    jogos: jogosComTimes
  })
}

// POST - Criar/Atualizar jogos em lote
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { jogos } = await request.json()
  
  const db = await getDatabase()
  
  // Deletar jogos existentes
  await db.collection('jogos').deleteMany({ bolaoId: id })
  
  // Inserir novos jogos
  const jogosParaInserir = jogos.map((jogo: any) => ({
    bolaoId: id,
    campeonatoId: jogo.campeonatoId,
    rodada: jogo.rodada,
    timeCasaId: jogo.timeCasaId,  // Agora é ID
    timeForaId: jogo.timeForaId,  // Agora é ID
    data: jogo.data,
    horario: jogo.horario,
    fase: jogo.fase || 'grupos',  // grupos, oitavas, quartas, etc
    placar: null,
    status: 'agendado',
    createdAt: new Date()
  }))
  
  await db.collection('jogos').insertMany(jogosParaInserir)
  
  return NextResponse.json({
    success: true,
    message: `${jogos.length} jogos salvos com sucesso`
  })
}
```

---

## 🎯 Componente Atualizado

### `components/bolao/GameManagerV2.tsx` 🆕
```typescript
interface Props {
  bolaoId: string
  campeonatoId: string
  timesDisponiveis: Array<{
    timeId: string
    nome: string
    escudo?: string
    sigla: string
  }>
  jogos: Jogo[]
  onJogosChange: (jogos: Jogo[]) => void
}

export function GameManagerV2({ 
  bolaoId,
  campeonatoId, 
  timesDisponiveis,
  jogos,
  onJogosChange 
}: Props) {
  
  const adicionarJogo = () => {
    onJogosChange([...jogos, {
      id: generateId(),
      bolaoId,
      campeonatoId,
      rodada: '',
      timeCasaId: '',    // Select com timesDisponiveis
      timeForaId: '',    // Select com timesDisponiveis
      data: '',
      horario: '',
      fase: 'grupos'
    }])
  }

  return (
    <div>
      {jogos.map((jogo, index) => (
        <div key={jogo.id} className="grid grid-cols-6 gap-2">
          <Input 
            placeholder="Rodada"
            value={jogo.rodada}
            onChange={(e) => updateJogo(index, 'rodada', e.target.value)}
          />
          
          {/* SELECT ao invés de INPUT de texto */}
          <select
            value={jogo.timeCasaId}
            onChange={(e) => updateJogo(index, 'timeCasaId', e.target.value)}
          >
            <option value="">Selecione Time Casa</option>
            {timesDisponiveis.map(time => (
              <option key={time.timeId} value={time.timeId}>
                {time.sigla} - {time.nome}
              </option>
            ))}
          </select>
          
          <span>X</span>
          
          <select
            value={jogo.timeForaId}
            onChange={(e) => updateJogo(index, 'timeForaId', e.target.value)}
          >
            <option value="">Selecione Time Fora</option>
            {timesDisponiveis.map(time => (
              <option key={time.timeId} value={time.timeId}>
                {time.sigla} - {time.nome}
              </option>
            ))}
          </select>
          
          <Input type="date" />
          <Input type="time" />
        </div>
      ))}
      
      <Button onClick={adicionarJogo}>
        Adicionar Jogo
      </Button>
    </div>
  )
}
```

---

## 📊 Estrutura de Dados MongoDB Atualizada

### Collection: `boloes`
```javascript
{
  _id: ObjectId,
  nome: String,
  descricao: String,
  campeonatoId: String,  // ⭐ NOVO - Referência ao campeonato
  codigo: String,
  adminId: String,
  maxParticipantes: Number,
  status: String,
  
  // ⭐ NOVO - Premiação
  premiacao: {
    porTurno: Boolean,
    porGeral: Boolean,
    turno1: String?,
    turno2: String?,
    geral1: String?,
    geral2: String?,
    geral3: String?
  },
  
  // ⭐ NOVO - Modalidade
  modalidade: {
    faseGrupos: Boolean,
    mataMata: Boolean
  },
  
  // Pontuação
  placarExato: Number,
  resultadoCerto: Number,
  golsExatos: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `jogos` (ATUALIZADA)
```javascript
{
  _id: ObjectId,
  bolaoId: String,
  campeonatoId: String,    // Referência
  rodada: String,
  timeCasaId: String,      // ⭐ MUDOU de timeCasa (texto) para ID
  timeForaId: String,      // ⭐ MUDOU de timeFora (texto) para ID
  data: String,            // YYYY-MM-DD
  horario: String,         // HH:MM
  fase: String,            // ⭐ NOVO - 'grupos', 'oitavas', 'quartas', 'semi', 'final'
  placar: {
    casa: Number?,
    fora: Number?
  },
  status: String,          // 'agendado', 'ao_vivo', 'finalizado'
  createdAt: Date
}
```

---

## ✅ Checklist de Implementação

### Fase 1: Backend
- [ ] Atualizar `/api/bolao/criar/route.ts` com novos campos
- [ ] Criar `/api/bolao/[id]/route.ts` (GET bolão específico)
- [ ] Criar `/api/bolao/[id]/jogos/route.ts` (GET/POST jogos)

### Fase 2: Frontend - Criar Bolão
- [ ] Refatorar `/app/criar-bolao/page.tsx`
- [ ] Adicionar select de campeonatos
- [ ] Adicionar checkboxes de premiação
- [ ] Adicionar checkboxes de modalidade
- [ ] Remover GameManager da tela
- [ ] Redirecionar para `/bolao/[id]/jogos` após criar

### Fase 3: Frontend - Gerenciar Jogos
- [ ] Criar `/app/bolao/[id]/jogos/page.tsx`
- [ ] Criar `GameManagerV2` component
- [ ] Implementar selects de times (não texto livre)
- [ ] Adicionar campo de fase (para mata-mata)
- [ ] Implementar salvar jogos em lote

### Fase 4: Testes
- [ ] Testar criação de bolão com campeonato
- [ ] Testar cadastro de jogos com times do campeonato
- [ ] Testar diferentes modalidades (grupos/mata-mata)
- [ ] Testar premiação por turno e geral

---

## 🚀 Próximos Passos

1. **Criar novo arquivo** `/app/criar-bolao/page.tsx` com estrutura completa
2. **Atualizar API** `/api/bolao/criar/route.ts`
3. **Criar página** `/app/bolao/[id]/jogos/page.tsx`
4. **Criar API** `/api/bolao/[id]/jogos/route.ts`
5. **Atualizar component** `GameManager` → `GameManagerV2`

---

## 📝 Observações Importantes

⚠️ **BREAKING CHANGE**: Jogos agora usam IDs de times, não texto livre
⚠️ **MIGRAÇÃO NECESSÁRIA**: Se já existem jogos, criar script de migração
✅ **BENEFÍCIOS**: 
- Dados normalizados
- Validação automática de times
- Escudos/logos automáticos
- Facilita estatísticas por time
- Melhor integridade de dados

---

**Quer que eu implemente agora alguma parte específica?**
