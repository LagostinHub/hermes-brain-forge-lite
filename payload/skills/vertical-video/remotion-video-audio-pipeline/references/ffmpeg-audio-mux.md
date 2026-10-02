# ffmpeg Audio Concat + Mux Script (Remotion 2-stage pipeline)

Given a `timeline.json` with `blocos[]` each having `footage`, `start_sec`, `duration_sec`,
and a `public/footage_processed/` dir holding `<FOOTAGE_BASENAME>_processed.mp4` files
(already rotated/cropped to 1080x1920).

## Python (run via execute_code / hermes_tools terminal)
```python
import subprocess, os, json

FF = r"C:\...\ffmpeg.exe"  # your ffmpeg path
CAMPAIGN = r"[DRIVE_CAMPANHA]\remotion\campaigns\apresentacao-2026"
PROC = f"{CAMPAIGN}\\public\\footage_processed"
WORK = r"[DRIVE_CAMPANHA]\WORKING"

with open(f"{CAMPAIGN}\\src\\timeline.json") as f:
    timeline = json.load(f)

concat_list = f"{WORK}\\audio_concat.txt"
with open(concat_list, 'w') as cl:
    for b in timeline['blocos']:
        take = b['footage'].replace('.MOV','_processed.mp4').replace('.mov','_processed.mp4')
        src = f"{PROC}\\{take}"
        dur = b['duration_sec']
        seg = f"{WORK}\\audio_seg_{b['id']}.aac"
        subprocess.run([FF, "-y", "-i", src, "-t", str(dur), "-vn", "-acodec", "copy", seg], check=True)
        cl.write(f"file '{seg}'\n")

combined = f"{WORK}\\audio_combined.aac"
subprocess.run([FF, "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", combined], check=True)

V = r"[DRIVE_CAMPANHA]\DELIVERY\1908\[MARCA]_APRESENTACAO_REMOTION.mp4"  # Remotion video-only render
OUT = r"[DRIVE_CAMPANHA]\DELIVERY\1908\[MARCA]_APRESENTACAO_REMOTION_FINAL.mp4"
subprocess.run([FF, "-y", "-i", V, "-i", combined, "-c:v", "copy", "-c:a", "aac",
                "-map", "0:v:0", "-map", "1:a:0", "-shortest", OUT], check=True)
```

## Verify audio landed
```python
import subprocess, struct, os
FF = r"C:\...\ffmpeg.exe"
MP4 = OUT
WAV = r"[DRIVE_CAMPANHA]\WORKING\check.wav"
subprocess.run([FF, "-y", "-i", MP4, "-vn", "-acodec", "pcm_s16le", WAV], check=True)
with open(WAV,'rb') as f: data = f.read()
samples = data[44:]
n = len(samples)//2
vals = struct.unpack(f"<{n}h", samples[:n*2])
rms = (sum(v*v for v in vals)/len(vals))**.5
nonzero = sum(1 for v in vals if abs(v) > 100)
print(f"RMS={rms:.1f} nonzero={100*nonzero/len(vals):.1f}% -> {'AUDIO OK' if nonzero>0 else 'SILENT'}")
```

## Gotcha: rotated-source re-encode
If source footage is 90° CCW (head to the right), preprocess each take BEFORE this stage:
`ffmpeg -i SRC.MOV -vf "transpose=2,scale=1080:1920:force_original_aspect_ratio=decrease,crop=1080:1920,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1" -c:a aac -c:v libx264 -preset fast -crf 20 OUT_processed.mp4`
Verify with one extracted frame + vision "TOPO or FUNDO". Never chain `transpose=2,vflip,hflip`.
