---
name: remotion-film-overlays
description: "Use when making Remotion film overlays (names, titles)."
version: 1.1.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [remotion, motion, overlay, lettering, lower-third, titles, transitions, film]
    related_skills: [cliente-2026-video-motion, remotion-video-production, remotion-windows-render, creative-motion]
---


## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)

| Pilar | MOC | Quando consultar |
|---|---|---|
| **Cinema Theory (mestre)** | [[57.00-cinema-theory-moc]] | Visão geral + ordem de leitura dos 7 pilares |
| **Edição** | [[57.22-edição-moc]] | Timing, ritmo, cortes, transições, QC de render |
| **Design** | [[57.25-design-moc]] | Tipografia, layout, hierarquia, motion design, safe zones |
| **Animação/Movimento** | [[57.24-animação-moc]] | 12 princípios, easing, timing, keyframes |
| **Áudio** | [[57.26-audio-moc]] | Sound design, música, loudness, sync, ProRes audio |
| **Cinematografia** | [[57.21-cinematografia-moc]] | Ótica, câmera, color space, alpha channel |

> Regra: nunca decida "de cabeça" — consulte o card do pilar; nunca cite o card sem executar pela tool certa.

# Remotion — Overlays de Filme (lower thirds, titles, listas, gráficos, transições)

Sistema de **elementos gráficos que vão POR CIMA de filme** (9:16 e 16:9): nome de pessoa,
título, lista, elemento gráfico e transição — tudo no estilo **stop motion flat vibrante**.

> **Código pronto (copiar e colar):**
> - `references/marca-theme.ts` → **salvar como `src/marca-theme.ts`** — fonte ÚNICA de paleta/fonte/safe/formato/sombra
> - `references/component-library.tsx` → `src/overlays.tsx` (16 elementos + burst/sparkle/cutout)
> - `references/keyword-caption.tsx` → `src/keyword-caption.tsx` (`KeywordPop` + `Legendas` + `Maquina`)
> - `references/transitions.tsx` → `src/transitions.tsx` (7 transições + 2 hooks de punch)
> - **Novo:** `references/layout.tsx` → `src/layout.tsx` (`SafeStack`/`SafeRow`, `ESPACO`, `TYPE`)
> - **Novo:** `references/motion.ts` → `src/motion.ts` (stop motion: `useSnapIn`, `useTwitch`, `rnd`)
> - **QC/render:** `references/qc-pipeline.md` · **validadores:** `references/verifica-*.py`
> - **o que pegar de fora:** `references/emprestar-adaptar.md`
>
> **Estrutura de fonte única** (`marca-kit/kit/`): `src/` → `references/` da skill
> é **espelho automático** (`cp src/* references/`). Isso evita drift — quando atualizo
> o componente, a skill segue na mesma hora. `kit/tests/` contém os `.py` validadores.
>
> **Caso de produção validado** (filme inteiro, 5 cenas, cliente real): skill
> `cliente-2026-video-motion` — leia o gotcha #0 e as "REGRAS FIXAS DA CAMPANHA" antes de começar.

## 🧪 Status: TESTADO (smoke test 2026-09-13)
Os 14 componentes + 4 transições **compilam e renderizam** — não é código de papel.
Como reproduzir a prova:
1. `cp references/component-library.tsx <projeto>/src/overlays.tsx`
2. `cp references/transitions.tsx <projeto>/src/transitions.tsx`
   (o `transitions.tsx` importa `./overlays` — respeite esses dois nomes)
3. Monte uma composição de teste usando `TitleCard`, `NameLettering`, `ListStack`,
   `Cutout` + `Flash`/`WipeBlock`/`ShutterRows` e registre em `src/Composition.tsx`
4. `node render.cjs TestOverlays teste.mp4` → renderizou 5s, 0 frames pretos

**Pegadinha corrigida no código:** `TitleCard` e `ListStack` usavam `usePop()` **dentro de
`.map()`** — hooks em loop quebram. Foram refatorados para SUBCOMPONENTES (`TitleLine`, `ListItem`).
Se você criar elemento novo com repetição, faça o mesmo.

