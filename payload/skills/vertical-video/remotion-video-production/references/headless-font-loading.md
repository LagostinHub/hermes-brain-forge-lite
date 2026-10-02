# Headless Font Loading — Windows Remotion `renderStill` (confirmed failures)

Project: `[PASTA_PROJETO]` (Remotion 4.0.500, Windows 11, git-bash/MSYS, Chromium headless).
Goal: render lettering stills with **Montserrat** (Black/Medium/ExtraBold) for the [Cliente] [Sobrenome] campaign — 100% local/OSS, no network.

## Symptom
Every still rendered with a **system serif fallback** (Times-like), never Montserrat. When the text container animated off-screen (e.g. `translateY(1425)`), the frame looked empty — that was a SEPARATE bug (animation moved text out of the 1080×1920 frame); once fixed, the serif fallback was the only remaining issue.

##5 approaches tried — ALL fail in headless `renderStill`

### 1. FontFace API + staticFile url()
```ts
const f = new FontFace("Montserrat", `url(${staticFile("fonts/Montserrat-Black.ttf")})`, {weight:"900"});
await f.load(); document.fonts.add(f);
```
Result: `f.load()` silently rejects (catch swallows). No font. Text paints serif.

### 2. fetch + arrayBuffer + FontFace
```ts
const buf = await (await fetch(staticFile(d.file))).arrayBuffer();
const face = new FontFace("Montserrat", buf, {weight:d.weight});
await face.load(); document.fonts.add(face);
```
Result: `fetch(staticFile(...))` fails in headless (path not resolvable as URL). Serif.

### 3. FontFace + data:base64 (file embedded, 1.2 MB string)
```ts
import { MONTSERRAT_BLACK } from "./montserratData"; // data:font/ttf;base64,....
new FontFace("Montserrat", MONTSERRAT_BLACK, {weight:"900"});
```
Result: still serif. Same FontFace API path as #1.

### 4. @font-face data: in <style dangerouslySetInnerHTML>
```tsx
<style dangerouslySetInnerHTML={{__html:`@font-face{font-family:'Montserrat';src:url(${dataUri}) format('truetype');font-weight:900;}`}} />
```
Result: Chromium headless blocks `data:` font URIs in @font-face. Serif.

### 5. @font-face in imported CSS (webpack asset)
```css
/* src/fonts.css */
@font-face { font-family:'Montserrat'; src: url(./montserrat/Montserrat-Black.ttf) format('truetype'); font-weight:900; }
```
```ts
import "./fonts.css";
```
Result: webpack embeds the ttf correctly (bundle valid), but the still still paints serif. The headless renderer simply does not apply web fonts in the single-frame still capture.

## Network check (CORRECTED 2026-08-23)
The headless Chromium **does attempt network**: `@remotion/google-fonts/montserrat` makes **90 network requests** to `fonts.gstatic.com` at render. DNS resolves and requests are attempted, but the download is slow/unreliable — sometimes completes <30s (Montserrat renders), sometimes times out (30s default, or >120s even with `--timeout 120000`). So CDN fonts are NOT dependable. Also: if any root component imports a CDN font (`@remotion/google-fonts/spacegrotesk`), the WHOLE `still` fails with `ERR_NAME_NOT_RESOLVED` before your component runs (see Isolated Entry below).

## 3 MORE approaches tried (2026-08-23) — ALL fail
### 6. file:// URI in FontFace
```ts
new FontFace("Montserrat", "url(file:///[PASTA_PROJETO]/public/fonts/Montserrat-Black.ttf)", {weight:"900"});
```
Result: Chromium headless logs `Browser failed to load file:///... (Font)` and falls back to serif. `file://` fonts are blocked in headless.

### 7. localhost HTTP fetch → arrayBuffer → FontFace
```ts
// a separate Node fontServer.mjs serves the .ttf on http://localhost:4890/fonts/X.ttf
const buf = await (await fetch("http://localhost:4890/fonts/Montserrat-Black.ttf")).arrayBuffer();
```
Result: `net::ERR_FAILED` — the headless render runs in an isolated network context and cannot reach even a localhost server running on the same machine. (Confirmed: the fontServer WAS listening; the fetch still failed.)

### 8. renderStill programmatic API (@remotion/renderer)
```ts
await renderStill({ entryPoint: dynamicEntryPath, compositionId:"dyn", output, frame, inputProps: props });
```
Result: **ignores entryPoint/inputProps entirely** — renders a STALE cached bundle (the text from a previously-bundled entry) regardless of the freshly-written dynamic entry. Same failure whether entryPoint is an absolute Windows path or a path relative to cwd, and with `webpackCacheDisabled:true`. The `remotion-cli still` command run INTERACTIVELY in a terminal works fine on the exact same file; the bug is specific to the programmatic API + server-child-process context.

## PITFALL — CLI as child process of a Node HTTP server renders STALE bundles
If you build a web app that shells out to `remotion-cli still` (or calls `renderStill`) from within an HTTP server, the headless renders a *cached* bundle and silently ignores your freshly-written dynamic entry — even though the identical command run manually in a terminal returns the correct content. Symptom: server returns a PNG with WRONG content (old hardcoded text) while `cli still <samefile>` manually returns correct content. Spawning via `C:\Program Files\Git\bin\bash.exe -c` instead of `cmd.exe` did NOT fix it. Workaround: shell out to the CLI from an interactive/foreground context, OR pre-bundle a fixed set of compositions (one per archetype) and drive them with `--props-file` rather than a freshly-written entry per request.

## What works
```ts
const FONT_FAMILY = "Montserrat, Arial, sans-serif"; // Arial = Windows system sans-serif
```
The still paints Arial (clean sans-serif, no serifs). Layout/color/animation fully validatable. Montserrat applies automatically when the font becomes available (system install in `C:\Windows\Fonts`, or a networked headless).

## Isolated entry (avoids CDN-font breakage)
If the root registers a component that imports `@remotion/google-fonts/spacegrotesk` (CDN), the entire `still` fails with `ERR_NAME_NOT_RESOLVED` before your component runs. Fix: create a separate entry that registers ONLY your compositions:
```tsx
// letteringV2Entry.tsx
import { registerRoot } from "remotion";
import { [Cliente]LetteringV2Root } from "./[Cliente]LetteringV2Root";
export const RemotionRoot = () => <[Cliente]LetteringV2Root />;
registerRoot(RemotionRoot);
```
Run: `node node_modules/@remotion/cli/remotion-cli.js still src/letteringV2Entry.tsx <compId> out.png --frame=30`

## Real delivery note
For final MP4 delivery where Montserrat MUST render: install the .ttf into `C:\Windows\Fonts` (needs admin + Chromium restart) OR test `remotion render` (full render path sometimes applies fonts the `still` path skips). Verify the first frame with vision_analyze before shipping.

## Font files kept in project
- `public/fonts/Montserrat-{Black,Medium,ExtraBold}.ttf` (reference + future system install)
- `src/montserrat/*.ttf` + `src/fonts.css` (webpack asset import — correct bundle even if headless won't paint)
