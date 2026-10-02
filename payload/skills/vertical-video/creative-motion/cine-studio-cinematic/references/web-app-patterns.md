# Implementação Web App — Padrões e Armadilhas

Padrões de implementação descobertos durante o desenvolvimento do Cine Studio (FastAPI + ComfyUI + Wan 2.2).

## 1. ESTRUTURA DO APP.PY

```
web/app.py (~700 linhas)
├── Models (Pydantic)
├── Helpers (comfy_api, get_state, save_state, check_comfyui)
├── Status (GET /api/status)
├── Projetos (GET/PUT/DELETE)
├── Roteiro (POST /api/script/parse)
├── Characters (GET/POST /api/character/*)
├── Shot List (GET/PUT /api/project/{name}/shots)  
├── Validação (POST /api/validate/shot)
├── Keyframes (POST /api/generate/keyframes)
├── Video (POST /api/generate/video) — Wan I2V
├── QC (GET /api/project/{name}/qc)
├── Montagem (POST /api/assemble/{name})
├── Pipeline (GET/POST /api/pipeline/*)
└── Frontend (GET /, /app.js, /app.css, /api/output/{path})
```

## 2. ARMADILHA: VARIÁVEL `name` SOBrescrita

**Problema:** A variável `name` do projeto é sobrescrita no loop de detecção de personagens.

```python
# ❌ ERRADO
name = input.project_name or f"project_"  # nome do projeto
for c in scenes:
    name = c.strip().upper()  # SOBRESCREVE o nome do projeto!
    
# ✅ CERTO  
project_name = input.project_name or f"project_"
for c in scenes:
    cname = c.strip().upper()  # variável diferente
```

**Sintoma:** Projeto com nome estranho (ex: "NOITE", "MAX", parte do roteiro).
**Fix:** Usar `project_name` pra projeto e `cname`/`charname` pra personagens.

## 3. DETECÇÃO DE PERSONAGENS DO ROTEIRO

Duas fontes de dados que precisam ser mescladas:

1. **Parser Fountain** (`parse_fountain`) → retorna `characters_in_scene` por cena (personagens com diálogo)
2. **Varredura linha a linha** → linhas isoladas em ALL CAPS (nomes mencionados em texto de ação)

```python
all_chars = set()

# Fonte 1: parser Fountain
for s in scenes:
    for c in s.get("characters_in_scene", []):
        all_chars.add(c.strip().upper())

# Fonte 2: varredura linha a linha (ALL CAPS soltos)
for line in input.text.split('\n'):
    w = line.strip().rstrip(':,.!?;')
    if (w.isupper() and 2 <= len(w) <= 25
        and not w.startswith(('INT.', 'EXT.'))  # filtra headings
        and not any(x in w.upper() for x in ['SCENE', 'ACT ', 'THE END', 'FIM', 'CORTA', 'CUT TO', 'FADE'])):
        all_chars.add(w)
```

**⚠️ `re.findall` com `\b[A-ZÀ-Ú\s]{1,15}\b` NÃO funciona** — captura palavras de scene headings (INT, EXT, BAR, RUA). Usar `split('\n')` linha a linha.

## 4. MESCLA STATE + DIRETÓRIO DE ARQUIVOS

O `state.json` guarda os dados lógicos (personagens detectados, status). O diretório `characters/` guarda os arquivos de imagem (face locks). O endpoint GET precisa mesclar ambos:

```python
# Characters do state (dados lógicos)
state_chars = state.get("characters", [])

# Characters com face lock (arquivos no disco)
chars_with_images = set()
if chars_dir.exists():
    for f in chars_dir.glob("*.png"):
        chars_with_images.add(f.stem.lower())

# Mescla: atualiza has_face_lock baseado no disco
chars = []
for c in state_chars:
    entry = dict(c)
    entry["has_face_lock"] = c.get("name", "").lower() in chars_with_images
    chars.append(entry)
```

**⚠️ NÃO substituir state characters pela lista do diretório** — senão personagens detectados (sem face lock) somem da UI.

## 5. DISPLAY DE FACE LOCK NA UI

O usuário clica em "Gerar" e o face lock é gerado, mas a imagem não aparece. **A causa é que o frontend só mostra um emoji 🖼️, não a imagem.**

### API — incluir `face_lock_path` no GET /api/project/{name}

```python
# Em get_project():
for c in state.get("characters", []):
    entry = dict(c)
    cname = c.get("name", "").lower()
    entry["has_face_lock"] = cname in chars_with_images
    if entry["has_face_lock"]:
        lock_path = f"characters/{cname}.png"
        entry["face_lock_path"] = str(Path(lock_path).as_posix())
    chars.append(entry)
```

### Frontend — renderizar thumbnail com onclick para lightbox

```javascript
// Em app.js, renderização de characters:
if (data.characters) {
    document.getElementById('character-badges').innerHTML = data.characters.map(c =>
        `<span class="char-badge ${c.auto_detected ? 'auto' : ''}">
            ${c.has_face_lock ? '🖼️' : '🎯'}
            ${c.name}
            ${c.has_face_lock 
                ? `<img src="/api/output/${name}/${c.face_lock_path}" class="char-thumb" onclick="openLightbox(this.src)">` 
                : `<button class="btn-mini" onclick="generateFaceLock('${c.name}')">🎯 Gerar</button>`}
        </span>`
    ).join('');
}
```

### CSS — char-thumb

```css
.char-thumb {
    width: 32px; height: 32px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid var(--border);
}
.char-thumb:hover { border-color: var(--accent2); }
```

### Botão "Gerar Todos" para face locks

```javascript
async function generateAllFaceLocks() {
    if (!currentProject) return;
    const r = await fetch(`/api/project/${currentProject}`);
    const d = await r.json();
    if (!d.characters) return log('Nenhum personagem encontrado');
    for (const c of d.characters) {
        if (!c.has_face_lock) {
            await generateFaceLock(c.name);
            await new Promise(r => setTimeout(r, 500));  // rate limit entre gerações
        }
    }
    log('✅ Face locks gerados para todos!');
    loadProject(currentProject);
}
```

HTML do botão (no card de personagens):
```html
<button class="btn-ghost-sm" onclick="generateAllFaceLocks()">🎯 Gerar Todos</button>
```

## 6. VALIDAÇÃO 4N+1 (WAN 2.2)

Wan 2.2 exige `length = 4n + 1` (17, 21, 25, 33, 41, 49, 65, 81, 97...).

```python
def validate_frames(n: int) -> int:
    """Garante 4n+1 pro Wan 2.2"""
    n = max(17, min(329, n))
    return ((n - 1) // 4) * 4 + 1
```

Usar no endpoint de validação (`/api/validate/shot`) e no de geração de vídeo.

## 7. QC — INTEGRAÇÃO NO WEB APP

O `qc.py` é um módulo separado com função `run_qc(project_name, mode)`.
O web app chama via `importlib` em thread separada:

```python
import importlib.util
spec = importlib.util.spec_from_file_location("qc", "qc.py")
qc_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qc_mod)

def run():
    try:
        qc_mod.run_qc(name, "standard")
    except Exception as e:
        logging.error(f"QC failed: {e}")
t = threading.Thread(target=run, daemon=True)
t.start()
```

O QC salva o relatório em `qc_output/{project}/qc_report.json`.
O endpoint GET verifica se o relatório existe antes de executar.

## 8. ESTADO DO PIPELINE (PHASE GATES)

O pipeline tem 5 fases sequenciais. Cada projeto guarda a fase atual em `state["pipeline_phase"]`:

```python
PHASE_ORDER = ["characters", "keyframes", "video", "qc", "assemble"]

# Avançar fase
current = state.get("pipeline_phase", "characters")
idx = PHASE_ORDER.index(current) if current in PHASE_ORDER else 0
if idx < len(PHASE_ORDER) - 1:
    state["pipeline_phase"] = PHASE_ORDER[idx + 1]
```

O frontend renderiza a pipeline visualmente:
- **done**: fase completa (✅)
- **current**: fase atual (▶️)
- **pending**: fases futuras (○)

## 9. ESTADO COMPARTILHADO — state.json

O `state.json` é a única fonte de verdade do projeto. Contém:

```json
{
  "project_name": "nome",
  "brief": "texto do roteiro",
  "is_script": true,
  "created_at": "ISO datetime",
  "total_scenes": 4,
  "scenes": [...],        // cenas parseadas
  "shot_list": [...],     // shots com status
  "status": "parsed",     // parsed | keyframes | video | assembled
  "pipeline_phase": "characters",
  "characters": [...]     // personagens detectados
}
```

Toda mutação passa por `get_state()` + `save_state()`.

## 10. MODOS CINEMATOGRÁFICOS (M1-M5)

Definidos como dicionário no topo do app.py:

