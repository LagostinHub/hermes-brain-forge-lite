# Emprestar & Adaptar — catálogo de fontes externas (pesquisado 2026-09-13)

O que pegar de fora pro media kit da [cliente], **o que NÃO pegar**, e o que mudar
para manter o DNA (stop motion em degraus · flat vibrante claro · cápsula rotacionada ·
starburst · sticker de foto · sombra sólida colorida · sem contorno).

## Legenda de veredito
✅ **adotar** (já serve, só plugar) · 🔧 **adaptar** (bom, mas reescrever pro DNA) ·
💡 **só ideia** (pegar o conceito, código não) · ❌ **fora do DNA** (descartar)

---

## 🥇 NÍVEL 1 — OFICIAL Remotion (adotar sem pensar)

| Fonte | Install | Veredito | Por quê |
|---|---|---|---|
| **`remotion-dev/skills`** | `npx skills add remotion-dev/skills` | ✅ | 12 skills oficiais de best practices p/ agentes. `/remotion-markup`, `/remotion-captions`, `/remotion-render`, `/remotion-docs` |
| **`@remotion/transitions`** | `npx remotion add @remotion/transitions` | ✅ | `<TransitionSeries>` + presentations (`fade` `slide` `wipe` `flip` `clockWipe`) + `springTiming`. Cuida da SOBREPOSIÇÃO das cenas sozinho |
| **`@remotion/captions`** | **já instalado** (4.0.523) | ✅ | `createTikTokStyleCaptions()` → páginas + tokens palavra-a-palavra. **É a peça de LEGENDAS** |
| **`@remotion/layout-utils`** | `npx remotion add @remotion/layout-utils` | ✅ | `fitText()` = medição **EXATA** de largura. Substitui a fórmula `nchar × 0.68 × size` (que é estimativa) |
| `@remotion/lottie` | `npx remotion add @remotion/lottie` | ✅ | assets de motion animados (After Effects → Lottie) |
| `@remotion/shapes` / `@remotion/paths` | idem | 🔧 | formas e path-animation precisos (starburst melhor) |
| `@remotion/light-leaks` | idem | 💡 | vazamento de luz p/ transição cinematográfica |

---

## 🥈 NÍVEL 2 — `reactvideoeditor/remotion-templates` (81, MIT, código puro Remotion)

`github.com/reactvideoeditor/remotion-templates` — 9 categorias × 9. Demos: reactvideoeditor.com/remotion-templates

### Text (9) — cobre "títulos" e "palavras-chave"
| Template | Veredito | Adaptação p/ [cliente] |
|---|---|---|
| `popping-text.tsx` | 🔧 | **melhor candidato p/ PALAVRA-CHAVE** — trocar o easing por `useStep` |
| `bounce-text.tsx` | 🔧 | título; remover o bounce elástico → salto em degraus |
| `pulsing-text.tsx` | ✅ | já é discreto; serve direto p/ ênfase |
| `slide-text.tsx` | 🔧 | direção + degraus |
| `text-highlight.tsx` | ✅ | **palavra-a-palavra destacando** — base de legenda/karaokê |
| `typewriter-subtitle.tsx` | 💡 | digitação não combina com stop motion; usar só p/ citação |
| `bubble-pop-text.tsx` | 🔧 | vira CÁPSULA (nosso vocabulário) |
| `glitch-text.tsx` | ❌ | RGB split é "tech/dark" — fora do DNA |
| `animated-text.tsx` | 💡 | reveal caractere-a-caractere é lento demais |

