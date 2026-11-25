// TDN v3 — "Two tankers hit mines in the Strait of Hormuz" — war + energy, a break from v1/v2's market stories.
// 9:16 720x1280 30fps, 662 frames (21.97 s voiceover). CUTS = [0, 3.6, 10.7, 14.8, 19.4, 22.07].
// S1 strait diorama, tanker hits a mine / S2 war-room map + barrel stream, 1/5 of the world's oil
// S3 Washington + a tanker balanced on a knife's edge / S4 barrier stops the ships, gas pump price spins up / S5 TDN sign-off desk.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Clock, Grade, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Plant, Shelf, Frame, Lamp, Monitor, Chair, Cabinet, Rug, Dust } from "../style/props";
import { Cam, Key, Globe, Taxi } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
// deterministic pseudo-random (no Math.random in render code)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const captain: Look = { skin: "#c98e62", body: "#2050a0", outfit: "shirt", hair: "short", hairColor: "#101018", shoe: "#1b1b2a" };
const officer: Look = { skin: "#f0b429", body: "#3f7a3a", outfit: "shirt", hair: "short", hairColor: "#14100a", shoe: "#1b1b2a" };
const official: Look = { skin: "#fbe3c8", body: "#2d3142", outfit: "suit", tie: "#b3122e", hair: "grey", shoe: "#1b1b2a" };
const driver: Look = { skin: "#8d5a3a", body: "#e53e3e", outfit: "hoodie", hair: "swept", hairColor: "#111", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV1/TdnV2) ---------- */
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

/* ---------- the tanker (hull along z, bow +z; containers, superstructure, funnel) ---------- */
const Tanker: React.FC<{ p: V3; s?: number; rot?: V3; smoke?: number; f?: number; capt?: boolean; captMood?: "shock" | "worry" | "deadpan" }> = ({ p, s = 1, rot = [0, 0, 0], smoke = 0, f = 0, capt = false, captMood = "shock" }) => (
  <group position={p} rotation={rot} scale={[s, s, s]}>
    <Box p={[0, 0.9, 0]} s={[2.6, 1.8, 9.0]} color="#c2372f" line={2} />
    <Box p={[0, 0.35, 0]} s={[2.7, 0.5, 9.1]} color="#7e1f1a" line={1} />
    <Box p={[0, 1.86, 0]} s={[2.5, 0.14, 8.8]} color="#5a4a42" line={1} />
    {/* containers mid-deck */}
    <Box p={[-0.6, 2.35, 1.6]} s={[1.1, 0.85, 2.2]} color="#2f8cff" line={2} /><Box p={[0.65, 2.35, 1.5]} s={[1.1, 0.85, 2.4]} color="#2fae5f" line={2} />
    <Box p={[-0.55, 2.35, -0.6]} s={[1.15, 0.85, 2.0]} color="#f5a623" line={2} /><Box p={[0.6, 3.2, 1.55]} s={[1.1, 0.85, 2.3]} color="#e5233a" line={2} />
    {/* superstructure + bridge at the stern */}
    <Box p={[0, 2.6, -3.4]} s={[2.0, 1.5, 1.6]} color="#f2f0ea" line={2} />
    <Box p={[0, 3.15, -2.65]} s={[1.7, 0.42, 0.1]} color="#1d3a5f" line={1} />
    <Cyl p={[0, 3.9, -3.7]} rt={0.3} h={1.1} color="#1b1b2a" line={2} /><Cyl p={[0, 4.2, -3.7]} rt={0.31} h={0.3} color="#e5233a" line={1} />
    <Cyl p={[0, 2.9, 4.2]} rt={0.05} h={2.0} color="#d8d8e0" line={1} />
    {/* bow deck rail for the captain to grip */}
    <Cyl p={[0, 2.62, 3.55]} rt={0.045} h={1.9} color="#d8d8e0" rot={[0, 0, Math.PI / 2]} line={1} />
    <Cyl p={[-0.85, 2.28, 3.55]} rt={0.04} h={0.7} color="#d8d8e0" line={1} /><Cyl p={[0.85, 2.28, 3.55]} rt={0.04} h={0.7} color="#d8d8e0" line={1} />
    {capt ? <Person p={[0.55, 1.93, 3.0]} sy={1.93} h={2.5} look={captain} f={f} pose={{ mood: captMood, arms: "hold", armK: 1, armR: [0.3, 0.75], armL: [-0.3, 0.75], lookX: 0.2 }} /> : null}
    {/* smoke puffs from the funnel once hit */}
    {smoke > 0 ? [0, 1, 2, 3].map((i) => { const lt = ((f / 30) * 0.5 + i * 0.27) % 1; return <Ball key={i} p={[Math.sin(i * 2.4) * 0.2, 4.6 + lt * 1.8, -3.7]} r={0.25 + lt * 0.55} color="#8b939e" ink={0} />; }) : null}
  </group>
);

