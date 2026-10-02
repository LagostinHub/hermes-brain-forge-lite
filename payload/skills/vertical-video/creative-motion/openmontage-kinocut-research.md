# [biblioteca AGPLv3] + Kinocut Research (Jul 2026)

Pesquisa feita em 14 Jul 2026 sobre alternativas open-source ao Motion.so para produção de motion graphics com AI.

## Contexto

Usuário: motion designer profissional, dono da [MARCA] (education marketing). Tem interesse em criar vídeos de demonstração do [MARCA] Catalog (app de catálogo de assets). Já usa Remotion + After Effects + OpenCode.

## Ferramentas Comerciais Referência

- **Motion.so** — "Frontier Agent for Motion Design." Descreve vídeo em texto, ele desenha, anima e renderiza. Funciona via browser, Claude, ChatGPT, MCP. $5-$99/mês. motion.so
- **Higgsfield Vibe Motion** — motion via chat conversacional. Upload assets, templates, refinamento UI. higgsfield.ai
- **Remotion Agent Skills** — Remotion 4.0 + Claude Code/Codex/OpenCode. Geração de vídeo por prompt. remotion.dev/docs/ai/coding-agents

## [biblioteca AGPLv3]

- **Repo:** github.com/calesthio/[biblioteca AGPLv3]
- **License:** AGPLv3 (uso como CLI/ferramenta externa OK, incorporar código contamina)
- **Lançamento:** meados 2026, trending no GitHub
- **Status:** ativo, comunidade pequena
- **O que faz:** primeiro sistema de produção de vídeo agentic open-source
- **12 pipelines, 52 tools, 500+ agent skills**
- **Backlot:** storyboard visual que atualiza em tempo real, aprovação de cenas antes do render
- **Funciona com:** Claude Code, Cursor, Copilot, Windsurf, Codex
- **Custo exemplo:** curta Pixar-style "The Last Banana" = $1.33 (6 clipes Kling v3 via fal.ai + Google Chirp3 + música royalty-free + Remotion)
- **Product ad "VOID — Neural Interface"** = $0.69 (4 imagens gpt-image-1, TTS, música, legendas WhisperX)
- **Documentário "Library at Alexandria"** = $0.02 (5 cenas artesanais, OpenAI ash narração)
- **Requer:** Node.js, Python 3.11+, API keys (OpenAI, fal.ai, etc.)

### Pipelines Mencionados
- product-ad, explainer, cinematic, anime, documentary, social, article-to-video

### Observações
- Usa Remotion para composição final
- AGPLv3 significa cuidado ao copiar código, mas usar como ferramenta externa é tranquilo
- Comunidade pequena mas projeto ativo — verificar compatibilidade antes de dependência crítica

## Kinocut (antigo mcp-video)

- **Repo:** github.com/KyaniteLabs/kinocut
- **License:** Apache-2.0 (permissiva)
- **Site:** kinocut.dev
- **PyPI:** `pip install kinocut`
- **Versão atual:** 1.8.0 (14 Jul 2026)
- **142 MCP tools / 121 CLI commands**
- **O que faz:** MCP server guardrail pra edição de vídeo com FFmpeg. Ferramentas tipadas com validação preflight, Video Receipt (proveniência), quality gates.
- **Publisher:** KyaniteLabs (kyanitelabs.tech)
- **MCP Registry id:** `io.github.KyaniteLabs/kinocut`

### Funcionalidades Principais
- Trim, resize, convert, merge, add_text, composite_layers
- Legendas (SRT/VTT/ASS) com dimension-aware
- AI_transcribe via Whisper
- Hyperframes init sem TTY
- Workflow engine (job-spec JSON multi-step)
- Video Receipt: provenance + quality/release checkpoints
- Video rescue pipeline (plan/render/inspect)
- C2PA provenance (opcional)
- Repurpose skill: podcast/interview → captioned vertical Shorts

### Instalação
```bash
brew install ffmpeg  # ou sudo apt install ffmpeg
pip install kinocut
kino doctor
claude mcp add kinocut -- uvx --from kinocut kino
```

### Uso como MCP no Hermes
Configurar no `config.yaml` do profile como MCP tool via stdio:
```yaml
tools:
  mcp_servers:
    kinocut:
      command: uvx
      args: ["--from", "kinocut", "kino"]
```

### Use Cases
- Repurposing: one recording → captioned Shorts/Reels/TikTok packages
- Podcast/interview cuts: find strongest segment, normalize audio, chapters
- Agent-driven media in CI: repeatable, reviewable edits
- Pós-produção de renders Remotion: reframe 9:16 + captions + quality gate

### Observações
- Código maduro, 1.8.0 com changelog robusto
- Apache-2.0 sem restrição de uso
- Comunidade pequena mas bem documentado
- Precisa de FFmpeg no PATH
- Ideal como complemento ao [biblioteca AGPLv3]/Remotion

## Outras Alternativas Open-Source

- **Motionity** (github.com/alyssaxuu/motionity) — editor motion web open source, tipo Canva + AE. Keyframing, masking, filters, text animation. Não tem AI agent.
- **Open Generative AI** (github.com/anil-matcha/open-generative-ai) — MIT, desktop app self-hosted. Inclui "Vibe Motion" como feature. 200+ modelos. Alternativa a plataformas de AI video.
- **Blender** — open-source 3D, motion graphics via Grease Pencil. Tradicional, não AI-agentic.