### Intro & Outro (9) — cobre "títulos" e "lettering de nomes"
| Template | Veredito | Adaptação |
|---|---|---|
| **`lower-third.tsx`** | 🔧 | **modelo enter/hold/exit** é o que falta no nosso `NameLettering`. Trocar a barra reta por cápsula colorida |
| `chapter-title.tsx` | 🔧 | bom p/ separar blocos do filme |
| `cinematic-title-intro.tsx` | 🔧 | trocar por burst + sombra sólida |
| `quote-card.tsx` | 🔧 | útil p/ fala da candidata |
| `end-card.tsx` | ✅ | modelo p/ CTA final |
| `title-split.tsx` | 🔧 | as 2 metades vindo do centro + degraus |
| `credits-roll.tsx` | 💡 | ficha técnica |
| `countdown-intro.tsx` | ❌ | contagem não serve |
| `subscribe-reminder.tsx` | ❌ | é YouTube, não campanha |

### Content Animation (9) — cobre "listas"
| Template | Veredito | Adaptação |
|---|---|---|
| **`animated-list.tsx`** | 🔧 | **base da nossa LISTA**; trocar stagger por degraus |
| `progress-steps.tsx` | 🔧 | bom p/ "3 eixos da campanha" |
| `text-highlight.tsx` | ✅ | (também aqui) |
| `particle-explosion.tsx` | 💡 | vira nosso `Sparkle`/`Burst` |
| `notification-pop.tsx` | 💡 | conceito de "entra e sai" |
| `sound-wave.tsx` | 💡 | se tiver áudio |
| `card-flip.tsx` / `rotating-carousel.tsx` | 💡 | 3D demais p/ flat |
| `countdown-timer.tsx` | ❌ | não serve |

### Transition (9) — comparar com as nossas 7
| Template | Veredito | Adaptação |
|---|---|---|
| `slide-wipe.tsx` | 🔧 | = nosso `WipeAcross`; conferir se o deles cobre 100% |
| `push-transition.tsx` | 🔧 | empurrão (não temos) — bom p/ mudar de assunto |
| `blinds-transition.tsx` | 🔧 | = nosso `Shutter` |
| `iris-transition.tsx` | 🔧 | círculo abrindo — **bom p/ revelar a candidata** |
| `clock-wipe.tsx` | 💡 | já existe no `@remotion/transitions` |
| `cross-dissolve` / `fade-through-black` / `morph` / `zoom-through` | ❌ | fade/zoom suave = anti-stop-motion |

### Cinematic (9) — cobre "cenas"
| Template | Veredito | Adaptação |
|---|---|---|
| **`ken-burns.tsx`** | 🔧 | pan+zoom em foto parada — **muito útil** pro acervo; usar punch em degraus |
| `parallax-pan.tsx` | 🔧 | profundidade (o dono pediu "atmosfera/profundidade") |
| `spotlight-reveal.tsx` | 🔧 | clip-path circular |
| `letterbox-reveal.tsx` | 💡 | barras — combina com cinema |
| `camera-shake.tsx` | 💡 | só p/ impacto |
| `vignette-pulse.tsx` | ✅ | discreto, serve |
| `film-burn` / `whip-pan` / `zoom-pulse` | ❌ | quebra o flat claro |

### Image & Media (9) — cobre "cenas com foto"
| Template | Veredito | Adaptação |
|---|---|---|
| `photo-stack.tsx` | 🔧 | pilha de fotos rotacionadas — **combina muito** com cápsula/foto-sticker |
| `polaroid-frame.tsx` | 🔧 | moldura — variação do nosso `Cutout` |
| `split-screen.tsx` | 🔧 | 2 painéis (antes/depois, ela/cidade) |
| `gallery-grid.tsx` / `masonry-gallery.tsx` | 🔧 | mosaico do acervo |
| `image-carousel.tsx` | 💡 | carrossel em vídeo = não |
| `image-zoom-reveal.tsx` | 🔧 | zoom-out focus-pull |
| `image-comparison-slider.tsx` | 💡 | só se tiver comparação |
| `picture-in-picture.tsx` | 💡 | pip |

