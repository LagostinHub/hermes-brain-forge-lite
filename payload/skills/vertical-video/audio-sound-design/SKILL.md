---
name: audio-sound-design
description: Use quando qualquer tarefa de áudio/som para vídeo exigir decisão ou execução — sound design, foley, SFX, diálogo/ADR/TTS, música, mixagem ou masterização. Ponte entre os 11 decision cards do vault (embutidos em 57.26-audio-moc, cards S-01→S-11) e as tool skills locais, com gates de decisão por etapa e validação estocástica de takes.
---

# audio-sound-design — Teoria do vault → tools locais

Skill-bridge: o **vault é a fonte de verdade teórica** (decision cards), as **tool skills são a execução** (100% local/OSS). Nunca decida áudio "de cabeça" — consulte o card; nunca cite o card sem executar pela tool certa.

- **MOC do domínio:** [[57.26-audio-moc]] (índice mestre, ordem de leitura em 4 fases, mapa de ferramentas)
- **Hub de regras irmãs:** [[57.00-_index]] (edição/cinema/roteiro/design — áudio cruza com todas)

## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)

| Domínio | Nota | Quando usar |
|---|---|---|
| Teoria de sound design | [[57.01-teoria-sound-design]] | Sempre. Synchresis (janela ±24 ms ≈ 1 frame; >80 ms quebra), added value, acousmêtre, vococentrismo, escuta reduzida. Base de toda decisão de sync e "colagem" som-imagem. |
| Foley | [[57.02-foley]] | Presença/peso/movimento do corpo: passos, roupas, props, respiração. Animação: TODO som de presença é Foley. |
| SFX (criação) | [[57.03-sfx-criacao]] | Gravação/edição de efeitos, layering, biblioteca própria, metadados, boom, sound reports. |
| Diálogo & ADR | [[57.04-dialogo-adr]] | Edição de diálogo, ADR, noise reduction, sincronia labial, off/narração. |
| Música para filme | [[57.05-musica-para-filme]] | Spotting session, hit points, underscore vs source, interação música×SFX, psicologia do temp track. |
| Mixagem | [[57.06-mixagem]] | Stems (D/M/E/M&E), hierarquia D>E>M, loudness por plataforma, calibração 85 dB SPL, checklist de entrega. |
| Masterização | [[57.07-masterizacao]] | Channel-based vs object-based, Atmos/5.1/downmix, matriz de formato×loudness por entrega. |
| Psicoacústica | [[57.08-psicoacustica]] | Mascaramento simultâneo/temporal, roughness, HRTF, infrassom (18–19 Hz horror). O "SO" do ouvido para EQ/compressão/pan funcionarem. |
| Field recording | [[57.09-field-recording]] | Captura fora do estúdio: kit por cenário (natureza/urbano/industrial), vento, SPL, logística. |
| Casos de estudo | [[57.10-casos-estudo]] | Referência de mestres (Murch, Burtt): técnica comprovada antes de inventar. |
| Decisões (cheat-sheet) | [[57.26-audio-moc]] § 🃏 CARDS S-01→S-11 | Resposta rápida DURANTE workflow. 11 cards: silêncio, música, diegese, Foley×biblioteca, ADR×produção, underscore×source, faixas de frequência, loudness, calibração, formato, espacial. **Primeira parada em qualquer pergunta de áudio.** |

> **Pitfall:** o mapa interno do [[57.26-audio-moc]] lista nomes antigos (`57.03-audio-dialogo`, `57.06-audio-sfx`…). Os arquivos REAIS são os da tabela acima (verificados em disco). Use os wikilinks como estão.

## ROUTING: tarefa → tool skill

