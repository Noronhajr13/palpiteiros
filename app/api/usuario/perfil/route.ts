import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { headers } from 'next/headers'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    const db = await getDatabase()
    const usuario = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!usuario) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }
    return NextResponse.json({
      id: usuario._id.toString(),
      nome: usuario.name,
      email: usuario.email
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}