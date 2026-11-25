// TDN v8 — "Pakistan's first astronaut: China's first foreign guest in orbit" — on Wed
// 25 Nov 2026 Shenzhou-24 carried Pakistani air force pilot Muhammad Zeeshan Ali to the
// Tiangong station: the first foreign astronaut China has ever launched, the first
// Pakistani to reach orbit, and Tiangong's first foreign visitor. He stays about a week
// and comes home on a different ship. 9:16 720x1280 30fps, 1979 frames (65.89 s voiceover).
// CUTS = [0, 4.10, 11.49, 18.16, 25.35, 32.78, 41.43, 50.74, 59.55, 63.16, 65.89].
// S1 dawn launch pad, ignition / S2 mission-control crew board + gold stamp
// S3 desert clock board 08:18, the climb / S4 capsule interior, three seats, name plates
// S5 the docking at Tiangong / S6 the floating lab + week calendar
// S7 Feb 2025: the signing + the golden ticket / S8 the twist: a hop is not an orbit
// S9 home on a different ship / S10 TDN sign-off desk (midnight-blue + emerald).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane } from "../style/toon";
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
const aliUniform: Look = { skin: "#c98d5e", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#ffd36a", shoe: "#101018" };
const dawoodUniform: Look = { skin: "#d9a878", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#14100a", badge: "#c0c6d4", shoe: "#101018" };
const aliSuit: Look = { skin: "#c98d5e", body: "#eef1f4", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#2fd46a", shoe: "#dfe3e8" };
const tangSuit: Look = { skin: "#f0c8a0", body: "#eef1f4", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#e5233a", shoe: "#dfe3e8" };
const wuSuit: Look = { skin: "#f6ddba", body: "#eef1f4", outfit: "shirt", hair: "swept", hairColor: "#0d0d14", badge: "#2f8cff", shoe: "#dfe3e8" };
const official1: Look = { skin: "#f0c8a0", body: "#23232e", outfit: "shirt", hair: "swept", hairColor: "#cfd4dc", glasses: true, shoe: "#101018" };
const official2: Look = { skin: "#d9a878", body: "#3a3f4a", outfit: "shirt", hair: "short", hairColor: "#0d0d14", shoe: "#101018" };

/* ---------- scene wrapper (same pattern as TdnV1/TdnV2/TdnV3/TdnV5/TdnV6/TdnV7) ---------- */
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

/* ---------- shared: stamp (pattern from TdnV6) ---------- */
const Stamp: React.FC<{ t: number; t0: number; p: [number, number, number]; s: [number, number]; rot: number; lines: string[]; ink?: string }> = ({ t, t0, p, s, rot, lines, ink = "#c22333" }) => {
  if (t < t0 - 0.15) return null;
  const k = seg(t, t0 - 0.15, t0 + 0.05, Easing.in(Easing.cubic));
  return (
    <group position={p} rotation={[0, 0, rot]} scale={[lerp(2.3, 1, k), lerp(2.3, 1, k), 1]}>
      <CanvasPlane p={[0, 0, 0]} s={s} px={[Math.round(310 * s[0]), Math.round(310 * s[1])]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H);
        c.strokeStyle = ink; c.lineWidth = 13; c.strokeRect(12, 12, W - 24, H - 24);
        c.fillStyle = ink; c.textAlign = "center"; c.textBaseline = "middle";
        const maxLen = Math.max(...lines.map((ln) => ln.length));
        const fs = Math.min(lines.length > 1 ? H * 0.30 : H * 0.42, (W * 0.88) / (0.60 * maxLen));
        c.font = `900 ${fs}px Inter, Arial`;
        lines.forEach((ln, i) => c.fillText(ln, W / 2, H * (lines.length > 1 ? 0.30 + i * 0.40 : 0.52)));
      }} />
    </group>
  );
};

/* ---------- shared: scale-in name/info plate ---------- */
const Plate: React.FC<{ t: number; t0: number; p: [number, number, number]; s: [number, number]; lines: string[]; bg?: string; fg?: string; border?: string }> = ({ t, t0, p, s, lines, bg = "#10131c", fg = "#f2f0ea", border = "#8a93a6" }) => {
  if (t < t0 - 0.1) return null;
  const k = seg(t, t0 - 0.1, t0 + 0.25, Easing.out(Easing.back(1.6)));
  return (
    <group position={p} scale={[Math.max(0.01, k), Math.max(0.01, k), 1]}>
      <CanvasPlane p={[0, 0, 0]} s={s} px={[Math.round(300 * s[0]), Math.round(300 * s[1])]} draw={(c, W, H) => {
        c.fillStyle = bg; c.fillRect(0, 0, W, H);
        c.strokeStyle = border; c.lineWidth = 9; c.strokeRect(6, 6, W - 12, H - 12);
        c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
        const maxLen = Math.max(...lines.map((ln) => ln.length));
        const fs = Math.min(lines.length > 1 ? H * 0.30 : H * 0.44, (W * 0.88) / (0.60 * maxLen));
        c.font = `900 ${fs}px Inter, Arial`;
        lines.forEach((ln, i) => c.fillText(ln, W / 2, H * (lines.length > 1 ? 0.31 + i * 0.38 : 0.52)));
      }} />
    </group>
  );
};

/* ---------- shared: the Long March rocket (origin at pad top, base y=0) ---------- */
const Rocket: React.FC<{ x?: number; z?: number; base?: number; rise?: number; flame?: number; t?: number }> = ({ x = 0, z = -6, base = 0, rise = 0, flame = 0, t = 0 }) => {
  const fl = flame * (0.92 + 0.08 * Math.sin(t * 40));
  return (
    <group position={[x, base + rise, z]}>
      {/* strap-on boosters */}
      {[[-0.82, 0.3], [0.82, 0.3], [-0.82, -0.35], [0.82, -0.35]].map(([dx, dz], i) => (
        <group key={i}>
          <Cyl p={[dx, 2.5, dz]} rt={0.23} rb={0.29} h={4.3} color="#e8ecf2" line={1} />
          <Cyl p={[dx, 4.95, dz]} rt={0.03} rb={0.23} h={0.7} color="#dfe3e8" line={1} />
        </group>
      ))}
      {/* core */}
      <Cyl p={[0, 4.3, 0]} rt={0.52} rb={0.58} h={5.6} color="#f2f4f7" line={2} />
      <Cyl p={[0, 2.1, 0]} rt={0.60} rb={0.60} h={0.5} color="#c2372f" line={0} />
      <Cyl p={[0, 7.55, 0]} rt={0.42} rb={0.52} h={1.2} color="#dfe3e8" line={1} />
      <Cyl p={[0, 8.5, 0]} rt={0.05} rb={0.20} h={0.9} color="#c9cedb" line={1} />
      <Cyl p={[0, 9.35, 0]} rt={0.03} rb={0.03} h={0.9} color="#8a93a6" line={0} />
      {/* fins */}
      {[-0.72, 0.72].map((dx, i) => <Box key={i} p={[dx, 1.15, 0]} s={[0.34, 1.1, 0.08]} color="#c2372f" line={1} />)}
      {/* flame */}
      {fl > 0.02 ? (
        <group>
          <Cyl p={[0, 1.35 - 1.25 * fl, 0]} rt={0.52} rb={0.10} h={2.5 * fl} color="#ff7a2a" line={0} />
          <Cyl p={[0, 1.35 - 0.85 * fl, 0]} rt={0.30} rb={0.05} h={1.7 * fl} color="#ffd36a" line={0} />
        </group>
      ) : null}
    </group>
  );
};

/* ---------- shared: the Shenzhou capsule (nose = local +Y) ---------- */
const Capsule: React.FC<{ p: V3; rot?: V3; s?: number }> = ({ p, rot = [0, 0, 0], s = 1 }) => (
  <group position={p} rotation={rot} scale={[s, s, s]}>
    <Cyl p={[0, 0, 0]} rt={0.78} rb={1.02} h={1.5} color="#dfe3e8" line={2} />
    <Cyl p={[0, 1.32, 0]} rt={0.78} rb={0.78} h={1.2} color="#f2f4f7" line={1} />
    <Cyl p={[0, 2.08, 0]} rt={0.48} rb={0.64} h={0.4} color="#8a93a6" line={1} />
    <Ball p={[0, 0.35, 0.92]} r={0.17} color="#274b73" ink={0.04} />
    <Ball p={[0.45, 0.85, 0.82]} r={0.11} color="#7ac74f" ink={0} />
    {[-1.30, 1.30].map((dx, i) => <Box key={i} p={[dx, -0.25, 0]} s={[1.05, 0.72, 0.07]} color="#274b8f" line={1} />)}
    <Cyl p={[0, -0.95, 0]} rt={0.62} rb={0.5} h={0.5} color="#8a93a6" line={1} />
  </group>
);

/* ---------- shared: the Tiangong station (docking port at local -X) ---------- */
const Station: React.FC<{ p: V3; hatchK?: number }> = ({ p, hatchK = 0 }) => (
  <group position={p}>
    <Cyl p={[0, 0, 0]} rt={1.05} rb={1.05} h={5.4} rot={[0, 0, Math.PI / 2]} color="#e8ecf2" line={2} />
    <Cyl p={[1.7, 0, 0]} rt={1.09} rb={1.09} h={0.5} rot={[0, 0, Math.PI / 2]} color="#e0743a" line={0} />
    <Ball p={[3.05, 0, 0]} r={1.12} color="#dfe3e8" ink={0.05} />
    <Cyl p={[0.2, -1.95, 0]} rt={0.95} rb={0.95} h={2.7} color="#dfe3e8" line={1} />
    <Box p={[0.2, -3.75, 0]} s={[5.0, 0.09, 1.9]} color="#274b8f" line={1} />
    <Box p={[-3.35, 0, 0]} s={[1.9, 0.09, 4.4]} color="#274b8f" line={1} />
    <Cyl p={[-3.05, 0, 0]} rt={0.55} rb={0.72} h={0.6} rot={[0, 0, Math.PI / 2]} color="#8a93a6" line={1} />
    <Ball p={[-3.35, 0.85, 0]} r={0.15} color={hatchK > 0.5 ? "#2fd46a" : "#e5233a"} ink={0} />
    <Cyl p={[3.05, 1.45, 0]} rt={0.05} rb={0.05} h={0.8} color="#8a93a6" line={0} />
    <Ball p={[3.05, 1.9, 0]} r={0.12} color="#ffd36a" ink={0} />
  </group>
);

/* ---------- shared: suited astronaut (Person + helmet ball) ---------- */
const Astro: React.FC<{ p: V3; look: Look; f: number; h?: number; mood?: string; arms?: string; armK?: number; armR?: [number, number]; helmet?: boolean }> = ({ p, look, f, h = 3.3, mood = "grin", arms = "down", armK = 1, armR = [0.5, 0.5], helmet = true }) => (
  <>
    <Person p={p} h={h} look={look} f={f} shadow={false} pose={{ mood: mood as never, arms: arms as never, armK, armR, lookX: 0 }} />
    {helmet ? <Ball p={[p[0], p[1] + h * 0.845, p[2]]} r={h * 0.148} color="#f7fafc" ink={0.04} /> : null}
  </>
);

/* =================== S1 0 – 4.10  "China launched a foreign astronaut for the first time in its history" — dawn pad, ignition =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.0, 14.2], look: [-0.4, 4.2, -4], fov: 60 },
  { t: 4.10, pos: [0, 4.0, 12.6], look: [-0.4, 5.2, -4], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const flame = t < 1.14 ? 0 : seg(t, 1.14, 1.5);
  const rise = Math.pow(seg(t, 2.9, 4.4, Easing.in(Easing.cubic)), 1.5) * 4.2;
  const smokeK = seg(t, 1.25, 3.9);
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffd9ae" />
    <CanvasPlane p={[0, 13, -32]} s={[92, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a1a4e"); g.addColorStop(0.55, "#7a3a5e"); g.addColorStop(1, "#e88a4a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[16, 3.2, -28]} r={2.1} color="#ffd9a0" ink={0} />
    <Floor kind="plain" a="#caa06a" b="#bd975c" unit={2} w={48} d={48} />
    {/* the pad + service tower */}
    <Box p={[0.8, 0.5, -6]} s={[7.5, 1.0, 6.5]} color="#6a7080" line={2} />
    <Box p={[-3.1, 4.6, -6]} s={[0.55, 8.2, 0.55]} color="#8a4a3a" line={1} />
    <Box p={[-3.1, 4.6, -4.6]} s={[0.4, 8.2, 0.4]} color="#7a4030" line={1} />
    {[1.8, 4.4, 7.0].map((y, i) => <Box key={i} p={[-3.1, y, -5.3]} s={[0.5, 0.28, 2.6]} color="#9a5844" line={1} />)}
    <Box p={[-1.7, 8.6, -6]} s={[2.9, 0.42, 0.42]} color="#8a4a3a" line={1} />
    <Box p={[4.9, 0.75, -4.2]} s={[1.6, 1.5, 1.6]} color="#7a8090" line={1} />
    <Rocket x={0.8} z={-6} base={1.0} rise={rise} flame={flame} t={t} />
    {/* ignition smoke, billowing out along the pad */}
    {smokeK > 0 ? [-2.6, -1.2, 0.6, 2.2, 3.8, 5.0].map((dx, i) => (
      <Ball key={i} p={[0.8 + dx * (0.5 + smokeK * 0.9), 0.75 + rnd(i + 3) * 0.5, -6 + (rnd(i + 9) - 0.5) * 2.6]} r={0.5 + smokeK * (0.9 + rnd(i + 5) * 0.6)} color={i % 2 ? "#e8e2da" : "#cfc8be"} ink={0} />
    )) : null}
    <Person p={[-3.25, 0, -0.6]} h={3.5} look={analyst} f={f} pose={{ mood: "grin", arms: t > 1.0 ? "point" : "down", armK: seg(t, 1.0, 1.25), armR: [-0.85, 0.72], lookX: 0.4 }} />
    <Dust t={t} area={[7, 4, 5]} color="rgba(255,215,170,.8)" />
  </>);
};

