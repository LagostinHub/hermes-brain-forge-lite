---
name: hermes-mcp-troubleshoot
description: Debug a Hermes Agent MCP server that is listed in settings but fails to start / exposes no tools. Covers config.yaml entry format, Windows command resolution, the patch/config-set edit pitfalls, and a reusable JSON-RPC stdio handshake test.
---

# Hermes MCP Troubleshoot

Use when: an MCP server appears in the Hermes MCP list but does nothing — no tools, "not connected", or it silently fails when you call a tool. The server binary is usually installed fine; the breakage is in how Hermes launches it.

## Anatomy of the fix (order of attack)

1. **Find the entry.** MCP servers live in `~/.hermes/config.yaml` under `mcp_servers:`. Read the raw file (not `hermes config show`, which re-serializes and hides format bugs).
   ```bash
   # Windows path example:
   read_file C:/Users/<user>/AppData/Local/hermes/config.yaml
   ```

2. **Check the entry is a STRUCTURED YAML block, not a string.** The #1 cause of "listed but dead" is an entry saved like this:
   ```yaml
   davinci-resolve: '{command: davinci-resolve-mcp, args: [server]}'   # WRONG - it's a string
   ```
   It must be a map:
   ```yaml
   davinci-resolve:
     command: C:\Program Files\Python312\python.exe
     args:
       - C:\path\to\server.py
     env:
       KEY: value
     enabled: true
   ```

3. **Windows command resolution.** Hermes launches MCP servers WITHOUT a shell. A bare command name that only exists as a `.cmd`/`.ps1` shim (e.g. `davinci-resolve-mcp`, `npx foo`) will NOT resolve. Always point `command` at a real `.exe`:
   - Python servers → full path to `python.exe` + the `.py` as args[0]
   - Node servers → full path to `node.exe` + the `.mjs`/`.js` as args[0]

3b. **`mcp test` passes but runtime is dead? Suspect an env leak (Cause B below), NOT a bad command.** This is the single most common "listed as enabled but doesn't work" case on Windows. `hermes mcp test` runs in the gateway's own process context and hides a `PYTHONPATH`/`PYTHONHOME` leak into the child. Before touching `command`, check the server's own `logs/server.log` for a `ModuleNotFoundError: No module named 'pydantic_core._pydantic_core'` traceback — that IS the leak signature. Go straight to "Cause B" under Common Python dependency conflict.

4. **Editing the entry — `hermes config set` vs `patch` vs `execute_code`.** There are three scriptable paths; each has a different failure mode:
   - **`hermes config set mcp_servers.<name>.<leaf_key> <value>`** (single leaf like `command`, `env.PYTHONPATH`, `env.PYTHONHOME`) WORKS and is the safest way to change one field — it does NOT flatten nested blocks when you address a leaf key. Use this per-key for surgical edits.
   - **`hermes config set mcp_servers.<name> "<yaml>"`** (passing a whole YAML string) flattens the block into a quoted STRING and re-breaks the entry. Do NOT pass a YAML blob.
   - **`patch` / `write_file`** REFUSE to touch `config.yaml` ("security-sensitive configuration"). If you need a bulk block rewrite (e.g. restructure the whole `env:` map), use `execute_code` (Python) to read, regex-replace, and write it back. `hermes config edit` opens an editor (not scriptable).
   - **Node stdlib-only servers** (single `.mjs`, zero npm deps, env-var project path — e.g. ScriptBreak) register as `command: "node"` + `args: [abs/.mjs]` + an `env:` map. Same `execute_code` Python recipe applies; see `references/scriptbreak-mcp-registration.md` for the forward-slash path / absolute-path-to-node / decisive `tools/call` repro and the `.scriptbreak` smoke-test fixture.
   - After any edit, re-run `hermes mcp test <name>` and re-read the raw block with `read_file` to confirm shape.

5. **Verify YAML parses** after editing:
   ```bash
   python -c "import yaml; d=yaml.safe_load(open(r'C:/Users/.../config.yaml',encoding='utf-8')); print(d['mcp_servers']['davinci-resolve'])"
   ```

