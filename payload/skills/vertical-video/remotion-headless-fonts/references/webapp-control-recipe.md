# Web-app control surface for Remotion letterings (recipe)

Verified 2026-08-21 on `[PASTA_PROJETO]` (Remotion 4.0.500, Node 24). Drives any
parametric Remotion composition from an HTML editor via the CLI.

## Server (`cliente-control-server.mjs`)
```js
import http from "http";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, ".."); // [projeto-motion]
const PORT = 4789;
const OUT = path.join(__dirname, "render_out");
fs.mkdirSync(OUT, { recursive: true });
const HTML = fs.readFileSync(path.join(__dirname, "cliente_control.html"), "utf8");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(HTML);
    return;
  }
  if (req.method === "POST" && req.url === "/render") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        const { compId, props, frame = 30 } = JSON.parse(body);
        const outFile = path.join(OUT, `${compId}_${Date.now()}.png`);
        const propsFile = path.join(OUT, `props_${Date.now()}.json`);
        fs.writeFileSync(propsFile, JSON.stringify(props)); // --props-file (robust)
        const cli = path.join(PROJECT, "node_modules", "@remotion", "cli", "remotion-cli.js");
        const entry = path.join(PROJECT, "src", "letteringV2Entry.tsx");
        const args = [
          "still", entry, compId, outFile,
          "--frame", String(frame), "--props-file", propsFile, "--timeout", "120000",
        ];
        execFile("node", [cli, ...args], { cwd: PROJECT, timeout: 180000 }, (err, _o, stderr) => {
          if (err) { res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: stderr || err.message })); return; }
          const b64 = fs.readFileSync(outFile).toString("base64");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ image: `data:image/png;base64,${b64}` }));
        });
      } catch (e) { res.writeHead(400, { "Content-Type": "application/json" });
                   res.end(JSON.stringify({ error: e.message })); }
    });
    return;
  }
  res.writeHead(404); res.end("not found");
});
server.listen(PORT, () => console.log(`[Cliente] control em http://localhost:${PORT}`));
```

## HTML editor (`cliente_control.html`)
- `<select>` de archetype (compId) → `v2-block-214`, `v2-stack-349`, `v2-twoword-559`,
  `v2-branded-598`, `v2-cinematic-368`, `v2-curriculum`, `v2-pushin-4000`
- `<textarea>` linhas: `texto|peso|cor|tamanho` (uma por linha; peso Black/Medium/ExtraBold)
- inputs: cor texto, fundo, glow on/off, frame (slider), stagger
- botão POST `/render` com `{ compId, props:{archetype,lines,color,glow,bg}, frame }`
- `<img id="preview">` recebe o `data:image/png;base64` retornado

## Parametric component pattern (`[Cliente]LetteringV2.tsx`)
- Um componente `[Cliente]LetteringV2` com prop `archetype` (switch) + `lines[]` + `color` + `glow` + `bg`.
- Subcomponentes por archetype: `BlockSweep` (varredura vertical), `StaggerStack` (tópicos),
  `StaggerStack twoWord` (compromisso), `Branded` (logo+glow+retângulo), `Cinematic3D` (push-in Z),
  `Curriculum` (cargo+descrição 2 linhas), `PushIn` (Z profundo tipo 4000).
- Cada subcomponente usa `useCurrentFrame()` + `interpolate()` para timing; `spring()` para bounce.
- Registrar cada archetype como `<Composition>` em `[Cliente]LetteringV2Root.tsx` (entry isolado
  `letteringV2Entry.tsx` — NÃO importar o root antigo que puxa SpaceGrotesk da rede e quebra).
- FONTES: ver bug em SKILL.md — use `@remotion/google-fonts/montserrat` + `--timeout=120000`
  OU fallback `fontFamily:"Montserrat, Arial, sans-serif"`.

## Run
```
cd [PASTA_PROJETO]/cliente-control
node cliente-control-server.mjs
# abre http://localhost:4789
```