| Tarefa | Tool skill | Teoria (gate) |
|---|---|---|
| TTS / off / narração (Piper local) | `piper-tts-take-qa` | [[57.04-dialogo-adr]] + card 5 (ADR×produção) |
| Música instrumental / underscore (ACE-Step 1.5) | `local-ai-music-generation` | [[57.05-musica-para-filme]] + card 6 (underscore×source) |
| Canção com letra (Suno-like) | `heartmula` | [[57.05-musica-para-filme]] + card 2 (quando NÃO usar música) |
| SFX sincronizado a vídeo (video→audio) | `mmaudio-local-sfx` | [[57.03-sfx-criacao]] + synchresis ([[57.01-teoria-sound-design]]) |
| SFX por texto (text→áudio) | `stable-audio-local-sfx` | [[57.03-sfx-criacao]] + card 4 (Foley×biblioteca) |
| Mixagem | sem tool skill — Resolve/ffmpeg + **[[57.06-mixagem]]** | stems D/M/E, hierarquia, loudness alvo |
| Masterização | sem tool skill — **[[57.07-masterizacao]]** | formato×loudness por plataforma, downmix |
| Sync de áudio externo no Resolve (MVI+m4a) | `resolve-audio-sync` | [[57.01-teoria-sound-design]] (janela de tolerância) |
| Mux de áudio em render Remotion | `remotion-video-audio-pipeline` | — |
| Prompt de música cinematográfica | `ai-cinematic-music-prompting` | [[57.05-musica-para-filme]] |

Mix/master são os únicos estágios **sem tool skill de execução** — a decisão É o card. A execução é Resolve (Fairlight) ou ffmpeg; o card define stems, alvo de LUFS e formato de entrega.

## WORKFLOW: design → foley → sfx → music → mix → master

**Pré-requisito absoluto: picture lock.** Mudança de corte após o mix = retrabalho de dias (integração 52↔57 do MOC).

### 1. DESIGN (planejamento, antes de gerar qualquer som)
- Leia [[57.26-audio-moc]] cards S-01→S-03 e [[57.08-psicoacustica]].
- **Gates:**
  - *Diegetic vs non-diegetic* (card 3): som que personagem ouve vs som só do público. Define camada do mix e verossimilhança.
  - *Silêncio vs música* (cards 1–2): silêncio absoluto é escolha ativa — clímax, contraste dinâmico (som após silêncio = 2–3× mais alto perceptual), terror. **Nunca** silêncio em: ação contínua, mobile/social (algoritmo penaliza), >15 s sem diálogo.
  - *Mapa de frequências* (card 7): diálogo vive em 200 Hz–4 kHz; LFE é o ".1". Nada mais pode ocupar essa banda durante diálogo crítico.
- Saída: sound plan por cena (camadas: diálogo / Foley / SFX / ambiência / música, com intenção de cada uma).

### 2. FOLEY
- **Gate: Foley vs biblioteca** (card 4, [[57.02-foley]]): personagem se move/tem peso físico na imagem ⇒ Foley (performance síncrona). One-shot genérico sem corpo (porta, trovão) ⇒ biblioteca/SFX.
- Animação e CGI: todo som de presença é Foley — é o que dá peso ao render.
- Sem Foley stage: gravar caseiro seguindo [[57.09-field-recording]] (condensador, room tone 30–60 s, 3–5 takes por som) ou sintetizar via `mmaudio-local-sfx`.

### 3. SFX
- **Gate: biblioteca vs criação original** ([[57.03-sfx-criacao]]): existe na biblioteca e é genérico ⇒ usar; é assinatura do projeto/mundo ⇒ criar (layering 3+ camadas, worldizing).
- Tools: `mmaudio-local-sfx` (video→audio já sincronizado — respeita synchresis ±24 ms), `stable-audio-local-sfx` (text→SFX; modelo gated, ver skill).
- Mandamentos de Viers que se aplicam a toda geração: 24-bit/48 kHz+ WAV, room tone sempre, múltiplos takes, log escrito, nunca normalizar cegamente.

### 4. MÚSICA
- **Gates:**
  - *Spotting antes de compor* ([[57.05-musica-para-filme]]): definir papel da música e hit points ANTES de gerar.
  - *Underscore vs source* (card 6): emoção guiada invisível vs música diegeticamente justificada na cena.
  - *Quando NÃO usar* (card 2): diálogo crítico (competição 200 Hz–4 kHz), imagem já clara (música redundante), documentário, últimos 30 s (respiro do público).
