#!/bin/sh
# scan-personal-data.sh - thin sanitization runner (POSIX sh / bash 3.2).
# Consumes rules as DATA from rules.yaml + personal-terms.yaml sitting next to this
# script. Contains NO rule logic: only YAML-subset parsing, file walking, matching.
#
# Usage:
#   sh scan-personal-data.sh [target-dir] [--no-allowlist] [--coverage]
#   sh scan-personal-data.sh <repo-root> --paths-file <list-file> [--no-allowlist]
#       (list-file: one repo-relative path per line, e.g. from `git diff --cached --name-only`)
#
# Exit codes: 0 = clean, 1 = hits found (report printed: file + rule + line),
#             2 = usage/load error.
# Contract: 100% ASCII source. Same behavior as scan-personal-data.ps1 (PS 5.1).
# Supported YAML subset is documented in rules.yaml (flat keys, 2-space lists, single quotes).
# Pattern dialect: POSIX ERE. The PS runner translates [[:space:]] to \s; write patterns
# POSIX-first. Matching is byte-based (LC_ALL=C): case folding of non-ASCII terms
# (e.g. accented) is a documented platform delta vs the .NET runner (Unicode folding).

set -u
LC_ALL=C
export LC_ALL

fail() { printf 'AUDIT ERROR: %s\n' "$1"; exit 2; }

script_dir=$(cd "$(dirname "$0")" && pwd) || fail "cannot resolve script dir"
rules_file="$script_dir/rules.yaml"
[ -f "$rules_file" ] || fail "rules.yaml not found next to runner: $rules_file"

target=""
pathsfile=""
noallow=0
coverage=0
prev=""
for arg in "$@"; do
    if [ "$prev" = "--paths-file" ]; then pathsfile="$arg"; prev=""; continue; fi
    case "$arg" in
        --no-allowlist) noallow=1 ;;
        --coverage) coverage=1 ;;
        --paths-file) prev="$arg" ;;
        -*) fail "unknown option: $arg" ;;
        *) if [ -z "$target" ]; then target="$arg"; else fail "unexpected argument: $arg"; fi ;;
    esac
done
[ -z "$target" ] && target="."
[ -z "$prev" ] || fail "--paths-file requires a value"

tmp=$(mktemp -d) || fail "mktemp failed"
trap 'rm -rf "$tmp"' EXIT

rules_tsv="$tmp/rules.tsv"
allow_txt="$tmp/allow.txt"
exempts_txt="$tmp/exempts.txt"
exts_txt="$tmp/exts.txt"
fired_txt="$tmp/fired.txt"
eligible_txt="$tmp/eligible.txt"
: > "$rules_tsv"; : > "$allow_txt"; : > "$exempts_txt"; : > "$exts_txt"; : > "$fired_txt"; : > "$eligible_txt"

# ---------------------------------------------------------------- parse rules.yaml
awk -v exts="$exts_txt" -v allow="$allow_txt" -v exempts="$exempts_txt" -v out="$rules_tsv" '
function tr(s) { gsub(/^[ \t]+/, "", s); gsub(/[ \t]+$/, "", s); return s }
function unq(s, r) {
    r = tr(s)
    if (length(r) >= 2 && substr(r, 1, 1) == "\x27" && substr(r, length(r), 1) == "\x27") {
        r = substr(r, 2, length(r) - 2); gsub(/\x27\x27/, "\x27", r)
    }
    return r
}
function emit_rule(id, pat, ci, sev, msg, scope) {
    printf "regex\t%s\t%s\t%s\t%s\t%s\t%s\n", id, pat, ci, sev, msg, scope >> out
}
BEGIN { section = ""; id = ""; pat = ""; ci = 1; sev = "high"; msg = ""; scope = "" }
{
    line = $0; sub(/\r$/, "", line)
    if (line ~ /^[ \t]*$/ || line ~ /^[ \t]*#/) next
    if (line !~ /^[ \t]/) {
        # top-level key
        key = line; sub(/:.*$/, "", key)
        val = line; sub(/^[^:]*:[ \t]*/, "", val)
        if (key == "rules" || key == "allowlist" || key == "exemptions") { section = key; next }
        section = ""
        if (key == "file_globs") {
            v = unq(val); n = split(v, parts, ",")
            for (i = 1; i <= n; i++) {
                e = tr(parts[i]); if (e == "") continue
                sub(/^\*\./, "", e); print "." e >> exts
            }
        }
        next
    }
    if (section == "rules" && line ~ /^[ \t]*-[ \t]*id:/) {
        if (id != "" && pat != "") emit_rule(id, pat, ci, sev, msg, scope)
        sub(/^[ \t]*-[ \t]*id:[ \t]*/, "", line)
        id = unq(line)
        pat = ""; ci = 1; sev = "high"; msg = ""; scope = ""
        next
    }
    if (section == "rules" && id != "" && line ~ /^[ \t]+[A-Za-z_]+:/) {
        k = line; sub(/:.*$/, "", k); gsub(/^[ \t]+/, "", k)
        v = line; sub(/^[ \t]+[A-Za-z_]+:[ \t]*/, "", v); v = unq(v)
        if (k == "pattern") pat = v
        else if (k == "ci") ci = (v == "true") ? 1 : 0
        else if (k == "severity") sev = v
        else if (k == "message") msg = v
        else if (k == "scope") scope = v
        next
    }
    if (section == "allowlist" && line ~ /^[ \t]*-[ \t]*/) {
        v = line; sub(/^[ \t]*-[ \t]*/, "", v); print unq(v) >> allow
        next
    }
    if (section == "exemptions" && line ~ /^[ \t]*-[ \t]*/) {
        v = line; sub(/^[ \t]*-[ \t]*/, "", v); print unq(v) >> exempts
        next
    }
}
END { if (id != "" && pat != "") emit_rule(id, pat, ci, sev, msg, scope) }
' "$rules_file" || fail "failed parsing rules.yaml"

[ -s "$rules_tsv" ] || fail "no rules parsed from rules.yaml"
[ -s "$exts_txt" ] || fail "no usable file_globs in rules.yaml"

# ---------------------------------------------------------------- parse personal terms
terms_file="$script_dir/$(awk '
    { line = $0; sub(/\r$/, "", line)
      if (line ~ /^[ \t]*#/ || line ~ /^[ \t]*$/) next
      if (line ~ /^personal_terms_file:/) {
          v = line; sub(/^personal_terms_file:[ \t]*/, "", v)
          gsub(/\x27/, "", v); print v; exit }
    }' "$rules_file")"
[ -n "$terms_file" ] || terms_file="$script_dir/personal-terms.yaml"
[ -f "$terms_file" ] || fail "personal terms file not found: $terms_file"

# personal_terms_scope (forge-hardening 1.1): applied to every personal-term rule
pscope=$(awk '
    { line = $0; sub(/\r$/, "", line)
      if (line ~ /^[ \t]*#/ || line ~ /^[ \t]*$/) next
      if (line ~ /^personal_terms_scope:/) {
          v = line; sub(/^personal_terms_scope:[ \t]*/, "", v)
          gsub(/\x27/, "", v); print v; exit }
    }' "$rules_file")

awk -v out="$rules_tsv" -v pscope="$pscope" '
function tr(s) { gsub(/^[ \t]+/, "", s); gsub(/[ \t]+$/, "", s); return s }
function unq(s, r) {
    r = tr(s)
    if (length(r) >= 2 && substr(r, 1, 1) == "\x27" && substr(r, length(r), 1) == "\x27") {
        r = substr(r, 2, length(r) - 2); gsub(/\x27\x27/, "\x27", r)
    }
    return r
}
{
    line = $0; sub(/\r$/, "", line)
    if (line ~ /^[ \t]*#/ || line ~ /^[ \t]*$/) next
    if (line ~ /^[ \t]*-[ \t]*/) {
        v = line; sub(/^[ \t]*-[ \t]*/, "", v); t = unq(v)
        if (t == "") next
        if (t ~ /[^A-Za-z0-9]/) {
            printf "fixed\tpersonal-term:%s\t%s\t1\thigh\tPersonal/client term \x27%s\x27\t%s\n", t, t, t, pscope >> out
        } else {
            pat = "(^|[^A-Za-z0-9])" t "([^A-Za-z0-9]|$)"
            printf "regex\tpersonal-term:%s\t%s\t1\thigh\tPersonal/client term \x27%s\x27\t%s\n", t, pat, t, pscope >> out
        }
    }
}' "$terms_file" || fail "failed parsing personal terms"

# ---------------------------------------------------------------- cd into target
[ -d "$target" ] || fail "target is not a directory: $target"
# Resolve to an absolute path BEFORE cd: relative paths break the repo-relative
# path matching in scan_one (rel="$1" must match allowlist/scope entries which
# are repo-relative). cd first then $PWD would work, but resolving upfront is
# clearer and avoids MSYS path mangling surprises.
case "$target" in
    /*|[A-Za-z]:/*) ;;
    *) target="$(pwd)/$target" ;;
esac
cd "$target" || fail "cannot cd into target: $target"

# ---------------------------------------------------------------- scan one file
# Sets: scanned, hitfiles, hits (globals). Arg: repo-relative path (forward slashes).
scan_one() {
    rel="$1"
    case "$rel" in
        .git/*|*/.git/*) return 0 ;;
    esac
    ext=".${rel##*.}"
    grep -Fxq -e "$ext" "$exts_txt" || return 0
    if [ "$noallow" -eq 0 ]; then
        skip=0
        while IFS= read -r p; do
            [ -z "$p" ] && continue
            case "$p" in
                *"/**")
                    prefix=${p%/**}
                    case "$rel" in
                        "$prefix"/*|"$prefix") skip=1; break ;;
                    esac
                    ;;
                *)
                    case "$rel" in
                        "$p") skip=1; break ;;
                    esac
                    ;;
            esac
        done < "$allow_txt"
        [ "$skip" -eq 1 ] && return 0
    fi
    scanned=$((scanned + 1))
    filehit=0
    while IFS="$(printf '\t')" read -r rtype rid rpat rci rsev rmsg rscope; do
        [ -z "${rtype:-}" ] && continue
        [ -z "$rpat" ] && continue
        # per-rule scope (forge-hardening 1.2): a rule with scope globs only applies
        # to paths matching them; skipped rules never count as fired.
        scopeok=1
        if [ -n "${rscope:-}" ]; then
            scopeok=0
            rest="$rscope"
            while [ -n "$rest" ]; do
                g=${rest%%,*}
                if [ "$g" = "$rest" ]; then rest=""; else rest=${rest#*,}; fi
                if [ -n "$g" ]; then
                    case "$g" in
                        *"/**")
                            sprefix=${g%/**}
                            case "$rel" in
                                "$sprefix"/*|"$sprefix") scopeok=1 ;;
                            esac
                            ;;
                        *)
                            case "$rel" in
                                "$g") scopeok=1 ;;
                            esac
                            ;;
                    esac
                fi
                [ "$scopeok" -eq 1 ] && break
            done
        fi
        if [ "$scopeok" -eq 0 ]; then continue; fi
        printf '%s\n' "$rid" >> "$eligible_txt"
        gflags="-n"
        [ "$rci" = "1" ] && gflags="$gflags -i"
        if [ "$rtype" = "fixed" ]; then gflags="$gflags -F"; else gflags="$gflags -E"; fi
        grep $gflags -e "$rpat" "$rel" > "$tmp/m" 2>/dev/null
        if [ -s "$tmp/m" ]; then
            while IFS= read -r m; do
                num=${m%%:*}
                content=${m#*:}
                exempt=0
                while IFS= read -r ex; do
                    [ -z "$ex" ] && continue
                    if printf '%s' "$content" | grep -qiE -e "$ex"; then exempt=1; break; fi
                done < "$exempts_txt"
                [ "$exempt" -eq 1 ] && continue
                printf '[HIT] %s:%s [%s] (%s) %s\n' "$rel" "$num" "$rid" "$rsev" "$rmsg"
                printf '%s\n' "$rid" >> "$fired_txt"
                hits=$((hits + 1))
                filehit=1
            done < "$tmp/m"
        fi
    done < "$rules_tsv"
    [ "$filehit" -eq 1 ] && hitfiles=$((hitfiles + 1))
    return 0
}

# ---------------------------------------------------------------- run
hits=0
hitfiles=0
scanned=0

# Validate ALL patterns once before scanning any file. A pattern with an invalid
# ERE escape (e.g. from a YAML `\\` that POSIX grep cannot parse) makes grep abort
# mid-scan, silently returning no matches — a false negative that lets leaks ship.
# The PS1 runner catches this at compile time (exit 2); the bash runner must too.
while IFS="$(printf '\t')" read -r rtype rid rpat rci rsev rmsg rscope; do
    [ -z "${rtype:-}" ] && continue
    [ -z "$rpat" ] && continue
    gflags="-n"
    [ "$rci" = "1" ] && gflags="$gflags -i"
    if [ "$rtype" = "fixed" ]; then gflags="$gflags -F"; else gflags="$gflags -E"; fi
    # Validate with plain `grep -E` regardless of rule type. The goal is only
    # to detect unparseable patterns before scanning real files; using -E for
    # all avoids a MSYS grep -F SIGABRT bug on fixed strings like 'ney-leprevost'.
    set +e
    grep -E -e "$rpat" /dev/null >/dev/null 2>&1
    vrc=$?
    set -e
    if [ "$vrc" -gt 1 ]; then
        fail "invalid pattern for rule '$rid': '$rpat' (grep rc=$vrc)"
    fi
done < "$rules_tsv"

if [ -n "$pathsfile" ]; then
    [ -f "$pathsfile" ] || fail "paths file not found: $pathsfile"
    while IFS= read -r rel; do
        rel=${rel%"$(printf '\r')"}
        [ -z "$rel" ] && continue
        [ -f "$rel" ] || continue
        scan_one "$rel"
    done < "$pathsfile"
else
    files_list="$tmp/files.txt"
    find . -type f | sort > "$files_list" || fail "find failed"
    while IFS= read -r f; do
        rel=${f#./}
        scan_one "$rel"
    done < "$files_list"
fi

# ---------------------------------------------------------------- summary
# Rules skipped by scope (never eligible on any scanned file) do not count as
# fired and are excluded from the denominator (forge-hardening 1.2).
total=$(wc -l < "$rules_tsv" | tr -d ' ')
eligible=$(sort -u "$eligible_txt" | grep -c . || true)
firedn=$(sort -u "$fired_txt" | grep -c . || true)
skipped=$((total - eligible))
printf 'SUMMARY: %s hit(s) in %s file(s); scanned %s file(s); rules fired %s/%s\n' \
    "$hits" "$hitfiles" "$scanned" "$firedn" "$eligible"
if [ "$skipped" -gt 0 ]; then
    printf 'SCOPE: %s rule(s) inactive on this target (per-rule scope, rules.yaml)\n' "$skipped"
fi
if [ "$coverage" -eq 1 ]; then
    sort -u "$eligible_txt" > "$tmp/elig_sorted.txt"
    if [ "$skipped" -gt 0 ]; then
        printf 'SCOPE-INERT: %s rule(s) out of scope for this target:\n' "$skipped"
        awk -F '\t' -v e="$tmp/elig_sorted.txt" '
            BEGIN { while ((getline line < e) > 0) elig[$1] = 1 }
            { if (!(($2) in elig)) print "  - " $2 }' "$rules_tsv"
    fi
    sort -u "$fired_txt" > "$tmp/fired_sorted.txt"
    gap=$(awk -F '\t' -v f="$tmp/fired_sorted.txt" -v e="$tmp/elig_sorted.txt" '
        BEGIN { while ((getline line < f) > 0) fired[line] = 1
                while ((getline line < e) > 0) elig[line] = 1 }
        { if ((($2) in elig) && !(($2) in fired)) { print "  - " $2; n++ } }
        END { if (n > 0) exit 0; print "NONE"; exit 0 }' "$rules_tsv")
    if [ "$gap" = "NONE" ]; then
        printf 'COVERAGE: every eligible rule fired at least once\n'
    else
        printf 'COVERAGE GAP: rules with zero hits:\n%s\n' "$gap"
    fi
fi

if [ "$hits" -gt 0 ]; then exit 1; fi
exit 0
