---
name: film-decupage
description: >-
  UNIFIED skill de decupagem técnica + direção cinematográfica para TODO cliente
  de vídeo ([MARCA] é só um). Combina o melhor de 4 skills originais:
  (1) shot list consistente com Visual Theme (ai-video-storyboard),
  (2) diretor + previs supervisor 13-passos com director lens + QC (cinematic-director),
  (3) decupagem híbrida cena-a-cena/take-a-take (film-decupage),
  (4) linguagem de câmera pra brand/product (video-shotcraft).
  Use para: decupagem, shot list, take sheet, breakdown de cenas, director's book,
  blocking, keyframes, motion prompts, sound plan, edit timeline, continuity bible, QC.
  Multi-cliente: carrega wiki/clients/<cliente>/design-dna.json + motion-identity.json.
  Pair com design-dna (tokens) e lottie-motion (motion gate). Produz DECUPEGEM.md.
license: MIT
---


## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)

| Pilar | MOC | Quando consultar |
|---|---|---|
| **Cinema Theory (mestre)** | [[57.00-cinema-theory-moc]] | Visão geral + ordem de leitura dos 7 pilares |
| **Roteiro** | [[57.20-roteiro-moc]] | Estrutura de cena, beats, subtexto |
| **Cinematografia** | [[57.21-cinematografia-moc]] | 5 C's, enquadramento, luz, decupagem técnica |
| **Edição** | [[57.22-edição-moc]] | Continuidade, matching cut, ritmo |
| **Montagem** | [[57.23-montagem-moc]] | Decupagem, montagem intelectual, Eisenstein |
| **Design** | [[57.25-design-moc]] | Hierarquia visual, composição de quadro |

> Regra: nunca decida "de cabeça" — consulte o card do pilar; nunca cite o card sem executar pela tool certa.

# film-decupage — Decupagem + Direção Cinematográfica UNIFICADA

> **Fonte canônica (edição):** [[37-regras-e-decisoes/57.22-regras-de-edicao]]
> **Fonte canônica (cinema):** [[37-regras-e-decisoes/57.23-regras-de-cinema]]

Skill único de pré-produção de vídeo para **qualquer cliente** ([MARCA] é só um dentre vários).
Substitui 4 skills que viraram redundantes: `ai-video-storyboard`, `director-skill`
(cinematic-director), `film-decupage` (antigo), `video-shotcraft`.

**Todo o conteúdo pesado das 4 skills originais está preservado em `references/` e `assets/`**
(38 arquivos, 22 director styles, exemplos). Leia o arquivo certo sob demanda — NÃO invente comandos.

## Roteamento por Cliente (MULTI-CLIENTE)

Antes de qualquer decupagem, identifique o cliente e carregue:
1. `wiki/clients/<cliente>/design-dna.json` → tokens (palette, lens, lighting, film look)
2. `wiki/clients/<cliente>/motion-identity.json` → 3 constantes de motion (lottie-motion)
3. Se não existir → `design-dna` (analyze referências) + `lottie-motion` (arquétipo)

Cliente ativo padrão: **[MARCA]** (Cine Studio). O skill é client-agnostic — sempre puxe do JSON.

## Operating stance

Aja como **diretor + previs supervisor**, não crítico nem decorador de prompt. O job é
transformar script/brief/deck num plano executável — com crew ou com fila de geração.

**Inimigo:** adjective soup. `cinematic, dramatic, masterpiece, 8K` não diz onde a câmera
está, o que o corpo faz, onde a ação termina. Substitua por descrição física observável.

## Hard rules (não negociáveis)

1. **Story function first** — shot sem função é deletado, não melhorado.
2. **Blocking before framing** — decida o que os corpos fazem no espaço, depois posicione a câmera.
3. **One dominant camera move per clip** (ou deliberate none).
4. **Every action has an end state** — "ele vira" não é shot; "ele vira até o perfil encostar na janela, então para" é.
5. **Behavior, not emotion** — nunca "ele está com medo"; mostre o que o medo faz no corpo.
6. **Continuity is engineered** — nomeie os invariants (identidade, wardrobe, luz, era) e repita-os
   verbatim em todo prompt da cena.
