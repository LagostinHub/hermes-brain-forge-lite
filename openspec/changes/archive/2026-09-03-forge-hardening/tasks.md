# Tasks: forge-hardening

## 1. Per-rule path scoping (ex-2.7) — ✅ DONE

- [x] 1.1 `audit/rules.yaml`: `scope:` por regra (+ `personal_terms_scope`); ausente = ativa em todo lugar — data-only
- [x] 1.2 Runners ps1/sh honram scope (matcher idêntico; skipped não conta como fired; `SCOPE:` no report)
- [x] 1.3 Allowlists wholesale removidas; secret rules ATIVOS em `skills/**` (485); 19 patterns / 17 shape families de exemptions fixture-provados (audit do reviewer: corpus de secrets reais 14/14 dispara, 8/8 rules)
- [x] 1.4 Provas: fixtures 26/26 fire + clean pass; gate repo-root 0 hits; skills `-NoAllowlist` **393→0 hits**; smoke 485/0
- [x] 1.5 Hook bloqueia staged leak (exit 1) re-provado

## 2. Auto-sanitize vendor (ex-5.5) — ✅ DONE

- [x] 2.1 `vendor-skills.ps1`: sanitize + BOM strip + MANIFEST refresh OBRIGATÓRIOS pós-cópia (mesma execução, idempotente; `-ManifestOnly` também sanitiza)
- [x] 2.2 Prova: full re-run → 85 files sanitizados + 20 BOMs in-run, run 2 = 0 changed (converged); gate 0 hits; smoke 0 failures; zero passos manuais. Fix wave: +4 pares (`[DONO]_VAULT`/`[DONO] Vault`/`[DONO]`/`Onedrive`) → `rg -i [dono]|onedrive` skills/ = **0**; `.curator_backups` excluído da cópia (backups de máquina fora da distribuição)
- [x] 2.3 `docs/forge-log.md` entrada + correções de honestidade do review (claims precisos, counts corretos)