```python
CINEMA_MODES = {
    "M1": {"name": "Narrative", "wan_steps": 25, "wan_cfg": 5.0, ...},
    "M2": {"name": "Studio", "wan_steps": 20, "wan_cfg": 5.5, ...},
    ...
}
```

Cada modo tem:
- `wan_steps`, `wan_cfg`, `wan_frames` — parâmetros do Wan 2.2
- `kf_prompt` — bloco de keywords pro prompt SDXL
- `wan_prompt_base` — bloco de movimento pro prompt Wan

## 11. GERAÇÃO DE MÚLTIPLOS TAKES

O `takes` parâmetro estava no `ParamsInput` mas não era usado no `generate_keyframes`. Loop corrigido:

```python
takes = max(1, params.takes)  # default 3
for take in range(takes):
    seed = params.seed if params.seed > 0 else int(time.time() * 1000 + take) % 999999999
    # ... submete workflow com seed diferente
    take_str = f"_take{take+1}" if takes > 1 else ""
    dst = kf_dir / f"scene_{sn:03d}{take_str}.png"
    results.append({
        "scene": sn, "take": take + 1, "seed": seed, "cinema_mode": mode,
        "image": Path(img_path).relative_to(OUTPUT_DIR / project_name).as_posix() if img_path else None,
        "status": "done" if img_path else "timeout",
    })
```

## 12. FRONTEND — ESTRUTURA DO APP.JS

```
app.js (~465 linhas)
├── Status refresh
├── Projetos (load, new, delete)
├── Load project (renderiza todas as seções)
├── Pipeline (renderPipeline)
├── Shot list (renderShotList)
├── Parse script
├── Params (getParams)
├── Keyframes (generateKeyframes)
├── Validate & Generate (validateAndGenerate → generateVideo)
├── Video (generateVideo com polling)
├── QC (runQC com polling)
├── Assemble (assembleFilm)
├── Character (showAddCharacter, saveCharacter, generateFaceLock, generateAllFaceLocks)
├── Lightbox (openLightbox, closeLightbox, ESC key)
└── Init (refreshStatus, loadProjects, setInterval)
```

### 12.1. Frontend Params — getParams()

A função `getParams()` coleta todos os parâmetros da sidebar. Cada novo controle na sidebar PRECISA ser incluído aqui:

```javascript
function getParams() {
    const res = document.getElementById('param-res').value.split('x');
    return {
        project_name: currentProject,
        width: parseInt(res[0]), height: parseInt(res[1]),
        frames: parseInt(document.getElementById('param-frames').value),
        fps: parseInt(document.getElementById('param-fps').value),
        steps: parseInt(document.getElementById('param-steps').value),
        cfg: parseFloat(document.getElementById('param-cfg').value),
        takes: parseInt(document.getElementById('param-takes').value),
        model: document.getElementById('param-mode-cinema').value === 'M3' ? 'wan...low_noise' : 'wan...high_noise',
        seed: parseInt(document.getElementById('param-seed').value),
        cinema_mode: document.getElementById('param-mode-cinema').value,
        style_prompt: document.getElementById('param-style').value.trim(),
        duration_seconds: parseInt(document.getElementById('param-duration')?.value || '5'),
    };
}
```

**⚠️ `param-duration` precisa existir no HTML** — sem ele, `?.value` retorna undefined e fallback `'5'`.

### 12.2. Scene Takes Display

No `loadProject()`, as cenas mostram miniaturas dos takes:

```javascript
const kfByScene = {};
if (data.keyframes) {
    for (const kf of data.keyframes) {
        const key = kf.scene || kf.scene_number || 0;
        if (!kfByScene[key]) kfByScene[key] = [];
        kfByScene[key].push(kf);
    }
}
const takesHtml = takes.length > 0
    ? `<div class="scene-takes">${takes.map(t =>
        `<img src="/api/output/${name}/${t.path||t.image}" class="take-thumb" 
              onclick="openLightbox(this.src)" title="Take ${t.take||1}">`
      ).join('')}</div>`
    : '';
```

CSS:
```css
.scene-takes { display:flex; gap:4px; margin-top:6px; flex-wrap:wrap; }
.take-thumb { width:48px; height:48px; border-radius:4px; object-fit:cover; cursor:pointer; border:1px solid var(--border); }
.take-thumb:hover { border-color:var(--accent2); }
.dur-input { background:var(--bg); border:1px solid var(--border); color:var(--text); border-radius:3px; padding:1px 4px; font-size:11px; text-align:center; }
```