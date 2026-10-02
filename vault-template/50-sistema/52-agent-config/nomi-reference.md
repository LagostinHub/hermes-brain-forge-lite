---
date: 2026-09-14
type: reference
tags: [ #tools, #open-source, vendor/nomi, project/cliente-c ]
---

# 50.03 — Nomi: Agent-driven AI Video Workbench (MCP)

> Open-source local-first AI video workbench (Electron + React + [FERRAMENTA]). **Windows build** disponível. Agentes (Codex/Claude Code/Cursor) podem dirigir via **MCP** ou **CLI**.

## 📡 MCP Tools (18 core)

| Tool | Uso no Cliente C |
|------|---------------|
| `nomi_create_project` | Criar projeto "Como nasce uma ideia" |
| `nomi_canvas_plan` | Layout de shots no canvas |
| `nomi_add_nodes` / `nomi_connect_nodes` | Montar timeline de 9 cenas/21 takes |
| `nomi_asset_import` | Importar assets ingeridos (prompts, refs) |
| `nomi_generate` | Gerar takes via [FERRAMENTA]/Wan 2.2 |
| `nomi_generation_plan` | Plano de geração (cheap → quality) |
| `nomi_generation_status` | Monitorar job |
| `nomi_export_job` | Exportar renders finais |
| `nomi_artifact_review` | Review/QA dos takes (gates) |
| `nomi_confirm_generation_gate` | Aprovação frame-by-frame (perfil do usuário) |

## 🧪 How it works

- **Modo A:** Nomi app aberto → MCP/CLI usa o local service
- **Modo B:** App fechado → MCP background headless (auto-liga)
- **Token:** `~/.nomi/capability-core/token` (gerado no primeiro launch)

## 🔧 Setup pro Cliente C

1. Baixar [Nomi-windows-setup.exe](https://github.com/aqm857886159/Nomi/releases) (ou `npm run desktop:dir`)
2. Primeiro launch → gera token em `%LOCALAPPDATA%\.nomi\capability-core\token`
3. Conectar modelo: **Local [FERRAMENTA]** (§2 do integrate doc) para Wan 2.2 (100% local)
4. Agent connect (§3): Nomi merge `nomi` entry no Hermes config → 18 tools aparecem
5. Criar projeto via `nomi_create_project` → `nomi_canvas_plan` com 9 cenas → `nomi_generate`

## 🎯 Workflow Cliente C (draft → finish)

| Etapa | Tool | Custo |
|-------|------|-------|
| 1. Storyboard esboço | `nomi_generate` (ModelScope free/cheap) | $0 |
| 2. Pose + reference frames | `nomi_generate` (image credits Codex) | $0 (incluído) |
| 3. Takes final | `nomi_generate` (Local [FERRAMENTA] Wan 2.2) | $0 |
| 4. Approve frame | `nomi_confirm_generation_gate` | — |
| 5. Export → DaVinci | `nomi_export_job` → `resolve_import_media` | — |

## ⚡ Vantagem pro Cliente C

- **25 MCP tools** + CLI → agente (Hermes/OpenCode) dirige tudo
- **[FERRAMENTA] first-party** → Wan 2.2 local 100% offline
- **Prompt engine integrado** → sem CinePrompt (que é BYOC)
- **Reference images + consistency tracking** → personagem EXECUTIVO entre takes
- **Aprovação por gates** → satisfaz o "approvar cada frame antes de gerar vídeo"

## 📁 Path Windows

- App: `%USERPROFILE%\AppData\Local\Programs\Nomi\`
- Token: `%LOCALAPPDATA%\.nomi\ capability-core\token`
- Source (dev): `[CAMINHO]`