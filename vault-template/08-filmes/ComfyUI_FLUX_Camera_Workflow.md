# Bruxos FLUX Camera Workflow

## Arquivo
`C:/AI/[FERRAMENTA]/[FERRAMENTA]_windows_portable/[FERRAMENTA]/user/default/workflows/Bruxos/Bruxos_FLUX_Camera_FreezeFrame.json`

## Pipeline
1. BruxosLoadImage → carrega imagem de referência
2. H3LocalCameraEditor (Bruxos) → gera prompt de câmera via trajectory JSON + reference image
3. DualCLIPLoader → CLIP (clip_l + t5xxl) pro FLUX
4. VAELoader → flux-dev-vae.safetensors
5. UnetLoaderGGUF → flux1-dev-Q5_0.gguf (7.9GB, Q5_0 GGUF)
6. EmptyFlux2LatentImage → latente 512x512
7. CLIPTextEncodeFlux ← camera prompt (clip_l + t5xxl)
8. CLIPTextEncodeFlux → negative embed
9. KSampler → FLUX.1 dev (8 steps, euler, cfg 1.0)
10. VAEDecode → imagem
11. SaveImage → output

## Trajectory JSON (exemplo 90° orbit)
```json
[{"time": 0, "azimuth": 0, "elevation": 0, "distance": 1.0}, {"time": 0.5, "azimuth": 45, "elevation": 0, "distance": 1.2}, {"time": 1, "azimuth": 90, "elevation": -5, "distance": 1.5}]
```

## Parâmetros
- profile: "124 frames (~5.17s)"
- interpolation: "linear"
- shot: "medium shot"
- FLUX steps: 8
- sampler: euler
- cfg: 1.0
- resolution: 512x512
- seed: 999

## Template
Aparce no [FERRAMENTA] em: Templates → Bruxos → Bruxos_FLUX_Camera_FreezeFrame