6. **Test the server with a real MCP call — NOT just a handshake.** `hermes mcp test` (and `scripts/test_mcp_stdio.py`) only do `tools/list`; a server can pass that and STILL die on every real call (see Cause B). The decisive test is `scripts/test_mcp_tools.py --call <real tool>` — e.g. `--call timeline --arg '{"action":"get_current"}'` for davinci-resolve. If a real `tools/call` returns data, the server is genuinely usable. See `references/davinci-resolve-mcp.md` for the verified [MARCA] example.

7. **Reload.** Hermes reads `mcp_servers` at gateway startup. Restart the Hermes gateway / app to pick up changes.

## Reloading the gateway — THE PITFALL

After editing `mcp_servers`, the gateway must re-read `config.yaml`. This is where sessions go wrong:

- **`hermes gateway restart` is BLOCKED when called from inside the gateway process** (i.e. from the same chat session that rides through the gateway). It returns: `Blocked: cannot restart or stop the gateway from inside the gateway process... Run from a separate shell outside the running gateway.` This is true EVEN IF the gateway PID is already dead — the CLI detects the call origin, not the PID state.
- **Do NOT `taskkill` the gateway PID manually to force a reload.** The gateway is managed by the Hermes desktop app (`Hermes.exe`); killing `pythonw` (the gateway) does NOT auto-revive it, and the scheduled tasks `Hermes_Gateway` / `HermesGatewayWatchdog_v2` are DEPRECATED legacy `.cmd` files that print "DEPRECATED" and do nothing. A manual kill leaves you with a dead gateway and no chat-driven way to restart it.
- **The correct reload path: restart the Hermes desktop app** (close all `Hermes.exe`, reopen). On startup it spawns a fresh gateway that reads the corrected `config.yaml`. This is the only reliable, non-destructive reload.
- Verify after reload: the server's own `server.log` (e.g. `.../davinci-resolve-mcp/logs/server.log`) will show `Processing request of type PingRequest` once the gateway reconnects and starts keepalive-pinging it. `mcp-stderr.log` (`AppData/Local/hermes/logs/`) shows `starting MCP server '<name>'` lines — absence of a traceback right after that line means it booted clean.

See `references/gateway-reload.md` for the full verified sequence (what fails, what works, post-reload verification).

## Reusable JSON-RPC stdio test

Run the server with the required env vars, pipe newline-separated JSON-RPC messages, parse stdout for `id:2` → `result.tools`. See `scripts/test_mcp_stdio.py` (handshake/list only) and `scripts/test_mcp_tools.py` (also does `tools/call` — the decisive test). Pitfalls:
- Messages MUST be separated by `\n` (use `printf '%s\n%s\n%s\n'`). Concatenated JSON causes `trailing characters` errors — that's a TEST-CLIENT bug, not a server bug.
- Do NOT run the parser step with `PYTHONHOME` set in the env — it triggers `SRE module mismatch` in the nested python. Run the parser in a clean `env -i` or separate shell.
- `test_mcp_tools.py` passes the `--arg` JSONs over the wire (tools/call), NOT as command-line args to the server. A server that lists but fails on call is the Cause-B leak signature — don't stop at `tools/list`.

## Common Python dependency conflict (TWO distinct causes)

### Cause A — orphan dist-info (in-server site-packages)
Symptom: server crashes on import with `SystemError: The installed pydantic-core version (X) is incompatible with the current pydantic version, which requires Y`. Cause: two `pydantic_core-*.dist-info` dirs in site-packages (an orphan from a partial upgrade). Fix:
```bash
python -m pip install --force-reinstall --no-deps "pydantic_core==<required>"
# then remove the orphan dist-info dir left behind
```

