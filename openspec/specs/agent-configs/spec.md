# agent-configs Specification

## Purpose
TBD - created by archiving change brain-forge-installer. Update Purpose after archive.

## Requirements

### Requirement: Configs ship as templates
Agent configuration — OpenCode `opencode.json` (instructions, vault path) and Hermes config (gateway, provider routing, plugin list incl. superpowers) — MUST ship in `configs/` as templates with every secret and machine path as a placeholder.

#### Scenario: No secrets vendored
- WHEN the sanitization scan runs over `configs/`
- THEN zero secret/key shapes are found (all are placeholders)

### Requirement: Secrets injected at install
The installer MUST inject secrets (provider API keys) at machine-mode install via prompt or environment; sandbox mode MUST record "would prompt" for each secret without asking or storing values.

#### Scenario: Fresh install prompts once
- WHEN a machine-mode install runs without keys present
- THEN the installer asks once per missing key, writes the resolved config, and never echoes the values

### Requirement: Canonical locations
Each config template MUST install to its canonical live location, mirroring the source machine layout (OpenCode config → OpenCode home; Hermes config/.env → the Hermes state dir; `.obsidian/*` → inside the installed vault), with the mapping declared in `install/layout.yaml`.

#### Scenario: Configs land where the agents read them
- WHEN a machine-mode install completes
- THEN each agent loads its config from its canonical location without manual moves, matching the source-machine layout

### Requirement: Plugin parity
The Hermes plugin set (including superpowers) MUST be provisioned by the installer where the agent platform supports it, and reported as "skipped" otherwise.

#### Scenario: Plugin provisioning
- WHEN a supported machine-mode install runs
- THEN the superpowers plugin is vendored/enabled and visible to the agent after restart
