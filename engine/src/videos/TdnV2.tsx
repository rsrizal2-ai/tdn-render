// TDN v2 — "Bitcoin gives the party back" — the other half of v1's market day.
// 9:16 720x1280 30fps, 766 frames (25.44 s voiceover). CUTS = [0, 2.0, 6.6, 11.3, 15.6, 22.1, 25.4].
// S1 party table, coin topples / S2 chart ski-jump, coin launches to $64,000 flag / S3 elevator free-fall 64k->59k
// S4 shredder eats leveraged bets, $800M counter / S5 vault, gold bars with legs run for the EXIT / S6 crypto winter, frozen coin.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, Surface, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Clock, Calendar, Grade, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Plant, Shelf, Frame, WindowCity, Lamp, Monitor, Chair, Cooler, Cabinet, Rug, Dust } from "../style/props";
import { Cam, Key, camAt, FaceGroup, hand, Arrow3D, Domino, Globe, Crown, Throne, SpotCone, Curtain, Lectern, Building, StreetLamp, StreetSign, Taxi, Hydrant, Bench, Bin, Barrier, PressCam, ChipStack, Card, Dice, HangLamp, Mug, Stars } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8, WALK = 3.4;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
// deterministic pseudo-random (no Math.random in render code)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const crowd: Look[] = [
  { skin: "#fbe3c8", body: "#e53e3e", outfit: "hoodie", hair: "short", hairColor: "#222" }, { skin: "#c98e62", body: "#22a867", outfit: "shirt", hair: "bob", hairColor: "#1a1010" },
  { skin: "#f0b429", body: "#2d3142", outfit: "suit", tie: "#1d2f66", hair: "grey" }, { skin: "#8d5a3a", body: "#7c4dff", outfit: "hoodie", hair: "swept", hairColor: "#111", glasses: true },
];

/* ---------- scene wrapper (same pattern as TdnV1) ---------- */
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

