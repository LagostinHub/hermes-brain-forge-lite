# Exemplo: Montagem Satírica — Sessão Câmara Curitiba (04/05/2026)

**Video source:** `https://www.youtube.com/watch?v=zWlcUNq0250` (2:49h — sessão ordinária)
**Objetivo:** satirizar políticos + destacar debate real da [Cliente] [Sobrenome] sobre educação

## Ferramentas usadas
- `yt-dlp` para download + SRT
- Python (venv) para parsing SRT
- `sed`/`grep` para extração de trechos
- `ffprobe`/`ffmpeg` para cortes precisos

## Passo 1: Transcrição
```bash
yt-dlp --write-subs --sub-lang pt --convert-subs srt \
  -o "C:/AI/profile/.cache/yt_temp/zWlcUNq0250.pt.srt" \
  "https://www.youtube.com/watch?v=zWlcUNq0250"

yt-dlp -f "bestvideo[height<=720]+bestaudio/best[height<=720]" \
  -S ext:mp4 --merge-output-format mp4 \
  -o "C:/AI/profile/.cache/yt_temp/marca_sessao_04_05_2026.mp4" \
  "https://www.youtube.com/watch?v=zWlcUNq0250"
```

## Passo 2: Parse SRT → texto pesquisável
```bash
# Convertendo para timestamp + texto
python3 -c '
import re
with open("zWlcUNq0250.pt.srt") as f:
    for num, ts, text in re.findall(r"(\d+)\n(\d\d:\d\d:\d\d,\d\d\d --> \d\d:\d\d:\d\d,\d\d\d)\n(.+?)(?=\n\n|\Z)", f.read(), re.DOTALL):
    print(f"[{ts}] {chr(10).join(re.sub(r"<[^>]+>","",t).strip() for t in text.split(chr(10)))}")
' > camarapira_timestamps.txt
```

## Passo 3: Busca por falas
- `grep -n "cliente\|marca"` → 13 matches
- Fala principal dela: início em `02:15:43,880` → linhas 5555+
- Éder Borges fala sobre "banheiros trans": `02:11:39`
- Serginho do Posto (liderança governo): `02:41:16`

## Passo 4: Clipes extraídos
| Personagem | Início SRT | Início vídeo | Fim | Tema |
|---|---|---|---|---|
| [Cliente] (abertura) | 00:10:53 | 00:10:53 | 00:11:05 | Sanepar / água |
| Éder Borges | 02:09:55 | 02:09:55 | 02:10:55 | escolas cívico-militares |
| Éder Borges | 02:11:39 | 02:11:39 | 02:11:46 | "banheiro trans" |
| Éder Borges | 02:12:20 | 02:12:20 | 02:12:24 | "país de burros" |
| [Cliente] (principal) | 02:15:43 | 02:15:43 | 02:21:18 | debate educação |

## Comandos ffmpeg
```bash
ffmpeg -ss 02:15:43 -to 02:21:18 -i marca_sessao_04_05_2026.mp4 -c copy fala_principal.mp4
ffmpeg -ss 02:11:39 -to 02:11:46 -i marca_sessao_04_05_2026.mp4 -c copy eder_banheiro_trans.mp4
```

## Lesson: nomeações podem ser inconsistentes
- "[Cliente] [Sobrenome]" aparece em 13 linhas, mas "[Cliente] Gomes" aparece em 1 linha (erro de reconhecimento de STT)
- Éder Borges fala sobre "banheiros trans" mas o STT capta "banheiro trans paraa criança"
- Serginho do Posto é chamado de "Serginho" e também "líder do governo" indistintamente