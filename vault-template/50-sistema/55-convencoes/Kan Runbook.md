# Kan Runbook p/ agentes (board [Cliente] 2026)

> `#sdd #handoff #audit`. Como qualquer agente (Hermes, OpenCode, outro) opera o Kan. Ver [[Mirror Convention]].

## ⚠️ Nomenclatura

- **"Kan"** = o board ao vivo (`kanbn/kan` fork → `clientekan.vercel.app`). **"Kaneo"** é o nome
  PRÉ-migração (a lane foi trocada — ver `hermes/openspec/changes/connected-vaults-kanban/specs/kan/spec.md`).
  Docs antigos ainda dizem "Kaneo"; hoje é **Kan**. Não confundir com o board do CLI Hermes (`hermes kanban`),
  que é a **fila de agentes** — sistema diferente.

## As 3 camadas (não misturar)

| Camada | O quê | Quem move |
|---|---|---|
| **Kan web** (`clientekan.vercel.app`, board `a03x3cpjonxh`) | o **ao vivo** p/ humanos (dono + Balda) | humanos |
| **`.md` do vault** (`50-sistema/56-boards/Cliente A Kanban.md`) | o **arquivo** — **manda em divergência** | agentes (editam o markdown) |
| **CLI Hermes** (`hermes kanban --board cliente-filmes`) | **fila de execução de agentes** (assignee = profile) | dispatcher/workers |

## IDs canônicos

- Workspace `[Cliente] 2026` (renomeado de "Produto X" 2026-09-21):\ `vjlycfadohqi` · Board `[Cliente] 2026`: `a03x3cpjonxh`
- Listas (nomes atuais no Kan, PT-BR desde 2026-09-15): Brainstorm `a29ngdsodfe0` · Edição `i3cdiobh9jlr`
  (ex-*Editing*) · Motion `n25m5ikkinao` · Aprovação `x2e6m752bg6h` (ex-*Approval*) ·
  FINALIZADO `fmo6bj7wrxd2` (ex-*Done*) · Postado `caz2jf7uxnmb` (ex-*Published*).
- Base: `https://clientekan.vercel.app/api/v1`

## Auth

