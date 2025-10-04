import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bolaoId: string }> }
) {
  try {
    const { bolaoId } = await params

    // Buscar participantes com seus dados de usuário
    const participantes = await prisma.participante.findMany({
      where: { bolaoId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { posicao: 'asc' },
        { pontos: 'desc' },
        { palpitesCorretos: 'desc' }
      ]
    })

    // Calcular estatísticas gerais do bolão
    const estatisticas = {
      totalParticipantes: participantes.length,
      totalPalpites: participantes.reduce((acc, p) => acc + p.totalPalpites, 0),
      totalAcertos: participantes.reduce((acc, p) => acc + p.palpitesCorretos, 0),
      pontuacaoMedia: participantes.length > 0 
        ? Math.round(participantes.reduce((acc, p) => acc + p.pontos, 0) / participantes.length)
        : 0
    }

    // Buscar detalhes do bolão para configurações
    const bolao = await prisma.bolao.findUnique({
      where: { id: bolaoId },
      select: {
        nome: true,
        placarExato: true,
        resultadoCerto: true,
        golsExatos: true,
        multiplicadorFinal: true,
        bonusSequencia: true
      }
    })

    return NextResponse.json({
      ranking: participantes.map(p => ({
        id: p.id,
        userId: p.userId,
        nome: p.user.name,
        avatar: p.user.avatar,
        pontos: p.pontos,
        posicao: p.posicao,
        palpitesCorretos: p.palpitesCorretos,
        totalPalpites: p.totalPalpites,
        aproveitamento: p.totalPalpites > 0 
          ? Math.round((p.palpitesCorretos / p.totalPalpites) * 100)
          : 0
      })),
      estatisticas,
      configuracoes: bolao
    })

  } catch (error) {
    console.error('Erro ao buscar ranking:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}