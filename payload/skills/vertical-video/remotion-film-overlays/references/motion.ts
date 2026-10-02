/* =============================================================================
   MOVIMENTO — stop motion CURTO, DIRETO, ALEATÓRIO e ASSIMÉTRICO
   -----------------------------------------------------------------------------
   O problema do v1: tudo usava `spring()`, que ESTOURA e volta (bouncy).
   Aqui NÃO existe spring. A regra é:

     - 2 degraus e chega  ->  chega e PARA. Sem oscilar.
     - direção/rotação sorteadas (determinístico: mesmo frame = mesmo valor)
     - tremor ASSIMÉTRICO: a sequência nunca espelha, nunca volta ao zero

   Tudo derivado do frame quantizado (STEP), então é reproduzível no render.
   ============================================================================= */
import { useCurrentFrame, useVideoConfig } from "remotion";

export const STEP = 3; // 30fps -> 10 poses/s. 4 = mais travado ainda.

/* --------------------------------------------------------------- sortear -- */
/** ruído determinístico: mesmo `seed` -> mesmo valor, sempre. */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
/** inteiro sorteado (direção, sinal, índice) */
export const rndInt = (seed: number, n: number) => Math.floor(rnd(seed) * n) % n;

/* ------------------------------------------------------------------ passo -- */
/** frame quantizado (a base de TUDO aqui) */
export function useStep(delay = 0, step = STEP) {
  const f = useCurrentFrame();
  return Math.floor(Math.max(0, f - delay) / step) * step;
}

/* ------------------------------------------------------------- chegada ---- */
/**
 * ENTRADA CURTA E DIRETA. Sem bounce: 1 salto -> chegou -> para.
 *   poses = 2  -> pula 72% do caminho no 1º degrau e chega no 2º (bem seco)
 *   poses = 3  -> mais suave, ainda sem estouro
 * `overshoot` <= 1.02 mantém "direto". Acima disso volta a ficar elástico.
 * O lado e a rotação são SORTEADOS por `seed` (assimetria).
 */
export function useSnapIn(
  delay = 0,
  opts: { travel?: number; poses?: number; overshoot?: number; seed?: number; rotate?: number } = {}
) {
  const { travel = 70, poses = 2, overshoot = 1, seed = 0, rotate = 0 } = opts;
  const t = useStep(delay);
  if (t <= 0) {
    return { opacity: 0, transform: "none" } as React.CSSProperties;
  }
  const side = rnd(seed) > 0.5 ? 1 : -1;          // de que lado vem
  const updown = rnd(seed + 17) > 0.6 ? 1 : -1;   // e um pouco pra cima ou pra baixo
  const rotBase = rotate + (rnd(seed + 31) - 0.5) * 6; // rotação sorteada
  const stepIdx = Math.floor(t / STEP);
  const p = Math.min(1, stepIdx / poses);
  // chegada DIRETA: ainda no 1º degrau já está quase lá
  const k = p >= 1 ? 1 : 0.74 + rnd(seed + 53) * 0.18;
  const s = p >= 1 ? 1 : overshoot * (0.96 + rnd(seed + 71) * 0.06);
  const dx = (1 - k) * travel * side;
  const dy = (1 - k) * travel * 0.45 * updown;
  const rot = rotBase * (1 - k) + (rnd(seed + 91) - 0.5) * 2.5 * (1 - k);
  return {
    opacity: 1,
    transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`,
  } as React.CSSProperties;
}

/* --------------------------------------------------------------- tremor --- */
/**
 * Tremor ASSIMÉTRICO de stop motion. A sequência não espelha e não passa pelo
 * zero: o elemento fica levemente fora de eixo o tempo todo (parece filmado
 * quadro a quadro, não animado).
 */
const SEQ_X = [-1, 0.55, -0.35, 1.1, -0.8, 0.25, -1.15, 0.7];
const SEQ_Y = [0.8, -1, 0.4, -0.6, 1.05, -0.25, 0.55, -0.95];

export function useTwitch(delay = 0, seed = 0, amp = 3.5) {
  const t = useStep(delay);
  if (t <= 0) return "";
  const i = Math.floor(t / (STEP * 2));
  const j = Math.floor(t / (STEP * 3) + rndInt(seed, 8));
  const x = SEQ_X[(i + rndInt(seed, 8)) % SEQ_X.length] * amp;
  const y = SEQ_Y[j % SEQ_Y.length] * amp * 0.6;
  return `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
}

/** rotação que "trava" em valores aleatórios (não gira suave) */
export function useTwitchRot(delay = 0, seed = 0, amp = 2.2) {
  const t = useStep(delay);
  if (t <= 0) return 0;
  const i = Math.floor(t / (STEP * 4) + rndInt(seed + 5, 7));
  const v = (rnd(i * 3.7 + seed) - 0.5) * 2;
  return v * amp;
}

/* ---------------------------------------------------------- punch discreto -- */
/**
 * Série de ESCALA discreta, sem bounce: mantém a pose por alguns frames e
 * então SALTA pra próxima. Usado pra dar vida a elementos parados (ex: foto).
 */
export function usePunchSteps(delay = 0, seed = 0, base = 1, amp = 0.035) {
  const t = useStep(delay);
  if (t <= 0) return base;
  const i = Math.floor(t / (STEP * 3));
  // varia pra cima OU pra baixo, nunca volta pro 1 exato
  const v = base + (rnd(i * 2.3 + seed) * 2 - 0.6) * amp;
  return v;
}

/* ------------------------------------------------------------- corte seco -- */
/** fade -> corte seco (0 até o primeiro degrau, depois 1) */
export function useCut(delay = 0) {
  return useStep(delay) <= 0 ? 0 : 1;
}

/* ============================================================================
   PRESETS — perfis de "quanto de bounce" pro cliente escolher
   ============================================================================ */
export const MOTION = {
  /** bem seco: 1 salto, chega e trava (o que o dono pediu) */
  seco: { poses: 2, overshoot: 1, travel: 70 },
  /** seco com um toque: 3 degraus, sem estouro */
  seco3: { poses: 3, overshoot: 1, travel: 80 },
  /** meio-termo: leve estouro de 6% (regra do "direto", sem virar elástico) */
  firme: { poses: 2, overshoot: 1.06, travel: 90 },
} as const;
