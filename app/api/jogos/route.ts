import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar jogos de um bolão
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bolaoId = searchParams.get('bolaoId')

    if (!bolaoId) {
      return NextResponse.json(
        { error: 'ID do bolão é obrigatório' },
        { status: 400 }
      )
    }

    const jogos = await prisma.jogo.findMany({
      where: { bolaoId },
      orderBy: [
        { rodada: 'asc' },
        { data: 'asc' }
      ]
    })

    return NextResponse.json({ jogos })
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}