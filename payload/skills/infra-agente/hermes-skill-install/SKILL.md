---
name: hermes-skill-install
description: Install a user-authored skill into the Hermes desktop app on Windows so it loads in EVERY session. Covers the correct AppData path (the ~/.hermes trap), the difference between skills and /slash commands, and how to verify. Use when the user wants a skill "native", available across sessions, or says a skill "disappeared / not in my catalog / doesn't exist in my catalog".
---

# Install user skills into Hermes (Windows)

Making a SKILL.md "native" so it appears in every Hermes session is not just
writing the file anywhere — the desktop app only scans specific paths.

## Correct install location (Windows)

The canonical path for AGENT-CREATED skills (where `skill_manage` itself writes,
confirmed on this machine) is under `AppData\Local\hermes\skills\hermes\<name>\`.
Mirror to the default profile too:

- `C:\Users\<user>\AppData\Local\hermes\skills\hermes\<name>\SKILL.md`  ← agent canon
- `C:\Users\<user>\AppData\Local\hermes\profiles\main\skills\<name>\SKILL.md`

In git-bash / MSYS use `$LOCALAPPDATA` (NOT `$APPDATA`):

```bash
mkdir -p "$LOCALAPPDATA/hermes/skills/hermes/<name>"
cp SKILL.md "$LOCALAPPDATA/hermes/skills/hermes/<name>/SKILL.md"
# also mirror to the default profile so it loads under 'main'
mkdir -p "$LOCALAPPDATA/hermes/profiles/main/skills/<name>"
cp SKILL.md "$LOCALAPPDATA/hermes/profiles/main/skills/<name>/SKILL.md"
```

Note: `AppData\Local\hermes\hermes-agent\skills\` holds BUNDLED skills shipped with
the app — user/agent skills live under `AppData\Local\hermes\skills\hermes\`. Both
trees are scanned, but always prefer the `skills\hermes\` tree for skills you create
(the `skill_manage` tool writes there by default).

## The trap: `~/.hermes/skills` is NOT reliably read

`C:\Users\<user>\.hermes\skills\` (i.e. `~/.hermes/skills`) is **not** a path the
desktop app scans consistently. A skill placed there may show up in the *current*
session (fallback scan) but **vanishes in a new session** — the user sees
"the skill doesn't exist in my catalog." Always install to `AppData\Local\hermes\...`
above, never to `~/.hermes/skills`.

## `$APPDATA` vs `$LOCALAPPDATA` (git-bash gotcha)

- `$APPDATA` → `...\AppData\Roaming`
- `$LOCALAPPDATA` → `...\AppData\Local`  ← use this for skills

Do NOT concatenate `Local` or `Roaming` onto `$APPDATA` — you get a doubled,
non-existent path like `AppData\Roaming\Local\hermes\...`. That silently writes
the skill to an unscanned place, and a later `rm -rf` of that wrong path can also
delete the only copy you had (this actually happened once — recover the content
from the conversation, don't re-derive from a wrong duplicated path).

## Skills ≠ slash commands

Creating a SKILL.md does **NOT** create a `/<name>` slash command. Slash commands
are registered in `hermes_cli/commands.py` + TUI rebuild — not editable in the
installed app. To use an installed skill, tell the agent:
> "use the skill <name>"

It loads the SKILL.md and follows it. There is no `/<name>` autocomplete.

## Verify

1. `skills_list` (agent tool) — confirm the skill name appears.
2. Cross-session: open a fresh Hermes session and ask "do you have the skill <name>?"
   (can't verify programmatically from inside one session).
3. By symmetry with bundled skills (which live in the same `AppData\Local\hermes\...`
   tree), a file in the correct path WILL load.

## Injecting global rules (SOUL.md alternative)

When the user wants a skill/rule to apply to EVERY response (not just when invoked), you need to inject it as a system instruction. The naive approach — editing `~/.hermes/SOUL.md` or `config.yaml` — is **blocked** (security-sensitive, agent writes refused).

### Hermes: `prefill_messages_file`

The working path is the `prefill_messages_file` config key. It injects a JSON array of messages at the start of every conversation.

1. Create a JSON file with your rules:
   ```json
   [
     {
       "role": "system",
       "content": "Your rules here..."
     }
   ]
   ```
2. Edit `~/.hermes/config.yaml` directly (agent cannot write to it) and set:
   ```yaml
   prefill_messages_file: 'C:\path\to\rules.json'
   ```
3. Restart Hermes for the change to take effect.

**Limitations:**
- `SOUL.md` and `config.yaml` are protected — agent writes are refused with "security-sensitive configuration"
- The user must edit `config.yaml` manually or via `hermes config`
- `prefill_messages_file` accepts a single JSON file path (array of messages)

### OpenCode: `instructions` array

OpenCode supports multiple instruction files via the `instructions` array in `opencode.json`:

```json
{
  "instructions": [
    "C:\\AI\\opencode\\OBSIDIAN_VAULT.md",
    "C:\\AI\\opencode\\<brand>_RULES.md"
  ]
}
```

Each file is loaded as a system instruction. The agent CAN edit `opencode.json` (not protected), so this can be done programmatically:

```python
import json
with open('C:/Users/<user>/.config/opencode/opencode.json', 'r') as f:
    config = json.load(f)
config['instructions'].append('C:\\path\\to\\new_rules.md')
with open('C:/Users/<user>/.config/opencode/opencode.json', 'w') as f:
    json.dump(config, f, indent=2)
```

### When to use

- User wants a skill/rule to be "always on" → inject via `prefill_messages_file` (Hermes) or `instructions` (OpenCode)
- User says "make this a global rule" or "I want this in every response" → same path
- The skill content is too long for a single SKILL.md → split into a main file + `references/` support files

## Pitfalls

- Don't delete the source SKILL.md before copying to the final path — if a copy
  fails you lose the content. Keep the original until both destinations confirm.
- A skill that points at a big cloned repo should keep the repo on disk and only
  ship a lightweight SKILL.md that references it (don't duplicate GBs of assets).
- `npx` is often missing in git-bash; use `./node_modules/.bin/<cli>` for project CLIs.
- **external_dirs with .md siblings (cache + ambiguity trap):** When registering
  a `skills:\n  external_dirs:` path that points at a repo root, the Hermes daemon
  recursively indexes **every** `SKILL.md` AND any sibling `.md` file as a skill.
  If the cloned repo has a `docs/` directory (e.g. mattpocock/skills ships
  `docs/engineering/<name>.md`), the daemon indexes those `.md` files as skills
  with the **same `name:` frontmatter** as the real `SKILL.md`, producing an
  AMBIGUOUS name match (`skill_view` returns "2 skills match"). 

  **Fix:** point `external_dirs` at the `skills/` SUBDIR only, not the repo root.
  Example (correct):
  ```yaml
  skills:
    external_dirs:
      - [CAMINHO]
  ```
  If you already registered the repo root, rename/remove the conflicting `.md`
  tree (the daemon's index is cached at session start — renaming the dir on disk
  invalidates the stale entry; a full daemon restart forces a fresh tree walk).
  After changing `external_dirs`, verify with `hermes skills list` (CLI, fresh
  process) — the in-session `skill_view` cache may still show stale matches until
  the daemon reloads the config.
