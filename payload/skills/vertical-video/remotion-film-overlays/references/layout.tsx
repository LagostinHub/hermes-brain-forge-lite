/* =============================================================================
   LAYOUT — diagramação com regras, não com número chumbado
   -----------------------------------------------------------------------------
   O erro que isso corrige: posicionar cada elemento com `top` fixo à mão. Isso
   não dá ritmo, não respira e desalinha quando o conteúdo muda de tamanho.

   Aqui:
     - quem manda no espaçamento é a ESCALA (ESPACO), nunca número inventado
     - `centro` centraliza o GRUPO na área segura -> margem de cima == de baixo
     - o tamanho de cada item é responsabilidade de quem chama (use a TYPE)
     - nunca posicionar filho com `top`; o container cuida disso

   Regras de design que o container garante:
     1. respiro: gap sempre da escala
     2. balanço: grupo centrado na área útil (não "mais pra cima")
     3. alinhamento: todos os filhos no mesmo eixo
     4. safe: nada sai de y 250..1520 / x 64..1016
   ============================================================================= */
import React from "react";
import { ESPACO, SAFE, AREA_UTIL } from "./marca-theme";

type Align = "center" | "flex-start" | "flex-end";

export const SafeStack: React.FC<{
  children: React.ReactNode;
  gap?: number;                 // use ESPACO.* (nunca um número solto)
  anchor?: "centro" | "topo" | "base";
  align?: Align;
  top?: number;                 // só quando anchor="topo" e você QUER ancorar
  left?: number;
  right?: number;
}> = ({ children, gap = ESPACO.lg, anchor = "centro", align = "center", top, left = SAFE.side, right = SAFE.side }) => {
  const base: React.CSSProperties = {
    position: "absolute",
    left,
    right,
    display: "flex",
    flexDirection: "column",
    alignItems: align,
    gap,
  };

  if (anchor === "base") {
    return (
      <div style={{ ...base, bottom: 1920 - AREA_UTIL.bottom, justifyContent: "flex-end" }}>{children}</div>
    );
  }
  if (anchor === "topo") {
    return <div style={{ ...base, top: top ?? AREA_UTIL.top, justifyContent: "flex-start" }}>{children}</div>;
  }
  /* centro: o flex centraliza o GRUPO dentro da altura útil -> balanço perfeito */
  return (
    <div style={{ ...base, top: AREA_UTIL.top, height: AREA_UTIL.altura, justifyContent: "center" }}>
      {children}
    </div>
  );
};

export const SafeRow: React.FC<{
  children: React.ReactNode;
  gap?: number;
  anchor?: "centro" | "topo" | "base";
  align?: Align;
  top?: number;
  wrap?: boolean;
}> = ({ children, gap = ESPACO.md, anchor = "centro", align = "center", top, wrap = false }) => {
  const base: React.CSSProperties = {
    position: "absolute",
    left: SAFE.side,
    right: SAFE.side,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: align === "flex-start" ? "flex-start" : align === "flex-end" ? "flex-end" : "center",
    gap,
    flexWrap: wrap ? "wrap" : "nowrap",
  };
  if (anchor === "base") {
    return <div style={{ ...base, bottom: 1920 - AREA_UTIL.bottom }}>{children}</div>;
  }
  if (anchor === "topo") {
    return <div style={{ ...base, top: top ?? AREA_UTIL.top }}>{children}</div>;
  }
  return <div style={{ ...base, top: AREA_UTIL.top, height: AREA_UTIL.altura }}>{children}</div>;
};

/* --------------------------------------------------------- largura da coluna --
   A largura útil de um item dentro do stack (a área segura menos as laterais). */
export const LARGURA_COLUNA = AREA_UTIL.largura;
