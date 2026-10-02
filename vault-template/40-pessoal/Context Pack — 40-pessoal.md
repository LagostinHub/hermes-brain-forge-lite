---
type: context-pack
tags: [ kind/context-pack, kind/placeholder, zone/40-pessoal ]
---
# Context Pack — 40-pessoal

Generic context pack for a placeholdered vault zone (ships empty by design).

## What this zone is for

The personal zone holds diaries, private reflections, and personal administration.
This is the most sensitive zone in the vault: it is excluded from every distribution
and guarded by dedicated sanitization rules (diary filename patterns, personal terms).

## How agents should operate here

- Treat everything in this zone as strictly private; never reference its content in
  summaries, commits, or outbound communication.
- In a fresh install: this shell is the landing point; the zone is created empty.

## What must never appear here in the distribution

- Diaries, personal notes, personal names, client data, secrets, or machine-specific
  paths. The sanitization gate (audit/rules.yaml) blocks any of it.
