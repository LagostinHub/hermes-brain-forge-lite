#!/usr/bin/env python3
"""Reusable MCP stdio handshake tester.

Launches an MCP server with the given command/args/env, sends the three
minimum JSON-RPC messages (initialize, notifications/initialized, tools/list),
and prints how many tools the server exposes (or the error).

Usage:
  python test_mcp_stdio.py --server "C:/.../server.py" \
      --env RESOLVE_SCRIPT_API=... --env PYTHONPATH=... --python "C:/.../python.exe"

Each --env is KEY=VALUE. --python overrides the interpreter used to run --server.
Messages are sent newline-separated; stdout is parsed line-by-line for id:2.
"""
import argparse
import json
import subprocess
import sys
import os
import re


def _normalize_win_path(p: str) -> str:
    """Translate MSYS-style '/c/Foo/bar' -> 'C:/Foo/bar' for native Windows
    binaries. Native node/python do NOT understand '/c/...' and read it as a
    current-drive-relative 'C:\\c\\...' path. Forward slashes are safe on
    Windows CreateProcess and avoid the C:\\c\\ doubling. See
    hermes-mcp-troubleshoot SKILL.md 'Windows spawn path-conversion pitfall'.
    """
    if not p or len(p) >= 2 and p[1] == ":":
        return p.replace("\\", "/")  # already C: or /path
    m = re.match(r"^/([a-zA-Z])/(.+)$", p)
    if m:
        return f"{m.group(1).upper()}:/{m.group(2)}"
    return p.replace("\\", "/")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--python", default=sys.executable, help="interpreter to run the server")
    ap.add_argument("--server", required=True, help="path to server script (.py/.mjs/.js)")
    ap.add_argument("--arg", action="append", default=[], help="extra server args")
    ap.add_argument("--env", action="append", default=[], help="KEY=VALUE env vars")
    ap.add_argument("--timeout", type=int, default=30)
    args = ap.parse_args()

    env = dict(os.environ)
    for e in args.env:
        k, _, v = e.partition("=")
        env[k] = v

    # Normalize MSYS-style '/c/Foo' -> 'C:/Foo' so a native node/python child
    # receives a real absolute path (not 'C:\\c\\Foo'). See SKILL.md pitfall.
    server_path = _normalize_win_path(args.server)

    msgs = [
        json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize",
                    "params": {"protocolVersion": "2024-11-05", "capabilities": {},
                               "clientInfo": {"name": "test", "version": "1"}}}),
        json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}),
        json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}),
    ]
    payload = "\n".join(msgs) + "\n"

    try:
        proc = subprocess.run(
            [args.python, server_path, *args.arg],
            input=payload, capture_output=True, text=True,
            env=env, timeout=args.timeout,
        )
    except subprocess.TimeoutExpired as e:
        print("TIMEOUT after", args.timeout, "s")
        print("STDOUT so far:", (e.stdout or "")[:600])
        print("STDERR so far:", (e.stderr or "")[:600])
        return 1

    out = proc.stdout or ""
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            m = json.loads(line)
        except json.JSONDecodeError:
            continue
        if m.get("id") == 2 and "result" in m:
            tools = m["result"].get("tools", [])
            print("TOOLS RETURNED:", len(tools))
            for t in tools[:15]:
                print("  -", t.get("name"))
            if len(tools) > 15:
                print("  ... (%d more)" % (len(tools) - 15))
            return 0

    print("NO tools/list result. Server may have errored. Raw stdout head:")
    print(out[:800])
    if proc.stderr:
        print("STDERR:")
        print(proc.stderr[:800])
    return 1


if __name__ == "__main__":
    sys.exit(main())
