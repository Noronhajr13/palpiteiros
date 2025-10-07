# Como Testar: Jogos com IDs dos Times

## 🧪 Guia de Teste Passo a Passo

### Pré-requisitos

1. Ter um bolão criado
2. Bolão vinculado a um campeonato com times cadastrados
3. Servidor rodando (`npm run dev`)

---

## 📋 Teste 1: Criar Jogo com IDs

### Passos:

1. **Acessar página de jogos**
   ```
   http://localhost:3000/bolao/[ID_DO_BOLAO]/jogos
   ```

2. **Preencher formulário**
   - Time A: Selecionar um time (ex: Flamengo)
   - Time B: Selecionar outro time (ex: Palmeiras)
   - Data: Escolher data futura
   - Rodada: 1
   - Status: Agendado

3. **Clicar em "Adicionar Jogo"**

### ✅ Resultado Esperado:
- Toast de sucesso: "Jogo adicionado com sucesso!"
- Jogo aparece na lista
- Console do navegador mostra:
  ```
  🎮 Carregando jogos para bolão: [ID]
  ✅ Jogos carregados: 1
  ```

### 🔍 Verificar no Banco:
```javascript
// MongoDB Compass ou mongosh
db.jogos.findOne({ bolaoId: "SEU_BOLAO_ID" })

// Deve retornar:
{
  _id: ObjectId("..."),
  bolaoId: "...",
  timeAId: "68e1f6b1509c2bf972781cf1",  // ← ID do time!
  timeBId: "68e1f6b1509c2bf972781cf2",  // ← ID do time!
  timeA: "Flamengo",
  timeB: "Palmeiras",
  data: ISODate("2024-01-15T16:00:00.000Z"),
  rodada: 1,
  status: "agendado",
  placarA: null,
  placarB: null,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 📋 Teste 2: Validação de Times Diferentes

### Passos:

1. **Tentar criar jogo com mesmo time**
   - Time A: Flamengo
   - Time B: Flamengo (mesmo time)

2. **Clicar em "Adicionar Jogo"**

### ✅ Resultado Esperado:
- ❌ Toast de erro: "Os times devem ser diferentes!"
- Descrição: "Selecione times diferentes para Time A e Time B"
- Jogo NÃO é criado

---

## 📋 Teste 3: Editar Jogo

### Passos:

1. **Clicar no botão de editar** (ícone de lápis) em um jogo existente

2. **Alterar dados**
   - Mudar Time A ou Time B
   - Alterar data
   - Mudar status

3. **Salvar alterações**

### ✅ Resultado Esperado:
- Modal fecha
- Jogo atualizado na lista
- Toast: "Jogo atualizado com sucesso!"

### 🔍 Verificar no Banco:
```javascript
db.jogos.findOne({ _id: ObjectId("ID_DO_JOGO") })

