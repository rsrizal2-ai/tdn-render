// TDN v12 — "Entirely Preventable" — first anniversary of Hong Kong's Wang Fuk Court fire
// (Tai Po, 26 Nov 2025, 168 dead, deadliest since 1948) and the independent committee's final
// report (1,154 pages): entirely preventable — lit cigarette, non-fireproof netting swapped in
// to save money, alarm power switched off in all 8 buildings, ~140 complaints ignored,
// HK$336M contract (most expensive of 57 bids), ICAC bid-rigging/fraud allegations, housing
// chief resigned the day the report came out. Sources: BBC 25 Nov 2026; Reuters 25 Nov 2026.
// 9:16 720x1280 30fps, 1958 frames (65.16 s voiceover). Production only — parent handles release.
// CUTS = [0, 7.00, 13.20, 17.54, 20.42, 26.59, 29.92, 34.70, 38.76, 45.62, 51.67, 56.38, 65.16].
// S1 the race up the tower / S2 the report / S3 entirely preventable / S4 one lit cigarette
// S5 the wrap burns / S6 swapped to save money / S7 silent alarms / S8 140 complaints ignored
// S9 the HK$336M contract / S10 fraud stamp + resignation / S11 one year on / S12 who answers?
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
const residentLook: Look = { skin: "#f0c8a0", body: "#7a4a8c", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", badge: "#ffd36a", shoe: "#101018" };
const workerLook: Look = { skin: "#caa27e", body: "#d8b62a", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#8ae8ff", shoe: "#1b1b2a" };
const officialLook: Look = { skin: "#fbe3c8", body: "#2b3550", outfit: "shirt", hair: "short", hairColor: "#3a3a44", badge: "#c9a227", shoe: "#101018" };
const mournerLook: Look = { skin: "#8a5a34", body: "#23232e", outfit: "hoodie", hair: "bob", hairColor: "#0d0d14", badge: "#5a5a6a", shoe: "#101018" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV11) ---------- */
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
/* residential tower with lit windows; h = height, base at y=0 */
const Tower: React.FC<{ p: V3; w?: number; h?: number; tone?: string; lit?: number }> = ({ p, w = 5.2, h = 11, tone = "#3d4657", lit = 0.55 }) => (
  <group position={p}>
    <Box p={[0, h / 2, 0]} s={[w, h, 3.4]} color={tone} line={2} />
    <CanvasPlane p={[0, h / 2, 1.73]} s={[w * 0.92, h * 0.94]} px={[512, 1024]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H);
      const cols = 4, rows = 12, cw = W / cols, ch = H / rows;
      for (let ix = 0; ix < cols; ix++) for (let iy = 0; iy < rows; iy++) {
        const on = rnd(ix * 31 + iy * 57) < lit;
        c.fillStyle = on ? "rgba(255,205,110,.95)" : "rgba(16,22,34,.9)";
        c.fillRect(ix * cw + cw * 0.22, iy * ch + ch * 0.24, cw * 0.56, ch * 0.5);
      }
    }} />
  </group>
);
/* bamboo scaffold poles + green safety netting wrapping a facade */
const Scaffold: React.FC<{ p: V3; w?: number; h?: number; net?: string }> = ({ p, w = 6.4, h = 11.6, net = "rgba(46,140,84,.34)" }) => (
  <group position={p}>
    {[-w / 2, -w / 6, w / 6, w / 2].map((x, i) => <Cyl key={i} p={[x, h / 2, 0]} rt={0.09} rb={0.09} h={h} color="#c8a86a" line={0} />)}
    {[1.6, 4.4, 7.2, 10.0].map((y, i) => <Box key={i} p={[0, y, 0]} s={[w + 0.4, 0.14, 0.14]} color="#b8935a" line={0} />)}
    <CanvasPlane p={[0, h / 2, 0.16]} s={[w, h]} px={[512, 512]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = net; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(20,80,44,.55)"; c.lineWidth = 2;
      for (let x = 0; x <= W; x += 18) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
      for (let y = 0; y <= H; y += 18) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    }} />
  </group>
);
/* a band of flame climbing a facade: y = base height of the fire front, o = strength */
const FlameBand: React.FC<{ p: V3; w?: number; y: number; o?: number }> = ({ p, w = 6.6, y, o = 1 }) => (
  <group position={p}>
    <Box p={[0, y, 0]} s={[w, 0.55, 0.3]} color="#ff7a26" line={0} />
    <Box p={[0, y - 0.55, 0]} s={[w * 0.96, 0.6, 0.26]} color="#e04a12" line={0} />
    {[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => <Ball key={i} p={[x, y + 0.55 + (i % 3) * 0.22, 0]} r={0.42} color={i % 2 ? "#ffb03a" : "#ff8a2a"} ink={0} />)}
    <Glow p={[0, y, 0.7]} r={4.6} color="rgba(255,130,40,1)" o={0.30 * o} />
  </group>
);
const Letter: React.FC<{ p: V3; s?: number; rot?: number }> = ({ p, s = 1, rot = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <Box p={[0, 0, 0]} s={[0.95 * s, 0.62 * s, 0.07]} color="#f2eee2" line={1} />
    <Box p={[0, 0.1 * s, 0.045]} s={[0.95 * s, 0.05, 0.02]} color="#b8433a" line={0} rot={[0, 0, 0.5]} />
    <Box p={[0, 0.1 * s, 0.045]} s={[0.95 * s, 0.05, 0.02]} color="#b8433a" line={0} rot={[0, 0, -0.5]} />
  </group>
);
const Flower: React.FC<{ p: V3; c?: string; s?: number }> = ({ p, c = "#ff6a8a", s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 0.4, 0]} rt={0.045} rb={0.045} h={0.8} color="#2e7d46" line={0} />
    <Ball p={[0, 0.92, 0]} r={0.21} color={c} ink={0.02} />
    <Ball p={[0.16, 0.8, 0.05]} r={0.13} color={c} ink={0.02} />
    <Ball p={[-0.16, 0.8, 0.05]} r={0.13} color={c} ink={0.02} />
  </group>
);

