---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/infraestrutura ]
ai-first: true
project: "davinci-resolve-mcp"
stack: "Python, FastMCP, fusionscript bridge, ffmpeg"
status: ativo
last-updated: 2026-09-09
ai-read-first: true
---

# 📦 Context Pack — davinci-resolve-mcp

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. Repo: `lordhoell/davinci-resolve-mcp` (1 commit).

## 🎯 O que é

Rebuild limpo do MCP server + Claude skill expondo **API completa** do DaVinci Resolve (**440+ tools**) com workflows ffmpeg. Python `>=3.10`, `mcp[cli]>=1.0`. **v0.1.0 alpha**. Entrega: `davinci-resolve-mcp.skill` ZIP.

## 🧱 Stack

- Python
- FastMCP
- fusionscript bridge + object registry
- ffmpeg — silence removal, audio fingerprint (`find_sounds_fast.py` ~78s/2.5h), volume-spike hype

## 📋 Requisitos

- Roda na **mesma máquina** do Resolve.
- Resolve **19.0+** (features 20.2+).

## 🗂️ Estrutura

- `src/davinci_resolve_mcp` — 26 tool modules
- `skill/` — SKILL.md + references (workflows / ffmpeg / fusion / render)
- `pyproject.toml`

## 🐞 Pendências

- `.agents/` untracked.
- Alpha; sem testes / publicação.

## 🔗 Links

- [[resolve-mcp - Context Pack]]
- [[Infraestrutura Kanban]]