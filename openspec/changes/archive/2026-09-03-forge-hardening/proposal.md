# Proposal: forge-hardening

## Why

The published `brain-forge-installer` change (repo public/private at github.com/[dono]777/[REPO]) closed with two tracked follow-ups from review/e2e waves. They harden the pipeline but were deliberately deferred to avoid weakening the sanitization gate mid-flight and to keep the installer change scoped.

## What Changes

- **Per-rule path scoping** (was task 2.7): the allowlist mechanism currently inertizes ALL 26 rules on allowlisted paths; `skills/hermes-tree/**` and `skills/user-level/**` (~430 of 481 skills) therefore ship ungated for secret shapes. Add per-rule scope support to the gate data + runners, keep secret-shape rules ACTIVE on all of `skills/**` (with fixture-checked placeholder exemptions for documented doc-example shapes), re-run fixtures + smoke + gate proofs.
- **Auto-sanitize vendor pipeline** (was task 5.5): a full `vendor-skills.ps1` re-run re-introduces owner paths/BOMs from live sources (88 files had to be sanitized manually post-vendor). Wire sanitize + `-ManifestOnly` + BOM-strip into the vendor script as a mandatory post-copy step (single command, idempotent), prove by full re-run → gate 0 hits without manual steps.

## Capabilities

### Modified capabilities
- `curation-pipeline`: per-rule path scoping in the sanitization gate.
- `skills-distribution`: vendor pipeline self-sanitizes (no manual post-pass).

## Impact

- Gate coverage becomes uniform across `skills/**`; vendor re-runs can never regress sanitization.
- No installer/spec-contract changes; artifacts byte-identical apart from re-sanitized copies.

## Non-goals

- Placeholder-izing upstream (live) skill sources — repo-side only.
- New installer features.
