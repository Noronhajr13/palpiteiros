'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/useAuthStore'

interface UserProfile {
  id: string
  nome: string
  email: string
  avatar?: string
  bio?: string
  localizacao?: string
  dataRegistro: string
  configuracoes: {
    notificacoes: boolean
    emailMarketing: boolean
    visibilidadePublica: boolean
  }
  estatisticas: {
    totalBoloes: number
    totalPalpites: number
    acertosExatos: number
    acertosResultado: number
    aproveitamento: number
    ranking: number
  }
  conquistas: Array<{
    id: string
    nome: string
    descricao: string
    icone: string
    raridade: 'comum' | 'raro' | 'epico' | 'lendario'
    dataConquista: string
  }>
}

interface ProfileData {
  profile: UserProfile | null
  loading: boolean
  editMode: boolean
  saving: boolean
  error: string | null
  formData: {
    nome: string
    bio: string
    localizacao: string
  }
  setEditMode: (mode: boolean) => void
  updateFormData: (field: string, value: string) => void
  saveProfile: () => Promise<boolean>
  uploadAvatar: (file: File) => Promise<boolean>
}

/**
 * Hook customizado para gerenciar perfil do usuário
 * Centraliza toda a lógica de carregamento, edição e salvamento
 */
export function useUserProfile(): ProfileData {
  const { user } = useAuthStore()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    bio: '',
    localizacao: ''
  })

  // Carrega dados do perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        setError(null)
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data - em produção viria da API
        const mockProfile: UserProfile = {
          id: user.id,
          nome: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: 'Apaixonado por futebol e estatísticas! Sempre em busca do palpite perfeito.',
          localizacao: 'São Paulo, SP',
          dataRegistro: '2024-01-15',
          configuracoes: {
            notificacoes: true,
            emailMarketing: false,
            visibilidadePublica: true
          },
          estatisticas: {
            totalBoloes: 5,
            totalPalpites: 127,
            acertosExatos: 23,
            acertosResultado: 45,
            aproveitamento: 68,
            ranking: 847
          },
          conquistas: [
            {
              id: '1',
              nome: 'Primeiro Palpite',
              descricao: 'Fez seu primeiro palpite',
              icone: '🎯',
              raridade: 'comum',
              dataConquista: '2024-01-15'
            },
            {
              id: '2',
              nome: 'Sequência de Ouro',
              descricao: 'Acertou 5 palpites seguidos',
              icone: '🏆',
              raridade: 'epico',
              dataConquista: '2024-02-10'
            }
          ]
        }

        setProfile(mockProfile)
        setFormData({
          nome: mockProfile.nome,
          bio: mockProfile.bio || '',
          localizacao: mockProfile.localizacao || ''
        })
      } catch (err) {
        setError('Erro ao carregar perfil')
        console.error('Erro ao carregar perfil:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  // Atualiza dados do formulário
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Salva alterações do perfil
  const saveProfile = async (): Promise<boolean> => {
    if (!profile) return false

    try {
      setSaving(true)
      setError(null)

      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Atualiza o perfil local
      setProfile(prev => prev ? {
        ...prev,
        nome: formData.nome,
        bio: formData.bio,
        localizacao: formData.localizacao
      } : null)

      setEditMode(false)
      return true
    } catch (err) {
      setError('Erro ao salvar perfil')
      console.error('Erro ao salvar perfil:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Upload de avatar
  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!profile) return false

    try {
      setSaving(true)
      setError(null)

      // Simula delay de upload
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simula URL do avatar
      const mockAvatarUrl = URL.createObjectURL(file)
      
      setProfile(prev => prev ? {
        ...prev,
        avatar: mockAvatarUrl
      } : null)

      return true
    } catch (err) {
      setError('Erro ao fazer upload da imagem')
      console.error('Erro ao fazer upload:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    profile,
    loading,
    editMode,
    saving,
    error,
    formData,
    setEditMode,
    updateFormData,
    saveProfile,
    uploadAvatar
  }
}
