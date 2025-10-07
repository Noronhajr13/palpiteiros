import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id: bolaoId } = await params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Buscar bolão
    const bolao = await db.collection('boloes').findOne({ _id: new ObjectId(bolaoId) })

    if (!bolao) {
      return NextResponse.json(
        { error: 'Bolão não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se usuário é admin
    if (bolao.adminId !== session.user.id) {
      return NextResponse.json(
        { error: 'Apenas o administrador pode bloquear participantes' },
        { status: 403 }
      )
    }

    // Buscar participante
    const participante = await db.collection('participantes').findOne({
      userId,
      bolaoId
    })

    if (!participante) {
      return NextResponse.json(
        { error: 'Participante não encontrado' },
        { status: 404 }
      )
    }

    // Bloquear participante
    await db.collection('participantes').updateOne(
      { userId, bolaoId },
      {
        $set: {
          status: 'bloqueado',
          bloqueadoEm: new Date(),
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Participante bloqueado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao bloquear participante:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
