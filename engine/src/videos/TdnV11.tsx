// TDN v11 — "The $4 Trillion Day" — the global rout of Wednesday 25 Nov 2026: global assets lose
// $4T+ in 24 h, the Nasdaq 100 sinks 20% below its October record into a bear market (first in
// over a year), Bitcoin breaks under $58K then bounces over $60K, Bitcoin ETF November outflows
// hit a record ~$4.71B, $511M of leveraged bets liquidated in a day, gold under $3,500 — triggers:
// core PCE 3.3% (vs 3.2% expected) + proposed US tariffs on 14 partners; Fear & Greed at 11.
// 9:16 720x1280 30fps, 2010 frames (66.90 s voiceover). BACKLOG — render only, do not publish 26 Nov.
// CUTS = [0, 3.10, 10.14, 20.32, 23.52, 27.82, 33.51, 41.26, 47.44, 52.98, 61.37, 66.90].
// S1 the vanishing $4T / S2 the global rout / S3 the bear / S4 $8.5T from the peak / S5 the AI
// balloon deflates / S6 Bitcoin cliff + bounce / S7 the ETF exodus / S8 liquidations seesaw
// S9 nowhere to hide (gold + silver sink) / S10 two sparks / S11 fear gauge + sign-off.
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
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const traderLook: Look = { skin: "#f0c8a0", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#8ae8ff", shoe: "#101018" };
const trader2Look: Look = { skin: "#8a5a34", body: "#3a6ea8", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", badge: "#ffd36a", shoe: "#101018" };
const bullLook: Look = { skin: "#caa27e", body: "#1e5c38", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#2fd46a", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV10) ---------- */
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
const Sack: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#3f7d4e" }) => (
  <group position={p} scale={[s, s, s]}>
    <Ball p={[0, 0.62, 0]} r={0.78} color={color} ink={0.05} s={[1, 0.88, 1]} />
    <Cyl p={[0, 1.3, 0]} rt={0.2} rb={0.3} h={0.3} color={color} line={1} />
    <CanvasPlane p={[0, 0.66, 0.72]} s={[0.62, 0.62]} px={[128, 128]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = "#f5f0c8"; c.font = "900 96px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("$", W / 2, H / 2 + 4);
    }} />
  </group>
);
/* plunging line chart on a dark board; frac = how much of the drop is "live" is faked by the dot in-scene */
const CrashChart: React.FC<{ p: V3; w: number; title: string; color?: string; dashLabel?: string }> = ({ p, w, title, color = "#ff5040", dashLabel }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[1024, 635]} frame="#39424e" draw={(c, W, H) => {
    c.fillStyle = "#0d1420"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(140,170,220,.18)"; c.lineWidth = 2;
    for (let gx = 70; gx < W - 30; gx += 78) { c.beginPath(); c.moveTo(gx, 90); c.lineTo(gx, H - 60); c.stroke(); }
    for (let gy = 120; gy < H - 40; gy += 78) { c.beginPath(); c.moveTo(50, gy); c.lineTo(W - 40, gy); c.stroke(); }
    c.fillStyle = "#f5f7fa"; c.font = "900 62px Inter, Arial"; c.textAlign = "left"; c.textBaseline = "middle"; c.fillText(title, 56, 52);
    if (dashLabel) {
      const dy = H * 0.52; c.strokeStyle = "#ffd36a"; c.lineWidth = 5; c.setLineDash([18, 13]);
      c.beginPath(); c.moveTo(50, dy); c.lineTo(W - 40, dy); c.stroke(); c.setLineDash([]);
      c.fillStyle = "#ffd36a"; c.font = "900 46px Inter, Arial"; c.textAlign = "right"; c.fillText(dashLabel, W - 56, dy - 38);
    }
    c.strokeStyle = color; c.lineWidth = 11; c.lineJoin = "round"; c.beginPath();
    c.moveTo(60, H * 0.30); c.lineTo(W * 0.30, H * 0.34); c.lineTo(W * 0.48, H * 0.28); c.lineTo(W * 0.62, H * 0.55); c.lineTo(W * 0.78, H * 0.50); c.lineTo(W * 0.93, H * 0.86); c.stroke();
    c.fillStyle = color; c.beginPath(); c.moveTo(W * 0.93, H * 0.86); c.lineTo(W * 0.885, H * 0.775); c.lineTo(W * 0.975, H * 0.79); c.closePath(); c.fill();
  }} />
);
const BtcCoin: React.FC<{ p: V3; s?: number; rotZ?: number }> = ({ p, s = 1, rotZ = 0 }) => (
  <group position={p} scale={[s, s, s]} rotation={[0, 0, rotZ]}>
    <Cyl p={[0, 0, 0]} rt={1.05} rb={1.05} h={0.34} rot={[Math.PI / 2, 0, 0]} color="#f0a832" line={2} />
    <CanvasPlane p={[0, 0, 0.19]} s={[1.7, 1.7]} px={[256, 256]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = "#fff3d6"; c.font = "900 168px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("B", W / 2, H / 2 + 6);
      c.fillRect(W / 2 - 34, 26, 13, 204); c.fillRect(W / 2 + 8, 26, 13, 204);
    }} />
  </group>
);
const Bear: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Ball p={[0, 1.7, 0]} r={1.55} color="#6e4a2f" ink={0.05} s={[1.08, 0.98, 0.95]} />
    <Ball p={[0, 3.6, 0.35]} r={1.05} color="#7d5636" ink={0.05} />
    <Ball p={[-0.78, 4.5, 0.3]} r={0.36} color="#5d3d24" ink={0.04} />
    <Ball p={[0.78, 4.5, 0.3]} r={0.36} color="#5d3d24" ink={0.04} />
    <Ball p={[0, 3.3, 1.25]} r={0.48} color="#a87f57" ink={0.04} s={[1.15, 0.8, 0.8]} />
    <Ball p={[0, 3.48, 1.62]} r={0.17} color="#1b1b2a" ink={0.02} />
    <Ball p={[-0.42, 3.85, 1.28]} r={0.13} color="#14100c" ink={0.01} />
    <Ball p={[0.42, 3.85, 1.28]} r={0.13} color="#14100c" ink={0.01} />
    <Box p={[-1.35, 0.85, 0.3]} s={[0.55, 1.7, 0.55]} color="#5d3d24" line={1} rot={[0, 0, 0.22]} />
    <Box p={[1.35, 0.85, 0.3]} s={[0.55, 1.7, 0.55]} color="#5d3d24" line={1} rot={[0, 0, -0.22]} />
    <Box p={[-0.8, 0.3, 0]} s={[0.6, 0.6, 1.1]} color="#4e331e" line={1} />
    <Box p={[0.8, 0.3, 0]} s={[0.6, 0.6, 1.1]} color="#4e331e" line={1} />
  </group>
);

