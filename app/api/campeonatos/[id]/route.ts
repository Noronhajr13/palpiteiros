import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET - Buscar campeonato específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    const db = await getDatabase()
    
    const campeonato = await db.collection('campeonatos').findOne({ _id: new ObjectId(id) })

    if (!campeonato) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 })
    }

    // Buscar times participantes
    const timeIds = (campeonato.participantes as Array<{ timeId: string }> || []).map((p) => new ObjectId(p.timeId))
    const times = await db.collection('times').find({ _id: { $in: timeIds } }).toArray()
    const timesMap = new Map(times.map(t => [t._id.toString(), t]))

    return NextResponse.json({
      success: true,
      campeonato: {
        id: campeonato._id.toString(),
        nome: campeonato.nome,
        ano: campeonato.ano,
        divisao: campeonato.divisao,
        pais: campeonato.pais,
        logo: campeonato.logo,
        status: campeonato.status,
        dataInicio: campeonato.dataInicio,
        dataFim: campeonato.dataFim,
        times: ((campeonato.participantes as Array<{ timeId: string }>) || []).map((p) => {
          const time = timesMap.get(p.timeId)
          return {
            id: p.timeId,
            nome: time?.nome || 'Time não encontrado',
            escudo: time?.escudo || null,
            sigla: time?.sigla || '???',
            cidade: time?.cidade || null,
            estado: time?.estado || null
          }
        }).sort((a: Record<string, unknown>, b: Record<string, unknown>) => String(a.nome).localeCompare(String(b.nome))),
        participantes: ((campeonato.participantes as Array<{ timeId: string }>) || []).map((p) => {
          const time = timesMap.get(p.timeId)
          return {
            timeId: p.timeId,
            nome: time?.nome || 'Time não encontrado',
            escudo: time?.escudo || null,
            sigla: time?.sigla || '???'
          }
        })
      }
    })

  } catch (error) {
    console.error('Erro ao buscar campeonato:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar campeonato
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    const { 
      nome, 
      pais,
      logo,
      participantes 
    } = await request.json()

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    const result = await db.collection('campeonatos').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          nome: nome.trim(),
          pais: pais || 'Brasil',
          logo: logo || null,
          participantes: participantes || [],
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Campeonato não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Campeonato atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar campeonato:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar campeonato
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { id } = await params
    const db = await getDatabase()

    // Verificar se há jogos usando este campeonato
    const jogosComCampeonato = await db.collection('jogos').countDocuments({
      campeonatoId: id
    })

    if (jogosComCampeonato > 0) {
      return NextResponse.json(
        { 
          error: 'Campeonato não pode ser excluído pois possui jogos cadastrados',
          jogos: jogosComCampeonato
        },
        { status: 400 }
      )
    }

    await db.collection('campeonatos').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: 'Campeonato excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar campeonato:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
