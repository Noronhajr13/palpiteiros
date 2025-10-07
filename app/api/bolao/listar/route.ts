import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('🔑 API /api/bolao/listar chamada com userId:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Buscar participações do usuário (apenas aprovados)
    const participacoes = await db.collection('participantes').find({
      userId,
      status: 'aprovado'
    }).toArray()
    
    console.log('✅ Participações encontradas:', participacoes.length)
    console.log('📋 Detalhes das participações:', participacoes.map(p => ({
      bolaoId: p.bolaoId,
      pontos: p.pontos,
      status: p.status
    })))

    if (participacoes.length === 0) {
      return NextResponse.json({
        success: true,
        boloes: []
      })
    }

    // Buscar bolões (converter IDs para ObjectId)
    const bolaoIds = participacoes.map(p => p.bolaoId)
    const bolaoObjectIds = bolaoIds
      .filter(id => id && ObjectId.isValid(id))
      .map(id => new ObjectId(id))
    
    console.log('🔍 Buscando bolões para IDs:', bolaoIds)
    console.log('🔄 ObjectIds convertidos:', bolaoObjectIds)
    
    const boloes = await db.collection('boloes').find({
      _id: { $in: bolaoObjectIds }
    }).toArray()
    
    console.log('✅ Bolões encontrados:', boloes.length)

    // Buscar todos os participantes dos bolões
    const todosParticipantes = await db.collection('participantes').find({
      bolaoId: { $in: bolaoIds },
      status: 'aprovado'
    }).toArray()

    // Buscar usuários dos participantes (converter IDs para ObjectId)
    const userIds = todosParticipantes.map(p => p.userId)
    const userObjectIds = userIds
      .filter(id => id && ObjectId.isValid(id))
      .map(id => new ObjectId(id))
    
    const users = await db.collection('users').find({
      _id: { $in: userObjectIds }
    }).toArray()
    const usersMap = new Map(users.map(u => [u._id.toString(), u]))

    // Buscar jogos dos bolões
    const jogos = await db.collection('jogos').find({
      bolaoId: { $in: bolaoIds }
    }).toArray()

    // Buscar palpites dos bolões
    const palpites = await db.collection('palpites').find({
      bolaoId: { $in: bolaoIds }
    }).toArray()

    // Agrupar por bolão
    const jogosPorBolao = new Map<string, Record<string, unknown>[]>()
    const palpitesPorBolao = new Map<string, Record<string, unknown>[]>()
    const participantesPorBolao = new Map<string, Record<string, unknown>[]>()

    for (const jogo of jogos) {
      const key = jogo.bolaoId
      if (!jogosPorBolao.has(key)) jogosPorBolao.set(key, [])
      jogosPorBolao.get(key)!.push(jogo)
    }

    for (const palpite of palpites) {
      const key = palpite.bolaoId
      if (!palpitesPorBolao.has(key)) palpitesPorBolao.set(key, [])
      palpitesPorBolao.get(key)!.push(palpite)
    }

    for (const part of todosParticipantes) {
      const key = part.bolaoId
      if (!participantesPorBolao.has(key)) participantesPorBolao.set(key, [])
      participantesPorBolao.get(key)!.push(part)
    }

    // Formatar dados para o frontend
    const boloesFormatados = boloes.map(bolao => {
      const bolaoId = bolao._id.toString()
      
      console.log(`📦 Formatando bolão: ${bolao.nome} (ID: ${bolaoId})`)
      
      const participantesDoBolao = participantesPorBolao.get(bolaoId) || []
      console.log(`👥 Participantes do bolão ${bolao.nome}:`, participantesDoBolao.map(p => ({
        userId: p.userId,
        pontos: p.pontos
      })))
      
      return {
        id: bolaoId,
        nome: bolao.nome,
        descricao: bolao.descricao,
        codigo: bolao.codigo,
        admin: bolao.adminId,
        maxParticipantes: bolao.maxParticipantes,
        status: bolao.status,
        criadoEm: bolao.createdAt?.toISOString() || new Date().toISOString(),
        premios: bolao.premios,
        configuracoesPontuacao: {
          placarExato: bolao.placarExato,
          resultadoCerto: bolao.resultadoCerto,
          golsExatos: bolao.golsExatos,
          multiplicadorFinal: bolao.multiplicadorFinal,
          bonusSequencia: bolao.bonusSequencia,
          permitePalpiteTardio: bolao.permitePalpiteTardio
        },
        participantes: participantesDoBolao.map(part => {
          const user = usersMap.get(String(part.userId))
          console.log(`  🔍 Participante: ${part.userId} -> User encontrado:`, user?.name)
          return {
            id: part.userId, // Mantém como string (pode ser ObjectId.toString())
            nome: user?.name || 'Usuário',
            avatar: user?.image || null,
            pontos: part.pontos,
            posicao: part.posicao,
            palpitesCorretos: part.palpitesCorretos,
            totalPalpites: part.totalPalpites
          }
        }),
        jogos: (jogosPorBolao.get(bolaoId) || []).map(jogo => ({
          id: String((jogo as { _id: unknown })._id),
          rodada: jogo.rodada,
          data: ((jogo as { data?: Date }).data as Date | undefined)?.toISOString() || new Date().toISOString(),
          timeA: jogo.timeA,
          timeB: jogo.timeB,
          placarA: jogo.placarA,
          placarB: jogo.placarB,
          status: jogo.status
        })),
        palpites: (palpitesPorBolao.get(bolaoId) || []).map(palpite => ({
          id: String((palpite as { _id: unknown })._id),
          jogoId: palpite.jogoId,
          userId: palpite.userId,
          placarA: palpite.placarA,
          placarB: palpite.placarB,
          pontos: palpite.pontos
        }))
      }
    })

    console.log('🎉 Retornando', boloesFormatados.length, 'bolões para o frontend')
    console.log('📊 Resumo:', boloesFormatados.map(b => ({
      nome: b.nome,
      participantes: b.participantes.length
    })))

    return NextResponse.json({
      success: true,
      boloes: boloesFormatados
    })

  } catch (error) {
    console.error('Erro ao carregar bolões:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}