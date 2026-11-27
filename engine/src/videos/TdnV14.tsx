// TDN v14 — "The Air Force Was the Courier" — Malaysia's 3-tonne meth scandal: Home Minister
// Saifuddin Nasution Ismail told the Dewan Rakyat (26 Nov 2026) that a syndicate allegedly
// smuggled ~3 tonnes of methamphetamine (RM156M) through RMAF bases in Tawau + Labuan since
// Aug 2024 — 21 shipments (Tawau cell 7 / 1.8 t, Labuan cell 14 / 1.2 t). Police intel from
// Jan 2026, shared with RMAF Sep–Oct; raids 17 + 19 Nov 2026 (RMAF Provost Marshal first);
// 13 arrested (7 RMAF personnel — 5 officers + 2 other ranks — and 6 civilians); 96.64 kg seized;
// suspected mastermind identified but at large; 6 face Section 39B trafficking charges (Shah Alam,
// 27 Nov) — can carry the death penalty; SOSMA to be invoked. CRIME/JUSTICE framing: allegations
// as allegations, suspects NOT convicted. Sources: Malay Mail; Scoop; NST; FMT — all 26 Nov 2026.
// 9:16 720x1280 30fps, 1931 frames (64.29 s voiceover). Production only — parent handles release.
// CUTS = [0, 4.79, 16.12, 22.30, 30.25, 34.15, 43.84, 49.60, 57.18, 64.29].
// S1 hook / S2 parliament / S3 the route / S4 the runway question / S5 the tracking
// S6 the raid / S7 seized + on the run / S8 charges + doses / S9 the warning
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Grade, Sign, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shelf, Plant, Lamp, Monitor, Chair, Rug, Dust } from "../style/props";
import { Cam, Key, Stars, SpotCone, Barrier, StreetLamp } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const ministerLook: Look = { skin: "#caa27e", body: "#1d2436", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#c9a227", shoe: "#101018" };
const officerLook: Look = { skin: "#e8b98d", body: "#2e4a2e", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#ffd36a", shoe: "#101018" };
const mpLook: Look = { skin: "#caa27e", body: "#23283a", outfit: "shirt", hair: "short", hairColor: "#0c0c12", badge: "#e5233a", shoe: "#0c0c12" };
const guardLook: Look = { skin: "#f0c8a0", body: "#37455e", outfit: "shirt", hair: "short", hairColor: "#241a10", badge: "#8ae8ff", shoe: "#101018" };
const civilianLook: Look = { skin: "#fbe3c8", body: "#6a4a8c", outfit: "hoodie", hair: "short", hairColor: "#3a2a1a", badge: "#8a8a96", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV13) ---------- */
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
      c.fillStyle = color; c.textAlign = "center"; c.textBaseline = "middle";
      let fs = 118; c.font = `900 ${fs}px Inter, Arial`;
      while (c.measureText(text).width > W - 110 && fs > 30) { fs -= 6; c.font = `900 ${fs}px Inter, Arial`; }
      c.fillText(text, W / 2, H / 2 + 4);
    }} />
  </group>
);
/* cargo crate */
const Crate: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#7a5a34" }) => (
  <group position={p} scale={[s, s, s]}>
    <Box p={[0, 0.65, 0]} s={[1.3, 1.3, 1.3]} color={color} line={2} />
    <Box p={[0, 0.65, 0.67]} s={[1.34, 0.16, 0.04]} color="#5d422c" line={0} />
    <Box p={[0, 0.65, 0.67]} s={[0.16, 1.34, 0.04]} color="#5d422c" line={0} />
  </group>
);
/* military transport plane (side view, nose right) */
const Plane: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Cyl p={[0, 3.4, 0]} rt={1.15} rb={1.15} h={11.5} color="#5a6a7d" line={2} rot={[0, 0, Math.PI / 2]} />
    <Ball p={[5.9, 3.4, 0]} r={1.15} color="#66788e" />
    <Box p={[-5.2, 5.1, 0]} s={[1.7, 2.6, 0.28]} color="#48586c" line={2} />
    <Box p={[-0.4, 2.2, 0]} s={[4.6, 0.32, 3.4]} color="#48586c" line={2} />
    <Cyl p={[1.2, 1.7, 1.15]} rt={0.42} rb={0.42} h={1.5} color="#39485c" line={2} rot={[0, 0, Math.PI / 2]} />
    <Cyl p={[1.2, 1.7, -1.15]} rt={0.42} rb={0.42} h={1.5} color="#39485c" line={2} rot={[0, 0, Math.PI / 2]} />
    <Box p={[5.1, 4.15, 0]} s={[1.3, 0.5, 0.1]} color="#8ae8ff" line={1} />
    {[-3.4, -0.4, 2.6].map((x, i) => <Cyl key={i} p={[x, 0.85, 0.95]} rt={0.5} rb={0.5} h={0.3} color="#14161c" line={1} rot={[Math.PI / 2, 0, 0]} />)}
    {/* open rear ramp */}
    <Box p={[-6.6, 1.15, 0]} s={[3.0, 0.18, 2.0]} color="#39485c" line={2} rot={[0, 0, 0.42]} />
  </group>
);
/* stylised Sabah map board with the two base pins */
const SabahMap: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[1024, 635]} frame="#38b6d9" draw={(c, W, H) => {
    c.fillStyle = "#0d2036"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#27543a"; c.strokeStyle = "#0b0d1a"; c.lineWidth = 10;
    c.beginPath();
    c.moveTo(90, 330); c.lineTo(210, 180); c.lineTo(430, 130); c.lineTo(700, 105); c.lineTo(905, 190);
    c.lineTo(880, 300); c.lineTo(660, 330); c.lineTo(560, 470); c.lineTo(330, 500); c.lineTo(150, 440);
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#8ae8ff"; c.font = "900 54px Inter, Arial"; c.textAlign = "left";
    c.fillText("SABAH", 110, 90);
    c.fillStyle = "#ffd36a"; c.font = "900 40px Inter, Arial";
    c.fillText("SOUTH CHINA SEA", 420, 565);
  }} />
);
const MapPin: React.FC<{ p: V3; label: string }> = ({ p, label }) => (
  <group position={p}>
    <Ball p={[0, 0.55, 0]} r={0.34} color="#e5233a" />
    <Cyl p={[0, 0.1, 0]} rt={0.05} rb={0.16} h={0.5} color="#e5233a" line={1} />
    <Sign p={[0, 1.35, 0]} s={[2.6, 0.62]} text={label} bg="#101828" fg="#ffd36a" size={72} frame="#e5233a" />
  </group>
);

