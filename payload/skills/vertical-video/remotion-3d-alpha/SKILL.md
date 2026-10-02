---
name: remotion-3d-alpha
description: 3D @remotion/three e ProRes 4444 alpha no Windows.
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

# Remotion 3D + ProRes 4444 Alpha (Windows)

Pipeline 100% local validado para entregar vídeo 3D com canal alpha pra compor no AE.

## 1. Setup do projeto
```
cd "C:/AI/<proj>" && "C:/Program Files/nodejs/npm.cmd" install --save remotion @remotion/cli @remotion/three three @react-three/fiber react react-dom
```
- **npm NÃO está no PATH do git-bash** — chame `"C:/Program Files/nodejs/npm.cmd"` por caminho completo. `command -v npm` volta vazio.
- `node` e `ffprobe`/`ffmpeg` (pra validar alpha) estão disponíveis.

## 2. PITFALLS do @remotion/three (causaram ~15 iterações — memorizar!)
### ❌ Mesh invisível / material não aplica
`material={OBJ}` como **PROP** NÃO funciona no `@remotion/three` — o mesh renderiza transparente/invisível.
✅ Use `<meshStandardMaterial>` como **elemento filho** do `<mesh>`:
```tsx
<mesh><boxGeometry args={[1,1,1]} /><meshStandardMaterial color="#E91E8C" metalness={0.3} roughness={0.3} /></mesh>
```

### ❌ Minified React error #130 ("element type is invalid")
Causado por `useCurrentFrame()` no componente que **contém** o `<ThreeCanvas>`.
✅ Nunca use `useCurrentFrame` no pai do Canvas. Anime com `useFrame` do `@react-three/fiber` **dentro de componentes filhos**:
```tsx
import {useFrame} from '@react-three/fiber';
function Spin({children,x}:{children:React.ReactNode;x:number}){
  const ref=useRef<any>(null);
  useFrame(({clock})=>{ if(!ref.current) return; ref.current.rotation.y=Math.sin(clock.elapsedTime*0.5)*0.35; });
  return <group ref={ref} position={[x,0,0]}>{children}</group>;
}
```

### ❌ useFrame fora do Canvas
`R3F: Hooks can only be used within the Canvas component!` — useFrame tem que estar em componente filho do `<ThreeCanvas>`, nunca no pai.

### ❌ ThreeCanvas sem dimensões
`Error: width/height required` — passe `width={1920} height={1080}` no `<ThreeCanvas>`.

### ⚠️ Metalness=1 sem env map = PRETO
Metal reflete o ambiente; sem environment map fica preto/invisível no fundo. Use `metalness` ~0.5–0.6 + `hemisphereLight` + `ambientLight` fortes, ou adicione `<Environment>` (precisa `@react-three/drei`).

## 3. Render headless (WebGL no Chrome)
Remotion headless precisa de flags pra WebGL funcionar no Windows:
```
--chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader
```
Comando still:
```
"./node_modules/.bin/remotion" still <CompID> out/frame.png --frame=75 --chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader
```

## 4. ProRes 4444 + ALPHA (transparência real)
**Erro comum:** `--alpha=straight` no CLI NÃO garante alpha se faltar o pixel format. Sem `yuva` o Remotion gera `yuv422p12le` (sem alpha) mesmo com prores 4444.
✅ No `remotion.config.ts`:
```ts
import {Config} from '@remotion/cli/config';
Config.setVideoImageFormat('png');
Config.setPixelFormat('yuva444p10le');   // yuva = COM alpha
Config.setCodec('prores');
Config.setProResProfile('4444');
Config.setOverwriteOutput(true);
```
Render:
```
"./node_modules/.bin/remotion" render <CompID> out/video/out.mov --chrome-flag=--use-gl=angle --chrome-flag=--use-angle=swiftshader --chrome-flag=--enable-unsafe-swiftshader
```

## 5. Validar o alpha (ffprobe + alphaextract)
```
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt out/video/out.mov
# esperado: pix_fmt=yuva444p12le  (o "A" = alpha)
ffmpeg -i out/video/out.mov -vf "alphaextract" -frames:v 1 alpha.png
# gera a máscara: branco=opaco (ícones), preto=transparente (fundo)
```

## 6. Cuidado no Windows (case-insensitive)
`rm -f src/root.tsx` apaga `Root.tsx` (mesmo arquivo no NTFS). Use nomes exatos e evite `rm` de arquivos que podem colidir em caixa.

## 7. Remotion Studio (preview ao vivo)
```
"./node_modules/.bin/remotion" studio --no-open --port=3939
```
Abre em http://localhost:3939 — usuário vê animando e aprova ANTES do render (regra: nunca gerar vídeo sem aprovação do frame).

## Estrutura típica de arquivos
- `src/Icons3D.tsx` — cena (ThreeCanvas + componentes filhos com useFrame)
- `src/Root.tsx` — `export const RemotionRoot` com `<Composition>` (uma com bg, uma sem bg/alpha)
- `src/index.tsx` — `registerRoot(RemotionRoot)`
- `remotion.config.ts` — config de alpha/prores

## Verificação final
Sempre rodar ffprobe E alphaextract antes de entregar "tem alpha". Não afirmar transparência sem o `pix_fmt=yuva*`.