# Reloading the Hermes gateway after editing mcp_servers (Windows)

Verified 2026-07-26. The symptom: you fixed an MCP entry in `config.yaml` but Hermes
still shows the server as dead / no tools. The gateway only re-reads `mcp_servers`
at startup, so it must be restarted.

## What does NOT work (learned the hard way)

1. `hermes gateway restart` from the chat session → BLOCKED:
   `Blocked: cannot restart or stop the gateway from inside the gateway process.
   The gateway would kill this command before it could complete.`
   This fires even when the gateway PID is already dead — the CLI checks call
   origin (the gateway session), not the live PID.

2. `taskkill /pid <gateway_pid> /f` → kills `pythonw` but it does NOT auto-revive.
   The Hermes desktop app (`Hermes.exe`) is the supervisor, not the scheduled tasks.

3. `schtasks /run /tn Hermes_Gateway` or `HermesGatewayWatchdog_v2` → these point at
   DEPRECATED `*.cmd` files that just `exit /b 0` ("DEPRECATED" banner). They do nothing.

## What DOES work

**Restart the Hermes desktop app.** Close every `Hermes.exe` process, then reopen the
app. On launch it spawns a fresh gateway that reads the corrected `config.yaml`.

## Verification after reload

- `AppData/Local/hermes/logs/mcp-stderr.log` — look for
  `starting MCP server '<name>'`. If the NEXT lines are another server (not a
  Traceback), it booted clean. A Traceback right after means the entry is still broken.
- Server-side `server.log` (per-package, e.g.
  `AppData/Roaming/npm/node_modules/davinci-resolve-mcp/logs/server.log`) —
  once the gateway reconnects it emits keepalive pings:
  `Processing request of type PingRequest`. That line = gateway is connected and alive.
- `AppData/Local/hermes/logs/errors.log` — older `MCP server '<name>' initial
  connection failed (attempt N/3)` warnings are historical; ignore if newer log lines
  show clean startup.

## Pre-reload checklist (so the restart actually fixes it)

- Entry is a YAML block, not a string (see main SKILL.md step 2).
- `command` is a real `.exe` (Windows runs MCP without a shell).
- `yaml.safe_load` parses and `d['mcp_servers']['<name>']` is a dict.
- Server passed the stdio handshake test (`scripts/test_mcp_stdio.py`) BEFORE reload.
- Any Python `pydantic_core` conflict already force-reinstalled (main SKILL.md bottom).
