// TDN v19 — "The Nvidia CEO Saga: Out, Back In, and the Chip Halt That Hit Indonesia":
// Jensen Huang's resignation was announced 12 Nov 2026 after reports of an affair with
// Alice Huang, a former Megaspeed executive whom US officials reportedly suspected of
// links to Chinese intelligence (allegations — no evidence of unlawful conduct made
// public). The board ruled out a return on 17 Nov, then reversed itself after President
// Trump and senior officials pressed it, reinstating him unanimously on 23 Nov — as CEO,
// not chairman. On 26 Nov the Financial Times reported Nvidia had told Dell and
// Supermicro to halt AI server shipments to Malaysia, Singapore, Thailand and Indonesia
// under a new US export-licence rule aimed at alleged chip routes into China.
// Framing: "reports said / reportedly / alleged" throughout for unproven claims.
// Sources: CNN + AFP (23 Nov 2026), The Telegraph timeline, Financial Times (26 Nov 2026).
// 9:16 720x1280 30fps, 1878 frames (62.51 s voiceover). Production only — parent releases.
// CUTS = [0, 6.21, 22.91, 32.08, 45.07, 54.02, 59.40, 62.60].
// S1 hook / S2 the fall / S3 the hole / S4 Washington flips the board / S5 the shipment
// halt / S6 why: the licence rule / S7 closer: investigations open
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Grade, Sign, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, Glow, Plant, Monitor } from "../style/props";
import { Cam, Key, Stars } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const jensen: Look = { skin: "#eec39a", body: "#23232e", outfit: "leather", hair: "short", hairColor: "#3a3a44", shoe: "#0c0c12" };
const alice: Look = { skin: "#fbe3c8", body: "#7a2d4a", outfit: "blazer", hair: "bob", hairColor: "#14141f", shoe: "#1b1b2a" };
const jones: Look = { skin: "#f2c894", body: "#2e3d5c", outfit: "suit", tie: "#7a1f2b", hair: "grey", glasses: true, shoe: "#14141f" };
const official: Look = { skin: "#f2c894", body: "#20304f", outfit: "suit", tie: "#b03a3a", hair: "swept", hairColor: "#c9a86a", shoe: "#14141f" };
const director: Look = { skin: "#e8b98d", body: "#37455e", outfit: "suit", tie: "#3f6212", hair: "short", hairColor: "#23232e", shoe: "#0c0c12" };
const director2: Look = { skin: "#f2c894", body: "#4a375e", outfit: "suit", tie: "#8c6a1d", hair: "short", hairColor: "#0c0c12", shoe: "#0c0c12" };
const dockworker: Look = { skin: "#e8b98d", body: "#d97b2f", outfit: "hoodie", hair: "short", hairColor: "#0c0c12", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV18) ---------- */
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
/* the chip-company HQ tower: window grid, one special corner office window */
const Tower: React.FC<{ p: V3; s?: number; topLit: boolean }> = ({ p, s = 1, topLit }) => (
  <group position={p} scale={[s, s, s]}>
    <Box p={[0, 8, 0]} s={[10.5, 16, 3]} color="#14342a" line={2} />
    <CanvasPlane p={[0, 8, 1.56]} s={[9.9, 15.2]} px={[512, 768]} draw={(c, W, H) => {
      c.fillStyle = "#0f2a20"; c.fillRect(0, 0, W, H);
      const rows = 16, cols = 6;
      for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) {
        if (r === 0 && i >= 4) continue; // the corner office is a separate element
        const lit = rnd(r * 41 + i * 13) > 0.55;
        c.fillStyle = lit ? "#2f7a52" : "#0a1a12";
        c.fillRect(16 + i * ((W - 32) / cols), 14 + r * ((H - 28) / rows), (W - 32) / cols - 11, (H - 28) / rows - 10);
      }
    }} />
    {/* the CEO's corner office window */}
    <Box p={[3.55, 15.05, 1.58]} s={[2.9, 1.55, 0.08]} color={topLit ? "#ffd36a" : "#0a1a12"} line={2} />
    <Box p={[0, 0.8, 1.8]} s={[3.4, 1.6, 0.25]} color="#08130d" line={2} />
  </group>
);
/* a server crate with a stencilled label */
const Crate: React.FC<{ p: V3; label: string; col?: string }> = ({ p, label, col = "#9fb4cc" }) => (
  <group position={p}>
    <Box p={[0, 0, 0]} s={[2.2, 1.5, 1.5]} color="#2c3646" line={2} />
    <CanvasPlane p={[0, 0.1, 0.78]} s={[1.9, 0.8]} px={[440, 190]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
      let fs = 84; c.font = `900 ${fs}px Inter, Arial`;
      while (c.measureText(label).width > W - 30 && fs > 30) { fs -= 6; c.font = `900 ${fs}px Inter, Arial`; }
      c.fillText(label, W / 2, H / 2);
    }} />
    <Box p={[0, 0.55, 0.78]} s={[1.7, 0.14, 0.05]} color="#57e6a3" line={0} />
  </group>
);

