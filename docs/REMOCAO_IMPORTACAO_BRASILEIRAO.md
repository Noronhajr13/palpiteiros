# Remoção das Funcionalidades de Importação

**Data:** 07/10/2025
**Motivo:** Funcionalidades descontinuadas - não serão mais utilizadas no projeto

---

## 📋 O Que Foi Removido

### 1. **Código da Aplicação**

#### Frontend (UI)
- **Arquivo:** `app/bolao/[id]/jogos/page.tsx`
  - ❌ Removida função `handleImportBrasileirao` (60+ linhas)
  - ❌ Removido Card "Importar do Brasileirão" (80+ linhas)
  - ❌ Removida função `handleFileSelect` (10 linhas)
  - ❌ Removida função `handleImportCsv` (70+ linhas)
  - ❌ Removida função `downloadTemplate` (15 linhas)
  - ❌ Removido Card "Importar Jogos (CSV/Excel)" (70+ linhas)
  - ❌ Removidos imports: `Upload`, `Download`
  - ❌ Removidos states: `selectedFile`
  - ❌ Removida referência `importarJogos` do hook useJogos

#### API Routes
- **Status:** API já havia sido removida anteriormente
- **Endpoint removido:** `POST /api/jogos/importar-brasileirao`

#### Scripts e Bibliotecas
- **Status:** Arquivos já haviam sido deletados anteriormente
- **Arquivos removidos:**
  - `scripts/importar-brasileirao.ts`
  - `lib/scrapers/brasileirao-crawler.ts`

---

### 2. **Documentação**

#### CLAUDE.md (Principal)
Removidas as seguintes referências:
- ❌ "com foco em Brasileirão" da descrição do projeto
- ❌ "Web scraping do Brasileirão" da lista de features
- ❌ Cheerio (web scraping) da lista de dependências
- ❌ Endpoint `POST /api/jogos/importar-brasileirao` da lista de APIs
- ❌ Menção a "scraping" na página `/bolao/[id]/jogos`
- ❌ Menção a "CSV" na página `/bolao/[id]/jogos`
- ❌ Seção inteira "6. Web Scraping (Brasileirão)" com:
  - CLI commands
  - Instruções de uso
  - Descrição do crawler
- ❌ Comando `npx tsx scripts/importar-brasileirao.ts` dos exemplos
- ❌ "Web scraping para import automático" da lista de features completadas

#### README.md
- ❌ Cheerio (web scraping) da lista de tecnologias

#### Docs de Migração (Histórico)
Atualizados com marcações de **REMOVIDO**:
- `docs/migrations/PRISMA_TO_MONGODB_MIGRATION.md`
- `docs/migrations/MIGRATION_COMPLETE.md`

**Nota:** O arquivo `docs/migrations/LIMPEZA_PRISMA_COMPLETA.md` já documentava a remoção desses arquivos.

---

## ✅ Verificação

### Build
```bash
npm run build
```
**Resultado:** ✅ **Compilado com sucesso** (0 erros)
- Apenas warnings de ESLint (variáveis não utilizadas)
- Todas as páginas geradas corretamente

### Funcionalidades Mantidas
A página de jogos continua funcionando normalmente com:
- ✅ Adicionar jogo manualmente
- ✅ Editar jogos existentes
- ✅ Excluir jogos (se sem palpites)
- ✅ Listagem organizada por rodada

### Funcionalidades Removidas
- ❌ Importar jogos via CSV/Excel
- ❌ Baixar template CSV
- ❌ Importar jogos do Brasileirão via scraping

---

## 📊 Impacto

### Código Removido
- **~315 linhas** de código TypeScript/React
  - 60 linhas: função `handleImportBrasileirao`
  - 80 linhas: Card "Importar do Brasileirão"
  - 70 linhas: função `handleImportCsv`
  - 15 linhas: função `downloadTemplate`
  - 10 linhas: função `handleFileSelect`
  - 70 linhas: Card "Importar Jogos (CSV/Excel)"
  - 10 linhas: states e imports
- **~300 linhas** de documentação

### Dependências
- Cheerio **ainda instalado** no projeto (pode ser removido se não for usado em outros lugares)

### Breaking Changes
- ❌ **Nenhum** - As funcionalidades nunca foram utilizadas em produção

---

## 🎯 Próximos Passos (Opcional)

1. **Remover Cheerio do package.json** se não for usado:
   ```bash
   npm uninstall cheerio @types/cheerio
   ```

2. **Verificar scripts de diagnóstico** se ainda são necessários:
   - `scripts/verificar-usuario.ts`
   - `scripts/verificar-boloes.ts`
   - `scripts/verificar-usuarios.ts`

3. **Limpar variáveis não utilizadas** (warnings do ESLint)

---

## 📝 Conclusão

As funcionalidades de importação automática foram completamente removidas do projeto:
- ✅ Importação via scraping do Brasileirão
- ✅ Importação via CSV/Excel
- ✅ Download de template CSV

**Código removido:**
- Frontend (funções e UI components)
- Backend (APIs já haviam sido removidas)
- Documentação técnica
- Referências em docs de migração

O projeto continua funcionando perfeitamente com adição manual de jogos através do formulário.