/* =================== S1 0 – 4.79  hook: night airbase =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.6, 13.8], look: [0, 3.8, -6], fov: 60 },
  { t: 4.79, pos: [0, 3.8, 11.8], look: [0, 3.8, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const bK = seg(t, 0.55, 1.05, Easing.out(Easing.back(1.7)));
  const crateK = clamp(seg(t, 1.3, 3.6));
  const gateK = seg(t, 4.0, 4.6, Easing.inOut(Easing.cubic));
  const sK = seg(t, 3.15, 3.6, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#cfe0ff" />
    <Stars p={[0, 9, -14]} s={[34, 9]} t={t} top="#050914" bottom="#101c33" />
    <Floor kind="tile" a="#232a36" b="#1b212c" unit={2} w={40} d={40} />
    {/* runway stripe */}
    <Box p={[0, 0.03, -2]} s={[26, 0.05, 0.5]} color="#ffd36a" line={0} />
    <Plane p={[1.5, 0, -8.5]} />
    <SpotCone p={[-6.5, 9.6, -6]} h={9.6} r={3.4} color="#ffe9a8" o={0.13} />
    <Glow p={[-6.5, 9.8, -6]} r={1.1} color="#ffe9a8" />
    <StreetLamp p={[-6.5, 0, -6]} h={9.4} />
    <StreetLamp p={[7.6, 0, -6.4]} h={9.4} flip />
    {/* crate sliding up the ramp */}
    <group position={[lerp(-8.6, -4.6, Easing.inOut(Easing.cubic)(crateK)), lerp(0, 1.35, Easing.inOut(Easing.cubic)(crateK)), -8.2]}>
      <Crate p={[0, 0, 0]} s={1.15} />
    </group>
    <Crate p={[-8.9, 0, -5.6]} /><Crate p={[-8.9, 1.3, -5.6]} /><Crate p={[-7.4, 0, -5.4]} />
    <Person p={[5.6, 0, -3.4]} h={3.9} look={guardLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    {/* barrier gate that lifts on "opened the gates" */}
    <group position={[3.4, 0, -1.2]} rotation={[0, 0, lerp(0, -1.15, gateK)]}>
      <Box p={[2.6, 1.55, 0]} s={[5.2, 0.28, 0.12]} color="#e5233a" line={2} />
    </group>
    <Box p={[3.4, 0.8, -1.2]} s={[0.5, 1.6, 0.5]} color="#39485c" line={2} />
    {bK > 0.02 ? <group position={[0, 9.9, -10.5]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.0} lines={[{ t: "3 TONNES OF METH", s: 100, c: "#ff6a5e" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 6.9, -9.6]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.6, 0.95]} text="THROUGH MILITARY AIRBASES" bg="#0d1524" fg="#dfe8ff" size={56} frame="#38b6d9" /></group> : null}
  </>);
};

