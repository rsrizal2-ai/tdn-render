// TDN v9 — "The great fake-food bust" — Operation OPSON XV: INTERPOL + Europol's
// 57-country crackdown on fake food (results announced Wed 25 Nov 2026): 526,328
// counterfeit items, 1,653 tonnes of dodgy food, 227,800 litres of doctored drinks,
// USD 87 million of fraud, 79 arrests, 18 crime groups smashed.
// 9:16 720x1280 30fps, 1867 frames (62.14 s voiceover).
// CUTS = [0, 4.51, 14.95, 20.63, 29.30, 32.76, 39.69, 44.19, 49.77, 54.70, 59.30, 62.13].
// S1 supermarket shelf, the FAKE? stamp / S2 OPSON board, 57 pins / S3 warehouse raid
// S4 the haul mountain + counters / S5 the olive-oil trick / S6 factory tricks
// S7 Brazil sacks / S8 arrests / S9 why fake food (bars) / S10 read the label
// S11 TDN sign-off desk (market green-gold).
// NOTE: v9 was first built as Shenzhou-24; #8 took the identical story, so v9 pivoted
// to OPSON XV before rendering (see ninth-video/story.md).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Grade, Sign, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shelf, Plant, Lamp, Monitor, Chair, Rug, Dust } from "../style/props";
import { Cam, Key, Globe } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
// deterministic pseudo-random (no Math.random in render code)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const officerLook: Look = { skin: "#f0c8a0", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#8ae8ff", shoe: "#101018" };
const officer2Look: Look = { skin: "#8a5a34", body: "#3a6ea8", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", badge: "#8ae8ff", shoe: "#101018" };
const tricksterLook: Look = { skin: "#e8b184", body: "#6e2f5a", outfit: "leather", hair: "swept", hairColor: "#14100c", badge: "#ffd36a", shoe: "#1b1b2a" };
const hoodLook: Look = { skin: "#caa27e", body: "#2a2e35", outfit: "hoodie", hair: "none", badge: "#454b54", shoe: "#101014" };

/* ---------- scene wrapper (same pattern as TdnV6/TdnV7/TdnV8) ---------- */
const Scene: React.FC<{ start: number; end: number; first?: boolean; trans?: Trans; bg: string; children: (c: Ctx) => React.ReactNode }> = ({ start, end, first, trans = "ghost", bg, children }) => {
  const from = Math.round(start * FPS) - (first ? 0 : LEAD), dur = Math.round(end * FPS) - from + TAIL;
  return <Sequence from={from} durationInFrames={dur} layout="none"><Inner from={from} first={first} trans={trans} bg={bg} children={children} /></Sequence>;
};
const Inner: React.FC<{ from: number; first?: boolean; trans: Trans; bg: string; children: (c: Ctx) => React.ReactNode }> = ({ from, first, trans, bg, children }) => {
  const f = useCurrentFrame(), t = (f + from) / FPS;
  const k = first ? 1 : clamp(f / (LEAD + 2)), ke = Easing.out(Easing.cubic)(k);
  const sc = !first && trans === "zoom" ? lerp(1.35, 1, ke) : 1;
  const tx = !first && trans === "whip" ? (1 - ke) * 720 : 0, blur = !first && trans === "whip" ? (1 - ke) * 14 : 0;
  return (
    <AbsoluteFill style={{ opacity: first || trans === "flash" || trans === "whip" ? 1 : k, transform: `translateX(${tx}px) scale(${sc})`, background: bg, filter: `saturate(1.32) contrast(1.07) brightness(1.02)${blur > 0.2 ? ` blur(${blur.toFixed(1)}px)` : ""}` }}>
      <ThreeCanvas width={720} height={1280} camera={{ fov: 60, position: [0, 2, 8], near: 0.1, far: 200 }} gl={{ antialias: true }}>
        <color attach="background" args={[bg]} />{children({ t, f })}
      </ThreeCanvas>
      {!first && trans === "flash" ? <AbsoluteFill style={{ background: "#fff", opacity: 1 - clamp(f / 7) }} /> : null}
    </AbsoluteFill>
  );
};

/* ---------- shared props ---------- */
const Board: React.FC<{ p: V3; w: number; lines: { t: string; s?: number; c?: string }[]; bg?: string; frame?: string }> = ({ p, w, lines, bg = "#101828", frame = "#c9a227" }) => (
  <CanvasPlane p={p} s={[w, w * 0.34]} px={[1024, 348]} frame={frame} draw={(c, W, H) => {
    c.fillStyle = bg; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
    const total = lines.reduce((a, l) => a + (l.s ?? 92), 0); let y = (H - total) / 2;
    for (const l of lines) { const s = l.s ?? 92; c.fillStyle = l.c ?? "#f5f7fa"; c.font = `900 ${s}px Inter, Arial`; c.fillText(l.t, W / 2, y + s / 2); y += s; }
  }} />
);
const Stamp: React.FC<{ p: V3; w: number; text: string; color?: string }> = ({ p, w, text, color = "#e5233a" }) => (
  <group position={p} rotation={[0, 0, -0.16]}>
    <CanvasPlane p={[0, 0, 0]} s={[w, w * 0.3]} px={[1024, 307]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.strokeStyle = color; c.lineWidth = 16; c.strokeRect(14, 14, W - 28, H - 28);
      c.fillStyle = color; c.font = "900 118px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(text, W / 2, H / 2 + 4);
    }} />
  </group>
);
const Bottle: React.FC<{ p: V3; s?: number; label?: string }> = ({ p, s = 1, label = "OLIVE OIL" }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 1.05, 0]} rt={0.52} rb={0.58} h={2.1} color="#3f6b2f" line={2} />
    <Cyl p={[0, 2.3, 0]} rt={0.16} rb={0.4} h={0.5} color="#3f6b2f" line={1} />
    <Cyl p={[0, 2.62, 0]} rt={0.17} h={0.22} color="#c9a227" line={1} />
    <CanvasPlane p={[0, 1.1, 0.56]} s={[0.78, 0.95]} px={[234, 285]} draw={(c, W, H) => {
      c.fillStyle = "#fdf6dd"; c.fillRect(0, 0, W, H); c.fillStyle = "#7a5c14"; c.font = "900 44px Inter, Arial"; c.textAlign = "center";
      c.fillText("PREMIUM", W / 2, 62); c.fillStyle = "#2e4a1e"; c.font = "900 40px Inter, Arial";
      label.split(" ").forEach((wd, i) => c.fillText(wd, W / 2, 128 + i * 48));
      c.fillStyle = "#b08a1e"; c.font = "700 30px Inter, Arial"; c.fillText("EST. 1962", W / 2, H - 42);
    }} />
  </group>
);
const Crate: React.FC<{ p: V3; s?: number; color?: string; rot?: V3 }> = ({ p, s = 1, color = "#b9803e", rot = [0, 0, 0] }) => (
  <group position={p} rotation={rot} scale={[s, s, s]}>
    <Box p={[0, 0.55, 0]} s={[1.5, 1.1, 1.1]} color={color} line={2} />
    <Box p={[0, 0.55, 0.57]} s={[1.54, 0.14, 0.03]} color="#7a5226" line={0} />
    <Box p={[0, 0.55, 0.57]} s={[0.14, 1.14, 0.03]} color="#7a5226" line={0} />
  </group>
);
const Sack: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#d9c9a3" }) => (
  <group position={p} scale={[s, s, s]}>
    <Ball p={[0, 0.62, 0]} r={0.78} color={color} ink={0.05} s={[1, 0.88, 1]} />
    <Cyl p={[0, 1.3, 0]} rt={0.2} rb={0.3} h={0.3} color={color} line={1} />
  </group>
);

