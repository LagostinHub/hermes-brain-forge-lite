---
name: screenplay-craft
description: Use quando escrever, estruturar ou auditar roteiro/narrativa — premissa, beat sheet, personagem, cenas, diálogo. Ponte entre os 15 decision cards do vault (57.20-roteiro-moc, R-01..R-15) e as skills de escrita, com gates de decisão por etapa.
---

# screenplay-craft — 15 cards de roteiro do vault → ferramentas de escrita

Skill-bridge: o **vault é a fonte de verdade teórica** (decision cards R-01..R-15), as **skills de escrita são a execução**. Nunca estruture "de cabeça" — consulte o card; nunca cite o card sem produzir o artefato de escrita correspondente.

- **MOC do domínio:** [[57.20-roteiro-moc]] (os 15 cards detalhados vivem NESSA nota, como seções `[R-01]`..`[R-15]` — não há notas separadas por card)
- **Hub de regras irmãs:** [[57.00-_index]] · cheat-sheet de regras: [[57.20-regras-de-roteiro]]
- **Skills de execução:** `writing-beats` (montar rascunho beat a beat) · `roteiro-decisions` (cheat-sheet rápido, em `~\AppData\Local\hermes\skills\writing\roteiro-decisions`)

## CONHECIMENTO (vault `50-sistema/57-conhecimento/57.20-roteiro-moc.md`)

Todos os cards são seções da mesma nota. Link direto: `[[57.20-roteiro-moc]]`; âncora por card: `[[57.20-roteiro-moc#[R-XX] ...]]`.

| Card | Título / Fonte | Essência | Quando usar |
|---|---|---|---|
| [R-01] | A Estrutura em 3 Atos (Field) | Setup 25% / Confrontação 50% / Resolução 25%. Marcos, não páginas fixas. | Estruturar qualquer narrativa; diagnosticar rascunho que "perde o fôlego". |
| [R-02] | Paradigma de Field: Plot Points (Field) | PP1 (fim Ato I), Midpoint (centro Ato II), PP2 (fim Ato II). Plot point = incidente que GIRA a história. | Prevenir/curar "sagging middle" (meio mole). |
| [R-03] | A Premissa (McKee) | "Quando [personagem] quer [objetivo], ele/ela [ação/consequência]." — 1 linha. DNA, não tema nem logline. | Primeiro documento de qualquer roteiro; filtro de cada cena. |
| [R-04] | A Cena é a Unidade Básica (McKee) | Toda cena: objetivo + conflito + virada (value change). Sem mudança de valor, a cena não funcionou. | Construir cena por cena; auditar cenas prontas. |
| [R-05] | O Inciting Incident (McKee) | Evento que perturba o equilíbrio (10–15% do texto) e lança o objetivo. Justifica toda a jornada. | Iniciar com impacto; testar se o início "empurra" o público. |
| [R-06] | Arco de Personagem (McKee) | Flaw + Need + Want + Arc (transformação interna). Arc importa mais que obter o Want. | Criar personagens que geram empatia; auditar apatia do público. |
| [R-07] | Estereótipo vs Arquétipo (McKee) | Arquétipo = função narrativa universal com execução específica; estereótipo = genérico repetitivo. | Criar personagens originais; diagnosticar "já vistos". |
| [R-08] | Jornada do Herói — 12 Estágios (Vogler/Campbell) | Mundo Comum → ... → Provação Suprema → Ressurreição → Retorno com Elixir. Mapa, não checklist. | Narrativas heroicas; verificar peso psicológico da jornada. |
| [R-09] | Os 7 Passos de Truby | Desejo → Necessidade → Fraqueza → Aliados/Opositores → Plano → Ataque → Auto-revelação. Transformação moral interna. | Histórias onde o interno importa mais que o externo; alternativa aos 3 atos. |
| [R-10] | Save the Cat! Beat Sheet (Snyder) | 15 beats com página-alvo para 110 páginas: Imagem Abertura → Catalisador → Break into Two → Midpoint → All Is Lost → Finale → Imagem Fechamento. | Montar beat sheet antes de escrever; diagnosticar rascunho travado. |
| [R-11] | Story vs Plot (McKee) | Story = tudo que acontece; Plot = seleção e ordem do que é mostrado. A ordem É o significado. | Decidir COMO contar: mistério, dramatic irony, revelação tardia. |
| [R-12] | Princípio do Antagonismo (McKee) | Antagonista ≥ herói em força, com motivação. Muitas vezes é o shadow do protagonista. | Criar tensão; diagnosticar história "sem tensão". |
| [R-13] | Subtexto (McKee) | O que o personagem NÃO diz importa mais. Ironia, evasão, silêncio, contradição fala×ação. | Diálogos realistas; cenas de tensão. |
| [R-14] | Exposição (McKee) | Informação via conflito — personagem descobre lutando, não ouvindo aula. Nunca parar a ação. | Dar informação sem entediar; auditar "cena de aula". |
| [R-15] | Crise, Clímax, Resolução (McKee) | Crise = escolha impossível; Clímax = ação decisiva; Resolução = novo equilíbrio. A crise revela o arco. | Construir finais que "ganham" a história. |

