---
date: 2026-08-27
type: entity
tags: [ pillar/clientes, kind/entity, area/method, project/second-brain ]
ai-first: true
---
# Memory System — Universal Agent Instructions

This vault is the Second Brain: organized by **8 active projects** (3 archived: marca, erm, cliente-b), source of truth in Obsidian, history in git. Any AI agent can read it to continue work.

## Quick Start
1. Read `Mapa.md` (root MOC — replaces old `Vault.md`) → find the project.
2. Read `Dashboard.md` (live homepage, auto-opened by the `homepage` plugin).
3. Read the project MOC (in the project's JD folder, e.g. `30-conhecimento/32-video-remotion/32.08-projeto-moc.md`) + entry note → current state, pendências, how to continue.
4. Read `50-sistema/55-convencoes/Metodo de Trabalho.md` → the operating model (Hermes plans/analyzes, never codes; OpenCode executes, never scopes).
5. Read the kanban board (`50-sistema/56-boards/<proj> Kanban.md`) for the live ticket.
6. Specs ativas do projeto: [[OpenSpec Workflow]] — spec vive no repo (`<repo>/openspec/changes/<id>`), estado vive no vault (cards).

## 11 Projects
`cliente-a` · `marca` · `erm` · `omh` · `second-brain` · `cineweave` · `wod` · `career-ops` · `cliente-b` · `transversal` · `infraestrutura`.

## Conventions
- Every note has exactly **1** `project/*` tag (auto-colored by `auto-tag-graph-colors`).
- Kanban cards = tickets; OpenSpec changes = specs (`hermes/openspec/changes/<id>`).
- Wikilinks `[[Nota]]` connect the graph.

## Writing Protocol
- Update the kanban card + `Context Pack.md` pendências when progress changes.
- Log learnings in `Lessons Learned` (do NOT use `hot.md` / `Registro de Sessão.md` — removed).
- Respect the Hermes/OpenCode contract: do not change brain conventions without Hermes.

## MCP / Tool Access
- **Seekstone** (MCP): search, read_note, append_note, create_note, patch_frontmatter.
- If MCP not available, read/write files directly at:
  `%OBSIDIAN_VAULT_PATH%\`

## Agent skills

### Issue tracker

Issues/tickets são cards nos kanban boards de `50-sistema/56-boards/` (board mestre `Project Board.md` + 1 board por projeto). See `docs/agents/issue-tracker.md`.

### Triage labels

Labels canônicos default (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), aplicados dentro do texto do card (convenção em `docs/agents/triage-labels.md`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context aproveitando docs existentes: `Mapa.md` + `50-sistema/55-convencoes/` (sem CONTEXT.md na raiz). See `docs/agents/domain.md`.
