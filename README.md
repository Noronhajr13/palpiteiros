# 🎯 Palpiteiros V2

Plataforma completa de gestão de bolões esportivos com foco em Brasileirão.

---

## 🎯 Sobre o Projeto

O **Palpiteiros V2** é uma plataforma moderna e completa para gestão de bolões esportivos, desenvolvida com **Next.js 15**, **React 19**, **MongoDB** e **NextAuth.js**. O projeto evoluiu de um MVP frontend para uma aplicação full-stack robusta, com autenticação completa, banco de dados MongoDB e design system premium.

---

## ✨ Destaques

- ✅ **Autenticação Completa:** NextAuth.js v5 com credenciais + Google OAuth
- ✅ **MongoDB Nativo:** Migração completa de Prisma para MongoDB Native Driver
- ✅ **Design System Premium:** Dark mode, animações, microinterações
- ✅ **Campeonatos e Times:** Sistema completo de gestão de campeonatos
- ✅ **Performance Otimizada:** Build otimizado, queries eficientes
- ✅ **Mobile First:** Experiência completa em dispositivos móveis

---

## 🚀 Status Atual

- **Versão:** V2
- **Status:** ✅ **PRODUÇÃO** - Migração MongoDB concluída
- **Build:** ✅ Compilando sem erros
- **Database:** ✅ MongoDB (migração completa)
- **Autenticação:** ✅ NextAuth.js v5 + Google OAuth

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js** 15.5.0 (App Router)
- **React** 19.1.0
- **TypeScript** 5
- **Tailwind CSS** 4
- **shadcn/ui** (componentes)
- **Zustand** (estado global)
- **Framer Motion** (animações)
- **Recharts** (gráficos)

### Backend
- **MongoDB** 6.20.0 (driver nativo)
- **NextAuth.js** v5 Beta
- **bcryptjs** (hash de senhas)
- **@auth/mongodb-adapter**

### DevOps
- **TypeScript**
- **ESLint**
- **tsx** (CLI scripts)

---

## 📁 Estrutura do Projeto

```
palpiteiros/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── bolao/        # APIs de bolões
│   │   ├── jogos/        # APIs de jogos
│   │   ├── palpites/     # APIs de palpites
│   │   └── campeonatos/  # APIs de campeonatos
│   ├── bolao/[id]/       # Páginas dinâmicas de bolão
│   ├── meus-boloes/      # Dashboard de bolões
│   └── ...               # Outras páginas
├── components/
│   └── ui/               # Componentes shadcn/ui
├── lib/
│   ├── hooks/            # Hooks personalizados
│   ├── stores/           # Zustand stores
│   ├── mongodb.ts        # Conexão MongoDB
│   └── utils.ts          # Utilitários
├── docs/                 # 📚 Documentação (NOVA!)
│   ├── migrations/       # Migrações técnicas
│   ├── design/          # Design system
│   ├── features/        # Features específicas
│   └── guides/          # Guias e tutoriais
├── CLAUDE.md            # Contexto completo do projeto
└── README.md            # Este arquivo
```

---

## 📚 Documentação

A documentação completa está organizada em **docs/**:

### 🔄 Migrações
- [Prisma → MongoDB](./docs/migrations/PRISMA_TO_MONGODB_MIGRATION.md)
- [Sistema de Autenticação](./docs/migrations/AUTENTICACAO_COMPLETA.md)
- [Limpeza Completa](./docs/migrations/LIMPEZA_PRISMA_COMPLETA.md)

### 🎨 Design
- [Design System](./docs/design/DESIGN_SYSTEM.md)
- [Sistema de Cores](./docs/design/COLOR_SYSTEM.md)
- [Temas (Dark/Light)](./docs/design/THEME_REFACTOR.md)

### ⚙️ Features
- [Sistema de Bolões](./docs/features/REFATORACAO_MEUS_BOLOES.md)
- [Campeonatos](./docs/features/CAMPEONATOS_E_MELHORIAS.md)
- [Autorizações](./docs/features/SISTEMA_AUTORIZACAO_BOLOES.md)

### 📖 Guias
- [Quick Start](./docs/guides/QUICK_START_CAMPEONATOS.md)
- [Guia de Testes](./docs/guides/TESTING_GUIDE.md)
- [Resumo de Refatorações](./docs/guides/REFACTORING_SUMMARY.md)

📄 **Veja a [documentação completa](./docs/README.md)**

---

## ⚙️ Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local`:
```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/palpiteiros
# ou
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/palpiteiros

# NextAuth
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3001

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
```

### 3. Executar Desenvolvimento
```bash
npm run dev
```

Acesse: [http://localhost:3001](http://localhost:3001)

### 4. Build para Produção
```bash
npm run build
npm start
```

---

## ✅ Funcionalidades

### Core
- ✅ **Autenticação completa** (Credenciais + Google OAuth)
- ✅ **CRUD de bolões** (criar, editar, deletar)
- ✅ **Sistema de palpites** com pontuação
- ✅ **Rankings dinâmicos** por bolão
- ✅ **Gestão de jogos** (adicionar, editar, excluir)
- ✅ **Campeonatos** com times cadastrados

### Premium
- ✅ **Dark Mode** global
- ✅ **Estatísticas avançadas** com gráficos
- ✅ **Perfil de usuário** completo
- ✅ **Histórico de palpites** detalhado
- ✅ **Mobile experience** otimizada
- ✅ **Animações** com Framer Motion

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob licença MIT.

---

## 👨‍💻 Autor

**Noronha**
- GitHub: [@Noronhajr13](https://github.com/Noronhajr13)

---

## 🔗 Links Úteis

- 📄 [CLAUDE.md](./CLAUDE.md) - Contexto completo do projeto
- 📚 [Documentação](./docs/README.md) - Documentação técnica
- 🔄 [Migrações](./docs/migrations/) - Histórico de migrações
- 🎨 [Design System](./docs/design/) - Guias de design

---

**Última Atualização:** 05 de Outubro de 2025