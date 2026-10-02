# Vertical Social Video — Grade e Checklist (Reels / TikTok / Stories)

Alvo: 1080×1920, feed IMPULSIONADO. Derivado de um filme de campanha de 5 cenas
(2026-09-12) que passou por 5 rodadas de revisão do cliente.

## Zonas seguras (1080×1920)
```tsx
const SAFE = { top: 250, bottom: 400, side: 64 };
const SAFE_W = 952;    // largura útil p/ texto
const SAFE_BOT = 1520; // base útil
```
| Zona | Faixa | Conteúdo |
|---|---|---|
| Disclaimer | 250–285 | CNPJ/legal, centralizado, ~17px |
| Badge | 298–356 | bloco flush, cantos retos |
| Headline | 380–900 | 2–3 linhas de 88% da largura útil |
| Foto/sujeito | rosto em 780–1200 | pode sangrar embaixo |
| Rodapé | 1200–1520 | número gigante, plaques, faixa |

## Ordem de leitura que funciona
1. badge (ancora topo-esquerda) 2. headline (grosso, com contorno) 3. sujeito
4. número/dado gigante 5. plaque de nome 6. faixa decorativa + disclaimer.

## Princípios que o cliente cobrou
- **Densidade, não vazio.** Faixa vazia > 15% da altura = "tosco". Encher com o starburst,
  a foto maior, ou o texto maior.
- **Fotos GRANDES.** Sujeito ocupando 75–90% da largura. Foto pequena flutuando no centro
  com ar em volta é o erro nº1.
- **Nada centralizado flutuando** — todo bloco encosta numa margem ou é full-bleed.
- **Fundamento nas bordas**: badge flush, sparkle CORTADO pela borda, elemento sangrando.
- **Fundo nunca chapado** — gradiente radial da própria matiz ou foto em duotone
  (dessaturar + véu colorido com `mixBlendMode:'multiply'`).
- **Figurino/ensaio diferente por cena** — repetir a mesma foto/roupa em várias cenas
  é rejeitado imediatamente.
- **Sujeito É a foto** (não cutout)? Então o starburst não pode ficar atrás — usar como
  acento cortado pela borda, nunca sobre o rosto.

## Contraste de lettering (o que funciona)
| Fundo | Texto | Contorno | Sombra |
|---|---|---|---|
| Amarelo | Roxo | branco 7px | dura preta |
| Roxo/foto escura | Branco | preto 6px | dura preta |
| Roxo/foto escura | Amarelo | preto 6px | dura preta |
| Burst amarelo | Roxo | branco 7px | dura preta |

❌ Nunca: texto da mesma cor do fundo; sombra `rgba(0,0,0,0.3)` sobre cor saturada.

## Checklist antes de entregar
- [ ] Guia `[64,250,1016,1520]` desenhada e conferida em CADA cena?
- [ ] Algo encosta em cada borda (senão flutua)?
- [ ] Rosto do sujeito dentro do safe e não coberto por overlay?
- [ ] Nenhum texto cortado na margem (contorno/tracking contados)?
- [ ] 5 figurinos/fotos distintas?
- [ ] Disclaimer presente, legível e no topo do z-order?
- [ ] Zero elementos de carrossel (dots / "deslize")?
- [ ] Áudio: `ffprobe` confirma stream AAC e duração ≈ filme?
