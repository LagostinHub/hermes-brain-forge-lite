# DaVinci Resolve MCP — verified setup & debugging

> User machine: Windows, RTX 4060 Ti 16GB, DaVinci Resolve Studio 21.0.0.48,
> Python 3.12 at `C:\Program Files\Python312\python.exe`, node v24.

## Verified working MCP block (config.yaml)

```yaml
mcp_servers:
  davinci-resolve:
    command: C:\Program Files\Python312\python.exe
    args:
      - %USERPROFILE%\AppData\Roaming\npm\node_modules\davinci-resolve-mcp\src\server.py
    env:
      RESOLVE_SCRIPT_API: C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting
      RESOLVE_SCRIPT_LIB: C:\Program Files\Blackmagic Design\DaVinci Resolve\fusionscript.dll
      PYTHONPATH: C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting\Modules
      PYTHONHOME: C:\Program Files\Python312
    enabled: true
```

Note: the npm-global `src/server.py` path (above) is preferred over the
`%LOCALAPPDATA%\davinci-resolve-mcp\src\server.py` managed copy — `install.py`
validates the former as "Connected".

## Install / validate

```bash
# from the npm-global package dir:
cd "C:/Users/<user>/AppData/Roaming/npm/node_modules/davinci-resolve-mcp"
python install.py --clients manual        # prints config + "Connected: DaVinci Resolve Studio X"
python bin/davinci-resolve-mcp.mjs doctor  # checks API path, dll, Resolve running
```

`doctor` outputs the exact config block to paste (it points at the managed-local
`src/server.py`; switch it to the npm-global path — both work once Resolve is up).

## Stdio handshake test (proves the server + Resolve connection)

This is the real proof that the MCP server works — run it with the env vars set,
message-per-line (newline separated, NOT a single line):

```bash
export RESOLVE_SCRIPT_API="C:/ProgramData/Blackmagic Design/DaVinci Resolve/Support/Developer/Scripting"
export RESOLVE_SCRIPT_LIB="C:/Program Files/Blackmagic Design/DaVinci Resolve/fusionscript.dll"
export PYTHONPATH="C:/ProgramData/Blackmagic Design/DaVinci Resolve/Support/Developer/Scripting/Modules"
export PYTHONHOME="C:/Program Files/Python312"

printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' \
  | timeout 30 "C:/Program Files/Python312/python.exe" \
      "C:/Users/<user>/AppData/Roaming/npm/node_modules/davinci-resolve-mcp/src/server.py" \
      > out.jsonl 2>/dev/null

# parse OUTSIDE the env-leaking shell (unset PYTHONHOME first, or env -i):
env -i "C:/Program Files/Python312/python.exe" -c "
import json
for l in open(r'C:/Users/<user>/AppData/Local/davinci-resolve-mcp/_test_out.jsonl'):
    try: m=json.loads(l)
    except: continue
    if m.get('id')==2 and 'result' in m:
        print('TOOLS:', len(m['result'].get('tools',[]))); break
"
```

Expected: `TOOLS: 34` and a server.log line `DaVinciResolveScript module loaded`.
A `tools/list` returning `Internal Server Error` with no traceback usually means
the JSON-RPC input was malformed (lines glued without newlines) — that's a test
harness bug, not a server bug.

## Failure modes seen

### 1. `pydantic_core` version conflict (server won't even start)
```
SystemError: The installed pydantic-core version (2.47.0) is incompatible
with the current pydantic version, which requires 2.46.4.
```
Cause: two `pydantic_core` copies in
`%APPDATA%\Python\Python312\site-packages` — files at 2.47.0, a stray
`pydantic_core-2.47.0.dist-info` alongside the 2.46.4 one.
Fix:
```bash
"C:/Program Files/Python312/python.exe" -m pip install --force-reinstall --no-deps "pydantic_core==2.46.4"
# then remove the orphan dist-info:
rm -rf "%APPDATA%/Python/Python312/site-packages/pydantic_core-2.47.0.dist-info"
```

### 2. `command: davinci-resolve-mcp` (no shell → .cmd not found)
Hermes spawns MCP with no shell, so the bare `davinci-resolve-mcp` shim (only a
`.cmd`) never resolves. Always use `python.exe` + `src/server.py`.

### 3. Block malformed as a YAML string
If `config.yaml` shows `davinci-resolve: "command: ...\nenabled: true"` (one
escaped string), the server is listed but never loads. Rewrite the block with
Python `yaml` I/O (see SKILL.md quirk section). `hermes config set` cannot emit a
structured map — don't rely on it for full blocks.

## Logs
- Hermes MCP stderr: `%LOCALAPPDATA%\hermes\logs\mcp-stderr.log` (look for
  `starting MCP server 'davinci-resolve'` and any traceback).
- Resolve MCP server log:
  `<npm-global>/davinci-resolve-mcp/logs/server.log` (shows
  `DaVinciResolveScript module loaded`, tool counts, ListToolsRequest).