/* =================== S2 4.10 – 11.49  "The passenger was Muhammad Zeeshan Ali..." — the crew board =================== */
const K2: Key[] = [
  { t: 4.10, pos: [0, 3.2, 12.8], look: [0, 3.8, -4], fov: 60 },
  { t: 11.49, pos: [0, 3.4, 10.6], look: [-0.4, 4.0, -4], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K2} />
  <Lights warm="#cfe0ff" />
  <Floor kind="tile" a="#22314f" b="#1d2a44" unit={2} w={40} d={40} />
  <CanvasPlane p={[0, 5.8, -9.6]} s={[26, 11.5]} px={[1040, 460]} draw={(c, W, H) => {
    c.fillStyle = "#1b2c4e"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(120,170,255,.14)"; c.lineWidth = 3;
    for (let i = 1; i < 10; i++) { c.beginPath(); c.moveTo((W / 10) * i, 0); c.lineTo((W / 10) * i, H); c.stroke(); }
    for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(0, (H / 5) * i); c.lineTo(W, (H / 5) * i); c.stroke(); }
    c.fillStyle = "rgba(140,190,255,.45)"; c.font = "900 40px Inter, Arial"; c.textAlign = "center"; c.fillText("MISSION CONTROL", W / 2, 58);
  }} />
  {/* the crew ID board */}
  <CanvasPlane p={[-1.1, 4.7, -6.5]} s={[8.6, 5.3]} px={[1032, 636]} frame="#0d1526" draw={(c, W, H) => {
    c.fillStyle = "#101c33"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#c9a227"; c.fillRect(0, 0, W, 12);
    c.fillStyle = "#8ae8ff"; c.font = "800 40px Inter, Arial"; c.textAlign = "center"; c.fillText("SHENZHOU-24 · CREW", W / 2, 84);
    c.fillStyle = "#ffffff"; c.font = "900 104px Inter, Arial";
    c.fillText("MUHAMMAD", W / 2, 216); c.fillText("ZEESHAN ALI", W / 2, 336);
    c.fillStyle = "#c8d4ea"; c.font = "800 44px Inter, Arial"; c.fillText("AGE 40 — PAKISTAN AIR FORCE", W / 2, 428);
    c.fillStyle = "#8a93a6"; c.font = "800 38px Inter, Arial"; c.fillText("ROLE: PAYLOAD SPECIALIST", W / 2, 492);
    // Pakistan flag stripe: white band + green field + crescent
    const fy = H - 92;
    c.fillStyle = "#e8e8e8"; c.fillRect(60, fy, 130, 62);
    c.fillStyle = "#0d5c33"; c.fillRect(190, fy, W - 250, 62);
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(W / 2 + 60, fy + 31, 21, 0, 7); c.fill();
    c.fillStyle = "#0d5c33"; c.beginPath(); c.arc(W / 2 + 68, fy + 27, 18, 0, 7); c.fill();
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(W / 2 + 92, fy + 18, 4.5, 0, 7); c.fill();
  }} />
  <Stamp t={t} t0={9.2} p={[-1.1, 1.95, -5.7]} s={[4.8, 1.7]} rot={-0.10} lines={["FIRST PAKISTANI", "IN ORBIT"]} ink="#c9a227" />
  <Desk p={[-4.6, 0, -1.4]} w={3.4} top="#22314f" leg="#101828" d={1.5} />
  <Monitor p={[-5.3, 1.05, -1.6]} rot={[0, 0.3, 0]} screen="#2fd4b8" />
  <Monitor p={[-3.9, 1.05, -1.7]} rot={[0, -0.2, 0]} screen="#e5b83a" />
  <Person p={[3.9, 0, -3.1]} h={3.5} look={aliUniform} f={f} pose={{ mood: "grin", arms: "point", armK: seg(t, 4.8, 5.1), armR: [-0.72, 0.55], lookX: -0.5 }} />
  <Lamp p={[6.6, 0, -3.6]} h={3.4} color="#cfe0ff" />
  <Plant p={[-7.6, 0, -4.4]} s={1.2} />
  <Dust t={t} area={[7, 4, 5]} color="rgba(190,215,255,.85)" />