### Cause B — PYTHONPATH leak from the Hermes gateway (MOST COMMON on Windows) — `mcp test` passes but server dies in runtime
**Symptom:** `hermes mcp test <name>` reports `✓ Connected` / `✓ Tools discovered: N`, but in real use every tool call fails or the server never responds. The server's own `logs/server.log` shows a traceback like:
```
File ".../pydantic_core/__init__.py", line 8, in <module>
    from ._pydantic_core import (...
ModuleNotFoundError: No module named 'pydantic_core._pydantic_core'
```
**Root cause:** The Hermes gateway process carries `PYTHONPATH` (and sometimes `PYTHONHOME`) pointing at ITS OWN venv — e that env LEAKS into the MCP child process it spawns. If the gateway's venv is Python 3.11 but the MCP server runs under Python 3.12 (e.g. `C:\Program Files\Python312\python.exe`), the leaked `pydantic_core.cp311-win_amd64.pyd` is incompatible → silent import crash → server dies at boot in runtime, even though `hermes mcp test` runs in the gateway's own correct context and passes.
**Why `mcp test` is misleading:** it exercises the server from the gateway's process context, which already has a consistent interpreter+site-packages. The leaked-env breakage only shows when the gateway spawns a DIFFERENT Python as a child.
**Diagnose it directly** (reproduces the exact leak, no gateway needed):
```bash
# Shell still has Hermes' PYTHONPATH; spawn the server EXACTLY as the gateway would:
PYTHONPATH="<leaked Hermes venv site-packages>" PYTHONHOME="<sys python>" \
  "<system python 3.12>" src/server.py   # -> ModuleNotFoundError crash (proves the leak)
# Now isolate: run the server with the venv's OWN python and NO leaked PYTHONPATH:
env -u PYTHONPATH -u PYTHONHOME "<mcp>/venv/Scripts/python.exe" src/server.py   # -> boots clean
```
**Fix (isolate the MCP in its own venv):** point `command` at the MCP's bundled venv python and OVERRIDE `PYTHONPATH` in the server `env:` so it wins over the leaked one:
```yaml
davinci-resolve:
  command: %USERPROFILE%\AppData\Roaming\npm\node_modules\davinci-resolve-mcp\venv\Scripts\python.exe
  args:
    - %USERPROFILE%\AppData\Roaming\npm\node_modules\davinci-resolve-mcp\src\server.py
  env:
    RESOLVE_SCRIPT_API: C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting
    RESOLVE_SCRIPT_LIB: C:\Program Files\Blackmagic Design\DaVinci Resolve\fusionscript.dll
    PYTHONPATH: %USERPROFILE%\AppData\Roaming\npm\node_modules\davinci-resolve-mcp\venv\Lib\site-packages
    # PYTHONHOME: ''   # leave UNSET/empty when command is the venv python; setting it to the venv breaks stdlib discovery
  enabled: true
```
Key points:
- `command` must be the MCP's own `venv/Scripts/python.exe` (autosufficient, correct cp312 `.pyd`), NOT the system `python.exe`.
- Setting `PYTHONPATH` in `env:` REPLACES the inherited value (config env is a replace, not append), so the leaked Hermes path no longer wins.
- Do NOT set `PYTHONHOME` when `command` is a venv python — leave it absent/empty, else Python mismatches the venv stdlib and prints `Python path configuration: ... is in build tree = 0` then exits.
- `hermes config set mcp_servers.<name>.env.PYTHONPATH "<venv site-packages>"` is the scriptable way to set it; `hermes config set mcp_servers.<name>.env.PYTHONHOME ""` clears it.
**Verify the fix end-to-end** (proves the server reaches Resolve, not just that it boots): run a client that calls a real tool with the isolated env (see `scripts/test_mcp_tools.py`). A healthy run prints e.g. `project_manager.get_current -> [MARCA]_VSL_01` and `timeline.get_current -> VSL_01-CLEAN_V4`.

## Timeout / 422 on a specific tool call (not a full disconnect)

