import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bolaoId, timeAId, timeBId, timeA, timeB, data, rodada, status, placarA, placarB } = body

    if (!bolaoId || (!timeAId && !timeA) || (!timeBId && !timeB) || !data || !rodada) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: bolaoId, (timeAId ou timeA), (timeBId ou timeB), data, rodada' 
      }, { status: 400 })
    }

    const db = await getDatabase()

    // Validar se o bolão existe
    const bolao = await db.collection('boloes').findOne({
      _id: ObjectId.isValid(bolaoId) ? new ObjectId(bolaoId) : bolaoId
    })

    if (!bolao) {
      return NextResponse.json({ error: 'Bolão não encontrado' }, { status: 404 })
    }

    // Criar o jogo com suporte a IDs e nomes dos times
    const novoJogoData = {
      bolaoId,
      timeAId: timeAId || null,
      timeBId: timeBId || null,
      timeA: timeA || timeAId, // Fallback para ID se nome não fornecido
      timeB: timeB || timeBId, // Fallback para ID se nome não fornecido
      data: new Date(data),
      rodada: parseInt(rodada),
      status: status || 'agendado',
      placarA: placarA ? parseInt(placarA) : null,
      placarB: placarB ? parseInt(placarB) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('jogos').insertOne(novoJogoData)

    const novoJogo = {
      id: result.insertedId.toString(),
      ...novoJogoData
    }

    return NextResponse.json({ success: true, jogo: novoJogo }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar jogo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}