## Quando usar
- "lettering com nome / lower third / cartela de nome"
- "título / title card / abertura"
- "lista de itens / tópicos animados"
- "elementos gráficos" (starburst, sparkle, cápsula, seta, sticker de foto)
- "transição" entre planos (wipe, flash, shutter, punch)

## ⚠️ 3 verdades que definem o estilo (aprendidas na marra)

### 1. STOP MOTION — nada interpola suave
O estilo NÃO é motion suave com easing bonito. É **quadro-a-quadro**: a animação trava em uma pose
por alguns frames e depois SALTA. Sem isso o resultado parece "template genérico de IA".
```tsx
const STEP = 3;                                   // 30fps -> 10 poses/s
const t = Math.floor(Math.max(0, frame - delay) / STEP) * STEP;
```
Todo hook de animação passa por `useStep` antes de calcular posição/escala/rotação.
O movimento contínuo vira **punch-in em degraus** (`usePunch`), e fade vira **corte seco** (`useCut`).

### 2. ORDEM DE CAMADAS (em React quem vem DEPOIS desenha em cima)
```
FUNDO ─ BURST ─ SPARKLE ─ FOTO/CUTOUT ─ SCRIM ─ TEXTO ─ TEXTO LEGAL
```
🔴 **Erro que custa versão inteira:** declarar o `<Burst>` DEPOIS da foto → o starburst cobre o
sujeito. E **burst atrás de foto full-bleed é invisível** (a foto é opaca) → só faz sentido atrás de
**cutout**. Se a foto é full-bleed, **não use burst**.

### 3. COR: burst e texto NUNCA da mesma cor
Burst é o **campo de leitura** do texto. Se o texto é amarelo em cima de burst amarelo, ele some
(sobram só as pontas das letras). Escolha o burst para **contrastar com o texto**, não com o fundo.

## 🎨 Contraste e sombra (sistema de 2 decisões)

| Situação | Regra |
|---|---|
| Fundo liso | texto em **cor pura** + pode ter sombra |
| Texto sobre foto | obrigatório **scrim** (gradiente sólido→transparente) OU **plaque** (bloco sólido) |
| Sombra | **sólida e colorida** (`drop-shadow` sem blur), na cor da paleta, **sempre contrastando com o fill** |
| Contorno preto/branco | ❌ proibido (poluição visual) |
| Outline na foto recortada | ✅ 8 `drop-shadow` na cor da marca → efeito **sticker** (é o único drop-shadow de imagem) |

```tsx
// sombra sólida proporcional ao tamanho da letra
filter: `drop-shadow(${size*0.045}px ${size*0.055}px 0 ${shadow})`
// mapa de contraste fill -> sombra
roxo→amarelo · amarelo→roxo · branco→roxo · pink→roxo|teal · teal→amarelo
```

### 📐 Largura de texto (Montserrat Black)
`largura ≈ nchar × 0.68 × size`. Para uma linha caber em `W` px: **`size_max ≈ W / (nchar × 0.68)`**.
Se o nome precisa ser grande e não cabe numa linha, **quebre em 2 linhas** — não encolha a fonte.

## 📱 Safe margins (Reels impulsionado, 1080×1920)
```tsx
const SAFE = { top: 250, bottom: 400, side: 64 };   // área útil y 250..1520 · x 64..1016
```
Só foto/fundo sangra. **Texto, CNPJ, badge e CTA ficam DENTRO.**
Reservar também a faixa do **texto legal** oficial (ver `cliente-2026-video-motion` → regras fixas).

## 🏃 MOVIMENTO — chega e PARA (sem bounce) · `references/motion.ts`

O dono rejeitou o v1: *"está tudo muito bouncy, queria mais stop motion, com movimentos mais
curtos e diretos, mais aleatórios também assimétricos"*.

