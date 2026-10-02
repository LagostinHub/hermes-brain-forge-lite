---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/second-brain ]
ai-first: true
project: "hermes"
stack: "Hermes config (yaml), OmniRoute gateway, Python, OpenSpec, [FERRAMENTA]"
status: ativo
last-updated: 2026-09-12
ai-read-first: true
---

# 📦 Context Pack — hermes

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. Repo: `[CAMINHO]`.

## 🎯 O que é

Workspace operacional do Hermes (orquestrador de agentes do brain). **Não é produto** — é a operação do próprio sistema de agentes. Mix de tooling, config backup, mídia e projetos aninhados (marca-motion, marca_v5_analysis, gitghost, mate-nous-shim).

## 🧱 Stack

- Config Hermes (`config_hermes_backup` yaml)
- ~~OmniRoute gateway local~~ — **descontinuado 2026-09-12** (arquivos em `[CAMINHO]`)
- Python (`omniroute_ingest.py` — movido p/ archive)
- OpenSpec
- [FERRAMENTA]

## 🔒 Decisões fixas

- Loop SDD **OpenSpec-first**.
- Spec vive no repo; **estado vive no vault** ([[OMH Kanban]]).
- 13 personalidades built-in.

## ⚠️ Armadilha crítica de SEGURANÇA

`omniroute_keys.json` / `omniroute_live_keys.json` / `omniroute_media_keys.json` / `or_cookies.txt` continham **API keys reais e vivas**. Foram **arquivados em 2026-09-12** (`[CAMINHO]`) — **fora do repo**. Se algum for restaurado: **NUNCA commitar / compartilhar.**

## 📊 OpenSpec

- **Ativas (1)**: `[ferramenta]-server-resolve` (2/23, ~9%).
- **Fechadas recentemente**: `2026-09-09-brain-utopia-lessons` — ✅ fechado 2026-09-12 (as 4 lanes A/B/C/D já estavam implementadas desde 09/09; cards movidos p/ Done).
- **Arquivadas**: 19.

## 🐞 Pendências

- [FERRAMENTA] binding porta 8188 (Wan 2.2 I2V / Ninja Cat).
- Wan 2.2 14B **NÃO** cabe na RTX 4060 Ti 16GB — usar LTX 2.3 Q4_K_M gguf.

## 🔗 Links

- [[52.01-hermes-agent]]
- [[Second Brain Kanban]]