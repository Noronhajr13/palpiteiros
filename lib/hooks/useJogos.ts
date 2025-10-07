import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

interface Jogo {
  id: string
  timeAId?: string
  timeBId?: string
  timeA: string
  timeB: string
  data: string
  rodada: number
  status: 'agendado' | 'finalizado' | 'cancelado' | 'adiado'
  placarA: number | null
  placarB: number | null
}

interface NovoJogo {
  timeAId?: string
  timeBId?: string
  timeA?: string
  timeB?: string
  data: string
  rodada: number
  status?: string
  placarA?: number | null
  placarB?: number | null
}

export function useJogos(bolaoId: string) {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar jogos
  const carregarJogos = useCallback(async () => {
    if (!bolaoId) return
    
    console.log('🎮 Carregando jogos para bolão:', bolaoId)
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/jogos?bolaoId=${bolaoId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar jogos')
      }
      
      const data = await response.json()
      console.log('✅ Jogos carregados:', data.jogos?.length || 0)
      setJogos(data.jogos || [])
    } catch (error) {
      console.error('❌ Erro ao carregar jogos:', error)
      setError('Erro ao carregar jogos')
      toast.error('Erro ao carregar jogos')
    } finally {
      setLoading(false)
    }
  }, [bolaoId])

  // Carregar jogos automaticamente quando bolaoId mudar
  useEffect(() => {
    if (bolaoId) {
      carregarJogos()
    }
  }, [bolaoId, carregarJogos])

  // Adicionar jogo
  const adicionarJogo = useCallback(async (novoJogo: NovoJogo) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/jogos/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...novoJogo, bolaoId })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar jogo')
      }
      
      const data = await response.json()
      setJogos(prev => [...prev, data.jogo])
      toast.success('Jogo adicionado com sucesso!')
      
      return data.jogo
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar jogo'
      console.error('Erro ao adicionar jogo:', error)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [bolaoId])

  // Atualizar jogo
  const atualizarJogo = useCallback(async (jogoId: string, dadosAtualizados: Partial<NovoJogo>) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/jogos/${jogoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar jogo')
      }
      
      const data = await response.json()
      
      // Atualizar o jogo na lista
      setJogos(prev => prev.map(jogo => 
        jogo.id === jogoId ? data.jogo : jogo
      ))
      
      toast.success('Jogo atualizado com sucesso!')
      return data.jogo
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar jogo'
      console.error('Erro ao atualizar jogo:', error)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Excluir jogo
  const excluirJogo = useCallback(async (jogoId: string) => {
    setLoading(true)
    
    try {
      const response = await fetch(`/api/jogos/${jogoId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir jogo')
      }
      
      // Remover o jogo da lista
      setJogos(prev => prev.filter(jogo => jogo.id !== jogoId))
      toast.success('Jogo excluído com sucesso!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir jogo'
      console.error('Erro ao excluir jogo:', error)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  // Importar jogos em lote
  const importarJogos = useCallback(async (jogosParaImportar: NovoJogo[]) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/jogos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jogos: jogosParaImportar, bolaoId })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao importar jogos')
      }
      
      const data = await response.json()
      
      // Atualizar lista de jogos
      await carregarJogos()
      
      toast.success(`${data.count} jogos importados com sucesso!`)
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao importar jogos'
      console.error('Erro ao importar jogos:', error)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [bolaoId, carregarJogos])

  return {
    jogos,
    loading,
    error,
    carregarJogos,
    adicionarJogo,
    atualizarJogo,
    excluirJogo,
    importarJogos
  }
}