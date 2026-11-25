// TDN v1 — "Nvidia's whipsaw" — sequel to NvidiaV4 (same cast/world, next chapter).
// 9:16 720x1280 30fps, 693 frames (23.03 s voiceover). CUTS = [0, 3.2, 8.1, 12.4, 16.3, 20.7, 23.1].
// S1 rollercoaster track (chart line) / S2 day trading floor, rocket arrow +31.5% / S3 stage, crown ON (return)
// S4 party room, balloons pop + red arrow topples chip boxes / S5 dusk floor, investors sell, "?" / S6 crest + sunrise.
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
const ceo: Look = { skin: "#f1d0b0", body: "#16171f", outfit: "leather", hair: "swept", hairColor: "#c9c9d2", shoe: "#0b0d1a" };
const crowd: Look[] = [
  { skin: "#fbe3c8", body: "#e53e3e", outfit: "hoodie", hair: "short", hairColor: "#222" }, { skin: "#c98e62", body: "#22a867", outfit: "shirt", hair: "bob", hairColor: "#1a1010" },
  { skin: "#f0b429", body: "#2d3142", outfit: "suit", tie: "#1d2f66", hair: "grey" }, { skin: "#8d5a3a", body: "#7c4dff", outfit: "hoodie", hair: "swept", hairColor: "#111", glasses: true },
  { skin: "#f6d6bd", body: "#2d3142", outfit: "suit", tie: "#ff3b3b", hair: "short", hairColor: "#3b2a1a" }, { skin: "#e0b48c", body: "#ff7a29", outfit: "shirt", hair: "bob", hairColor: "#5a3420" },
  { skin: "#fbe3c8", body: "#2f8cff", outfit: "blazer", shirt: "#fff", hair: "swept", hairColor: "#c47a2a" }, { skin: "#a86b45", body: "#ff4fa0", outfit: "hoodie", hair: "short", hairColor: "#111", glasses: true },
];

/* ---------- scene wrapper (same pattern as NvidiaV4) ---------- */
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
const yawTo = (cam: V3, p: V3) => Math.atan2(cam[0] - p[0], cam[2] - p[2]);
const toWorld = (p: V3, loc: V3, cam: V3): V3 => { const y = yawTo(cam, p); return [p[0] + loc[0] * Math.cos(y) + loc[2] * Math.sin(y), p[1] + loc[1], p[2] - loc[0] * Math.sin(y) + loc[2] * Math.cos(y)]; };

/* =================== S1 0 – 3.2  "wildest swings" — chart-line rollercoaster =================== */
// track: green chart line rising left->right, cart rides it. u in [0,1] along the curve.
const trackY = (u: number) => 1.2 + 6.4 * Math.pow(u, 1.7);
const trackX = (u: number) => lerp(-6.5, 6.5, u);
const trackSlope = (u: number) => Math.atan2(6.4 * 1.7 * Math.pow(u, 0.7), 13);
const cartU = (t: number) => Easing.in(Easing.quad)(seg(t, 0.15, 3.05));
const K1: Key[] = [
  { t: 0, pos: [-4.5, 2.6, 10.5], look: [-3.5, 2.5, -2], fov: 60 },
  { t: 1.6, pos: [-1.0, 3.6, 10.0], look: [0.5, 3.8, -2], fov: 60 },
  { t: 3.2, pos: [2.5, 5.6, 8.5], look: [5.0, 6.0, -2], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const u = cartU(t), cx = trackX(u), cy = trackY(u), slope = trackSlope(u);
  const railPts = Array.from({ length: 25 }, (_, i) => i / 24);
  const crest = t > 2.8;
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#bfe8ff" />
    <Stars p={[0, 16, -30]} s={[90, 40]} t={t} />
    <Floor kind="tile" a="#0d1530" b="#0a1026" unit={2.2} w={40} d={40} />
    {/* faint chart grid backdrop */}
    <CanvasPlane p={[0, 6.5, -7.9]} s={[17, 12]} px={[680, 480]} draw={(c, W, H) => { c.fillStyle = "#0b1230"; c.fillRect(0, 0, W, H); c.strokeStyle = "rgba(90,160,255,.14)"; c.lineWidth = 2; for (let i = 1; i < 12; i++) { c.beginPath(); c.moveTo(W * i / 12, 0); c.lineTo(W * i / 12, H); c.stroke(); c.beginPath(); c.moveTo(0, H * i / 12); c.lineTo(W, H * i / 12); c.stroke(); } c.fillStyle = "rgba(127,232,255,.85)"; c.font = "800 44px Inter, Arial"; c.textAlign = "left"; c.fillText("NVDA  •  1D", 28, 56); }} />
    {/* the track: two rails + sleepers + support posts (40 segments, overlapping so the rails read continuous) */}
    {Array.from({ length: 40 }, (_, i) => i / 39).map((uu) => { const x = trackX(uu), y = trackY(uu), a = trackSlope(uu); return (
      <React.Fragment key={uu}>
        <Box p={[x, y, -2.35]} s={[0.8, 0.09, 0.09]} rot={[0, 0, -a]} color="#2fd46a" line={1} />
        <Box p={[x, y, -1.65]} s={[0.8, 0.09, 0.09]} rot={[0, 0, -a]} color="#2fd46a" line={1} />
      </React.Fragment>); })}
    {[0.12, 0.32, 0.52, 0.72, 0.9].map((uu) => <Cyl key={uu} p={[trackX(uu), trackY(uu) / 2, -2]} rt={0.09} h={trackY(uu)} color="#1d3a5f" line={1} />)}
    {/* the cart (half the track tilt so the rider can stand on it) */}
    <group position={[cx, cy, -2]} rotation={[0, 0, -slope * 0.5]}>
      <Box p={[0, -0.28, 0]} s={[1.7, 0.3, 1.1]} color="#e5233a" line={2} />
      <Box p={[0.75, 0.05, 0]} s={[0.14, 0.7, 1.0]} color="#7a0c22" line={2} />
      <Cyl p={[0.55, 0.55, 0]} rt={0.06} h={1.0} color="#c9d3e0" rot={[Math.PI / 2, 0, 0]} line={1} />
      <Ball p={[-0.7, -0.5, 0.45]} r={0.22} color="#1b1b2a" /><Ball p={[0.7, -0.5, 0.45]} r={0.22} color="#1b1b2a" />
      <Ball p={[-0.7, -0.5, -0.45]} r={0.22} color="#1b1b2a" /><Ball p={[0.7, -0.5, -0.45]} r={0.22} color="#1b1b2a" />
    </group>
    <Glow p={[cx, cy + 0.4, -1.6]} r={2.2} color="rgba(47,212,106,1)" o={0.28} />
    <Dust t={t} area={[5, 6, 3]} color="rgba(190,245,255,.9)" />
    {/* the analyst rides it, feet planted on the cart top (no lean — the cart's tilt alone sells the climb) */}
    <Person p={[cx, cy - 0.25, -2]} sy={cy - 0.25} h={3.0} look={analyst} f={f} pose={{ mood: crest ? "shock" : t > 1.2 ? "grin" : "smile", lookX: 0.6,
      arms: "hold", armK: 1, armR: [0.3, 0.55], armL: [-0.3, 0.55], sweat: crest ? 0.7 : 0 }} />
    {void f}
  </>);
};

