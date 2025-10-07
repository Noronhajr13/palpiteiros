import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'

// GET - Listar todos os times
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const db = await getDatabase()
    const times = await db.collection('times')
      .find({})
      .sort({ nome: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      times: times.map(t => ({
        id: t._id.toString(),
        nome: t.nome,
        escudo: t.escudo,
        sigla: t.sigla,
        fundacao: t.fundacao,
        estadio: t.estadio,
        cidade: t.cidade,
        estado: t.estado,
        ativo: t.ativo ?? true,
        criadoEm: t.createdAt
      }))
    })

  } catch (error) {
    console.error('Erro ao buscar times:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo time
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { nome, escudo, sigla, fundacao, estadio, cidade, estado } = await request.json()

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Verificar se já existe time com mesmo nome
    const timeExistente = await db.collection('times').findOne({ 
      nome: { $regex: new RegExp(`^${nome}$`, 'i') }
    })

    if (timeExistente) {
      return NextResponse.json(
        { error: 'Já existe um time com este nome' },
        { status: 400 }
      )
    }

    // Gerar sigla automaticamente se não fornecida (primeiras 3 letras)
    const siglaGerada = sigla || nome.substring(0, 3).toUpperCase()

    const novoTime = {
      nome: nome.trim(),
      escudo: escudo || null,
      sigla: siglaGerada,
      fundacao: fundacao || null,
      estadio: estadio || null,
      cidade: cidade || null,
      estado: estado || null,
      ativo: true,
      criadoPor: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('times').insertOne(novoTime)

    return NextResponse.json({
      success: true,
      time: {
        id: result.insertedId.toString(),
        ...novoTime
      }
    })

  } catch (error) {
    console.error('Erro ao criar time:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
