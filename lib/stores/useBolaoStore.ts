import { create } from 'zustand'

export interface Jogo {
  id: string
  rodada: number
  data: string
  timeA: string
  timeB: string
  placarA?: number
  placarB?: number
  status: 'agendado' | 'em_andamento' | 'finalizado'
}

export interface Palpite {
  id: string
  jogoId: string
  userId: string
  placarA: number
  placarB: number
  pontos?: number
}

export interface Participante {
  id: string
  nome: string
  avatar?: string
  pontos: number
  posicao: number
  palpitesCorretos: number
  totalPalpites: number
}

export interface Bolao {
  id: string
  nome: string
  descricao: string
  codigo: string
  admin: string
  maxParticipantes: number
  participantes: Participante[]
  jogos: Jogo[]
  palpites: Palpite[]
  status: 'ativo' | 'finalizado' | 'pausado'
  criadoEm: string
  premios?: {
    geral?: {
      primeiro: string
      segundo?: string
      terceiro?: string
    }
    fases?: {
      primeiroTurno?: string
      segundoTurno?: string
      faseGrupos?: string
      mataMata?: string
    }
  }
  configuracoesPontuacao?: {
    placarExato: number
    resultadoCerto: number
    golsExatos: number
    multiplicadorFinal: number
    bonusSequencia: number
    permitePalpiteTardio: boolean
  }
}

interface BolaoState {
  boloes: Bolao[]
  bolaoAtual: Bolao | null
  loading: boolean
  criarBolao: (dados: Partial<Bolao> & { configuracoesPontuacao?: { placarExato: number; resultadoCerto: number; golsExatos: number; multiplicadorFinal: number; bonusSequencia: number; permitePalpiteTardio: boolean } }, usuario: { id: string, nome: string, avatar?: string }) => Promise<string>
  entrarBolao: (codigo: string, usuario: { id: string, nome: string, avatar?: string }) => Promise<boolean>
  selecionarBolao: (id: string) => void
  salvarPalpite: (jogoId: string, placarA: number, placarB: number) => Promise<boolean>
  carregarBoloes: () => void
}

// Mock data - Jogos do Brasileirão 2024
const jogosExemplo: Jogo[] = [
  {
    id: '1',
    rodada: 1,
    data: '2024-04-13T16:00:00',
    timeA: 'Flamengo',
    timeB: 'Vasco',
    status: 'finalizado',
    placarA: 2,
    placarB: 1
  },
  {
    id: '2',
    rodada: 1,
    data: '2024-04-13T18:30:00',
    timeA: 'Palmeiras',
    timeB: 'São Paulo',
    status: 'finalizado',
    placarA: 1,
    placarB: 1
  },
  {
    id: '3',
    rodada: 2,
    data: '2024-04-20T16:00:00',
    timeA: 'Santos',
    timeB: 'Corinthians',
    status: 'agendado'
  },
  {
    id: '4',
    rodada: 2,
    data: '2024-04-20T18:30:00',
    timeA: 'Botafogo',
    timeB: 'Fluminense',
    status: 'agendado'
  },
  {
    id: '5',
    rodada: 2,
    data: '2024-04-21T16:00:00',
    timeA: 'Cruzeiro',
    timeB: 'Atlético-MG',
    status: 'agendado'
  }
]

// Mock data - Bolões
const boloesExemplo: Bolao[] = [
  {
    id: '1',
    nome: 'Brasileirão 2024 - Família',
    descricao: 'Bolão da família para o Campeonato Brasileiro',
    codigo: 'FAM2024',
    admin: '1',
    maxParticipantes: 10,
    status: 'ativo',
    criadoEm: '2024-04-01',
    premios: {
      geral: {
        primeiro: 'R$ 500',
        segundo: 'R$ 200',
        terceiro: 'R$ 100'
      },
      fases: {
        primeiroTurno: 'R$ 50',
        segundoTurno: 'R$ 50',
        faseGrupos: 'Medalha',
        mataMata: 'Troféu'
      }
    },
    configuracoesPontuacao: {
      placarExato: 10,
      resultadoCerto: 5,
      golsExatos: 2,
      multiplicadorFinal: 1.5,
      bonusSequencia: 3,
      permitePalpiteTardio: false
    },
    participantes: [
      {
        id: '1',
        nome: 'João Silva',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        pontos: 15,
        posicao: 1,
        palpitesCorretos: 3,
        totalPalpites: 5
      },
      {
        id: '2',
        nome: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        pontos: 12,
        posicao: 2,
        palpitesCorretos: 2,
        totalPalpites: 4
      },
      {
        id: '3',
        nome: 'Pedro Costa',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        pontos: 8,
        posicao: 3,
        palpitesCorretos: 1,
        totalPalpites: 3
      }
    ],
    jogos: jogosExemplo,
    palpites: [
      { id: '1', jogoId: '1', userId: '1', placarA: 2, placarB: 1, pontos: 10 },
      { id: '2', jogoId: '2', userId: '1', placarA: 1, placarB: 0, pontos: 5 },
      { id: '3', jogoId: '1', userId: '2', placarA: 1, placarB: 1, pontos: 3 },
    ]
  },
  {
    id: '2',
    nome: 'Copa América 2024',
    descricao: 'Apostas na Copa América',
    codigo: 'COPA24',
    admin: '2',
    maxParticipantes: 20,
    status: 'ativo',
    criadoEm: '2024-06-01',
    participantes: [
      {
        id: '1',
        nome: 'João Silva',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        pontos: 25,
        posicao: 2,
        palpitesCorretos: 5,
        totalPalpites: 8
      },
      {
        id: '2',
        nome: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        pontos: 30,
        posicao: 1,
        palpitesCorretos: 6,
        totalPalpites: 8
      }
    ],
    configuracoesPontuacao: {
      placarExato: 15,
      resultadoCerto: 8,
      golsExatos: 3,
      multiplicadorFinal: 2,
      bonusSequencia: 5,
      permitePalpiteTardio: false
    },
    jogos: [],
    palpites: []
  }
]