7. **Keyframe is the control point** — o modelo de vídeo re-anima o que o still já decidiu. Conserte o
   still antes de gastar geração.
8. **Match the tool's control surface** — não peça ao modelo um recurso que ele não expõe.
9. **Negatives são targeted** — nomeie instâncias ("no plastic, no wristwatch"), não categorias.
10. **One style lens at a time** — misturar 2 diretores = incoerência.
11. **Answer the size of the question** — não expanda um pedido pequeno num pacote de produção.
12. **O dispositivo de leitura decide o formato do entregável** — cliente que lê no celular ⇒ documento
    vertical, um card por beat, tipo grande (PNG por bloco + PDF 9:16). A4 de 4 colunas é arquivo, não entrega.
13. **Meça, não estime** — pace de locução (palavras ÷ segundos por beat), segundos somando à duração alvo,
    e data de toda referência temporal conferida contra hoje. Números se calculam com ferramenta.

## Pipeline (13 passos — rode só os que o pedido precisa)

| # | Passo | Modo | Carrega se for fundo |
|---|---|---|---|
| 1 | Intake & scope | A | — |
| 2 | Script & subtext breakdown | A | — |
| 3 | Beat map | B | `assets/beat-sheet-template.md` |
| 4 | Style lens (opcional) | — | `references/director_styles/NN_<slug>.md` (1 só) |
| 5 | Director's book / visual treatment | C | `assets/director-book-template.md`, `references/lighting-and-color.md`, `references/genre-playbooks.md` |
| 6 | Blocking & staging | — | `references/blocking-and-staging.md` |
| 7 | Shot list & coverage | D | `assets/shot-plan-template.md`, `references/cinematic-language.md` |
| 8 | Keyframe strategy | E | `assets/keyframe-prompt-template.md`, `references/image-model-adapters.md` |
| 9 | Tool adapter selection | — | `references/ai-video-tool-adapters.md` / `image-model-adapters.md` |
| 10 | AI video prompt construction | F | `assets/video-prompt-template.md`, `references/prompt-lexicon.md` |
| 11 | Sound & dialogue plan | H | `assets/sound-plan-template.md`, `references/sound-and-dialogue.md` |
| 12 | Edit & assembly plan | I | `assets/edit-timeline-template.md`, `references/editing-and-assembly.md` |
| 13 | QC & repair loop | J | `assets/qc-checklist.md`, `references/failure-modes.md` |

**G (continuity bible)** roda embaixo quando >2 shots compartilham invariants.
Passo completo (A–J) só em "direct this / everything I need". Não pule 4 e 9 (mais esquecidos).

## Output structure (DECUPEGEM.md — formato híbrido aceito)

1. **VISUAL THEME** — palette por ato, lighting, lens character, film look, motion language,
   INVARIANTS (ex: "creme é evento, proibido no Ato I"; "objeto anônimo até a virada"). Todo shot obedece.
2. **Per-block table** — 1 linha por shot/take:
   | # | Shot | Size/Lens | Angle | Camera move | Blocking (start→end) | Light | Continuity |
   | Transition | Risk | Source |
   Source ∈ {STOCK, IA still, REMOTION, GRAPHIC}. Risk = falha específica que o shot convida.
3. **Lettering** (se houver) — ID, frase, in/out TC, estilo, safe area.
4. **Resumo de fontes** — counts por source type + hard blockers (ex: "revista real", "VO completo").

## Cinematography vocabulary (use sempre)

- **Shot sizes:** ECU, CU, MCU, MS, WS, EWS, OTS, POV, insert, detail.
- **Angles:** low, high, eye-level, dutch, bird's-eye, worm's-eye.
- **Camera moves:** dolly in/out, push-in, pull-back, tracking, pan, tilt, crane, handheld, locked-off, orbit, rack focus, zoom-to-cursor.
- **Lighting:** golden hour, rim light, motivated, practical, low-key, high-key, soft box, silhouette.
- **Film look:** clean digital, 16mm grain, 35mm, anamorphic, VHS, halation.
- **Motion language:** handheld respiration, locked-off micro-push, speed ramp, dolly slow, orbit 20°, gimbal smooth.

