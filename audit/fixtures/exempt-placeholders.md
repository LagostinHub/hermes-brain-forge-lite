# Fixture: placeholder / doc-example shapes that must NOT report (forge-hardening 1.3)
# Every line below is a verified documentation-example shape (evidence: the Onda 3
# B-review of vendored security docs + the forge-hardening -NoAllowlist measurement
# over skills/). Scanning THIS file with -NoAllowlist must exit 0 with zero hits:
# that proves every exemption in rules.yaml is load-bearing and safe (exemptions
# only silence shapes a real credential never takes).

- AWS docs example key id: AKIAIOSFODNN7EXAMPLE
- MCP placeholder: GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxxxxxxxxxxxxxxxxxxx"
- Auth header doc: Authorization: "Bearer sk-xxxxxxxxxxxxxxxxxxxx"
- Env var doc: export COMFY_CLOUD_API_KEY="comfyui-xxxxxxxxxxxx"
- CSS template tokens: --sk-focus-color and --sk-body-link-color, ring 2px solid var(--sk-focus-color, #0071E3)
- Env lookup: client = ElevenLabs(api_key=os.getenv("ELEVENLABS_MUSIC_KEY"))
- Assign placeholder: WANDB_API_KEY=your_api_key_here
- Assign placeholder: TENOR_API_KEY=your_key_here
- Assign placeholder: AIRTABLE_API_KEY=pat_your_token_here
- Assign placeholder: NOTION_API_KEY=ntn_your_key_here
- Doc snippet: api_key="your-api-key" and api_key="not-needed"
- Value equals name: ELEVENLABS_API_KEY=ELEVENLABS_API_KEY and OPENAI_API_KEY=process.env.AZURE_OPENAI_API_KEY
- Variable refs: self.api_key = api_key and SemanticScholar(api_key=api_key)
- JSON key refs: headers = {"xi-api-key": api_key, "Content-Type": "application/json"}
- JSON key refs: "api_key": self.api_key,
- Redacted doc values: export ANTHROPIC_API_KEY=sk-ant-... ; OPENAI_API_KEY = "sk-proj-..." ; STABILITY_API_KEY=sk-abc...3456
- Bare ellipsis value: export OPENROUTER_API_KEY=...
- Header var refs: -H "X-API-Key: $COMFY_CLOUD_API_KEY"
- Empty-value name docs: XAI_API_KEY=          (https://console.x.ai) ; MOONSHOT_API_KEY= ; (`X_API_KEY=`) ; API_KEY=`,
- Commented name doc: # OPENAI_API_KEY=          # not needed in local mode
- Actions secret ref: nexApiKey : ${{ secrets.NEX_API_KEY }}
- Redacted oauth example: Authorization: Bearer ya29.a0AfH6SM_REDACTED_OAUTH_ACCESS_TOKEN_EXAMPLE
- Grep prefix docs: git log -G "ghp_|gho_|github_pat_" ; git log -G "xoxb-|xoxp-|xapp-" ; Anthropic: sk-ant-api03- and sk-ant-api03-[A-Za-z0-9_-]{60,}
- Placeholder uuids: FAL_API_KEY=abcdefgh-ijkl-mnop-qrst-uvwxyz123456 ; VOLCENGINE_API_KEY=<uuid>
- Discard list doc: anything matching sk-123 or sk-ant-ridewire
- Generic pattern names: token=, key=, API_KEY=, password=, secret=
- Python membership test: if "OPENROUTER_API_KEY=" in line and "***" not in line:
- Quoted JSON env refs: "api_key": "$NVIDIA_API_KEY" ; "api_key": "$SOME_KEY" ; "api_key": "$SOME_API_KEY"
- Bearer env ref: curl -H "Authorization: Bearer $KEY" https://openrouter.ai/api/v1/models
