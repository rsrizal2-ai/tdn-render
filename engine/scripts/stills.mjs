// usage: node stills.mjs <engineDir> <compId> <outDir> <scale> <frame,frame,...>
// One bundle, many stills. Uses the GL backend from ../.gl-flag and the same browser rules as remotion.config.ts.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs"; import path from "node:path";
const [eng, id, out, scale, list] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.join(eng, "src/index.ts"), webpackOverride: (c) => c });
const browser = (() => {
  const c = [];
  if (process.env.BROWSER_EXECUTABLE) c.push(process.env.BROWSER_EXECUTABLE);
  try {
    for (const d of fs.readdirSync("/opt/pw-browsers").filter((x) => x.startsWith("chromium_headless_shell"))) {
      const b = `/opt/pw-browsers/${d}`; const s = fs.readdirSync(b).find((x) => x.startsWith("chrome-headless-shell"));
      if (s) c.push(`${b}/${s}/chrome-headless-shell`);
    }
  } catch { /* none */ }
  if (process.platform === "linux") c.push("/usr/bin/google-chrome");
  return c.find((p) => fs.existsSync(p)) ?? null; // null -> Remotion's own Chrome Headless Shell
})();
let gl = "angle"; try { gl = fs.readFileSync(path.join(eng, "../.gl-flag"), "utf8").trim(); } catch { /* default */ }
const composition = await selectComposition({ serveUrl, id, browserExecutable: browser, chromiumOptions: { gl } });
const t1 = Date.now();
for (const fr of list.split(",").map(Number)) {
  const s = Date.now();
  await renderStill({ serveUrl, composition, frame: fr, output: path.join(out, `f${String(fr).padStart(4, "0")}.png`), scale: Number(scale), browserExecutable: browser, chromiumOptions: { gl }, timeoutInMilliseconds: 240000 });
  console.log(`still ${fr}  ${((Date.now() - s) / 1000).toFixed(1)}s`);
}
console.log(`bundle ${((t1 - t0) / 1000).toFixed(1)}s, stills ${((Date.now() - t1) / 1000).toFixed(1)}s (gl=${gl})`);
