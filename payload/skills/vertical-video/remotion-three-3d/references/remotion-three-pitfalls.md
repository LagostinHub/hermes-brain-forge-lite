# @remotion/three Pitfalls — exact failure signatures

Compiled from a real debugging session ([Cliente] [Sobrenome] 3D icons, Remotion 4.0.518, Windows headless). Each item: what you do → what breaks → the error string → the fix.

## P1 — useCurrentFrame in the <ThreeCanvas> parent
- DO: call `useCurrentFrame()` in the component that returns `<ThreeCanvas>`.
- BREAKS: render throws `Minified React error #130; ... args[]=undefined` (element type is invalid / undefined).
- Root cause: Remotion re-renders the sequence component per frame; combining that with the ThreeCanvas reconciler corrupts the element tree.
- FIX: animation must run inside the canvas via `useFrame` (from `@react-three/fiber`) in a CHILD component (e.g. `<SpinGroup>` holding a `useRef` and updating `ref.current.rotation`/`position`). `useFrame` cannot be in the parent either — it throws `R3F: Hooks can only be used within the Canvas component!`.

## P2 — material={OBJ} prop
- DO: `<mesh material={{color:'#fff', metalness:1}}>`.
- BREAKS: mesh is invisible (blank/white where geometry should be). No error thrown — silent.
- VERIFIED: a 1.5³ cube with `material={MAT}` object prop rendered blank; the SAME cube with `<meshStandardMaterial color="#E91E8C" .../>` as a child rendered pink. Tested both, only the child form shows.
- FIX: always `<mesh><boxGeometry .../><meshStandardMaterial .../></mesh>`. For shared materials, return the element from a component: `const Steel = () => <meshStandardMaterial color="#c8d0da" metalness={0.55} roughness={0.35} />;`.

## P3 — ProRes 4444 without yuva pixel format
- DO: `remotion render X out.mov --codec=prores --prores-profile=4444` (default pix_fmt).
- BREAKS: output is `yuv422p12le` (NO alpha). `ffmpeg -vf alphaextract` fails: `[Parsed_alphaextract_0] Requested planes not available.`
- FIX: pixel format `yuva444p10le`. Put in `remotion.config.ts` (see templates). After render, `ffprobe` must report `yuva444p...`. File size jumps (~54MB → ~82MB for 150 frames@1080p) once alpha is present — a good sanity signal.

## P4 — headless WebGL blank
- DO: `remotion still/render` on Windows without GL flags.
- BREAKS: `<ThreeCanvas>` renders nothing (background only, or white).
- FIX: `--chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader`.

## P5 — ThreeCanvas missing width/height
- BREAKS: `Error: width is required` (or height). ThreeCanvas does NOT inherit composition size.
- FIX: pass `width={1920} height={1080}` explicitly on `<ThreeCanvas>`.

## P6 — metalness:1 + no env map = black
- DO: `metalness:1.0` with only point/directional lights.
- BREAKS: object reflects nothing → renders black → invisible on dark bg. (This was the real reason the 3D icons "didn't appear" for many iterations — not the component structure.)
- FIX: metalness 0.5–0.6 + `<hemisphereLight>` for diffuse pickup; or add `Environment` from drei. Avoid metalness:1 unless you have an env map.

## Bisect recipe that worked
When a ThreeCanvas scene renders blank with no error:
1. Replace body with a single inline `<mesh><boxGeometry/><meshStandardMaterial color="red"/></mesh>` + ambientLight. If red cube shows → issue is in your meshes/materials, not the canvas.
2. Swap `color="red"` element for `material={OBJ}` prop → if it vanishes, you hit P2.
3. Add `useCurrentFrame` to parent → if #130, you hit P1.
4. Add `metalness:1` material → if black, you hit P6.
5. Render prores 4444, check `ffprobe pix_fmt` → if not `yuva*`, you hit P3.
