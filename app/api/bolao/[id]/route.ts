import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Buscar bolão com todos os dados relacionados
    const bolao = await prisma.bolao.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        participantes: {
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
            { pontos: 'desc' }
          ]
        },
        jogos: {
          orderBy: [
            { rodada: 'asc' },
            { data: 'asc' }
          ]
        },
        palpites: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            },
            jogo: {
              select: {
                id: true,
                timeA: true,
                timeB: true,
                rodada: true
              }
            }
          }
        }
      }
    })

    if (!bolao) {
      return NextResponse.json({ error: 'Bolão não encontrado' }, { status: 404 })
    }

    // Calcular estatísticas
    const jogosFinalizados = bolao.jogos.filter(j => j.status === 'finalizado').length
    const jogosAgendados = bolao.jogos.filter(j => j.status === 'agendado').length
    const totalPalpites = bolao.palpites.length
    const rodadaAtual = Math.max(...bolao.jogos.map(j => j.rodada), 0)

    // Formatar resposta
    const response = {
      ...bolao,
      estatisticas: {
        totalParticipantes: bolao.participantes.length,
        jogosFinalizados,
        jogosAgendados,
        totalJogos: bolao.jogos.length,
        totalPalpites,
        rodadaAtual,
        aproveitamentoMedio: bolao.participantes.length > 0
          ? Math.round(
              bolao.participantes.reduce((acc, p) => 
                acc + (p.totalPalpites > 0 ? (p.palpitesCorretos / p.totalPalpites) * 100 : 0), 0
              ) / bolao.participantes.length
            )
          : 0
      },
      participantes: bolao.participantes.map(p => ({
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
      }))
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar detalhes do bolão:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}