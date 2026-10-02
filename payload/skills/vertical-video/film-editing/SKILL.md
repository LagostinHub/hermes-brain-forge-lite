---
name: film-editing
description: Use quando qualquer decisão de corte, ritmo, montagem ou tightening de timeline for necessária — onde cortar, pacing, justaposição de planos, limpar diálogo. Ponte entre os 22 decision cards do vault (57.22 edição + 57.23 montagem + 57.22 cheat-sheet) e as tools MCP davinci_resolve (tighten_dialogue, beat_grid, auto_edit, cut_by_transcript, assemble_edit).
---

# film-editing — Teoria de edição/montagem do vault → tools Resolve

Skill-bridge: o **vault é a fonte de verdade teórica** (decision cards Murch, Reisz & Millar, Eisenstein, Bordwell), as **tools MCP davinci_resolve são a execução**. Nunca decida corte "de cabeça" — consulte o card; nunca cite o card sem passar pelo gate de decisão antes de executar.

- **MOCs do domínio:** [[57.22-edição-moc]] (12 cards, Murch + Reisz/Millar) · [[57.23-montagem-moc]] (10 cards, Eisenstein + Bordwell)
- **Cheat-sheet de resposta rápida:** [[57.22-regras-de-edicao]] (20 regras condensadas — primeira parada durante workflow)
- **Hub de regras irmãs:** [[57.00-_index]] · **Cinema geral:** [[57.23-regras-de-cinema]]

## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)

### Cards de EDIÇÃO — [[57.22-edição-moc]] (Murch, *In the Blink of an Eye* + Reisz & Millar, *The Technique of Film Editing*)

| Card | Nome | Essência | Quando usar |
|---|---|---|---|
| E-01 | Regra dos 6 | Hierarquia: emoção 51% → história 23% → ritmo 10% → eye-trace 7% → planaridade 5% → espaço 3D 4%. Se emocionalmente certo, sacrifique os 4% de baixo sem culpa | Decidir onde/quando cortar — sempre |
| E-02 | Piscar como guia | O piscar é o "corte" natural da percepção; o ponto onde o personagem pisca indica o corte | Desempate quando a Regra dos 6 não resolve; close-ups |
| E-03 | Cut out the bad bits | Edição é SUBTRAÇÃO. "Isso serve a ESTA cena?" > "isso é bom?" | Revisar rough cut; escolher entre takes |
| E-04 | Shadow cuts | Anotar cortes considerados e desfez — o corpo rejeita antes da mente explicar | Testar alternativas; fine cut |
| E-05 | Regra do Beehive | Mover 2 frames confunde mais que mover 2 minutos. Mudança sutil = dissonância | Reorganizar timeline; ajuste fino de timing |
| E-06 | 24 decisões/segundo | Edição é psicológica > mecânica. Intuição treinada é confiável | Quando critérios da Regra dos 6 conflitam |
| E-07 | Ordem cria significado | A → B ≠ B → A. Justaposição cria associações que não existem no plano isolado | Montar qualquer sequência (= M-01) |
| E-08 | Matching cut | Ação contínua entre planos = corte invisível. Cortar NO meio do gesto, nunca entre ações | Fluidez clássica; depende da regra dos 180° ([[57.21-cinematografia-moc]] C-02) |
| E-09 | Ellipsis | Pular tempo: início → resultado, o meio é implícito. Exige âncoras (luz, roupa, lugar) | Acelerar narrativa sem confundir |
| E-10 | Ritmo interno | Cada cena tem pulso; pausas têm peso. Se parece errado, está errado | Decidir duração de cada plano |
| E-11 | Contraste de planos | Escala é pontuação (vírgulas/pontos): largo→fechado = ênfase. Mude 2 escalas ou 30° | Guiar atenção; criar impacto |
| E-12 | Montagem vs plano-longo | Controle total do tempo vs tempo real/imersão. Escolha filosófica | Decidir abordagem da cena/filme |

### Cards de MONTAGEM — [[57.23-montagem-moc]] (Eisenstein, Bordwell/Thompson, Bresson, Ruy Guerra, Zeca Ferreira)

