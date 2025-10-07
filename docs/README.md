# 📚 Documentação do Projeto Palpiteiros

Esta pasta contém toda a documentação técnica do projeto, organizada em 4 categorias principais.

---

## 📂 Estrutura de Pastas

### 🔄 `/migrations` - Migrações e Refatorações Técnicas
Documentação de todas as grandes migrações arquiteturais do projeto.

- **LIMPEZA_PRISMA_COMPLETA.md** - Remoção completa do Prisma do projeto
- **PRISMA_TO_MONGODB_MIGRATION.md** - Migração detalhada Prisma → MongoDB
- **MIGRATION_COMPLETE.md** - Resumo geral da migração de banco
- **BACKEND_MONGODB_IMPLEMENTADO.md** - Implementação do backend MongoDB
- **REFACTOR_AUTH.md** - Refatoração do sistema de autenticação
- **AUTENTICACAO_COMPLETA.md** - Sistema completo de autenticação NextAuth
- **AUTH_SETUP.md** - Setup inicial de autenticação

**Use quando:** Entender decisões arquiteturais, processos de migração, ou replicar padrões.

---

### 🎨 `/design` - Design System e UI
Documentação de design, cores, temas e componentes visuais.

- **COLOR_SYSTEM.md** - Sistema de cores do projeto
- **DESIGN_SYSTEM.md** - Design system completo (componentes, espaçamentos, tipografia)
- **THEME_REFACTOR.md** - Refatoração do sistema de temas (dark/light mode)
- **HOME_REDESIGN.md** - Redesign da página inicial

**Use quando:** Criar novos componentes, definir cores, ou manter consistência visual.

---

### ⚙️ `/features` - Funcionalidades Específicas
Documentação de features e módulos específicos do sistema.

- **SISTEMA_AUTORIZACAO_BOLOES.md** - Sistema de autorização e permissões de bolões
- **REFATORACAO_CRIAR_BOLAO.md** - Refatoração da tela de criação de bolão
- **CRIAR_BOLAO_REFACTOR.md** - Detalhes técnicos do refactor de criar bolão
- **REFATORACAO_MEUS_BOLOES.md** - Refatoração da página meus bolões
- **DASHBOARD_REFACTOR.md** - Refatoração do dashboard
- **CAMPEONATOS_E_MELHORIAS.md** - Implementação de campeonatos e melhorias

**Use quando:** Entender como uma feature específica funciona ou foi implementada.

---

### 📖 `/guides` - Guias e Tutoriais
Guias práticos, quickstarts e checklists para desenvolvimento.

- **QUICK_START_CAMPEONATOS.md** - Guia rápido para trabalhar com campeonatos
- **TESTING_GUIDE.md** - Guia de testes do projeto
- **BUILD_CORRECOES.md** - Correções de build e problemas comuns
- **CHECKLIST_IMPLEMENTACAO.md** - Checklist de implementação de features
- **REFACTORING_SUMMARY.md** - Resumo geral de todas as refatorações

**Use quando:** Começar a trabalhar em algo novo, resolver problemas, ou seguir boas práticas.

---

## 🎯 Como Usar Esta Documentação

### Para Novos Desenvolvedores:
1. Comece com **README.md** (raiz do projeto)
2. Leia **CLAUDE.md** (raiz) - Contexto completo do projeto
3. Leia **docs/guides/REFACTORING_SUMMARY.md** - Visão geral
4. Explore **docs/migrations/** - Entenda a arquitetura atual
5. Consulte **docs/design/** - Aprenda o design system
6. Veja **docs/features/** - Entenda funcionalidades específicas

### Para Resolver Problemas:
1. **docs/guides/BUILD_CORRECOES.md** - Problemas de build
2. **docs/guides/TESTING_GUIDE.md** - Problemas de testes
3. **docs/migrations/** - Problemas arquiteturais

### Para Implementar Features:
1. **docs/guides/CHECKLIST_IMPLEMENTACAO.md** - Checklist
2. **docs/features/** - Exemplos de implementações anteriores
3. **docs/design/DESIGN_SYSTEM.md** - Componentes disponíveis

### Para Manutenção:
1. **CLAUDE.md** (raiz) - Status atual do projeto
2. **docs/guides/REFACTORING_SUMMARY.md** - Histórico de mudanças
3. **docs/migrations/** - Decisões técnicas

---

## 📝 Convenções

### Nomenclatura de Arquivos:
- **UPPERCASE_SNAKE_CASE.md** - Documentação técnica
- Nomes descritivos e auto-explicativos
- Sem espaços nos nomes

### Estrutura dos Documentos:
- Começar com título H1 (`#`)
- Usar emojis para melhor visualização
- Incluir data de criação/atualização
- Separar seções com `---`

### Manutenção:
- Atualizar documentação ao fazer mudanças
- Arquivar docs obsoletos (não deletar)
- Manter **CLAUDE.md** sempre atualizado

---

## 🔗 Links Rápidos

- 📄 [CLAUDE.md](../CLAUDE.md) - Contexto completo do projeto
- 📄 [README.md](../README.md) - Visão geral do projeto
- 🔄 [Migrações](./migrations/)
- 🎨 [Design](./design/)
- ⚙️ [Features](./features/)
- 📖 [Guias](./guides/)

---

## 📊 Estatísticas

- **Total de Documentos:** 23
- **Categorias:** 4
- **Migrações Documentadas:** 7
- **Features Documentadas:** 6
- **Guias Disponíveis:** 5
- **Design Docs:** 4

---

**Última Atualização:** 05 de Outubro de 2025
**Mantido por:** Time Palpiteiros
