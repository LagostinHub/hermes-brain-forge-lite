# Gerenciamento de Labels — board [Cliente] 2026

> Atualizado 2026-09-15 (revisão de labels e pastas). Referenciado pelo [[Kan Runbook]].

## Esquema labels = pastas (espelho OFFLINE/ONLINE)

As labels do board correspondem **1:1 às pastas** de `02- Comunicação/` (OFFLINE/ONLINE).
Classificação por **nome do arquivo** (regra de precedência em ordem):

1. nome tem **`PARCEIRO`/`PAERCEROS`** → label **`DOBRADA`** (pasta `Dobradinhas/`)
2. nome tem **`PROPOSTA`/`CURSINHO`/`EDUCAÇÃO DARK`/`ORÇAMENTO`** → label **`PROPOSTAS`** (pasta `Propostas/`)
3. nome tem **`FEED`** → label **`FEED`** ou **`feed-cidades`** (pasta `Feed/`)
4. nome tem **`DARK-BRASILIA`** → label **`Dark-Brasilia`** (pasta `Feed Brasilia/`)
5. nome tem **`VLOG`/`cg_vlog`** → label **`VLOG`** (pasta `Vlog/`)
6. senão → `dark-cidades` / `dark-uni` (pasta `Dark Post/`)

## Labels do board (com IDs canônicos)

| Label | ID público | Cor | Uso |
|---|---|---|---|
| `DARK` | `4qt23sifpzmt` | `#111827` | legado — substituída, NÃO usar p/ novos |
| `APOIO` | `wr6cxe9faajj` | `#9333ea` | TL1–TL2 apoio cultura |
| `FEED` | `l5d5dxn7wtvc` | `#16a34a` | feeds (nome "FEED") |
| `feed-cidades` | `1y2iuph379bt` | `#2E86AB` | FEED_COLOMBO, criação 2026-09-15 |
| `Dark-Brasilia` | `1qeaamrors96` | `#780585` | campanha Brasília TL24–33 |
| `dark-cidades` | `yhta61y81pow` | `#2E86AB` | feeds dark de cidades |
| `dark-uni` | `sum2gmtsxrq6` | `#A23B72` | feeds dark de universidades |
| `DOBRADA` | `0l7d357t2fhv` | `#FD0E59` | nome "PARCEIRO/PARCEIRO", criação 2026-09-15 |
| `PROPOSTAS` | `ntvzqr43fbr4` | `#01B7A6` | nome "PROPOSTA/CURSINHO/EDUCAÇÃO DARK/ORÇAMENTO", criação 2026-09-15 |
| `VLOG` | `wtab35kqmx5j` | `#dc2626` | vlogs |

## Add / Remove label

- **ADD:** `PUT /cards/{cardId}/labels/{labelId}` (HTTP 415 mas persiste — não é erro). Ou MCP `mcp__kan__toggle_card_label(cardPublicId, labelPublicId)` → `newLabel: true`.
- **REMOVE:** REST PUT **só adiciona**, NÃO remove. Usar **obrigatoriamente** MCP `mcp__kan__toggle_card_label` → retorna `newLabel: false`.
- **Descoberta de IDs:** `GET /boards/a03x3cpjonxh` → `labels[].publicId`.

## Convenção de card (título)

```
<TEMA>_<CATEGORIA>_v<XX>.mp4   →   card "TL<n> <nome do arquivo>"
```

- Card novo: `TL<n> <nome do arquivo sem extensão>` + label conforme regra acima.
- Nomes de arquivo **sem "DARK"** quando o conteúdo não é dark (ex. vídeos de proposta).

## Histórico de correções (2026-09-15)

- 46 cards duplicados/lixo deletados (0 duplicatas).
- 3 arquivos movidos `Dark Post/` → `Propostas/` + renomeados (removido "DARK"): CURSINHOS (TL34), EDUCAÇÃO (TL35), Orçamento-Público (TL28).
- Labels corrigidas: CORTEZ/ELOY (PARCEIRO)→DOBRADA, PROPOSTAS_Cultura→PROPOSTAS, educativo_FEED→FEED, Orçamento→PROPOSTAS.
- 6 novos cards (TL58–63) criados de timelines Resolve com labels DOBRADA/feed-cidades/PROPOSTAS.