/* ---------- naval mine: spiked ball, half-submerged, chain below ---------- */
const NavalMine: React.FC<{ p: V3; bob: number }> = ({ p, bob }) => (
  <group position={[p[0], p[1] + bob, p[2]]}>
    <Ball p={[0, 0, 0]} r={0.55} color="#23262e" />
    {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2; return <Cyl key={i} p={[Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0]} rt={0.07} h={0.5} color="#3a3f4a" rot={[0, 0, a - Math.PI / 2]} line={1} />; })}
    {[0, 1].map((i) => { const a = 0.8 + i * 2.2; return <Cyl key={i + 9} p={[0, Math.sin(a) * 0.4, Math.cos(a) * 0.55]} rt={0.07} h={0.5} color="#3a3f4a" rot={[a, 0, 0]} line={1} />; })}
    <Cyl p={[0, -0.9, 0]} rt={0.045} h={1.4} color="#14161c" line={1} />
  </group>
);

/* ---------- oil barrel (rolls on its side, axis along z) ---------- */
const OilBarrel: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, 0.46, z]} rotation={[0, 0, -x / 0.46]}>
    <group rotation={[Math.PI / 2, 0, 0]}>
      <Cyl p={[0, 0, 0]} rt={0.46} h={1.15} color="#1f6f8b" line={2} />
      <Cyl p={[0, 0.3, 0]} rt={0.49} h={0.09} color="#173f52" line={1} /><Cyl p={[0, -0.3, 0]} rt={0.49} h={0.09} color="#173f52" line={1} />
    </group>
  </group>
);

/* =================== S1 0 – 3.6  "Two tankers just hit mines" — the strait diorama =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 5.6, 13.5], look: [0, 1.4, -3], fov: 60 },
  { t: 3.6, pos: [0, 4.4, 10.8], look: [0, 1.8, -2], fov: 57 },
];
const HIT = 1.12;
const S1 = ({ t, f }: Ctx) => {
  const sail = seg(t, 0, HIT, Easing.out(Easing.cubic));
  const za = lerp(-8.5, -3.6, sail) - 0.35 * seg(t, HIT, 1.6);
  const rock = t > HIT ? Math.sin((t - HIT) * 9) * 0.07 * Math.max(0, 1 - (t - HIT) / 1.9) : 0;
  const zb = lerp(-14, -10.2, seg(t, 0, 1.7, Easing.out(Easing.cubic)));
  const splash = t > HIT && t < HIT + 0.65 ? (t - HIT) / 0.65 : 0;
  return (<>
    <Cam t={t} keys={K1} impacts={[[HIT, 0.08]]} />
    <Lights warm="#ffe9c4" />
    <CanvasPlane p={[0, 14, -32]} s={[90, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#6db9f2"); g.addColorStop(0.65, "#bfe6ff"); g.addColorStop(1, "#ffeec9"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[25, 12, -30]} r={3.4} color="#ffd36a" ink={0} />
    <Floor kind="tile" a="#1d6fa8" b="#185d8f" unit={2.2} w={46} d={46} />
    {/* rocky shores left and right — the narrow channel between them */}
    <Box p={[-9.0, 0.4, -4]} s={[7.5, 0.9, 36]} color="#d9b06a" line={1} /><Box p={[9.0, 0.4, -4]} s={[7.5, 0.9, 36]} color="#d9b06a" line={1} />
    {[-13, -6, 1, 7].map((z, i) => <Ball key={i} p={[-8.2 + (i % 2) * 1.4, 0.9, z]} r={0.9 + rnd(i) * 0.5} color="#8d8578" s={[1, 0.62, 1]} />)}
    {[[-11, 0.9, -11], [8.4, 0.95, -8], [11.5, 0.9, 2], [8.0, 0.9, 5]].map(([x, y, z], i) => <Ball key={i + 9} p={[x, y, z]} r={0.8 + rnd(i + 30) * 0.5} color="#8d8578" s={[1, 0.62, 1]} />)}
    {/* channel buoys */}
    {[-4.5, 4.5].map((x) => [-9, -2, 5].map((z, i) => <Cyl key={`${x}${i}`} p={[x, 0.35 + Math.sin(f * 0.06 + i) * 0.05, z]} rt={0.16} h={0.7} color={i % 2 ? "#e5233a" : "#f2f0ea"} line={1} />))}
    {/* spare mines bobbing far down the channel */}
    <NavalMine p={[-3.4, 0.05, -13]} bob={Math.sin(f * 0.05) * 0.07} /><NavalMine p={[3.8, 0.05, -17]} bob={Math.sin(f * 0.045 + 2) * 0.07} />
    {/* THE mine, right in the lead tanker's path */}
    <NavalMine p={[-0.55, 0.05, 0.35]} bob={Math.sin(f * 0.07) * 0.08} />
    {/* tanker B stops behind */}
    <Tanker p={[2.1, 0, zb]} s={0.82} f={f} />
    {/* tanker A sails in, strikes the mine at HIT, rocks and smokes */}
    <Tanker p={[-1.1, 0, za]} s={0.82} rot={[0, 0, rock]} smoke={t > HIT ? 1 : 0} f={f} capt captMood={t > HIT ? "shock" : "deadpan"} />
    {/* splash burst + flash on the strike */}
    {splash > 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const a = (rnd(i + 5) - 0.5) * 2.4, lt = splash; return <Ball key={i} p={[-0.55 + a * lt * 1.6, 0.4 + lt * 2.0 - lt * lt * 1.7, 0.35 + (rnd(i + 50) - 0.5) * 1.4]} r={0.16 + lt * 0.1} color="#eaf7ff" ink={0} />; }) : null}
    {t > HIT && t < HIT + 0.3 ? <Glow p={[-0.55, 0.9, 0.5]} r={2.6} color="rgba(255,190,80,1)" o={0.65 * (1 - (t - HIT) / 0.3)} /> : null}
    <Dust t={t} area={[6, 4, 6]} color="rgba(210,240,255,.85)" />
  </>);
};

