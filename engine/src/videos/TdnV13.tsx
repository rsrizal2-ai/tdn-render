// TDN v13 — "A Former President on Trial" — ICC trial of Rodrigo Duterte opens Mon 30 Nov 2026,
// The Hague (Trial Chamber III, Presiding Judge Joanna Korner). PREVIEW / justice-process framing:
// allegations only — 3 counts of crimes against humanity (murder + attempted murder), Rome Statute
// Art 7(1)(a), alleged 1 Nov 2011–16 Mar 2019; 49 incidents / 78 victims; surrendered 12 Mar 2025;
// charges confirmed 23 Apr 2026; fit to stand trial 8 Oct 2026; plea taken at the opening; ~100
// prosecution witnesses; 500+ victims participating; streamed with 30-min delay; max 30 yrs / life.
// Sources: ICC Q&A + Case Information Sheet (icc-cpi.int); Reuters 27 May 2026; Republika News 26 Nov 2026.
// 9:16 720x1280 30fps, 2122 frames (70.65 s voiceover). Production only — parent handles release.
// CUTS = [0, 5.86, 14.06, 27.50, 39.51, 47.27, 54.11, 59.79, 63.96, 70.65].
// S1 the hook / S2 the accused / S3 the charges / S4 Davao to the presidency / S5 the defence
// S6 Monday: the plea / S7 the world watches / S8 the stakes / S9 justice or politics?
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
const duterteLook: Look = { skin: "#e8b98d", body: "#26262e", outfit: "shirt", hair: "short", hairColor: "#c9c9d4", badge: "#8a8a96", shoe: "#101018" };
const judgeLook: Look = { skin: "#fbe3c8", body: "#17171f", outfit: "shirt", hair: "bob", hairColor: "#a8a8b4", badge: "#c9a227", shoe: "#101018" };
const judge2Look: Look = { skin: "#caa27e", body: "#17171f", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#c9a227", shoe: "#101018" };
const counselLook: Look = { skin: "#f0c8a0", body: "#2b3550", outfit: "shirt", hair: "short", hairColor: "#3a3a44", badge: "#8ae8ff", shoe: "#101018" };
const lawyerLook: Look = { skin: "#fbe3c8", body: "#4a4a55", outfit: "shirt", hair: "short", hairColor: "#6a6a74", badge: "#ffd36a", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV12) ---------- */
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
/* courtroom columns */
const Columns: React.FC<{ z?: number }> = ({ z = -10.6 }) => (
  <>{[-6.4, -3.2, 3.2, 6.4].map((x, i) => (
    <group key={i} position={[x, 0, z]}>
      <Cyl p={[0, 5.2, 0]} rt={0.55} rb={0.62} h={10.4} color="#d8d2c2" line={1} />
      <Box p={[0, 10.6, 0]} s={[1.7, 0.4, 1.7]} color="#c9c2b0" line={1} />
      <Box p={[0, 0.2, 0]} s={[1.7, 0.4, 1.7]} color="#c9c2b0" line={1} />
    </group>
  ))}</>
);
/* judges' bench */
const Bench: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Box p={[0, 1.5, 0]} s={[10.6, 3.0, 1.1]} color="#4a3423" line={2} />
    <Box p={[0, 3.15, 0]} s={[11.0, 0.3, 1.4]} color="#5d422c" line={2} />
    <Box p={[0, 0.9, 0.62]} s={[9.6, 0.14, 0.1]} color="#c9a227" line={0} />
  </group>
);
/* detention-cell bars sliding across the front */
const Bars: React.FC<{ k: number }> = ({ k }) => (
  <group position={[lerp(-13, 0, k), 0, 2.6]}>
    {[-3.4, -2.45, -1.5, -0.55, 0.4, 1.35, 2.3, 3.25].map((x, i) => <Box key={i} p={[x, 5.4, 0]} s={[0.22, 10.8, 0.22]} color="#9aa2ae" line={1} />)}
    <Box p={[0, 9.6, 0]} s={[7.6, 0.3, 0.3]} color="#7d8593" line={1} />
    <Box p={[0, 1.1, 0]} s={[7.6, 0.3, 0.3]} color="#7d8593" line={1} />
  </group>
);

