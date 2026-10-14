# Fixture: secret shapes (FAKE values only - proving detection, task 2.4)
# Every line below is fabricated; none of these are real credentials.

- OpenAI-style key: sk-test1234567890abcdef
- AWS access key id: AKIAZZFAKEKEYEXAMPLE
- AWS secret-style pair: AKIAJFAKEKEYEXAMPLE00
- GitHub classic PAT: ghp_faketoken0123456789abcdefABCD
- GitHub fine-grained PAT: github_pat_faketoken000111222333
- Slack bot token: xoxb-fake-slack-token-000
- Slack user token: xoxp-fake-user-token-111

Dumped private key header found in a config note:
-----BEGIN RSA PRIVATE KEY-----
-----BEGIN OPENSSH PRIVATE KEY-----

Inline key assignments of the shape the gate must catch:
api_key: "fake-inline-key-987654"
"apikey": "fake-json-inline-98765"
api-key = 'fake-yaml-inline-98765'
Authorization: Bearer faketoken.eyJhbGciOiJIUzI1NiJ9.signature
bearer: "fake-bearer-yaml-value-0123"
bearer_token=fakebearerenvvalue0123
