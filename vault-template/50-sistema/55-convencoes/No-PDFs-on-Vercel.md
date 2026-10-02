# Regra de Desenvolvimento: Nenhum PDF/EPUB no Deploy

> **Regra 0:** NUNCA fazer deploy de PDFs, EPUBs, arquivos binários pesados ou assets não-essenciais no Vercel. O Vercel Free tem limite de 100GB bandwidth/mês — 176MB de PDFs em 48h estourou o limite e levou bloqueio por "fair use violation".

## Regra de Ouro
- ✅ **Texto extraído** → Markdown em `public/` (máx 10MB total)
- ✅ **Imagens webtimizadas** → WebP/OTimized JPEG (máx 2MB cada)
- ⛔ **PDFs** → NÃO no deploy. Extrair texto pra MD
- ⛔ **EPUBs** → NÃO no deploy. Converter pra MD
- ⛔ **Auto-deploy** → DESATIVADO. Deploy só após validação manual

## Processo Obrigatório (TODO agente segue)
1. Extrai conteúdo de PDFs/epubs localmente (`scripts/extract-pdfs.py`)
2. Salva como Markdown em `public/`
3. Valida tamanho total: `du -sh public/` < 50MB
4. Só então commit + deploy manual (`vercel deploy --prod --yes`)

## Consequências de Violar
- Vercel Team bloqueado (1-2 dias de downtime)
- Necessário abrir ticket de billing
- Atrasa todo o time

Aplicado: 2026-09-20. **Vai pra todos os projetos** — taroth-app, cliente-c, tudo.