/* =================== S1 0 – 6.21  hook: eleven days without its founder =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.6, 18.6], look: [0, 5.6, -8], fov: 60 },
  { t: 6.21, pos: [0, 4.4, 16.0], look: [0, 5.6, -8], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const bK = seg(t, 0.35, 0.9, Easing.out(Easing.back(1.7)));
  const outK = clamp(seg(t, 3.6, 5.9));
  const lit = t < 3.4;
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#bcd2ff" />
    <Stars p={[0, 15, -28]} s={[52, 16]} t={t} />
    <Floor kind="tile" a="#101a14" b="#0c1410" unit={2.6} w={60} d={54} />
    <Tower p={[0, 0, -13]} topLit={lit} />
    <Glow p={[3.55, 15.05, -11]} r={3.2} color="#ffd36a" o={lit ? 0.4 : 0} />
    {/* neighbouring towers, dimmer */}
    <Box p={[-10.5, 5.5, -16]} s={[6.5, 11, 2.6]} color="#10201a" line={1} />
    <Box p={[10.5, 4.5, -16]} s={[6.5, 9, 2.6]} color="#10201a" line={1} />
    {/* street lamps */}
    {[-6.2, 6.2].map((x, i) => (
      <group key={i} position={[x, 0, -5]}>
        <Box p={[0, 2.2, 0]} s={[0.22, 4.4, 0.22]} color="#23232e" line={2} />
        <Ball p={[0, 4.6, 0]} r={0.3} color="#ffe9b0" ink={0.02} />
        <Glow p={[0, 4.6, 0]} r={1.7} color="#ffe9b0" o={0.4} />
      </group>
    ))}
    {/* the founder walks out of his own headquarters, case in hand */}
    <group position={[lerp(0.4, -5.2, Easing.inOut(Easing.cubic)(outK)), 0, -9.6]}>
      <Person p={[0, 0, 0]} h={3.8} look={jensen} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.4, tilt: -0.04, walk: outK > 0 && outK < 1 ? t * 5.6 : 0, speed: 1.4 }} />
    </group>
    <Box p={[lerp(-0.75, -6.35, Easing.inOut(Easing.cubic)(outK)), 0.55, -9.3]} s={[0.95, 1.1, 0.35]} color="#5c4326" line={2} />
    {bK > 0.02 ? <group position={[0, 12.9, -11.6]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={11.2} bg="#0d2417" frame="#2fd46a" lines={[{ t: "11 DAYS", s: 110, c: "#8affc1" }, { t: "WITHOUT ITS FOUNDER", s: 62, c: "#f5f7fa" }]} /></group> : null}
    <Sign p={[0, 17.6, -11.4]} s={[6.4, 0.9]} text="NVIDIA HQ" bg="#0d2417" fg="#8affc1" size={104} frame="#2fd46a" />
  </>);
};

