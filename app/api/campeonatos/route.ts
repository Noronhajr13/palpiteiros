import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET - Listar todos os campeonatos
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const db = await getDatabase()
    const campeonatos = await db.collection('campeonatos')
      .find({})
      .sort({ ano: -1, nome: 1 })
      .toArray()

    // Buscar dados dos times participantes
    const campeonatosFormatados = await Promise.all(
      campeonatos.map(async (camp) => {
        
        const timeIds = ((camp.participantes as Array<{ timeId: string }>) || []).map((p) => p.timeId)
        
        // Converter strings para ObjectId
        const objectIds = timeIds
          .filter((id: string) => id && ObjectId.isValid(id))
          .map((id: string) => new ObjectId(id))

        const times = await db.collection('times')
          .find({ _id: { $in: objectIds } })
          .toArray()

        const timesMap = new Map(times.map(t => [t._id.toString(), t]))

        return {
          id: camp._id.toString(),
          nome: camp.nome,
          ano: camp.ano,
          divisao: camp.divisao,
          pais: camp.pais,
          logo: camp.logo,
          status: camp.status,
          dataInicio: camp.dataInicio,
          dataFim: camp.dataFim,
          participantes: ((camp.participantes as Array<{ timeId: string }>) || []).map((p) => {
            const time = timesMap.get(p.timeId)
            return {
              timeId: p.timeId,
              nome: time?.nome || 'Time não encontrado',
              escudo: time?.escudo || null,
              sigla: time?.sigla || '???'
            }
          }),
          totalTimes: camp.participantes?.length || 0,
          criadoEm: camp.createdAt
        }
      })
    )

    return NextResponse.json({
      success: true,
      campeonatos: campeonatosFormatados
    })

  } catch (error) {
    console.error('Erro ao buscar campeonatos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo campeonato
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

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

    // Verificar se já existe campeonato com mesmo nome
    const campeonatoExistente = await db.collection('campeonatos').findOne({
      nome: { $regex: new RegExp(`^${nome}$`, 'i') }
    })

    if (campeonatoExistente) {
      return NextResponse.json(
        { error: 'Já existe um campeonato com este nome' },
        { status: 400 }
      )
    }

    const novoCampeonato = {
      nome: nome.trim(),
      ano: new Date().getFullYear(), // Ano atual por padrão
      divisao: null,
      pais: pais || 'Brasil',
      logo: logo || null,
      status: 'em_andamento', // Status padrão
      dataInicio: null,
      dataFim: null,
      participantes: participantes || [],
      criadoPor: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('campeonatos').insertOne(novoCampeonato)

    return NextResponse.json({
      success: true,
      campeonato: {
        id: result.insertedId.toString(),
        ...novoCampeonato
      }
    })

  } catch (error) {
    console.error('Erro ao criar campeonato:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