/* =================== S2 3.6 – 10.7  "Iran's Guards say…" — war-room map + the barrel stream =================== */
const K2: Key[] = [
  { t: 3.6, pos: [-2.6, 3.5, 11.4], look: [-0.3, 3.8, -4], fov: 60 },
  { t: 10.7, pos: [0.4, 3.9, 9.2], look: [0, 4.2, -5], fov: 57 },
];
const MapArt: React.FC = () => (
  <CanvasPlane p={[0, 4.6, -7.8]} s={[10.4, 5.6]} px={[1080, 584]} frame="#5a3d1e" draw={(c, W, H) => {
    c.fillStyle = "#eed9a4"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(120,90,40,.25)"; c.lineWidth = 2; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, (H / 6) * i); c.lineTo(W, (H / 6) * i); c.stroke(); c.beginPath(); c.moveTo((W / 6) * i, 0); c.lineTo((W / 6) * i, H); c.stroke(); }
    // the water channel, running NW -> SE
    c.fillStyle = "#3f8fc2"; c.beginPath(); c.moveTo(0, H * 0.30); c.bezierCurveTo(W * 0.3, H * 0.42, W * 0.42, H * 0.30, W * 0.55, H * 0.47); c.bezierCurveTo(W * 0.68, H * 0.64, W * 0.8, H * 0.55, W, H * 0.72); c.lineTo(W, H * 0.95); c.bezierCurveTo(W * 0.78, H * 0.82, W * 0.66, H * 0.9, W * 0.52, H * 0.72); c.bezierCurveTo(W * 0.38, H * 0.54, W * 0.28, H * 0.66, 0, H * 0.55); c.closePath(); c.fill();
    // land: Iran (top right), Arabia (bottom left)
    c.fillStyle = "#c9a86a"; c.strokeStyle = INK; c.lineWidth = 5;
    c.beginPath(); c.moveTo(W * 0.30, 0); c.lineTo(W, 0); c.lineTo(W, H * 0.70); c.bezierCurveTo(W * 0.8, H * 0.53, W * 0.68, H * 0.62, W * 0.55, H * 0.45); c.bezierCurveTo(W * 0.42, H * 0.28, W * 0.3, H * 0.4, W * 0.18, H * 0.22); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(0, H * 0.57); c.bezierCurveTo(W * 0.28, H * 0.68, W * 0.38, H * 0.56, W * 0.52, H * 0.74); c.bezierCurveTo(W * 0.62, H * 0.88, W * 0.55, H, W * 0.5, H); c.lineTo(0, H); c.closePath(); c.fill(); c.stroke();
    // dashed shipping route through the narrows
    c.strokeStyle = "#ffffff"; c.lineWidth = 6; c.setLineDash([18, 14]); c.beginPath(); c.moveTo(W * 0.04, H * 0.44); c.bezierCurveTo(W * 0.3, H * 0.55, W * 0.45, H * 0.44, W * 0.6, H * 0.6); c.bezierCurveTo(W * 0.72, H * 0.72, W * 0.85, H * 0.68, W * 0.97, H * 0.8); c.stroke(); c.setLineDash([]);
    // labels
    c.fillStyle = "#4a3410"; c.font = "900 54px Inter, Arial"; c.textAlign = "center";
    c.fillText("I R A N", W * 0.72, H * 0.20); c.fillText("A R A B I A", W * 0.22, H * 0.86);
    c.fillStyle = "#0d3a5c"; c.font = "900 44px Inter, Arial"; c.fillText("PERSIAN GULF", W * 0.16, H * 0.40); c.fillText("GULF OF OMAN", W * 0.85, H * 0.90);
    c.fillStyle = "#a3121f"; c.font = "900 58px Inter, Arial"; c.fillText("STRAIT OF HORMUZ", W * 0.52, H * 0.13);
    // compass rose
    c.strokeStyle = "#4a3410"; c.lineWidth = 4; c.beginPath(); c.arc(W * 0.93, H * 0.14, 30, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(W * 0.93, H * 0.14 - 26); c.lineTo(W * 0.93, H * 0.14 + 26); c.moveTo(W * 0.93 - 26, H * 0.14); c.lineTo(W * 0.93 + 26, H * 0.14); c.stroke();
    c.fillStyle = "#4a3410"; c.font = "900 30px Inter, Arial"; c.fillText("N", W * 0.93, H * 0.14 - 40);
  }} />
);
const RedX: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Box p={[0, 0, 0]} s={[1.15, 0.26, 0.06]} rot={[0, 0, 0.7]} color="#e5233a" line={1} />
    <Box p={[0, 0, 0]} s={[1.15, 0.26, 0.06]} rot={[0, 0, -0.7]} color="#e5233a" line={1} />
  </group>
);
const S2 = ({ t, f }: Ctx) => {
  const tt = t - 3.6;
  const x2 = seg(t, 6.25, 6.5, Easing.out(Easing.back(2)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffdfae" />
    <Floor kind="tile" a="#3a4256" b="#333a4c" unit={1.8} w={30} d={30} />
    <WallDoor z={-8} W={30} kind="plain" a="#2c3247" b="#2c3247" base="#171b29" />
    <SideWall x={-11} kind="plain" a="#313950" b="#313950" /><SideWall x={11} kind="plain" a="#313950" b="#313950" />
    <MapArt />
    {/* the two strike marks on the strait: first is already there, second pops on "struck mines" */}
    <RedX p={[-1.85, 5.15, -7.55]} s={0.8} />
    {x2 > 0.02 ? <RedX p={[-0.45, 4.35, -7.55]} s={x2 * 0.85} /> : null}
    <Glow p={[-0.45, 4.35, -7.3]} r={1.8} color="rgba(229,35,58,1)" o={0.35 * x2} />
    {/* the barrel channel: rails + the narrows gate */}
    <Box p={[0, 0.1, -2.45]} s={[17.5, 0.2, 0.16]} color="#6a7284" line={1} /><Box p={[0, 0.1, -0.55]} s={[17.5, 0.2, 0.16]} color="#6a7284" line={1} />
    <Cyl p={[-0.95, 1.0, -1.5]} rt={0.11} h={2.0} color="#e5233a" line={1} /><Cyl p={[0.95, 1.0, -1.5]} rt={0.11} h={2.0} color="#e5233a" line={1} />
    <Box p={[0, 2.05, -1.5]} s={[2.2, 0.22, 0.3]} color="#e5233a" line={1} />
    <CanvasPlane p={[0, 2.5, -1.5]} s={[2.6, 0.62]} px={[520, 124]} draw={(c, W, H) => { c.fillStyle = "#171b29"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("NARROWS", W / 2, H / 2 + 2); }} />
    {/* barrels stream through the channel all scene long */}
    {[0, 1, 2, 3, 4, 5].map((i) => { const ph = (tt * 0.13 + i * 0.19) % 1; return <OilBarrel key={i} x={lerp(-8.6, 8.6, ph)} z={-1.5} />; })}
    {/* the guard officer announces it, pointer on the map */}
    <Person p={[-3.7, 0, -2.8]} sy={0} h={3.5} look={officer} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 3.8, 4.1), armR: [0.75, 0.62], lookX: 0.85 }} />
    <Desk p={[4.9, 0, -3.4]} w={3.6} top="#4a5468" leg="#232838" />
    <Box p={[4.3, 1.18, -3.4]} s={[0.7, 0.22, 0.5]} color="#e5233a" line={2} /><Cyl p={[4.62, 1.36, -3.4]} rt={0.05} h={0.35} color="#1b1b2a" rot={[0, 0, 1.1]} line={1} />
    <Box p={[5.6, 1.1, -3.3]} s={[0.8, 0.06, 1.0]} color="#f2f0ea" line={1} /><Box p={[5.7, 1.16, -3.35]} s={[0.8, 0.06, 1.0]} color="#dfe6ee" rot={[0, 0.3, 0]} line={1} />
    <Clock p={[-7.4, 6.4, -4.95]} r={0.55} t={t} /><Shelf p={[-9.6, 0, -7.2]} w={2.4} rows={3} seed={5} wood="#3a2f22" /><Cabinet p={[9.4, 0, -7.0]} color="#4a5468" />
    <Lamp p={[-8.2, 0, -1.0]} h={3} color="#ffdfae" /><Plant p={[8.6, 0, -5.6]} s={1.1} />
    <Rug p={[0.5, 0, 1.2]} s={[7.5, 3.8]} a="#313950" b="#e5233a" />
    <Shaft p={[-1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, 0.4]} color="255,220,160" o={0.13} /><Dust t={t} area={[6, 6, 4]} color="rgba(255,230,180,.9)" />
  </>);
};