- Header `Authorization: Bearer *** (ou `x-api-key`). Token só em env/secret local — NUNCA em arquivo commitado, chat log ou doc. 1 card por filme; tasks do filme = checklist dentro do card.
- ⚠️ **Estado 2026-09-15:** sem o token a API responde **HTTP 401**. O token **não está** no env do shell, nas env vars do Windows, no `.hermes/.env` nem nos `.env*` do `[CAMINHO]` — está com o **dono** (env var `KAN_API_TOKEN`). **Não pedir o token no chat** (regra acima). Sem ele, faça o espelho **no `.md`** (que manda) e marque o item do Kan como pendente.
- Backup do config antes da troca: `config.yaml.bak-20260915`.

- Criar card: `POST /cards {"title","description","listPublicId","labelPublicIds":[],"memberPublicIds":[],"position":"end"}`
- Mover: `PUT /cards/{id} {"listPublicId"}`
- Checklist: `POST /cards/{id}/checklists {"name"}` → `POST /checklists/{cl}/items {"title"}`
- Etiqueta: `POST /labels {"name","boardPublicId","colourCode"}` → `PUT /cards/{id}/labels/{labelId} {}`
- Apagar card: `DELETE /cards/{id}` · Ler board: `GET /boards/{id}`

## O que NÃO está ligado (checar antes de assumir)

- ❌ **MCP do Kan não registrado** no `config.yaml` do Hermes (só `davinci-resolve`) → agente não tem caminho autenticado.
- ❌ **Kan Sync** (plugin Obsidian, 2 vias) não instalado — `.obsidian/plugins/` não tem plugin de sync.
- ⏳ **Pendente (humano):** conta seed `filmes-admin@clientekan.vercel.app` detém o workspace (senha fora do repo)
  → dono criar conta própria e pedir transferência (ou configurar SMTP) · convidar Balda · Balda confirmar leitura das convenções.
- Consequência: o espelho hoje é **manual** (agente edita o `.md`), não automático.

## 🔧 Ferramenta: `kan_sync.py` (monitor de mudanças)

`[CAMINHO]` — fala direto na API (não precisa de MCP).

```
python C:/AI/tools/kan-sync/kan_sync.py check      # diff vs snapshot (exit 1 se mudou)
python C:/AI/tools/kan-sync/kan_sync.py baseline   # grava o snapshot atual
python C:/AI/tools/kan-sync/kan_sync.py show       # lista o board agora
python C:/AI/tools/kan-sync/kan_sync.py md <Lista> # emite bullets p/ espelhar no .md
```

Pega o token do `.env` do Hermes. Detecta: card novo/removido, mudança de **lista**
(movido), título, labels, membros, prazo e itens de checklist.

> ⚠️ Humanos (dono + **Balda**) mexem no Kan. Quando o Balda adiciona cards, eles
> aparecem no `check` como NOVOS — espelhe no `.md` no mesmo turno. É exatamente
> o que aconteceu em 2026-09-15 (23 cards `DARK · <cidade>` + 2 `APOIO · <nome>`).

## 🔑 Onde está a chave (corrigido 2026-09-15)

- Token em **`.env`**, nunca literal no `config.yaml`:
  `~/.hermes/.env` e `%USERPROFILE%\AppData\Local\hermes\.env` → `KAN_API_TOKEN=kan_...`
- `config.yaml` → `mcp_servers.kan.env.KAN_API_TOKEN: "${env:KAN_API_TOKEN}"`
  (a interpolação `${env:VAR}` resolve do `.env` — ref: docs MCP Config Reference).
- ⚠️ `hermes mcp test <srv>` pode logar "keeping the literal placeholder" se ler o config
  antes de carregar o `.env` — **é artefato de ordem**, não erro. Para provar, cheque
  `load_hermes_dotenv()` + `_expand_env_vars()` com o python do venv do Hermes.
- Backup do config antes da troca: `config.yaml.bak-20260915`.

## 👥 Membros do workspace

- `<user>@gmail.com` (Guinness, dono) · `lucasb.…` (**Balda**, já ativo)
- ✅ "Convidar Balda" (pendência antiga dos docs F1A) — **já resolvido**, ele é membro ativo.

## 🎬 Distribuição de projetos (por membro / editorial) — 2026-09-15

| Membro | ID público | Setor (labels que edita) |
|---|---|---|
| **jaguar** (`gust.silva43@gmail.com`) | `oixlzba24e7p` | `dark-cidades` + `dark-uni` (22 cards) |
| **lucasbaldasso** (`lucasb.…`) | `q0e99yg36jgb` | `VLOG` + `Jingle` (10 cards: TL49–57 + TL40) |
| **Guinness** (eu) | `zginbwss3u8j` | todo o resto (35 cards) |

- Regra de distribuição por **label/nome**: `dark-cidades`/`dark-uni`→jaguar · `VLOG`/nome "Jingle"→lucasbaldasso · resto→Guinness.
- **Inclui os já feitos** (Postado), não só os em aberto — todos os 67 cards estão atribuídos.
- API: `PUT /cards/{id}/members/{memberPublicId}` **toggle** (add se ausente, remove se presente) — remover/adicionar até ficar só o dono correto.

## ⚖️ Coluna APROVAÇÃO — direção criativa (vigiado)

- **Responsáveis pela APROVAÇÃO:** **lucasbaldasso** (diretor criativo) e **Guinness** (diretor criativo). Ambos.
- Todos os 3 são **editores** dos filmes — a distribuição acima é de edição, não de propriedade do card.
- **Tudo que cai em APROVAÇÃO** (lista Approval `x2e6m752bg6h`) precisa de **aviso p/ os dois** (lucasbaldasso + Guinness).
- **SÓ lucasbaldasso e Guinness podem mover** cards da coluna APROVAÇÃO (pra frente ou pra trás). Jaguar nunca.
- ⚠️ Quando um edit (jaguar ou balda ou guinness) mandar um card p/ APROVAÇÃO, o agente deve notificar ambos os diretores criativos — e **não mover** o card para fora da APROVAÇÃO por conta própria.

## 🔔 Alerta de APROVAÇÃO (serverless) — sempre online, ZERO LLM

Criado **2026-09-15** porque a coluna APROVAÇÃO precisa de aviso instantâneo aos 2 diretores, **mesmo com o Hermes local offline**.

### Arquitetura (ponto a ponto, testada)
```
Kan (Vercel) → webhook `card.moved` → Cloudflare Worker → Discord #cliente-a
```
- **Webhook Kan:** evento `card.moved`, URL do Worker, ativo. Criado `publicId: 1gfr6279p1nt`.
- **Worker:** `kan-approval-watch` (Cloudflare Functions) — 100% serverless, roda na nuvem 24/7. **Não depende do PC local nem de LLM.**
- **Secret:** `DISCORD_WEBHOOK_URL` (webhook do canal `#cliente-a`) — registrado no Worker via `wrangler secret`, **nunca hardcoded**.
- **Var de ambiente do Worker:** `APPROVAL_LIST_ID=x2e6m752bg6h` (id da coluna Aprovação).

