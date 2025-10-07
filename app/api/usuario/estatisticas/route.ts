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
    const palpites = await db.collection('palpites').find({ userId }).toArray()
    const jogoIds = palpites.map(p => new ObjectId(p.jogoId))
    const jogos = await db.collection('jogos').find({ _id: { $in: jogoIds } }).toArray()
    const jogosMap = new Map(jogos.map(j => [j._id.toString(), j]))

    let palpitesCorretos = 0
    let pontosTotais = 0

    for (const palpite of palpites) {
      const jogo = jogosMap.get(palpite.jogoId)
      if (jogo?.status === 'finalizado' && palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB) {
        palpitesCorretos++
      }
      pontosTotais += palpite.pontos || 0
    }

    const aproveitamento = palpites.length > 0 ? Math.round((palpitesCorretos / palpites.length) * 100) : 0

    return NextResponse.json({
      totalPalpites: palpites.length,
      palpitesCorretos,
      aproveitamento,
      pontosTotais
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}