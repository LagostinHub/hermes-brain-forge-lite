---
title: Hermes Global Skills — SDD + OpenSpec config (2026-08-20)
tags: [ pillar/system, kind/resource, area/method, project/erm ]
---
# Configuração Global de Skills — Hermes Agent

## Objetivo
Toda ação em projetos [CAMINHO] (cliente-a, cineweave, etc.) deve passar pelo SDD (spec-driven development). Tudo registrado em docs/ + Obsidian.

## Configuração aplicada

### 1. OpenSpec CLI (global)
```bash
npm install -g @fission-ai/openspec@latest  # v1.10.0
```
- `openspec list/status/propose/apply/archive/sync-specs/update-change`

### 2. External dir global (config.yaml)
```yaml
skills:
  external_dirs:
    - %OBSIDIAN_VAULT_PATH%\.agents\skills
```
- Fonte canônica: `.agents/skills` do vault **[DONO]_VAULT** (espelhado em `.claude/.opencode/copilot`); backup privado em `[CAMINHO]`
- Skills disponíveis (registry atual: 52.11-skills-mapa — o path antigo `system/skills/` não existe mais):
  - OpenSpec: openspec-explore, openspec-propose, openspec-apply-change, openspec-sync-specs, openspec-archive-change, openspec-update-change
  - Matt Pocock: to-spec, to-tickets, tdd, implement, code-review, diagnosing-bugs, domain-modeling, codebase-design, handoff, wayfinder
  - Obsidian: obsidian-bases, obsidian-cli, obsidian-markdown, obsidian-vault

### 3. Skills globais customizadas (no hermes skills dir)
- `sdd-campaign-spec-driven` — gate único 9-passos SDD
- `obsidian-doc-sync` — dual-entry docs + Obsidian pós-ação
- `skills-umbrella-consolidation` — mapa árvore + qual carregar primeiro

## Fluxo canônico
1. `/sdd-campaign-spec-driven` (gate de entrada)  
2. `/openspec-explore` (descoberta)  
3. `/openspec-propose <name>` (scaffold)  
4. `/to-spec` + `/to-tickets` (spec + tasks)  
5. `/tdd` → `/openspec-apply-change` (implement red-green)  
6. `/code-review` (standards + spec separado)  
7. `/openspec-archive-change` + `/openspec-sync-specs` (archive)  
8. `/obsidian-doc-sync` (registro dual — obrigatório pós-ação)

## Evidência
- `hermes skills list` → registry atual: 52.11-skills-mapa
- `openspec --version` → 1.10.0
- `openspec list` (hermes) → changes em `[CAMINHO]`
- skill_view validado: to-spec, code-review, tdd, openspec-propose, openspec-apply-change, sdd-campaign-spec-driven, obsidian-doc-sync

## Relacionado
- [[Mapa]] (hub do vault [DONO]_VAULT)
- %PROJECT_REPO%\AGENTS.md
- %PROJECT_REPO%\openspec\MASTER-MAP.md