**Relações-chave** (detalhadas no MOC): R-01 vazio sem R-02 · R-03 define R-12 (conflito da premissa É o antagonismo) · R-05 empurra para o PP1 · R-06 se revela NA crise (R-15) · R-09 = R-06 expandido · R-10 = R-01+R-02 granularizados · R-13 é a virada de R-04 em diálogo · R-14 usa R-13.

## COMANDOS

Quatro artefatos. Cada um tem gates (cards obrigatórios) e formato de saída. Formato de duração: páginas de roteiro (1 pág ≈ 1 min) OU duração de vídeo curto — escalar proporções, manter percentuais.

### `structure` — beat sheet (pré-escrita)
**Gates:** R-03 (premissa) → R-01 (3 atos) → R-02 (plot points) → R-10 (15 beats). Opcional: R-08 (jornada) ou R-09 (Truby) se a história for de transformação interna/mitológica.
**Entrada obrigatória:** premissa em 1 linha no formato R-03. Sem premissa, NÃO gerar estrutura — pedir primeiro.
**Saída:** tabela `beat | % do total | página-alvo | evento | valor que vira`. Escalar as 15 beats de Snyder (base 110 págs) para o formato do projeto (ex.: 60 s → Catalisador ~6–7 s, Midpoint ~30 s). Verificar: todo beat muda a direção ou o valor; midpoint presente (não só PP1/PP2).

### `character` — character bible
**Gates:** R-06 (flaw/need/want/arc) → R-07 (arquétipo com execução específica) → R-12 (antagonista ≥ protagonista, motivação clara; shadow quando fizer sentido).
**Saída:** por personagem — `função arquetípica | flaw | need | want | arco (de X a Y) | como o arco se revela na crise (R-15)`. Antagonista inclui "o que ele quer e por que é forte". Teste de 1 linha do MOC: flaw, need, want e descoberta no clímax numa frase só.

### `scene` — scene cards (unidade de construção)
**Gates:** R-04 (objetivo + conflito + virada) → R-13 (subtexto: o que NÃO é dito) → R-14 (exposição vira conflito).
**Saída:** por cena — `objetivo do protagonista | oposição | virada de valor (+ → −) | subtexto | exposição necessária e COMO ela entra em conflito`. Cena sem virada = cortar ou fundir. Cena de transporte (A→B sem conflito) = cortar e juntar locais.

### `beat-sheet` — validação de estrutura (auditoria)
**Gates:** todos. Rodar sobre um beat sheet ou rascunho EXISTENTE.
**Saída:** checklist vermelho/verde — premissa clara? PP1/midpoint/PP2 presentes e são viradas (não só eventos)? Inciting incident em 10–15%? Sagging middle? Cada cena tem virada? Antagonista forte o bastante? Diálogo on the nose? Exposição em aula? Crise é escolha impossível (ambas as opções têm custo)? Resolução reflete o arco? Cada item vermelho cita o card R-XX e a correção.

