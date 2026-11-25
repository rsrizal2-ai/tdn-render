# TDN v7 — "30 hostages, one supermarket: Colombia's 17-hour siege" — PLAN

## Facts (all checked in seventh-video/story.md)
- Tue 24 Nov 2026, Cartagena, Colombia: an armed crew's failed armored-truck robbery at an Exito supermarket turned into a hostage siege — about 30 shoppers and workers held (Reuters, CNN, CBS/AFP)
- Demand: 7 billion pesos (about 2 million dollars) and a way out (Colombia Reports)
- 17-hour standoff; 10 hostages released during the day, several of them elderly women; store windows papered over; joint police + military cordon; the president came to the scene in person (CBS/AFP, Reuters)
- ~1:30 a.m. Wed 25 Nov: explosions heard, special forces stormed the store; every hostage rescued; 1 captor killed, the other 4 detained (Reuters, Colombia Reports)
- The siege ended on the 10th anniversary of Colombia's peace accord; Cartagena = Caribbean port, walled old town, cruise ships (CBS/AFP)
- Script: 195 display words (196 whitespace tokens incl. the bare sign-off em-dash, dropped from script.json). Voiceover: Helio (avocado_v2:MAI_03), original 74.69 s, trimmed 63.07 s -> 1895 frames @30fps (int(63.07*30)+3, same formula as v5/v6).
- Alignment: pocketsphinx via PYTHONPATH=~/workspace/.pylibs, align.py. spoken.json overrides: toons->"tunes" only (Cartagena IS in cmudict). 195/195 words aligned, last end 63.07 s.
- script.json: script.txt whitespace tokens minus the bare em-dash token = 195, verified 1:1 against words.json.
- SFX: 11 events, mix at -15.6 LUFS / -1.5 dBTP (mix_sfx.py --lufs -15).
- Grammar: explainer (default). Ghost dissolves 0.2-0.3 s; flash into the S9 sign-off.
- NEW duration rule (user, 26 Nov): GitHub-lane videos run 1 minute or more — this one is 63.1 s.
- Characters: analyst reused (orange hoodie, glasses — series continuity, S1 + S9). New one-video looks: crew x3 (black hoodie, glasses, angry), officer (navy + gold badge), soldier (olive), president (olive fatigues, deadpan), elderly women x2 (grey hair, pastel, hunch + cane), shoppers/hostages (varied shirts).

## Beat sheet (EXACT word anchors from words.json, 63.07 s, 1895 frames)
- S1 0-5.82s — "Thirty people went out to buy groceries in Colombia. They came home seventeen hours later, freed by special forces." (words 0-18, 0-5.82; "groceries" 1.09-1.66, "seventeen hours" 2.98-3.93, "special forces" 4.87-5.82)
- S2 5.82-15.72s — "On Tuesday morning, an armed crew tried to rob an armored cash truck outside a supermarket in Cartagena, a Caribbean port city packed with tourists. But the truck had already left." (words 19-49, 6.03-15.72; "armored cash truck" 8.57-9.63, "Cartagena" 10.85-11.72, "already left" 14.79-15.72)
- S3 15.72-20.78s — "So the gunmen ran inside, and took the whole store hostage: about thirty shoppers and workers." (words 50-65, 15.72-20.78; "ran inside" 16.27-17.20, "hostage" 18.25-18.86, "thirty" 19.28-19.60)
- S4 20.78-29.43s — "They demanded seven billion pesos, about two million dollars, and a way out. The windows were papered over. Police and soldiers surrounded the block." (words 66-89, 20.97-29.43; "seven billion pesos" 21.49-23.01, "papered over" 26.24-27.02, "surrounded" 28.20-28.68)
- S5 29.43-35.55s — "Through the day, ten hostages were let go, several of them elderly women. The country's president showed up in person." (words 90-109, 29.43-35.55; "ten hostages" 30.18-31.05, "elderly women" 32.60-33.44, "president" 34.05-34.54)
- S6 35.55-43.20s — "Then, at half past one in the morning, explosions shook the street, and special forces stormed the store. Minutes later, it was over." (words 110-132, 35.55-43.20; "half past one" 36.30-37.09, "explosions" 37.77-38.51, "stormed" 40.43-40.92)
- S7 43.20-48.86s — "Every hostage walked out alive. One captor was killed, and the other four were taken away in handcuffs." (words 133-150, 43.39-48.86; "walked out alive" 44.15-45.16, "handcuffs" 48.15-48.86)
- S8 48.86-57.19s — "And here is the twist: the siege ended on the tenth anniversary of Colombia's peace deal, in a city famous for its walled old town and cruise ships." (words 151-178, 49.06-57.19; "twist" 49.73-50.35, "tenth anniversary" 51.48-52.51, "walled old town" 55.18-56.32, "cruise ships" 56.45-57.19)
- S9 57.19-63.07s — "Thirty people went shopping. All thirty came home. The Daily Toon News — the world, in toons." (words 179-194, 57.35-63.07; "All thirty came home" 58.86-60.13, "toons" 62.48-63.07)
CUTS = [0, 5.82, 15.72, 20.78, 29.43, 35.55, 43.20, 48.86, 57.19, 63.07]; durationInFrames = 1895.

