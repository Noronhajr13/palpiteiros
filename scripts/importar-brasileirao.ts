#!/usr/bin/env tsx

/**
 * 🏆 SCRIPT DE IMPORTAÇÃO BRASILEIRÃO
 * 
 * Extrai dados dos jogos do Brasileirão diretamente do site da Globo Esporte
 * e salva no banco de dados SQLite.
 * 
 * USO:
 * npx tsx scripts/importar-brasileirao.ts --bolao-id=ID_DO_BOLAO [opções]
 * 
 * OPÇÕES:
 * --bolao-id=ID       ID do bolão no banco (obrigatório)
 * --rodada-inicio=N   Rodada inicial (padrão: 1)
 * --rodada-fim=N      Rodada final (padrão: 3)
 * --substituir        Substituir jogos existentes (padrão: false)
 * --help              Mostrar esta ajuda
 * 
 * EXEMPLOS:
 * npx tsx scripts/importar-brasileirao.ts --bolao-id=abc123
 * npx tsx scripts/importar-brasileirao.ts --bolao-id=abc123 --rodada-inicio=1 --rodada-fim=10
 * npx tsx scripts/importar-brasileirao.ts --bolao-id=abc123 --substituir
 */

import { BrasileiraoCrawler, importarJogosBrasileirao } from '../lib/scrapers/brasileirao-crawler'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ArgumentosCLI {
  bolaoId?: string
  rodadaInicio?: number
  rodadaFim?: number
  substituir?: boolean
  help?: boolean
}

function parseArgumentos(): ArgumentosCLI {
  const args = process.argv.slice(2)
  const argumentos: ArgumentosCLI = {}

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      argumentos.help = true
    } else if (arg.startsWith('--bolao-id=')) {
      argumentos.bolaoId = arg.split('=')[1]
    } else if (arg.startsWith('--rodada-inicio=')) {
      argumentos.rodadaInicio = parseInt(arg.split('=')[1])
    } else if (arg.startsWith('--rodada-fim=')) {
      argumentos.rodadaFim = parseInt(arg.split('=')[1])
    } else if (arg === '--substituir') {
      argumentos.substituir = true
    }
  }

  return argumentos
}

function mostrarAjuda() {
  console.log(`
🏆 IMPORTADOR DE JOGOS DO BRASILEIRÃO

Extrai jogos do site da Globo Esporte e salva no banco de dados.

USO:
  npx tsx scripts/importar-brasileirao.ts --bolao-id=ID_DO_BOLAO [opções]

OPÇÕES:
  --bolao-id=ID       ID do bolão no banco (obrigatório)
  --rodada-inicio=N   Rodada inicial (padrão: 1)
  --rodada-fim=N      Rodada final (padrão: 3)
  --substituir        Substituir jogos existentes
  --help, -h          Mostrar esta ajuda

EXEMPLOS:
  # Importar 3 primeiras rodadas
  npx tsx scripts/importar-brasileirao.ts --bolao-id=cmg6mfy7x0001lcfkp5ynupts

  # Importar rodadas 1 a 10
  npx tsx scripts/importar-brasileirao.ts --bolao-id=cmg6mfy7x0001lcfkp5ynupts --rodada-inicio=1 --rodada-fim=10

  # Substituir jogos existentes
  npx tsx scripts/importar-brasileirao.ts --bolao-id=cmg6mfy7x0001lcfkp5ynupts --substituir

  # Importar só a rodada 5
  npx tsx scripts/importar-brasileirao.ts --bolao-id=cmg6mfy7x0001lcfkp5ynupts --rodada-inicio=5 --rodada-fim=5
`)
}

async function listarBoloes() {
  console.log('\n📋 BOLÕES DISPONÍVEIS:')
  
  try {
    const boloes = await prisma.bolao.findMany({
      select: {
        id: true,
        nome: true,
        descricao: true,
        status: true,
        _count: {
          select: {
            jogos: true,
            participantes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (boloes.length === 0) {
      console.log('❌ Nenhum bolão encontrado. Crie um bolão primeiro.')
      return
    }

    boloes.forEach((bolao, index) => {
      console.log(`
${index + 1}. ${bolao.nome}
   ID: ${bolao.id}
   Descrição: ${bolao.descricao || 'Sem descrição'}
   Status: ${bolao.status}
   Jogos: ${bolao._count.jogos} | Participantes: ${bolao._count.participantes}`)
    })
    
    console.log('\nUse o ID do bolão com --bolao-id=ID')
    
  } catch (error) {
    console.error('❌ Erro ao listar bolões:', error)
  }
}

async function validarBolao(bolaoId: string): Promise<boolean> {
  try {
    const bolao = await prisma.bolao.findUnique({
      where: { id: bolaoId },
      select: {
        id: true,
        nome: true,
        status: true
      }
    })

    if (!bolao) {
      console.error(`❌ Bolão com ID '${bolaoId}' não encontrado.`)
      return false
    }

    console.log(`✅ Bolão encontrado: ${bolao.nome} (${bolao.status})`)
    return true
    
  } catch (error) {
    console.error('❌ Erro ao validar bolão:', error)
    return false
  }
}

async function main() {
  console.log('🏆 IMPORTADOR DE JOGOS DO BRASILEIRÃO\n')
  
  const args = parseArgumentos()

  if (args.help) {
    mostrarAjuda()
    return
  }

  if (!args.bolaoId) {
    console.error('❌ ID do bolão é obrigatório. Use --bolao-id=ID')
    console.log('\n💡 Para ver bolões disponíveis, execute sem parâmetros:')
    console.log('   npx tsx scripts/importar-brasileirao.ts\n')
    await listarBoloes()
    return
  }

  // Validar se o bolão existe
  const bolaoValido = await validarBolao(args.bolaoId)
  if (!bolaoValido) {
    await listarBoloes()
    return
  }

  // Configurar opções
  const opcoes = {
    rodadaInicio: args.rodadaInicio || 1,
    rodadaFim: args.rodadaFim || 3,
    substituir: args.substituir || false
  }

  console.log(`\n🚀 INICIANDO IMPORTAÇÃO:`)
  console.log(`   Bolão: ${args.bolaoId}`)
  console.log(`   Rodadas: ${opcoes.rodadaInicio} a ${opcoes.rodadaFim}`)
  console.log(`   Substituir existentes: ${opcoes.substituir ? 'SIM' : 'NÃO'}`)
  console.log(`   Fonte: https://ge.globo.com/futebol/brasileirao-serie-a/\n`)

  try {
    await importarJogosBrasileirao(args.bolaoId, opcoes)
    
    console.log('\n🎉 IMPORTAÇÃO CONCLUÍDA COM SUCESSO!')
    console.log('\n✅ Próximos passos:')
    console.log('   1. Acesse a página de jogos do bolão')
    console.log('   2. Verifique se os jogos foram importados corretamente')
    console.log('   3. Ajuste datas/horários se necessário')
    console.log('   4. Convide participantes para fazer palpites')
    
  } catch (error) {
    console.error('\n❌ ERRO NA IMPORTAÇÃO:', error)
    
    if (error instanceof Error) {
      console.error('Detalhes:', error.message)
    }
    
    console.log('\n💡 DICAS PARA SOLUCIONAR:')
    console.log('   - Verifique sua conexão com a internet')
    console.log('   - Tente novamente em alguns minutos')
    console.log('   - O site da Globo pode estar indisponível')
    console.log('   - Use jogos de exemplo se necessário')
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
}