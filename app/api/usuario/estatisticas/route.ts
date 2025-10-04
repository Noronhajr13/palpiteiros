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
    const periodo = searchParams.get('periodo') || 'all' // all, month, quarter

    // Calcular datas para filtro
    let dataInicio: Date | undefined
    if (periodo === 'month') {
      dataInicio = new Date()
      dataInicio.setMonth(dataInicio.getMonth() - 1)
    } else if (periodo === 'quarter') {
      dataInicio = new Date()
      dataInicio.setMonth(dataInicio.getMonth() - 3)
    }

    // Buscar dados do usuário
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        participacoes: {
          include: {
            bolao: true
          }
        },
        palpites: {
          where: dataInicio ? {
            createdAt: {
              gte: dataInicio
            }
          } : undefined,
          include: {
            jogo: {
              include: {
                bolao: true
              }
            }
          }
        }
      }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Estatísticas gerais
    const totalPalpites = usuario.palpites.length
    let palpitesCorretos = 0
    let acertosExatos = 0
    let pontosTotais = 0

    // Estatísticas por time
    const estatisticasPorTime: Record<string, {
      jogos: number
      acertos: number
      pontos: number
    }> = {}

    // Estatísticas por competição
    const estatisticasPorBolao: Record<string, {
      nome: string
      palpites: number
      acertos: number
      pontos: number
      aproveitamento: number
    }> = {}

    // Processar palpites
    for (const palpite of usuario.palpites) {
      const jogo = palpite.jogo
      
      if (jogo.status === 'finalizado') {
        const placarExato = palpite.placarA === jogo.placarA && 
                           palpite.placarB === jogo.placarB

        if (placarExato) {
          palpitesCorretos++
          acertosExatos++
          pontosTotais += 10
        } else {
          // Verificar resultado
          const resultadoPalpite = palpite.placarA > palpite.placarB ? 'casa' :
                                  palpite.placarA < palpite.placarB ? 'visitante' : 'empate'
          
          const resultadoReal = (jogo.placarA || 0) > (jogo.placarB || 0) ? 'casa' :
                               (jogo.placarA || 0) < (jogo.placarB || 0) ? 'visitante' : 'empate'

          if (resultadoPalpite === resultadoReal) {
            palpitesCorretos++
            pontosTotais += 5
          }
        }
      }

      // Estatísticas por time
      [jogo.timeA, jogo.timeB].forEach(time => {
        if (!estatisticasPorTime[time]) {
          estatisticasPorTime[time] = { jogos: 0, acertos: 0, pontos: 0 }
        }
        estatisticasPorTime[time].jogos++
        
        if (jogo.status === 'finalizado') {
          const acertou = (palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB) ||
            ((palpite.placarA > palpite.placarB ? 'casa' : palpite.placarA < palpite.placarB ? 'visitante' : 'empate') ===
             ((jogo.placarA || 0) > (jogo.placarB || 0) ? 'casa' : (jogo.placarA || 0) < (jogo.placarB || 0) ? 'visitante' : 'empate'))
          
          if (acertou) {
            estatisticasPorTime[time].acertos++
            estatisticasPorTime[time].pontos += palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB ? 10 : 5
          }
        }
      })

      // Estatísticas por bolão
      const bolaoId = jogo.bolao.id
      if (!estatisticasPorBolao[bolaoId]) {
        estatisticasPorBolao[bolaoId] = {
          nome: jogo.bolao.nome,
          palpites: 0,
          acertos: 0,
          pontos: 0,
          aproveitamento: 0
        }
      }
      
      estatisticasPorBolao[bolaoId].palpites++
      
      if (jogo.status === 'finalizado') {
        const acertou = (palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB) ||
          ((palpite.placarA > palpite.placarB ? 'casa' : palpite.placarA < palpite.placarB ? 'visitante' : 'empate') ===
           ((jogo.placarA || 0) > (jogo.placarB || 0) ? 'casa' : (jogo.placarA || 0) < (jogo.placarB || 0) ? 'visitante' : 'empate'))
        
        if (acertou) {
          estatisticasPorBolao[bolaoId].acertos++
          estatisticasPorBolao[bolaoId].pontos += palpite.placarA === jogo.placarA && palpite.placarB === jogo.placarB ? 10 : 5
        }
      }
    }

    // Calcular aproveitamento por bolão
    Object.values(estatisticasPorBolao).forEach(stats => {
      stats.aproveitamento = stats.palpites > 0 ? Math.round((stats.acertos / stats.palpites) * 100) : 0
    })

    // Estatísticas de performance por período
    const now = new Date()
    const ultimoMes = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const ultimoTrimestre = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

    const palpitesUltimoMes = usuario.palpites.filter(p => new Date(p.createdAt) >= ultimoMes)
    const palpitesUltimoTrimestre = usuario.palpites.filter(p => new Date(p.createdAt) >= ultimoTrimestre)

    const calcularEstatisticas = (palpitesPeriodo: typeof usuario.palpites) => {
      const total = palpitesPeriodo.length
      let corretos = 0
      let exatos = 0
      
      palpitesPeriodo.forEach(p => {
        if (p.jogo.status === 'finalizado') {
          if (p.placarA === p.jogo.placarA && p.placarB === p.jogo.placarB) {
            corretos++
            exatos++
          } else {
            const resultPalpite = p.placarA > p.placarB ? 'casa' : p.placarA < p.placarB ? 'visitante' : 'empate'
            const resultReal = (p.jogo.placarA || 0) > (p.jogo.placarB || 0) ? 'casa' : (p.jogo.placarA || 0) < (p.jogo.placarB || 0) ? 'visitante' : 'empate'
            if (resultPalpite === resultReal) corretos++
          }
        }
      })
      
      return { total, corretos, exatos, aproveitamento: total > 0 ? Math.round((corretos / total) * 100) : 0 }
    }

    const estatisticas = {
      geral: {
        totalPalpites,
        palpitesCorretos,
        acertosExatos,
        aproveitamento: totalPalpites > 0 ? Math.round((palpitesCorretos / totalPalpites) * 100) : 0,
        pontosTotais,
        totalBoloes: usuario.participacoes.length
      },
      ultimoMes: calcularEstatisticas(palpitesUltimoMes),
      ultimoTrimestre: calcularEstatisticas(palpitesUltimoTrimestre),
      porTime: Object.entries(estatisticasPorTime)
        .map(([time, stats]) => ({
          time,
          ...stats,
          aproveitamento: stats.jogos > 0 ? Math.round((stats.acertos / stats.jogos) * 100) : 0
        }))
        .sort((a, b) => b.aproveitamento - a.aproveitamento)
        .slice(0, 10),
      porBolao: Object.values(estatisticasPorBolao)
        .sort((a, b) => b.aproveitamento - a.aproveitamento)
    }

    return NextResponse.json(estatisticas)

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}