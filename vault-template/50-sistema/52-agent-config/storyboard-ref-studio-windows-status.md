**Storyboard Reference Studio — Windows status: ❌ macOS-only**

> **UPDATE 2026-09-14:** Após checagem direta nos releases GitHub de todos os apps, confirma-se que Storyboard Reference Studio, Master Canvas, Slate, Circle Take, Motion Previs Studio, e Stem Studio não têm **builds Windows** disponíveis (apenas `.dmg` macOS). Apenas ScriptBreak, Cork Board, Blockout, e Unofficial DaVinci MCP têm Windows support.

## Alternativa pra Cliente C (Windows):

| Objetivo | Wasserman (Mac) | Alternativa (Windows) |
|----------|-----------------|----------------------|
| Storyboard/ref boards | Storyboard Ref Studio | ✅ **ScriptBreak** (já tem `get_shot_list` + prompt pack) + **Blockout** (previs) + **DaVinci MCP** (timeline) |
| Pre-pro canvas | Master Canvas | ✅ ScriptBreak prompts + Blockout staging |
| Prompt locking | Slate | ✅ ScriptBreak `export_prompt_pack` |
| Dailies review | Circle Take | ✅ DaVinci MCP `resolve_review` |
| Áudio stems | Stem Studio | ✅ DaVinci MCP `audio_qc` / `mix_plan` |
| Pose/motion | Motion Previs | ✅ (não crítico pro filme Cliente C) |

> 🔧 **Workaround source-build:** Todos os apps são Tauri (Electron) — dá pra buildar pra Windows via `npm run desktop:dir`. Mas requer Node toolchain + signing. Recomendado só se usar intensamente.