/* =============================================================================
   remotion-film-overlays — TRANSICOES v2 (modelo COBRE -> REVELA)
   -----------------------------------------------------------------------------
   v1 (descartada) tinha um defeito estrutural: a transicao so COBRIA a tela e
   parava — nunca revelava a cena seguinte, entao o "corte" nao existia.

   v2: toda transicao tem 2 FASES e e colocada ESPELHANDO O CORTE:
       |<- metade 1 ->|<-- metade 2 -->|
       cobre 0->100%   revela 100->0%

   USO (a Sequence tem que atravessar o ponto de corte):
     const CUT = 134;                       // frame onde a cena A acaba
     <Sequence from={CUT - 6} durationInFrames={12}>
       <WipeAcross color={C.cor1} />
     </Sequence>
   Em CUT-6 comeca a cobrir; em CUT a tela esta 100% coberta (corte invisivel);
   em CUT+6 esta revelada a cena B.
   ============================================================================= */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./overlays";

const STEP = 3; // mesma base do stop motion

/** progresso da transicao: 0 -> 1 -> 0 (cobre depois revela), em DEGRAUS.
 *  q = 0: nada na tela | q = 1: tela 100% coberta (o corte acontece aqui)   */
export function useCover(steps = 6) {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = Math.floor(f / STEP) * STEP;
  const half = Math.max(STEP, Math.round(durationInFrames / 2 / STEP) * STEP);
  const raw =
    d <= half
      ? d / half
      : 1 - (d - half) / Math.max(STEP, durationInFrames - half);
  const q = Math.min(1, Math.max(0, Math.floor(raw * steps) / steps));
  return q;
}

/** progresso LINEAR 0..1, degrau a degrau no TEMPO (para deslizes/sweeps).
 *  Nao quantiza a POSICAO — so o tempo. Assim o ponto de cobertura total
 *  (p = 0.5) e' sempre alcancado, em qualquer duracao.                     */
export function useT() {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = Math.floor(f / STEP) * STEP;
  return Math.min(1, d / Math.max(STEP, durationInFrames - STEP));
}

/* ---------------------------------------------------------------- 1) WIPE -- */
/** Bloco solido varrendo a tela UMA vez: entra de um lado, cobre no MEIO da
 *  transicao (o corte) e sai do outro. ⚠️ posicao = progresso MONOTONO,
 *  nunca o valor de cobertura (senao o bloco varre duas vezes: vai e VOLTA). */
export const WipeAcross: React.FC<{ color?: string; reverse?: boolean }> = ({ color = C.cor1, reverse = false }) => {
  const p = useT();                              // 0..1 monotonico (so o tempo em degraus)
  // bloco 150% + curso ±150%: garante cobertura TOTAL alguns frames (senao
  // a posicao central pode ser pulada e o corte aparece)
  const x = (p - 0.5) * 300;                     // -150 .. 0 .. +150
  return (
    <div
      style={{
        position: "absolute", top: 0, bottom: 0, width: "150%",
        left: `${reverse ? -x : x}%`, backgroundColor: color, pointerEvents: "none",
      }}
    />
  );
};

/* ------------------------------------------------------------- 2) DIAGONAL -- */
/** Faixa diagonal (tipo slaide) — mais dinamica que o bloco reto. */
export const WipeDiagonal: React.FC<{ color?: string; skew?: number }> = ({ color = C.cor2, skew = -16 }) => {
  const p = useT();
  const x = (p - 0.5) * 300;                     // -150 .. 0 .. +150 (bloco 150%)
  return (
    <div
      style={{
        position: "absolute", top: "-12%", bottom: "-12%", width: "150%",
        left: `${x}%`, backgroundColor: color, pointerEvents: "none",
        transform: `skewX(${skew}deg)`,
      }}
    />
  );
};

/* ---------------------------------------------------------------- 3) BURST -- */
/** Estouro: o starburst (vocabulario da marca) cresce ate cobrir e volta.
 *  SIZE alta de proposito: os VALES do poligono tambem tem que passar dos
 *  cantos do frame (diagonal 2203), senao os cantos ficam de fora.        */
