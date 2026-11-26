// TDN v10 — "The factory behind the oil company" — Nigeria's NDLEA dismantles an
// industrial meth lab hidden behind an oil company in Enugu (announced Wed 25 Nov 2026):
// 1,512 kg of meth worth USD 226.8M, 6.68 t of chemicals, a 63-year-old baron and five
// Mexican specialists arrested after a seven-month sting; 200+ officers raided on 11 Nov.
// 9:16 720x1280 30fps, 2070 frames (68.91 s voiceover). BACKLOG — render only, do not publish 26 Nov.
// CUTS = [0, 6.60, 12.60, 23.55, 32.90, 37.60, 41.92, 53.94, 59.85, 65.97, 68.91].
// S1 the facade / S2 NDLEA press room / S3 the haul / S4 the baron / S5 forged passports
// S6 living quarters / S7 the watch (route map) / S8 the raid / S9 the count / S10 sign-off.
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
const chiefLook: Look = { skin: "#8a5a34", body: "#1e5c38", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#ffd36a", shoe: "#101018" };
const officerLook: Look = { skin: "#f0c8a0", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#8ae8ff", shoe: "#101018" };
const officer2Look: Look = { skin: "#8a5a34", body: "#3a6ea8", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", badge: "#8ae8ff", shoe: "#101018" };
const baronLook: Look = { skin: "#8a5a34", body: "#5a1f2b", outfit: "leather", hair: "swept", hairColor: "#cfd4da", badge: "#ffd36a", shoe: "#1b1b2a" };
const hoodLook: Look = { skin: "#caa27e", body: "#2a2e35", outfit: "hoodie", hair: "none", badge: "#454b54", shoe: "#101014" };
const workerLook: Look = { skin: "#e8b184", body: "#7a8288", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#ffd36a", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV9) ---------- */
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
const Barrel: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#2456a8" }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 0.95, 0]} rt={0.62} rb={0.62} h={1.9} color={color} line={2} />
    <Cyl p={[0, 1.45, 0]} rt={0.65} rb={0.65} h={0.09} color="#1a1e26" line={0} />
    <Cyl p={[0, 0.5, 0]} rt={0.65} rb={0.65} h={0.09} color="#1a1e26" line={0} />
  </group>
);
const Sack: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#e8e4da" }) => (
  <group position={p} scale={[s, s, s]}>
    <Ball p={[0, 0.62, 0]} r={0.78} color={color} ink={0.05} s={[1, 0.88, 1]} />
    <Cyl p={[0, 1.3, 0]} rt={0.2} rb={0.3} h={0.3} color={color} line={1} />
  </group>
);
const Vat: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 1.7, 0]} rt={1.15} rb={1.15} h={3.4} color="#8a97a5" line={2} />
    <Cyl p={[0, 3.5, 0]} rt={0.9} rb={1.15} h={0.35} color="#6e7a88" line={1} />
    <Cyl p={[0.0, 4.1, 0]} rt={0.14} h={0.9} color="#5a6572" line={1} />
    <Box p={[0, 2.2, 1.16]} s={[0.7, 0.5, 0.04]} color="#3d454f" line={0} />
  </group>
);

