import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { codigo, userId } = await request.json()

    if (!codigo || !userId) {
      return NextResponse.json(
        { error: 'Código do bolão e ID do usuário são obrigatórios' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Buscar bolão pelo código
    const bolao = await db.collection('boloes').findOne({ codigo })

    if (!bolao) {
      return NextResponse.json(
        { error: 'Bolão não encontrado' },
        { status: 404 }
      )
    }

    const bolaoId = bolao._id.toString()

    // Verificar se usuário já participa
    const participacaoExistente = await db.collection('participantes').findOne({
      userId,
      bolaoId
    })
    
    if (participacaoExistente) {
      return NextResponse.json({
        success: true,
        message: 'Você já participa deste bolão'
      })
    }

    // Verificar limite de participantes (apenas aprovados)
    const participantesAprovados = await db.collection('participantes').countDocuments({
      bolaoId,
      status: 'aprovado'
    })

    if (participantesAprovados >= bolao.maxParticipantes) {
      return NextResponse.json(
        { error: 'Bolão já atingiu o limite máximo de participantes' },
        { status: 409 }
      )
    }

    // Determinar status inicial baseado em entradaAutomatica
    const statusInicial = bolao.entradaAutomatica ? 'aprovado' : 'pendente'
    const aprovadoEm = bolao.entradaAutomatica ? new Date() : null

    // Adicionar usuário ao bolão
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
      message: bolao.entradaAutomatica 
        ? 'Você entrou no bolão com sucesso!' 
        : 'Solicitação enviada! Aguarde aprovação do administrador.',
      aprovadoAutomaticamente: bolao.entradaAutomatica,
      bolao: {
        id: bolaoId,
        nome: bolao.nome,
        codigo: bolao.codigo
      }
    })

  } catch (error) {
    console.error('Erro ao entrar no bolão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}