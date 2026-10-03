# BNF-LITE — PROMPT DE INSTALAÇÃO ( versão final )

> **Autocontido.** O payload — 67 skills, 12 MOCs, templates, regras, gate — está
> em `lite/payload/`, neste repo. Zero URL, zero rede, zero `gh auth`, zero repo externo.
> Confirme que você está na raiz do repo: `ls lite/payload/MANIFEST-skills.json`.
> Payload sanitizado: zero nome de cliente, zero path de dono, zero secret.
> Se não estiver, pare e diga ao usuário.
>
 O `MANIFEST-skills.json` é a fonte
> de verdade — se a lista abaixo e o manifest divergirem, o manifest vence.

---

# PROMPT 1 — INSTALA

```
Instale o BNF-LITE. Você é o instalador. Execute, não descreva.

## 0 — CONFIRME O PAYLOAD ( antes de tudo )
  [ ] ls lite/payload/MANIFEST-skills.json
  [ ] leia lite/payload/MANIFEST-skills.json  -> 67 skills + 12 MOCs
Se o payload não estiver aí: PARE. Diga ao usuário que este prompt precisa do
repo. Não tente clonar nada, não baixe de URL, não procure fonte alternativa.

OS    : windows | macos   (detecte; se não conseguir, pergunte)
HOME  : windows -> %LOCALAPPDATA%\hermes\   |   macos -> ~/.local/share/hermes/
VAULT : OBSIDIAN_VAULT_PATH do ambiente, se existir.
        senão windows -> %USERPROFILE%\Documents\ObsidianVault\
             macos   -> $HOME/Documents/ObsidianVault/

## 1 — PRÉ-VERIFICAÇÃO ( antes de escrever qualquer byte )
  [ ] node --version   [ ] git --version   [ ] python3 --version OU python --version
  [ ] $HOME é gravável
node ou git faltando: instale (winget / brew) e continue.
python faltando: instale OU reporte. Skills não exigem python; o Hermes exige.
Nunca instale Obsidian aqui.

## 2 — DIRECTÓRIOS ( crie agora )
  $HOME/skills/                          71 skills
  $HOME/skills/.incoming/                colisões — nunca sobrescreve
  $HOME/rules/                           audit-rules.yaml + o hook
  $VAULT/                                24 zonas (ver secção 6)
  $REPO/openspec/                        ciclo de spec (ver secção 2b)

  $REPO = o repo onde a pessoa trabalha. Se ela colou o prompt num repo git,
  use esse. Senão crie ~/openspec-repo e git init.

## 2b — CICLO DE SPEC (OpenSpec)
  É o que faz mudança de código ser spec antes de ser código.
  SEM ISSO as skills de spec não têm onde escrever.

  $REPO/openspec/config.yaml            a partir de lite/openspec/config.yaml
  $REPO/openspec/specs/                  as 5 specs promovidas (lite/openspec/specs/)
  $REPO/openspec/changes/                VAZIO. toda mudança nova nasce aqui
  $REPO/.agents/skills/openspec-*        as 6 skills (se a pessoa usa .agents/)

  CYCLE:  /openspec-propose      -> cria changes/<id>/{proposal,design,tasks}.md
           /openspec-apply-change -> implementa a change
           /openspec-archive-change -> promove pra specs/<capability>/spec.md
  APOIO:  /openspec-explore /openspec-update-change /openspec-sync-specs

  REGRA: a spec vive no repo, o ESTADO vive no vault (card no board
  50-sistema/56-boards/). Nunca promova change sem os testes do tdd.
Se $HOME/skills/ já existir com skills: NÃO apague. A regra anti-colisão vale.

## 3 — AS 71 SKILLS
Copie lite/payload/skills/<tier>/<nome>/  ->  $HOME/skills/<nome>/
Não substitua a lista. São 71 nomes em 8 tiers. Baixe na ordem do tier.

T0 — REGRAS GERAIS (9) · sempre ativas, toda mensagem, sem exceção
    ponytail        ponytail-review    ponytail-audit     ponytail-debt
    ponytail-gain   ponytail-help      i-have-adhd        caveman
    caveman-commit
T1 — SPEC E FLUXO (14)
    openspec-propose   openspec-apply-change   openspec-explore
    openspec-update-change   openspec-sync-specs   openspec-archive-change
    grill-with-docs   grill-me    grilling
    to-spec      to-tickets     implement        tdd
    code-review
T2 — NAVEGAÇÃO E FASE (8)
    ask-matt       handoff     claude-handoff     wait-what
    prototype      research    to-questionnaire   wayfinder
T3 — INFRA DE AGENTE (5)
    hermes-agent   hermes-skill-install   hermes-provider-config
    hermes-mcp-troubleshoot   wizard
T4 — QUALIDADE E DEBUG (8)
    systematic-debugging   diagnosing-bugs        domain-modeling
    codebase-design        improve-codebase-architecture
    resolving-merge-conflicts   careful          guard
T5 — GIT E GITHUB (7)
    github-repo-management   github-issues      github-pr-workflow
    github-code-review       git-commit         using-git-worktrees
    finishing-a-development-branch
T6a — VERTICAL DEV (6)
    frontend-design   vercel-react-best-practices   accessibility
    web-design-guidelines   frontend-skills    vercel-composition-patterns
T6b — VERTICAL VÍDEO E CINEMA (14)
    cinema-geral-decisions   film-decupage       film-editing
    screenplay-craft         creative-motion     audio-sound-design
    remotion-best-practices  (router — as 7 subskills que ele roteia estão
                              logo abaixo; são o mesmo cluster, não duplicata)
    remotion-3d-alpha        remotion-film-overlays
    remotion-headless-fonts  remotion-three-3d
    remotion-video-audio-pipeline   remotion-video-production
    remotion-windows-render

REGRA ANTI-COLISÃO — obrigatória.
  Compare o sha256 do SKILL.md de destino com o do manifest.
  Igual      -> pule. Idempotente.
  Diferente  -> NÃO sobrescreva. Copie em $HOME/skills/.incoming/<nome>/ e
                registre a colisão.
  Por quê: duas cópias divergentes da mesma skill fazem o agente escolher por
  sorteio. Já aconteceu neste sistema (ask-matt está assim hoje). Não reproduza.

## 4 — OS 12 MOCs
lite/payload/mocs/*.md  ->  $VAULT/50-sistema/57-conhecimento/
  57.00-cinema-theory-moc.md     57.20-roteiro-moc.md
  57.21-cinematografia-moc.md   57.22-edição-moc.md
  57.23-montagem-moc.md         57.24-animação-moc.md
  57.25-design-moc.md           57.26-audio-moc.md
  57.26-audio-dominio-moc.md    38.00-web-dev-moc.md
  52.00-agent-config-moc.md     35.03-transversal-moc.md
Formato de cada card: CONTEXTO / QUANDO USAR / O QUE FAZ / PORQUÊ / EXCEÇÃO /
SINAIS DE ERRO. Conhecimento de consulta, não executável. Copie literal: não
resuma, não paraphraseie, não complete lacuna.

## 5 — O AGENTE ( escreva estes 3 arquivos, dos templates )
Substitua os placeholders por valores resolvidos do runtime.

5a — $HOME/config.yaml   a partir de lite/templates/config.yaml.template
    É o config do HERMES. Não copie mcp_servers, personalities, kanban,
    slack/discord/telegram, cron, tts/stt, moa, gateway, plugins, platform_toolsets
    do config de ninguém — isso é config de MÁQUINA, não de sistema. O Hermes
    cria o default no primeiro run.

5b — $HOME/.env   a partir de lite/templates/env.template
    Segredos ficam VAZIOS. Nunca CHANGEME, nunca exemplo que pareça chave.

5c — $HOME/OBSIDIAN_VAULT.md   a partir de lite/templates/OBSIDIAN_VAULT.md.template
    Este é o perfil de agente. Contém as regras gerais (T0), o mapa de skills,
    os pointers de knowledge e spec, e a lei de sanitização.

## 6 — VAULT OBSIDIAN ( brain com a mesma estrutura )

Este passo monta um segundo cerebro com a organizacao de referencia: 24 zonas
numeradas + as convencoes que fazem o agente saber como trabalhar nela.

DETECÇÃO ( nesta ordem ):
  $OBSIDIAN_VAULT_PATH no ambiente  ->  usa essa
  senão existe $USERPROFILE/Documents/ObsidianVault  ->  usa essa
  senão não existe                     ->  $VAULT = $USERPROFILE/Documents/ObsidianVault
                                          crie. NÃO instale o app sem perguntar.

SE $VAULT JÁ EXISTE E NÃO ESTÁ VAZIA :
  É o vault da pessoa. Copie APENAS as zonas que faltarem. NÃO copie por cima,
  NÃO leia 10-clientes, 40-pessoal, 20-projetos, 90-arquivo. Liste o que existe,
  mostre à pessoa, e pergunte antes de escrever qualquer coisa.

SE $VAULT ESTÁ VAZIO OU NÃO EXISTE :
  Copie lite/vault-template/ -> $VAULT/  (164 arquivos, ~900 KB, sanitizado)

  Zonas criadas por vault-template/:
    00-captura  08-filmes  10-clientes  20-projetos  28-books
    30-conhecimento/{31-ia-e-agentes,32-video-remotion,33-marketing,
                     34-infraestrutura,35-second-brain,36-seguranca,
                     37-regras-e-decisoes,38-web-dev}
    40-pessoal  50-sistema/{51-skills,52-agent-config,53-templates,
                           54-scripts,55-convencoes,56-boards,57-conhecimento}
    90-arquivo  .obsidian/  Mapa.md

  APÓS COPIAR:
  1. lite/payload/mocs/*.md  ->  $VAULT/50-sistema/57-conhecimento/
  2. lite/templates/OBSIDIAN_VAULT.md.template -> $HOME/OBSIDIAN_VAULT.md
     substitua <SKILLS> por 71 e <VAULT> pelo path real do vault
  3. $VAULT/50-sistema/55-convencoes/AGENTS.md é a convenção raiz. Confirme que
     os paths dentro dela batem com $VAULT antes de confiar nela. Se mentionar
     zonas que você não criou, ajuste — o template veio de um vault maior.

  NÃO remova .obsidian/. Ele traz config de plugin e appearance que funcionam.
  NÃO edite Mapa.md para apontar a si mesmo.

## 7 — SEGREDOS
Cada linha vazia e secreta de $HOME/.env: peça UMA vez, echo off, escreva no .env
da máquina. Nunca no repo, nunca no chat, nunca em log.
Sem a chave: deixe vazio e prossiga. Não bloqueie a instalação.
Valide as fornecidas com 1 token de chamada real. Chave inválida: diga qual,
nunca o valor.

## 8 — GATE DE SANITIZAÇÃO ( obrigatório )
Copie lite/rules/audit-rules.yaml e lite/hooks/bnf-lite-audit.sh para $HOME/rules/.
Instale o .sh como pre-commit em $HOME e em todo repo que a pessoa criar depois.
  git config --global core.hooksPath <caminho-do-hook-dir>
  (ou copies .git/hooks/pre-commit e chmod +x)

PROVE que bloqueia: crie um arquivo com sk-AAAA... , tente commitar, ESPERE a
rejeição, mostre a saída, apague. Se NÃO bloquear, o hook está errado — conserte
antes de seguir. Hook que existe mas não bloqueia é pior que não ter: parece
proteção.

## 9 — VERIFICAÇÃO
  [ ] $HOME/skills/ tem 67 diretórios com SKILL.md
  [ ] nenhum sha256 duplicado entre diretórios de $HOME/skills/
  [ ] $HOME/skills/.incoming/ vazio, ou toda colisão reportada
  [ ] openspec/: config.yaml + specs/ (5) + changes/ (vazio) em $REPO
[ ] vault: zonas de vault-template/ copiadas (ou as que faltavam)
[ ] vault: 12 MOCs em $VAULT/50-sistema/57-conhecimento/
[ ] vault: $HOME/OBSIDIAN_VAULT.md escrito com <SKILLS>=67 e <VAULT> real
  [ ] grep -rE 'sk-[A-Za-z0-9-]{10,}|AKIA[A-Z0-9]{16}|ghp_|github_pat_|xox[abprs]-|PRIVATE KEY' $HOME $VAULT -> vazio
  [ ] grep -rE 'C:\\(AI|Users)' $HOME/skills $HOME/rules -> vazio
  [ ] $HOME/config.yaml SEM mcp_servers, personalities, kanban, plugins
  [ ] $HOME/.env só com chaves, nenhum valor de exemplo
  [ ] o gate REJEITA um commit de teste com segredo (mostre a rejeição)
  [ ] opencode --version OU hermes --version responde
  [ ] /ponytail, /i-have-adhd, /caveman, /ask-matt presentes

## 10 — VEREDITO
GREEN  = todos os [ ] ok
YELLOW = instalado, 1-2 [ ] falharam — nomeie quais
RED    = segredo ou path de dono vazou. NÃO SIGA. Diga arquivo e linha.
        Em RED: reverta TUDO que você escreveu nesta sessão. Prefira apagar a
        "limpar": half-apagado é pior que não instalado.

## 11 — RELATÓRIO
  67 skills em <path> · 12 MOCs em <path> · colisões: N
  Diga: "Lite pronto. O Prompt 2 traz o resto quando quiser."
```

