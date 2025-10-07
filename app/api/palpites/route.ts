import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, bolaoId, jogoId, placarA, placarB } = body

    if (!userId || !bolaoId || !jogoId || placarA === undefined || placarB === undefined) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: userId, bolaoId, jogoId, placarA, placarB' 
      }, { status: 400 })
    }

    const db = await getDatabase()

    // Verificar se o usuário participa do bolão
    const participante = await db.collection('participantes').findOne({
      userId,
      bolaoId,
      status: 'aprovado'
    })

    if (!participante) {
      return NextResponse.json({ 
        error: 'Usuário não participa deste bolão' 
      }, { status: 403 })
    }

    // Verificar se o jogo existe e não foi finalizado
    const jogo = await db.collection('jogos').findOne({
      _id: ObjectId.isValid(jogoId) ? new ObjectId(jogoId) : jogoId,
      bolaoId,
      status: { $in: ['agendado', 'adiado'] }
    })

    if (!jogo) {
      return NextResponse.json({ 
        error: 'Jogo não encontrado ou já finalizado' 
      }, { status: 404 })
    }

    // Verificar se já existe palpite (upsert)
    const palpiteExistente = await db.collection('palpites').findOne({
      userId,
      $or: [
        { jogoId },
        { jogoId: ObjectId.isValid(jogoId) ? new ObjectId(jogoId) : jogoId }
      ]
    })

    const palpiteData = {
      jogoId,
      userId,
      bolaoId,
      placarA: parseInt(placarA),
      placarB: parseInt(placarB),
      updatedAt: new Date()
    }

    let palpite
    if (palpiteExistente) {
      await db.collection('palpites').updateOne(
        { _id: palpiteExistente._id },
        { $set: palpiteData }
      )
      palpite = { _id: palpiteExistente._id, ...palpiteData }
    } else {
      const result = await db.collection('palpites').insertOne({
        ...palpiteData,
        createdAt: new Date()
      })
      palpite = { _id: result.insertedId, ...palpiteData }
    }

    return NextResponse.json({ 
      success: true, 
      palpite: {
        id: palpite._id.toString(),
        ...palpiteData
      },
      message: 'Palpite salvo com sucesso!' 
    })

  } catch (error) {
    console.error('Erro ao salvar palpite:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const bolaoId = searchParams.get('bolaoId')
  const rodada = searchParams.get('rodada')

  if (!userId || !bolaoId) {
    return NextResponse.json({ 
      error: 'Parâmetros obrigatórios: userId, bolaoId' 
    }, { status: 400 })
  }

  try {
    const db = await getDatabase()

    console.log('🔍 GET Palpites - userId:', userId, 'bolaoId:', bolaoId, 'rodada:', rodada)

    // Construir match para filtrar por rodada se fornecido
    const matchStage: Record<string, unknown> = { 
      userId, 
      bolaoId 
    }

    // Primeiro, vamos ver quantos palpites existem
    const palpitesCount = await db.collection('palpites').countDocuments(matchStage)
    console.log('📊 Total de palpites encontrados:', palpitesCount)

    if (palpitesCount > 0) {
      const samplePalpite = await db.collection('palpites').findOne(matchStage)
      console.log('📄 Exemplo de palpite:', {
        jogoId: samplePalpite?.jogoId,
        jogoIdType: typeof samplePalpite?.jogoId,
        placarA: samplePalpite?.placarA,
        placarB: samplePalpite?.placarB
      })
    }

    // Buscar palpites com lookup para jogos
    const pipeline: Record<string, unknown>[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'jogos',
          let: { jogoId: '$jogoId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', { $toObjectId: '$$jogoId' }] },
                    { $eq: [{ $toString: '$_id' }, '$$jogoId'] }
                  ]
                }
              }
            }
          ],
          as: 'jogo'
        }
      },
      { $unwind: { path: '$jogo', preserveNullAndEmptyArrays: false } }
    ]

    // Filtrar por rodada se fornecido
    if (rodada) {
      pipeline.push({
        $match: {
          'jogo.rodada': parseInt(rodada)
        }
      })
    }

    pipeline.push(
      { 
        $sort: { 
          'jogo.rodada': 1, 
          'jogo.data': 1 
        } 
      },
      {
        $project: {
          id: { $toString: '$_id' },
          jogoId: 1,
          userId: 1,
          bolaoId: 1,
          placarA: 1,
          placarB: 1,
          pontos: 1,
          acertou: 1,
          createdAt: 1,
          updatedAt: 1,
          jogo: {
            id: { $toString: '$jogo._id' },
            timeA: '$jogo.timeA',
            timeB: '$jogo.timeB',
            timeAId: '$jogo.timeAId',
            timeBId: '$jogo.timeBId',
            data: '$jogo.data',
            rodada: '$jogo.rodada',
            status: '$jogo.status',
            placarA: '$jogo.placarA',
            placarB: '$jogo.placarB'
          }
        }
      }
    )

    const palpites = await db.collection('palpites').aggregate(pipeline).toArray()

    console.log('✅ Palpites retornados após lookup:', palpites.length)
    if (palpites.length > 0) {
      console.log('📄 Primeiro palpite:', {
        id: palpites[0].id,
        jogo: palpites[0].jogo ? `${palpites[0].jogo.timeA} vs ${palpites[0].jogo.timeB}` : 'SEM JOGO',
        placar: `${palpites[0].placarA} x ${palpites[0].placarB}`
      })
    }

    return NextResponse.json(palpites)
  } catch (error) {
    console.error('Erro ao listar palpites:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}