/* =================== S1 0 – 7.00  hook: ten metres a second =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.0, 14.2], look: [0, 4.6, -6], fov: 60 },
  { t: 7.00, pos: [0, 4.4, 11.8], look: [0, 4.8, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const fireY = lerp(0.6, 10.6, clamp(seg(t, 1.10, 3.51, Easing.in(Easing.cubic))));
  const speedK = seg(t, 2.93, 3.35, Easing.out(Easing.back(1.7)));
  const tollK = seg(t, 4.21, 4.65, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#b8c8ff" />
    <Floor kind="tile" a="#141c2c" b="#101725" unit={2} w={40} d={40} />
    <WallDoor z={-13} W={40} kind="plain" a="#0c1424" b="#0c1424" base="#060b16" />
    <Tower p={[-1.2, 0, -10.5]} w={6.2} h={12.4} tone="#39435a" lit={0.5} />
    <Scaffold p={[-1.2, 0, -8.55]} w={7.4} h={13.0} />
    {t > 1.05 ? <FlameBand p={[-1.2, 0, -8.3]} w={7.2} y={fireY} /> : null}
    <Tower p={[6.4, 0, -12.5]} w={4.2} h={9.6} tone="#2c3547" lit={0.4} />
    <Tower p={[-8.2, 0, -12.8]} w={4.0} h={10.4} tone="#2c3547" lit={0.45} />
    {speedK > 0.02 ? <group position={[3.9, 9.7, -7.6]} scale={[speedK, speedK, 1]}><Board p={[0, 0, 0]} w={6.4} bg="#2b0f16" frame="#ff7a26" lines={[{ t: "10 METRES", s: 96, c: "#ffb37a" }, { t: "A SECOND", s: 84, c: "#f5f7fa" }]} /></group> : null}
    {tollK > 0.02 ? <group position={[3.6, 3.1, -6.2]} scale={[tollK, tollK, 1]}><Board p={[0, 0, 0]} w={5.6} bg="#101828" frame="#e5233a" lines={[{ t: "168", s: 150, c: "#ff5040" }, { t: "NEVER MADE IT OUT", s: 52, c: "#f5f7fa" }]} /></group> : null}
    <Person p={[-4.9, 0, -2.4]} h={3.8} look={residentLook} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.35 }} />
    <Person p={[5.6, 0, -3.0]} h={3.9} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 0.5, 1.0), armR: [0.7, 0.9], lookX: -0.3 }} />
    <Dust t={t} area={[8, 5, 5]} color="rgba(190,205,255,.8)" />
  </>);
};

/* =================== S2 7.00 – 13.20  the final report =================== */
const K2: Key[] = [
  { t: 7.00, pos: [0, 4.0, 13.4], look: [0, 3.8, -6], fov: 60 },
  { t: 13.20, pos: [0, 3.8, 11.4], look: [0, 4.0, -6], fov: 58 },
];
const S2 = ({ t, f }: Ctx) => {
  const dropK = clamp(seg(t, 7.70, 8.35, Easing.in(Easing.cubic)));
  const bookY = lerp(6.4, 1.55, dropK);
  const boardK = seg(t, 9.03, 9.45, Easing.out(Easing.back(1.7)));
  const shake = t > 8.35 && t < 8.62 ? Math.sin((t - 8.35) * 44) * 0.07 : 0;
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#232c3e" b="#1b2334" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#2c3850" b="#2c3850" base="#131a29" />
    <Desk p={[0, shake, -5.4]} w={8.6} top="#4a3423" leg="#131a29" d={2.6} />
    <group position={[0, bookY + shake, -5.4]}>
      <Box p={[0, 0, 0]} s={[3.6, 1.5, 2.6]} color="#f0ead8" line={2} />
      <Box p={[0, 0.1, 0]} s={[3.75, 1.1, 2.75]} color="#7a1f2b" line={2} />
      <CanvasPlane p={[0, 0.86, 0]} s={[3.3, 2.3]} px={[512, 356]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = "#f7f2df"; c.textAlign = "center"; c.textBaseline = "middle";
        c.font = "900 64px Inter, Arial"; c.fillText("FINAL", W / 2, H * 0.34);
        c.font = "900 64px Inter, Arial"; c.fillText("REPORT", W / 2, H * 0.62);
      }} />
    </group>
    {[-2.9, 2.9].map((x, i) => <group key={i} position={[x, 1.28, -5.2]}><Box p={[0, 0, 0]} s={[1.7, 0.5, 1.9]} color="#e6dfca" line={1} /><Box p={[0, 0.42, 0]} s={[1.55, 0.4, 1.75]} color="#ddd5bd" line={1} /></group>)}
    {boardK > 0.02 ? <group position={[0, 8.9, -9.6]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={7.6} bg="#101828" frame="#c9a227" lines={[{ t: "1,154 PAGES", s: 104, c: "#ffd36a" }]} /></group> : null}
    <Shelf p={[-7.6, 0, -8.6]} /><Shelf p={[7.6, 0, -8.6]} />
    <Person p={[-4.4, 0, -2.2]} h={3.9} look={analyst} f={f} pose={{ mood: t < 11.8 ? "deadpan" : "worry", arms: "point", armK: seg(t, 8.6, 9.1), armR: [0.8, 0.6], lookX: 0.5 }} />
    <Person p={[4.6, 0, -2.4]} h={3.7} look={residentLook} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.45 }} />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S3 13.20 – 17.54  entirely preventable =================== */
