# Design: brain-forge-installer

## Context

Source of truth is the live machine: vault at `[DONO]_VAULT` (git), Hermes tree at `%LOCALAPPDATA%\hermes\skills` (157 dirs), user-level junction `~/.agents` → `[CAMINHO]` (173 skills), Hermes globals at `[CAMINHO]` (8), OpenCode globals at `[CAMINHO]` (8). OpenSpec CLI v1.10.0 global. Vault lessons learned are binding (see below).

## Decisions

1. **Zone map is data, not prose.** The curation pipeline reads an explicit include/exclude table (see curation-pipeline spec). Adding a new vault zone requires editing the map, not the scripts.
2. **Placeholders are structural.** Excluded zones ship as empty shells with a `[[Placeholder — <zone>]]` note + one generic Context Pack each, so agents land on structure and understand the shape of local data without seeing any.
3. **Sanitization audit is a gate, not a report.** Regex + heuristic scan (client names, personal paths, diaries patterns, secret shapes) runs over the staged repo before every commit; any hit fails the run. Fixtures with fake-but-realistic data prove detection; fixtures themselves are the only "personal-looking" strings allowed in the repo.
4. **Skills ship post-cleanup.** The 2026-08-07 criteria (drop apple/email/smart-home/macos-computer-use/obsoletes, resolve 35 top-level↔container duplicates, remove empty containers + `hermes-agent.bak`) are applied to the live Hermes tree first; the repo vendors the result. This closes the existing Second Brain Kanban tickets instead of duplicating them.
5. **Provenance manifest.** `MANIFEST.md` lists every vendored skill: tree, source (origin repo/URL), commit/date, local path. Third-party licenses preserved in place.
6. **Installer seam.** The single test seam is the installer itself: it accepts `-Target <dir>` and provisions the full layout inside that dir (env vars recorded in a dotfile for sandbox runs instead of the machine env). Machine-wide steps (apps, real env vars) are separate flagged steps, skippable in sandbox mode.
7. **Idempotency.** Every step checks-for-exists before acting; re-run converges to the same state. Overwrite of existing skill dirs requires `-Force`.
8. **Platform gotchas (binding, from vault Lessons Learned):** Windows scripts PowerShell 5.1 compatible and 100% ASCII; vault markdown written UTF-8 without BOM; Obsidian rewrites `app.json`/`graph.json` on reload (document, don't fight); Obsidian Git plugin handles the installed vault's git.
9. **App installation.** Windows: winget (Obsidian, Git) + npm (OpenCode); Hermes installed via its own channel where supported. macOS: brew casks/formulae equivalents. Each app step degrades gracefully with a clear report when unsupported/absent.
10. **Plugins via anti-recurrence rule.** The 18 curated plugins are installed by resolving official ids from the Obsidian community-plugins registry (never guessing GitHub paths), same rule used in the original rollout.
11. **Agent configs are templates.** OpenCode `opencode.json` and Hermes config (gateway, provider routing, plugin list incl. superpowers) ship in `configs/` with secrets and machine paths as placeholders; the installer injects secrets at machine-mode install (prompt or env). The sanitization scan also fails on key shapes, so no secret can be vendored even by accident.
12. **Paths are derived, never hardcoded.** Owner-specific layout (username, drive, LOCALAPPDATA, vault location) must not appear in shipped files; installers derive targets from the runtime environment and a path scan over the shipped tree must find zero owner-specific strings. The sandbox run under a neutral target proves it.
13. **Rules are data, runners are thin.** Sanitization rules (`audit/rules.yaml`) and the install layout (`install/layout.yaml`) are single-source data consumed by both platform runners; per-language code contains only I/O and app installation. Zero business logic duplicated across ps1/sh.
14. **Snapshots + re-forge.** The repo holds tagged snapshots (`vYYYY.MM`); installs consume a tag, not HEAD. `forge refresh` re-runs curation from the live vault, reports the diff, and the audit gates the result. Generation must be deterministic: same live state → byte-identical skeleton.
15. **Bootstrap is part of the product.** A fresh machine needs GitHub auth before anything else: README documents `gh auth login` → clone → run installer; the installer verifies it runs from an authed clone and prints the bootstrap path otherwise.
16. **Single-source tooling.** `check-links.ps1` ships as the original from the vault's scripts directory, never a fork. Verification phases (8.x) reuse installer health checks (6.3/7.3) verbatim — no second definition.
17. **One repo folder, canonical install locations.** The repo is a single folder, but the installer spreads each artifact to its canonical live location, mirroring the source machine: OpenCode config → OpenCode home dir; Hermes `config.yaml`/`.env` → `%LOCALAPPDATA%\hermes\`; `.obsidian/*` → inside the installed vault; the four skill trees → their respective roots with the user-level junction/symlink recreated. The mapping is data in `install/layout.yaml` (see decision 13).
18. **Config reality check (2026-09-02 census).** The Obsidian community plugin list is 18 entries today (rollout curated 13; later additions: smart-context, smart-lookup, smart-chatgpt, auto-tag-graph-colors, homepage). The shipped plugin set is the current `community-plugins.json`, not the rollout's 13. `Hermes config.yaml` carried one real inline API key (`providers.omniroute.api_key`) — proof the sanitization rules must include inline-key shapes in YAML/JSON. OpenCode vault pointers reference a stale OneDrive path; templates ship with placeholders so the forge never inherits stale paths.

## Risks / trade-offs

- Vendoring skills forks them from upstream (manifest mitigates; updates are manual but traceable).
- The audit can't guarantee semantic leaks (a story mentioning a client without a name pattern) — mitigated by zone exclusion being the primary defense; audit is the second layer, not the first.
- macOS Hermes support unknown → installer reports "skipped" rather than failing.

## Migration plan

No migration: additive repo. Live machine remains source of truth; repo becomes distribution.
