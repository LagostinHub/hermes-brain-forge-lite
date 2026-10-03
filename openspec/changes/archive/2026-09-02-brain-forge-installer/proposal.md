# Proposal: brain-forge-installer

## Why

The complete agent system — Hermes (manager agent), OpenCode (coder agent), Obsidian + [DONO] vault methodology (Second Brain), ~350 skills across 4 trees, agents/conventions, 18 Obsidian plugins, env wiring — exists only on the owner's machine, scattered across directories, with no packaging and no distribution path. A machine loss or a new machine means days of manual, error-prone re-setup and drift from the canonical config. At the same time, the brain contains personal data (diaries) and client/project data (e.g., client work) that must never leave the machine.

## What Changes

- Create private repo `[REPO]` holding the **curated system**: a vault skeleton (structure, conventions, templates, all knowledge — with client/project/personal zones replaced by placeholders), all skill trees (packaged post-cleanup), installer scripts, and a sanitization audit.
- Add a **curation pipeline** that transforms the live vault into the shipped skeleton via an explicit include/exclude zone map + placeholder packs, enforced by an audit scan that blocks publish on personal-data detection.
- Add **cross-platform installers** (Windows PowerShell + macOS bash) that provision: Obsidian + curated plugins, OpenCode, Hermes (where supported), all skill trees, user-level junction/symlink, env vars (`OBSIDIAN_VAULT_PATH`), and run post-install health checks (0 broken links, skills parse, OpenSpec CLI valid).
- Prerequisite folded in: apply the 2026-08-07 skills-cleanup criteria (remove obsolete platforms, resolve 35 duplicates, drop empty containers) to the Hermes tree **before** packaging, so the repo ships the clean tree.
- Ship **agent configuration as templates** (OpenCode instructions, Hermes gateway/provider routing, plugin set incl. superpowers) with secrets injected at install time — never vendored.
- Define **snapshot + re-forge semantics**: the repo holds tagged snapshots; a `forge refresh` command regenerates skeleton and skills from the live vault through the same audited pipeline.

## Capabilities

### New capabilities
- `curation-pipeline`: zone map + placeholder packs + sanitization audit gating every publish + reproducible regeneration.
- `vault-skeleton`: the curated vault template agents and humans install from.
- `skills-distribution`: all skill trees vendored with provenance (MANIFEST).
- `agent-configs`: agent configuration templates + secrets-at-install wiring + plugin parity.
- `cross-platform-installer`: idempotent, sandbox-testable install for Windows/macOS with derived paths and agent-level smoke.

### Modified capabilities
- None outside this repo.

## Impact

- The system survives machine loss; a new machine is one command away from a working agent setup.
- Agents (Hermes/OpenCode) get identical menus, conventions, and vault structure on any machine.
- Personal/client data stays local; the repo is auditable-proof of that.

## Non-goals

- Real client/project/personal content in the repo (never).
- Bidirectional sync repo↔live vault (repo is the source of the skeleton; daily work stays local).
- CI/CD, public release, marketplace publishing (phase 2+).
- Project repos under `[CAMINHO]` (camilla-2026, hermes, etc.) — they keep their own git history; the distribution reproduces the repo-scoped skill overlay *pattern* for new projects, not the repos themselves.
- Migrating the vault to PARA or any new methodology (wiki-style Johnny.Decimal preserved).
