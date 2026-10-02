# Templates de Prompt por Modo Cinematográfico

## ⚠️ REGRA CRÍTICA: SDXL ≠ Wan 2.2

**SDXL (keyframes)** e **Wan 2.2 I2V (vídeo)** usam formatos de prompt COMPLETAMENTE diferentes.

| Motor | Formato | Tamanho | Estrutura |
|-------|---------|---------|-----------|
| SDXL | Keywords separadas por vírgula | 50-150 palavras | Plana, descritiva |
| Wan 2.2 | Blocos narrativos (seção: descrição) | 280-400 palavras | Hierárquica, 10 blocos |

**NUNCA use o prompt formatado pra Wan no SDXL.** O SDXL ignora o excesso e gera imagens baseadas só nas primeiras palavras — resultado: imagens aleatórias sem relação com o roteiro.

---

## M1 — Narrative (Narrativo / Diálogo)

**Keyframe SDXL:**
```
cinematic portrait, [character description], [setting], 
Rembrandt lighting, 85mm lens, shallow depth of field, 
atmospheric haze, film grain, warm skin tones, 
textured skin, pores, subsurface scattering
```

**Wan 2.2 I2V:**
```
SCENE & MOOD: [Character] in [setting], quiet dramatic moment, dialogue scene

FRAME MAP: [Character] in center third, midground, seated foreground desk/environment at left

SUBJECT LOCK: [Character] facing camera-left, seated upright, hands resting on table, 
gaze directed slightly down-right, neutral expression with subtle tension in jaw

MOVEMENT: Slow micro-movements — chest rises and falls with breath, 
eyes shift gaze twice across duration, subtle head tilt at 3s mark, 
no fast or broad motion. Camera performs slow push-in from [X] to [X], 0.5m total travel

LAST FRAME: Same composition as opening — [Character] in same position, 
gaze now lifted slightly toward camera, environment unchanged

SOUND BED: Ambient room tone, distant city hum, quiet footsteps in corridor, fabric rustle

CAPTURE REALISM: Cinema-grade naturalistic capture, suspended atmosphere between subject and background, 
per-zone specular kill on skin, controlled blacks with detail, fine grain, 
natural skin texture preserved, no artificial sharpness, no plastic sheen

CAMERA CAPTURE: M1 Narrative mode, 85mm equivalent spherical character, 
T2.8 wide aperture, slow dolly push-in starting at 0s completing at 4s, 
wide-latitude cinema capture, film-emulated color rendition, editorial grade with warm highlights, 
24fps, 180° shutter
```

---

## M2 — Studio (Produto / Apresentação)

**Keyframe SDXL:**
```
product photography, [product description], clean studio setting,
soft diffused lighting, 50mm lens, shallow depth of field,
seamless background, commercial grade, high detail, texture, sharp focus on product
```

**Wan 2.2 I2V:**
```
SCENE & MOOD: [Product/Subject] showcased in clean studio environment, commercial presentation

FRAME MAP: Subject centered in frame, foreground, occupying 40% of frame width, 
clean negative space above and to sides

SUBJECT LOCK: Subject stationary, oriented toward camera, 
no gross movement — only micro-reflections and environmental ambient motion

MOVEMENT: Static composition — camera locked on tripod, subject holds position, 
only ambient motion (dust particles in light, subtle fabric shift from ventilation)

LAST FRAME: Identical to opening frame — locked static composition

SOUND BED: Silent studio ambience, distant HVAC hum, camera fan

CAPTURE REALISM: Clean commercial capture with controlled contrast, 
diffuse wrap lighting eliminating harsh shadows, 
product texture and surface detail fully resolved, neutral color temperature with slight warmth

CAMERA CAPTURE: M2 Studio mode, 50mm spherical commercial lens, 
T5.6 aperture for full subject sharpness, locked tripod shot, 
studio-grade capture with controlled dynamic range, 24fps, 180° shutter
```

---

## M3 — Action (Ação / Movimento)

**Keyframe SDXL:**
```
dynamic action shot, [character] in motion, [setting],
dramatic side lighting, 24mm wide angle, fast-paced,
cinematic contrast, motion blur, chiaroscuro,
deep shadows, gritty texture, high energy
```

**Wan 2.2 I2V:**
```
SCENE & MOOD: Intense chase/action sequence — [Character] moving rapidly through [setting], high stakes

FRAME MAP: [Character] in right third, foreground, moving left-to-right through frame, 
midground buildings/environment blur past, background sky visible

SUBJECT LOCK: [Character] running, left arm forward, right arm back, 
gaze fixed ahead (camera-right), expression of determination, 
jacket/coat trailing behind from momentum

MOVEMENT: Continuous fast motion — [Character] runs left-to-right across frame at 3s intervals, 
heavy footsteps, arm swing, environmental motion blur. 
Camera tracks alongside at matching speed, handheld with operator breath, 
subtle vertical bob from footfall impact

LAST FRAME: [Character] exiting frame-right, trailing edge of jacket/coat last visible element, 
environment continues to blur past

SOUND BED: Heavy breathing, footsteps on surface, fabric movement, 
distant environmental sounds appropriate to setting, no music

CAPTURE REALISM: Gritty action capture, handheld energy with organic instability, 
motion blur baked into movement, contrast pushed for dramatic effect, 
blacks crushed in shadows, highlights retaining detail, fine grain visible

CAMERA CAPTURE: M3 Action mode, 24mm wide-angle spherical character, 
T2.8 aperture, handheld tracking shot with operator breath, 
contrast-grade cinema capture with pushed blacks, 24fps, 180° shutter
```