/* =================== S1 0 – 3.10  hook: four trillion, gone =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.6, 13.4], look: [0, 3.4, -6], fov: 60 },
  { t: 3.10, pos: [0, 4.2, 11.4], look: [0, 3.8, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const pileK = 1 - seg(t, 1.52, 2.30, Easing.in(Easing.cubic)) * 0.9;
  const stampK = seg(t, 1.60, 1.92, Easing.out(Easing.back(1.7)));
  const boardK = seg(t, 0.25, 0.6, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe9c4" />
    <Floor kind="plank" a="#5d4020" b="#503619" unit={2} w={38} d={38} />
    <WallDoor z={-12} W={38} kind="plain" a="#77572a" b="#77572a" base="#42300f" />
    <Box p={[0, 5.2, -11.6]} s={[15, 6.4, 0.5]} color="#8a6a34" line={2} />
    {[-5.6, 0, 5.6].map((x, i) => <Box key={i} p={[x, 3.4, -11.2]} s={[0.5, 3.0, 0.5]} color="#5d4020" line={1} />)}
    <group position={[0.9, 0, -5.6]} scale={[pileK, pileK, pileK]}>
      {[-1.7, 0, 1.7].map((x, i) => <Sack key={i} p={[x, 0, 0]} s={1.25} />)}
      {[-0.85, 0.85].map((x, i) => <Sack key={i} p={[x, 1.35, -0.2]} s={1.15} />)}
      <Sack p={[0, 2.6, -0.3]} s={1.05} />
      {[-2.9, 3.0, -1.2, 2.4].map((x, i) => <Cyl key={i} p={[x, 0.14, 1.15]} rt={0.42} rb={0.42} h={0.16 + (i % 3) * 0.16} color="#f0c040" line={1} />)}
    </group>
    {boardK > 0.02 ? <group position={[0, 8.6, -10.6]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={8.8} bg="#241806" frame="#f0c040" lines={[{ t: "$4 TRILLION", s: 118, c: "#ffd36a" }]} /></group> : null}
    {stampK > 0.02 ? <group position={[0.9, 3.4, -3.6]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={5.2} text="GONE" /></group> : null}
    <Person p={[-3.5, 0, -2.6]} h={3.9} look={analyst} f={f} pose={{ mood: t < 1.52 ? "grin" : "worry", arms: "point", armK: seg(t, 0.4, 0.8), armR: [0.85, 0.6], lookX: 0.55 }} />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S2 3.10 – 10.14  the global rout =================== */
