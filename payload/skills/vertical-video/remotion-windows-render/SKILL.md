---
name: remotion-windows-render
description: "Windows Remotion render via Node.js API when CLI fails."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows]
metadata:
  hermes:
    tags: [remotion, windows, render, workaround, node-api]
    source: session-learning
---


## CONHECIMENTO (vault `50-sistema/57-conhecimento/`)

| Pilar | MOC | Quando consultar |
|---|---|---|
| **Cinema Theory (mestre)** | [[57.00-cinema-theory-moc]] | Visão geral + ordem de leitura dos 7 pilares |
| **Edição** | [[57.22-edição-moc]] | Timing, ritmo, cortes, transições, QC de render |
| **Design** | [[57.25-design-moc]] | Tipografia, layout, hierarquia, motion design, safe zones |
| **Animação/Movimento** | [[57.24-animação-moc]] | 12 princípios, easing, timing, keyframes |
| **Áudio** | [[57.26-audio-moc]] | Sound design, música, loudness, sync, ProRes audio |
| **Cinematografia** | [[57.21-cinematografia-moc]] | Ótica, câmera, color space, alpha channel |

> Regra: nunca decida "de cabeça" — consulte o card do pilar; nunca cite o card sem executar pela tool certa.

# Remotion Windows Render

Use this skill when the Remotion CLI (`npx remotion render` / `npx remotion still`) fails on Windows with webpack bundle errors like `ENOENT: no such file or directory, open '...\remotion-webpack-bundle-...\bundle.js'`.

## Problem

On Windows, the Remotion CLI's webpack bundling step often fails to produce the expected `bundle.js` in the temp directory. The `npx remotion still` and `npx remotion render` commands will exit with ENOENT errors.

## Solution: Use the Node.js API directly

Bypass the CLI entirely and use `@remotion/bundler` + `@remotion/renderer` directly via a Node.js script.

### Step 1: Install @remotion/bundler

```bash
npm install @remotion/bundler
```

### Step 2: Create render.cjs

Create a file named `render.cjs` in the project root:

```javascript
const path = require('path');
const fs = require('fs');
const bundler = require('@remotion/bundler');
const renderer = require('@remotion/renderer');

async function main() {
  const entryPath = path.resolve(__dirname, 'src/index.ts');
  const outputPath = path.resolve(__dirname, 'output.mp4');

  console.log('🎬 Rendering Remotion composition...');
  console.log('📝 Entry:', entryPath);

  // Bundle the project
  console.log('\n📦 Bundling...');
  const bundleResult = await bundler.bundle({
    entryPoint: entryPath,
    onProgress: (progress) => {
      process.stdout.write(`\r  Bundling: ${progress}%`);
    },
  });
  console.log('\n✅ Bundle complete');

  // Get compositions
  console.log('\n📋 Getting compositions...');
  const compositions = await renderer.getCompositions({
    serveUrl: bundleResult,
    browser: 'chromium',
    schema: null,
  });

  console.log(`✅ ${compositions.length} composition(s) found`);
  compositions.forEach(c => console.log(`  - ${c.id} (${c.width}x${c.height}, ${c.durationInFrames}f)`));

  // Select composition (by ID or first available)
  const composition = compositions.find(c => c.id === 'YOUR_COMP_ID') || compositions[0];
  console.log(`\n🎯 Using composition: ${composition.id}`);

  // Render
  console.log('🎥 Rendering video...');
  await renderer.renderMedia({
    composition,
    serveUrl: bundleResult,
    codec: 'h264',
    outputLocation: outputPath,
    onProgress: ({ progress, encodedFrames, totalFrames }) => {
      if (totalFrames) {
        process.stdout.write(`\r  Render: ${(progress * 100).toFixed(1)}% (${encodedFrames}/${totalFrames} frames)`);
      }
    },
  });

  console.log('\n\n✅ Render complete!');
  console.log(`📹 Video saved to: ${outputPath}`);
  if (fs.existsSync(outputPath)) {
    console.log(`📁 Size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
```

### Step 3: Run

```bash
node render.cjs
```

## Important: src/index.ts must use registerRoot

The entry point MUST call `registerRoot` directly:

```typescript
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Composition";
import "./index.css";

registerRoot(RemotionRoot);
```

❌ WRONG: `export default RemotionRoot` (causes "undefined was passed to registerRoot")
✅ CORRECT: import and call `registerRoot(RemotionRoot)` directly

## Notes

- The `bundleResult` is a string (path to temp directory), not an object with `.url`
- `serveUrl` accepts this string directly
- Chrome Headless Shell is auto-downloaded on first run (~113MB)
- For still frames, use `renderer.renderStill()` instead of `renderMedia()`