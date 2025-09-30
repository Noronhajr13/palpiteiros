import { prisma } from '../lib/prisma'

// 🏆 SCRIPT PARA FINALIZAR JOGOS E CALCULAR PONTOS
// Use para inserir placares e calcular pontuação dos palpites

async function finalizarJogos() {
  try {
    console.log('⚽ Iniciando finalização de jogos...')

    // ========================================
    // 📝 CONFIGURE OS RESULTADOS AQUI
    // ========================================
    
    const BOLAO_CODIGO = 'FAM2024'
    
    // Lista de jogos para finalizar com seus placares
    const resultados = [
      {
        timeA: 'Flamengo',
        timeB: 'Vasco',
        rodada: 1,
        placarA: 2,
        placarB: 1,
        status: 'finalizado'
      },
      {
        timeA: 'Palmeiras', 
        timeB: 'São Paulo',
        rodada: 1,
        placarA: 1,
        placarB: 1,
        status: 'finalizado'
      },
      {
        timeA: 'Santos',
        timeB: 'Corinthians', 
        rodada: 2,
        placarA: 0,
        placarB: 2,
        status: 'finalizado'
      }
    ]

    // ========================================
    // 🔍 BUSCAR BOLÃO
    // ========================================
    
    const bolao = await prisma.bolao.findUnique({
      where: { codigo: BOLAO_CODIGO },
      include: {
        jogos: true
      }
    })

    if (!bolao) {
      console.error(`❌ Bolão "${BOLAO_CODIGO}" não encontrado!`)
      return
    }

    console.log(`✅ Bolão: ${bolao.nome}`)

    // ========================================
    // 🎯 FINALIZAR JOGOS E CALCULAR PONTOS
    // ========================================
    
    let jogosFinalizados = 0
    let pontosCalculados = 0

    for (const resultado of resultados) {
      // Encontrar o jogo
      const jogo = await prisma.jogo.findFirst({
        where: {
          bolaoId: bolao.id,
          rodada: resultado.rodada,
          timeA: resultado.timeA,
          timeB: resultado.timeB
        },
        include: {
          palpites: {
            include: {
              user: true
            }
          }
        }
      })

      if (!jogo) {
        console.log(`⚠️  Jogo não encontrado: ${resultado.timeA} x ${resultado.timeB} (R${resultado.rodada})`)
        continue
      }

      if (jogo.status === 'finalizado') {
        console.log(`⚠️  Jogo já finalizado: ${resultado.timeA} x ${resultado.timeB}`)
        continue
      }

      // Atualizar jogo com placar
      await prisma.jogo.update({
        where: { id: jogo.id },
        data: {
          placarA: resultado.placarA,
          placarB: resultado.placarB,
          status: resultado.status as 'agendado' | 'em_andamento' | 'finalizado'
        }
      })

      console.log(`⚽ Finalizado: ${resultado.timeA} ${resultado.placarA} x ${resultado.placarB} ${resultado.timeB}`)
      jogosFinalizados++

      // ========================================
      // 🧮 CALCULAR PONTOS DOS PALPITES
      // ========================================
      
      for (const palpite of jogo.palpites) {
        let pontos = 0

        // Placar exato = pontuação máxima
        if (palpite.placarA === resultado.placarA && palpite.placarB === resultado.placarB) {
          pontos = bolao.placarExato
          console.log(`🎯 ${palpite.user.name}: PLACAR EXATO! (+${pontos} pts)`)
        }
        // Resultado certo (vencedor) = pontuação parcial
        else {
          const resultadoReal = resultado.placarA > resultado.placarB ? 'A' : 
                               resultado.placarA < resultado.placarB ? 'B' : 'E'
          const resultadoPalpite = palpite.placarA > palpite.placarB ? 'A' :
                                  palpite.placarA < palpite.placarB ? 'B' : 'E'

          if (resultadoReal === resultadoPalpite) {
            pontos = bolao.resultadoCerto
            console.log(`✅ ${palpite.user.name}: Resultado certo (+${pontos} pts)`)
          } else {
            console.log(`❌ ${palpite.user.name}: Errou (0 pts)`)
          }
        }

        // Atualizar pontos do palpite
        await prisma.palpite.update({
          where: { id: palpite.id },
          data: { pontos }
        })

        pontosCalculados++
      }
    }

    // ========================================
    // 🏆 ATUALIZAR RANKING DOS PARTICIPANTES
    // ========================================
    
    console.log('\n🏆 Atualizando ranking...')

    const participantes = await prisma.participante.findMany({
      where: { bolaoId: bolao.id },
      include: {
        user: true,
        bolao: {
          include: {
            palpites: {
              where: { userId: { in: [] } } // Será preenchido no loop
            }
          }
        }
      }
    })

    for (const participante of participantes) {
      // Calcular estatísticas do participante
      const palpitesDoUser = await prisma.palpite.findMany({
        where: {
          userId: participante.userId,
          bolaoId: bolao.id,
          pontos: { not: null }
        }
      })

      const totalPontos = palpitesDoUser.reduce((acc, p) => acc + (p.pontos || 0), 0)
      const totalPalpites = palpitesDoUser.length
      const palpitesCorretos = palpitesDoUser.filter(p => (p.pontos || 0) > 0).length

      // Atualizar participante
      await prisma.participante.update({
        where: { id: participante.id },
        data: {
          pontos: totalPontos,
          totalPalpites,
          palpitesCorretos
        }
      })

      console.log(`📊 ${participante.user.name}: ${totalPontos} pts (${palpitesCorretos}/${totalPalpites})`)
    }

    // Calcular posições
    const participantesOrdenados = await prisma.participante.findMany({
      where: { bolaoId: bolao.id },
      orderBy: [
        { pontos: 'desc' },
        { palpitesCorretos: 'desc' }
      ],
      include: { user: true }
    })

    for (let i = 0; i < participantesOrdenados.length; i++) {
      await prisma.participante.update({
        where: { id: participantesOrdenados[i].id },
        data: { posicao: i + 1 }
      })
    }

    // ========================================
    // 📊 RELATÓRIO FINAL
    // ========================================
    
    console.log('\n🎉 Finalização concluída!')
    console.log(`📊 Relatório:`)
    console.log(`   ⚽ Jogos finalizados: ${jogosFinalizados}`)
    console.log(`   🎯 Pontos calculados: ${pontosCalculados}`)
    
    console.log('\n🏆 Ranking atualizado:')
    participantesOrdenados.forEach((p, i) => {
      console.log(`   ${i + 1}º ${p.user.name}: ${p.pontos} pts`)
    })

  } catch (error) {
    console.error('❌ Erro ao finalizar jogos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar script
finalizarJogos()
  .then(() => {
    console.log('\n✨ Script finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })