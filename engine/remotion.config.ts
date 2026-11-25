import { Config } from "@remotion/cli/config";
import fs from "node:fs";
Config.setEntryPoint("./src/index.ts");
// Browser: $BROWSER_EXECUTABLE if set, else a pre-installed headless Chromium (cloud boxes), else Remotion downloads
// its own Chrome Headless Shell (normal on macOS).
const cands = (() => {
  const list: string[] = [];
  if (process.env.BROWSER_EXECUTABLE) list.push(process.env.BROWSER_EXECUTABLE);
  try {
    for (const d of fs.readdirSync("/opt/pw-browsers").filter((x) => x.startsWith("chromium_headless_shell"))) {
      const b = `/opt/pw-browsers/${d}`; const sub = fs.readdirSync(b).find((x) => x.startsWith("chrome-headless-shell"));
      if (sub) list.push(`${b}/${sub}/chrome-headless-shell`);
    }
  } catch { /* none */ }
  if (process.platform === "linux") list.push("/usr/bin/google-chrome");
  return list;
})();
const found = cands.find((p) => p && fs.existsSync(p)); if (found) Config.setBrowserExecutable(found);
Config.setVideoImageFormat("jpeg"); Config.setJpegQuality(92);
