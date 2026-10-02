---
type: resource
tags: [ pillar/system, kind/resource, area/personal, project/infraestrutura ]
---
# 2026-08-21 — [FERRAMENTA] Verify & Doc

#sdd #handoff #audit

## Contexto
Usuário reportou [FERRAMENTA] não rodando. Missão: consertar, checar funcionamento + nodes + workflows, e registrar TUDO (repo + vault) via obsidian-doc-sync. Usar OpenSpec p/ reger projetos.

## Decisão
Subir [FERRAMENTA] via `main.py` + `python_embeded` (não `server.py` — causa "no job control"). Validar com smoke test LTX 2.3.

## Evidência
- `system_stats` → v0.33.1, RTX 4060 Ti 16GB, pytorch 2.13.0+cu130 ✅
- Smoke LTX enviado: prompt_id `94ccb0f3-b867-41da-a83c-cf09b71b387b` (22B, demorando)
- Corrigido `smoke_ltx.py` → `smoke_ltx_fixed.py` (bug: LTXVAudioVAEDecode=AUDIO vs SaveImage=IMAGE)

## Ambiente
- Start: `[CAMINHO] -s [FERRAMENTA]\main.py --windows-standalone-build`
- Porta 8188

## Custom Nodes
Bruxos-do-VFX, GGUF, LTXVideo, Manager, WanVideoWrapper

## Workflows
- LTX 2.3 t2v/i2v → ✅ roda na 4060 Ti (gguf Q4)
- Wan 2.2 14B t2v/i2v → ❌ não roda (16GB insuficiente)

## Relacionado
- OpenSpec: [ferramenta]-verify-and-doc
- Repo doc: docs/[ferramenta]_status_2026-08-21.md
