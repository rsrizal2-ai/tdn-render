# TDN v5 — "Taiwan's record rally lasted one day" — PLAN

## Facts (all checked in fifth-video/story.md)
- Tuesday 24 Nov: Taiex +3,310.46 pts (+8.99%) to 40,122.35 — largest one-day points gain on record (Focus Taiwan/CNA)
- TSMC = over 40% of Taiwan's market value, pinned at its +10% daily limit all day (close NT$2,230), ~1,600 pts of the gain
- Tuesday: Kospi +6.32% to 5,006.03, back above 5,000 (Yonhap)
- Wednesday 25 Nov morning: Taiex down as much as 3,440 pts intraday (low 36,681.90, below Monday's close 36,811.89) — the record gain erased in hours; second-largest intraday point drop ever
- Script: 89 words. Voiceover: Helio (avocado_v2:MAI_03), original 36.55 s, trimmed 30.51 s -> 918 frames @30fps (int(30.51*30)+3, same formula as v2/v3).
- Alignment: pocketsphinx via PYTHONPATH=~/workspace/.pylibs, align.py run manually (same as v3). spoken.json overrides: Taiex->"tie ex", TSMC->"tee ess em see", Kospi->"cos pee", one-day->"one day", toons->"tunes" (keys case-sensitive, matching the script). 92/92 display words aligned, last end 30.51 s.
- script.json: script.txt whitespace tokens minus the 4 bare "-" tokens = 92, matching words.json.
- Grammar: explainer (default). Ghost dissolves 0.2-0.3 s; flash into the S6 sign-off.
- Characters: analyst reused (orange hoodie, glasses — series continuity, S6 + S1). New one-scene looks: gondola trader (S2/S5, teal shirt), Seoul greeter (S4, purple hoodie).

## Beat sheet (EXACT word anchors from words.json, 30.51 s, 918 frames)
- S1 0-4.5s — "Taiwan's stock market just had the best day in its history. It lasted one day." (words 0-14, 0-4.30; "best day" 1.53-2.22, "history" ends 3.06, "lasted one day" 3.31-4.30)
- S2 4.5-11.9s — "On Tuesday, the Taiex rocketed three thousand three hundred ten points — up nine percent — the biggest one-day gain ever recorded." (words 15-34, 4.51-11.63; "rocketed" 5.89, "points" ends 8.48, "recorded" ends 11.63)
- S3 11.9-17.6s — "One company did the lifting: TSMC, forty percent of the whole market, pinned at its ten percent daily limit." (words 35-53, 11.86-17.59; "TSMC" 13.13-14.20, "forty percent" 14.20-14.83, "limit" ends 17.59)
- S4 17.6-21.7s — "Seoul partied too: the Kospi jumped six percent, back above five thousand." (words 54-65, 17.59-21.65; "Kospi" 18.79-19.23, "five thousand" 20.86-21.65)
- S5 21.7-27.9s — "Then came Wednesday: down three thousand four hundred forty points in one morning. The record — erased in hours." (words 66-83, 21.65-27.84; "Wednesday" 22.27-22.80, "down" 22.94, "points" ends 25.13, "erased" 26.68-27.13)
- S6 27.9-30.6s — "The Daily Toon News — the world, in toons." (words 84-91, 28.01-30.51)
CUTS = [0, 4.5, 11.9, 17.6, 21.7, 27.9, 30.6]; durationInFrames = 918.

### S1 0-4.5s — Taipei plaza, the giant chart board, a candle to the moon
- Ideas: (a) trading-floor bell ringing; (b) a rocket launch with a chart painted on it; (c) street plaza with a giant chart scoreboard: the line sits flat, then rockets off the top of the board at "best day", while a calendar page gets crossed out at "It lasted one day".
- PICK (c): the board carries the fact, the calendar carries the joke. Animated canvas chart (progress on "best day" 1.5-2.6s), confetti burst at "history" (3.06), calendar CanvasPlane flips a red X + "1 DAY" at 3.3s. Taipei-101-style tower silhouette behind. Camera: low push-in.

### S2 4.5-11.9s — the climb: a staircase mountain and a gondola ride to 40,122
- Ideas: (a) character climbs a giant green candle; (b) a staircase of green steps up a mountainside, a cable gondola carries the trader up the glowing line; (c) an escalator in a mall.
- PICK (b): height reads physically, no walk cycle needed. HUD chip counts "+0 -> +3,310 POINTS" over "three thousand three hundred ten points" (6.37-8.48). Flag "40,122" pops at the summit on "recorded" (11.1-11.6). Camera: rising follow-cam.

### S3 11.9-17.6s — one company did the lifting: the giant chip holds up the market
- Ideas: (a) a weightlifter character with a barbell labelled TSMC; (b) a colossal microchip with arms, Atlas-style, holding a platform that carries the whole market (mini buildings, mini chart, tiny cheering traders), straining and rising; (c) a crane lifting a chart.
- PICK (b): the 40% fact becomes a body. HUD chip "40% OF THE MARKET" (10-seg bar fills to 4) over 14.0-15.6s. At "limit" (17.06) a red "LIMIT +10%" stamp slams onto the platform with a camera impact. Camera: low angle, slow push-in (power).

### S4 17.6-21.7s — Seoul joins the party: the column through the 5,000 arch
- Ideas: (a) two flags planted side by side; (b) a bar column grows up through a finish-line arch banner "5,000", ribbons burst as it crosses; (c) a birthday cake with 5,000 candles.
- PICK (b): one rising move, one readable number. N-Seoul-Tower silhouette on a hill behind, balloons + grinning greeter in front. The column crosses the banner at "five thousand" (20.9). Camera: tilt-up following the column.

### S5 21.7-27.9s — Wednesday: the slide down, the record erased
- Ideas: (a) the S2 mountain in reverse, the gondola cable snaps; (b) a steep red slide: the trader sleds down past raining red candles while the summit flag shrinks behind; at the bottom the "RECORD +3,310" board cracks and is stamped "ERASED" on the word; (c) a balloon popping over Taipei.
- PICK (b): same world as S2, palette flipped to grey-red dawn — the reversal reads as the same mountain, ruined. HUD chip "-3,440 IN ONE MORNING" (23.2-25.6). Cam impact + crack at "erased" (26.68). Camera: high-to-low tilt following the slide.

### S6 27.9-30.6s — sign-off
- Ideas: (a) analyst at the TDN desk, teal-and-gold studio variant (new palette vs v3's blue-red), big TDN screen, globe; (b) the analyst inside the chart board.
- PICK (a): series sign-off shot, new colour world (deep teal + gold), flash in, analyst points at camera on "toons" (29.98).

## Ledger (must differ from neighbours + v1 + v2 + v3)
- v1: rollercoaster / trading floor rocket / stage crown / party balloons+chips / dusk floor / rollercoaster sunrise.
- v2: party table coin / chart ski-jump / elevator free-fall / shredder / vault bars-with-legs / snowstorm.
- v3: strait diorama mine strike / war-room map + barrel stream / knife-edge tanker + Washington / barrier + gas pump whip / TDN TV sign-off desk (blue-red).
- v5: plaza chart board + calendar X / staircase mountain gondola / Atlas chip lifting the market + stamp / Seoul 5,000 arch column / red slide + cracking record board / TDN sign-off desk (teal-gold). No repeated layout, camera move, transition or colour world: dawn plaza orange, alpine green, cleanroom teal, Seoul violet dusk, grey-red cliff, teal-gold studio.

## Assets to build (all inline in engine/src/videos/TdnV5.tsx, reusing style/* + extra.tsx — same pattern as v1/v2/v3)
- ChartBoard (CanvasPlane animated line chart) — new set dressing.
- CalendarPage (CanvasPlane, date + red X state) — new prop.
- StepSlope (green box staircase + glow line) — new set.
- Gondola (cabin + cable) — new prop.
- GiantChip (body + pins + TSMC face label) — new prop, register in ASSET-LIBRARY.
- StampCard (CanvasPlane "LIMIT +10%") — new dressing.
- FinishArch (poles + "5,000" banner CanvasPlane) — new prop.
- RecordBoard (CanvasPlane, crack + ERASED states) — new dressing.
- SlideSlope (red inclined plane) — new set.
- No new library worlds; Globe/Desk/Clock etc. reused from extra.tsx/kit.tsx/props.tsx.

## Pipeline status
- [x] Fact check (fifth-video/story.md)
- [x] Voiceover (Helio), trimmed 30.51 s, aligned 92 words -> 918 frames
- [ ] Build TdnV5.tsx + PLAN anchors (in repo staging, NOT the local skill engine — v3 is rendering there)
- [ ] SFX events + mix_sfx -> jobs/tdn-v5/public/mix.wav
- [ ] GitHub Actions lane: stills run (scale 0.4) -> contact sheet -> quality check
- [ ] Final render via Actions (scale 1.5) -> download artifact -> ffprobe verify -> flicker/pacing spot checks
- [ ] captions-id.srt from words.json boundaries (Indonesian, NOT burned in)
- [ ] Deliver tdn-05-taiwan-whipsaw.mp4 + SRT + upload-metadata.txt to ~/workspace/the-daily-toon-news/fifth-video/ (NO upload)
