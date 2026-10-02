---
name: remotion-video-production
description: Recreate or build videos in Remotion. Windows CLI gotchas.
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

# Remotion Video Production

Recreate or build videos in Remotion. Two main modes:
- **Recreation:** given a reference `.mov`/`.mp4`, map its animations and rebuild them as Remotion components following a design system.
- **Template:** build reusable motion-graphics components (lower-thirds, cards, slogans) driven by a `timeline.json`.

## WHEN TO USE
- "recreate this video in Remotion", "build the campaign pieces", "make a vertical Reels/Stories template"
- Editing motion graphics for a client with a design-system (palette, pillars, lettering rules)

## WINDOWS CLI SETUP (CRITICAL — breaks silently without these)
Remotion CLI 4.0.512 on Windows (git-bash/MSYS) has sharp edges:

1. **`package.json` MUST have `"type": "module"`** — without it the CLI prints `No entry point specified.` and ignores your entry file. This is the #1 gotcha.
2. **Call the CLI via the sh wrapper, not node directly:**
   ```bash
   cd campaigns/<proj> && bash ./node_modules/.bin/remotion still src/RootEntry.tsx <comp-id> out/x.png --frame=75
   ```
   Calling `node node_modules/@remotion/cli/remotion-cli.js still <entry> ...` fails to parse positional args (same error). The `.bin/remotion` is a sh script — `bash` prefix is required.
3. **Project structure is strict:**
   ```
   <proj>/
   ├── package.json        # MUST have "type":"module"
   ├── tsconfig.json       # jsx:react-jsx, resolveJsonModule:true
   ├── src/
   │   ├── RootEntry.tsx   # registerRoot(RemotionVideo)
   │   ├── Root.tsx        # <Composition id=... component=... />
   │   ├── timeline.json   # imported by compositions (MUST live in src/)
   │   ├── compositions/   # Apresentacao.tsx (reads timeline.json)
   │   └── components/     # LowerThird.tsx, CardRoxo.tsx, etc
   └── public/footage/     # real video files (see assets below)
   ```
   Imports are relative: `compositions/X.tsx` → `../components/Y` and `../timeline.json`. If a component import fails with "doesn't exist .mjs/.cjs", the folder layout is wrong (components must be `src/components/`, not a flat `components/` at project root).
4. **Reuse a sibling install:** if a monorepo already has `packages/video-motion/node_modules`, junction it: `mklink /J <proj>/node_modules <vm>/node_modules`. Do NOT symlink (`mklink` without `/J` needs admin priv → WinError 1314).

