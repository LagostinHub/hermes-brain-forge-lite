---
date: 2026-09-19
type: session
tags: [pillar/system, kind/session, area/method, project/second-brain, audit]
ai-first: true
---

# Session — 2026-09-19 — Migração [FERRAMENTA] → obsidian-kb

> Sessão de manutenção do brain: update do Hermes, remoção completa do [FERRAMENTA] e substituição por obsidian-kb (OKB) como camada de recall semântico. [[52.25-obsidian-kb-operacao]]

## O que motivou

- Dono pediu update do Hermes — travado por processos que seguravam `.pyd` (hermes.exe + [ferramenta]-server.exe).
- [FERRAMENTA] cronicamente quebrado: dependência `mcp<2` incompatível com o Hermes atualizado, servidor sobrecarregado (timeouts de 300s já registrados no handoff de 2026-09-12), watchdog revivevia mas o serviço não respondia.
- Decisão do dono: remover o [FERRAMENTA] e usar o **OKB** (Vault Knowledge Base) — indexação local do vault, sem servidor pesado, sem VLM.

## O que foi feito

### 1. Hermes update
- 0.21.0 → **0.21.3** (código) + finalização de dependências no reboot (`.pyd` travados pelos processos do próprio app).
- Conflito `mcp 2.0.0` vs `[ferramenta] (mcp<2)` resolvido com downgrade p/ `mcp 1.30.0`.

### 2. [FERRAMENTA] — remoção completa
- Pacote pip (`[ferramenta]`, `[ferramenta]-sdk`) desinstalados do venv do Hermes.
- `~/.[ferramenta]/` (workspace/data) deletado — **sem dado real perdido**: era índice espelho do vault; memórias episódicas (`__remember`) quase nada gravado (servidor vivia travado).
- Entrada MCP removida do `config.yaml` do Hermes.
- `[FERRAMENTA]_Launcher.vbs` removido da pasta Startup (reviveria servidor morto a cada boot).
- Scheduled task `[FERRAMENTA]Watchdog` órfã ( registra ainda? verificar `schtasks /query`).

### 3. obsidian-kb (OKB) — instalação e configuração
- Binário v0.6.1 (Rust) em `venv/Scripts/obsidian-kb.exe` (mesmo venv do Hermes).
- Config `[CAMINHO]` + índice `.obsidian-kb/`.
- **Indexação: 906 docs, 9325 chunks, 2937 tags** — embeddings fastembed `MultilingualE5Small` locais (nada sai da máquina).
- Serve `:8766` (health `/health`, MCP `/mcp`).
- MCP registrado no Hermes (`config.yaml`) e no OpenCode (`opencode.json`) — **mesmo serve, mesmo índice**.
- Plugin Obsidian "Vault Knowledge Base" (id `okb`) instalado manualmente (main.js/manifest.json/styles.css v0.4.2), habilitado no community-plugins.json, porta 8766, autoStart off (conecta no serve compartilhado; evita lock do SQLite).
- Persistência: `okb-start.cmd` na Startup folder (boot) + `okb-watchdog.vbs` + `register-tasks.ps1` (scheduled task precisa admin — opcional).

### 4. Docs do brain
- `52.22-brain-unificado.md` → banner ATUALIZADO (arquitetura histórica).
- `52.23-[ferramenta]-instalacao.md` → DEPRECATED.
- `52.24-[ferramenta]-operacao.md` → DEPRECATED.
- **`52.25-obsidian-kb-operacao.md` criada** — guia completo (uso, subida, reindex, pitfalls, diferenças vs [FERRAMENTA]).
- Changelog do brain (`Metodo de Trabalho.md` §0): entrada 2026-09-19.
- `[CAMINHO]`: 3 referências editadas (linhas 14, 23, 49) — [FERRAMENTA] → obsidian-kb. *(Edição aprovada pelo dono via approval do app.)*

### 5. Verificação (evidência)
- Health: `{"ok":true,"version":"0.6.1"}` ✅
- Busca híbrida real: "metodo de trabalho" → Método de Trabalho.md (rank 1); "cliente filmes monitor approval" → Context Pack + spec 21.07 + handoff do dia ✅
- MCP handshake JSON-RPC OK ✅
- MCP `mcp__obsidian_kb__search` chamado de dentro de sessão Hermes com sucesso ✅
- Zero processos/pacotes/configs de [FERRAMENTA] ✅

## Pendências

- [ ] Scheduled task do watchdog (opcional): rodar `register-tasks.ps1` como admin se quiser auto-revive a cada 5 min. A Startup folder já cobre o boot.
- [ ] 437 unresolved links no índice — wikilinks quebrados pré-existentes (rotina de Weekly Review, não da migração).
- [ ] Reindex após ingerir lotes grandes de notas: `obsidian-kb index --vault "C:/AI/[DONO]_VAULT" --config "C:/AI/[DONO]_VAULT/.obsidian-kb.toml"` (rotina sugerida: Weekly Review).

## Lessons

- **Dois serves não abrem o mesmo índice** (SQLite lock) — plugin Obsidian e serve dos agentes devem compartilhar UMA porta (8766), nunca instâncias separadas.
- **Serve lançado como filho de sessão de agente morre com a sessão** — sempre launcher destacado (`.cmd` na Startup) ou `start-okb.cmd`.
- **MCP não re-registra em sessão viva** — se o serve cair no meio da sessão, a tool só volta na próxima; protocolo HTTP direto continua funcionando.
- **[FERRAMENTA] morreu de incompatibilidade de dependências** (mcp 2.x) — manter camada de recall **local, leve e de binário único** (OKB) elimina essa classe de problema.
