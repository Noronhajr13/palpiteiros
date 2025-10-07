import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Buscar jogo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    
    const jogo = await db.collection('jogos').findOne({ _id: new ObjectId(id) })

    if (!jogo) {
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar bolão
    const bolao = await db.collection('boloes').findOne(
      { _id: jogo.bolaoId },
      { projection: { nome: 1, codigo: 1 } }
    )

    return NextResponse.json({ 
      jogo: {
        ...jogo,
        id: jogo._id.toString(),
        bolao: bolao ? { nome: bolao.nome, codigo: bolao.codigo } : null
      }
    })
  } catch (error) {
    console.error('Erro ao buscar jogo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar jogo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { timeAId, timeBId, timeA, timeB, data, rodada, status, placarA, placarB } = body

    // Validações - aceitar tanto IDs quanto nomes
    if ((!timeAId && !timeA) || (!timeBId && !timeB)) {
      return NextResponse.json(
        { error: 'Times são obrigatórios (IDs ou nomes)' },
        { status: 400 }
      )
    }

    if (!data || !rodada) {
      return NextResponse.json(
        { error: 'Data e rodada são obrigatórias' },
        { status: 400 }
      )
    }

    // Se status é finalizado, placares são obrigatórios
    if (status === 'finalizado' && (placarA === null || placarB === null)) {
      return NextResponse.json(
        { error: 'Placares são obrigatórios para jogos finalizados' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Verificar se o jogo existe
    const jogoExistente = await db.collection('jogos').findOne({ _id: new ObjectId(id) })

    if (!jogoExistente) {
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o jogo
    const updateData: Record<string, unknown> = {
      data: new Date(data),
      rodada: parseInt(rodada),
      status: status || 'agendado',
      placarA: status === 'finalizado' ? parseInt(placarA) : null,
      placarB: status === 'finalizado' ? parseInt(placarB) : null,
      updatedAt: new Date()
    }

    // Atualizar IDs e nomes dos times se fornecidos
    if (timeAId) updateData.timeAId = timeAId
    if (timeBId) updateData.timeBId = timeBId
    if (timeA) updateData.timeA = timeA
    if (timeB) updateData.timeB = timeB

    const result = await db.collection('jogos').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    // Se o jogo foi finalizado, recalcular pontuação
    if (status === 'finalizado') {
      // TODO: Implementar cálculo de pontuação
      console.log('Jogo finalizado - recalcular pontuação para:', id)
    }

    return NextResponse.json({ 
      jogo: result,
      message: 'Jogo atualizado com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir jogo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    
    // Verificar se o jogo existe
    const jogoExistente = await db.collection('jogos').findOne({ _id: new ObjectId(id) })

    if (!jogoExistente) {
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há palpites associados
    const palpitesCount = await db.collection('palpites').countDocuments({ jogoId: id })

    if (palpitesCount > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir jogo que já possui palpites',
          palpites: palpitesCount
        },
        { status: 400 }
      )
    }

    // Excluir o jogo
    await db.collection('jogos').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ 
      message: 'Jogo excluído com sucesso!'
    })
  } catch (error) {
    console.error('Erro ao excluir jogo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
