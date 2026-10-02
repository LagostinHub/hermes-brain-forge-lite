---
type: convention
tags: [ pillar/system, kind/convention, area/workflow, project/cliente-a, brain-os ]
ai-first: true
---

# 🎬 SOP — Filme novo → Player no card ([Cliente] 2026)

> Fluxo padrão daqui pra frente: todo filme que entra em `07_ONLINE/` no Drive ganha player embutido no card do Kan **no mesmo dia**, com 1 comando. 
> Automatizado: `python C:/AI/tools/kan-sync/link_filmes.py --apply` (dry-run = sem `--apply`).
> Contexto: [[Cliente A Kanban]] · Player inline em prod desde deploy `dpl_3ewyoGY4` (2026-09-16).

## Quando rodar
- Logo após **exportar e subir o render final** pra `E:\DRIVE\My Drive\02- Comunicação\07_ONLINE\<pasta da label>\`
- Nome do arquivo: convenção `ddmm_NOME_LABEL_vXX.ext` (ver [[Tag Taxonomy]] e a regra LABEL=PASTA)

## Fluxo (3 passos, ~2 min)
1. **Subir o arquivo** pro Drive (pasta = label do card; nome padrão). O upload NÃO quebra nada — só adiciona.
2. **Rodar o comando**: `python C:/AI/tools/kan-sync/link_filmes.py --apply`
   - dry-run primeiro se quiser conferir: sem `--apply`, só reporta
3. **Conferir o report**: cada linha = 1 card. Ações possíveis:
   - `ADD` — link colocado, player live no card
   - `SKIP (já tem player)` — nada a fazer
   - `SEM-MATCH` — card de filme sem arquivo correspondente no Drive → **pendência humana** (subir o render)
   - `AMBIGUO` — dois arquivos casam → decidir manual (trocar no Drive ou usar `--force`)
   - `LINK-ANTIGO` — card tem link de versão antiga → `--force` troca (decisão humana)

## Como o matching funciona (e por que é confiável)
- **Scrape sem OAuth**: `embeddedfolderview` público das pastas do Drive expõe nome↔fileId (validado 2026-09-16, 20 fileIds resolvidos assim).
- **Nome normalizado**: uppercase + remove espaço/underscore/hífen/acento antes de comparar (`FAZENDA_RG` → `FAZENDARG`). Espaços no título do card (`DARK · PONTA GROSSA`) casam com underscores do arquivo (`PONTAGROSSA`) sem erro.
- **Link é para sempre**: o `fileId` do Drive sobrevive a rename/mover/versão — uma vez linkado, o player nunca quebra.
- **Fail visível**: `SEM-MATCH`/`AMBIGUO` aparecem no report, nada falha silenciosamente.

## Regras de ouro
1. **REGRA LABEL=PASTA** — a label do card diz a pasta do Drive (`dark-cidades`→`Dark Post/`, `dark-uni`→`Dark Uni/`, `DOBRADA`→`Dobradinhas/`, `VLOG`→`Vlog/`, `FEED`→`Feed/`, `Dark-Brasilia`→`Feed Brasilia/`, `PROPOSTAS`→`Propostas/`).
2. **Token NOME idêntico** entre card e arquivo (ou TL no filename: `TL9_1509_CURITIBA_...` = match exato à prova de ambiguidade).
3. **Sem movimento de cards** — o script só escreve description; drift de lista é detectado e reportado, nunca auto-corrigido.
4. **Dual-entry**: report vai pro card (comment) e o espelho `[[Cliente A Kanban]]` é atualizado no fim da sessão.

## Endgame (não bloqueia o fluxo)
- **Picker no app (Fase 2 OAuth)**: `drive_connections` + `files.ts` já meia construídas no `[CAMINHO]`. Quando ativar: modal do card → busca o filme no Drive → clica → link entra. Nome vira irrelevante (escolha visual). Pré-requisito humano: registrar redirect URI no Console + env vars na Vercel (ver handoff `docs/2026-09-15-handoff-kan-cards-drive-preview.md` Fase 2).

## Estado conhecido (2026-09-16)
- 47/69 cards com player. Pendências: **UNIBRASIL TL10** (sem arquivo no Drive), TL58–TL63 (em edição), TL24–TL33 Dark-Brasilia (sem vídeo ainda).
- Filemap canônico: `C:/AI/kan-filmes/docs/context-drive-filemap.json` (46 arquivos → fileId).