### Charts & Data (9) — se a peça for de números
| Template | Veredito |
|---|---|
| `stat-counter.tsx` (número subindo) | 🔧 — ótimo p/ "4000", "+X escolas" |
| `bar-chart` / `pie-chart` / `donut-chart` / `circular-progress` / `progress-bars` | 🔧 — recolorir p/ paleta |
| `line-chart` / `area-chart` / `comparison-chart` | 💡 — pouco usado em política |

### Background (9)
| Template | Veredito |
|---|---|
| `geometric-patterns.tsx` · `gradient-shift.tsx` · `grid-pulse.tsx` | 🔧 — recolorir p/ gradiente radial da marca (o dono exige fundo NUNCA chapado) |
| `bokeh-circles.tsx` | 🔧 |
| `noise-grain.tsx` | 💡 — textura sutil |
| `matrix-rain` · `starfield` · `pixel-transition` | ❌ — tech/dark, fora do DNA |

---

## 🥉 NÍVEL 3 — outras fontes

| Fonte | O que é | Veredito |
|---|---|---|
| `AleBrito124356/remotion-video-templates` | 7 composições **tipadas com Zod** (editáveis no Studio) | 🔧 **o mais próximo do nosso caso**: `LowerThirds` (name/role/enter-hold-exit), `KineticText` (lines com emphasis), `CaptionedShort` (1080×1920, captions word/start/end). Serve de **arquitetura de referência** |
| `ahgsql/remotion-subtitles` | helpers + estilos de legenda | 🔧 alternativa ao nosso Caption |
| `remotion-bits.dev` | "ready-made blocks for you and your agents" | 💡 olhar |
| `clippkit.com` | componentes Remotion grátis | 💡 olhar |
| `SwiftClip` (30 templates + source) | production-ready | 💡 olhar |
| `pskd73/remotion-animate-text` | animação de texto | 💡 |
| `storybynumbers/remotion-glitch-effect` | glitch | ❌ fora do DNA |
| `remotion.dev/docs/resources` | **a lista oficial** de tudo | ✅ consultar sempre |
| `DojoCodingLabs/remotion-superpowers` | plugin Claude Code, MIT | ⚠️ **regras** úteis (captions workflow, animation presets, short-form presets) mas a stack é de **APIs pagas** (KIE/TwelveLabs/Replicate/ElevenLabs/Suno) → conflita com "100% local/OSS". Pegar só os `.md` de regras |

---

## 🔴 O QUE NÃO EMPRESTAR (fora do DNA [cliente])
O dono rejeitou explicitamente: **dark/neon, fundo preto, contorno preto/branco, glitch,
matrix/starfield, fade/zoom suave, carrossel, contagem regressiva.**
Qualquer template dessas famílias = reescrever ou descartar.

## 🟢 O QUE JÁ É NOSSO E É MELHOR (não trocar)
- **`Line` / `Plaque`** — sombra sólida colorida + mapa de contraste (nenhum template tem)
- **`Cutout`** — sticker de foto com 8 drop-shadow
- **`Burst`** — starburst sempre ATRÁS, sem stroke
- **Stop motion `useStep`/`usePunch`** — o que dá o "tem gosto"
- **`Legal`** — overlay oficial da campanha
- **Pipeline de QC** (blackdetect + ebur128 + MD5)
Nenhum template resolve comunicação eleitoral brasileira (texto legal, safe de Reels impulsionado).

## 🎯 ORDEM DE ATAQUE
1. Instalar as 4 do Nível 1 (skills oficiais + transitions + layout-utils + usar captions)
2. Clonar os 81 em `vendor/remotion-templates/` (referência, **não** importar direto)
3. Adaptar na ordem: **`popping-text` (palavra-chave)** → `animated-list` (lista) →
   `lower-third` (nome, modelo enter/hold/exit) → `ken-burns` (cena de foto) →
   `iris`/`push` (transições novas) → `stat-counter` (números)
4. Cada adaptação entra em `marca-motion-kit/` já lendo o `marca-theme.ts`
