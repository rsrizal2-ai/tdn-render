// TDN v9 — "Pakistan's first astronaut, on a Chinese rocket" — Shenzhou-24 carries
// Muhammad Zeeshan Ali to Tiangong: the first Pakistani in orbit and the first foreign
// astronaut aboard China's station, docked 3.5 hours after a Gobi Desert dawn launch.
// 9:16 720x1280 30fps, 1965 frames (65.41 s voiceover).
// CUTS = [0, 4.52, 13.06, 18.85, 25.80, 28.47, 36.42, 44.07, 48.52, 57.75, 62.52, 65.41].
// S1 station + flag plaque + tethered analyst / S2 Gobi dawn launch, the rocket climbs
// S3 capsule interior: the third seat / S4 mission control crew board lights in turn
// S5 capsule + racing mission clock / S6 the docking along a dashed guide line
// S7 lab rack: four grow boxes light in sequence / S8 two capsules + dotted boarding path
// S9 the chained hatch opens: GUEST No. 1 / S10 station silhouette over an Earth sunrise
// S11 TDN sign-off desk (indigo-silver).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Grade, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Plant, Frame, Lamp, Monitor, Chair, Rug, Dust } from "../style/props";
import { Cam, Key, Globe, Stars } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
// deterministic pseudo-random (no Math.random in render code)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const aliLook: Look = { skin: "#c98d5e", body: "#eef1f6", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#1d9e57", shoe: "#39424e" };
const tangLook: Look = { skin: "#f0c8a0", body: "#eef1f6", outfit: "shirt", hair: "swept", hairColor: "#3a3f4a", badge: "#c9a227", shoe: "#39424e" };
const controllerLook: Look = { skin: "#fbe3c8", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#8ae8ff", shoe: "#101018" };
const controller2Look: Look = { skin: "#8a5a34", body: "#3a6ea8", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", badge: "#8ae8ff", shoe: "#101018" };

/* ---------- scene wrapper (same pattern as TdnV6/TdnV7) ---------- */
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

/* ---------- shared spacecraft ---------- */
// Tiangong-style station: horizontal core, node, two solar wings, dish, gold docking port at the left end.
const Station: React.FC<{ p: V3; s?: number; rotY?: number }> = ({ p, s = 0.62, rotY = 0 }) => (
  <group position={p} scale={[s, s, s]} rotation={[0, rotY, 0]}>
    <Cyl p={[0, 0, 0]} rt={1.05} h={5.6} rot={[0, 0, Math.PI / 2]} color="#e8ecf4" line={2} />
    <Cyl p={[-1.4, 0, 0]} rt={1.09} h={0.35} rot={[0, 0, Math.PI / 2]} color="#c9a227" line={1} />
    <Cyl p={[1.9, 0, 0]} rt={1.28} h={1.7} rot={[0, 0, Math.PI / 2]} color="#dfe6ee" line={2} />
    <Cyl p={[3.6, 0, 0]} rt={0.82} h={2.2} rot={[0, 0, Math.PI / 2]} color="#e8ecf4" line={2} />
    {/* docking port, left end */}
    <Cyl p={[-3.15, 0, 0]} rt={0.72} h={0.6} rot={[0, 0, Math.PI / 2]} color="#c9a227" line={2} />
    <Cyl p={[-3.5, 0, 0]} rt={0.5} h={0.18} rot={[0, 0, Math.PI / 2]} color="#8a93a6" line={1} />
    {/* solar wings */}
    {[-1, 1].map((sgn) => (
      <group key={sgn}>
        <Cyl p={[sgn * 4.4, 0, -0.3]} rt={0.11} h={2.6} rot={[0, 0, Math.PI / 2]} color="#8a93a6" line={1} />
        <Box p={[sgn * 6.6, 0, -0.3]} s={[3.6, 2.1, 0.09]} color="#2b4f9e" line={1} />
        <Box p={[sgn * 6.6, 0, -0.22]} s={[3.6, 0.16, 0.06]} color="#7fb2ff" line={0} />
      </group>
    ))}
    {/* dish + antenna */}
    <Cyl p={[0.6, 1.35, 0]} rt={0.09} h={0.8} color="#8a93a6" line={1} />
    <Cyl p={[0.6, 1.85, 0.15]} rt={0.62} h={0.22} rot={[0.7, 0, 0]} color="#dfe6ee" line={1} />
    <Ball p={[-0.9, 1.25, 0]} r={0.14} color="#e5233a" ink={1} />
  </group>
);
// Shenzhou-style capsule: body, gold band, nose cone, three portholes on the camera side.
const Capsule: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={rot} scale={[s, s, s]}>
    <Cyl p={[0, 0, 0]} rt={0.88} h={2.3} color="#eef1f6" line={2} />
    <Cyl p={[0, -0.55, 0]} rt={0.9} h={0.4} color="#c9a227" line={1} />
    <Cyl p={[0, 1.6, 0]} rt={0.16} rb={0.88} h={0.95} color="#dfe6ee" line={2} />
    <Ball p={[0, 2.14, 0]} r={0.15} color="#e5233a" ink={1} />
    {[-0.45, 0, 0.45].map((x, i) => <Cyl key={i} p={[x, 0.45, 0.82]} rt={0.19} h={0.1} rot={[Math.PI / 2, 0, 0]} color="#9fd0ff" line={1} />)}
    <Cyl p={[0, -1.3, 0]} rt={0.6} h={0.3} color="#8a93a6" line={1} />
  </group>
);
// Green flag plaque (generic crescent + star, "PAKISTAN" written under it)
const FlagPlaque: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <CanvasPlane p={p} s={[1.9 * s, 1.45 * s]} px={[380, 290]} frame="#0a3d21" draw={(c, W, H) => {
    c.fillStyle = "#0a6b34"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#f2f0ea"; c.fillRect(0, 0, W * 0.24, H * 0.78);
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(W * 0.60, H * 0.36, 52, 0, 7); c.fill();
    c.fillStyle = "#0a6b34"; c.beginPath(); c.arc(W * 0.66, H * 0.31, 44, 0, 7); c.fill();
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(W * 0.74, H * 0.22, 11, 0, 7); c.fill();
    c.fillStyle = "#ffffff"; c.font = "900 44px Inter, Arial"; c.textAlign = "center"; c.fillText("PAKISTAN", W / 2, H * 0.93);
  }} />
);
// Earth's curved limb + atmosphere rim, for space scenes
const EarthLimb: React.FC<{ y?: number }> = ({ y = -25.5 }) => (<>
  <Ball p={[0, y - 0.7, -13]} r={24.7} color="#7fb2ff" ink={0} />
  <Ball p={[0, y, -12]} r={24} color="#2a5fb0" ink={0} />
  <Ball p={[-7, y + 22.6, -11]} r={3.4} color="#3f7bd0" ink={0} />
  <Ball p={[5.5, y + 23.4, -11]} r={2.6} color="#3f7bd0" ink={0} />
</>);