---

# PROMPT 2 — UPGRADE

```
Você está fazendo upgrade de BNF-LITE para o pacote COMPLETO.

## 0 — CONFIRME
  [ ] ls skills/hermes-tree/ && ls skills/user-level/   <- o full, no mesmo repo
Se não estiverem aí: PARE. O upgrade precisa do forge completo neste repo.
Sem URL alternativa, sem clone externo.

HOME / VAULT : mesma derivação do Prompt 1. Use OBSIDIAN_VAULT_PATH se existir.

## 1 — BASELINE ( antes de qualquer escrita )
Liste as 67 skills de $HOME/skills/ com o sha256 de cada SKILL.md.
Salve em $HOME/.bnf-upgrade-baseline.json.
Esse arquivo É o rollback. Sem ele, não comece.

## 2 — DIFF, SEM INSTALAR
Copie skills/hermes-tree/ e skills/user-level/ para $TMPDIR/bnf-full/.
Compare as 67 do baseline contra as do full:
  [ ] as 67 existem no full
  [ ] sha256 IDÊNTICO nas 67
      -> alguma divergiu: o full é um fork do lite. PARE. Mostre o diff de 3
         linhas. Pergunte: upgrade ou manter o lite? NÃO sobrescreva sem resposta.
  [ ] quantas são NOVAS (full menos lite) -> reporte o número

## 3 — AS ZONAS DO VAULT
Copie vault-template/ para $VAULT/:
  COPIE:  30-conhecimento   50-sistema   80-templates   .obsidian
  NUNCA:  00-inbox  10-clientes  20-projetos  40-pessoal  90-arquivo
Zona excluída já existente: NÃO copie por cima, NÃO leia, registre "preservada"
e siga. São dados da pessoa, não do pacote.

## 4 — INSTALE O FULL
$TMPDIR/bnf-full/  ->  $HOME/skills/     (268 hermes-tree + 246 user-level = 515)
Mesma regra anti-colisão do Prompt 1: sha igual -> pula; diferente -> .incoming/.

## 5 — ATUALIZE O AGENTE
Em $HOME/OBSIDIAN_VAULT.md, seção # Skills:
 67 -> 515
  Roteiro: /ask-matt
  Spec:   /openspec-propose -> /openspec-apply-change
  Fluxo:  /grill-with-docs -> /to-spec -> /to-tickets -> /implement -> /code-review
Acrescente em # Specs: as 5 promovidas em openspec/specs/ —
  agent-configs, cross-platform-installer, curation-pipeline,
  skills-distribution, vault-skeleton
A seção # Regras gerais NÃO muda. As 9 de T0 são a base — não subiram de nível.

## 6 — GATE
Reescreva $HOME/rules/ com o conjunto full (audit/rules.yaml + install-git-hook).
Prove que ainda bloqueia: crie, commite, espere a rejeição, apague.

## 7 — VERIFICAÇÃO
  [ ] $HOME/skills/ tem 515 diretórios com SKILL.md
  [ ] as 67 do baseline com sha256 IDÊNTICO
  [ ] grep de segredo -> vazio
  [ ] grep de path de dono -> vazio
  [ ] 4 zonas copiadas, 5 excluídas intactas
  [ ] o gate bloqueia commit de teste
  [ ] $HOME/config.yaml segue SEM mcp_servers/personality/kanban/plugins

## 8 — VEREDITO
GREEN / YELLOW / RED. Em RED: reverta usando .bnf-upgrade-baseline.json.

## SE PRECISAR VOLTAR
Apague o que o full adicionou (515 menos 67) e restaure as 67 do baseline.
```

