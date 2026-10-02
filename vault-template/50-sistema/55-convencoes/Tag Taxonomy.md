---
type: convention
tags: [ pillar/system, kind/resource, method, area/method, sdd, brain-reorg, project/second-brain ]
ai-first: true
---
# Tag Taxonomy ([DONO]_VAULT)

## For future Claude
Controlled tag vocabulary for the Second Brain. Use ONLY these namespaces. Tags in frontmatter are lowercase **kebab-case**, NO leading `#`, NO quotes, NO spaces. The graph is colored by Auto Tag Graph Colors: `pillar/*` is the PRIMARY axis (exactly 1 per note) and `project/*` is the SECONDARY color/navigation axis.

## Namespaces

### `pillar/*` — MACRO-organização (EIXO PRIMÁRIO; exatamente 1 por nota)
`projetos` · `clientes` · `knowledge` · `system` · `pessoal` — exatamente um por nota (navegação primária do brain). `project/*` vira eixo SECUNDÁRIO.

### `kind/*` — o que a nota É
`project` · `entity` · `person` · `client` · `campaign` · `concept` · `decision` · `daily` · `weekly` · `log` · `resource` · `lesson` · `board` · `moc` · `tool` · `hub` · `journal`

### `area/*` — TÓPICO (cor secundária; primária é `pillar/*`)
`campaign` · `brand` · `video` · `ai` · `tech` · `security` · `method` · `personal`

### `project/*` — projeto específico (EIXO SECUNDÁRIO de cor + navegação)
`cliente-a` · `produto-x` · `cliente-c` · `marca` · `erm` · `omh` · `second-brain` · `[ferramenta]` · `cineweave` · `wod` · `career-ops` · `cliente-b` · `transversal` · `infraestrutura` (consolida config/tooling: resolve-mcp, projeto-x, ahk1, ace-step, metronome, sfx-studio, [ferramenta], docs)
> **`produto-x`** (novo 2026-09-12) = **PRODUTO X FC Manager**, produto de catálogo/workstation de vídeo. Separado de `cliente-a` no nível lógico (MOC, Context Pack, board e manifests OpenSpec próprios). Pasta: `XX-projetos/XX-catalog/`. Monorepo ainda compartilhado.
> Todo note tem EXATAMENTE 1 `project/*`. `transversal` = conhecimento compartilhado (conceitos/pessoas/entidades/decisões/daily/logs). `infraestrutura` = tooling/agent infra. `second-brain` = meta do próprio vault.

### `status/*` — status de kanban (colunas do board)
`backlog` · `todo` · `doing` · `blocked` · `review` · `done` · `archive`
> Legado mapeado: `active`→`doing`, `pending-human`→`blocked`, `archive`→`archive`, `draft`→`backlog`.

### `tool/*` (leve)
`obsidian` · `remotion` · `ae` · `[ferramenta]` · `premiere` · `supabase`

## Regras
1. Toda nota precisa de ≥1 `kind/*` e ≥1 `area/*` (ou `project/*`).
2. Toda nota precisa de EXATAMENTE 1 `project/*` (eixo secundário de cor + navegação). `transversal` = conhecimento compartilhado; `second-brain` = meta do vault.
3. `pillar/*` é EIXO PRIMÁRIO: exatamente 1 (`projetos`|`clientes`|`knowledge`|`system`|`pessoal`).
4. Sem aspas, sem espaços, sem `#` no frontmatter.
5. Tags planas de DOMÍNIO/governança mantidas de propósito (decisão 2026-08-31): `sdd` · `openspec` · `handoff` · `audit` · `hermes` · `campanha-y` · `registro1` — vocabulário de domínio com poucos usos, sem duplicata namespaced real. Não migrar; usar junto do namespace aplicável (`area/method`, `project/*`).
6. Placeholders proibidos (undecided stays empty): nunca `#misc`, `relacionado`, `geral`, `outros`; item sem tipo fica vazio (sem tag/categoria) até classificar.
7. `decided_by: human|agent|inferred` — three confidences, human wins: agente nunca sobrescreve silenciosamente decisão `human`; mudança exige supersede explícito.
8. Supersede, never overwrite: decisão superada recebe `superseded by [[Nome-da-Nota]]` + review datada (dizia / por que errado / o que mudou); nunca apagar/sobrescrever.

