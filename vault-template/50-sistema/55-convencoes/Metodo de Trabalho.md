---
type: convention
tags: [ pillar/system, kind/resource, area/method, project/second-brain, brain-os ]
ai-first: true
---

# 🧭 Método de Trabalho (Brain Operating Model)

> Única fonte de verdade: o vault Obsidian (`[DONO]_VAULT`). Git = histórico. Este doc é o modelo operacional que Hermes (orquestrador), OpenCode (executor) e você usam para trabalhar de forma autônoma, registrando tudo e mantendo o brain em ordem.

## 0. ⚡ Changelog do brain (leia ANTES de agir)

> Mudanças que alteram o funcionamento do sistema. **Se você é agente e não leu isto, pode estar operando com informação velha.**

### 2026-09-16
- **Kan: player de vídeo inline nos cards ([Cliente] 2026) — LIVE em prod.** Qualquer URL `drive.google.com/file/d/{id}` na description do card vira player embutido no modal (`DriveVideoNode` TipTap, app `[CAMINHO]`, deploy `dpl_3ewyoGY4`). 47/69 cards já linkados.
- **SOP novo:** [[SOP Player Drive no Card]] — filme novo em `07_ONLINE/` → `python C:/AI/tools/kan-sync/link_filmes.py --apply` → player no card (scrape embeddedfolderview sem OAuth + match normalizado + PUT idempotente). Validado 2026-09-16 (20 fileIds resolvidos, 0 drift de lista).
- **Pitfall registrado:** update parcial `PUT /cards/{id}` pode mover o card (drift) — sempre re-fetch e assert de `listPublicId`. E **não verificar feature de UI via `/login`** (não carrega os chunks do editor — falso negativo).

### 2026-09-19
- **Hermes atualizado:** 0.21.0 → **0.21.3**.
- **[FERRAMENTA] REMOVIDO** → a memória semântica agora é **obsidian-kb (OKB)**. MCP `obsidian-kb` (remote `http://127.0.0.1:8766/mcp`), binário `%USERPROFILE%\AppData\Local\hermes\hermes-agent\venv\Scripts\obsidian-kb.exe`, config `%OBSIDIAN_VAULT_PATH%\.obsidian-kb.toml`, índice `.obsidian-kb/` (884 notas, 8797 chunks, embeddings locais fastembed). Tool principal: `search` (hybrid BM25+vetor+graph). Plugin Obsidian "Vault Knowledge Base" instalado e habilitado. Reindexar após mudanças: `obsidian-kb index --vault "C:/AI/[DONO]_VAULT" --config "C:/AI/[DONO]_VAULT/.obsidian-kb.toml"`. Docs antigas do [FERRAMENTA] (52.23/52.24) ficam como histórico — **não usar**.
- **OpenCode:** `opencode.json` MCP agora aponta pra `obsidian-kb :8766` (era [ferramenta] :1933).

### 2026-09-13
- **Novo cliente:** `15-cliente-c` (Cliente C Company) — filme manifesto institucional "Como nasce uma ideia" (60–70s). Paleta `#010914` + `#FF8C28`. Tag `project/cliente-c` adicionada à Tag Taxonomy.

### 2026-09-12
- **`gbrain` REMOVIDO** → a memória semântica agora é **[FERRAMENTA]**. MCP `[ferramenta]` (remote `http://127.0.0.1:1933/mcp`). Use `find` (rápido) / `search` (profundo) **antes** de abrir arquivos; peça tiers L0 → L1 → L2. Doc: [[52.24-[ferramenta]-operacao]]. Se o servidor cair: `schtasks /run /tn "[FERRAMENTA]Watchdog"`.
- **Skills compartilhados: ~410** (era 176). Contagem: `find "C:/Users/<user>/.agents/skills" -name SKILL.md | wc -l`.
- **Projetos: 13** — 10 ativos (`cliente-a`, **`produto-x`**, **`cliente-c`**, `omh`, `second-brain`, `cineweave`, `wod`, `career-ops`, `transversal`, `infraestrutura`) + 3 arquivados (`marca`, `erm`, `cliente-b`, 2026-09-11).
- **Novo projeto `produto-x`** = **PRODUTO X FC Manager** (produto de catálogo/workstation de vídeo), pasta `projetos/24-catalog/`. **Separado de `cliente-a` em nível lógico.** MOC [[24.00-produto-x-moc]] · board [[Produto X Kanban]] · manifest `openspec/PRODUTO X.md`.
- **Regras de estilo ativas:** `i-have-adhd` + `caveman` + `ponytail` — o `[DONO]_RULES.md` estava **órfão** (ninguém carregava); agora está no `instructions` do `opencode.json`. Resumo em [[_CLAUDE]] §Estilo de saída.
- **Monorepo `cliente-a`:** 31 changes separadas em **PRODUTO X (16) × Cliente A (15)**. Fronteira: `openspec/PRODUTO X.md` vs `openspec/CLIENTE A.md`.
- **Vault git:** branch `master` com **~569 mudanças não commitadas** — **não commitar/pushar sem OK do dono**.
- **Handoff aberto:** `docs/2026-09-12-handoff-opencode-brain.md`.

