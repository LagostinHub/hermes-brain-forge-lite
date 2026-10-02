/* =============================================================================
   remotion-film-overlays — BIBLIOTECA DE COMPONENTES
   Estilo: stop motion flat vibrante. Testado em produção 2026-09 (1080x1920).
   Uso: copie o bloco inteiro para src/overlays.tsx e importe nas cenas.
   ============================================================================= */
import React from "react";
import {
  AbsoluteFill, Img, staticFile,
  useCurrentFrame, useVideoConfig,
} from "remotion";
import "./fonts.css"; // @font-face apontando p/ src/fonts/*.ttf (funciona no render programatico)

/* ---------------------------------------------------------------- TOKENS ---- */
/* Troque esta paleta pela do cliente. As constantes sao usadas nos mapas
   de contraste, entao mantenha os MESMOS valores hex nas chaves.          */
export const C = {
  cor1: "#FFCF00",  // primaria   (amarelo)
  cor2: "#780585",  // secundaria (roxo)
  cor3: "#FD0E59",  // destaque   (pink)
  cor4: "#01B7A6",  // apoio      (teal)
  branco: "#FFFFFF",
  creme: "#F5EFE0",
  preto: "#111111",
  escuro: "#3E0247", // sombra da secundaria, p/ gradiente
};
export const FONT = "'Montserrat','Segoe UI',Arial,sans-serif";

/* SAFE MARGINS — Reels impulsionado, 1080x1920.
   Ajuste se a plataforma/formato for outro. */
export const SAFE = { top: 250, bottom: 400, side: 64 };
export const SAFE_W = 1080 - SAFE.side * 2;      // 952

export const BG_COR1 = `radial-gradient(circle at 50% 34%, #FFDE45 0%, ${C.cor1} 52%, #EDBC00 100%)`;
export const BG_COR2 = `radial-gradient(circle at 50% 40%, #A313B4 0%, ${C.cor2} 48%, ${C.escuro} 100%)`;
/* (o antigo easeOut saiu junto com o spring — o estilo nao interpola) */

/* =================================================== STOP MOTION (a base) ==== */
const STEP = 3; // 30fps -> 10 poses/s. Use 4 ou 5 p/ mais "travado".
export function useStep(step = STEP, delay = 0) {
  const f = useCurrentFrame();
  return Math.floor(Math.max(0, f - delay) / step) * step;
}
/** punch-in em DEGRAUS (nao interpolado) — o zoom "trepidante" do estilo */
export function usePunch(delay = 0, period = 9, steps = [1, 1.13, 1.04, 1.18, 1.07]) {
  const t = useStep(STEP, delay);
  return steps[Math.floor(t / period) % steps.length];
}
/** entrada: CHEGA E PARA. Sem spring, sem overshoot — 1 salto e trava.
 *  (antes usava spring() com damping 12, que estourava e voltava = bouncy)   */
export function usePop(delay: number, rot = 0, slideFrom = 80) {
  const d = useStep(STEP, delay);
  if (d <= 0) return { opacity: 0, transform: "none" } as React.CSSProperties;
  const primo = Math.floor(d / STEP) <= 1;      // 1º degrau: quase lá
  const k = primo ? 0.76 : 1;
  return {
    opacity: 1,
    transform: `translateY(${((1 - k) * slideFrom).toFixed(1)}px) rotate(${(rot + (1 - k) * 7).toFixed(2)}deg)`,
  } as React.CSSProperties;
}
/** fade -> vira CORTE SECO (0 ate o primeiro degrau, depois 1) */
export function useCut(delay: number) {
  return useStep(STEP, delay) <= 0 ? 0 : 1;
}

/* --------------------------------------------------------------- SOMBRA ---- */
/** cor da sombra solida: escolha uma que CONTRASTE com o fill do texto. */
export const CONTRASTE: Record<string, string> = {
  [C.cor2]: C.cor1, [C.cor1]: C.cor2, [C.branco]: C.cor2,
  [C.cor3]: C.cor2, [C.cor4]: C.cor1, [C.creme]: C.cor2, [C.preto]: C.cor1,
};
export const sombraDe = (fill: string) => CONTRASTE[fill] ?? C.cor2;