</>);

/* =================== S3 11.49 – 18.16  "At eight eighteen... a Long March rocket lifted Shenzhou Twenty-Four" — the climb =================== */
const K3: Key[] = [
  { t: 11.49, pos: [0, 3.2, 13.5], look: [0.8, 4.0, -4], fov: 60 },
  { t: 18.16, pos: [0, 5.6, 14.8], look: [1.2, 8.6, -5], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const riseK = seg(t, 13.9, 18.3, Easing.in(Easing.cubic));
  const rise = Math.pow(riseK, 1.6) * 30;
  const smokeK = seg(t, 14.0, 17.6);
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffe2ae" />
    <CanvasPlane p={[0, 14, -34]} s={[95, 40]} px={[950, 400]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3a7ac2"); g.addColorStop(0.6, "#9fd0ff"); g.addColorStop(1, "#ffe8c0"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[-16, 10.5, -30]} r={2.0} color="#fff2c0" ink={0} />
    <Floor kind="plain" a="#d3ac6d" b="#c69f5e" unit={2} w={60} d={60} />
    <Box p={[-14, 0.8, -19]} s={[11, 1.6, 4.5]} color="#bd975c" line={1} />
    <Box p={[14, 1.0, -21]} s={[13, 2.0, 5]} color="#c39f60" line={1} />
    <Box p={[-9, 0.5, -14]} s={[6, 1.0, 3]} color="#c69f5e" line={1} />
    {/* the 08:18 clock board */}
    <CanvasPlane p={[-4.15, 4.2, -7]} s={[3.5, 4.3]} px={[525, 645]} frame="#5a3a20" draw={(c, W, H) => {
      c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#274b73"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.fillText("JIUQUAN", W / 2, 70);
      const cx = W / 2, cy = H * 0.46, r = W * 0.31;
      c.strokeStyle = "#1b1b2a"; c.lineWidth = 10; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
      c.fillStyle = "#1b1b2a";
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.beginPath(); c.arc(cx + Math.sin(a) * r * 0.86, cy - Math.cos(a) * r * 0.86, i % 3 ? 4 : 7, 0, 7); c.fill(); }
      const ha = ((8.3 / 12) * Math.PI * 2), ma = ((18 / 60) * Math.PI * 2);
      c.strokeStyle = "#1b1b2a"; c.lineCap = "round";
      c.lineWidth = 17; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.sin(ha) * r * 0.55, cy - Math.cos(ha) * r * 0.55); c.stroke();
      c.lineWidth = 12; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.sin(ma) * r * 0.82, cy - Math.cos(ma) * r * 0.82); c.stroke();
      c.fillStyle = "#c2372f"; c.beginPath(); c.arc(cx, cy, 11, 0, 7); c.fill();
      c.fillStyle = "#1b1b2a"; c.font = "900 74px Inter, Arial"; c.fillText("08:18", W / 2, H * 0.83);
      c.fillStyle = "#5a5a6a"; c.font = "800 34px Inter, Arial"; c.fillText("LAUNCH CENTRE", W / 2, H * 0.92);
    }} />
    <Cyl p={[-4.7, 0.6, -7]} rt={0.09} rb={0.09} h={1.2} color="#5a3a20" line={0} />
    {/* pad + tower + rocket */}
    <Box p={[2.6, 0.5, -6.5]} s={[6.5, 1.0, 6]} color="#6a7080" line={2} />
    <Box p={[-0.1, 4.2, -6.5]} s={[0.45, 7.4, 0.45]} color="#8a4a3a" line={1} />
    <Rocket x={2.6} z={-6.5} base={1.0} rise={rise} flame={t > 13.9 ? 1 : 0} t={t} />
    {smokeK > 0 ? [-3.2, -1.6, 0.2, 1.8, 3.6, 5.2, 6.6].map((dx, i) => (
      <Ball key={i} p={[2.6 + dx * (0.45 + smokeK * 1.05), 0.8 + rnd(i + 21) * 0.7, -6.5 + (rnd(i + 31) - 0.5) * 3.0]} r={0.55 + smokeK * (1.1 + rnd(i + 41) * 0.7)} color={i % 2 ? "#f2ede4" : "#ddd5c6"} ink={0} />
    )) : null}
    <Dust t={t} area={[8, 5, 6]} color="rgba(255,235,200,.8)" />
  </>);
};