**🚫 NÃO fazer:** reintroduzir gbrain · alterar `queue_workers.add_resource.max_concurrent` · commitar/pushar sem OK do dono.

---

## 1. Princípios

1. **Vault é a fonte de verdade.** Toda decisão, spec, task e aprendizado vive no Obsidian. Código vive em `[CAMINHO]`; o brain descreve e rastreia o código.
2. **Toda nota tem exatamente 1 tag `project/*`.** É o eixo de cor, navegação e Dataview. `pillar/*` é metadado secundário; `status/*` é coluna de kanban.
3. **Todo card de kanban tem wikilink** para o MOC ou Context Pack do projeto (rastreabilidade).
4. **Agentes leem o brain primeiro.** Context Pack tem `ai-read-first: true` — começar por ele, nunca perguntar do zero.
5. **Tudo é registrado.** Decisões, armadilhas, log de sessão e progresso entram no brain. Nada de trabalho "invisível".
6. **Reversibility gate.** Toda mutação em lote (multi-arquivo, script, migração) exige checkpoint git antes (`git status` + commit/stash) e precisa ser reversível (`git checkout -- .` / revert). Sem checkpoint, não executa.
7. **Bi-temporal.** Quando um fato muda (cargo, status, empresa), NUNCA apague o valor antigo. Adicione à porta `timeline:` (`from` / `until` / `learned` / `source`). Os campos de topo refletem o estado ATUAL. Ver [[_CLAUDE]].

## 1.1 Profile routing (labels conceituais)

Os perfis de routing (researcher, orchestrator, builder, reviewer, maintainer, ops-watch, inbox-triage) são **labels de composição de skills**, não agentes separados. Hermes é o único orquestrador; ativa as skills do perfil conforme a fase do loop. Ver [[Kanban Workflow]] §Profile routing.

## 2. Papéis (fronteira rígida)

| Papel | Quem | Faz | **Nunca faz** |
|-------|------|-----|---------------|
| **Você** | humano | Direção, aprova, desbloqueia (coluna `Blocked`), revisa entregas finais. | — |
| **Hermes** | orquestrador / zelador do brain | Portfólio (`Project Board`+`Dashboard`), **spec**, decomposição, escreve o **Handoff**, dispara OpenCode, faz a **Análise** das entregas (`code-review`), mantém MOCs/Context Packs/taxonomia, roda manutenção. | **ESCREVER CÓDIGO** (zero linha). |
| **OpenCode** | executor | Recebe o **Handoff**, **ordena o plano**, **builda** (`implement`+`tdd`), devolve a task ao Hermes. | **DECIDIR ESCOPO/SPEC** (só executa o que foi handoffado). |

> Contrato: Hermes entrega resumo + Handoff e chama o OpenCode. OpenCode pega o Handoff, ordena o plano e só depois builda; devolve a task para **análise do Hermes**. O ciclo repete até a spec fechar.

## 3. Loop autônomo (Handoff → Build → Análise)

> **Decisão:** Hermes tem **auto-dispatch** (pega card `To Do` e dispara OpenCode sem pedir OK). Você intervém apenas em `Blocked`/`Review`. Hermes **nunca escreve código**; OpenCode **nunca redefine escopo**.

```
HERMES: CAPTURE → SPEC → DECOMPOSE → HANDOFF ──dispatch──▶
OPENCODE: recebe HANDOFF → ORDENA PLANO → BUILD → devolve ──▶
HERMES: ANÁLISE → (nova rodada | DONE | BLOCKED)  …repete até spec fechar… → ARCHIVE
```

