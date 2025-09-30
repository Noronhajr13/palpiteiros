import { prisma } from '../lib/prisma'

// 🏆 TEMPLATES DE CAMPEONATOS PRONTOS
// Escolha um template ou crie o seu próprio

const TEMPLATES = {
  // Template para Brasileirão
  BRASILEIRAO_2024: {
    nome: 'Brasileirão 2024 - Rodadas 3-6',
    bolao: 'FAM2024',
    jogos: [
      // Rodada 3
      { rodada: 3, data: '2024-04-27T16:00', timeA: 'Flamengo', timeB: 'Atlético-MG' },
      { rodada: 3, data: '2024-04-27T18:30', timeA: 'Palmeiras', timeB: 'Corinthians' },
      { rodada: 3, data: '2024-04-28T16:00', timeA: 'São Paulo', timeB: 'Santos' },
      { rodada: 3, data: '2024-04-28T18:30', timeA: 'Botafogo', timeB: 'Vasco' },
      { rodada: 3, data: '2024-04-28T20:00', timeA: 'Grêmio', timeB: 'Internacional' },
      
      // Rodada 4
      { rodada: 4, data: '2024-05-04T16:00', timeA: 'Cruzeiro', timeB: 'Flamengo' },
      { rodada: 4, data: '2024-05-04T18:30', timeA: 'Atlético-MG', timeB: 'Palmeiras' },
      { rodada: 4, data: '2024-05-05T16:00', timeA: 'Corinthians', timeB: 'Botafogo' },
      { rodada: 4, data: '2024-05-05T18:30', timeA: 'Santos', timeB: 'Grêmio' },
      { rodada: 4, data: '2024-05-05T20:00', timeA: 'Vasco', timeB: 'São Paulo' },
    ]
  },

  // Template para Copa do Mundo (exemplo)
  COPA_MUNDO: {
    nome: 'Copa do Mundo - Fase de Grupos',
    bolao: 'COPA24',
    jogos: [
      // Grupo A
      { rodada: 1, data: '2024-06-14T16:00', timeA: 'Brasil', timeB: 'Sérvia' },
      { rodada: 1, data: '2024-06-14T19:00', timeA: 'Argentina', timeB: 'México' },
      { rodada: 2, data: '2024-06-19T16:00', timeA: 'Brasil', timeB: 'México' },
      { rodada: 2, data: '2024-06-19T19:00', timeA: 'Argentina', timeB: 'Sérvia' },
      { rodada: 3, data: '2024-06-24T16:00', timeA: 'Brasil', timeB: 'Argentina' },
      { rodada: 3, data: '2024-06-24T16:00', timeA: 'México', timeB: 'Sérvia' },
    ]
  },

  // Template para Champions League
  CHAMPIONS: {
    nome: 'Champions League - Oitavas',
    bolao: 'CHAMP24',
    jogos: [
      // Oitavas - Ida
      { rodada: 1, data: '2024-02-13T17:00', timeA: 'PSG', timeB: 'Real Madrid' },
      { rodada: 1, data: '2024-02-14T17:00', timeA: 'Porto', timeB: 'Arsenal' },
      { rodada: 1, data: '2024-02-20T17:00', timeA: 'Napoli', timeB: 'Barcelona' },
      { rodada: 1, data: '2024-02-21T17:00', timeA: 'Copenhagen', timeB: 'Man City' },
      
      // Oitavas - Volta
      { rodada: 2, data: '2024-03-05T17:00', timeA: 'Real Madrid', timeB: 'PSG' },
      { rodada: 2, data: '2024-03-06T17:00', timeA: 'Arsenal', timeB: 'Porto' },
      { rodada: 2, data: '2024-03-12T17:00', timeA: 'Barcelona', timeB: 'Napoli' },
      { rodada: 2, data: '2024-03-13T17:00', timeA: 'Man City', timeB: 'Copenhagen' },
    ]
  }
}

// ========================================
// 🚀 FUNÇÃO PRINCIPAL
// ========================================

async function inserirJogosTemplate() {
  try {
    console.log('🏆 Script de Inserção de Jogos - Templates')
    console.log('=========================================\n')

    // ========================================
    // 📝 ESCOLHA O TEMPLATE AQUI
    // ========================================
    
    const TEMPLATE_ESCOLHIDO = 'BRASILEIRAO_2024' // Mude aqui!
    
    const template = TEMPLATES[TEMPLATE_ESCOLHIDO as keyof typeof TEMPLATES]
    
    if (!template) {
      console.error(`❌ Template "${TEMPLATE_ESCOLHIDO}" não encontrado!`)
      console.log('💡 Templates disponíveis:')
      Object.keys(TEMPLATES).forEach(key => {
        console.log(`   - ${key}`)
      })
      return
    }

    console.log(`📋 Template selecionado: ${template.nome}`)
    console.log(`🎯 Bolão destino: ${template.bolao}\n`)

    // Buscar bolão
    const bolao = await prisma.bolao.findUnique({
      where: { codigo: template.bolao }
    })

    if (!bolao) {
      console.error(`❌ Bolão "${template.bolao}" não encontrado!`)
      
      const boloes = await prisma.bolao.findMany({
        select: { codigo: true, nome: true }
      })
      
      console.log('💡 Bolões disponíveis:')
      boloes.forEach(b => {
        console.log(`   - ${b.codigo}: ${b.nome}`)
      })
      
      return
    }

    // Inserir jogos
    let inseridos = 0
    let ignorados = 0

    for (const jogo of template.jogos) {
      const existente = await prisma.jogo.findFirst({
        where: {
          bolaoId: bolao.id,
          rodada: jogo.rodada,
          timeA: jogo.timeA,
          timeB: jogo.timeB
        }
      })

      if (existente) {
        console.log(`⚠️  ${jogo.timeA} x ${jogo.timeB} (R${jogo.rodada}) - já existe`)
        ignorados++
        continue
      }

      await prisma.jogo.create({
        data: {
          bolaoId: bolao.id,
          rodada: jogo.rodada,
          data: new Date(jogo.data),
          timeA: jogo.timeA,
          timeB: jogo.timeB,
          status: 'agendado'
        }
      })

      console.log(`✅ ${jogo.timeA} x ${jogo.timeB} (R${jogo.rodada}) - inserido`)
      inseridos++
    }

    // Relatório
    console.log('\n🎉 Inserção concluída!')
    console.log(`📊 Relatório:`)
    console.log(`   ✅ Inseridos: ${inseridos}`)
    console.log(`   ⚠️  Ignorados: ${ignorados}`)
    console.log(`   📝 Total: ${template.jogos.length}`)

    const totalJogos = await prisma.jogo.count({
      where: { bolaoId: bolao.id }
    })
    
    console.log(`\n🏆 Total de jogos no bolão: ${totalJogos}`)

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar
inserirJogosTemplate()