const K3: Key[] = [
  { t: 13.20, pos: [0, 4.4, 14.6], look: [0, 4.6, -6], fov: 60 },
  { t: 17.54, pos: [0, 4.2, 12.2], look: [0, 4.7, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const stampK = seg(t, 16.77, 17.12, Easing.out(Easing.back(1.7)));
  const signK = seg(t, 14.16, 14.55, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffd9c4" />
    <Floor kind="tile" a="#1a141f" b="#140f19" unit={2} w={40} d={40} />
    <WallDoor z={-13} W={40} kind="plain" a="#171021" b="#171021" base="#0a0612" />
    {[-9.5, -5.7, -1.9, 1.9, 5.7, 9.5].map((x, i) => <Tower key={i} p={[x, 0, -11.5 - (i % 2) * 1.4]} w={3.3} h={9.4 + (i % 3)} tone={i === 2 || i === 3 ? "#453a30" : "#2e3444"} lit={0.35} />)}
    {signK > 0.02 ? <group position={[0, 9.9, -8.6]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[9.6, 1.05]} text="HONG KONG — DEADLIEST SINCE 1948" bg="#12060a" fg="#ff9a8a" size={56} frame="#e5233a" /></group> : null}
    {stampK > 0.02 ? <group position={[0, 4.6, -5.6]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={8.6} text="ENTIRELY PREVENTABLE" /></group> : null}
    <Person p={[0, 0, -1.8]} h={3.9} look={analyst} f={f} pose={{ mood: "worry", arms: "down", lookX: 0 }} />
    <Dust t={t} area={[8, 5, 5]} color="rgba(255,200,190,.8)" />
  </>);
};

/* =================== S4 17.54 – 20.42  one lit cigarette =================== */
const K4: Key[] = [
  { t: 17.54, pos: [0, 3.8, 12.6], look: [0, 3.4, -6], fov: 60 },
  { t: 20.42, pos: [0, 3.6, 10.8], look: [0, 3.4, -6], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const glowK = 0.55 + 0.45 * Math.sin(t * 5.2);
  const flareK = seg(t, 19.67, 19.95);
  const sparkY = lerp(3.35, 0.35, clamp(seg(t, 19.95, 20.38, Easing.in(Easing.cubic))));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe2ae" />
    <Floor kind="plank" a="#4a3423" b="#3d2c14" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#54401e" b="#54401e" base="#2a1e0a" />
    {/* scaffold platform the worker sits on */}
    <Box p={[0, 2.6, -7.2]} s={[11.5, 0.35, 3.4]} color="#8a6a34" line={2} />
    {[-5.2, -1.8, 1.8, 5.2].map((x, i) => <Cyl key={i} p={[x, 4.6, -8.6]} rt={0.09} rb={0.09} h={9.2} color="#c8a86a" line={0} />)}
    {[5.4, 8.6].map((y, i) => <Box key={i} p={[0, y, -8.6]} s={[11.9, 0.14, 0.14]} color="#b8935a" line={0} />)}
    <Box p={[-2.6, 3.35, -7.0]} s={[1.6, 1.15, 1.2]} color="#7a5c14" line={2} />
    <Person p={[0.6, 2.78, -7.0]} h={3.6} look={workerLook} f={f} pose={{ mood: "deadpan", arms: "hold", armR: [0.55, 0.75], armL: [-0.3, 0.4], lookX: 0.2 }} />
    {/* the cigarette: tiny white stick + ember */}
    <group position={[1.62, 3.62, -6.35]}>
      <Box p={[0, 0, 0]} s={[0.34, 0.07, 0.07]} color="#f5f0e2" line={0} rot={[0, 0, -0.35]} />
      <Ball p={[0.19, 0.06, 0]} r={0.075} color="#ff6a1f" ink={0} />
      <Glow p={[0.19, 0.06, 0.25]} r={0.85 + flareK * 1.5} color="rgba(255,120,40,1)" o={0.35 * glowK + flareK * 0.4} />
    </group>
    {t > 19.9 ? <Ball p={[1.85, sparkY + 2.6, -6.3]} r={0.09} color="#ffb03a" ink={0} /> : null}
    {t > 19.9 ? <Glow p={[1.85, sparkY + 2.6, -6.0]} r={1.1} color="rgba(255,150,50,1)" o={0.3} /> : null}
    {/* debris pile below */}
    <Box p={[2.2, 0.3, -6.2]} s={[2.4, 0.6, 1.4]} color="#6a5638" line={1} rot={[0, 0.4, 0]} />
    <Box p={[1.4, 0.75, -6.4]} s={[1.2, 0.4, 0.9]} color="#7d6a42" line={1} rot={[0, -0.3, 0.1]} />
    <Sign p={[0, 10.3, -10.4]} s={[8.8, 1.0]} text="IT BEGAN WITH ONE CIGARETTE" bg="#1c1005" fg="#ffb37a" size={62} frame="#ff8a3c" />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,220,180,.85)" />
  </>);
};

/* =================== S5 20.42 – 26.59  the wrap burns =================== */
const K5: Key[] = [
  { t: 20.42, pos: [0, 4.2, 13.8], look: [0, 4.4, -6], fov: 60 },
  { t: 26.59, pos: [0, 4.0, 11.6], look: [0, 4.6, -6], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const fireY = lerp(0.5, 6.8, clamp(seg(t, 20.61, 25.40, Easing.in(Easing.cubic))));
  const foamK = seg(t, 23.14, 23.5, Easing.out(Easing.back(1.7)));
  const tagK = seg(t, 25.81, 26.2, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffc9a0" />
    <Floor kind="tile" a="#1c1410" b="#150f0b" unit={2} w={40} d={40} />
    <WallDoor z={-13} W={40} kind="plain" a="#140c08" b="#140c08" base="#080504" />
    <Tower p={[0, 0, -10.8]} w={6.4} h={12.6} tone="#3a3f4d" lit={0.3} />
    <Scaffold p={[0, 0, -8.8]} w={7.6} h={13.2} />
    {/* foam boards sealing the windows */}
    {[-2.2, 0, 2.2].map((x, i) => <group key={i} position={[x, 5.4 + (i % 2) * 2.2, -8.55]}>
      <Box p={[0, 0, 0]} s={[1.7, 1.9, 0.16]} color={foamK > 0.5 ? "#ffe9a8" : "#e8e2d2"} line={1} />
    </group>)}
    {foamK > 0.02 ? <group position={[4.6, 7.6, -7.8]} scale={[foamK, foamK, 1]}><Sign p={[0, 0, 0]} s={[3.6, 0.85]} text="FOAM BOARDS" bg="#241806" fg="#ffd36a" size={70} frame="#f0c040" /></group> : null}
    {t > 20.55 ? <FlameBand p={[0, 0, -8.5]} w={7.4} y={fireY} /> : null}
    {tagK > 0.02 ? <group position={[-4.9, 3.4, -7.4]} scale={[tagK, tagK, 1]}><Sign p={[0, 0, 0]} s={[4.3, 0.95]} text="NOT FIREPROOF" bg="#2b0f16" fg="#ff8a7a" size={76} frame="#e5233a" /></group> : null}
    <Person p={[-5.6, 0, -2.6]} h={3.8} look={analyst} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 22.8, 23.3), armR: [0.8, 0.7], lookX: 0.5 }} />
    <Dust t={t} area={[8, 5, 5]} color="rgba(255,190,150,.85)" />
  </>);
};

