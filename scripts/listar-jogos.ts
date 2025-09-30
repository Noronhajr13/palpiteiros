import { prisma } from '../lib/prisma'

// 📋 SCRIPT PARA LISTAR JOGOS DE UM BOLÃO
// Use para visualizar todos os jogos cadastrados

async function listarJogos() {
  try {
    console.log('📋 Listando jogos do bolão...\n')

    // ========================================
    // 📝 CONFIGURE O BOLÃO AQUI
    // ========================================
    
    const BOLAO_CODIGO = 'BRAS25' // Mude para o bolão desejado
    
    // Buscar bolão
    const bolao = await prisma.bolao.findUnique({
      where: { codigo: BOLAO_CODIGO },
      include: {
        jogos: {
          orderBy: [
            { rodada: 'asc' },
            { data: 'asc' }
          ],
          include: {
            palpites: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!bolao) {
      console.error(`❌ Bolão "${BOLAO_CODIGO}" não encontrado!`)
      
      const boloes = await prisma.bolao.findMany({
        select: { codigo: true, nome: true }
      })
      
      console.log('💡 Bolões disponíveis:')
      boloes.forEach(b => {
        console.log(`   - ${b.codigo}: ${b.nome}`)
      })
      
      return
    }

    console.log(`🏆 Bolão: ${bolao.nome}`)
    console.log(`📊 Total de jogos: ${bolao.jogos.length}\n`)

    if (bolao.jogos.length === 0) {
      console.log('📝 Nenhum jogo cadastrado ainda.')
      console.log('💡 Use "npm run jogos:inserir" ou "npm run jogos:templates" para adicionar jogos.\n')
      return
    }

    // Agrupar por rodada
    const jogosPorRodada = bolao.jogos.reduce((acc, jogo) => {
      if (!acc[jogo.rodada]) {
        acc[jogo.rodada] = []
      }
      acc[jogo.rodada].push(jogo)
      return acc
    }, {} as Record<number, typeof bolao.jogos>)

    // Listar jogos por rodada
    for (const [rodada, jogos] of Object.entries(jogosPorRodada)) {
      console.log(`🏁 RODADA ${rodada}`)
      console.log('='+'='.repeat(50))
      
      for (const jogo of jogos) {
        const data = new Date(jogo.data).toLocaleString('pt-BR')
        const status = jogo.status === 'finalizado' ? '✅' : 
                      jogo.status === 'em_andamento' ? '⏳' : '📅'
        
        let placarInfo = ''
        if (jogo.status === 'finalizado' && jogo.placarA !== null && jogo.placarB !== null) {
          placarInfo = ` ${jogo.placarA} x ${jogo.placarB}`
        }

        console.log(`${status} ${jogo.timeA} x ${jogo.timeB}${placarInfo}`)
        console.log(`   📅 ${data}`)
        
        if (jogo.palpites.length > 0) {
          console.log(`   🎯 Palpites: ${jogo.palpites.length}`)
          jogo.palpites.forEach(palpite => {
            const pontos = palpite.pontos !== null ? ` (${palpite.pontos} pts)` : ''
            console.log(`      ${palpite.user.name}: ${palpite.placarA} x ${palpite.placarB}${pontos}`)
          })
        } else {
          console.log(`   📝 Sem palpites ainda`)
        }
        
        console.log('')
      }
    }

    // Estatísticas gerais
    const jogosFinalizados = bolao.jogos.filter(j => j.status === 'finalizado').length
    const jogosAgendados = bolao.jogos.filter(j => j.status === 'agendado').length
    const jogosEmAndamento = bolao.jogos.filter(j => j.status === 'em_andamento').length
    const totalPalpites = bolao.jogos.reduce((acc, j) => acc + j.palpites.length, 0)

    console.log('📊 ESTATÍSTICAS GERAIS')
    console.log('='+'='.repeat(30))
    console.log(`✅ Finalizados: ${jogosFinalizados}`)
    console.log(`⏳ Em andamento: ${jogosEmAndamento}`)
    console.log(`📅 Agendados: ${jogosAgendados}`)
    console.log(`🎯 Total de palpites: ${totalPalpites}`)

  } catch (error) {
    console.error('❌ Erro ao listar jogos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar
listarJogos()
  .then(() => {
    console.log('\n✨ Listagem concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })