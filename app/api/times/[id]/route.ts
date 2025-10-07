import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import { ObjectId } from 'mongodb'

// GET - Buscar time específico
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
    
    const time = await db.collection('times').findOne({ _id: new ObjectId(id) })

    if (!time) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      time: {
        id: time._id.toString(),
        nome: time.nome,
        escudo: time.escudo,
        sigla: time.sigla,
        fundacao: time.fundacao,
        estadio: time.estadio,
        cidade: time.cidade,
        estado: time.estado,
        ativo: time.ativo
      }
    })

  } catch (error) {
    console.error('Erro ao buscar time:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar time
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
    const { nome, escudo, sigla, fundacao, estadio, cidade, estado, ativo } = await request.json()

    if (!nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Gerar sigla automaticamente se não fornecida (primeiras 3 letras)
    const siglaGerada = sigla || nome.substring(0, 3).toUpperCase()

    const result = await db.collection('times').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          nome: nome.trim(),
          escudo: escudo || null,
          sigla: siglaGerada,
          fundacao: fundacao || null,
          estadio: estadio || null,
          cidade: cidade || null,
          estado: estado || null,
          ativo: ativo ?? true,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Time não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Time atualizado com sucesso'
    })

  } catch (error) {
    console.error('Erro ao atualizar time:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar time
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

    // Verificar se o time é usado em algum campeonato
    const campeonatosComTime = await db.collection('campeonatos').countDocuments({
      'participantes.timeId': id
    })

    if (campeonatosComTime > 0) {
      return NextResponse.json(
        { 
          error: 'Time não pode ser excluído pois está sendo usado em campeonatos',
          campeonatos: campeonatosComTime
        },
        { status: 400 }
      )
    }

    // Verificar se o time é usado em jogos
    const jogosComTime = await db.collection('jogos').countDocuments({
      $or: [
        { timeCasaId: id },
        { timeForaId: id }
      ]
    })

    if (jogosComTime > 0) {
      return NextResponse.json(
        { 
          error: 'Time não pode ser excluído pois está sendo usado em jogos',
          jogos: jogosComTime
        },
        { status: 400 }
      )
    }

    await db.collection('times').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: 'Time excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao deletar time:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