### 3 regras (substituem todo `spring()`)

**1. CHEGA E PARA.** Sem spring. 1 salto e trava:
```tsx
// ❌ bouncy: 0 -> 1.35 -> 0.9 -> 1.12 -> 0.97 -> 1   (estoura, volta, estoura)
// ✅ seco:   0 -> 1 e fica                              (2 poses ~0,2s)
```
`useSnapIn(delay, { travel, poses, overshoot, seed })` — `poses: 2` = bem seco, `overshoot: 1` = direto.
⚠️ `overshoot` acima de ~1.06 volta a parecer elástico.

**2. CURTO E DIRETO.** O movimento se resolve em 1–2 degraus (`STEP=3` → 0,1–0,2s), não em 15 frames.
Na dúvida, MENOS degraus.

**3. ALEATÓRIO E ASSIMÉTRICO.** Nada de padrão espelhado:
```tsx
export const rnd = (seed: number) => {           // determinístico: mesmo frame = mesmo valor
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
```
`useSnapIn` sorteia **lado** (`rnd(seed)`), **sobe/desce** (`rnd(seed+17)`) e **rotação** (`rnd(seed+31)`).
`useTwitch(delay, seed, amp)` dá o tremor **assimétrico**: a sequência `[-1, 0.55, -0.35, 1.1, -0.8,...]`
nunca espelha e **nunca passa pelo zero** — o elemento fica sempre um pouco fora de eixo, como
filmado quadro a quadro. `useTwitchRot` faz o mesmo com o ângulo.

### 🧪 COMO MEDIR BOUNCE (a prova objetiva)
Bounce = **a escala vai, VOLTA e vai de novo**. `references/verifica-motion.py` mede a largura do
conteúdo frame a frame e conta as **inversões de direção** (ignorando variação <2,5% do pico, que é
tremor e não bounce):
```
1. ANTES (bouncy)  reversoes=3   ▁▁▁▁▁▁▁███▇▇▇███████████
2. AGORA (seco)    reversoes=0   ▁▁▁▁▁▁▁█████████████████
3. ASSIMETRIA      desloc. diferentes [0.019, 0.007, 0.015]
```
⚠️ **Armadilha da medição:** sem o filtro de 2,5% o tremor (±3,5px em 950px) conta como bounce e
dá falso-negativo (mediu 4 reversões num elemento que não oscilava).

### Parâmetros por elemento
| Prop | Efeito |
|---|---|
| `poses` | 2 = seco · 3 = seco com um toque · >3 = começa a ficar mole |
| `overshoot` | 1 = direto · 1.06 = leve firmeza · >1.1 = elástico (rejeitado) |
| `travel` | distância da entrada (menor = mais seco) |
| `seed` | muda a variação aleatória (direção/ângulo) |
| `twitchAmp` | 0 desliga o tremor assimétrico |

## 📐 DIAGRAMAÇÃO — NUNCA posicionar com `top` à mão (`references/layout.tsx`)

O dono (designer) pegou erro de diagramação no v1 do kit:
*"o bloco 01 está muito pra cima, longe dos outros. temos que cuidar das regras
básicas: distância, respiro, leitura, diagramação"*. O erro de código era real:

**PITFALL — `position:absolute` dentro de flex quebra o empilhamento.**
`KeywordPopup` renderiza um div `position:absolute`. Dentro de um `<Stack>`, filhos
absolutos saem do fluxo e **empilham todos no mesmo lugar**. Sintoma: só UMA faixa
larga no render (as 3 cápsulas sobrepostas) — `verifica-layout.py` mediu `bandas=1`
em vez de 3.

**A regra:** para elemento que vai num stack, existe o modo `inFlow` (sem `absolute`);
elementos livres usam `absolute`.

### O que o sistema de layout garante
1. **Escala de espaço** `ESPACO` (1.5×: 6/10/16/24/36/56/84/120). Todo gap sai dela,
   nunca de número inventado.
