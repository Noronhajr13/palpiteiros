import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { headers } from 'next/headers'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const db = await getDatabase()
    const palpites = await db.collection('palpites').find({ userId }).sort({ createdAt: -1 }).toArray()

    if (palpites.length === 0) {
      return NextResponse.json({ palpites: [] })
    }

    const jogoIds = palpites.map(p => new ObjectId(p.jogoId))
    const jogos = await db.collection('jogos').find({ _id: { $in: jogoIds } }).toArray()
    const jogosMap = new Map(jogos.map(j => [j._id.toString(), j]))

    const palpitesProcessados = palpites.map(palpite => {
      const jogo = jogosMap.get(palpite.jogoId)
      if (!jogo) return null

      let statusPalpite = 'pendente'
      if (jogo.status === 'finalizado') {
        statusPalpite = (palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB) ? 'acertou' : 'errou'
      }

      return {
        id: palpite._id.toString(),
        palpiteA: palpite.placarA,
        palpiteB: palpite.placarB,
        placarRealA: jogo.placarA,
        placarRealB: jogo.placarB,
        timeA: jogo.timeA,
        timeB: jogo.timeB,
        data: jogo.data,
        statusPalpite,
        pontos: palpite.pontos || 0
      }
    }).filter(p => p !== null)

    return NextResponse.json({ palpites: palpitesProcessados })
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}