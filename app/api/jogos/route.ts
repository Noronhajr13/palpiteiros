import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

// GET - Listar jogos de um bolão
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const bolaoId = searchParams.get('bolaoId')

    if (!bolaoId) {
      return NextResponse.json(
        { error: 'ID do bolão é obrigatório' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    const jogos = await db.collection('jogos').find({ bolaoId })
      .sort({ rodada: 1, data: 1 })
      .toArray()

    return NextResponse.json({ 
      jogos: jogos.map(j => ({
        ...j,
        id: j._id.toString()
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}