// Campos timeAId e timeBId devem refletir as mudanças
```

---

## 📋 Teste 4: Fazer Palpite em Jogo com IDs

### Passos:

1. **Acessar página de palpites**
   ```
   http://localhost:3000/bolao/[ID_DO_BOLAO]/palpites
   ```

2. **Verificar que jogos aparecem corretamente**
   - Nomes dos times exibidos
   - Data e rodada corretas

3. **Fazer um palpite**
   - Placar A: 2
   - Placar B: 1
   - Salvar

### ✅ Resultado Esperado:
- Palpite salvo com sucesso
- Jogo mostra badge "Palpite Registrado"
- Sistema funciona normalmente

---

## 📋 Teste 5: Importar Jogos via CSV

### Preparar CSV:

**Opção 1: Com IDs (Novo formato)**
```csv
TimeAId,TimeBId,TimeA,TimeB,Data,Rodada,Status
68e1f6b1509c2bf972781cf1,68e1f6b1509c2bf972781cf2,Flamengo,Palmeiras,2024-01-15 16:00,1,agendado
68e1f6b1509c2bf972781cf3,68e1f6b1509c2bf972781cf4,Corinthians,São Paulo,2024-01-15 18:30,1,agendado
```

**Opção 2: Sem IDs (Compatibilidade)**
```csv
Time A,Time B,Data,Rodada,Status
Flamengo,Palmeiras,2024-01-15 16:00,1,agendado
Corinthians,São Paulo,2024-01-15 18:30,1,agendado
```

### Passos:

1. **Criar arquivo CSV**
2. **Acessar seção "Importar Jogos"**
3. **Selecionar arquivo**
4. **Clicar em "Importar Jogos"**

### ✅ Resultado Esperado:
- Jogos importados com sucesso
- Toast mostra quantidade: "X jogos importados com sucesso!"
- Lista atualiza com novos jogos

---

## 📋 Teste 6: Bolão SEM Campeonato

### Cenário:
Bolão criado sem vincular a um campeonato

### Passos:

1. **Acessar página de jogos**
2. **Verificar formulário**
   - Deve mostrar inputs de texto
   - Placeholder: "ID do Time A" / "ID do Time B"

3. **Criar jogo manualmente**
   - Digitar ID do time ou nome
   - Preencher outros campos
   - Salvar

### ✅ Resultado Esperado:
- Sistema aceita tanto IDs quanto nomes
- Jogo criado normalmente
- Funciona como fallback

---

## 🔍 Inspeção de Rede (DevTools)

### Verificar Request de Criação:

1. **Abrir DevTools** (F12)
2. **Aba Network**
3. **Criar jogo**
4. **Filtrar por "criar"**

### Request Payload Esperado:
```json
{
  "bolaoId": "68e286ecd28064cfbba2b44d",
  "timeAId": "68e1f6b1509c2bf972781cf1",
  "timeBId": "68e1f6b1509c2bf972781cf2",
  "timeA": "Flamengo",
  "timeB": "Palmeiras",
  "data": "2024-01-15T16:00:00",
  "rodada": 1,
  "status": "agendado"
}
```

### Response Esperada:
```json
{
  "success": true,
  "jogo": {
    "id": "...",
    "bolaoId": "...",
    "timeAId": "68e1f6b1509c2bf972781cf1",
    "timeBId": "68e1f6b1509c2bf972781cf2",
    "timeA": "Flamengo",
    "timeB": "Palmeiras",
    "data": "2024-01-15T16:00:00.000Z",
    "rodada": 1,
    "status": "agendado",
    "placarA": null,
    "placarB": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 🐛 Problemas Comuns

### Problema 1: Selects vazios
**Causa:** Campeonato não tem times cadastrados
**Solução:** 
1. Acessar `/campeonatos`
2. Adicionar times ao campeonato
3. Recarregar página de jogos

### Problema 2: Times não carregam
**Causa:** BolaoId ou CampeonatoId inválido
**Solução:**
1. Verificar console do navegador
2. Conferir se bolão tem campeonatoId
3. Recriar bolão se necessário

### Problema 3: Erro ao salvar
**Causa:** Validação falhou
**Solução:**
1. Verificar se times são diferentes
2. Conferir se data é válida
3. Ver console para mensagem de erro

---

## ✅ Checklist Final

Após todos os testes, verificar:

- [ ] Jogos criados têm `timeAId` e `timeBId` no banco
- [ ] Nomes dos times são exibidos corretamente na interface
- [ ] Validação impede criar jogo com times iguais
- [ ] Edição de jogos funciona
- [ ] Palpites funcionam normalmente
- [ ] CSV import aceita ambos formatos
- [ ] Console não mostra erros
- [ ] Performance está normal

---

## 📞 Suporte

Se encontrar algum problema:

1. **Verificar Console do Navegador**
   - Erros JavaScript
   - Respostas da API

2. **Verificar Logs do Servidor**
   - Terminal onde `npm run dev` está rodando
   - Mensagens de erro da API

3. **Verificar Banco de Dados**
   - MongoDB Compass
   - Estrutura dos documentos

4. **Documentação Adicional**
   - `/docs/migrations/JOGOS_COM_IDS_TIMES.md`
   - `/docs/features/REGRAS_PALPITES.md`