/* =================== S4 18.16 – 25.35  "Beside Ali sat the commander, Tang Hongbo..." — three seats =================== */
const K4: Key[] = [
  { t: 18.16, pos: [-1.8, 3.0, 11.8], look: [0, 3.2, -4], fov: 60 },
  { t: 25.35, pos: [1.8, 3.0, 11.8], look: [0, 3.2, -4], fov: 60 },
];
const S4 = ({ t, f }: Ctx) => {
  const crew: { x: number; look: Look; name: string; t0: number }[] = [
    { x: -3.1, look: aliSuit, name: "ALI", t0: 18.65 },
    { x: 0, look: tangSuit, name: "TANG HONGBO", t0: 19.97 },
    { x: 3.1, look: wuSuit, name: "WU YI", t0: 24.49 },
  ];
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffd9ae" />
    <Floor kind="plain" a="#2c3542" b="#262e3a" unit={2} w={34} d={34} />
    <CanvasPlane p={[0, 5.4, -9.6]} s={[25, 11]} px={[1000, 440]} draw={(c, W, H) => {
      c.fillStyle = "#232c3a"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(150,180,220,.12)"; c.lineWidth = 3;
      for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo((W / 8) * i, 0); c.lineTo((W / 8) * i, H); c.stroke(); }
      for (let i = 0; i < 10; i++) { c.fillStyle = ((f >> 4) + i) % 2 ? "#2fd46a" : "#7a2a20"; c.beginPath(); c.arc(70 + i * 96, 44, 7, 0, 7); c.fill(); }
    }} />
    {/* the round window: stars + the Earth's curve */}
    <CanvasPlane p={[0, 7.9, -9.2]} s={[3.3, 3.3]} px={[396, 396]} draw={(c, W, H) => {
      c.fillStyle = "#39424e"; c.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2, r = W * 0.40;
      c.fillStyle = "#050914"; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
      c.fillStyle = "#ffffff";
      for (let i = 0; i < 26; i++) { c.globalAlpha = 0.35 + rnd(i + 51) * 0.6; c.beginPath(); c.arc(cx + (rnd(i + 61) - 0.5) * r * 1.7, cy + (rnd(i + 71) - 0.5) * r * 1.5 - r * 0.15, 1.6 + rnd(i + 81) * 1.8, 0, 7); c.fill(); }
      c.globalAlpha = 1;
      c.fillStyle = "#2a6ad4"; c.beginPath(); c.arc(cx, cy + r * 1.45, r * 1.05, 0, 7); c.fill();
      c.fillStyle = "#3f9e58"; c.beginPath(); c.arc(cx - r * 0.3, cy + r * 0.62, r * 0.22, 0, 7); c.fill();
      c.strokeStyle = "#8a93a6"; c.lineWidth = 22; c.beginPath(); c.arc(cx, cy, r + 8, 0, 7); c.stroke();
    }} />
    {crew.map((m, i) => (
      <group key={i}>
        <Box p={[m.x, 0.95, -4.7]} s={[2.1, 1.9, 0.5]} color="#39424e" line={2} />
        <Box p={[m.x, 0.4, -4.0]} s={[2.1, 0.8, 1.3]} color="#2c3542" line={1} />
        <Astro p={[m.x, 0, -3.55]} look={m.look} f={f} h={3.1} mood={i === 1 ? "deadpan" : "grin"} />
        <Plate t={t} t0={m.t0} p={[m.x, 0.62, -2.45]} s={[1.95, 0.62]} lines={[m.name]} />
      </group>
    ))}
    <Plate t={t} t0={22.09} p={[0, 1.55, -2.45]} s={[2.3, 0.66]} lines={["3RD VISIT"]} bg="#3a2c10" fg="#ffd36a" border="#c9a227" />
    {/* a pen, floating in zero-g */}
    <Cyl p={[1.9, 3.15 + Math.sin(t * 1.4) * 0.1, -2.8]} rt={0.045} rb={0.045} h={0.85} rot={[t * 0.7, 0, 1.1]} color="#ffd36a" line={0} />
    <CanvasPlane p={[5.45, 4.6, -6.5]} s={[2.2, 2.8]} px={[330, 420]} frame="#10131c" draw={(c, W, H) => {
      c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#1b1b2a"; c.font = "900 40px Inter, Arial"; c.textAlign = "center"; c.fillText("CHECKLIST", W / 2, 58);
      c.strokeStyle = "rgba(90,90,110,.4)"; c.lineWidth = 3;
      for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(36, 108 + i * 58); c.lineTo(W - 36, 108 + i * 58); c.stroke(); }
      c.strokeStyle = "#1d7a4a"; c.lineWidth = 7; c.lineCap = "round";
      for (let i = 0; i < 3; i++) { const y = 96 + i * 58; c.beginPath(); c.moveTo(44, y); c.lineTo(56, y + 12); c.lineTo(76, y - 12); c.stroke(); }
    }} />
    <Dust t={t} area={[7, 4, 5]} color="rgba(200,220,255,.8)" />
  </>);
};

