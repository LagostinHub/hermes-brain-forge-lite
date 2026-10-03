# Tasks: brain-forge-installer

## 1. Governance

- [x] 1.1 Scaffold repo (README, config.yaml, .gitignore, this change) — **done 2026-09-02 with spec**
- [x] 1.2 Validate with OpenSpec CLI (`openspec validate`) — **green**
- [x] 1.3 Bootstrap doc — README Fresh-machine path + installer verifies authed clone (machine mode)

## 2. Curation pipeline — ✅ DONE (subagent 2026-09-02)

- [x] 2.1 `audit/zone-map.yaml` — incl. real-zone corrections (00-captura, templates=50-sistema/53-templates, sem Dashboard.md) registradas como spec deltas
- [x] 2.2 `audit/placeholder-packs/` — shells + placeholder notes + Context Packs (zonas excluídas) + 5 template boards + projects.base placeholder
- [x] 2.3 `audit/rules.yaml` (11 rules, data-only) + `personal-terms.yaml` + thin runners `scan-personal-data.ps1`/`.sh` (mesmo formato de report; `--paths-file` p/ staged)
- [x] 2.4 Fixtures: **46 hits, 26/26 rules fired, exit 1**; clean-sample exit 0; gate do repo inteiro: 0 hits (172 files)
- [x] 2.5 `install-git-hook.ps1` → `.git/hooks/pre-commit` instalado e provado (bloqueia staged leak com exit 1)
- [x] 2.6 `scripts/forge-refresh.ps1` + `audit/snapshot-manifest.tsv`; determinismo provado (runs consecutivas byte-identical); tagging guarded (`-Tag` + git tree clean)
- [ ] 2.7 FOLLOW-UP (revisão Task B): per-rule path scoping p/ secret rules dentro de trees allowlistadas (`skills/hermes-tree`, `skills/user-level`) — mecanismo atual inertiza TODAS as rules nas paths allowlistadas; proposta: scoping por regra OU exemptions de placeholder validadas contra `audit/fixtures/`

## 3. Vault skeleton — ✅ DONE (SDD: implementer + review + fix wave 2026-09-02)

- [x] 3.1 Build `vault-template/` from live vault via zone map — `scripts/build-skeleton.ps1` (dados-driven); **84 files** (gate-driven curation: 1557 hits baseline → 0; Skills/ catalog, Configs/, client IP, dated logs excluídos c/ `gate:` no zone-map); determinismo 2× provado
- [x] 3.2 Ship `.obsidian` config: whitelist app/appearance/community/core/types (bookmarks.json dropped c/ justificativa — client tags, regenerável); zero workspace/graph/plugins/cache
- [x] 3.3 Conventions/templates/MOCs verificados: 6 notas de convenções (com slugs → cliente-a/b), 53-templates, cadeia Mapa→MOCs
- [x] 3.4 `check-links.ps1` SHA-idêntico ao original → **0 dead / 0 orphans** (169 links); review catch: 52.09 (dados pessoais Discord) excluída + inbound links tratados

## 4. Agent configs — ✅ DONE (subagent 2026-09-02)

- [x] 4.1 `configs/opencode.json.template` + `configs/hermes/config.yaml.template` (12 placeholders / 22 ocorrências; key omni → `${OMNIROUTE_API_KEY}`; paths → placeholders; validado JSON/YAML)
- [x] 4.2 `configs/hermes/plugins/superpowers/` vendored (195 files, v6.3.0, 14 skills, sem .git) — installer habilita em machine mode
- [x] 4.3 `hermes/env.template` (37 nomes, valores CHANGEME) + injeção via prompt/env implementada no installer; self-audit: **0 real key shapes** (199 files)
- [x] 4.4 BÔNUS live-fix: `OBSIDIAN_VAULT.md` + `AGENTS.md` (OneDrive→`[CAMINHO]`, count 173) + `OBSIDIAN_VAULT_PATH` (User) corrigido

