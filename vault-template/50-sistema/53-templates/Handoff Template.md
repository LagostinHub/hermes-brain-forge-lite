# Handoff Template — [REPO]

Formato padrão de handoff entre agentes (Hermes → OpenCode / OpenCode → Hermes / sessão → sessão),
no padrão cross-agent-handoff do [REPO]. Um handoff é **auto-contido**: o agente
receptor tem zero contexto da sessão anterior — tudo o que ele precisa está neste arquivo.

Uso: copie este arquivo para dentro de um projeto no vault da máquina (ex.: `HANDOFF - <Nome>.md`)
e preencha. Nunca comite conteúdo real do cliente neste repo.

---

# HANDOFF — <Nome da Tarefa>

**Repo / path:** `<caminho absoluto do workspace>`
**Base:** `<branch ou commit atual>`
**Stack:** `<linguagens/frameworks>`
**Data:** `<AAAA-MM-DD>`
**De / Para:** `<quem entrega> → <quem recebe>`

## 1. Resumo executivo

- O que esta tarefa é (2-3 frases).
- Estado atual: o que já existe, o que está quebrado/incompleto.
- Por que está sendo handoffada agora.

## 2. Brief — o que construir

- Objetivo concreto (comportamento observável, não "melhorar X").
- Escopo IN: lista explícita do que esta tarefa cobre.
- Referências: [[Context Pack Template]] do projeto (lembrete: preencher com notas/links),
  arquivos/linhas, specs, docs.
- Restrições técnicas já decididas (não reabrir).

## 3. Critérios de aceitação

Como validar (testável, não "deve parecer"). Ex.:

- [ ] `comando` roda sem erro e imprime X
- [ ] cenário A produz resultado B (dados de exemplo conhecidos)
- [ ] testes existentes continuam verdes (`comando`)
- [ ] gate de segredos passa (`audit/scan-personal-data.ps1` 0 hits)

## 4. Limites — o que NÃO mexer

- Arquivos/regiões proibidas (razão).
- Decisões que estão FORA do escopo e não podem ser mudadas aqui.
- Onde o agente deve PARAR e devolver a task (condição de devolução).

## 5. Ordem de execução (para o agente receptor)

Passos em sequência, cada um com resultado verificável. Se algo falhar, registre e devolva —
não improvise escopo.

## 6. Devolução (para o agente que entregou)

Ao terminar, devolver em formato curto: o que fez, como validar, o que ficou de fora/aberto.

---

> Lembrete: handoff **nunca** carrega secrets, tokens, caminhos absolutos do usuário
> (derivados do ambiente quando necessários), nome de cliente real sem permit ou conteúdo
> pessoal. O audit hook barra no commit.