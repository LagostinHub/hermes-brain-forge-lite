# install-git-hook.ps1 - installs the publish gate as a git pre-commit hook (task 2.5).
#
# What it does:
#   1. Writes .git/hooks/pre-commit (POSIX sh, portable; LF endings) that runs the
#      sanitization scan over STAGED files (via audit/scan-personal-data.sh
#      --paths-file; falls back to the PS runner over the whole tree if sh is absent).
#   2. Attempts chmod +x (effective on macOS/Linux; no-op on Windows).
#   3. Verifies: syntax check + functional smoke run of the hook (clean tree => exit 0).
#
# Usage:  powershell -NoProfile -ExecutionPolicy Bypass -File audit\install-git-hook.ps1 [-Force]
# Exit codes: 0 = installed + verified, 2 = blocked (existing hook / hooksPath conflict).
# Contract: PS 5.1, 100% ASCII.

param(
    [string]$RepoRoot = "",
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

function Fail([string]$msg, [int]$code) { Write-Output ("HOOK INSTALL ERROR: " + $msg); exit $code }

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($RepoRoot -eq '') { $RepoRoot = Split-Path -Parent $scriptDir }
if (-not (Test-Path (Join-Path $RepoRoot '.git'))) { Fail "not a git repo: $RepoRoot" 2 }

# refuse to install somewhere git is not looking
$hooksPathCfg = git -C $RepoRoot config core.hooksPath
if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($hooksPathCfg)) {
    Fail ("core.hooksPath is set to '" + $hooksPathCfg + "'; the default .git/hooks hook would be ignored. Unset it or install there.") 2
}

$hooksDir = Join-Path $RepoRoot '.git\hooks'
if (-not (Test-Path $hooksDir)) { New-Item -ItemType Directory -Path $hooksDir | Out-Null }
$hookPath = Join-Path $hooksDir 'pre-commit'
if ((Test-Path $hookPath) -and -not $Force) {
    Fail "pre-commit hook already exists; re-run with -Force to replace it" 2
}

# hook body: LF-only lines, POSIX sh
$lines = @(
    '#!/bin/sh',
    '# pre-commit: personal-data sanitization gate (hermes-brain-forge audit, task 2.5).',
    '# Installed by audit/install-git-hook.ps1. Blocks the commit when the scan reports hits.',
    'root=$(git rev-parse --show-toplevel) || { echo "pre-commit: not in a git repo" >&2; exit 1; }',
    'list=$(mktemp "${TMPDIR:-/tmp}/forge-staged.XXXXXX") || exit 1',
    'trap ''rm -f "$list"'' EXIT',
    'git diff --cached --name-only --diff-filter=ACMR > "$list" || exit 1',
    'if [ ! -s "$list" ]; then exit 0; fi',
    'runner="$root/audit/scan-personal-data.sh"',
    'ps_runner="$root/audit/scan-personal-data.ps1"',
    'if [ -f "$runner" ]; then',
    '    sh "$runner" "$root" --paths-file "$list"',
    '    rc=$?',
    'elif [ -f "$ps_runner" ] && command -v powershell.exe >/dev/null 2>&1; then',
    '    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$ps_runner" -Target "$root"',
    '    rc=$?',
    'else',
    '    echo "pre-commit: no scanner runner found under audit/" >&2',
    '    exit 1',
    'fi',
    'if [ "$rc" -ne 0 ]; then',
    '    echo "pre-commit: BLOCKED by sanitization gate (fix the reported hits, or fix the data)" >&2',
    '    exit 1',
    'fi',
    'exit 0'
)
$content = [string]::Join("`n", $lines) + "`n"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($hookPath, $content, $utf8NoBom)
Write-Output ("wrote " + $hookPath)

# exec bit (matters on macOS/Linux; harmless on Windows)
$shExe = $null
$cmd = Get-Command sh -ErrorAction SilentlyContinue
if ($cmd) { $shExe = $cmd.Source }
else {
    $gitExe = (Get-Command git -ErrorAction SilentlyContinue).Source
    if ($gitExe) {
        $cand = Join-Path (Split-Path -Parent $gitExe) 'usr\bin\sh.exe'
        if (Test-Path $cand) { $shExe = $cand }
        $cand2 = Join-Path (Split-Path -Parent (Split-Path -Parent $gitExe)) 'usr\bin\sh.exe'
        if (-not $shExe -and (Test-Path $cand2)) { $shExe = $cand2 }
    }
}
if ($shExe) {
    # Git's usr/bin (chmod, mktemp, ...) is not always on PATH when sh.exe is spawned
    # directly; prepend it for the verification runs. Git itself does this for hooks.
    $shDir = Split-Path -Parent $shExe
    $oldPath = $env:PATH
    try {
        $env:PATH = "$shDir;$oldPath"
        $ErrorActionPreference = 'Continue'
        & $shExe -c "chmod +x '$hookPath'" 2>$null
        $ErrorActionPreference = 'Stop'
        & $shExe -n "$hookPath"
        if ($LASTEXITCODE -ne 0) { Fail "hook syntax check failed" 2 }
        Write-Output "syntax check: OK ($shExe)"
        # functional smoke: clean tree must pass
        & $shExe "$hookPath"
        $rc = $LASTEXITCODE
        if ($rc -eq 0) { Write-Output "smoke run: OK (clean tree passes)" }
        else { Fail "smoke run exited $rc (expected 0 on a clean tree)" 2 }
    } finally {
        $env:PATH = $oldPath
    }
} else {
    Write-Output "WARNING: sh not found; hook installed but not smoke-verified (git will use its bundled sh)"
}

Write-Output "publish gate installed: commits with sanitization hits will be blocked"
exit 0