### Comportamento do Worker
1. Recebe `POST` do Kan com payload `{event:"card.moved", data:{card, list, changes}}`.
2. **Filtra:** apenas quando `changes.listId.to === "x2e6m752bg6h"` (entrou na APROVAÇÃO).
   - Qualquer outro movimento → responde `{"ignored":true}` sem postar no Discord.
3. Se for APROVAÇÃO → posta no Discord formato:
   ```
   🎬 **CARD NA APROVAÇÃO** · {card.title} (TL...)
   → Lista: Aprovação
   ```
   - Com **ping `<@Guinness> <@lucasbaldasso>`** (386562433713700864, 365290881097400321).
   - Mensagem testada → Discord devolveu `204 No Content` = **entregue com sucesso**.

### Como validar
```bash
# movimento pra APROVAÇÃO (DEVE postar no Discord):
curl -X POST https://kan-approval-watch.cliente-cliente-a.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"event":"card.moved","data":{"card":{"publicId":"tlX","title":"TESTE (TLx)","listId":"x2e6m752bg6h"},"list":{"name":"Aprovação"},"changes":{"listId":{"from":"<origem>","to":"x2e6m752bg6h"}}}}'

# movimento pra outra lista (DEVE ignorar):
# -> responde {"ignored":true,"event":"card.moved"}
```

### Deploy / recovery
- Local do projeto: `[CAMINHO]` (`wrangler.toml`, `src/index.js`, `package.json`).
- Comandos: `npx wrangler whoami` (auth via `CLOUDFLARE_API_TOKEN` no `.env`), `npx wrangler deploy`.
- Subdomain registrada: `cliente-cliente-a` (via API `PUT /accounts/{account_id}/workers/subdomain`).
- **Se o worker sumir da Cloudflare:** clonar `kan-approval-worker/` + `npx wrangler deploy` + re-registrar webhook no Kan (`POST /v1/workspaces/{ws}/webhooks`).

> ⚠️ **Importante:** o webhook URL público do Worker NÃO é segredo; o secret (`DISCORD_WEBHOOK_URL`) sim. A regra do projeto: webhook público no runbook, secret nunca no `.md`.

## 📐 PADRÃO DOS CARDS (nome + conteúdo) — obrigatório

Criado 2026-09-15 a partir dos 35 cards existentes. **Todo card novo segue isto.**
Contador canônico: **`TL<n>`** (TL1–TL2 apoio · TL3–TL23 cortes por cidade · TL24–TL33 feed por pauta).

### Nome (título)

```
<LABEL> · <TEMA EM CAIXA ALTA> (TL<n>[, ~<duração final>s])
```

- `<LABEL>` = a **mesma** label do board: `DARK` · `APOIO` · `FEED` · `VLOG`. Repetir no título **e** na label.
- Separador exato: ` · ` (espaço-ponto-espaço-meio).
- `~<duração final>s` = **target editorial**, NÃO a duração dos brutos. Se não houver target definido,
  **omita** (não invente) e registre `Duração alvo: A DEFINIR` na descrição.
