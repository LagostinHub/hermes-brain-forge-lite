# hermes-brain-forge-lite

**67 skills + 12 MOCs, autocontidas. Sem URL, sem repo privado, sem `gh auth`.**

Um prompt colado no **OpenCode** instala o Hermes Desktop, configura o vault
Obsidian e distribui as skills ja sanitizadas. Este repo e a distribuicao minima;
a versao completa do sistema e separada e nao esta aqui.

## Instalar

1. Clone ou baixe este repo.
2. No **OpenCode**, cole o conteudo de [`BNF-INSTALL.md`](BNF-INSTALL.md).
3. O proprio prompt faz o resto: detecta o ambiente, instala o Hermes, escreve
   `config.yaml` e `env` minimos, e instala as 67 skills.

O prompt assume que voce esta no OpenCode. Ele nao instala wrappers de coding
agent (`codex`, `claude-code`, `opencode`) — delegar para outro agente e
redundante quando voce ja esta aqui.

## O que voce recebe

- **Hermes Desktop** instalado e configurado com defaults minimos.
- **Vault Obsidian** com regras padrao derivadas de `/ponytail`, `/i-have-adhd`
  e `/caveman`.
- **67 skills** em 8 tiers, cobrindo fluxo de spec, Matt Pocock, infra de agente,
  qualidade, git e duas areas verticais.
- **12 MOCs** (decision cards) para navegar por area em vez de ler 67 arquivos.

## Os 8 tiers

| Tier | Skills | Peso | O que é |
|---|---|---|---|
| T0 regras-gerais | 9 | 37 KB | `/ponytail` `/i-have-adhd` `/caveman` + derivados. **Sempre ativas.** |
| T1 spec-fluxo | 10 | 45 KB | openspec-propose, grill-with-docs, to-spec, to-tickets, implement, tdd, code-review |
| T2 navegacao-fase | 8 | 50,6 KB | ask-matt, handoff, wait-what, prototype, research, wayfinder |
| T3 infra-agente | 5 | 139,9 KB | hermes-agent, hermes-skill-install, hermes-provider-config, hermes-mcp-troubleshoot, wizard |
| T4 qualidade-debug | 8 | 99,1 KB | systematic-debugging, diagnosing-bugs, domain-modeling, careful, guard |
| T5 git-github | 7 | 88,6 KB | github-*, git-commit, worktrees |
| T6a vertical-dev | 6 | 426,7 KB | frontend-design, accessibility, vercel-react-* |
| T6b vertical-video | 14 | 2.856,6 KB | cinema-geral-decisions, film-decupage, film-editing + cluster Remotion (12) |
| **TOTAL** | **67** | **3,66 MB** |
| MOCs | 12 | 281,6 KB | knowledge de consulta |
## Sanitizacao

Este payload e publicado. Ele foi limpo de:

- nome de cliente e nome de projeto;
- path de dono e path de maquina;
- inventario de cliente e credencial.

Aprendizado foi **preservado**; so o dado pessoal saiu. Ver
[`PROVENIENCIA.md`](PROVENIENCIA.md) e o registro em
`payload/MANIFEST-skills.json` (sha-256 de cada `SKILL.md`).

O gate de auditoria vive em [`rules/audit-rules.yaml`](rules/audit-rules.yaml) e
[`hooks/bnf-lite-audit.sh`](hooks/bnf-lite-audit.sh). Ele roda em pre-commit:

```bash
bash hooks/bnf-lite-audit.sh
```

**Se voce contribute com skill:** rode o gate antes de commitar. Ele bloqueia
secret e path de dono, e foi testado contra git real.

## Estrutura

```
BNF-INSTALL.md          prompt de instalacao (cole no OpenCode)
payload/skills/         67 skills, sanitizadas
payload/mocs/           12 decision cards
payload/MANIFEST-skills.json
templates/              config.yaml, env e vaultObsidian (valores vazios)
rules/audit-rules.yaml  regras do gate
hooks/                  bnf-lite-audit.sh (pre-commit)
```

## Upgrade

O upgrade para a versao completa e um passo **separado** e nao acontece no install
lite. A versao completa traz o restante das areas, os conectores e a curacao
completa de skills. O lite deja a porta aberta: as skills vivem em
`~/.hermes/skills/` com a mesma estrutura de tiers, entao adicionar e apenas
copiar a pasta da skill.

## Licenca

MIT. Ver [`LICENSE`](LICENSE).
