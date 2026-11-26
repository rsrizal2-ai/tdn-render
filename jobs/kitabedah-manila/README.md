# Kitabedah job — "Bedah Kasus: Kantor Polisi Palsu di Manila"

Self-contained GitHub Actions job for the kitabedah (anatomy-film) pipeline.
The existing `render.yml` cannot run this: its steps are hard-wired to the
Remotion engine (npm ci in engine/, `remotion render` of a composition), while
this film is an HTML page recorded frame-by-frame in headless Chrome
(`record-landscape.mjs` drives `window.__film.seek(t)`), then mixed with
`mix.py` and muxed.

## BLOCKER (why this is not live yet)

A NEW workflow file is required (`.github/workflows/kitabedah.yml`), and the
classic PAT used from this machine has **no `workflow` scope** — pushing a new
or changed workflow file via git is rejected by GitHub. As with `render.yml`
before it, the workflow must be created once through the GitHub web UI:

1. Open https://github.com/rsrizal2-ai/tdn-render → Actions → "New workflow"
   → "set up a workflow yourself".
2. Name the file `kitabedah.yml` and paste the contents of
   `WORKFLOW-kitabedah.yml` in this folder.
3. Commit it in the web UI. After that, the job folder (this directory) can be
   pushed normally and dispatched with job = `kitabedah-manila`.

## Job contents

- `film.html` — the whole film page (figures + timeline + driver, inlined)
- `record-landscape.mjs` — kit recorder adapted to 960x540 @2x = 1920x1080
- `mix.py` — kit sound mixer (narration + restrained bed/SFX, -14 LUFS)
- `film/timeline.json` — mix timeline (narration file, sfx, bed)
- `voice/vo-full.wav` — Indonesian narration (Helio avocado_v2:MAI_03),
  generated locally; per-beat files + beats.json live in
  ~/workspace/kitabedah-manila/voice/

## Run

Actions → kitabedah → Run workflow → job: kitabedah-manila.
Artifact `bedah-kasus-manila` = final MP4 (H.264, 1920x1080, 30 fps, ~8.8 min).