1. **Capture** — Hermes: ideia/spec/pendência vira card em `Backlog` (ou nota em `system/` de captura).
2. **Spec** — Hermes roda `spec` (vira OpenSpec change). Card tem wikilink p/ MOC/Context Pack.
   - **Onde:** projetos do framework usam `hermes/openspec/changes/<nome>/`; projetos de cliente usam `<repo>/openspec/changes/<id>/` (ex: `[CAMINHO]`).
3. **Decompose** — Hermes roda `to-tickets`; cards em `To Do`.
4. **Handoff (Hermes)** — Hermes escreve o **Handoff** e dispara OpenCode:
   - *Resumo executivo* da intent e do estado atual.
   - *Brief*: o que construir (refs ``<proj> MOC`` + `agent-config/<proj> - Context Pack.md`).
   - *Critérios de aceitação* (como validar).
   - *Limites*: o que NÃO mexer.
5. **Ordena + Build (OpenCode)** — OpenCode recebe o Handoff, roda `writing-plans`/`executing-plans` para **ordenar o plano**, e só então `implement`+`tdd` em `[CAMINHO]`. Escreve nota de progresso linkada. Mantém card em `Doing`. Ao terminar, **devolve a task ao Hermes** (o que fez + como validar) e sobe para `Review`.
6. **Análise (Hermes)** — Hermes roda `code-review`/`plan-eng-review`:
   - ✅ fecha o pedaço → nova rodada (Handoff parcial) OU `Done` se spec completa.
   - ⚠️ ajuste → novo Handoff parcial pro OpenCode.
   - 🚫 trava humana → `Blocked` (você desbloqueia).
7. **Archive** — spec completa → `Done` → `Archive` (Weekly Review) → `Learn` (Hermes atualiza `Lessons Learned` + pendências do Context Pack).

**Bloquear:** OpenCode só vai pra `Blocked` se precisar de humano, anotando o motivo.

## 4. Captura de aprendizado (registrar tudo)

- **`Lessons Learned`** (`50-sistema/52-agent-config/Agent Playbook/Lessons Learned.md`) — armadilhas críticas por projeto. Toda sessão que tropeçar em algo escreve aqui.
- **Context Pack** — seção "Pendências"/"Últimos passos" atualizada ao fim de cada sessão; decisões fixas viram link estável.
- **Log de sessão** — notas temporais em `system/journal/` (agentes) ou `pessoal/daily/` (usuário), linkadas ao card. **NUNCA `hot.md`/`Registro de Sessão.md`** (removidos).
- **Decisões** — porquês das escolhas registrados no Context Pack (seção Decisões) para nunca reexplicar.

## 5. Manutenção (ordem)

Rotina **Weekly Review** (Hermes ou você):

1. **Brain-health**: 0 links quebrados, 0 órfãos, toda nota com 1 `project/*`. (usar `vault_health` / Dataview.)
2. **Reconciliar kanban vs real**: cards `Done` batem com commits? `Blocked` tem motivo?
3. **Arquivar**: `Done` antigo → `Archive`.
4. **Taguear soltos**: notas sem `project/*` recebem a tag correta.
5. **Atualizar Dashboard/MOC**: `Mapa.md` e MOCs refletem o estado atual.

## 6. Convenções de kanban

- Colunas: `Backlog · To Do · Doing · Blocked · Review · Done · Archive`.
- 1 card = 1 task acionável. Task grande → sub-cards.
- Card sempre com wikilink para MOC/Context Pack.
- Plugin `obsidian-kanban`: boards são `.md` (legíveis por agente). Editar o markdown move o card.
- Board mestre `50-sistema/56-boards/Project Board.md` + `50-sistema/56-boards/projects.base` (base unificada).
- **Regra das 3 fontes:** **ao vivo = Kan** (humanos movem aqui) · **arquivo = `.md`** (manda em divergência) · **agentes = MCP + `.md`** (movem via MCP e espelham em até 1 turno — ver [[Mirror Convention]]).

## 7. Como começar uma sessão

1. Abrir `Dashboard.md` (homepage) → ver portfólio e próximas ações.
2. Hermes lê `Project Board` → escolhe projeto/card.
3. Abre ``<proj> MOC`` + Context Pack → briefa OpenCode (auto-dispatch).
4. Loop roda; tudo registrado; Weekly Review fecha a ordem.

## 8. Pipeline de Skills (OpenSpec + MattPocock) por papel

Cada fase aciona skills — os agentes **DEVEM** usá-las. **OpenSpec change = unidade de spec**; **card de kanban = ticket**. Divisão estrita por papel (Hermes planeja+analisa, OpenCode executa).