## Quick-reference map (arquivos em `references/` / `assets/`)

| Need | Read |
|---|---|
| Shot list consistente (Visual Theme) | `references/video-shotcraft.md`, `references/lighting-and-color.md`, `references/genre-playbooks.md`, `references/cinematic-language.md`, `examples/` |
| Director's book / visual treatment | `assets/director-book-template.md`, `references/lighting-and-color.md`, `references/genre-playbooks.md` |
| Shot plan / coverage | `assets/shot-plan-template.md`, `references/cinematic-language.md`, `references/blocking-and-staging.md` |
| Keyframe / storyboard prompts | `assets/keyframe-prompt-template.md`, `references/image-model-adapters.md` |
| Video motion prompts | `assets/video-prompt-template.md`, `references/prompt-lexicon.md`, `references/ai-video-tool-adapters.md` |
| Director lens (Spielberg, Nolan, etc) | `references/director_styles/NN_<slug>.md` (22 disponíveis) |
| Sound / dialogue | `assets/sound-plan-template.md`, `references/sound-and-dialogue.md` |
| Edit & assembly | `assets/edit-timeline-template.md`, `references/editing-and-assembly.md` |
| Continuity bible | `references/continuity-bible.md` |
| QC & repair (F1–F19) | `assets/qc-checklist.md`, `references/failure-modes.md` |
| Shot-craft de produto/marca | `references/video-shotcraft.md` |
| Deck → decupagem ([MARCA] pattern) | `references/deck-extract.md` |
| Exemplo canônico ([MARCA] Manifesto) | `references/[marca]-example.md` |
| Political content selection strategy | `references/political-content-selection-strategy.md` |
| **Peça curta de campanha (≤2min): beats, pace, date-anchor, enquadramento sem ataque** | `references/short-form-campaign-video.md` |
| **Documento de aprovação do cliente (phone-first, vertical)** | `templates/roteiro-aprovacao-mobile.html` |
| **Renderizar doc → PNG por bloco + PDF 9:16 (conferência de páginas)** | `scripts/render_doc.py` |
| **Paginação de doc phone-first (métrica de tinta real + regras de quebra)** | `references/phone-deck-pagination.md` |
| **Inventariar acervo de footage em drive na nuvem** | `references/footage-acervo-inventory.md` |

## Pipeline decision (scope)

- **Social cut / single ask** → `ai-video-storyboard` structure only (Visual Theme + per-shot block).
- **Peça curta de campanha/política (≤2 min, reels)** → `references/short-form-campaign-video.md`
  (beat sheet por bloco, pace medido, data conferida, enquadramento sem ataque) + entregável de
  aprovação phone-first com `templates/roteiro-aprovacao-mobile.html` e `scripts/render_doc.py`.
- **Full manifesto / multi-scene** → run `director-skill` modes A–J, fold into hybrid table.
- **Brand/product demo** → `references/video-shotcraft.md` (camera language) + hybrid table.
- **Stock terms** vêm do creative deck do cliente (não inventar).
- **IA stills** = `image_generate` (FLUX local) p/ hero frames estáticos; motion = stock ou Plano B (film physical).

## Notes

- Artefatos populados (`DECUPEGEM.md`) ficam NO projeto do cliente; skill fica neutro p/ reuso.
- Quando um projeto precisar de capability não coberta (avatar, ComfyUI gen, etc), garimpar
  `[BIBLIOTECA]\[biblioteca AGPLv3]` primeiro (biblioteca local, ver README da skill) antes de web-search.
- **Layout gate:** se for animar no [MARCA] (Remotion), o layout da tela passa pelo `design` skill ANTES.
  `design` owna layout; `[marca]` owna motion. `film-decupage` owna a DECUPAGEM.

## Multi-cliente: APP vs FILME (padrão [MARCA])

