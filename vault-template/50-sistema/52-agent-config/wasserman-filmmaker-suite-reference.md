---
date: 2026-09-14
type: reference
tags: [ #tools, #workflow, vendor/wasserman, project/cliente-c ]
---

# 50.01 — Wasserman Filmmaker Suite (AI-native pipeline)

> **10 tools** open-source (Apache-2.0) de Sam Wasserman, cada um com **MCP server** agent-drivable. Todos offline/OSS.

## 📊 Suite Map (completo)

| # | App | Domínio | MCP tools | Instalado | Windows |
|---|-----|---------|-----------|-----------|---------|
| 1 | **ScriptBreak** | Breakdown: roteiro→scenas, shots, elements, bibles, prompt packs | 11 ✅ | ✅ | ✅ |
| 2 | **Cork Board** | Story structure: index cards, acts, arcs, presets, exports | 25 ✅ | ✅ | ✅ |
| 3 | **Master Canvas** | Pre-pro planning: prompts, boards, assets | ✅ | 🔴 | ? |
| 4 | **Blockout** | Previs: staging, camera marks, depth pass, motion ref | ✅ | ✅ | ✅ Win11 |
| 5 | **Motion Previs Studio** | Pose/câmera de footage → Blockout reference | ✅ | 🔴 | ✅ Win11 |
| 6 | **Storyboard Reference Studio** | Ref imagery → boards, animatics, shot lists, prompts | ✅ | 🔴 | ? |
| 7 | **Slate** | Continuity-locked generator prompts (video/img/audio), MCP handoffs | ✅ | 🔴 | ? |
| 8 | **Circle Take** | Dailies: quality gates (drift/flicker/hands), selects, reshoot list | ✅ | 🔴 | Mac |
| 9 | **Stem Studio** | Audio stem split → dialogue/music/effects WAVs | ✅ | 🔴 | ✅ Win11 |
|10| **DaVinci MCP** | Resolve: assemble, cut, color, QC, render | 37 ✅ | ✅ | ✅ |

- **Call Sheet** (Mac menu bar): launcher integrado — não é app de produtividade, é um hub.

## 🔗 Fluxo de trabalho (Cliente C)

```
Roteiro DOCX → ScriptBreak (breakdown) → Cork Board (cards/acts) → 
Master Canvas (prompts/assets) → Blockout (previs) → 
Storyboard Ref (boards/animatic) → Slate (prompts finos) → 
IA Video (Wan 2.2/[FERRAMENTA]) → Circle Take (review/reshoot) → 
Stem Studio (áudio) → DaVinci MCP (assemble/render)
```

## 📡 Registro MCP no Hermes — path Windows

| MCP | command | args |
|-----|---------|------|
| scriptbreak | `node` | `[CAMINHO]` |
| cork-board | `node` | `[CAMINHO]` |
| blockout | `node` | `[CAMINHO]` |
| davinci-resolve | `python` | `-m davinci_mcp` |

> ⚠️ **Paths absolutos Windows no config.yaml do Hermes:** usar `C:\` (backslash) ou `/` (forward slash) — **evitar** `/c/AI/` (MSYS) quando registrar no config.

## 🎯 Aplicação ao Cliente C (prioridades)

| Fase | Tool Wasserman | Uso no Cliente C | Status |
|------|---------------|-----------------|--------|
| Breakdown | ScriptBreak | ✅ roteiro 9 beats → shots/prompts | ✅ done |
| Structure | Cork Board | index cards 9 cenas + preset Commercial/Short | pendente |
| Previs | Blockout | staging shots underwater, depth pass | pendente |
| Boards | Storyboard Ref | storyboards a partir dos prompts | pendente |
| Prompt lock | Slate | continuity prompts locked por take | pendente |
| Render | [FERRAMENTA]/Wan 2.2 | 21 takes IA | 🔴 pausado (aguarda aprovação) |
| Review | Circle Take | quality gates identidade drift | 🔴 |
| Áudio | Stem Studio | split trilha/respiração/bolhas | 🔴 |
| Final | DaVinci MCP | assemble, color grade #FF8C28, render | 🔴 |

## 📥 Instalar os pendentes (opcional)
- Master Canvas, Motion Previs, Storyboard Ref, Slate, Circle Take, Stem Studio — disponíveis no [repo releases](https://github.com/wassermanproductions) do Wasserman. Windows builds disponíveis pra Blockout, Motion Previs, Stem Studio.