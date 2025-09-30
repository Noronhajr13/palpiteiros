import { prisma } from '../lib/prisma'

// 🔍 SCRIPT PARA VERIFICAR USUÁRIOS NO BANCO
// Use para debug de problemas de login

async function verificarUsuarios() {
  try {
    console.log('🔍 Verificando usuários no banco...\n')

    // Listar todos os usuários
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // Apenas para debug
        avatar: true,
        createdAt: true
      }
    })

    if (usuarios.length === 0) {
      console.log('❌ Nenhum usuário encontrado no banco!')
      console.log('💡 Execute "npm run db:seed" para criar usuários de teste\n')
      return
    }

    console.log(`📊 Total de usuários: ${usuarios.length}\n`)

    usuarios.forEach((user, index) => {
      console.log(`👤 USUÁRIO ${index + 1}:`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Nome: ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Senha: ${user.password}`)
      console.log(`   Avatar: ${user.avatar || 'Não definido'}`)
      console.log(`   Criado em: ${user.createdAt.toLocaleString('pt-BR')}`)
      console.log('')
    })

    // Teste de login para cada usuário
    console.log('🧪 TESTE DE LOGIN:')
    console.log('='+'='.repeat(30))
    
    for (const user of usuarios) {
      console.log(`\n🔑 Testando login para: ${user.email}`)
      
      // Simular o que a store faz
      const userFound = await prisma.user.findFirst({
        where: {
          email: user.email,
          password: user.password
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      })

      if (userFound) {
        console.log(`   ✅ Login funcionaria para ${user.email}`)
      } else {
        console.log(`   ❌ Login falharia para ${user.email}`)
      }
    }

    console.log('\n📋 DADOS PARA TESTE:')
    console.log('='+'='.repeat(30))
    usuarios.forEach(user => {
      console.log(`Email: ${user.email} | Senha: ${user.password}`)
    })

  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar
verificarUsuarios()
  .then(() => {
    console.log('\n✨ Verificação concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })