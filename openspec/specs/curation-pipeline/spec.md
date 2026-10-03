# curation-pipeline Specification

## Purpose
TBD - created by archiving change brain-forge-installer. Update Purpose after archive.

## Requirements

### Requirement: Zone map governs curation
The pipeline MUST carry a machine-readable zone map declaring, for every vault zone, whether it is INCLUDED in, EXCLUDED from, or PLACEHOLDERED in the shipped skeleton. Excluded zones MUST NOT be copied. Placeholdered zones MUST ship as empty shells with a placeholder note and a generic Context Pack.

#### Scenario: Excluded zone never ships
- WHEN the skeleton is built from the live vault
- THEN no file from an excluded zone exists anywhere in `vault-template/`, and each excluded zone has its shell + placeholder note

### Requirement: Sanitization gate blocks publish
A sanitization scan MUST run before every publish/commit and MUST fail (non-zero exit) when it detects personal-data shapes: client names, diary-zone content, personal filesystem paths, or secret-like strings.

#### Scenario: Leak blocked
- WHEN a file containing fixture personal data is staged
- THEN the scan exits non-zero and names the file + rule

#### Scenario: Clean tree passes
- WHEN the scan runs over a correctly curated skeleton
- THEN it exits zero

### Requirement: Fixtures prove the gate
The audit MUST ship a fixture corpus of fake personal/client data with tests proving every rule fires, and fixtures MUST be the only personal-looking strings in the repo.

#### Scenario: Every rule fires on fixtures
- WHEN the fixture corpus is run through the scan
- THEN every sanitization rule fires at least once and the scan reports full rule coverage

### Requirement: Reproducible regeneration
The skeleton build MUST be deterministic — running curation twice against the same live vault state produces byte-identical output — and a `forge refresh` command MUST regenerate, diff against the current snapshot, and pass the audit gate before tagging.

#### Scenario: Idempotent generation
- WHEN the skeleton build runs twice on an unchanged live state
- THEN both outputs are byte-identical (empty diff)

#### Scenario: Refresh produces a reviewed snapshot
- WHEN `forge refresh` runs after live changes
- THEN a diff report is produced, the audit gate runs, and only a passing result can be tagged