export const BurstCut: React.FC<{ color?: string; spikes?: number; rot?: number; size?: number }> = ({
  color = C.cor1, spikes = 14, rot = -4, size = 3200,
}) => {
  const q = useCover(6);
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    const rad = i % 2 === 0 ? 50 : 36;           // vale em 0.72 do raio
    pts.push(`${50 + rad * Math.cos(a)},${50 + rad * Math.sin(a)}`);
  }
  return (
    <div
      style={{
        position: "absolute", width: size, height: size, left: "50%", top: "50%",
        marginLeft: -size / 2, marginTop: -size / 2,
        transform: `scale(${q}) rotate(${rot}deg)`, pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <polygon points={pts.join(" ")} fill={color} />
      </svg>
    </div>
  );
};

/* ----------------------------------------------------------- 4) CAPSULE ---- */
/** Colunas em forma de CAPSULA (vocabulario da marca), entrando escalonadas. */
export const CapsuleWipe: React.FC<{ color?: string; cols?: number; radius?: number }> = ({
  color = C.cor3, cols = 6, radius = 30,
}) => {
  const q = useCover(7);
  const st = 0.09;                       // atraso por coluna
  const span = 1 - (cols - 1) * st;      // normaliza p/ todas chegarem em 1
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: cols }).map((_, i) => {
        const local = Math.min(1, Math.max(0, (q - i * st) / span));
        return (
          <div
            key={i}
            style={{
              position: "absolute", top: 0, bottom: 0, width: `${100 / cols}%`, left: `${i * (100 / cols)}%`,
              backgroundColor: color, borderRadius: radius,
              transform: `scaleY(${local})`, transformOrigin: "50% 0%",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ 5) SHUTTER --- */
/** Fileiras fechando/abrindo alternadas (livro) — bem stop motion. */
export const Shutter: React.FC<{ color?: string; rows?: number }> = ({ color = C.cor2, rows = 8 }) => {
  const q = useCover(7);
  const h = 1920 / rows;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: 0, right: 0, top: i * h, height: h + 1,
            backgroundColor: color, borderRadius: h * 0.22,
            transform: `scaleX(${q})`, transformOrigin: i % 2 ? "right center" : "left center",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------- 6) STICKER -- */
/** Cartao com contorno grosso (efeito sticker) sobe cobrindo e sai por cima.
 *  Cartao 160% da altura + curso ±160%: garante cobertura TOTAL (mesma logica
 *  do wipe — sem isso a posicao central pode ser pulada).                  */
export const StickerCard: React.FC<{ color?: string; outline?: string; thick?: number }> = ({
  color = C.cor4, outline = C.branco, thick = 14,
}) => {
  const p = useT();
  const y = (p - 0.5) * 320;                     // -160 .. 0 .. +160 (% da altura)
  return (
    <div
      style={{
        position: "absolute", left: "-8%", right: "-8%", height: "160%", top: `${y}%`,
        backgroundColor: color, borderRadius: 48, border: `${thick}px solid ${outline}`,
        boxSizing: "border-box", pointerEvents: "none",
      }}
    />
  );
};

/* --------------------------------------------------------------- 7) FLASH -- */
/** Estouro rapido centrado no corte (nao rampa — pipoca). */
export const FlashCut: React.FC<{ color?: string; width?: number }> = ({ color = C.branco, width = 0.26 }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const d = Math.floor(f / STEP) * STEP;
  const mid = durationInFrames / 2;
  const raw = Math.max(0, 1 - Math.abs(d - mid) / Math.max(STEP, durationInFrames * width));
  const op = Math.round(raw * 5) / 5;            // degraus de 0.2
  return <AbsoluteFill style={{ backgroundColor: color, opacity: op, pointerEvents: "none" }} />;
};

/* --------------------------------------------------------- 8) PUNCH (hook) -- */
/** Par de hooks para transicao de ESCALA (nao cobre — empurra).
 *  Cena A: const s = usePunchOut(12)   -> 1 .. 1.45  (afunda na lente)
 *  Cena B: const s = usePunchIn(12)    -> 1.45 .. 1  (abre na lente)
 *  Aplique em <AbsoluteFill style={{ transform: `scale(${s})` }}>.          */
export const usePunchOut = (durationInFrames: number, to = 1.45) => {
  const t = useT();
  return 1 + (to - 1) * Math.min(1, t / (durationInFrames / 30));
};
export const usePunchIn = (durationInFrames: number, from = 1.45) => {
  const t = useT();
  return from - (from - 1) * Math.min(1, t / (durationInFrames / 30));
};

/* ============================================================================
   GUIA DE DURACAO (30fps) — quanto tempo cada transicao pede
   | tipo            | frames | observacao                                  |
   | WipeAcross      |  12-16 | o mais seguro e legivel                     |
   | WipeDiagonal    |  12-16 | mais dinamico, bom p/ corte de energia      |
   | BurstCut        |  14-18 | assinatura da marca; usar com moderacao     |
   | CapsuleWipe     |  16-20 | escalonado, precisa de tempo p/ ler          |
   | Shutter         |  12-16 | tatil, lembra quadro-a-quadro                |
   | StickerCard     |  14-18 | cartao subindo; bom p/ mudar de assunto      |
   | FlashCut        |   6-10 | pontuacao rapida, nao substitui transicao    |
   | PunchOut/In     |   8-14 | empurrao de escala; combina com Flash        |
   ============================================================================ */
