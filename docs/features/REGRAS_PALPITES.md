# Regras de Palpites

## Jogos Disponíveis para Palpite

### Critérios de Elegibilidade

Para um jogo aparecer na lista de "jogos disponíveis para palpite", ele deve atender a **TODOS** os seguintes critérios:

1. **Status do Jogo**: `status === 'agendado'`
   - Jogos finalizados, cancelados ou adiados não aparecem
   
2. **Data Futura**: `new Date(jogo.data) > new Date()`
   - Apenas jogos que ainda não começaram
   - A data do jogo deve ser posterior ao momento atual

### Exemplo de Filtro

```typescript
const jogosDisponiveis = jogos.filter(jogo => 
  jogo.status === 'agendado' && 
  new Date(jogo.data) > new Date()
)
```

### Status Possíveis de Jogos

- **agendado**: Jogo marcado para acontecer (disponível para palpites se a data for futura)
- **finalizado**: Jogo já realizado (não disponível para palpites)
- **cancelado**: Jogo cancelado (não disponível para palpites)
- **adiado**: Jogo adiado (não disponível para palpites)

## Organização na Interface

Os jogos disponíveis são organizados por:

1. **Rodada** (ordem crescente)
2. **Data** (dentro de cada rodada)

### Mensagens ao Usuário

**Nenhum jogo cadastrado:**
- "Ainda não há jogos cadastrados neste bolão"

**Todos os jogos finalizados ou fora do prazo:**
- "Todos os jogos já foram finalizados ou estão fora do prazo para palpites"

## Funcionalidades

### Salvar Palpite

- Usuário pode salvar ou atualizar palpites
- Campos obrigatórios: placarA e placarB
- Validação: números entre 0 e 99

### Indicadores Visuais

- ✅ Badge verde: "Palpite Registrado" quando já existe palpite
- 📅 Data/hora do jogo formatada em pt-BR
- 💾 Botão muda de "Salvar Palpite" para "Atualizar Palpite"
- 🔄 Loading state durante salvamento

### Último Palpite

Quando há palpite existente, mostra:
```
Último palpite: 2 × 1
```

## Permissões

### Palpite Tardio

Se o bolão tiver `permitePalpiteTardio: true`:
- Usuário pode fazer palpites até o início do jogo
- Caso contrário, deve seguir o prazo definido pelo bolão

*Nota: Esta funcionalidade ainda precisa ser implementada na regra de filtro*

## Implementação Técnica

### Hooks Utilizados

- `useJogos(bolaoId)`: Carrega todos os jogos do bolão
- `usePalpites(userId, bolaoId)`: Gerencia palpites do usuário
- `getPalpiteJogo(jogoId)`: Busca palpite existente para um jogo

### Estado Local

```typescript
const [palpitesForm, setPalpitesForm] = useState<{
  [key: string]: {
    placarA: string
    placarB: string
  }
}>({})

const [salvandoPalpites, setSalvandoPalpites] = useState<Set<string>>(new Set())
```

### Fluxo de Salvamento

1. Validar campos preenchidos
2. Adicionar jogoId ao Set de salvando
3. Chamar API via `salvarPalpite()`
4. Mostrar toast de sucesso/erro
5. Limpar formulário se sucesso
6. Remover jogoId do Set de salvando

## Melhorias Futuras

- [ ] Implementar regra de `permitePalpiteTardio`
- [ ] Adicionar countdown para início do jogo
- [ ] Permitir filtrar por rodada específica
- [ ] Mostrar estatísticas de acertos do usuário
- [ ] Adicionar sugestões baseadas em histórico
- [ ] Notificações antes do prazo final para palpites