## JUNCTION / PATHS ON WINDOWS (silent breakage)
- **`[CODES]\marca-2026\...` is often a JUNCTION to `[DRIVE_CAMPANHA]\remotion\...`** (or similar). `find /c/AI/...` does NOT follow the junction → files "disappear" (they're really at the `D:\` target). Always `find /d/...` (the real target) when hunting for project files. `ls` of the junction root works; recursive tools blind it.
- **`node_modules` may only exist at the REAL path**, not via the `[CODES]\...` junction. If `bash ./node_modules/.bin/remotion` says "No such file or directory" under `[CODES]\...`, cd into the `D:\...` real path and run there.
- Prefer operating directly on the `D:\` real path for renders to avoid junction surprises.

## ASSET HANDLING (video/footage)
- **Chrome headless BLOCKS `file:///` in `<video src>`** → `Not allowed to load local resource`. Always use `staticFile()`:
  ```tsx
  import { staticFile } from 'remotion';
  <video src={staticFile(`footage/${filename}`)} autoPlay muted loop />
  ```
- **`public/footage/` must contain REAL copied files**, not a junction to a network drive. The bundler copies `public/` to a temp dir and **fails with EPERM on network junctions**. Copy the specific takes you need (or a local-junction to a local drive).
- **Source footages on Google Drive / network ALSO corrupt ffmpeg output** — reading the network stream yields truncated/empty/crash results (exit code 4294967294). Copy the source take to a LOCAL drive (e.g. `[DRIVE_CAMPANHA]\WORKING\`) before any ffmpeg processing. BOTH the input and `public/` must be local — the source rule is separate from the `public/` junction rule.
- For 135+ footages, copy only the ~6 takes your `timeline.json` references.

## FFMPEG FOOTAGE PRE-PROCESSING (rotation + audio)
Footages are often shot vertical but recorded horizontal (person "on their side"). Remotion needs upright 1080×1920 clips WITH audio. Pre-process each take BEFORE rendering:
```bash
# 1) Copy source OFF Google Drive / network first (see JUNCTION/PATHS above) to a local drive
# 2) Rotate 90° CCW + crop to 1080x1920 + keep AAC audio
ffmpeg -y -i LOCAL_SRC.MOV \
  -vf "transpose=2,scale=1080:1920:force_original_aspect_ratio=decrease,crop=1080:1920,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1" \
  -c:a aac -b:a 192k -c:v libx264 -preset fast -crf 20 OUT_processed.mp4
```
- **Verify rotation against the ORIGINAL file, never an already-processed one.** A session burned many iterations because `transpose=2` was tested on a file that was ALREADY rotated, yielding a false "upside-down" verdict. Always re-extract a frame from the untouched source.
- **`transpose=2` = CCW 90°** and is the STABLE filter. `rotate=180*PI/180` and bare `vflip,hflip` CRASH ffmpeg 8.1.2 (exit code 4294967294). If you need an extra flip, chain it as `transpose=2,vflip,hflip` (the comma-chain works; the bare `vflip,hflip` as the sole filter crashes).
- **Deterministic orientation check:** ask vision_analyze a strict either/or — *"cabeça da pessoa no TOPO ou FUNDO da imagem? TOPO ou FUNDO"* — NOT a descriptive question (the model contradicts itself in long answers). TOPO = upright = correct.
- **Audio:** the default `<video muted loop>` STRIPS audio from the render. For a recreation that keeps the original voice, set `muted={false}` AND add a sibling `<audio src={staticFile(...)} />` tag, then render with `--audio-codec=aac`. Confirm with ffprobe that the output has `stream codec_type=audio`.

## FFMPEG ON WINDOWS
Path is not on PATH in bash/MSYS. Use full path:
`%USERPROFILE%\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe`
(Or use `execute_code` with `subprocess` + raw Windows paths — more reliable than bash for ffmpeg.)

### DOT-MOV BASH/MSYS BUG
**Problema**: bash/MSYS cannot open `.mov` files via ffmpeg/ffprobe (returns exit 4294967294 "No such file") even when the file exists.
**Workaround**: use `execute_code` with Python `subprocess` and forward-slash Windows paths `C:/AI/...`. Never use `/c/AI/...` with ffmpeg on `.mov` files.
- If the file must be read from a CloudFolder/network path, copy it locally first with `cmd /c copy`, then run ffmpeg via Python subprocess.
1. **Extract frames at two densities** (vision loses layers on sparse samples):
   - Sparse: `ffmpeg -vf "select='not(mod(n\,48))',scale=540:-1"` (~1 frame / 2s) for scene-map via histogram.
   - Dense: per-window `select='between(n\,A\,B)'` at `scale=540:-1` around suspected text/animation moments.
2. **Transcribe text with vision_analyze** — but see pitfall: Windows **subfolder** paths fail (`\` doubled to `\\`). Flatten frames to one directory (e.g. `frames_flat/f_0001.png`) — flat paths work, nested don't. Model changes can fix transient 404s; retry after user switches model.
3. **Build `timeline.json`** with blocks: `{ id, start_sec, duration_sec, footage, legendas[], slogans[], cards[], numero?, }` + global `disclaimer`.
4. **One component per element type** (LowerThird=legenda amarela, SloganMagenta, CardRoxo, Final[Cliente], DisclaimerTSE, FootageLayer). Each takes `startFrame/endFrame` and animates with `interpolate` + `Easing` (entrance fade+slide-up 8px, pop-in scale, burst).
5. **Composition reads timeline, picks current block by `frame/fps`, renders active layers.**
6. **Render:** `bash ./node_modules/.bin/remotion render src/RootEntry.tsx <id> <out.mp4> --fps=30 --codec=h264`
7. **Validate:** extract stills at block midpoints, vision_analyze each, score 1-10, fix overlaps/safe-area.

## DESIGN-SYSTEM RULES (apply from client docs)
- Never solid/empty background → gradient or atmosphere (overlay `linear-gradient` for legibility on footage).
- Depth: bokeh (from footage) + texture on cards (canvas/sarja, not flat fill).
- Lettering: cargo/name left-aligned, icons sized-to-text, symmetric borders, max 2 lines.
- Motion: 3 layers min, never linear spatial, never opacity-only — add micro-move (translateY 8px).
- Compliance TSE: disclaimer always vertical-right (CNPJ + partido).

## PROJECT ORGANIZATION (user preference)
Keep deliverables in **client folders**, not the generic `video-motion` package:
`campaigns/<client>-<year>/` holds `timeline.json`, `components/`, `compositions/`, `public/footage/`.
Renders go to `DELIVERY/<YYMM>/` (e.g. `[DRIVE_CAMPANHA]\DELIVERY\1908\`).

## FONT LOADING (Windows headless `renderStill` bug)
Remotion 4.0.500/512 on Windows Chromium headless **does NOT load custom fonts** — even fully local ones — in `renderStill` / `still`. Confirmed-failing approaches (all produce a system **serif fallback**, never the target font):
1. `FontFace` API + `staticFile("fonts/X.ttf")` `url()`
2. `fetch(staticFile(...)).arrayBuffer()` → `new FontFace(name, buf)`
3. `FontFace` + `data:font/ttf;base64,<embarcado>` (1.2 MB string)
4. `@font-face { src: url(data:...) }` via `<style dangerouslySetInnerHTML>`
5. `@font-face { src: url(./X.ttf) }` in a CSS file imported by the component (webpack asset)
6. `new FontFace(name, "url(file:///C:/.../X.ttf)")` → Chromium headless logs `Browser failed to load file:///... (Font)` and falls back.
7. `fetch("http://localhost:PORT/fonts/X.ttf").arrayBuffer()` → Chromium headless runs in an isolated network context; `localhost` fetch fails with `net::ERR_FAILED` even when a local HTTP font server IS listening.
8. `@remotion/google-fonts/X` import → works ONLY when the headless has working network AND the 90-request font download finishes within the 30s default timeout. The headless **does have network** (`fonts.gstatic.com` 90 requests are attempted), but it is slow/unreliable: sometimes renders the target font <30s, sometimes times out at 120s+. NOT a dependable path. The `renderStill` **programmatic API** (`@remotion/renderer`) is worse: it ignores `entryPoint`/`inputProps` and renders a stale cached bundle regardless of what you pass — do not use it for dynamic entries.

**Root cause:** the still renderer does not wait for / apply web fonts; it paints with the system fallback. Installing the font into `C:\Windows\Fonts` requires admin (denied in background sessions) and a Chromium restart.

**Workaround that works NOW:**
- Set `fontFamily: "Montserrat, 'Segoe UI', Arial, sans-serif"` (Segoe UI / Arial are Windows system sans-serifs → no serifs in the still). Layout/color/animation are fully validatable; Montserrat applies automatically once installed in the system or on a networked headless.
- To load fonts offline for real delivery, run the render on a machine where the font is in `C:\Windows\Fonts`, OR test `remotion render` (full render, not `still`) which sometimes applies fonts the still path skips — verify per project.
- ✅ **CONFIRMADO 2026-09-12: fontes customizadas FUNCIONAM no render programático.**
  `@font-face { font-family:'Montserrat'; src: url('./fonts/Montserrat-Black.ttf') format('truetype'); font-weight:900; }`
  em `src/fonts.css` (o `.ttf` em `src/fonts/`, resolvido pelo webpack) + `bundler.bundle()` →
  `renderer.renderMedia()` **pintou Montserrat Black corretamente** (com `fontWeight: 900` no elemento).
  Ou seja: a falha acima é **específica de `renderStill`/`still`** — NÃO generalizar para o render
  completo. O caminho `bundle()` + `renderMedia()` é o que funciona e deve ser o default.

**Isolated entry to avoid CDN-font breakage:** if ANY component in the root pulls a CDN font (e.g. `@remotion/google-fonts/spacegrotesk`), the whole `still` fails with `ERR_NAME_NOT_RESOLVED`. Create a separate entry (e.g. `letteringV2Entry.tsx`) that registers ONLY the compositions you want, so the CDN font is never imported.

**Font files:** keep the real `.ttf` in `public/fonts/` (for reference / future system install) AND import via `src/fonts.css` (`@font-face` with relative `./montserrat/X.ttf`) so the webpack bundle is correct even though the headless still won't paint it.

**PITFALL — Remotion CLI as a child process of a Node HTTP server renders STALE bundles.** When you drive `remotion-cli still` from a web-app server (e.g. `child_process.exec/spawn` or `renderStill` API), the headless renders a *cached* bundle (often a previously-bundled entry, e.g. one with hardcoded text) and silently ignores the freshly-written dynamic entry — even when the identical `node ... still dynamicEntry.tsx ...` command works perfectly when run interactively in a terminal. Symptom: server/API returns a PNG with the WRONG content (e.g. old hardcoded text) while `cli still` of the exact same file, run manually, returns the correct content. Spawning via `C:\Program Files\Git\bin\bash.exe -c` instead of `cmd.exe` did NOT fix it. **If you hit this:** the entry file is fine — the problem is the server-child-process bundling context. Prefer generating the still by shelling out to the CLI from an interactive/foreground context, or pre-bundle a fixed set of compositions (one per archetype) and drive them with `--props-file` rather than a freshly-written entry per request. Documented 2026-08-23 ([Cliente] [Sobrenome] lettering web-app).

See `references/headless-font-loading.md` for the full failure transcript.

## VERTICAL SOCIAL VIDEO (Reels / TikTok / Stories) — REGRAS DE ENTREGA
Vídeo 1080×1920 para feed IMPULSIONADO. Grade completa em
`references/vertical-social-video-layout.md`; medições em `scripts/fit_text_and_measure_cutout.py`.

### 1. SAFE MARGINS (o erro mais caro — cliente reclama na hora)
A UI do Instagram cobre topo e base. **Nunca use a tela toda:**
```tsx
const SAFE = { top: 250, bottom: 400, side: 64 };   // 1080x1920
const SAFE_W = 1080 - SAFE.side * 2;   // 952 -> largura útil p/ texto
const SAFE_BOT = 1920 - SAFE.bottom;   // 1520
```
- Só **foto/fundo** pode sangrar; texto, disclaimer, badges e faixas ficam DENTRO.
- **VALIDAR desenhando a guia** sobre um frame renderizado e olhando:
  `ImageDraw.rectangle([64,250,1016,1520], outline=(0,255,0), width=6)`.
- **Elementos de CARROSSEL não vão em vídeo**: dots (as 5 bolinhas) e pill "Deslize e confira" —
  em vídeo não fazem sentido E os dots caem em cima do rosto do sujeito. Remover os dois.
- Rosto do sujeito entre **y 780 e 1200** (dentro do safe e acima dos overlays de rodapé).

### 2. TEXTO GRANDE — calibrar, não chutar
Chutar `fontSize` dá texto pequeno flutuando. Medir a fonte com PIL e resolver o tamanho da linha
para ocupar ~88% de `SAFE_W`: `size_for()` em `scripts/fit_text_and_measure_cutout.py`.
Regra: **palavra curta → tamanho grande**; monte o headline em 2–3 linhas de largura cheia
(bloco ≈ 20–29% da altura), nunca uma linha pequena centralizada.

### 3. CONTRASTE DO LETTERING — contorno, não sombra colorida
- Sombra translúcida sobre cor saturada vira **sujeira** (preto 30% sobre amarelo = oliva).
  Usar **sombra dura sólida** (`drop-shadow(6px 7px 0 #111)`, sem blur) ou nenhuma.
- O destaque vem de **CONTORNO (stroke) espesso** com cor escolhida pelo fundo:
  branco sobre roxo/foto escura, preto sobre foto clara.
- ⚠️ **Texto da cor do burst = ilegível** (amarelo sobre starburst amarelo, branco sobre fundo
  amarelo). Checar a dupla cor-do-texto × cor-do-fundo ANTES de renderizar.
- ⚠️ **Texto estoura a margem e corta** quando o `fontSize` calibrado não conta contorno+tracking.
  Validar no frame renderizado, não no código.

### 4. STOP MOTION / "quadro-a-quadro" (quando o cliente quer travado)
Quantizar o tempo em degraus — nada interpola suave:
```tsx
const STEP = 3;                                  // 30fps -> 10 poses/s
function useStep(step = STEP, delay = 0) {
  const f = useCurrentFrame();
  return Math.floor(Math.max(0, f - delay) / step) * step;
}
function usePunch(delay = 0, period = 9, steps = [1, 1.13, 1.04, 1.18, 1.07]) {
  return steps[Math.floor(useStep(STEP, delay) / period) % steps.length];
}
```
Todos os hooks de animação usam `useStep` no lugar de `useCurrentFrame`; `useFade` vira
**corte seco** (0→1 no primeiro degrau). Micro-movimentos também em degraus (bob, spin, jitter).
**Verificar**: extrair frames consecutivos e comparar — precisa haver pares com diff **0.00**
(parado) seguidos de um salto. ⚠️ GIF de preview com **fps=15** (a 10fps o GIF amostra exatamente
as poses e esconde o efeito).

### 5. ÁUDIO no render programático — FUNCIONA
`<Audio src={staticFile('trilha.mp3')} volume={0.85} />` + `renderer.renderMedia({codec:'h264'})`
→ sai **AAC estéreo** no mp4. (Diferente de `<video>`, que não leva áudio.)
- Preparar a trilha no ffmpeg ANTES, duração ≈ duração da composição e com fades:
  `ffmpeg -y -i SRC.mp3 -t 17 -af "afade=t=in:st=0:d=0.4,afade=t=out:st=14:d=3,volume=0.85" -c:a libmp3lame -b:a 192k public/trilha.mp3`
- Validar: `ffprobe -select_streams a -show_entries stream=codec_name,channels,duration -of default=nw=1 out.mp4`

### 6. GOTCHAS DE REACT/CSS QUE QUEBRAM EM SILÊNCIO
- **`-webkit-text-stroke` + `filter: drop-shadow` no MESMO elemento → artefato de RETÂNGULOS**
  sobre o glifo no Chromium headless (visto com texto a ~330px). ✅ **2 camadas**: `<span>` absoluto
  só com o stroke (atrás) + `<span>` relativo com o fill; o `drop-shadow` vai no **wrapper**.
- **Hooks dentro de `.map()`** quebram a ordem → extrair subcomponente.
- **Spread de style sobrescreve `transform`**: `{left:'50%', transform:'translateX(-50%)', ...st}`
  perde o translate. ✅ centralizar com `left:'50%'` + `marginLeft: -w/2`.
- **`transform: scale()` escala em torno do CENTRO** — para punch-in que preserva o rosto usar
  `transformOrigin: '50% 28%'`.

## TTF MASQUERADE — HTML DISGUISED AS FONT (2026-09-12)
`public/fonts/Montserrat-*.ttf` were **HTML pages, not fonts** (305 KB `<!DOCTYPE html>` instead of `00010000` TTF magic). The build succeeded, the render fell back silently to Arial/serif — no error, just wrong type. Detection:
```bash
head -c 4 public/fonts/X.ttf | od -An -tx1  # 00010000 = real TTF, 3c21444f = HTML
stat -c%s public/fonts/*.ttf                 # 3054xx = suspect (HTML), 3441xx = real
```
Fix: `public/fonts/*.ttf` valid copies live in `[CODES]\profile\.cache\fonts\montserrat\` (344 KB) and `[marca]-subtitles/public/fonts/`. Copy the valid files in. In `src/[Cliente]FilmeCartao.tsx` the `@font-face` for weight 500 was dead — remap `500 → 800` (ExtraBold) so no text ever falls back. See `references/remotion-ttf-html-mislabel.md` for full transcript.

## PITFALLS
- `type:module` missing → "No entry point specified" (silent).
- `file:///` in `<video>` → blocked; use `staticFile()`.
- Network-drive junction in `public/` → EPERM at bundle copy; copy real files.
- **Source read from Google Drive / network → ffmpeg truncates/crashes (rc 4294967294); copy source to local drive first.**
- **`[CODES]\...` is often a JUNCTION to `D:\...`; `find /c/AI/...` goes blind — use the real `D:\` path for files AND `node_modules`.**
- Nested Windows paths in vision_analyze → `\\` doubling; flatten frames.
- `node cli.js args` parses wrong; use `bash .bin/remotion`.
- Components in flat `components/` (not `src/components/`) → webpack "doesn't exist" error.
- **`<video muted>` STRIPS audio from render; use `muted={false}` + `<audio>` + `--audio-codec=aac`.**
- **ffmpeg `rotate=` and bare `vflip,hflip` CRASH on 8.1.2; use `transpose=2`. Verify rotation on the ORIGINAL file, not a processed one.**

## @REMOTION/THREE (3D) — CRITICAL PITFALLS
Building 3D scenes with `@remotion/three` (ThreeCanvas + react-three-fiber) has silent failure modes that do NOT throw obvious errors — they render blank frames or React error #130. Each below was found by bisecting and is reproducible. See the `remotion-three-3d` skill for the full bisect transcript.

1. **`material={OBJ}` as a PROP does NOT render.** `<mesh material={{color:'#fff',metalness:1}}>` produces an INVISIBLE mesh (blank/white frame) — no error. You MUST use `<meshStandardMaterial>` (or `<meshBasicMaterial>`) as a CHILD ELEMENT:
   ```tsx
   <mesh><boxGeometry args={[1,1,1]} /><meshStandardMaterial color="#c8d0da" metalness={0.55} roughness={0.35} /></mesh>
   ```
   Define reusable materials as small components returning the element: `const Steel = () => <meshStandardMaterial color="#c8d0da" metalness={0.55} roughness={0.35} />;` then `<mesh><boxGeometry .../><Steel/></mesh>`.

2. **`useCurrentFrame()` must NOT be called in the component that renders `<ThreeCanvas>`.** It throws React error #130 ("element type is invalid") at render. Animate instead with **`useFrame` from `@react-three/fiber`** INSIDE child components of the canvas (e.g. a `SpinGroup` that rotates/translates a `<group ref>`). `useFrame` works fine in child components and renders correctly.

3. **`<ThreeCanvas>` needs explicit `width`/`height` props** (it does NOT inherit from the Composition's width/height). Omitting them → `The "width" prop of the <ThreeCanvas /> component must be a number, but you passed a value of type undefined`. Pass `width={1920} height={1080}`.

4. **WebGL is OFF in the headless renderer by default.** `remotion still/render` of a ThreeCanvas needs:
   `--chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader`
   Without these you get either a blank frame or a silent WebGL context failure.

5. **Metalness=1.0 + no environment map = BLACK/invisible.** In headless (no env map), a fully-metallic material reflects nothing and reads as black against a dark bg. Fixes: (a) add a `<hemisphereLight color="#E91E8C" groundColor="#3D1152" intensity={0.6} />` for diffuse metal fill, (b) keep metalness ≤ ~0.6, or (c) add an env map (`Environment` from `@react-three/drei`). For brand-gold/steel, metalness 0.55–0.6 + hemisphereLight reads correctly.

6. **Component children of `<ThreeCanvas>` that use `useFrame` DO render** (confirmed). So the working pattern is: `ThreeCanvas` (no `useCurrentFrame` in its parent component) → inline `<meshStandardMaterial>` elements → child components (`SpinGroup`, `Cap`, etc.) that call `useFrame` for animation. DO NOT inline `useFrame` in the parent (see #2) and DO NOT pass `material={OBJ}` (see #1).

7. **`registerRoot` location:** the file passed as entry must call `registerRoot(RemotionRoot)`. If you split `Root.tsx` (compositions) and `index.tsx` (registerRoot), be careful: on case-insensitive Windows FS, `rm -f src/root.tsx` deletes `Root.tsx` (same file) — lost work. Use exact-case names and avoid lowercase aliases.

## VIDEO DEBATE SATIRE WORKFLOW (parlamentares/câmara)

Quando o input é um vídeo de sessão de câmara/assembleia com debate entre vereadores/políticos, e você precisa montar um montagem satírica com cortes rápidos + letterings, siga:

### ETAPA 1: TRANSCRIÇÃO PRECISA (yt-dlp)
Não use web_extract — páginas YouTube têm 1,2M de caractéres de JS. Use yt-dlp para subtitles:
```bash
yt-dlp --write-subs --sub-lang pt-BR,pt,en --convert-subs srt \
  -o "C:/AI/profile/.cache/yt_temp/ID.%js_ext%.pt.srt" \
  "URL_DO_VÍDEO"
```
- O output template `%(lang)s` não é necessário se você fixa uma língua.
- **Pitfall**: yt-dlp pode salvar em `\\c\\AI\\...` (escapado) em vez de `[CODES]\...`. Force path Windows nativo: `-o "C:/AI/..."`.
- **Merge de vídeo**: use `-S ext:mp4 --merge-output-format mp4` para forçar mp4 (o merge default pega webm e duplica extensão).

### ETAPA 2: ANÁLISE DE FALAS COM TIMESTAMPS
1. Converta SRT pra um formato de busca (timestamp + texto) para grep:
```python
# Python inline via venv
import re
with open(r"[CODES]\profile\.cache\yt_temp\VIDEO.pt.srt") as f:
    for num, ts, text in re.findall(r'(\d+)\n(\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d)\n(.+?)(?=\n\n|\Z)', f.read(), re.DOTALL):
    print(f"[{ts}] {' '.join(re.sub(r'<[^>]+>','',text).split())}")
```
2. **Busca por nomes**: `grep -n -i "cliente\|marca"` (note: [Cliente] [Sobrenome] pode aparecer como "[Sobrenome]" ou "vereadora [Cliente]").
3. **Extrai trechos**: use `sed -n 'LINHA_START,LINHA_ENDp'` com os números de linha do grep.
4. **Busca contextual**: `grep -n -A5 -B5 "banheiro trans"` pra pegar falas de debate (onde um candidato cita outro).

### ETAPA 3: MAPEAMENTO DE TIMESTAMP → FFmpeg
Relacione SRT timestamps com timestamps do vídeo:
- **SRT**: `02:15:43,880 --> 02:15:46,030`
- **FFmpeg**: `-ss 02:15:43 -to 02:21:18`
- **Dica**: o início da fala é quase sempre o primeiro timestamp que contém o nome do vereador ou "vereador X fala sobre Y".

### ETAPA 4: MONTAGEM DE ROTEIRO
Documente em markdown:
- **Personagem** | Timestamp início → fim | SRT linhas | Trecho curto
- **🎯 Letterings sugeridos** (frases-chave que vão pro screen)
- **🎬 Estrutura cronológica** (tabela de timing do vídeo final)
- **🔪 Instruções de corte** (códigos ffmpeg copiáveis)

Veja `references/debate-satire-example.md` para um exemplo real (Câmara Municipal de Curitiba, sessão 04/05/2026).

## REFERENCES
- `references/vertical-social-video-layout.md` — grade de safe margins, arquétipos de composição e checklist de entrega p/ Reels/TikTok.
- `scripts/fit_text_and_measure_cutout.py` — calibrar `fontSize` p/ largura-alvo e medir bbox de cutout (headFrac/centerX/width).
- `references/headless-font-loading.md` — 5 font-loading approaches that FAIL in Windows headless `renderStill` + the Arial-fallback workaround.
- `templates/timeline.json` — schema example (blocks + disclaimer).
- `templates/package.json` — minimal valid Remotion project manifest.
- `templates/RootEntry.tsx` — registerRoot boilerplate.