/* =================== S2 3.2 – 8.1  "Monday +31.5%" — day trading floor, rocket arrow =================== */
const K2: Key[] = [
  { t: 3.2, pos: [2.8, 2.2, 10.5], look: [0, 5.2, -7], fov: 62 },
  { t: 4.5, pos: [1.6, 3.4, 10.0], look: [-0.8, 5.6, -7], fov: 58 },
  { t: 6.2, pos: [0.4, 4.0, 9.6], look: [0, 5.0, -7], fov: 56 },
  { t: 8.1, pos: [0, 3.8, 10.0], look: [0, 4.6, -7], fov: 56 },
];
const R0 = 4.0, R1 = 4.8; // rocket launch window ("soared")
const S2 = ({ t, f }: Ctx) => {
  const pct = 31.5 * seg(t, 3.7, 5.6, Easing.out(Easing.cubic));
  const rocketY = t < R0 ? 1.6 : lerp(1.6, 13, Easing.in(Easing.quad)(seg(t, R0, R1)));
  const cheer = t > 5.15 && t < 6.6, jump = cheer ? Math.sin(clamp((t - 5.5) / 0.4) * Math.PI) * 0.55 : 0;
  const confetti = Array.from({ length: 24 }, (_, i) => ({ x: (rnd(i) - 0.5) * 13, sp: 2.2 + rnd(i + 40) * 2.4, ph: rnd(i + 80) * 6, col: ["#2fd46a", "#ffc23a", "#ff4fa0", "#2f8cff"][i % 4] }));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#fff2d8" />
    <Floor kind="tile" a="#cfe8f2" b="#bcd9e8" unit={1.8} w={30} d={30} />
    <WallDoor z={-8} W={30} kind="plain" a="#e8f2f7" b="#dfeaf2" base="#b9cdd9" />
    <SideWall x={-11} kind="plain" a="#dcebf2" b="#dcebf2" /><SideWall x={11} kind="plain" a="#dcebf2" b="#dcebf2" />
    <WindowCity p={[-8.0, 4.8, -7.9]} s={[3.6, 4.2]} /><WindowCity p={[8.0, 4.8, -7.9]} s={[3.6, 4.2]} />
    {/* LED wall: rising chart + spinning counter */}
    <Box p={[0, 5.0, -7.75]} s={[9.6, 4.8, 0.2]} color="#12303e" />
    <CanvasPlane p={[0, 5.0, -7.6]} s={[9.2, 4.4]} px={[920, 440]} frame="#1d6f7f" draw={(c, W, H) => {
      c.fillStyle = "#06222e"; c.fillRect(0, 0, W, H); c.strokeStyle = "rgba(80,220,240,.16)"; c.lineWidth = 2; for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(0, H * i / 8); c.lineTo(W, H * i / 8); c.stroke(); c.beginPath(); c.moveTo(W * i / 8, 0); c.lineTo(W * i / 8, H); c.stroke(); }
      c.fillStyle = "#7fe8ff"; c.font = "800 34px Inter, Arial"; c.textAlign = "left"; c.fillText("MONDAY  •  NVDA", 24, 46);
      const pts: [number, number][] = [[0.03, 0.9], [0.14, 0.86], [0.24, 0.8], [0.34, 0.68], [0.44, 0.5], [0.54, 0.34], [0.64, 0.2], [0.74, 0.12], [0.84, 0.08], [0.95, 0.05]];
      const n = Math.max(0.01, lerp(0, pts.length - 1, seg(t, 3.7, 5.6)));
      c.lineWidth = 9; c.lineJoin = "round"; c.strokeStyle = "#2fd46a"; c.beginPath(); let lx = 0, ly = 0;
      for (let i = 0; i <= Math.min(Math.floor(n), pts.length - 1); i++) { lx = pts[i][0] * W; ly = pts[i][1] * H; i ? c.lineTo(lx, ly) : c.moveTo(lx, ly); }
      const i0 = Math.floor(n); if (i0 < pts.length - 1) { const r = n - i0; lx = lerp(pts[i0][0], pts[i0 + 1][0], r) * W; ly = lerp(pts[i0][1], pts[i0 + 1][1], r) * H; c.lineTo(lx, ly); } c.stroke();
      c.fillStyle = "#2fd46a"; c.beginPath(); c.arc(lx, ly, 13, 0, 7); c.fill();
      c.save(); c.translate(W / 2, H * 0.42); c.font = "900 150px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.lineWidth = 12; c.strokeStyle = "#000"; const txt = `+${pct.toFixed(1)}%`; c.strokeText(txt, 0, 0); c.fillStyle = "#2fd46a"; c.fillText(txt, 0, 0); c.restore();
    }} />
    <Glow p={[0, 5, -7.0]} r={5.4} color="rgba(47,212,106,0.9)" o={0.22} />
    <CanvasPlane p={[0, 7.85, -7.6]} s={[16, 0.6]} px={[1600, 60]} draw={(c, W, H) => { c.fillStyle = "#04121a"; c.fillRect(0, 0, W, H); c.font = "800 40px Inter, Arial"; c.textBaseline = "middle"; const txt = "NVDA ▲ 31.5%    S&P ▲ 5.0%    NASDAQ ▲ 6.2%    AI ▲ 9.1%    "; const tw = c.measureText(txt).width; const off = -((f * 9) % tw); for (let k = 0; k < 3; k++) { c.fillStyle = "#2fd46a"; c.fillText(txt, off + k * tw, H / 2 + 2); } }} />
    {/* desks, monitors, dressing */}
    <Desk p={[-4.6, 0, -4.2]} w={3.6} top="#ffffff" leg="#7aa9b4" /><Monitor p={[-5.2, 1.1, -4.3]} rot={[0, 0.3, 0]} screen="#2fd46a" /><Monitor p={[-4.0, 1.1, -4.3]} rot={[0, 0.15, 0]} screen="#1d6f7f" />
    <Desk p={[4.8, 0, -4.4]} w={3.6} top="#ffffff" leg="#7aa9b4" /><Monitor p={[4.3, 1.1, -4.5]} rot={[0, -0.2, 0]} screen="#2fd46a" /><Monitor p={[5.5, 1.1, -4.5]} rot={[0, -0.3, 0]} screen="#2fd46a" />
    <Desk p={[-5.6, 0, 1.2]} w={3.2} top="#ffffff" leg="#7aa9b4" /><Monitor p={[-5.8, 1.1, 1.1]} rot={[0, 0.5, 0]} screen="#2fd46a" />
    <Chair p={[-4.6, 0, -2.8]} rotY={0.3} color="#1d6f7f" /><Chair p={[4.8, 0, -3.0]} rotY={-0.4} color="#1d6f7f" /><Chair p={[-5.0, 0, 2.6]} rotY={0.8} color="#ff8a1c" />
    <Shelf p={[-9.4, 0, -7.2]} w={2.6} rows={4} seed={3} wood="#7a5a3a" /><Cabinet p={[9.2, 0, -7.0]} color="#3c7f8f" /><Cooler p={[7.4, 0, -6.6]} />
    <Plant p={[-2.6, 0, -6.8]} s={1.2} /><Plant p={[2.8, 0, -6.8]} s={1.2} /><Plant p={[7.2, 0, 1.4]} s={1.1} />
    <Clock p={[-6.6, 6.2, -4.95]} r={0.5} t={t} /><Frame p={[5.6, 3.0, -7.9]} s={[1.2, 0.9]} art={2} /><Lamp p={[-7.6, 0, -1.2]} h={3} color="#fff2d8" />
    <Rug p={[1.0, 0, 0.8]} s={[6.8, 3.6]} a="#dcebf2" b="#2fd46a" />
    <Shaft p={[-1.2, 4.2, -2]} s={[2.6, 9]} rot={[0, 0, 0.42]} color="255,240,200" o={0.16} /><Dust t={t} area={[6, 6, 4]} color="rgba(255,245,210,.9)" />
    {/* the rocket arrow: green, launches on "soared", out through the skylight */}
    <Arrow3D p={[-1.7, rocketY, -1.7]} rot={[0, 0.35, 0.12]} L={3.4} color="#2fd46a" />
    <Glow p={[-1.7, rocketY - 1.4, -1.7]} r={1.6} color="rgba(47,212,106,1)" o={t > R0 && t < R1 + 0.4 ? 0.7 : 0} />
    {/* confetti after the counter lands */}
    {t > 5.6 ? confetti.map((cf, i) => { const yy = 9.5 - ((t - 5.6) * cf.sp + cf.ph) % 10; return <Box key={i} p={[cf.x, yy, -2 + (rnd(i + 20) - 0.5) * 5]} s={[0.16, 0.1, 0.02]} rot={[t * 3 + i, t * 2 + i * 0.7, i]} color={cf.col} line={1} />; }) : null}
    {/* the analyst cheers at the side so the LED wall owns the centre */}
    <Person p={[-1.8, jump, -0.5]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: cheer ? "laugh" : t > 4.0 ? "grin" : "smile", squash: jump > 0 ? 0.1 : 0, air: jump > 0 ? 1 : 0,
      arms: cheer ? "up" : "down", armK: seg(t, 5.15, 5.4), lookX: t < 4.0 ? 0.6 : 0.2, tilt: cheer ? -0.06 : 0 }} />
  </>);
};