2. **`SafeStack`/`SafeRow`** — flex com `gap`. `anchor="centro"` ⇒ o grupo é
   centralizado NA ÁREA SEGURA ⇒ margem de cima == de baixo (balanço).
3. **Escala tipográfica** `TYPE` — não valores soltos; hierarquia por SALTO 1.35–1.45×.
4. **`AREA_UTIL`** — top 250 / bottom 1520 / altura 1270; é onde a diagramação acontece.
5. **`KeywordList`** — várias palavras: o `size` sai do item MAIS LONGO (então todos
   caibam com o MESMO corpo) e o grupo fica centrado. Foi o que resolveu o "01 longe".

### 🧪 COMO MEDIR DIAGRAMAÇÃO (`references/verifica-layout.py`)
Mede bandas verticais de cor: nº de faixas, altura de cada (mesmo tamanho ✓),
espaçamento médio entre elas ao longo de ~50 frames (respiro igual — médio, porque o
tremor individual some na média) e as margens topo/base (centrado ✓). Critérios:
`bandas == N`, alturas iguais ±12%, espaçamento médio ≤1.5px de variação, centro ±40px.

## ⌨️ MÁQUINA DE ESCREVER (typewriter posterizado) — `references/keyword-caption.tsx`

Typewriter com TEMPO EM DEGRAUS (posterize) + cada letra **piscando por TODA a
paleta** até assentar na cor final:
```tsx
<Maquina texto="[MARCA]" corFinal={roxo} porLetra={2} flick={3} voltas={1} />
```
- `porLetra`: frames entre uma letra e a próxima · `flick`: frames por piscada (STEP=seco)
- `voltas`: quantas voltas na paleta antes de travar (1 = passa por todas uma vez)
- o texto ocupa o lugar final desde o começo (`visibility`) → **não reflui**
- tudo com `Math.floor` → a cor só troca em degraus

**REGRA DE USO:** SÓ em títulos, nomes próprios e destaques. NUNCA em legenda ou
frase corrida — piscar em texto longo cansa a leitura.

🧪 prova: `verifica-layout.py` mede a cor dominante da 1ª letra → dá 4 núcleos
(amarelo→pink→teal→branco) e depois a sequência fica CONSTANTE (ciclo parou = assentou).
Pitfall de medição: a letra assentada (roxo = fundo) some, mas a SOMBRA dela é cor
viva — por isso o sinal de "assentou" é cor estável, não "virou fundo".

## 📐 SISTEMA DE MOTION — REGRAS GLOBAIS (qualquer projeto)

> Se um agente produzir motion sem seguir ISSO, o output é **rejeitado**.

### Regra 1 — ZERO `spring()`
Todo movimento interpola suave → **bounce**. A exceção é `@remotion/transitions` oficial
do próprio Remotion (ela já faz a curva certa). Tudo fora disso:
```tsx
// ❌ PROIBIDO
const s = spring({ frame, fps, config: { damping: 12 } });
// ✅ OBRIGATÓRIO — usa o sistema deste repo:
const entra = useSnapIn(delay, { travel, poses, overshoot, seed });
// usa Math.floor + STEP=3 → 10 poses/s → ZERO interpolação
```
Motion contínuo vira **punch-in em degraus**. Fade vira **corte seco**.
Ver `references/motion.ts` + `references/verifica-motion.py` (provoca reversões = 0).

### Regra 2 — Layout é estrutura, não `top: NUMBER`
Posicionar com `top: 725` etc. é **proibido** — o conteúdo muda de tamanho e o
elemento some pra fora da safe. Usa SEMPRE:
```tsx
<SafeStack gap={ESPACO.xl} anchor="centro">
  <KeywordPop texto="x" inFlow />
</SafeStack>
```
- `SafeStack` centraliza o grupo → margem cima == margem baixo (balanço)
- `gap` vem da escala `ESPACO` (1.5×)
- `inFlow` dentro de stack — sem `position:absolute` pra não sobrepor
Ver `references/layout.tsx` + `references/verifica-layout.py`.

