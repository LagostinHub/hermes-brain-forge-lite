# Short-form campaign video — beats, pace, framing, client approval doc

Caso validado: peça de 2 min para cliente político ([CLIENTE-B] 2026). Corte de 12/09/2026.
Ordem de trabalho que funcionou:

`writing-beats` (grounded concepts) → beat sheet (step 3) → **roteiro literário** (off + tela + motion + som por beat)
→ **documento de aprovação para o cliente** (celular) → decupagem (step 7) → captura → motion.

---

## 1. Beat sheet de peça curta (2 min / reels)

- **>60s nunca é uma tabela só.** Quebre em 3–4 blocos de 20–45s e faça o beat sheet por bloco.
- Cada beat: função narrativa, `estado entra ≠ estado sai`, `Δ` **com agente nomeado** (um número,
  um documento, uma decisão judicial), o que muda na tela, família de plano, segundos.
- A curva de tensão tem que ser **aritmética** e o **maior salto** tem que cair em **≥60% do tempo**.
  Exemplo real (2min): `1→2→4→5→6→7→5→9→10→5→7→8` (+1,+2,+1,+1,+1,−2,**+4**,+1,−5,+2,+1).
  O +4 é a virada (o arquivamento), fechando em 1:20 = 67%; os beats −2 e −5 são **alívio** que faz o pico cair.
- Depois do pico a peça **converte**, não escala: alívio para o espectador, curva da causa sempre subindo.

## 2. Pace de locução (medir, nunca "no ouvido")

- Conte palavras por beat e calcule `palavras ÷ segundos`. Alvo em PT-BR de campanha: **2,2–2,6 pal/s**.
  Beat acima de 2,8 pal/s **corta**, não acelera a leitura.
- Total: `palavras ÷ 2,5` = segundos de fala. Numa peça de 120s deixe **≥12s de ar** (silêncios, bips, pausas).
- Quando você **adiciona uma abertura**, financie os segundos extras nos beats que estão a ≤1,9 pal/s
  (beats lentos, de gravidade) — assim a duração total segue exata e ninguém perde conteúdo.
- Rode o cálculo com uma ferramenta (4 linhas de Python), não de cabeça.

## 3. Date anchoring (bug pego em revisão)

**Toda referência temporal do texto tem que ser conferida contra a data de hoje.** Falha real: o off dizia
"só no ano passado, mais de 22 milhões" para o dado de **2024** — em set/2026, "ano passado" é 2025.
Fix: nomeie o ano ("em 2024") e, se existir dado oficial parcial do ano corrente, coloque **na tela**
(não gaste off com ele) para provar que continua acontecendo.

## 4. Enquadramento de campanha sem atacar (TSE)

- **Vilão = o mecanismo/regra · protagonista = o cidadão · validador = a instituição** (OAB, MP, Procon,
  um tribunal) · prova = o número **com a fonte na tela**.
- **Nunca nomeie pessoa com candidatura pendente** — e cheque também o autor histórico da regra
  contestada (pode estar concorrendo). Mapa de risco: cruze o registro de votos/decisão com a lista de
  candidaturas do ano. Regras do ciclo (calendário, IA/rótulo, deepfake) pesquisadas em `political-intel-research`.
- Vocabulário: "confisco" **atribuído a uma decisão judicial**, não "roubo"; crítica a política pública é
  lícita, ofensa à honra não. Nenhuma acusação, nenhum deboche, nenhuma edição de imagem/voz de pessoa real.
- **Abertura que funciona: pergunta → gesto silencioso → o número como RESPOSTA.** Emendar duas aberturas
  perde as duas (a pergunta perde a pausa, o número perde a primazia).
- Sem asset de IA ⇒ sem rótulo de IA (o rótulo só é exigido para conteúdo feito com IA; deepfake é vedado).

## 5. Documento de aprovação do cliente — **phone-first**

> Correção do usuário (12/09/2026): *"tem que ficar bom para ler no celular..."* — o A4 de 4 colunas
> **não** é entregável para cliente que lê no telefone. O dispositivo de leitura decide o layout.

- Entregue: **1 PNG por bloco** (vertical, escala 2×) + **PDF paginado em 9:16** (um beat por página) +
  o HTML editável. Mantenha um A4 de 4 colunas só como versão de arquivo/impressão.
- Estrutura por beat: card com chip de TC + linhas etiquetadas `TEXTO / IMAGEM / MOTION / SOM`
  (texto 14px, os outros três 13.5px) — rótulo colorido dá a hierarquia sem precisar de grade.
- Cabeçalho declara o combinado (narração em off, quando o cliente aparece, nenhum nome/rosto,
  todo número com fonte) + CNPJ. Rodapé repetido no último bloco.
- **Enxugar as células é o que faz caber.** Texto verboso em `imagem/motion/som` é o que estoura a página;
  o cliente pediu "o mínimo de informação" sobre imagem e animação.
- Template pronto: `templates/roteiro-aprovacao-mobile.html` · renderizador: seu script de render.
- **Nunca entregue render não conferido**: screenshot + `vision_analyze` antes de mandar para o cliente.

## 6. Pitfalls de render (HTML → PNG/PDF)

- **`@page{size:…;margin:0}` tem que ficar no TOPO da folha de estilo**, não dentro de `@media print`
  (dentro do media query o Chromium ignora a margem). Mesmo assim o `--print-to-pdf` aplica margem:
  não brigue para enfiar um documento desenhado para celular numa única folha A4 — **projete para o aparelho**.
- Documento mais alto que uma página: **página em formato do aparelho** (`@page{size:114mm 203mm}` ≈ 9:16)
  + `break-inside:avoid` nos cards ⇒ cada página é uma tela e nenhum card parte no meio.
- Windows + git-bash: **caminho estilo MSYS entregue ao Python nativo não existe**.
  `os.path.exists("/c/Program Files/...")` → `False` silencioso; use `"C:/Program Files/..."`.
- Conferir contagem de páginas / conteúdo por página: `python -m pip install pypdf` → `len(PdfReader(p).pages)`
  e `pages[i].extract_text()`. Uma página 2 só com o rodapé é defeito de verdade, não detalhe.
- Fonte da marca: embutir TTF em base64 no `@font-face` garante que o PNG/PDF sai na fonte certa
  (Montserrat Black/ExtraBold/Medium vivem em `hermes/[marca]-motion/public/fonts/`).
- Texto do PDF extraído pode aparecer triplicado ("OOO CCCAAARRRTTTÃÃÃOOO") quando o título usa
  `-webkit-text-stroke` + `text-shadow` — é artefato da extração, o render está correto; confirme por screenshot.