/* =================== S3 10.7 – 14.8  "Washington is weighing its response" — the knife's edge =================== */
const K3: Key[] = [
  { t: 10.7, pos: [-0.5, 3.6, 13.5], look: [1.4, 2.8, -2], fov: 60 },
  { t: 14.8, pos: [0, 3.2, 11.5], look: [1.4, 3.0, -2], fov: 57 },
];
const S3 = ({ t, f }: Ctx) => {
  const wobAmp = 0.05 + 0.13 * seg(t, 12.5, 14.3);
  const wob = Math.sin((t - 10.7) * 5.2) * wobAmp;
  const beam = Math.sin((t - 10.7) * 2.6) * 0.16 * (1 - seg(t, 12.3, 13.2));
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffb98a" />
    <CanvasPlane p={[0, 14, -34]} s={[95, 40]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#241a4e"); g.addColorStop(0.55, "#7a3a6e"); g.addColorStop(1, "#e8763a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[-24, 4.5, -32]} r={3.0} color="#ff9a4a" ink={0} />
    <Floor kind="tile" a="#175d8f" b="#124e7a" unit={2.2} w={46} d={46} />
    <Box p={[-12.5, 0.35, -6]} s={[6.5, 0.8, 30]} color="#c9a06a" line={1} /><Box p={[12.5, 0.35, -6]} s={[6.5, 0.8, 30]} color="#c9a06a" line={1} />
    <Box p={[0, 0.35, -14]} s={[17, 0.7, 6.5]} color="#c9a06a" line={1} />
    {/* Washington: a white capitol on the far shore */}
    <group position={[0, 0.75, -14]}>
      <Box p={[0, 1.5, 0]} s={[11, 3.0, 3.2]} color="#e8e6df" line={2} />
      {[-4.4, -2.2, 0, 2.2, 4.4].map((x) => <Cyl key={x} p={[x, 1.5, 1.75]} rt={0.32} h={3.0} color="#f4f2ec" line={1} />)}
      <Box p={[0, 3.25, 0]} s={[11.6, 0.5, 3.8]} color="#cfd4da" line={1} />
      <Cyl p={[0, 3.9, 0]} rt={1.7} h={0.9} color="#dfe8ee" line={1} />
      <Ball p={[0, 4.9, 0]} r={1.65} color="#eef3f6" s={[1, 0.72, 1]} />
      <Cyl p={[0, 6.2, 0]} rt={0.07} h={1.1} color="#8a93a6" line={1} />
    </group>
    {/* the giant knife, blade up, standing in the strait */}
    <Box p={[0, 0.7, -5.6]} s={[0.7, 1.5, 2.4]} color="#1b1b2a" line={2} />
    <Box p={[0, 1.62, -2]} s={[0.15, 1.05, 7.2]} color="#d7dee8" line={2} />
    <Glow p={[0, 2.2, -2]} r={2.6} color="rgba(255,220,190,1)" o={0.22} />
    {/* the tanker balanced across the blade, wobbling harder into "knife's edge" */}
    <Tanker p={[0, 2.16, -2]} s={0.7} rot={[wob, Math.PI / 2, 0]} f={f} />
    {/* the captain rides the bow in scene space (a Person billboard cannot nest inside the yawed tanker group);
        his bob tracks the ship's roll about its long axis */}
    <Person p={[2.1, 3.51 + Math.sin((t - 10.7) * 5.2 + Math.PI / 2) * wobAmp * 1.1, -2.39]} sy={3.51 + Math.sin((t - 10.7) * 5.2 + Math.PI / 2) * wobAmp * 1.1} h={1.75} look={captain} f={f} pose={{ mood: "worry", nerv: 0.7, sweat: 0.8, arms: "hold", armK: 1, armR: [0.3, 0.75], armL: [-0.3, 0.75], lookX: -0.2 }} />
    {/* the official weighs it up at his dockside desk */}
    <Box p={[5.2, 0.3, -2.5]} s={[6.4, 0.6, 5.4]} color="#7a5a3a" line={1} />
    <Desk p={[5.2, 0.6, -2.8]} w={3.4} top="#e9edf7" leg="#5a6a8a" />
    <group position={[4.15, 1.68, -2.8]}>
      <Cyl p={[0, 0.55, 0]} rt={0.06} h={1.1} color="#8a6a1e" line={1} />
      <group rotation={[0, 0, beam]}>
        <Box p={[0, 1.12, 0]} s={[2.3, 0.09, 0.09]} color="#c9a227" line={1} />
        <Cyl p={[-1.05, 0.78, 0]} rt={0.34} h={0.07} color="#c9a227" line={1} /><Cyl p={[1.05, 0.78, 0]} rt={0.34} h={0.07} color="#c9a227" line={1} />
        <Box p={[-1.05, 0.95, 0]} s={[0.42, 0.3, 0.42]} color="#e5233a" line={1} /><Box p={[1.05, 0.95, 0]} s={[0.42, 0.3, 0.42]} color="#2f8cff" line={1} />
      </group>
      <Box p={[0, 0.03, 0]} s={[0.7, 0.06, 0.5]} color="#8a6a1e" line={1} />
    </group>
    <Person p={[5.2, 0.6, -1.2]} sy={0.6} h={3.3} look={official} f={f} pose={{ mood: t > 13.4 ? "worry" : "deadpan", nerv: t > 13.4 ? 0.5 : 0,
      arms: t > 12.6 ? "down" : "point", armK: seg(t, 12.6, 12.9), armR: [-0.35, 0.6], lookX: -0.4, hunch: 0.2 }} />
    <Dust t={t} area={[6, 4, 5]} color="rgba(255,200,170,.85)" />
  </>);
};