/* =================== S2 4.79 – 16.12  parliament =================== */
const K2: Key[] = [
  { t: 4.79, pos: [0, 4.0, 13.4], look: [0, 4.2, -6], fov: 60 },
  { t: 16.12, pos: [0, 4.2, 11.2], look: [0, 4.2, -6], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const mK = seg(t, 10.35, 10.9, Easing.out(Easing.back(1.7)));
  const mapK = seg(t, 13.9, 14.45, Easing.out(Easing.back(1.4)));
  const p1 = seg(t, 14.55, 14.95, Easing.out(Easing.back(2.0)));
  const p2 = seg(t, 15.3, 15.7, Easing.out(Easing.back(2.0)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#3d2c1e" b="#322416" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="wood" a="#5d422c" b="#54391f" base="#241708" />
    {/* chamber benches */}
    {[-5.6, 5.6].map((x, i) => (
      <group key={i} position={[x, 0, -5.4]}>
        <Desk p={[0, 0, 0]} w={4.6} top="#4a3423" leg="#131a29" d={2.0} />
        <Person p={[-1.1, 0, 0.9]} h={3.3} look={civilianLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: i ? -0.3 : 0.3 }} />
        <Person p={[1.2, 0, 0.9]} h={3.3} look={guardLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: i ? -0.3 : 0.3 }} />
      </group>
    ))}
    {/* the minister at the lectern */}
    <Box p={[0, 0, -4.4]} s={[2.5, 1.5, 0.9]} color="#2a1846" line={2} />
    <Box p={[0, 1.6, -4.4]} s={[2.8, 0.18, 1.1]} color="#38235e" line={1} />
    <Person p={[0, 0, -5.6]} h={4.2} look={ministerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 6.6, 7.1), armR: [0.8, 0.6], lookX: 0 }} />
    <Sign p={[0, 11.5, -10.6]} s={[8.8, 0.9]} text="PARLIAMENT — KUALA LUMPUR" bg="#160f04" fg="#ffd36a" size={56} frame="#c9a227" />
    {mK > 0.02 ? <group position={[0, 9.3, -9.8]} scale={[mK, mK, 1]}><Board p={[0, 0, 0]} w={9.2} lines={[{ t: "RM156 MILLION", s: 104, c: "#ffd36a" }, { t: "OF METH — POLICE SAY", s: 62, c: "#f5f7fa" }]} /></group> : null}
    {mapK > 0.02 ? <group position={[0, 5.4, -9.9]} scale={[mapK, mapK, 1]}>
      <SabahMap p={[0, 0, 0]} w={8.6} />
      {p1 > 0.02 ? <group position={[2.5, 0.5, 0.15]} scale={[p1, p1, 1]}><MapPin p={[0, 0, 0]} label="TAWAU" /></group> : null}
      {p2 > 0.02 ? <group position={[-2.3, -0.7, 0.15]} scale={[p2, p2, 1]}><MapPin p={[0, 0, 0]} label="LABUAN" /></group> : null}
    </group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S3 16.12 – 22.30  the route =================== */
const K3: Key[] = [
  { t: 16.12, pos: [0, 4.0, 13.2], look: [0, 4.4, -6], fov: 60 },
  { t: 22.30, pos: [0, 4.2, 11.4], look: [0, 4.4, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const bK = seg(t, 16.5, 17.0, Easing.out(Easing.back(1.7)));
  const routeK = clamp(seg(t, 17.2, 19.2));
  const c1 = seg(t, 19.45, 19.9, Easing.out(Easing.back(1.7)));
  const c2 = seg(t, 20.8, 21.25, Easing.out(Easing.back(1.7)));
  const cell = (k: number, x: number, name: string, big: string, col: string) => k > 0.02 ? (
    <group key={name} position={[x, 2.6, -6.2]} scale={[k, k, 1]}>
      <Box p={[0, 0, 0]} s={[3.3, 3.6, 0.3]} color="#1d2739" line={2} />
      <CanvasPlane p={[0, 0, 0.2]} s={[3.1, 3.4]} px={[420, 460]} draw={(c, W, H) => {
        c.fillStyle = "#1d2739"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = "#8a93a5"; c.font = "900 44px Inter, Arial"; c.fillText(name, W / 2, H * 0.18);
        c.fillStyle = col; c.font = "900 120px Inter, Arial"; c.fillText(big, W / 2, H * 0.48);
        c.fillStyle = "#f5f7fa"; c.font = "900 52px Inter, Arial"; c.fillText("TONNES", W / 2, H * 0.72);
        c.fillStyle = "#8a93a5"; c.font = "900 38px Inter, Arial"; c.fillText("CELL", W / 2, H * 0.86);
      }} />
    </group>
  ) : null;
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1c2735" b="#16202c" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#24344a" b="#24344a" base="#0d1522" />
    <group position={[0, 7.6, -10]}>
      <SabahMap p={[0, 0, 0]} w={10.5} />
      {/* route line draws between the pins */}
      <Box p={[lerp(-2.8, 0.1, routeK), 0.15, 0.18]} s={[Math.max(0.1, 5.8 * routeK), 0.14, 0.06]} color="#e5233a" line={0} />
      <MapPin p={[-2.8, -0.85, 0.15]} label="LABUAN" />
      <MapPin p={[3.0, 0.6, 0.15]} label="TAWAU" />
    </group>
    {bK > 0.02 ? <group position={[-4.3, 10.9, -9.8]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "21 SHIPMENTS", s: 76, c: "#ff6a5e" }]} /></group> : null}
    <Sign p={[4.1, 10.9, -9.8]} s={[5.4, 0.85]} text="SINCE AUG 2024" bg="#101828" fg="#8ae8ff" size={58} frame="#38b6d9" />
    {cell(c1, -2.5, "TAWAU", "1.8", "#ffd36a")}
    {cell(c2, 2.5, "LABUAN", "1.2", "#8ae8ff")}
    <Person p={[0, 0, -2.6]} h={3.9} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 18.6, 19.1), armR: [0.8, 0.6], lookX: 0.2 }} />
  </>);
};

