/* =============================================================================
   MARCA — PALAVRA-CHAVE + LEGENDA
   Construídos do zero. Os templates de fora usam spring suave, contorno branco
   e glow — tudo PROIBIDO no DNA da marca. Aqui: stop motion em degraus,
   cápsula colorida, sombra SÓLIDA contrastante, e medição exata do texto.
   ============================================================================= */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { createTikTokStyleCaptions, type Caption as CaptionT } from "@remotion/captions";
import { MARCA, FONT, FONT_BLACK, SAFE, SAFE_W, sombraDe, ESPACO, TYPE, tetoHeadline } from "./marca-theme";
import { Burst } from "./overlays";
import { useSnapIn, useTwitch, useTwitchRot } from "./motion";
import { SafeStack, LARGURA_COLUNA } from "./layout";

/* ====================================================== PALAVRA-CHAVE ======
   Estoura na tela em STOP MOTION CURTO E DIRETO: 1 salto e PARA (sem bounce).
   Lado, rotação e tremor são SORTEADOS por `seed` — assimétrico e reproduzível.
                                                                              */

export const KeywordPop: React.FC<{
  texto: string;
  cor?: string;            // cor da letra
  sombra?: string;         // sombra sólida (default = contraste automático)
  capsule?: string;        // se definido, põe a palavra numa CÁPSULA dessa cor
  corCapsule?: string;     // cor da letra dentro da cápsula
  size?: number;           // força um tamanho; se omitir, calcula p/ caber
  largura?: number;        // largura-alvo quando size é omitido
  burstColor?: string;     // starburst ATRÁS (opcional)
  top?: number;            // default = centro vertical da área segura
  delay?: number;
  rotate?: number;
  fitExato?: boolean;      // usar fitText (medição real) em vez da estimativa
  seed?: number;           // semente da aleatoriedade (mude p/ variação diferente)
  travel?: number;         // quanto anda na entrada (menor = mais seco)
  poses?: number;          // 2 = bem seco | 3 = seco com um toque
  overshoot?: number;      // 1 = direto | 1.06 = leve firmeza (acima disso = bouncy)
  twitchAmp?: number;      // força do tremor assimétrico (0 = nenhum)
  inFlow?: boolean;        // true se vai DENTRO de um stack (sem position:absolute)
}> = ({
  texto,
  cor = MARCA.roxo,
  sombra,
  capsule,
  corCapsule = MARCA.branco,
  size,
  largura = SAFE_W,
  burstColor,
  top,
  delay = 4,
  rotate = -1.5,
  fitExato = true,
  seed = 0,
  travel = 70,
  poses = 2,
  overshoot = 1,
  twitchAmp = 3.5,
  inFlow = false,
}) => {
  /* --- movimento: entrada seca + tremor assimétrico --- */
  const entra = useSnapIn(delay, { travel, poses, overshoot, seed, rotate });
  const tw = useTwitch(delay, seed, twitchAmp);
  const twRot = useTwitchRot(delay, seed, 2.2);

  /* --- tamanho: medição real se pedido, senão estimativa segura --- */
  const nchar = texto.length;
  const sizeEstimado = Math.floor(largura / (nchar * 0.68));
  let fontSize = size ?? sizeEstimado;
  if (fitExato && size === undefined) {
    try {
      const r = fitText({
        text: texto.toUpperCase(),
        withinWidth: capsule ? largura - fontSize * 0.9 : largura,
        fontFamily: "Montserrat",
        fontWeight: String(FONT_BLACK),
        letterSpacing: "-0.035em",
        textTransform: "uppercase",
      });
      // usa o menor entre o medido e o teto estético
      fontSize = Math.floor(Math.min(r.fontSize, largura / 2.6));
    } catch {
      /* se a fonte ainda não carregou pra medição, fica na estimativa */
    }
  }

  const sombraFinal = sombra ?? sombraDe(capsule ? capsule : cor);
  const dx = Math.round(fontSize * 0.045);
  const dy = Math.round(fontSize * 0.055);
  const centerY = top ?? (SAFE.top + (1920 - SAFE.bottom - SAFE.top) / 2 - fontSize * 0.6);

  const letra: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: FONT_BLACK,
    fontSize,
    lineHeight: 0.92,
    letterSpacing: "-0.035em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };

  return (
    <>
      {!inFlow && burstColor ? (
        <Burst size={Math.round(fontSize * 5.2)} color={burstColor} centerY={centerY + fontSize * 0.55} delay={delay} spikes={12} rot={-3} />
      ) : null}

      <div
        style={
          inFlow
            ? {
                display: "flex",
                height: "auto",
                ...entra,
                transform: `${tw} rotate(${twRot.toFixed(2)}deg) ${entra.transform ?? ""}`,
              }
            : {
                position: "absolute",
                top: centerY,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                ...entra,
                transform: `${tw} rotate(${twRot.toFixed(2)}deg) ${entra.transform ?? ""}`,
              }
        }
      >
        {capsule ? (
          <div
            style={{
              backgroundColor: capsule,
              color: corCapsule,
              padding: `${fontSize * 0.28}px ${fontSize * 0.5}px`,
              borderRadius: fontSize * 0.18,
              boxShadow: `${dx}px ${dy}px 0 ${sombraFinal}`,
            }}
          >
            <span style={letra}>{texto}</span>
          </div>
        ) : (
          <span style={{ ...letra, color: cor, filter: `drop-shadow(${dx}px ${dy}px 0 ${sombraFinal})` }}>{texto}</span>
        )}
      </div>
    </>
  );
};

