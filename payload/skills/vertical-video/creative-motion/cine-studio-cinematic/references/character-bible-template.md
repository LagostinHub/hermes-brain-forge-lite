# Character Bible — Template

## Instruções
Criar UM arquivo por personagem antes de gerar qualquer cena.
O face lock (keyframe frontal em fundo neutro) é obrigatório.
IPAdapter usa essa keyframe como referência de identidade.

---

## Template

```json
{
  "project": "nome_do_projeto",
  "character": "NOME_DO_PERSONAGEM",
  "created": "2026-07-15",
  
  "identity": {
    "age_register": "jovem adulto / meia-idade / maduro",
    "bone_structure": "rosto oval, maçãs do rosto altas, mandíbula definida",
    "eyes": "castanhos escuros, formato amendoado, sobrancelhas arqueadas",
    "nose": "reto, ponte média, narinas médias",
    "lips": "lábios médios, lábio superior mais fino",
    "skin": "moreno claro, textura natural, leve viço",
    "hair": "preto, curto, textura lisa, penteado pra trás",
    "body": "magro, 1.75m, ombros médios, postura ereta",
    "markers": "piercing no nariz (lado esquerdo), cicatriz fina na sobrancelha direita",
    "default_expression": "neutra com suave tensão, olhar atento",
    "default_energy": "contido, movimentos medidos"
  },
  
  "keyframes": {
    "face_lock": "keyframes/char_NOME_front.png",
    "face_profile": "keyframes/char_NOME_profile.png",
    "face_threequarter": "keyframes/char_NOME_3q.png",
    "full_body": "keyframes/char_NOME_body.png",
    "outfit_casual": "keyframes/char_NOME_outfit1.png",
    "outfit_formal": "keyframes/char_NOME_outfit2.png"
  },
  
  "ipadapter": {
    "ref_image": "keyframes/char_NOME_ref.png",
    "weight_range": [0.5, 0.8],
    "embeds_scaling": "V only"
  },
  
  "looks": [
    {
      "name": "casual",
      "desc": "jaqueta jeans azul escura, camiseta branca, calça preta, tênis"
    },
    {
      "name": "formal",
      "desc": "terno cinza escuro, camisa branca, sem gravata, sapatos pretos"
    }
  ],
  
  "notes": "Tom de voz: seco, direto. Tique: passa a mão no cabelo quando nervoso."
}
```

---

## Prompt SDXL pra Face Lock

```text
cinematic portrait of [description], mid-gray seamless background,
soft diffused lighting from camera-left, plain black camisole/tank,
neutral expression, forward-facing, eyes looking slightly above camera,
natural skin texture, pores visible, subsurface scattering,
strand hair detail, fabric weave visible, no jewelry,
photorealistic, 8K detail, film grain, shallow depth of field,
--negative: plastic, cgi, render, artificial, makeup, jewelry, background
```

### Regras do Face Lock
- **Mid-gray seamless** (não branco) — fundo cinza neutro evita blowout nas bordas do rosto
- **Camiseta preta lisa** — baseline, sem estilo, só identidade
- **Soft lighting** de camera-left ou camera-right
- **Sem maquiagem, sem joias, sem styling** — só o rosto
- **Confirmar com usuário** antes de passar pro próximo passo