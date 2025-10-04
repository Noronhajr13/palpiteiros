import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    // Buscar dados do usuário com estatísticas
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        participacoes: {
          include: {
            bolao: true
          }
        },
        palpites: {
          include: {
            jogo: true
          }
        }
      }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Calcular estatísticas
    const totalBoloes = usuario.participacoes.length
    const totalPalpites = usuario.palpites.length
    
    let palpitesCorretos = 0
    let melhorPosicao = null
    
    // Calcular palpites corretos
    for (const palpite of usuario.palpites) {
      if (palpite.jogo.status === 'finalizado' && 
          palpite.placarA === palpite.jogo.placarA && 
          palpite.placarB === palpite.jogo.placarB) {
        palpitesCorretos++
      }
    }
    
    // Verificar melhor posição
    for (const participacao of usuario.participacoes) {
      if (participacao.posicao && (melhorPosicao === null || participacao.posicao < melhorPosicao)) {
        melhorPosicao = participacao.posicao
      }
    }

    const aproveitamento = totalPalpites > 0 ? Math.round((palpitesCorretos / totalPalpites) * 100) : 0

    // Buscar bolões ativos
    const boloesAtivos = usuario.participacoes.filter((p: { bolao: { status: string } }) => p.bolao.status === 'ativo').length

    // Calcular conquistas
    const conquistas = []
    
    if (totalBoloes >= 1) conquistas.push({ nome: 'Primeiro Bolão', icone: '🎯' })
    if (totalBoloes >= 5) conquistas.push({ nome: 'Veterano', icone: '🏆' })
    if (aproveitamento >= 70) conquistas.push({ nome: 'Certeiro', icone: '🎪' })
    if (palpitesCorretos >= 50) conquistas.push({ nome: 'Mestre dos Palpites', icone: '👑' })

    const perfil = {
      id: usuario.id,
      nome: usuario.name || 'Usuário',
      email: usuario.email,
      criadoEm: usuario.createdAt,
      estatisticas: {
        totalBoloes,
        boloesAtivos,
        totalPalpites,
        palpitesCorretos,
        aproveitamento,
        ranking: melhorPosicao
      },
      conquistas,
      boloesRecentes: usuario.participacoes
        .slice(0, 3)
        .map((p: { bolao: { id: string, nome: string }, posicao: number, pontos: number }) => ({
          id: p.bolao.id,
          nome: p.bolao.nome,
          posicao: p.posicao,
          pontos: p.pontos
        }))
    }

    return NextResponse.json(perfil)

  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { nome } = await request.json()

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const usuario = await prisma.user.update({
      where: { id: userId },
      data: { name: nome }
    })

    return NextResponse.json({ 
      message: 'Perfil atualizado com sucesso',
      usuario: {
        id: usuario.id,
        nome: usuario.name,
        email: usuario.email
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}