/* ============================================================== LEGENDA =====
   Legendas animadas (TikTok-style) com o DNA da marca: página de legenda em
   CÁPSULA sólida na base da área segura, palavra ativa destacada.
   Usa createTikTokStyleCaptions() do @remotion/captions (pacote oficial).
                                                                              */
export const Legendas: React.FC<{
  captions: CaptionT[];
  combineMs?: number;       // agrupa palavras próximas numa "página"
  size?: number;
  bg?: string;              // fundo da cápsula
  cor?: string;             // letra normal
  corAtiva?: string;        // letra da palavra que está sendo falada
  bottom?: number;
}> = ({
  captions,
  combineMs = 1200,
  size = 54,
  bg = MARCA.roxo,
  cor = MARCA.branco,
  corAtiva = MARCA.amarelo,
  bottom = SAFE.bottom + 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const { pages } = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: combineMs });
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.side,
        right: SAFE.side,
        bottom,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: bg,
          borderRadius: size * 0.3,
          padding: `${size * 0.3}px ${size * 0.55}px`,
          maxWidth: "100%",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: FONT_BLACK,
            fontSize: size,
            lineHeight: 1.15,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            whiteSpace: "pre",
            color: cor,
          }}
        >
          {page.tokens.map((tk, i) => {
            const ativa = ms >= tk.fromMs && ms < tk.toMs;
            return (
              <span key={i} style={{ color: ativa ? corAtiva : cor }}>
                {tk.text}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};

/* ========================================================= LISTA DE PALAVRAS ==
   Vários keywords numa coluna, COM REGRA DE DIAGRAMAÇÃO:
     - TODOS com o MESMO tamanho (o tamanho sai do item MAIS LONGO, então o
       mais longo cabe e nenhum item fica com escala diferente dos outros)
     - respiro igual entre um e outro (gap da escala ESPACO)
     - grupo CENTRALIZADO na área segura (margem de cima == de baixo)
   Antes eu posicionava cada um com `top` chumbado e largura-alvo diferente —
   dava 3 tamanhos de fonte e o primeiro solto lá em cima.
                                                                              */
export const KeywordList: React.FC<{
  itens: string[];
  size?: number;            // se omitir, calcula do item mais longo (recomendado)
  gap?: number;             // use ESPACO.*
  cores?: string[];         // uma cor por item (cicla)
  capsule?: string;         // se definido, TODOS em cápsula dessa cor
  inicio?: number;          // delay do 1º
  stagger?: number;         // frames entre um item e o próximo
  seed?: number;
  anchor?: "centro" | "topo" | "base";
}> = ({
  itens,
  size,
  gap = ESPACO.lg,
  cores,
  capsule,
  inicio = 6,
  stagger = 10,
  seed = 0,
  anchor = "centro",
}) => {
  /* o tamanho sai do item MAIS LONGO: garante que todos caibam com o MESMO corpo */
  const maisLongo = itens.reduce((a, b) => (a.length >= b.length ? a : b), "");
  const teto = Math.min(TYPE.palavraChave, tetoHeadline(maisLongo.length, LARGURA_COLUNA));
  const sizeFinal = size ?? teto;
  const paleta = cores ?? [MARCA.roxo, MARCA.pink, MARCA.teal, MARCA.amarelo];

  return (
    <SafeStack gap={gap} anchor={anchor}>
      {itens.map((t, i) => (
        <KeywordPop
          key={i}
          texto={t}
          size={sizeFinal}
          cor={capsule ? MARCA.branco : paleta[i % paleta.length]}
          capsule={capsule}
          delay={inicio + i * stagger}
          seed={seed + i * 7}
          inFlow
        />
      ))}
    </SafeStack>
  );
};

/* ================================================ MÁQUINA DE ESCREVER ========
   Typewriter com TEMPO POSTERIZADO (degraus, zero interpolação) e cada letra
   PISCANDO por toda a paleta da cliente até ASSENTAR na cor final.

   Como funciona, por letra:
     - ela aparece em  delay + i*porLetra  (uma atrás da outra, em degraus)
     - ao aparecer, pisca: amarelo -> roxo -> pink -> teal -> branco
     - depois de dar a volta na paleta, TRAVA na corFinal e não pisca mais
   Tudo com Math.floor -> a cor só troca em degraus de `flick` frames (posterize).

   USO: títulos, nomes próprios e destaques. NÃO usar em texto corrido/legenda —
   piscar em frase longa cansa a leitura.
   O texto ocupa o lugar final desde o começo (visibility) -> não reflui.
                                                                              */
export const Maquina: React.FC<{
  texto: string;
  size?: number;
  delay?: number;
  porLetra?: number;      // frames entre o aparecimento de uma letra e a próxima
  flick?: number;         // frames por piscada (STEP = bem seco)
  voltas?: number;        // quantas voltas na paleta antes de assentar (1 = passa por todas uma vez)
  paleta?: string[];
  corFinal?: string;
  peso?: number;
  sombra?: boolean;
}> = ({
  texto,
  size,
  delay = 4,
  porLetra = 2,
  flick = 3,
  voltas = 1,
  paleta = [MARCA.amarelo, MARCA.roxo, MARCA.pink, MARCA.teal, MARCA.branco],
  corFinal = MARCA.roxo,
  peso = FONT_BLACK,
  sombra = true,
}) => {
  const frame = useCurrentFrame();
  const n = texto.length;
  const sizeFinal = size ?? Math.min(TYPE.palavraChave, tetoHeadline(n, SAFE_W));
  const totalPiscadas = voltas * paleta.length;

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: FONT,
        fontWeight: peso,
        fontSize: sizeFinal,
        lineHeight: 1.12,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        whiteSpace: "pre",
      }}
    >
      {texto.split("").map((ch, i) => {
        const aparece = delay + i * porLetra;
        const t = frame - aparece;
        /* ainda não apareceu: ocupa o espaço (visibility) pra não refluir o texto */
        if (t < 0) {
          return (
            <span key={i} style={{ visibility: "hidden" }}>
              {ch}
            </span>
          );
        }
        const piscada = Math.floor(t / flick);          // <- POSTERIZE: só muda em degraus
        const assentou = piscada >= totalPiscadas;
        const cor = assentou ? corFinal : paleta[piscada % paleta.length];
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: cor,
              filter: sombra ? `drop-shadow(${Math.round(sizeFinal * 0.045)}px ${Math.round(sizeFinal * 0.055)}px 0 ${sombraDe(cor)})` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};
