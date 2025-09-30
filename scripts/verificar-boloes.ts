import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verificarBoloes() {
  try {
    console.log('🎯 Verificando bolões no banco...')
    
    const boloes = await prisma.bolao.findMany({
      include: {
        admin: {
          select: { name: true, email: true }
        },
        participantes: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        jogos: true
      }
    })
    
    console.log(`📊 Total de bolões: ${boloes.length}`)
    
    boloes.forEach((bolao: any, index: number) => {
      console.log(`\n🎯 Bolão ${index + 1}:`)
      console.log(`   ID: ${bolao.id}`)
      console.log(`   Nome: ${bolao.name}`)
      console.log(`   Código: ${bolao.code}`)
      console.log(`   Admin: ${bolao.admin.name} (${bolao.admin.email})`)
      console.log(`   Participantes: ${bolao.participantes.length}`)
      console.log(`   Jogos: ${bolao.jogos.length}`)
      console.log(`   Status: ${bolao.status}`)
      console.log(`   Criado em: ${bolao.createdAt}`)
      
      if (bolao.participantes.length > 0) {
        console.log(`   👥 Lista de participantes:`)
        bolao.participantes.forEach((participante: any, pIndex: number) => {
          console.log(`      ${pIndex + 1}. ${participante.user.name} (${participante.user.email})`)
        })
      }
    })
    
  } catch (error) {
    console.error('❌ Erro ao verificar bolões:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarBoloes()