---
name: remotion-three-3d
description: Remotion + Three.js 3D with ProRes 4444 alpha export.
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

# Remotion + Three.js 3D Rendering

Animate real 3D objects (not flat vector) in Remotion via `@remotion/three` (wraps react-three-fiber), and deliver a **ProRes 4444 + alpha** clip for compositing.

This skill exists because `@remotion/three` has silent failure modes that cost ~30 debugging iterations to find. They are listed as PITFALLS below — read them before writing a single line.

## When to use
- User wants "realistic / 3D / complex" icons or objects (vs flat SVG/HTML).
- Delivery target is a transparent video (AE/Premiere composite) OR a transparent still.
- 100% local / OSS pipeline (no cloud render).

## Install (Windows, npm not on git-bash PATH)
`npm` is NOT on the MSYS PATH. Call it by absolute path:
```
"/c/Program Files/nodejs/npm.cmd" install --save remotion @remotion/cli @remotion/three three @react-three/fiber react react-dom
```
Versions that worked together: remotion 4.0.518, three 0.160, @react-three/fiber 8.x. Don't pin three to a version r3f doesn't support.

## Project shape
```
src/
  Root.tsx        -> registers RemotionRoot (Compositions)
  Icons3D.tsx     -> the 3D scene (see templates/)
remotion.config.ts -> forces alpha pixel format for 4444
index.tsx         -> registerRoot(RemotionRoot)
```
- `Root.tsx` exports `RemotionRoot` and defines `<Composition>` entries (one `withBg:true` for preview, one `withBg:false` for alpha delivery).
- `index.tsx`: `import {registerRoot} from 'remotion'; import {RemotionRoot} from './Root'; registerRoot(RemotionRoot);`
- Case-insensitive FS trap: `rm -f src/root.tsx` will DELETE `Root.tsx` on Windows. Never `rm` a differently-cased name of an existing file.

## ⚠️ PITFALLS (silent failures — read first)

### P1 — `useCurrentFrame` is FORBIDDEN in the component that renders `<ThreeCanvas>`
Using `useCurrentFrame()` in the Icons3D component (the one returning `<ThreeCanvas>`) throws `Minified React error #130` (element type undefined) at render.
**Fix:** never call `useCurrentFrame` in that component. Do animation inside the canvas via `useFrame` from `@react-three/fiber`, in child components (e.g. a `<SpinGroup>` wrapper that holds a ref and animates rotation/position). `useFrame` MUST live in a component that is a child of `<ThreeCanvas>` (it throws "Hooks can only be used within the Canvas component!" otherwise).

### P2 — `material={OBJ}` as a PROP does NOT render in @remotion/three
Passing `material={{color:'#fff', metalness:1}}` to `<mesh material={OBJ}>` makes the mesh invisible (renders blank/white, no geometry color). Confirmed: a cube with `material={OBJ}` is invisible; the same cube with `<meshStandardMaterial>` as a child element is visible.
**Fix:** always use the child-element form:
```jsx
<mesh><boxGeometry args={[1,1,1]} /><meshStandardMaterial color="#E91E8C" metalness={0.3} roughness={0.3} /></mesh>
```
For reuse, make a component that RETURNS the `<meshStandardMaterial>` element (e.g. `const Steel = () => <meshStandardMaterial color="#c8d0da" metalness={0.55} roughness={0.35} />;`) and drop it as a child. Do NOT pass the object as a prop.

### P3 — ProRes 4444 alpha needs `--pixel-format=yuva444p10le` (yu**v**a, not yuv)
Rendering with `--codec=prores --prores-profile=4444` but default pixel format produces `yuv422p12le` — NO alpha channel. `ffmpeg -vf alphaextract` then fails with "Requested planes not available".
**Fix:** set pixel format to `yuva444p10le` (the **A** = alpha). Best done in `remotion.config.ts` so it's permanent:
```ts
import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('png');
Config.setPixelFormat('yuva444p10le');
Config.setCodec('prores');
Config.setProResProfile('4444');
Config.setOverwriteOutput(true);
```
Then `remotion render Icons3D-Alpha out.mov` (no need for CLI flags). Verify: `ffprobe -show_entries stream=pix_fmt` → must report `yuva444p...`.

### P4 — Headless WebGL on Windows needs SwiftShader flags
Chrome headless can't do GPU WebGL; `<ThreeCanvas>` renders blank without these:
```
--chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader
```
Add them to both `remotion still` and `remotion render`.

### P5 — `ThreeCanvas` requires explicit `width`/`height`
Unlike a normal Remotion component, `<ThreeCanvas>` does NOT inherit composition dimensions. Pass `width={1920} height={1080}` or it errors ("width is required").

### P6 — Metals render BLACK without an environment map
`metalness:1.0` + only point/directional lights = reflects nothing = black object (invisible against dark bg). Either lower metalness (~0.55) OR add an env map. For quick local renders, use `metalness:0.5–0.6` + a `<hemisphereLight>` so metals catch diffuse light. Don't crank metalness to 1 without `Environment` from drei.

## Render commands
Still (for approval before video — REQUIRED per user workflow):
```
./node_modules/.bin/remotion still Icons3D-Preview out/preview-frame.png --frame=75 \
  --chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader
```
Video (4444 alpha, uses config pixel format):
```
./node_modules/.bin/remotion render Icons3D-Alpha out/video/icons-4444-alpha.mov \
  --chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader
```
Studio (live preview, no render):
```
./node_modules/.bin/remotion studio --no-open --port=3939
# open http://localhost:3939
```

## Validate the alpha before delivering
```
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of default=noprint_wrappers=1 out.mov
# must be yuva444p...
ffmpeg -i out.mov -vf alphaextract -frames:v 1 alpha.png   # should succeed
```
Then `vision_analyze` the `alpha.png` (white=opaque icons, black=transparent bg).

## User workflow note ([Cliente] [Sobrenome] campaign)
User requires: approve a still frame BEFORE any video render. Show the still (or studio link) and wait for "pode seguir" before running `remotion render`. Deliver the alpha .mov; also offer a `withBg` version for direct posts.

## references/
- `references/remotion-three-pitfalls.md` — the P1–P6 failure table with the exact error strings seen.
- `templates/Icons3D.tsx` — known-good 4-icon 3D scene (cutlery/bus/grad-cap/coins, glass discs, PBR materials, useFrame animation) — copy and modify.
- `templates/Root.tsx` — Composition registration (preview + alpha variants).
- `templates/remotion.config.ts` — alpha-enforcing config.