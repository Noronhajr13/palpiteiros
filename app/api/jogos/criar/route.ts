import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bolaoId, timeA, timeB, data, rodada, status, placarA, placarB } = body

    if (!bolaoId || !timeA || !timeB || !data || !rodada) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: bolaoId, timeA, timeB, data, rodada' 
      }, { status: 400 })
    }

    // Validar se o bolão existe
    const bolao = await prisma.bolao.findUnique({
      where: { id: bolaoId }
    })

    if (!bolao) {
      return NextResponse.json({ error: 'Bolão não encontrado' }, { status: 404 })
    }

    // Criar o jogo
    const novoJogo = await prisma.jogo.create({
      data: {
        bolaoId,
        timeA,
        timeB,
        data: new Date(data),
        rodada: parseInt(rodada),
        status: status || 'agendado',
        placarA: placarA ? parseInt(placarA) : null,
        placarB: placarB ? parseInt(placarB) : null
      }
    })

    return NextResponse.json(novoJogo, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar jogo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}