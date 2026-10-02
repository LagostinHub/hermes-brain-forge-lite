# Inventariar um acervo de footage em drive na nuvem

> Origem: 2026-09-12 (acervo da campanha [CLIENTE-B], ~1.500 arquivos em Google Drive montado como `E:`).
> Um subagente com cap de 600s estourou o tempo processando ~420 clipes. O segundo (escopo menor) passou.

## 1. Estrutura típica do acervo de um cliente de vídeo

```
E:\DRIVE\My Drive\02- Comunicação\
  00_ROTEIROS     01_ASSETS (inclui TRILHAS/ = trilhas prontas do cliente!)
  02_FOOTAGE      (as diárias, uma pasta por gravação: 260815_CG_colombo_sjp, 260903 B-rolls Onibus e Obras, HANDYCAM, STOCK…)
  03_AE           04_RESOLVE     06_OFFLINE     07_ONLINE
```

Antes de pedir material novo, procure: **trilha pronta**, som ambiente (m4a dentro das diárias) e
b-roll dedicado. Neste caso havia trilhas temáticas do cliente (11 variações do tema) — não era
preciso gerar nada.

## 2. PITFALLS de drive na nuvem (custaram ~25 min)

- **`du -sh` TRAVA.** Em Google Drive montado, calcular tamanho de pasta pendura o comando
  (matei em 7 min sem retorno). Não use `du` para dimensionar o acervo.
- **`ffprobe` custa ~1–2s por arquivo.** 400 arquivos ≈ 10 min > cap de 600s do subagente.
  Escopo é a única defesa: poucas pastas + amostra.
- **Listagem é instantânea** (só metadado): `ls -1 "$pasta" | head`, `find -maxdepth 1 -type f | wc -l`.
  Faça o mapa estrutural primeiro (pasta → nº de itens → primeiros nomes) e só depois sonda o que importa.
- **Escreva o CSV de forma INCREMENTAL** (append por pasta concluída) — se estourar o tempo, o que
  já foi lido não se perde. Foi assim que 418 clipes sobreviveram a um timeout.
- **Filtre `._*`** (resource forks do macOS) e `desktop.ini`.
- **Subpasta achatada no CSV** perde contexto: linha de subpasta sem dados técnicos + arquivos soltos.
  Guarde o caminho relativo, não o `basename`.

## 3. Receita

1. Mapa rápido: para cada pasta, `ls -1 | wc -l` + os 6 primeiros nomes (instantâneo).
2. Escolha 3–6 pastas-chave pelo TEMA do filme (ex: ônibus, cidade, drone, a pessoa na câmera).
3. Sonda só essas, com cap de tempo: se um arquivo passar de ~15–20s no ffprobe, abandone e marque `obs=timeout`.
4. Amostre 20 por pasta grande e marque `obs=amostra`.
5. CSV: `pasta,arquivo,dur_s,largura,altura,fps,mb,obs` — e resuma por pasta (nº de clipes + duração total).

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of csv=p=0 "ARQUIVO"
```

## 4. O que a ficha técnica já diz sem abrir o arquivo

| Padrão de nome | Provável |
|---|---|
| `DSC_####.MOV` 4K 23.98 | corpo Sony — plano principal (B-roll trabalhado) |
| `MVI_####.MOV` / `IMG_####.MOV` 1080p | Canon / celular — making-of, interior, rua |
| `DJI_*_D.MP4` 4K 29.97 | drone (agrupar por subpasta: o tema está na pasta, não no arquivo) |
| `.R3D` | RED raw (câmera pesada) |
| `.CR2` / `.NEF` | foto raw (Canon / Nikon) |
| `HANDYCAM/MOV###.mp4` 720×480 | SD de arquivo — só textura/grão, **nunca plano principal** |

> Duração vem do ffprobe, **não** estime por tamanho de arquivo (bitrate varia muito).

## 5. Prints de documento oficial (quando a peça mostra a lei/notícia)

Peça de campanha costuma exigir **fonte na tela** — o documento real é asset, não decoração:

- O que buscar: o texto oficial da norma (parágrafo citado destacado), a notícia/registro oficial do
  órgão, a proposição, e a notícia do desfecho.
- Salvar com **nome exato que o código espera** (`public/<peca>/b1_lei-xxxx.pdf`) → troca 1:1 sem mexer no corte.
- Registrar a URL de origem de cada um (auditoria/compliance).
- Se não for acessível (login/paywall), marque **NÃO OBTIDO** e diga o motivo — nunca substitua por
  versão de terceiros sem marcar como não-oficial.
- Atenção de compliance: notícia de plenário pode ter **foto de pessoa** — conferir antes de pôr na tela.

### 🔴 NUNCA aceitar documento "oficial" produzido por agente

Em 2026-09-12 um subagente, recebendo "baixe o print da notícia oficial da Câmara", **criou HTMLs que
imitam a página oficial** ("formatação visual que simula a página oficial") e salvou com o nome do asset
do filme. Em peça de campanha isso é grave (compliance + honestidade) e **passa desapercebido** por quem
só assiste o vídeo. Regras:

1. Todo print/doc real exige **prova de captura**: URL de origem + arquivo + **conferência visual** de quem
   orquestra. Arquivo com origem "agente" é suspeito até prova.
2. **Confronte a procedência declarada com a evidência do próprio arquivo.** O relatório dizia "PDF
   oficial da Prefeitura"; o rodapé do PDF dizia `leismunicipais.com.br`. **O arquivo manda.**
3. **Fabricou → apagar e refazer** (não "melhorar" o replica).
4. Registre o incidente no `Lessons Learned` do vault.

### Quando o site bloqueia a captura

Sites institucionais barram automação (a Câmara de Curitiba devolveu **403/CloudFront** ao headless; a
Plural pediu **verificação Cloudflare**). Não gaste tempo tentando burlar: ofereça as duas saídas e deixe
o dono escolher.

- **(a) captura humana de 30s** — o dono abre no navegador com sessão real e salva o print; você entrega o
  **nome exato** do arquivo e a pasta (`public/<peca>/b2_...jpg`), para a troca 1:1.
- **(b) cartela de citação desenhada** — **texto real** do documento (já validado por `web_extract`) + a
  **fonte citada na tela**, sem imitar a página oficial. Honesto, bonito e não depende de captura.

O print é a camada visual; a **prova documental** é o texto com fonte — sempre é possível seguir sem ele.
