/* =============================================================================
   MARCA SOBRENOME — THEME (fonte única de verdade)
   Antes os tokens estavam repetidos em cada arquivo de cena. Agora tudo que
   define a MARCA mora aqui: paleta, fonte, safe margins, formato, sombra.

   Trocar de cliente = trocar este arquivo. Nada mais.
   ============================================================================= */

/* ------------------------------------------------------------------ PALETA -- */
/* Medida por pixel em 7 peças oficiais (2026-09-12). NÃO chutar cores. */
export const MARCA = {
  amarelo: "#FFCF00",   // primária / fundo dominante
  roxo: "#780585",      // secundária / assinatura
  roxoEsc: "#3E0247",   // roxo escuro (gradiente, scrim)
  pink: "#FD0E59",      // destaque
  teal: "#01B7A6",      // apoio
  branco: "#FFFFFF",
  creme: "#F5EFE0",     // caixa de texto clara
  preto: "#111111",
} as const;

/* Aliases posicionais — mantêm compatibilidade com os componentes antigos */
export const C = {
  cor1: MARCA.amarelo,
  cor2: MARCA.roxo,
  cor3: MARCA.pink,
  cor4: MARCA.teal,
  amarelo: MARCA.amarelo,
  roxo: MARCA.roxo,
  pink: MARCA.pink,
  teal: MARCA.teal,
  branco: MARCA.branco,
  creme: MARCA.creme,
  preto: MARCA.preto,
  escuro: MARCA.roxoEsc,
} as const;

/* ------------------------------------------------------------------- FONTE -- */
export const FONT = "'Montserrat','Segoe UI',Arial,sans-serif";
export const FONT_BLACK = 900;   // headline
export const FONT_XBOLD = 800;   // apoio

/* -------------------------------------------------------------- OVERLAY PNG -- */
/* Assets oficiais da campanha (colocar em public/) */
export const ASSETS = {
  quatroMil: "CG_4000.png",        // 952x291 — o "4000" oficial
  faixa4000: "faixa_4000.png",     // 1748x137 — faixa de 4000 repetidos
  textoLegal: "cg_cnpj_overlay.png", // 1080x1920 RGBA — faixa vertical branca na borda DIREITA
  logo: "CG_LOGO.png",
} as const;

/* Texto legal (referência — o que vale é o PNG, nunca digitar) */
export const CNPJ = "CNPJ DO CANDIDATO 68.237.280/0001-90 - PARTIDO SOCIALISTA BRASILEIRO";

/* ------------------------------------------------------------------ FORMATO -- */
/* Safe margins: SÓ foto/fundo sangra. Texto/logo/legal ficam DENTRO.
   Reels impulsionado: top 250 · bottom 400 · side 64 (medido/validado). */
export const FORMATOS = {
  vertical:   { w: 1080, h: 1920, fps: 30, safe: { top: 250, bottom: 400, side: 64 } },
  quadrado:   { w: 1080, h: 1080, fps: 30, safe: { top: 90,  bottom: 90,  side: 64 } },
  horizontal: { w: 1920, h: 1080, fps: 30, safe: { top: 60,  bottom: 60,  side: 90 } },
} as const;

/* Vertical é o padrão da campanha (Reels) */
export const SAFE = FORMATOS.vertical.safe;
export const SAFE_W = FORMATOS.vertical.w - SAFE.side * 2;               // 952
export const SAFE_BOT = FORMATOS.vertical.h - SAFE.bottom;               // 1520
/* a faixa legal ocupa x 998..1013 → texto alinhado à direita termina antes */
export const RIGHT_LIM = 112;
/* topo do bloco de texto (o dono pediu "texto mais pra cima") */
export const TEXT_TOP = SAFE.top + 20;                                   // 270
/* posição da CABEÇA da pessoa, IGUAL em todas as cenas (regra do dono) */
export const HEAD_Y = 950;

/* ------------------------------------------------------------------ FUNDOS -- */
export const BG_AMARELO = `radial-gradient(circle at 50% 34%, #FFDE45 0%, ${MARCA.amarelo} 52%, #EDBC00 100%)`;
export const BG_ROXO = `radial-gradient(circle at 50% 42%, #A313B4 0%, ${MARCA.roxo} 50%, ${MARCA.roxoEsc} 100%)`;

/* ------------------------------------------------------------------ SOMBRA -- */
/* Sombra SÓLIDA e COLORIDA, sempre CONTRASTANDO com a cor do texto.
   (contorno preto/branco é proibido — poluição visual) */
export const CONTRASTE: Record<string, string> = {
  [MARCA.roxo]: MARCA.amarelo,
  [MARCA.amarelo]: MARCA.roxo,
  [MARCA.branco]: MARCA.roxo,
  [MARCA.pink]: MARCA.roxo,
  [MARCA.teal]: MARCA.amarelo,
  [MARCA.creme]: MARCA.roxo,
  [MARCA.preto]: MARCA.amarelo,
  [MARCA.roxoEsc]: MARCA.amarelo,
};
export const sombraDe = (fill: string) => CONTRASTE[fill] ?? MARCA.roxo;

/* ------------------------------------------------------------------- MOTION -- */
export const STEP = 3;              // 30fps -> 10 poses/s (stop motion)
export const TRANSICAO_FRAMES = 12; // padrão (12-16). 6-10 só p/ FlashCut.

/* --------------------------------------------------------------- TIPOGRAFIA -- */
/* Montserrat Black: largura ~= nchar * 0.68 * size.
   Para caber numa linha de W px:  size_max ~= W / (nchar * 0.68) */
export const sizeParaLargura = (nchar: number, larguraPx: number) =>
  Math.floor(larguraPx / (nchar * 0.68));

/* ============================================================================
   ESCALA DE ESPAÇO — a base da diagramação
   -----------------------------------------------------------------------------
   O erro que eu cometi: posicionar elemento com `top` chumbado à mão. Isso não
   tem ritmo nem respiro. Aqui está uma escala de 1.5x (como as de design system)
   para TODO espaçamento sair dela — nunca de número inventado.
   ============================================================================ */
export const ESPACO = {
  xxs: 6,
  xs: 10,
  sm: 16,
  md: 24,
  lg: 36,
  xl: 56,
  xxl: 84,
  xxxl: 120,
} as const;

/* ----------------------------------------------------------------------------
   ESCALA TIPOGRÁFICA — uma escala, não valores soltos.
   Regra de leitura: hierarquia por SALTO claro (1.35–1.45x), não por diferenças
   pequenas (que leem como erro, não como hierarquia).
   ---------------------------------------------------------------------------- */
export const TYPE = {
  palavraChave: 176,
  titulo: 132,
  subtitulo: 96,
  corpo: 68,
  legenda: 54,
  etiqueta: 38,
  micro: 24,
} as const;

/* Maior tamanho que AINDA cabe numa linha da largura pedida (usa a fórmula da
   Montserrat Black). Teto prático para headline dentro do SAFE. */
export const tetoHeadline = (nchar: number, largura = SAFE_W) => sizeParaLargura(nchar, largura);

/* ----------------------------------------------------------------------------
   ALTURA ÚTIL — a área onde a diagramação pode acontecer.
   Serve pra centralizar grupos: margem de cima == margem de baixo.
   ---------------------------------------------------------------------------- */
export const AREA_UTIL = {
  top: SAFE.top,
  bottom: 1920 - SAFE.bottom,
  altura: 1920 - SAFE.bottom - SAFE.top, // 1270
  left: SAFE.side,
  right: 1080 - SAFE.side,
  largura: SAFE_W,
} as const;
