import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const db = await getDatabase()
    const bolaoId = new ObjectId(id)

    // Buscar bolão
    const bolao = await db.collection('boloes').findOne({ _id: bolaoId })

    if (!bolao) {
      return NextResponse.json({ error: 'Bolão não encontrado' }, { status: 404 })
    }

    // Buscar admin
    const admin = await db.collection('users').findOne(
      { _id: new ObjectId(bolao.adminId) },
      { projection: { _id: 1, name: 1, avatar: 1 } }
    )

    // Buscar participantes com lookup para users
    const participantes = await db.collection('participantes').aggregate([
      { $match: { bolaoId: id, status: 'aprovado' } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { posicao: 1, pontos: -1 } },
      {
        $project: {
          id: { $toString: '$_id' },
          userId: 1,
          pontos: 1,
          posicao: 1,
          palpitesCorretos: 1,
          totalPalpites: 1,
          user: {
            id: { $toString: '$user._id' },
            name: '$user.name',
            avatar: '$user.avatar'
          }
        }
      }
    ]).toArray()

    // Buscar jogos
    const jogos = await db.collection('jogos')
      .find({ bolaoId: id })
      .sort({ rodada: 1, data: 1 })
      .toArray()

    // Buscar palpites com lookup para users e jogos
    const palpites = await db.collection('palpites').aggregate([
      { $match: { bolaoId: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'jogos',
          localField: 'jogoId',
          foreignField: '_id',
          as: 'jogo'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$jogo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: { $toString: '$_id' },
          jogoId: 1,
          userId: 1,
          placarA: 1,
          placarB: 1,
          user: {
            id: { $toString: '$user._id' },
            name: '$user.name'
          },
          jogo: {
            id: { $toString: '$jogo._id' },
            timeA: '$jogo.timeA',
            timeB: '$jogo.timeB',
            rodada: '$jogo.rodada'
          }
        }
      }
    ]).toArray()

    // Calcular estatísticas
    const jogosFinalizados = jogos.filter(j => j.status === 'finalizado').length
    const jogosAgendados = jogos.filter(j => j.status === 'agendado').length
    const totalPalpites = palpites.length
    const rodadaAtual = jogos.length > 0 ? Math.max(...jogos.map(j => j.rodada)) : 0

    // Formatar resposta
    const response = {
      id: bolao._id.toString(),
      nome: bolao.nome,
      descricao: bolao.descricao,
      adminId: bolao.adminId,
      codigo: bolao.codigo,
      privacidade: bolao.privacidade,
      status: bolao.status,
      modalidade: bolao.modalidade,
      campeonatoId: bolao.campeonatoId,
      premiacao: bolao.premiacao,
      createdAt: bolao.createdAt,
      updatedAt: bolao.updatedAt,
      admin: admin ? {
        id: admin._id.toString(),
        name: admin.name,
        avatar: admin.avatar
      } : null,
      estatisticas: {
        totalParticipantes: participantes.length,
        jogosFinalizados,
        jogosAgendados,
        totalJogos: jogos.length,
        totalPalpites,
        rodadaAtual,
        aproveitamentoMedio: participantes.length > 0
          ? Math.round(
              participantes.reduce((acc, p) => 
                acc + (p.totalPalpites > 0 ? (p.palpitesCorretos / p.totalPalpites) * 100 : 0), 0
              ) / participantes.length
            )
          : 0
      },
      participantes: participantes.map(p => ({
        id: p.id,
        userId: p.userId,
        nome: p.user.name,
        avatar: p.user.avatar,
        pontos: p.pontos,
        posicao: p.posicao,
        palpitesCorretos: p.palpitesCorretos,
        totalPalpites: p.totalPalpites,
        aproveitamento: p.totalPalpites > 0 
          ? Math.round((p.palpitesCorretos / p.totalPalpites) * 100)
          : 0
      })),
      jogos: jogos.map(j => ({
        id: j._id.toString(),
        ...j,
        _id: undefined
      })),
      palpites
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar detalhes do bolão:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}