/* =================== S6 26.59 – 29.92  swapped to save money =================== */
const K6: Key[] = [
  { t: 26.59, pos: [0, 3.9, 13.2], look: [0, 3.6, -6], fov: 60 },
  { t: 29.92, pos: [0, 3.7, 11.4], look: [0, 3.8, -6], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const swapK = clamp(seg(t, 26.90, 27.70, Easing.out(Easing.cubic)));
  const gustK = clamp(seg(t, 28.13, 28.75));
  const tearRot = gustK * 0.85;
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#dfeaff" />
    <Floor kind="plank" a="#3d3423" b="#332b1d" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#47503c" b="#47503c" base="#232a1a" />
    {/* roll A: the proper net, pushed aside */}
    <group position={[-4.3 + swapK * 0.4, 0, -6.8]} rotation={[0, 0, swapK * 0.5]}>
      <Cyl p={[0, 1.5, 0]} rt={0.85} rb={0.85} h={3.0} color="#2e8c54" line={2} />
      <Sign p={[0, 3.6, 0.6]} s={[3.2, 0.8]} text="FIREPROOF" bg="#0e2f1c" fg="#8ae8b0" size={76} frame="#2fd46a" />
    </group>
    {/* roll B: the cheap net, rolled in */}
    <group position={[lerp(7.5, 3.4, swapK), 0, -6.4]}>
      <Cyl p={[0, 1.5, 0]} rt={0.85} rb={0.85} h={3.0} color="#7d8894" line={2} />
      <Sign p={[0, 3.6, 0.6]} s={[2.9, 0.8]} text="CHEAP" bg="#2b0f16" fg="#ff8a7a" size={88} frame="#e5233a" />
    </group>
    {/* a torn sheet of the old net in the typhoon gust */}
    <group position={[0.4, 6.6, -8.2]} rotation={[0.2, 0.3, tearRot]}>
      <CanvasPlane p={[0, 0, 0]} s={[4.6, 3.0]} px={[256, 168]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = "rgba(46,140,84,.4)"; c.fillRect(0, 0, W, H);
        c.strokeStyle = "rgba(20,80,44,.6)"; c.lineWidth = 2;
        for (let x = 0; x <= W; x += 14) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
        for (let y = 0; y <= H; y += 14) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      }} />
    </group>
    {gustK > 0.1 ? [-1, 0.5, 2].map((x, i) => <Ball key={i} p={[x + gustK * 3.4, 5.6 - gustK * 1.4 + i * 0.7, -7.6]} r={0.16} color="#a8b89a" ink={0} />) : null}
    <Sign p={[0, 10.2, -10.4]} s={[9.2, 1.0]} text="SWAPPED IN — TO SAVE MONEY" bg="#101828" fg="#ffd36a" size={64} frame="#c9a227" />
    <Person p={[0.2, 0, -2.6]} h={3.7} look={workerLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 26.7, 27.2), armR: [0.85, 0.45], lookX: 0.55 }} />
    <Person p={[-5.9, 0, -2.8]} h={3.8} look={analyst} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(200,225,255,.85)" />
  </>);
};

