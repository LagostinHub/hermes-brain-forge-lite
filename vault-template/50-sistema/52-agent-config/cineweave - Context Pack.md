---
type: resource
date: 2026-09-09
tags: [ kind/resource, project/cineweave ]
ai-first: true
project: "cineweave"
stack: "React 19, Vite 8, TS, Tailwind, Supabase, Konva 10, PWA (Workbox)"
status: ativo
last-updated: 2026-09-09
ai-read-first: true
---

# 📦 Context Pack — cineweave

> **READ FIRST** by any agent (Hermes / OpenCode / Claude) when starting a session on this project. Repo: `[CAMINHO]`.

## 🎯 O que é

Plataforma de roteiro cinematográfico com IA — "Editor de roteiro Hollywoodiano" (PT-BR):

- **Roteiro**: Fountain/FDX/PDF/DOCX + revisões em 8 níveis com cor
- **Enciclopédia**, **Brainstorm**, **Corkboard**, **Mind Map**, **Análise Técnica**, **Storyboard** (Konva), **Timeline**
- **Plugin system**: Bechdel / Cleaner / Linter
- **NVIDIA LLM proxy**

## 🧱 Stack

- React 19.2.7 · Vite 8.1.1 · TypeScript · Tailwind · Supabase
- Konva · jsPDF · html2canvas · jszip · mammoth · pdfjs-dist
- vite-plugin-pwa · oxlint + husky + commitlint + lint-staged
- Playwright E2E

## 🗂️ Estrutura

- `src/plugins/` — plugins
- `src/lib/pluginSystem/` — engine de plugins
- `src/lib/diffEngine/` — diff de revisões
- `api/nvidia/[...path].js` — proxy (llama-3.1-70b)
- `beat/` — clone do app Beat (open-source)
- `ROTEIROS/` — 92 roteiros analisados
- `DESIGN.md` — design tokens · `DEVELOPMENT.md`

## 🔒 Decisões fixas

- Design-system obrigatório (tokens `DESIGN.md`, primary `#ccee00` lime-gold, dark glassmorphism).
- **NUNCA** modificar/remover: `BEAT...END_BEAT`, `REVISION_GENERATIONS`, `revisionMode`/`revisionGeneration`/`revisions[]`, NovelMode, plugin engine, markers ``beat categoria:detalhe``.
- Dual-storage: localStorage + Supabase.

## ⚠️ Armadilhas

- Revisões somem após refresh → registrar `blockRevisionGen` no `handleBlur`.
- Erro de hidratação `<svg>` dentro de `<option>`.
- Sync field mapping snake_case ↔ camelCase.

## ✅ Validação

- `npm run lint`
- `npm run build`
- `npm run test:e2e`

## 🐞 Pendências

- Branch `fix/lint-warnings-batch1` com 28 files WIP **não commitados**.
- Plano production-ready (`docs/superpowers/plans/2026-07-19...md`) com 16 tasks desatualizadas.
- Sem OpenSpec (AGENTS.md manda, mas não existe).
- oxlint out em 28 files.

## ➡️ Próximos passos

- Commitar lint fix → validar E2E → atualizar plano → deploy Vercel (linkado, `dist/` existe).

## 🔗 Links

- [[23.03-cineweave-moc]]
- [[Cineweave Kanban]]