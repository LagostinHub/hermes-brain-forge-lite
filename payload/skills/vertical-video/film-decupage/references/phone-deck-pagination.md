# Paginação de documento de aprovação (phone-first, 9:16)

> Origem: sessão 2026-09-12 (peça de campanha [CLIENTE-B]). O cliente rejeitou DUAS versões
> antes de ficar bom: "as bordas no topo ficaram zeradas. e pagina 1 ta vazia" e depois
> "o pdf ficou 1 card só por página? que isso? precisamos ocupar melhor os espaços".
> Este arquivo é o que resolveu — meça, não olhe por cima.

## 1. O cliente lê no celular: 9:16, um card por beat

Página `114mm × 203mm`, margem 0, um card por beat (texto/imagem/motion/som).
Entrega: PNG por bloco (zap) + PDF pra folhear. Nunca tabela A4 como entrega primária.

## 2. Métrica honesta de ocupação (a que eu errei no começo)

Rasterize o PDF e MEDA. Duas métricas:

| Métrica | Como | Para que |
|---|---|---|
| **Tinta real** | pixel que NÃO é fundo (creme `#F5EFE0`) **nem** branco `#FFFFFF` | quanto do pé da página tem conteúdo de verdade |
| **Maior vão interno** | maior sequência de linhas sem tinta ENTRE a primeira e a última com tinta | detectar buraco no meio (card aberto e vazio) |

**Pitfall:** contar "até onde a caixa do card termina" **mente** — o corpo branco do card conta como
ocupado, então uma página com card aberto e vazio dá 100%. Foi assim que eu declarei bom um PDF ruim.

```python
# medidor (pymupdf): tinta real + maior vão interno, por página
import pymupdf
doc = pymupdf.open(pdf)
CREME, BRANCO = (245,239,224), (255,255,255)
def perto(p,c,t=8): return all(abs(p[i]-c[i])<=t for i in range(3))
for pg in doc:
    pix = pg.get_pixmap(dpi=96); s=pix.samples; n=pix.n; w,h=pix.width,pix.height
    rowink=[]
    for y in range(h):
        hit=False
        for x in range(0,w,4):
            o=(y*w+x)*n
            if not perto((s[o],s[o+1],s[o+2]),CREME) and not perto((s[o],s[o+1],s[o+2]),BRANCO): hit=True; break
        rowink.append(hit)
    first=next((y for y,v in enumerate(rowink) if v),0); last=max((y for y,v in enumerate(rowink) if v),default=0)
    vao=cur=0
    for y in range(first,last+1):
        cur = 0 if rowink[y] else cur+1; vao=max(vao,cur)
    print(f"conteudo {100*(last-first)/h:.0f}% da altura | maior vao interno {vao}px")
```

Alvo: páginas de conteúdo ≥85%, maior vão interno ≤ ~25px, nenhuma página <50%.

## 3. Regras de quebra de página (CSS `@media print`)

```css
/* 1. NÃO force quebra por item — vira 1 card/página e o cliente reclama do espaço */
/* 2. o card pode continuar na página seguinte, mas a LINHA nunca parte */
.beat { break-inside: auto;  page-break-inside: auto; }
.row  { break-inside: avoid; page-break-inside: avoid; }
/* 3. timecode + primeira linha andam JUNTOS (ver pitfall abaixo) */
.bhead { break-inside: avoid; page-break-inside: avoid; }
/* 4. faixa de bloco não fica órfã no pé da página */
.blkb { break-after: avoid; page-break-after: avoid; }
/* 5. nunca encostar em y=0: a borda de cima é cortada */
.pg   { padding-top: 10px; }
```

**PITFALL — `break-after:avoid` não segura cabeçalho+linha.** O timecode (chip) num wrapper
próprio e a linha de texto no irmão seguinte: `break-after: avoid` no chip **não** impede a quebra
(Chromium ignorou, verificado no render). O que funciona: **envolver o chip + a primeira linha num
único `<div class="bhead">` com `break-inside: avoid`**. Sem isso o card abre no pé da página com o
corpo VAZIO — parece buraco e o cliente vê como defeito.

**PITFALL — borda do topo "zerada".** Elemento que inicia a página encosta em `y=0` e perde a
`border-top`. Solução: `padding-top` no container da página + borda completa (não só top/bottom)
na faixa/card.

## 4. O tamanho do tipo decide quantos cards cabem (a alavanca real)

Medido na mesma peça (11 cards + capa, página 203mm):

| Tipo | Páginas | Cards/página | Ocupação média |
|---|---|---|---|
| 16,4px | 11 | 1–2 | 67% (com páginas de 10%) |
| 15,8px | 10 | ~1,2 | 95% (mas 1 card/página = queixa do cliente) |
| **13,6px** | **6** | **2–4** | **89,6% (pior página 73% = capa)** |

Regra: escolha o tipo MENOR que ainda é confortável no celular e que dê **≥2 cards por página**.
Escalar o tipo pra cima pra "encher" a página faz o contrário: cada card fica mais alto e cabe menos.

## 5. Rodapé e última página

O rodapé/CNPJ caindo sozinho numa última página de 10% é defeito. Ajuste fino que resolveu:
reduzir `padding` das linhas (6,4px → 5,6px) puxa o rodapé pra página anterior; `.foot{break-before:avoid}`
ajuda mas não garante. Confira a última página SEMPRE.

## 6. Loop de verificação antes de entregar

1. Renderiza (Edge headless `--print-to-pdf` é o caminho nesta máquina).
2. Mede (tinta real + vão interno) e imprime a tabela por página.
3. **Olha** as páginas de risco com visão: a que tem card partido, a última, e a capa.
4. Só então entrega. Se uma página ficou <50% ou tem vão grande, volte ao passo 1.

## 7. Entregar junto

PNG das páginas (2× pra leitura no chat/celular) + o PDF + (se houver) as imagens por bloco
pro WhatsApp. Nomear por página (`...-pagina-1.png`) pra ordem ficar óbvia.