/* =================== S5 25.35 – 32.78  "Three and a half hours later, the capsule docked with Tiangong" — the docking =================== */
const K5: Key[] = [
  { t: 25.35, pos: [0, 3.6, 12.6], look: [0.5, 3.8, -5], fov: 60 },
  { t: 32.78, pos: [0, 3.7, 10.8], look: [0.9, 3.8, -5], fov: 57 },
];
const S5 = ({ t, f }: Ctx) => {
  const dockK = seg(t, 25.6, 27.13);
  const cx = lerp(-9.8, -3.1, dockK);
  const cy = 3.8 + Math.sin(t * 2.1) * 0.05 * (1 - dockK);
  const pulse = seg(t, 27.13, 27.45) * (1 - seg(t, 28.3, 29.3));
  return (<>
    <Cam t={t} keys={K5} impacts={[[27.13, 0.05]]} />
    <Lights warm="#dfe8ff" />
    <Stars p={[0, 7, -26]} s={[52, 30]} t={t} />
    <Globe p={[-9, -6.8, -16]} r={7} rotY={t * 0.03} />
    <Station p={[2.4, 3.8, -6]} hatchK={seg(t, 32.0, 32.35)} />
    <Capsule p={[cx, cy, -6]} rot={[0, 0, -Math.PI / 2]} s={0.9} />
    <Plate t={t} t0={25.5} p={[-2.9, 8.1, -7]} s={[3.3, 1.5]} lines={["FLIGHT TIME", "3 H 30 MIN"]} />
    {pulse > 0.01 ? <Glow p={[-1.0, 3.8, -5.2]} r={2.3} color="rgba(64,200,160,1)" o={0.38 * pulse} /> : null}
    <Dust t={t} area={[8, 5, 6]} color="rgba(190,215,255,.7)" />
  </>);
};

/* =================== S6 32.78 – 41.43  "He will spend about a week aboard as a payload specialist, running experiments..." — the floating lab =================== */
const K6: Key[] = [
  { t: 32.78, pos: [0, 3.1, 12.2], look: [0, 3.6, -4], fov: 60 },
  { t: 41.43, pos: [0, 3.3, 10.6], look: [0.2, 3.7, -4], fov: 57 },
];
const S6 = ({ t, f }: Ctx) => {
  const expK = seg(t, 37.19, 37.7);
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#eafff2" />
    <Floor kind="tile" a="#cfe0d2" b="#c2d6c6" unit={2} w={34} d={34} />
    <WallDoor z={-7.5} W={30} kind="plain" a="#dcebe2" b="#dcebe2" base="#b9cfc0" />
    <SideWall x={-12} kind="plain" a="#cfe2d4" b="#cfe2d4" /><SideWall x={12} kind="plain" a="#cfe2d4" b="#cfe2d4" />
    {/* window strip: stars over the Earth's curve */}
    <CanvasPlane p={[3.6, 6.6, -7.3]} s={[6.2, 1.9]} px={[744, 228]} frame="#8aa493" draw={(c, W, H) => {
      c.fillStyle = "#050914"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffffff";
      for (let i = 0; i < 34; i++) { c.globalAlpha = 0.3 + rnd(i + 91) * 0.65; c.beginPath(); c.arc(rnd(i + 101) * W, rnd(i + 111) * H * 0.62, 1.5 + rnd(i + 121) * 2, 0, 7); c.fill(); }
      c.globalAlpha = 1;
      c.fillStyle = "#2a6ad4"; c.beginPath(); c.arc(W * 0.5, H * 2.05, W * 0.62, 0, 7); c.fill();
      c.fillStyle = "#3f9e58"; c.beginPath(); c.arc(W * 0.36, H * 0.94, 26, 0, 7); c.fill();
    }} />
    {/* the week calendar */}
    <CanvasPlane p={[-4.05, 4.6, -6.9]} s={[3.1, 3.8]} px={[465, 570]} frame="#4a6a52" draw={(c, W, H) => {
      c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#1d5c38"; c.fillRect(0, 0, W, H * 0.17);
      c.fillStyle = "#ffffff"; c.font = "900 40px Inter, Arial"; c.textAlign = "center"; c.fillText("ONE WEEK ABOARD", W / 2, H * 0.115);
      const cols = 4, bw = W * 0.19, bh = H * 0.24, gx = W * 0.045, gy = H * 0.05, x0 = W * 0.065, y0 = H * 0.26;
      for (let i = 0; i < 7; i++) {
        const x = x0 + (i % cols) * (bw + gx), y = y0 + Math.floor(i / cols) * (bh + gy);
        c.strokeStyle = "#8aa493"; c.lineWidth = 5; c.strokeRect(x, y, bw, bh);
        c.fillStyle = "#5a5a6a"; c.font = "900 44px Inter, Arial"; c.fillText(String(i + 1), x + bw / 2, y + bh * 0.62);
        if (t > 33.6 + i * 1.02) {
          c.strokeStyle = "#1d7a4a"; c.lineWidth = 11; c.lineCap = "round";
          c.beginPath(); c.moveTo(x + bw * 0.24, y + bh * 0.52); c.lineTo(x + bw * 0.44, y + bh * 0.72); c.lineTo(x + bw * 0.78, y + bh * 0.26); c.stroke();
        }
      }
    }} />
    {/* the experiment board, dim until the four studies are named */}
    <CanvasPlane p={[2.3, 6.1, -7.0]} s={[5.8, 1.7]} px={[870, 255]} frame="#33503c" draw={(c, W, H) => {
      c.fillStyle = "#12241a"; c.fillRect(0, 0, W, H);
      c.globalAlpha = 0.22 + 0.78 * expK;
      c.fillStyle = "#7dffb0"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.fillText("4 BIOTECH EXPERIMENTS", W / 2, H * 0.44);
      c.fillStyle = "#c8e8d2"; c.font = "800 40px Inter, Arial"; c.fillText("FROM PAKISTANI UNIVERSITIES", W / 2, H * 0.76);
      c.globalAlpha = 1;
    }} />
    {/* the experiment rack */}
    <Box p={[2.3, 1.8, -4.4]} s={[3.4, 3.6, 0.35]} color="#aebfb2" line={2} />
    <Box p={[2.3, 2.28, -4.1]} s={[3.2, 0.14, 0.8]} color="#8aa493" line={1} />
    <Box p={[2.3, 0.9, -4.1]} s={[3.2, 0.14, 0.8]} color="#8aa493" line={1} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <Cyl key={i} p={[1.35 + i * 0.38, 2.62, -3.95]} rt={0.09} rb={0.09} h={0.55} color={["#2fd4b8", "#7ac74f", "#ffd36a", "#2fd4b8", "#e0743a", "#7ac74f"][i]} line={1} />
    ))}
    {[0, 1, 2].map((i) => (
      <Box key={i} p={[1.5 + i * 0.75, 1.28, -3.95]} s={[0.55, 0.62, 0.5]} color={["#dfe8ee", "#cfe0ea", "#dfe8ee"][i]} line={1} />
    ))}
    <Cyl p={[3.35, 1.0, -3.9]} rt={0.34} rb={0.28} h={0.4} color="#8a5a2a" line={1} />
    <Ball p={[3.35, 1.48, -3.9]} r={0.30} color="#7ac74f" ink={0.04} />
    
    {/* Ali, floating at the rack */}
    <Astro p={[-1.7, 1.30 + Math.sin(t * 1.25) * 0.09, -3.4]} look={aliSuit} f={f} h={3.3} helmet={false} arms="hold" armR={[0.85, 0.45]} />
    {/* a clipboard, drifting */}
    <Box p={[0.5, 3.5 + Math.sin(t * 0.9 + 1) * 0.12, -2.7]} s={[0.7, 0.95, 0.06]} rot={[0, 0, Math.sin(t * 0.7) * 0.15]} color="#f6f1e6" line={1} />
    <Lamp p={[-7.8, 0, -4.2]} h={3.3} color="#eafff2" />
    <Dust t={t} area={[7, 4, 5]} color="rgba(220,255,235,.85)" />
  </>);
};