export const useBolaoStore = create<BolaoState>((set, get) => ({
  boloes: boloesExemplo,
  bolaoAtual: null,
  loading: false,

  criarBolao: async (dados, usuario) => {
    set({ loading: true })
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const novoBolao: Bolao = {
      id: Date.now().toString(),
      nome: dados.nome || '',
      descricao: dados.descricao || '',
      codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
      admin: usuario.id,
      maxParticipantes: dados.maxParticipantes || 20,
      participantes: [{
        id: usuario.id,
        nome: usuario.nome,
        avatar: usuario.avatar,
        pontos: 0,
        posicao: 1,
        palpitesCorretos: 0,
        totalPalpites: 0
      }],
      jogos: [],
      palpites: [],
      status: 'ativo',
      criadoEm: new Date().toISOString(),
      premios: dados.premios,
      configuracoesPontuacao: dados.configuracoesPontuacao || {
        placarExato: 10,
        resultadoCerto: 5,
        golsExatos: 2,
        multiplicadorFinal: 1,
        bonusSequencia: 0,
        permitePalpiteTardio: false
      }
    }

    set(state => ({ 
      boloes: [...state.boloes, novoBolao],
      loading: false 
    }))
    
    return novoBolao.id
  },

  entrarBolao: async (codigo, usuario) => {
    set({ loading: true })
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const bolao = get().boloes.find(b => b.codigo === codigo)
    
    if (bolao) {
      // Verificar se usuário já participa
      const jaParticipa = bolao.participantes.some(p => p.id === usuario.id)
      
      if (!jaParticipa && bolao.participantes.length < bolao.maxParticipantes) {
        // Adicionar usuário ao bolão
        const novoParticipante: Participante = {
          id: usuario.id,
          nome: usuario.nome,
          avatar: usuario.avatar,
          pontos: 0,
          posicao: bolao.participantes.length + 1,
          palpitesCorretos: 0,
          totalPalpites: 0
        }
        
        bolao.participantes.push(novoParticipante)
        
        set(state => ({
          boloes: state.boloes.map(b => b.id === bolao.id ? bolao : b),
          loading: false
        }))
        
        return true
      }
    }
    
    set({ loading: false })
    return false
  },

  selecionarBolao: (id) => {
    const bolao = get().boloes.find(b => b.id === id)
    set({ bolaoAtual: bolao || null })
  },

  salvarPalpite: async (jogoId, placarA, placarB) => {
    set({ loading: true })
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const state = get()
    const bolaoAtual = state.bolaoAtual
    
    if (!bolaoAtual) {
      set({ loading: false })
      return false
    }
    
    // Criar novo palpite
    const novoPalpite: Palpite = {
      id: Date.now().toString(),
      jogoId,
      userId: '1', // ID do usuário atual
      placarA,
      placarB
    }
    
    // Remover palpite anterior se existir
    const palpitesFiltrados = bolaoAtual.palpites.filter(
      p => !(p.jogoId === jogoId && p.userId === '1')
    )
    
    // Adicionar novo palpite
    const novosPalpites = [...palpitesFiltrados, novoPalpite]
    
    // Atualizar bolão
    const bolaoAtualizado = {
      ...bolaoAtual,
      palpites: novosPalpites
    }
    
    set(state => ({
      boloes: state.boloes.map(b => b.id === bolaoAtual.id ? bolaoAtualizado : b),
      bolaoAtual: bolaoAtualizado,
      loading: false
    }))
    
    return true
  },

  carregarBoloes: () => {
    // Em uma aplicação real, isso faria uma chamada à API
    // Por enquanto, os dados já estão carregados no estado inicial
  }
}))