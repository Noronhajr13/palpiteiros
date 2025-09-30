import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar participações do usuário
    const participacoes = await prisma.participante.findMany({
      where: { userId },
      include: {
        bolao: {
          include: {
            admin: true,
            participantes: {
              include: {
                user: true
              }
            },
            jogos: true,
            palpites: true
          }
        }
      }
    })

    // Formatar dados para o frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const boloes = participacoes.map((p: any) => {
      const bolao = p.bolao
      return {
        id: bolao.id,
        nome: bolao.nome,
        descricao: bolao.descricao,
        codigo: bolao.codigo,
        admin: bolao.adminId,
        maxParticipantes: bolao.maxParticipantes,
        status: bolao.status,
        criadoEm: bolao.createdAt.toISOString(),
        premios: bolao.premios,
        configuracoesPontuacao: {
          placarExato: bolao.placarExato,
          resultadoCerto: bolao.resultadoCerto,
          golsExatos: bolao.golsExatos,
          multiplicadorFinal: bolao.multiplicadorFinal,
          bonusSequencia: bolao.bonusSequencia,
          permitePalpiteTardio: bolao.permitePalpiteTardio
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        participantes: bolao.participantes.map((part: any) => ({
          id: part.user.id,
          nome: part.user.name,
          avatar: part.user.avatar,
          pontos: part.pontos,
          posicao: part.posicao,
          palpitesCorretos: part.palpitesCorretos,
          totalPalpites: part.totalPalpites
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jogos: bolao.jogos.map((jogo: any) => ({
          id: jogo.id,
          rodada: jogo.rodada,
          data: jogo.data.toISOString(),
          timeA: jogo.timeA,
          timeB: jogo.timeB,
          placarA: jogo.placarA,
          placarB: jogo.placarB,
          status: jogo.status
        })),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        palpites: bolao.palpites.map((palpite: any) => ({
          id: palpite.id,
          jogoId: palpite.jogoId,
          userId: palpite.userId,
          placarA: palpite.placarA,
          placarB: palpite.placarB,
          pontos: palpite.pontos
        }))
      }
    })

    return NextResponse.json({
      success: true,
      boloes
    })

  } catch (error) {
    console.error('Erro ao carregar bolões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}