### Regra 3 — Catálogo de elementos vem do kit
NÃO inventar. Todos os elementos de motion usam os **componentes existentes**
(registro na tabela abaixo). Nome novo = precisa de aprovação humana.

| Componente | Para quê |
|---|---|
| `KeywordPop` | palavra-chave estoura (stop motion direct) |
| `KeywordList` | várias palavras, MESMO tamanho, respiro igual, centralizadas |
| `Maquina` | typewriter que pisca a paleta antes de assentar (títulos/nomes) |
| `NameLettering` | nome + cargo (capsula colorida) |
| `TitleCard` | título de 2-4 linhas |
| `Burst` | starburst atrás do sujeito |
| `Cutout` | foto recortada (sticker) |
| `Plaque` | bloco sólido de leitura |
| `Line` | lettering solitário |
| `Scrim` | gradiente de leitura |

### Regra 4 — Transições só do `references/transitions.tsx`
As 7 validadas (FlashCut, WipeAcross, WipeDiagonal, BurstCut, CapsuleWipe,
Shutter, StickerCard) — passam em `verifica-transicoes.py` (pico >92%, single
peak, ini/fim <15%). NÃO inventar wipe novo sem validar.

### Regra 5 — Assets vêm listados
Fotos/cortes/trilhas são assets reais em `marca-kit/assets/`. NÃO inventar
caminho nem asset. Se falta, levanta PRIMEIRO.

## 🧩 Catálogo de elementos (`references/component-library.tsx`)

| Elemento | Componente | Para que serve |
|---|---|---|
| **Palavra-chave** | **`KeywordPop`** | palavra/frase que ESTOURA (stop motion: 0→1.35→0.90→1.12→1) |
| **Legenda** | **`Legendas`** | TikTok-style via `createTikTokStyleCaptions()`, palavra ativa destacada |
| Nome de pessoa (lower third) | `NameLettering` | "FULANO DE TAL" + cargo em cápsula |
| Título / cartela | `TitleCard` | 2–4 linhas centradas com burst atrás |
| Lista de itens | `ListStack` | itens aparecendo em sequência (cápsula por item) |
| Lettering solto | `Line` | cor pura + sombra sólida contrastante |
| Bloco sólido | `Plaque` | cápsula/bloco — legibilidade garantida sobre foto |
| Starburst | `Burst` | halo atrás do sujeito (sempre ATRÁS) |
| Sparkle | `Sparkle` | brilho nas bordas (pode ser cortado pela borda) |
| Foto recortada | `Cutout` | PNG com alpha + outline sticker |
| Foto full-bleed | `PhotoFull` | fundo do plano, com foco controlado |
| Fundo duotone | `CityDuotone` | cidade/foto dessaturada com véu de cor |
| Scrim | `ScrimTopo`/`ScrimBase` | faixa de leitura sobre foto |
| Texto legal oficial | `Legal` | overlay PNG da campanha (nunca digitar) |

### 🎨 `marca-theme.ts` — a fonte única (trocar de cliente = trocar 1 arquivo)
Paleta `[MARCA]` (nomes) + `C` (aliases `cor1..cor4` p/ compatibilidade) · `FONT`/`FONT_BLACK` ·
`ASSETS` (nomes dos PNGs oficiais) · `FORMATOS` (`vertical`/`quadrado`/`horizontal` com safe próprio) ·
`SAFE`/`SAFE_W`/`RIGHT_LIM`/`TEXT_TOP`/`HEAD_Y` · `BG_AMARELO`/`BG_ROXO` ·
`CONTRASTE`+`sombraDe()` (mapa fill→sombra) · `STEP`/`TRANSICAO_FRAMES` · `sizeParaLargura()`.

