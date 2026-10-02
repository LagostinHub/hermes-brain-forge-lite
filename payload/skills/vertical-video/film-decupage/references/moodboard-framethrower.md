# Moodboard cinematográfico via FrameThrower API

Como montar um moodboard de referências de FILME (frames de filmes reais) para uma peça de vídeo.
FrameThrower.ai = 5.489 filmes indexados frame a frame (luz, lente, shot type, cor, mood).
REST API v1 — 11 endpoints. Token em `Settings → API`. 2 créditos/leitura (free: 2.000 créditos).

## Endpoints úteis

| Endpoint | Uso no moodboard |
|---|---|
| `POST /search` `{query, limit, mode}` | Atmosfera/conceito da cena (linguagem natural) |
| `POST /search/color` `{color}` ou `{colors:[...], limit}` | **Paleta da marca** → acha frames que habitam a cor do cliente |
| `POST /browse` `{shot_type, lens_character, setting, time_of_day, camera_angle, visual_style, director, genre, era, limit}` | **Enquadramento/decupagem** (a superfície única: busca por COMO o shot foi feito) |
| `POST /similar` `{frameId, mode: semantic\|visual\|color}` | Expandir o melhor match (loop de refinamento) |
| `GET /frames?id=` | Metadados completos + campo **`prompt`** (prompt de imagem pronto) |

Vocabulário: shot_type `close-up\|medium\|wide\|extreme-close-up`; lens `anamorphic\|spherical\|vintage_soft`;
time_of_day `day\|night\|golden_hour\|blue_hour`; camera_angle `low_angle\|high_angle\|eye_level\|overhead`;
visual_style `noir\|naturalistic\|stylized`.

## Método de 3 eixos (o que funcionou)

1. **COR** — `/search/color` com a paleta medida do cliente (2-4 buckets: cor-mãe, variante, acento, claro).
2. **CRAFT** — `/browse` por atributo de câmera (CU anamórfico noturno, wide overhead, ECU…).
3. **ATMOSFERA** — `/search` com a frase da cena (não o slugline: descreva sujeito + luz + água/ambiente).

Depois: **curadoria humana** — leia `sceneDescription` de cada resultado e escolha 3 por cena.
A busca semântica devolve ruído (ex: comédia animada num quadro subaquático); curadoria é o trabalho.

## Pitfalls (aprendidos na prática)

1. **NÃO ordenar o pool por `score` entre buckets** — buscas por cor têm score muito maior que as por texto
e dominam a seleção inteira (resultado: todas as cenas com frames de cor, nenhum relevante).
Use **prioridade de bucket** (cena-texto > craft > cor) preservando a ordem; cor é eixo SEPARADO, não mix.
2. **Busca por COR não substitui busca por CONTEÚDO** — `/search/color` acha "o que é da cor", não "o que é da cena".
Rode as duas e trate como seções distintas do board.
3. **Variedade forçada**: dedupe por filme dentro da cena e prefira filmes ainda não usados no board
(evita 5× Blade Runner 2049). Registre os invariants que sobraram.
4. **Combo de filtros pode zerar** (`naturalistic` + `golden_hour` = 0 resultados). Se vier 0, solte um filtro.
5. **Query = frase cinematográfica**, não tag: "freediver descending head first in dark blue water, surface light receding"
funciona; "underwater" devolve animação infantil.
6. **Python no Windows não entende `/c/...`** (path MSYS) — `open('/c/AI/x')` cria literalmente `C:\c\AI\x`.
Use sempre path nativo `C:/AI/...` no `execute_code`.

## Entregável

1. **VISUAL THEME** antes das tabelas: paleta por ato, lente, film look, movimento + **INVARIANTS** numerados
   (ex: "a luz está sempre ACIMA", "laranja só como acento", "silhueta > rosto até a cena 8").
2. **Por cena**: 3 refs (filme · ano · DP · lente · luz · paleta do frame · deep link) + **"o que roubar"**
em 2-3 linhas + enquadramento/lente do shot list.
3. **Prompt de IA do frame-âncora** (`/frames` → campo `prompt`) como semente da geração.
4. **Nota legal**: frames são referência/estudo (thumbnail + deep link). Nunca asset final, nunca redistribuir.
