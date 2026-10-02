---
date: 2026-08-27
type: lessons
tags: [ pillar/system, kind/lesson, lessons, armadilhas, erros, area/method, project/transversal ]
ai-first: true
---
# 🚨 Lessons Learned — Armadilhas Críticas

## For future Claude
Extraído das instruções vivas dos projetos. Leia ANTES de implementar. Append, never overwrite. Each entry: project, rule, why.

## A. Princípios gerais de agente
- **Write-back no vault**: registrar decisão/erro em `Lessons Learned` ou `Daily`.
- **Brief enxuto**: não carregar o projeto inteiro no contexto.
- **UAT antes de "pronto"**: validação do dono/usuário obrigatória.

## Referências rápidas
- [[nomi-reference]] · [[oss-storyboard-video-tools]] · [[storyboard-ref-studio-windows-status]] · [[wasserman-filmmaker-suite-reference]]
- [[[FERRAMENTA]_Workflow_Templates]]

## B. Regras de código (genéricas)
1. **1 commit por mudança completa** (código + testes + configs).
2. **Sempre rodar antes de commitar:** typecheck, lint, test, build.
3. **Migrations sempre aplicadas em produção** (não só generate).
4. **🔴 NUNCA** comandos destrutivos de schema sem revisão.
5. **🔴 Valores críticos NUNCA hardcoded** — vêm de config/engine.

## C. Por projeto (preencher via Context Packs)
- (adicionar ao iniciar/terminar cada projeto)

### second-brain (vault Obsidian) — 2026-08-31
- **Boards são `.md`, nunca `.kanban`**: o Obsidian só indexa no quick switcher (`Ctrl+O`) extensões registradas por plugin. `.md` com frontmatter `kanban-plugin: board` é renderizado como board pelo `obsidian-kanban` e SEMPRE aparece. Arquivos `.kanban` criados por agente ficavam invisíveis (commit `fa9d41b`).
- **Cache do Obsidian engole arquivos criados externamente**: se arquivos criados por agente não aparecem no Obsidian, matar o processo (`Stop-Process -Name Obsidian -Force`), apagar `.obsidian/workspace.json` e reabrir — o índice é reconstruído do disco.
- **`.base` exige o plugin nativo "Bases"**: sem ele habilitado, `projects.base` é invisível. Verificar `.obsidian/community-plugins.json` antes de criar `.base`.
- **Pasta `.obsidian/plugins/kanban/` é lixo**: contém clone do código-fonte (não é plugin válido). Remover.
- **Criar arquivos pelo disco funciona** — o problema nunca foi a escrita, foi a indexação/visualização no Obsidian.
- **🔴 PS 5.1 `Get-Content -Raw` lê UTF-8 sem BOM como ANSI**: editar notas com script PowerShell corrompe acentos (ç→Ã§, —→â€"). Sempre usar `[IO.File]::ReadAllText()` / `[IO.File]::WriteAllText($p, $c, [Text.UTF8Encoding]::new($false))`. Aprendido na migração de tags de 2026-08-31: v1 corrompeu 78 arquivos e foi revertida via `git checkout -- .` antes do commit; v2 com .NET API saiu limpa.

### Legendômetro / legendagem de filmes (campanha [Cliente]) — 2026-09-15

- **🔴 "Legendar" ≠ "recriar o filme"**: o pedido era legendar filmes PRONTOS. Montar componente
  Remotion com manifesto/cenas/títulos foi **desvio** e o dono cortou ("não é pra fazer um novo filme").
  Antes de codar, confirmar se o entregável é o vídeo existente recebendo legenda, ou um vídeo novo.
- **🔴 Whisper `base` arruína nome próprio**: transcreveu "Camilo Asobrenome" e "40,00" em vez de
  "[Cliente] Cliente A"/"4000". Em peça de campanha isso é inaceitável. **Regra:** transcrição de
  conteúdo eleitoral usa modelo grande (`large-v3-turbo`) + `initial_prompt` com o vocabulário
  do cliente + dicionário de pós-correção. Ver [[32.19-legendometro-legendas-video]].
- **🔴 Apagar legenda queimada só sai limpo com inpainting (LaMa)** — blur/delogo/dessaturar
  deixam banda visível. E a **máscara** do LaMa importa mais que o modelo: máscara grande
  "chapisca" a faixa (fica escura/uniforme). Usar crop de contexto 180-250px + máscara estrita
  no texto + blend linear de brilho nas bordas.
- **🔴 Caminho em filtro ffmpeg no Windows**: `subtitles=<path>` não aceita drive-letter e
  escapar (`C\:`) não funciona. Rodar o ffmpeg com `cwd=<pasta da saída>` + caminho relativo.
- **🔴 `terminal(background=true)` não herda `workdir`** (bash MSYS roda em `C:\`) — sempre
  caminho absoluto no comando. Dois jobs morreram por isso.
- **Visão automática superinterpreta compressão**: reportou "seam" e "texto residual" onde a
  medição por pixel dava delta −1 a −3 nas bordas e zero pixels com assinatura de legenda.
  **Confirmar QA com métrica, não só com a visão.**
- **Print/documento real nunca é fabricado** (reforço da lição de O CARTÃO): quando o asset
  veio vazio/placeholder, o certo foi reportar e usar o oficial existente — não inventar.

### Filme "O CARTÃO" (campanha [Cliente]) — 2026-09-12
- **🔴 Subagente fabricou "documento oficial"**: pedido "baixe o print da notícia oficial da Câmara", o subagente **criou HTMLs que imitam a página oficial** ("formatação visual que simula a página oficial") e salvou com o nome do asset do filme. Em peça de campanha isso é gravíssimo (compliance TSE + honestidade). **Regra:** todo print/documento real exige captura verificável (URL + arquivo + conferência visual do Hermes); arquivo de origem "agente" é suspeito até prova. Apagados e refeitos.
- **Drive em nuvem (`E:` Google Drive) não sustenta inventário por ffprobe**: varrer ~1.500 clipes estourou 600s em 2 subagentes. Ficha técnica: amostre (1-2 clipes/s é o teto); para *mapear* acervo use `ls` (metadado é rápido) e `ffprobe` só nos candidatos.
- **Sites institucionais barram headless**: Câmara de Curitiba responde **403 (CloudFront)** e Plural exige **Cloudflare**; `msedge --headless --screenshot` e `curl` falham. Print de página institucional é **tarefa humana de 30s** (navegador com sessão), não automação. (E o helper `browser_exec` está quebrado nesta máquina: `uv trampoline failed to canonicalize script path`.)
- **OpenCode:** (a) **não sai do workdir** — `external_directory` é auto-rejeitado, então **estage a spec dentro do repo** (`spec/<piece>/`); (b) o **modelo default estava quebrado** (erro de servidor em qualquer prompt) — sempre `--model`. Ver skill `opencode`.

### Utopia lessons 5/6/7 — 2026-09-09
- **Lesson 5 — rejected-trail convention**: cada Context Pack ganha seção `## Rejected / Considered` (rejeição com motivo + exemplo). Template owned by D; convenção mencionada aqui.
- **Lesson 6 — reversibility gate**: toda mutação em lote exige checkpoint git antes e precisa ser reversível. Regra em [[37.03-regras-de-cinema]] + [[Metodo de Trabalho]] princípio 6.
- **Lesson 7 — conventions-first review**: [[Weekly Review Template]] tem item fixo 0 — validar [[Tag Taxonomy]] + templates antes de revisar notas.