/* =================== S3 8.1 – 12.4  "Huang returned as CEO" — crown ON =================== */
const ST = 1.0, LX = 0.9, LZ = 0.25, CZ = -0.7, CH = 3.7;
const K3: Key[] = [
  { t: 8.1, pos: [-2.5, 3.6, 12.5], look: [1.0, 4.0, -2], fov: 58 },
  { t: 10.3, pos: [0, 3.8, 11.0], look: [1.0, 4.0, -2], fov: 56 },
  { t: 12.4, pos: [0.5, 4.0, 10.0], look: [1.2, 3.8, -1.5], fov: 54 },
];
const W0 = 8.35, W1 = 10.3; // CEO walks in from the right wing, stops BESIDE the lectern (visible, not hidden behind it)
const ceoX = (t: number) => lerp(8.0, LX + 1.7, seg(t, W0, W1, Easing.inOut(Easing.sin)));
const S3 = ({ t, f }: Ctx) => {
  const x = ceoX(t), P: V3 = [x, ST, CZ], moving = t > W0 && t < W1, dist = 8.0 - x;
  const cam = camAt(t, K3).pos;
  // crown: descends from above (10.5-11.4) onto the CEO's head, rests there
  const descend = seg(t, 10.5, 11.4, Easing.inOut(Easing.sin));
  const headLoc = hand(CH, [0, 0.79], 0, false, 0.05);
  const headW = toWorld(P, headLoc, cam);
  const crownW: V3 = [headW[0], lerp(8.6, headW[1], descend), headW[2]];
  const raise = seg(t, 11.4, 11.8, Easing.out(Easing.back(2)));
  const slide = t < 10.3 ? 0 : 1;
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffd2f0" />
    <Floor kind="carpet" a="#3a0f2e" b="#330d29" unit={1.6} w={34} d={34} />
    <Box p={[0, ST / 2, -1.5]} s={[18, ST, 8]} color="#2a1846" />
    <Surface p={[0, ST + 0.01, -1.5]} s={[18, 8]} rot={[-Math.PI / 2, 0, 0]} kind="plank" a="#6b3a1f" b="#5e321a" unit={1.6} />
    <Box p={[0, ST - 0.06, 2.52]} s={[18, 0.12, 0.08]} color="#ffc23a" line={2} />
    {/* LED screen: $952B, then HUANG RETURNS */}
    <Box p={[1.0, 5.6, -5.25]} s={[12.4, 6.0, 0.3]} color="#120a22" />
    <CanvasPlane p={[1.0, 5.6, -5.05]} s={[12, 5.6]} px={[960, 448]} draw={(c, W, H) => {
      if (slide === 0) { c.fillStyle = "#0e2a1a"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffc23a"; c.font = "900 170px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("+$952B", W / 2, H * 0.42); c.fillStyle = "#dff9ff"; c.font = "800 52px Inter, Arial"; c.fillText("ADDED IN ONE DAY", W / 2, H * 0.78); }
      else { const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#1a5c2a"); g.addColorStop(1, "#0e3a1a"); c.fillStyle = g; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 110px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("HUANG", W / 2, H * 0.36); c.fillStyle = "#ffc23a"; c.font = "900 110px Inter, Arial"; c.fillText("RETURNS", W / 2, H * 0.62); c.fillStyle = "#dff9ff"; c.font = "800 36px Inter, Arial"; c.fillText("UNANIMOUS BOARD VOTE", W / 2, H * 0.10); }
    }} />
    <Glow p={[1.0, 5.6, -4.6]} r={6} color={slide === 1 ? "rgba(47,212,106,0.9)" : "rgba(255,200,60,0.7)"} o={0.25} />
    <Curtain p={[-7.4, 4.6, 0.6]} s={[2.8, 9.2]} /><Curtain p={[7.3, 4.6, 0.6]} s={[2.6, 9.2]} /><Curtain p={[0, 8.6, 0.65]} s={[18, 1.8]} folds={16} />
    <Curtain p={[-6.6, 4.6, -5.2]} s={[2.4, 9.2]} color="#7a0c22" /><Curtain p={[8.2, 4.6, -5.2]} s={[2.4, 9.2]} color="#7a0c22" />
    <Box p={[0, 9.4, -1.0]} s={[16, 0.25, 0.25]} color="#3a3a4a" line={2} />
    {[-5, -2.5, 2.5, 5].map((x) => <React.Fragment key={x}><Cyl p={[x, 9.0, -1.0]} rt={0.22} rb={0.3} h={0.6} color="#1b1b2a" line={2} /><Glow p={[x, 8.7, -0.8]} r={0.8} color="rgba(255,200,255,1)" o={0.6} /></React.Fragment>)}
    <SpotCone p={[LX, 9.0, CZ + 0.4]} h={9.0 - ST} r={1.7} color="#fff1c8" o={0.12} />
    <Glow p={[LX, ST + 0.05, CZ + 0.4]} r={1.8} color="rgba(255,240,200,1)" o={0.35} />
    <Lectern p={[LX, ST, LZ]} />
    {[-4.2, 4.6].map((xx) => <Box key={xx} p={[xx, ST + 0.35, 1.7]} s={[1.4, 0.7, 0.8]} color="#1b1b2a" rot={[-0.5, 0, 0]} />)}
    <Plant p={[-5.4, ST, -3.8]} s={1.3} pot="#ffc23a" /><Plant p={[6.6, ST, -3.8]} s={1.3} pot="#ffc23a" />
    {[4.6, 6.2, 7.8].map((z, r) => Array.from({ length: 9 }, (_, i) => { const xx = -8 + i * 2 + (r % 2) * 0.6; const head = (i * 5 + r * 3) % 4 !== 0; return <React.Fragment key={r + "-" + i}><Box p={[xx, 0.9, z]} s={[1.6, 1.8, 0.3]} color="#7a0c22" line={3} />{head ? <Ball p={[xx, 2.1 + Math.sin(f * 0.07 + i + r) * 0.02, z - 0.3]} r={0.44} color={["#1b1b2a", "#2a1a12", "#3a2a4a", "#20203a"][(i + r) % 4]} /> : null}</React.Fragment>; }))}
    <group position={[-6.0, 0, 9.2]}><Cyl p={[0, 1.0, 0]} rt={0.05} h={2.0} color="#2b3350" line={2} /><PressCam p={[0, 2.2, 0]} s={1.6} /></group>
    <Dust t={t} area={[3, 7, 2]} color="rgba(255,235,200,.9)" />
    {/* the CEO walks in, stops at the lectern, the crown comes down onto his head */}
    <Person p={P} sy={ST} h={CH} look={ceo} f={f} pose={{ mood: t < 10.5 ? "deadpan" : t < 11.4 ? "worry" : "grin", nerv: t > 10.5 && t < 11.4 ? 0.3 : 0, hunch: t > 11.4 ? 0.3 * seg(t, 11.4, 11.7) : 0,
      walk: moving ? dist * WALK : undefined, speed: moving ? 0.8 : 0, flip: true,
      armR: t > 11.4 ? [0.25, 0.62 * raise + 0.3 * (1 - raise)] : undefined, armRK: raise, lookX: 0 }} />
    <Crown p={crownW} s={0.62} rot={[0, 0.3, 0]} />
    {descend >= 1 ? <Glow p={[headW[0], headW[1] + 0.3, headW[2] + 0.2]} r={0.9} color="rgba(255,230,120,1)" o={0.5 + 0.15 * Math.sin(f * 0.3)} /> : null}
    {void cam}
  </>);
};

