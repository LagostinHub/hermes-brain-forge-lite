---
date: 2026-09-14
type: reference
tags: [ #tools, #open-source, vendor/github, project/cliente-c ]
---

# 50.02 — Open-Source Storyboard & AI Video Tools (GitHub)

> Pesquisa 2026-09-14 — tools open-source no GitHub pra **storyboard, prompt engine, AI video production** (Windows/Linux compatível).

## ⭐ Top picks (alinhado ao stack Cliente C)

| Repo | Stars | Lang | Description | Windows? |
|------|-------|------|-------------|----------|
|| **SwiftClip** (zz41354899) | 44 | TypeScript | Remotion templates + Claude Code workflow for **storyboard-driven video generation** | ✅ via Node |
| **MiniMax-H3-Codex-Drama** (chiphoton) | 37 | JavaScript | Codex-first plugin: character/scene design, **storyboards**, **[FERRAMENTA] workflows**, prompt enhancer | ✅ |
| **AI-video-generation** (VanGong) | 34 | TypeScript | AI Video Storyboard Platform — React-flow canvas, **image→video, storyboard grid, 创意对话** | ✅ |
| **ai-video-production-editor** (LudwigKienlele) | 42 | TypeScript | **React + Electron AI video editor for filmmakers** | ✅ |
| **Nomi** (HBAI-Ltd/Toonflow-app) | 15587 | TypeScript | All-in-one AI short drama: 小说→动画, 集成 AI编剧, 智能分镜 (storyboard AI) | ✅ |
| **Jellyfish** (Forget-C) | 6405 | Python | End-to-end **production workspace for AI-generated short dramas**: script → structure → shots | ✅ |
| **Nomi** (aqm8578861) | 511 | TypeScript | **Open-source AI video workbench** — bring any model/[FERRAMENTA], Claude Code agents | ✅ |
| **Synesthesia-AI-Video-Director** (RowanUnderwood) | 54 | Python | Local Gradio app: **audio→video** music video automation | ✅ |

## 🎯 Match pro Cliente C (prioritário)

1. **SwiftClip** — Remotion templates (você já usa Remotion/[PROJETO]). Pode gerar animatic rapidamente.
2. **MiniMax-H3-Codex-Drama** — Codex-first, tem **storyboards + [FERRAMENTA] workflows** (match direto pro seu Wan 2.2 pipeline).
3. **Jellyfish** — workflow completo (script → dramas). Pode servir como inspiração pro pipeline Cliente C.

## 🔍 Como usar (integração Hermes)

| Tool | MCP? | Integração |
|------|------|------------|
| SwiftClip | ❌ | Usar templates Remotion direto no OpenCode |
| MiniMax-H3 plugin | ❌ | Workflow [FERRAMENTA] + Codex agent |
| Jellyfish | ❌ | Inspiração pro pipeline |
| Nomi (aqm) | ❌ | Agentes + [FERRAMENTA] workflow |

> 💡 **Dica:** todos são open-source. Pode instalar e rodar via Docker ou build dev. Se quiser, pino no Kanban como referência pra futuros desenvolvimentos.

## 📦 Instalação rápida (SwiftClip — Remotion)
```bash
git clone https://github.com/zz41354899/SwiftClip C:/AI/tools/SwiftClip
cd C:/AI/tools/SwiftClip
npm install
# usa @remotion/* + Claude Code agent workflow
```