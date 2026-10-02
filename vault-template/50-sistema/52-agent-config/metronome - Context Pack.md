---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/infraestrutura ]
ai-first: true
project: "metronome"
stack: "Next.js 14, React 18, TS, Web Audio, IndexedDB, PWA, Tailwind"
status: completo
last-updated: 2026-09-09
ai-read-first: true
---

# 📦 Context Pack — metronome

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. Repo: `[CAMINHO]`.

## 🎯 O que é

Metrônomo + Setlist manager (PWA mobile-first) para músicos. **100% completo, production-ready** (`COMPLETED.md`).

- BPM 20–1000 · 7 subdivisões · pitch 100–2000Hz · acentos · haptics
- Setlist CRUD · JSON export/import · compasso 5/8–12/8
- Design Soundbrenner-level (OKLCH, SVG BPM)

## 🧱 Stack

- Next.js 14 · React 18 · TypeScript · Web Audio API · IndexedDB · PWA (next-pwa) · Tailwind

## 🗂️ Estrutura

- `src/app`
- `src/components/` — BpmDisplay, ControlPanel, MetronomeApp, SetlistPanel
- `src/hooks/` — useMetronome, useSetlist
- `src/lib/` — setlist.ts
- `scripts/generate-icons.js`

## 🔒 Decisões fixas

- Porta **5000** (dev/start).
- Design Linear + Spotify patterns.

## ⚠️ Armadilhas

- Nenhuma funcional conhecida (projeto completo).

## ✅ Validação

- `npm run build`
- `npm run lint`

## 🐞 Pendências

- NENHUMA funcional — falta só decidir deploy (Vercel/Netlify) + domínio.

## ➡️ Próximos passos

- Publicar (app já buildado, `.next` existe). **Alvo ADIADO pelo dono (2026-09-12) — "decidir depois".** Recomendação técnica registrada: **Vercel** (Next.js nativo, zero-config, PWA direto).

## 🔗 Links

- [[34.01-infraestrutura]]
- [[Infraestrutura Kanban]]