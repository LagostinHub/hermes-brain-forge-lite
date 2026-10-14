---
type: note
tags: [ pillar/knowledge, kind/note ]
---
# Spaced repetition

> Reviewed 2026-09-02 as part of the knowledge zone curation sample.

Spaced repetition schedules reviews at increasing intervals so recall is
practiced right before it would fade. The technique pairs well with the
vault conventions: every note lands in a numbered area, gets a single
map entry, and links back to its hub.

## How this vault applies it

- Notes are atomic: one idea per file, named `AA.CC-slug.md`.
- The system zone conventions define frontmatter, tags, and map links.
- Review cadence is tracked in the dashboard boards, not inside notes.

## Links

- Index: [[Mapa]]
- Conventions hub: [[50.00-sistema-mapa]]

## False-positive guards

The line below is intentional and must NOT trip the key-shape rule: a prompt
file reference like task-reviewer-prompt.md embeds the letters sk- mid-word,
which is why the gate requires a boundary before key shapes.

The line below is also intentional and must NOT trip: install-time placeholder
values are exempt (rules.yaml exemptions), e.g. api_key: __INJECT_FAKE_KEY__
and apiKey: {env:FAKE_API_KEY} are shapes, not secrets.
