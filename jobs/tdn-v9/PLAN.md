# TDN v9 — "Pakistan's first astronaut, on a Chinese rocket" — PLAN

## Facts (all checked in ninth-video/story.md)
- Wed 25 Nov 2026: Shenzhou-24 launched 08:18 Beijing time on a Long March 2F from Jiuquan (Gobi Desert); crew of 3 (Reuters, Nature, Aviation Week)
- Muhammad Zeeshan Ali, 40, Pakistan Air Force pilot, payload specialist: first Pakistani in orbit, first foreign astronaut to board Tiangong (Reuters)
- Commander Tang Hongbo: record third visit to Tiangong; Wu Yi: first flight (Wikipedia/CMSA, Aviation Week)
- ~10 min after liftoff the capsule was in orbit; docked at Tianhe forward port ~3.5 h later, 11:56 Beijing (CMSA/Xinhua)
- Tiangong = "heavenly palace"; Ali stays about a week (5–10 days), runs experiments incl. 4 Pakistani-university biotech studies, returns on Shenzhou-23 (Reuters, Nature)
- China built Tiangong on its own after being shut out of the ISS; CMSA frames Ali as the first of more foreign guests
- Script: 201 display words. Voiceover: Helio (avocado_v2:MAI_03), original 76.92 s, trimmed 65.41 s -> 1965 frames @30fps (int(65.41*30)+3, same formula as v5/v6/v7).
- Alignment: pocketsphinx, align.py run directly with PYTHONPATH=~/workspace/.pylibs (prep_voice.py's internal `python3 -I` call drops PYTHONPATH — trim stage of prep_voice used, align run manually, same as v7). spoken.json overrides: Shenzhou-24/23, Tiangong, Jiuquan, Zeeshan, Hongbo, Wu, Yi, Gobi, centre, forty-year-old, brand-new, toons. 201/201 words aligned, last end 65.41 s.
- script.json: generated from words.json display words = 201 tokens, verified 1:1.
- SFX: 11 events, mix at -15 LUFS target (mix_sfx.py --lufs -15).
- Grammar: explainer (default). Ghost dissolves; flash into the S11 sign-off.
- Duration rule (user, 26 Nov): GitHub-lane videos run 1 minute or more — this one is 65.4 s.
- Characters: analyst reused (orange hoodie, glasses — series continuity, S1 + S11). New one-video looks: Ali (white suit, green badge, wave), Tang (white suit, gold badge, swept hair), Wu (white suit, cyan badge).

## Beat sheet (EXACT word anchors from words.json, 65.41 s, 1965 frames)
- S1 0-4.52s — "Pakistan just put its first astronaut in orbit — and he flew there on a Chinese rocket." (words 0-15, 0-4.52; "first astronaut in orbit" 1.12-2.60, "Chinese rocket" 3.39-4.52)
- S2 4.52-13.06s — "On Wednesday morning, a Long March rocket lifted off from the Jiuquan launch centre in the Gobi Desert, carrying the Shenzhou-24 spacecraft and a crew of three." (words 16-42, 4.52-12.88; "lifted off" 6.56-7.14, "Jiuquan" 7.35-7.71, "Shenzhou-24" 9.89-11.10, "crew of three" 12.06-12.88)
- S3 13.06-18.85s — "In the third seat sat Muhammad Zeeshan Ali, a forty-year-old Pakistan Air Force pilot." (words 43-56, 13.06-18.05; "third seat" 13.21-13.91, "Muhammad Zeeshan Ali" 14.14-15.73, "pilot" 17.65-18.05)
- S4 18.85-25.80s — "Beside him: commander Tang Hongbo, visiting China's space station for a record third time, and rookie Wu Yi, on his first flight." (words 57-78, 18.05-25.58; "commander Tang Hongbo" 18.85-20.19, "record third time" 21.92-23.15, "Wu Yi" 23.78-24.53, "first flight" 24.88-25.58)
- S5 25.80-28.47s — "Ten minutes after liftoff, their capsule was in orbit." (words 79-87, 25.80-28.47; "Ten minutes" 25.80-26.26, "in orbit" 27.80-28.47)
- S6 28.47-36.42s — "Three and a half hours later, it docked with Tiangong — the heavenly palace — making Ali the first foreign astronaut ever to board China's station." (words 88-111, 28.47-36.29; "Three and a half hours" 28.47-29.28, "docked" 29.93-30.27, "Tiangong" 30.45-31.26, "heavenly palace" 31.33-32.28, "first foreign astronaut" 33.25-34.71)
- S7 36.42-44.07s — "He will stay about a week, running science experiments, including four biotechnology studies built by universities back home in Pakistan." (words 112-131, 36.42-43.87; "about a week" 36.85-37.51, "science experiments" 37.63-38.92, "four biotechnology studies" 39.47-41.27, "Pakistan" 43.16-43.87)
- S8 44.07-48.52s — "Then he hitches a ride home on a different ship: Shenzhou-23." (words 132-142, 44.07-47.90; "different ship" 45.69-46.57, "Shenzhou-23" 46.57-47.90)
- S9 48.52-57.75s — "China built Tiangong all on its own, after being shut out of the International Space Station. Now it has opened the hatch to its first guest — and Beijing says he will not be the last." (words 143-177, 48.52-57.52; "all on its own" 49.47-50.20, "shut out" 50.61-51.04, "International Space Station" 51.23-52.63, "opened the hatch" 53.24-53.90, "first guest" 54.16-55.16, "not be the last" 56.48-57.52)
- S10 57.75-62.52s — "One small docking for a capsule. One giant hello from a brand-new era in space." (words 178-192, 57.75-62.52; "One small docking" 57.75-58.70, "One giant hello" 59.54-60.62, "brand-new era" 60.85-61.81)
- S11 62.52-65.41s — "The Daily Toon News — the world, in toons." (words 193-200, 62.52-65.41; "toons" 64.83-65.41)
CUTS = [0, 4.52, 13.06, 18.85, 25.80, 28.47, 36.42, 44.07, 48.52, 57.75, 62.52, 65.41]; durationInFrames = 1965.

### S1 0-4.52s — the hook: a foreign flag on China's station
- Ideas: (a) Tiangong in orbit over Earth's curve, a green Pakistan flag plaque pops beside the hatch, the analyst floats by on a tether pointing; (b) a newspaper spinning in space; (c) a boarding-pass card stamped "FIRST GUEST".
- PICK (a): station (core + two solar wings) centre-frame, Earth limb glowing below, star field; at "first astronaut in orbit" (1.12) the green-white flag plaque scales in beside the docking port; the analyst drifts in from the left on a tether line, grin, arm "point" at the plaque on "Chinese rocket". Palette: deep-space navy + Earth blue + station gold-white.

### S2 4.52-13.06s — dawn launch in the Gobi
- Ideas: (a) the rocket on its pad at dawn, ignition at "lifted off", slow rise with smoke billows while the camera tilts up after it; (b) a countdown board in a control room; (c) the rocket as a toy on a map of the desert.
- PICK (a): sand floor + dunes, gantry tower beside a white Long March ("SHENZHOU-24" board on its side), pink-gold dawn sky plane; flame glow + smoke balls burst at 6.56, the rocket climbs steadily and is high by "crew of three" (12.06) where three tiny porthole dots light on the capsule; HUD chip "JIUQUAN · GOBI DESERT" 7.3-9.6. Palette: dawn pink-gold + sand.

### S3 13.06-18.85s — the third seat
- Ideas: (a) capsule interior, three seats in a row, camera pushes to the third where Ali waves, a name board pops; (b) a seat-plan diagram; (c) Ali walking to the capsule in a hangar.
- PICK (a): cream-teal capsule cabin, three seat shells with headrests, control panel with blinking light balls, round window showing Earth; Ali sits in seat 3 (right), waves on his name (14.14); board "SEAT 3 · ALI — PAKISTAN" pops at 15.73. Palette: capsule cream + teal.

### S4 18.85-25.80s — mission control calls the crew
- Ideas: (a) mission-control room: a big screen shows the capsule and a crew board whose rows light in turn — TANG (gold star, "3RD VISIT") then WU ("FIRST FLIGHT"); (b) the trio standing in a hangar; (c) three portrait cards flipping.
- PICK (a): indigo control room, two controller desks with monitors, giant screen with the capsule drawing + crew board; TANG row highlights at 19.24 with a gold "VISIT No. 3" medallion at "record third time" (21.92); WU row highlights at 23.78 with a cyan "FIRST FLIGHT" tag at 24.88. Palette: control indigo + screen cyan.

### S5 25.80-28.47s — ten minutes to orbit
- Ideas: (a) the capsule alone over Earth while a big mission clock's hands race to 10:00 and stars streak; (b) a kitchen timer metaphor; (c) a progress bar filling.
- PICK (a): capsule centre, Earth below, clock plane right whose hands spin fast and stop at "in orbit" (27.80); HUD chip "ORBIT IN 10 MINUTES" 26.3-28.4. Palette: space navy + clock gold.

### S6 28.47-36.42s — the docking (money scene)
- Ideas: (a) the capsule glides along a dashed guide line into Tiangong's port, contact flash + locking bars at "docked", the station name board lights, then a flag plaque + sparkle burst at "first foreign astronaut"; (b) two hands shaking in space; (c) a key entering a lock.
- PICK (a): station right, capsule approaches from left along the dashed line, push-in throughout; contact at 29.93 with a ring flash; board "TIANGONG — THE HEAVENLY PALACE" lights at 30.45; green flag plaque + sparkles burst at 33.25. Palette: navy + gold-white + Pakistan green.

### S7 36.42-44.07s — a week of science
- Ideas: (a) station lab interior: Ali floats beside an experiment rack whose four glowing plant boxes light one by one, a "1 WEEK" calendar hangs by the Earth window; (b) Ali juggling sample tubes; (c) a greenhouse dome.
- PICK (a): mint-white lab module, rack of 4 grow boxes lighting in sequence at "four biotechnology studies" (39.47-41.27), calendar "STAY · 1 WEEK" pops at "about a week" (36.85), Ali bobs gently holding a sample box, Earth window behind. Palette: lab mint + grow-light magenta.

### S8 44.07-48.52s — home on a different ship
- Ideas: (a) exterior: two capsules at the station; a dotted boarding path curves to the one labelled "SHENZHOU-23", which pulses at its name; (b) a taxi-rank of capsules; (c) Ali packing a suitcase inside.
- PICK (a): wide station view, SZ-24 capsule docked front, SZ-23 capsule docked side with its label board; a green dotted arc draws itself from the hatch to SZ-23 through "different ship" (45.69) and SZ-23's ring glows at 46.57. Palette: navy + green accent.

### S9 48.52-57.75s — built alone, doors open
- Ideas: (a) close on the station hatch: chained shut with a "BUILT ALONE" plate while a HUD chip carries the ISS line; at "opened the hatch" the chain drops, the hatch swings open spilling gold light, a "GUEST No. 1" plaque pops, and three blank guest plaques shimmer in behind at "not be the last"; (b) a wall being built brick by brick; (c) a door in deep space.
- PICK (a). HUD chip "BUILT ALONE — SHUT OUT OF THE ISS" 49.5-52.7. Palette: navy + gold.

### S10 57.75-62.52s — one small docking, one giant hello
- Ideas: (a) the whole station + docked capsule silhouetted over Earth's limb as the sun crests at "One giant hello" and warm light floods the frame; (b) a sunrise postcard; (c) Earth rising behind the analyst.
- PICK (a): slow push-in, sun ball rises over the limb from 59.54, glow blooms; HUD chip "A BRAND-NEW ERA IN SPACE" 60.6-62.4. Palette: sunrise gold + deep blue.

### S11 62.52-65.41s — sign-off
- Ideas: (a) analyst at the TDN desk in a NEW indigo-silver livery, a tiny rocket model on the desk puffs smoke at "toons"; (b) analyst floating in the studio with a model station.
- PICK (a): series sign-off, flash in; analyst grins, points at camera on "toons" (64.83); mini rocket on the desk tips with a puff at the same beat. Livery: indigo + silver (new; neighbours were teal-gold, crimson-navy, violet-gold).

## Ledger (must differ from neighbours + v1 + v2 + v3 + v5 + v6 + v7)
- v1: rollercoaster / trading floor rocket / stage crown / party balloons+chips / dusk floor / rollercoaster sunrise.
- v2: party table coin / chart ski-jump / elevator free-fall / shredder / vault bars-with-legs / snowstorm.
- v3: strait diorama mine strike / war-room map + barrel stream / knife-edge tanker + Washington / barrier + gas pump whip / TDN TV sign-off desk (blue-red).
- v5: plaza chart board + calendar X / staircase mountain gondola / Atlas chip lifting the market + stamp / Seoul 5,000 arch column / red slide + cracking record board / TDN sign-off desk (teal-gold).
- v6: courthouse steps + giant gavel / courtroom verdict board of 12 cards / verdict sheet with 5 stamps / evidence lab bench router + robot / board twist NOT GUILTY + X'd banner / press podium + APPEAL stamp + Sep 2027 calendar / TDN sign-off desk (crimson-navy).
- v7: supermarket facade + racing clock / armored truck drives off / aisle hostages + papered windows / demand note + cordon pull-back / door releases 10 + president at map / 1:30 night storm / dawn walk-out + hugs / walled old town + peace medallion + cruise ship / TDN sign-off desk (violet-gold).
- v9: station + flag plaque + tethered analyst / Gobi dawn launch, rocket climbs / capsule interior, third seat + name board / mission-control crew board lighting in turn / capsule + racing mission clock / docking along a dashed line + name board + flag burst / lab rack, 4 grow boxes light in sequence / two capsules + dotted boarding path / chained hatch opens, GUEST No. 1 plaque / station silhouette over Earth sunrise / TDN sign-off desk (indigo-silver). Colour worlds: space navy + Earth blue, dawn pink-gold + sand, capsule cream-teal, control indigo-cyan, navy + clock gold, navy + gold + green, lab mint + magenta, navy + green, navy + gold, sunrise gold + deep blue, indigo-silver studio.

## Assets to build (all inline in engine/src/videos/TdnV9.tsx, reusing style/* + extra.tsx — same pattern as v1/v2/v3/v5/v6/v7)
- Station (core cylinder + node + 2 solar-panel wings + dish + docking port ring) — new prop, reused across S1/S6/S8/S9/S10 at different scales.
- Capsule (cylinder + cone cap + porthole rings + label board) — new prop, reused S2 (on rocket)/S5/S6/S8/S10.
- Rocket (stacked cylinders + nose cone + fins + flame glow + smoke balls + SHENZHOU-24 board) — new prop, S2.
- FlagPlaque (CanvasPlane: green field, white crescent-star-ish disc + "PAKISTAN" — generic, no detailed flag art) — new dressing, S1/S6.
- GrowRack (shelf + 4 boxes with emissive fronts lighting in sequence) — new prop, S7.
- MissionClock (CanvasPlane clock, hands driven by t) — variant of v7 StoreClock pattern, S5.
