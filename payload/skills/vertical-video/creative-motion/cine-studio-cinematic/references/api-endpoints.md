# Cine Studio — API Endpoints (app.py)

Todas as rotas implementadas em `[CAMINHO]`.

## Status & Projetos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/status` | Status ComfyUI + modelos + modos cinema |
| GET | `/api/projects` | Lista projetos com badges |
| GET | `/api/project/{name}` | Detalhes: cenas, keyframes, vídeos, shots, chars |
| DELETE | `/api/project/{name}` | Deleta projeto |

## Roteiro

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/script/parse` | Parse Fountain + cria shot list automático |

## Personagens

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/project/{name}/characters` | Lista personagens do projeto |
| POST | `/api/character` | Cria character bible + salva JSON |
| POST | `/api/character/{name}/face-lock` | Gera keyframe SDXL mid-gray |

## Geração

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/generate/keyframes` | SDXL keyframes com modo M1-M5 |
| POST | `/api/generate/video` | Wan I2V com takes, video_gen.py |
| POST | `/api/validate/shot` | Pitfall flags + valida 4n+1 |

## Shot List

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/project/{name}/shots` | Lista shot list |
| PUT | `/api/project/{name}/shots` | Salva shot list |

## QC & Montagem

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/project/{name}/qc` | Roda QC, retorna health score |
| POST | `/api/assemble/{name}` | Concatena takes aprovados via FFmpeg |

## Pipeline

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/project/{name}/pipeline` | Estado atual das fases |
| POST | `/api/pipeline/advance` | Avança pra próxima fase |

## Frontend

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | HTML principal |
| GET | `/app.js` | JS frontend |
| GET | `/app.css` | CSS frontend |
| GET | `/api/output/{project}/{path}` | Serve arquivos de mídia |