# TDN v8 — "Pakistan's first astronaut: China's first foreign guest in orbit" — PLAN

## Facts (all checked in eighth-video/story.md)
- Wed 25 Nov 2026, 08:18 Beijing time: Shenzhou-24 launched on a Long March 2F from Jiuquan (Gobi Desert) — the first foreign astronaut China has ever launched (Reuters, Space.com via Arakis, Nature)
- Muhammad Zeeshan Ali, 40, Pakistani air force pilot, payload specialist — first Pakistani ever to reach orbit (Reuters)
- Crew: commander Tang Hongbo (record 3rd visit to Tiangong), flight engineer Wu Yi (Wikipedia, Technology.org)
- Docked with Tiangong ("heavenly palace") ~3.5 h later (11:56 Beijing); Ali is the first foreign astronaut to board it (Reuters, Centreline)
- Stay about a week (Reuters: 5–10 days); experiments include 4 biotechnology studies from Pakistani universities (Nature)
- Seat came from the Feb 2025 China–Pakistan agreement; two candidates (Ali + Khurram Dawood), Dawood is the backup (The News)
- Twist: a Pakistani had touched space before — Namira Salim's suborbital tourist flight, Oct 2023 — but never orbit (Space.com); Ali returns on a different ship, Shenzhou-23 (Wikipedia, The News)
- Script: 199 display words (200 whitespace tokens incl. the bare sign-off em-dash, dropped from script.json). Voiceover: Helio (avocado_v2:MAI_03), original 76.20 s, trimmed 65.89 s -> 1979 frames @30fps (int(65.89*30)+3, same formula as v5/v6/v7).
- Alignment: pocketsphinx via PYTHONPATH=~/workspace/.pylibs, align.py. spoken.json overrides: Shenzhou->"shen joe", Jiuquan->"gee oh kwan", Tiangong->"tee en gong", Hongbo->"hong bo", Khurram->"koo ram", Dawood->"dah wood", Zeeshan->"zee shawn", Wu->"woo", Yi->"yee", forty-year-old->"forty year old", suborbital->"sub orbital", toons->"tunes". 199/199 words aligned, last end 65.89 s.
- script.json: script.txt whitespace tokens minus the bare em-dash token = 199, verified 1:1 against words.json.
- SFX: 15 events, mix at -15.7 LUFS / -1.5 dBTP (mix_sfx.py --lufs -15).
- Grammar: explainer (default). Ghost dissolves 0.2-0.3 s; flash into the S10 sign-off.
- Duration rule (user, 26 Nov): GitHub-lane videos run 1 minute or more — this one is 65.9 s.
- Characters: analyst reused (orange hoodie, glasses — series continuity, S1 + S10). New one-video looks: Ali (air-force blue uniform on the ground; white flight suit + helmet ball in space), Tang (white suit, red badge), Wu (white suit, blue badge), Dawood (air-force blue), two officials (dark suits) for the signing.

