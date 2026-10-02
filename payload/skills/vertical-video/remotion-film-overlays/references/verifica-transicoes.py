"""Prova que as transicoes funcionam: mede a cobertura de branco por frame.

Curva correta = 0% no comeco, ~100% no MEIO (o corte), 0% no fim.
"""
import subprocess, os, sys, glob, shutil
import numpy as np
from PIL import Image

VID = "test_trans.mp4"
TMP = os.path.join(os.environ.get("LOCALAPPDATA", "/tmp"), "transframes")
NOMES = ["WipeAcross", "WipeDiagonal", "BurstCut", "CapsuleWipe", "Shutter", "StickerCard", "FlashCut"]
D = 16

if os.path.isdir(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP, exist_ok=True)

subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", VID,
                "-vf", "scale=270:480", os.path.join(TMP, "f%04d.png")], check=True)
files = sorted(glob.glob(os.path.join(TMP, "f*.png")))
print("frames extraidos:", len(files))

cov = []
for f in files:
    a = np.array(Image.open(f).convert("L"))
    # ignora o marcador verde do canto (x<60, y<60)
    a[:70, :70] = 0
    cov.append(float((a > 200).mean()))
cov = np.array(cov)

print()
print(f"{'#':<3}{'transicao':<15}  curva de cobertura (0..15)                      veredito")
print("-" * 100)
ok_all = True
for i, nome in enumerate(NOMES):
    seg = cov[i * D:(i + 1) * D]
    if len(seg) < D:
        continue
    ini, meio, fim = seg[0], seg[D // 2], seg[-1]
    pico = seg.max()
    # criterios: comeca baixo, cobre ~100% no meio, termina baixo
    c1 = ini < 0.15
    c2 = pico > 0.92
    c3 = fim < 0.15
    ok = c1 and c2 and c3
    ok_all = ok_all and ok
    barra = "".join("▁▂▃▄▅▆▇█"[min(7, int(v * 8))] for v in seg)
    print(f"{i+1:<3}{nome:<15}  {barra}  ini={ini:.2f} pico={pico:.2f}(f{int(seg.argmax())}) fim={fim:.2f}  "
          f"{'OK' if ok else 'FALHOU'}")

print()
print("VEREDITO GERAL:", "TODAS PASSARAM" if ok_all else "ALGUMA FALHOU")
sys.exit(0 if ok_all else 1)
