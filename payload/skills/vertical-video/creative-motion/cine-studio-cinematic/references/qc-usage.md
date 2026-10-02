# QC Script — Uso

```bash
# QC completo num projeto
python qc.py --project NOME_DO_PROJETO

# Modo rápido (só drift + prompt audit)
python qc.py --project NOME_DO_PROJETO --mode quick

# Modo completo (8 categorias, health score)
python qc.py --project NOME_DO_PROJETO --mode standard
```

## Dependências

- `ffmpeg` — extração de frames (obrigatório)
- `Pillow` — comparação de imagens (obrigatório)
- `scikit-image` — SSIM (opcional, mais preciso que fallback MSE)

## Saída

- Relatório JSON em `qc_output/NOME_DO_PROJETO/qc_report.json`
- Frames extraídos em `qc_output/NOME_DO_PROJETO/shot_NNN/`
- Console: health score por shot + média + Ship/Hold/Block

## Integração Web

Endpoint: `GET /api/project/{name}/qc` no Cine Studio (app.py).
Chama `qc.run_qc(name, "standard")` em background thread.
Poll até o relatório aparecer em `qc_output/.../qc_report.json`.