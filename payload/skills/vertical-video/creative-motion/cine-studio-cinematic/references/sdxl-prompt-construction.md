# Construção de Prompts SDXL para Keyframes — Cine Studio

## Regra Fundamental

**SDXL** (keyframes) e **Wan 2.2** (vídeo) usam formatos de prompt completamente diferentes. A confusão entre eles é a causa #1 de "imagens aleatórias sem relação com o roteiro".

| Motor | Formato | Tamanho | Estrutura |
|-------|---------|---------|-----------|
| SDXL | Keywords separadas por vírgula | 50-150 palavras | plana, descritiva |
| Wan 2.2 | Blocos narrativos (seção: valor) | 280-400 palavras | hierárquica, 10 blocos |

## Padrão de Prompt SDXL (usado no app.py) — CORRIGIDO

**⚠️ REGRA DE OURO: NUNCA incluir texto narrativo no prompt SDXL.**
SDXL gera imagens aleatórias quando recebe parágrafos descritivos.
Usar APENAS: heading + modo cinematográfico + capture realism.

```python
# 1. Heading da cena (só o local, sem descrição narrativa)
heading = scene.get("heading", "Cena")  
# ex: "EXT. O QUINTAL - DIA"

# 2. Modo cinematográfico (M1-M5) — keywords visuais PURAS
cm = CINEMA_MODES[mode]  
# cm['kf_prompt'] = "cinematic portrait, Rembrandt lighting, 85mm lens..."

# 3. Capture Realism block
CAPTURE_REALISM_BLOCK = "cinematic, film grain, atmospheric depth between planes, natural skin texture, realistic lighting, volumetric haze, subtle contrast, fine grain, no plastic, no cgi, no render"

# 4. Prompt FINAL — sem narrativa, só heading + keywords
prompt = f"{heading}. {cm['kf_prompt']}, {CAPTURE_REALISM_BLOCK}"
# Resultado: "EXT. O QUINTAL - DIA. cinematic portrait, Rembrandt lighting, 85mm lens..."
```

## Erro Comum #1 — Incluir texto narrativo

❌ **Incluir texto narrativo da cena no prompt SDXL** — A primeira versão do código incluía `action[:200]` (ex: "O quintal é um paraíso esquecido — grama alta balançando com o vento..."). SDXL interpreta isso como geração de texto/imagem e produz algo aleatório.

```python
# ERRADO: incluir narrativa → SDXL gera aleatório
prompt = f"{heading}. {action[:200]}. {cm['kf_prompt']}"
# → SDXL ignora a maior parte e gera imagem genérica sem relação com a cena
```

✅ **Prompt SDXL correto** — só heading + modo cinematográfico:

```python
# CERTO: só heading + keywords visuais
prompt = f"{heading}. {cm['kf_prompt']}, {CAPTURE_REALISM_BLOCK}"
# → SDXL gera retrato cinematográfico coerente com o local
```

## Mapeamento: CINEMA_MODES → kf_prompt (SDXL)

```python
CINEMA_MODES = {
    "M1": {  # Narrative — diálogo, drama
        "kf_prompt": "cinematic portrait, Rembrandt lighting, 85mm lens, "
                     "shallow depth of field, atmospheric haze, volumetric light, "
                     "warm skin tones, natural skin texture, pores, subsurface scattering, film grain"
    },
    "M2": {  # Studio — produto, entrevista
        "kf_prompt": "product photography, clean studio setting, soft diffused lighting, "
                     "50mm lens, shallow depth of field, seamless background, "
                     "commercial grade, high detail"
    },
    "M3": {  # Action — movimento, luta
        "kf_prompt": "dynamic action shot, dramatic side lighting, 24mm wide angle, "
                     "cinematic contrast, motion blur, chiaroscuro, "
                     "deep shadows, gritty texture, high energy"
    },
    "M4": {  # Performance — palco, música
        "kf_prompt": "stage performance, volumetric colored lighting, haze in air, "
                     "spot backlight, 50mm lens, dramatic rim light, "
                     "concert atmosphere, smoke, energy"
    },
    "M5": {  # Atmospheric — paisagem, ambiente
        "kf_prompt": "wide establishing shot, golden hour, atmospheric haze, "
                     "volumetric light rays, 16mm wide angle, deep depth of field, "
                     "majestic landscape, cinematic color grade, no people"
    },
}
```

## Erro Comum #2 — Prompt Wan no SDXL

❌ **Usar prompt Wan no SDXL** — o formato de 10 blocos narrativos (SCENE & MOOD, FRAME MAP, etc.) faz o SDXL ignorar o excesso e confundir a geração.

```
# ERRADO: prompt Wan no SDXL → imagem aleatória
"SCENE & MOOD: Fumaça no quintal. FRAME MAP: Gata na esquerda..."
```

✅ **Prompt SDXL correto** — keywords visuais curtas na mesma linha:

```
# CERTO: prompt SDXL → imagem coerente com a cena
"cinematic portrait, EXT. O QUINTAL - DIA, Rembrandt lighting, 85mm lens, film grain"
```

## Múltiplos Takes

Cada cena deve gerar `takes` imagens com seeds diferentes para dar opções:

```python
takes = max(1, params.takes)  # default 3
for take in range(takes):
    seed = params.seed if params.seed > 0 else int(time.time() * 1000 + take) % 999999999
    # ... submete workflow com seed diferente
    take_str = f"_take{take+1}" if takes > 1 else ""
    dst = kf_dir / f"scene_{sn:03d}{take_str}.png"
```

## Extração de Título do Roteiro

O nome do projeto deve vir do título do roteiro Fountain, não de timestamp:

```python
def extract_title(text: str) -> str:
    """Extrai o título do roteiro (linha 'Title: ...')."""
    for line in text.split('\n'):
        line = line.strip()
        if line.lower().startswith('title:'):
            return line[6:].strip().replace(' ', '_').lower()
    return ""

# Uso:
title = extract_title(input.text) if is_script else ""
name = input.project_name or title or f"project_{datetime.now():%Y%m%d_%H%M%S}"
```

## Debug: Quando o SDXL gera imagens aleatórias

1. Verificar o prompt no log do servidor (`app.py` → `generate_keyframes`)
2. Se o prompt tiver `SCENE & MOOD` ou `FRAME MAP` → está usando formato Wan no SDXL
3. Se o prompt tiver texto narrativo longo sem keywords visuais → reescrever como keywords
4. Se o prompt tiver keywords mas a imagem é genérica → remover completamente o texto narrativo, deixar só heading + cinematic mode
5. Se a imagem for um retrato genérico sem contexto → o heading já é suficiente, o modo M1-M5 carrega o resto