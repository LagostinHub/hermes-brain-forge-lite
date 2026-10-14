# build-skeleton.ps1 - materialize vault-template/ from the live GNNSS vault (task 3.1).
# Reads the curation table (audit/zone-map.yaml) and content operations
# (audit/template-ops.yaml) as DATA; this script contains only I/O + the flat
# YAML-subset parser (same parsing approach as audit/scan-personal-data.ps1).
#
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\build-skeleton.ps1
#       [-Vault <dir>] [-Out <dir>] [-RepoRoot <dir>]
#   Defaults: -Vault $env:GNNSS_VAULT, -RepoRoot one level up from this script,
#             -Out <RepoRoot>\vault-template
#
# Contract:
#   - READ-ONLY on the vault: never writes inside it (asserted).
#   - PowerShell 5.1 compatible, 100% ASCII. Generated .md/.yaml written UTF-8 no BOM.
#   - Byte-copied notes are copied verbatim; only zone-map-marked files are
#     template-ized (Mapa.md + audit/template-ops.yaml file list).
#   - check-links.ps1 ships as the ORIGINAL byte copy from the vault (never a fork).
#   - Deterministic: same vault state + data -> byte-identical vault-template/
#     (each run wipes and rebuilds the output dir).
#
# Exit codes: 0 = built, 2 = error (usage, environment, or curation-data mismatch).

param(
    [string]$Vault = $env:GNNSS_VAULT,
    [string]$RepoRoot = "",
    [string]$Out = ""
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

function Fail([string]$msg) {
    Write-Output ("BUILD ERROR: " + $msg)
    exit 2
}

function New-Utf8NoBom {
    return New-Object System.Text.UTF8Encoding($false)
}

# Byte-exact single-file copy (used for check-links.ps1 per task 3.4 single-source rule).
function Copy-FileBytes([string]$From, [string]$To) {
    [IO.File]::WriteAllBytes($To, [IO.File]::ReadAllBytes($From))
}

# ---------------------------------------------------------------- flat YAML parser
# Parses the documented subset (see zone-map.yaml / template-ops.yaml headers).
# Returns a hashtable: top-level scalar keys + list keys (ArrayList of hashtables;
# scalar-list fields are ArrayList of strings).
function Parse-FlatYaml([string]$Path) {
    if (-not (Test-Path -LiteralPath $Path)) { Fail "data file not found: $Path" }
    $mapListKeys = @('zones', 'files', 'replace', 'shared_replace')
    $scalarListKeys = @('include_files', 'exclude', 'exclude_files', 'exclude_dirs', 'drop')
    $root = @{ }
    $section = ''          # current top-level section: zones | files | shared_replace | ''
    $curItem = $null       # current map item receiving fields
    $curScalarList = $null # current scalar ArrayList receiving '- x' items
    $curPairList = $null   # current ArrayList receiving '- from:' pair items
    foreach ($raw in [IO.File]::ReadAllLines($Path, [System.Text.Encoding]::UTF8)) {
        $line = $raw.TrimEnd()
        if ($line.Trim().Length -eq 0) { continue }
        if ($line.TrimStart().StartsWith('#')) { continue }
        if ($line -match '^([A-Za-z_][A-Za-z0-9_]*):(.*)$') {
            $key = $Matches[1]; $val = $Matches[2].Trim()
            $section = $key
            $curItem = $null; $curScalarList = $null; $curPairList = $null
            if ($val.Length -eq 0 -and $mapListKeys -contains $key) {
                $list = New-Object System.Collections.ArrayList
                $root[$key] = $list
                $curPairList = $null
                if ($key -eq 'shared_replace') { $curPairList = $list }
            } else {
                if ($val.Length -gt 0) { $root[$key] = Unquote $val }
            }
            continue
        }
        if ($line -match '^\s+([A-Za-z_][A-Za-z0-9_]*):(.*)$') {
            $key = $Matches[1]; $val = $Matches[2].Trim()
            if ($val.Length -eq 0 -and $scalarListKeys -contains $key) {
                $curScalarList = New-Object System.Collections.ArrayList
                if ($null -ne $curItem) { $curItem[$key] = $curScalarList }
            } elseif ($val.Length -eq 0 -and $key -eq 'replace') {
                $curPairList = New-Object System.Collections.ArrayList
                if ($null -ne $curItem) { $curItem[$key] = $curPairList }
                $curItem = $null; $curScalarList = $null
            } else {
                if ($null -ne $curItem) { $curItem[$key] = Unquote $val }
                $curScalarList = $null
            }
            continue
        }
        if ($line -match '^\s*-\s+([A-Za-z_][A-Za-z0-9_]*):(.*)$') {
            $k = $Matches[1]
            $newItem = @{ }
            $newItem[$k] = Unquote $Matches[2]
            if ($k -eq 'path' -and ($section -eq 'zones' -or $section -eq 'files')) {
                if (-not $root.ContainsKey($section)) { Fail "section '$section' used before declaration in $Path" }
                [void]$root[$section].Add($newItem)
                $curPairList = $null
            } elseif ($k -eq 'from' -and $null -ne $curPairList) {
                [void]$curPairList.Add($newItem)
            } else {
                Fail ("unexpected list item '" + $k + "' in " + $Path + " (section " + $section + ")")
            }
            $curItem = $newItem; $curScalarList = $null
            continue
        }
        if ($line -match '^\s*-\s*(.*)$') {
            if ($null -ne $curScalarList) { [void]$curScalarList.Add((Unquote $Matches[1])) }
            continue
        }
    }
    return $root
}

# ---------------------------------------------------------------- resolve paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($RepoRoot -eq '') { $RepoRoot = (Get-Item (Join-Path $scriptDir '..')).FullName }
if ($Out -eq '') { $Out = Join-Path $RepoRoot 'vault-template' }
if ($Vault -eq '' -or -not (Test-Path -LiteralPath $Vault -PathType Container)) {
    Fail "vault not found (set -Vault or GNNSS_VAULT env): '$Vault'"
}
$Vault = (Get-Item -LiteralPath $Vault).FullName.TrimEnd('\')
$RepoRoot = (Get-Item -LiteralPath $RepoRoot).FullName.TrimEnd('\')
$Out = $Out.TrimEnd('\')

# READ-ONLY guarantee: the output dir must never be inside the vault.
if ($Out -eq $Vault -or $Out.StartsWith($Vault + '\')) {
    Fail "output dir is inside the (read-only) vault: $Out"
}

$zoneMapPath = Join-Path $RepoRoot 'audit\zone-map.yaml'
$opsPath = Join-Path $RepoRoot 'audit\template-ops.yaml'
$zm = Parse-FlatYaml $zoneMapPath
$ops = Parse-FlatYaml $opsPath
if (-not $zm.ContainsKey('zones') -or $zm['zones'].Count -eq 0) { Fail "no zones parsed from $zoneMapPath" }
if (-not $ops.ContainsKey('files')) { Fail "no files parsed from $opsPath" }

# Shared replacement pairs (ordered, regex).
$sharedPairs = @()
if ($ops.ContainsKey('shared_replace')) { $sharedPairs = @($ops['shared_replace'] | Where-Object { $_ }) }
# File ops lookup (vault-template-relative path -> ops item).
$opsByPath = @{ }
foreach ($f in $ops['files']) { if ($f -and $f.ContainsKey('path')) { $opsByPath[$f['path']] = $f } }

# ---------------------------------------------------------------- template-ize helpers
function Apply-ReplacePairs([string]$Text, $Pairs) {
    foreach ($p in $Pairs) {
        if (-not $p -or -not $p.ContainsKey('from')) { continue }
        $to = ''
        if ($p.ContainsKey('to')) { $to = $p['to'] }
        $to = $to.Replace('\n', "`n")
        $Text = [regex]::Replace($Text, $p['from'], $to)
    }
    return $Text
}

# Template-ize one copied file: drop lines, apply per-file pairs then shared pairs.
function Convert-TemplateFile([string]$FullPath, $FileOps) {
    $text = [IO.File]::ReadAllText($FullPath)
    $text = $text.Replace("`r`n", "`n")
    $drops = $FileOps['drop']
    if ($drops -is [System.Collections.IEnumerable] -and $drops -isnot [string]) {
        foreach ($d in $drops) {
            if ([string]::IsNullOrEmpty($d)) { continue }
            $kept = New-Object System.Collections.ArrayList
            foreach ($ln in ($text -split "`n")) {
                if ($ln.IndexOf($d, [System.StringComparison]::Ordinal) -lt 0) { [void]$kept.Add($ln) }
            }
            $text = $kept -join "`n"
        }
    }
    $own = @()
    $reps = $FileOps['replace']
    if ($reps -is [System.Collections.IEnumerable] -and $reps -isnot [string]) { $own = @($reps | Where-Object { $_ }) }
    $text = Apply-ReplacePairs $text $own
    $text = Apply-ReplacePairs $text $sharedPairs
    [IO.File]::WriteAllText($FullPath, $text, (New-Utf8NoBom))
}

# ---------------------------------------------------------------- reset output
if (Test-Path -LiteralPath $Out) { Remove-Item -LiteralPath $Out -Recurse -Force }
New-Item -ItemType Directory -Force -Path $Out | Out-Null

# ---------------------------------------------------------------- zone materialization
$counts = @{ copiedZones = 0; shells = 0; whitelists = 0; packs = 0; templates = 0; skipped = 0 }

foreach ($z in $zm['zones']) {
    $rel = $z['path']
    if ([string]::IsNullOrEmpty($rel)) { continue }
    $disp = $z['disposition']
    $src = Join-Path $Vault ($rel.Replace('/', '\'))
    $dst = Join-Path $Out ($rel.Replace('/', '\'))

    if ($disp -eq 'not_present') { $counts.skipped++; continue }

    if ($disp -eq 'excluded') {
        if ($z.ContainsKey('pack') -and $z['pack']) {
            $packSrc = Join-Path $RepoRoot ($z['pack'].Replace('/', '\'))
            if (-not (Test-Path -LiteralPath $packSrc -PathType Container)) { Fail "pack dir not found: $($z['pack'])" }
            New-Item -ItemType Directory -Force -Path $dst | Out-Null
            foreach ($item in (Get-ChildItem -LiteralPath $packSrc -Force)) {
                Copy-Item -LiteralPath $item.FullName -Destination $dst -Recurse -Force
            }
            $counts.shells++; $counts.packs++
        } else {
            $counts.skipped++
        }
        continue
    }

    if ($disp -eq 'placeholder') {
        if ($z.ContainsKey('pack') -and $z['pack']) {
            # dir placeholder: ships ONLY the pack (never live content/filenames)
            if (Test-Path -LiteralPath $dst) { Remove-Item -LiteralPath $dst -Recurse -Force }
            $packSrc = Join-Path $RepoRoot ($z['pack'].Replace('/', '\'))
            if (-not (Test-Path -LiteralPath $packSrc -PathType Container)) { Fail "pack dir not found: $($z['pack'])" }
            New-Item -ItemType Directory -Force -Path $dst | Out-Null
            foreach ($item in (Get-ChildItem -LiteralPath $packSrc -Force)) {
                Copy-Item -LiteralPath $item.FullName -Destination $dst -Recurse -Force
            }
            $counts.packs++
        } else {
            # file placeholder (root MOC): template-ized copy of the live note
            if (-not (Test-Path -LiteralPath $src -PathType Leaf)) { Fail "placeholder source not found: $rel" }
            $text = [IO.File]::ReadAllText($src)
            # structural: rewrite links to excluded-zone mapas -> zone placeholder notes
            foreach ($ez in $zm['zones']) {
                if ($ez['disposition'] -ne 'excluded') { continue }
                if (-not $ez.ContainsKey('placeholder_note') -or -not $ez['placeholder_note']) { continue }
                $zpath = $ez['path']
                if ($zpath -notmatch '^\d{2}-') { continue }
                $mapaTarget = ($zpath -replace '^(\d{2})-', '$1.00-') + '-mapa'
                $text = $text.Replace(('[[' + $mapaTarget + ']]'), ('[[' + $ez['placeholder_note'] + ']]'))
            }
            [IO.File]::WriteAllText($dst, $text.Replace("`r`n", "`n"), (New-Utf8NoBom))
            # data-driven content ops (shared pairs: legend redaction etc.)
            $fops = $opsByPath[$rel]
            if ($fops) { Convert-TemplateFile $dst $fops }
            $counts.templates++
        }
        continue
    }

    if ($disp -eq 'included') {
        $copy = 'verbatim'
        if ($z.ContainsKey('copy') -and $z['copy']) { $copy = $z['copy'] }
        if ($copy -eq 'file-whitelist') {
            if (Test-Path -LiteralPath $dst) { Remove-Item -LiteralPath $dst -Recurse -Force }
            New-Item -ItemType Directory -Force -Path $dst | Out-Null
            foreach ($f in $z['include_files']) {
                $sf = Join-Path $src ($f.Replace('/', '\'))
                if (-not (Test-Path -LiteralPath $sf -PathType Leaf)) {
                    # typo guard (fix wave): a whitelisted source that does not exist in
                    # the vault is a curation-table error, never silently skippable.
                    Fail ("whitelisted include_files entry not found in vault: " + $rel + "/" + $f)
                }
                Copy-Item -LiteralPath $sf -Destination $dst -Force
            }
            $counts.whitelists++
            continue
        }
        # verbatim (skip re-copy when a parent zone already materialized this dir;
        # sub-entries exist to carry excludes/whitelists)
        if (-not (Test-Path -LiteralPath $dst)) {
            if (-not (Test-Path -LiteralPath $src -PathType Container)) { Fail "included zone not found in vault: $rel" }
            Copy-Item -LiteralPath $src -Destination $dst -Recurse -Force
            $counts.copiedZones++
        }
        if ($z.ContainsKey('exclude_dirs')) {
            foreach ($d in $z['exclude_dirs']) {
                $dd = Join-Path $dst ($d.Replace('/', '\'))
                if (Test-Path -LiteralPath $dd) { Remove-Item -LiteralPath $dd -Recurse -Force }
            }
        }
        if ($z.ContainsKey('exclude_files')) {
            foreach ($f in $z['exclude_files']) {
                $ff = Join-Path $dst ($f.Replace('/', '\'))
                if (Test-Path -LiteralPath $ff -PathType Leaf) { Remove-Item -LiteralPath $ff -Force }
            }
        }
        continue
    }

    Fail "unknown disposition '$disp' for zone $rel"
}

# ---------------------------------------------------------------- task 3.4: original check-links
$srcCheck = Join-Path $Vault '50-sistema\54-scripts\reorg\check-links.ps1'
$dstCheck = Join-Path $Out '50-sistema\54-scripts\reorg\check-links.ps1'
if (-not (Test-Path -LiteralPath $srcCheck -PathType Leaf)) { Fail "original check-links.ps1 not found in vault: $srcCheck" }
if (-not (Test-Path -LiteralPath $dstCheck -PathType Leaf)) { Fail "check-links.ps1 missing after zone copy (54-scripts excluded?)" }
Copy-FileBytes $srcCheck $dstCheck

# ---------------------------------------------------------------- shared redaction pass
# Applies shared_replace to EVERY copied text file in zones flagged `redact: shared`.
# Why a zone flag and not a file list: the redaction table (template-ops.yaml) is
# per-file, so a NEW note added to the vault with a client name in it shipped RAW
# until someone remembered to list it - measured 2026-10-10: 750 gate hits across
# 118 shipping files, most of them plain client-name/path prose the shared pairs
# already knew how to rewrite. A zone flag makes the redaction follow the ZONE, so
# new files are covered the moment they are copied.
#
# Files listed in template-ops (own ops) are SKIPPED here: they receive their own
# drop/replace pairs FIRST and the shared pairs second, in the per-file pass below.
# Applying shared pairs to them earlier would rewrite the very strings their drop
# lines match (e.g. a drop on '[[32.08-camila-2026-moc]]' after the pair
# '32\.08-camila-2026-moc\.md' -> '32.08-projeto-moc.md' has already fired).
$redactExts = @('.md', '.txt', '.sh', '.ps1', '.json', '.yml', '.yaml', '.py', '.js', '.css', '.cmd', '.csv', '.mdx', '.base')
$redactedFiles = 0
foreach ($z in $zm['zones']) {
    if ($z['disposition'] -ne 'included') { continue }
    if (-not $z.ContainsKey('redact') -or $z['redact'] -ne 'shared') { continue }
    $zdir = Join-Path $Out ($z['path'].Replace('/', '\'))
    if (-not (Test-Path -LiteralPath $zdir -PathType Container)) { continue }
    foreach ($f in (Get-ChildItem -LiteralPath $zdir -Recurse -File)) {
        if ($redactExts -notcontains $f.Extension.ToLower()) { continue }
        $relOut = $f.FullName.Substring($Out.Length + 1).Replace('\', '/')
        if ($opsByPath.ContainsKey($relOut)) { continue }
        $orig = [IO.File]::ReadAllText($f.FullName)
        $text = Apply-ReplacePairs ($orig.Replace("`r`n", "`n")) $sharedPairs
        if ($text -ne $orig) { [IO.File]::WriteAllText($f.FullName, $text, (New-Utf8NoBom)); $redactedFiles++ }
    }
}

# ---------------------------------------------------------------- template-ize listed files
foreach ($entry in $ops['files']) {
    if (-not $entry -or -not $entry.ContainsKey('path')) { continue }
    $rel = $entry['path']
    if ($rel -eq 'Mapa.md') { continue }  # handled in the placeholder branch above
    $fp = Join-Path $Out ($rel.Replace('/', '\'))
    if (-not (Test-Path -LiteralPath $fp -PathType Leaf)) { Fail "template-ops file missing in output (zone excluded?): $rel" }
    Convert-TemplateFile $fp $entry
    $counts.templates++
}

# ---------------------------------------------------------------- summary
$totalFiles = @(Get-ChildItem -LiteralPath $Out -Recurse -File).Count
$totalDirs = @(Get-ChildItem -LiteralPath $Out -Recurse -Directory).Count
Write-Output ("BUILD OK: vault-template materialized from {0}" -f $Vault)
Write-Output ("  zones copied verbatim : {0}" -f $counts.copiedZones)
Write-Output ("  file-whitelist dirs   : {0}" -f $counts.whitelists)
Write-Output ("  placeholder shells    : {0} (packs copied: {1})" -f $counts.shells, $counts.packs)
Write-Output ("  template-ized files   : {0}" -f $counts.templates)
Write-Output ("  zone-redacted files   : {0} (shared pairs, redact: shared zones)" -f $redactedFiles)
Write-Output ("  skipped (not_present/none): {0}" -f $counts.skipped)
Write-Output ("  output: {1} file(s), {2} dir(s) under {0}" -f $Out, $totalFiles, $totalDirs)
exit 0