### S1 0-5.82s — the hook: a normal shopping morning, a clock that races 17 hours
- Ideas: (a) supermarket facade at sunrise, shoppers streaming in, a big clock above the door spinning through a whole day; (b) a shopping basket filling with groceries that turn into hostages' chairs; (c) a calendar page tearing from Tue to Wed.
- PICK (a): yellow-teal supermarket facade, "SUPERMARKET" sign, palms, sun; two shoppers walk in with baskets; the analyst stands front with a basket, grinning — at "seventeen hours" (2.98) his face drops to deadpan and the store clock's hands race (day -> night -> dawn glow shifts) while a police light flickers on the facade edge at "special forces". Palette: Caribbean morning gold + teal.

### S2 5.82-15.72s — the failed heist: the cash truck leaves without them
- Ideas: (a) the armored truck drives off mid-sentence, leaving the masked crew staring at an empty loading bay; (b) a "PLAN A" board with the truck crossed out; (c) the crew watching the truck through binoculars.
- PICK (a): street + loading bay; the grey armored truck ("ARMORED CASH" on its side) rolls in from the left at "armored cash truck" (8.57), pauses, then accelerates away right and is gone by "already left" (15.07); three crew figures (black hoodies, dark glasses, angry) step out from behind a crate — one points at the truck (8.15 "rob"), then all three turn and look at the store door. Palette: street grey-blue + truck slate, morning light cooling.

### S3 15.72-20.78s — inside: the whole store, taken
- Ideas: (a) an aisle of shelves, hostages seated on the floor between them, windows papered; (b) a top-down store map with dots; (c) the doors chained shut.
- PICK (a): two stocked Shelf rows forming an aisle; six hostages sit hunched on the floor (worry, one sweating), two crew stand guard at the aisle ends (arms "hold"); tall windows at the back are covered with cream paper sheets + tape crosses; fluorescent glow strips overhead. HUD chip "ABOUT 30 HOSTAGES" (19.05-20.9). Palette: fluorescent cream + mint.

### S4 20.78-29.43s — the demand, and the ring of steel
- Ideas: (a) a giant demand note slams onto the store door like a stamp while police cars roll in behind; (b) a ransom-note board on an easel at a press pen; (c) the demand typed letter by letter on a screen.
- PICK (a): dusk exterior; a big paper note scales in with a stamp slam on the door at "seven billion pesos" (21.49): "THE DEMAND / 7 BILLION PESOS / ≈ 2 MILLION DOLLARS / AND A WAY OUT"; camera pulls back through "papered over" to reveal the cordon: two police cars (light bars flashing), yellow tape, officers + soldiers, crowd silhouettes behind the tape at "surrounded the block" (28.2). Palette: dusk orange + violet.

### S5 29.43-35.55s — ten walk free; the president takes charge
- Ideas: (a) the door opens a crack and hostages trickle out past a "RELEASED: 10" counter board while the camera pans to a command table where the president studies a map; (b) a split screen; (c) a bus carrying the freed away.
- PICK (a): deeper dusk; the door opens at 30.2 and three elderly women (grey hair, canes) walk out slowly, escorted by an officer, past a counter board that flips to "RELEASED: 10" at "ten hostages" (30.18); camera pans right to the command post: a table, a "CARTAGENA" map board, radio boxes — the president (olive fatigues) steps in and points at the map on "president" (34.05). Palette: dusk violet deepening to night blue at the edges.

### S6 35.55-43.20s — 1:30 a.m.: the storm
- Ideas: (a) night facade, a clock showing 1:30, flash-bang bursts at the door, a line of helmeted figures rushing in; (b) a silent countdown board; (c) the store seen from a helicopter searchlight.
- PICK (a): deep-navy night; a big clock plane reads 1:30 at "half past one" (36.3); at "explosions" (37.77) two orange flash bursts + camera impacts shake the door; four special-forces figures (dark gear, helmet balls) advance in a crouch-line with walk phases and pour through the bursting door on "stormed" (40.43), warm light spilling out; by "it was over" (42.82) they stand at the door, one raises an arm — all quiet. Palette: navy + flash orange.

