---
name: bnf-lite-install
description: >
  Instala o BNF-LITE a partir do payload local deste repo. Zero URL, zero rede,
  zero repo externo. Usar quando a pessoa cola o prompt de instalação do BNF-LITE
  no OpenCode, ou quando pedirem para instalar as skills do forge de forma autonoma.
disable-model-invocation: true
---

# BNF-LITE — Instalador local

O payload está **neste repo**, em `lite/payload/`. Não existe URL, não existe clone
externo, não existe dependência de rede. Se você está lendo isso e o `payload/` não
está ao lado, você não tem o lite — pare e diga isso ao usuário.

## Fonte de verdade

`lite/payload/MANIFEST-skills.json` — 67 skills em 8 tiers + 12 MOCs, cada um com
`sha256`, contagem de `files`, `bytes` e `origin` (de onde foi vendorizado no forge).

Confie no manifest, não na sua memória da lista. Se uma skill do manifest não
existir no prompt que você recebeu, o manifest vence.

## Layout do payload

```
payload/
  MANIFEST-skills.json          67 skills + 12 MOCs, com sha256
  skills/<tier>/<nome>/         a skill inteira: SKILL.md + references/ + agents/ + scripts/
  mocs/<arquivo>.md             12 decision-card MOCs
```

## Regras que não podem ser negociadas

### 1. Anti-colisão por sha256
Se `$SKILLS/<nome>/SKILL.md` já existe e o sha256 **difere** do manifest: não
sobrescreva. Copie para `$SKILLS/.incoming/<nome>/` e registre a colisão.
Se **igual**: pule (idempotente).
Duas cópias divergentes da mesma skill fazem o agente escolher por sorteio. Já
aconteceu no forge (`ask-matt` está assim hoje). Não reproduza.

### 2. Segredos nunca no bundle
O `.env` escrito na máquina tem **linhas de nome com valor vazio**. Nunca
`CHANGEME`, nunca exemplo que pareça chave. O prompt nunca repete o valor digitado.
Chave inválida: diga qual, nunca o valor.

### 3. config.yaml mínimo
Não copie `mcp_servers`, `personalities`, `kanban`, `slack`/`discord`/`telegram`,
`cron`, `tts`/`stt`, `moa`, `gateway`, `plugins`, `platform_toolsets` do config do
dono. São config de máquina, não de sistema. O Hermes cria o default no primeiro run.

### 4. Zonas excluídas do vault
Copie `30-conhecimento`, `50-sistema`, `80-templates`, `.obsidian`.
**NUNCA** toque `00-inbox`, `10-clientes`, `20-projetos`, `40-pessoal`, `90-arquivo`.
São dados da pessoa. Não copie por cima, não leia.

### 5. Regras gerais são o default
As 9 de T0 são persistentes. `/ponytail`, `/i-have-adhd`, `/caveman` combinam por
padrão em toda mensagem. Não anuncie o estilo — aplique.

## Processo

1. **Pré-verificação** — `node`, `git`, python, `$HOME` gravável. Instale o que faltar
   (winget/brew). Não instale Obsidian aqui.
2. **Diretórios** — `$SKILLS/`, `$SKILLS/.incoming/`, `$RULES/`, vault `50-sistema/`.
3. **Skills** — copie `payload/skills/<tier>/<nome>/` → `$SKILLS/<nome>/`, na ordem do
   tier, respeitando a anti-colisão.

   Duas skills são **routers** e não podem ser podadas: `remotion-best-practices`
   e `creative-motion` são índice que aponta por nome para subskills. Os arquivos
   que elas "não apontam" são conteúdo único (19 diretórios no remotion router).
   Se alguém pedir para enxugar cortando "o que o SKILL.md não referencia",
   isso quebra o cluster inteiro.
4. **MOCs** — `payload/mocs/*.md` → `<vault>/50-sistema/57-conhecimento/`. Literal:
   não resuma, não paraphraseie, não complete lacuna.
5. **Agente** — escreva `config.yaml`, `.env`, `OBSIDIAN_VAULT.md` com os placeholders
   resolvidos do runtime.
6. **Segredos** — peça uma vez cada, echo off. Sem a chave, deixe vazio e siga.
7. **Audit hook** — as 7 regex em `rules/audit-rules.yaml`. Instale como pre-commit.
   **Prove que bloqueia**: crie arquivo com `sk-AAAA...`, commite, espere rejeição,
   apague. Se não bloquear, o hook está errado — conserte antes de seguir.
8. **Verificação** — os `[ ]` do prompt, incluindo: nenhum sha256 duplicado entre
   diretórios de `$SKILLS/`, grep de segredo vazio, grep de path de dono vazio.
9. **Veredito** — GREEN / YELLOW / RED. Em RED: reverta tudo que você escreveu nesta
   sessão. Prefira apagar a "limpar": half-apagado é pior que não instalado.

## Paths

| | Windows | macOS |
|---|---|---|
| `SKILLS` | `%LOCALAPPDATA%\hermes\skills` | `~/.local/share/hermes/skills` |
| `RULES` | `%LOCALAPPDATA%\hermes\rules` | `~/.local/share/hermes/rules` |
| `VAULT` | `$OBSIDIAN_VAULT_PATH` ou `%USERPROFILE%\Documents\ObsidianVault` | idem |