Um mesmo cliente pode ter identidades VISUAIS DISTINTAS por tipo de entrega. NÃO misturar:
- `wiki/clients/[MARCA]/` → identidade do **produto/app** ([MARCA] Cine Studio: [marca]Gold #DAA317, MILA, câmera robótica, mobile).
- `wiki/clients/[MARCA]_MANIFESTO/` → identidade do **filme** (Manifesto Launch: preto #09090B, verde #173C2D/#598B74, creme #EBE5D9 evento, roxo #7B62AA; paleta DO DECK, travada).

Regra: se o briefing vem de um Creative Direction Deck com paleta/copy TRAVADA, crie um cliente
separado (`<CLIENTE>_<PROJETO>/`) em vez de sobrescrever o `design-dna.json` do app. O filme tem
invariantes que o app não tem (ex: "creme é evento, proibido no Ato I"; "objeto anônimo até a virada").

PITFALL (corrigido pelo usuário 2026-08-08): skills de motion/brand são GLOBAIS e NEUTRAS — servem
para QUALQUER cliente, não só pro [MARCA]. Nunca trave "[MARCA]" no nome/descrição de um skill genérico.
[MARCA] é apenas um cliente de vídeo entre vários. Ao instalar um skill útil (design-dna, lottie-motion,
film-decupage), remova viés de cliente do frontmatter e deixe o JSON de identidade no `wiki/clients/`.

**PITFALL (aprendido 2026-08-11):** ao escrever qualquer componente de motion/lettering, SEMPRE carregue ANTES:
1. `design` skill (LAYOUT GATE — anti-slop, safe-area 12%, depth/atmosphere)
2. `lottie-motion` SKILL.md (3 layers, never opacity-only, never linear spatial, 1/3 rule)
3. `wiki/clients/<cliente>/motion-identity.json` + `design-dna.json`
Cite estes 3 no header do componente. Saltar o gate → output sem profundidade, fundo sólido, ou lettering sem micro-move. O agente tentou pular e foi corrigido: "ta horrivel... fundos... gradiente... nao ficar solido... profundade... 3d". Depth + atmosphere são REQUIRED, não optional.

**PITFALL (aprendido 2026-08-11):** `staticFile` serves from `public/`, não de `src/`. Assets do cliente SEMPRE em `public/<cliente>/` (ex: `public/manifesto/`, `public/[cliente]/`). Assets em `src/assets/` → silent render crash ("Node.js v24.18.0" at "Getting composition").

**PITFALL (aprendido 2026-08-11):** Fontes no Remotion — escrever `fontFamily: 'Space Grotesk'` NÃO carrega a fonte. Requer `@font-face` registration + `await document.fonts.ready` + `delayRender`/`continueRender`. Sem isso → fallback silencioso pro Arial. Pattern: (1) TTF em `public/fonts/`, (2) `@font-face` com `font-display:block`, (3) `useBrandFonts()` hook, (4) `document.fonts.ready`. ALWAYS verify o still render mostra a fonte certa.

**PITFALL (corrigido 2026-08-08):** ao decupar a partir de um Creative Direction Deck, **leia o deck VERBATIM
antes de escrever a DECUPEGEM** e cruze contra ela. Nesta sessão, a 1ª DECUPEGEM teve 14 imprecisões que só
apareceram ao ler o PDF extraído linha a linha (928 linhas): L1 entra em 00:32 (não "00:32"); L2 em 01:00,5
(não 01:01); L3 em 01:14 (não 01:14 solto); B04 tem speed ramp no fim; B05 tem blur vertical de scroll 8f;
B12 é "movimento contínuo de 7s" (não 7s solto); B13 órbita 20° + "física real · curvatura · micro bounce";
B14 pull back 4% + fechamento 1,2s + "percussão sai da trilha"; B16 logo 01:47 / claim 01:48,5 / fade 24-36f.
Como extrair: `pdftotext -layout -enc UTF-8 deck.pdf deck_clean.txt` (o deck.txt original veio em latin-1 e
quebrava UTF-8 — converter com `codecs.open(...,'latin-1').read()` → escrever utf-8). Sempre confirmar
timecodes de lettering e FX de saída contra o deck; a DECUPEGEM deve ser idêntica ao deck, não um resumo.

## Pipeline de produção ([MARCA] Manifesto — referência)

- Animações (cena hero B12–B14, letterings L1–L5, end card B16) = **Remotion** (React), renderizadas em
  **ProRes4444+alpha** → importadas no **DaVinci Resolve** (NLE/cor/export 4K).
- Remotion roda no **Node 24** desta máquina (node_modules rebuildado). CLI:
  `node node_modules/@remotion/cli/remotion-cli.js still <entry> <compId> out.png --frame=0`
- [biblioteca AGPLv3] (`[BIBLIOTECA]\[biblioteca AGPLv3]`) é **biblioteca de referência**, não instalado no Hermes.
  Garimpar skills específicos sob demanda (ver README desta skill). IGNORAR skills de API
  paga (setup é 100% local/OSS).

## Animatic v01 (pré-montagem) — o edit de referência

Quando falta material definitivo, a peça se monta como **animatic**: tudo provisório onde não há
footage, **real onde já existe**. O cliente aprova o CORTE, e o animatic vira a referência de gravação.

**Pipeline (Remotion):**

1. Roteiro → `src/<peca>Data.ts`: por beat, `tcIn/tcOut` + `frameIn/frameOut` (extraídos do roteiro,
   nunca inventados), off, tela, imagem, motion, som + um bloco `NUM` com todo número e sua FONTE.
2. `src/mediaMap.ts`: por beat, tipo `footage | print | grafismo` + caminho esperado em `public/<peca>/`.
3. Comp 1080×1920 @30fps, `durationInFrames = segundos × 30` (120s = 3600).
4. Render MP4 H.264 pra aprovação (ProRes4444 preparado pro NLE depois).

**Regras que evitam retrabalho:**

- **Asset ausente = cartela-placeholder DESENHADA** com o rótulo do que vai ali
  (`PRINT: Lei 15.508/2019, art. 26 §3º`). Nunca tela vazia, nunca crash por arquivo faltando.
- **Troca 1:1:** soltar o arquivo real com o nome certo no `public/<peca>/` → o corte não muda.
  É isso que permite gravar/editar contra a referência.
- Estagie a spec DENTRO do repo (`spec/<peca>/`) — o executor não lê fora do workdir.
- **Dispatch longo em background: redirecione pra arquivo de log, NUNCA `| tail`.** O pipe segura a
  saída até o processo terminar, então `process(log)` fica vazio a execução inteira e você não
  distingue "trabalhando" de "travado". Acompanhe por `tail <log>` + listando os arquivos que o
  executor vai criando no repo (`ls src/ | grep -i <novos>`).
- Placeholder desenhado > asset inventado. E **zero asset de IA** em peça de campanha (compliance).

**Verificação do render (obrigatória — não aceite auto-relato):**

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames,duration -of default=noprint_wrappers=1 out/<peca>.mp4
# contact sheet dos beats (1 frame por beat) e OLHAR:
ffmpeg -y -i out/<peca>.mp4 -vf "select='eq(n,90)+eq(n,480)+eq(n,840)+eq(n,1560)',scale=310:-1,tile=4x2" -frames:v 1 out/<peca>-sheet.png
```

Checar no sheet: **fundo chapado** (reprova — exige gradiente + vinheta + atmosfera + parallax em TODO
beat), **área segura** (margem mínima 5% ≈ 54px nas laterais em 1080×1920; nada cortado na borda),
**hierarquia** (o número principal do beat ≥50% da largura), e todo número com fonte visível.

**O executor pode não enxergar imagem** (modelo sem input visual confere layout por geometria/cálculo —
ele mesmo avisa "não consigo ver imagem, validei por cálculo"). A validação visual é **SEMPRE do
orquestrador**: extraia os frames **com o seu próprio comando** (não confie no sheet que o executor diz
ter gerado), olhe quadro a quadro e reporte cada defeito **com o número do frame** no handoff de volta.
Auto-relato de arte aprovada sem prova visual = reprovado.

**Rodadas de correção:** quando reprovar, o handoff de volta lista os defeitos **numerados, com
evidência de frame**, e critérios de aceitação **mensuráveis** ("4000" inteiro na área segura; margem de
5%; contador ≥50% da largura) — e **exige um artefato de verificação de volta** (contact sheet).
Sem isso o executor entrega a mesma arte defeituosa com outro nome.

## Catálogo de referência
- `README.md` — índice do que garimpar na biblioteca local (e o que ignorar).