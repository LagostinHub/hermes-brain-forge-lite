#!/usr/bin/env python3
"""Medições para montar vídeo vertical (Reels/TikTok) no Remotion.

Três subcomandos, todos offline e determinísticos:

  size     Calibra fontSize p/ uma linha ocupar X px de largura
  cutout   Mede o bbox do alpha de um recorte -> headFrac / centerX / width / xShift
  sheet    Monta folha de contato com nomes (escolher foto sem abrir uma por uma)

Exemplos:
  python fit_text_and_measure_cutout.py size "MARCA" --target 952
  python fit_text_and_measure_cutout.py size "MARCA" "SOBRENOME?" "4000" --target 952
  python fit_text_and_measure_cutout.py cutout public/oc1.png public/oc2.png
  python fit_text_and_measure_cutout.py sheet photos --cols 7 --out cand/_sheet.png

Por que existe: chutar `fontSize` produz texto pequeno; assumir headFrac=0.43 posiciona
recorte errado. Ambos os valores variam POR IMAGEM e precisam ser medidos.
"""
from __future__ import annotations

import argparse
import glob
import os
import sys

from PIL import Image, ImageDraw, ImageFont
import numpy as np

# Fonte de display padrão do host (ajuste se mudar).
DEFAULT_FONT = r"[CODES]\hermes\project-motion\lettering-render\Montserrat-Black.ttf"
# Tracking típico do lettering destes vídeos (em em).
DEFAULT_TRACK = -0.035


def size_for(text: str, target_px: float, font_path: str = DEFAULT_FONT,
             track: float = DEFAULT_TRACK) -> float:
    """fontSize necessário para `text` ocupar `target_px` de largura.

    Mede com PIL na fonte real (não estima por nº de caracteres) e já desconta o
    tracking negativo, que encolhe a linha.
    """
    probe = 400  # tamanho grande p/ reduzir erro de arredondamento
    f = ImageFont.truetype(font_path, probe)
    width_per_px = (f.getlength(text) + len(text) * track * probe) / probe
    return target_px / width_per_px


def measure_cutout(path: str, alpha_threshold: int = 20) -> dict:
    """Mede o bbox do alpha de um PNG recortado.

    Retorna frações relativas à CAIXA da imagem (não ao quadro do vídeo):
      head_frac : onde o topo da pessoa está (0.43 é só um palpite comum — medir!)
      center_x  : centro horizontal do alpha
      width     : largura do alpha
      x_shift   : 0.5 - center_x  (aplicar como marginLeft: x_shift * imgW)
      aspect    : W/H da imagem (muda se o rembg trocou a altura)

    ⚠️ Se o recorte incluir CENÁRIO (mesa, notebook, cadeira), center_x não é o centro
    da PESSOA -> conferir o frame e corrigir x_shift à mão.
    """
    im = Image.open(path).convert("RGBA")
    al = np.array(im)[:, :, 3]
    ys, xs = np.where(al > alpha_threshold)
    if len(ys) == 0:
        raise ValueError(f"alpha vazio em {path} (imagem toda transparente?)")
    h, w = al.shape
    center_x = ((xs.min() + xs.max()) / 2) / w
    return {
        "file": os.path.basename(path),
        "size": f"{w}x{h}",
        "head_frac": ys.min() / h,
        "base_frac": ys.max() / h,
        "center_x": center_x,
        "width": (xs.max() - xs.min()) / w,
        "x_shift": 0.5 - center_x,
        "aspect": w / h,
    }


def contact_sheet(paths: list[str], cols: int, out: str,
                  cell=(200, 340), bg=(25, 25, 25)) -> str:
    """Grade com legenda. Usa `contain` (mostra a imagem inteira) p/ julgar enquadramento.

    Dica: rode com fundo magenta (`--bg 255,0,200`) em vez do padrão para inspecionar
    RECORTES (revela fundo grudado e 2ª pessoa).
    """
    cw, ch = cell
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cw, rows * (ch + 20)), bg)
    d = ImageDraw.Draw(sheet)
    for i, p in enumerate(paths):
        im = Image.open(p)
        rgba = im.mode in ("RGBA", "LA", "P")
        im = im.convert("RGBA" if rgba else "RGB")
        im.thumbnail((cw, ch))
        x = (i % cols) * cw + (cw - im.width) // 2
        y = (i // cols) * (ch + 20) + (ch - im.height) // 2
        sheet.paste(im, (x, y), im if rgba else None)
        d.text(((i % cols) * cw + 4, (i // cols) * (ch + 20) + ch + 3),
               f"{i} {os.path.basename(p)[:24]}", fill=(255, 255, 0))
    sheet.save(out)
    return out


def draw_safe_guide(path: str, out: str, scale_to: int = 440) -> str:
    """Desenha a guia de safe margins (Instagram 1080x1920) sobre um frame.

    Uso obrigatório antes de entregar: confirma com os próprios olhos que nada de
    texto/UI ficou fora. Nota: a guia NÃO é assinatura de conteúdo — só validação.
    """
    im = Image.open(path).convert("RGB")
    ImageDraw.Draw(im).rectangle([64, 250, 1080 - 64, 1920 - 400],
                                 outline=(0, 255, 0), width=5)
    im.resize((scale_to, int(scale_to * im.height / im.width))).save(out)
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("size", help="calibrar fontSize p/ largura-alvo")
    p.add_argument("texts", nargs="+")
    p.add_argument("--target", type=float, default=952.0, help="largura alvo em px (default 952 = safe de 1080)")
    p.add_argument("--font", default=DEFAULT_FONT)
    p.add_argument("--track", type=float, default=DEFAULT_TRACK)

    p = sub.add_parser("cutout", help="medir bbox do alpha de recortes")
    p.add_argument("paths", nargs="+")

    p = sub.add_parser("sheet", help="folha de contato")
    p.add_argument("paths", nargs="+", help="arquivos ou diretórios")
    p.add_argument("--cols", type=int, default=7)
    p.add_argument("--out", default="cand/_sheet.png")
    p.add_argument("--bg", default="25,25,25", help="R,G,B (use 255,0,200 p/ inspecionar recortes)")

    a = ap.parse_args()

    if a.cmd == "size":
        print(f"alvo {a.target:.0f}px  (tracking {a.track}em)")
        for t in a.texts:
            print(f"  {t:<16} -> fontSize {size_for(t, a.target, a.font, a.track):6.0f}px")
        print("\nRegra: palavra curta -> tamanho grande. Monte o headline em 2-3 linhas de largura cheia.")
        return 0

    if a.cmd == "cutout":
        for p_ in a.paths:
            m = measure_cutout(p_)
            print(f"{m['file']:<18} {m['size']:>10}  headFrac={m['head_frac']:.3f} "
                  f"cx={m['center_x']:.3f} w={m['width']:.3f} "
                  f"xShift={m['x_shift']:+.3f} aspect={m['aspect']:.4f}")
        print("\nConfira visualmente (sheet --bg 255,0,200): bbox com cenário invalida o center_x.")
        return 0

    if a.cmd == "sheet":
        files: list[str] = []
        for p_ in a.paths:
            if os.path.isdir(p_):
                for ext in ("jpg", "jpeg", "png", "webp"):
                    files += glob.glob(os.path.join(p_, f"*.{ext}"))
            else:
                files.append(p_)
        files = sorted(files)
        if not files:
            print("nenhuma imagem encontrada", file=sys.stderr)
            return 1
        bg = tuple(int(x) for x in a.bg.split(","))
        os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
        print(f"{len(files)} imagens -> {contact_sheet(files, a.cols, a.out, bg=bg)}")
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