const K2: Key[] = [
  { t: 3.10, pos: [0, 4.4, 13.6], look: [0, 4.2, -6], fov: 60 },
  { t: 10.14, pos: [0, 4.1, 11.6], look: [0, 4.3, -6], fov: 58 },
];
const S2 = ({ t, f }: Ctx) => {
  const c1 = seg(t, 4.35, 4.75, Easing.out(Easing.back(1.7)));
  const c2 = seg(t, 5.55, 5.95, Easing.out(Easing.back(1.7)));
  const c3 = seg(t, 6.80, 7.20, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#dfeaff" />
    <Floor kind="tile" a="#0d1b2e" b="#0a1524" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#12263f" b="#12263f" base="#081222" />
    <Globe p={[0, 6.9, -9.6]} r={2.3} rotY={t * 0.25} />
    <Glow p={[0, 6.9, -8.8]} r={4.4} color="rgba(90,160,255,1)" o={0.16} />
    {c1 > 0.02 ? <group position={[-4.35, 2.9, -7.6]} scale={[c1, c1, 1]}><CrashChart p={[0, 0, 0]} w={4.1} title="STOCKS" color="#ff5040" /></group> : null}
    {c2 > 0.02 ? <group position={[0, 2.9, -7.3]} scale={[c2, c2, 1]}><CrashChart p={[0, 0, 0]} w={4.1} title="CRYPTO" color="#ff8a3c" /></group> : null}
    {c3 > 0.02 ? <group position={[4.35, 2.9, -7.6]} scale={[c3, c3, 1]}><CrashChart p={[0, 0, 0]} w={4.1} title="GOLD" color="#ffd36a" /></group> : null}
    <Sign p={[0, 10.15, -10.2]} s={[8.6, 1.05]} text="ONE DAY. EVERYWHERE." bg="#0a1524" fg="#ff9a8a" size={72} frame="#e5233a" />
    <Person p={[5.9, 0, -2.2]} h={3.8} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 4.1, 4.6), armR: [0.75, 0.65], lookX: -0.5 }} />
    <Person p={[-6.1, 0, -2.4]} h={3.7} look={trader2Look} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S3 10.14 – 20.32  the bear market =================== */
const K3: Key[] = [
  { t: 10.14, pos: [0, 4.4, 13.8], look: [0, 4.0, -6], fov: 60 },
  { t: 20.32, pos: [0, 4.0, 11.6], look: [0, 4.2, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const dotK = clamp(seg(t, 11.23, 15.80));
  const dotX = lerp(-5.1, 4.6, dotK), dotY = lerp(6.6, 3.15, dotK * dotK);
  const bearX = lerp(11.5, 4.7, clamp(seg(t, 17.80, 18.60, Easing.out(Easing.cubic))));
  const stampK = seg(t, 18.15, 18.5, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffd9c4" />
    <Floor kind="tile" a="#2a1215" b="#221016" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#38181d" b="#38181d" base="#1c0b0f" />
    <CrashChart p={[-0.9, 5.1, -9.8]} w={11.6} title="NASDAQ 100" color="#ff5040" dashLabel="-20% LINE" />
    <Ball p={[dotX - 0.9, dotY + 0.55, -9.2]} r={0.26} color="#ffd36a" ink={0.02} />
    <Glow p={[dotX - 0.9, dotY + 0.55, -9.0]} r={1.1} color="rgba(255,211,106,1)" o={0.3} />
    <group position={[bearX, 0, -6.4]}><Bear p={[0, 0, 0]} s={1.05} /></group>
    {stampK > 0.02 ? <group position={[-2.2, 2.2, -5.2]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={6.4} text="BEAR MARKET" /></group> : null}
    <Person p={[-5.6, 0, -2.2]} h={3.8} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 11.0, 11.5), armR: [0.8, 0.7], lookX: 0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,200,190,.85)" />
  </>);
};

/* =================== S4 20.32 – 23.52  vanished from the peak =================== */
const K4: Key[] = [
  { t: 20.32, pos: [0, 4.2, 13.2], look: [0, 3.8, -6], fov: 60 },
  { t: 23.52, pos: [0, 3.9, 11.4], look: [0, 4.0, -6], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const vanK = seg(t, 22.21, 22.75, Easing.in(Easing.cubic));
  const boardK = seg(t, 20.85, 21.25, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#e8f2ff" />
    <Floor kind="tile" a="#1c2733" b="#16202b" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#27374a" b="#27374a" base="#101a26" />
    <CanvasPlane p={[0, 4.9, -10.2]} s={[13.2, 7.6]} px={[1155, 665]} frame="#5a7ba6" draw={(c, W, H) => {
      c.fillStyle = "#0e1a29"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#8ae8ff"; c.font = "900 58px Inter, Arial"; c.textAlign = "center"; c.fillText("THE OCTOBER PEAK", W / 2, 76);
      c.beginPath(); c.moveTo(40, H - 60); c.lineTo(W * 0.34, H * 0.52); c.lineTo(W * 0.52, H * 0.20); c.lineTo(W * 0.68, H * 0.55); c.lineTo(W - 40, H - 90); c.closePath();
      c.fillStyle = "#33507a"; c.fill();
      c.strokeStyle = "#f5f7fa"; c.lineWidth = 7; c.beginPath(); c.moveTo(40, H - 60); c.lineTo(W * 0.34, H * 0.52); c.lineTo(W * 0.52, H * 0.20); c.lineTo(W * 0.68, H * 0.55); c.lineTo(W - 40, H - 90); c.stroke();
      c.fillStyle = "#ffffff"; c.beginPath(); c.arc(W * 0.52, H * 0.20, 17, 0, 7); c.fill();
      c.strokeStyle = "#ff5040"; c.lineWidth = 9; c.setLineDash([20, 14]); c.beginPath(); c.moveTo(W * 0.52, H * 0.20); c.lineTo(W - 60, H * 0.83); c.stroke(); c.setLineDash([]);
    }} />
    <group position={[0.26, 6.30 + vanK * 1.6, -9.4]} scale={[1 - vanK * 0.85, 1 - vanK * 0.85, 1]}>
      <Sack p={[-0.95, 0, 0]} s={0.95} /><Sack p={[0.95, 0, 0]} s={0.95} /><Sack p={[0, 1.15, 0]} s={0.85} />
    </group>
    {boardK > 0.02 ? <group position={[0, 1.7, -6.4]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={8.6} bg="#101828" frame="#ff5040" lines={[{ t: "$8.5 TRILLION", s: 104, c: "#ff9a8a" }, { t: "GONE FROM THE PEAK", s: 58, c: "#f5f7fa" }]} /></group> : null}
    <Person p={[-5.7, 0, -2.4]} h={3.8} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 21.6, 22.1), armR: [0.8, 0.75], lookX: 0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S5 23.52 – 27.82  the AI balloon deflates =================== */
const K5: Key[] = [
  { t: 23.52, pos: [0, 4.3, 13.4], look: [0, 4.0, -6], fov: 60 },
  { t: 27.82, pos: [0, 3.9, 11.6], look: [0, 3.8, -6], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const dropK = clamp(seg(t, 24.60, 27.30, Easing.in(Easing.cubic)));
  const balY = lerp(7.05, 4.15, dropK), tilt = lerp(0, 0.38, dropK);
  const thud = t > 27.30 && t < 27.55 ? Math.sin((t - 27.30) * 40) * 0.09 : 0;
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#e6dcff" />
    <Floor kind="carpet" a="#1d1430" b="#241a3d" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#2b1f47" b="#2b1f47" base="#120b24" />
    <group position={[0.6, balY + thud, -7.6]} rotation={[0, 0, tilt]}>
      <Ball p={[0, 0, 0]} r={1.8} color="#7a5cff" ink={0.05} s={[1, 1.08, 1]} />
      <CanvasPlane p={[0, 0.25, 1.78]} s={[2.2, 1.1]} px={[512, 256]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = "#ffffff"; c.font = "900 170px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("AI", W / 2, H / 2 + 6);
      }} />
      <Box p={[-0.85, -2.35, 0]} s={[0.07, 1.05, 0.07]} color="#c9ccd4" line={0} rot={[0, 0, 0.3]} />
      <Box p={[0.85, -2.35, 0]} s={[0.07, 1.05, 0.07]} color="#c9ccd4" line={0} rot={[0, 0, -0.3]} />
      <Box p={[0, -3.15, 0]} s={[2.3, 1.05, 1.5]} color="#8a5a2e" line={2} />
      <CrashChart p={[0, -3.05, 0.78]} w={1.9} title="MKT" color="#ff5040" />
    </group>
    <Sign p={[0, 10.15, -10.4]} s={[9.4, 1.05]} text="THE BOOM BECAME THE DRAG" bg="#120b24" fg="#c9b8ff" size={66} frame="#7a5cff" />
    <Person p={[-4.6, 0, -2.6]} h={3.8} look={traderLook} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 24.2, 24.7), armR: [0.7, 0.95], lookX: 0.45 }} />
    <Person p={[5.2, 0, -2.8]} h={3.8} look={analyst} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(215,200,255,.85)" />
  </>);
};