## 5. Skills distribution — ✅ DONE (SDD: implementer + review + fix wave 2026-09-02)

- [x] 5.1 Aplicar critérios 2026-08-07 na árvore Hermes viva — **DONE (subagent 2026-09-02)**: backup `[CAMINHO]` (1928 files verificados); 157→121 dirs, 296→257 SKILL.md; 4 obsoletos fora; 29 dups resolvidos (container ganhou, 2 merges); twins verificados reais (só `comfyui-video\wan-video-workflows` era twin); `hermes-agent.bak` fora; superpowers: 0 dupes user-level
- [x] 5.2 Vendor 4 trees → `skills/` (481 SKILL.md: 257/174/42/8; robocopy /E aditivo + sweep de empty dirs pós-cópia; /R:2 /W:2)
- [x] 5.3 `MANIFEST.md` + `skills/manifest.json` (481 entradas; origins honestas — opencode-global ← skills-lock.json; 13 LICENSE* preservadas)
- [x] 5.4 Smoke: 481 parseáveis, **0 failures** (4 frontmatters upstream corrigidos na árvore viva: marca×2, vercel-composition-patterns, obsidian-vault); block scalars aceitos

## 6. Installer — Windows — ✅ implementado (subagent 2026-09-02)

- [x] 6.1 `install/layout.yaml` (data) + `installers/install-windows.ps1` (PS 5.1, 0 non-ASCII, YAML parser embutido, robocopy convergente, winget/npm guards, mklink /J, secrets prompt, env-changes.txt)
- [x] 6.2 Idempotência provada: sandbox run 2× → `CONVERGED: no changes were necessary`; overwrite exige -Force; paths derivados do env
- [x] 6.3 Health suite — **PASS e2e (Onda 3)**: check-links 0/0 no vault instalado, smoke 481, agent smoke 4× PASS (bug array-vs-map corrigido nos 2 runners)

## 7. Installer — macOS — ✅ implementado (subagent 2026-09-02)

- [x] 7.1 `installers/install-macos.sh` (bash 3.2, `bash -n` = 0) consumindo o mesmo layout.yaml; sandbox via git-bash: run 2× → CONVERGED
- [x] 7.2 Hermes-on-macOS: registrado como passo manual `APP_HERMES` no env-changes (graceful)
- [x] 7.3 Health suite — **PASS e2e (Onda 3, git-bash)**: run 1 exit 0 + run 2 CONVERGED
- [x] 7.4 BÔNUS (Onda 3): 20 SKILL.md user-level com BOM → stripped no repo (bash smoke não tolera BOM)

## 8. Verification — ✅ ALL PASS (Onda 3, verificador e2e)

- [x] 8.1 Sandbox e2e pós-vendor: layout completo em disco (84 vault files, 257/174/42/8, superpowers 195, `__INJECT_*__` renders), env-changes 122 ações/zero secrets, health green
- [x] 8.2 Re-run CONVERGED + path scan: username/pessoal = 0; 44 generic placeholders; 28 exceções documentadas (`[CAMINHO]|opencode` — refs canônicas de layout); `[CAMINHO]` → `%OBSIDIAN_VAULT_PATH%` no skeleton
- [x] 8.3 Audit proof pós-vendor: gate 0 hits (×3) + hook bloqueou staged leak (exit 1, 3 hits, HEAD intacto)
- [x] 8.4 Re-forge proof: refresh → 11 changes documentadas (9 redações Onda 3 + 2 drift vivo `.obsidian`), depois 0/0/0 byte-identical, sem tag

## 9. Publish

- [ ] 9.1 `gh repo create [REPO] --private` + first push (owner OK)
- [ ] 9.2 Record change in vault boards (Second Brain Kanban card → Done) + archive this change
- [ ] 5.5 FOLLOW-UP (Onda 3): vendor pipeline deve sanitizar pós-cópia automaticamente (88 files tinham owner paths/BOM; hoje sanitize + `-ManifestOnly` é manual — wire no `vendor-skills.ps1`)