## Beat sheet (EXACT word anchors from words.json, 65.89 s, 1979 frames)
- S1 0-4.10s — "On Wednesday morning, China launched a foreign astronaut for the first time in its history." (words 0-14, 0-3.96; "launched" 1.14-1.49, "foreign astronaut" 1.52-2.46, "first time" 2.65-3.29)
- S2 4.10-11.49s — "The passenger was Muhammad Zeeshan Ali, a forty-year-old Pakistani air force pilot, and now the first Pakistani ever to reach orbit." (words 15-35, 4.10-11.49; "Muhammad Zeeshan Ali" 4.88-6.38, "first Pakistani ever to reach orbit" 9.16-11.49)
- S3 11.49-18.16s — "At eight eighteen in the morning, a Long March rocket lifted Shenzhou Twenty-Four off the pad at Jiuquan, in China's Gobi Desert." (words 36-57, 11.49-18.16; "eight eighteen" 11.66-12.22, "lifted" 13.96-14.34, "Shenzhou Twenty-Four" 14.34-15.49, "Jiuquan" 16.23-16.96, "Gobi Desert" 17.47-18.16)
- S4 18.16-25.35s — "Beside Ali sat the commander, Tang Hongbo, visiting the station for a record third time, and flight engineer Wu Yi." (words 58-77, 18.16-25.15; "commander" 19.32-19.97, "Tang Hongbo" 19.97-20.86, "record third time" 22.09-23.30, "Wu Yi" 24.49-25.15)
- S5 25.35-32.78s — "Three and a half hours later, the capsule docked with Tiangong, the heavenly palace, and Ali became the first foreign astronaut ever to board it." (words 78-102, 25.35-32.78; "Three and a half hours later" 25.35-26.64, "docked" 27.13-27.50, "Tiangong" 27.68-28.38, "first foreign astronaut ever to board it" 30.33-32.78)
- S6 32.78-41.43s — "He will spend about a week aboard as a payload specialist, running experiments, including four biotechnology studies built by universities back home in Pakistan." (words 103-126, 32.78-41.22; "about a week" 33.24-33.82, "payload specialist" 34.39-35.66, "four biotechnology studies" 37.19-38.85, "Pakistan" 40.53-41.22)
- S7 41.43-50.74s — "His seat came from a deal signed in February twenty twenty-five. Pakistan chose two candidate pilots; Ali won the flight, and Khurram Dawood stayed behind as his backup." (words 127-154, 41.43-50.51; "deal signed" 42.25-42.92, "February twenty twenty-five" 43.01-44.57, "two candidate pilots" 45.65-46.89, "Ali won the flight" 47.04-48.12, "backup" 50.02-50.51)
- S8 50.74-59.55s — "And here is the twist: a Pakistani had touched space before, on a suborbital tourist flight in twenty twenty-three, but no Pakistani had ever reached orbit." (words 155-180, 50.74-59.55; "twist" 51.28-51.76, "suborbital tourist flight" 54.39-55.83, "twenty twenty-three" 55.97-57.07, "reached orbit" 58.64-59.55)
- S9 59.55-63.16s — "Ali even comes home on a different ship: Shenzhou Twenty-Three." (words 181-190, 59.55-62.99; "different ship" 60.86-61.74, "Shenzhou Twenty-Three" 61.74-62.99)
- S10 63.16-65.89s — "The Daily Toon News — the world, in toons." (words 191-198, 63.16-65.89; "toons" 65.33-65.89)
CUTS = [0, 4.10, 11.49, 18.16, 25.35, 32.78, 41.43, 50.74, 59.55, 63.16, 65.89]; durationInFrames = 1979.

### S1 0-4.10s — the hook: dawn on the pad, ignition
- Ideas: (a) launch pad at dawn, the rocket ignites on "launched" and starts a slow majestic rise while the analyst points up; (b) a newspaper front page with the rocket bursting out of the paper; (c) a countdown board flipping to zero.
- PICK (a): pink-gold dawn sky, sand floor, grey pad + service tower; the white Long March stands centre; at "launched" (1.14) flame + smoke burst at the base; from 2.9 the rocket rises slowly; analyst front-left points up. HUD chip "CHINA'S FIRST-EVER FOREIGN ASTRONAUT" (2.6-4.05). Palette: dawn pink-gold + rocket white.

### S2 4.10-11.49s — meet the passenger: the crew board
- Ideas: (a) a mission-control room with a giant crew ID board — photo-style portrait, name, age, service, role, a green-and-white flag stripe — and Ali standing beside it; (b) Ali walking a red carpet to the rocket; (c) a boarding-pass the size of a door.
- PICK (a): deep-blue control room, big board "SHENZHOU-24 CREW / MUHAMMAD ZEESHAN ALI / AGE 40 · PAKISTAN AIR FORCE / PAYLOAD SPECIALIST" with a drawn Pakistan flag stripe; Ali (air-force blue) points at his name on "Muhammad Zeeshan Ali" (4.88); at "first Pakistani ever to reach orbit" (9.16) a gold stamp slams on the board: "FIRST PAKISTANI IN ORBIT". Palette: mission blue + gold.

