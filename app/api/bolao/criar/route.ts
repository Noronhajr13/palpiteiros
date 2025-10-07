import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { 
      nome, 
      descricao,
      campeonatoId,
      maxParticipantes,
      premiacao,
      modalidade,
      configuracoesPontuacao,
      adminId,
      codigo
    } = await request.json()

    if (!nome || !adminId) {
      return NextResponse.json(
        { error: 'Nome do bolão e ID do admin são obrigatórios' },
        { status: 400 }
      )
    }

    if (!campeonatoId) {
      return NextResponse.json(
        { error: 'Campeonato é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const codigoBolao = codigo || Math.random().toString(36).substring(2, 8).toUpperCase()

    // Criar bolão
    const novoBolao = {
      nome,
      descricao: descricao || '',
      codigo: codigoBolao,
      adminId,
      campeonatoId,
      maxParticipantes: maxParticipantes || 20,
      status: 'ativo',
      
      // Nova estrutura de premiação
      premiacao: {
        porTurno: premiacao?.porTurno || false,
        porGeral: premiacao?.porGeral || true,
        turno1: premiacao?.turno1 || null,
        turno2: premiacao?.turno2 || null,
        geral1: premiacao?.geral1 || null,
        geral2: premiacao?.geral2 || null,
        geral3: premiacao?.geral3 || null,
      },
      
      // Modalidade (para copas)
      modalidade: {
        faseGrupos: modalidade?.faseGrupos || false,
        mataMata: modalidade?.mataMata || false,
      },
      
      // Pontuação personalizada
      placarExato: configuracoesPontuacao?.placarExato || 5,
      resultadoCerto: configuracoesPontuacao?.resultadoCerto || 3,
      golsExatos: configuracoesPontuacao?.golsExatos || 1,
      
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const resultBolao = await db.collection('boloes').insertOne(novoBolao)
    const bolaoId = resultBolao.insertedId.toString()

    // Criar participação do admin
    await db.collection('participantes').insertOne({
      userId: adminId,
      bolaoId,
      pontos: 0,
      posicao: 1,
      palpitesCorretos: 0,
      totalPalpites: 0,
      status: 'aprovado',
      solicitadoEm: new Date(),
      aprovadoEm: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      bolao: {
        id: bolaoId,
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