/* =================== S4 22.30 – 30.25  the runway question =================== */
const K4: Key[] = [
  { t: 22.30, pos: [0, 3.8, 13.4], look: [0, 4.0, -6], fov: 60 },
  { t: 30.25, pos: [0, 4.0, 11.4], look: [0, 4.0, -6], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const qK = seg(t, 22.6, 23.1, Easing.out(Easing.back(1.7)));
  const liftK = seg(t, 27.2, 28.1, Easing.inOut(Easing.cubic));
  const sK = seg(t, 28.4, 28.9, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffd9a8" />
    <Floor kind="tile" a="#2c3038" b="#23262e" unit={2} w={40} d={40} />
    <WallDoor z={-11} W={40} kind="plain" a="#3a4152" b="#3a4152" base="#181c26" />
    <Box p={[0, 0.03, -3]} s={[28, 0.05, 0.5]} color="#ffd36a" line={0} />
    {/* guard post */}
    <group position={[-5.6, 0, -6.8]}>
      <Box p={[0, 1.9, 0]} s={[2.6, 3.8, 2.2]} color="#48586c" line={2} />
      <Box p={[0, 3.2, 0.35]} s={[1.6, 1.2, 0.12]} color="#8ae8ff" line={1} />
      <Box p={[0, 4.05, 0]} s={[3.1, 0.3, 2.7]} color="#39485c" line={2} />
    </group>
    <Person p={[-5.6, 0, -4.2]} h={3.8} look={guardLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.5 }} />
    {/* the insider walks through as the barrier lifts */}
    <group position={[0, 0, -5.2]} rotation={[0, 0, 0]}>
      <group position={[1.9, 0, 0]} rotation={[0, 0, lerp(0, -1.2, liftK)]}>
        <Box p={[2.4, 1.5, 0]} s={[4.8, 0.26, 0.12]} color="#e5233a" line={2} />
      </group>
      <Box p={[1.9, 0.75, 0]} s={[0.5, 1.5, 0.5]} color="#39485c" line={2} />
    </group>
    <Person p={[3.2, 0, -4.6]} h={3.9} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 26.9, 27.3), armR: [0.8, 0.6], lookX: -0.4 }} />
    <Crate p={[5.6, 0, -6.6]} /><Crate p={[5.6, 1.3, -6.6]} />
    {qK > 0.02 ? <group position={[0, 9.9, -10.2]} scale={[qK, qK, 1]}><Board p={[0, 0, 0]} w={9.4} lines={[{ t: "HOW DOES METH CROSS", s: 76, c: "#f5f7fa" }, { t: "A GUARDED RUNWAY?", s: 76, c: "#ffd36a" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 6.6, -9.6]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.8, 0.95]} text="INSIDERS HAD DIRECT ACCESS" bg="#160d0d" fg="#ff9a8a" size={56} frame="#e5233a" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S5 30.25 – 34.15  the tracking =================== */
const K5: Key[] = [
  { t: 30.25, pos: [0, 3.8, 12.6], look: [0, 4.2, -6], fov: 60 },
  { t: 34.15, pos: [0, 4.0, 11.2], look: [0, 4.2, -6], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const bK = seg(t, 30.8, 31.3, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 32.5, 33.0, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#26304a" b="#1d2639" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#33415e" b="#33415e" base="#141b2a" />
    <group position={[0, 7.4, -10]}>
      <SabahMap p={[0, 0, 0]} w={9.6} />
      <MapPin p={[2.7, 0.55, 0.15]} label="TAWAU" />
      <MapPin p={[-2.5, -0.8, 0.15]} label="LABUAN" />
      {/* string between pins */}
      <Box p={[0.1, 0.1, 0.18]} s={[5.4, 0.09, 0.05]} color="#e5233a" line={0} rot={[0, 0, 0.22]} />
    </group>
    <Desk p={[0, 0, -5.8]} w={8.6} top="#4a3423" leg="#131a29" d={2.4} />
    <Monitor p={[-2.8, 1.32, -6.0]} screen="#27407c" />
    <Person p={[-3.4, 0, -3.2]} h={3.9} look={mpLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 31.6, 32.1), armR: [0.8, 0.6], lookX: 0.4 }} />
    <Person p={[3.4, 0, -3.2]} h={3.9} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    {/* intel folder on the desk */}
    <Box p={[0.4, 1.28, -5.4]} s={[1.7, 0.14, 1.2]} color="#d8b62a" line={2} rot={[0, 0.3, 0]} />
    {bK > 0.02 ? <group position={[0, 11.3, -10.4]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={8.8} lines={[{ t: "TRACKED FOR MONTHS", s: 88, c: "#8ae8ff" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 1.15, -4.2]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.4, 1.0]} text="INTEL SHARED WITH THE AIR FORCE" bg="#0d1524" fg="#dfe8ff" size={52} frame="#38b6d9" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S6 34.15 – 43.84  the raid =================== */
const K6: Key[] = [
  { t: 34.15, pos: [0, 3.8, 13.6], look: [0, 4.0, -6], fov: 60 },
  { t: 43.84, pos: [0, 4.0, 11.4], look: [0, 4.0, -6], fov: 57 },
];
const S6 = ({ t, f }: Ctx) => {
  const d1 = seg(t, 34.5, 34.95, Easing.out(Easing.back(1.7)));
  const d2 = seg(t, 35.25, 35.7, Easing.out(Easing.back(1.7)));
  const runK = clamp(seg(t, 35.9, 38.2));
  const aK = seg(t, 38.6, 39.15, Easing.out(Easing.back(1.7)));
  const c1 = seg(t, 40.0, 40.45, Easing.out(Easing.back(1.7)));
  const c2 = seg(t, 41.4, 41.85, Easing.out(Easing.back(1.7)));
  const c3 = seg(t, 42.7, 43.15, Easing.out(Easing.back(1.7)));
  const chip = (k: number, x: number, txt: string, col: string) => k > 0.02 ? (
    <group key={txt} position={[x, 1.3, -4.6]} scale={[k, k, 1]}><Sign p={[0, 0, 0]} s={[3.6, 0.95]} text={txt} bg="#101828" fg={col} size={54} frame="#c9a227" /></group>
  ) : null;
  const dateCard = (k: number, x: number, day: string) => k > 0.02 ? (
    <group key={day} position={[x, 8.9, -9.4]} scale={[k, k, 1]}>
      <Box p={[0, 0, 0]} s={[2.7, 3.1, 0.25]} color="#f5f7fa" line={2} />
      <CanvasPlane p={[0, 0, 0.16]} s={[2.5, 2.9]} px={[360, 420]} draw={(c, W, H) => {
        c.fillStyle = "#f5f7fa"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = "#e5233a"; c.fillRect(0, 0, W, H * 0.26);
        c.fillStyle = "#ffffff"; c.font = "900 62px Inter, Arial"; c.fillText("NOV", W / 2, H * 0.13);
        c.fillStyle = "#14161c"; c.font = "900 170px Inter, Arial"; c.fillText(day, W / 2, H * 0.6);
      }} />
    </group>
  ) : null;
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#cfe0ff" />
    <Stars p={[0, 9.5, -14]} s={[34, 8]} t={t} top="#04060f" bottom="#0d1626" />
    <Floor kind="tile" a="#1f2632" b="#181e28" unit={2} w={40} d={40} />
    <WallDoor z={-11} W={40} kind="plain" a="#2b3648" b="#2b3648" base="#0e141f" door={{ x: 0, w: 3.2, h: 5.2 }} />
    <SpotCone p={[6.8, 9.6, -5]} h={9.6} r={3.2} color="#ffe9a8" o={0.13} />
    <Glow p={[6.8, 9.8, -5]} r={1.0} color="#ffe9a8" />
    {/* military police move in */}
    <group position={[lerp(-8.6, -3.4, Easing.inOut(Easing.cubic)(runK)), 0, -3.6]}>
      <Person p={[0, 0, 0]} h={3.9} look={mpLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.8, armR: [0.8, 0.6], lookX: 0.5 }} />
    </group>
    <group position={[lerp(-9.6, -5.2, Easing.inOut(Easing.cubic)(runK)), 0, -5.4]}>
      <Person p={[0, 0, 0]} h={3.9} look={mpLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.5 }} />
    </group>
    <Person p={[4.6, 0, -3.8]} h={3.9} look={civilianLook} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.5 }} />
    <Person p={[6.1, 0, -4.6]} h={3.9} look={officerLook} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.4 }} />
    {dateCard(d1, -3.4, "17")}
    {dateCard(d2, 3.4, "19")}
    {aK > 0.02 ? <group position={[0, 9.6, -10]} scale={[aK, aK, 1]}><Board p={[0, 0, 0]} w={8.6} lines={[{ t: "13 ARRESTS", s: 108, c: "#ff6a5e" }]} /></group> : null}
    {chip(c1, -3.9, "7 AIR FORCE", "#8ae8ff")}
    {chip(c2, 0, "5 OFFICERS", "#ffd36a")}
    {chip(c3, 3.9, "+6 CIVILIANS", "#f5f7fa")}
  </>);
};