### S3 11.49-18.16s — 08:18: the liftoff, replayed wide
- Ideas: (a) desert wide shot, a big clock board reading 08:18, the rocket climbs past the camera on a smoke column; (b) the launch seen on a mission-control screen; (c) a map of the Gobi with the pad pin.
- PICK (a): sand dunes, azure morning sky, "08:18 / JIUQUAN LAUNCH CENTRE" clock board at left; rocket rises from "lifted" (13.96), accelerating, smoke balls billowing; camera tilts up after it. Palette: sand gold + azure.

### S4 18.16-25.35s — three seats: the crew
- Ideas: (a) capsule interior, three suited astronauts in a row, name plates lighting up as each is named, a round window on Earth; (b) the three standing on a stage like a boy band; (c) three portrait cards dealt onto a table.
- PICK (a): slate cabin, three seats, Tang centre (red badge), Ali left (green badge), Wu right (blue badge), helmet balls on heads, a floating pen; name plates appear on cue ("ALI" 18.65, "TANG HONGBO" 19.97), a gold "3RD VISIT" plate pops at "record third time" (22.09), "WU YI" at 24.49. Palette: cabin slate + panel amber + suit white.

### S5 25.35-32.78s — 3.5 hours later: the docking
- Ideas: (a) space: the capsule glides in from the left and mates with Tiangong while Earth turns below, a "FLIGHT TIME 3:30" board ticks; (b) two puzzle pieces joining; (c) a key entering a lock, station-sized.
- PICK (a): stars, Globe low-left, station right with solar wings; capsule eases in and docks on "docked" (27.13) with a glow ring + tiny camera impact; the hatch light turns green at "board it" (32.13). HUD chip "FIRST FOREIGN ASTRONAUT ABOARD TIANGONG" (30.3-32.7). Palette: space navy + station white-orange + Earth blue.

### S6 32.78-41.43s — one week of work: the floating lab
- Ideas: (a) station lab interior: Ali floats at an experiment rack, test tubes glow, a week calendar checks itself off; (b) Ali doing laps of the module with a clipboard; (c) a split screen: station above, universities below.
- PICK (a): white-mint module, window strip on the stars; Ali floats centre holding the tube rack; a plant dome sits on the rack; "ONE WEEK ABOARD" calendar board checks a box per second; at "four biotechnology studies" (37.19) the board lights "4 BIOTECH EXPERIMENTS — PAKISTANI UNIVERSITIES" and the tubes glow. Palette: lab white-mint + plant green.

### S7 41.43-50.74s — February 2025: the deal and the race
- Ideas: (a) a signing room: two flags, a document on a desk, a SIGNED stamp; camera pans to two pilot portraits — a golden ticket lands on Ali, Dawood gets the BACKUP board and waves; (b) a paper plane race; (c) a contract unrolling like a red carpet to the rocket.
- PICK (a): cream-teal office, China + Pakistan flag planes flank the "ASTRONAUT COOPERATION DEAL" document; two officials at the desk, one points as the stamp slams on "signed" (42.56); pan right at "Pakistan chose" (44.57) to Ali + Dawood in air-force blue; golden ticket scales in on "Ali won the flight" (47.04); "BACKUP" board + Dawood's cheerful wave on "backup" (50.02). Palette: office teal + paper cream + flag red/green.

### S8 50.74-59.55s — the twist: a hop is not an orbit
- Ideas: (a) an infographic in space: Earth centre, a dashed gold hop arc (2023) that rises and falls back, then a teal ring that closes all the way around (2026), mini capsules riding both; (b) two staircases, one short, one wrapping the planet; (c) a high-jump bar vs a full lap of a track.
- PICK (a): Stars + Globe centre-low; one big canvas board behind draws the hop arc progressively (54.39-55.83) with its label "2023 — SUBORBITAL HOP", then the orbit ring sweeps closed (57.2-59.55) labelled "2026 — ORBIT"; mini capsules ride both paths; a glow flash as the ring closes on "reached orbit" (58.64). Palette: space navy + gold hop + teal orbit.