### 📐 Medir texto: `fitText` do `@remotion/layout-utils`
Medição **real** (substitui a fórmula `nchar × 0.68 × size`, que é estimativa):
```tsx
import { fitText } from "@remotion/layout-utils";
const { fontSize } = fitText({ text: "EDUCAÇÃO", withinWidth: 952,
  fontFamily: "Montserrat", fontWeight: "900", textTransform: "uppercase" });
```
⚠️ **Só mede depois da fonte carregada.** Com `@font-face` local, se medir cedo o número sai errado —
por isso o `KeywordPop` **cai de volta na estimativa** se o `fitText` falhar.
✅ Validado por pixel: o texto medido ocupou **872–1064px** dentro do alvo de 952 (o estouro é a
escala do punch, não overflow).

## 🔄 Transições (`references/transitions.tsx`) — modelo COBRE → REVELA

**Toda transição tem 2 FASES e é colocada ESPELHANDO O CORTE:**
```
|<--- metade 1 --->|<--- metade 2 --->|
 cobre 0 → 100%     revela 100% → 0%
             ↑
        o CORTE fica aqui
```
```tsx
const CUT = 134;                         // frame onde a cena A acaba
<Sequence from={CUT - 6} durationInFrames={12}>
  <WipeAcross color={C.cor1} />
</Sequence>
// CUT-6 comeca a cobrir · em CUT esta 100% coberto (corte invisivel) · CUT+6 ja revelou a cena B
```

| Transição | Frames | O que faz |
|---|---|---|
| `WipeAcross` | 12–16 | bloco reto atravessa (o mais seguro) |
| `WipeDiagonal` | 12–16 | faixa inclinada — mais energia |
| `BurstCut` | 14–18 | o starburst da marca cresce até cobrir (assinatura) |
| `CapsuleWipe` | 16–20 | colunas-cápsula escalonadas |
| `Shutter` | 12–16 | fileiras alternadas (livro) — bem stop motion |
| `StickerCard` | 14–18 | cartão com contorno grosso sobe e sai |
| `FlashCut` | 6–10 | pipoca no corte; pontuação, não substitui transição |
| `usePunchOut/In` | 8–14 | empurrão de escala nas cenas |

### 🔴 DUAS ARMADILHAS que custaram uma reescrita (2026-09-13)

**1. Valor de cobertura NÃO é posição.** A v1 usava `useCover()` (que devolve `0→1→0`) como
**posição** do bloco. Resultado: o bloco atravessava, saía e **VOLTAVA** — duas varridas.
A curva medida mostrava **dois picos** em vez de um.
✅ Deslizes (`WipeAcross`, `WipeDiagonal`, `StickerCard`) usam progresso **MONOTÔNICO** (`useT()`).
✅ Só efeitos de **crescer/encolher** (`BurstCut`, `CapsuleWipe`, `Shutter`) usam `useCover()` —
nesses o valor máximo coincide com a cobertura total e é cruzado **uma vez**.

**2. Quantizar a posição pula o ponto de cobertura total.** Com `p` quantizado em 6 degraus,
`p = 0.5` (onde o bloco está centrado e cobre 100%) era **pulado** → o pico ficava em ~67% e o
corte aparecia.
✅ **Não quantizar a POSIÇÃO** — só o tempo (`useT` degraua o frame, não o valor).
✅ E dar **folga geométrica**: bloco de **150%** com curso de **±150%** cria uma JANELA de
cobertura total (`p ∈ [1/3, 1/2]`), então algum frame sempre está 100% coberto.
Mesma lógica no `StickerCard`: cartão 160% da altura, curso ±160%.

**3. `BurstCut` precisa de `size` alta.** Os **vales** do polígono também têm que passar dos cantos
do frame (diagonal 2203). Com `size` 2300 os cantos ficavam de fora → cobertura 90%.
✅ `size: 3200` com vales em 0.72 do raio → vale de 1152px > 1106px (canto).