/* =================== S4 14.8 – 19.4  "One blocked strait…" — barrier, stopped ships, the gas pump =================== */
const K4: Key[] = [
  { t: 14.8, pos: [-6.2, 3.6, 11.8], look: [-6.2, 1.7, -2], fov: 60 },
  { t: 16.9, pos: [-6.2, 3.4, 11.0], look: [-6.2, 1.8, -2], fov: 59 },
  { t: 17.6, pos: [7.2, 3.0, 9.8], look: [7.2, 2.1, -1], fov: 59 },
  { t: 19.4, pos: [7.2, 2.8, 8.4], look: [7.2, 2.1, -1], fov: 57 },
];
const S4 = ({ t, f }: Ctx) => {
  const boom = seg(t, 15.0, 15.45, Easing.inOut(Easing.cubic));
  const za = lerp(-9.5, -5.6, seg(t, 14.8, 16.6, Easing.out(Easing.cubic)));
  const zb = lerp(-14.5, -11.2, seg(t, 14.8, 16.9, Easing.out(Easing.cubic)));
  const price = t < 17.9 ? "3.59" : t < 19.25 ? (lerp(3.59, 9.99, seg(t, 17.9, 19.2)) + Math.sin(f * 2.3) * 0.37).toFixed(2) : "9.99";
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe2b0" />
    <CanvasPlane p={[0, 14, -32]} s={[95, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#79bdf0"); g.addColorStop(0.7, "#cfeeff"); g.addColorStop(1, "#fff0cd"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Floor kind="tile" a="#1d6fa8" b="#185d8f" unit={2.2} w={48} d={48} />
    {/* left: the strait channel */}
    <Box p={[-11.6, 0.4, -3]} s={[4.6, 0.9, 30]} color="#d9b06a" line={1} /><Box p={[-1.9, 0.4, -3]} s={[2.6, 0.9, 30]} color="#c9a06a" line={1} />
    <Tanker p={[-7.9, 0, za]} s={0.78} f={f} capt captMood={t > 16.6 ? "worry" : "deadpan"} />
    <Tanker p={[-5.2, 0, zb]} s={0.78} f={f} />
    {/* foreground dressing: a buoy and a lone mine bobbing in front of the boom */}
    <Cyl p={[-3.9, 0.35 + Math.sin(f * 0.06) * 0.05, 4.6]} rt={0.16} h={0.7} color="#e5233a" line={1} />
    <NavalMine p={[-4.35, 0.05, 2.6]} bob={Math.sin(f * 0.055 + 1) * 0.07} />
    {/* the striped boom drops across the channel at "blocked" */}
    <Cyl p={[-9.9, 1.3, -1.6]} rt={0.16} h={2.6} color="#3a3f4a" line={2} /><Cyl p={[-3.4, 1.3, -1.6]} rt={0.16} h={2.6} color="#3a3f4a" line={2} />
    <group position={[-9.9, 2.55, -1.6]} rotation={[0, 0, -0.95 * (1 - boom)]}>
      {[0, 1, 2, 3].map((i) => <Box key={i} p={[0.85 + i * 1.65, 0, 0]} s={[1.6, 0.34, 0.34]} color={i % 2 ? "#f2f0ea" : "#e5233a"} line={1} />)}
    </group>
    {boom >= 1 ? <Glow p={[-6.6, 2.55, -1.2]} r={2.2} color="rgba(229,35,58,1)" o={0.25} /> : null}
    {/* right: the roadside — asphalt slab, gas station, taxi, globe */}
    <Box p={[7.6, 0.07, -1]} s={[13.5, 0.14, 21]} color="#3c4148" line={1} />
    <Box p={[7.6, 0.16, 2.6]} s={[13.5, 0.06, 0.5]} color="#f2f0ea" line={0} />
    <Box p={[7.6, 3.7, -3.2]} s={[7.4, 0.35, 4.6]} color="#f2f0ea" line={2} /><Box p={[7.6, 3.45, -3.2]} s={[7.4, 0.16, 4.6]} color="#d23b2e" line={1} />
    <Cyl p={[4.6, 1.85, -3.2]} rt={0.14} h={3.7} color="#8a93a6" line={1} /><Cyl p={[10.6, 1.85, -3.2]} rt={0.14} h={3.7} color="#8a93a6" line={1} />
    <CanvasPlane p={[7.6, 4.35, -3.2]} s={[3.6, 0.95]} px={[720, 190]} draw={(c, W, H) => { c.fillStyle = "#d23b2e"; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 104px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("GAS • 24H", W / 2, H / 2 + 4); }} />
    {/* the pump with the spinning price */}
    <group position={[7.0, 0.14, -0.6]}>
      <Box p={[0, 1.05, 0]} s={[1.35, 2.1, 0.75]} color="#d23b2e" line={2} />
      <CanvasPlane p={[0, 1.45, 0.4]} s={[1.1, 0.85]} px={[440, 340]} draw={(c, W, H) => {
        c.fillStyle = "#101418"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#ffd36a"; c.font = "900 44px Inter, Arial"; c.textAlign = "center"; c.fillText("PRICE / GAL", W / 2, H * 0.2);
        c.fillStyle = price === "9.99" ? "#ff4a5a" : "#7dff8a"; c.font = "900 118px Inter, Arial"; c.textBaseline = "middle";
        c.fillText(`$${price}`, W / 2, H * 0.58);
        c.fillStyle = "#8a93a6"; c.font = "800 40px Inter, Arial"; c.fillText("SELF SERVE", W / 2, H * 0.88);
      }} />
      <Box p={[0, 0.35, 0.4]} s={[0.9, 0.4]} color="#f2f0ea" line={1} />
      <Cyl p={[0.85, 1.0, 0.2]} rt={0.05} h={1.1} color="#1b1b2a" rot={[0, 0, 0.5]} line={1} />
    </group>
    <Glow p={[7.0, 1.6, 0.2]} r={2.0} color={price === "9.99" ? "rgba(255,60,60,1)" : "rgba(255,220,150,1)"} o={0.25} />
    <Taxi p={[10.6, 0.14, 0.6]} rotY={-0.45} />
    <Person p={[8.7, 0.14, 0.9]} sy={0.14} h={3.3} look={driver} f={f} pose={{ mood: t > 18.3 ? "shock" : "grin", sweat: t > 18.3 ? 0.9 : 0,
      arms: "point", armK: 1, armR: [-0.55, 0.5], lookX: -0.7, hunch: t > 18.3 ? 0.3 : 0 }} />
    <Globe p={[11.6, 2.3, -6.8]} r={1.9} rotY={t * 0.35} />
    <Box p={[11.6, 0.2, -6.8]} s={[1.7, 0.4, 1.7]} color="#5a4a38" line={2} /><Cyl p={[11.6, 0.55, -6.8]} rt={0.09} h={0.5} color="#3a3f4a" line={1} />
    <StreetSign3 />
    <Dust t={t} area={[6, 4, 5]} color="rgba(255,240,200,.85)" />
  </>);
};
const StreetSign3: React.FC = () => (
  <CanvasPlane p={[4.8, 4.6, -4.6]} s={[2.0, 0.9]} px={[440, 200]} draw={(c, W, H) => { c.fillStyle = "#1d6f3f"; c.fillRect(0, 0, W, H); c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6); c.fillStyle = "#fff"; c.font = "900 74px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("EARTH →", W / 2, H / 2 + 2); }} />
);

/* =================== S5 19.4 – 22.07  "The Daily Toon News — the world, in toons." — the sign-off desk =================== */
const K5: Key[] = [
  { t: 19.4, pos: [0, 3.1, 9.8], look: [0, 2.9, -2], fov: 60 },
  { t: 22.07, pos: [0, 3.0, 8.3], look: [0, 3.0, -2], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => (
  <>
    <Cam t={t} keys={K5} />
    <Lights warm="#cfe0ff" />
    <Floor kind="carpet" a="#27355e" b="#22304f" unit={2.0} w={30} d={30} />
    <WallDoor z={-7} W={30} kind="plain" a="#1d2a4a" b="#1d2a4a" base="#101a33" />
    <SideWall x={-11} kind="plain" a="#24335c" b="#24335c" /><SideWall x={11} kind="plain" a="#24335c" b="#24335c" />
    {/* the big TDN screen */}
    <CanvasPlane p={[0, 4.9, -6.8]} s={[9.6, 5.2]} px={[960, 520]} frame="#0b0d1a" draw={(c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#101d42"); g.addColorStop(1, "#1d3a7a"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = "#f5a623"; c.beginPath(); c.arc(W * 0.5, H * 0.36, 74, 0, 7); c.fill();
      c.fillStyle = "#101d42"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("T", W * 0.5, H * 0.36 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 150px Inter, Arial"; c.fillText("TDN", W * 0.5, H * 0.62);
      c.fillStyle = "#e5233a"; c.fillRect(0, H * 0.82, W, H * 0.18);
      c.fillStyle = "#ffffff"; c.font = "900 44px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W * 0.5, H * 0.91);
    }} />
    <Glow p={[0, 4.9, -6.2]} r={5.2} color="rgba(90,140,255,1)" o={0.25} />
    <Globe p={[5.4, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
    <Cyl p={[5.4, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.4, 0.06, -5.2]} rt={0.55} h={0.12} color="#31456e" line={1} />
    {/* the anchor desk */}
    <Desk p={[0, 0, -2.6]} w={5.6} top="#31456e" leg="#1a2440" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#0b0d1a"; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    <Box p={[-1.7, 1.12, -2.5]} s={[0.85, 0.05, 1.1]} color="#f2f0ea" line={1} /><Box p={[-1.6, 1.17, -2.55]} s={[0.85, 0.05, 1.1]} color="#dfe6ee" rot={[0, 0.25, 0]} line={1} />
    <Monitor p={[2.1, 1.05, -2.7]} rot={[0, -0.35, 0]} screen="#e5233a" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#31456e" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#cfe0ff" />
    <Clock p={[-7.6, 6.3, -4.95]} r={0.55} t={t} /><Frame p={[8.2, 3.4, -6.9]} s={[1.3, 1.0]} art={1} />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#22304f" b="#e5233a" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, -0.35]} color="160,190,255" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(200,220,255,.9)" />
    {/* the anchor signs off */}
    <Person p={[0, 0, -3.6]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 19.5 && t < 20.1 ? 0.08 : 0,
      arms: t > 20.85 ? "point" : "down", armK: seg(t, 20.85, 21.15), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>
);

const CUTS = [0, 3.6, 10.7, 14.8, 19.4, 22.07];
export const TdnV3: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const oilSegs = Math.round(seg(t, 8.6, 10.4) * 5);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#7cc4ff">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#2c3247">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#241a4e">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#7cc4ff" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#1d2a4a" trans="flash">{(c) => <S5 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 3.6 ? "rgba(60,140,255,.08)" : t < 10.7 ? "rgba(255,190,90,.07)" : t < 14.8 ? "rgba(170,90,220,.08)" : t < 19.4 ? "rgba(255,150,60,.08)" : "rgba(255,80,80,.06)"} />
      {/* S2 oil-share counter as a screen-space HUD chip (8.4–10.75s): five segments fill to "1/5 OF THE WORLD'S OIL" */}
      {t > 8.4 && t < 10.75 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,18,26,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 58, padding: "16px 30px", borderRadius: 18 }}>
            <span style={{ display: "inline-flex", gap: 10, marginBottom: 8 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ display: "inline-block", width: 44, height: 26, borderRadius: 6, background: i < oilSegs ? "#ffd36a" : "rgba(255,211,106,.22)", border: "3px solid #ffd36a" }} />
              ))}
            </span>
            <br />{oilSegs}/5 OF THE WORLD'S OIL
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
