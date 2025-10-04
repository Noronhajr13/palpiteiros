import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bolaoId = searchParams.get('bolaoId')
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('dataInicio')
    const dataFim = searchParams.get('dataFim')

    // Construir filtros
    interface WhereClause {
      userId: string
      bolaoId?: string
      jogo?: {
        data?: {
          gte?: Date
          lte?: Date
        }
      }
    }

    const where: WhereClause = {
      userId: userId
    }

    if (bolaoId) {
      where.bolaoId = bolaoId
    }

    if (dataInicio || dataFim) {
      where.jogo = {
        data: {}
      }
      if (dataInicio) {
        where.jogo.data!.gte = new Date(dataInicio)
      }
      if (dataFim) {
        where.jogo.data!.lte = new Date(dataFim)
      }
    }

    // Buscar palpites
    const palpites = await prisma.palpite.findMany({
      where,
      include: {
        jogo: {
          include: {
            bolao: {
              select: {
                id: true,
                nome: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Processar dados para incluir status
    const palpitesProcessados = palpites.map(palpite => {
      let statusPalpite = 'pendente'
      let pontos = 0

      if (palpite.jogo.status === 'finalizado') {
        const placarExato = palpite.placarA === palpite.jogo.placarA && 
                           palpite.placarB === palpite.jogo.placarB

        if (placarExato) {
          statusPalpite = 'correto-exato'
          pontos = palpite.pontos || 10
        } else {
          // Verificar se acertou o resultado
          const resultadoPalpite = palpite.placarA > palpite.placarB ? 'casa' :
                                  palpite.placarA < palpite.placarB ? 'visitante' : 'empate'
          
          const resultadoReal = (palpite.jogo.placarA || 0) > (palpite.jogo.placarB || 0) ? 'casa' :
                               (palpite.jogo.placarA || 0) < (palpite.jogo.placarB || 0) ? 'visitante' : 'empate'

          if (resultadoPalpite === resultadoReal) {
            statusPalpite = 'correto-resultado'
            pontos = palpite.pontos || 5
          } else {
            statusPalpite = 'erro'
            pontos = 0
          }
        }
      }

      return {
        id: palpite.id,
        jogo: {
          id: palpite.jogo.id,
          data: palpite.jogo.data,
          rodada: palpite.jogo.rodada,
          timeA: palpite.jogo.timeA,
          timeB: palpite.jogo.timeB,
          placarA: palpite.jogo.placarA,
          placarB: palpite.jogo.placarB,
          status: palpite.jogo.status,
          bolao: palpite.jogo.bolao
        },
        palpite: {
          placarA: palpite.placarA,
          placarB: palpite.placarB
        },
        status: statusPalpite,
        pontos,
        data: palpite.createdAt
      }
    })

    // Filtrar por status se especificado
    const palpitesFiltrados = status 
      ? palpitesProcessados.filter(p => p.status === status)
      : palpitesProcessados

    // Calcular estatísticas
    const totalPalpites = palpitesProcessados.length
    const acertosExatos = palpitesProcessados.filter(p => p.status === 'correto-exato').length
    const acertosResultado = palpitesProcessados.filter(p => p.status === 'correto-resultado').length
    const erros = palpitesProcessados.filter(p => p.status === 'erro').length
    const pendentes = palpitesProcessados.filter(p => p.status === 'pendente').length
    const pontosTotais = palpitesProcessados.reduce((acc, p) => acc + p.pontos, 0)
    const aproveitamento = totalPalpites > 0 
      ? Math.round(((acertosExatos + acertosResultado) / totalPalpites) * 100) 
      : 0

    const estatisticas = {
      totalPalpites,
      acertosExatos,
      acertosResultado,
      erros,
      pendentes,
      pontosTotais,
      aproveitamento
    }

    // Buscar bolões do usuário para filtros
    const participacoes = await prisma.participante.findMany({
      where: { userId },
      include: {
        bolao: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    const boloes = participacoes.map(p => p.bolao)

    return NextResponse.json({
      palpites: palpitesFiltrados,
      estatisticas,
      boloes
    })

  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}