/* =================== S1 0 – 5.86  hook: a former president walks in =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.6, 13.6], look: [0, 4.2, -6], fov: 60 },
  { t: 5.86, pos: [0, 3.9, 11.4], look: [0, 4.4, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const walkK = clamp(seg(t, 0.6, 4.4));
  const dx = lerp(-6.8, -1.6, Easing.inOut(Easing.cubic)(walkK));
  const boardK = seg(t, 2.6, 3.05, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2a3040" b="#202635" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#39445c" b="#39445c" base="#171e2e" />
    <Columns />
    <Bench p={[0, 0, -8.2]} />
    <Person p={[0, 3.3, -8.0]} h={3.4} look={judgeLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0 }} />
    {/* the dock */}
    <Box p={[3.4, 0.75, -3.4]} s={[4.6, 1.5, 0.25]} color="#4a3423" line={2} />
    <Box p={[3.4, 1.6, -3.4]} s={[4.9, 0.18, 0.4]} color="#5d422c" line={1} />
    <group position={[dx, 0, -2.6]}>
      <Person p={[0, 0, 0]} h={3.9} look={duterteLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.3 }} />
    </group>
    <Person p={[-4.2, 0, -2.2]} h={3.9} look={counselLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.4 }} />
    {boardK > 0.02 ? <group position={[0, 9.4, -9.8]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={8.2} lines={[{ t: "THE HAGUE — MONDAY", s: 88, c: "#ffd36a" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S2 5.86 – 14.06  the accused =================== */
const K2: Key[] = [
  { t: 5.86, pos: [0, 3.8, 12.6], look: [0, 4.2, -6], fov: 60 },
  { t: 14.06, pos: [0, 4.0, 10.8], look: [0, 4.2, -6], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const nameK = seg(t, 6.3, 6.8, Easing.out(Easing.back(1.7)));
  const barsK = seg(t, 10.6, 12.4, Easing.inOut(Easing.cubic));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#232936" b="#1b2029" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#2e3648" b="#2e3648" base="#12161f" />
    <Person p={[0, 0, -3.2]} h={4.6} look={duterteLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0 }} />
    {nameK > 0.02 ? <group position={[0, 8.6, -8.8]} scale={[nameK, nameK, 1]}><Board p={[0, 0, 0]} w={8.6} lines={[{ t: "RODRIGO DUTERTE", s: 100, c: "#f5f7fa" }, { t: "AGE 81 — EX-PRESIDENT", s: 72, c: "#ffd36a" }]} /></group> : null}
    <Bars k={barsK} />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S3 14.06 – 27.50  the charges =================== */
const K3: Key[] = [
  { t: 14.06, pos: [0, 4.2, 13.8], look: [0, 4.6, -6], fov: 60 },
  { t: 27.50, pos: [0, 4.4, 11.6], look: [0, 4.6, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const bK = seg(t, 15.2, 15.7, Easing.out(Easing.back(1.7)));
  const c1 = seg(t, 16.9, 17.35, Easing.out(Easing.back(1.7)));
  const c2 = seg(t, 19.0, 19.45, Easing.out(Easing.back(1.7)));
  const c3 = seg(t, 20.6, 21.05, Easing.out(Easing.back(1.7)));
  const dK = seg(t, 24.6, 25.1, Easing.out(Easing.back(1.7)));
  const card = (k: number, x: number, label: string, sub: string, col: string) => k > 0.02 ? (
    <group key={label} position={[x, 3.4, -6.4]} scale={[k, k, 1]}>
      <Box p={[0, 0, 0]} s={[3.1, 3.9, 0.3]} color="#1d2739" line={2} />
      <CanvasPlane p={[0, 0, 0.2]} s={[2.9, 3.7]} px={[420, 536]} draw={(c, W, H) => {
        c.fillStyle = "#1d2739"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = col; c.font = "900 150px Inter, Arial"; c.fillText(label, W / 2, H * 0.30);
        c.fillStyle = "#f5f7fa"; c.font = "900 54px Inter, Arial"; c.fillText(sub, W / 2, H * 0.62);
        c.fillStyle = "#8a93a5"; c.font = "900 40px Inter, Arial"; c.fillText("COUNT", W / 2, H * 0.78);
      }} />
    </group>
  ) : null;
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#26304a" b="#1d2639" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#33415e" b="#33415e" base="#141b2a" />
    <Columns />
    <Sign p={[0, 10.6, -10.2]} s={[9.4, 1.0]} text="INTERNATIONAL CRIMINAL COURT" bg="#0d1524" fg="#dfe8ff" size={54} frame="#c9a227" />
    {bK > 0.02 ? <group position={[0, 8.5, -9.6]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={8.8} lines={[{ t: "3 COUNTS", s: 100, c: "#ff6a5e" }, { t: "CRIMES AGAINST", s: 64, c: "#f5f7fa" }, { t: "HUMANITY", s: 64, c: "#f5f7fa" }]} /></group> : null}
    {card(c1, -3.6, "1", "MURDER", "#ff6a5e")}
    {card(c2, 0, "2", "MURDER", "#ff6a5e")}
    {card(c3, 3.6, "3", "MURDER +", "#ffb37a")}
    {dK > 0.02 ? <group position={[0, 0.9, -4.2]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="2011 → 2019 — THE “WAR ON DRUGS”" bg="#160d0d" fg="#ffd36a" size={52} frame="#e5233a" /></group> : null}
  </>);
};

/* =================== S4 27.50 – 39.51  Davao to the presidency =================== */
const K4: Key[] = [
  { t: 27.50, pos: [0, 4.0, 13.2], look: [0, 4.2, -6], fov: 60 },
  { t: 39.51, pos: [0, 4.2, 11.2], look: [0, 4.2, -6], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const tlK = clamp(seg(t, 28.0, 29.2));
  const m1 = seg(t, 29.2, 29.7, Easing.out(Easing.back(1.7)));
  const m2 = seg(t, 32.0, 32.5, Easing.out(Easing.back(1.7)));
  const m3 = seg(t, 34.4, 34.9, Easing.out(Easing.back(1.7)));
  const vK = seg(t, 37.6, 38.15, Easing.out(Easing.back(1.7)));
  const marker = (k: number, x: number, lines: { t: string; s?: number; c?: string }[]) => k > 0.02 ? (
    <group key={lines[0].t} position={[x, 7.6, -8.6]} scale={[k, k, 1]}><Board p={[0, 0, 0]} w={4.2} lines={lines} /></group>
  ) : null;
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2c3242" b="#222834" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#384154" b="#384154" base="#161c28" />
    {/* timeline rail */}
    <group position={[0, 4.4, -8.4]}>
      <Box p={[0, 0, 0]} s={[lerp(0.2, 13.4, tlK), 0.22, 0.22]} color="#c9a227" line={1} />
      {[-6.2, 0, 6.2].map((x, i) => <Ball key={i} p={[x, 0, 0]} r={0.42} color="#ffd36a" ink={0.03} />)}
    </group>
    {marker(m1, -4.4, [{ t: "DAVAO CITY", s: 74, c: "#f5f7fa" }, { t: "MAYOR YEARS", s: 58, c: "#ffd36a" }])}
    {marker(m2, 0.1, [{ t: "“HIGH-VALUE", s: 64, c: "#f5f7fa" }, { t: "TARGETS”", s: 64, c: "#f5f7fa" }])}
    {marker(m3, 4.4, [{ t: "VILLAGE", s: 70, c: "#f5f7fa" }, { t: "CLEARANCE OPS", s: 56, c: "#ffd36a" }])}
    <Person p={[-3.4, 0, -3.0]} h={3.9} look={duterteLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.35 }} />
    <Person p={[3.6, 0, -3.0]} h={3.9} look={counselLook} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 36.8, 37.3), armR: [0.8, 0.6], lookX: -0.4 }} />
    {vK > 0.02 ? <group position={[0, 1.15, -4.6]} scale={[vK, vK, 1]}><Sign p={[0, 0, 0]} s={[9.2, 1.05]} text="78 VICTIMS NAMED IN THE CHARGES" bg="#101828" fg="#ff9a8a" size={54} frame="#e5233a" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S5 39.51 – 47.27  the defence =================== */
const K5: Key[] = [
  { t: 39.51, pos: [0, 3.8, 12.4], look: [0, 4.2, -6], fov: 60 },
  { t: 47.27, pos: [0, 4.0, 10.9], look: [0, 4.2, -6], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const sK = seg(t, 40.6, 41.1, Easing.out(Easing.back(1.7)));
  const stK = seg(t, 45.9, 46.35, Easing.out(Easing.back(2.2)));
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2a2f3d" b="#20242f" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#363e50" b="#363e50" base="#141922" />
    <Desk p={[0, 0, -5.6]} w={9.2} top="#4a3423" leg="#131a29" d={2.6} />
    <Person p={[-2.6, 0, -3.4]} h={3.9} look={lawyerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 41.2, 41.7), armR: [0.8, 0.6], lookX: 0.3 }} />
    <Person p={[2.8, 0, -3.4]} h={3.9} look={duterteLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    {sK > 0.02 ? <group position={[0, 9.2, -9.4]} scale={[sK, sK, 1]}><Board p={[0, 0, 0]} w={9.0} lines={[{ t: "“NOT A CRIMES-", s: 70, c: "#f5f7fa" }, { t: "AGAINST-HUMANITY", s: 70, c: "#f5f7fa" }, { t: "CASE” — DEFENCE", s: 70, c: "#ffd36a" }]} /></group> : null}
    {stK > 0.02 ? <group position={[0, 5.6, -6.2]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={6.4} text="PRESUMED INNOCENT" color="#2fd46a" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S6 47.27 – 54.11  Monday: the plea =================== */
const K6: Key[] = [
  { t: 47.27, pos: [0, 3.8, 12.8], look: [0, 4.4, -6], fov: 60 },
  { t: 54.11, pos: [0, 4.0, 11.0], look: [0, 4.4, -6], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const pK = seg(t, 48.2, 48.7, Easing.out(Easing.back(1.7)));
  const wK = seg(t, 51.6, 52.1, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2a3040" b="#202635" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#39445c" b="#39445c" base="#171e2e" />
    <Columns />
    <Bench p={[0, 0, -8.2]} />
    <Person p={[-3.1, 3.3, -8.0]} h={3.4} look={judge2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.15 }} />
    <Person p={[0, 3.3, -8.0]} h={3.4} look={judgeLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0 }} />
    <Person p={[3.1, 3.3, -8.0]} h={3.4} look={judge2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.15 }} />
    <Person p={[0, 0, -2.8]} h={3.9} look={duterteLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0 }} />
    {pK > 0.02 ? <group position={[0, 9.6, -9.8]} scale={[pK, pK, 1]}><Board p={[0, 0, 0]} w={8.6} lines={[{ t: "MONDAY: THE PLEA", s: 98, c: "#ffd36a" }]} /></group> : null}
    {wK > 0.02 ? <group position={[0, 1.1, -4.4]} scale={[wK, wK, 1]}><Sign p={[0, 0, 0]} s={[9.4, 1.05]} text="THEN PROSECUTORS OPEN — ±100 WITNESSES" bg="#0d1524" fg="#dfe8ff" size={50} frame="#c9a227" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S7 54.11 – 59.79  the world watches =================== */
const K7: Key[] = [
  { t: 54.11, pos: [0, 4.0, 12.6], look: [0, 4.4, -6], fov: 60 },
  { t: 59.79, pos: [0, 4.2, 11.0], look: [0, 4.4, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const vK = seg(t, 54.6, 55.1, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 57.2, 57.7, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#232b3d" b="#1b2230" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#2f3a52" b="#2f3a52" base="#121826" />
    <Globe p={[4.9, 6.4, -8.6]} r={2.1} rotY={t * 0.12} />
    <Desk p={[-3.6, 0, -6.4]} w={4.6} top="#4a3423" leg="#131a29" d={2.2} />
    <Monitor p={[-3.6, 1.32, -6.6]} screen="#27407c" />
    <Person p={[-3.8, 0, -3.0]} h={3.9} look={counselLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 56.8, 57.3), armR: [0.8, 0.6], lookX: 0.4 }} />
    <Person p={[3.4, 0, -3.0]} h={3.8} look={analyst} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.35 }} />
    {vK > 0.02 ? <group position={[0, 9.3, -9.4]} scale={[vK, vK, 1]}><Board p={[0, 0, 0]} w={8.8} lines={[{ t: "500+ VICTIMS", s: 104, c: "#ffd36a" }, { t: "TAKING PART", s: 80, c: "#f5f7fa" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 1.1, -4.4]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[9.4, 1.05]} text="STREAMED LIVE — 30-MIN DELAY" bg="#0d1524" fg="#8ae8ff" size={56} frame="#38b6d9" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S8 59.79 – 63.96  the stakes =================== */
const K8: Key[] = [
  { t: 59.79, pos: [0, 4.0, 12.4], look: [0, 4.4, -6], fov: 60 },
  { t: 63.96, pos: [0, 4.2, 10.6], look: [0, 4.4, -6], fov: 57 },
];
const S8 = ({ t, f }: Ctx) => {
  const bK = seg(t, 60.4, 60.95, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#262b38" b="#1e232e" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#313a4e" b="#313a4e" base="#131926" />
    <Columns />
    {/* scales of justice */}
    <group position={[0, 0, -7.6]}>
      <Cyl p={[0, 3.4, 0]} rt={0.16} rb={0.2} h={6.8} color="#c9a227" line={1} />
      <Box p={[0, 6.9, 0]} s={[6.4, 0.22, 0.22]} color="#c9a227" line={1} />
      {[-3.0, 3.0].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Cyl p={[0, 5.9, 0]} rt={0.05} rb={0.05} h={1.9} color="#c9a227" line={0} />
          <Cyl p={[0, 4.85, 0]} rt={1.05} rb={0.55} h={0.35} color="#d8b62a" line={1} />
        </group>
      ))}
      <Box p={[0, 0.18, 0]} s={[2.2, 0.36, 1.2]} color="#8a6d1f" line={1} />
    </group>
    <Person p={[-3.1, 0, -2.6]} h={3.9} look={duterteLook} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.4 }} />
    {bK > 0.02 ? <group position={[0, 9.5, -9.6]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.0} lines={[{ t: "UP TO 30 YEARS", s: 100, c: "#ff6a5e" }, { t: "— OR LIFE —", s: 84, c: "#ffd36a" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S9 63.96 – 70.65  justice, or politics? =================== */
const K9: Key[] = [
  { t: 63.96, pos: [0, 3.8, 12.2], look: [0, 4.2, -6], fov: 60 },
  { t: 70.65, pos: [0, 4.0, 10.8], look: [0, 4.2, -6], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const qK = seg(t, 64.6, 65.15, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#241d33" b="#1c1628" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#372c4e" b="#372c4e" base="#150f22" />
    <Desk p={[0, 0, -5.6]} w={9.2} top="#4a3423" leg="#131a29" d={2.6} />
    <Person p={[0, 0, -3.2]} h={4.1} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 66.4, 66.9), armR: [0.8, 0.6], lookX: 0 }} />
    <Shelf p={[-7.6, 0, -8.6]} /><Shelf p={[7.6, 0, -8.6]} />
    <Plant p={[-6.2, 0, -6.4]} /><Plant p={[6.2, 0, -6.4]} />
    {qK > 0.02 ? <group position={[0, 9.3, -9.4]} scale={[qK, qK, 1]}><Board p={[0, 0, 0]} w={9.2} lines={[{ t: "JUSTICE AT LAST —", s: 84, c: "#f5f7fa" }, { t: "OR POLITICS?", s: 96, c: "#ffd36a" }]} /></group> : null}
    <Sign p={[0, 11.7, -10.5]} s={[7.6, 0.85]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={62} frame="#7a4a8c" />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

const CUTS = [0, 5.86, 14.06, 27.50, 39.51, 47.27, 54.11, 59.79, 63.96, 70.65];
export const TdnV13: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0c1424">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#171d29" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#131c30">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#1a2130" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#181d28">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#0c1424" trans="flash">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#141b2a">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#161c28" trans="zoom">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#150f2a">{(c) => <S9 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 14.06 ? "rgba(120,150,255,.08)" : t < 27.50 ? "rgba(140,170,255,.08)" : t < 39.51 ? "rgba(255,190,90,.07)" : t < 47.27 ? "rgba(120,180,255,.07)" : t < 59.79 ? "rgba(120,150,255,.08)" : t < 63.96 ? "rgba(255,120,90,.07)" : "rgba(170,140,255,.07)"} />
      {/* S2 chip (11.0–13.6s) */}
      {t > 11.0 && t < 13.6 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            HELD SINCE MARCH 2025
          </span>
        </div>
      ) : null}
      {/* S5 chip (43.6–46.0s) */}
      {t > 43.6 && t < 46.0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(16,18,24,.88)", color: "#8ae8ff", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            “IT DOESN’T BELONG IN THE HAGUE”
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
