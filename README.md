# tdn-render — The Daily Toon News render lane (GitHub Actions)

Renders TDN vertical toon shorts (Remotion + Three.js, 720x1280 @30fps design,
final render at scale 1.5 = 1080x1920) on GitHub Actions standard runners
(4 vCPU / 7 GB RAM, no GPU — WebGL runs on SwiftShader via `--gl=swangle`).

## Layout

- `engine/` — the toon-shorts engine (src, public, package.json + lockfile).
  Compositions are registered in `engine/src/Root.tsx`.
- `jobs/<job>/` — one folder per video:
  - `job.json` — composition id, output file name, still frames, render settings.
  - `public/` — the per-video assets staged into `engine/public/` at render
    time: `words.json` (word timings), `script.json` (caption tokens),
    `voice.wav` (trimmed voiceover), `mix.wav` (voice + SFX mix).
  - `script.txt`, `spoken.json`, `sfx-events.json`, `PLAN.md` — production record.

## Usage

Actions tab → **render** workflow → Run workflow:

- `job`: job folder name (e.g. `tdn-v5`)
- `mode`: `stills` (QA stills at scale 0.4) or `render` (final MP4)

The finished files land as a workflow artifact named `<job>-<mode>`.

## Adding a new video

1. Build the composition in `engine/src/videos/` and register it in `Root.tsx`.
2. Create `jobs/<new-job>/` with `job.json` + `public/` assets.
3. Run the workflow in `stills` mode first, check the frames, then `render`.
