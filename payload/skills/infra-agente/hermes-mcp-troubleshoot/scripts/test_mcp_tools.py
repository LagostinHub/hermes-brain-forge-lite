#!/usr/bin/env python3
"""Reusable MCP stdio client: list AND call tools, without the Hermes gateway.

Use this to exercise a real MCP server (e.g. davinci-resolve) when the gateway
hasn't reloaded, or to verify a specific `tools/call` works before wiring it
into a skill. Sends initialize + initialized, then tools/list and/or tools/call,
parses stdout line-by-line.

Usage:
  # list tools
  python test_mcp_tools.py --server "C:/.../server.py" \
      --python "C:/.../python.exe" \
      --env RESOLVE_SCRIPT_API=... --env PYTHONPATH=... --list

  # call a tool (the DECISIVE test — proves the server reaches the backend)
  python test_mcp_tools.py --server "C:/.../server.py" \
      --python "C:/.../venv/Scripts/python.exe" \
      --env PYTHONPATH="C:/.../venv/Lib/site-packages" \
      --call timeline --arg '{"action":"get_current"}'

  # call several tools in one run (ordered)
  python test_mcp_tools.py ... --call timeline --arg '{"action":"get_current"}' \
                                --call project_manager --arg '{"action":"get_current"}'

CRITICAL — this test is what distinguishes a server that BOOTS from one that
actually WORKS in runtime. `hermes mcp test` (list only) can pass while the
server dies on every real call due to an env leak (e.g. Hermes gateway PYTHONPATH
bleeding a py3.11 pydantic_core into a py3.12 server). If you only ever see
`tools/list` succeed, you have NOT proven the server is usable. Always `--call`
at least one real tool that touches the backend.

Notes:
- Each --call needs a following --arg (JSON string). Pair them in order.
- The SERVER subprocess gets the --env vars (PYTHONPATH etc). The PARSER itself
  must run WITHOUT PYTHONHOME set in the inherited env (triggers 'SRE module
  mismatch'); pass env vars only to the server subprocess.
- argv passed to the server is ONLY the server script path — the --arg JSONs are
  sent over the JSON-RPC protocol, never as command-line args.
"""
import argparse
import json
import subprocess
import sys
import os
import time


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--python", default=sys.executable)
    ap.add_argument("--server", required=True)
    ap.add_argument("--arg", action="append", default=[])
    ap.add_argument("--env", action="append", default=[], help="KEY=VALUE")
    ap.add_argument("--list", action="store_true", help="list tools then exit")
    ap.add_argument("--call", action="append", default=[], help="tool name")
    ap.add_argument("--timeout", type=int, default=40)
    args = ap.parse_args()

    env = dict(os.environ)
    for e in args.env:
        k, _, v = e.partition("=")
        env[k] = v

    calls = []
    if args.list:
        calls.append(("__list__", {}))
    for name, a in zip(args.call, args.arg):
        try:
            calls.append((name, json.loads(a)))
        except json.JSONDecodeError as ex:
            print("BAD --arg JSON for", name, ":", ex)
            return 1

    # server argv = python + server script ONLY (the --arg JSONs go over the wire)
    proc = subprocess.Popen(
        [args.python, args.server],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL, text=True, bufsize=1, env=env,
    )

    def send(o):
        proc.stdin.write(json.dumps(o) + "\n")
        proc.stdin.flush()

    send({"jsonrpc": "2.0", "id": 1, "method": "initialize",
          "params": {"protocolVersion": "2024-11-05", "capabilities": {},
                     "clientInfo": {"name": "test", "version": "1"}}})
    send({"jsonrpc": "2.0", "method": "notifications/initialized"})
    time.sleep(1)
    results = {}
    next_id = 10
    for name, params in calls:
        if name == "__list__":
            send({"jsonrpc": "2.0", "id": next_id, "method": "tools/list", "params": {}})
        else:
            send({"jsonrpc": "2.0", "id": next_id, "method": "tools/call",
                  "params": {"name": name, "arguments": params}})
        next_id += 1
    time.sleep(3)

    def read_msg():
        while True:
            line = proc.stdout.readline()
            if not line:
                return None
            line = line.strip()
            if not line:
                continue
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                continue

    seen = {}
    for _ in range(60):
        m = read_msg()
        if m is None:
            break
        iid = m.get("id")
        if iid is not None and iid >= 10:
            seen[iid] = m

    # map id back to call index
    for idx, (name, _) in enumerate(calls):
        iid = 10 + idx
        m = seen.get(iid, {})
        res = m.get("result", {})
        txt = res.get("content", [{}]) if isinstance(res, dict) else []
        body = txt[0].get("text", "") if txt else ""
        err = res.get("error", {}) if isinstance(res, dict) else {}
        print("===", name, "===")
        if body:
            print(body[:3000])
        else:
            print("ERROR:", json.dumps(err)[:600])
    proc.terminate()
    return 0


if __name__ == "__main__":
    sys.exit(main())