/* =================================================== TEXTO LEGAL (overlay) ==
   O texto legal deve vir como PNG oficial do cliente (nunca digitar).
   O asset ja vem no tamanho do frame -> basta sobrepor full-bleed.       */
export const Legal: React.FC<{ src?: string; delay?: number }> = ({ src = "legal_overlay.png", delay = 2 }) => {
  const o = useCut(delay);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 99, opacity: o, pointerEvents: "none" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
};

/* ================================================================== LINE ====
   Lettering: cor pura (sem contorno) + DROP SHADOW SOLIDO colorido.       */
export const Line: React.FC<{
  text: string; size: number; fill: string; shadow?: string;
  align?: "left" | "right" | "center"; rotate?: number;
}> = ({ text, size, fill, shadow, align = "center", rotate = 0 }) => {
  const s = shadow ?? sombraDe(fill);
  return (
    <div style={{ transform: `rotate(${rotate}deg)`, textAlign: align, lineHeight: 0 }}>
      <span
        style={{
          fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.92,
          letterSpacing: "-0.035em", textTransform: "uppercase", whiteSpace: "nowrap",
          color: fill, display: "inline-block",
          filter: `drop-shadow(${Math.round(size * 0.045)}px ${Math.round(size * 0.055)}px 0 ${s})`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/* ================================================================ PLAQUE ====
   Bloco solido — garante legibilidade sobre foto. Com sombra solida.      */
export const Plaque: React.FC<{
  children: React.ReactNode; bg: string; color: string; shadow?: string;
  size?: number; rotate?: number; delay?: number;
}> = ({ children, bg, color, shadow, size = 40, rotate = 0, delay = 0 }) => {
  const st = usePop(delay, rotate, 60);
  const s = shadow ?? sombraDe(bg);
  return (
    <div
      style={{
        ...st, display: "inline-block", backgroundColor: bg, color,
        fontFamily: FONT, fontWeight: 900, fontSize: size, textTransform: "uppercase",
        letterSpacing: "-0.02em", lineHeight: 1,
        padding: `${size * 0.3}px ${size * 0.5}px`, borderRadius: size * 0.16,
        boxShadow: `${Math.round(size * 0.07)}px ${Math.round(size * 0.085)}px 0 ${s}`,
      }}
    >
      {children}
    </div>
  );
};

/* ================================================================= BURST ====
   Starburst SEM stroke. SEMPRE atras do sujeito (centro ~ cabeca).
   NAO usar em cena de foto full-bleed (invisivel / cobre a foto).        */
export const Burst: React.FC<{
  size: number; color?: string; spikes?: number; innerR?: number;
  delay?: number; rot?: number; centerY: number;
}> = ({ size, color = C.cor1, spikes = 9, innerR = 34, delay = 0, rot = 0, centerY }) => {
  const t = useStep(STEP, delay);
  const idx = Math.floor(t / STEP);
  const s = t <= 0 ? 0 : idx <= 1 ? 0.84 : 1;   // 1 salto e trava (sem spring)
  const jitter = t <= 0 ? 0 : [0, 2, -1, 3, -2][Math.floor(t / 6) % 5];
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    const rad = i % 2 === 0 ? 50 : innerR + (i % 3) * 1.5;
    pts.push(`${50 + rad * Math.cos(a)},${50 + rad * Math.sin(a)}`);
  }
  return (
    <div
      style={{
        position: "absolute", width: size, height: size, top: centerY - size / 2,
        left: "50%", marginLeft: -size / 2,
        transform: `scale(${s}) rotate(${rot + jitter}deg)`, opacity: t <= 0 ? 0 : 1,
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points={pts.join(" ")} fill={color} />
      </svg>
    </div>
  );
};

/* =============================================================== SPARKLE ==== */
export const Sparkle: React.FC<{
  size: number; color?: string; delay?: number; rot?: number; y: number; x: number;
}> = ({ size, color = C.cor2, delay = 0, rot = 0, y, x }) => {
  const o = useCut(delay);
  const t = useStep(STEP, delay);
  const spin = t <= 0 ? 0 : Math.floor(t / 5) * 22;
  return (
    <div style={{ position: "absolute", width: size, height: size, top: y, left: x, opacity: o, transform: `rotate(${rot + spin}deg)` }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z" fill={color} />
      </svg>
    </div>
  );
};

/* ================================================================ CUTOUT ====
   Foto PNG com alpha. O outline sticker sao 8 drop-shadow na cor da marca
   (segue o alpha — e o UNICO drop-shadow permitido em imagem).
   headFrac = fracao da altura da imagem ACIMA da cabeca (medir no alpha,
   nao chutar:  np.where(alpha>20)[0].min()/H  ).                          */
export const Cutout: React.FC<{
  src: string; zoom: number; headFrac: number; headY?: number; xShift?: number;
  imgAspect?: number; color?: string; outW?: number; delay?: number;
}> = ({ src, zoom, headFrac, headY = 950, xShift = 0, imgAspect = 0.5625, color = C.branco, outW = 6, delay = 6 }) => {
  const t = useStep(STEP, delay);
  const idx = Math.floor(t / STEP);
  const s = t <= 0 ? 0 : idx <= 1 ? 0.86 : 1;   // entrou: trava (sem spring)
  const pm = usePunch(delay, 11, [1, 1.04, 1.01, 1.06, 1.02]);
  const imgH = 1920 * zoom;
  const imgW = imgH * imgAspect;
  const imgTop = headY - headFrac * imgH;
  const o = (x: number, y: number) => `drop-shadow(${x}px ${y}px 0 ${color})`;
  return (
    <div
      style={{
        position: "absolute", top: imgTop, left: "50%",
        marginLeft: -imgW / 2 + xShift * imgW,
        transform: `translateY(${(1 - s) * 200}px) scale(${s * pm})`,
        height: imgH, opacity: t <= 0 ? 0 : 1,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          height: "100%",
          filter: [
            o(outW, 0), o(-outW, 0), o(0, outW), o(0, -outW),
            o(outW * 0.72, outW * 0.72), o(-outW * 0.72, outW * 0.72),
            o(outW * 0.72, -outW * 0.72), o(-outW * 0.72, -outW * 0.72),
          ].join(" "),
        }}
      />
    </div>
  );
};

/* ============================================================= PHOTOFULL ==== */
export const PhotoFull: React.FC<{ src: string; posY?: string; delay?: number }> = ({ src, posY = "50%", delay = 0 }) => {
  const pm = usePunch(delay, 12, [1, 1.05, 1.01, 1.07, 1.03]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: `50% ${posY}`,
          transform: `scale(${pm})`, transformOrigin: "50% 30%",
        }}
      />
    </AbsoluteFill>
  );
};

/* =========================================================== CITYDUOTONE ==== */
export const CityDuotone: React.FC<{ src: string; zoom?: number; posY?: string }> = ({ src, zoom = 1.15, posY = "42%" }) => {
  const pm = usePunch(0, 13, [1, 1.06, 1.02, 1.09, 1.04]);
  const z = zoom * pm;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute", width: `${z * 100}%`, height: `${z * 100}%`,
          left: `${-(z - 1) * 50}%`, top: `${-(z - 1) * 50}%`,
          objectFit: "cover", objectPosition: `50% ${posY}`,
          filter: "grayscale(1) contrast(1.45) brightness(0.85)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: C.cor2, opacity: 0.78, mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

/* ================================================================= SCRIM ====
   Faixa de leitura. O texto TEM que terminar antes do fim da parte solida. */
export const ScrimTopo: React.FC<{ h?: number; cor?: string }> = ({ h = 780, cor = C.cor2 }) => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: `linear-gradient(to bottom, ${cor} 0%, ${cor} 60%, rgba(0,0,0,0) 100%)` }} />
);
export const ScrimBase: React.FC<{ h?: number }> = ({ h = 620 }) => (
  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "linear-gradient(to top, rgba(20,0,24,0.95) 0%, rgba(20,0,24,0.65) 55%, rgba(20,0,24,0) 100%)" }} />
);

