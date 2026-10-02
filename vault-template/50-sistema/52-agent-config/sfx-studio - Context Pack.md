---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/infraestrutura ]
ai-first: true
project: "sfx-studio"
stack: "Python, Gradio, PyTorch 2.4.1+cu124, stable-audio-tools"
status: ativo
last-updated: 2026-09-09
ai-read-first: true
---

# 📦 Context Pack — sfx-studio

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. Repo: `[CAMINHO]`.

## 🎯 O que é

App local Gradio para gerar SFX/cenas sonoras de filmes por texto, **100% local na GPU** (RTX 4060 Ti 16GB).

- Modelo: `stabilityai/stable-audio-open-1.0` (open weights, gated no HF)
- Python + Gradio + PyTorch CUDA + stable-audio-tools

## 🧱 Stack

- Python · Gradio · PyTorch 2.4.1+cu124 · stable-audio-tools · soundfile · numpy<2

## 🗂️ Estrutura

- `sfx_app.py` — UI Gradio: prompt, duration 1–47s, seed, CFG 1–12, steps 25–500, sampler
- `gen_impact.py` / `gen_riser.py` — batches
- `download_model.py`
- `run.bat`
- `outputs/` — 7 WAVs gerados (impact/riser triunfante+sombrio)

## 🔒 Decisões fixas

- **Local-only** — nada de nuvem.
- `.venv` ativo.
- **DECISÃO DO DONO (2026-09-12): migrar para Node :4789** — app web com controle total de UI (sliders/takes/seed), padrão Remotion/[MARCA]. O Gradio atual permanece apenas como **referência do protótipo**.

## ⚠️ Armadilhas

- Nenhuma documentada além do estado local-only.

## ✅ Validação

- `.venv\Scripts\activate` + `python sfx_app.py` → `localhost:7860`

## 🐞 Pendências

- Migrar p/ Node web app (:4789) estilizado Remotion p/ integrar no pipeline [MARCA] (passo declarado no README).

## ➡️ Próximos passos

- **Escrever a spec/change da migração Node :4789** (Owner: Hermes) → build (Owner: OpenCode). Gradio fica como referência.

## 🔗 Links

- [[34.01-infraestrutura]]
- [[Infraestrutura Kanban]]