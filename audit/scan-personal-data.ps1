# scan-personal-data.ps1 - thin sanitization runner (Windows).
# Consumes rules as DATA from rules.yaml + personal-terms.yaml sitting next to this
# script. Contains NO rule logic: only YAML-subset parsing, file walking, matching.
#
# Usage:
#   powershell -NoProfile -File scan-personal-data.ps1 [-Target <dir>] [-NoAllowlist] [-Coverage]
#   powershell -NoProfile -File scan-personal-data.ps1 -Target <repo-root> -PathsFile <list-file>
#       (list-file: one repo-relative path per line, e.g. from `git diff --cached --name-only`)
#
# Exit codes: 0 = clean, 1 = hits found (report printed: file + rule + line),
#             2 = usage/load error.
# Contract: PowerShell 5.1 compatible, 100% ASCII. Same behavior as scan-personal-data.sh.
# Supported YAML subset is documented in rules.yaml (flat keys, 2-space lists, single quotes).

param(
    [string]$Target = ".",
    [string]$PathsFile = "",
    [switch]$NoAllowlist,
    [switch]$Coverage
)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }

# ---------------------------------------------------------------- helpers
function Unquote([string]$v) {
    $t = $v.Trim()
    if ($t.Length -ge 2 -and $t.StartsWith("'") -and $t.EndsWith("'")) {
        return $t.Substring(1, $t.Length - 2).Replace("''", "'")
    }
    return $t
}

function Fail([string]$msg, [int]$code) {
    Write-Output ("AUDIT ERROR: " + $msg)
    exit $code
}

# ---------------------------------------------------------------- locate data
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rulesPath = Join-Path $scriptDir 'rules.yaml'
if (-not (Test-Path -LiteralPath $rulesPath)) { Fail "rules.yaml not found next to runner: $rulesPath" 2 }

# ---------------------------------------------------------------- parse rules.yaml
# Returns hashtable: Rules (list), Allowlist (list), FileGlobs (list), TermsFile (string)
$state = @{
    Rules              = New-Object System.Collections.ArrayList
    Allowlist          = New-Object System.Collections.ArrayList
    Exemptions         = New-Object System.Collections.ArrayList
    FileGlobs          = @()
    TermsFile          = 'personal-terms.yaml'
    PersonalTermsScope = ''
}
$section = ''
$current = $null
foreach ($raw in [System.IO.File]::ReadAllLines($rulesPath, [System.Text.Encoding]::UTF8)) {
    $line = $raw.TrimEnd()
    if ($line.Trim().Length -eq 0) { continue }
    if ($line.TrimStart().StartsWith('#')) { continue }
    if ($line -match '^([A-Za-z_][A-Za-z0-9_]*):(.*)$') {
        $key = $Matches[1]; $val = $Matches[2].Trim()
        if ($key -eq 'rules' -or $key -eq 'allowlist' -or $key -eq 'exemptions') { $section = $key; continue }
        $section = ''
        if ($key -eq 'file_globs') { $state.FileGlobs = (Unquote $val).Split(',') | ForEach-Object { $_.Trim() } }
        elseif ($key -eq 'personal_terms_file') { $state.TermsFile = Unquote $val }
        elseif ($key -eq 'personal_terms_scope') { $state.PersonalTermsScope = Unquote $val }
        continue
    }
    if ($section -eq 'rules' -and $line -match '^\s*-\s*id:\s*(.*)$') {
        $current = @{ id = (Unquote $Matches[1]); ci = $true; severity = 'high'; message = ''; pattern = '' }
        [void]$state.Rules.Add($current)
        continue
    }
    if ($section -eq 'rules' -and $null -ne $current -and $line -match '^\s+([A-Za-z_]+):\s*(.*)$') {
        $field = $Matches[1]; $fval = Unquote $Matches[2]
        if ($field -eq 'ci') { $current.ci = ($fval -eq 'true') }
        else { $current[$field] = $fval }
        continue
    }
    if ($section -eq 'allowlist' -and $line -match '^\s*-\s*(.*)$') {
        [void]$state.Allowlist.Add((Unquote $Matches[1]))
        continue
    }
    if ($section -eq 'exemptions' -and $line -match '^\s*-\s*(.*)$') {
        [void]$state.Exemptions.Add((Unquote $Matches[1]))
        continue
    }
}
if ($state.Rules.Count -eq 0) { Fail "no rules parsed from rules.yaml" 2 }

# ---------------------------------------------------------------- parse personal terms
$termsPath = Join-Path $scriptDir $state.TermsFile
$terms = New-Object System.Collections.ArrayList
if (Test-Path -LiteralPath $termsPath) {
    foreach ($raw in [System.IO.File]::ReadAllLines($termsPath, [System.Text.Encoding]::UTF8)) {
        $line = $raw.Trim()
        if ($line.Length -eq 0 -or $line.StartsWith('#')) { continue }
        if ($line -match '^-\s*(.*)$') {
            $term = Unquote $Matches[1]
            if ($term.Length -gt 0) { [void]$terms.Add($term) }
        }
    }
}
else { Fail "personal terms file not found: $termsPath" 2 }