/* ==================================================== 1) NAME LETTERING ====
   "lettering com nome": nome em lettering grande + cargo em capsula.
   Para lower-third de entrevista/documentario.                             */
export const NameLettering: React.FC<{
  nome: string; cargo?: string;
  nomeSize?: number; corNome?: string; corCargo?: string;
  align?: "left" | "right" | "center"; top?: number;
}> = ({ nome, cargo, nomeSize = 104, corNome = C.branco, corCargo = C.cor3, align = "left", top = SAFE.top + 20 }) => {
  const a = usePop(6, 0, 60);
  const b = usePop(16, 0, 60);
  return (
    <div
      style={{
        position: "absolute", top, left: SAFE.side, right: SAFE.side,
        display: "flex", flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
      }}
    >
      <div style={a}><Line text={nome} size={nomeSize} fill={corNome} align={align} /></div>
      {cargo ? (
        <div style={{ ...b, marginTop: 12 }}>
          <Plaque bg={corCargo} color={C.branco} size={34} rotate={-1}>{cargo}</Plaque>
        </div>
      ) : null}
    </div>
  );
};

/* ======================================================== 2) TITLE CARD ====
   Cartela de titulo: 2-4 linhas centradas, burst ATRAS do texto.
   cores[] = uma cor por linha (a 1a costuma ser o destaque).
   ⚠️ A linha e um SUBCOMPONENTE: hooks dentro de .map() quebram.            */
