import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Buscar jogo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const jogo = await prisma.jogo.findUnique({
      where: { id },
      include: {
        bolao: {
          select: { nome: true, codigo: true }
        }
      }
    })

    if (!jogo) {
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ jogo })
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
    const { timeA, timeB, data, rodada, status, placarA, placarB } = body

    // Validações
    if (!timeA || !timeB) {
      return NextResponse.json(
        { error: 'Times são obrigatórios' },
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

    // Verificar se o jogo existe
    const jogoExistente = await prisma.jogo.findUnique({
      where: { id }
    })

    if (!jogoExistente) {
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o jogo
    const jogoAtualizado = await prisma.jogo.update({
      where: { id },
      data: {
        timeA,
        timeB,
        data: new Date(data),
        rodada: parseInt(rodada),
        status: status || 'agendado',
        placarA: status === 'finalizado' ? parseInt(placarA) : null,
        placarB: status === 'finalizado' ? parseInt(placarB) : null,
      }
    })

    // Se o jogo foi finalizado, recalcular pontuação
    if (status === 'finalizado') {
      // TODO: Implementar cálculo de pontuação
      console.log('Jogo finalizado - recalcular pontuação para:', id)
    }

    return NextResponse.json({ 
      jogo: jogoAtualizado,
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
    
    // Verificar se o jogo existe
    const jogoExistente = await prisma.jogo.findUnique({
      where: { id },
      include: {
        _count: {
          select: { palpites: true }
        }
      }
    })

    if (!jogoExistente) {
      return NextResponse.json(
        { error: 'Jogo não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há palpites associados
    if (jogoExistente._count.palpites > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir jogo que já possui palpites',
          palpites: jogoExistente._count.palpites
        },
        { status: 400 }
      )
    }

    // Excluir o jogo
    await prisma.jogo.delete({
      where: { id }
    })

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