/* ---------- the Bitcoin coin (gold cylinder + hand-drawn B-with-bars faces) ---------- */
const CoinFace: React.FC<{ p: V3; s: number; rotY?: number }> = ({ p, s, rotY = 0 }) => (
  <CanvasPlane p={p} s={[s, s]} px={[256, 256]} draw={(c, W, H) => {
    c.fillStyle = "#f5a623"; c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 4, 0, 7); c.fill();
    c.strokeStyle = "#8a5a00"; c.lineWidth = 8; c.beginPath(); c.arc(W / 2, H / 2, W / 2 - 10, 0, 7); c.stroke();
    c.fillStyle = "#fff8e0"; c.font = "900 148px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText("B", W / 2, H / 2 + 8);
    c.fillRect(W / 2 - 36, H / 2 - 82, 11, 164); c.fillRect(W / 2 + 25, H / 2 - 82, 11, 164);
  }} />
);
// Coin standing upright, faces toward camera (+z). Group it to animate topples/rolls.
const Coin: React.FC<{ p: V3; r?: number; rot?: V3; s?: number }> = ({ p, r = 1.1, rot = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={rot}>
    <Cyl p={[0, 0, 0]} rt={r} rb={r} h={0.22} color="#e89b0c" rot={[Math.PI / 2, 0, 0]} line={2} />
    <CoinFace p={[0, 0, 0.13]} s={r * 2} />
    <CoinFace p={[0, 0, -0.13]} s={r * 2} />
    {void s}
  </group>
);

/* =================== S1 0 – 2.0  "gave the whole party back" — coin topples off the party table =================== */
const K1: Key[] = [
  { t: 0, pos: [2.6, 2.4, 9.5], look: [0, 2.2, -1.5], fov: 60 },
  { t: 2.0, pos: [0.6, 2.6, 7.6], look: [0, 1.8, -1.5], fov: 56 },
];
const S1 = ({ t, f }: Ctx) => {
  // coin stands on the table edge, wobbles from 0.9s, topples backwards and drops off the edge 1.4–2.0s
  const wob = t > 0.9 && t < 1.4 ? Math.sin((t - 0.9) * 22) * 0.08 * seg(t, 0.9, 1.4) : 0;
  const tip = seg(t, 1.4, 1.9, Easing.in(Easing.quad));
  const drop = tip * tip * 1.6;
  const confetti = Array.from({ length: 18 }, (_, i) => ({ x: (rnd(i) - 0.5) * 12, sp: 1.6 + rnd(i + 40) * 2.0, ph: rnd(i + 80) * 6, col: ["#f5a623", "#ffc23a", "#ff4fa0", "#2f8cff"][i % 4] }));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe0b8" />
    <Floor kind="plank" a="#8a5a34" b="#7a4a28" unit={1.8} w={26} d={26} />
    <WallDoor z={-7} W={26} kind="wood" a="#c99a68" b="#bd8c58" base="#5a2e18" />
    <SideWall x={-10} kind="plain" a="#d8b088" b="#d8b088" /><SideWall x={10} kind="plain" a="#d8b088" b="#d8b088" />
    <WindowCity p={[-6.5, 4.6, -6.9]} s={[3.4, 4.0]} dusk /><WindowCity p={[6.5, 4.6, -6.9]} s={[3.4, 4.0]} dusk />
    <CanvasPlane p={[0, 6.6, -6.8]} s={[8, 1.1]} px={[800, 110]} draw={(c, W, H) => { c.fillStyle = "#fffaf0"; c.fillRect(0, 0, W, H); c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6); c.fillStyle = "#e5233a"; c.font = "900 72px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("P A R T Y", W / 2, H / 2 + 2); }} />
    <Desk p={[0, 0, -1.5]} w={6.0} top="#f2ead8" leg="#7a4a28" />
    <Cyl p={[-1.8, 1.35, -1.5]} rt={0.7} rb={0.75} h={0.5} color="#fff0f4" line={2} /><Cyl p={[-1.8, 1.7, -1.5]} rt={0.45} rb={0.5} h={0.35} color="#ff8ab0" line={2} />
    {[0, 1, 2].map((i) => <Ball key={i} p={[-3.6 + i * 0.4, 5.4 + (i % 2) * 0.4, -3.2]} r={0.5} color={["#ff4fa0", "#2f8cff", "#ffc23a"][i]} />)}
    {[0, 1, 2].map((i) => <Ball key={i + 3} p={[3.4 + i * 0.4, 5.6 - (i % 2) * 0.4, -3.4]} r={0.5} color={["#2fd46a", "#e5233a", "#ff4fa0"][i]} />)}
    {confetti.map((cf, i) => { const yy = 8.5 - ((t * cf.sp + cf.ph) % 9); return <Box key={i} p={[cf.x, yy, -2 + (rnd(i + 20) - 0.5) * 5]} s={[0.16, 0.1, 0.02]} rot={[t * 2 + i, t * 1.5 + i * 0.7, i]} color={cf.col} line={1} />; })}
    <Chair p={[-4.4, 0, -0.6]} rotY={0.5} color="#e5233a" /><Chair p={[4.4, 0, -0.6]} rotY={-0.5} color="#2f8cff" />
    <Plant p={[-7.6, 0, 1.6]} s={1.2} /><Plant p={[7.6, 0, 1.6]} s={1.2} />
    <Lamp p={[-7.8, 0, -3.4]} h={3} color="#ffe0b8" /><Rug p={[0, 0, 0.6]} s={[7, 4]} a="#c99a68" b="#f5a623" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.4, 8]} rot={[0, 0, -0.35]} color="255,220,170" o={0.14} /><Dust t={t} area={[5, 5, 3]} color="rgba(255,230,190,.9)" />
    {/* the coin topples off the table edge */}
    <Coin p={[0.6, 2.35 - drop, -1.5]} rot={[wob - tip * 1.35, 0, 0]} r={1.05} />
    {tip > 0.7 ? <Glow p={[0.6, 1.2, -1.2]} r={1.6} color="rgba(255,255,220,1)" o={0.5 * (1 - tip)} /> : null}
    {/* the analyst reaches for it, too late */}
    <Person p={[-1.7, 0, 0.4]} sy={0} h={3.4} look={analyst} f={f} pose={{ mood: t > 1.4 ? "shock" : "laugh", sweat: t > 1.4 ? 0.8 : 0,
      arms: "point", armK: seg(t, 0.9, 1.2), armR: [0.55, 0.5], lookX: 0.9, hunch: t > 1.4 ? 0.3 : 0 }} />
  </>);
};

