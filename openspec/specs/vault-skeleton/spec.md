# vault-skeleton Specification

## Purpose
TBD - created by archiving change brain-forge-installer. Update Purpose after archive.

## Requirements

### Requirement: Skeleton carries the methodology
The shipped vault skeleton MUST include: the Johnny.Decimal zone structure (included zones), conventions notes (AGENTS.md, OpenSpec Workflow, Kanban Workflow, Tag Taxonomy, Método de Trabalho, Operating Rules), templates (Daily/Weekly/Project/Resource/Context Pack), MOCs for included zones, and the `.obsidian` config with the curated plugin set (the source machine's current `community-plugins.json`, 18 entries as of 2026-09-02) and settings — without machine-specific workspace state.

#### Scenario: Fresh vault opens ready
- WHEN the skeleton is installed and opened in Obsidian
- THEN the curated plugin set is listed/enabled, templates resolve, and no workspace/layout state from the source machine leaks

### Requirement: Knowledge travels, personal does not
All knowledge notes (knowledge zone) MUST ship; diaries and personal notes MUST NOT ship.

#### Scenario: Knowledge present, diaries absent
- WHEN the skeleton is inspected
- THEN knowledge MOCs/notes resolve, and no diary/personal note exists (only the zone shell)

### Requirement: Link health inherited
The skeleton MUST pass the link health check (0 broken wikilinks, 0 orphan files) with placeholder zones excluded from scanning.

#### Scenario: Health check green on skeleton
- WHEN the link health check runs over the built skeleton
- THEN it reports 0 broken wikilinks and 0 orphan files (excluding placeholder zones)
