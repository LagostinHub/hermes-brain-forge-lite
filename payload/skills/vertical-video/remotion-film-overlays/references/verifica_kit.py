"""Valida a bancada do kit — MEDIÇÃO ROBUSTA (v2).

A v1 usava min/max de pixels por cor: 1 pixel de antialiasing estourava a
largura. E media a cor errada no bloco da legenda.

v2: detecta o CONTEUDO comparando com o FUNDO amostrado no canto, exigindo
um minimo de pixels por coluna (ignora outliers).
"""
import subprocess, os, glob, shutil, sys
import numpy as np
from PIL import Image

VID = "test_kit.mp4"
TMP = os.path.join(os.environ.get("LOCALAPPDATA", "/tmp"), "kitframes2")
BLOCO = 45
SEGS = [
    (1, "keyword nua + burst", 0, BLOCO),
    (2, "keyword em capsule", BLOCO, BLOCO),
    (3, "keyword sobre roxo", BLOCO * 2, BLOCO),
    (4, "legenda tiktok-style", BLOCO * 3, 180),
]
MIN_COL = 3          # minimo de pixels numa coluna p/ ela contar
DIST = 90            # distancia do fundo p/ contar como conteudo

if os.path.isdir(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP, exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", VID,
                "-vf", "scale=270:480", os.path.join(TMP, "f%04d.png")], check=True)
files = sorted(glob.glob(os.path.join(TMP, "f*.png")))
arrs = [np.array(Image.open(f).convert("RGB")).astype(int) for f in files]
H, W, _ = arrs[0].shape


def extensao(a, cor):
    """largura do conteudo da COR pedida (limiar de coluna mata outlier/gradiente)"""
    d = np.abs(a - np.array(cor)).sum(axis=2)
    mask = d < 90
    mask[: int(H * 0.10)] = False
    mask[int(H * 0.88):] = False
    cols = np.where(mask.sum(axis=0) >= MIN_COL)[0]
    if len(cols) == 0:
        return 0
    return int(cols.max() - cols.min() + 1)


print(f"{'#':<3}{'bloco':<24}{'largura do conteudo por frame':<30}{'veredito'}")
print("-" * 96)
ok_all = True
for n, nome, base, dur in SEGS:
    CORES={1:(0x78,0x05,0x85),2:(0xFD,0x0E,0x59),3:(0xFD,0x0E,0x59),4:(0xFD,0x0E,0x59)}
    pl = np.array([extensao(arrs[i], CORES[n]) * 4 for i in range(base, min(base + dur, len(arrs)))])
    pico = int(pl.max())
    distintos = len(set(pl[pl > 0].tolist()))
    zerados = int((pl == 0).sum())
    # quantos saltos DISCRETOS (variacao >= 5% do pico entre frames seguidos ativos)
    ativos = pl[pl > 0]
    saltos = int((np.abs(np.diff(ativos)) >= max(4, pico * 0.05)).sum()) if len(ativos) > 1 else 0
    barra = "".join("▁▂▃▄▅▆▇█"[min(7, int(v / max(1, pico) * 8))] for v in pl[:22])
    if n == 4:
        ok = pico > 100 and saltos >= 1
        extra = f"pico={pico}px saltos={saltos} ({'aparece e muda' if ok else 'sem variacao'})"
    else:
        ok = pico > 150 and distintos >= 3 and (zerados >= 1 or saltos >= 2)
        extra = f"zera={zerados}f pico={pico}px degraus={distintos} saltos={saltos}"
    ok_all = ok_all and ok
    print(f"{n:<3}{nome:<24}{barra:<30}{'OK' if ok else 'FALHOU'}  {extra}")

print()
print("VEREDITO:", "TODAS PASSARAM" if ok_all else "ALGUMA FALHOU")
for n, nome, base, dur in SEGS:
    pl = [extensao(arrs[i], CORES[n]) * 4 for i in range(base, min(base + 12, len(arrs)))]
    print(f"  bloco {n} primeiros frames: {pl}")
sys.exit(0 if ok_all else 1)