/* =================== S1 0 – 4.52  hook: a foreign flag on China's station =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.4, 12.6], look: [0, 4.0, -5], fov: 60 },
  { t: 4.52, pos: [0, 3.1, 11.0], look: [0.3, 4.2, -5], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const pop = seg(t, 1.12, 1.5, Easing.out(Easing.back(1.7)));
  const bob = Math.sin(t * 1.4) * 0.16;
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe9c4" />
    <Stars p={[0, 6, -26]} s={[46, 26]} t={t} n={170} />
    <EarthLimb y={-27} />
    <Station p={[0.4, 4.8, -6.5]} s={0.78} />
    {pop > 0.02 ? <group position={[3.35, 5.9, -5.2]} scale={[pop, pop, 1]}><FlagPlaque p={[0, 0, 0]} /></group> : null}
    <Glow p={[3.35, 5.9, -5.8]} r={2.2} color="rgba(60,220,140,1)" o={0.16 * pop} />
    {/* the analyst, floating on a tether, points at the plaque on "Chinese rocket" */}
    <Cyl p={[-1.9, 3.1 + bob * 0.5, -3.4]} rt={0.035} h={3.4} rot={[0, 0, 1.15]} color="#aab4c8" line={0} />
    <Person p={[-3.3, 2.1 + bob, -2.6]} h={3.6} look={analyst} f={f} shadow={false} pose={{ mood: "grin", arms: "point", armK: seg(t, 3.3, 3.6), armR: [0.85, 0.62], lookX: 0.6 }} />
    <Dust t={t} area={[8, 5, 5]} color="rgba(200,220,255,.8)" />
  </>);
};

