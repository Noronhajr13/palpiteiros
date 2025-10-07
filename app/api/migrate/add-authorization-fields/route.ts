import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

/**
 * API de Migração - Adiciona campos do sistema de autorização
 * 
 * ATENÇÃO: Executar apenas UMA VEZ!
 * Depois de executar, deletar este arquivo por segurança.
 * 
 * Uso:
 * curl -X POST http://localhost:3000/api/migrate/add-authorization-fields
 */
export async function POST() {
  try {
    const db = await getDatabase()

    // 1. Migrar collection 'boloes'
    const resultBoloes = await db.collection('boloes').updateMany(
      { tipoAcesso: { $exists: false } },
      {
        $set: {
          tipoAcesso: 'privado',        // Bolões antigos eram privados por padrão
          entradaAutomatica: true       // Antes não tinha aprovação
        }
      }
    )

    // 2. Migrar collection 'participantes'
    const resultParticipantes = await db.collection('participantes').updateMany(
      { status: { $exists: false } },
      {
        $set: {
          status: 'aprovado',           // Participantes antigos já estavam aprovados
          solicitadoEm: new Date(),     // Usar data atual como referência
          aprovadoEm: new Date()        // Aprovar imediatamente (retroativo)
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Migração concluída com sucesso!',
      details: {
        boloesAtualizados: resultBoloes.modifiedCount,
        participantesAtualizados: resultParticipantes.modifiedCount
      }
    })

  } catch (error) {
    console.error('Erro na migração:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao executar migração',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