/* =================== S1 0 – 4.51  hook: the premium bottle =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.6, 12.2], look: [0.2, 3.4, -4], fov: 60 },
  { t: 4.51, pos: [0, 3.4, 10.6], look: [0.4, 3.5, -4], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const stampK = seg(t, 3.14, 3.5, Easing.out(Easing.back(1.7)));
  const bob = Math.sin(t * 2) * 0.05;
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe9c4" />
    <Floor kind="plank" a="#2a3d24" b="#24331e" unit={2} w={36} d={36} />
    <WallDoor z={-7.5} W={32} kind="plain" a="#2e4a2a" b="#2e4a2a" base="#1c2f1a" />
    <Shelf p={[-3.4, 0, -6.2]} w={5.4} rows={3} seed={7} wood="#6e5636" />
    <Shelf p={[4.6, 0, -6.2]} w={5.4} rows={3} seed={21} wood="#6e5636" />
    <Sign p={[0, 7.6, -7.2]} s={[6.8, 1.05]} text="SUPERMARKET" bg="#1c2f1a" fg="#ffd36a" size={96} frame="#ffd36a" />
    <Crate p={[0.6, 0, -4.4]} s={1.5} color="#8a6a42" />
    <Bottle p={[0.6, 1.66 + bob, -4.4]} s={1.12} />
    <Glow p={[0.6, 4.2, -5]} r={3.4} color="rgba(255,220,120,1)" o={0.22} />
    <Person p={[-3.1, 0, -2.6]} h={3.9} look={analyst} f={f} pose={{ mood: "grin", arms: "point", armK: seg(t, 0.4, 0.8), armR: [0.85, 0.62], lookX: 0.55 }} />
    {stampK > 0.02 ? <group position={[0.6, 4.35, -3.4]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={3.2} text="FAKE?" /></group> : null}
    <Dust t={t} area={[7, 4, 5]} />
  </>);
};

/* =================== S2 4.51 – 14.95  the operation board =================== */
const K2: Key[] = [
  { t: 4.51, pos: [0, 4.4, 12.8], look: [0, 4.2, -6], fov: 60 },
  { t: 14.95, pos: [0, 4.2, 11.0], look: [0, 4.4, -6], fov: 58 },
];
const S2 = ({ t, f }: Ctx) => {
  const signK = seg(t, 13.46, 13.85, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#dfeaff" />
    <Floor kind="tile" a="#0d1626" b="#111d33" unit={2} w={36} d={36} />
    <WallDoor z={-8.8} W={34} kind="plain" a="#0a1424" b="#0a1424" base="#060b16" />
    <CanvasPlane p={[0, 5.4, -8.4]} s={[11.8, 7.2]} px={[1180, 720]} frame="#31517d" draw={(c, W, H) => {
      c.fillStyle = "#0d2138"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffd36a"; c.font = "900 76px Inter, Arial"; c.textAlign = "center"; c.fillText("OPERATION OPSON XV", W / 2, 96);
      c.fillStyle = "#7fb2e8"; c.font = "700 42px Inter, Arial"; c.fillText("INTERPOL  ×  EUROPOL", W / 2, 158);
      c.strokeStyle = "rgba(127,178,232,.35)"; c.lineWidth = 2;
      for (let gx = 60; gx < W - 40; gx += 64) { c.beginPath(); c.moveTo(gx, 200); c.lineTo(gx, H - 40); c.stroke(); }
      for (let gy = 216; gy < H - 30; gy += 64) { c.beginPath(); c.moveTo(50, gy); c.lineTo(W - 50, gy); c.stroke(); }
    }} />
    {Array.from({ length: 57 }, (_, i) => {
      const on = t > 5.8 + i * 0.135;
      return <Ball key={i} p={[-5 + rnd(i + 3) * 10, 2.5 + rnd(i + 71) * 3.4, -8.05]} r={0.11} color={on ? "#ffd36a" : "#33507a"} ink={0.02} />;
    })}
    <Person p={[-4.1, 0, -2.9]} h={3.7} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 6.5, 7.2), armR: [0.8, 0.7], lookX: 0.4 }} />
    <Person p={[4.2, 0, -2.9]} h={3.7} look={officer2Look} f={f} pose={{ mood: "smile", arms: "point", armK: seg(t, 7.5, 8.2), armL: [-0.8, 0.7], lookX: -0.4 }} />
    {signK > 0.02 ? <group position={[0, 1.3, -5.2]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[5.8, 1.1]} text="57 COUNTRIES" bg="#0d2136" fg="#ffd36a" size={92} frame="#ffd36a" /></group> : null}
    <Dust t={t} area={[7, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S3 14.95 – 20.63  warehouse inspections =================== */
const K3: Key[] = [
  { t: 14.95, pos: [0, 3.9, 12.0], look: [0, 2.9, -5], fov: 60 },
  { t: 20.63, pos: [0.4, 3.5, 10.0], look: [0.2, 3.0, -5], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const lidK = seg(t, 17.21, 17.95);
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffd9a0" />
    <Floor kind="tile" a="#4a3823" b="#413019" unit={2} w={36} d={36} />
    <WallDoor z={-10} W={36} kind="plain" a="#3d2a1e" b="#3d2a1e" base="#241811" />
    {[-4.7, -3.1].map((x, i) => <group key={i}>{[0, 1, 2].map((r) => <Crate key={r} p={[x, r * 1.16, -6.5]} s={1.05} color={i ? "#a8743a" : "#b9803e"} />)}</group>)}
    {[3.3, 4.9].map((x, i) => <group key={i}>{[0, 1].map((r) => <Crate key={r} p={[x, r * 1.16, -6.5]} s={1.05} color="#9c6c34" />)}</group>)}
    <Crate p={[0.2, 0, -4.6]} s={1.25} />
    <group position={[-0.72, 1.42, -4.6]} rotation={[0, 0, lidK * 1.9]}>
      <Box p={[0.92, 0.06, 0]} s={[1.85, 0.12, 1.36]} color="#8a5a28" line={1} />
    </group>
    {lidK > 0.35 ? <Glow p={[0.2, 1.8, -4.6]} r={1.9} color="rgba(255,205,110,1)" o={0.35 * lidK} /> : null}
    <Person p={[-2.0, 0, -3.1]} h={3.8} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 16.6, 17.2), armR: [0.7, 0.55], lookX: 0.45 }} />
    <Person p={[2.7, 0, -3.3]} h={3.8} look={officer2Look} f={f} pose={{ mood: "smile", arms: "hold", armR: [0.4, 0.5], armL: [-0.4, 0.5], lookX: -0.3 }} />
    <Box p={[2.7, 1.95, -2.95]} s={[0.52, 0.7, 0.06]} color="#f5f0e2" line={1} />
    <Sign p={[0, 8.2, -9.7]} s={[7.4, 1.05]} text="DISTRIBUTION WAREHOUSE" bg="#241a10" fg="#ffd9a0" size={72} frame="#8a5a28" />
    <Dust t={t} area={[7, 4, 5]} />
  </>);
};