/* =================== S1 0 – 6.60  hook: the facade =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.4, 13.2], look: [0, 3.2, -6], fov: 60 },
  { t: 6.60, pos: [0, 4.3, 11.2], look: [0, 3.9, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const stampK = seg(t, 5.99, 6.34, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe9c4" />
    <Floor kind="plank" a="#6e5133" b="#5f452b" unit={2} w={38} d={38} />
    <WallDoor z={-13} W={38} kind="plain" a="#8a6a44" b="#8a6a44" base="#54402a" />
    {/* the hidden factory, taller, behind the front building */}
    <Box p={[1.8, 3.4, -10.6]} s={[11, 6.8, 3.4]} color="#5d6672" line={2} />
    <Cyl p={[5.6, 8.6, -10.6]} rt={0.55} rb={0.7} h={3.6} color="#49525e" line={2} />
    <Box p={[1.8, 7.0, -10.6]} s={[11.4, 0.5, 3.8]} color="#39424e" line={1} />
    {/* the innocent oil-company front */}
    <Box p={[-1.6, 1.8, -6.4]} s={[8.6, 3.6, 2.6]} color="#c8b088" line={2} />
    <Box p={[-1.6, 3.75, -6.4]} s={[9.0, 0.35, 3.0]} color="#8a6a44" line={1} />
    <Sign p={[-1.6, 2.9, -5.05]} s={[6.4, 1.05]} text="OIL COMPANY" bg="#f5efe0" fg="#7a5c14" size={92} frame="#c9a227" />
    <group position={[4.9, 1.05, -5.2]} rotation={[0, 0, Math.PI / 2]}>
      <Cyl p={[0, 0, 0]} rt={0.95} rb={0.95} h={3.4} color="#b8452e" line={2} />
    </group>
    <Box p={[3.6, 0.18, -5.2]} s={[0.35, 0.36, 1.6]} color="#39424e" line={1} />
    <Box p={[6.2, 0.18, -5.2]} s={[0.35, 0.36, 1.6]} color="#39424e" line={1} />
    <Barrel p={[-6.3, 0, -4.6]} color="#b8452e" />
    <Barrel p={[-5.2, 0, -4.9]} color="#c9a227" />
    <Barrel p={[-6.9, 0, -3.4]} s={0.9} color="#2456a8" />
    <Person p={[-2.7, 0, -1.9]} h={3.9} look={analyst} f={f} pose={{ mood: "grin", arms: "point", armK: seg(t, 0.5, 0.9), armR: [0.85, 0.62], lookX: 0.55 }} />
    {stampK > 0.02 ? <group position={[1.8, 4.6, -8.6]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={5.6} text="$227 MILLION" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S2 6.60 – 12.60  NDLEA press room =================== */
const K2: Key[] = [
  { t: 6.60, pos: [0, 4.2, 12.6], look: [0, 4.0, -6], fov: 60 },
  { t: 12.60, pos: [0, 4.0, 11.0], look: [0, 4.2, -6], fov: 58 },
];
const S2 = ({ t, f }: Ctx) => {
  const signK = seg(t, 10.90, 11.3, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#eafff0" />
    <Floor kind="tile" a="#0d2b1a" b="#0a2416" unit={2} w={36} d={36} />
    <WallDoor z={-9} W={34} kind="plain" a="#123a24" b="#123a24" base="#081a10" />
    <Board p={[0, 5.6, -8.6]} w={9.6} bg="#0e2f1c" frame="#2fd46a" lines={[{ t: "NDLEA", s: 120, c: "#ffffff" }, { t: "NIGERIA DRUG ENFORCEMENT", s: 56, c: "#8ae8b0" }]} />
    <Box p={[0, 0.78, -3.6]} s={[3.0, 1.55, 1.1]} color="#14532d" line={2} />
    <Box p={[0, 1.65, -3.6]} s={[3.3, 0.18, 1.3]} color="#0e2f1c" line={1} />
    {[-1.15, 0, 1.15].map((x, i) => (
      <group key={i} position={[x, 1.6, -3.15]} rotation={[0.5, 0, 0]}>
        <Cyl p={[0, 0.35, 0]} rt={0.045} h={0.7} color="#22262e" line={0} />
        <Ball p={[0, 0.78, 0]} r={0.16} color="#39424e" ink={0.03} />
      </group>
    ))}
    <Person p={[0, 0, -3.85]} h={3.9} look={chiefLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 8.6, 9.2), armR: [0.7, 0.5], lookX: 0.25 }} />
    <Person p={[-3.55, 0, -3.4]} h={3.8} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.3 }} />
    <Person p={[3.55, 0, -3.4]} h={3.8} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    {signK > 0.02 ? <group position={[0, 1.15, -2.3]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[7.6, 1.1]} text="BIGGEST BUSTS OF THE YEAR" bg="#0e2f1c" fg="#ffd36a" size={62} frame="#ffd36a" /></group> : null}
    <Dust t={t} area={[7, 4, 5]} color="rgba(200,255,220,.85)" />
  </>);
};

