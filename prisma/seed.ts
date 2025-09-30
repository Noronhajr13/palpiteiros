import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.palpite.deleteMany()
  await prisma.jogo.deleteMany()
  await prisma.participante.deleteMany()
  await prisma.bolao.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuários iniciais
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@palpiteiros.com',
        password: '123456',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@palpiteiros.com',
        password: '123456',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Costa',
        email: 'pedro@palpiteiros.com',
        password: '123456',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    })
  ])

  console.log(`✅ Criados ${users.length} usuários`)

  // Criar bolões
  const bolao1 = await prisma.bolao.create({
    data: {
      nome: 'Brasileirão 2024 - Família',
      descricao: 'Bolão da família para o Campeonato Brasileiro',
      codigo: 'FAM2024',
      adminId: users[0].id,
      maxParticipantes: 10,
      status: 'ativo',
      premios: {
        geral: {
          primeiro: 'R$ 500',
          segundo: 'R$ 200',
          terceiro: 'R$ 100'
        },
        fases: {
          primeiroTurno: 'R$ 50',
          segundoTurno: 'R$ 50',
          faseGrupos: 'Medalha',
          mataMata: 'Troféu'
        }
      },
      placarExato: 10,
      resultadoCerto: 5,
      golsExatos: 2,
      multiplicadorFinal: 1.5,
      bonusSequencia: 3,
      permitePalpiteTardio: false
    }
  })

  const bolao2 = await prisma.bolao.create({
    data: {
      nome: 'Copa América 2024',
      descricao: 'Apostas na Copa América',
      codigo: 'COPA24',
      adminId: users[1].id,
      maxParticipantes: 20,
      status: 'ativo',
      placarExato: 15,
      resultadoCerto: 8,
      golsExatos: 3,
      multiplicadorFinal: 2.0,
      bonusSequencia: 5,
      permitePalpiteTardio: false
    }
  })

  console.log(`✅ Criados 2 bolões`)

  // Criar participantes
  await Promise.all([
    // Participantes do Brasileirão
    prisma.participante.create({
      data: {
        userId: users[0].id,
        bolaoId: bolao1.id,
        pontos: 15,
        posicao: 1,
        palpitesCorretos: 3,
        totalPalpites: 5
      }
    }),
    prisma.participante.create({
      data: {
        userId: users[1].id,
        bolaoId: bolao1.id,
        pontos: 12,
        posicao: 2,
        palpitesCorretos: 2,
        totalPalpites: 4
      }
    }),
    prisma.participante.create({
      data: {
        userId: users[2].id,
        bolaoId: bolao1.id,
        pontos: 8,
        posicao: 3,
        palpitesCorretos: 1,
        totalPalpites: 3
      }
    }),
    // Participantes da Copa América
    prisma.participante.create({
      data: {
        userId: users[0].id,
        bolaoId: bolao2.id,
        pontos: 25,
        posicao: 2,
        palpitesCorretos: 5,
        totalPalpites: 8
      }
    }),
    prisma.participante.create({
      data: {
        userId: users[1].id,
        bolaoId: bolao2.id,
        pontos: 30,
        posicao: 1,
        palpitesCorretos: 6,
        totalPalpites: 8
      }
    })
  ])

  console.log(`✅ Criados participantes`)

  // Criar jogos do Brasileirão
  const jogos = await Promise.all([
    prisma.jogo.create({
      data: {
        bolaoId: bolao1.id,
        rodada: 1,
        data: new Date('2024-04-13T16:00:00'),
        timeA: 'Flamengo',
        timeB: 'Vasco',
        status: 'finalizado',
        placarA: 2,
        placarB: 1
      }
    }),
    prisma.jogo.create({
      data: {
        bolaoId: bolao1.id,
        rodada: 1,
        data: new Date('2024-04-13T18:30:00'),
        timeA: 'Palmeiras',
        timeB: 'São Paulo',
        status: 'finalizado',
        placarA: 1,
        placarB: 1
      }
    }),
    prisma.jogo.create({
      data: {
        bolaoId: bolao1.id,
        rodada: 2,
        data: new Date('2024-04-20T16:00:00'),
        timeA: 'Santos',
        timeB: 'Corinthians',
        status: 'agendado'
      }
    }),
    prisma.jogo.create({
      data: {
        bolaoId: bolao1.id,
        rodada: 2,
        data: new Date('2024-04-20T18:30:00'),
        timeA: 'Botafogo',
        timeB: 'Fluminense',
        status: 'agendado'
      }
    }),
    prisma.jogo.create({
      data: {
        bolaoId: bolao1.id,
        rodada: 2,
        data: new Date('2024-04-21T16:00:00'),
        timeA: 'Cruzeiro',
        timeB: 'Atlético-MG',
        status: 'agendado'
      }
    })
  ])

  console.log(`✅ Criados ${jogos.length} jogos`)

  // Criar alguns palpites
  await Promise.all([
    prisma.palpite.create({
      data: {
        jogoId: jogos[0].id,
        userId: users[0].id,
        bolaoId: bolao1.id,
        placarA: 2,
        placarB: 1,
        pontos: 10
      }
    }),
    prisma.palpite.create({
      data: {
        jogoId: jogos[1].id,
        userId: users[0].id,
        bolaoId: bolao1.id,
        placarA: 1,
        placarB: 0,
        pontos: 5
      }
    }),
    prisma.palpite.create({
      data: {
        jogoId: jogos[0].id,
        userId: users[1].id,
        bolaoId: bolao1.id,
        placarA: 1,
        placarB: 1,
        pontos: 3
      }
    })
  ])

  console.log(`✅ Criados palpites`)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })