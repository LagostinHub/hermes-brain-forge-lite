#!/usr/bin/env bash
# bnf-lite-audit.sh — pre-commit gate do BNF-LITE
#
# Bloqueia commit com segredo ou path de dono. As regras vivem em
# rules/audit-rules.yaml; aqui só há I/O + matching. Nenhuma regra em código.
#
# POSIX ERE, sem \d \w \b. [[:space:]] para espaço. Cada regex de segredo carrega
# boundary (^|[^A-Za-z0-9]) para não disparar em palavra comum que contém o
# prefixo — "task-reviewer-prompt" contém "sk-".

set -u

FILES=$(git diff --cached --name-only --diff-filter=ACM | tr '\n' ' ')
[ -z "${FILES// /}" ] && exit 0

FAILED=0

check() {
  local id="$1" pattern="$2" sev="$3" msg="$4"
  local hits
  # -- antes do pattern: SEMPRE. O padrão do PEM começa com "-" e sem isso o
  # grep lê como opção e sai com erro — o gate passa em silêncio. Nunca remova.
  # O || true é deliberado: grep sem match retorna 1 e sem ele o set -e
  # abortaria o script como se fosse erro.
  hits=$(git diff --cached -U0 -- $FILES 2>/dev/null \
    | grep -aE '^\+' \
    | grep -aEv '^\+\+\+' \
    | grep -aE -- "$pattern" || true)
  if [ -n "$hits" ]; then
    echo "BLOCKED [$sev] $id — $msg" >&2
    echo "$hits" | sed 's/^/    /' | head -5 >&2
    FAILED=1
  fi
}

check secret-openai-style-key \
  '(^|[^A-Za-z0-9])sk-[A-Za-z0-9-]{10,}' critical \
  'OpenAI-style secret. O conserto NÃO é redigir: troque por placeholder e religue a injeção.'

check secret-aws-access-key \
  '(^|[^A-Za-z0-9])AKIA[A-Z0-9]{16}' critical \
  'AWS access key id.'

check secret-github-pat \
  '(^|[^A-Za-z0-9])ghp_[A-Za-z0-9]{20,}' critical \
  'GitHub classic PAT.'

check secret-github-fine-grained-pat \
  '(^|[^A-Za-z0-9])github_pat_[A-Za-z0-9_]{20,}' critical \
  'GitHub fine-grained PAT.'

check secret-slack-token \
  '(^|[^A-Za-z0-9])xox[abprs]-[A-Za-z0-9-]{10,}' critical \
  'Slack token.'

check secret-pem-private-key \
  '-----BEGIN[[:space:]][A-Z ]*PRIVATE KEY-----' critical \
  'PEM private key block.'

check path-owner-absolute \
  '(^|[^A-Za-z0-9])C:\\(AI|Users\\[a-z]+)\\' critical \
  'Path de dono hardcoded. Derive do runtime.'

if [ "$FAILED" -ne 0 ]; then
  cat >&2 <<'EOF'

Lei de sanitização (Art. 2):
  preservar > classificar > sanitizar > conectar > validar > registrar
O conserto nunca é apagar. É trocar por placeholder e religar a injeção.
EOF
  exit 1
fi
exit 0
