---
type: resource
tags: [ pillar/system, kind/resource, area/personal, project/second-brain ]
---
# Vault — Operating Rules

Vault path: `%OBSIDIAN_VAULT_PATH%`.

Este vault é o **espelho bidirecional** entre o usuário (<user>) e o Hermes Agent.
Regras compartilhadas — valem tanto para o Hermes operar quanto para o <user> editar manualmente.
Padrão: **Johnny.Decimal** (Obsidian Second Brain). Operação via `50-sistema/55-convencoes/Metodo de Trabalho.md` (operating model canônico). Claude/Hermes é o leitor primário.

## Princípio
- **Hermes = principal** (memória do Hermes é a fonte de verdade ativa).
- **Obsidian = espelho legível + edição humana**. Tudo que o <user> edita aqui
  deve ser importado de volta pro Hermes via `obsidian-doc-sync` (skill global atual; `obsidian-ingest`/`obsidian-catchup` removidas 2026-08-06).
- Toda info valiosa (decisão, projeto, pessoa, conceito, tarefa) vive na área JD apropriada (`00-captura/` · `10-clientes/` · `20-projetos/` · `30-conhecimento/` · `40-pessoal/` · `50-sistema/` · `90-arquivo/`).

## Folder Map (autoritativo — second-brain resolve por aqui)
O vault é organizado por áreas Johnny.Decimal (exatamente 1 `pillar/*` por nota). Raiz: `%OBSIDIAN_VAULT_PATH%`.

| Área | Pasta |
|------|-------|
| Inbox (captura rápida) | `00-captura/` |
| Clientes, pessoas, entidades | `10-clientes/` |
| Projetos e entregas | `20-projetos/` |
| Conceitos, decisões, lições, MOCs | `30-conhecimento/` |
| Carreira, vida, registros | `40-pessoal/` |
| Método, skills, config, scripts, boards, templates | `50-sistema/` |
| Material arquivado | `90-arquivo/` |

## Regras de escrita
- Markdown plano. Wikilinks `[[Nome_da_Nota]]` (NOME, não path).
- Nomes de arquivo: `AA.CC-slug.md` (kebab-case, sem espaço/acento), prefixo JD na pasta.
- Não apagar histórico — marcar como arquivado se obsoleto (mover pra `90-arquivo/`).
- Ao criar entidade, linkar pro projeto pai.

## Para o Hermes (no start da sessão)
- Ler `Mapa.md` + `50-sistema/55-convencoes/Metodo de Trabalho.md` + `50-sistema/56-boards/` e `40-pessoal/41-diarios/`.
- Usar `obsidian-second-brain` para ler/escrever/ingest.
- Comandos cloud (Grok/Perplexity/YouTube) são permitidos como ferramentas de pesquisa. Apenas o **armazenamento do vault** é 100% local.
- Sempre checar órfãos e linkar notas novas no `Mapa.md` / hubs de área.

## Para o <user> (edição manual)
- Edite livremente qualquer arquivo nas áreas JD (`00-captura/` · `10-clientes/` · `20-projetos/` · `30-conhecimento/` · `40-pessoal/` · `50-sistema/` · `90-arquivo/`).
- Para trazer pro Hermes: peça "importa minhas edições do Obsidian" → Hermes roda
  `obsidian-doc-sync` (sucessora de `obsidian-catchup`/`obsidian-ingest`, removidas 2026-08-06).

## Memory Sync (review flow — do OMH)
- Ao revisar memória (MEMORY.md / USER.md / vault), PREPARAR diff, não aplicar direto.
- Mostrar ao <user> o que mudar (keep / revise / archive) e só aplicar após confirmação.
- Regra: diff preparado NÃO é mutação aplicada. Não afirmar "atualizei" sem confirmação.
- Evidência: só afirmar mudança se o arquivo foi escrito E o <user> aprovou.

## Navegação
- Índice mestre: [[Mapa]]
- Todas as notas: [[52.01-hermes-agent]] · [[31.07-[ferramenta]-setup]]



