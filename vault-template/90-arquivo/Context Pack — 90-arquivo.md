---
type: context-pack
tags: [ kind/context-pack, kind/placeholder, zone/90-arquivo ]
---
# Context Pack — 90-arquivo

Generic context pack for a placeholdered vault zone (ships empty by design).

## What this zone is for

The archive zone holds closed/inactive material moved out of the working zones:
finished engagements, old projects, superseded notes. Archive content inherits the
sensitivity of its origin (clients, projects, personal) and therefore never ships.

## How agents should operate here

- On the owner's machine: archive by moving whole areas, keeping the numbering.
- In a fresh install: this shell is the landing point; the zone starts empty.

## What must never appear here in the distribution

- Historical client/project/personal content, secrets, or machine-specific paths.
  The sanitization gate (audit/rules.yaml) blocks any of it.