/* =================== S6 27.82 – 33.51  Bitcoin: the cliff and the bounce =================== */
const K6: Key[] = [
  { t: 27.82, pos: [0, 4.2, 13.6], look: [0, 3.8, -6], fov: 60 },
  { t: 33.51, pos: [0, 3.9, 11.8], look: [0, 3.9, -6], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const slideK = clamp(seg(t, 29.11, 31.30, Easing.in(Easing.cubic)));
  const bounceK = clamp(seg(t, 31.90, 33.10, Easing.out(Easing.back(1.4))));
  const coinX = lerp(-4.6, 1.8, slideK);
  const coinY = lerp(6.3, 2.05, slideK) + bounceK * 1.9;
  const signK = seg(t, 30.45, 30.85, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#ffe2ae" />
    <Floor kind="tile" a="#0e1830" b="#0b1425" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#16233c" b="#16233c" base="#0a1120" />
    {/* the slope down to the cliff edge */}
    <Box p={[-3.1, 3.3, -7.8]} s={[8.6, 0.5, 3.2]} color="#46525f" line={2} rot={[0, 0, -0.42]} />
    <Box p={[2.6, 0.75, -7.8]} s={[3.4, 1.5, 3.2]} color="#2c3646" line={2} />
    <Box p={[5.1, 2.6, -7.8]} s={[0.28, 5.2, 3.2]} color="#f0a832" line={1} />
    <Sign p={[5.1, 5.6, -7.6]} s={[2.9, 0.85]} text="$60,000" bg="#0a1120" fg="#2fd46a" size={88} frame="#2fd46a" />
    {signK > 0.02 ? <group position={[1.9, 3.6, -6.6]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[3.3, 0.9]} text="$58,000" bg="#3d1420" fg="#ff8a7a" size={88} frame="#e5233a" /></group> : null}
    <BtcCoin p={[coinX, coinY, -6.9]} s={1.15} rotZ={-slideK * 5.2 + bounceK * 1.2} />
    {bounceK > 0.03 && bounceK < 0.97 ? <Box p={[1.8, (2.05 + coinY) / 2 + 0.4, -6.9]} s={[0.09, Math.max(0.2, coinY - 2.05), 0.09]} color="#f5f0e2" line={0} /> : null}
    <Person p={[-4.1, 0, -2.6]} h={3.8} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 29.4, 29.9), armR: [0.85, 0.7], lookX: 0.5 }} />
    <Person p={[4.3, 0, -2.6]} h={3.7} look={trader2Look} f={f} pose={{ mood: t > 32.4 ? "smile" : "worry", arms: "down", lookX: -0.45 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S7 33.51 – 41.26  the great ETF exodus =================== */
const K7: Key[] = [
  { t: 33.51, pos: [0, 4.3, 13.8], look: [0, 3.9, -6], fov: 60 },
  { t: 41.26, pos: [0, 4.0, 11.8], look: [0, 4.1, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const runK = clamp(seg(t, 37.33, 40.10));
  const stampK = seg(t, 40.52, 40.86, Easing.out(Easing.back(1.7)));
  const boardK = seg(t, 35.90, 36.35, Easing.out(Easing.back(1.7)));
  const runners: { x0: number; dx: number; z: number; look: Look; h: number }[] = [
    { x0: -0.6, dx: -3.6, z: -4.4, look: traderLook, h: 3.7 },
    { x0: 0.7, dx: -4.4, z: -3.6, look: trader2Look, h: 3.6 },
    { x0: -1.6, dx: -2.6, z: -3.2, look: bullLook, h: 3.8 },
    { x0: 1.8, dx: -5.2, z: -4.9, look: traderLook, h: 3.65 },
  ];
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#0f2a2e" b="#0c2226" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#174047" b="#174047" base="#08191d" />
    <Box p={[0, 3.1, -9.6]} s={[11.5, 6.2, 1.4]} color="#1d4e57" line={2} />
    <Box p={[0, 6.45, -9.6]} s={[12.3, 0.55, 1.8]} color="#123239" line={1} />
    {[-4.6, -2.3, 2.3, 4.6].map((x, i) => <Cyl key={i} p={[x, 2.6, -8.7]} rt={0.34} rb={0.38} h={5.2} color="#d8cf9f" line={1} />)}
    <Box p={[0, 1.55, -8.75]} s={[2.2, 3.1, 0.3]} color="#0a2027" line={2} />
    <Sign p={[0, 5.35, -8.8]} s={[7.4, 1.05]} text="BITCOIN FUNDS" bg="#0c2226" fg="#ffd36a" size={84} frame="#c9a227" />
    {runners.map((r, i) => {
      const x = r.x0 + r.dx * runK, bob = runK > 0 && runK < 1 ? Math.abs(Math.sin(t * 9 + i * 1.7)) * 0.16 : 0;
      return (
        <group key={i}>
          <Person p={[x, bob, r.z]} h={r.h} look={r.look} f={f} pose={{ mood: "worry", arms: "hold", armR: [0.4, 0.5], armL: [-0.4, 0.5], lookX: -0.55 }} />
          <Sack p={[x - 0.15, 1.05 + bob, r.z + 0.55]} s={0.62} />
        </group>
      );
    })}
    {boardK > 0.02 ? <group position={[3.9, 8.9, -9.8]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={7.2} bg="#101828" frame="#ffd36a" lines={[{ t: "NOVEMBER OUTFLOWS", s: 66, c: "#f5f7fa" }, { t: "≈ $5 BILLION", s: 96, c: "#ffd36a" }]} /></group> : null}
    {stampK > 0.02 ? <group position={[-3.4, 2.6, -2.2]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={6.6} text="WORST MONTH EVER" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S8 41.26 – 47.44  the liquidation seesaw =================== */
const K8: Key[] = [
  { t: 41.26, pos: [0, 4.2, 13.6], look: [0, 3.7, -6], fov: 60 },
  { t: 47.44, pos: [0, 3.9, 11.8], look: [0, 3.9, -6], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const tipK = clamp(seg(t, 43.35, 44.30, Easing.in(Easing.cubic)));
  const rot = lerp(-0.10, 0.40, tipK);
  const boardK = seg(t, 41.85, 42.25, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffd9a0" />
    <Floor kind="carpet" a="#26160c" b="#2e1b0f" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#33200f" b="#33200f" base="#180d04" />
    <Cyl p={[0, 1.15, -6.2]} rt={0.5} rb={0.9} h={2.3} color="#5a3a16" line={2} />
    <group position={[0, 2.62, -6.2]} rotation={[0, 0, rot]}>
      <Box p={[0, 0.16, 0]} s={[11.6, 0.32, 1.7]} color="#8a5a2e" line={2} />
      <Person p={[-4.35, 0.32, 0]} h={3.3} look={bullLook} f={f} pose={{ mood: tipK > 0.6 ? "worry" : "grin", arms: "hold", armR: [0.4, 0.5], armL: [-0.4, 0.5], lookX: 0.3 }} />
      <Sack p={[-4.35, 1.28, 0.55]} s={0.6} />
      <Person p={[-2.5, 0.32, 0]} h={3.3} look={traderLook} f={f} pose={{ mood: tipK > 0.6 ? "worry" : "smile", arms: "down", lookX: 0.3 }} />
      <Person p={[4.3, 0.32, 0]} h={3.3} look={trader2Look} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 44.6, 45.1), armR: [0.7, 0.5], lookX: -0.4 }} />
    </group>
    <Sign p={[-4.6, 7.7, -8.6]} s={[3.6, 0.85]} text="LONGS" bg="#0e2f1c" fg="#8ae8b0" size={88} frame="#2fd46a" />
    <Sign p={[4.6, 7.7, -8.6]} s={[3.6, 0.85]} text="SHORTS" bg="#3d1420" fg="#ff8a7a" size={88} frame="#e5233a" />
    {boardK > 0.02 ? <group position={[0, 9.3, -9.8]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={8.8} bg="#180d04" frame="#ff8a3c" lines={[{ t: "$500 MILLION+", s: 100, c: "#ffb37a" }, { t: "LIQUIDATED IN A DAY", s: 58, c: "#f5f7fa" }]} /></group> : null}
    <Person p={[6.1, 0, -2.4]} h={3.8} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 43.0, 43.5), armR: [0.8, 0.55], lookX: -0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,220,180,.85)" />
  </>);
};

/* =================== S9 47.44 – 52.98  nowhere to hide =================== */
const K9: Key[] = [
  { t: 47.44, pos: [0, 4.2, 13.4], look: [0, 3.8, -6], fov: 60 },
  { t: 52.98, pos: [0, 3.9, 11.6], look: [0, 4.0, -6], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const sinkG = clamp(seg(t, 49.10, 51.60));
  const sinkS = clamp(seg(t, 50.30, 52.40));
  const waterY = lerp(0.35, 1.65, Math.max(sinkG, sinkS));
  const gK = seg(t, 49.30, 49.7, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 52.32, 52.68, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#cfe8ff" />
    <Floor kind="tile" a="#0a2530" b="#082029" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#10333f" b="#10333f" base="#05161c" />
    <group position={[-3.6, -sinkG * 1.7, -6.6]}>
      <Box p={[0, 1.1, 0]} s={[3.0, 2.2, 2.2]} color="#33507a" line={2} />
      <Box p={[0, 2.45, 0]} s={[2.2, 0.5, 1.1]} color="#f0c040" line={2} rot={[0, 0.3, 0.06]} />
      <Box p={[-0.5, 2.85, 0.1]} s={[1.1, 0.34, 0.7]} color="#ffd970" line={1} rot={[0, -0.2, -0.05]} />
    </group>
    <group position={[3.7, -sinkS * 1.7, -6.6]}>
      <Box p={[0, 1.1, 0]} s={[3.0, 2.2, 2.2]} color="#33507a" line={2} />
      <Cyl p={[0, 2.55, 0]} rt={0.95} rb={0.95} h={0.3} rot={[0.5, 0, 0.15]} color="#c8ccd4" line={2} />
      <Cyl p={[0.4, 2.95, 0.2]} rt={0.7} rb={0.7} h={0.26} rot={[0.9, 0, -0.2]} color="#aab2bd" line={1} />
    </group>
    <CanvasPlane p={[0, waterY, -4.4]} s={[15.5, 1.15]} px={[1024, 76]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = "rgba(70,170,255,.5)"; c.fillRect(0, 10, W, H - 10);
      c.strokeStyle = "rgba(220,245,255,.9)"; c.lineWidth = 5; c.beginPath();
      for (let x = 0; x <= W; x += 16) c.lineTo(x, 12 + Math.sin(x * 0.05) * 5); c.stroke();
    }} />
    {gK > 0.02 ? <group position={[-3.6, 6.6, -7.4]} scale={[gK, gK, 1]}><Sign p={[0, 0, 0]} s={[4.5, 0.95]} text="GOLD < $3,500" bg="#241806" fg="#ffd36a" size={72} frame="#f0c040" /></group> : null}
    {sK > 0.02 ? <group position={[3.7, 6.6, -7.4]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[4.5, 0.95]} text="SILVER < $40" bg="#1a2029" fg="#dfe6ee" size={76} frame="#aab2bd" /></group> : null}
    <Box p={[0, 0.55, -3.4]} s={[2.6, 1.1, 2.0]} color="#7a5c14" line={2} />
    <Person p={[0, 1.1, -3.4]} h={3.5} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 48.6, 49.1), armR: [0.8, 0.5], lookX: -0.4 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,225,255,.85)" />
  </>);
};

/* =================== S10 52.98 – 61.37  two sparks =================== */
const K10: Key[] = [
  { t: 52.98, pos: [0, 4.3, 13.6], look: [0, 4.0, -6], fov: 60 },
  { t: 61.37, pos: [0, 4.0, 11.8], look: [0, 4.1, -6], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => {
  const sparkK = t > 53.90 && t < 54.35 ? 1 : 0;
  const infK = seg(t, 54.53, 54.95, Easing.out(Easing.back(1.7)));
  const fillK = clamp(seg(t, 54.95, 57.60));
  const tarK = seg(t, 58.13, 58.55, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K10} />
    <Lights warm="#ffd9c4" />
    <Floor kind="tile" a="#200f14" b="#1a0c10" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#2e161d" b="#2e161d" base="#12060a" />
    {sparkK ? <Glow p={[0, 5.6, -6.0]} r={3.4} color="rgba(255,190,80,1)" o={0.5} /> : null}
    {/* inflation thermometer, left */}
    {infK > 0.02 ? <group position={[-4.3, 0, -7.4]} scale={[infK, infK, 1]}>
      <Box p={[0, 3.1, 0]} s={[0.62, 5.6, 0.3]} color="#f5f0e2" line={2} />
      <Box p={[0, 0.85 + fillK * 2.15, 0.02]} s={[0.36, 0.5 + fillK * 4.3, 0.2]} color="#e5233a" line={0} />
      <Ball p={[0, 0.62, 0]} r={0.62} color="#e5233a" ink={0.03} />
      <Board p={[0, 7.15, 0]} w={4.9} bg="#2b0f16" frame="#e5233a" lines={[{ t: "INFLATION", s: 72, c: "#f5f7fa" }, { t: "3.3%", s: 110, c: "#ff8a7a" }]} />
    </group> : null}
    {/* tariff barrier, right */}
    {tarK > 0.02 ? <group position={[4.3, 0, -7.4]} scale={[tarK, tarK, 1]}>
      <Box p={[-1.7, 1.5, 0]} s={[0.7, 3.0, 0.7]} color="#39424e" line={2} />
      <group position={[-1.35, 2.9, 0]} rotation={[0, 0, -0.16]}>
        <Box p={[1.85, 0, 0]} s={[4.4, 0.42, 0.3]} color="#f5f0e2" line={1} />
        {[-0.6, 0.7, 2.0, 3.3].map((x, i) => <Box key={i} p={[x, 0, 0.01]} s={[0.62, 0.44, 0.3]} color="#e5233a" line={0} />)}
      </group>
      <Board p={[0.4, 7.15, 0]} w={5.3} bg="#101828" frame="#ffd36a" lines={[{ t: "NEW TARIFFS", s: 74, c: "#f5f7fa" }, { t: "× 14 COUNTRIES", s: 72, c: "#ffd36a" }]} />
    </group> : null}
    <Person p={[0, 0, -2.8]} h={3.9} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 54.2, 54.7), armR: t < 57.8 ? [0.6, 0.7] : [0.95, 0.7], lookX: t < 57.8 ? -0.55 : 0.55 }} />
    <Sign p={[0, 10.2, -10.4]} s={[8.2, 1.0]} text="TWO SPARKS, ONE FIRE" bg="#12060a" fg="#ffb37a" size={76} frame="#ff8a3c" />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,200,170,.85)" />
  </>);
};

