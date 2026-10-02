---
type: note
tags: [ pillar/system, kind/convention, project/transversal ]
---

# Framework Sync

O framework canônico do segundo cérebro vive em **`[CAMINHO]`**
(repositório git **privado**). Ele contém:

- `skills/`        → espelhado no vault como `.agents/skills` (fonte para `.claude`, `.opencode`, `copilot`)
- `agent-config/`  → playbooks, tag taxonomy, context packs
- `scripts/`       → automação de reorg + sync
- `templates/`     → templates do Obsidian

## Sincronizar

Do repositório `brain-framework` (PowerShell):

    pwsh sync-bootstrap.ps1 -Direction ToVault      # framework -> vault
    pwsh sync-bootstrap.ps1 -Direction ToFramework  # vault -> framework (backup)

Dentro do vault, para espelhar skills entre runtimes:

    powershell.exe scripts/sync-skills.ps1

## Privacidade

Nunca tornar o repositório `brain-framework` público — ele pode conter
context packs e notas pessoais. Adicionar remote privado quando criar o
repo no GitHub.