---

# MEDIÇÃO

```
T0 regras-gerais        9 skills     37,0 KB    13 files
T1 spec-fluxo          10 skills     45,2 KB    20 files
T2 navegacao-fase       8 skills     50,6 KB    19 files
T3 infra-agente         5 skills    139,9 KB    14 files
T4 qualidade-debug      8 skills     99,1 KB    32 files
T5 git-github           7 skills     88,6 KB    15 files
T6a vertical-dev        6 skills    426,7 KB   104 files
T6b vertical-video     14 skills  2.856,6 KB   268 files
                   ---
TOTAL SKILLS           67 skills    3,66 MB
T7 MOCs                12 files     281,6 KB
                   ---
PAYLOAD               498 arquivos   3,93 MB
```

T6b = 78% do peso. As 5 mais pesadas:

| Skill | Peso | Arquivos |
|---|---|---|
| remotion-best-practices (router) | 1.109 KB | 137 |
| film-decupage | 1.048 KB | 54 |
| creative-motion (router) | 435 KB | 37 |
| vercel-react-best-practices | 224 KB | 76 |
| remotion-film-overlays | 135 KB | 18 |

## Versão enxuta: medida e rejeitada

Cortar para `SKILL.md` + pointer chain transitivo dá **-14%** (3,93 → 3,40 MB) e
mutilaria `careful` (-73%) e `remotion-film-overlays` (-55%). **48 das 67 skills
saem 100% intactas.** Não compensa o risco.

Os dois "routers" (`remotion-best-practices`, `creative-motion`) **não podem ser
cortados**: são índice que aponta por nome para subskills, e os arquivos que
eles "não apontam" são conteúdo único — 19 diretórios no remotion router, nenhum
duplicando as skills standalone.

Medir slim contando só o `SKILL.md` dá **-59%** e é **falso**: é o número que
ignoreia os routers e quase destruiu o cluster Remotion. Se alguém te oferecer
esse número, peça o método.

Gate: 7 regras, **testado 11/11** com git real.