| Card | Nome | Essência | Quando usar |
|---|---|---|---|
| M-01 | Montagem intelectual | Plano A + Plano B = Significado C (não existe em A nem B). Ex: osso→navio = 4M anos de evolução | Criar significado/tese por justaposição (= E-07) |
| M-02 | 4 tipos de montagem | Métrica (duração fixa) → rítmica (movimento) → tonal (emoção/luz) → overtonal (tudo junto) | Escolher/analisar o tipo de ritmo de uma sequência |
| M-03 | Decupagem | Quebrar a cena em planos ANTES de filmar: mestre/médio/close/insert. Pré-montagem no papel | Planejar cobertura (ver skill `film-decupage`) |
| M-04 | Forma e conteúdo | O COMO você conta é o que você conta. Forma ≠ embalagem | Análise estruturada; validar escolha formal |
| M-05 | Continuidade vs descontinuidade | Clássica (invisível, fluida) vs moderna (visível, jump cuts). Escolha estética, não erro | Definir estilo de edição do projeto |
| M-06 | Ofício do cinema | Técnica + arte + indústria — nenhum domina | Pensar o projeto como ofício |
| M-07 | Cinematógrafo (Bresson) | Cinema puro = imagem + som + tempo; não é teatro filmado | Buscar pureza; resistir ao registro |
| M-08 | Estilo segundo tecnologia | Nova tech muda a LINGUAGEM, não só a ferramenta | Escolher ferramentas com consciência do estilo |
| M-09 | Produção independente | Orçamento limita, não impede. Foco: roteiro forte + decupagem inteligente + equipe enxuta | Produzir com restrição |
| M-10 | Ficha técnica | A ficha é a "receita" — aprender por osmose | Analisar produção de referência |

### Cheat-sheet de workflow — [[57.22-regras-de-edicao]]

20 regras condensadas (Murch, Reisz/Millar, Arijon, Marcel Martin, Bordwell) para resposta rápida DURANTE a edição. Inclui as 2 regras extras que não são cards: **corte na ação, não entre ações** (§16) e **gramática do filme/Arijon** (§17: regra dos 180°, conectar planos, organizar material bruto). Consulte quando a decisão precisa ser rápida e o card detalhado é overkill.

**Relações-chave:** E-07 = M-01 (mesma lei) · E-10 ↔ M-02 (os 4 tipos são a teoria do ritmo interno) · M-05 ↔ E-08/E-12 (continuidade = matching cut; descontinuidade = quebra deliberada) · som antes do corte na emoção (Murch — ver [[57.26-audio-moc]]).

## COMANDOS

### `film-editing murch-rule6` — avaliar um corte pela hierarquia
**Gate:** [[57.22-edição-moc]] E-01 (+ E-02 piscar como desempate).
1. Descreva o corte candidato: plano A → plano B, ponto exato (timecode/frame), contexto emocional da cena.
2. Pontue em ordem: emoção (51) → história (23) → ritmo (10) → eye-trace (7) → planaridade (5) → espaço 3D (4).
3. Saída: critério que GOVERNA a decisão + o que está sendo sacrificado + veredito (corta / move N frames / descarta). Se empate emocional → aplicar E-02 (piscar) e E-06 (intuição) antes de racionalizar.
4. Registrar no log de shadow cuts (E-04) se o corte foi testado e descartado.

### `film-editing rhythm` — análise de ritmo/pacing
**Gate:** E-10 (ritmo interno) + M-02 (4 tipos) + [[57.22-regras-de-edicao]] §7, §14.
1. **Resolve ativo:** `beat_grid` no clipe/timeline → obter BPM e grid; `measure_loudness` se o pacing é guiado por áudio. Classificar cada trecho: métrica/rítmica/tonal/overtonal.
2. **Sem Resolve:** análise teórica — mapear duração de cada plano (shot list ou EDL), identificar o pulso (diálogo ≠ ação; pausas têm peso), marcar onde acelera/desacelera e se a mudança é a virada dramática.
3. Saída: mapa de pacing (tempo × intensidade) + tipo de montagem por trecho + alertas: compasso único (monotonia — contra-exemplo E-10), ritmo que contradiz a emoção da cena (contra-exemplo M-02), dissonância deliberada documentada (exceção E-10: *Dunkirk*).

### `film-editing montage` — justaposição Eisenstein
**Gate:** M-01 + E-07 (+ M-04 forma=conteúdo).
1. Liste os planos disponíveis (A, B, C…) — do media pool do Resolve ou descritos.
2. Para cada par: escrever o **Significado C** de A→B E de B→A. Se C é igual nos dois sentidos, os planos não têm tensão conceitual (contra-exemplo M-01: justaposição sem carga).
3. Testar Kuleshov: o que o público vai "ler" no rosto/objeto dado o vizinho?
4. Saída: ordem recomendada + o C que cada ordem produz + âncoras de elipse (E-09) se houver salto de tempo.

### `film-editing tighten` — limpar diálogo/talking head no Resolve
**Gate:** E-03 (cut out the bad bits — subtração) aplicado por `tighten_dialogue`.
1. **Pré-requisito:** timeline Resolve ativa com clipe de diálogo carregado.
2. Rota MCP: `tighten_dialogue` (remoção de pausas/fillers/vacilos) — parâmetros típicos: filler words pt-BR `["um", "uh", "ah", "é", "aí", "né", "tipo", "então"]`, threshold de pausa ~2–3 s.
3. Alternativas MCP: `auto_edit` (corte automático orientado a roteiro/transcrição), `cut_by_transcript` (cortar por trechos transcritos — requer `transcribe_media` antes).
4. **Pós-gate obrigatório (E-03 exceção):** revisar o que a tool removeu — pausa tecnicamente "ruim" que serve à emoção (hesitação, respiro antes da virada) DEVE ser restaurada. Ritmo de diálogo é E-10, não metronomo.
5. Se a tool MCP não estiver disponível → fallback manual: revisar take por take com [[57.22-regras-de-edicao]] §4.

