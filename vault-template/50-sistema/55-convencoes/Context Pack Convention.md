---
date: 2026-08-27
type: convention
tags: [ pillar/system, kind/resource, area/method, project/second-brain ]
ai-first: true
---
# 📦 Context Pack Convention

## For future Claude
How to create and use a Context Pack. Every active project in `[CAMINHO]` MUST have one. It is the single note an agent reads first when starting on that project.

## What a Context Pack is
A note at `[DONO]_VAULT/agent-config/<proj> - Context Pack.md` that records, for `<proj>`:
- Repo path (`[CAMINHO]`)
- Stack
- Fixed decisions (link to `<proj> - Decisions` if exists)
- Critical traps
- Validation commands (run BEFORE committing)
- Known pendencies
- Links to project hub + AGENTS note

## How to create
1. Use the template `templates/Context Pack Template.md` via **Templater** (`Create new note from template`) so `<% tp.file.title %>` and `<% tp.date.now %>` resolve. (Core "Templates" plugin would leave the `<% %>` literal — don't use it for Context Packs.)
2. Filename MUST be `<proj> - Context Pack` so the convention is discoverable.
3. Set `ai-read-first: true` + `ai-first: true` in frontmatter.

## How agents use it
- At session start on `<proj>`, read `agent-config/<proj> - Context Pack.md` first.
- After work, update its "Últimos passos"/"Pendências" and write-back decisions to `Lessons Learned`.
- Never re-explain the project to the human from scratch.
