---
type: convention
tags: [ pillar/system, kind/resource, area/method, sdd, brain-kanban, project/second-brain ]
ai-first: true
---

# Kanban Workflow (for future Claude / OpenCode)

Como usar os boards em `50-sistema/56-boards/` para gerenciar os projetos e disparar o OpenCode em tasks específicas. O loop mestre (papéis + auto-dispatch + manutenção) está em [[Metodo de Trabalho]]. Integração com specs OpenSpec (repos): [[OpenSpec Workflow]].

## For future Claude
O brain tem 1 board mestre (`50-sistema/56-boards/Project Board.md`) + 1 board por projeto (`50-sistema/56-boards/<proj>.md`). Colunas = status: `Backlog · To Do · Doing · Blocked · Review · Done · Archive`. O plugin é `obsidian-kanban` (markdown `.md` com `kanban-plugin: board`, legível por mim).

## Loop de trabalho (agente)
1. **Visão portfolio**: ler `50-sistema/56-boards/Project Board.md` → ver em que status cada projeto está.
2. **Escolher task**: abrir `50-sistema/56-boards/<proj>.md`; pegar um card em `To Do` ou `Doing`.
3. **Brief pro OpenCode**: com o card selecionado, chamar o OpenCode (subagent) com a descrição do card + contexto (link do MOC/Context Pack do projeto). Ex.: "Implemente a task X do projeto <proj>; referências em ``<proj> MOC``".
4. **Atualizar status**: mover a linha do card `- [ ] ...` para a seção `## <nova coluna>` no `.md` (editar o markdown). `Doing` enquanto trabalha, `Review` ao terminar, `Done` após validar.
5. **Bloquear**: se precisar de humano, mover para `Blocked` e anotar o motivo no card.

## Convenções
- Cada card = 1 task acionável. Se uma task for grande, quebrar em sub-cards.
- Card sempre tem wikilink para o MOC ou Context Pack do projeto (rastreabilidade).
- `project/*` da nota do board segue o projeto; não duplicar em `pillar/*`.
- O agente NÃO move cards de `Backlog`→`Done` sem passar por `Doing`/`Review`.

## Exemplo de card
```
## To Do

- [ ] Gerar release notes do projeto — ver o MOC do projeto
```

## DoD gate
- Card só move Review→Done com: evidência de teste/build + sign-off do reviewer (Hermes `code-review`) + link dual-entry.
- Sem evidência, o card volta para Doing/Review com motivo anotado.

## Profile routing

> **Convenção:** os perfis abaixo são **labels conceituais** de composição de skills — Hermes é o único agente orquestrador; os perfis não são agentes separados. Hermes ativa skills do perfil conforme a fase. Ver [[Metodo de Trabalho]] §8.

| Fase | Perfil | Skills típicas |
|---|---|---|
| spec | researcher / strategist | `spec`, `grill-me`, `research` |
| decompose | orchestrator | `to-tickets`, `writing-plans`, `to-spec` |
| build | builder + OpenCode | `implement`, `tdd`, `subagent-driven-development` |
| review | qa / reviewer | `code-review`, `plan-eng-review`, `diagnosing-bugs` |
| maintain | maintainer / ops-watch | `brain-ops`, `brain-taxonomist`, `enrich` |
| triage | inbox-triage | `triage`, `github-issues` |

