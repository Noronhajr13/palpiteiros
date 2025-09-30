import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { 
      nome, 
      descricao, 
      maxParticipantes, 
      premios,
      configuracoesPontuacao,
      adminId 
    } = await request.json()

    if (!nome || !adminId) {
      return NextResponse.json(
        { error: 'Nome do bolão e ID do admin são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar bolão
    const novoBolao = await prisma.bolao.create({
      data: {
        nome,
        descricao: descricao || '',
        codigo: Math.random().toString(36).substring(2, 8).toUpperCase(),
        adminId,
        maxParticipantes: maxParticipantes || 20,
        status: 'ativo',
        premios: premios || null,
        placarExato: configuracoesPontuacao?.placarExato || 10,
        resultadoCerto: configuracoesPontuacao?.resultadoCerto || 5,
        golsExatos: configuracoesPontuacao?.golsExatos || 2,
        multiplicadorFinal: configuracoesPontuacao?.multiplicadorFinal || 1,
        bonusSequencia: configuracoesPontuacao?.bonusSequencia || 0,
        permitePalpiteTardio: configuracoesPontuacao?.permitePalpiteTardio || false,
      }
    })

    // Criar participação do admin
    await prisma.participante.create({
      data: {
        userId: adminId,
        bolaoId: novoBolao.id,
        pontos: 0,
        posicao: 1,
        palpitesCorretos: 0,
        totalPalpites: 0
      }
    })

    return NextResponse.json({
      success: true,
      bolao: {
        id: novoBolao.id,
        nome: novoBolao.nome,
        codigo: novoBolao.codigo
      }
    })

  } catch (error) {
    console.error('Erro ao criar bolão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}