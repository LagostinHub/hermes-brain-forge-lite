"""Prova objetiva do ajuste de movimento.

BOUNCE, em uma frase: a escala vai, VOLTA, vai de novo. Então medimos a
largura do conteúdo frame a frame e contamos quantas vezes a direção INVERTE.

   ANTES (bouncy): 0 -> 1.35 -> 0.9 -> 1.12 -> 0.97 -> 1   = 4 reversões
   AGORA (seco)  : 0 -> 1 (e fica)                         = 0 reversões

Também confere a ASSIMETRIA: as 3 palavras do bloco 3 têm que entrar com
deslocamento horizontal DIFERENTE (sementes diferentes).
"""
import subprocess, os, glob, shutil, sys
import numpy as np
from PIL import Image

VID = "test_motion.mp4"
TMP = os.path.join(os.environ.get("LOCALAPPDATA", "/tmp"), "motionframes")
BLOCO = 50
MIN_COL = 3

if os.path.isdir(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP, exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", VID, "-vf", "scale=270:480",
                os.path.join(TMP, "f%04d.png")], check=True)
arrs = [np.array(Image.open(f).convert("RGB")).astype(int)
        for f in sorted(glob.glob(os.path.join(TMP, "f*.png")))]
H, W, _ = arrs[0].shape


def bbox(a, cor, tol=90):
    d = np.abs(a - np.array(cor)).sum(axis=2)
    mask = d < tol
    mask[: int(H * 0.08)] = False
    mask[int(H * 0.92):] = False
    cols = np.where(mask.sum(axis=0) >= MIN_COL)[0]
    if len(cols) == 0:
        return None
    return int(cols.min()), int(cols.max())


def reversoes(serie, min_delta_frac=0.025):
    """conta inversoes de direcao SIGNIFICATIVAS (>2.5% do pico).
    Variacao de poucos px e' o TREMDOR (jitter), nao bounce."""
    s = [v for v in serie if v > 0]
    if len(s) < 3:
        return 0
    md = max(s) * min_delta_frac
    dirs = []
    last = s[0]
    for v in s[1:]:
        if abs(v - last) >= md:
            dirs.append(1 if v > last else -1)
            last = v
    return sum(1 for i in range(1, len(dirs)) if dirs[i] != dirs[i - 1])


ROXO = (0x78, 0x05, 0x85)
PINK = (0xFD, 0x0E, 0x59)
AMAR = (0xFF, 0xCF, 0x00)
TEAL = (0x01, 0xB7, 0xA6)

print("=" * 92)
print("BLOCOS 1 e 2 — quantas vezes a escala INVERTE a direcao (= bounce)")
print("=" * 92)
res = {}
for n, nome, base, cor in [(1, "ANTES (bouncy)", 0, ROXO), (2, "AGORA (seco)", BLOCO, ROXO)]:
    serie = []
    for i in range(base, base + BLOCO):
        bb = bbox(arrs[i], cor)
        serie.append(0 if bb is None else bb[1] - bb[0] + 1)
    L = [v * 4 for v in serie]
    r = reversoes(L)
    res[n] = r
    pico = max(L)
    barra = "".join("▁▂▃▄▅▆▇█"[min(7, int(v / max(1, pico) * 8))] for v in L[:24])
    print(f"  {n}. {nome:<18} {barra}")
    print(f"     reversoes={r}  pico={pico}px  primeiros={L[:10]}")

print()
print("=" * 92)
print("BLOCO 3 — ASSIMETRIA: 3 palavras, 3 sementes -> deslocamento diferente")
print("=" * 92)
base = BLOCO * 2
centros = {}
for nome, cor in [("Um (pink)", PINK), ("Dois (amarelo)", AMAR), ("Três (teal)", TEAL)]:
    cs = []
    for i in range(base, base + BLOCO * 2):
        bb = bbox(arrs[i], cor)
        if bb:
            cs.append((bb[0] + bb[1]) / 2 / W)   # centro horizontal relativo
    centros[nome] = (min(cs), max(cs)) if cs else (0, 0)
    faixa = (max(cs) - min(cs)) if cs else 0
    print(f"  {nome:<18} centro x: min={centros[nome][0]:.3f} max={centros[nome][1]:.3f}  deslocamento={faixa:.3f}")

deslocamentos = [v[1] - v[0] for v in centros.values()]
assimetrico = len(set(round(d, 2) for d in deslocamentos)) >= 2 and max(deslocamentos) > 0.01

print()
ok1 = res[1] >= 3          # o ANTES tem que ser bouncy (senao o teste nao prova nada)
ok2 = res[2] <= 1          # o AGORA tem que ser seco
ok_all = ok1 and ok2 and assimetrico
print(f"  ANTES bouncy (reversoes>=3): {'OK' if ok1 else 'FALHOU'} ({res[1]})")
print(f"  AGORA seco   (reversoes<=1): {'OK' if ok2 else 'FALHOU'} ({res[2]})")
print(f"  ASSIMETRIA   (desloc. distintos): {'OK' if assimetrico else 'FALHOU'} {[round(d,3) for d in deslocamentos]}")
print()
print("VEREDITO:", "AJUSTE CONFIRMADO" if ok_all else "PRECISA REVER")
sys.exit(0 if ok_all else 1)