/* =================== S2 6.21 – 22.91  the fall =================== */
const K2: Key[] = [
  { t: 6.21, pos: [0, 4.4, 16.4], look: [0, 4.2, -6], fov: 60 },
  { t: 22.91, pos: [0, 4.2, 14.6], look: [0, 4.2, -6], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const calK = seg(t, 6.6, 7.15, Easing.out(Easing.back(1.7)));
  const hK = seg(t, 8.6, 9.15, Easing.out(Easing.back(1.7)));
  const mK = seg(t, 15.5, 16.05, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 18.0, 18.55, Easing.out(Easing.back(1.7)));
  const eK = seg(t, 20.6, 21.15, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#1a2436" b="#141d2e" unit={2} w={56} d={46} />
    <Box p={[0, 5.6, -10.2]} s={[27, 11.2, 0.4]} color="#26334d" line={0} />
    {/* the boardroom desk: the chairman, and the founder handing over his letter */}
    <Desk p={[-2.2, 0, -6.6]} w={5.6} top="#3a2e20" leg="#241b12" />
    <Box p={[-2.2, 1.62, -6.9]} s={[1.5, 0.06, 1.05]} color="#f5f7fa" line={1} rot={[0, 0.25, 0]} />
    <Person p={[-2.2, 0, -8.3]} h={3.9} look={jones} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.3 }} />
    <Person p={[-4.9, 0, -5.2]} h={3.8} look={jensen} f={f} pose={{ mood: "worry", arms: "point", armK: 0.8, armR: [0.8, 0.6], lookX: 0.55, tilt: -0.04 }} />
    {/* the other figure in the reports */}
    <Person p={[5.4, 0, -4.6]} h={3.7} look={alice} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.35 }} />
    <Monitor p={[2.6, 1.95, -7.4]} s={1.0} screen="#0f2f47" />
    <Plant p={[-8.8, 0, -4]} />
    <Plant p={[8.8, 0, -4]} />
    {calK > 0.02 ? <group position={[-6.1, 12.3, -10]} scale={[calK, calK, 1]}><Board p={[0, 0, 0]} w={5.9} lines={[{ t: "12 NOV", s: 96, c: "#ffd36a" }, { t: "ANNOUNCED", s: 56, c: "#f5f7fa" }]} /></group> : null}
    {hK > 0.02 ? <group position={[4.4, 12.4, -10]} scale={[hK, hK, 1]}><Board p={[0, 0, 0]} w={8.2} bg="#2a0f14" frame="#e5233a" lines={[{ t: "THE CEO", s: 84, c: "#ff9a8a" }, { t: "RESIGNS", s: 84, c: "#f5f7fa" }]} /></group> : null}
    {mK > 0.02 ? <group position={[2.2, 5.9, -5.6]} scale={[mK, mK, 1]}><Sign p={[0, 0, 0]} s={[7.2, 0.95]} text="MEGASPEED — SINGAPORE" bg="#101828" fg="#ffd36a" size={88} frame="#c9a227" /></group> : null}
    {sK > 0.02 ? <group position={[-0.6, 8.6, -9.6]} scale={[sK, sK, 1]}><Board p={[0, 0, 0]} w={9.8} bg="#2a0f14" frame="#e5233a" lines={[{ t: "SUSPECTED OF SPYING", s: 72, c: "#ff9a8a" }, { t: "ALLEGED — NEVER PROVEN", s: 52, c: "#f5f7fa" }]} /></group> : null}
    {eK > 0.02 ? <group position={[0, 12.9, -10.4]} scale={[eK, eK, 1]}><Sign p={[0, 0, 0]} s={[10.6, 0.95]} text="NO EVIDENCE MADE PUBLIC" bg="#0d2f1a" fg="#8affc1" size={96} frame="#2fd46a" /></group> : null}
  </>);
};

