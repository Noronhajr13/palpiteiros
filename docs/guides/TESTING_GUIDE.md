# 🧪 Guia de Testes - Refatoração Palpiteiros

## ✅ Checklist de Testes

### 1. Autenticação (NextAuth)

#### Login/Logout
- [ ] Fazer login com credenciais válidas
- [ ] Tentar acessar página protegida sem login → deve redirecionar para `/entrar`
- [ ] Fazer logout → deve redirecionar para home
- [ ] Verificar que sessão persiste após reload da página

#### Navegação Entre Páginas
- [ ] Navegar para `/meus-boloes` → deve carregar bolões do usuário
- [ ] Navegar para `/perfil` → deve mostrar dados do usuário
- [ ] Navegar para `/estatisticas` → deve carregar estatísticas
- [ ] Abrir `/bolao/[id]` → deve carregar detalhes do bolão
- [ ] Abrir `/bolao/[id]/palpites` → deve carregar jogos para palpitar
- [ ] Abrir `/bolao/[id]/ranking` → deve carregar ranking
- [ ] Abrir `/bolao/[id]/jogos` → deve carregar lista de jogos

---

### 2. Página Meus Bolões

#### Carregamento de Dados
- [ ] Página carrega corretamente (sem loop infinito)
- [ ] Bolões do usuário aparecem na lista
- [ ] Estatísticas (Total de Bolões, Palpites, etc.) são calculadas corretamente
- [ ] Cards de bolões mostram informações corretas (nome, participantes, etc.)

#### Console Logs (Debug)
Verificar no console do navegador:
- [ ] `🚀 Carregando bolões para user: [user-id]`
- [ ] `👤 User ID da sessão: [user-id]`
- [ ] `📦 Total de bolões carregados: [número]`
- [ ] `✅ Meus bolões filtrados: [número]`

---

### 3. Página Gerenciar Jogos

#### Carregamento Inicial
- [ ] Página carrega sem erros
- [ ] Campeonato do bolão é carregado automaticamente
- [ ] Times do campeonato aparecem nos dropdowns
- [ ] Jogos existentes são listados corretamente

#### Console Logs (Debug)
Verificar no console:
- [ ] `🎯 Carregando página de jogos para bolão: [bolao-id]`
- [ ] `🏆 Carregando times do campeonato: [campeonato-id]`
- [ ] `✅ Times carregados: [número]`
- [ ] `🎮 Carregando jogos para bolão: [bolao-id]`
- [ ] `✅ Jogos carregados: [número]`

#### Adicionar Jogo - Cenário 1: Com Campeonato Configurado

**Pré-requisitos**:
- Bolão deve ter `campeonatoId` configurado
- Campeonato deve ter times cadastrados

**Passos**:
1. [ ] Abrir `/bolao/[id]/jogos`
2. [ ] Verificar que dropdowns de "Time A" e "Time B" aparecem
3. [ ] Verificar que descrição mostra: "Selecione os times do campeonato [Nome]"
4. [ ] Selecionar um time no dropdown "Time A"
5. [ ] Selecionar um time DIFERENTE no dropdown "Time B"
6. [ ] Preencher data/hora
7. [ ] Preencher rodada
8. [ ] Clicar em "Adicionar Jogo"
9. [ ] Verificar toast de sucesso: "Jogo adicionado com sucesso!"
10. [ ] Verificar que jogo aparece na lista
11. [ ] Verificar que formulário é limpo após adicionar

#### Adicionar Jogo - Cenário 2: Validação de Times Iguais

**Passos**:
1. [ ] Selecionar "Flamengo" em "Time A"
2. [ ] Selecionar "Flamengo" em "Time B" (mesmo time)
3. [ ] Clicar em "Adicionar Jogo"
4. [ ] Verificar toast de erro: "Os times devem ser diferentes!"
5. [ ] Verificar que jogo NÃO foi adicionado

#### Adicionar Jogo - Cenário 3: Sem Campeonato (Fallback)

**Pré-requisitos**:
- Bolão sem `campeonatoId` ou campeonato sem times

**Passos**:
1. [ ] Abrir `/bolao/[id]/jogos`
2. [ ] Verificar que inputs de texto aparecem (não dropdowns)
3. [ ] Verificar placeholder: "Ex: Flamengo" / "Ex: Palmeiras"
4. [ ] Digitar nome do Time A manualmente
5. [ ] Digitar nome do Time B manualmente
6. [ ] Preencher outros campos e submeter
7. [ ] Verificar que jogo é criado normalmente

#### Loading States
- [ ] Durante carregamento de times, inputs mostram "Carregando times..." e ficam disabled
- [ ] Spinner aparece enquanto página carrega (`status === 'loading'`)
- [ ] Mensagem "Carregando informações do bolão..." aparece se `bolaoId` não estiver pronto

---

### 4. Estatísticas da Página de Jogos

Verificar os cards de estatísticas:
- [ ] **Total de Jogos**: Mostra quantidade correta de jogos cadastrados
- [ ] **Agendados**: Conta apenas jogos com `status === 'agendado'`
- [ ] **Finalizados**: Conta apenas jogos com `status === 'finalizado'`
- [ ] **Rodadas**: Mostra o número da rodada mais alta cadastrada

---

### 5. Outras Páginas Refatoradas