/* =================== S7 43.84 – 49.60  seized + on the run =================== */
const K7: Key[] = [
  { t: 43.84, pos: [0, 3.8, 12.8], look: [0, 4.2, -6], fov: 60 },
  { t: 49.60, pos: [0, 4.0, 11.0], look: [0, 4.2, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const stK = seg(t, 44.25, 44.7, Easing.out(Easing.back(2.2)));
  const wK = seg(t, 46.5, 47.05, Easing.out(Easing.back(1.7)));
  const rK = seg(t, 48.5, 49.0, Easing.out(Easing.back(2.2)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#262e3d" b="#1e2531" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#303c52" b="#303c52" base="#121826" />
    {/* the big scale with seized crates */}
    <group position={[-3.6, 0, -6.2]}>
      <Box p={[0, 0.35, 0]} s={[4.6, 0.7, 3.2]} color="#39485c" line={2} />
      <Crate p={[-1.0, 0.7, 0]} /><Crate p={[1.0, 0.7, 0]} /><Crate p={[0, 2.0, 0]} />
      <Cyl p={[0, 3.9, 0]} rt={0.09} rb={0.09} h={1.4} color="#9aa2ae" line={1} />
      <Ball p={[0, 4.75, 0]} r={0.62} color="#ffd36a" ink={0.03} />
    </group>
    <Person p={[-6.9, 0, -3.4]} h={3.9} look={mpLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.4 }} />
    {stK > 0.02 ? <group position={[-3.4, 7.6, -6.8]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={6.2} text="96.64 KG SEIZED" /></group> : null}
    {/* wanted board: silhouette only */}
    {wK > 0.02 ? <group position={[3.9, 5.9, -8.6]} scale={[wK, wK, 1]}>
      <Box p={[0, 0, 0]} s={[3.9, 5.2, 0.25]} color="#efe6d0" line={2} />
      <CanvasPlane p={[0, 0, 0.16]} s={[3.7, 5.0]} px={[512, 690]} draw={(c, W, H) => {
        c.fillStyle = "#efe6d0"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = "#b3122e"; c.font = "900 92px Inter, Arial"; c.fillText("WANTED", W / 2, H * 0.1);
        c.fillStyle = "#23232e";
        c.beginPath(); c.arc(W / 2, H * 0.42, 78, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(W / 2, H * 0.78, 128, 92, 0, Math.PI, Math.PI * 2); c.fill();
        c.fillStyle = "#14161c"; c.font = "900 47px Inter, Arial";
        c.fillText("SUSPECTED", W / 2, H * 0.9); c.fillText("MASTERMIND", W / 2, H * 0.965);
      }} />
    </group> : null}
    {rK > 0.02 ? <group position={[3.9, 1.6, -6.4]} scale={[rK, rK, 1]}><Stamp p={[0, 0, 0]} w={5.6} text="STILL ON THE RUN" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S8 49.60 – 57.18  charges + doses =================== */
const K8: Key[] = [
  { t: 49.60, pos: [0, 4.0, 13.2], look: [0, 4.4, -6], fov: 60 },
  { t: 57.18, pos: [0, 4.2, 11.2], look: [0, 4.4, -6], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const bK = seg(t, 50.0, 50.55, Easing.out(Easing.back(1.7)));
  const stK = seg(t, 53.0, 53.45, Easing.out(Easing.back(2.2)));
  const dK = seg(t, 55.35, 55.9, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2c2438" b="#231c2e" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#3c3252" b="#3c3252" base="#171226" />
    {/* charge sheet */}
    <group position={[-3.8, 4.6, -8.8]}>
      <Box p={[0, 0, 0]} s={[3.6, 4.8, 0.22]} color="#f5f7fa" line={2} />
      <CanvasPlane p={[0, 0, 0.15]} s={[3.4, 4.6]} px={[440, 590]} draw={(c, W, H) => {
        c.fillStyle = "#f5f7fa"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = "#14161c"; c.font = "900 56px Inter, Arial"; c.fillText("CHARGE SHEET", W / 2, H * 0.1);
        c.fillStyle = "#8a93a5";
        for (let i = 0; i < 5; i++) c.fillRect(50, H * (0.26 + i * 0.11), W - 100, 16);
        c.fillStyle = "#b3122e"; c.font = "900 50px Inter, Arial";
        c.fillText("6 SUSPECTS", W / 2, H * 0.88);
      }} />
    </group>
    <Person p={[1.8, 0, -3.2]} h={3.9} look={ministerLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    <Person p={[4.6, 0, -3.2]} h={3.9} look={mpLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    {/* field of tiny dose dots */}
    <group position={[3.9, 0.06, -6.4]}>
      {Array.from({ length: 48 }, (_, i) => {
        const x = (i % 8 - 3.5) * 0.52, z = (Math.floor(i / 8) - 2.5) * 0.52;
        return <Ball key={i} p={[x, 0, z]} r={0.13} color={i % 7 === 0 ? "#ff6a5e" : "#dfe8ff"} ink={0.03} />;
      })}
    </group>
    {bK > 0.02 ? <group position={[0, 10.1, -10]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.2} lines={[{ t: "TRAFFICKING CHARGES", s: 88, c: "#f5f7fa" }, { t: "SECTION 39B — DRUGS ACT", s: 58, c: "#ffd36a" }]} /></group> : null}
    {stK > 0.02 ? <group position={[0, 6.9, -7.2]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={6.6} text="DEATH PENALTY" /></group> : null}
    {dK > 0.02 ? <group position={[3.9, 3.4, -6.2]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[5.6, 1.0]} text="15 MILLION DOSES" bg="#160d0d" fg="#ff9a8a" size={58} frame="#e5233a" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S9 57.18 – 64.29  the warning =================== */
const K9: Key[] = [
  { t: 57.18, pos: [0, 3.8, 12.6], look: [0, 4.2, -6], fov: 60 },
  { t: 64.29, pos: [0, 4.0, 10.9], look: [0, 4.2, -6], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const wK = seg(t, 57.8, 58.35, Easing.out(Easing.back(1.7)));
  const hK = seg(t, 60.55, 61.05, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#241d33" b="#1c1628" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#372c4e" b="#372c4e" base="#150f22" />
    {/* minister at the podium, left */}
    <Box p={[-4.3, 0, -4.6]} s={[2.3, 1.5, 0.9]} color="#2a1846" line={2} />
    <Person p={[-4.3, 0, -5.7]} h={4.1} look={ministerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 58.6, 59.1), armR: [0.8, 0.6], lookX: 0.3 }} />
    {/* TDN desk, right — the hunt goes on */}
    <Desk p={[3.9, 0, -5.6]} w={5.4} top="#4a3423" leg="#131a29" d={2.4} />
    <Person p={[3.9, 0, -3.4]} h={4.0} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 61.6, 62.1), armR: [0.8, 0.6], lookX: 0 }} />
    <Shelf p={[-8.2, 0, -8.6]} /><Plant p={[7.9, 0, -6.6]} />
    {wK > 0.02 ? <group position={[0, 9.6, -9.8]} scale={[wK, wK, 1]}><Board p={[0, 0, 0]} w={9.6} lines={[{ t: "“NO RANK WILL", s: 82, c: "#f5f7fa" }, { t: "PROTECT ANYONE”", s: 82, c: "#ffd36a" }]} /></group> : null}
    {hK > 0.02 ? <group position={[3.9, 6.9, -8.8]} scale={[hK, hK, 1]}><Sign p={[0, 0, 0]} s={[5.8, 0.95]} text="THE HUNT IS STILL ON" bg="#101828" fg="#ff9a8a" size={54} frame="#e5233a" /></group> : null}
    <Sign p={[0, 11.7, -10.5]} s={[7.6, 0.85]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={62} frame="#7a4a8c" />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

const CUTS = [0, 4.79, 16.12, 22.30, 30.25, 34.15, 43.84, 49.60, 57.18, 64.29];
export const TdnV14: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#060b16">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#241708" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#0d1522">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#181c26" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#141b2a">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#04060f" trans="flash">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#121826">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#171226" trans="zoom">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#150f2a">{(c) => <S9 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.79 ? "rgba(90,130,255,.10)" : t < 16.12 ? "rgba(255,190,90,.07)" : t < 22.30 ? "rgba(120,170,255,.08)" : t < 30.25 ? "rgba(255,170,90,.07)" : t < 34.15 ? "rgba(120,150,255,.08)" : t < 43.84 ? "rgba(90,120,255,.10)" : t < 49.60 ? "rgba(255,190,90,.07)" : t < 57.18 ? "rgba(255,120,90,.07)" : "rgba(170,140,255,.07)"} />
      {/* S1 chip (3.0–4.7s): the allegation framing */}
      {t > 3.0 && t < 4.7 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            POLICE SAY: INSIDERS OPENED THE GATES
          </span>
        </div>
      ) : null}
      {/* S6 chip (36.0–38.4s): who struck first */}
      {t > 36.0 && t < 38.4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(16,18,24,.88)", color: "#8ae8ff", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            MILITARY POLICE STRUCK FIRST
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
