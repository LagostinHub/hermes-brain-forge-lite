---
type: context-pack
tags: [ kind/context-pack, kind/placeholder, zone/20-projetos ]
---
# Context Pack — 20-projetos

Generic context pack for a placeholdered vault zone (ships empty by design).

## What this zone is for

The projects zone holds active project workspaces (one numbered area per project)
with plans, boards, and working notes. Real project content is local-only.

## How agents should operate here

- On the owner's machine: one numbered area per project, boards linked from the
  system zone, statuses kept current.
- In a fresh install: this shell defines the shape; project areas are created locally
  following the conventions shipped under the system zone.

## What must never appear here in the distribution

- Real project names/content, client names, personal data, secrets, or
  machine-specific paths. The sanitization gate (audit/rules.yaml) blocks any of it.