#### /entrar-bolao
- [ ] Campo "Código do Bolão" funciona
- [ ] Validação: código vazio mostra erro
- [ ] Usuário consegue entrar em bolão com código válido
- [ ] Toast de sucesso aparece
- [ ] Redirecionamento funciona após entrar

#### /perfil
- [ ] Dados do usuário carregam corretamente
- [ ] Avatar/nome/email aparecem
- [ ] Estatísticas do perfil são calculadas

#### /estatisticas
- [ ] Gráficos/estatísticas carregam
- [ ] Filtros de período funcionam
- [ ] Dados são atualizados quando filtro muda

#### /bolao/[id]/palpites
- [ ] Jogos disponíveis para palpite aparecem
- [ ] Usuário consegue salvar palpite
- [ ] Palpites salvos são persistidos
- [ ] Estatísticas de palpites corretas

#### /bolao/[id]/ranking
- [ ] Ranking carrega corretamente
- [ ] Participantes ordenados por pontos
- [ ] Dados dos participantes corretos

---

### 6. Testes de Regressão

#### APIs
- [ ] `GET /api/bolao/listar?userId=[id]` retorna bolões corretos
- [ ] `GET /api/campeonatos/[id]` retorna campeonato com times
- [ ] `POST /api/jogos/criar` cria jogo com times selecionados
- [ ] `GET /api/jogos?bolaoId=[id]` lista jogos corretamente

#### Console de Erros
- [ ] Nenhum erro no console do navegador
- [ ] Nenhum erro no terminal do servidor Next.js
- [ ] Nenhum warning do React
- [ ] Nenhum erro de TypeScript no build

---

### 7. Testes de Performance

#### Carregamento de Páginas
- [ ] `/meus-boloes` carrega em < 2s
- [ ] `/bolao/[id]/jogos` carrega em < 2s
- [ ] Carregamento de times do campeonato < 500ms
- [ ] Nenhuma requisição duplicada (verificar Network tab)

#### Re-renders
- [ ] Navegar entre páginas não causa re-renders desnecessários
- [ ] Formulário não re-renderiza durante digitação (verificar React DevTools)

---

### 8. Testes de Edge Cases

#### Autenticação
- [ ] Sessão expirada → redireciona para login
- [ ] Token inválido → redireciona para login
- [ ] Usuário deletado → tratamento de erro apropriado

#### Dados
- [ ] Bolão sem campeonato → fallback para input manual funciona
- [ ] Campeonato sem times → fallback para input manual funciona
- [ ] Bolão sem jogos → mensagem apropriada exibida
- [ ] Lista de times vazia → não quebra a página

#### Network
- [ ] Erro de rede ao carregar times → toast de erro aparece
- [ ] Erro ao criar jogo → toast de erro com mensagem clara
- [ ] Timeout de API → tratamento apropriado

---

## 🎯 Casos de Teste Críticos

### Teste 1: Fluxo Completo de Criar Bolão → Adicionar Jogos
1. [ ] Login
2. [ ] Criar novo bolão com campeonato selecionado
3. [ ] Navegar para "Gerenciar Jogos"
4. [ ] Verificar que times do campeonato aparecem
5. [ ] Adicionar 3 jogos com times diferentes
6. [ ] Verificar que todos aparecem na lista
7. [ ] Navegar para "Fazer Palpites"
8. [ ] Verificar que os 3 jogos aparecem para palpitar

### Teste 2: Fluxo de Múltiplos Usuários
1. [ ] Usuário A cria bolão
2. [ ] Usuário A adiciona jogos
3. [ ] Usuário B entra no bolão (código)
4. [ ] Usuário B vê os mesmos jogos
5. [ ] Ambos conseguem fazer palpites

### Teste 3: Edição e Exclusão de Jogos
1. [ ] Criar jogo
2. [ ] Editar jogo (mudar times, data, etc.)
3. [ ] Verificar que alterações persistem
4. [ ] Excluir jogo
5. [ ] Verificar que jogo não aparece mais

---

## 📱 Testes Mobile (Responsividade)

- [ ] Layout responsivo em tela pequena (< 640px)
- [ ] Dropdowns funcionam em touch devices
- [ ] Botões são facilmente clicáveis
- [ ] Formulários são usáveis em mobile
- [ ] Navegação funciona em mobile

---

## ✅ Critérios de Aceitação

Para considerar a refatoração bem-sucedida:

- [ ] **Todos os 8 casos de teste principais** passam
- [ ] **Zero erros no console** (navegador e servidor)
- [ ] **Performance mantida** (< 2s para páginas principais)
- [ ] **100% das funcionalidades existentes** continuam funcionando
- [ ] **Novos recursos** (dropdowns de times) funcionam corretamente
- [ ] **Validações** funcionam como esperado
- [ ] **Loading states** são exibidos apropriadamente
- [ ] **Error handling** funciona em todos os cenários

---

## 🐛 Bugs Conhecidos (Se Houver)

_Nenhum bug conhecido até o momento._

---

## 📞 Reportar Problemas

Se encontrar algum problema durante os testes:

1. Anote a URL da página
2. Reproduza o erro e anote os passos
3. Capture screenshot/console logs
4. Verifique o console do navegador e servidor
5. Documente e reporte

---

**Status do Documento**: ✅ Atualizado
**Última Atualização**: Após refatoração completa