/* =================== S4 20.63 – 29.30  the haul =================== */
const K4: Key[] = [
  { t: 20.63, pos: [0, 4.6, 13.6], look: [0, 3.6, -6], fov: 60 },
  { t: 29.30, pos: [0, 4.2, 11.4], look: [0, 3.9, -6], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const b1 = seg(t, 20.63, 21.05, Easing.out(Easing.back(1.7)));
  const b2 = seg(t, 20.91, 21.35, Easing.out(Easing.back(1.7)));
  const b3 = seg(t, 23.56, 24.0, Easing.out(Easing.back(1.7)));
  const stampK = seg(t, 26.70, 27.05, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#181d26" b="#1e242f" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#232a38" b="#232a38" base="#12161f" />
    {Array.from({ length: 16 }, (_, i) => {
      const layer = Math.floor(i / 6), k = i % 6;
      return <Crate key={i} p={[-3.4 + k * 1.35 + layer * 0.7 + rnd(i) * 0.3, layer * 1.14, -7 + rnd(i + 9) * 0.8]} s={1.02} color={["#b9803e", "#a8743a", "#c08b47"][i % 3]} rot={[0, rnd(i + 4) * 0.4 - 0.2, 0]} />;
    })}
    {Array.from({ length: 7 }, (_, i) => <Bottle key={i} p={[2.7 + (i % 4) * 0.85, Math.floor(i / 4) * 1.55, -6.4]} s={0.6} label={i % 2 ? "HONEY" : "OLIVE OIL"} />)}
    {[0, 1, 2, 3].map((i) => <Sack key={i} p={[-4.7 + i * 0.45, i > 1 ? 1.25 : 0, -5.1 - (i % 2) * 0.5]} s={0.95} color={i % 2 ? "#c9b489" : "#d9c9a3"} />)}
    <group position={[-3.5, 6.7, -8.6]} scale={[Math.max(0.02, b1), Math.max(0.02, b1), 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "526,328 ITEMS", s: 96, c: "#ffd36a" }, { t: "SEIZED", s: 70, c: "#f5f7fa" }]} /></group>
    {b2 > 0.02 ? <group position={[3.6, 6.8, -8.6]} scale={[b2, b2, 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "1,653 TONNES", s: 96, c: "#ffd36a" }, { t: "OF DODGY FOOD", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {b3 > 0.02 ? <group position={[0, 9.1, -9.2]} scale={[b3, b3, 1]}><Board p={[0, 0, 0]} w={6.4} lines={[{ t: "227,800 LITRES", s: 96, c: "#ffd36a" }, { t: "OF DOCTORED DRINKS", s: 60, c: "#f5f7fa" }]} /></group> : null}
    {stampK > 0.02 ? <group position={[0.2, 3.5, -4.0]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={5.4} text="$87 MILLION" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S5 29.30 – 32.76  the olive-oil trick =================== */
const K5: Key[] = [
  { t: 29.30, pos: [0, 3.8, 11.2], look: [0, 3.2, -4], fov: 60 },
  { t: 32.76, pos: [0, 3.5, 9.8], look: [0.3, 3.4, -4], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const pourK = clamp(seg(t, 30.49, 30.9) - seg(t, 31.55, 31.8));
  const slapK = seg(t, 31.76, 32.1, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe9c4" />
    <Floor kind="plank" a="#123330" b="#0f2b28" unit={2} w={36} d={36} />
    <WallDoor z={-8} W={34} kind="plain" a="#1d4a42" b="#1d4a42" base="#0f2b28" />
    <Box p={[0.4, 0.95, -3.6]} s={[9.5, 0.28, 3.2]} color="#5a4230" line={2} />
    <group position={[-2.3, 3.7, -3.8]} rotation={[0, 0, -0.5 - pourK * 0.35]}>
      <Cyl p={[0, 0, 0]} rt={0.85} h={2.3} color="#8a8f96" line={2} />
      <CanvasPlane p={[0, 0, 0.87]} s={[1.35, 0.8]} px={[270, 160]} draw={(c, W, H) => { c.fillStyle = "#e8e4da"; c.fillRect(0, 0, W, H); c.fillStyle = "#8a2f2a"; c.font = "900 54px Inter, Arial"; c.textAlign = "center"; c.fillText("CHEAP", W / 2, 64); c.fillText("OIL", W / 2, 124); }} />
    </group>
    {pourK > 0.1 ? <Cyl p={[-1.0, 2.65, -3.7]} rt={0.07} h={1.6} color="#d8b93c" line={0} /> : null}
    <Bottle p={[0.4, 1.09, -3.5]} s={1.05} />
    {slapK > 0.02 ? <group position={[0.4, 2.42, -2.78]} scale={[slapK, slapK, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[1.2, 0.58]} px={[360, 174]} draw={(c, W, H) => { c.fillStyle = "#c9a227"; c.fillRect(0, 0, W, H); c.fillStyle = "#241a04"; c.font = "900 58px Inter, Arial"; c.textAlign = "center"; c.fillText("EXTRA", W / 2, 68); c.fillText("VIRGIN", W / 2, 132); }} />
    </group> : null}
    <Person p={[3.2, 1.09, -3.9]} h={3.6} look={tricksterLook} f={f} pose={{ mood: "grin", arms: "shrug", armK: seg(t, 31.6, 32.0), lookX: -0.4 }} />
    <Sign p={[0, 7.35, -7.7]} s={[5.6, 1.0]} text="THE OLIVE OIL TRICK" bg="#123330" fg="#a8e6c9" size={68} frame="#35d07f" />
    <Plant p={[-6.4, 0, -4.5]} s={1.1} /><Lamp p={[6.8, 0, -4.5]} h={3.2} />
  </>);
};

/* =================== S6 32.76 – 39.69  factory tricks =================== */
const K6: Key[] = [
  { t: 32.76, pos: [0, 3.9, 12.2], look: [0, 3.2, -5], fov: 60 },
  { t: 39.69, pos: [0, 3.6, 10.4], look: [0, 3.4, -5], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const belt = (Math.max(0, t - 32.76) * 1.1) % 1.6;
  const freshK = seg(t, 34.85, 35.2, Easing.out(Easing.back(1.7)));
  const horseLit = t > 35.52;
  const jarK = seg(t, 38.30, 38.65, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#eafff2" />
    <Floor kind="tile" a="#1c2420" b="#232d27" unit={2} w={36} d={36} />
    <WallDoor z={-9.5} W={36} kind="plain" a="#2a3830" b="#2a3830" base="#18211c" />
    <Box p={[0, 1.55, -4.6]} s={[11, 0.35, 1.7]} color="#4a5560" line={2} />
    {[-4.4, -2.2, 0, 2.2, 4.4].map((x, i) => <Cyl key={i} p={[x, 1.32, -4.6]} rt={0.24} h={1.5} rot={[Math.PI / 2, 0, 0]} color="#78828c" line={1} />)}
    {Array.from({ length: 5 }, (_, i) => {
      const x = -4.8 + ((i * 1.6 + belt) % 8);
      return <group key={i} position={[x, 1.72, -4.6]}>
        <Cyl p={[0, 0.42, 0]} rt={0.34} h={0.85} color="#c7ccd4" line={1} />
        <Box p={[0, 0.45, 0.35]} s={[0.44, 0.5, 0.02]} color={i === 2 && t > 34.9 ? "#7dd069" : "#e8e4da"} line={0} />
      </group>;
    })}
    {freshK > 0.02 ? <group position={[-4.6 + ((2 * 1.6 + belt) % 8), 3.5, -4.2]} scale={[freshK, freshK, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[1.9, 0.55]} px={[570, 165]} draw={(c, W, H) => { c.fillStyle = "#7dd069"; c.fillRect(0, 0, W, H); c.fillStyle = "#12300c"; c.font = "900 76px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FRESH DATES!", W / 2, H / 2 + 2); }} />
    </group> : null}
    <Person p={[-3.6, 0, -3.0]} h={3.7} look={{ ...tricksterLook, body: "#4a4f57" }} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 33.4, 34.0), armR: [0.75, 0.6], lookX: 0.5 }} />
    <Crate p={[3.9, 0, -6.2]} s={1.3} color="#8a4a3a" />
    <Sign p={[3.9, 2.75, -6.1]} s={[3.2, 0.95]} text="BEEF" bg="#f5f7fa" fg="#23272e" size={92} frame="#e8e4da" />
    <CanvasPlane p={[3.9, 4.3, -6.1]} s={[3.7, 0.88]} px={[740, 176]} draw={(c, W, H) => {
      c.fillStyle = horseLit ? "#5a1616" : "#241d1d"; c.fillRect(0, 0, W, H);
      c.fillStyle = horseLit ? "#ff7a6e" : "#5a4a4a"; c.font = "900 86px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("HORSE MEAT", W / 2, H / 2 + 2);
    }} />
    {horseLit ? <Glow p={[3.9, 4.3, -5.7]} r={2.5} color="rgba(255,90,80,1)" o={0.2} /> : null}
    {jarK > 0.02 ? <group position={[-0.4, 0, -2.1]} scale={[jarK, jarK, 1]}>
      <Cyl p={[-0.85, 0.75, 0]} rt={0.5} h={1.5} color="#f0ead8" line={2} />
      <Cyl p={[0.85, 0.75, 0]} rt={0.5} h={1.5} color="#e8a92e" line={2} />
      <CanvasPlane p={[0, 0.85, 0.53]} s={[2.2, 0.58]} px={[660, 174]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); c.strokeStyle = "#e5233a"; c.lineWidth = 10; c.strokeRect(6, 6, W - 12, H - 12); c.fillStyle = "#e5233a"; c.font = "900 88px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FAKED", W / 2, H / 2 + 2); }} />
      <Sign p={[0, 2.35, 0]} s={[3.8, 0.9]} text="SUGAR + HONEY" bg="#241a10" fg="#ffd36a" size={72} frame="#ffd36a" />
    </group> : null}
    <Dust t={t} area={[7, 4, 5]} color="rgba(210,255,230,.85)" />
  </>);
};

/* =================== S7 39.69 – 44.19  Brazil =================== */
const K7: Key[] = [
  { t: 39.69, pos: [0, 4.0, 12.4], look: [0, 3.2, -6], fov: 60 },
  { t: 44.19, pos: [0, 3.7, 10.8], look: [0, 3.4, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const sugarK = seg(t, 42.26, 42.65, Easing.out(Easing.back(1.7)));
  const soyK = seg(t, 42.71, 43.1, Easing.out(Easing.back(1.7)));
  const stampK = seg(t, 43.42, 43.78, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1d2413" b="#242d17" unit={2} w={36} d={36} />
    <WallDoor z={-10} W={36} kind="plain" a="#2c3a1e" b="#2c3a1e" base="#1a2410" />
    <Sign p={[0, 8.3, -9.7]} s={[7.2, 1.05]} text="BRAZIL — WAREHOUSE RAID" bg="#1a2410" fg="#aee08a" size={70} frame="#7ac74f" />
    {[0, 1, 2].map((r) => <group key={r}>{[0, 1].map((k) => <Sack key={k} p={[-3.5 + k * 1.4, r * 1.22, -5.6]} s={1.05} />)}</group>)}
    {[0, 1, 2].map((r) => <group key={r}>{[0, 1].map((k) => <Sack key={k} p={[2.7 + k * 1.4, r * 1.22, -5.6]} s={1.05} color="#c9a86a" />)}</group>)}
    {sugarK > 0.02 ? <group position={[-2.8, 5.4, -5.2]} scale={[sugarK, sugarK, 1]}><Board p={[0, 0, 0]} w={4.3} bg="#233018" lines={[{ t: "SUGAR", s: 92, c: "#f5f7fa" }, { t: "48 TONNES", s: 84, c: "#ffd36a" }]} /></group> : null}
    {soyK > 0.02 ? <group position={[3.4, 5.4, -5.2]} scale={[soyK, soyK, 1]}><Board p={[0, 0, 0]} w={4.3} bg="#233018" lines={[{ t: "SOYBEANS", s: 92, c: "#f5f7fa" }, { t: "42 TONNES", s: 84, c: "#ffd36a" }]} /></group> : null}
    <Person p={[0.1, 0, -3.1]} h={3.9} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 43.0, 43.4), armR: [0.6, 0.75], lookX: 0.2 }} />
    {stampK > 0.02 ? <group position={[0.1, 3.3, -4.3]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={3.5} text="SEIZED" /></group> : null}
    <Plant p={[-7.6, 0, -4.5]} s={1.3} /><Plant p={[7.8, 0, -4.5]} s={1.1} />
  </>);
};

/* =================== S8 44.19 – 49.77  arrests =================== */
const K8: Key[] = [
  { t: 44.19, pos: [0, 3.9, 12.6], look: [0, 3.2, -5], fov: 60 },
  { t: 49.77, pos: [0, 3.6, 11.0], look: [0, 3.4, -5], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const flash = Math.sin(t * 7) > 0;
  const b1 = seg(t, 44.84, 45.25, Easing.out(Easing.back(1.7)));
  const b2 = seg(t, 47.02, 47.45, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#dfeaff" />
    <Floor kind="tile" a="#0c1220" b="#101828" unit={2} w={36} d={36} />
    <WallDoor z={-10} W={36} kind="plain" a="#131c2e" b="#131c2e" base="#0a0f1a" />
    <group position={[-3.1, 0, -6]}>
      <Box p={[0, 1.5, 0]} s={[4.6, 2.6, 2.2]} color="#28418c" line={2} />
      <Box p={[0, 1.55, 1.13]} s={[3.4, 1.1, 0.03]} color="#f5f7fa" line={0} />
      <Box p={[-1.2, 2.95, 0]} s={[0.7, 0.3, 1.2]} color={flash ? "#ff4040" : "#7a2020"} line={1} />
      <Box p={[1.2, 2.95, 0]} s={[0.7, 0.3, 1.2]} color={flash ? "#2a3a6e" : "#3f7bff"} line={1} />
      <Ball p={[-1.5, 0.45, 1.05]} r={0.45} color="#14161c" ink={0.04} />
      <Ball p={[1.5, 0.45, 1.05]} r={0.45} color="#14161c" ink={0.04} />
    </group>
    <Glow p={[-4.3, 3.5, -5.2]} r={2.6} color="rgba(255,70,70,1)" o={flash ? 0.3 : 0.05} />
    <Glow p={[-1.9, 3.5, -5.2]} r={2.6} color="rgba(80,130,255,1)" o={flash ? 0.05 : 0.3} />
    {[-0.5, 1.6, 3.7].map((x, i) => <Person key={i} p={[x, 0, -3.6 - (i % 2) * 0.5]} h={3.7} look={hoodLook} f={f} pose={{ mood: "worry", arms: "up", lookX: i === 1 ? 0 : i === 0 ? 0.3 : -0.3 }} />)}
    <Person p={[-1.6, 0, -2.1]} h={3.9} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 44.6, 45.1), armR: [0.85, 0.6], lookX: 0.5 }} />
    {b1 > 0.02 ? <group position={[2.7, 7.0, -7.6]} scale={[b1, b1, 1]}><Board p={[0, 0, 0]} w={5.4} lines={[{ t: "79 ARRESTED", s: 100, c: "#ffd36a" }]} /></group> : null}
    {b2 > 0.02 ? <group position={[-2.7, 7.0, -7.6]} scale={[b2, b2, 1]}><Board p={[0, 0, 0]} w={6.2} frame="#8a3a2e" lines={[{ t: "18 GANGS SMASHED", s: 84, c: "#ff9a8a" }]} /></group> : null}
    <Dust t={t} area={[7, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S9 49.77 – 54.70  why fake food =================== */
const K9: Key[] = [
  { t: 49.77, pos: [0, 4.2, 12.6], look: [0, 3.6, -5], fov: 60 },
  { t: 54.70, pos: [0, 3.9, 11.0], look: [0, 3.8, -5], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const barA = seg(t, 50.76, 51.5), barB = seg(t, 51.99, 52.75), barC = seg(t, 53.37, 54.1);
  const Bar: React.FC<{ x: number; hMax: number; k: number; color: string; label: string; sub: string }> = ({ x, hMax, k, color, label, sub }) => (
    <group position={[x, 0, -5]}>
      <Box p={[0, 0.15, 0]} s={[1.9, 0.3, 1.4]} color="#39424f" line={1} />
      <Box p={[0, 0.3 + (hMax * k) / 2, 0]} s={[1.5, Math.max(0.05, hMax * k), 1.1]} color={color} line={2} />
      <Sign p={[0, 1.35 + hMax * k + 0.55, 0.4]} s={[3.6, 1.25]} text={label} bg="#141a22" fg={color} size={66} frame={color} />
      <Sign p={[0, 0.95, 0.75]} s={[2.9, 0.62]} text={sub} bg="#141a22" fg="#f5f7fa" size={52} frame="#39424f" />
    </group>
  );
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#14181f" b="#1a1f28" unit={2} w={36} d={36} />
    <WallDoor z={-9.5} W={36} kind="plain" a="#1d232e" b="#1d232e" base="#10141b" />
    <Sign p={[0, 8.5, -9.2]} s={[6.6, 1.1]} text="WHY FAKE FOOD?" bg="#141a22" fg="#ffd36a" size={88} frame="#ffd36a" />
    <Bar x={-3.6} hMax={2.6} k={barA} color="#7dd069" label="SHELF PRICE" sub="PREMIUM LOOK" />
    <Bar x={0} hMax={4.4} k={barB} color="#ffd36a" label="THE MARGINS" sub="DRUG-TRADE SIZE" />
    <Bar x={3.6} hMax={0.55} k={barC} color="#5ec8e6" label="THE RISK" sub="A FRACTION" />
    <Dust t={t} area={[7, 4, 5]} />
  </>);
};

/* =================== S10 54.70 – 59.30  read the label =================== */
const K10: Key[] = [
  { t: 54.70, pos: [0, 3.8, 11.4], look: [0, 3.2, -4], fov: 60 },
  { t: 59.30, pos: [0, 3.5, 9.8], look: [0.2, 3.4, -4], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => {
  const magX = 1.15 + Math.sin((t - 54.70) * 1.4) * 0.3;
  return (<>
    <Cam t={t} keys={K10} />
    <Lights warm="#ffdfae" />
    <Floor kind="plank" a="#2e2015" b="#38281b" unit={2} w={36} d={36} />
    <WallDoor z={-8} W={34} kind="plain" a="#4a3421" b="#4a3421" base="#2b1d11" />
    <Box p={[0.6, 0.9, -3.4]} s={[10, 0.26, 3.4]} color="#6e4f30" line={2} />
    <Bottle p={[1.9, 1.03, -3.3]} s={1.0} />
    <Cyl p={[-1.9, 1.1, -3.0]} rt={1.05} h={0.14} color="#f0ead8" line={1} />
    <CanvasPlane p={[-1.9, 1.32, -3.0]} s={[1.55, 1.05]} px={[310, 210]} rot={[-1.25, 0, 0]} draw={(c, W, H) => {
      c.fillStyle = "#fdfaf0"; c.fillRect(0, 0, W, H); c.fillStyle = "#3a3a3a"; c.font = "700 22px Georgia, serif"; c.textAlign = "left";
      c.fillText("EXTRA VIRGIN OLIVE OIL,", 14, 46); c.fillText("pressed from the finest", 14, 80); c.fillText("groves at dawn, bottled", 14, 114); c.fillText("under the Tuscan sun...", 14, 148);
      c.fillStyle = "#b03030"; c.font = "900 26px Inter, Arial"; c.fillText("— A STORY.", 14, 186);
    }} />
    <Person p={[-3.25, 0, -2.2]} h={3.9} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 54.9, 55.4), armR: [0.9, 0.62], lookX: 0.6 }} />
    <group position={[magX, 3.1, -2.6]} rotation={[0.15, 0, -0.4]}>
      <Cyl p={[0, 0, 0]} rt={0.52} h={0.1} rot={[Math.PI / 2, 0, 0]} color="#2b2118" line={1} />
      <Cyl p={[0, 0, 0.03]} rt={0.42} h={0.05} rot={[Math.PI / 2, 0, 0]} color="#bfe8ff" line={0} />
      <Cyl p={[0.4, -0.6, 0]} rt={0.09} h={0.85} rot={[0, 0, 0.6]} color="#2b2118" line={1} />
    </group>
    <Glow p={[1.9, 3.6, -3.9]} r={3.2} color="rgba(255,205,130,1)" o={0.2} />
    <Lamp p={[7.6, 0, -4.5]} h={3.4} color="#ffdfae" /><Plant p={[-7.8, 0, -4.5]} s={1.1} />
  </>);
};

/* =================== S11 59.30 – 62.13  sign-off, green-gold livery =================== */
const K11: Key[] = [
  { t: 59.30, pos: [0, 3.5, 12.2], look: [0, 3.3, -5], fov: 60 },
  { t: 62.13, pos: [0, 3.3, 10.2], look: [0, 3.4, -5], fov: 58 },
];
const S11 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K11} />
  <Lights warm="#ffe2ae" />
  <Floor kind="carpet" a="#0a2013" b="#0d2a19" unit={2} w={32} d={32} />
  <WallDoor z={-7.5} W={32} kind="plain" a="#0c2417" b="#0c2417" base="#06170d" />
  <SideWall x={-11} kind="plain" a="#0a2013" b="#0a2013" /><SideWall x={11} kind="plain" a="#0a2013" b="#0a2013" />
  <CanvasPlane p={[0, 5.3, -7.2]} s={[10.4, 5.3]} px={[1040, 530]} frame="#35d07f" draw={(c, W, H) => {
    c.fillStyle = "#0e2f1c"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#35d07f"; c.beginPath(); c.arc(W / 2, H * 0.24, 56, 0, 7); c.fill();
    c.fillStyle = "#0c2417"; c.font = "900 72px Inter, Arial"; c.fillText("T", W / 2, H * 0.24 + 2);
    c.fillStyle = "#ffffff"; c.font = "900 140px Inter, Arial"; c.fillText("TDN", W / 2, H * 0.55);
    c.fillStyle = "#ffd36a"; c.font = "900 46px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W / 2, H * 0.76);
    c.fillStyle = "#8ae8b0"; c.font = "700 38px Inter, Arial"; c.fillText("FAKE FOOD SPECIAL", W / 2, H * 0.9);
  }} />
  <Glow p={[0, 5.3, -6.6]} r={5.4} color="rgba(90,255,170,1)" o={0.16} />
  <Globe p={[5.6, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
  <Cyl p={[5.6, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.6, 0.06, -5.2]} rt={0.55} h={0.12} color="#1d4a30" line={1} />
  <Desk p={[0, 0, -2.6]} w={5.6} top="#1d4a30" leg="#06170d" d={1.9} />
  <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#06170d"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
  <Bottle p={[2.2, 1.05, -2.5]} s={0.55} />
  <Monitor p={[3.1, 1.05, -2.8]} rot={[0, -0.35, 0]} screen="#35d07f" />
  <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#1d4a30" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
  <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#0a2013" b="#35d07f" />
  <Dust t={t} area={[6, 6, 4]} color="rgba(200,255,220,.9)" />
  <Person p={[0, 0, -3.6]} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 59.5 && t < 60.1 ? 0.08 : 0,
    arms: t > 61.5 ? "point" : "down", armK: seg(t, 61.5, 61.8), armR: [0.35, 0.55], lookX: 0.1 }} />
</>);

const CUTS = [0, 4.51, 14.95, 20.63, 29.30, 32.76, 39.69, 44.19, 49.77, 54.70, 59.30, 62.13];
export const TdnV9: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#2e4a2a">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#0a1424" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#33241a">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#232a38" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#1d4a42">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#2a3830">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#2c3a1e">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#131c2e">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#1d232e">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#4a3421">{(c) => <S10 {...c} />}</Scene>
      <Scene start={CUTS[10]} end={CUTS[11]} bg="#0c2417" trans="flash">{(c) => <S11 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.51 ? "rgba(140,255,150,.06)" : t < 14.95 ? "rgba(90,140,255,.08)" : t < 20.63 ? "rgba(255,170,90,.08)" : t < 29.30 ? "rgba(120,150,255,.07)" : t < 32.76 ? "rgba(90,255,190,.07)" : t < 39.69 ? "rgba(120,255,190,.06)" : t < 44.19 ? "rgba(160,255,120,.07)" : t < 49.77 ? "rgba(90,140,255,.08)" : t < 54.70 ? "rgba(255,200,90,.07)" : t < 59.30 ? "rgba(255,170,80,.09)" : "rgba(120,255,170,.07)"} />
      {/* S3 chip (16.9–20.5s) */}
      {t > 16.9 && t < 20.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,20,6,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            17,000+ INSPECTIONS
          </span>
        </div>
      ) : null}
      {/* S10 chip (54.9–59.2s) */}
      {t > 54.9 && t < 59.2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,26,16,.88)", color: "#8ae8b0", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            READ THE LABEL TWICE
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
