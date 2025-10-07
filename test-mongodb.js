#!/usr/bin/env node

/**
 * Script para testar conexão com MongoDB
 * Uso: node test-mongodb.js
 */

const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI não encontrado no .env.local');
    process.exit(1);
  }
  
  console.log('🔍 Testando conexão com MongoDB...\n');
  console.log('📍 URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  
  const client = new MongoClient(uri);
  
  try {
    console.log('⏳ Conectando...');
    await client.connect();
    
    console.log('✅ Conexão estabelecida com sucesso!\n');
    
    // Testar acesso ao banco
    const db = client.db('palpiteiros');
    console.log('📊 Banco de dados: palpiteiros');
    
    // Listar collections
    const collections = await db.listCollections().toArray();
    console.log(`📦 Collections existentes: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('   └─', collections.map(c => c.name).join(', '));
    } else {
      console.log('   └─ Nenhuma collection ainda (será criada automaticamente)');
    }
    
    // Testar inserção
    console.log('\n🧪 Testando inserção de dados...');
    const testCollection = db.collection('_test');
    const result = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Teste de conexão bem-sucedido!'
    });
    console.log('✅ Documento de teste inserido! ID:', result.insertedId);
    
    // Deletar teste
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Documento de teste removido!');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 TUDO FUNCIONANDO PERFEITAMENTE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Agora você pode:');
    console.log('1. Rodar: npm run dev');
    console.log('2. Acessar: http://localhost:3000/entrar');
    console.log('3. Criar sua conta e fazer login!');
    console.log('');
    
  } catch (error) {
    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERRO NA CONEXÃO');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.error('Detalhes:', error.message);
    console.error('');
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Problema de autenticação:');
      console.error('   • Verifique se a senha em .env.local está correta');
      console.error('   • Certifique-se de que o usuário existe no MongoDB Atlas');
      console.error('   • Vá em: Database Access → Edit User → Update Password');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Problema de conexão:');
      console.error('   • Verifique sua conexão com a internet');
      console.error('   • Confirme se o cluster está ativo no MongoDB Atlas');
    } else if (error.message.includes('IP')) {
      console.error('🔒 Problema de IP:');
      console.error('   • Adicione 0.0.0.0/0 em: Network Access → Add IP Address');
      console.error('   • Ou adicione seu IP específico');
    }
    
    console.error('');
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Carregar .env.local
require('dotenv').config({ path: '.env.local' });

testConnection();
