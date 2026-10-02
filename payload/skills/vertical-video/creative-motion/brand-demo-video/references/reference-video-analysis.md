# Reference Video Analysis Methodology

Use this when the user provides a reference video to match style/pacing.

## Step 1 — Get Metadata

```bash
ffprobe -v quiet -print_format json -show_format -show_streams "path/to/video.mp4"
```

Key fields: duration, bit_rate (bps), width, height, codec_name, r_frame_rate.

## Step 2 — Detect Scene Changes

Lower threshold = more sensitive. 0.15 catches most cuts. 0.3 catches only hard cuts.

```bash
ffmpeg -i "video.mp4" -vf "select='gt(scene,0.15)',showinfo" -vsync vfr -f null -
```

Parse pts_time values from stderr. Calculate intervals between consecutive scenes.

## Step 3 — Extract Frames at Regular Intervals

```bash
mkdir -p ref_frames
ffmpeg -i "video.mp4" -vf "fps=0.5,scale=640:1136" -q:v 2 "ref_frames/shot_%03d.jpg"
```

0.5 fps at 70s = 35 frames. Scale down to 640-wide for quick visual browsing.

## Step 4 — Analyze Structure

Group scenes by section:
- Intro (0-15s): hook, title, first impression
- Body (15-80%): main content, demos, proof points
- End (last 15s): recap, CTA, logo

## Example: Brand Film ([marca]_brand_v03b.mp4)

```
Duration: 70.4s | 24fps | 1080×1920 | 227MB (27Mbps)
16 scenes (threshold 0.15) | Avg: 3.9s | Min: 0.8s | Max: 11.8s

Section breakdown:
  0-15s:  4 scenes (hook + fast opening)
  15-45s: 7 scenes (main content, slower pacing)
  45-70s: 5 scenes (build to close, accelerates)
```

## What to Compare

| Measurement | Typical Reference | AI-Generated (warning sign) |
|---|---|---|
| Scene duration | 1-4s avg | 8-20s per slide |
| Bitrate | 20-30Mbps (27k) | 1-3Mbps |
| Frame rate | 24fps (cinema) | 30fps (web default) |
| Format | 1080×1920 (vertical) | 1920×1080 (horizontal) |
| Scene count | 15-20 in 70s | 3-5 in 30s |
