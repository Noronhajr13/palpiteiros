import { NextRequest, NextResponse } from 'next/server'
import { importarJogosBrasileirao } from '@/lib/scrapers/brasileirao-crawler'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { bolaoId, rodadaInicio, rodadaFim, substituirExistentes } = await request.json()

    if (!bolaoId) {
      return NextResponse.json({ error: 'ID do bolão é obrigatório' }, { status: 400 })
    }

    console.log(`🚀 Iniciando importação do Brasileirão para bolão ${bolaoId}`)

    // Executar importação
    await importarJogosBrasileirao(bolaoId, {
      rodadaInicio: rodadaInicio || 1,
      rodadaFim: rodadaFim || 3,
      substituirExistentes: substituirExistentes || false
    })

    return NextResponse.json({
      success: true,
      message: 'Jogos do Brasileirão importados com sucesso!',
      opcoes: {
        bolaoId,
        rodadaInicio: rodadaInicio || 1,
        rodadaFim: rodadaFim || 3,
        substituirExistentes: substituirExistentes || false
      }
    })

  } catch (error) {
    console.error('Erro na importação via API:', error)
    
    return NextResponse.json({
      error: 'Erro ao importar jogos do Brasileirão',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}