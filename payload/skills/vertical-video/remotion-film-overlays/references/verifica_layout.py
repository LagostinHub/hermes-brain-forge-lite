"""Valida diagramação (bloco 3) e a máquina de escrever (bloco 4).

BLOCO 3 — KeywordList: as 3 cápsulas têm que ter
  1. o MESMO tamanho de fonte (altura ~igual)
  2. respiro IGUAL entre uma e outra (gap constante)
  3. o grupo CENTRALIZADO na área segura (margem de cima ~= margem de baixo)

BLOCO 4 — Maquina: a 1ª letra tem que PISCAR por várias cores da paleta
  (amarelo -> roxo -> pink -> teal -> branco) antes de ASSENTAR na cor final.
  Medimos a cor DOMINANTE não-fundo frame a frame e mapeamos pra paleta.
"""
import subprocess, os, glob, shutil, sys
import numpy as np
from PIL import Image

VID = "test_motion.mp4"
TMP = os.path.join(os.environ.get("LOCALAPPDATA", "/tmp"), "layframes")
BLOCO = 50
ROXO = (0x78, 0x05, 0x85)
BG_DIST = 120

if os.path.isdir(TMP):
    shutil.rmtree(TMP)
os.makedirs(TMP, exist_ok=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", VID, "-vf", "scale=270:480",
                os.path.join(TMP, "f%04d.png")], check=True)
arrs = np.stack([np.array(Image.open(f).convert("RGB")).astype(int)
                 for f in sorted(glob.glob(os.path.join(TMP, "f*.png")))])
H, W, _ = arrs[0].shape
FAC = 4  # downscale 1080/270


def bandas_verticais(a, lim=FAC * 2):
    """linhas onde ha' conteudo >= lim px, agrupadas em bandas continuas"""
    d = np.abs(a - np.array(ROXO)).sum(axis=2)
    m = d > BG_DIST
    n = m.sum(axis=1).astype(int)
    bands, inb = [], False
    for y in range(H):
        if n[y] >= lim and not inb:
            s, inb = y, True
        elif n[y] < lim and inb:
            bands.append((s, y - 1))
            inb = False
    if inb:
        bands.append((s, H - 1))
    return bands


print("=" * 92)
print("BLOCO 3 — KeywordList: mesmo tamanho / respiro igual / centrado")
print("=" * 92)
f = 195  # tudo assentado
b = bandas_verticais(arrs[f])
alturas = [(e - s + 1) for s, e in b]
# gap médio entre cápsulas ao longo de vários frames (o tremor individual some na média)
gaps_all = []
for ff in range(150, 199):
    bb = bandas_verticais(arrs[ff])
    if len(bb) == 3:
        gaps_all.append([(bb[i + 1][0] - bb[i][1] - 1) for i in range(2)])
gaps_mean = [round(np.mean(v), 1) for v in zip(*gaps_all)] if gaps_all else []
gaps_std = [round(np.std(v), 1) for v in zip(*gaps_all)] if gaps_all else []
ok_n = len(b) == 3
ok_alt = ok_n and (max(alturas) - min(alturas)) <= max(3, 0.12 * np.mean(alturas)) if alturas else False
ok_gap = bool(gaps_mean) and (max(gaps_mean) - min(gaps_mean) <= 1.5) and max(gaps_std) <= 2.5
grupo_topo, grupo_base = b[0][0], b[-1][1]
topo_m = grupo_topo * FAC - 250
base_m = 1520 - (grupo_base + 1) * FAC
ok_centro = abs(topo_m - base_m) <= 40
print(f"  bandas={len(b)}  alturas(px s/foto)={[a * FAC for a in alturas]}")
print(f"  espacamento medio entre capsulas(px)={[g * FAC for g in gaps_mean]}  std(px)={[s * FAC for s in gaps_std]}")
print(f"  margem topo={topo_m}px  margem base={base_m}px")
print(f"  [1] mesmo tamanho:  {'OK' if ok_alt else 'FALHOU'}   (dif {max(alturas) - min(alturas) if alturas else 0}px/<12%)")
print(f"  [2] respiro igual:   {'OK' if ok_gap else 'FALHOU'}   (medias {gaps_mean} tendem a um valor unico)")
print(f"  [3] centrado:        {'OK' if ok_centro else 'FALHOU'}")
print(f"  # bands==3:          {'OK' if ok_n else 'FALHOU'}")

print()
print("=" * 92)
print("BLOCO 4 — Maquina: letra PISCA pela paleta e depois assenta")
print("=" * 92)
PALETA = {"amarelo": (255, 207, 0), "roxo": (120, 5, 133), "pink": (253, 14, 89),
          "teal": (1, 183, 166), "branco": (255, 255, 255)}


def cor_dominante(a, xmax=None):
    if xmax is not None:
        a = a[:, :xmax]   # isola a 1ª letra (mais à esquerda)
    d = np.abs(a - np.array(ROXO)).sum(axis=2)
    m = d > BG_DIST
    if m.sum() == 0:
        return None
    px = a[m]
    q = px // 40 * 40  # binário p/ juntar antialias
    u, c = np.unique(q, axis=0, return_counts=True)
    return tuple(u[c.argmax()])


def nome_cor(c):
    if c is None:
        return "—"
    q = tuple(int(v // 40 * 40) for v in c)
    return min(PALETA, key=lambda k: sum(abs(x - y) for x, y in zip(q, PALETA[k])))


seq = []
for di in range(1, 22):          # abs frame 201..222
    c = cor_dominante(arrs[BLOCO * 4 + di], xmax=62)   # só a 1ª letra (esquerda)
    seq.append(nome_cor(c))
ordem_dedupe = []
for x in seq:
    if not ordem_dedupe or ordem_dedupe[-1] != x:
        ordem_dedupe.append(x)
piscou = {x for x in ordem_dedupe if x in ("amarelo", "pink", "teal", "branco")}
print(f"  flash do 1o caractere: {' '.join(f'{x:8s}' for x in seq)}")
print(f"  ordem (deduped):       {ordem_dedupe}")
print(f"  cores distintas piscadas: {len(piscou)}  -> {piscou}")
ok_flash = len(piscou) >= 3
# "assentou" = o ciclo de piscada PAROU (a cor final fica estável).
# Observacao: medimos a SOMBRA da letra (que e' cor viva cliente), nao a letra
# em si (corFinal=roxo = fundo -> some). Entao o sinal de "assentou" e' a cor
# ficar CONSTANTE, nao virar "—".
estavel = len(set(seq[-4:])) == 1 if len(seq) >= 4 else False
print(f"  [4] piscou >=3 cores:  {'OK' if ok_flash else 'FALHOU'}")
print(f"  [5] assentou (ciclo para): {'OK' if estavel else 'FALHOU'}   ultimas 4: {seq[-4:]}")

tudo = ok_n and ok_alt and ok_gap and ok_centro and ok_flash and estavel
print()
print("VEREDITO:", "DIAGRAMA��O + M�QUINA OK" if tudo else "PRECISA REVER")
sys.exit(0 if tudo else 1)