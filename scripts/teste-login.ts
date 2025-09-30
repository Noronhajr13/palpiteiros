import { prisma } from '../lib/prisma'

// 🧪 TESTE COMPLETO DE LOGIN
// Simula exatamente o que a store faz

async function testeLogin() {
  try {
    console.log('🧪 Teste completo de login...\n')

    const EMAIL_TESTE = 'noronhajf22@gmail.com'
    const SENHA_TESTE = '1234'

    console.log(`📧 Testando com:`)
    console.log(`   Email: ${EMAIL_TESTE}`)
    console.log(`   Senha: ${SENHA_TESTE}\n`)

    // Simular exatamente o que a store faz
    console.log('🔍 Executando query do Prisma...')
    
    const user = await prisma.user.findFirst({
      where: {
        email: EMAIL_TESTE,
        password: SENHA_TESTE
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    })

    console.log('📋 Resultado da query:')
    console.log(user)

    if (user) {
      console.log('\n✅ LOGIN SUCESSO!')
      console.log('🎯 O problema NÃO está no banco ou na query')
      console.log('💡 Verifique:')
      console.log('   1. Se você está usando o email/senha corretos na interface')
      console.log('   2. Se há erros no console do navegador')
      console.log('   3. Se a página está carregando a store correta')
    } else {
      console.log('\n❌ LOGIN FALHOU!')
      console.log('🔍 Possíveis problemas:')
      console.log('   1. Email ou senha incorretos')
      console.log('   2. Usuário não existe no banco')
      console.log('   3. Problema na query do Prisma')
    }

    // Verificar se o banco existe e tem dados
    const totalUsers = await prisma.user.count()
    console.log(`\n📊 Total de usuários no banco: ${totalUsers}`)

    if (totalUsers === 0) {
      console.log('⚠️  BANCO VAZIO! Execute: npm run db:seed')
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error)
    console.log('\n🔍 Possíveis causas:')
    console.log('   1. Banco de dados não existe')
    console.log('   2. Schema do Prisma desatualizado')
    console.log('   3. Problema de conexão com SQLite')
    console.log('\n💡 Soluções:')
    console.log('   - npx prisma generate')
    console.log('   - npx prisma db push')
    console.log('   - npm run db:seed')
  } finally {
    await prisma.$disconnect()
  }
}

// Executar teste
testeLogin()
  .then(() => {
    console.log('\n✨ Teste concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error)
    process.exit(1)
  })