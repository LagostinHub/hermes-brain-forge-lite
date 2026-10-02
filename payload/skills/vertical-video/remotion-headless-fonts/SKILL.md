---
name: remotion-headless-fonts
description: >-
  Remotion still wrong font; or HTML CLI control surface.
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

# Remotion headless fonts + web-app control

## The headless font bug (verified Windows + Remotion 4.0.500)

`renderStill` (and the headless browser it spins up) **silently ignores custom webfonts**
on the captured frame. The text renders, but with a SYSTEM FALLBACK (Times/serif or Arial) —
NO error is thrown, so you only notice by vision-checking the PNG.

ALL of these LOCAL-font approaches FAILED in the headless still (text rendered, wrong font):
1. `FontFace` API + `staticFile("fonts/X.ttf")` URL
2. `fetch(staticFile(...)).arrayBuffer()` + `new FontFace(name, buf)`
3. `new FontFace(name, "data:font/ttf;base64,<base64>")` — TTF embedded in bundle (`montserratData.ts`)
4. `@font-face { src:url(data:...) }` injected via `<style dangerouslySetInnerHTML>`
5. `@font-face` in a `.css` imported by the component (webpack asset: `src/fonts.css` + `src/montserrat/*.ttf`)

The headless Chromium simply does not apply custom webfonts to the captured frame, even with
`document.fonts.ready` / `FontFace.load()` / `delayRender`+`continueRender` wrappers.

### What WORKED
- **`@remotion/google-fonts/<family>`** (e.g. `import { loadFont } from "@remotion/google-fonts/montserrat"`).
  It makes ~90 network requests to the Google CDN at render time and DOES apply the font.
  BUT it TIMES OUT the default 30s headless browser setup → pass **`--timeout=120000`** to the
  Remotion CLI still command.
- **Fallback only:** `fontFamily: "Montserrat, Arial, sans-serif"` → at least sans-serif (not serif)
  when the real font fails to load.

### If you MUST have the exact brand font in a headless still
- (a) Install the TTF into `C:\Windows\Fonts` (needs admin) so the headless Chromium finds it
  system-wide; OR
- (b) Accept the `@remotion/google-fonts` + `--timeout=120000` network approach (the `.ttf` in
  `public/fonts/` is NOT enough by itself).
- ALWAYS vision-check the rendered still for the correct font before claiming done.

## Web-app control surface (drive Remotion from HTML)

A Node `http` server serves an editor HTML; on POST it writes props to a temp JSON and runs the
CLI, returning the PNG as base64. See `references/webapp-control-recipe.md` for the full
server + HTML + the parametric `[Cliente]LetteringV2.tsx` (7 archetypes) pattern.

### `--props` gotcha
`still --props '{"k":"v"}'` passed through `child_process` with manual quote-escaping produced
NO error but the composition used its `defaultProps` (edit had zero effect). **Use
`--props-file <tmp.json>`** (write props to a temp file, pass the path) — far more robust.

### CLI invocation (this environment)
`node node_modules/@remotion/cli/remotion-cli.js still <entry.tsx> <compId> <out.png> --frame=N --props-file <tmp.json> --timeout=120000`