### S7 43.20-48.86s — everyone walks out alive
- Ideas: (a) dawn: hostages stream out smiling into the gold light, medics' van waiting; the four captors are led out in a hunched line past them; (b) a headcount board ticking to 30; (c) families hugging at the tape.
- PICK (a)+(c): sunrise gold; the freed hostages (varied, smile/laugh, one arms "up") walk out toward the camera and hug at the tape line; a white medic van with a red cross waits; at "One captor was killed" (45.31) the four surviving captors are led out hunched between officers, heads down — outcome carried by the HUD chip "1 CAPTOR KILLED · 4 CAPTURED" (45.3-48.9), no violence shown. Palette: dawn gold + soft teal.

### S8 48.86-57.19s — the twist: ten years of peace, in the walled city
- Ideas: (a) a postcard of the old town: stone wall with crenellations, terracotta roofs, church tower, the sea and a cruise ship; a "10 YEARS OF PEACE" calendar medallion pops in; (b) two doves over a peace treaty document; (c) the wall at sunset with the siege store tiny in a corner.
- PICK (a)+(b): the analyst at left points across; the medallion scales in on "tenth anniversary" (51.48) with two white doves fluttering up; camera drifts right across the wall and rooftops to the cruise ship on the teal sea at "cruise ships" (56.45). Palette: terracotta + sea teal + late gold.

### S9 57.19-63.07s — sign-off
- Ideas: (a) analyst at the TDN desk, NEW violet-gold livery, a paper grocery bag on the desk; (b) analyst inside the supermarket aisle.
- PICK (a): series sign-off, flash in; the grocery bag sits on the desk through "Thirty people went shopping"; analyst grins at "All thirty came home" (58.86) and points at camera on "toons" (62.48).

## Ledger (must differ from neighbours + v1 + v2 + v3 + v5 + v6)
- v1: rollercoaster / trading floor rocket / stage crown / party balloons+chips / dusk floor / rollercoaster sunrise.
- v2: party table coin / chart ski-jump / elevator free-fall / shredder / vault bars-with-legs / snowstorm.
- v3: strait diorama mine strike / war-room map + barrel stream / knife-edge tanker + Washington / barrier + gas pump whip / TDN TV sign-off desk (blue-red).
- v5: plaza chart board + calendar X / staircase mountain gondola / Atlas chip lifting the market + stamp / Seoul 5,000 arch column / red slide + cracking record board / TDN sign-off desk (teal-gold).
- v6: courthouse steps + giant gavel / courtroom verdict board of 12 cards / verdict sheet with 5 stamps / evidence lab bench router + robot / same board, last 2 cards flip NOT GUILTY + X'd banner / press podium + APPEAL stamp + Sep 2027 calendar / TDN sign-off desk (crimson-navy).
- v7: supermarket facade + racing clock / armored truck drives off, crew too late / supermarket aisle, hostages on the floor, papered windows / demand note slams on the door + police cordon pull-back / door releases 10 + president at the command map / night 1:30 clock + flash bursts + helmet line storms the door / dawn walk-out + hugs + captors led away / walled old town + peace medallion + cruise ship / TDN sign-off desk (violet-gold). Colour worlds: Caribbean gold-teal, street grey-blue, fluorescent cream-mint, dusk orange-violet, deep dusk violet, navy night + orange flash, dawn gold, terracotta + sea teal, violet-gold studio.

## Assets to build (all inline in engine/src/videos/TdnV7.tsx, reusing style/* + extra.tsx — same pattern as v1/v2/v3/v5/v6)
- StoreClock (CanvasPlane clock whose hands race 17 h during S1) — new prop.
- ArmoredTruck (box body + cab + wheels + ARMORED CASH plane, drives off) — new prop.
- DemandNote (CanvasPlane note, stamp-slam scale-in) — pattern from v6 Stamp, new content.
- PoliceCar (body + cab + flashing light bar) — new prop.
- Clock130 (static 1:30 clock face for S6) — variant of StoreClock.
- PeaceMedallion (CanvasPlane "10 YEARS OF PEACE" roundel) — new dressing.
- CruiseShip (hull + decks + funnel) — new prop.
- Helmets on special-forces figures: flattened Ball over the head (in-scene dressing).
