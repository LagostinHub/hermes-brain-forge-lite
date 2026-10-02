---
name: remotion-best-practices
description: "Use quando QUALQUER tarefa tocar Remotion (criar, animar, render, 3D, legendas, fontes). Router oficial do cluster: carregue ESTA skill primeiro e siga a decision table."
version: 5.0.0
metadata:
  role: router
  cluster: remotion
  subskills: 20
---


## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)

| Pilar | MOC | Quando consultar |
|---|---|---|
| **Cinema Theory (mestre)** | [[57.00-cinema-theory-moc]] | Visão geral + ordem de leitura dos 7 pilares |
| **Edição** | [[57.22-edição-moc]] | Timing, ritmo, transições, QC |
| **Design** | [[57.25-design-moc]] | Tipografia, layout, hierarquia, motion design |
| **Animação/Movimento** | [[57.24-animação-moc]] | 12 princípios, easing, timing |
| **Áudio** | [[57.26-audio-moc]] | Sound design, música, loudness, sync |

> Regra: nunca decida "de cabeça" — consulte o card do pilar; nunca cite o card sem executar pela tool certa.

# Remotion — Router Oficial

Toda tarefa que envolve Remotion começa AQUI. Regra de ouro:

1. **Carregue esta skill** (`remotion-best-practices`) primeiro — ela só roteia.
2. **Localize a tarefa na decision table** abaixo.
3. **Carregue a subskill roteada** via `skill_view("<nome>")` — é lá que está o conhecimento especializado (pitfalls validados, comandos, versões).
4. Tarefa multiárea? Carregue **todas** as subskills roteadas. Ex: overlay animado que precisa sair com o áudio do footage → `remotion-film-overlays` + `remotion-video-audio-pipeline`.

Não resolva especialidades (render com áudio, 3D alpha, fontes headless, render no Windows) só com conhecimento geral — a subskill certa já documenta o caminho validado nesta máquina.

## Decision Table — tarefa → skill

| Se a tarefa é... | Carregue |
|---|---|
| Criar vídeo/composição nova, projeto Remotion do zero | `remotion-create` |
| Vídeo AI editável: short vertical, demo de produto, HUD/tech, feed ad, tutorial | `remotion` |
| Escrever markup React: componentes, animação, timing, layout | `remotion-markup` |
| Legendas: transcrição, sincronização, `@remotion/captions`, estilização | `remotion-captions` |
| Export/render avançado: MP4, codec, qualidade, `npx remotion render` além do básico | `remotion-render` |
| Render que PRECISA manter o áudio do footage (talking-head, campanha, ffmpeg mux) | `remotion-video-audio-pipeline` |
| Render/still no Windows com CLI falhando (webpack `ENOENT ... bundle.js`) | `remotion-windows-render` |
| Produção completa: recriar vídeo de referência, peças de campanha, template `timeline.json` | `remotion-video-production` |
| 3D Three.js (`@remotion/three`) com export ProRes 4444 alpha | `remotion-three-3d` |
| 3D + ProRes 4444 alpha no Windows (pipeline local validado, npm fora do PATH) | `remotion-3d-alpha` |
| Overlays de filme: nomes/lower-thirds, títulos, listas, gráficos sobre footage | `remotion-film-overlays` |
| Still/PNG renderizando com fonte ERRADA (fonte headless, fallback silencioso) | `remotion-headless-fonts` |
| Interatividade: usuário editar valores no Studio e escrever de volta no código | `remotion-interactivity` |
| Mapas: rotas animadas, markers, Mapbox/MapLibre, GeoJSON, flyover | `remotion-maps` |
| Mediabunny: trim/crop de vídeo, metadata, manipulação de mídia no browser | `remotion-multimedia` |
| Preview: abrir Remotion Studio, URL local, CLI flags do studio | `remotion-studio` |
| Buscar API/documentação Remotion atualizada | `remotion-docs` |
| App/SaaS com Remotion: `<Player>`, Lambda, Vercel, Cloudflare, render em servidor | `remotion-saas` |
| Upgrade de versão do Remotion e pacotes relacionados | `remotion-upgrade` |
| Puxar legendas de um timeline DaVinci Resolve e virar lettering Remotion com alpha | `resolve-remotion-lettering` |

## Quick-start — fluxos comuns

- **Lettering/overlay pra filme (9:16 ou 16:9)**
  `remotion-create` (se projeto novo) → `remotion-markup` → `remotion-film-overlays` → `remotion-render`. CLI falhou no Windows? → `remotion-windows-render`.
- **Vídeo com footage + áudio original no MP4 final**
  `remotion-video-audio-pipeline` (pitfall: só uma das 3 formas de embutir footage renderiza vídeo, e nenhuma mantém áudio — requer ffmpeg mux) → `remotion-render`.
- **3D com alpha pra compor no AE**
  `remotion-three-3d` (geral) ou `remotion-3d-alpha` (variante Windows validada) → `remotion-render`.
- **Still PNG com fonte custom saindo errada**
  `remotion-headless-fonts` (o headless browser ignora webfonts silenciosamente — confira o PNG com vision).
- **Legendas/transcrição**
  `remotion-captions`. Vindo de Resolve? → `resolve-remotion-lettering`.
- **Iteração com preview**
  `remotion-studio` → ajustar → `remotion-render`.
- **Recriar vídeo de referência / peças de campanha em lote**
  `remotion-video-production`.
- **Dúvida de API em qualquer passo**
  `remotion-docs`.

## Convenções

- **Preserve user changes**: o usuário pode editar código fora da conversa. Mudança surpresa no código = intencional; não sobrescreva, confirme.
- As pastas `remotion-*/` internas deste bundle (com `REFERENCE.md`) são cópias offline do conteúdo oficial; prefira carregar a subskill irmã pelo nome (`skill_view`), que é o que o pool registra.
- Após resolver, se descobriu um pitfall novo, registre na subskill correspondente — não aqui (aqui é só rota).