# ---------------------------------------------------------------- compile effective rules
# File rules use their pattern as-is; each personal term becomes an effective rule:
#   pure [A-Za-z0-9] term  -> word-boundary pattern, case-insensitive
#   any other term         -> escaped substring pattern, case-insensitive
# POSIX->.NET normalization: [[:space:]] becomes \s (see rules.yaml portability contract).
function Convert-Pattern([string]$p) {
    return $p.Replace('[[:space:]]', '\s')
}

# Per-rule scope (forge-hardening 1.1): comma-separated path globs or empty = everywhere.
function Split-Scope([string]$s) {
    if ([string]::IsNullOrEmpty($s)) { return @() }
    return @($s.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_.Length -gt 0 })
}
$ciOpt = [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
$compiled = New-Object System.Collections.ArrayList
foreach ($r in $state.Rules) {
    if ([string]::IsNullOrEmpty($r.pattern)) { Fail "rule has no pattern: $($r.id)" 2 }
    $pat = Convert-Pattern $r.pattern
    $opts = [System.Text.RegularExpressions.RegexOptions]::None
    if ($r.ci) { $opts = $ciOpt }
    try {
        $rx = New-Object System.Text.RegularExpressions.Regex($pat, $opts)
    } catch {
        Fail ("cannot compile pattern for rule '" + $r.id + "': " + $_.Exception.Message) 2
    }
    [void]$compiled.Add(@{ Id = $r.id; Rx = $rx; Severity = $r.severity; Message = $r.message; Scope = (Split-Scope $r.scope) })
}
foreach ($t in $terms) {
    if ($t -match '^[A-Za-z0-9]+$') {
        $pat = '(^|[^A-Za-z0-9])' + [regex]::Escape($t) + '([^A-Za-z0-9]|$)'
    } else {
        $pat = [regex]::Escape($t)
    }
    try {
        $rx = New-Object System.Text.RegularExpressions.Regex($pat, $ciOpt)
    } catch {
        Fail ("cannot compile pattern for term '" + $t + "': " + $_.Exception.Message) 2
    }
    [void]$compiled.Add(@{ Id = 'personal-term:' + $t; Rx = $rx; Severity = 'high'; Message = ('Personal/client term ''' + $t + ''''); Scope = (Split-Scope $state.PersonalTermsScope) })
}

# Line-level exemptions (placeholder shapes): a line matching any of these is skipped.
$exemptions = New-Object System.Collections.ArrayList
foreach ($ex in $state.Exemptions) {
    if ([string]::IsNullOrEmpty($ex)) { continue }
    try {
        $rx = New-Object System.Text.RegularExpressions.Regex((Convert-Pattern $ex), $ciOpt)
    } catch {
        Fail ("cannot compile exemption '" + $ex + "': " + $_.Exception.Message) 2
    }
    [void]$exemptions.Add($rx)
}

# ---------------------------------------------------------------- resolve target
$root = (Resolve-Path -LiteralPath $Target).Path
if (-not (Test-Path -LiteralPath $root -PathType Container)) { Fail "target is not a directory: $root" 2 }
if (-not $root.EndsWith('\')) { $root = $root + '\' }
$rootLen = $root.Length

# allowed extensions from file_globs (*.ext only, by contract)
$exts = New-Object System.Collections.ArrayList
foreach ($g in $state.FileGlobs) {
    if ($g -like '*.*' -and $g.StartsWith('*.') -and -not $g.Contains('/')) { [void]$exts.Add($g.Substring(1)) }
}
if ($exts.Count -eq 0) { Fail "no usable file_globs in rules.yaml" 2 }

# glob matcher shared by the allowlist and per-rule scopes (forge-hardening 1.2):
# exact path or "dir/**" prefix, relative to the scan target, forward slashes.
function Test-PathGlobs([string]$rel, $globs) {
    foreach ($p in $globs) {
        if ($p.EndsWith('/**')) {
            $prefix = $p.Substring(0, $p.Length - 3)
            if ($rel -eq $prefix -or $rel.StartsWith($prefix + '/')) { return $true }
        } elseif ($rel -eq $p) {
            return $true
        }
    }
    return $false
}

# allowlist matcher: exact path or "dir/**" prefix
function IsAllowed([string]$rel) {
    return (Test-PathGlobs $rel $state.Allowlist)
}

# ---------------------------------------------------------------- scan
$hits = 0
$hitFiles = 0
$fired = @{}
$eligible = @{}
$report = New-Object System.Collections.ArrayList
$utf8 = New-Object System.Text.UTF8Encoding($false)

# Build the scan list: either explicit repo-relative paths (PathsFile mode, e.g. from
# `git diff --cached --name-only`) or a recursive walk of the target.
$scanItems = New-Object System.Collections.ArrayList
if ($PathsFile -ne '') {
    if (-not (Test-Path -LiteralPath $PathsFile)) { Fail "paths file not found: $PathsFile" 2 }
    foreach ($ln in [System.IO.File]::ReadAllLines($PathsFile)) {
        $rel = $ln.Trim()
        if ($rel.Length -eq 0) { continue }
        $full = Join-Path $root ($rel.Replace('/', '\'))
        if (-not (Test-Path -LiteralPath $full -PathType Leaf)) { continue }
        [void]$scanItems.Add(@{ Full = $full; Rel = $rel })
    }
} else {
    $files = [System.IO.Directory]::EnumerateFiles($root, '*', [System.IO.SearchOption]::AllDirectories)
    foreach ($f in $files) {
        $rel = $f.Substring($rootLen).Replace('\', '/')
        [void]$scanItems.Add(@{ Full = $f; Rel = $rel })
    }
}

$scanned = 0
foreach ($item in $scanItems) {
    $rel = $item.Rel
    $f = $item.Full
    if ($rel -like '.git/*' -or $rel -like '*/.git/*') { continue }
    $ext = [System.IO.Path]::GetExtension($f).ToLowerInvariant()
    if (-not $exts.Contains($ext)) { continue }
    if (-not $NoAllowlist -and (IsAllowed $rel)) { continue }
    $scanned++
    # per-rule scope (forge-hardening 1.2): a rule with scope globs only applies to
    # paths matching them; rules skipped here never count as fired.
    $fileRules = New-Object System.Collections.ArrayList
    foreach ($cr in $compiled) {
        if ($cr.Scope.Count -eq 0 -or (Test-PathGlobs $rel $cr.Scope)) {
            [void]$fileRules.Add($cr)
            $eligible[$cr.Id] = $true
        }
    }
    $fileHit = $false
    $lines = [System.IO.File]::ReadAllLines($f, $utf8)
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $text = $lines[$i]
        if ($text.Length -eq 0) { continue }
        $exempt = $false
        foreach ($ex in $exemptions) {
            if ($ex.IsMatch($text)) { $exempt = $true; break }
        }
        if ($exempt) { continue }
        foreach ($cr in $fileRules) {
            if ($cr.Rx.IsMatch($text)) {
                $hits++
                $fileHit = $true
                $fired[$cr.Id] = $true
                [void]$report.Add(("[HIT] {0}:{1} [{2}] ({3}) {4}" -f $rel, ($i + 1), $cr.Id, $cr.Severity, $cr.Message))
            }
        }
    }
    if ($fileHit) { $hitFiles++ }
}

foreach ($r in $report) { Write-Output $r }

# ---------------------------------------------------------------- summary
# Rules skipped by scope (never eligible on any scanned file) do not count as
# fired and are excluded from the denominator (forge-hardening 1.2).
$ruleCount = $eligible.Count
$scopeSkipped = $compiled.Count - $ruleCount
$firedCount = 0
foreach ($id in $fired.Keys) { if ($eligible.ContainsKey($id)) { $firedCount++ } }
Write-Output ("SUMMARY: {0} hit(s) in {1} file(s); scanned {2} file(s); rules fired {3}/{4}" -f $hits, $hitFiles, $scanned, $firedCount, $ruleCount)
if ($scopeSkipped -gt 0) {
    Write-Output ("SCOPE: {0} rule(s) inactive on this target (per-rule scope, rules.yaml)" -f $scopeSkipped)
}
if ($Coverage) {
    if ($scopeSkipped -gt 0) {
        Write-Output ("SCOPE-INERT: {0} rule(s) out of scope for this target:" -f $scopeSkipped)
        foreach ($cr in $compiled) { if (-not $eligible.ContainsKey($cr.Id)) { Write-Output ("  - " + $cr.Id) } }
    }
    $unfired = New-Object System.Collections.ArrayList
    foreach ($cr in $compiled) { if ($eligible.ContainsKey($cr.Id) -and -not $fired.ContainsKey($cr.Id)) { [void]$unfired.Add($cr.Id) } }
    if ($unfired.Count -gt 0) {
        Write-Output ("COVERAGE GAP: {0} rule(s) with zero hits:" -f $unfired.Count)
        foreach ($u in $unfired) { Write-Output ("  - " + $u) }
    } else {
        Write-Output "COVERAGE: every eligible rule fired at least once"
    }
}

if ($hits -gt 0) { exit 1 }
exit 0
