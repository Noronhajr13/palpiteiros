import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { bolaoId, userId, userName, userAvatar, codigo } = await request.json()

    if (!bolaoId || !userId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Buscar bolão
    const bolao = await db.collection('boloes').findOne({ _id: bolaoId })

    if (!bolao) {
      return NextResponse.json(
        { error: 'Bolão não encontrado' },
        { status: 404 }
      )
    }

    // Validações
    if (bolao.status !== 'ativo') {
      return NextResponse.json(
        { error: 'Bolão não está ativo' },
        { status: 400 }
      )
    }

    // Verificar se usuário já participa
    const participacaoExistente = await db.collection('participantes').findOne({
      userId,
      bolaoId
    })

    if (participacaoExistente) {
      return NextResponse.json(
        { error: 'Você já solicitou entrada neste bolão' },
        { status: 400 }
      )
    }

    // Verificar se bolão está lotado (apenas aprovados)
    const participantesAprovados = await db.collection('participantes').countDocuments({
      bolaoId,
      status: 'aprovado'
    })

    if (participantesAprovados >= bolao.maxParticipantes) {
      return NextResponse.json(
        { error: 'Bolão lotado' },
        { status: 400 }
      )
    }

    // Se tipo 'codigo', validar código
    if (bolao.tipoAcesso === 'codigo') {
      if (!codigo || codigo.toUpperCase() !== bolao.codigo) {
        return NextResponse.json(
          { error: 'Código incorreto' },
          { status: 400 }
        )
      }
    }

    // Determinar status inicial
    const statusInicial = bolao.entradaAutomatica ? 'aprovado' : 'pendente'
    const aprovadoEm = bolao.entradaAutomatica ? new Date() : null

    // Criar participação
    await db.collection('participantes').insertOne({
      userId,
      bolaoId,
      pontos: 0,
      posicao: participantesAprovados + 1,
      palpitesCorretos: 0,
      totalPalpites: 0,
      status: statusInicial,
      solicitadoEm: new Date(),
      aprovadoEm,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      aprovadoAutomaticamente: bolao.entradaAutomatica,
      message: bolao.entradaAutomatica 
        ? 'Entrada aprovada automaticamente!' 
        : 'Solicitação enviada! Aguarde aprovação do administrador.'
    })

  } catch (error) {
    console.error('Erro ao solicitar entrada:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