/* =================== S2 2.0 – 6.6  "Monday +$64,000" — chart ski-jump =================== */
// ramp: a chart line rising left->right, the coin rolls up it and launches at the peak flag.
const rampY = (u: number) => 0.6 + 5.6 * Math.pow(u, 1.6);
const rampX = (u: number) => lerp(-6.5, 5.0, u);
const rampSlope = (u: number) => Math.atan2(5.6 * 1.6 * Math.pow(u, 0.6), 11.5);
const coinU = (t: number) => Easing.in(Easing.quad)(seg(t, 2.3, 5.5));
const K2: Key[] = [
  { t: 2.0, pos: [-5.0, 2.4, 10.5], look: [-3.0, 2.5, -2], fov: 60 },
  { t: 4.2, pos: [-1.0, 4.2, 10.0], look: [1.0, 4.5, -2], fov: 58 },
  { t: 6.6, pos: [2.5, 6.4, 9.0], look: [5.0, 6.5, -2], fov: 56 },
];
const S2 = ({ t, f }: Ctx) => {
  const u = coinU(t), cx = rampX(u), cy = rampY(u), slope = rampSlope(u);
  const launched = t > 5.5, air = launched ? seg(t, 5.5, 6.6, Easing.out(Easing.quad)) : 0;
  const lx = launched ? lerp(5.0, 7.2, air) : cx, ly = launched ? lerp(6.2, 6.2 + 2.2 * air - 1.4 * air * air, air) : cy;
  const pct = 64 * seg(t, 2.6, 5.2, Easing.out(Easing.cubic));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#bfe8ff" />
    {/* day sky + distant hills */}
    <CanvasPlane p={[0, 13, -30]} s={[80, 36]} px={[800, 360]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7cc4ff"); g.addColorStop(0.7, "#cfeeff"); g.addColorStop(1, "#fff3d0"); c.fillStyle = g; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.beginPath(); c.arc(W * 0.8, H * 0.22, 34, 0, 7); c.fill(); }} />
    <Ball p={[24, 11, -28]} r={3.2} color="#ffd36a" ink={0} />
    <Floor kind="tile" a="#e8f4f8" b="#dceef4" unit={2.2} w={44} d={44} />
    {/* the snow slope under the ramp */}
    <Box p={[-0.5, 1.2, -2]} s={[15, 2.4, 6]} rot={[0, 0, 0.42]} color="#f4fbff" line={1} />
    {/* the chart ramp: green rail segments + support posts */}
    {Array.from({ length: 44 }, (_, i) => i / 43).map((uu) => { const x = rampX(uu), y = rampY(uu), a = rampSlope(uu); return (
      <Box key={uu} p={[x, y, -2]} s={[0.85, 0.18, 0.5]} rot={[0, 0, -a]} color="#2fd46a" line={1} />); })}
    {[0.15, 0.4, 0.65, 0.85].map((uu) => <Cyl key={uu} p={[rampX(uu), rampY(uu) / 2, -2]} rt={0.09} h={rampY(uu)} color="#1d3a5f" line={1} />)}
    {/* $64,000 flag at the peak */}
    <Cyl p={[5.0, 7.6, -2]} rt={0.06} h={3.0} color="#1b1b2a" line={1} />
    <CanvasPlane p={[5.85, 8.6, -2]} s={[1.9, 0.9]} px={[380, 180]} draw={(c, W, H) => { c.fillStyle = "#2fd46a"; c.fillRect(0, 0, W, H); c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6); c.fillStyle = "#fff"; c.font = "900 64px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("$64,000", W / 2, H / 2 + 2); }} />
    {/* (price counter is a screen-space HUD chip in TdnV2 root — the in-world plane clipped off-frame during the camera pan) */}
    <Glow p={[lx, ly + 0.4, -1.6]} r={2.2} color="rgba(47,212,106,1)" o={0.3} />
    <Dust t={t} area={[5, 6, 3]} color="rgba(190,245,255,.9)" />
    {/* the coin rolls up the ramp on its edge, then launches spinning */}
    <Coin p={[lx, ly, -2]} rot={[0, 0, launched ? -air * 4.5 : -u * 6]} r={1.0} />
    {/* small green arrow rocket in the far background — the Nvidia rally passing by */}
    <Arrow3D p={[-2.5, 9.5 + Math.sin(f * 0.05) * 0.15, -8]} rot={[0, 0.3, 0.5]} L={2.2} color="#2fd46a" />
    {/* the analyst cheers from the side of the slope */}
    <Person p={[-3.6, 0.4, 0.6]} sy={0.4} h={3.4} look={analyst} f={f} pose={{ mood: t > 5.0 ? "laugh" : "grin", arms: t > 5.0 ? "up" : "down", armK: seg(t, 5.0, 5.3), lookX: 0.8, squash: t > 5.0 && t < 5.6 ? 0.1 : 0 }} />
    {[[-7, 9, -12], [7, 11, -14]].map(([x, y, z], i) => <group key={i} position={[x + Math.sin(f * 0.01 + i) * 0.4, y, z]}><Ball p={[0, 0, 0]} r={1.3} color="#ffffff" /><Ball p={[1.1, -0.2, 0]} r={0.9} color="#ffffff" /><Ball p={[-1.1, -0.2, 0]} r={0.9} color="#ffffff" /></group>)}
  </>);
};

/* =================== S3 6.6 – 11.3  "Tuesday crashed below $60,000" — elevator free-fall =================== */
const K3: Key[] = [
  { t: 6.6, pos: [0, 2.6, 10.5], look: [0, 2.2, -1], fov: 60 },
  { t: 9.0, pos: [0, 2.4, 9.2], look: [0, 2.0, -1], fov: 57 },
  { t: 11.3, pos: [0, 2.6, 8.6], look: [0, 2.0, -1], fov: 56 },
];
const DROP0 = 7.7, DROP1 = 10.4, STOP = 10.5; // car falls on "crashed", slams to a stop on "day"
const S3 = ({ t, f }: Ctx) => {
  const fall = Easing.in(Easing.quad)(seg(t, DROP0, DROP1));
  const carY = -fall * 1.6;
  const price = Math.round(lerp(64000, 59400, seg(t, 7.7, 9.3)));
  const alarm = t > STOP && Math.sin(f * 0.9) > 0;
  return (<>
    <Cam t={t} keys={K3} impacts={[[STOP, 0.09]]} />
    <Lights warm="#ffb080" />
    <Floor kind="tile" a="#3a3f4a" b="#323743" unit={1.8} w={26} d={26} />
    <WallDoor z={-8} W={26} kind="plain" a="#2a2e38" b="#2a2e38" base="#14161c" />
    <SideWall x={-10} kind="plain" a="#33363f" b="#33363f" /><SideWall x={10} kind="plain" a="#33363f" b="#33363f" />
    {/* the elevator car: metal box, open front, drops with the fall */}
    <group position={[0, carY, 0]}>
      <Box p={[0, 2.6, -3.4]} s={[7.6, 5.2, 0.3]} color="#8a93a6" line={2} />
      <Box p={[-3.8, 2.6, -1.4]} s={[0.3, 5.2, 4.4]} color="#6a7284" line={2} />
      <Box p={[3.8, 2.6, -1.4]} s={[0.3, 5.2, 4.4]} color="#6a7284" line={2} />
      <Box p={[0, 5.3, -1.4]} s={[7.9, 0.3, 4.4]} color="#565e70" line={2} />
      <Box p={[0, 0.15, -1.4]} s={[7.9, 0.3, 4.4]} color="#3a3f4a" line={2} />
      <Cyl p={[0, 3.4, -3.1]} rt={0.06} h={6.4} color="#c9d3e0" rot={[0, 0, Math.PI / 2]} line={1} />
      {/* floor display: price spinning down */}
      <CanvasPlane p={[0, 4.6, -3.2]} s={[4.6, 1.4]} px={[920, 280]} frame="#1b1b2a" draw={(c, W, H) => {
        c.fillStyle = "#160608"; c.fillRect(0, 0, W, H);
        c.fillStyle = price >= 60000 ? "#2fd46a" : "#ff4a5a"; c.font = "900 150px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(`$${price.toLocaleString("en-US")}`, W / 2, H / 2 + 4);
      }} />
      <Glow p={[0, 4.6, -2.8]} r={2.6} color={price >= 60000 ? "rgba(47,212,106,0.9)" : "rgba(255,60,80,0.9)"} o={0.3} />
      <Glow p={[0, 2.6, -1.2]} r={3.2} color="rgba(255,220,170,1)" o={0.28} />
      {alarm ? <Glow p={[0, 5.0, -1.0]} r={3.4} color="rgba(255,40,40,1)" o={0.5} /> : null}
      {/* the coin tumbles in the car; the analyst grips the rail, hair flying */}
      <Coin p={[-1.4, 2.6 + (t > DROP0 && t < STOP ? Math.sin(f * 0.5) * 0.15 : 0), -1.8]} rot={[0, 0, t > DROP0 ? -0.5 : 0]} r={0.9} />
      <Person p={[1.6, 0.3, -1.6]} sy={0.3} h={3.3} look={analyst} f={f} pose={{ mood: t > DROP0 ? "shock" : "deadpan", nerv: t > DROP0 ? 0.7 : 0, sweat: t > DROP0 ? 1 : 0,
        arms: "hold", armK: 1, armR: [0.1, 0.7], armL: [-0.1, 0.7], lookX: -0.5, hunch: t > DROP0 ? 0.5 : 0 }} />
    </group>
    <Shaft p={[0, 4.5, 1]} s={[2.4, 8]} rot={[0, 0, 0.3]} color="255,160,110" o={0.12} /><Dust t={t} area={[5, 5, 3]} color="rgba(255,200,160,.9)" />
  </>);
};

/* =================== S4 11.3 – 15.6  "$800M liquidated" — the shredder =================== */
const K4: Key[] = [
  { t: 11.3, pos: [0, 3.0, 10.5], look: [0, 2.4, -1], fov: 60 },
  { t: 13.4, pos: [0, 2.7, 9.0], look: [0, 2.2, -1], fov: 57 },
  { t: 15.6, pos: [-0.8, 3.2, 8.8], look: [0, 3.4, -1], fov: 56 },
];
const stacks = [0, 1, 2, 3, 4].map((i) => ({ x: -2.6 + i * 1.3, feed: 11.9 + i * 0.55 }));
const S4 = ({ t, f }: Ctx) => {
  const liq = 800 * seg(t, 11.8, 14.6, Easing.out(Easing.cubic));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#fff2d8" />
    <Floor kind="tile" a="#cfe8f2" b="#bcd9e8" unit={1.8} w={30} d={30} />
    <WallDoor z={-8} W={30} kind="plain" a="#e8f2f7" b="#dfeaf2" base="#b9cdd9" />
    <SideWall x={-11} kind="plain" a="#dcebf2" b="#dcebf2" /><SideWall x={11} kind="plain" a="#dcebf2" b="#dcebf2" />
    <WindowCity p={[-8.0, 4.8, -7.9]} s={[3.6, 4.2]} /><WindowCity p={[8.0, 4.8, -7.9]} s={[3.6, 4.2]} />
    {/* LED counter: liquidations climbing to $800M */}
    <Box p={[0, 5.4, -7.75]} s={[9.6, 4.4, 0.2]} color="#12303e" />
    <CanvasPlane p={[0, 5.4, -7.6]} s={[9.2, 4.0]} px={[920, 400]} frame="#1d6f7f" draw={(c, W, H) => {
      c.fillStyle = "#06222e"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ff4a5a"; c.font = "900 130px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText(`$${Math.round(liq)}M`, W / 2, H * 0.38);
      c.fillStyle = "#ffd6d8"; c.font = "800 52px Inter, Arial"; c.fillText("LIQUIDATED IN 24 HOURS", W / 2, H * 0.78);
    }} />
    <Glow p={[0, 5.4, -7.0]} r={5.4} color="rgba(255,60,80,0.9)" o={0.22} />
    {/* the shredder on its table */}
    <Desk p={[0, 0, -1.2]} w={6.4} top="#ffffff" leg="#7aa9b4" />
    <Box p={[0, 1.7, -1.2]} s={[3.4, 1.6, 1.8]} color="#1b1b2a" line={2} />
    <Box p={[0, 2.55, -1.2]} s={[2.6, 0.18, 1.2]} color="#0b0d1a" line={2} />
    <CanvasPlane p={[0, 1.7, -0.25]} s={[2.2, 0.9]} px={[440, 180]} draw={(c, W, H) => { c.fillStyle = "#1b1b2a"; c.fillRect(0, 0, W, H); c.fillStyle = "#ff4a5a"; c.font = "900 72px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SHRED", W / 2, H / 2 + 2); }} />
    {/* dollar stacks feed in one by one; shredded strips spit out the side */}
    {stacks.map((s, i) => { const k = seg(t, s.feed, s.feed + 0.5, Easing.in(Easing.quad)); const y = 2.9 - k * 0.7, sc = 1 - k * 0.9; if (sc <= 0.05) return null; return (
      <group key={i} position={[s.x, y, -1.2]} scale={[sc, sc, sc]}>
        <Box p={[0, 0, 0]} s={[1.0, 0.5, 0.7]} color="#2fae5f" line={2} />
        <CanvasPlane p={[0, 0.06, 0.36]} s={[0.9, 0.4]} px={[180, 80]} draw={(c, W, H) => { c.fillStyle = "#2fae5f"; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("$", W / 2, H / 2 + 2); }} />
      </group>); })}
    {t > 12.4 ? Array.from({ length: 14 }, (_, i) => { const yy = 1.2 - ((t - 12.4) * (1.2 + rnd(i + 30)) + rnd(i) * 2) % 1.6; const xx = 2.2 + ((t - 12.4) * (0.8 + rnd(i + 60)) + rnd(i + 90)) % 2.4; return <Box key={i} p={[xx, yy, -0.6 + (rnd(i + 20) - 0.5)]} s={[0.3, 0.05, 0.08]} rot={[t * 2 + i, 0, i * 0.9]} color={i % 2 ? "#2fae5f" : "#dff9e8"} line={1} />; }) : null}
    <Desk p={[-5.6, 0, 1.2]} w={3.2} top="#ffffff" leg="#7aa9b4" /><Monitor p={[-5.8, 1.1, 1.1]} rot={[0, 0.5, 0]} screen="#ff3b4b" />
    <Chair p={[-4.6, 0, -0.2]} rotY={0.3} color="#1d6f7f" /><Chair p={[4.8, 0, -0.4]} rotY={-0.4} color="#1d6f7f" />
    <Shelf p={[-9.4, 0, -7.2]} w={2.6} rows={4} seed={3} wood="#7a5a3a" /><Cabinet p={[9.2, 0, -7.0]} color="#3c7f8f" /><Cooler p={[7.4, 0, -6.6]} />
    <Plant p={[-2.6, 0, -6.8]} s={1.2} /><Plant p={[2.8, 0, -6.8]} s={1.2} />
    <Clock p={[-6.6, 6.2, -4.95]} r={0.5} t={t} /><Frame p={[5.6, 3.0, -7.9]} s={[1.2, 0.9]} art={2} /><Lamp p={[-7.6, 0, -1.2]} h={3} color="#fff2d8" />
    <Rug p={[1.0, 0, 0.8]} s={[6.8, 3.6]} a="#dcebf2" b="#ff4a5a" />
    <Shaft p={[-1.2, 4.2, -2]} s={[2.6, 9]} rot={[0, 0, 0.42]} color="255,240,200" o={0.16} /><Dust t={t} area={[6, 6, 4]} color="rgba(255,245,210,.9)" />
    {/* the analyst feeds the stacks in, then stares at the counter */}
    <Person p={[-1.8, 0, 0.6]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: t > 14.6 ? "worry" : "deadpan", nerv: t > 14.6 ? 0.4 : 0,
      arms: t > 14.6 ? "down" : "point", armK: seg(t, 14.6, 14.9), armR: [0.4, 0.55], lookX: 0.6 }} />
  </>);
};