/* =================== S7 41.43 – 50.74  "His seat came from a deal signed in February twenty twenty-five..." — the signing + the race =================== */
const K7: Key[] = [
  { t: 41.43, pos: [-1.4, 3.2, 12.6], look: [-1.8, 3.9, -4], fov: 60 },
  { t: 44.5, pos: [-1.2, 3.2, 12.4], look: [-1.6, 3.9, -4], fov: 60 },
  { t: 50.74, pos: [2.7, 3.2, 11.4], look: [4.7, 3.7, -4], fov: 58 },
];
const star2d = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
  }
  c.closePath(); c.fill();
};
const S7 = ({ t, f }: Ctx) => {
  const ticketK = t > 46.89 ? seg(t, 46.89, 47.09, Easing.in(Easing.cubic)) : 0;
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe8c0" />
    <Floor kind="plank" a="#9a6a42" b="#8a5f38" unit={2} w={36} d={36} />
    <WallDoor z={-8} W={34} kind="plain" a="#e8e0c8" b="#e8e0c8" base="#cbbfa0" />
    <SideWall x={-13} kind="plain" a="#ddd2b2" b="#ddd2b2" /><SideWall x={13} kind="plain" a="#ddd2b2" b="#ddd2b2" />
    {/* the two flags */}
    <Cyl p={[-6.4, 2.2, -7.3]} rt={0.06} rb={0.06} h={4.4} color="#5a3a20" line={0} />
    <CanvasPlane p={[-5.7, 4.5, -7.3]} s={[2.3, 1.55]} px={[460, 310]} draw={(c, W, H) => {
      c.fillStyle = "#de2910"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffde00"; star2d(c, W * 0.20, H * 0.30, H * 0.17);
      [[0.40, 0.16], [0.46, 0.32], [0.46, 0.50], [0.40, 0.64]].forEach(([fx, fy]) => star2d(c, W * fx, H * fy, H * 0.055));
    }} />
    <Cyl p={[2.0, 2.2, -7.3]} rt={0.06} rb={0.06} h={4.4} color="#5a3a20" line={0} />
    <CanvasPlane p={[3.25, 5.6, -7.3]} s={[2.3, 1.55]} px={[460, 310]} draw={(c, W, H) => {
      c.fillStyle = "#01411c"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffffff"; c.fillRect(0, 0, W * 0.25, H);
      c.beginPath(); c.arc(W * 0.60, H * 0.5, H * 0.21, 0, 7); c.fill();
      c.fillStyle = "#01411c"; c.beginPath(); c.arc(W * 0.645, H * 0.44, H * 0.175, 0, 7); c.fill();
      c.fillStyle = "#ffffff"; star2d(c, W * 0.71, H * 0.30, H * 0.06);
    }} />
    {/* the deal document */}
    <CanvasPlane p={[-1.6, 5.0, -7.7]} s={[6.8, 3.5]} px={[816, 420]} frame="#5a3a20" draw={(c, W, H) => {
      c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#c2372f"; c.fillRect(0, 0, W, 16);
      c.fillStyle = "#1b1b2a"; c.font = "900 54px Inter, Arial"; c.textAlign = "center";
      c.fillText("ASTRONAUT COOPERATION", W / 2, 96); c.fillText("DEAL", W / 2, 162);
      c.fillStyle = "#5a5a6a"; c.font = "800 38px Inter, Arial"; c.fillText("CHINA — PAKISTAN", W / 2, 232);
      c.strokeStyle = "rgba(90,90,110,.35)"; c.lineWidth = 3;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(70, 272 + i * 34); c.lineTo(W - 70, 272 + i * 34); c.stroke(); }
      c.strokeStyle = "rgba(27,27,42,.6)"; c.lineWidth = 4; c.beginPath();
      c.moveTo(W * 0.60, H - 34); c.bezierCurveTo(W * 0.66, H - 64, W * 0.72, H - 6, W * 0.78, H - 40); c.stroke();
      c.fillStyle = "#8a5a2a"; c.font = "800 32px Inter, Arial"; c.fillText("FEBRUARY 2025", W * 0.24, H - 26);
    }} />
    <Desk p={[-2.2, 0, -3.2]} w={4.8} top="#6a4a2c" leg="#4a3420" d={1.8} />
    <Person p={[-3.9, 0, -2.0]} h={3.4} look={official1} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 42.4, 42.7), armR: [-0.6, 0.5], lookX: 0.4 }} />
    <Person p={[-0.5, 0, -2.1]} h={3.4} look={official2} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    <Stamp t={t} t0={42.65} p={[-2.2, 3.0, -6.9]} s={[3.2, 1.3]} rot={-0.12} lines={["SIGNED"]} ink="#1d7a4a" />
    {/* the two candidate pilots */}
    <Person p={[4.4, 0, -3.3]} h={3.5} look={aliUniform} f={f} pose={{ mood: "grin", arms: "down", lookX: -0.3 }} />
    <Person p={[6.8, 0, -3.5]} h={3.5} look={dawoodUniform} f={f} pose={{ mood: "grin", arms: t > 49.9 ? "up" : "down", armK: seg(t, 49.9, 50.2), lookX: -0.3 }} />
    <Plate t={t} t0={44.8} p={[4.4, 0.55, -2.45]} s={[1.7, 0.6]} lines={["ALI"]} />
    <Plate t={t} t0={44.95} p={[6.8, 0.55, -2.6]} s={[1.9, 0.6]} lines={["DAWOOD"]} />
    {t > 46.89 ? (
      <group position={[4.4, 3.85, -2.8]} rotation={[0, 0, -0.08]} scale={[lerp(2.3, 1, ticketK), lerp(2.3, 1, ticketK), 1]}>
        <CanvasPlane p={[0, 0, 0]} s={[2.7, 1.35]} px={[540, 270]} draw={(c, W, H) => {
          c.fillStyle = "#f2c230"; c.fillRect(0, 0, W, H);
          c.strokeStyle = "#4a3200"; c.lineWidth = 6; c.setLineDash([16, 10]); c.strokeRect(14, 14, W - 28, H - 28); c.setLineDash([]);
          c.fillStyle = "#4a3200"; c.textAlign = "center"; c.textBaseline = "middle";
          c.font = "900 62px Inter, Arial"; c.fillText("GOLDEN TICKET", W / 2, H * 0.38);
          c.font = "800 40px Inter, Arial"; c.fillText("SHENZHOU-24", W / 2, H * 0.70);
        }} />
      </group>
    ) : null}
    <Plate t={t} t0={49.95} p={[6.8, 3.6, -2.9]} s={[2.1, 0.85]} lines={["BACKUP"]} bg="#274b73" fg="#ffffff" border="#8ae8ff" />
    <Plant p={[-8.8, 0, -4.6]} s={1.3} /><Lamp p={[10.6, 0, -4.4]} h={3.4} color="#ffe8c0" />
    <Dust t={t} area={[8, 5, 6]} color="rgba(255,235,200,.85)" />
  </>);
};