/* =================== S2 4.52 – 13.06  dawn launch in the Gobi =================== */
const K2: Key[] = [
  { t: 4.52, pos: [0, 2.6, 13.2], look: [0, 4.6, -5], fov: 60 },
  { t: 8.5, pos: [0, 3.4, 12.6], look: [0.4, 6.0, -5], fov: 59 },
  { t: 13.06, pos: [0, 5.6, 12.2], look: [0.6, 9.0, -5], fov: 58 },
];
const Rocket: React.FC<{ rise: number; t: number }> = ({ rise, t }) => {
  const flame = t > 6.5 ? 1 : 0;
  return (
    <group position={[0.8, rise, -6]}>
      <Cyl p={[0, 3.4, 0]} rt={1.02} h={6.8} color="#f2f4f8" line={2} />
      <Cyl p={[0, 7.6, 0]} rt={0.14} rb={1.02} h={1.7} color="#e8ecf4" line={2} />
      <Cyl p={[0, 5.9, 0]} rt={1.05} h={0.55} color="#c2372f" line={1} />
      <Cyl p={[0, 1.1, 0]} rt={1.05} h={0.5} color="#39424e" line={1} />
      {[-1, 1].map((sgn) => <Box key={sgn} p={[sgn * 1.25, 0.75, 0]} s={[0.5, 1.6, 0.14]} color="#c2372f" line={1} />)}
      <CanvasPlane p={[0, 4.3, 1.06]} s={[2.5, 0.62]} px={[625, 155]} draw={(c, W, H) => { c.fillStyle = "#101828"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffffff"; c.font = "900 74px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SHENZHOU-24", W / 2, H / 2 + 2); }} />
      {flame ? (<>
        <Cyl p={[0, -0.9, 0]} rt={0.16} rb={0.85} h={2.1} color="#ff9a3c" line={0} />
        <Cyl p={[0, -0.6, 0]} rt={0.08} rb={0.45} h={1.3} color="#ffd36a" line={0} />
        <Glow p={[0, -1.2, 0.4]} r={3.2} color="rgba(255,150,60,1)" o={0.5} />
      </>) : null}
    </group>
  );
};
const S2 = ({ t, f }: Ctx) => {
  const rise = seg(t, 6.56, 13.06, Easing.in(Easing.cubic)) * 11;
  const smoke = t > 6.5 ? seg(t, 6.5, 9.5) : 0;
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffd9ae" />
    <CanvasPlane p={[0, 13, -32]} s={[95, 40]} px={[950, 400]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#27356b"); g.addColorStop(0.55, "#b85a6e"); g.addColorStop(1, "#ffb877"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[-21, 8.5, -29]} r={2.1} color="#ffd9a0" ink={0} />
    <Floor kind="tile" a="#d9a860" b="#c99a52" unit={3} w={64} d={64} />
    {/* dunes */}
    {[-16, -9, 12, 19].map((x, i) => <Box key={i} p={[x, 0.35, -17 - rnd(i + 3) * 4]} s={[11, 0.7 + rnd(i) * 0.5, 5]} rot={[0, rnd(i + 9) * 0.5, 0]} color="#c99a52" line={1} />)}
    {/* gantry tower */}
    <group position={[-2.6, 0, -6]}>
      <Box p={[0, 4.6, 0]} s={[0.45, 9.2, 0.45]} color="#7a4a3a" line={1} />
      <Box p={[1.6, 4.6, 0]} s={[0.45, 9.2, 0.45]} color="#7a4a3a" line={1} />
      {[1.2, 3.2, 5.2, 7.2, 9.0].map((y, i) => <Box key={i} p={[0.8, y, 0]} s={[2.05, 0.3, 0.4]} color="#8a5a48" line={1} />)}
      <Box p={[0.8, 9.5, 0]} s={[2.6, 0.5, 0.9]} color="#5a3a30" line={1} />
      <Box p={[1.9, 6.1, 0.3]} s={[1.5, 0.28, 0.28]} color="#8a5a48" line={1} />
    </group>
    <Rocket rise={rise} t={t} />
    {/* ignition smoke billows */}
    {smoke > 0 ? [-2.6, -1.2, 0.4, 1.9, 3.2].map((x, i) => (
      <Ball key={i} p={[0.8 + x * (0.7 + smoke * 0.9), 0.35 + smoke * rnd(i + 21) * 0.6, -6 + (rnd(i + 31) - 0.5) * 2.2]} r={(0.55 + smoke * 0.85) * (0.7 + rnd(i + 41) * 0.5)} color={i % 2 ? "#efe9df" : "#e2dbcf"} ink={0} />
    )) : null}
    {/* support buildings + a distant second tower */}
    <Box p={[-11, 1.1, -11]} s={[4.6, 2.2, 3]} color="#a8763e" line={1} />
    <Box p={[12.5, 0.9, -12]} s={[3.6, 1.8, 2.6]} color="#b08248" line={1} />
    <Box p={[17, 3.2, -19]} s={[0.5, 6.4, 0.5]} color="#7a4a3a" line={1} />
    <Plant p={[-7.5, 0, -3]} s={0.9} /><Plant p={[8.6, 0, -4]} s={1.0} />
    <Dust t={t} area={[9, 5, 6]} color="rgba(255,220,180,.85)" />
  </>);
};

/* =================== S3 13.06 – 18.85  the third seat =================== */
const K3: Key[] = [
  { t: 13.06, pos: [0, 3.5, 12.8], look: [0.2, 3.2, -4], fov: 60 },
  { t: 18.85, pos: [1.4, 3.3, 10.4], look: [2.4, 3.1, -4], fov: 57 },
];
const SeatUnit: React.FC<{ x: number; helmet?: boolean }> = ({ x, helmet }) => (
  <group position={[x, 0, -4.2]}>
    <Box p={[0, 0.95, 0]} s={[1.9, 1.9, 1.7]} color="#dfe6ee" line={2} />
    <Box p={[0, 2.6, -0.75]} s={[1.9, 2.6, 0.5]} rot={[-0.16, 0, 0]} color="#c8d2e0" line={2} />
    <Box p={[0, 3.6, -0.85]} s={[1.1, 0.8, 0.4]} rot={[-0.16, 0, 0]} color="#274b73" line={1} />
    <Box p={[0, 1.35, 0.45]} s={[1.6, 0.5, 0.9]} color="#274b73" line={1} />
    {helmet ? <Ball p={[0, 2.15, 0.1]} r={0.52} color="#f2f4f8" ink={1} /> : null}
  </group>
);
const S3 = ({ t, f }: Ctx) => {
  const boardPop = seg(t, 15.73, 16.15, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#e8f4ff" />
    <Floor kind="tile" a="#b9c8d4" b="#aebfcd" unit={2} w={36} d={36} />
    <CanvasPlane p={[0, 5.6, -8.8]} s={[26, 11.5]} px={[1040, 460]} draw={(c, W, H) => {
      c.fillStyle = "#31586b"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(160,220,230,.25)"; c.lineWidth = 3;
      for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo((W / 8) * i, 0); c.lineTo((W / 8) * i, H); c.stroke(); }
    }} />
    <CanvasPlane p={[0, 8.1, -8.6]} s={[8.6, 0.95]} px={[1032, 114]} draw={(c, W, H) => { c.fillStyle = "#0d2136"; c.fillRect(0, 0, W, H); c.fillStyle = "#8ae8ff"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SHENZHOU-24 · CREW CABIN", W / 2, H / 2 + 2); }} />
    {/* round window with Earth */}
    <Cyl p={[-4.6, 4.9, -8.5]} rt={1.35} h={0.3} rot={[Math.PI / 2, 0, 0]} color="#8a93a6" line={2} />
    <CanvasPlane p={[-4.6, 4.9, -8.32]} s={[2.3, 2.3]} px={[230, 230]} draw={(c, W, H) => {
      c.fillStyle = "#0a1440"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#2a5fb0"; c.beginPath(); c.arc(W * 0.5, H * 1.25, W * 0.62, 0, 7); c.fill();
      c.fillStyle = "#7fb2ff"; c.beginPath(); c.arc(W * 0.5, H * 1.25, W * 0.62, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      c.fillStyle = "#ffffff"; for (let i = 0; i < 22; i++) c.fillRect(rnd(i + 5) * W, rnd(i + 15) * H * 0.5, 3, 3);
    }} />
    <SeatUnit x={-2.8} helmet />
    <SeatUnit x={0} helmet />
    <SeatUnit x={2.8} />
    {/* Ali in the third seat, waving on his name */}
    <Person p={[2.8, 1.55, -3.9]} h={2.7} look={aliLook} f={f} sy={1.2} pose={{ mood: "grin", arms: "up", armK: seg(t, 14.1, 14.5), armR: [0.7, 0.9], lookX: -0.2, squash: 0.1 }} />
    {/* control panel with blinking lights */}
    <Box p={[-3.4, 1.5, -2.2]} s={[3.4, 1.5, 0.7]} rot={[-0.4, 0.3, 0]} color="#223140" line={2} />
    {[-4.4, -3.8, -3.2, -2.6].map((x, i) => <Ball key={i} p={[x, 2.05 + (i % 2) * 0.35, -1.95]} r={0.09} color={((f >> 3) + i) % 2 ? "#2fd46a" : "#0d3a1e"} ink={0} />)}
    {boardPop > 0.02 ? <group position={[2.8, 5.6, -4.4]} scale={[boardPop, boardPop, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[4.3, 1.05]} px={[860, 210]} frame="#0a3d21" draw={(c, W, H) => {
        c.fillStyle = "#0d2136"; c.fillRect(0, 0, W, H); c.fillStyle = "#1d9e57"; c.fillRect(0, 0, 14, H);
        c.fillStyle = "#ffffff"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText("SEAT 3 · ALI — PAKISTAN", W / 2, H / 2 + 2);
      }} />
    </group> : null}
    <Lamp p={[-7.6, 0, -3]} h={3.4} color="#cfe8ff" /><Lamp p={[7.8, 0, -3.4]} h={3.4} color="#cfe8ff" />
    <Dust t={t} area={[7, 4, 5]} color="rgba(210,240,255,.85)" />
  </>);
};

/* =================== S4 18.85 – 25.80  mission control calls the crew =================== */
const K4: Key[] = [
  { t: 18.85, pos: [0, 3.7, 13.2], look: [0, 3.9, -5], fov: 60 },
  { t: 25.80, pos: [0, 3.4, 11.2], look: [0, 4.1, -5], fov: 58 },
];
const CrewScreen: React.FC<{ t: number }> = ({ t }) => (
  <CanvasPlane p={[0, 4.9, -7.6]} s={[13.2, 6.0]} px={[1320, 600]} frame="#0b1026" draw={(c, W, H) => {
    c.fillStyle = "#0d1b33"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(110,200,255,.35)"; c.lineWidth = 3; c.strokeRect(14, 14, W - 28, H - 28);
    c.fillStyle = "#8ae8ff"; c.font = "900 44px Inter, Arial"; c.textAlign = "left"; c.fillText("SHENZHOU-24 · CREW", 44, 66);
    // orbit arc + capsule dot
    c.strokeStyle = "rgba(140,220,255,.6)"; c.lineWidth = 4; c.beginPath(); c.ellipse(W * 0.80, H * 0.30, 120, 62, -0.3, 0, 7); c.stroke();
    c.fillStyle = "#ffd36a"; c.beginPath(); c.arc(W * 0.80 + Math.cos(t * 0.9) * 120, H * 0.30 + Math.sin(t * 0.9) * 62, 13, 0, 7); c.fill();
    c.fillStyle = "#9fd0ff"; c.font = "800 30px Inter, Arial"; c.textAlign = "center"; c.fillText("TIANGONG", W * 0.80, H * 0.30 + 8);
    const rows: { name: string; role: string; col: string; on: number; tag?: string; tagAt?: number }[] = [
      { name: "MUHAMMAD ZEESHAN ALI", role: "PAYLOAD SPECIALIST · PAKISTAN", col: "#2fd46a", on: 1 },
      { name: "TANG HONGBO", role: "COMMANDER", col: "#ffd36a", on: t > 19.24 ? 1 : 0.25, tag: "VISIT No. 3 — A RECORD", tagAt: 21.92 },
      { name: "WU YI", role: "FLIGHT ENGINEER", col: "#7fb2ff", on: t > 23.78 ? 1 : 0.25, tag: "FIRST FLIGHT", tagAt: 24.88 },
    ];
    rows.forEach((r, i) => {
      const y = 120 + i * 138;
      c.globalAlpha = 0.35 + r.on * 0.65;
      c.fillStyle = "rgba(20,40,70,.9)"; c.fillRect(44, y, W - 88, 112);
      c.fillStyle = r.col; c.fillRect(44, y, 12, 112);
      c.fillStyle = "#ffffff"; c.font = "900 47px Inter, Arial"; c.textAlign = "left"; c.fillText(r.name, 84, y + 52);
      c.fillStyle = "#9fb8d8"; c.font = "800 31px Inter, Arial"; c.fillText(r.role, 84, y + 94);
      if (r.tag && r.tagAt && t > r.tagAt) {
        c.fillStyle = r.col; const tw = 430; c.fillRect(W - 84 - tw, y + 26, tw, 58);
        c.fillStyle = "#0d1b33"; c.font = "900 33px Inter, Arial"; c.textAlign = "center"; c.fillText(r.tag, W - 84 - tw / 2, y + 64);
      }
      c.globalAlpha = 1;
    });
  }} />
);
const S4 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K4} />
  <Lights warm="#d8e8ff" />
  <Floor kind="tile" a="#232c4e" b="#1e2745" unit={2} w={40} d={40} />
  <CanvasPlane p={[0, 5.8, -8.8]} s={[26, 11.5]} px={[780, 345]} draw={(c, W, H) => { c.fillStyle = "#141c3d"; c.fillRect(0, 0, W, H); c.fillStyle = "rgba(120,160,255,.14)"; for (let i = 0; i < 7; i++) c.fillRect(50 + i * 105, 0, 6, H); }} />
  <CrewScreen t={t} />
  <Desk p={[-2.9, 0, -2.6]} w={4.2} top="#2c3852" leg="#141a30" d={1.6} />
  <Desk p={[2.9, 0, -2.6]} w={4.2} top="#2c3852" leg="#141a30" d={1.6} />
  <Monitor p={[-3.7, 1.05, -2.8]} rot={[0, 0.3, 0]} screen="#35d3c5" />
  <Monitor p={[-2.1, 1.05, -2.8]} rot={[0, -0.2, 0]} screen="#ffd36a" />
  <Monitor p={[2.9, 1.05, -2.8]} rot={[0, 0.1, 0]} screen="#7fb2ff" />
  <Person p={[-2.9, 0, -1.4]} h={3.4} look={controllerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 21.8, 22.1), armR: [0.6, 0.75], lookX: 0.3 }} />
  <Person p={[3.1, 0, -1.5]} h={3.4} look={controller2Look} f={f} pose={{ mood: "smile", arms: "down", lookX: -0.3 }} />
  <Chair p={[-5.0, 0, -1.2]} rotY={0.5} color="#2c3852" /><Chair p={[5.2, 0, -1.3]} rotY={-0.4} color="#2c3852" />
  <Plant p={[-8.4, 0, -4.6]} s={1.2} /><Lamp p={[8.6, 0, -4.2]} h={3.4} color="#d8e8ff" />
  <Dust t={t} area={[8, 5, 5]} color="rgba(190,215,255,.85)" />
</>);

/* =================== S5 25.80 – 28.47  ten minutes to orbit =================== */
const K5: Key[] = [
  { t: 25.80, pos: [-1, 3.5, 11.6], look: [0.3, 4.3, -5], fov: 60 },
  { t: 28.47, pos: [1, 3.2, 10.2], look: [0.6, 4.5, -5], fov: 58 },
];
const MissionClock: React.FC<{ t: number }> = ({ t }) => {
  const k = seg(t, 25.85, 27.75); // hand races, then stops on "in orbit"
  return (
    <CanvasPlane p={[4.1, 5.4, -6.2]} s={[3.3, 3.3]} px={[495, 495]} frame="#6e5a1e" draw={(c, W, H) => {
      c.fillStyle = "#f6f1e6"; c.beginPath(); c.arc(W / 2, H / 2, W * 0.47, 0, 7); c.fill();
      c.strokeStyle = "#1b1b2a"; c.lineWidth = 7; c.beginPath(); c.arc(W / 2, H / 2, W * 0.47, 0, 7); c.stroke();
      c.fillStyle = "#1b1b2a";
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.save(); c.translate(W / 2 + Math.cos(a) * W * 0.40, H / 2 + Math.sin(a) * H * 0.40); c.rotate(a); c.fillRect(-4, -13, 8, 26); c.restore(); }
      const ma = -Math.PI / 2 + k * Math.PI * 2;
      c.strokeStyle = "#c2372f"; c.lineWidth = 13; c.lineCap = "round";
      c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(W / 2 + Math.cos(ma) * W * 0.36, H / 2 + Math.sin(ma) * H * 0.36); c.stroke();
      const ha = -Math.PI / 2 + k * (Math.PI * 2) / 12 + 0.5;
      c.strokeStyle = "#1b1b2a"; c.lineWidth = 17;
      c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(W / 2 + Math.cos(ha) * W * 0.24, H / 2 + Math.sin(ha) * H * 0.24); c.stroke();
      c.fillStyle = "#c9a227"; c.beginPath(); c.arc(W / 2, H / 2, 17, 0, 7); c.fill();
      if (t > 27.8) { c.fillStyle = "#c2372f"; c.font = "900 54px Inter, Arial"; c.textAlign = "center"; c.fillText("T+10 MIN", W / 2, H * 0.80); }
    }} />
  );
};
const S5 = ({ t, f }: Ctx) => {
  const bob = Math.sin(t * 1.1) * 0.14;
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe9c4" />
    <Stars p={[0, 6, -26]} s={[46, 26]} t={t} n={150} />
    <EarthLimb y={-26.5} />
    <group position={[-1.2, 4.4 + bob, -5]} rotation={[0, 0.3, 0.12]}>
      <Capsule p={[0, 0, 0]} s={1.15} />
    </group>
    <MissionClock t={t} />
    <Glow p={[-1.2, 4.4, -6]} r={3.4} color="rgba(120,180,255,1)" o={0.15} />
    <Dust t={t} area={[8, 5, 5]} color="rgba(200,220,255,.8)" />
  </>);
};

