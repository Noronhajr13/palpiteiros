import { prisma } from '../lib/prisma'

// 🏆 SCRIPT PARA INSERIR JOGOS EM UM BOLÃO
// Use este script para adicionar jogos de qualquer campeonato

async function inserirJogos() {
  try {
    console.log('🏆 Iniciando inserção de jogos...')

    // ========================================
    // 📝 CONFIGURE AQUI OS DADOS DOS JOGOS
    // ========================================
    
    const BOLAO_CODIGO = 'BRAS25' // Código do bolão onde inserir os jogos
    
    // Lista de jogos para inserir
    const jogosParaInserir = [
      // RODADA 3 - BRASILEIRÃO 2024
      {
        rodada: 3,
        data: '2024-04-27T16:00:00',
        timeA: 'Flamengo',
        timeB: 'Atlético-MG',
        status: 'agendado'
      },
      {
        rodada: 3,
        data: '2024-04-27T18:30:00',
        timeA: 'Palmeiras',
        timeB: 'Corinthians',
        status: 'agendado'
      },
      {
        rodada: 3,
        data: '2024-04-28T16:00:00',
        timeA: 'São Paulo',
        timeB: 'Santos',
        status: 'agendado'
      },
      {
        rodada: 3,
        data: '2024-04-28T18:30:00',
        timeA: 'Botafogo',
        timeB: 'Vasco',
        status: 'agendado'
      },
      {
        rodada: 3,
        data: '2024-04-28T20:00:00',
        timeA: 'Grêmio',
        timeB: 'Internacional',
        status: 'agendado'
      },
      
      // RODADA 4 - BRASILEIRÃO 2024
      {
        rodada: 4,
        data: '2024-05-04T16:00:00',
        timeA: 'Cruzeiro',
        timeB: 'Flamengo',
        status: 'agendado'
      },
      {
        rodada: 4,
        data: '2024-05-04T18:30:00',
        timeA: 'Atlético-MG',
        timeB: 'Palmeiras',
        status: 'agendado'
      },
      {
        rodada: 4,
        data: '2024-05-05T16:00:00',
        timeA: 'Corinthians',
        timeB: 'Botafogo',
        status: 'agendado'
      },
      {
        rodada: 4,
        data: '2024-05-05T18:30:00',
        timeA: 'Santos',
        timeB: 'Grêmio',
        status: 'agendado'
      },
      {
        rodada: 4,
        data: '2024-05-05T20:00:00',
        timeA: 'Vasco',
        timeB: 'São Paulo',
        status: 'agendado'
      }
    ]

    // ========================================
    // 🔍 BUSCAR BOLÃO PELO CÓDIGO
    // ========================================
    
    const bolao = await prisma.bolao.findUnique({
      where: { codigo: BOLAO_CODIGO }
    })

    if (!bolao) {
      console.error(`❌ Bolão com código "${BOLAO_CODIGO}" não encontrado!`)
      console.log('💡 Bolões disponíveis:')
      
      const boloes = await prisma.bolao.findMany({
        select: { codigo: true, nome: true }
      })
      
      boloes.forEach(b => {
        console.log(`   - ${b.codigo}: ${b.nome}`)
      })
      
      return
    }

    console.log(`✅ Bolão encontrado: ${bolao.nome}`)

    // ========================================
    // 📥 INSERIR JOGOS NO BANCO
    // ========================================
    
    let jogosInseridos = 0
    let jogosIgnorados = 0

    for (const jogo of jogosParaInserir) {
      // Verificar se jogo já existe (mesmo bolão, mesma rodada, mesmos times)
      const jogoExistente = await prisma.jogo.findFirst({
        where: {
          bolaoId: bolao.id,
          rodada: jogo.rodada,
          timeA: jogo.timeA,
          timeB: jogo.timeB
        }
      })

      if (jogoExistente) {
        console.log(`⚠️  Jogo já existe: ${jogo.timeA} x ${jogo.timeB} (Rodada ${jogo.rodada})`)
        jogosIgnorados++
        continue
      }

      // Inserir novo jogo
      await prisma.jogo.create({
        data: {
          bolaoId: bolao.id,
          rodada: jogo.rodada,
          data: new Date(jogo.data),
          timeA: jogo.timeA,
          timeB: jogo.timeB,
          status: jogo.status as 'agendado' | 'em_andamento' | 'finalizado'
        }
      })

      console.log(`✅ Inserido: ${jogo.timeA} x ${jogo.timeB} (Rodada ${jogo.rodada})`)
      jogosInseridos++
    }

    // ========================================
    // 📊 RELATÓRIO FINAL
    // ========================================
    
    console.log('\n🎉 Inserção concluída!')
    console.log(`📊 Relatório:`)
    console.log(`   ✅ Jogos inseridos: ${jogosInseridos}`)
    console.log(`   ⚠️  Jogos ignorados (já existiam): ${jogosIgnorados}`)
    console.log(`   📝 Total processados: ${jogosParaInserir.length}`)

    // Mostrar total de jogos no bolão agora
    const totalJogos = await prisma.jogo.count({
      where: { bolaoId: bolao.id }
    })
    
    console.log(`\n🏆 Total de jogos no bolão "${bolao.nome}": ${totalJogos}`)

  } catch (error) {
    console.error('❌ Erro ao inserir jogos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// ========================================
// 🚀 EXECUTAR SCRIPT
// ========================================

inserirJogos()
  .then(() => {
    console.log('\n✨ Script finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })