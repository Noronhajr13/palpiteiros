const { MongoClient, ObjectId } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'

async function testPalpitesLookup() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('✅ Conectado ao MongoDB')
    
    const db = client.db('palpiteiros')
    
    // Buscar um palpite específico
    const palpite = await db.collection('palpites').findOne({
      userId: '68e15be4c75755182ee8134c',
      bolaoId: '68e286ecd28064cfbba2b44d'
    })
    
    console.log('\n📄 Palpite encontrado:')
    console.log(JSON.stringify(palpite, null, 2))
    
    if (!palpite) {
      console.log('❌ Nenhum palpite encontrado')
      return
    }
    
    console.log('\n🔍 Tipo do jogoId:', typeof palpite.jogoId)
    console.log('🔍 Valor do jogoId:', palpite.jogoId)
    
    // Testar lookup original (que falha)
    console.log('\n--- Teste 1: Lookup original (direto) ---')
    const resultadoOriginal = await db.collection('palpites').aggregate([
      { $match: { 
        userId: '68e15be4c75755182ee8134c',
        bolaoId: '68e286ecd28064cfbba2b44d'
      }},
      {
        $lookup: {
          from: 'jogos',
          localField: 'jogoId',
          foreignField: '_id',
          as: 'jogo'
        }
      },
      { $limit: 1 }
    ]).toArray()
    
    console.log('Resultado lookup original:', resultadoOriginal[0]?.jogo?.length || 0, 'jogos encontrados')
    
    // Testar lookup com conversão
    console.log('\n--- Teste 2: Lookup com conversão ---')
    const resultadoConvertido = await db.collection('palpites').aggregate([
      { $match: { 
        userId: '68e15be4c75755182ee8134c',
        bolaoId: '68e286ecd28064cfbba2b44d'
      }},
      {
        $lookup: {
          from: 'jogos',
          let: { jogoId: '$jogoId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', { $toObjectId: '$$jogoId' }] },
                    { $eq: [{ $toString: '$_id' }, '$$jogoId'] }
                  ]
                }
              }
            }
          ],
          as: 'jogo'
        }
      },
      { $unwind: { path: '$jogo', preserveNullAndEmptyArrays: false } },
      { $limit: 1 }
    ]).toArray()
    
    console.log('Resultado lookup convertido:', resultadoConvertido.length, 'registros encontrados')
    if (resultadoConvertido[0]) {
      console.log('✅ Jogo encontrado:', resultadoConvertido[0].jogo.timeA, 'vs', resultadoConvertido[0].jogo.timeB)
    }
    
    // Buscar o jogo diretamente
    console.log('\n--- Teste 3: Buscar jogo diretamente ---')
    const jogoStr = await db.collection('jogos').findOne({ _id: palpite.jogoId })
    console.log('Busca com string:', jogoStr ? '✅ Encontrado' : '❌ Não encontrado')
    
    const jogoOid = await db.collection('jogos').findOne({ 
      _id: new ObjectId(palpite.jogoId)
    })
    console.log('Busca com ObjectId:', jogoOid ? '✅ Encontrado' : '❌ Não encontrado')
    
    if (jogoOid) {
      console.log('Jogo:', jogoOid.timeA, 'vs', jogoOid.timeB)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await client.close()
  }
}

testPalpitesLookup()