/* =================== S6 28.47 – 36.42  the docking =================== */
const K6: Key[] = [
  { t: 28.47, pos: [0, 3.7, 13.6], look: [0, 4.5, -6], fov: 60 },
  { t: 36.42, pos: [0, 3.3, 10.4], look: [0.8, 4.7, -6], fov: 57 },
];
const S6 = ({ t, f }: Ctx) => {
  const dockK = seg(t, 28.47, 29.93, Easing.inOut(Easing.cubic));
  const capX = lerp(-6.8, -0.85, dockK);
  const flash = t > 29.93 && t < 30.45 ? seg(t, 29.93, 30.45) : 0;
  const boardPop = seg(t, 30.45, 30.9, Easing.out(Easing.back(1.7)));
  const flagPop = seg(t, 33.25, 33.7, Easing.out(Easing.back(1.7)));
  const burst = t > 33.25 && t < 34.35 ? (t - 33.25) / 1.1 : 0;
  return (<>
    <Cam t={t} keys={K6} impacts={[[29.97, 0.045]]} />
    <Lights warm="#ffe9c4" />
    <Stars p={[0, 6, -26]} s={[46, 26]} t={t} n={160} />
    <EarthLimb y={-27} />
    <Station p={[3.1, 4.65, -7]} s={0.66} />
    {/* dashed guide line, gone after capture */}
    {t < 30.05 ? [-5.6, -4.6, -3.6, -2.6, -1.6, -0.6].map((x, i) => <Ball key={i} p={[x, 4.65, -6.1]} r={0.075} color="#7dffce" ink={0} />) : null}
    <group position={[capX, 4.65, -6.1]} rotation={[0, 0, -Math.PI / 2]}>
      <Capsule p={[0, 0, 0]} s={0.95} />
    </group>
    {/* contact flash + locking bars */}
    {flash > 0 ? <Ball p={[0.55, 4.65, -5.9]} r={0.4 + flash * 0.9} color="#ffffff" ink={0} /> : null}
    {t > 30.0 ? (<>
      <Box p={[0.62, 5.55, -6.3]} s={[0.18, 0.5, 0.3]} color="#c9a227" line={1} />
      <Box p={[0.62, 3.75, -6.3]} s={[0.18, 0.5, 0.3]} color="#c9a227" line={1} />
    </>) : null}
    {boardPop > 0.02 ? <group position={[1.0, 7.7, -6.6]} scale={[boardPop, boardPop, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[5.8, 1.15]} px={[1024, 184]} frame="#6e5a1e" draw={(c, W, H) => {
        c.fillStyle = "#101828"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#ffd36a"; c.font = "900 54px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText("TIANGONG — THE HEAVENLY PALACE", W / 2, H / 2 + 2);
      }} />
    </group> : null}
    {flagPop > 0.02 ? <group position={[1.15, 6.6, -5.6]} scale={[flagPop, flagPop, 1]}><FlagPlaque p={[0, 0, 0]} s={0.9} /></group> : null}
    {burst > 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <Ball key={i} p={[1.15 + (rnd(i + 7) - 0.5) * 3.2 * burst, 6.4 + burst * (0.8 + rnd(i + 17) * 1.5), -5.4]} r={0.11} color={["#2fd46a", "#ffffff", "#ffd36a", "#7dffce"][i % 4]} ink={0} />
    )) : null}
    <Dust t={t} area={[8, 5, 5]} color="rgba(200,220,255,.8)" />
  </>);
};