- Ex.: `DARK · CASCAVEL (TL5, ~23s)` · `APOIO · APOIO_BRUNO D (TL1, ~32s)` · `DARK · AMANHÃ É O DIA (TL24)`

### Descrição (conteúdo) — linhas fixas, nesta ordem

```
Brutos: <N> clipe(s) · <resolução> · <Xs> de material[ · <N> áudio(s) de referência]
Pasta: <caminho relativo em 02_FOOTAGE/...>
Já renderizado: <arquivo> (<Xs>)      ← só quando existir
Duração alvo: A DEFINIR | ~<Xs>
```

### Checklist — sempre com o mesmo nome e itens

- Nome: **`Entregas`**
- Itens (ordem fixa): `definir duração final` · `relink` · `legendar` · `conferir legendas`
- Itens específicos do card (ex.: `completar trilha (A2/A3 vazias)`) vêm **depois** dos fixos.

### Labels do board

| Label | Cor | Aplicada a |
|---|---|---|
| `DARK` | `#111827` | legado/removida (substituída) |
| `APOIO` | `#9333ea` | TL1–TL2 (apoio cultura) |
| `FEED` | `#16a34a` | feeds (nome tem "FEED") |
| `feed-cidades` | `#2E86AB` | FEED_COLOMBO (cidades) — criada 2026-09-15 |
| `Dark-Brasilia` | `#780585` | campanha Brasília TL24–TL33 |
| `dark-cidades` | `#2E86AB` | feeds dark de cidades |
| `dark-uni` | `#A23B72` | feeds dark de faculdades/universidades |
| `DOBRADA` | `#FD0E59` | nome tem "PARCEIRO" (dobradinhas) — criada 2026-09-15 |
| `PROPOSTAS` | `#01B7A6` | nome tem "PROPOSTA"/"CURSINHO"/"EDUCAÇÃO DARK"/"ORÇAMENTO" — criada 2026-09-15 |
| `VLOG` | `#dc2626` | vlogs |

> **Labels = pastas** (espelho OFFLINE/ONLINE): `Dark Post`→dark labels, `Dobradinhas`→DOBRADA, `Feed`→FEED, `Feed Brasilia`→Dark-Brasilia, `Propostas`→PROPOSTAS, `Vlog`→VLOG. Regra por **nome do arquivo**: tem "PARCEIRO"→DOBRADA, tem "PROPOSTA"→PROPOSTAS, tem "FEED"→FEED, senão classifica por tema.
> Tabela completa: `references/kan-label-management.md` e `07_ONLINE-inventory.md`.

> ⚠️ **Nota técnica (2026-09-15):** a API REST do Kan não expõe endpoint de criação de labels funcional (POST `/labels` → 400 quando faltam `name`,`colourCode`,`boardPublicId`; `/boards/:id/labels` → 404). Criar labels via `POST /labels`. **Atribuição via `PUT /cards/{id}/labels/{labelId}` FUNCIONA para ADD (HTTP 415 mas persiste — não é erro!). MAS NÃO REMOVE labels** — PUT sempre adiciona, mesmo quando label já existente. **Para REMOVER label, usar obrigatoriamente o MCP `mcp__kan__toggle_card_label(cardPublicId, labelPublicId)` que retorna `newLabel: false`.** Cards podem ter 2+ labels ao mesmo tempo via REST; separação visual garantida pelo prefixo no título. Labels descobertas via `GET /boards/:id` → `labels[].publicId`.
>
> **📄 Detalhamento completo:** `references/kan-label-management.md`.

### ⚠️ Como descobrir os dados (não chutar)

```bash
# duração/resolução dos brutos:
ffprobe -v error -show_entries stream=width,height:format=duration -of json "<arquivo>"
```
⚠️ O `~Xs` dos cards antigos **não bate** com a soma dos brutos (testado em 12 cidades) — é decisão
editorial. Nunca derive um do outro.

## Regra de ouro

- Mexeu no Kan → espelhou no `.md` no mesmo turno ([[Cliente A Kanban]]); `.md` manda em divergência.