/* =================== S11 61.37 – 66.90  the fear gauge + sign-off =================== */
const K11: Key[] = [
  { t: 61.37, pos: [0, 3.6, 12.4], look: [0, 3.4, -5], fov: 60 },
  { t: 66.90, pos: [0, 3.4, 10.4], look: [0, 3.5, -5], fov: 58 },
];
const S11 = ({ t, f }: Ctx) => {
  const needleK = clamp(seg(t, 61.90, 62.55, Easing.out(Easing.cubic)));
  const needleRot = lerp(0.95, -0.95, needleK);
  const numK = seg(t, 62.43, 62.8, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K11} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#0b1a2c" b="#0e2036" unit={2} w={32} d={32} />
    <WallDoor z={-7.5} W={32} kind="plain" a="#0d1e33" b="#0d1e33" base="#050d18" />
    <SideWall x={-11} kind="plain" a="#0b1a2c" b="#0b1a2c" /><SideWall x={11} kind="plain" a="#0b1a2c" b="#0b1a2c" />
    <CanvasPlane p={[0, 5.6, -7.2]} s={[10.6, 5.4]} px={[1060, 540]} frame="#e5233a" draw={(c, W, H) => {
      c.fillStyle = "#0e2238"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = "#e5233a"; c.beginPath(); c.arc(W / 2, H * 0.24, 56, 0, 7); c.fill();
      c.fillStyle = "#0d1e33"; c.font = "900 72px Inter, Arial"; c.fillText("T", W / 2, H * 0.24 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 138px Inter, Arial"; c.fillText("TDN", W / 2, H * 0.55);
      c.fillStyle = "#ffd36a"; c.font = "900 46px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W / 2, H * 0.76);
      c.fillStyle = "#ff8a7a"; c.font = "700 30px Inter, Arial"; c.fillText("MARKETS SPECIAL", W / 2, H * 0.9);
    }} />
    {/* fear gauge, right of the backdrop */}
    <group position={[3.75, 5.4, -6.6]}>
      <CanvasPlane p={[0, 0, 0]} s={[3.2, 2.3]} px={[640, 462]} frame="#8a97a5" draw={(c, W, H) => {
        c.fillStyle = "#101828"; c.fillRect(0, 0, W, H);
        const cx = W / 2, cy = H * 0.78, R = W * 0.36;
        const zones: [string, number, number][] = [["#2fd46a", Math.PI, Math.PI * 1.33], ["#ffd36a", Math.PI * 1.33, Math.PI * 1.66], ["#e5233a", Math.PI * 1.66, Math.PI * 2]];
        for (const [col, a0, a1] of zones) { c.strokeStyle = col; c.lineWidth = 44; c.beginPath(); c.arc(cx, cy, R, a0, a1); c.stroke(); }
        c.fillStyle = "#f5f7fa"; c.font = "900 44px Inter, Arial"; c.textAlign = "center"; c.fillText("FEAR & GREED", cx, H * 0.16);
        c.fillStyle = "#ff8a7a"; c.font = "900 40px Inter, Arial"; c.fillText("EXTREME FEAR", cx, H * 0.95);
      }} />
      <group position={[0, -0.62, 0.12]} rotation={[0, 0, needleRot]}>
        <Box p={[0, 0.5, 0]} s={[0.13, 1.1, 0.05]} color="#ffd36a" line={0} />
      </group>
      <Ball p={[0, -0.62, 0.14]} r={0.16} color="#f5f7fa" ink={0.02} />
    </group>
    {numK > 0.02 ? <group position={[-3.4, 5.6, -6.9]} scale={[numK, numK, 1]}><Board p={[0, 0, 0]} w={3.0} bg="#2b0f16" frame="#e5233a" lines={[{ t: "11", s: 150, c: "#ff5040" }, { t: "FEAR INDEX", s: 52, c: "#f5f7fa" }]} /></group> : null}
    <Glow p={[0, 5.6, -6.6]} r={5.4} color="rgba(255,120,90,1)" o={0.13} />
    <Globe p={[-5.9, 2.5, -5.2]} r={1.55} rotY={t * 0.4} />
    <Cyl p={[-5.9, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[-5.9, 0.06, -5.2]} rt={0.55} h={0.12} color="#5e2430" line={1} />
    <Desk p={[0, 0, -2.6]} w={5.6} top="#5e2430" leg="#050d18" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#050d18"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    <BtcCoin p={[2.35, 1.55, -2.5]} s={0.5} />
    <Monitor p={[3.3, 1.05, -2.8]} rot={[0, -0.35, 0]} screen="#e5233a" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#5e2430" /><Plant p={[-8.6, 0, -4.6]} s={1.2} /><Lamp p={[8.6, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#0b1a2c" b="#e5233a" />
    <Dust t={t} area={[6, 6, 4]} color="rgba(200,230,255,.9)" />
    <Person p={[0, 0, -3.6]} h={3.5} look={analyst} f={f} pose={{ mood: t < 64.2 ? "worry" : "grin", squash: t > 64.4 && t < 65.0 ? 0.08 : 0,
      arms: t > 66.25 ? "point" : "down", armK: seg(t, 66.25, 66.55), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>);
};

const CUTS = [0, 3.10, 10.14, 20.32, 23.52, 27.82, 33.51, 41.26, 47.44, 52.98, 61.37, 66.90];
export const TdnV11: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#77572a">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#0d1b2e" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#2a1215">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#1c2733" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#1d1430">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#0e1830">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#0f2a2e" trans="zoom">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#26160c">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#0a2530">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#200f14" trans="flash">{(c) => <S10 {...c} />}</Scene>
      <Scene start={CUTS[10]} end={CUTS[11]} bg="#0b1a2c">{(c) => <S11 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 3.10 ? "rgba(255,190,90,.07)" : t < 10.14 ? "rgba(90,140,255,.08)" : t < 20.32 ? "rgba(255,90,70,.07)" : t < 23.52 ? "rgba(120,180,255,.07)" : t < 27.82 ? "rgba(150,110,255,.07)" : t < 33.51 ? "rgba(90,140,255,.08)" : t < 41.26 ? "rgba(90,220,200,.06)" : t < 47.44 ? "rgba(255,170,90,.08)" : t < 52.98 ? "rgba(90,180,255,.08)" : t < 61.37 ? "rgba(255,110,80,.07)" : "rgba(255,150,90,.07)"} />
      {/* S2 chip (3.4–6.4s) */}
      {t > 3.4 && t < 6.4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(8,18,34,.88)", color: "#ff9a8a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            WEDNESDAY — NOV 25
          </span>
        </div>
      ) : null}
      {/* S7 chip (34.2–37.2s) */}
      {t > 34.2 && t < 37.2 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(6,24,28,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            THE GREAT ETF EXODUS
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
