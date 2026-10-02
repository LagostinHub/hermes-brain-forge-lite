---
type: context-pack
tags: [ kind/context-pack, kind/placeholder, zone/00-captura ]
---
# Context Pack — 00-captura

Generic context pack for a placeholdered vault zone (ships empty by design).

## What this zone is for

The capture zone is the inbox of the Second Brain: unprocessed notes, quick captures,
and intake items land here before being filed into knowledge or project zones using
the Johnny.Decimal naming convention (`AA.CC-slug.md`).

## How agents should operate here

- Treat this zone as an intake area: file or archive items, never leave them unsorted.
- Follow the vault conventions shipped under the system zone (naming, templates, MOCs).
- Any workflow notes describing *how* the zone works belong here; the *content* stays
  on the owner's machine.

## What must never appear here in the distribution

- Client names, personal names, diaries, real project content, secrets, or
  machine-specific paths. The sanitization gate (audit/rules.yaml) blocks any of it.
