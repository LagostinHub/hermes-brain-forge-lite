# [biblioteca AGPLv3] + Kinocut

## [biblioteca AGPLv3]

**What:** Open-source agentic video production system (AGPLv3).
**Repo:** `https://github.com/calesthio/[biblioteca AGPLv3]`
**Architecture:** Agent-driven — the coding agent reads pipeline manifests + stage director skills, calls tools via Python, and uses Remotion for composition.

### Setup

```bash
cd /c/OPENCODE
git clone https://github.com/calesthio/[biblioteca AGPLv3].git
cd [biblioteca AGPLv3]
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
```

### Pipeline Flow

```
Agent reads pipeline YAML → reads stage director MD
→ calls tools (Python BaseTool) → self-reviews → checkpoints
→ human approval → render
```

### Full Stack Cost Estimate (Per 30s Video)

| Component | Cost | Notes |
|-----------|------|-------|
| ComfyUI asset gen | $0 | GPU + electricity only |
| [biblioteca AGPLv3] pipeline | $0 | Open source, AGPLv3 |
| Remotion composition | $0 | MIT license, free for ≤3 person team |
| Kinocut post-pro | $0 | Apache-2.0 |
| Stock footage | $0 | Pexels/Pixabay free tier |
| TTS | $0 | Google TTS 1M chars/mo |
| **Total** | **$0** | Vs Motion.so $29-99/mo |

## Kinocut

**What:** Open-source MCP server for guardrailed video editing (Apache-2.0).
**Install:** `pip install kinocut`
**MCP Registry:** `io.github.KyaniteLabs/kinocut`
**Note:** The `kino` CLI can have dependency conflicts with Hermes venv on Windows
(`click`, `httpx`, `mcp` version mismatches). For simple operations, prefer
FFmpeg directly. Reserve Kinocut for MCP-server use within Hermes tool config.

### FFmpeg Fallback (when kino CLI breaks)

```bash
# Reframe to 9:16
ffmpeg -i input.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,
       pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#2B2B2B" \
  -y output_vertical.mp4

# Add text overlay
ffmpeg -i input.mp4 \
  -vf "drawtext=text='[MARCA] Catalog':fontsize=36:fontcolor=#F9F8F6:x=40:y=40" \
  -y output_captioned.mp4
```