const TitleLine: React.FC<{ i: number; text: string; size: number; fill: string; align: "left" | "right" | "center" }> = ({
  i, text, size, fill, align,
}) => {
  const st = usePop(8 + i * 6, 0, 60);
  return (
    <div style={st}>
      <Line text={text} size={size} fill={fill} align={align} />
    </div>
  );
};

export const TitleCard: React.FC<{
  linhas: string[]; cores: string[];
  sizes?: number[]; burstColor?: string; burstSize?: number;
  top?: number; align?: "left" | "right" | "center";
}> = ({ linhas, cores, sizes, burstColor = C.cor4, burstSize = 1400, top = SAFE.top + 20, align = "center" }) => {
  return (
    <>
      <Burst size={burstSize} color={burstColor} centerY={top + 300} delay={4} spikes={12} rot={-3} />
      <div
        style={{
          position: "absolute", top, left: SAFE.side, right: SAFE.side,
          display: "flex", flexDirection: "column",
          alignItems: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        }}
      >
        {linhas.map((t, i) => (
          <TitleLine key={i} i={i} text={t} size={sizes?.[i] ?? 150} fill={cores[i % cores.length]} align={align} />
        ))}
      </div>
    </>
  );
};

/* ========================================================= 3) LIST STACK ===
   Lista: cada item entra em sequencia, em capsula. Item pode ter numero.
   stagger = frames entre um item e o proximo.                             */
const ListItem: React.FC<{ i: number; text: string; numerado: boolean; size: number; stagger: number; bg: string }> = ({
  i, text, numerado, size, stagger, bg,
}) => {
  const st = usePop(8 + i * stagger, i % 2 ? 1.5 : -1.5, 50);
  return (
    <div style={st}>
      <Plaque bg={bg} color={C.branco} size={size}>
        {numerado ? `${i + 1}. ${text}` : text}
      </Plaque>
    </div>
  );
};

export const ListStack: React.FC<{
  itens: string[]; cores?: string[]; numerado?: boolean;
  size?: number; stagger?: number; top?: number; gap?: number;
}> = ({ itens, cores, numerado = true, size = 40, stagger = 14, top = SAFE.top + 40, gap = 14 }) => {
  const palette = cores ?? [C.cor3, C.cor4, C.cor1, C.cor2];
  return (
    <div style={{ position: "absolute", top, left: SAFE.side, right: SAFE.side, display: "flex", flexDirection: "column", alignItems: "center", gap }}>
      {itens.map((t, i) => (
        <ListItem key={i} i={i} text={t} numerado={numerado} size={size} stagger={stagger} bg={palette[i % palette.length]} />
      ))}
    </div>
  );
};