/* =================== S3 12.60 – 23.55  the haul, Enugu factory floor =================== */
const K3: Key[] = [
  { t: 12.60, pos: [0, 4.3, 13.4], look: [0, 3.4, -6], fov: 60 },
  { t: 23.55, pos: [0, 3.9, 11.2], look: [0, 3.7, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const b1 = seg(t, 17.59, 18.0, Easing.out(Easing.back(1.7)));
  const b2 = seg(t, 19.89, 20.3, Easing.out(Easing.back(1.7)));
  const handA = (t * 2.2) % (Math.PI * 2);
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#17323a" b="#122830" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#1e404c" b="#1e404c" base="#0f222a" />
    <Vat p={[-4.6, 0, -8.2]} />
    <Vat p={[0.2, 0, -8.6]} s={1.1} />
    <Vat p={[5.0, 0, -8.2]} />
    {t > 21.9 ? <Glow p={[0.2, 0.7, -7.2]} r={2.6} color="rgba(255,150,60,1)" o={0.22} /> : null}
    {[-5.6, -4.2, -2.8].map((x, i) => <Barrel key={i} p={[x, 0, -4.9]} color={i === 1 ? "#7a8288" : "#2456a8"} />)}
    {[3.1, 4.5].map((x, i) => <Barrel key={i} p={[x, 0, -4.9]} color="#2456a8" />)}
    <Barrel p={[-4.9, 1.9, -4.9]} s={0.96} color="#2456a8" />
    {[0, 1, 2].map((i) => <Sack key={i} p={[-1.2 + i * 1.35, 0, -4.4]} s={1.0} />)}
    {[0, 1].map((i) => <Sack key={i} p={[-0.55 + i * 1.35, 1.2, -4.4]} s={0.95} />)}
    {/* wall clock: hands spin for "around the clock" */}
    <group position={[7.6, 6.9, -10.7]}>
      <Cyl p={[0, 0, 0]} rt={0.95} h={0.1} rot={[Math.PI / 2, 0, 0]} color="#f5f0e2" line={1} />
      <group rotation={[0, 0, -handA]}><Box p={[0, 0.32, 0.08]} s={[0.09, 0.64, 0.03]} color="#22262e" line={0} /></group>
      <group rotation={[0, 0, -handA * 0.4 - 1.2]}><Box p={[0, 0.22, 0.08]} s={[0.12, 0.44, 0.03]} color="#b8452e" line={0} /></group>
    </group>
    <Person p={[-2.2, 0, -2.9]} h={3.8} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 16.4, 16.9), armR: [0.7, 0.55], lookX: 0.45 }} />
    <Person p={[2.6, 0, -3.1]} h={3.8} look={officer2Look} f={f} pose={{ mood: "smile", arms: "hold", armR: [0.4, 0.5], armL: [-0.4, 0.5], lookX: -0.3 }} />
    <Box p={[2.6, 1.95, -2.75]} s={[0.52, 0.7, 0.06]} color="#f5f0e2" line={1} />
    {b1 > 0.02 ? <group position={[-3.4, 7.3, -9.0]} scale={[b1, b1, 1]}><Board p={[0, 0, 0]} w={5.8} lines={[{ t: "1,512 KG", s: 100, c: "#ffd36a" }, { t: "OF METH SEIZED", s: 62, c: "#f5f7fa" }]} /></group> : null}
    {b2 > 0.02 ? <group position={[3.6, 7.3, -9.0]} scale={[b2, b2, 1]}><Board p={[0, 0, 0]} w={5.8} lines={[{ t: "6.7 TONNES", s: 96, c: "#ffd36a" }, { t: "OF CHEMICALS", s: 66, c: "#f5f7fa" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S4 23.55 – 32.90  the baron =================== */
const K4: Key[] = [
  { t: 23.55, pos: [0, 4.1, 12.6], look: [0, 3.5, -5], fov: 60 },
  { t: 32.90, pos: [0, 3.8, 10.8], look: [0, 3.7, -5], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const chipK = seg(t, 29.0, 29.4, Easing.out(Easing.back(1.7)));
  const lineK = seg(t, 31.05, 31.6);
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffd9a0" />
    <Floor kind="carpet" a="#2b1220" b="#331626" unit={2} w={36} d={36} />
    <WallDoor z={-9.5} W={36} kind="plain" a="#3d1a2c" b="#3d1a2c" base="#1f0d16" />
    <Shelf p={[-6.6, 0, -7.6]} w={4.6} rows={3} seed={11} wood="#4a2436" />
    <Shelf p={[6.8, 0, -7.6]} w={4.6} rows={3} seed={31} wood="#4a2436" />
    <Desk p={[0, 0, -4.4]} w={6.2} top="#5a2436" leg="#1f0d16" d={2.0} />
    <Monitor p={[2.2, 1.05, -4.7]} rot={[0, -0.3, 0]} screen="#ffd36a" />
    <Box p={[-1.7, 1.12, -4.0]} s={[0.62, 0.14, 0.42]} color="#14161c" line={1} />
    <Person p={[0, 0, -5.3]} h={3.8} look={baronLook} f={f} pose={{ mood: "grin", arms: "point", armK: seg(t, 29.8, 30.4), armR: [0.95, 0.95], lookX: -0.2 }} />
    {chipK > 0.02 ? <group position={[0, 7.6, -8.8]} scale={[chipK, chipK, 1]}><Board p={[0, 0, 0]} w={7.4} bg="#2b1220" frame="#ffd36a" lines={[{ t: "CHUKS ENOCH EZEIKE", s: 74, c: "#f5f7fa" }, { t: "DRUG BARON — AGE 63", s: 72, c: "#ffd36a" }]} /></group> : null}
    {lineK > 0.02 ? <group position={[0, 0, 0.4]} scale={[lineK, lineK, 1]}>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((x, i) => <Person key={i} p={[x, 0, -1.9 - Math.abs(x) * 0.12]} h={3.6} look={hoodLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: i < 2 ? 0.25 : i > 2 ? -0.25 : 0 }} />)}
    </group> : null}
    <Sign p={[0, 5.9, -9.2]} s={[6.2, 1.0]} text="IMPORTED LABOUR" bg="#1f0d16" fg="#e8a2c0" size={80} frame="#8a3a5e" />
    <Plant p={[-8.2, 0, -4.2]} s={1.1} /><Lamp p={[8.4, 0, -4.2]} h={3.3} color="#ffd9a0" />
    <Dust t={t} area={[7, 4, 5]} color="rgba(255,210,230,.85)" />
  </>);
};

/* =================== S5 32.90 – 37.60  forged passports =================== */
const K5: Key[] = [
  { t: 32.90, pos: [0, 3.6, 11.6], look: [0, 2.9, -4], fov: 60 },
  { t: 37.60, pos: [0, 3.3, 10.0], look: [0, 3.1, -4], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const planeX = lerp(-11, 11, clamp(seg(t, 32.95, 34.75)));
  const stampK = seg(t, 36.41, 36.72, Easing.out(Easing.back(1.7)));
  const pp: { p: V3; c: string; r: number }[] = [
    { p: [-1.5, 1.14, -3.6], c: "#1e5c38", r: 0.22 }, { p: [-1.35, 1.26, -3.55], c: "#7a1f2b", r: -0.14 },
    { p: [0.1, 1.14, -3.7], c: "#2456a8", r: 0.4 }, { p: [0.3, 1.26, -3.6], c: "#1e5c38", r: 0.1 },
    { p: [1.7, 1.14, -3.6], c: "#7a1f2b", r: -0.3 },
  ];
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#dfeaff" />
    <Floor kind="tile" a="#101a2e" b="#0d1626" unit={2} w={36} d={36} />
    <WallDoor z={-8.5} W={34} kind="plain" a="#16233c" b="#16233c" base="#0a1120" />
    <group position={[planeX, 7.6, -7.6]}>
      <Box p={[0, 0, 0]} s={[2.6, 0.42, 0.42]} color="#dfe6ee" line={1} />
      <Box p={[0.1, 0.05, 0]} s={[1.1, 0.14, 2.0]} color="#b9c4d0" line={1} />
      <Box p={[-1.25, 0.3, 0]} s={[0.5, 0.62, 0.14]} color="#b8452e" line={1} />
      <Box p={[1.35, 0.1, 0]} s={[0.45, 0.3, 0.3]} color="#8a97a5" line={1} />
    </group>
    <Box p={[0, 0.95, -3.6]} s={[10, 0.28, 3.4]} color="#2c3646" line={2} />
    {pp.map((b, i) => (
      <group key={i} position={b.p} rotation={[0, b.r, 0]}>
        <Box p={[0, 0, 0]} s={[1.05, 0.13, 1.45]} color={b.c} line={1} />
        <Cyl p={[0, 0.09, -0.25]} rt={0.2} h={0.03} color="#ffd36a" line={0} />
      </group>
    ))}
    <Person p={[3.6, 0, -3.2]} h={3.8} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 35.6, 36.2), armR: [0.6, 0.4], lookX: -0.5 }} />
    <Person p={[-3.8, 0, -3.4]} h={3.7} look={hoodLook} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.4 }} />
    {stampK > 0.02 ? <group position={[0.1, 2.6, -2.9]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={3.9} text="FORGED" /></group> : null}
    <Sign p={[0, 5.6, -8.2]} s={[6.6, 1.0]} text="BORDER CONTROL" bg="#0a1120" fg="#8ae8ff" size={80} frame="#31517d" />
    <Dust t={t} area={[7, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S6 37.60 – 41.92  living quarters inside the plant =================== */
const K6: Key[] = [
  { t: 37.60, pos: [0, 3.8, 12.0], look: [0, 3.2, -5], fov: 60 },
  { t: 41.92, pos: [0, 3.5, 10.4], look: [0, 3.4, -5], fov: 58 },
];
const Bunk: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    {[-0.95, 0.95].map((x, i) => <Box key={i} p={[x, 1.5, 0]} s={[0.14, 3.0, 0.14]} color="#4a4238" line={1} />)}
    <Box p={[0, 0.75, 0]} s={[2.1, 0.22, 1.15]} color="#7a8a99" line={1} />
    <Box p={[0, 2.25, 0]} s={[2.1, 0.22, 1.15]} color="#7a8a99" line={1} />
    <Box p={[-0.7, 0.95, 0]} s={[0.6, 0.16, 0.8]} color="#f5f0e2" line={0} />
    <Box p={[-0.7, 2.45, 0]} s={[0.6, 0.16, 0.8]} color="#f5f0e2" line={0} />
    <Box p={[0.25, 0.92, 0]} s={[1.2, 0.12, 0.95]} color="#b8452e" line={0} />
    <Box p={[0.25, 2.42, 0]} s={[1.2, 0.12, 0.95]} color="#2456a8" line={0} />
  </group>
);
const S6 = ({ t, f }: Ctx) => {
  const climbK = clamp(seg(t, 38.6, 40.2));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#cfe0ff" />
    <Floor kind="tile" a="#1a2436" b="#151e2e" unit={2} w={36} d={36} />
    <WallDoor z={-9.5} W={36} kind="plain" a="#232f47" b="#232f47" base="#111827" />
    <Vat p={[4.9, 0, -7.6]} />
    <Vat p={[-5.4, 0, -7.9]} s={0.9} />
    <Bunk p={[-2.6, 0, -5.6]} />
    <Bunk p={[0.6, 0, -5.9]} />
    {/* barred window with the moon they never step out to see */}
    <group position={[5.2, 5.9, -9.3]}>
      <Box p={[0, 0, 0]} s={[2.3, 2.6, 0.12]} color="#0d1830" line={2} />
      <Ball p={[0.45, 0.55, 0.12]} r={0.42} color="#f5efcf" ink={0.02} />
      {[-0.6, 0, 0.6].map((x, i) => <Box key={i} p={[x, 0, 0.14]} s={[0.12, 2.6, 0.05]} color="#39424e" line={0} />)}
    </group>
    <Person p={[-1.55, climbK * 1.5, -5.2]} h={3.4} look={workerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 38.6, 39.2), armR: [0.8, 0.9], lookX: 0.2 }} />
    <Person p={[3.1, 0, -4.4]} h={3.6} look={hoodLook} f={f} pose={{ mood: "deadpan", arms: "hold", armR: [0.4, 0.5], armL: [-0.4, 0.5], lookX: -0.4 }} />
    <Barrel p={[3.1, 0, -5.6]} s={0.85} color="#7a8288" />
    <Sign p={[-3.5, 4.6, -6.8]} s={[3.4, 0.95]} text="NO EXIT" bg="#3d1420" fg="#ff8a7a" size={92} frame="#e5233a" />
    <Lamp p={[7.9, 0, -4.4]} h={3.1} color="#cfe0ff" />
    <Dust t={t} area={[7, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S7 41.92 – 53.94  the watch: route map =================== */
const K7: Key[] = [
  { t: 41.92, pos: [0, 4.4, 13.2], look: [0, 4.2, -6], fov: 60 },
  { t: 53.94, pos: [0, 4.1, 11.4], look: [0, 4.3, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const calK = seg(t, 43.57, 43.95, Easing.out(Easing.back(1.7)));
  const letK = seg(t, 50.67, 51.05, Easing.out(Easing.back(1.7)));
  const pins: { p: V3; at: number; label: string; lx: number }[] = [
    { p: [-4.6, 3.1, -8.5], at: 46.23, label: "MEXICO", lx: -4.6 },
    { p: [-2.5, 4.6, -8.5], at: 47.01, label: "COLOMBIA", lx: -2.5 },
    { p: [0.2, 5.9, -8.5], at: 47.75, label: "FRANCE", lx: 0.2 },
    { p: [2.6, 4.4, -8.5], at: 48.62, label: "BENIN", lx: 2.6 },
    { p: [4.7, 3.0, -8.5], at: 49.71, label: "NIGERIA", lx: 4.7 },
  ];
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#dfeaff" />
    <Floor kind="tile" a="#0a1220" b="#0d1626" unit={2} w={36} d={36} />
    <WallDoor z={-9} W={36} kind="plain" a="#0e1a2e" b="#0e1a2e" base="#060b16" />
    <CanvasPlane p={[0, 4.6, -8.7]} s={[12.4, 6.8]} px={[1240, 680]} frame="#31517d" draw={(c, W, H) => {
      c.fillStyle = "#0d2138"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffd36a"; c.font = "900 64px Inter, Arial"; c.textAlign = "center"; c.fillText("SMUGGLING ROUTE", W / 2, 84);
      c.strokeStyle = "rgba(127,178,232,.3)"; c.lineWidth = 2;
      for (let gx = 60; gx < W - 40; gx += 62) { c.beginPath(); c.moveTo(gx, 130); c.lineTo(gx, H - 30); c.stroke(); }
      for (let gy = 146; gy < H - 20; gy += 62) { c.beginPath(); c.moveTo(50, gy); c.lineTo(W - 50, gy); c.stroke(); }
      c.strokeStyle = "rgba(255,211,106,.75)"; c.lineWidth = 5; c.setLineDash([16, 12]); c.beginPath();
      c.moveTo(135, 400); c.quadraticCurveTo(330, 240, 495, 300); c.quadraticCurveTo(640, 350, 760, 190);
      c.quadraticCurveTo(880, 320, 1010, 290); c.quadraticCurveTo(1090, 275, 1150, 405); c.stroke(); c.setLineDash([]);
    }} />
    {pins.map((pin, i) => {
      const on = t > pin.at;
      return (
        <group key={i}>
          <Ball p={pin.p} r={on ? 0.21 : 0.13} color={on ? "#ffd36a" : "#33507a"} ink={0.02} />
          <Sign p={[pin.lx, pin.p[1] - 0.85, -8.45]} s={[2.3, 0.6]} text={pin.label} bg="#0d2136" fg={on ? "#ffd36a" : "#5a7ba6"} size={54} frame={on ? "#ffd36a" : "#33507a"} />
        </group>
      );
    })}
    {calK > 0.02 ? <group position={[-4.0, 7.9, -8.2]} scale={[calK, calK, 1]}><Board p={[0, 0, 0]} w={4.6} bg="#101828" lines={[{ t: "7 MONTHS", s: 96, c: "#ffd36a" }, { t: "OF WATCHING", s: 60, c: "#f5f7fa" }]} /></group> : null}
    {letK > 0.02 ? <group position={[4.0, 7.9, -8.2]} scale={[letK, letK, 1]}><Board p={[0, 0, 0]} w={4.6} bg="#0e2f1c" frame="#2fd46a" lines={[{ t: "LET THEM IN", s: 88, c: "#8ae8b0" }, { t: "ON PURPOSE", s: 60, c: "#f5f7fa" }]} /></group> : null}
    <Person p={[-3.4, 0, -3.0]} h={3.8} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 45.2, 45.9), armR: [0.8, 0.7], lookX: 0.4 }} />
    <Person p={[3.5, 0, -3.0]} h={3.8} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "hold", armR: [0.35, 0.55], armL: [-0.35, 0.55], lookX: -0.4 }} />
    <Box p={[3.5, 1.95, -2.65]} s={[0.52, 0.7, 0.06]} color="#f5f0e2" line={1} />
    <Dust t={t} area={[7, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S8 53.94 – 59.85  the raid, 11 November =================== */
const K8: Key[] = [
  { t: 53.94, pos: [0, 4.0, 13.0], look: [0, 3.3, -5], fov: 60 },
  { t: 59.85, pos: [0, 3.7, 11.2], look: [0, 3.5, -5], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const flash = Math.sin(t * 7) > 0;
  const boardK = seg(t, 54.70, 55.1, Easing.out(Easing.back(1.7)));
  const hitK = clamp(seg(t, 57.24, 57.6));
  const adv = lerp(-1.6, -3.4, clamp(seg(t, 55.6, 58.6)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#dfeaff" />
    <Floor kind="tile" a="#0c1220" b="#101828" unit={2} w={38} d={38} />
    <WallDoor z={-10.5} W={38} kind="plain" a="#131c2e" b="#131c2e" base="#0a0f1a" />
    {/* factory facade + door, left */}
    <Box p={[-4.4, 2.6, -8.6]} s={[6.4, 5.2, 1.6]} color="#3d454f" line={2} />
    <group position={[-5.35, 0, -7.75]} rotation={[0, -hitK * 1.85, 0]}>
      <Box p={[0.95, 1.55, 0]} s={[1.9, 3.1, 0.14]} color="#6e3b1e" line={1} />
    </group>
    <Sign p={[-4.4, 5.9, -7.9]} s={[4.6, 0.95]} text="THE PLANT" bg="#131c2e" fg="#f5f7fa" size={84} frame="#8a97a5" />
    {/* hotel facade + door, right */}
    <Box p={[4.6, 2.9, -8.6]} s={[6.0, 5.8, 1.6]} color="#4a3a5e" line={2} />
    <group position={[3.75, 0, -7.75]} rotation={[0, hitK * 1.85, 0]}>
      <Box p={[0.85, 1.55, 0]} s={[1.7, 3.1, 0.14]} color="#2e2440" line={1} />
    </group>
    <Sign p={[4.6, 6.2, -7.9]} s={[4.2, 0.95]} text="HOTEL" bg="#241a33" fg="#ffd36a" size={92} frame="#ffd36a" />
    {/* vans with light bars */}
    {[-1.8, 2.2].map((x, i) => (
      <group key={i} position={[x, 0, -4.9]}>
        <Box p={[0, 1.35, 0]} s={[3.4, 2.3, 1.9]} color="#28418c" line={2} />
        <Box p={[0, 1.45, 0.98]} s={[2.6, 1.0, 0.03]} color="#f5f7fa" line={0} />
        <Box p={[-0.8, 2.65, 0]} s={[0.6, 0.26, 1.0]} color={flash ? "#ff4040" : "#7a2020"} line={1} />
        <Box p={[0.8, 2.65, 0]} s={[0.6, 0.26, 1.0]} color={flash ? "#2a3a6e" : "#3f7bff"} line={1} />
        <Ball p={[-1.1, 0.42, 0.9]} r={0.42} color="#14161c" ink={0.04} />
        <Ball p={[1.1, 0.42, 0.9]} r={0.42} color="#14161c" ink={0.04} />
      </group>
    ))}
    <Glow p={[-2.6, 3.4, -4.2]} r={2.4} color="rgba(255,70,70,1)" o={flash ? 0.28 : 0.05} />
    <Glow p={[3.0, 3.4, -4.2]} r={2.4} color="rgba(80,130,255,1)" o={flash ? 0.05 : 0.28} />
    {[-5.2, -3.4, 3.9, 5.6].map((x, i) => <Person key={i} p={[x, 0, adv - (i % 2) * 0.5]} h={3.7} look={i % 2 ? officer2Look : officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 55.8, 56.4), armR: [0.8, 0.5], lookX: i < 2 ? 0.3 : -0.3 }} />)}
    {boardK > 0.02 ? <group position={[0, 8.3, -9.6]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={6.6} lines={[{ t: "NOVEMBER 11", s: 100, c: "#ffd36a" }, { t: "TWO RAIDS, ONE MOMENT", s: 56, c: "#f5f7fa" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S9 59.85 – 65.97  the count =================== */
const K9: Key[] = [
  { t: 59.85, pos: [0, 4.1, 12.8], look: [0, 3.4, -5], fov: 60 },
  { t: 65.97, pos: [0, 3.8, 11.0], look: [0, 3.6, -5], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const b1 = seg(t, 60.31, 60.72, Easing.out(Easing.back(1.7)));
  const lockK = seg(t, 62.38, 62.74, Easing.out(Easing.back(1.7)));
  const b2 = seg(t, 63.08, 63.5, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffd9a0" />
    <Floor kind="tile" a="#2e2a33" b="#38333d" unit={2} w={38} d={38} />
    <WallDoor z={-10.5} W={38} kind="plain" a="#3a3542" b="#3a3542" base="#201c26" />
    {/* the factory door, chained shut */}
    <Box p={[4.25, 2.2, -8.8]} s={[4.6, 4.4, 1.2]} color="#49525e" line={2} />
    <Box p={[4.25, 1.55, -8.15]} s={[2.0, 3.1, 0.14]} color="#5d4a33" line={1} />
    {[-0.7, -0.25, 0.2, 0.65].map((dx, i) => <Box key={i} p={[4.25 + dx, 1.9 - i * 0.22, -8.02]} s={[0.34, 0.2, 0.06]} color="#c8ccd2" line={0} rot={[0, 0, 0.5]} />)}
    {lockK > 0.02 ? <group position={[4.25, 1.55, -7.9]} scale={[lockK * 1.35, lockK * 1.35, 1]}>
      <Box p={[0, -0.25, 0]} s={[0.85, 0.95, 0.22]} color="#c9a227" line={2} />
      <Cyl p={[0, 0.42, 0]} rt={0.3} h={0.5} color="#8a97a5" line={1} />
    </group> : null}
    {[-4.9, -3.35, -1.8, -0.25, 1.3, 2.85].map((x, i) => <Person key={i} p={[x, 0, -3.4 - (i % 2) * 0.4]} h={3.6} look={hoodLook} f={f} pose={{ mood: "worry", arms: "up", lookX: i < 3 ? 0.25 : -0.25 }} />)}
    <Person p={[0.4, 0, -1.7]} h={3.9} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 60.2, 60.7), armR: [0.85, 0.6], lookX: 0.4 }} />
    {b1 > 0.02 ? <group position={[-3.1, 7.2, -8.4]} scale={[b1, b1, 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "6 ARRESTED", s: 100, c: "#ffd36a" }]} /></group> : null}
    {b2 > 0.02 ? <group position={[3.4, 7.2, -8.4]} scale={[b2, b2, 1]}><Board p={[0, 0, 0]} w={6.4} frame="#8a3a2e" lines={[{ t: "4TH LAB SHUT DOWN", s: 82, c: "#ff9a8a" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S10 65.97 – 68.91  sign-off, navy-amber livery =================== */
const K10: Key[] = [
  { t: 65.97, pos: [0, 3.5, 12.2], look: [0, 3.3, -5], fov: 60 },
  { t: 68.91, pos: [0, 3.3, 10.2], look: [0, 3.4, -5], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K10} />
  <Lights warm="#ffe2ae" />
  <Floor kind="carpet" a="#0a1626" b="#0d1e33" unit={2} w={32} d={32} />
  <WallDoor z={-7.5} W={32} kind="plain" a="#0c1a2e" b="#0c1a2e" base="#050d18" />
  <SideWall x={-11} kind="plain" a="#0a1626" b="#0a1626" /><SideWall x={11} kind="plain" a="#0a1626" b="#0a1626" />
  <CanvasPlane p={[0, 5.3, -7.2]} s={[10.4, 5.3]} px={[1040, 530]} frame="#f0a832" draw={(c, W, H) => {
    c.fillStyle = "#0e2238"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#f0a832"; c.beginPath(); c.arc(W / 2, H * 0.24, 56, 0, 7); c.fill();
    c.fillStyle = "#0c1a2e"; c.font = "900 72px Inter, Arial"; c.fillText("T", W / 2, H * 0.24 + 2);
    c.fillStyle = "#ffffff"; c.font = "900 140px Inter, Arial"; c.fillText("TDN", W / 2, H * 0.55);
    c.fillStyle = "#ffd36a"; c.font = "900 46px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W / 2, H * 0.76);
    c.fillStyle = "#8ae8ff"; c.font = "700 30px Inter, Arial"; c.fillText("DRUG BUST SPECIAL", W / 2, H * 0.9);
  }} />
  <Glow p={[0, 5.3, -6.6]} r={5.4} color="rgba(255,190,90,1)" o={0.15} />
  <Globe p={[5.6, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
  <Cyl p={[5.6, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.6, 0.06, -5.2]} rt={0.55} h={0.12} color="#7a4d16" line={1} />
  <Desk p={[0, 0, -2.6]} w={5.6} top="#7a4d16" leg="#050d18" d={1.9} />
  <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#050d18"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
  <Barrel p={[2.3, 1.05, -2.5]} s={0.42} color="#2456a8" />
  <Monitor p={[3.1, 1.05, -2.8]} rot={[0, -0.35, 0]} screen="#f0a832" />
  <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#7a4d16" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
  <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#0a1626" b="#f0a832" />
  <Dust t={t} area={[6, 6, 4]} color="rgba(200,230,255,.9)" />
  <Person p={[0, 0, -3.6]} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 66.2 && t < 66.8 ? 0.08 : 0,
    arms: t > 68.3 ? "point" : "down", armK: seg(t, 68.3, 68.6), armR: [0.35, 0.55], lookX: 0.1 }} />
</>);

const CUTS = [0, 6.60, 12.60, 23.55, 32.90, 37.60, 41.92, 53.94, 59.85, 65.97, 68.91];
export const TdnV10: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#8a6a44">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#0d2b1a" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#17323a">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#2b1220" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#101a2e">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#1a2436">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#0a1220" trans="zoom">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#0d1524">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#2e2a33" trans="flash">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#0c1a2e">{(c) => <S10 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 6.60 ? "rgba(255,190,90,.07)" : t < 12.60 ? "rgba(90,255,160,.07)" : t < 23.55 ? "rgba(90,200,255,.07)" : t < 32.90 ? "rgba(255,120,190,.06)" : t < 37.60 ? "rgba(90,140,255,.08)" : t < 41.92 ? "rgba(120,160,255,.07)" : t < 53.94 ? "rgba(90,140,255,.08)" : t < 59.85 ? "rgba(90,140,255,.08)" : t < 65.97 ? "rgba(255,170,90,.08)" : "rgba(255,190,90,.07)"} />
      {/* S3 chip (12.7–16.4s) */}
      {t > 12.7 && t < 16.4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,30,38,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            ENUGU, NIGERIA
          </span>
        </div>
      ) : null}
      {/* S8 chip (56.7–59.7s) */}
      {t > 56.7 && t < 59.7 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(16,10,40,.88)", color: "#ff9a8a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            200+ OFFICERS
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
