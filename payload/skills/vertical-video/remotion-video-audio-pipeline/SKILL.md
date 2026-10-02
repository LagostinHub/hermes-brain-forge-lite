---
name: remotion-video-audio-pipeline
description: Render Remotion videos that keep their audio via ffmpeg mux.
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

# Remotion Video + Audio Pipeline

## When to use
A Remotion composition plays a footage clip as background and the final MP4 must contain BOTH visuals AND the original audio (talking-head / campaign / presenter video).

## The core pitfall (know this before rendering)
In Remotion 4.0.x (verified 4.0.512), embedding footage has three options — only ONE renders the video stream, and it drops audio:

| Approach | Video in output? | Audio in output? |
|----------|-----------------|------------------|
| Raw `<video src autoPlay muted />` (HTML) | ✅ Yes | ❌ No (headless never unmutes) |
| `<OffthreadVideo>` from `remotion` | ❌ No (stream dropped → ~26 MB frozen) | ❌ No |
| `<Video>` (Html5Video) from `remotion` | ❌ No (stream dropped, same ~26 MB) | ❌ No |

Symptom of broken approaches: output ~26 MB for a 102 s 1080×1920 clip (vs ~120 MB with video), frame-diff between two timestamps = 0 (frozen). Single-frame `still` WORKS (video shows) because it seeks correctly; only the video-encode path drops the stream.

## Proven solution: 2-stage pipeline
1. **Render video-only** with raw `<video>` (visuals correct, audio discarded).
2. **Extract + concatenate audio** from each source take via ffmpeg.
3. **Mux** audio onto the rendered MP4 with `-c:v copy`.

Deterministic, never freezes.

### Stage 1 — Remotion component (visuals only)
```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile } from 'remotion';

export const FootageLayer: React.FC<{filename: string}> = ({ filename }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 300], [1.05, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <video
        src={staticFile(`footage_processed/${filename}`)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
        autoPlay muted loop
      />
    </AbsoluteFill>
  );
};
```
- Use `staticFile()` — Chrome headless BLOCKS `file:///` video src ("Not allowed to load local resource").
- `public/footage_processed/` must hold real files (not a symlink/junction to a network drive).

### Stage 2 — ffmpeg audio concat + mux
Full script in `references/ffmpeg-audio-mux.md`. Outline:
```
# Per-block audio extract (first N seconds of each processed take)
ffmpeg -i footage_processed/MVI_1803_processed.mp4 -t 10 -vn -acodec copy audio_seg_intro.aac
# ... repeat per timeline block ...
# Concatenate
ffmpeg -f concat -safe 0 -i audio_concat.txt -c copy audio_combined.aac
# Mux onto Remotion render (video copied, audio added)
ffmpeg -i remotion_render.mp4 -i audio_combined.aac -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest final.mp4
```
Verify audio: extract to WAV, check non-zero sample ratio (>40% = present).

## Gotchas (environment)
- **Google Drive / network source crashes ffmpeg** (rc negative). Copy source MOV to local disk before any ffmpeg read.
- **Rotated footage:** if 90° CCW (head right), `transpose=2` on ORIGINAL → upright. Verify each take with single-frame extract + vision "TOPO/FUNDO" check. Do NOT chain `transpose=2,vflip,hflip` (doubles rotation → upside down).
- **Junction paths:** `[CODES]\marca-2026\campaigns\` may be a junction to `[DRIVE_CAMPANHA]\remotion\campaigns\`. `find /c/AI/...` does NOT follow it — use the real `D:\` path. Remotion CLI also needs `package.json` with `"type": "module"` in project root or it won't recognize the entry point.
- **Remotion CLI:** `bash ./node_modules/.bin/remotion render src/RootEntry.tsx <comp> <out.mp4>` from project dir; trailing positional entry works, `--entry-point` flag is unreliable in 4.0.512.

## Verify before done
- Frame-diff between t and t+0.3 s > 1.5 → video has motion.
- WAV extract non-zero ratio > 40% → audio present.
- `ffprobe` shows both `h264` (video) and `aac` (audio) streams.