- Tools: `local-ai-music-generation` (ACE-Step 1.5, instrumental/underscore), `heartmula` (canção com letra), `ai-cinematic-music-prompting` (prompt craft).
- Direitos: conteúdo comercial ⇒ só biblioteca licenciada ou original. Nunca música sem licença.

### 5. MIX
- **Gates** ([[57.06-mixagem]]):
  - *Hierarquia inegociável:* **Diálogo > SFX narrativamente crítico > Música > Ambiência.** Se diálogo não é inteligível, o mix falhou.
  - *Conflito entre elementos:* separar por frequência/tempo/estéreo/profundidade (Izhaki), não por volume.
  - *Loudness alvo definido ANTES* (card 8): Netflix −27 LUFS, Amazon −24, EBU −23, ATSC/broadcast BR −24 (ABNT NBR 15601), YouTube −14, Spotify −16, cinema 85 dB SPL.
- Entrega em stems: D, M, E + M&E (para dublagem) + printmaster.

### 6. MASTER
- **Gates** ([[57.07-masterizacao]]):
  - *Formato por entrega* (card 10): WAV 24-bit/48 kHz (base), ADM BWF (Atmos streaming), MXF (broadcast), DCP (cinema).
  - *Espacial* (card 11): Atmos object-based (exibição em salas Atmos / movimento vertical / adaptação automática a múltiplos sistemas) vs 5.1/7.1 channel-based vs estéreo (web/social — downmix obrigatório e verificado).
  - *Multi-formato por natureza:* um master serve theatrical + streaming + broadcast + downmix; validar loudness em CADA derivado, não só no master.
- QC final: medir LUFS integrado do arquivo ENTREGUE (ffprobe/ffmpeg astats com `-v info`), não do intermediário.

## VALIDAÇÃO ESTOCÁSTICA DE TAKES (regra piper-tts-take-qa)

TTS (Piper) e geração de SFX/música por IA são **estocásticos**: a mesma frase/prompt gera áudio diferente a cada execução (3 sínteses idênticas → 3 md5 distintos). Isso invalida evidência de N=1.

1. **N≥5 sínteses** por caso em análise; reportar a **distribuição** (ex.: `confisco: 0/5`), nunca um take isolado. Com N=1, escrever literalmente "amostra única de processo estocástico — não reproduzível".
2. **Empilhar amostras independentes:** duas sessões do mesmo caso ⇒ N total (ex.: 5+9=14). Prova de independência: **md5 distinto por síntese**.
3. **Taxa só vira conclusão acima de ~N=14**; abaixo é faixa ("0/14 a 10/14") e a disposição é "exige escuta", nunca "pode ser aceito".
4. **ASR erra por ortografia, não por áudio** — antes de "exige escuta", duas camadas: (A) fonemizar esperado vs ouvido no próprio motor (espeak/`--debug`, SequenceMatcher: ≥0,97 homófono ⇒ falha do ASR, áudio certo; <0,75 divergente) e (B) ASR de outra classe (faster-whisper large-v3) nos WAV entregues.
5. **Nunca regenerar "até o ASR gostar"** — com processo estocástico isso é otimização de ruído. Se a métrica não melhora com NENHUM ajuste, o problema não é do take: registre a causa e pare.
6. **Medir o EXPORT, não o intermediário:** byte-identidade (`cmp`) export vs takes, md5 contra planilha, ffprobe de codec/rate/channels no entregue.
7. **Off Piper pt-BR = sempre SCRATCH** (só voz masculina `pt_BR-faber-medium` instalada): rotular e registrar que off definitivo exige outra fonte.
8. Sincronia: medir **duração** do take contra a janela do script (coluna `dur_janela_s`), não confiar no relatório.

## Notas

- Setup 100% local/OSS: Piper (`[TOOLS_DIR]\piper`), MMAudio/Stable Audio/ACE-Step na RTX 4060 Ti 16GB, Resolve Fairlight para mix. Nada de API paga.
- Skills-bridge irmãs: `film-decupage` (passo 11 = sound plan), `cine-studio-cinematic`, `resolve-audio-sync`.
- Se o pedido é só "gerar um SFX/música rápido" sem decisão narrativa → vá direto à tool skill (ROUTING) e pule o WORKFLOW. Answer the size of the question.