## WORKFLOW: premissa → estrutura → cenas → validação

1. **PREMISSA** (R-03): 1 linha, "Quando X quer Y, Z". É o DNA — sem ela não há passo 2. Filtro permanente: cada cena posterior serve à premissa?
2. **PERSONAGEM** (R-06, R-07, R-12): character bible antes da estrutura — o arco define onde estão as viradas. A crise (R-15) já é esboçada aqui: qual escolha impossível revela a transformação?
3. **ESTRUTURA** (R-01, R-02, R-10; alt. R-08/R-09): `structure` → beat sheet completo. Escolher o mapa pela natureza da história: 3 atos + Snyder (padrão), Truby (transformação moral), Vogler (jornada heroica). Plot, não story (R-11): decidir a ORDEM de revelação.
4. **CENAS** (R-04, R-13, R-14): `scene` → scene cards beat a beat. Cada cena muda um valor; subtexto no diálogo; exposição sempre dentro de conflito.
5. **VALIDAÇÃO** (todos): `beat-sheet` → auditoria vermelho/verde. Corrigir e revalidar. Só então o roteiro está pronto para decupagem ([[57.21-cinematografia-moc]]) e edição ([[57.22-edição-moc]]).

**Encaminhamento para as skills de escrita:** com os scene cards prontos, a redação do rascunho corre por `writing-beats` (beat a beat, material bruto como pedreira — ver integração abaixo). Dúvida rápida de regra em qualquer etapa → `roteiro-decisions` (cheat-sheet) com o card detalhado no MOC como respaldo.

## INTEGRAÇÃO

- **`writing-beats`** (`~\.agents\skills\writing-beats`): executa a ESCRITA do rascunho. Os scene cards desta skill viram os beats; o fluxo choose-your-own-adventure (grounding de conceitos, 2–3 candidatos por passo) monta o texto final. Regra de mão: `screenplay-craft` decide O QUE cada beat faz (gate R-04); `writing-beats` decide COMO o texto flui entre eles. Material bruto insuficiente → `writing-fragments` (explore) antes de voltar aqui.
- **`roteiro-decisions`** (`~\AppData\Local\hermes\skills\writing\roteiro-decisions`): cheat-sheet de resposta rápida (3 atos, plot points, premissa, arco, subtexto, 12 estágios, Truby, Snyder + anti-patterns). Fonte canônica no vault: [[57.20-regras-de-roteiro]]. Esta skill NÃO duplica o cheat-sheet — para pergunta pontual ("qual página do PP2?") responda direto por ele; para trabalho de escrita completo, use o WORKFLOW aqui.
- **Domínios irmãos:** subtexto (R-13) é carregado pelo som → [[57.26-audio-moc]]; arco de personagem vira ângulo/encenação → [[57.21-cinematografia-moc]]; ritmo dos cortes (Murch) → [[57.22-edição-moc]]; story vs plot (R-11) fundamenta a montagem → [[57.23-montagem-moc]].
- **Pipeline de produção:** `film-decupage` consome o roteiro aprovado (decupagem por cena); `cine-studio-cinematic` e `ai-filmmaking-pipeline` operam a jusante.

## Notas

- Formatos: roteiro longo = 110 págs (base Snyder); vídeo curto/motion = escalar percentuais (R-01/R-02/R-10), nunca páginas fixas — Field e Snyder são mapas, não matemática.
- Exceções legítimas dos cards (não-linear, mosaico, anti-herói, comédia estática) estão no MOC — citar a exceção usada quando desviar.
- Se o pedido é só uma dúvida pontual de regra → `roteiro-decisions` direto. Se é escrever/estruturar/auditar → WORKFLOW completo desta skill. Answer the size of the question.
