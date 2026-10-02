---
name: hermes-provider-config
description: "Configure LLM providers and API keys in Hermes Agent — add custom OpenAI-compatible endpoints (Volcengine ARK, local gateways, OpenAI), wire .env secrets without breaking existing keys, and validate keys with a live 1-token call. Use when a user pastes an API key or wants to add a model provider to Hermes."
version: 1.0.0
author: Hermes Agent (learned session)
license: MIT
platforms: [linux, macos, windows]
---

# Hermes Provider / API Key Configuration

## When to use
- User pastes an API key and says "configure it in Hermes" / "set this up".
- User wants to add a new model provider (OpenAI, Volcengine ARK, a local OpenAI-compatible gateway, etc.).
- A provider is missing from the `/model` picker but you know it exists.

## Pre-flight (read-only)
1. Locate files: `hermes config env-path` prints the `.env` path. Config is `~/.hermes/config.yaml`. **On Windows, the REAL config is `C:\Users\<user>\AppData\Local\hermes\config.yaml`** (not the MSYS home `~/.hermes/`). Always edit the AppData path — editing the wrong file silently fails because Hermes never reads it.
2. Inspect WITHOUT overwriting:
   - `sed 's/=.*//' "$ENV"` lists key NAMES only. **The `.env` is a protected credential store — `read_file` is denied; edit it only via terminal/`printf`.**
   - Check whether `OPENAI_API_KEY` is already set. **Critical:** the user's local OmniRoute/gateway often occupies `OPENAI_API_KEY` + `OPENAI_BASE_URL=http://localhost:...`. Do NOT overwrite it. Use a SEPARATE var (e.g. `OPENAI_REAL_API_KEY`) for the real provider key.
3. Check current `model:` and `providers:` sections (e.g. `grep -n -A3 '^providers:' config.yaml`). Decide whether the new provider becomes default or just available in the picker. **Default-safe: don't disrupt the user's working default** unless they ask.

## Adding a custom provider (the correct shape)
Hermes reads `providers:` as a keyed map. Each entry supports: `api` (base URL), `name`, `key_env` (env var name holding the key — preferred over hardcoding `api_key` in yaml), `default_model`, `models` (list), `context_length`. Follow the existing `ollama-launch` / `omniroute` entries already in the file.

Use `hermes config set` (keeps the rest of the file intact — do NOT hand-edit and risk a YAML parse regression):
```
hermes config set providers.<id>.api "https://<base>/v1"
hermes config set providers.<id>.name "Human Label"
hermes config set providers.<id>.key_env "<ENV_VAR_NAME>"
hermes config set providers.<id>.default_model "<model-id>"
```
Reference the secret via `key_env` so the key lives only in `.env`, never in config.yaml.

## Wiring the secret into .env
`.env` is defense-in-depth protected (read_file denied; terminal can still write). Append with printf, preserving existing lines:
```
printf 'OPENAI_REAL_API_KEY=sk-...\n' >> "$ENV"
printf 'VOLCENGINE_API_KEY=xxxx\n' >> "$ENV"
```
Always `cp` backup copies of `.env` and `config.yaml` first so a bad edit is reversible.

## VALIDATE before declaring done (this catches real failures)
`hermes config check` only checks schema — it does NOT verify the key works. Make a minimal live call (1 token) per provider. On Windows prefer `curl` (or the Hermes venv python at `hermes-agent/venv/Scripts/python.exe` with raw-string paths); the **system** python + MSYS `/c/Users/...` paths throw `FileNotFoundError`.
```
curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"hi"}],"max_tokens":1}'
```
Interpretation:
- OpenAI **401 "Incorrect API key"** → the key itself is invalid/revoked, not a config problem. Ask the user for a fresh key; don't keep debugging config.
- Volcengine **404 "InvalidEndpointOrModel.NotFound"** → model name wrong OR (for seed/deepseek models) you must use an **endpoint ID** `ep-xxxx` created in the ARK console, not the bare model name. See `references/volcengine-ark.md`.

## Free Model Selection (OpenRouter / Nous)
When configuring free models, the OpenRouter API uses `:free` suffix and specific IDs:
- **DeepSeek V4 Flash**: `deepseek/deepseek-v4-flash-0731:free` (1M ctx, 13B active)
- **Poolside Laguna S 2.1**: `poolside/laguna-s-2.1:free` (Terminal-Bench 70%, coding agent)
- **NVIDIA Nemotron 3 Ultra**: `nvidia/nemotron-3-ultra-550b-a55b:free` (55B active, 1M ctx)
- **Gemma 4 31B**: `google/gemma-4-31b-it:free` (multilingual 140+ langs, multimodal)
- **OpenRouter Free Router**: `openrouter/free` (auto-distributes across free models)
- **Nous Solar Pro 4**: `upstage/solar-pro4:free` (524K ctx, frontier-tier, $0)
- **Nous Laguna**: `poolside/laguna-s-2.1:free`, `stepfun/step-3.7-flash:free`

**Pitfall:** Model IDs without `:free` suffix are PAID. Always verify via `/models` endpoint that `pricing.completion == '0'`.

## Mixture of Agents (MoA) Configuration
MoA is a native provider — appears in `/model` as `moa` with preset names as models:
```yaml
moa:
  default_preset: my_preset
  presets:
    my_preset:
      reference_models:
        - provider: openrouter
          model: poolside/laguna-s-2.1:free
      aggregator:
        provider: nous
        model: upstage/solar-pro4:free
      fanout: user_turn  # references run 1x/turn (cheapest)
```
- **Aggregator** is the acting model (billed for the whole run). Use Nous free for zero cost.
- **References** advise once per turn by default. Use OpenRouter free models as references.
- `/moa <prompt>` runs one-shot through default preset and restores previous model.
- Credential failure on one reference does NOT abort the turn.

## Fallback Chain
`fallback_providers` is turn-scoped — each new message restores the primary. Triggers: 429 (after retries), 500/503 (after retries), 401/403 (immediate), 404 (immediate). Within a turn, fallback fires at most once. If the fallback also fails, normal error handling takes over.

## Pitfalls
- **Windows config path**: On Windows, the REAL config is `C:\Users\<user>\AppData\Local\hermes\config.yaml`, NOT `~/.herms/`. Editing the MSYS home copy silently fails — Hermes never reads it. If `hermes config check` shows defaults after your edits, you edited the wrong file. `diff` the two paths to confirm.
- Never overwrite `OPENAI_API_KEY` if it already points to a local gateway — it silently breaks the user's current working setup.
- `.env` cannot be read with read_file; edit via terminal.
- Don't hand-edit config.yaml for the providers block — use `hermes config set` to avoid YAML breakage (BOM/parse issues).
- On Windows, prefer `curl` or the Hermes venv python for live validation; system `python` + MSYS `/c/...` paths throw FileNotFoundError.
- A 200 from the `/models` LIST endpoint does NOT mean a model is callable directly — verify `pricing.completion == '0'` to confirm it's actually free.
- **Free model IDs drift** — OpenRouter adds/removes free models regularly. Always verify via `curl -H "Authorization: Bearer $KEY" https://openrouter.ai/api/v1/models | python3 -c "...filter pricing.completion==0..."` before committing to a fallback chain.

## References
- `references/volcengine-ark.md` — ARK base URL, endpoint-ID model quirk, known-working direct model IDs, validation one-liner.
