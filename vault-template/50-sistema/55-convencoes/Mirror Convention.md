---
type: convention
tags: [ pillar/system, kind/resource, area/method, project/second-brain ]
ai-first: true
---

# 🪞 Mirror Convention (vault .md ↔ Kan)

> Convenção de espelho entre os boards `.md` do vault e o Kan. Placeholder: convenção + gancho no close, sem automação pesada.

## Quando espelhar

- Ao **fechar card no Kan** (coluna Done/Archive ou equivalente).

## Quem espelha

- O **agente que fechou** o card (Hermes ou OpenCode via MCP). Gancho no close: fechar no Kan → espelhar no `.md` no mesmo turno.

## Formato

- **Mover o card no `.md`** para a coluna correspondente + **link para o card Kan** (id cruzado).
- Boards Filmes: [[Cliente A Kanban|Cliente A Filmes]] ↔ Kan (ids cruzados).

## Regras

1. **`.md` manda em divergência** — o vault é a fonte de verdade.
2. Espelho em **até 1 turno** após o close.
3. **Nunca apagar histórico** — supersede, não delete.

## Out of scope

- Sync bidirecional automático total; conflito de texto (CRDT já resolve).

Ver também: [[Kanban Workflow]] · [[Metodo de Trabalho]] §6 · `docs/spec-f1cd/spec-mirror.md`.

#sdd #handoff #audit
