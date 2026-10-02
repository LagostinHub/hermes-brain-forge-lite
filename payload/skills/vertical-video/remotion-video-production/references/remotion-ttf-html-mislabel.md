# TTF Masquerade — HTML Saved as .ttf (2026-09-12)

**Context:** Film "O CARTÃO" ([Cliente] [Sobrenome], [projeto-motion], Remotion 4.0.512, Windows).

## Symptom
Render succeeded (h264 1080×1920 120s, 71 MB) but type was Arial/serif, not Montserrat Black/ExtraBold. No build error.

## Root Cause
`public/fonts/Montserrat-Black.ttf` (305,435 B), `ExtraBold` (305,482 B), `Medium` (305,447 B) were HTML error pages:
```
<!DOCTYPE html> <html lang="en ...
```
Real TTFs are 344,148 B / 344,844 B with magic `00010000`. Valid copies existed in:
- `[CODES]\profile\.cache\fonts\montserrat\`
- `[CODES]\[marca]-subtitles/public/fonts/`
- `[projeto-motion]/Montserrat-Black.ttf` (root)
- `[projeto-motion]/src/montserrat/` was also broken (same HTML)

`Montserrat-Medium.ttf` in the cache was also broken (267,270 B of `0a` newlines) — weight 500 has no valid file anywhere on this machine.

## Detection
```bash
for f in public/fonts/*.ttf; do printf "%s " "$f"; head -c 4 "$f" | od -An -tx1; done
# 00010000 = TTF, 3c21444f/0a0a0a0a = HTML/junk
```

## Fix Applied
1. Moved broken files to `public/fonts/_broken/`
2. Copied valid Black/ExtraBold from cache
3. In `src/[Cliente]FilmeCartao.tsx` remapped `@font-face weight 500 → ExtraBold.ttf` so `plain(500)` never falls back
4. Verified via `grep -n font-face` and visual sheet review

## Lesson
Never trust file extension — verify magic after any `git clone` / `curl -o` that fetches fonts. Add a CI check: `head -c 4` must be `00010000`.
