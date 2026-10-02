# Reference: extracting decupagem data from a Creative Direction Deck

[MARCA] deck pattern (useful for other clients who ship a similar deck):
- Storyboard is 16 blocks, each with columns: TEMPO · NARRAÇÃO (verbatim copy) · OBJETIVO ·
  IMAGEM IDEAL (with stock search terms like `buscar "aerial city night lights"`) · PLANO ·
  CÂMERA · TRILHA (%) · LETTERING · RÉGUA DE POSIÇÃO · NOTA DO DIRETOR.
- Cena hero (motion) is often a separate "Motion da X" section with frame-by-frame timing
  (e.g. 01:19,0 aparece · 01:21,5 capa revela · 01:24,0 assinatura ...).
- Copy is TRAVADA — never alter; mark as verbatim.
- Pausas desenhadas (silence) are explicit in the deck — encode as "NÃO preencher" risks.

Extract order:
1. Copy per block (verbatim).
2. PLANO + CÂMERA → Size/Lens/Angle/Camera move columns.
3. IMAGEM IDEAL search term → stock/IA source decision.
4. LETTERING table → separate lettering section with in/out TC.
5. NOTA DO DIRETOR → Risk column + continuity invariants.
6. Trilha % → intensity, not a shot spec.
