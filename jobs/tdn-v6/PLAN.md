# TDN v6 — "Huawei: guilty on 10 of 12 counts" — PLAN

## Facts (all checked in sixth-video/story.md)
- Tuesday 24 Nov 2026, Brooklyn federal jury: Huawei + 3 subsidiaries convicted on 10 of 12 criminal counts (Reuters, CNN, WSJ, Fox Business/DOJ)
- Guilty counts include bank fraud, wire fraud, money laundering conspiracy, Iran sanctions violations (IEEPA), conspiracy to steal US trade secrets
- Trade-secret targets included Cisco's router source code and T-Mobile's phone-testing robot (DOJ)
- Acquitted on racketeering conspiracy ("acted as a criminal enterprise") + obstruction conspiracy — the script uses the racketeering acquittal
- Case began in 2018; Huawei says the charges lack legal/factual merit and will fight on; sentencing 14 Sep 2027 (Judge Donnelly), fines/forfeiture/restitution possible
- Script: 95 display words (97 aligned tokens incl. multi-token overrides). Voiceover: Helio (avocado_v2:MAI_03), original 36.43 s, trimmed 31.43 s -> 945 frames @30fps (int(31.43*30)+3, same formula as v5).
- Alignment: pocketsphinx via PYTHONPATH=~/workspace/.pylibs, align.py (same as v5). spoken.json overrides: Huawei->"wah way", T-Mobile's->"tee mobile", Cisco's->"sis co", phone-testing->"phone testing", twenty-seven->"twenty seven", toons->"tunes". 97/97 words aligned, last end 31.43 s.
- script.json: script.txt whitespace tokens minus the 2 bare em-dash tokens = 97, matching words.json.
- SFX: 7 events, mix at -15.4 LUFS / -1.7 dBTP (mix_sfx.py --lufs -15).
- Grammar: explainer (default). Ghost dissolves 0.2-0.3 s; flash into the S7 sign-off.
- Characters: analyst reused (orange hoodie, glasses — series continuity, S1 + S7). New one-video looks: judge (charcoal, grey swept hair, glasses, S2/S5), defence lawyer (navy shirt, S6).

## Beat sheet (EXACT word anchors from words.json, 31.43 s, 945 frames)
- S1 0-3.1s — "One of the biggest tech trials on Earth just ended in New York." (words 0-12, 0-2.93; "ended" 2.10-2.34, "New York" 2.44-2.93)
- S2 3.1-8.85s — "After a case that began in twenty eighteen, a federal jury convicted China's Huawei on ten of twelve criminal counts:" (words 13-32, 3.10-8.85; "twenty eighteen" 4.21-5.11, "convicted" 5.80-6.27, "ten of twelve" 7.32-8.08)
- S3 8.85-15.03s — "bank fraud, wire fraud, money laundering, breaking Iran sanctions, and conspiring to steal American trade secrets" (words 33-48, 8.85-15.03; "bank fraud" 8.85-9.73, "wire fraud" 9.73-10.56, "money laundering" 10.56-11.33, "Iran sanctions" 11.76-12.80, "trade secrets" ends 15.03)
- S4 15.03-18.66s — "from Cisco's router code to T-Mobile's phone-testing robot." (words 49-56, 15.03-18.66; "Cisco's" 15.32, "router code" 15.74-16.87, "T-Mobile's" 16.96-17.48, "robot" ends 18.66)
- S5 18.66-23.03s — "But the jury cleared Huawei of the biggest charge of all: acting as a criminal enterprise." (words 57-72, 18.88-23.03; "cleared" 19.32-19.71, "biggest charge" 20.29-20.98, "criminal enterprise" 21.98-23.03)
- S6 23.03-28.62s — "Huawei calls the verdict baseless and vows to fight on. Sentencing lands in September twenty twenty-seven." (words 73-88, 23.26-28.62; "baseless" 24.28-24.93, "fight on" 25.47-26.10, "September" 27.15-27.66, "twenty twenty-seven" ends 28.62)
- S7 28.62-31.43s — "The Daily Toon News — the world, in toons." (words 89-96, 28.62-31.43; "toons" 30.90-31.43)
CUTS = [0, 3.1, 8.85, 15.03, 18.66, 23.03, 28.62, 31.43]; durationInFrames = 945.

### S1 0-3.1s — the courthouse steps, the gavel falls
- Ideas: (a) courthouse facade with columns and a "TRIAL OVER" banner; (b) a giant gavel hovering over a skyline; (c) a newspaper front page blowing in the wind.
- PICK (a)+(b): neoclassical courthouse (columns, pediment, steps) at dusk-blue, NYC skyline behind, one oversized gavel on the steps that strikes its block on "ended" (2.10) with a camera impact. Analyst on the steps points at the courthouse. Palette: deep blue dusk + lamp gold.