/* =================== S4 12.4 – 16.3  "party didn't last / Tuesday -7.5%" — party room =================== */
const K4: Key[] = [
  { t: 12.4, pos: [0, 3.0, 10.5], look: [0, 2.2, -1], fov: 60 },
  { t: 14.7, pos: [0, 2.7, 9.0], look: [0, 2.0, -1], fov: 58 },
  { t: 16.3, pos: [-1.0, 2.9, 8.5], look: [-0.5, 2.0, -1], fov: 56 },
];
const balloons = [0, 1, 2, 3, 4].map((i) => ({ x: -4.6 + i * 2.3, y: 5.6 + (i % 2) * 0.5, z: -3.5 - (i % 3) * 0.8, col: ["#ff4fa0", "#2f8cff", "#ffc23a", "#2fd46a", "#e5233a"][i], pop: 12.9 + i * 0.16 }));
const chipBoxes: { x: number; label: string; col: string; sub: string }[] = [
  { x: -2.5, label: "NVDA", col: "#2fd46a", sub: "-7.5%" }, { x: -0.85, label: "AMD", col: "#e5233a", sub: "-10%" },
  { x: 0.85, label: "MICRON", col: "#2f8cff", sub: "-10%" }, { x: 2.5, label: "INTEL", col: "#7cc4ff", sub: "-8%" },
];
const CRASH = 15.0; // red arrow spears down on "fell"
const S4 = ({ t, f }: Ctx) => {
  const arrowY = t < 14.76 ? 11 : lerp(11, 1.9, Easing.in(Easing.quad)(seg(t, 14.76, CRASH)));
  const shock = t >= CRASH;
  return (<>
    <Cam t={t} keys={K4} impacts={[[CRASH, 0.06]]} />
    <Lights warm="#ffe0b8" />
    <Floor kind="plank" a="#8a5a34" b="#7a4a28" unit={1.8} w={26} d={26} />
    <WallDoor z={-7} W={26} kind="wood" a="#c99a68" b="#bd8c58" door={{ x: 5.4, w: 2.4, h: 4.2 }} base="#5a2e18" />
    <SideWall x={-10} kind="plain" a="#d8b088" b="#d8b088" /><SideWall x={10} kind="plain" a="#d8b088" b="#d8b088" />
    <WindowCity p={[-6.5, 4.6, -6.9]} s={[3.4, 4.0]} dusk /><WindowCity p={[6.5, 4.6, -6.9]} s={[3.4, 4.0]} dusk />
    {/* PARTY banner */}
    <CanvasPlane p={[0, 6.6, -6.8]} s={[8, 1.1]} px={[800, 110]} draw={(c, W, H) => { c.fillStyle = "#fffaf0"; c.fillRect(0, 0, W, H); c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(3, 3, W - 6, H - 6); c.fillStyle = "#e5233a"; c.font = "900 72px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("P A R T Y", W / 2, H / 2 + 2); }} />
    {/* party table with cake */}
    <Desk p={[0, 0, -2.6]} w={5.4} top="#f2ead8" leg="#7a4a28" />
    <Cyl p={[0, 1.35, -2.6]} rt={0.7} rb={0.75} h={0.5} color="#fff0f4" line={2} /><Cyl p={[0, 1.7, -2.6]} rt={0.45} rb={0.5} h={0.35} color="#ff8ab0" line={2} />
    {[0, 1, 2, 3, 4].map((i) => <Cyl key={i} p={[-0.3 + i * 0.15, 1.95, -2.6]} rt={0.03} h={0.25} color="#ffc23a" line={1} />)}
    {/* balloons: pop one by one on "didn't last" */}
    {balloons.map((b, i) => { const k = t < b.pop ? 1 : Math.max(0, 1 - (t - b.pop) * 9); if (k <= 0) return null; return (
      <React.Fragment key={i}>
        <Ball p={[b.x, b.y + Math.sin(f * 0.05 + i) * 0.06, b.z]} r={0.55 * k} color={b.col} />
        <Cyl p={[b.x, b.y - 0.8, b.z]} rt={0.015} h={0.6} color="#8a7a6a" line={1} />
        {t > b.pop && t < b.pop + 0.25 ? <Glow p={[b.x, b.y, b.z]} r={0.9} color="rgba(255,255,255,1)" o={1 - (t - b.pop) * 4} /> : null}
      </React.Fragment>); })}
    {/* chip boxes on a second table (further back so the crashing arrow stays in frame): the red arrow knocks them over */}
    <Desk p={[0, 0, -1.0]} w={6.4} top="#d9f1f5" leg="#7aa9b4" />
    {chipBoxes.map((b, i) => { const tip = seg(t, CRASH + 0.06 + i * 0.12, CRASH + 0.5 + i * 0.12, Easing.in(Easing.quad)); const rot = tip * 1.25, yy = 1.35 - tip * 0.85, xx = b.x + tip * (b.x > 0 ? 0.7 : -0.7); return (
      <group key={b.label} position={[xx, yy, -1.0]} rotation={[0, 0, -rot]}>
        <Box p={[0, 0, 0]} s={[1.1, 1.0, 1.0]} color={b.col} line={2} />
        <CanvasPlane p={[0, 0, 0.52]} s={[1.0, 0.9]} px={[240, 180]} draw={(c, W, H) => { c.fillStyle = b.col; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 56px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(b.label, W / 2, H * 0.38); c.fillStyle = "#111"; c.font = "900 44px Inter, Arial"; c.fillText(b.sub, W / 2, H * 0.75); }} />
      </group>); })}
    {/* the red arrow crashes down on "fell" (smaller, further back so it reads as an arrow, not a wall) */}
    <Arrow3D p={[-1.7, arrowY, -1.0]} rot={[0, 0.2, t < CRASH ? 0.15 : Math.PI * 0.93]} L={2.4} color="#e5233a" />
    {shock ? <Glow p={[-1.7, 0.8, -0.8]} r={2.4} color="rgba(255,255,220,1)" o={0.8 * Math.exp(-(t - CRASH) * 6)} /> : null}
    <Chair p={[-4.4, 0, -1.2]} rotY={0.5} color="#e5233a" /><Chair p={[4.4, 0, -1.2]} rotY={-0.5} color="#2f8cff" />
    <Shelf p={[-8.6, 0, -6.4]} w={2.4} rows={3} seed={5} wood="#7a5a3a" /><Plant p={[-7.6, 0, 1.6]} s={1.2} /><Plant p={[7.6, 0, 1.6]} s={1.2} />
    <Lamp p={[-7.8, 0, -3.4]} h={3} color="#ffe0b8" /><Rug p={[0, 0, 0.4]} s={[7, 4]} a="#c99a68" b="#e5233a" />
    <Frame p={[0, 3.4, -6.9]} s={[1.4, 1.0]} art={1} /><Clock p={[6.6, 5.6, -6.85]} r={0.5} t={t} />
    <Shaft p={[1.5, 4.5, -2]} s={[2.4, 8]} rot={[0, 0, -0.35]} color="255,220,170" o={0.14} /><Dust t={t} area={[5, 5, 3]} color="rgba(255,230,190,.9)" />
    {/* the analyst: party smile, then shock as the arrow lands — standing at the table in the centre gap, so all four chip boxes stay visible */}
    <Person p={[0, 0, -0.5]} sy={0} h={3.4} look={analyst} f={f} pose={{ mood: shock ? (t < 15.6 ? "shock" : "worry") : t < 12.9 ? "laugh" : "deadpan", nerv: shock ? 0.5 : 0, sweat: shock ? 1 : 0,
      arms: shock && t > 15.3 ? "head" : "down", armK: seg(t, 15.3, 15.55), lookX: shock ? 1 : -0.4, squash: shock && t < 15.4 ? -0.12 : 0 }} />
  </>);
};

/* =================== S5 16.3 – 20.7  "investors took profits" — dusk floor, red screens =================== */
const K5: Key[] = [
  { t: 16.3, pos: [-6.0, 2.6, 10.5], look: [0, 2.5, -3], fov: 60 },
  { t: 18.5, pos: [0, 2.6, 10.0], look: [0, 2.5, -3], fov: 58 },
  { t: 20.7, pos: [3.0, 2.9, 9.2], look: [1.0, 2.5, -3], fov: 56 },
];
const sellers: { x: number; z: number; look: Look; ph: number }[] = [
  { x: -4.4, z: -3.4, look: crowd[0], ph: 0 }, { x: -1.2, z: -4.2, look: crowd[2], ph: 9 },
  { x: 2.4, z: -3.6, look: crowd[4], ph: 4 }, { x: 4.8, z: -4.6, look: crowd[6], ph: 13 },
];
const S5 = ({ t, f }: Ctx) => {
  const q = seg(t, 19.34, 19.6); // "?" pops up on "questioned"
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffb080" />
    <Floor kind="tile" a="#5c2a20" b="#4e221a" unit={1.8} w={30} d={30} />
    <WallDoor z={-8} W={30} kind="plain" a="#3a1a20" b="#3a1a20" base="#1e0e14" />
    <SideWall x={-11} kind="plain" a="#40201e" b="#40201e" /><SideWall x={11} kind="plain" a="#40201e" b="#40201e" />
    <WindowCity p={[-8.0, 4.8, -7.9]} s={[3.6, 4.2]} dusk /><WindowCity p={[8.0, 4.8, -7.9]} s={[3.6, 4.2]} dusk />
    {/* LED wall: -7.5% and the falling chip list */}
    <Box p={[0, 5.0, -7.75]} s={[9.6, 4.8, 0.2]} color="#1a0a12" />
    <CanvasPlane p={[0, 5.0, -7.6]} s={[9.2, 4.4]} px={[920, 440]} frame="#3a0a12" draw={(c, W, H) => {
      c.fillStyle = "#1a060a"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ff4a5a"; c.font = "900 150px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("-7.5%", W / 2, 110);
      c.fillStyle = "#ffd6d8"; c.font = "800 46px Inter, Arial"; c.textAlign = "left";
      ["AMD   -10%", "MICRON   -10%", "INTEL   -8%", "BROADCOM   -4%"].forEach((ln, i) => c.fillText(ln, 60, 220 + i * 56));
    }} />
    <Glow p={[0, 5, -7.0]} r={5.4} color="rgba(255,60,80,0.9)" o={0.22} />
    <CanvasPlane p={[0, 7.85, -7.6]} s={[16, 0.6]} px={[1600, 60]} draw={(c, W, H) => { c.fillStyle = "#160608"; c.fillRect(0, 0, W, H); c.font = "800 40px Inter, Arial"; c.textBaseline = "middle"; const txt = "AMD ▼ 10%    MICRON ▼ 10%    INTEL ▼ 8%    BROADCOM ▼ 4%    NVDA ▼ 7.5%    "; const tw = c.measureText(txt).width; const off = -((f * 9) % tw); for (let k = 0; k < 3; k++) { c.fillStyle = "#ff4a5a"; c.fillText(txt, off + k * tw, H / 2 + 2); } }} />
    {/* desks with red screens */}
    <Desk p={[-4.6, 0, -4.2]} w={3.6} top="#e8dcc4" leg="#5a3a3a" /><Monitor p={[-5.2, 1.1, -4.3]} rot={[0, 0.3, 0]} screen="#ff3b4b" /><Monitor p={[-4.0, 1.1, -4.3]} rot={[0, 0.15, 0]} screen="#ff3b4b" />
    <Desk p={[4.8, 0, -4.4]} w={3.6} top="#e8dcc4" leg="#5a3a3a" /><Monitor p={[4.3, 1.1, -4.5]} rot={[0, -0.2, 0]} screen="#ff3b4b" /><Monitor p={[5.5, 1.1, -4.5]} rot={[0, -0.3, 0]} screen="#ff3b4b" />
    <Desk p={[0, 0, -4.6]} w={3.4} top="#e8dcc4" leg="#5a3a3a" /><Monitor p={[0, 1.1, -4.7]} rot={[0, 0, 0]} screen="#ff3b4b" />
    <Chair p={[-4.6, 0, -2.8]} rotY={0.3} color="#7a2a2a" /><Chair p={[4.8, 0, -3.0]} rotY={-0.4} color="#7a2a2a" /><Chair p={[0, 0, -3.2]} rotY={0} color="#7a2a2a" />
    <Shelf p={[-9.4, 0, -7.2]} w={2.6} rows={4} seed={3} wood="#3a1a20" /><Cabinet p={[9.2, 0, -7.0]} color="#5a2a2a" /><Cooler p={[7.4, 0, -6.6]} />
    <Plant p={[-2.6, 0, -6.8]} s={1.2} /><Plant p={[2.8, 0, -6.8]} s={1.2} />
    <Clock p={[-6.6, 6.2, -4.95]} r={0.5} t={t} /><Frame p={[5.6, 3.0, -7.9]} s={[1.2, 0.9]} art={2} /><Lamp p={[-7.6, 0, -1.2]} h={3} color="#ffb080" />
    <Rug p={[1.0, 0, 0.8]} s={[6.8, 3.6]} a="#3a1a20" b="#ff4a5a" />
    <Shaft p={[-1.2, 4.2, -2]} s={[2.6, 9]} rot={[0, 0, 0.42]} color="255,160,110" o={0.14} /><Dust t={t} area={[6, 6, 4]} color="rgba(255,200,160,.9)" />
    {/* sellers at their desks, phones up, taking profits */}
    {sellers.map((s, i) => { const P: V3 = [s.x, 0, s.z], h = 3.2, tgt: [number, number] = [0.2, 0.66]; return (
      <React.Fragment key={i}>
        <Person p={P} sy={0} h={h} look={s.look} f={f + s.ph} pose={{ mood: t > 19.3 ? "worry" : "deadpan", nerv: 0.25, sweat: i % 2 ? 0.6 : 0, armR: tgt, lookX: -0.6 }} />
        <FaceGroup p={P}><Box p={hand(h, tgt, 0, false, 0.12).map((v, j) => j === 1 ? v + 0.12 : v) as V3} s={[0.28, 0.46, 0.05]} color="#1b1b2a" line={2} /><Glow p={hand(h, tgt, 0, false, 0.18).map((v, j) => j === 1 ? v + 0.12 : v) as V3} r={0.45} color="rgba(255,120,120,1)" o={0.6} /></FaceGroup>
      </React.Fragment>); })}
    {/* hero analyst centre: shrugs on "questioned what comes next", "?" pops above his head, clear of the LED text */}
    <Person p={[1.2, 0, 0.9]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: t > 19.3 ? "worry" : "deadpan", nerv: 0.35, sweat: 0.6,
      arms: t > 19.3 ? "shrug" : "down", armK: seg(t, 19.3, 19.6), lookX: 0.5, hunch: t > 19.3 ? 0.4 : 0 }} />
    {void q}
  </>);
};