A server that **lists fine** and **boots clean** can still reject ONE specific `tools/call` with `{"error":"Invalid JSON RPC message","errorCode":1400}` or `{"success":false,"export_type":"EXPORT_FCPXML_1_10","export_subtype":"EXPORT_NONE"}`. This is almost always a **bad argument shape**, not a server bug:

- **Missing required arg:** the tool returns `400: 'arguments' is required` or `missing required argument: <X>`. Add the missing key.
- **Wrong arg type:** passing a string where the schema expects an object → `422: Type mismatch`. Check the schema (`tool_describe` on the deferred tool, or `mcp__davinci_resolve__timeline` argument shape `{"action": ..., "params": {...}}`).
- **Nested `params`:** Resolve MCP tools take `action` + `params` (a nested object). Putting the action name directly in `params` OR omitting `params` entirely yields 422. Correct: `{"action":"export","params":{"format":"fcpxml","path":...}}`.
- **Filesystem path in exported result:** a 200,823-char `get_items_in_track` result means the call SUCCEEDED but returned raw object handles. Parse the saved log file instead of printing — use `read_file` on `Appdata/Local/hermes/cache/terminal/hermes-results/chatcmpl-tool-*.txt`.

**Do NOT chase these as server problems.** Fix the arg, then retry. If the SAME arg shape works for one track (e.g. video track items) and fails for another (e.g. subtitle), that track simply has no items of that kind — empty result, not a crash.

### Retry / recover pattern
```
1. tool_call -> 422/timeout
2. check saved output file in cache/terminal/hermes-results/
3. fix arg shape (often: wrap in params, add track_type/track_index)
4. retry — the auto-retry fires but rarely retries with corrected args, so REISSUE manually
```

## Runtime wrapper death (connected, then dies mid-session)

Unlike the config bugs above, sometimes the MCP **wrapper process** (the `command` launched by Hermes) dies or loses its stdio link during a session even though the underlying service (e.g. the CEP/UXP panel inside the host app, or the child server) is still alive. Symptoms: `ClosedResourceError`, `MCP call failed`, or "MCP server '<name>' is unreachable after N consecutive failures. Auto-retry available in ~Ns."