### S2 3.1-8.85s — the verdict board: twelve counts, ten fall guilty
- Ideas: (a) a jury box of twelve raising hands; (b) a courtroom board of 12 count cards flipping GUILTY one by one; (c) a calendar flipping back to 2018.
- PICK (b): one CanvasPlane board, 6x2 cards; cards 1-10 flip red "GUILTY" in sequence over "convicted ... ten of twelve" (6.0-8.1s), cards 11-12 stay face-down slate (paid off in S5). "SINCE 2018" plaque on the bench. Judge behind the bench. HUD chip "10 OF 12 COUNTS — GUILTY" (7.3-8.8s). Camera: slow push-in.

### S3 8.85-15.03s — the charge sheet: five stamps slam down
- Ideas: (a) an evidence table with tagged exhibits; (b) a conveyor of charge plaques; (c) five rubber stamps slamming onto a giant verdict sheet, one per charge.
- PICK (c): giant cream sheet ("U.S. v. HUAWEI — VERDICT SHEET") tilted to camera; stamps slam on their exact words: BANK FRAUD 8.9, WIRE FRAUD 9.8, MONEY LAUNDERING 10.6, IRAN SANCTIONS 11.8, TRADE SECRET THEFT 13.6. Palette: warm wood, cream paper, red ink. Camera: high angle, slow push.

### S4 15.03-18.66s — the evidence bench: a router and a robot
- Ideas: (a) an evidence shelf with both exhibits under glass; (b) a lab bench: a blinking router with scrolling code, and a small robot arm tapping a phone; (c) two evidence bags on a table.
- PICK (b): EXHIBIT A router (antennae, blinking lights, code screen), EXHIBIT B robot arm tapping a phone that flashes per tap. Palette: cool lab teal-grey + magenta accent light. Camera: lateral dolly left to right following the words.

### S5 18.66-23.03s — the twist: cleared of the biggest charge
- Ideas: (a) the two remaining cards flip NOT GUILTY with a golden burst; (b) a "CRIMINAL ENTERPRISE" stamp stopped by a shield; (c) scales of justice rebalancing.
- PICK (a)+banner: same courtroom board as S2 (warmer light); cards 11-12 flip teal "NOT GUILTY" at "cleared" (19.4/19.9) with a confetti sparkle; above the board a dark "CRIMINAL ENTERPRISE" plaque gets a red X drawn over "criminal enterprise" (21.5-22.3) and fades. HUD chip "CLEARED OF THE BIGGEST CHARGE" (19.4-22.9s). Camera: pull-back (mirror of S2).

### S6 23.03-28.62s — the fight back, and a date circled in 2027
- Ideas: (a) a press podium + a giant statement board, an APPEAL stamp, and a wall calendar for Sep 2027; (b) two podiums facing off; (c) a boxing glove punching the verdict sheet.
- PICK (a): slate-blue press set; statement board carries Huawei's line "NO LEGAL OR FACTUAL MERIT"; a blue "APPEAL" stamp slams on "fight on" (25.5); camera pans to a big calendar page "SEP 2027" whose 14th is circled in red on "September" (27.15). Defence lawyer at the podium. Palette: slate blue + silver, red circle accent.

### S7 28.62-31.43s — sign-off
- Ideas: (a) analyst at the TDN desk, NEW crimson-navy night livery (differs from v5 teal-gold and v3 blue-red); (b) analyst inside the courtroom.
- PICK (a): series sign-off, flash in, analyst points at camera on "toons" (30.90).

## Ledger (must differ from neighbours + v1 + v2 + v3 + v5)
- v1: rollercoaster / trading floor rocket / stage crown / party balloons+chips / dusk floor / rollercoaster sunrise.
- v2: party table coin / chart ski-jump / elevator free-fall / shredder / vault bars-with-legs / snowstorm.
- v3: strait diorama mine strike / war-room map + barrel stream / knife-edge tanker + Washington / barrier + gas pump whip / TDN TV sign-off desk (blue-red).
- v5: plaza chart board + calendar X / staircase mountain gondola / Atlas chip lifting the market + stamp / Seoul 5,000 arch column / red slide + cracking record board / TDN sign-off desk (teal-gold).
- v6: courthouse steps + giant gavel / courtroom verdict board of 12 cards / verdict sheet with 5 stamps / evidence lab bench router + robot / same board, last 2 cards flip NOT GUILTY + X'd banner / press podium + APPEAL stamp + Sep 2027 calendar / TDN sign-off desk (crimson-navy). Colour worlds: dusk-blue courthouse, oak courtroom, cream paper + red ink, lab teal-grey + magenta, warm courtroom reprise, slate press blue, crimson-navy studio.

## Assets to build (all inline in engine/src/videos/TdnV6.tsx, reusing style/* + extra.tsx — same pattern as v1/v2/v3/v5)
- VerdictBoard (CanvasPlane, 12 flip cards, mode "count" for S2 / "twist" for S5) — new prop.
- Gavel (handle + head Cyls on a sounding block) — new prop.
- StampCard (CanvasPlane red-ink stamp, slam scale) — pattern from v5, new texts.
- Router (box + antennae + blinking lights + code screen) — new prop.
- RobotArm (base + column + two arm segments + tapper) — new prop.
- StatementBoard + AppealStamp + Calendar2027 (CanvasPlanes) — new dressing.
