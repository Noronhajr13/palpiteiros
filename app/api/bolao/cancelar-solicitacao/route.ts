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

    const { bolaoId, userId } = await request.json()

    if (!bolaoId || !userId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Buscar participação
    const participante = await db.collection('participantes').findOne({
      userId,
      bolaoId
    })

    if (!participante) {
      return NextResponse.json(
        { error: 'Participação não encontrada' },
        { status: 404 }
      )
    }

    if (participante.status !== 'pendente') {
      return NextResponse.json(
        { error: 'Apenas solicitações pendentes podem ser canceladas' },
        { status: 400 }
      )
    }

    // Deletar participação pendente
    await db.collection('participantes').deleteOne({
      userId,
      bolaoId
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitação cancelada com sucesso'
    })

  } catch (error) {
    console.error('Erro ao cancelar solicitação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