/* =================== S3 22.91 – 32.08  the hole: value plunges, board says no =================== */
const K3: Key[] = [
  { t: 22.91, pos: [0, 4.6, 17.2], look: [0, 4.6, -6], fov: 60 },
  { t: 32.08, pos: [0, 4.4, 15.4], look: [0, 4.6, -6], fov: 57 },
];
const S3 = ({ t, f }: Ctx) => {
  const nK = seg(t, 26.3, 26.85, Easing.out(Easing.back(1.7)));
  const calK = seg(t, 28.9, 29.45, Easing.out(Easing.back(1.7)));
  const stK = seg(t, 29.4, 29.85, Easing.out(Easing.back(2.2)));
  return (<>
    <Cam t={t} keys={K3} impacts={[[29.45, 0.09]]} />
    <Lights warm="#dfe8ff" />
    <Floor kind="carpet" a="#141d30" b="#101828" unit={2} w={54} d={46} />
    {/* the plunging chart wall */}
    <CanvasPlane p={[0, 6.9, -10.2]} s={[15.5, 8.6]} px={[1024, 568]} frame="#39496b" draw={(c, W, H) => {
      c.fillStyle = "#0b1424"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "#26334d"; c.lineWidth = 3;
      for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, i * H / 6); c.lineTo(W, i * H / 6); c.stroke(); }
      const pts: [number, number][] = [[70, 90], [220, 110], [370, 150], [520, 240], [660, 360], [800, 430], [950, 480]];
      c.strokeStyle = "#e5233a"; c.lineWidth = 15; c.lineJoin = "round"; c.beginPath();
      pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
      c.fillStyle = "#e5233a"; c.beginPath(); c.moveTo(950, 480); c.lineTo(918, 452); c.lineTo(986, 448); c.closePath(); c.fill();
      c.fillStyle = "#8affc1"; c.font = "900 54px Inter, Arial"; c.textAlign = "left"; c.textBaseline = "middle";
      c.fillText("NVIDIA SHARES", 56, 44);
    }} />
    {/* the founder watches the fall */}
    <Person p={[-6.4, 0, -4.2]} h={3.8} look={jensen} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.45, nerv: 0.55 }} />
    <Person p={[6.6, 0, -4.4]} h={3.9} look={jones} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    {nK > 0.02 ? <group position={[0, 13.1, -10.6]} scale={[nK, nK, 1]}><Board p={[0, 0, 0]} w={11.6} bg="#2a0f14" frame="#e5233a" lines={[{ t: "1.2 TRILLION DOLLARS", s: 74, c: "#ff9a8a" }, { t: "OF VALUE — GONE", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {calK > 0.02 ? <group position={[-6.9, 12.4, -10.2]} scale={[calK, calK, 1]}><Board p={[0, 0, 0]} w={5.4} lines={[{ t: "17 NOV", s: 92, c: "#ffd36a" }, { t: "THE BOARD:", s: 54, c: "#f5f7fa" }]} /></group> : null}
    {stK > 0.02 ? <group position={[3.2, 12.2, -10]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={7.6} text="NO WAY BACK" /></group> : null}
  </>);
};

/* =================== S4 32.08 – 45.07  Washington flips the board =================== */
const K4: Key[] = [
  { t: 32.08, pos: [0, 4.5, 17.8], look: [0, 4.4, -6], fov: 60 },
  { t: 45.07, pos: [0, 4.3, 15.6], look: [0, 4.4, -6], fov: 57 },
];
const S4 = ({ t, f }: Ctx) => {
  const wK = seg(t, 32.6, 33.15, Easing.out(Easing.back(1.7)));
  const uK = seg(t, 34.2, 34.75, Easing.out(Easing.back(1.7)));
  const pK = seg(t, 37.6, 38.15, Easing.out(Easing.back(1.7)));
  const calK = seg(t, 39.5, 40.05, Easing.out(Easing.back(1.7)));
  const rK = seg(t, 40.6, 41.15, Easing.out(Easing.back(1.7)));
  const inK = clamp(seg(t, 42.3, 44.2));
  const chK = seg(t, 44.7, 45.07, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1b2a44" b="#16233a" unit={2.6} w={60} d={50} />
    <Box p={[0, 5.8, -10.4]} s={[27, 11.6, 0.4]} color="#22314e" line={0} />
    {/* the long boardroom table and the directors */}
    <Box p={[0, 1.15, -6.6]} s={[13.5, 0.4, 2.7]} color="#3a2e20" line={2} />
    {[-5.4, -2.7, 2.7, 5.4].map((x, i) => (
      <Person key={i} p={[x, 0, -8.2]} h={3.8} look={i % 2 ? director2 : director} f={f + i * 9} pose={{ mood: "deadpan", arms: "down", lookX: i < 2 ? 0.3 : -0.3 }} />
    ))}
    {/* the chairman's tall chair, centre — his from the start, and it stays his */}
    <group position={[0, 0, -8.6]}>
      <Box p={[0, 2.6, 0]} s={[2.3, 5.2, 0.5]} color="#5c4326" line={2} />
      <Box p={[0, 0.9, 0.35]} s={[2.3, 1.8, 0.5]} color="#6d4f2c" line={2} />
      <Ball p={[0, 5.45, 0]} r={0.32} color="#ffd36a" ink={0.02} />
    </group>
    <Person p={[1.9, 0, -8.2]} h={3.9} look={jones} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.25 }} />
    {/* the official who leans on the board, phone in hand */}
    <Person p={[-6.9, 0, -3.6]} h={3.9} look={official} f={f} pose={{ mood: "smile", arms: "point", armK: 0.85, armR: [0.9, 0.75], lookX: 0.5 }} />
    <Box p={[-5.9, 2.6, -3.3]} s={[0.34, 0.62, 0.08]} color="#14141f" line={1} rot={[0, 0, -0.2]} />
    {/* the founder returns through the door */}
    <group position={[lerp(9.2, 4.6, Easing.inOut(Easing.cubic)(inK)), 0, -5.6]}>
      <Person p={[0, 0, 0]} h={3.8} look={jensen} f={f} pose={{ mood: "smile", arms: "down", lookX: -0.35, walk: inK > 0 && inK < 1 ? t * 5.6 : 0, speed: 1.4 }} />
    </group>
    {wK > 0.02 ? <group position={[-4.6, 7.7, -4.6]} scale={[wK, wK, 1]}><Sign p={[0, 0, 0]} s={[5.2, 0.9]} text="WASHINGTON" bg="#101828" fg="#8ae8ff" size={100} frame="#38b6d9" /></group> : null}
    {uK > 0.02 ? <group position={[0, 13, -10.6]} scale={[uK, uK, 1]}><Board p={[0, 0, 0]} w={11.4} lines={[{ t: "THE PRESIDENT URGES:", s: 66, c: "#8ae8ff" }, { t: "BRING HIM BACK", s: 84, c: "#ffd36a" }]} /></group> : null}
    {pK > 0.02 ? <group position={[5.0, 9.4, -9.8]} scale={[pK, pK, 1]}><Board p={[0, 0, 0]} w={6.2} bg="#0d2f47" frame="#38b6d9" lines={[{ t: "OFFICIALS", s: 62, c: "#8ae8ff" }, { t: "PRESS THE BOARD", s: 50, c: "#f5f7fa" }]} /></group> : null}
    {calK > 0.02 ? <group position={[-7, 12.5, -10.2]} scale={[calK, calK, 1]}><Board p={[0, 0, 0]} w={5.4} lines={[{ t: "23 NOV", s: 92, c: "#ffd36a" }, { t: "THE VOTE", s: 54, c: "#f5f7fa" }]} /></group> : null}
    {rK > 0.02 ? <group position={[-1.6, 9.9, -10.2]} scale={[rK, rK, 1]}><Board p={[0, 0, 0]} w={9.4} bg="#0d2f1a" frame="#2fd46a" lines={[{ t: "REINSTATED", s: 88, c: "#8affc1" }, { t: "UNANIMOUS", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {chK > 0.02 ? <group position={[0, 6.6, -9.9]} scale={[chK, chK, 1]}><Sign p={[0, 0, 0]} s={[10.8, 0.95]} text="CHAIRMAN: STILL JONES" bg="#101828" fg="#ffd36a" size={96} frame="#c9a227" /></group> : null}
  </>);
};

/* =================== S5 45.07 – 54.02  the twist: the shipments stop =================== */
const K5: Key[] = [
  { t: 45.07, pos: [0, 4.5, 17.6], look: [0, 4.4, -6], fov: 60 },
  { t: 54.02, pos: [0, 4.3, 15.6], look: [0, 4.4, -6], fov: 57 },
];
const S5 = ({ t, f }: Ctx) => {
  const dK = seg(t, 48.4, 48.95, Easing.out(Easing.back(1.7)));
  const haltT = Math.min(t, 49.8);
  const beltItem = (i: number) => {
    const ph = ((haltT * 0.85 + i * 1.9) % 10.4);
    return <Crate key={i} p={[-8.2 + ph, 1.95, -2.8]} label="AI SERVER" />;
  };
  const country = (x: number, y: number, at: number, name: string, gold?: boolean) => {
    const k = seg(t, at, at + 0.5, Easing.out(Easing.back(1.7)));
    return k > 0.02 ? (
      <group key={name} position={[x, y, -9.6]} scale={[k, k, 1]}>
        <Board p={[0, 0, 0]} w={4.1} bg={gold ? "#2a2210" : "#101828"} frame={gold ? "#ffd36a" : "#39496b"} lines={[{ t: name, s: 84, c: gold ? "#ffd36a" : "#f5f7fa" }]} />
      </group>
    ) : null;
  };
  const halted = t > 49.8;
  return (<>
    <Cam t={t} keys={K5} impacts={[[49.85, 0.1]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#232a33" b="#1b2129" unit={2.6} w={60} d={50} />
    <Box p={[0, 5.6, -10.4]} s={[27, 11.2, 0.4]} color="#2c3646" line={0} />
    {/* the conveyor: server crates ride until the halt lands at 49.8 */}
    <Box p={[0, 1.15, -2.8]} s={[17.5, 0.45, 1.9]} color="#39424c" line={2} />
    {[0, 1, 2, 3, 4, 5].map(beltItem)}
    {/* the partner stacks, labelled when their names are spoken */}
    <Crate p={[-5.9, 0.75, -7.6]} label="DELL" />
    <Crate p={[-5.9, 2.3, -7.6]} label="DELL" />
    <Crate p={[5.9, 0.75, -7.6]} label="SUPERMICRO" col="#ffd36a" />
    <Crate p={[5.9, 2.3, -7.6]} label="SUPERMICRO" col="#ffd36a" />
    {dK > 0.02 ? <group position={[0, 14.3, -10.4]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[11.8, 0.95]} text="DELL + SUPERMICRO: STOP SHIPPING" bg="#2a0f14" fg="#ff9a8a" size={84} frame="#e5233a" /></group> : null}
    {/* the warning light */}
    <Ball p={[0, 8.6, -9.9]} r={0.42} color={halted ? "#ff4a3c" : "#3a4353"} ink={0.02} />
    <Glow p={[0, 8.6, -9.5]} r={2.6} color="#ff4a3c" o={halted ? 0.5 + 0.25 * Math.sin(t * 6) : 0} />
    {/* the dockworker watches the line die */}
    <Person p={[-4.6, 0, -4.4]} h={3.8} look={dockworker} f={f} pose={{ mood: halted ? "worry" : "deadpan", arms: "down", lookX: 0.45 }} />
    {country(-5.6, 10.9, 51.3, "MALAYSIA")}
    {country(-1.9, 11.3, 52.0, "SINGAPORE")}
    {country(1.9, 11.3, 52.8, "THAILAND")}
    {country(5.6, 10.9, 53.5, "INDONESIA", true)}
    {t > 53.95 ? <group position={[0, 7.4, -9.4]} scale={[seg(t, 53.95, 54.02, Easing.out(Easing.back(2.2))), seg(t, 53.95, 54.02, Easing.out(Easing.back(2.2))), 1]}><Stamp p={[0, 0, 0]} w={8.6} text="SHIPMENTS HALTED" /></group> : null}
  </>);
};

/* =================== S6 54.02 – 59.40  why: the licence rule =================== */
const K6: Key[] = [
  { t: 54.02, pos: [0, 4.5, 17.4], look: [0, 4.4, -6], fov: 60 },
  { t: 59.40, pos: [0, 4.3, 15.4], look: [0, 4.4, -6], fov: 57 },
];
const S6 = ({ t, f }: Ctx) => {
  const dK = seg(t, 55.1, 55.65, Easing.out(Easing.back(1.7)));
  const lK = seg(t, 56.3, 56.85, Easing.out(Easing.back(1.7)));
  const aK = seg(t, 58.1, 58.55, Easing.out(Easing.back(2.2)));
  /* dotted route: beads bend from the crates toward the China board */
  const bead = (i: number) => {
    const u = i / 9, x = lerp(2.2, 5.6, u), y = 2.6 + Math.sin(u * Math.PI) * 2.2, z = -7.4;
    return <Ball key={i} p={[x, y, z]} r={0.14} color="#ffd36a" ink={0.01} />;
  };
  return (<>
    <Cam t={t} keys={K6} impacts={[[58.15, 0.09]]} />
    <Lights warm="#dfe8ff" />
    <Floor kind="carpet" a="#131c2e" b="#0f1624" unit={2} w={56} d={46} />
    {/* the rule document, giant */}
    <group position={[-3.4, 7.6, -10.2]}>
      <CanvasPlane p={[0, 0, 0]} s={[9.6, 7.2]} px={[760, 570]} frame="#c9a227" draw={(c, W, H) => {
        c.fillStyle = "#e9e4d8"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#23232e"; c.textAlign = "center"; c.textBaseline = "middle";
        c.font = "900 66px Inter, Arial"; c.fillText("NEW US RULE", W / 2, 62);
        c.font = "900 44px Inter, Arial"; c.fillStyle = "#5a6274"; c.fillText("DEPARTMENT OF COMMERCE", W / 2, 122);
        c.fillStyle = "#5a6274";
        for (let i = 0; i < 5; i++) c.fillRect(70, 180 + i * 56, W - 140 - (i % 2) * 170, 15);
        c.strokeStyle = "#e5233a"; c.lineWidth = 7; c.beginPath(); c.arc(W - 130, H - 105, 62, 0, 7); c.stroke();
        c.fillStyle = "#e5233a"; c.font = "900 34px Inter, Arial"; c.fillText("US", W - 130, H - 105);
      }} />
    </group>
    {/* crates waiting at the start of the route */}
    <Crate p={[1.4, 0.75, -6.2]} label="AI SERVER" />
    <Crate p={[3.4, 0.75, -6.6]} label="AI SERVER" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(bead)}
    <Board p={[5.0, 8.9, -9.8]} w={4.8} bg="#2a0f14" frame="#e5233a" lines={[{ t: "CHINA", s: 96, c: "#ff9a8a" }]} />
    {/* a data-centre tower waiting in the dark, far left */}
    <group position={[-10.6, 0, -13]}>
      <Box p={[0, 5, 0]} s={[5.5, 10, 2.4]} color="#141f33" line={1} />
      <CanvasPlane p={[0, 5, 1.26]} s={[4.9, 9.2]} px={[256, 480]} draw={(c, W, H) => {
        c.fillStyle = "#101a2c"; c.fillRect(0, 0, W, H);
        for (let r = 0; r < 12; r++) for (let i = 0; i < 4; i++) { c.fillStyle = rnd(r * 17 + i * 3) > 0.8 ? "#2b4a73" : "#0a1120"; c.fillRect(14 + i * ((W - 28) / 4), 12 + r * ((H - 24) / 12), (W - 28) / 4 - 9, (H - 24) / 12 - 8); }
      }} />
    </group>
    {dK > 0.02 ? <group position={[-3.4, 14.9, -10.4]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="EFFECTIVE 19 NOV" bg="#101828" fg="#ffd36a" size={100} frame="#c9a227" /></group> : null}
    {lK > 0.02 ? <group position={[1.8, 13.1, -10.6]} scale={[lK, lK, 1]}><Board p={[0, 0, 0]} w={9.8} lines={[{ t: "EXPORT LICENCES", s: 76, c: "#ffd36a" }, { t: "NOW REQUIRED", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {aK > 0.02 ? <group position={[3.6, 5.9, -8.9]} scale={[aK, aK, 1]}><Stamp p={[0, 0, 0]} w={6.2} text="ALLEGED ROUTES" /></group> : null}
  </>);
};

/* =================== S7 59.40 – 62.60  closer: investigations open =================== */
const K7: Key[] = [
  { t: 59.40, pos: [0, 4.5, 17.8], look: [0, 4.6, -6], fov: 60 },
  { t: 62.60, pos: [0, 4.3, 16.0], look: [0, 4.6, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const iK = seg(t, 59.8, 60.35, Easing.out(Easing.back(2.2)));
  const sK = seg(t, 61.4, 61.95, Easing.out(Easing.back(1.7)));
  const brandK = seg(t, 62.15, 62.55, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} impacts={[[59.85, 0.09]]} />
    <Lights warm="#bcd2ff" />
    <Stars p={[0, 15, -28]} s={[50, 16]} t={t} />
    <Floor kind="tile" a="#101a14" b="#0c1410" unit={2.6} w={60} d={52} />
    {/* the tower again — and the corner office light is back ON */}
    <Tower p={[0, 0, -14]} s={0.92} topLit={true} />
    <Glow p={[3.3, 13.8, -12.2]} r={3} color="#ffd36a" o={0.4} />
    {/* the open files, stacked in the foreground */}
    <group position={[-4.9, 0, -5.2]}>
      <Box p={[0, 0.5, 0]} s={[3.4, 1, 2.4]} color="#5c4326" line={2} rot={[0, 0.15, 0]} />
      <Box p={[0.15, 1.45, 0]} s={[3.2, 0.9, 2.2]} color="#6d4f2c" line={2} rot={[0, -0.1, 0]} />
      <Box p={[-0.1, 2.3, 0]} s={[3, 0.8, 2]} color="#54401f" line={2} rot={[0, 0.3, 0]} />
    </group>
    {/* the founder, back on the pavement, looking up at his lit office */}
    <Person p={[3.6, 0, -4.6]} h={3.8} look={jensen} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.2 }} />
    {iK > 0.02 ? <group position={[-3.4, 4.8, -5]} scale={[iK, iK, 1]}><Stamp p={[0, 0, 0]} w={5.8} text="INVESTIGATIONS OPEN" /></group> : null}
    {sK > 0.02 ? <group position={[0, 11.6, -11]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.4, 0.95]} text="THE SAGA IS NOT OVER" bg="#101828" fg="#ffd36a" size={100} frame="#c9a227" /></group> : null}
    {brandK > 0.02 ? <group position={[0, 9.2, -10.6]} scale={[brandK, brandK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={100} frame="#7a4a8c" /></group> : null}
  </>);
};

const CUTS = [0, 6.21, 22.91, 32.08, 45.07, 54.02, 59.40, 62.60];
export const TdnV19: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#08130d">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#101c30" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#0a1220">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#0e1a30" trans="flash">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#12161c">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#0a1120">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#08130d" trans="whip">{(c) => <S7 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 6.21 ? "rgba(80,220,150,.06)" : t < 22.91 ? "rgba(255,200,110,.06)" : t < 32.08 ? "rgba(255,90,80,.06)" : t < 45.07 ? "rgba(120,190,255,.06)" : t < 54.02 ? "rgba(255,170,80,.06)" : t < 59.40 ? "rgba(120,190,255,.07)" : "rgba(80,220,150,.06)"} />
      {/* S2 chip (9.5–16s): source attribution */}
      {t > 9.5 && t < 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            SOURCES: CNN · AFP · FINANCIAL TIMES
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
