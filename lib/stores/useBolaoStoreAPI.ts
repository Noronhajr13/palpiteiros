import { create } from 'zustand'

export interface Jogo {
  id: string
  rodada: number
  data: string
  timeA: string
  timeB: string
  placarA?: number | null
  placarB?: number | null
  status: 'agendado' | 'em_andamento' | 'finalizado'
}

export interface Palpite {
  id: string
  jogoId: string
  userId: string
  placarA: number
  placarB: number
  pontos?: number | null
}

export interface Participante {
  id: string
  nome: string
  avatar?: string | null
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
  campeonatoId?: string
  maxParticipantes: number
  participantes: Participante[]
  jogos: Jogo[]
  palpites: Palpite[]
  status: 'ativo' | 'finalizado' | 'pausado'
  criadoEm: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  premios?: any
  premiacao?: {
    porTurno: boolean
    porGeral: boolean
    turno1?: string | null
    turno2?: string | null
    geral1?: string | null
    geral2?: string | null
    geral3?: string | null
  }
  modalidade?: {
    faseGrupos: boolean
    mataMata: boolean
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
  criarBolao: (dados: Partial<Bolao> & { configuracoesPontuacao?: { placarExato: number; resultadoCerto: number; golsExatos: number; multiplicadorFinal: number; bonusSequencia: number; permitePalpiteTardio: boolean } }, usuario: { id: string, nome: string, avatar?: string | null }) => Promise<string>
  entrarBolao: (codigo: string, usuario: { id: string, nome: string, avatar?: string | null }) => Promise<boolean>
  selecionarBolao: (id: string) => void
  salvarPalpite: (userId: string, bolaoId: string, jogoId: string, placarA: number, placarB: number) => Promise<boolean>
  carregarBoloes: (userId: string) => Promise<void>
  carregarBolao: (id: string) => Promise<void>
}

export const useBolaoStoreDB = create<BolaoState>((set, get) => ({
  boloes: [],
  bolaoAtual: null,
  loading: false,

  criarBolao: async (dados, usuario) => {
    set({ loading: true })
    
    try {
      const response = await fetch('/api/bolao/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: dados.nome,
          descricao: dados.descricao,
          maxParticipantes: dados.maxParticipantes,
          premios: dados.premios,
          configuracoesPontuacao: dados.configuracoesPontuacao,
          adminId: usuario.id
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Recarregar bolões do usuário
        await get().carregarBoloes(usuario.id)
        set({ loading: false })
        return data.bolao.id
      }

      throw new Error(data.error || 'Erro ao criar bolão')
    } catch (error) {
      console.error('Erro ao criar bolão:', error)
      set({ loading: false })
      throw error
    }
  },

  entrarBolao: async (codigo, usuario) => {
    set({ loading: true })
    
    try {
      const response = await fetch('/api/bolao/entrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo,
          userId: usuario.id
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Recarregar bolões do usuário
        await get().carregarBoloes(usuario.id)
        set({ loading: false })
        return true
      }

      set({ loading: false })
      return false
    } catch (error) {
      console.error('Erro ao entrar no bolão:', error)
      set({ loading: false })
      return false
    }
  },

  selecionarBolao: async (id) => {
    await get().carregarBolao(id)
  },

  salvarPalpite: async (userId: string, bolaoId: string, jogoId: string, placarA: number, placarB: number) => {
    set({ loading: true })
    
    try {
      const response = await fetch('/api/palpites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bolaoId,
          jogoId,
          placarA,
          placarB
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        set({ loading: false })
        return true
      }

      throw new Error(data.error || 'Erro ao salvar palpite')
    } catch (error) {
      console.error('Erro ao salvar palpite:', error)
      set({ loading: false })
      return false
    }
  },

  carregarBoloes: async (userId) => {
    set({ loading: true })
    
    try {
      const response = await fetch(`/api/bolao/listar?userId=${userId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        set({ boloes: data.boloes, loading: false })
      } else {
        set({ boloes: [], loading: false })
      }
    } catch (error) {
      console.error('Erro ao carregar bolões:', error)
      set({ boloes: [], loading: false })
    }
  },

  carregarBolao: async (id) => {
    set({ loading: true })
    
    try {
      // Tentar buscar dados completos da API
      const response = await fetch(`/api/bolao/${id}`)
      
      if (response.ok) {
        const bolaoCompleto = await response.json()
        set({ bolaoAtual: bolaoCompleto, loading: false })
      } else {
        // Fallback para dados da lista local
        const bolao = get().boloes.find(b => b.id === id)
        set({ bolaoAtual: bolao || null, loading: false })
      }
    } catch (error) {
      console.error('Erro ao carregar bolão:', error)
      // Fallback para dados da lista local
      const bolao = get().boloes.find(b => b.id === id)
      set({ bolaoAtual: bolao || null, loading: false })
    }
  }
}))