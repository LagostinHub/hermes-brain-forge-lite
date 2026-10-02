# [FERRAMENTA] Workflow Template — Lessons Learned

## O que tentamos
Salvar um template de workflow `.json` no [FERRAMENTA] local (`[CAMINHO]`) para reuso futuro. O template usa:
- `DualCLIPLoader` + `UnetLoaderGGUF` (FLUX.1 dev Q5_0) + `VAELoader` + `EmptyLatentImage` + `CLIPTextEncode` (pos/neg) + `KSampler` + `VAEDecode` + `SaveImage`

## O que NÃO funcionou
1. **JSON manual** — criar nodes/links na mão e salvar em `user/default/workflows/` → UI mostra vazio (falta de `widgets_values_named`, `properties`, `widgets_values_named` específicos, `outputs.links`, `inputs.link`, etc.)
2. **GraphBuilder** — o módulo `comfy_execution.graph_builder` não existe. O correto é `comfy_execution.graph.GraphBuilder` (ou via `from execution import GraphBuilder`)
3. **Copiar JSON do GraphBuilder** — `gb.finalize()` retorna o formato **API** (chaves como `.0.0.1`, não inteiros), incompatível com o formato de **template** do [FERRAMENTA]
4. **Colar em `user/default/workflows/`** — o [FERRAMENTA] usa `[ferramenta]-workflow-templates` (pip package) que lê de `python_embeded/Lib/site-packages/[ferramenta]_workflow_templates_json/templates/` + `manifest.json`

## O que FUNCIONOU
- Submeter workflow via API (`/prompt`) funciona perfeitamente com o formato API (nodes como dict de `class_type` + `inputs`)
- Gerar imagens com FLUX.1 dev Q5_0 GGUF + DualCLIPLoader + KSampler via API: ~25-30s por imagem @ 8 steps
- [FERRAMENTA]-GGUF nodes (`UnetLoaderGGUF`, `DualCLIPLoaderGGUF`) funcionam, mas `DualCLIPLoaderGGUF` **não** aceita `t5xxl_fp8_e4m3fn_scaled` (erro: "Mixing scaled FP8 with GGUF is not supported")

## Formato correto de template (resumo)
O [FERRAMENTA] template JSON precisa:
- `id`, `revision`, `version` (0.4)
- `nodes`: lista de objetos com `id` (int), `type`, `pos`, `size`, `flags`, `order`, `mode`, `inputs`, `outputs`, `properties` (`cnr_id`, `ver`, `Node name for S&R`), `widgets_values` (lista), `widgets_values_named` (dict)
- `links`: lista de `[link_id, from_node, from_slot, to_node, to_slot, type]`
- Cada input com link precisa de `"link": <id>` apontando pra entrada em `links`
- Cada output com conexão precisa de `"links": [<id1>, <id2>]`

## MCP (Model Context Protocol)
- **Comfy MCP** (artokun/[ferramenta]-mcp): pacote npm, servidor MCP que expõe ferramentas de workflow, model management, node management, etc.
- Comando: `npx [ferramenta]-mcp --stdio` ou `--http`
- Não testamos a fundo — precisa instanciar como MCP server no Hermes

## Skills
- Nenhuma skill específica pra [FERRAMENTA] workflow creation foi carregada
- `[ferramenta]-mcp-server` skill existe mas não foi testada

## Recomendação
1. **Pra criar templates**: usar a UI do [FERRAMENTA] (arrastar nodes, conectar, File → Save) — é a forma confiável
2. **Pra automatizar via API**: usar o formato API (dict de nodes), submeter via `/prompt`, não tentar gerar template `.json` manualmente
3. **Pra templates reusáveis**: salvar via UI, o [FERRAMENTA] coloca no lugar certo com todos os metadados
4. **Pra FLUX GGUF**: sempre usar `DualCLIPLoader` (não GGUF) + `UnetLoaderGGUF`

## Arquivos gerados
- `C:/AI/[FERRAMENTA]/[FERRAMENTA]_windows_portable/[FERRAMENTA]/user/default/workflows/CLIENTE_C_FLUX_GGUF.json` — template (pode não carregar via UI)
- Imagens geradas via API em `output/`: `SC01_TK03_executive_00001_.png`, `SC02_TK01_eyes_00001_.png`, `SC02_TK02_diver_00001_.png`, `SC08_TK02_smile_00001_.png`, `TAR_FLUX_00001_.png`, `FLUX_test_00001_.png`, `flux_camera_90deg_v2_00001_.png`

## Erros comuns
- `Mixing scaled FP8 with GGUF is not supported` → usar `DualCLIPLoader` em vez de `DualCLIPLoaderGGUF` quando o CLIP for `*_scaled`
- `Use between 2 and 24 camera keyframes` → `H3LocalCameraEditor` exige mínimo 2 keyframes no `camera_trajectory`
- `clip missing: ['text_projection.weight']` + `KeyError: 't5xxx'` → versão do [FERRAMENTA] antiga, não suporta FLUX nativo (corrigido atualizando)
