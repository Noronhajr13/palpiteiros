import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, bolaoId, jogoId, placarA, placarB } = body

    if (!userId || !bolaoId || !jogoId || placarA === undefined || placarB === undefined) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: userId, bolaoId, jogoId, placarA, placarB' 
      }, { status: 400 })
    }

    // Verificar se o usuário participa do bolão
    const participante = await prisma.participante.findUnique({
      where: {
        userId_bolaoId: {
          userId,
          bolaoId
        }
      }
    })

    if (!participante) {
      return NextResponse.json({ 
        error: 'Usuário não participa deste bolão' 
      }, { status: 403 })
    }

    // Verificar se o jogo existe e não foi finalizado
    const jogo = await prisma.jogo.findFirst({
      where: {
        id: jogoId,
        bolaoId,
        status: {
          in: ['agendado', 'adiado']
        }
      }
    })

    if (!jogo) {
      return NextResponse.json({ 
        error: 'Jogo não encontrado ou já finalizado' 
      }, { status: 404 })
    }

    // Verificar se já existe palpite (upsert)
    const palpite = await prisma.palpite.upsert({
      where: {
        jogoId_userId: {
          jogoId,
          userId
        }
      },
      update: {
        placarA: parseInt(placarA),
        placarB: parseInt(placarB)
      },
      create: {
        jogoId,
        userId,
        bolaoId,
        placarA: parseInt(placarA),
        placarB: parseInt(placarB)
      }
    })

    return NextResponse.json({ 
      success: true, 
      palpite,
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

  if (!userId || !bolaoId) {
    return NextResponse.json({ 
      error: 'Parâmetros obrigatórios: userId, bolaoId' 
    }, { status: 400 })
  }

  try {
    const palpites = await prisma.palpite.findMany({
      where: {
        userId,
        bolaoId
      },
      include: {
        jogo: {
          select: {
            id: true,
            timeA: true,
            timeB: true,
            data: true,
            rodada: true,
            status: true,
            placarA: true,
            placarB: true
          }
        }
      },
      orderBy: [
        { jogo: { rodada: 'asc' } },
        { jogo: { data: 'asc' } }
      ]
    })

    return NextResponse.json(palpites)
  } catch (error) {
    console.error('Erro ao listar palpites:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}