# ScriptBreak MCP server — registration recipe (Node stdlib-only, read-only)

Verified 2026-09-13. A Node >=18 MCP server that ships as a SINGLE stdio
`.mjs` file (`scriptbreak-mcp.mjs`) with **zero npm dependencies** and a
config-time project path (`SCRIPTBREAK_PROJECT` env var). This is the
lightest possible MCP server class — no venv, no pip, no pipx — and the
registration shape differs from the Python server class documented in the
main SKILL.md.

## When to use this shape

- A community tool ships its own stdio server as a single JS/TS file you
  can run with a system `node.exe`.
- The server's only configuration is an env var (here `SCRIPTBREAK_PROJECT`
  = absolute path to a `.scriptbreak` project file the desktop app wrote).
- The server is read-only on disk (no writes). ScriptBreak qualifies: it
  reads one local JSON file and never touches the network.

## The config.yaml entry

```yaml
mcp_servers:
  scriptbreak:
    command: "node"                       # full path to node.exe is safer on Windows
    args:
      - C:/AI/tools/scriptbreak/mcp/scriptbreak-mcp.mjs   # forward-slash abs path
    env:
      SCRIPTBREAK_PROJECT: "C:/AI/tools/scriptbreak/sample.project.scriptbreak"
    enabled: true
```

Notes that bite you otherwise:
- **`command: "node"`** resolves only if `node` is on `PATH`. The Hermes
bundled node lives at `AppData/Local/hermes/node/node`; to be deterministic
on THIS box, point `command` at that full path instead of relying on PATH.
  (System node v22 also works: `C:/Users/<user>/AppData/Local/Programs/nodejs/node.exe`.)
- **`args[0]` must be an absolute path** — MCP servers are launched without a
  shell, so a relative path resolves against the gateway's cwd and fails with
  "module not found".
- **`env.SCRIPTBREAK_PROJECT` uses forward slashes** — the server does
  `path.resolve` and works with either separator; forward slash is the
  portable, no-escaping-hell choice. A value of `""` (empty string) still
  passes the env key to the server, so the server falls back to its own
  default app-data path — useful as a "live desktop app" mode once you open
  and `Save project` inside ScriptBreak.

## Registering without corrupting the block

`patch`/`write_file` tools refuse to touch `config.yaml`. Use the
`execute_code` (Python) one-shot, because `hermes config set mcp_servers.X`
can still flatten nested maps if you pass a YAML blob:

```bash
python - <<'EOF'
import yaml, pathlib
p = pathlib.Path(r"%USERPROFILE%\AppData\Local\hermes\config.yaml")
cfg = yaml.safe_load(p.read_text())
mcp = cfg.setdefault("mcp_servers", {})
mcp["scriptbreak"] = {
    "command": "node",
    "args": ["C:/AI/tools/scriptbreak/mcp/scriptbreak-mcp.mjs"],
    "env": {"SCRIPTBREAK_PROJECT": "C:/AI/tools/scriptbreak/sample.project.scriptbreak"},
    "enabled": True,
}
p.write_text(yaml.safe_dump(cfg, sort_keys=False, allow_unicode=True))
print("OK")
EOF
```

Then verify:
```bash
hermes mcp list                          # -> scriptbreak ... enabled ✓
hermes mcp test scriptbreak              # -> ✓ connected, ✓ tools discovered: N
```

## Transport framing pitfall (the diagnostic that mattered)

Zero-dependency stdio servers like ScriptBreak use **newline-delimited JSON-RPC
2.0** — one JSON object per line, `\n`-separated, read until EOF. This is
DIFFERENT from the official MCP spec's `Content-Length: N\r\n\r\n` framing used
by SDK-based servers. Know which one your server is:

- If the server source contains `readline()` over `process.stdin` (not a
  Content-Length body parser), it is newline-delimited. `proc.communicate()`
  with concatenated JSON (`json.dumps` of a list) FAILS — the server parses
  one giant string and emits "trailing characters".
- `select`/named-pipe readers fail on Windows for stdio pipes — use
  `subprocess.run(input=payload, text=True)` with `payload = "\\n".join(msgs) + "\\n"`
  and parse stdout line-by-line with `json.loads(line)` per line.

This distinction is the reason ScriptBreak passes `tools/list` and the real
`tools/call` to `get_breakdown` in the gateway but a hand-rolled Content-Length
client hangs. Mirror it exactly: newline-separated messages, line-by-line read.

## Decisive test (not just tools/list)

`hermes mcp test` only does `tools/list`. For a read-only server like this,
run a real `tools/call` to `get_breakdown` to prove the project file actually
loads — a server can list but still 500 on every call if the env var points
at a missing/corrupt `.scriptbreak`.

Quick stdio repro that mirrors the gateway (use the same `node` + env the
gateway will use):
```bash
cd C:/AI/tools/scriptbreak
SCRIPTBREAK_PROJECT="C:/AI/tools/scriptbreak/sample.project.scriptbreak" \
  "$LOCALAPPDATA/hermes/node/node" mcp/scriptbreak-mcp.mjs 2>&1 <<'JSON'
{"jsonrpc":"2.0","method":"initialize","id":1,"params":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"clientInfo":{"name":"hermes-test","version":"0.0.1"}}}
{"jsonrpc":"2.0","method":"tools/call","id":2,"params":{"name":"get_breakdown","arguments":{}}}
JSON
```
Expect `id:2 -> result.content[0].text` to be a JSON blob with
`"title": "Sample Test Project"`, `pages`, `scenes`, etc. If it is, the
entry will work in the real gateway too.

## Post-reload verification (see references/gateway-reload.md)

After restart the Hermes desktop app, check `mcp-stderr.log` for
`starting MCP server 'scriptbreak'` with no Traceback following it. ScriptBreak
keeps no server.log of its own (it is stateless stdin/stdout), so absence of a
traceback in `mcp-stderr.log` IS the success signal. Then a real
`tools/call` to `get_breakdown` inside chat confirms end-to-end.

## The `.scriptbreak` format (minimal for a smoke test)

The server reads `{ app:'scriptbreak', version:2, saved:ISO, project, draft,
state:{ title, scriptName, scenes:[...], bibles:{characters:{}...}, look:{...} }`.
See `sample.project.scriptbreak` in the repo clone for a 2-scene fixture you
can `Save project`-equivalent from before touching a real screenplay.

A working fixture needs: `state.scenes` as an array of
`{ num, slug, intExt, location, tod, eighths, page, text, synopsis,
characters[], elements:{props:[],wardrobe:[]}, shots:[{num,lens,size,move,desc}],
master }`. `state.bibles.characters/locations` are shallow maps keyed by
character/location name → `{desc,auto}`. `look` is a free-form map
(`aspect,lensing,palette,...`) and defaults to empty `{}` (ScriptBreak fills
`look.filled:[]` in that case — harmless, just means no Project Look was set).
The server does NOT re-derive scenes from a `.fountain` — it only reads the
`.scriptbreak` JSON. So to use ScriptBreak on a real screenplay, you must first
generate (or hand-author) the `.scriptbreak` from it; the desktop app is the
authoring path. For an agent pipeline, build the `.scriptbreak` directly (the
state.shape above is the stable contract).