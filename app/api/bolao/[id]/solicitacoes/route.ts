import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(
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
        { error: 'Apenas o administrador pode ver solicitações' },
        { status: 403 }
      )
    }

    // Buscar solicitações pendentes
    const participantesPendentes = await db.collection('participantes').find({
      bolaoId,
      status: 'pendente'
    }).sort({ solicitadoEm: 1 }).toArray()

    // Buscar informações dos usuários
    const userIds = participantesPendentes.map(p => p.userId)
    const users = await db.collection('users').find({
      _id: { $in: userIds }
    }).toArray()

    const usersMap = new Map(users.map(u => [u._id.toString(), u]))

    // Formatar solicitações
    const solicitacoes = participantesPendentes.map(p => {
      const user = usersMap.get(p.userId)
      return {
        id: p.userId,
        nome: user?.name || 'Usuário',
        email: user?.email || '',
        avatar: user?.image || null,
        pontos: p.pontos || 0,
        posicao: p.posicao || 0,
        status: p.status,
        solicitadoEm: p.solicitadoEm.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      solicitacoes
    })

  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
