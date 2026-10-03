# skills-distribution Specification

## Purpose
TBD - created by archiving change brain-forge-installer. Update Purpose after archive.

## Requirements

### Requirement: All four trees vendored post-cleanup
The repo MUST vendor the four skill trees — Hermes tree, user-level, Hermes globals, OpenCode globals — in their post-cleanup state (2026-08-07 criteria applied: obsolete platforms removed, top-level↔container duplicates resolved, empty containers and `.bak` dirs removed).

#### Scenario: Clean tree ships
- WHEN skills are vendored
- THEN none of the criteria-listed obsolete skills, resolved duplicates, or empty containers exist in `skills/`

### Requirement: Provenance manifest
Every vendored skill MUST have a MANIFEST entry recording tree, name, and provenance: origin + sha256 + path (plus files_recursive count); third-party license files MUST be preserved.

#### Scenario: Traceable skill
- WHEN any skill under `skills/` is inspected
- THEN MANIFEST identifies its provenance (origin + sha256 + path)

### Requirement: Shipped skills are loadable
Every vendored SKILL.md MUST have valid frontmatter (name/description) so agents can load it.

#### Scenario: Smoke parse
- WHEN the skills smoke check runs
- THEN every SKILL.md parses with required frontmatter
