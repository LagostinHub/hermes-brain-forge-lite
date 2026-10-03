# cross-platform-installer Specification

## Purpose
TBD - created by archiving change brain-forge-installer. Update Purpose after archive.

## Requirements

### Requirement: One command, full system
The installer MUST provision, from a single command per platform (Windows PowerShell / macOS bash): Obsidian (+ curated plugins via official registry ids), OpenCode, Hermes where supported (graceful skip otherwise), the four skill trees, the vault skeleton, the user-level `.agents` junction/symlink, and the `OBSIDIAN_VAULT_PATH` environment wiring.

#### Scenario: Fresh machine provisioning
- WHEN the installer runs on a machine without the system
- THEN the layout exists at target, apps/plugins are installed or reported, env wiring is present, and the post-install health checks pass

### Requirement: Sandbox seam
The installer MUST support a sandbox mode (`-Target <dir>`) that provisions the entire file layout inside the target without touching machine-wide state (apps, real env vars), recording intended env changes in a dotfile for verification.

#### Scenario: Sandbox verification
- WHEN the installer runs in sandbox mode
- THEN the target contains the full expected layout, the env dotfile records all intended machine changes, and the live machine state is unchanged

### Requirement: Idempotent, convergent
Re-running the installer MUST converge to the same state without duplicates or destructive overwrites; overwriting an existing skill/vault dir MUST require an explicit force flag.

#### Scenario: Re-run converges
- WHEN the installer runs twice against the same target
- THEN the second run makes no changes (or only explicit force-gated ones)

### Requirement: Derived paths only
Shipped files and installer logic MUST derive all machine paths from the runtime environment (LOCALAPPDATA/HOME) — zero owner-specific paths (username, drive letters, personal dirs) hardcoded anywhere in the repo.

#### Scenario: Path scan clean
- WHEN a path scan runs over the shipped tree
- THEN zero owner-specific path strings are found, and the sandbox run provisions correctly under a neutral target

### Requirement: Bootstrap verified
The installer MUST verify it runs from an authed GitHub clone (private repo) and, when auth is missing, print the documented bootstrap path (`gh auth login` → clone → rerun) and exit cleanly.

#### Scenario: Unauthed run
- WHEN the installer runs without GitHub auth
- THEN it exits non-destructively with the bootstrap instructions

### Requirement: Post-install health
The installer MUST end with health checks: vault link health (0 broken / 0 orphans), skills smoke, OpenSpec CLI `list` valid in installed repos, and **agent-level smoke** — the installed skill tree matches the MANIFEST and the agent's skill loader sees the trees.

#### Scenario: Health gate
- WHEN any health check fails
- THEN the installer exits non-zero and names the failed check

#### Scenario: Agent sees the skills
- WHEN a machine-mode install completes on a supported agent
- THEN the agent's skill listing count matches the MANIFEST tree count
