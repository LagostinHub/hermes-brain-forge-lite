# Volcengine ARK (Doubao) — Hermes custom provider notes

Vendor: ByteDance cloud (火山引擎). API is OpenAI-compatible.

## Base URL
```
https://ark.cn-beijing.volces.com/api/v3
```
Set as `providers.volcengine.api`. Region is in the host (`cn-beijing`); if your endpoint is in another region the host differs.

## Auth
API key goes in `.env` as `VOLCENGINE_API_KEY=<uuid>`. Reference it via `providers.volcengine.key_env: VOLCENGINE_API_KEY`. The key is a plain UUID (no `sk-` prefix).

## CRITICAL: model names vs endpoint IDs
ARK has two model-access modes:
- **Direct model IDs** — work passed straight as `model:`. Verified working on a fresh account:
  - `doubao-1-5-pro-32k-250115` ✅ (used as the default in this session)
- **Endpoint IDs (`ep-xxxx`)** — required for the *seed* and *deepseek* model families AND for any model you explicitly deploy. Passing the bare name (e.g. `doubao-seed-1-6-250615`, `deepseek-v3-241226`) returns:
  ```
  HTTP 404 {"error":{"code":"InvalidEndpointOrModel.NotFound",
    "message":"The model or endpoint X does not exist or you do not have access to it."}}
  ```
  This is NOT a bad key — the key is valid (it reaches the server). You must create an endpoint in the ARK console (模型推理 → 创建推理接入点) and use the resulting `ep-xxxx` string as the model id.

## Validation one-liner (Windows, Hermes venv python)
```python
import os,urllib.request,json
k=os.environ["VOLCENGINE_API_KEY"]   # read from .env first
req=urllib.request.Request(
  "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
  data=json.dumps({"model":"doubao-1-5-pro-32k-250115",
                   "messages":[{"role":"user","content":"reply only: OK"}],
                   "max_tokens":5}).encode(),
  headers={"Authorization":f"Bearer {k}","Content-Type":"application/json"})
print(urllib.request.urlopen(req,timeout=25).read().decode()[:200])
```
A 200 with content proves both key and model id are correct.

## Listing available models
`GET https://ark.cn-beijing.volces.com/api/v3/models` (Bearer key) returns 120+ entries. **Note:** a model appearing in this list does NOT guarantee it's callable directly — seed/deepseek families still need an `ep-xxxx` endpoint.