### S9 59.55-63.16s — home on a different ship
- Ideas: (a) the station with two docked capsules: 24 greyed as "THE RIDE UP", 23 glowing green as "THE RIDE HOME", Ali floating across to the 23 hatch; (b) a taxi rank in space; (c) two boarding passes, the return one stamped 23.
- PICK (a): same station world as S5 from a new angle; boards appear on cue, the 23 board + glow at "Shenzhou Twenty-Three" (61.74); Ali drifts from the hatch toward 23 through the beat. Palette: space navy + emerald highlight.

### S10 63.16-65.89s — sign-off
- Ideas: (a) analyst at the TDN desk, NEW midnight-blue + emerald livery, a tiny rocket model on the desk that puffs a smoke ring on "toons"; (b) analyst floating in the lab.
- PICK (a): series sign-off, flash in; tiny rocket on the desk; analyst grins, points at camera on "toons" (65.33).

## Ledger (must differ from neighbours + v1 + v2 + v3 + v5 + v6 + v7)
- v1: rollercoaster / trading floor rocket / stage crown / party balloons+chips / dusk floor / rollercoaster sunrise.
- v2: party table coin / chart ski-jump / elevator free-fall / shredder / vault bars-with-legs / snowstorm.
- v3: strait diorama mine strike / war-room map + barrel stream / knife-edge tanker + Washington / barrier + gas pump whip / TDN TV sign-off desk (blue-red).
- v5: plaza chart board + calendar X / staircase mountain gondola / Atlas chip lifting the market + stamp / Seoul 5,000 arch column / red slide + cracking record board / TDN sign-off desk (teal-gold).
- v6: courthouse steps + giant gavel / courtroom verdict board of 12 cards / verdict sheet with 5 stamps / evidence lab bench router + robot / same board, last 2 cards flip NOT GUILTY + X'd banner / press podium + APPEAL stamp + Sep 2027 calendar / TDN sign-off desk (crimson-navy).
- v7: supermarket facade + racing clock / armored truck drives off / supermarket aisle, hostages on the floor / demand note on the door + cordon / door releases 10 + president at the map / night 1:30 clock + flash bursts + storm / dawn walk-out + hugs / walled old town + peace medallion + cruise ship / TDN sign-off desk (violet-gold).
- v8: dawn launch pad + ignition / mission-control crew ID board + gold stamp / desert clock board 08:18 + rocket climb / capsule interior, three seats, name plates / space docking at Tiangong + Earth / floating lab + week calendar + glowing tubes / signing room, two flags + golden ticket + BACKUP board / space infographic: hop arc vs orbit ring / two docked capsules, 24 up vs 23 home / TDN sign-off desk (midnight-blue + emerald). Colour worlds: dawn pink-gold, mission blue-gold, sand-azure, cabin slate-amber, space navy-white, lab white-mint, office teal-cream, space navy gold/teal, space navy-emerald, midnight-emerald studio.

## Assets to build (all inline in engine/src/videos/TdnV8.tsx, reusing style/* + extra.tsx — same pattern as v1/v2/v3/v5/v6/v7)
- Rocket (Long March: core + nose cone + 4 boosters + flame + smoke) — new prop, used S1 + S3, mini version on the S10 desk.
- Capsule (Shenzhou bell + cylinder + ring, number board) — new prop, S5 + S8 (mini) + S9 (x2).
- Station (Tiangong: core + node + lab module + solar wings + docking port + hatch light) — new prop, S5 + S9.
- Astronaut figure: Person in a white suit look + helmet Ball dressing (pattern from v7's helmet balls).
- CrewBoard / ClockBoard / DealDoc / ArcBoard: CanvasPlane boards drawn per scene (patterns from v6 VerdictBoard + Stamp).
- GoldenTicket + SignedStamp: CanvasPlane scale/rotate-in overlays (pattern from v6 Stamp).