## Organização por Áreas Johnny.Decimal (modelo do brain)
Todo note tem EXATAMENTE 1 `pillar/*` (eixo primário) + exatamente 1 `project/*` (eixo secundário). A organização macro é por pastas de área JD no root: `XX-captura/` · `XX-clientes/` · `XX-projetos/` · `XX-conhecimento/` · `XX-pessoal/` · `XX-sistema/` · `XX-arquivo/`. Cada área tem um hub `AA.00-<area>-mapa.md` no root da área.

Hubs (navegação):
- `Mapa.md` (raiz) → índice mestre das 7 áreas
- `XX-captura/XX.00-captura-mapa.md` → inbox em processamento
- `XX-clientes/XX.00-clientes-mapa.md` → clientes, pessoas, entidades
- `XX-projetos/XX.00-projetos-mapa.md` → projetos e entregas
- `XX-conhecimento/XX.00-conhecimento-mapa.md` → conceitos, decisões, lições
- `XX-pessoal/XX.00-pessoal-mapa.md` → carreira, vida, journal registro
- `XX-sistema/XX.00-sistema-mapa.md` → método, skills, config, log
- `XX-arquivo/XX.00-arquivo-mapa.md` → material arquivado

MOCs de projeto ficam dentro da respectiva área (ex.: `XX-conhecimento/XX-video/XX.08-projeto-moc.md`).

Journaling (2 camadas): (1) usuário `XX-pessoal/XX-diarios/YYYY-MM-DD.md` (`pillar/pessoal`, `area/daily`); (2) agentes automático `system/journal/agent/{daily,weekly,monthly}/` (`pillar/system`, `area/log`).

## Mapeamento (legado → canônico)

| Legado | Canônico |
|--------|----------|
| cliente-a, projeto-x, campanha-y, roteiro, survey | `area/campaign` (+ `project/cliente-a`) |
| marca | `project/marca` |
| erm | `project/erm` |
| omh | `project/omh` |
| video, premiere, ae, after-effects, remotion, decupagem, animacao, i2v, cenas, filme, documentario | `area/video` |
| [ferramenta], wan22, elevenlabs, voz, image, 3d, workflow, pipeline, video-pipeline | `area/ai` |
| brand-system, design-dna, motion-identity, creative-dna, style-guide, lettering, marca | `area/brand` |
| security, pentest, credentials, senhas | `area/security` |
| obsidian, segundo-cerebro, second-brain, metodo, organizacao, sdd, openspec, handoff, audit, governance, context-pack, agent-playbook, skills, mattpocock, sync | `area/method` |
| google-drive, catalog, dashboard, supabase, electron, architecture, drive, inventario, local, local-mirror | `area/tech` |
| person, pessoas, equipe | `kind/person` |
| concept, conceito | `kind/concept` |
| decision | `kind/decision` |
| daily, registro1 | `kind/daily` |
| weekly-review | `kind/weekly` |
| log, sessao, session | `kind/log` |
| client | `kind/client` |
| lessons, armadilhas, erros, quality, evidence, review | `kind/lesson` |
| board, kanban | `kind/board` |
| template, templates, manual | `kind/resource` |
| entity | `kind/entity` |

## Convenção de nomes de arquivo (decisão 2026-08-31: duas trilhas, ambas válidas)
1. **Conteúdo do brain**: `kebab-case` numerado JD — `AA.CC-slug.md` (ex.: `11.20-video-08-combatividade.md`). Sem espaços, sem acentos.
2. **Convenções/config/boards** (`XX-sistema/`): `Title Case` com espaços — ex.: `Metodo de Trabalho.md`, `Project Board.md`, `Lessons Learned.md`. Wikilinks resolvem por basename; não renomear sem atualizar links.
Regra prática: nota nova de conteúdo segue (1); nota de convenção/board/template segue (2).

## Normalização aplicada pelo script
- Remove `#` inicial, remove aspas, espaços → `-`, lowercase.
- Corrige typos: `exemplo-a`→`exemplo-b`, `convençao`→`convencao`.
- Garante `kind/*` (derive de `type:` se faltar).

---

## Domain Tags (6º Domínio: Audio)

Tags planas sem namespace, usadas para classificar conteúdo por área de conhecimento (decisão 2026-09-17). Aparecem no frontmatter sem `#`, em lowercase kebab-case. `sounddesign` migra para o domínio Audio (era domínio compartilhado; agora eixo primário é audio).

