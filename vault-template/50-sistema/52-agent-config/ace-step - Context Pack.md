---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/infraestrutura ]
ai-first: true
project: "ace-step"
stack: "Python 3.11, PyTorch XPU, Gradio, uv"
status: ativo
last-updated: 2026-09-09
ai-read-first: true
---

# 📦 Context Pack — ace-step

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. Repo: `[CAMINHO]` (clone upstream ACE-Step 1.5).

## 🎯 O que é

Clone upstream **ACE-Step 1.5** (geração de música IA open-source) + scripts Intel XPU (`setup_xpu.bat`, `start_gradio_ui_xpu.bat`, `start_api_server_xpu.bat`, `README-XPU.md`) para rodar em **GPU Intel Arc**. Python 3.11 + PyTorch XPU + Gradio + uv.

## 🗂️ Estrutura

- `checkpoints/` — `acestep-v15-turbo`, `5Hz-lm-4B`, `5Hz-lm-1.7B`, `Qwen3-Embedding`, `vae`
- `api/` · `training/`
- `docs/` — en/ja/ko/zh

## 🔒 Decisões fixas

- XPU env vars: `SYCL_CACHE_PERSISTENT`, `PYTORCH_DEVICE=xpu`.
- OOM → **CPU offload** para 4B LM.

## 🐞 Pendências

- `gradio_outputs/` vazio — nenhum output gerado ainda.
- `AGENTS.md` modified + `.agents` untracked (config de agente).

## ✅ Validação

1. `setup_xpu.bat`
2. `start_gradio_ui_xpu.bat`
3. `127.0.0.1:7860`

## 🔗 Links

- [[ace-step - Context Pack]]
- [[Infraestrutura Kanban]]