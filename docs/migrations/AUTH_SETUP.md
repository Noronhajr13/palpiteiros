# 🔐 Configuração de Autenticação - Palpiteiros V2

## 📋 Visão Geral

Sistema de autenticação moderno usando **NextAuth.js v5** com:
- 🔑 Login via Email/Senha (bcrypt)
- 🌐 Login via Google OAuth
- 🌙 Dark Mode global (next-themes)
- 💾 MongoDB para persistência

---

## 🚀 Setup Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e edite:
```bash
cp .env.local.example .env.local
```

Edite `.env.local`:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/palpiteiros
# ou para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/palpiteiros

# NextAuth
NEXTAUTH_SECRET=JVt3tjooVdn2YF8DnqjIikRRFnBGZvw9P9UJVefUPuQ=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
```

---

## 🗄️ Opção 1: MongoDB Local

### Instalar MongoDB:
```bash
# Ubuntu/Debian
sudo apt install mongodb

# macOS
brew install mongodb-community

# Windows
# Baixe de: https://www.mongodb.com/try/download/community
```

### Iniciar MongoDB:
```bash
# Linux/Mac
sudo systemctl start mongodb
# ou
mongod --dbpath /caminho/para/dados

# Verificar se está rodando:
mongosh
```

### Usar no projeto:
```env
MONGODB_URI=mongodb://localhost:27017/palpiteiros
```

---

## ☁️ Opção 2: MongoDB Atlas (Grátis)

### 1. Criar Conta
- Acesse: https://www.mongodb.com/cloud/atlas
- Crie uma conta grátis

### 2. Criar Cluster
- Clique em "Build a Database"
- Escolha "Free" (M0)
- Selecione região (ex: São Paulo - sa-east-1)

### 3. Configurar Acesso
- **Database Access:**
  - Criar usuário com senha
  - Permissões: "Read and write to any database"
  
- **Network Access:**
  - Adicionar IP: `0.0.0.0/0` (permite qualquer IP - **só para desenvolvimento!**)

### 4. Obter Connection String
- Clique em "Connect"
- Escolha "Drivers"
- Copie a connection string:
  ```
  mongodb+srv://<username>:<password>@cluster.mongodb.net/palpiteiros
  ```

### 5. Configurar no .env.local:
```env
MONGODB_URI=mongodb+srv://seuusuario:suasenha@cluster.mongodb.net/palpiteiros?retryWrites=true&w=majority
```

---

## 🔐 Configurar Google OAuth

### 1. Acessar Google Cloud Console
- https://console.cloud.google.com

### 2. Criar Projeto
- Clique em "Select a project" → "New Project"
- Nome: "Palpiteiros"
- Criar

### 3. Habilitar Google+ API
- No menu lateral: "APIs & Services" → "Library"
- Busque: "Google+ API"
- Clique em "Enable"

### 4. Configurar OAuth Consent Screen
- "APIs & Services" → "OAuth consent screen"
- Tipo: **External**
- Preencher:
  - **App name:** Palpiteiros
  - **User support email:** seu@email.com
  - **Developer contact:** seu@email.com
- Salvar

### 5. Criar Credenciais
- "APIs & Services" → "Credentials"
- "Create Credentials" → "OAuth client ID"
- Tipo: **Web application**
- Nome: "Palpiteiros Web"
- **Authorized JavaScript origins:**
  ```
  http://localhost:3000
  ```
- **Authorized redirect URIs:**
  ```
  http://localhost:3000/api/auth/callback/google
  ```
- Criar

### 6. Copiar Credenciais
Você receberá:
- **Client ID:** `1234567890-abcdefg.apps.googleusercontent.com`
- **Client Secret:** `GOCSPX-abc123def456`

### 7. Adicionar ao .env.local:
```env
GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

---

## ✅ Testar Autenticação

### 1. Iniciar servidor:
```bash
npm run dev
```

### 2. Acessar:
```
http://localhost:3000/entrar
```

### 3. Testar fluxos:

#### Criar Conta:
1. Clique em "Não tem uma conta? Cadastre-se"
2. Preencha nome, email, senha
3. Clique em "Criar conta"
4. Deve fazer login automático e redirecionar para `/meus-boloes`

#### Login:
1. Digite email e senha
2. Clique em "Entrar"
3. Deve redirecionar para `/meus-boloes`

#### Google OAuth:
1. Clique no botão "Google"
2. Escolha conta Google
3. Deve redirecionar para `/meus-boloes`

#### Dark Mode:
1. Clique no ícone Sol/Lua no canto superior direito
2. Tema deve alternar instantaneamente

---

## 🔍 Verificar MongoDB

### Ver dados no MongoDB:
```bash
# MongoDB Local
mongosh
use palpiteiros
db.users.find()
db.sessions.find()

# MongoDB Atlas
# Use o "Collections" no painel web
```

### Estrutura esperada:
```javascript
// Collection: users
{
  _id: ObjectId("..."),
  name: "João Silva",
  email: "joao@example.com",
  password: "$2a$10$...", // hash bcrypt
  createdAt: ISODate("...")
}

// Collection: sessions (criada automaticamente pelo NextAuth)
{
  _id: ObjectId("..."),
  sessionToken: "...",
  userId: ObjectId("..."),
  expires: ISODate("...")
}
```

---

## 🐛 Troubleshooting

### Erro: "MongooseServerSelectionError"
- ✅ Verificar se MongoDB está rodando: `mongosh`
- ✅ Conferir MONGODB_URI no .env.local
- ✅ Para Atlas: verificar IP whitelist

### Erro: "Invalid client"
- ✅ Verificar GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET
- ✅ Conferir redirect URI no Google Cloud Console

### Erro: "NextAuth secret missing"
- ✅ Conferir NEXTAUTH_SECRET no .env.local
- ✅ Gerar nova: `openssl rand -base64 32`

### Login não funciona
- ✅ Abrir DevTools → Network → ver requisições
- ✅ Verificar console do terminal (erros de servidor)
- ✅ Conferir se MongoDB está acessível

### Dark mode não persiste
- ✅ Verificar se ThemeProvider está no layout
- ✅ Conferir localStorage (deve ter `theme` key)

---

## 📚 Referências

- **NextAuth.js v5:** https://authjs.dev/
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Google OAuth:** https://developers.google.com/identity/protocols/oauth2
- **next-themes:** https://github.com/pacocoursey/next-themes

---

## 🎯 Próximos Passos

Após configurar autenticação:

1. ✅ Testar fluxo completo de registro/login
2. ✅ Verificar persistência de sessão (refresh page)
3. ✅ Testar logout
4. ⏳ Migrar dados do SQLite → MongoDB (se necessário)
5. ⏳ Refatorar outras páginas para usar NextAuth session
6. ⏳ Implementar proteção de rotas com middleware

---

**Feito com ❤️ para Palpiteiros V2**