### Audio (6º domínio — master: `audio`)
`audio` · `sfx` · `foley` · `dialogue` · `adr` · `music` · `score` · `trilha` · `ambience` · `mixagem` · `masterizacao` · `psicoacoustica` · `fieldrecording` · `sounddesign` · `tts` · `spatial` · `noise` · `reverb` · `eq` · `compression`

**Sub-grupos:**
- **Criação/Fonte:** `sfx` · `foley` · `dialogue` · `adr` · `fieldrecording` · `tts`
- **Design/Concepção:** `sounddesign` · `ambience` · `music` · `score` · `trilha`
- **Processamento:** `noise` · `reverb` · `eq` · `compression` · `mixagem` · `masterizacao`
- **Espacialização:** `spatial` (surround, Atmos, binaural, ambisonics)
- **Teoria/Percepção:** `psicoacoustica` (masking, HRTF, loudness)

## Source Tags (proveniência do conhecimento)
`source/book` · `source/podcast` · `source/course` · `source/paper` · `source/interview`

Uso: marcar notas de conhecimento (`kind/concept`, `kind/lesson`) com a fonte primária. Permite filtrar bibliografia e rastrear originadores.

## Knowledge Level Tags (profundidade do conteúdo)
`level/iniciante` · `level/intermediario` · `level/mestre`

Uso: classificar notas de conhecimento pelo nível de profundidade/abstração. `iniciante` = introdução/fundamentos; `intermediario` = aplicação contextualizada; `mestre` = avançado/especializado.

---

## Audio ↔ Existing Tags (Mapeamento de Conexões)

O 6º domínio (Audio) conecta-se aos domínios existentes nos seguintes pontos:

| Audio tag | Domínio existente | Conexão |
|-----------|-------------------|---------|
| `sounddesign` | `motion` | Design de som para motion graphics |
| `sounddesign` | `animacao` | Sonorização e spot sonoro de animações |
| `sounddesign` | `edicao` | Edição de áudio dentro da timeline |
| `sounddesign` | `cinema` | Paisagem sonora cinematográfica |
| `sfx` | `motion` | Efeitos sonoros para peças de motion |
| `sfx` | `animacao` | SFX library para animação |
| `foley` | `edicao` | Substituição/criação de som pós-produção |
| `foley` | `cinema` | Foley para cinema/documentário |
| `dialogue` | `edicao` | Edição, limpeza e sincronia de diálogo |
| `dialogue` | `direcao` | Direção de atores / ADR direction |
| `adr` | `edicao` | Automated Dialogue Replacement na timeline |
| `adr` | `direcao` | Sessões ADR com direção |
| `mixagem` | `edicao` | Mixagem de áudio na pós-produção |
| `mixagem` | `motion` | Mix final para entrega de motion |
| `masterizacao` | `edicao` | Master para entrega de projeto (broadcast/streaming) |
| `music` | `motion` | Trilha e scoring para motion graphics |
| `music` | `cinema` | Composição/trilha para cinema |
| `music` | `roteiro` | Conceito musical para narrativa |
| `score` | `cinema` | Scoring cinematográfico |
| `trilha` | `edicao` | Trilha sincronizada na timeline |
| `ambience` | `edicao` | Beds de ambiente na edição |
| `ambience` | `cinema` | Atmosfera sonora cinematográfica |
| `tts` | `motion` | Narração TTS em peças de motion |
| `tts` | `design` | Voz para protótipos/UI |
| `fieldrecording` | `edicao` | Gravação de campo para uso em edição |
| `fieldrecording` | `cinema` | Location sound para cinema |
| `noise` | `edicao` | Redução de ruído em material de edição |
| `psicoacoustica` | `design` | Princípios de percepção para UX de áudio |
| `spatial` | `cinema` | Mixagem espacial para cinema (Atmos/surround) |
| `reverb` | `edicao` | Reverb aplicado na edição/mixagem |
| `eq` | `edicao` | Equalização na edição de áudio |
| `compression` | `edicao` | Compressão/limitação na edição de áudio |

---

## Resumo de contagem

- **Domínios existentes (Vídeo/Audiovisual):** 9 tags (`cinema` · `direcao` · `fotografia` · `edicao` · `animacao` · `motion` · `design` · `roteiro` · `sounddesign`)
- **Novo domínio Audio:** 20 tags (19 novos + `sounddesign` já existente)
- **Source tags:** 5 tags
- **Level tags:** 3 tags
- **Total de tags adicionadas nesta revisão:** 27