## ROUTING

**Detectar contexto primeiro:** `resolve_project_summary` / `resolve_timelines` respondem? → Resolve ativo. Erro/timeout → modo teórico.

| Situação | Rota |
|---|---|
| Timeline Resolve ativa + corte/limpeza a executar | MCP: `tighten_dialogue`, `auto_edit`, `cut_by_transcript`, `resolve_edit`, `assemble_edit` (montagem por script), `resolve_append_to_timeline`, `resolve_add_markers` (marcar shadow cuts E-04 no próprio timeline) |
| Ritmo/pacing com música ou clipe no Resolve | MCP: `beat_grid` (+ `measure_loudness`) → depois `resolve_add_markers` nos beats |
| Encontrar momento/footage para um corte | MCP: `find_in_footage`, `resolve_media`, `transcribe_media` |
| Revisar resultado do corte | MCP: `resolve_review`, `resolve_timelines` (contagem/duração) |
| Sem Resolve / análise de filme alheio / planejamento | Teoria pura: cards [[57.22-edição-moc]] + [[57.23-montagem-moc]] + [[57.22-regras-de-edicao]]; saída é parecer de decisão, não execução |
| Decupagem/pré-produção (antes de filmar) | Skill `film-decupage` (M-03) — esta skill assume material já existente |
| Áudio/som da edição | Skill `audio-sound-design` (Murch: decisão de som vem antes do corte em muitos casos) |

**Pitfalls MCP (da skill `davinci-resolve-timeline-editing`):** confirm tokens expiram em ~300 s e são por instância — buscar token fresco SEQUENCIALMENTE antes de cada `apply`/operação destrutiva; cortes são destrutivos no timeline → duplicar timeline ou gerar `generate_edl` antes de batch cuts.

## WORKFLOW: análise ritmo → cortes → validação

### 1. ANÁLISE DE RITMO (antes de qualquer corte)
- Rodar `film-editing rhythm` no material (beat_grid se Resolve; shot durations se manual).
- Identificar o pulso de cada cena (E-10) e o tipo de montagem vigente (M-02).
- Definir a INTENÇÃO: onde o ritmo deve acelerar/desacelerar e qual a virada emocional. Sem intenção declarada, não cortar.

### 2. CORTES (execução com gate por corte)
- Para cada corte candidato: `film-editing murch-rule6` — a hierarquia decide; piscar (E-02) desempata.
- Diálogo/talking head: `film-editing tighten` (rota MCP tighten_dialogue) com revisão emocional pós-gate.
- Sequências justapostas/montagem: `film-editing montage` para fixar ordem e Significado C antes de montar.
- Continuidade: cortar NA ação, nunca entre ações (E-08, §16 do 57.22); validar 180° e escala (2 escalas ou 30°, E-11).
- Reorganização grande de cenas: ok (E-05 beehive) — mas reavaliar a cena inteira, nunca "só 3 frames" sem reavaliar.
- Marcar shadow cuts (E-04) com `resolve_add_markers` ou em log: todo corte testado-e-desfeito é dado.

### 3. VALIDAÇÃO
- **Métrica:** `resolve_review` / `resolve_timelines` — durações por plano batem com o mapa de pacing do passo 1? Mudança de ritmo acontece ONDE a intenção declarou?
- **Emocional:** reassistir o trecho; se o corte "tecnicamente certo" sente atrasado, perdeu o piscar (E-02). Confia no corpo, registra o porquê depois (E-06) — mas iniciante justifica cada corte verbalmente (exceção E-06).
- **Subtração:** aplicar E-03 no resultado — remover mais 10–20% e comparar. Se nada sobra para remover sem perder estrutura, o cut está pronto.
- **Antes de destrutivo:** `generate_edl` como snapshot; picture lock só após este passo (skill irmã `audio-sound-design` exige lock antes do mix).

## Notas

- Skills-bridge irmãs: `audio-sound-design` (som), `cine-studio-cinematic`, `davinci-resolve-timeline-editing` (detalhes operacionais MCP), `film-decupage` (pré-produção), `resolve-audio-sync`.
- MOCs integrados no vault: ritmo da cena vem do roteiro ([[57.20-roteiro-moc]] R-04), cobertura disponível vem da cinematografia ([[57.21-cinematografia-moc]]), emoção vem do som primeiro ([[57.26-audio-moc]]).
- Se o pedido é "corta os silêncios desse clipe" sem questão narrativa → direto ao ROUTING (tighten), pule análise. Answer the size of the question.
