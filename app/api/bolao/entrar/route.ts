import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { codigo, userId } = await request.json()

    if (!codigo || !userId) {
      return NextResponse.json(
        { error: 'Código do bolão e ID do usuário são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar bolão pelo código
    const bolao = await prisma.bolao.findUnique({
      where: { codigo },
      include: {
        participantes: true
      }
    })

    if (!bolao) {
      return NextResponse.json(
        { error: 'Bolão não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se usuário já participa
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jaParticipa = bolao.participantes.some((p: any) => p.userId === userId)
    
    if (jaParticipa) {
      return NextResponse.json({
        success: true,
        message: 'Você já participa deste bolão'
      })
    }

    // Verificar limite de participantes
    if (bolao.participantes.length >= bolao.maxParticipantes) {
      return NextResponse.json(
        { error: 'Bolão já atingiu o limite máximo de participantes' },
        { status: 409 }
      )
    }

    // Adicionar usuário ao bolão
    await prisma.participante.create({
      data: {
        userId,
        bolaoId: bolao.id,
        pontos: 0,
        posicao: bolao.participantes.length + 1,
        palpitesCorretos: 0,
        totalPalpites: 0
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Você entrou no bolão com sucesso!',
      bolao: {
        id: bolao.id,
        nome: bolao.nome,
        codigo: bolao.codigo
      }
    })

  } catch (error) {
    console.error('Erro ao entrar no bolão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}