### 🧪 PROVAR que a transição funciona (sem enxergar o render)
`references/verifica-transicoes.py` — renderiza as transições sobre **fundo preto** em cor
**branca**, mede a **fração de pixels brancos por frame** e checa a curva.
```
#  transicao        curva de cobertura                         veredito
1  WipeAcross       ▁▁▁▆▆▆███▄▄▄▁▁▁▁  ini=0.00 pico=0.96 fim=0.00  OK
7  FlashCut         ▁▁▁▁▁▁▁▁▁███▁▁▁▁  ini=0.00 pico=0.96 fim=0.00  OK
```
Critérios: começa <15% · pico >92% · termina <15% · **um único pico**.
Essa bancada é o jeito de validar QUALQUER transição/efeito de tela cheia sem depender de ver a imagem.

### 👁️ JULGAR movimento exige versão LENTA
Uma transição de 12–16 frames dura **0,4–0,5s** — rápido demais pra avaliar forma e ritmo
(ainda mais numa bancada com 7 seguidas). ✅ Gerar a versão lenta **sem re-render**:
```bash
ffmpeg -y -i test_trans.mp4 -vf "setpts=PTS*2.8,fps=30" -an test_trans_slow.mp4   # 2,8x
ffmpeg -y -i test_trans.mp4 -vf "setpts=PTS*6,fps=30"   -an test_trans_vslow.mp4  # 6x (ve os degraus)
```
`setpts` duplica frames — **preserva o stop motion** (não interpola). Mostrar as duas lado a lado
(tempo real + lenta, `loop muted autoplay`) num HTML de bancada, porque o dono julga olhando.

## 🚀 Pipeline (o único que funciona no headless)
```bash
# 1) registrar a composição em src/Composition.tsx
# 2) render (nunca usar npx — não roda no bash MSYS deste host)
cd <projeto> && node render.cjs <CompId> saida.mp4 2>&1 | tail -5
```
- `<video>`/`<Video>`/`OffthreadVideo` do Remotion **NÃO** funcionam para footage (congela ou não entra).
  Para filme com imagem real: renderize **só os gráficos** e sobreponha no ffmpeg.
- `<Audio>` funciona normal no `renderMedia`.
- `@font-face` local funciona no render programático (ttf em `src/fonts/` + `fonts.css`).

## ✅ Checklist antes de entregar
- [ ] Duração do filme == duração da trilha (`frames = segundos × fps`)
- [ ] Trilha com **fade-out** no corte (corte seco dá talo)
- [ ] Nada de texto fora do SAFE; CNPJ com `zIndex: 99`
- [ ] Burst atrás (nunca sobre foto full-bleed)
- [ ] Texto e burst em cores diferentes
- [ ] Sujeito centrado e **sem sobreposição** com o texto (deixe ≥100px de folga)
- [ ] QC: `blackdetect` = 0 · `ebur128` = alvo · MD5 do stream de vídeo igual ao render
- [ ] Entregar **player HTML** + caminho absoluto (o chat do Hermes não toca `MEDIA:` de vídeo —
      usar `desktop_preview` + `::preview`)

## 🎯 SISTEMA [MARCA] (medido nas peças OFICIAIS — não inventado)

> Fonte: `07_ONLINE/Feed/Reel_08_EDUCAÇÃO_v01d.mov` + cartelas `of-12`/`of-30` (1080×1920).
> **Medir antes de desenhar** (o vídeo oficial é a única fonte de verdade):
> `ffmpeg -i <oficial>.mov -vf "fps=1/2,scale=540:-1" out/of-%02d.png` → olhar os frames.

### As 6 regras que fazem parecer "[cliente]" (e onde o amador erra)

| # | Regra | Erro amador |
|---|---|---|
| 1 | Lettering = **fill + CONTORNO grosso** de cor contrastante | só drop-shadow leve |
| 2 | Burst com **2 camadas**: cópia deslocada atrás + contorno preto | starburst chapado de 1 camada (=clipart) |
| 3 | Fundo **nunca chapado**: gradiente + `Texture` + `Vignette` | só gradiente radial (=plástico) |
| 4 | Foto em **moldura grossa** com sombra dura (`PhotoFrame`) OU **cutout** com contorno | retângulo com borda branca fina (=sticker) |
| 5 | **Card container** com sombra dura offset (`Card3D`), não elementos soltos flutuando | placas soltas sem hierarquia |
| 6 | **Ícones line-art 2 cores** (`Icon`/`IconList`) | emoji (não renderiza no Chrome headless) |

