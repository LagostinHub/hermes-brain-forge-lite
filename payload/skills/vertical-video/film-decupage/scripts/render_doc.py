#!/usr/bin/env python
"""Renderiza documento HTML do cliente em PNGs (por bloco) + PDF paginado em 9:16.

Validado 12/09/2026 (Windows 11 + git-bash). Uso:

    python render_doc.py <out_dir> <arquivo.html> [...]

- Gera, para CADA html passado, um PNG vertical em 2x, com o branco de baixo recortado.
  O padrão que funciona para aprovação de cliente é: 1 HTML por bloco (o primeiro já traz o hero)
  -> 1 PNG por bloco para mandar no WhatsApp.
- Gera UM PDF a partir do PRIMEIRO html (o documento completo), com a paginação definida no
  @page do próprio HTML (ex: 114mm x 203mm = 9:16, um card por página, break-inside:avoid).
- Confere a contagem de páginas e quanto texto caiu na última página (página final só com rodapé
  = defeito; aponte para o usuário em vez de entregar).

Requisitos: Pillow (recorte) e, opcionalmente, pypdf para a conferência de páginas.
"""
import os
import subprocess
import sys

BROWSERS = [
    r"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    r"C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    r"C:/Users/%s/AppData/Local/Google/Chrome/Application/chrome.exe" % os.environ.get("USERNAME", ""),
    r"C:/Program Files/Google/Chrome/Application/chrome.exe",
    r"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
]

def find_browser():
    for b in BROWSERS:
        # ATENCAO: caminho Windows nativo ("C:/..."). Caminho estilo MSYS ("/c/Program Files/...")
        # devolve False silenciosamente no Python nativo.
        if os.path.exists(b):
            return b
    raise SystemExit("nenhum browser headless encontrado — ajuste BROWSERS")

def url_of(path):
    return "file:///" + os.path.abspath(path).replace("\\", "/").replace(" ", "%20")

def shot(exe, html, png, width=430, height=3400, scale=2):
    subprocess.run([exe, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--force-device-scale-factor=%d" % scale,
                    "--window-size=%d,%d" % (width, height),
                    "--screenshot=%s" % png, url_of(html)], check=True, timeout=300)
    return png

def trim(png):
    from PIL import Image, ImageChops
    im = Image.open(png).convert("RGB")
    bg = im.getpixel((4, im.height - 4))
    diff = ImageChops.difference(im, Image.new("RGB", im.size, bg)).convert("L").point(lambda x: 255 if x > 6 else 0)
    bb = diff.getbbox()
    if bb:
        im = im.crop((0, 0, im.width, min(im.height, bb[3] + 24)))
    im.save(png, optimize=True)
    return im.size

def to_pdf(exe, html, pdf):
    subprocess.run([exe, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=9000", "--print-to-pdf=%s" % pdf, url_of(html)],
                   check=True, timeout=300)
    return pdf

def report_pages(pdf):
    try:
        import pypdf
    except ImportError:
        print("  (pypdf ausente: pip install pypdf para conferir as paginas)")
        return None
    r = pypdf.PdfReader(pdf)
    print("  PDF: %d pagina(s)" % len(r.pages))
    last = r.pages[-1].extract_text().strip()
    print("  ultima pagina: %d chars -> %s" % (len(last), last[:70].replace(chr(10), " ")))
    if len(last) < 120:
        print("  ATENCAO: ultima pagina quase vazia (provavel defeito de paginacao) — ajuste @page/break-inside.")
    return len(r.pages)

def main(argv):
    if len(argv) < 3:
        raise SystemExit(__doc__)
    out_dir, htmls = argv[1], argv[2:]
    os.makedirs(out_dir, exist_ok=True)
    exe = find_browser()
    print("browser:", exe)
    for h in htmls:
        name = os.path.splitext(os.path.basename(h))[0]
        png = os.path.join(out_dir, name + ".png")
        shot(exe, h, png)
        w, hh = trim(png)
        print("  %s -> %dx%d px, %d KB" % (os.path.basename(png), w, hh, os.path.getsize(png) // 1024))
    pdf = os.path.join(out_dir, os.path.splitext(os.path.basename(htmls[0]))[0] + ".pdf")
    to_pdf(exe, htmls[0], pdf)
    print("  %s -> %d KB" % (os.path.basename(pdf), os.path.getsize(pdf) // 1024))
    report_pages(pdf)
    print("\nSEMPRE conferir o render com screenshot + vision antes de mandar para o cliente.")

if __name__ == "__main__":
    main(sys.argv)