/* =================== S8 50.74 – 59.55  "And here is the twist: a Pakistani had touched space before..." — a hop is not an orbit =================== */
const K8: Key[] = [
  { t: 50.74, pos: [0, 3.6, 13.2], look: [0, 3.4, -6], fov: 60 },
  { t: 59.55, pos: [0, 3.8, 12.0], look: [0, 3.2, -6], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const hopK = seg(t, 54.39, 55.83);
  const ringK = seg(t, 57.2, 59.3);
  const hopPos: V3 = [lerp(-9.8, -4.0, hopK), -0.4 + 4.8 * Math.sin(Math.PI * hopK), -8.2];
  const oa = -2.6 + ringK * Math.PI * 2;
  const orbPos: V3 = [7.6 * Math.cos(oa), -2.2 + 6.3 * Math.sin(oa), -9];
  const flashK = seg(t, 58.64, 58.9) * (1 - seg(t, 59.0, 59.55));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#dfe8ff" />
    <Stars p={[0, 7, -26]} s={[52, 30]} t={t} />
    <Globe p={[0, -2.2, -9]} r={5.2} rotY={t * 0.03} />
    <Plate t={t} t0={51.28} p={[-4.6, 9.3, -8]} s={[2.6, 0.9]} lines={["THE TWIST"]} bg="#3a2c10" fg="#ffd36a" border="#c9a227" />
    {/* the hop: dashed gold dots on a parabola, drawn as the capsule flies it */}
    {Array.from({ length: 14 }, (_, i) => {
      const u = i / 13;
      return u <= hopK + 0.001 ? <Ball key={i} p={[lerp(-9.8, -4.0, u), -0.4 + 4.8 * Math.sin(Math.PI * u), -8.2]} r={0.10} color="#ffd36a" ink={0} /> : null;
    })}
    {t > 54.3 ? <Capsule p={hopPos} rot={[0, 0, lerp(0.9, -0.9, hopK)]} s={0.5} /> : null}
    <Plate t={t} t0={54.3} p={[-4.7, 6.8, -8]} s={[3.0, 1.25]} lines={["2023", "SUBORBITAL HOP"]} fg="#ffd36a" border="#c9a227" />
    {/* the orbit: teal dots closing the full ring */}
    {Array.from({ length: 40 }, (_, i) => {
      const u = i / 40, a = -2.6 + u * Math.PI * 2;
      return u <= ringK + 0.001 ? <Ball key={i} p={[7.6 * Math.cos(a), -2.2 + 6.3 * Math.sin(a), -9]} r={0.10} color="#2fd4b8" ink={0} /> : null;
    })}
    {t > 57.1 ? <Capsule p={orbPos} rot={[0, 0, oa]} s={0.5} /> : null}
    <Plate t={t} t0={57.3} p={[4.7, 6.6, -8]} s={[2.6, 1.3]} lines={["2026", "ORBIT"]} fg="#7dffce" border="#2fd4b8" />
    {flashK > 0.01 ? <Glow p={orbPos} r={2.6} color="rgba(64,255,190,1)" o={0.4 * flashK} /> : null}
    <Dust t={t} area={[8, 5, 6]} color="rgba(190,215,255,.7)" />
  </>);
};

/* =================== S9 59.55 – 63.16  "Ali even comes home on a different ship: Shenzhou Twenty-Three" =================== */
const K9: Key[] = [
  { t: 59.55, pos: [0, 3.8, 14.2], look: [0, 4.0, -5], fov: 60 },
  { t: 63.16, pos: [0.6, 3.9, 12.6], look: [0.8, 4.1, -5], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const driftK = seg(t, 60.4, 62.4);
  const aliP: V3 = [lerp(-0.4, 3.1, driftK), lerp(5.7, 5.35, driftK) + Math.sin(t * 1.3) * 0.05, -5.0];
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#dfe8ff" />
    <Stars p={[0, 7, -26]} s={[52, 30]} t={t} />
    <Globe p={[8.5, -7, -16]} r={6.5} rotY={t * 0.03} />
    <Station p={[-0.6, 3.9, -6]} hatchK={1} />
    {/* Shenzhou-24, docked at the port: the ride up */}
    <Capsule p={[-6.1, 3.9, -6]} rot={[0, 0, -Math.PI / 2]} s={0.9} />
    <Plate t={t} t0={60.0} p={[-4.2, 6.9, -5.2]} s={[3.2, 0.95]} lines={["24 — THE RIDE UP"]} fg="#aab4c8" border="#565e70" />
    {/* Shenzhou-23, waiting alongside: the ride home */}
    <Capsule p={[5.6, 4.7 + Math.sin(t * 1.1) * 0.06, -6]} rot={[0, 0, Math.PI / 2]} s={0.9} />
    <Glow p={[5.6, 4.7, -6.9]} r={3.4} color="rgba(64,255,170,1)" o={0.30 * seg(t, 61.74, 62.1)} />
    <Plate t={t} t0={61.74} p={[4.6, 7.3, -5.2]} s={[3.6, 1.0]} lines={["23 — THE RIDE HOME"]} fg="#7dffce" border="#2fd46a" />
    <Astro p={aliP} look={aliSuit} f={f} h={3.1} arms="point" armK={seg(t, 60.4, 60.7)} armR={[0.8, 0.4]} />
    <Dust t={t} area={[8, 5, 6]} color="rgba(190,215,255,.7)" />
  </>);
};

