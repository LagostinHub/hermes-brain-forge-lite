---
date: 2026-08-31
type: convention
tags: [ pillar/system, kind/convention, area/method, sdd, openspec, project/second-brain ]
ai-first: true
---
# OpenSpec Workflow

Como specs (OpenSpec) e o vault (kanban) trabalham juntos para gerenciar os 8 projetos ativos (3 arquivados: marca, erm, cliente-b). Complementa [[Kanban Workflow]] e o contrato Hermes/OpenCode de [[Metodo de Trabalho]].

## Divisão de responsabilidade

| Artefato | Onde vive | Quem escreve |
|---|---|---|
| **Spec** (o que construir) | `<repo>/openspec/changes/<id>/` | Hermes (skill `spec`) |
| **Task** (ticket acionável) | Card no board do projeto (`50-sistema/56-boards/<Name> Kanban.md`) | Hermes (skill `to-tickets`) |
| **Implementação** | No repo | OpenCode |
| **Estado/rastreabilidade** | Cards + MOC/Context Pack no vault | Ambos |

Regra de ouro: **spec nunca é criada no vault** — spec é artefato de repo (versionada com o código). O vault rastreia o ESTADO (o que está Doing/Done, pendências, contexto).

## Repos com openspec mapeados

`%PROJECT_REPO%` · `[CAMINHO]` · `%PROJECT_REPO%` · `%PROJECT_REPO%` · `%PROJECT_REPO%` · `%PROJECT_REPO%` · `%PROJECT_REPO%`

## Loop de trabalho

1. **Spec**: Hermes cria o change em `<repo>/openspec/changes/<id>/` (skill `spec`).
2. **Ticket**: card no board do projeto em `To Do`, texto cita o change id — ex.: `- [ ] tarefa-exemplo — implementar redesign — ver o MOC do projeto`.
3. **Executar**: mover card para `Doing` + brief pro OpenCode com o change id e o MOC.
4. **Archive**: change arquivado no repo (`openspec archive`) + card para `Done` + resultado registrado no MOC/Context Pack.
5. **Blocked**: card para `Blocked` com motivo; spec espera no repo.

## Convenções

- Card cita sempre o **change id** OpenSpec (rastreabilidade bidirecional repo ↔ vault).
- Um change pode gerar N cards (decompose via `to-tickets`).
- Nunca mover card `Backlog`→`Done` sem passar por `Doing`/`Review` (iron law).
- Status do projeto no [[Project Board]] (board mestre) reflete o board do projeto.

## Ver também

[[Kanban Workflow]] | [[Metodo de Trabalho]] | [[AGENTS]] | [[50.00-sistema-mapa]]