### Hermes (planejar + analisar — NUNCA código)

> **Profile routing:** Hermes pode ativar perfis conceituais conforme a fase — spec→researcher/strategist, decompose→orchestrator, review→qa/reviewer, maintain→maintainer/ops-watch, triage→inbox-triage. Na prática, Hermes é o único agente orquestrador; os perfis são labels de composição de skills, não agentes separados. Ver [[Kanban Workflow]].

| Fase | Skill primária | Combos | Saída |
|---|---|---|---|
| Capture / Intake | `spec` | `grill-me` (afiar), `research` (incerto) | spec precisa |
| Decompose | `to-tickets` | `writing-plans`, `to-spec` | tickets → cards |
| Handoff | `writing-plans` | `grill-with-docs` (se incerto) | Handoff escrito |
| Análise da entrega | `code-review` | `plan-eng-review` (duplo), `diagnosing-bugs` | veredito |
| Learn / manutenção | `learn` | `brain-ops` / `brain-taxonomist` (filing), `enrich` | brain atualizado |

### OpenCode (executar — NUNCA escopo)

| Fase | Skill primária | Combos | Saída |
|---|---|---|---|
| Recebe Handoff → ordena | `writing-plans` / `executing-plans` | `to-tickets` (se re-decompõe) | plano ordenado |
| Build | `implement` | `tdd`, `subagent-driven-development` (paralelo) | código |
| Fecha | `git-commit` | `github-pr-workflow` (se remoto) | entrega devolvida ao Hermes |

### Combos que fecham o escopo

- **A — Spec→Plan (Hermes)**: `spec` → `grill-me` → `writing-plans` → `plan-eng-review` → **Handoff**. Escopo fechado *antes* de codar.
- **B — Decompose→Parallel (OpenCode)**: `to-tickets` → `subagent-driven-development`. Várias tasks em paralelo até o fim.
- **C — Build→Verify (OpenCode)**: `implement` + `tdd` → devolve → Hermes `code-review`. Código com qualidade e revisão.
- **D — Close→Learn (Hermes)**: `ship`/`git-commit` + `learn` + `brain-ops`. Entrega registrada no brain.

> Regra de ouro: todo card aponta para 1 OpenSpec change; o Hermes roda o combo da fase e só avança o card quando o combo fechou sua parte do escopo. OpenCode não avança o card sem Handoff do Hermes.

### Biblioteca de Skills (self-growing)

O brain espelha **verbatim** todas as skills em `skills/` (~400 no total: ~159 user-level + ~240 hermes-tree), geradas por `scripts/sync-skills.ps1` a partir da fonte única `.agents/skills/`. `.claude/skills` é junction pra ela — Hermes e OpenCode compartilham a MESMA fonte. O número varia conforme skills são adicionadas ou arquivadas.

- **Hermes** captura padrões reutilizáveis em `skills/inbox/` e promove via `skill-creator` → vira skill canonical → o espelho puxa pro vault. Loop de auto-aprendizado.
- **OpenCode** consome `skills/` + `.agents/skills` para executar; não precisa de cópia própria.
- Ver `[[Vault Operating Rules]]` (loop completo).

## 9. Protocolo de otimização de tokens (write-back enxuto)
1. **Memória externa > contexto.** Ler só a nota relevante sob demanda (Context Pack primeiro).
2. **Handoff enxuto.** Brief curto + apontar arquivos/Context Pack; nunca reexplicar do zero.
3. **Write-back.** Após codar, atualize o card kanban + `Lessons Learned` (e o journal do agente em `system/journal/`).
4. **Reuso de erros.** Consulte `Lessons Learned` antes de implementar.
5. **Dual-entry (obsidian-doc-sync, Hermes principal):** toda ação relevante é registrada no repo `docs/` E espelhada no vault, com tags `#sdd #handoff #audit` para rastreabilidade.

---

Ver tambem: [[Mapa]] | [[Project Board|Project Board]] | [[Agent Playbook]] | [[Context Pack Convention]] | [[Kanban Workflow]]

## 10. Definition of Done (gate)
- Done exige: testes/build VERDES + evidência anexada (comando+saída) + critérios de aceitação do Handoff todos marcados + `code-review` pass + dual-entry feita.
- Review→Done só após DoD completo; sem exceção (ver [[Kanban Workflow]]).
- Trabalho não verificado fica em Doing/Review com motivo anotado no card.