/* =================== S10 63.16 – 65.89  "The Daily Toon News — the world, in toons." — sign-off, midnight-blue + emerald studio =================== */
const K10: Key[] = [
  { t: 63.16, pos: [0, 3.1, 9.8], look: [0, 2.9, -2], fov: 60 },
  { t: 65.89, pos: [0, 3.0, 8.4], look: [0, 3.0, -2], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => (
  <>
    <Cam t={t} keys={K10} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#0a2231" b="#071a26" unit={2.0} w={30} d={30} />
    <WallDoor z={-7} W={30} kind="plain" a="#0d2b3e" b="#0d2b3e" base="#051520" />
    <SideWall x={-11} kind="plain" a="#0a2434" b="#0a2434" /><SideWall x={11} kind="plain" a="#0a2434" b="#0a2434" />
    <CanvasPlane p={[0, 4.9, -6.8]} s={[9.6, 5.2]} px={[960, 520]} frame="#04121c" draw={(c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#062033"); g.addColorStop(1, "#0f5132"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = "#2fd46a"; c.beginPath(); c.arc(W * 0.5, H * 0.36, 74, 0, 7); c.fill();
      // a little white rocket glyph
      c.fillStyle = "#ffffff";
      c.beginPath(); c.ellipse(W * 0.5, H * 0.36 - 6, 17, 30, 0, 0, 7); c.fill();
      c.beginPath(); c.moveTo(W * 0.5 - 17, H * 0.36 + 8); c.lineTo(W * 0.5 - 32, H * 0.36 + 30); c.lineTo(W * 0.5 - 15, H * 0.36 + 26); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(W * 0.5 + 17, H * 0.36 + 8); c.lineTo(W * 0.5 + 32, H * 0.36 + 30); c.lineTo(W * 0.5 + 15, H * 0.36 + 26); c.closePath(); c.fill();
      c.fillStyle = "#ff7a2a"; c.beginPath(); c.moveTo(W * 0.5 - 8, H * 0.36 + 26); c.lineTo(W * 0.5, H * 0.36 + 46); c.lineTo(W * 0.5 + 8, H * 0.36 + 26); c.closePath(); c.fill();
      c.fillStyle = "#0d2b3e"; c.beginPath(); c.arc(W * 0.5, H * 0.36 - 12, 8, 0, 7); c.fill();
      c.fillStyle = "#ffffff"; c.font = "900 150px Inter, Arial"; c.textAlign = "center"; c.fillText("TDN", W * 0.5, H * 0.68);
      c.fillStyle = "#2fd46a"; c.fillRect(0, H * 0.82, W, H * 0.18);
      c.fillStyle = "#06231a"; c.font = "900 44px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W * 0.5, H * 0.945);
    }} />
    <Glow p={[0, 4.9, -6.2]} r={5.2} color="rgba(60,220,150,1)" o={0.18} />
    <Globe p={[5.4, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
    <Cyl p={[5.4, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.4, 0.06, -5.2]} rt={0.55} h={0.12} color="#0f5132" line={1} />
    <Desk p={[0, 0, -2.6]} w={5.6} top="#0f5132" leg="#06231a" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#04121c"; c.fillRect(0, 0, W, H); c.fillStyle = "#2fd46a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    {/* a tiny rocket model on the desk */}
    <group position={[-2.15, 1.04, -2.5]} scale={[0.15, 0.15, 0.15]}><Rocket x={0} z={0} base={0} /></group>
    <Box p={[1.7, 1.12, -2.5]} s={[0.85, 0.05, 1.1]} color="#f2f0ea" line={1} /><Box p={[1.8, 1.17, -2.55]} s={[0.85, 0.05, 1.1]} color="#dfe6ee" rot={[0, 0.25, 0]} line={1} />
    <Monitor p={[2.6, 1.05, -2.7]} rot={[0, -0.35, 0]} screen="#2fd46a" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#0f5132" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Frame p={[8.2, 3.4, -6.9]} s={[1.3, 1.0]} art={1} />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#071a26" b="#2fd46a" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, -0.35]} color="255,226,174" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(200,255,225,.9)" />
    <Person p={[0, 0, -3.6]} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 63.3 && t < 63.9 ? 0.08 : 0,
      arms: t > 65.25 ? "point" : "down", armK: seg(t, 65.25, 65.5), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>
);

const CUTS = [0, 4.10, 11.49, 18.16, 25.35, 32.78, 41.43, 50.74, 59.55, 63.16, 65.89];
export const TdnV8: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#2a1a3e">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#16233f">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#7ab5d9">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#141a24">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#04060f">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#20302c">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#173f3a">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#04060f">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#04060f">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#0d2b3e" trans="flash">{(c) => <S10 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.10 ? "rgba(255,170,90,.08)" : t < 11.49 ? "rgba(80,140,255,.08)" : t < 18.16 ? "rgba(255,190,80,.08)" : t < 25.35 ? "rgba(255,170,60,.07)" : t < 32.78 ? "rgba(90,140,255,.08)" : t < 41.43 ? "rgba(80,255,180,.06)" : t < 50.74 ? "rgba(255,200,120,.07)" : t < 59.55 ? "rgba(90,140,255,.08)" : t < 63.16 ? "rgba(80,255,180,.07)" : "rgba(60,220,150,.07)"} />
      {/* S1 hook chip (2.6–4.05s) */}
      {t > 2.6 && t < 4.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(6,20,40,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 44, padding: "16px 30px", borderRadius: 18 }}>
            CHINA'S FIRST-EVER FOREIGN ASTRONAUT
          </span>
        </div>
      ) : null}
      {/* S5 docking chip (30.33–32.7s) */}
      {t > 30.33 && t < 32.7 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,26,22,.88)", color: "#7dffce", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 42, padding: "16px 30px", borderRadius: 18 }}>
            FIRST FOREIGN ASTRONAUT ABOARD TIANGONG
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
