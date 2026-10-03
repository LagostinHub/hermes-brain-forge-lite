# BNF-UPGRADE — do lite para a versão completa

O install lite **não** faz isto. É um passo separado, de propósito: quem instala
o lite não quer a curadoria completa da mesma hora.

## O que o upgrade mexe

Nada do que já está instalado é sobrescrito. O upgrade **adiciona**:

| Onde | O que entra |
|---|---|
| `$HOME/skills/<nome>/` | as skills restantes da curadoria completa |
| `$REPO/openspec/specs/<capability>/` | specs que só existem na full |
| `$VAULT/<zona>/` | as zonas e notas que ficaram de fora do lite |
| `$HOME/` | conectores e integrações que o lite não instala (MCPs, personalities) |

## Regra de colisão (vale sempre)

Duas cópias divergentes da mesma skill fazem o agente escolher por sorteio.

```
compare o sha256 antes de escrever:
  igual     -> pule, já é a mesma
  diferente -> mova a nova para $HOME/skills/.incoming/, reporte, pergunte
nunca sobrescreva em silêncio
```

Cada skill nova tem o sha em `payload/MANIFEST-skills.json`. Se um `sha256` do
manifesto bater com o arquivo já instalado, é a mesma versão — pule.

## Procedimento

1. **Diagnostique o estado antes de mudar nada.**

   ```
   $HOME/skills/          quantas skills? quais?
   $REPO/openspec/specs/   quais capacidades?
   $VAULT/                quais zonas?
   ```

   Não presuma. O upgrade assume que a pessoa já mexeu no vault depois do lite.

2. **Mostre o plano antes de executar.** Zonas novas, skills novas, specs novas.
   A pessoa aprova.

3. **Copie com a regra de colisão.** Pasta por pasta, skill por skill. Se colidir,
   `.incoming/`.

4. **Sanitize o que entra.** O material da full tem path de dono e dado de cliente
   até passar pelo `bnf-lite-audit.sh`. Rode o gate no repo de destino:

   ```bash
   bash hooks/bnf-lite-audit.sh
   ```

5. **Spec nova é change nova.** Não edite uma spec promovida à mão. Se a full tem
   uma spec que o lite não tem, trate como mudança:

   ```
   openspec/changes/add-<capability>/
     proposal.md   por que essa capacidade entra agora
     tasks.md      o que copiar
   ```

   Depois aplique e promova com `/openspec-archive-change`.

6. **Re-verifique.** O checklist do `BNF-INSTALL.md` roda igual. Um upgrade que
   não foi testado é um upgrade que não aconteceu.

## O que o upgrade NÃO faz

- Não instala Hermes, OpenCode, Obsidian ou node — isso é do install lite.
- Não roda o `setup-gbrain` / doctor do Hermes; se a pessoa quiser revalidar o
  agente, ela roda direto.
- Não é automático. Sem execução humana, upgrade não acontece.

## Rollback

O lite não altera skills existentes, então o rollback é deletar o que foi
adicionado:

```
$HOME/skills/.incoming/          tudo que colidiu — reverta daqui
$HOME/skills/<nome>/             só as pastas novas
$REPO/openspec/specs/<cap>/      só as capacidades novas
$VAULT/<zona>/                   só as zonas novas
```

Nada do lite é perdido no rollback: o upgrade só adds.