/* =================== S7 36.42 – 44.07  a week of science =================== */
const K7: Key[] = [
  { t: 36.42, pos: [0, 3.4, 12.6], look: [0, 3.5, -4], fov: 60 },
  { t: 44.07, pos: [0.6, 3.2, 11.0], look: [0.2, 3.6, -4], fov: 58 },
];
const GrowRack: React.FC<{ t: number }> = ({ t }) => (
  <group position={[-3.05, 0, -4.6]}>
    <Box p={[0, 2.2, 0]} s={[3.4, 4.4, 1.1]} color="#39424e" line={2} />
    {[0, 1, 2, 3].map((i) => {
      const lit = t > 39.47 + i * 0.45;
      const col = i % 2, row = Math.floor(i / 2);
      const x = -0.82 + col * 1.64, y = 3.15 - row * 1.85;
      return (
        <group key={i} position={[x, y, 0.62]}>
          <Box p={[0, 0, 0]} s={[1.45, 1.6, 0.18]} color={lit ? "#274b3a" : "#232a33"} line={1} />
          <CanvasPlane p={[0, 0, 0.12]} s={[1.2, 1.35]} px={[180, 200]} draw={(c, W, H) => {
            c.fillStyle = lit ? "#123324" : "#141a20"; c.fillRect(0, 0, W, H);
            c.strokeStyle = lit ? "#2fd46a" : "#3a4a42"; c.lineWidth = 6;
            c.beginPath(); c.moveTo(W / 2, H * 0.92); c.quadraticCurveTo(W * 0.48, H * 0.6, W / 2, H * 0.42); c.stroke();
            if (lit) { c.fillStyle = "#7dffb0"; c.beginPath(); c.ellipse(W * 0.38, H * 0.36, 20, 11, -0.6, 0, 7); c.fill(); c.beginPath(); c.ellipse(W * 0.62, H * 0.30, 20, 11, 0.6, 0, 7); c.fill(); }
            c.fillStyle = lit ? "rgba(255,90,200,.28)" : "rgba(120,120,140,.12)"; c.fillRect(0, 0, W, 26);
          }} />
        </group>
      );
    })}
  </group>
);
const S7 = ({ t, f }: Ctx) => {
  const bob = Math.sin(t * 1.2 + 1) * 0.15;
  const calPop = seg(t, 36.85, 37.3, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#eafff2" />
    <Floor kind="tile" a="#c4d8ce" b="#b9cfc2" unit={2} w={36} d={36} />
    <CanvasPlane p={[0, 5.6, -8.8]} s={[26, 11.5]} px={[780, 345]} draw={(c, W, H) => { c.fillStyle = "#dcebe2"; c.fillRect(0, 0, W, H); c.fillStyle = "rgba(60,120,90,.16)"; for (let i = 0; i < 7; i++) c.fillRect(50 + i * 105, 0, 6, H); }} />
    {/* Earth window */}
    <Cyl p={[4.9, 5.2, -8.5]} rt={1.5} h={0.3} rot={[Math.PI / 2, 0, 0]} color="#8a93a6" line={2} />
    <CanvasPlane p={[4.9, 5.2, -8.32]} s={[2.55, 2.55]} px={[255, 255]} draw={(c, W, H) => {
      c.fillStyle = "#0a1440"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#2a5fb0"; c.beginPath(); c.arc(W * 0.5, H * 1.3, W * 0.66, 0, 7); c.fill();
      c.fillStyle = "#7fb2ff"; c.beginPath(); c.arc(W * 0.42, H * 0.98, W * 0.2, 0, 7); c.fill();
      c.fillStyle = "#ffffff"; for (let i = 0; i < 20; i++) c.fillRect(rnd(i + 55) * W, rnd(i + 65) * H * 0.45, 3, 3);
    }} />
    <GrowRack t={t} />
    <Glow p={[-3.05, 2.6, -3.4]} r={3.0} color="rgba(255,90,200,1)" o={t > 39.47 ? 0.14 : 0.05} />
    {/* Ali floats with a sample box */}
    <Person p={[1.3, 1.9 + bob, -2.8]} h={3.3} look={aliLook} f={f} shadow={false} pose={{ mood: "smile", arms: "hold", armR: [0.55, 0.55], armL: [-0.55, 0.55], lookX: -0.3 }} />
    <Box p={[1.3, 2.6 + bob, -2.35]} s={[0.85, 0.6, 0.6]} color="#ffd36a" line={2} />
    {calPop > 0.02 ? <group position={[-0.6, 6.3, -5.5]} scale={[calPop, calPop, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[3.4, 1.0]} px={[680, 200]} frame="#274b73" draw={(c, W, H) => {
        c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#c2372f"; c.font = "900 74px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText("STAY: 1 WEEK", W / 2, H / 2 + 2);
      }} />
    </group> : null}
    <Monitor p={[5.6, 1.05, -3.2]} rot={[0, -0.3, 0]} screen="#2fd46a" />
    <Plant p={[-7.8, 0, -4]} s={1.2} /><Lamp p={[8.2, 0, -4]} h={3.4} color="#eafff2" />
    <Dust t={t} area={[7, 4, 5]} color="rgba(210,255,230,.85)" />
  </>);
};

/* =================== S8 44.07 – 48.52  home on a different ship =================== */
const K8: Key[] = [
  { t: 44.07, pos: [0, 3.9, 14.2], look: [0, 4.7, -7], fov: 60 },
  { t: 48.52, pos: [0, 3.6, 12.4], look: [0.4, 4.9, -7], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const pathK = seg(t, 45.69, 46.57);
  const glowK = seg(t, 46.57, 47.0);
  const dots = Math.floor(pathK * 12);
  const arc = (k: number): V3 => {
    const a: V3 = [-1.6, 5.9, -6.9], b: V3 = [1.4, 7.6, -6.9], c2: V3 = [4.3, 4.6, -6.9];
    const x = (1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * b[0] + k * k * c2[0];
    const y = (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * b[1] + k * k * c2[1];
    return [x, y, -6.9];
  };
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffe9c4" />
    <Stars p={[0, 6, -26]} s={[46, 26]} t={t} n={160} />
    <EarthLimb y={-27.5} />
    <Station p={[0, 5.0, -8]} s={0.66} />
    {/* Shenzhou-24, docked at the front port */}
    <group position={[-3.6, 5.0, -7.3]} rotation={[0, 0, -Math.PI / 2]}><Capsule p={[0, 0, 0]} s={0.9} /></group>
    <CanvasPlane p={[-3.6, 2.9, -6.9]} s={[2.6, 0.6]} px={[520, 120]} draw={(c, W, H) => { c.fillStyle = "#101828"; c.fillRect(0, 0, W, H); c.fillStyle = "#9fb8d8"; c.font = "900 56px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SHENZHOU-24", W / 2, H / 2 + 2); }} />
    {/* Shenzhou-23, waiting at the side */}
    <group position={[4.9, 3.6, -7.2]} rotation={[0, 0, 0.55]}><Capsule p={[0, 0, 0]} s={0.9} /></group>
    <Glow p={[4.9, 3.6, -6.8]} r={2.6} color="rgba(80,255,170,1)" o={0.22 * glowK} />
    <group position={[4.9, 1.6, -6.9]} scale={[0.6 + glowK * 0.4, 0.6 + glowK * 0.4, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[2.9, 0.68]} px={[580, 136]} frame="#0a3d21" draw={(c, W, H) => { c.fillStyle = "#0d2136"; c.fillRect(0, 0, W, H); c.fillStyle = "#7dffce"; c.font = "900 60px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SHENZHOU-23", W / 2, H / 2 + 2); }} />
    </group>
    {/* the dotted boarding path */}
    {Array.from({ length: dots }, (_, i) => { const p = arc((i + 1) / 12); return <Ball key={i} p={p} r={0.1} color="#2fd46a" ink={0} />; })}
    <Dust t={t} area={[8, 5, 5]} color="rgba(200,220,255,.8)" />
  </>);
};

/* =================== S9 48.52 – 57.75  built alone, doors open =================== */
const K9: Key[] = [
  { t: 48.52, pos: [0, 3.9, 11.6], look: [0, 4.3, -5], fov: 60 },
  { t: 57.75, pos: [0, 3.6, 9.8], look: [0, 4.4, -5], fov: 57 },
];
const S9 = ({ t, f }: Ctx) => {
  const openK = seg(t, 53.24, 53.95, Easing.inOut(Easing.cubic));
  const chainDrop = seg(t, 53.24, 53.8, Easing.in(Easing.cubic));
  const guestPop = seg(t, 54.16, 54.6, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe9c4" />
    <Stars p={[0, 6, -26]} s={[46, 26]} t={t} n={150} />
    <EarthLimb y={-28} />
    {/* the great module, close up */}
    <Cyl p={[0, 4.3, -7]} rt={2.3} h={11} rot={[0, 0, Math.PI / 2]} color="#dfe6ee" line={2} />
    <Cyl p={[-2.8, 4.3, -7]} rt={2.34} h={0.4} rot={[0, 0, Math.PI / 2]} color="#c9a227" line={1} />
    <Cyl p={[3.4, 4.3, -7]} rt={2.34} h={0.4} rot={[0, 0, Math.PI / 2]} color="#c9a227" line={1} />
    <CanvasPlane p={[0, 7.3, -5.6]} s={[5.6, 0.85]} px={[896, 136]} draw={(c, W, H) => { c.fillStyle = "#101828"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("BUILT BY CHINA ALONE", W / 2, H / 2 + 2); }} />
    {/* gold light waiting behind the hatch */}
    <Glow p={[0, 4.3, -4.4]} r={3.4} color="rgba(255,190,80,1)" o={0.12 + openK * 0.5} />
    <Cyl p={[0, 4.3, -4.72]} rt={0.85} h={0.22} rot={[Math.PI / 2, 0, 0]} color={openK > 0.4 ? "#ffca7a" : "#101828"} line={0} />
    {/* the hatch door, swinging open */}
    <group position={[-0.95, 4.3, -4.6]} rotation={[0, -openK * 1.85, 0]}>
      <Cyl p={[0.95, 0, 0]} rt={0.95} h={0.24} rot={[Math.PI / 2, 0, 0]} color="#8a93a6" line={2} />
      <Cyl p={[0.95, 0, 0.2]} rt={0.32} h={0.22} rot={[Math.PI / 2, 0, 0]} color="#c9a227" line={1} />
    </group>
    <Cyl p={[-0.95, 4.3, -4.55]} rt={0.16} h={0.5} rot={[Math.PI / 2, 0, 0]} color="#5a6a7a" line={1} />
    <Cyl p={[0.95, 4.3, -4.55]} rt={0.16} h={0.5} rot={[Math.PI / 2, 0, 0]} color="#5a6a7a" line={1} />
    {/* the chain across the hatch — it drops when the hatch opens */}
    {chainDrop < 1 ? [-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
      <Ball key={i} p={[x, 4.3 + Math.abs(x) * -0.25 - chainDrop * 4.5, -4.35]} r={0.13} color="#ffd36a" ink={1} />
    )) : null}
    {chainDrop < 1 ? <Box p={[0, 3.35 - chainDrop * 4.5, -4.35]} s={[0.5, 0.65, 0.2]} color="#c9a227" line={2} /> : null}
    {/* GUEST No. 1 plaque */}
    {guestPop > 0.02 ? <group position={[2.9, 2.2, -4.6]} scale={[guestPop, guestPop, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[2.9, 1.0]} px={[580, 200]} frame="#0a3d21" draw={(c, W, H) => {
        c.fillStyle = "#0d2136"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#7dffce"; c.font = "900 58px Inter, Arial"; c.textAlign = "center"; c.fillText("GUEST No. 1", W / 2, H * 0.44);
        c.fillStyle = "#ffffff"; c.font = "800 40px Inter, Arial"; c.fillText("M. Z. ALI · PAKISTAN", W / 2, H * 0.78);
      }} />
    </group> : null}
    {/* three blank plaques for the guests still to come */}
    {t > 56.48 ? [-2.9, 0, 2.9].map((x, i) => {
      const k = seg(t, 56.48 + i * 0.18, 56.85 + i * 0.18, Easing.out(Easing.back(1.7)));
      return k > 0.02 ? (
        <group key={i} position={[x, 0.95, -4.8]} scale={[k, k, 1]}>
          <CanvasPlane p={[0, 0, 0]} s={[2.2, 0.72]} px={[440, 144]} draw={(c, W, H) => {
            c.fillStyle = "#232c3e"; c.fillRect(0, 0, W, H); c.strokeStyle = "#8a93a6"; c.lineWidth = 5; c.strokeRect(8, 8, W - 16, H - 16);
            c.fillStyle = "#aab4c8"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("GUEST No. " + (i + 2) + " · ?", W / 2, H / 2 + 2);
          }} />
        </group>
      ) : null;
    }) : null}
    <Dust t={t} area={[8, 5, 5]} color="rgba(200,220,255,.8)" />
  </>);
};

/* =================== S10 57.75 – 62.52  one small docking, one giant hello =================== */
const K10: Key[] = [
  { t: 57.75, pos: [0, 3.5, 13.4], look: [0, 4.9, -8], fov: 60 },
  { t: 62.52, pos: [0, 3.2, 11.2], look: [0, 5.1, -8], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => {
  const sunK = seg(t, 59.54, 61.6, Easing.out(Easing.cubic));
  const sunY = lerp(0.4, 3.6, sunK);
  return (<>
    <Cam t={t} keys={K10} />
    <Lights warm="#ffd9ae" />
    <Stars p={[0, 7, -28]} s={[48, 27]} t={t} n={130} />
    <EarthLimb y={-24.5} />
    <Ball p={[7.2, sunY, -14]} r={2.3} color="#ffd36a" ink={0} />
    <Glow p={[7.2, sunY, -13]} r={4.5 + sunK * 3} color="rgba(255,170,80,1)" o={0.25 + sunK * 0.4} />
    <Station p={[0, 5.4, -10]} s={0.85} />
    <group position={[-3.9, 5.4, -9.2]} rotation={[0, 0, -Math.PI / 2]}><Capsule p={[0, 0, 0]} s={1.05} /></group>
    <Glow p={[0, 5.4, -9]} r={6} color="rgba(255,190,100,1)" o={0.10 + sunK * 0.16} />
    <Dust t={t} area={[9, 6, 6]} color="rgba(255,225,190,.85)" />
  </>);
};

/* =================== S11 62.52 – 65.41  sign-off, indigo-silver studio =================== */
const K11: Key[] = [
  { t: 62.52, pos: [0, 3.1, 9.8], look: [0, 2.9, -2], fov: 60 },
  { t: 65.41, pos: [0, 3.0, 8.4], look: [0, 3.0, -2], fov: 58 },
];
const S11 = ({ t, f }: Ctx) => {
  const puff = t > 64.83 ? seg(t, 64.83, 65.35) : 0;
  return (<>
    <Cam t={t} keys={K11} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#141a33" b="#10142a" unit={2.0} w={30} d={30} />
    <WallDoor z={-7} W={30} kind="plain" a="#1d2447" b="#1d2447" base="#0a0d1e" />
    <SideWall x={-11} kind="plain" a="#182040" b="#182040" /><SideWall x={11} kind="plain" a="#182040" b="#182040" />
    <CanvasPlane p={[0, 4.9, -6.8]} s={[9.6, 5.2]} px={[960, 520]} frame="#05070f" draw={(c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0d1230"); g.addColorStop(1, "#27336e"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = "#dfe6ee"; for (let i = 0; i < 40; i++) c.fillRect(rnd(i + 3) * W, rnd(i + 13) * H * 0.5, 3, 3);
      c.fillStyle = "#8ae8ff"; c.beginPath(); c.arc(W * 0.5, H * 0.36, 74, 0, 7); c.fill();
      c.fillStyle = "#0d1230"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("T", W * 0.5, H * 0.36 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 150px Inter, Arial"; c.fillText("TDN", W * 0.5, H * 0.62);
      c.fillStyle = "#c8d2e0"; c.fillRect(0, H * 0.82, W, H * 0.18);
      c.fillStyle = "#101828"; c.font = "900 44px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W * 0.5, H * 0.91);
    }} />
    <Glow p={[0, 4.9, -6.2]} r={5.2} color="rgba(120,160,255,1)" o={0.20} />
    <Globe p={[5.4, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
    <Cyl p={[5.4, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.4, 0.06, -5.2]} rt={0.55} h={0.12} color="#27336e" line={1} />
    <Desk p={[0, 0, -2.6]} w={5.6} top="#2a3358" leg="#0d1020" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#05070f"; c.fillRect(0, 0, W, H); c.fillStyle = "#c8d2e0"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    <Box p={[-1.7, 1.12, -2.5]} s={[0.85, 0.05, 1.1]} color="#f2f0ea" line={1} /><Box p={[-1.6, 1.17, -2.55]} s={[0.85, 0.05, 1.1]} color="#dfe6ee" rot={[0, 0.25, 0]} line={1} />
    {/* the tiny desk rocket, puffing on "toons" */}
    <group position={[1.9, 1.05, -2.5]}>
      <Cyl p={[0, 0.3, 0]} rt={0.16} h={0.6} color="#f2f4f8" line={1} />
      <Cyl p={[0, 0.72, 0]} rt={0.02} rb={0.16} h={0.28} color="#c2372f" line={1} />
      {puff > 0 ? [0, 1, 2].map((i) => <Ball key={i} p={[(rnd(i + 8) - 0.5) * 0.4, -0.15 - puff * (0.4 + i * 0.22), 0]} r={0.1 + puff * 0.16} color="#cfd8e6" ink={0} />) : null}
    </group>
    <Monitor p={[2.9, 1.05, -2.7]} rot={[0, -0.35, 0]} screen="#8ae8ff" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#2a3358" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Frame p={[8.2, 3.4, -6.9]} s={[1.3, 1.0]} art={1} />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#10142a" b="#8a93a6" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, -0.35]} color="255,226,174" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(210,225,255,.9)" />
    <Person p={[0, 0, -3.6]} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 62.7 && t < 63.3 ? 0.08 : 0,
      arms: t > 64.8 ? "point" : "down", armK: seg(t, 64.8, 65.05), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>);
};

const CUTS = [0, 4.52, 13.06, 18.85, 25.80, 28.47, 36.42, 44.07, 48.52, 57.75, 62.52, 65.41];
export const TdnV9: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#060a24">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#3a2a4a">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#31586b">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#141c3d">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#060a24">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#060a24">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#dcebe2">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#060a24">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#060a24">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#0a1030">{(c) => <S10 {...c} />}</Scene>
      <Scene start={CUTS[10]} end={CUTS[11]} bg="#1d2447" trans="flash">{(c) => <S11 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.52 ? "rgba(70,110,255,.08)" : t < 13.06 ? "rgba(255,170,90,.08)" : t < 18.85 ? "rgba(80,200,190,.07)" : t < 25.80 ? "rgba(90,140,255,.08)" : t < 28.47 ? "rgba(70,110,255,.08)" : t < 36.42 ? "rgba(80,160,255,.08)" : t < 44.07 ? "rgba(120,255,190,.06)" : t < 48.52 ? "rgba(70,110,255,.08)" : t < 57.75 ? "rgba(90,140,255,.07)" : t < 62.52 ? "rgba(255,170,80,.09)" : "rgba(120,140,255,.07)"} />
      {/* S1 hook chip (2.6–4.52s) */}
      {t > 2.6 && t < 4.52 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,26,22,.88)", color: "#7dffce", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 52, padding: "16px 30px", borderRadius: 18 }}>
            FIRST PAKISTANI IN ORBIT
          </span>
        </div>
      ) : null}
      {/* S5 chip (26.3–28.47s) */}
      {t > 26.3 && t < 28.47 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,20,6,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 52, padding: "16px 30px", borderRadius: 18 }}>
            ORBIT IN 10 MINUTES
          </span>
        </div>
      ) : null}
      {/* S9 chip (49.5–52.7s) */}
      {t > 49.5 && t < 52.7 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,8,6,.88)", color: "#ff9a8a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 44, padding: "16px 30px", borderRadius: 18 }}>
            BUILT ALONE — SHUT OUT OF THE ISS
          </span>
        </div>
      ) : null}
      {/* S10 chip (60.6–62.4s) */}
      {t > 60.6 && t < 62.4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,20,6,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 48, padding: "16px 30px", borderRadius: 18 }}>
            A BRAND-NEW ERA IN SPACE
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