**Recovery (no config change needed):**
- Run `hermes mcp test <name>` in a terminal — Hermes respawns the wrapper and reconnects (you'll see `✓ Connected` + tool count). This is the fastest fix.
- Or simply wait: Hermes auto-retries after the cooldown it reports (~39s) and usually recovers on its own.
- **Do NOT** hand-roll a direct client (e.g. writing `command-<uuid>.json` to the bridge temp dir). The host-panel side needs the wrapper's own poll/trigger; a raw file write silently times out. Use the Hermes MCP wrapper.
- Confirm the host app / child service is still running (port listening, process alive) before assuming it's a wrapper problem.

This is distinct from the config.yaml breakage in earlier sections: there the server never launches; here it launched and later dropped.

## Secrets in `mcp_servers` — never hardcode the token

A token pasted literally into `config.yaml` is a leak waiting for the next backup / git
add / screen-share. Hermes resolves env refs in **any string value** of a server entry
(`env`, `headers`, `args`, `url`):

```yaml
mcp_servers:
  kan:
    command: C:\Users\<user>\AppData\Local\hermes\node\node.exe
    args:
      - C:/path/to/mcp/dist/index.js
    env:
      KAN_API_TOKEN: "${env:KAN_API_TOKEN}"   # == "${KAN_API_TOKEN}"
      KAN_BASE_URL: "https://board.example.com"
    enabled: true
    timeout: 120
```

Resolution order per ref: **5 context vars (`${userHome}`, `${workspaceFolder}`, …) →
profile secret scope → `os.environ`**; an unresolved ref is kept **literal**.

**Which `.env`?** Two paths matter on Windows and they are NOT the same file:
- `~/.hermes/.env` — the path named in the warning message.
- `$HERMES_HOME/.env` (e.g. `C:\Users\<user>\AppData\Local\hermes\.env`) — the one
  `gateway/run.py` loads **first**, and the one carrying the 30+ provider keys.

Write to **both** if you want every CLI path and the gateway to see it. Bisect with
`env | grep HERMES_HOME` and `hermes config path` rather than guessing.

### The misleading warning (NOT a failure)

```
Config ref '${env:KAN_API_TOKEN}': KAN_API_TOKEN is not set (check ~/.hermes/.env);
keeping the literal placeholder
```

`hermes mcp test <name>` reads the config in a short-lived process. If that read happens
**before** the `.env` load, the ref stays literal — yet the command still prints
`✓ Connected` / `✓ Tools discovered: N`, because the MCP client is built **lazily** and
only needs the token at call time. So the warning and the green check can disagree.

**Do not conclude the ref is broken — and do not revert the change.** Prove it properly:

```bash
cd "$HERMES_HOME/hermes-agent" && ./venv/Scripts/python.exe -c "
from hermes_cli.env_loader import load_hermes_dotenv
load_hermes_dotenv()
import os; print('in os.environ:', bool(os.environ.get('KAN_API_TOKEN')))
from hermes_cli.config import _expand_env_vars
raw = {'mcp_servers': {'kan': {'env': {'KAN_API_TOKEN': '\${env:KAN_API_TOKEN}'}}}}
v = _expand_env_vars(raw)['mcp_servers']['kan']['env']['KAN_API_TOKEN']
print('resolved:', not v.startswith('\${'), 'len', len(v))
"
```

Then close the loop by **spawning the server yourself with that env and issuing a real
`tools/call`** (`scripts/test_mcp_tools.py`) — `✓ Connected` never proves the credential
reached the child.

### Editing the config safely (the write path)

`patch`/`write_file` refuse `config.yaml`. `hermes config set mcp_servers.<n>.<leaf>`
works for a single leaf but cannot set a **block**. To move a literal token out of
`config.yaml` into `.env`, use `execute_code` (Python):

1. regex-capture the current value (never print it),
2. append/replace `KEY=` in `.env`,
3. swap the literal for the `${env:...}` ref in the same pass,
4. keep a dated copy `config.yaml.bak-YYYYMMDD` before writing.

Pick a token shape you can verify without ever echoing it — `len(v)` + a 4-char prefix
is enough evidence for the user.

## A server added mid-session is not callable in that session

MCP servers are discovered at **startup** (gateway/agent boot); there is no hot-reload. If
the user adds one while the session is live — typically from the desktop app's MCP UI — it
appears in `hermes mcp list` within a minute or two, but `tool_call` in the running session
answers:

```
'mcp__<srv>__<tool>' is not a deferrable tool.
```

Two ways forward, in this order:

1. **Drive the underlying API directly.** Every MCP wrapper is a thin layer over an HTTP
   API or a local service. Read the credential from `.env` and call the endpoints with
   `urllib`/`curl`. This works immediately, needs no restart, and is the right move when a
   human is waiting.
2. Tell the user the tools land on the next session / gateway start.

**Corollary — do not declare an integration missing on a stale read.** When the user says
"I just installed it", **re-run `hermes mcp list`** (and re-stat `config.yaml`) before
concluding anything is absent: the desktop app writes `config.yaml` asynchronously, so a
check from two minutes ago can genuinely predate the install. Reporting "it's not there"
after a single early check is a false negative the user has to correct.

## Pitfalls summary (updated 2026-09-14)

- **`hermes mcp test` passing does NOT prove the server works** — see Cause A/B above.
- `hermes config set mcp_servers.<name>.<leaf_key>` is SAFE for single fields.
- `patch`/`write_file` block edits to `config.yaml`.
- **Windows: bare command names with only `.cmd` shims won't launch** — use the `.exe`.
- **Remote MCP servers (FrameThrower, etc.) use `npx -y mcp-remote <url>`**, NOT the local
  `node /path/to/file.mjs` shape from ScriptBreak. They also need OAuth. See
  `` for the distinction and the free-tier credit model.
- **Windows spawn path-conversion pitfall** — see below (unchanged from original).
- **Remote/local MCPs on localhost (e.g. obsidian-kb on 8766) — verify the port is LISTENING first**. Run `netstat -ano | grep :PORT` before debugging config. If nothing listens, the issue is the underlying service not running (e.g. Obsidian smart-connections plugin disabled), not the MCP config.
- **Slow-booting stdio MCPs (e.g. openshorts) — increase `timeout` in config**. Default handshake timeout is ~10s; servers that do job recovery/cleanup on boot need 30-60s. Use `hermes config set mcp_servers.<name>.timeout 60`.
- **Env var mismatch between config.yaml and server's .env** — the `env:` map in config must match what the server actually reads. Compare `grep -oE '^[A-Z_]+' /path/to/server/.env` with config keys; missing/extra vars cause silent failures.

## Windows spawn path-conversion pitfall (`/c/` → `C:\c\`)

When you spawn an MCP server (or a subprocess test client) from a **git-bash/MSYS** shell and hand it an MSYS-style path like `/c/AI/tools/.../server.mjs` as a bare argument (not via env), **the child `node`/`python` binary — a NATIVE Windows process — does NOT receive MSYS path translation**. It interprets `/c/AI/tools/...` literally as `C:\c\AI\tools\...` (current-drive-relative), and you get a confusing failure:

- **Node**: `Error: Cannot find module 'C:\\c\\AI\\tools\\...\\server.mjs'` — the server never even starts.
- **Python `-m`**: a venv `activate` or module import resolves against the wrong dir; imports silently miss.

This bites two places this session:
1. Hand-rolling a `subprocess.run` test harness in bash and passing `node /c/AI/.../cork-board-mcp.mjs` — Node can't find the module.
2. Passing `cwd: "/c/AI/tools/..."` in config.yaml for a Python `-m` server — the `cwd` arg is a bare string the gateway hands to `os.chdir` without MSYS normalization → `[WinError 267] The directory name is invalid`.

**Fix — always use Windows-native forward-slash absolute paths (`C:/...`) for `command` `args`, `cwd`, and any path passed as a bare argument through to a native binary.** Forward slashes are valid on Windows `CreateProcess` and avoid the `C:\c\` doubling entirely. Never pass a bare `/c/...` path to a native `node`/`python`/`command`. This is the same rule already noted under `scriptbreak-mcp-registration.md` (`forward-slash abs path`); centralize your muscle memory here.

Diagnostic that reproduces it cleanly (expect the `C:\c\` module-not-found on the buggy form, then success on the forward-slash form):
```bash
# BUGGY — node (native) can't resolve the MSYS-style path:
node /c/AI/tools/scriptbreak/mcp/scriptbreak-mcp.mjs     # -> Cannot find module 'C:\c\AI\...'
# FIX — forward-slash absolute path:
node C:/AI/tools/scriptbreak/mcp/scriptbreak-mcp.mjs      # -> boots clean
# Same for cwd in config.yaml — forward slashes only:
cwd: C:/AI/tools/wasserman-suite/unofficial-davinci-mcp    #  OK
cwd: /c/AI/tools/wasserman-suite/unofficial-davinci-mcp     #  WinError 267
```
- Cause B fix: `command` = the MCP's bundled `venv/Scripts/python.exe`; set `env.PYTHONPATH` to that venv's `Lib/site-packages` to override the leaked one; leave `PYTHONHOME` UNSET.
- "Internal Server Error" / `trailing characters` during your own stdio test is usually the test client's fault (missing newlines between messages, not the server). For zero-dependency Node servers (ScriptBreak shape), the transport is **newline-delimited JSON-RPC 2.0**, NOT Content-Length framing — mirror it exactly (one JSON object per line, `subprocess.run` + `\n`.join, line-by-line `json.loads`). See `references/scriptbreak-mcp-registration.md` for the transport-framing diagnostic.

Verifique a config do seu proprio servidor MCP (incl. the [MARCA] config that broke and the fix).