/* =================== S7 29.92 – 34.70  no alarm ever rang =================== */
const K7: Key[] = [
  { t: 29.92, pos: [0, 3.8, 12.8], look: [0, 3.6, -6], fov: 60 },
  { t: 34.70, pos: [0, 3.6, 11.0], look: [0, 3.7, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const flipK = clamp(seg(t, 33.77, 34.19, Easing.out(Easing.cubic)));
  const boardK = seg(t, 32.58, 33.0, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#cfe0ff" />
    <Floor kind="tile" a="#1b2432" b="#161e2a" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#26324a" b="#26324a" base="#0e1624" />
    {/* the alarm bell that never rings */}
    <group position={[-3.4, 6.9, -9.2]}>
      <Cyl p={[0, 0.5, 0]} rt={0.16} rb={0.16} h={0.7} color="#8a97a5" line={1} />
      <Ball p={[0, 0, 0]} r={0.85} color="#c22333" ink={0.04} s={[1, 0.72, 1]} />
      <Ball p={[0, -0.5, 0]} r={0.2} color="#5a1620" ink={0.02} />
      {/* a big silent X over it after the power dies */}
      {flipK > 0.6 ? <CanvasPlane p={[0, 0, 1.0]} s={[2.3, 2.3]} px={[256, 256]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.strokeStyle = "#e5233a"; c.lineWidth = 30; c.lineCap = "round";
        c.beginPath(); c.moveTo(38, 38); c.lineTo(W - 38, H - 38); c.moveTo(W - 38, 38); c.lineTo(38, H - 38); c.stroke();
      }} /> : null}
    </group>
    {/* the power switch box */}
    <group position={[3.6, 4.6, -9.4]}>
      <Box p={[0, 0, 0]} s={[1.7, 2.3, 0.5]} color="#39424e" line={2} />
      <Box p={[0, 0.62, 0.32]} s={[0.5, 0.16, 0.16]} color="#2fd46a" line={0} />
      <group position={[0, 0.1, 0.35]} rotation={[0, 0, lerp(-0.5, 0.9, flipK)]}>
        <Box p={[0, 0.42, 0]} s={[0.2, 0.95, 0.14]} color="#f5f0e2" line={1} />
      </group>
      <CanvasPlane p={[0, -0.82, 0.28]} s={[1.3, 0.5]} px={[256, 96]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = flipK > 0.5 ? "#ff8a7a" : "#8ae8b0"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(flipK > 0.5 ? "OFF" : "ON", W / 2, H / 2);
      }} />
    </group>
    {boardK > 0.02 ? <group position={[0, 9.9, -10.2]} scale={[boardK, boardK, 1]}><Board p={[0, 0, 0]} w={7.8} bg="#101828" frame="#e5233a" lines={[{ t: "ALL 8 BUILDINGS", s: 88, c: "#f5f7fa" }, { t: "ALARMS SWITCHED OFF", s: 62, c: "#ff9a8a" }]} /></group> : null}
    <Person p={[-3.4, 0, -2.6]} h={3.8} look={residentLook} f={f} pose={{ mood: "worry", arms: "point", armK: seg(t, 30.2, 30.7), armR: [0.6, 0.95], lookX: 0.1 }} />
    <Person p={[4.4, 0, -2.8]} h={3.9} look={analyst} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S8 34.70 – 38.76  140 complaints, ignored =================== */
const K8: Key[] = [
  { t: 34.70, pos: [0, 3.9, 13.2], look: [0, 3.7, -6], fov: 60 },
  { t: 38.76, pos: [0, 3.7, 11.4], look: [0, 3.8, -6], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const pileN = Math.floor(clamp(seg(t, 35.12, 36.58)) * 6.99);
  const countK = seg(t, 35.66, 36.1, Easing.out(Easing.back(1.7)));
  const sweepK = clamp(seg(t, 38.07, 38.55, Easing.in(Easing.cubic)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2c2c34" b="#232329" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#3a3a46" b="#3a3a46" base="#191920" />
    <Desk p={[1.2, 0, -6.0]} w={9.2} top="#4a4238" leg="#191920" d={2.6} />
    {/* the growing pile of complaint letters on the desk */}
    {Array.from({ length: 7 }).map((_, i) => pileN > i ? (
      <group key={i} position={[2.9 - sweepK * 1.8, 1.32 + i * 0.16 - sweepK * sweepK * 1.1, -5.6 + sweepK * 0.9]} rotation={[0, 0, sweepK * 0.7]}>
        <Letter p={[0, 0, 0]} s={1.15} rot={rnd(i) * 0.7 - 0.35} />
      </group>
    ) : null)}
    {/* the bin they end up in */}
    <group position={[5.1, 0, -4.2]}>
      <Cyl p={[0, 0.65, 0]} rt={0.72} rb={0.55} h={1.3} color="#5a6270" line={2} />
      {sweepK > 0.85 ? <Letter p={[0.1, 1.45, 0]} s={1.0} rot={0.5} /> : null}
    </group>
    {countK > 0.02 ? <group position={[-3.6, 8.6, -9.4]} scale={[countK, countK, 1]}><Board p={[0, 0, 0]} w={6.6} bg="#101828" frame="#ffd36a" lines={[{ t: "140", s: 130, c: "#ffd36a" }, { t: "COMPLAINTS FILED", s: 56, c: "#f5f7fa" }]} /></group> : null}
    <Person p={[1.6, 0, -7.6]} h={3.8} look={officialLook} f={f} pose={{ mood: "deadpan", arms: sweepK > 0.1 && sweepK < 0.95 ? "point" : "down", armK: seg(t, 37.9, 38.2), armR: [0.9, 0.4], lookX: -0.3 }} />
    <Person p={[-4.6, 0, -2.6]} h={3.7} look={residentLook} f={f} pose={{ mood: "worry", arms: "hold", armR: [0.4, 0.5], armL: [-0.4, 0.5], lookX: 0.5 }} />
    <Letter p={[-4.6, 1.05, -2.05]} s={1.05} rot={0.15} />
    <Person p={[-6.3, 0, -3.2]} h={3.8} look={mournerLook} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.5 }} />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S9 38.76 – 45.62  the most expensive bid =================== */
const K9: Key[] = [
  { t: 38.76, pos: [0, 4.1, 13.8], look: [0, 3.9, -6], fov: 60 },
  { t: 45.62, pos: [0, 3.9, 11.8], look: [0, 4.0, -6], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const winK = seg(t, 41.76, 42.2, Easing.out(Easing.back(1.7)));
  const gavelK = t > 44.64 && t < 44.86 ? Math.sin((t - 44.64) * 30) * 0.3 : 0;
  const signK = seg(t, 44.34, 44.7, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe2ae" />
    <Floor kind="plank" a="#3a2a16" b="#2f2110" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#54401e" b="#54401e" base="#241a08" />
    {/* rows of bidder paddles */}
    {Array.from({ length: 12 }).map((_, i) => {
      const x = -6.6 + (i % 6) * 2.65, y = 3.4 + Math.floor(i / 6) * 2.1;
      return (<group key={i} position={[x, y, -9.6]}>
        <Box p={[0, -0.55, 0]} s={[0.12, 0.8, 0.08]} color="#8a6a34" line={0} />
        <Ball p={[0, 0.25, 0]} r={0.52} color={i === 9 ? "#ffd36a" : "#d8d2c2"} ink={0.03} s={[1, 1, 0.4]} />
      </group>);
    })}
    <Sign p={[0, 9.3, -10.2]} s={[9.8, 1.05]} text="THE RENOVATION CONTRACT" bg="#180d04" fg="#ffd36a" size={66} frame="#c9a227" />
    {winK > 0.02 ? <group position={[0, 1.9, -6.6]} scale={[winK, winK, 1]}><Board p={[0, 0, 0]} w={7.2} bg="#241806" frame="#f0c040" lines={[{ t: "HK$336 MILLION", s: 104, c: "#ffd36a" }]} /></group> : null}
    {signK > 0.02 ? <group position={[0, 6.9, -8.8]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[8.8, 0.95]} text="THE MOST EXPENSIVE OF 57 BIDS" bg="#101828" fg="#f5f7fa" size={58} frame="#ffd36a" /></group> : null}
    {/* the auctioneer's gavel */}
    <group position={[5.6, 2.6, -4.6]} rotation={[0, 0, -0.5 + gavelK]}>
      <Box p={[0, 0.5, 0]} s={[0.16, 1.1, 0.16]} color="#8a5a2e" line={1} />
      <Box p={[0, 1.12, 0]} s={[0.72, 0.34, 0.34]} color="#5d3d1e" line={1} />
    </group>
    <Box p={[5.6, 1.7, -4.6]} s={[1.3, 0.22, 1.0]} color="#3d2c14" line={1} />
    <Person p={[-5.2, 0, -2.4]} h={3.9} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 41.2, 41.7), armR: [0.85, 0.55], lookX: 0.5 }} />
    <Person p={[3.2, 0, -2.8]} h={3.7} look={officialLook} f={f} pose={{ mood: "grin", arms: "down", lookX: -0.4 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,220,180,.85)" />
  </>);
};

/* =================== S10 45.62 – 51.67  fraud, then the resignation =================== */
const K10: Key[] = [
  { t: 45.62, pos: [0, 3.9, 13.4], look: [0, 3.7, -6], fov: 60 },
  { t: 51.67, pos: [0, 3.7, 11.6], look: [0, 3.8, -6], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => {
  const stampK = seg(t, 48.04, 48.4, Easing.out(Easing.back(1.7)));
  const walkK = clamp(seg(t, 49.80, 51.30));
  const offX = lerp(2.6, 9.5, walkK), bob = walkK > 0 && walkK < 1 ? Math.abs(Math.sin(t * 8.5)) * 0.14 : 0;
  const signK = seg(t, 50.30, 50.7, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K10} />
    <Lights warm="#e8f2ff" />
    <Floor kind="tile" a="#1c2733" b="#16202b" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#27374a" b="#27374a" base="#101a26" />
    {/* the podium, centre-left */}
    <group position={[-2.2, 0, -6.2]}>
      <Box p={[0, 1.35, 0]} s={[2.0, 2.7, 1.2]} color="#2b3a55" line={2} />
      <Box p={[0, 2.85, 0]} s={[2.4, 0.3, 1.5]} color="#1a2639" line={1} />
      <Cyl p={[-0.5, 3.3, 0.3]} rt={0.05} rb={0.05} h={0.9} color="#8a97a5" line={0} rot={[0.3, 0, 0.3]} />
      <Cyl p={[0.5, 3.3, 0.3]} rt={0.05} rb={0.05} h={0.9} color="#8a97a5" line={0} rot={[0.3, 0, -0.3]} />
      <Ball p={[-0.5, 3.78, 0.42]} r={0.13} color="#14100c" ink={0.01} />
      <Ball p={[0.5, 3.78, 0.42]} r={0.13} color="#14100c" ink={0.01} />
    </group>
    <CanvasPlane p={[-2.2, 6.4, -9.8]} s={[5.6, 3.4]} px={[560, 340]} frame="#8a97a5" draw={(c, W, H) => {
      c.fillStyle = "#a4133c"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#ffffff"; c.beginPath(); c.arc(W / 2, H / 2, 74, 0, 7); c.fill();
      c.fillStyle = "#a4133c"; c.font = "900 44px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("HK", W / 2, H / 2 + 2);
    }} />
    {/* the housing chief walks away from the podium */}
    <Person p={[offX, bob, -3.4]} h={3.8} look={officialLook} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.7 }} />
    {stampK > 0.02 ? <group position={[-1.1, 4.4, -4.6]} scale={[stampK, stampK, 1]}><Stamp p={[0, 0, 0]} w={6.8} text="BID-RIGGING + FRAUD" /></group> : null}
    {signK > 0.02 ? <group position={[2.8, 8.9, -9.6]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[7.6, 0.95]} text="HOUSING CHIEF RESIGNS" bg="#101828" fg="#ffd36a" size={72} frame="#c9a227" /></group> : null}
    <Person p={[-5.8, 0, -2.4]} h={3.9} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 47.3, 47.8), armR: [0.8, 0.6], lookX: 0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(190,215,255,.85)" />
  </>);
};

/* =================== S11 51.67 – 56.38  one year on =================== */
const K11: Key[] = [
  { t: 51.67, pos: [0, 3.6, 13.8], look: [0, 3.4, -6], fov: 60 },
  { t: 56.38, pos: [0, 3.4, 11.8], look: [0, 3.5, -6], fov: 58 },
];
const S11 = ({ t, f }: Ctx) => {
  const placeK = seg(t, 53.95, 54.5, Easing.out(Easing.cubic));
  const signK = seg(t, 52.54, 52.95, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K11} />
    <Lights warm="#ffd9b0" />
    <Floor kind="tile" a="#241d20" b="#1c1619" unit={2} w={40} d={40} />
    <WallDoor z={-13} W={40} kind="plain" a="#191423" b="#191423" base="#0b0812" />
    {/* the estate at dusk, quiet now */}
    <Tower p={[-3.4, 0, -11.6]} w={5.4} h={11.6} tone="#333040" lit={0.22} />
    <Tower p={[3.6, 0, -12.2]} w={4.6} h={10.2} tone="#2c2838" lit={0.18} />
    {/* memorial fence with flowers and candles */}
    {[-5.4, -3.9, -2.4, -0.9, 0.9, 2.4, 3.9, 5.4].map((x, i) => <Box key={i} p={[x, 1.05, -6.4]} s={[0.14, 2.1, 0.14]} color="#4a4a55" line={0} />)}
    <Box p={[0, 1.9, -6.4]} s={[11.6, 0.12, 0.12]} color="#4a4a55" line={0} />
    <Box p={[0, 0.75, -6.4]} s={[11.6, 0.12, 0.12]} color="#4a4a55" line={0} />
    {[-4.8, -3.2, -1.5, 0.2, 1.8, 3.4, 5.0].map((x, i) => <Flower key={i} p={[x, 0.06, -5.9]} c={["#ff6a8a", "#f5f0e2", "#ffb03a", "#ff8ab0"][i % 4]} s={0.95} />)}
    {[-4.0, -0.6, 2.8, 4.4].map((x, i) => <group key={i} position={[x, 0, -5.5]}>
      <Cyl p={[0, 0.22, 0]} rt={0.13} rb={0.15} h={0.44} color="#f0ead8" line={1} />
      <Ball p={[0, 0.52, 0]} r={0.07} color="#ffca6a" ink={0} />
      <Glow p={[0, 0.55, 0.2]} r={0.7} color="rgba(255,190,100,1)" o={0.35} />
    </group>)}
    {signK > 0.02 ? <group position={[0, 10.9, -10.8]} scale={[signK, signK, 1]}><Sign p={[0, 0, 0]} s={[9.4, 1.0]} text="WANG FUK COURT — ONE YEAR ON" bg="#0d0a14" fg="#e8dff2" size={60} frame="#8a7fa8" /></group> : null}
    <Person p={[-1.7, 0, -3.6]} h={3.7} look={mournerLook} f={f} pose={{ mood: "worry", arms: "hold", armK: placeK, armR: [0.45, 0.35], armL: [-0.45, 0.35], lookX: 0.1 }} />
    <Flower p={[-1.7, 0.75 + placeK * 0.1, -3.0]} c="#ff6a8a" s={1.05} />
    <Person p={[2.2, 0, -3.9]} h={3.8} look={residentLook} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.15 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(230,215,255,.75)" />
  </>);
};

