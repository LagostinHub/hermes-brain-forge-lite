---
name: creative-motion
description: >-
  Motion / video graphics umbrella (non-[MARCA]) — Remotion brand demos, Manim
  math animations, ASCII video, cinematic ComfyUI/Wan pipelines. Use for
  brand demo videos, explainer animations, cinematic shot design for AI film.
  For [MARCA]/Cine Studio motion use the `[marca]` skill instead.
---

# creative-motion

> **Fonte canônica (motion):** [[37-regras-e-decisoes/57.24-regras-de-animacao]]
> **Fonte canônica (edição):** [[37-regras-e-decisoes/57.22-regras-de-edicao]]

## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)
| Pilar | MOC | Quando consultar |
|---|---|---|
| **Cinema Theory (mestre)** | [[57.00-cinema-theory-moc]] | Visão geral + ordem de leitura dos 7 pilares |
| **Animação/Movimento** | [[57.24-animação-moc]] | 12 princípios Disney, Williams, Halas/Whitaker, timing |
| **Design** | [[57.25-design-moc]] | Tipografia, cor, layout, hierarquia visual |
| **Edição** | [[57.22-edição-moc]] | Timing, ritmo, matching cut, regra de Murch |
| **Áudio** | [[57.26-audio-moc]] | Sound design, Foley, música, mixagem |

> Regra: nunca decida "de cabeça" — consulte o card do pilar; nunca cite o card sem executar pela tool certa.

Unified skill for **motion graphics & video that are NOT the [MARCA] pipeline**.
Includes AI motion graphics stack ([biblioteca AGPLv3], Kinocut, Remotion Agent Skills) merged from ai-motion-graphics.
Sub-skills preserved as directories alongside this file (no `references/` prefix —
they are part of creative-motion, not separate skills).

## Quick-reference map

| Precisa | Onde |
|---|---|
| **Overlay de filme em Remotion** (nome/lower third, título, lista, gráfico, transição) | skill **`remotion-film-overlays`** ← comece aqui |
| Caso real completo de filme vertical p/ cliente ([CLIENTE-B] 4000) | skill **`[PROJETO-VIDEO]-video-motion`** |
| Pipeline Remotion genérico (arquivos, vídeo, áudio, ProRes+alpha) | `remotion-video-production/` |
| Render no Windows (CLI falha → API Node) | `remotion-windows-render/` |
| 3D no Remotion (@remotion/three + alpha) | `remotion-three-3d/` |
| Fontes no headless | skill `remotion-headless-fonts` |
| Legendas animadas (pycaps / TikTok) | `animated-campaign-captions/` e skill `animated-video-captions` |
| Filme-like brand / product demo video (Remotion) | `brand-demo-video/` |
| Manim CE math / algorithm animations | `manim-video/` |
| ASCII video (convert video/audio to colored ASCII MP4/GIF) | `ascii-video/` |
|| Cinematic methodology for ComfyUI + Wan 2.2 + SDXL/Flux | `cine-studio-cinematic/` |
|| Local MiniMax H3 video pipeline (RTX 4060 Ti workflow) |  |

## Ordem de leitura recomendada (overlay de filme)
1. **`remotion-film-overlays`** — o sistema: stop motion, ordem de camadas, contraste, catálogo de elementos.
2. `references/component-library.tsx` dessa skill — copiar os componentes.
3. `references/qc-pipeline.md` — render + os 5 checks de QC + normalização de loudness.
4. `[PROJETO-VIDEO]-video-motion` — quando o cliente é a [CLIENTE-B] (regras fixas dele) ou quando
   você precisa de um caso real de decisão de design.

## Storyboard-Driven Workflow

Use `remotion-storyboard-director` (from SwiftMographer, `github.com/zz41354899/SwiftMographer`) to generate a Markdown storyboard first. The `remotion` skill now carries the prefab **preflight JSON contract** — emit it before writing component code.

Ver também: [[32.03-swiftclip-remotion]] no vault — 32 templates + 5 core templates + template conventions.

## Notes
- [MARCA] / Cine Studio motion (Remotion lettering, MILA cargo, ProRes4444+alpha)
  belongs in the `[marca]` skill — not here.
- AI filmmaking / ComfyUI-Wan pipelines also covered by `comfyui-video`.

## Moodboard & Style Definition (Sep 2026)
See  — seção "Moodboard & Frame Extraction Workflow".
Summary: extrair frames via ffmpeg (scene change detection), definir paleta chiaroscuro (#010914/#FF8C28), aprovação cliente antes da geração H3.
