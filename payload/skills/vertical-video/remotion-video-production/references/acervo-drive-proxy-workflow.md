# Acervo Footage Acquisition — Google Drive + Proxy Workflow (2026-09-12)

**Project:** Film "O CARTÃO" ([Cliente] [Sobrenome]) — 02_FOOTAGE acervo (30 pastas, ~1,500 arquivos, E: Google Drive mount)

## Drive Is Slow — Inventory Strategy
- `ls` (metadata) is instant — use it to map structure (folder + file count).
- `ffprobe` / `ffmpeg` on E: costs 1-2s per file + cloud download; full sweep of 1,500 clips **timeouts at 600s** (2 subagents hit limit, only 671/1052 got technical data).
- Pattern: `ls` first, then `ffprobe` **only on candidates** (1-2 clips/sec is ceiling). For mapping, `ls -1` + `wc -l` is enough.
- Never use `du -sh` on Drive (hangs 420s). Use name count only.

## Mislabelled Folders (verified by contact sheets)
- `260903 B-rolls Onibus e Obras` → **mostly construction** (excavation, cones, workers) — only 2 bus plates (DSC_3909/3917). DSC_3914 has identifiable third-party face → DO NOT USE.
- `260815_CG_colombo_sjp` → **not interior bus: is [MARCA]** (park/bench) — actually best talent material for D1/D2.
- `260823_Coritiba` → **night street event with many identifiable third-party faces** → DO NOT USE (compliance).
- Lesson: folder names lie — generate contact sheets before assuming content.

## Proxy Generation (vertical 9:16)
Source is 4K horizontal (3840×2160) but recorded vertical (rotation 90). Proxy for 1080×1920 film:
```bash
ffmpeg -y -ss 1.5 -t 6 -i "ORIGEM" \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -an -c:v libx264 -crf 23 -pix_fmt yuv420p "public/film-cartao/proxies/<slug>.mp4"
thumb: ffmpeg -ss 40% -i ORIGEM -vf "scale=400:-1" -frames:v 1 thumb.jpg
```
47 clips → 47 proxies, 0 timeout when prioritized (b-rolls > interior > drone > Curitiba). Handled via OpenCode dispatch with explicit file list (not glob).

## Hero Finds (from contact sheets)
- **Bus on BRT lane from above:** `08_15_Drones/Curitiba _ Transporte` 0019/0020/0021 (0021 = red articulated)
- **Periphery:** Capão Raso 0017, SJP 0025 | **Centre:** Icônicas 0040 (Guaíra skyline)
- **D1/D2 Reserved Blank:** Decision 2026-09-12 — no talent image until shoot 13/09; D1/D2 stay as treated gradient + "RESERVADO · GRAVAÇÃO 13/09" label. Talent available as MVI_1807/1811/1815 when needed.

## Compliance Rules Enforced
- No identifiable third-party face in any beat (DSC_3914, Coritiba all blocked)
- No adversary name/face (29×0 and 5×1 graphics without names)
- Every number shows source on screen (Urbs 2024, Câmara, TJ-RJ, NTU, Plural)
- No AI-generated media (TSE Res. 23.755/2026 label exemption)
- Prints: official Chamber/Plural sites block headless (403 CloudFront, Cloudflare) — headless screenshot fails; official page HTML fabrication by subagent was **rejected and deleted**. Capture via human browser or use citation cartela.
