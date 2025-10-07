import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const db = await getDatabase()

    // Buscar bolões públicos e com código
    const boloes = await db.collection('boloes').find({
      tipoAcesso: {
        $in: ['publico', 'codigo']
      }
    }).toArray()

    // Buscar informações dos admins
    const adminIds = boloes.map(b => b.adminId)
    const admins = await db.collection('users').find({
      _id: { $in: adminIds }
    }).toArray()

    const adminsMap = new Map(admins.map(a => [a._id.toString(), a]))

    // Buscar participantes de cada bolão
    const bolaoIds = boloes.map(b => b._id.toString())
    const participantes = await db.collection('participantes').find({
      bolaoId: { $in: bolaoIds }
    }).toArray()

    // Agrupar participantes por bolão
    const participantesPorBolao = new Map<string, Record<string, unknown>[]>()
    for (const p of participantes) {
      const key = p.bolaoId
      if (!participantesPorBolao.has(key)) {
        participantesPorBolao.set(key, [])
      }
      participantesPorBolao.get(key)!.push(p)
    }

    // Buscar usuários dos participantes
    const userIds = participantes.map(p => p.userId)
    const users = await db.collection('users').find({
      _id: { $in: userIds }
    }).toArray()
    const usersMap = new Map(users.map(u => [u._id.toString(), u]))

    // Buscar jogos de cada bolão
    const jogos = await db.collection('jogos').find({
      bolaoId: { $in: bolaoIds }
    }).toArray()

    const jogosPorBolao = new Map<string, number>()
    for (const jogo of jogos) {
      const key = jogo.bolaoId
      jogosPorBolao.set(key, (jogosPorBolao.get(key) || 0) + 1)
    }

    // Formatar dados para o frontend
    const boloesFormatados = boloes.map(bolao => {
      const bolaoId = bolao._id.toString()
      const admin = adminsMap.get(bolao.adminId)
      const participantesDoBolao = participantesPorBolao.get(bolaoId) || []

      return {
        id: bolaoId,
        nome: bolao.nome,
        descricao: bolao.descricao || '',
        codigo: bolao.codigo,
        admin: bolao.adminId,
        adminNome: admin?.name || 'Admin',
        maxParticipantes: bolao.maxParticipantes,
        participantes: participantesDoBolao.map(p => {
          const user = usersMap.get(String(p.userId))
          return {
            id: p.userId,
            nome: user?.name || 'Usuário',
            avatar: user?.image || null,
            pontos: p.pontos || 0,
            posicao: p.posicao || 0,
            status: p.status || 'aprovado',
            solicitadoEm: p.solicitadoEm || new Date().toISOString(),
            aprovadoEm: p.aprovadoEm || null
          }
        }),
        totalJogos: jogosPorBolao.get(bolaoId) || 0,
        status: bolao.status || 'ativo',
        tipoAcesso: bolao.tipoAcesso || 'privado',
        criadoEm: bolao.createdAt || new Date().toISOString(),
        premios: bolao.premios || null
      }
    })

    return NextResponse.json({
      success: true,
      boloes: boloesFormatados
    })

  } catch (error) {
    console.error('Erro ao buscar bolões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