/* =================== S6 20.7 – 23.03  "ride isn't over" — crest + sunrise =================== */
const K6: Key[] = [
  { t: 20.7, pos: [4.5, 5.0, 8.5], look: [5.0, 5.5, -2], fov: 58 },
  { t: 23.03, pos: [0, 8.5, 14.5], look: [2.0, 4.0, -2], fov: 60 },
];
const S6 = ({ t, f }: Ctx) => {
  const u = 0.82 + 0.1 * seg(t, 20.7, 23.03), cx = trackX(u), cy = trackY(u), slope = trackSlope(u);
  const railPts = Array.from({ length: 25 }, (_, i) => i / 24);
  const sunRise = seg(t, 20.7, 22.2);
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#ffd9a0" />
    {/* sunrise sky */}
    <CanvasPlane p={[0, 14, -34]} s={[90, 40]} px={[900, 400]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a1a5e"); g.addColorStop(0.55, "#c25a8a"); g.addColorStop(0.8, "#ff9a4a"); g.addColorStop(1, "#ffd36a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[0, 6 + sunRise * 2, -30]} r={4.5} color="#ffd36a" ink={0} />
    <Glow p={[0, 8, -28]} r={16} color="rgba(255,200,90,1)" o={0.85} />
    <Stars p={[0, 18, -30]} s={[90, 30]} t={t} />
    <Floor kind="tile" a="#3a2a55" b="#2e2145" unit={2.2} w={40} d={40} />
    {/* the track winds on into the sunrise (40 segments, overlapping so the rails read continuous) */}
    {Array.from({ length: 40 }, (_, i) => i / 39).map((uu) => { const x = trackX(uu), y = trackY(uu), a = trackSlope(uu); return (
      <React.Fragment key={uu}>
        <Box p={[x, y, -2.35]} s={[0.8, 0.09, 0.09]} rot={[0, 0, -a]} color="#2fd46a" line={1} />
        <Box p={[x, y, -1.65]} s={[0.8, 0.09, 0.09]} rot={[0, 0, -a]} color="#2fd46a" line={1} />
      </React.Fragment>); })}
    {[0.12, 0.32, 0.52, 0.72, 0.9].map((uu) => <Cyl key={uu} p={[trackX(uu), trackY(uu) / 2, -2]} rt={0.09} h={trackY(uu)} color="#2a1a4e" line={1} />)}
    {/* clouds */}
    {[[-8, 10, -12], [6, 12, -14], [-2, 13, -18]].map(([x, y, z], i) => <group key={i} position={[x + Math.sin(f * 0.01 + i) * 0.4, y, z]}><Ball p={[0, 0, 0]} r={1.4} color="#ffe8d8" /><Ball p={[1.2, -0.2, 0]} r={1.0} color="#ffe8d8" /><Ball p={[-1.2, -0.2, 0]} r={1.0} color="#ffe8d8" /></group>)}
    {/* the cart at the crest (half the track tilt so the rider can stand on it) */}
    <group position={[cx, cy, -2]} rotation={[0, 0, -slope * 0.5]}>
      <Box p={[0, -0.28, 0]} s={[1.7, 0.3, 1.1]} color="#e5233a" line={2} />
      <Box p={[0.75, 0.05, 0]} s={[0.14, 0.7, 1.0]} color="#7a0c22" line={2} />
      <Cyl p={[0.55, 0.55, 0]} rt={0.06} h={1.0} color="#c9d3e0" rot={[Math.PI / 2, 0, 0]} line={1} />
      <Ball p={[-0.7, -0.5, 0.45]} r={0.22} color="#1b1b2a" /><Ball p={[0.7, -0.5, 0.45]} r={0.22} color="#1b1b2a" />
      <Ball p={[-0.7, -0.5, -0.45]} r={0.22} color="#1b1b2a" /><Ball p={[0.7, -0.5, -0.45]} r={0.22} color="#1b1b2a" />
    </group>
    <Glow p={[cx, cy + 0.4, -1.6]} r={2.2} color="rgba(255,210,90,1)" o={0.3} />
    <Dust t={t} area={[5, 6, 3]} color="rgba(255,230,190,.9)" />
    <Person p={[cx, cy - 0.25, -2]} sy={cy - 0.25} h={3.0} look={analyst} f={f} pose={{ mood: t > 22.2 ? "smile" : "grin", lookX: 0.8,
      arms: "hold", armK: 1, armR: [0.3, 0.55], armL: [-0.3, 0.55], sweat: 0.3 }} />
    {void f}
  </>);
};

const CUTS = [0, 3.2, 8.1, 12.4, 16.3, 20.7, 23.1];
export const TdnV1: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0b1230">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#dcebf2">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#1a0b2e" trans="zoom">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#c99a68" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#3a1a20">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#2a1a5e" trans="flash">{(c) => <S6 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 3.2 ? "rgba(0,180,220,.07)" : t < 8.1 ? "rgba(47,212,106,.06)" : t < 12.4 ? "rgba(200,40,160,.07)" : t < 16.3 ? "rgba(255,140,40,.08)" : t < 20.7 ? "rgba(255,60,60,.08)" : "rgba(255,160,60,.08)"} />
      <Captions />
    </AbsoluteFill>
  );
};