---

## M4 — Performance (Musical / Dança)

**Keyframe SDXL:**
```
stage performance, [character/performer], [venue type],
volumetric colored lighting, haze in air, spot backlight,
50mm lens, dramatic rim light, concert atmosphere,
silhouette edges, smoke, energy
```

**Wan 2.2 I2V:**
```
SCENE & MOOD: [Performer] mid-performance on stage, musical/emotional peak moment

FRAME MAP: [Performer] slightly left of center, midground, 
stage extends right with band/instruments, audience blur in foreground bottom-edge

SUBJECT LOCK: [Performer] facing camera, head tilted slightly back, 
eyes closed, arms extended to sides, micro-movements synchronized to music pulse, 
microphone in right hand

MOVEMENT: Slow orbit around [Performer] — camera circles left-to-right at constant speed, 
0.25rpm, completing 60° arc over duration. 
[Performer] sways with music, weight shifts between feet, 
head rolls with emotional delivery, hair moves with rotation

LAST FRAME: [Performer] now in right-center of frame, 
having completed 60° of rotation, same posture and energy, 
audience blur unchanged in foreground

SOUND BED: Diegetic stage sounds — fingers on instrument strings, vocal into mic, 
amplifier warmth, stage monitor feedback, crowd ambient, 
footsteps on stage floor (NO music track — music is external)

CAPTURE REALISM: Stage-lit capture with controlled highlight rolloff on skin, 
haze layer between subject and background creating depth separation, 
rim light defining silhouette edge, specular highlights on sweat/moisture kept natural, 
film grain from high-ISO stage conditions

CAMERA CAPTURE: M4 Performance mode, 50mm spherical character, T2.0 aperture, 
slow orbit dolly on curve track, stage-grade capture with wide latitude for colored lighting, 
24fps, 180° shutter
```

---

## M5 — Atmospheric (Ambiente / Establishing Shot)

**Keyframe SDXL:**
```
wide establishing shot, [location description],
golden hour lighting, atmospheric haze, volumetric light rays,
16mm wide angle, deep depth of field, majestic landscape,
cinematic color grade, rich colors, no people
```

**Wan 2.2 I2V:**
```
SCENE & MOOD: Pure environment establishing shot — [location description], 
time of day, weather conditions, atmospheric quality

FRAME MAP: Wide composition — foreground element (rock/tree/building) at left third, 
midground landscape extends to right, background sky/horizon at upper third. 
No human subjects. Pure environment.

MOVEMENT: Slow sweeping pan from left to right, 30° total travel over duration, 
smooth gimbal/tripod head motion. Cloud movement in sky, 
foliage/environmental micro-motion, light changes as clouds pass

LAST FRAME: Final composition frames [landmark/feature] in right third, 
sky in upper third, foreground element at lower-left, 
environment fully revealed from initial position

SOUND BED: Wind through foliage/environment, distant bird calls, 
water/environmental ambience appropriate to location, insect drone, 
creaking of trees/structures in wind — diegetic only

CAPTURE REALISM: Wide-latitude landscape capture, suspended atmosphere creating depth between layers, 
soft falloff in highlights preserving cloud detail, 
controlled blacks with shadow detail intact, film-emulated color rendition, 
fine grain visible in sky gradient, no artificial saturation

CAMERA CAPTURE: M5 Atmospheric mode, 16mm wide-angle spherical character, 
T8 aperture for deep focus, smooth pan on gimbal head, 
wide-latitude cinema capture with film-emulated color, 
naturalistic grade preserving scene's inherent palette, 24fps, 180° shutter
```

---

## Regras Universais (todos os modos)

1. **SDXL ≠ Wan** — SDXL usa keywords separadas por vírgula (50-150 palavras), Wan usa blocos narrativos (280-400 palavras)
2. **Descrever por comportamento, não por marca** — "wide-latitude cinema capture" não "ARRI Alexa"
3. **Nunca nomes de marca** — não "Kodak Vision3", mas "color-negative film rendition"
4. **Densidade SDXL**: 50-150 palavras (keywords)
5. **Densidade Wan**: 280-400 palavras single-shot, máximo 600 multi-shot
6. **Prompt confia na keyframe de referência** — no prompt Wan, só descrever o que a imagem não carrega
7. **Runtime sempre especificado** — nunca usar default
8. **Frame count Wan: 4n+1** — 17, 21, 25, 33, 41, 49, 65, 81, 97
9. **Seed fixa** pra takes que precisam conectar
10. **Capture Realism block sempre incluso** no prompt Wan — sem ele, pele de cera e brilho artificial