### Como implementar (componentes do kit)

```tsx
// 1. contorno = anel de text-shadow em 20 direções.
//    NUNCA `-webkit-text-stroke` (é centrado, come o miolo do glifo).
<Line text="ESCOLAS" size={128} fill={C.cor1} stroke={C.cor2} strokeW={9} />

// 2. burst em 2 camadas (cópia offset atrás + contorno)
<Burst size={1120} color={C.branco} outline={C.preto} outlineW={1.3}
       shadow={C.cor3} centerY={1120} spikes={14} rot={-5} />
//    raio interno do polígono é 46 (não 50) p/ a cópia offset não ser cortada.

// 3. atmosfera — SEMPRE nas 2 linhas, logo depois do background
<Texture opacity={0.10} color={C.cor2} gap={15} />
<Vignette strength={0.40} />

// 4/5. foto emoldurada + container de conteúdo
<PhotoFrame src="foto.jpg" w={860} h={600} border={C.cor3} borderW={14}
            shadow={C.cor2} offset={18} posY="38%" rotate={-1.5} />
<Card3D bg={C.escuro} shadow={C.cor1} offset={16} radius={34} pad={40} w={896}>…</Card3D>

// 6. lista com ícones
<IconList top={1000} size={42} stagger={13} accent={C.cor3} rows={[
  { name: "alert",  text: "SEM MATERIAL" },
  { name: "drop",   text: "SEM ÁGUA, SEM LIVRO" },
  { name: "school", text: "PROFESSOR DESVALORIZADO" },
]} />
```

### 🔴 Corte de segurança da faixa CNPJ (custou 1 ciclo de render)

`cg_cnpj_overlay.png` tem conteúdo só em **x 998–1013** (resto transparente).
**Card full-width = `left: 64, w: 896`** → borda direita 960 + sombra 16 = 976 ✓ (22px de folga).
Medir sempre: `np.where(np.array(im.convert("RGBA"))[:,:,3].max(axis=0) > 10)[0]`.

### 📐 Zonas do frame 1080×1920 (Reels impulsionado)

| Zona | px |
|---|---|
| topo útil (nome/headline) | `TEXT_TOP = 262` |
| margem lateral esquerda | `64` |
| limite de conteúdo à direita | `968` (faixa CNPJ em 998) |
| rodapé coberto pela UI | `≥ 1520` (safe bottom 400) |

### 🎭 Elenco de cutouts (medir `headFrac` no alpha, nunca chutar)

| asset | headFrac | uso |
|---|---|---|
| `oc9.png` | 0.272 | hero sorrindo (melhor abertura) |
| `oc1.png` | 0.143 | fechamento (mãos juntas, blazer) |
| `cut1.png` | 0.206 | 3/4 corpo, olhar direto |
| `oc4.png` | 0.211 | t-shirt, mão na cintura (confiante) |
| `cut_camara.png` | 0.243 | ⚠️ tem outra pessoa no recorte |

`headFrac = np.where(alpha>20)[0].min() / H` · gerar contact-sheet antes de escolher.

## 📚 Onde está o resto do conhecimento
| Assunto | Skill |
|---|---|
| Caso real completo + regras de cliente | `cliente-2026-video-motion` |
| Pipeline Remotion genérico (arquivos/vídeo/áudio) | `remotion-video-production` |
| Render no Windows (CLI falha → API Node) | `remotion-windows-render` |
| Fontes no headless | `remotion-headless-fonts` |
| Legendas animadas (pycaps) | `animated-video-captions` |
| Lettering p/ Resolve | `resolve-remotion-lettering` |
| Decupagem de filme | `film-decupage` |