/* =================== S5 15.6 – 22.1  "big money running for the exit" — vault, gold bars with legs =================== */
const K5: Key[] = [
  { t: 15.6, pos: [-6.5, 2.6, 10.5], look: [-2.0, 2.4, -3], fov: 60 },
  { t: 18.8, pos: [-1.0, 2.6, 10.0], look: [1.0, 2.4, -3], fov: 58 },
  { t: 22.1, pos: [3.5, 2.9, 9.2], look: [4.5, 2.4, -3], fov: 56 },
];
const bars = [0, 1, 2, 3, 4].map((i) => ({ z: -1.2 - (i % 3) * 0.6, start: -4.6 + (i % 2) * 0.8, go: 16.2 + i * 0.7, ph: i * 1.3 }));
const S5 = ({ t, f }: Ctx) => {
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffd2a0" />
    <Floor kind="tile" a="#4a4038" b="#3e352e" unit={1.8} w={30} d={30} />
    <WallDoor z={-8} W={30} kind="plain" a="#5a4a38" b="#5a4a38" base="#2a2018" />
    <SideWall x={-11} kind="plain" a="#54452f" b="#54452f" /><SideWall x={11} kind="plain" a="#54452f" b="#54452f" />
    {/* the vault door, swung open, on the right */}
    <Cyl p={[7.2, 3.2, -6.4]} rt={2.2} rb={2.2} h={0.4} color="#8a93a6" rot={[Math.PI / 2, 0, 0.5]} line={2} />
    <Cyl p={[7.2, 3.2, -6.1]} rt={0.5} rb={0.5} h={0.5} color="#3a3f4a" rot={[Math.PI / 2, 0, 0]} line={2} />
    <Box p={[4.2, 3.2, -7.6]} s={[3.6, 6.4, 0.3]} color="#14161c" />
    <CanvasPlane p={[4.2, 6.9, -7.4]} s={[3.2, 0.9]} px={[640, 180]} draw={(c, W, H) => { c.fillStyle = "#0e2a1a"; c.fillRect(0, 0, W, H); c.fillStyle = "#2fd46a"; c.font = "900 110px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("EXIT →", W / 2, H / 2 + 2); }} />
    <Glow p={[4.2, 6.9, -7.0]} r={2.4} color="rgba(47,212,106,1)" o={0.5} />
    {/* wall board: record November outflows */}
    <Box p={[-1.0, 5.2, -7.75]} s={[6.8, 3.2, 0.2]} color="#1a0a12" />
    <CanvasPlane p={[-1.0, 5.2, -7.6]} s={[6.4, 2.8]} px={[640, 280]} frame="#3a0a12" draw={(c, W, H) => {
      c.fillStyle = "#1a060a"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ff4a5a"; c.font = "900 110px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("-$4.71B", W / 2, H * 0.36);
      c.fillStyle = "#ffd6d8"; c.font = "800 38px Inter, Arial"; c.fillText("NOVEMBER  •  RECORD OUTFLOWS", W / 2, H * 0.78);
    }} />
    <Glow p={[-1.0, 5.2, -7.0]} r={4.4} color="rgba(255,60,80,0.9)" o={0.2} />
    {/* gold piles waiting in the vault */}
    <ChipStack p={[-5.4, 0, -4.6]} n={5} color="#f5a623" r={0.6} /><ChipStack p={[-3.2, 0, -5.2]} n={4} color="#f5a623" r={0.6} />
    <Shelf p={[-9.4, 0, -7.2]} w={2.6} rows={3} seed={7} wood="#3a2a18" /><Cabinet p={[9.2, 0, -7.0]} color="#5a4a38" />
    <Plant p={[-2.6, 0, -6.8]} s={1.2} /><Lamp p={[-7.6, 0, -1.2]} h={3} color="#ffd2a0" />
    <Rug p={[0, 0, 0.8]} s={[6.8, 3.6]} a="#54452f" b="#f5a623" />
    <Shaft p={[-1.2, 4.2, -2]} s={[2.6, 9]} rot={[0, 0, 0.42]} color="255,210,140" o={0.14} /><Dust t={t} area={[6, 6, 4]} color="rgba(255,220,160,.9)" />
    {/* the gold bars run for the exit, little legs pumping */}
    {bars.map((b, i) => { const k = seg(t, b.go, b.go + 2.6, Easing.inOut(Easing.sin)); const x = lerp(b.start, 5.6, k); const bob = k > 0 && k < 1 ? Math.abs(Math.sin((t - b.go) * 9 + b.ph)) * 0.22 : 0; const lean = k > 0 && k < 1 ? 0.16 : 0; return (
      <group key={i} position={[x, bob, b.z]} rotation={[0, 0, -lean]}>
        <Box p={[0, 0.65, 0]} s={[1.2, 0.65, 0.6]} color="#f5a623" line={2} />
        <Cyl p={[-0.3, 0.26, 0]} rt={0.06} h={0.5} color="#1b1b2a" line={1} />
        <Cyl p={[0.3, 0.26, 0]} rt={0.06} h={0.5} color="#1b1b2a" line={1} />
      </group>); })}
    {/* the analyst watches, hands on head */}
    <Person p={[-1.2, 0, 1.2]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: "worry", nerv: 0.4, sweat: 0.7,
      arms: t > 17.5 ? "head" : "down", armK: seg(t, 17.5, 17.8), lookX: 0.7, hunch: 0.35 }} />
  </>);
};

