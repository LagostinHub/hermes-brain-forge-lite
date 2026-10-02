# Pipeline de render + QC (Remotion no Windows)

## 0) Scaffold do projeto
```
projeto/
  package.json            (remotion, react, react-dom)
  render.cjs              (bundler.bundle() + renderer.renderMedia())
  public/                 (assets: fotos, PNGs oficiais, trilha.mp3, legal_overlay.png)
  src/
    Root.tsx  -> registerRoot(RemotionRoot)
    Composition.tsx        (registra TODAS as composicoes)
    fonts.css              (@font-face -> url('./fonts/X.ttf'))
    fonts/*.ttf
    Film.tsx               (a composicao)
```

**Registrar a composicao** em `src/Composition.tsx`:
```tsx
<Composition id="MeuFilme" component={VerticalFilm}
  durationInFrames={SEGUNDOS * 30} fps={30} width={1080} height={1920} />
```
`durationInFrames` **tem que** casar com a trilha: `frames = segundos × fps`.

## 1) Render
```bash
cd <projeto> && node render.cjs <CompId> saida.mp4 2>&1 | tail -5
```
⚠️ **`npx`/`npm` não rodam no bash MSYS deste host.** Use `node render.cjs` ou `node_modules/.bin/remotion`.
⚠️ Render é demorado (~2–4 min p/ 30s). Rodar em **background** e seguir a vida:
```bash
# tool terminal com background=true e notify=true
cd /c/AI/<projeto> && node render.cjs [cliente]FilmV13 filmv13.mp4 2>&1 | tail -5
```

## 2) QC OBRIGATÓRIO — os 5 checks
```bash
F=saida.mp4

# (1) nenhum frame preto
ffmpeg -v info -i $F -vf "blackdetect=d=0.2:pix_th=0.10" -an -f null - 2>&1 | grep -c "black_start"

# (2) duracao do audio == duracao do video (a trilha tem que ir ate o fim)
ffprobe -v error -show_entries format=duration -of csv=p=0 $F
ffprobe -v error -select_streams a:0 -show_entries stream=duration -of csv=p=0 $F

# (3) loudness integrado (alvo Reels/IG: -14 LUFS)
ffmpeg -v info -i $F -af ebur128=peak=true -vn -f null - 2>&1 | grep -A 1 "Integrated loudness" | grep "I:"

# (4) true peak (tem que ser NEGATIVO; alvo <= -1 dBTP)
ffmpeg -v info -i $F -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"

# (5) streams/formatos
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,channels -of default=noprint_wrappers=1 $F
```

## 3) Normalizar loudness SEM re-encodar o vídeo
O render do Remotion sai **quente** (jingle masterizado no talo: medido −7,6 a −8,7 LUFS,
true peak positivo). Levante o ganho **estático** e copie o vídeo:
```bash
I=-8.7                       # valor medido no passo (3)
G=$(awk -v i="$I" 'BEGIN{printf "%.1f", -14 - i}')
ffmpeg -y -i $F -c:v copy -af "volume=${G}dB" -c:a aac -b:a 256k -movflags +faststart saida_ig.mp4
```
❌ **NÃO usar `loudnorm`** — é dinâmico e destrói a dinâmica de música masterizada.

**Provar que o vídeo não mudou** (tem que dar o MESMO MD5):
```bash
ffmpeg -v error -i $F        -map 0:v -c copy -f md5 -
ffmpeg -v error -i saida_ig.mp4 -map 0:v -c copy -f md5 -
```

## 4) Provar que um overlay/asset entrou no render
Renderize um frame e cheque a região esperada em Python:
```python
from PIL import Image; import numpy as np
a = np.array(Image.open('frame.jpg').convert('RGB')).astype(int)
band = a[:, 995:1017]; lum = band.mean(axis=2)
ys = np.where((lum > 190).any(axis=1))[0]
print('overlay detectado em y %d..%d' % (ys.min(), ys.max()))   # ex: 412..1505
```

## 5) Trilha: corte com fade (evita talo seco)
```bash
ffmpeg -y -ss 55.5 -i MASTER.mp4 -t 28.5 -vn \
  -af "afade=t=out:st=28.0:d=0.5" -c:a libmp3lame -b:a 192k public/trilha.mp3
```
Se o trecho escolhido já cai naturalmente no silêncio, **não force fade** — deixe a música morrer sozinha.
**Provar o rabo do áudio** (fraciona o envelope em janelas de 0,2–0,3 s e imprime os últimos 3 s).

## 6) Entrega
- Copie para a pasta de entrega **e** para o nome canônico.
- Gere um **player HTML** ao lado do mp4 (src **relativo**) — ver skill `hermes-desktop-inline-video`.
  O chat do Hermes **não toca `MEDIA:` de vídeo** (usa protocolo `hermes-media://` que falha).
  Abra com `desktop_preview action=open` e mande `::preview{file="..."}` no chat.
- Reporte sempre: duração, LUFS, pico, MD5 e os checks que passaram.

## 7) Escolher foto quando você não consegue ver imagens
`vision_analyze` pode estar fora (404/timeout). Fallback que funciona:
- Monte uma **folha de contato numerada** (PIL, grid + barra com nº e nome) e mande por `MEDIA:`.
  O usuário responde só o número.
- Para **NEF/CR2 (RAW)** o ffmpeg **não abre**; extraia o JPEG embutido varrendo `\xff\xd8\xff`/`\xff\xd9`
  (maior segmento). HEIC o ffmpeg abre normal.
- Analise cor por código quando precisar decidir sem ver: grid de saturação + matiz dominante.
