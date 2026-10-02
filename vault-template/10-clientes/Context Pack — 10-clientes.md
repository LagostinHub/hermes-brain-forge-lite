---
type: context-pack
tags: [ kind/context-pack, kind/placeholder, zone/10-clientes ]
---
# Context Pack — 10-clientes

Generic context pack for a placeholdered vault zone (ships empty by design).

## What this zone is for

The clients zone holds one numbered area per client (`11-…`, `12-…`) with engagement
notes, deliverables, and meeting records. It is strictly local: client identities and
work products never enter any distribution or repo.

## How agents should operate here

- On the owner's machine: follow the per-client area naming and keep one map per client.
- In a fresh install: this shell defines the shape; create local client areas following
  the conventions shipped under the system zone.

## What must never appear here in the distribution

- Client names, project content, personal data, secrets, or machine-specific paths.
  The sanitization gate (audit/rules.yaml) blocks any of it.