/* =================== S6 22.1 – 25.4  "crypto winter" — snowstorm, frozen coin =================== */
const K6: Key[] = [
  { t: 22.1, pos: [0, 2.8, 9.0], look: [0, 2.6, -1], fov: 58 },
  { t: 25.44, pos: [0, 4.5, 13.5], look: [0, 3.0, -1], fov: 60 },
];
const S6 = ({ t, f }: Ctx) => {
  const snow = Array.from({ length: 40 }, (_, i) => ({ x: (rnd(i) - 0.5) * 14, sp: 1.4 + rnd(i + 40) * 1.8, ph: rnd(i + 80) * 8, s: 0.08 + rnd(i + 120) * 0.1 }));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#9db8ff" />
    <CanvasPlane p={[0, 13, -30]} s={[80, 36]} px={[800, 360]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0a1030"); g.addColorStop(0.6, "#1d2f5e"); g.addColorStop(1, "#3a5a8a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Stars p={[0, 16, -28]} s={[80, 30]} t={t} />
    <Floor kind="tile" a="#2a3550" b="#232c44" unit={2.2} w={40} d={40} />
    <WallDoor z={-8} W={30} kind="plain" a="#1d2740" b="#1d2740" base="#0e1424" />
    <SideWall x={-11} kind="plain" a="#232c44" b="#232c44" /><SideWall x={11} kind="plain" a="#232c44" b="#232c44" />
    <WindowCity p={[-8.0, 4.8, -7.9]} s={[3.6, 4.2]} /><WindowCity p={[8.0, 4.8, -7.9]} s={[3.6, 4.2]} />
    {/* red screens gone cold, monitors dark */}
    <Desk p={[-4.6, 0, -4.2]} w={3.6} top="#c8d4de" leg="#4a5a6a" /><Monitor p={[-5.2, 1.1, -4.3]} rot={[0, 0.3, 0]} screen="#1d2f5e" /><Monitor p={[-4.0, 1.1, -4.3]} rot={[0, 0.15, 0]} screen="#1d2f5e" />
    <Desk p={[4.8, 0, -4.4]} w={3.6} top="#c8d4de" leg="#4a5a6a" /><Monitor p={[4.3, 1.1, -4.5]} rot={[0, -0.2, 0]} screen="#1d2f5e" /><Monitor p={[5.5, 1.1, -4.5]} rot={[0, -0.3, 0]} screen="#1d2f5e" />
    <Chair p={[-4.6, 0, -2.8]} rotY={0.3} color="#3a4a62" /><Chair p={[4.8, 0, -3.0]} rotY={-0.4} color="#3a4a62" />
    <Shelf p={[-9.4, 0, -7.2]} w={2.6} rows={4} seed={3} wood="#2a2f3a" /><Cabinet p={[9.2, 0, -7.0]} color="#3a4a62" />
    <Plant p={[-2.6, 0, -6.8]} s={1.2} /><Plant p={[2.8, 0, -6.8]} s={1.2} />
    <Clock p={[-6.6, 6.2, -4.95]} r={0.5} t={t} /><Frame p={[5.6, 3.0, -7.9]} s={[1.2, 0.9]} art={2} /><Lamp p={[-7.6, 0, -1.2]} h={3} color="#9db8ff" />
    <Rug p={[1.0, 0, 0.8]} s={[6.8, 3.6]} a="#232c44" b="#7cc4ff" />
    <Shaft p={[-1.2, 4.2, -2]} s={[2.6, 9]} rot={[0, 0, 0.42]} color="150,180,255" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(200,220,255,.9)" />
    {/* snowfall */}
    {snow.map((sn, i) => { const yy = 10 - ((t - 22.1) * sn.sp + sn.ph) % 11; const xx = sn.x + Math.sin(f * 0.03 + i) * 0.5; return <Box key={i} p={[xx, yy, -3 + (rnd(i + 20) - 0.5) * 6]} s={[sn.s, sn.s, sn.s]} color="#ffffff" />; })}
    {/* the coin frozen on its ice pedestal, frost crystals around it */}
    <Box p={[0, 0.5, -1.5]} s={[2.6, 1.0, 2.2]} color="#bfe3ff" line={2} />
    <Box p={[0, 1.5, -1.5]} s={[2.2, 1.0, 1.8]} color="#d6ecff" line={2} />
    <Coin p={[0, 2.6, -1.5]} rot={[0, 0, 0]} r={0.85} />
    {[[-1.1, 2.2], [1.15, 2.3], [0.55, 3.5]].map(([x, y], i) => <Box key={i} p={[x, y, -1.6]} s={[0.16, 0.5, 0.1]} rot={[0, 0, (i - 1) * 0.5]} color="#ffffff" line={1} />)}
    <Glow p={[0, 2.6, -1.2]} r={2.0} color="rgba(140,190,255,1)" o={0.3} />
    {/* the analyst shivers in the cold, arms wrapped tight */}
    <Person p={[-2.2, 0, 0.8]} sy={0} h={3.4} look={analyst} f={f} pose={{ mood: "worry", nerv: 0.6, sweat: 0, hunch: 0.55,
      arms: "hold", armK: 1, armR: [0.15, 0.35], armL: [-0.15, 0.35], lookX: 0.7 }} />
  </>);
};

const CUTS = [0, 2.0, 6.6, 11.3, 15.6, 22.1, 25.4];
export const TdnV2: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#c99a68">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#cfeeff">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#2a2e38" trans="whip">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#dcebf2">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#54452f" trans="zoom">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#1d2740" trans="flash">{(c) => <S6 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 2.0 ? "rgba(255,120,80,.07)" : t < 6.6 ? "rgba(47,212,106,.06)" : t < 11.3 ? "rgba(255,60,60,.08)" : t < 15.6 ? "rgba(47,212,106,.07)" : t < 22.1 ? "rgba(255,200,60,.08)" : "rgba(80,140,255,.10)"} />
      {/* S2 price counter as a screen-space HUD chip (2.6–4.8s): climbs $0 → $64,000; the $64,000 flag takes over after */}
      {t > 2.6 && t < 4.8 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,18,26,.88)", color: "#2fd46a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 72, padding: "12px 34px", borderRadius: 18 }}>
            ${Math.round(64 * seg(t, 2.6, 5.2, Easing.out(Easing.cubic)) * 1000).toLocaleString("en-US")}
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
