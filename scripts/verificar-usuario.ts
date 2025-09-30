import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verificarUsuario() {
  try {
    console.log('🔍 Verificando usuários no banco...')
    
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })
    
    console.log(`📊 Total de usuários: ${usuarios.length}`)
    
    usuarios.forEach((usuario: any, index: number) => {
      console.log(`\n👤 Usuário ${index + 1}:`)
      console.log(`   ID: ${usuario.id}`)
      console.log(`   Email: ${usuario.email}`)
      console.log(`   Nome: ${usuario.name}`)
      console.log(`   Criado em: ${usuario.createdAt}`)
    })
    
    // Verificar especificamente o usuário de teste
    const usuarioTeste = await prisma.user.findUnique({
      where: { email: 'noronhajf22@gmail.com' }
    })
    
    if (usuarioTeste) {
      console.log('\n✅ Usuário de teste encontrado!')
      console.log(`   Nome: ${usuarioTeste.name}`)
      console.log(`   Email: ${usuarioTeste.email}`)
    } else {
      console.log('\n❌ Usuário de teste não encontrado!')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verificarUsuario()