/* =================== S12 56.38 – 65.16  who should answer? + sign-off =================== */
const K12: Key[] = [
  { t: 56.38, pos: [0, 3.6, 12.4], look: [0, 3.4, -5], fov: 60 },
  { t: 65.16, pos: [0, 3.4, 10.4], look: [0, 3.5, -5], fov: 58 },
];
const S12 = ({ t, f }: Ctx) => {
  const bK = seg(t, 58.26, 58.6, Easing.out(Easing.back(1.7)));
  const mK = seg(t, 58.95, 59.3, Easing.out(Easing.back(1.7)));
  const oK = seg(t, 59.89, 60.25, Easing.out(Easing.back(1.7)));
  const cK = seg(t, 61.70, 62.1, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K12} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#141021" b="#191430" unit={2} w={32} d={32} />
    <WallDoor z={-7.5} W={32} kind="plain" a="#150f2a" b="#150f2a" base="#08060f" />
    <SideWall x={-11} kind="plain" a="#141021" b="#141021" /><SideWall x={11} kind="plain" a="#141021" b="#141021" />
    <CanvasPlane p={[0, 5.6, -7.2]} s={[10.6, 5.4]} px={[1060, 540]} frame="#8a7fa8" draw={(c, W, H) => {
      c.fillStyle = "#171233"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = "#e5233a"; c.beginPath(); c.arc(W / 2, H * 0.24, 56, 0, 7); c.fill();
      c.fillStyle = "#171233"; c.font = "900 72px Inter, Arial"; c.fillText("T", W / 2, H * 0.24 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 138px Inter, Arial"; c.fillText("TDN", W / 2, H * 0.55);
      c.fillStyle = "#ffd36a"; c.font = "900 46px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W / 2, H * 0.76);
      c.fillStyle = "#c9b8ff"; c.font = "700 30px Inter, Arial"; c.fillText("HONG KONG — ONE YEAR ON", W / 2, H * 0.9);
    }} />
    {/* the three accused, as labelled podiums left of the desk */}
    {bK > 0.02 ? <group position={[-4.7, 3.3, -5.6]} scale={[bK, bK, 1]}><Sign p={[0, 0, 0]} s={[3.5, 0.85]} text="BUILDERS" bg="#2b0f16" fg="#ff9a8a" size={76} frame="#e5233a" /></group> : null}
    {mK > 0.02 ? <group position={[-4.7, 2.25, -5.6]} scale={[mK, mK, 1]}><Sign p={[0, 0, 0]} s={[3.5, 0.85]} text="MANAGERS" bg="#241806" fg="#ffd36a" size={76} frame="#f0c040" /></group> : null}
    {oK > 0.02 ? <group position={[-4.7, 1.2, -5.6]} scale={[oK, oK, 1]}><Sign p={[0, 0, 0]} s={[3.5, 0.85]} text="OFFICIALS" bg="#0e2238" fg="#8ae8ff" size={76} frame="#3a9ad9" /></group> : null}
    {cK > 0.02 ? <group position={[4.35, 2.6, -5.4]} scale={[cK, cK, 1]}><Board p={[0, 0, 0]} w={4.4} bg="#101828" frame="#2fd46a" lines={[{ t: "TELL US IN", s: 62, c: "#f5f7fa" }, { t: "THE COMMENTS", s: 62, c: "#8ae8b0" }]} /></group> : null}
    <Glow p={[0, 5.6, -6.6]} r={5.4} color="rgba(160,130,255,1)" o={0.12} />
    <Globe p={[5.9, 2.5, -5.2]} r={1.55} rotY={t * 0.4} />
    <Cyl p={[5.9, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.9, 0.06, -5.2]} rt={0.55} h={0.12} color="#2c2440" line={1} />
    <Desk p={[0, 0, -2.6]} w={5.6} top="#2c2440" leg="#08060f" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#08060f"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    <Monitor p={[3.3, 1.05, -2.8]} rot={[0, -0.35, 0]} screen="#8a7fa8" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#2c2440" /><Plant p={[-8.6, 0, -4.6]} s={1.2} /><Lamp p={[8.6, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#141021" b="#8a7fa8" />
    <Dust t={t} area={[6, 6, 4]} color="rgba(210,200,255,.9)" />
    <Person p={[0, 0, -3.6]} h={3.5} look={analyst} f={f} pose={{ mood: t < 62.26 ? "deadpan" : "grin", squash: t > 64.4 && t < 65.0 ? 0.08 : 0,
      arms: t > 61.29 ? "point" : "down", armK: seg(t, 61.29, 61.6), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>);
};

const CUTS = [0, 7.00, 13.20, 17.54, 20.42, 26.59, 29.92, 34.70, 38.76, 45.62, 51.67, 56.38, 65.16];
export const TdnV12: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0c1424">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#232c3e" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#171021">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#54401e" trans="whip">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#140c08">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#47503c">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#26324a" trans="zoom">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#3a3a46">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#54401e">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#27374a" trans="flash">{(c) => <S10 {...c} />}</Scene>
      <Scene start={CUTS[10]} end={CUTS[11]} bg="#191423">{(c) => <S11 {...c} />}</Scene>
      <Scene start={CUTS[11]} end={CUTS[12]} bg="#150f2a">{(c) => <S12 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 7.00 ? "rgba(120,150,255,.08)" : t < 13.20 ? "rgba(255,190,90,.07)" : t < 17.54 ? "rgba(255,90,70,.07)" : t < 20.42 ? "rgba(255,170,90,.08)" : t < 26.59 ? "rgba(255,110,60,.08)" : t < 29.92 ? "rgba(120,180,255,.07)" : t < 34.70 ? "rgba(140,170,255,.08)" : t < 38.76 ? "rgba(255,190,90,.06)" : t < 45.62 ? "rgba(255,170,90,.08)" : t < 51.67 ? "rgba(120,180,255,.07)" : t < 56.38 ? "rgba(200,150,255,.07)" : "rgba(170,140,255,.07)"} />
      {/* S2 chip (7.4–10.4s) */}
      {t > 7.4 && t < 10.4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            THE FINAL REPORT
          </span>
        </div>
      ) : null}
      {/* S8 chip (35.0–38.0s) */}
      {t > 35.0 && t < 38.0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(16,18,24,.88)", color: "#ff9a8a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            ...AND WERE IGNORED
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
