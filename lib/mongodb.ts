import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor adicione MONGODB_URI no arquivo .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, usar variável global para preservar conexão entre hot-reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Em produção, é melhor não usar variável global
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Função helper para obter o banco de dados
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db('palpiteiros')
}

export default clientPromise
