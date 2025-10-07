import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bolaoId: string }> }
) {
  try {
    const { bolaoId } = await params

    const db = await getDatabase()

    // Buscar participantes com lookup para users
    const participantes = await db.collection('participantes').aggregate([
      { $match: { bolaoId, status: 'aprovado' } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $sort: { 
          posicao: 1, 
          pontos: -1, 
          palpitesCorretos: -1 
        }
      },
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

    // Calcular estatísticas gerais do bolão
    const estatisticas = {
      totalParticipantes: participantes.length,
      totalPalpites: participantes.reduce((acc, p) => acc + (p.totalPalpites || 0), 0),
      totalAcertos: participantes.reduce((acc, p) => acc + (p.palpitesCorretos || 0), 0),
      pontuacaoMedia: participantes.length > 0 
        ? Math.round(participantes.reduce((acc, p) => acc + (p.pontos || 0), 0) / participantes.length)
        : 0
    }

    // Buscar detalhes do bolão para configurações
    const bolaoObjectId = ObjectId.isValid(bolaoId) ? new ObjectId(bolaoId) : null
    
    const bolao = bolaoObjectId 
      ? await db.collection('boloes').findOne(
          { _id: bolaoObjectId },
          {
            projection: {
              nome: 1,
              placarExato: 1,
              resultadoCerto: 1,
              golsExatos: 1,
              multiplicadorFinal: 1,
              bonusSequencia: 1
            }
          }
        )
      : null

    return NextResponse.json({
      ranking: participantes.map(p => ({
        id: p.id,
        userId: p.userId,
        nome: p.user.name,
        avatar: p.user.avatar,
        pontos: p.pontos || 0,
        posicao: p.posicao || 0,
        palpitesCorretos: p.palpitesCorretos || 0,
        totalPalpites: p.totalPalpites || 0,
        aproveitamento: p.totalPalpites > 0 
          ? Math.round((p.palpitesCorretos / p.totalPalpites) * 100)
          : 0
      })),
      estatisticas,
      configuracoes: bolao ? {
        nome: bolao.nome,
        placarExato: bolao.placarExato,
        resultadoCerto: bolao.resultadoCerto,
        golsExatos: bolao.golsExatos,
        multiplicadorFinal: bolao.multiplicadorFinal,
        bonusSequencia: bolao.bonusSequencia
      } : null
    })

  } catch (error) {
    console.error('Erro ao buscar ranking:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}