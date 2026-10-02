---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/second-brain ]
ai-first: true
project: "brain-framework"
stack: "robocopy (sync-bootstrap.ps1), skills/, agent-config/, scripts/, templates/"
status: ativo
last-updated: 2026-09-09
ai-read-first: true
---

# 📦 Context Pack — brain-framework

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. **PRIVADO — nunca publicar.**

## 🎯 O que é

Repo canônico privado de tooling do brain (**fonte de verdade cross-machine**): `skills/`, `agent-config/`, `scripts/`, `templates/`. Espelha para [DONO]_VAULT via `sync-bootstrap.ps1` (robocopy; falha em `exit >= 8`).

## 🗂️ Estrutura

- `agent-config/` — 55 entries (Context Packs por projeto + core docs)
- `templates/` — 5
- `scripts/` — `sync-skills.ps1`, `reorg/`
- `.agents/skills` — 11

## 🔒 Decisões fixas

- **Never public.**
- Sync bidirecional: `ToVault` | `ToFramework`.

## ⚠️ Problemas

- `skills/` top-level **NÃO existe** — sync source quebrado (robocopy pula silenciosamente).
- Duplicata `Metodo de Trabalho.md` vs `Método de Trabalho.md` (acento).
- Sem remote (by design).
- 2 commits, **dormant desde 08-27**.
- Superseded em papel pelo [[[REPO] - Context Pack]] (gerador de skeleton).

## 🔗 Links

- [[Framework Sync]]
- [[Second Brain Kanban]]