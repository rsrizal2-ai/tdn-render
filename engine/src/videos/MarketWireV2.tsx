// The Market Wire #2 — "December: Bottom or More Pain?": analysts split on Bitcoin.
// BTC ~$59,900 on Sat 28 Nov 2026, down ~26% in a month (from $81,255 on 28 Oct) and
// more than 50% below its October 2025 all-time high. US spot Bitcoin ETFs posted a
// RECORD November: ~$5.78B net outflows (Farside Investors via crypto.news); Friday
// alone -$389M, BlackRock's IBIT -$327M of it. Benjamin Cowen: price behaviour is
// broadly consistent with historical midterm-year cycles, eyes a possible December
// bottom (and has said a slide toward $42,000 could be on the books). Kyle du Plessis
// (Crypto Banter): warns of a bearish supercycle. Arthur Hayes: warned of a weekend
// dump. CryptoQuant analyst Shayan Markets: futures overheating cluster $59-61K,
// demand $55-57K, resistance $64-66K. Short-term holders (1-3 months) sit on an
// average unrealized loss of 25.8% (analyst Woominkyu). December tests: November
// monthly close, the Fed on 8-9 Dec, ETF flows, the $55-58K support zone.
// Host: the channel's cartoon bull mascot (navy suit, sunglasses, gold SF emblem),
// drawn in code from the channel avatar art (saifu-avatar-final.png).
// 9:16 720x1280 30fps, 1584 frames (52.72 s voiceover). Production only — parent releases.
// CUTS = [0, 4.15, 15.21, 25.43, 32.11, 38.57, 46.12, 52.80].
// S1 hook worst November / S2 the great ETF exit / S3 the damage / S4 the bull case
// S5 the bear case / S6 the levels / S7 December decides
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane } from "../style/toon";
import { Lights, Grade, Sign, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, Glow, Plant } from "../style/props";
import { Cam, Key, Stars, Arrow3D } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- scene wrapper (same pattern as MarketWireV1) ---------- */
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

/* ---------- shared boards (same pattern as MarketWireV1) ---------- */
const Board: React.FC<{ p: V3; w: number; lines: { t: string; s?: number; c?: string }[]; bg?: string; frame?: string }> = ({ p, w, lines, bg = "#101828", frame = "#c9a227" }) => (
  <CanvasPlane p={p} s={[w, w * 0.34]} px={[1024, 348]} frame={frame} draw={(c, W, H) => {
    c.fillStyle = bg; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
    const total = lines.reduce((a, l) => a + (l.s ?? 92), 0); let y = (H - total) / 2;
    for (const l of lines) { const s = l.s ?? 92; c.fillStyle = l.c ?? "#f5f7fa"; c.font = `900 ${s}px Inter, Arial`; c.fillText(l.t, W / 2, y + s / 2); y += s; }
  }} />
);
const Stamp: React.FC<{ p: V3; w: number; text: string; color?: string }> = ({ p, w, text, color = "#e5233a" }) => (
  <group position={p} rotation={[0, 0, -0.13]}>
    <CanvasPlane p={[0, 0, 0]} s={[w, w * 0.3]} px={[1024, 307]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.strokeStyle = color; c.lineWidth = 16; c.strokeRect(14, 14, W - 28, H - 28);
      c.fillStyle = color; c.textAlign = "center"; c.textBaseline = "middle";
      let fs = 118; c.font = `900 ${fs}px Inter, Arial`;
      while (c.measureText(text).width > W - 110 && fs > 30) { fs -= 6; c.font = `900 ${fs}px Inter, Arial`; }
      c.fillText(text, W / 2, H / 2 + 4);
    }} />
  </group>
);
/* a scoreboard tile: label, big value, coloured % pill */
const Tile: React.FC<{ p: V3; w?: number; label: string; value: string; pct: string; up: boolean; dim?: boolean }> = ({ p, w = 4.35, label, value, pct, up, dim }) => (
  <CanvasPlane p={p} s={[w, w * 0.78]} px={[560, 437]} frame={up ? "#2fd46a" : "#e5233a"} draw={(c, W, H) => {
    c.fillStyle = dim ? "#0b1220" : "#101828"; c.fillRect(0, 0, W, H);
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = dim ? "#5a7292" : "#8ae8ff"; c.font = "900 54px Inter, Arial"; c.fillText(label, W / 2, 58);
    c.fillStyle = dim ? "#7d8ea8" : "#f5f7fa"; let fs = 96; c.font = `900 ${fs}px Inter, Arial`;
    while (c.measureText(value).width > W - 40 && fs > 30) { fs -= 6; c.font = `900 ${fs}px Inter, Arial`; }
    c.fillText(value, W / 2, 168);
    const col = up ? "#2fd46a" : "#ff5a4c";
    c.fillStyle = col; const pw = 300, ph = 92, px = (W - pw) / 2, py = 268;
    c.beginPath(); c.roundRect(px, py, pw, ph, 40); c.fill();
    c.fillStyle = "#0b0d1a"; c.font = "900 62px Inter, Arial"; c.fillText((up ? "▲ " : "▼ ") + pct, W / 2, py + ph / 2 + 4);
    c.fillStyle = dim ? "#5a7292" : col; c.font = "900 44px Inter, Arial"; c.fillText(up ? "▲" : "▼", W / 2, H - 34);
  }} />
);
/* a candlestick chart board: green staircase up, or red staircase down */
const CandleBoard: React.FC<{ p: V3; w: number; up: boolean; label: string }> = ({ p, w, up, label }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[768, 476]} frame={up ? "#2fd46a" : "#e5233a"} draw={(c, W, H) => {
    c.fillStyle = "#0d1524"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "#22314e"; c.lineWidth = 2;
    for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(0, (H / 5) * i); c.lineTo(W, (H / 5) * i); c.stroke(); }
    const n = 9, cw = (W - 90) / n;
    for (let i = 0; i < n; i++) {
      const prog = i / (n - 1);
      const midY = up ? H * 0.78 - prog * H * 0.52 : H * 0.24 + prog * H * 0.52;
      const bh = 54 + rnd(i * 3) * 30, x = 45 + i * cw + cw * 0.18, bw = cw * 0.6;
      const col = up ? "#2fd46a" : "#ff5a4c";
      c.strokeStyle = col; c.lineWidth = 7;
      c.beginPath(); c.moveTo(x + bw / 2, midY - bh / 2 - 26); c.lineTo(x + bw / 2, midY + bh / 2 + 26); c.stroke();
      c.fillStyle = col; c.fillRect(x, midY - bh / 2, bw, bh);
    }
    c.fillStyle = up ? "#2fd46a" : "#ff5a4c"; c.textAlign = "left"; c.textBaseline = "middle";
    c.font = "900 52px Inter, Arial"; c.fillText(label, 34, 44);
  }} />
);
/* a descending cliff line-chart board (S3): $81,255 on 28 Oct down to ~$59,857 */
const CliffBoard: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[900, 558]} frame="#e5233a" draw={(c, W, H) => {
    c.fillStyle = "#0d1524"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "#22314e"; c.lineWidth = 2;
    for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(0, (H / 5) * i); c.lineTo(W, (H / 5) * i); c.stroke(); }
    const pts: [number, number][] = [[46, 120], [150, 150], [250, 138], [350, 210], [450, 250], [545, 238], [640, 320], [730, 360], [830, 430]];
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts.slice(1)) c.lineTo(x, y);
    c.lineTo(830, H - 6); c.lineTo(46, H - 6); c.closePath();
    c.fillStyle = "rgba(229,35,58,0.20)"; c.fill();
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts.slice(1)) c.lineTo(x, y);
    c.strokeStyle = "#ff5a4c"; c.lineWidth = 9; c.lineJoin = "round"; c.stroke();
    for (const [x, y] of [pts[0], pts[pts.length - 1]]) { c.fillStyle = "#ffd36a"; c.beginPath(); c.arc(x, y, 13, 0, 7); c.fill(); }
    c.fillStyle = "#f5f7fa"; c.textAlign = "left"; c.textBaseline = "middle";
    c.font = "900 44px Inter, Arial"; c.fillText("OCT 28 · $81,255", 40, 58);
    c.fillStyle = "#ff9a8a"; c.textAlign = "right"; c.fillText("NOW · $59,857", W - 36, 372);
    c.fillStyle = "#ff5a4c"; c.textAlign = "left"; c.font = "900 40px Inter, Arial"; c.fillText("BITCOIN — LAST 30 DAYS", 40, H - 52);
  }} />
);
/* a levels chart board (S6): red resistance band up top, green demand band below */
const ZoneChart: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[900, 558]} frame="#38b6d9" draw={(c, W, H) => {
    c.fillStyle = "#0d1524"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "#22314e"; c.lineWidth = 2;
    for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, (H / 6) * i); c.lineTo(W, (H / 6) * i); c.stroke(); }
    /* resistance band */
    c.fillStyle = "rgba(229,35,58,0.28)"; c.fillRect(30, 34, W - 60, 104);
    c.strokeStyle = "#e5233a"; c.lineWidth = 4; c.strokeRect(30, 34, W - 60, 104);
    c.fillStyle = "#ff9a8a"; c.textAlign = "right"; c.textBaseline = "middle"; c.font = "900 46px Inter, Arial";
    c.fillText("$64K – $66K", W - 52, 86);
    /* demand band */
    c.fillStyle = "rgba(47,212,106,0.25)"; c.fillRect(30, H - 138, W - 60, 104);
    c.strokeStyle = "#2fd46a"; c.lineWidth = 4; c.strokeRect(30, H - 138, W - 60, 104);
    c.fillStyle = "#8affc1"; c.textAlign = "right"; c.font = "900 46px Inter, Arial";
    c.fillText("$55K – $57K", W - 52, H - 86);
    /* candles sagging into the middle */
    const n = 8, cw = (W - 120) / n;
    for (let i = 0; i < n; i++) {
      const prog = i / (n - 1);
      const midY = H * 0.36 + prog * H * 0.14 + Math.sin(i * 2.3) * 12;
      const bh = 44 + rnd(i * 7) * 26, x = 60 + i * cw + cw * 0.2, bw = cw * 0.58;
      const col = i % 3 === 2 ? "#2fd46a" : "#ff5a4c";
      c.strokeStyle = col; c.lineWidth = 6;
      c.beginPath(); c.moveTo(x + bw / 2, midY - bh / 2 - 20); c.lineTo(x + bw / 2, midY + bh / 2 + 20); c.stroke();
      c.fillStyle = col; c.fillRect(x, midY - bh / 2, bw, bh);
    }
    /* the now line */
    const ny = H * 0.47;
    c.strokeStyle = "#ffd36a"; c.lineWidth = 5; c.setLineDash([16, 12]);
    c.beginPath(); c.moveTo(30, ny); c.lineTo(W - 30, ny); c.stroke(); c.setLineDash([]);
    c.fillStyle = "rgba(6,10,20,0.88)"; c.fillRect(34, ny - 76, 356, 56);
    c.fillStyle = "#ffd36a"; c.textAlign = "left"; c.font = "900 44px Inter, Arial";
    c.fillText("NOW ≈ $59.9K", 48, ny - 48);
  }} />
);
/* a gold Bitcoin coin */
const BtcCoin: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 0, 0]} rt={0.55} h={0.16} color="#f2a900" rot={[Math.PI / 2, 0, 0]} />
    <CanvasPlane p={[0, 0, 0.1]} s={[0.92, 0.92]} px={[128, 128]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = "#ffffff"; c.font = "900 82px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText("B", W / 2, H / 2 + 4);
    }} />
  </group>
);

/* ---------- the host: cartoon bull in a suit, from the channel avatar ---------- */
type BullPose = "point" | "down" | "shrug" | "thumb";
const Bull: React.FC<{ p: V3; t: number; pose?: BullPose; flip?: boolean; headTilt?: number; s?: number }> = ({ p, t, pose = "point", flip, headTilt = 0, s = 0.82 }) => {
  const bob = Math.sin(t * 2.1) * 0.045;
  const armRz: Record<BullPose, [number, number]> = {
    point: [-1.5, 0.14], down: [0.14, 0.14], shrug: [-2.25, 2.25], thumb: [-0.55, 0.14],
  };
  const [rzR, rzL] = armRz[pose];
  return (
    <group position={[p[0], p[1] + bob, p[2]]} scale={[s * (flip ? -1 : 1), s, s]}>
      {/* shoes + trousers */}
      <Box p={[-0.42, 0.12, 0.08]} s={[0.52, 0.24, 0.98]} color="#14141f" line={2} />
      <Box p={[0.42, 0.12, 0.08]} s={[0.52, 0.24, 0.98]} color="#14141f" line={2} />
      <Box p={[-0.42, 0.82, 0]} s={[0.54, 1.25, 0.62]} color="#23232e" line={2} />
      <Box p={[0.42, 0.82, 0]} s={[0.54, 1.25, 0.62]} color="#23232e" line={2} />
      {/* suit torso, shirt, gold tie */}
      <Box p={[0, 2.15, 0]} s={[1.95, 1.75, 1.02]} color="#1d2a44" line={3} />
      <Box p={[0, 2.18, 0.53]} s={[0.82, 1.5, 0.06]} color="#f5f7fa" line={1} />
      <Box p={[0, 2.2, 0.6]} s={[0.27, 1.15, 0.05]} color="#c9a227" line={1} />
      {/* gold SF chest emblem */}
      <CanvasPlane p={[0.63, 2.52, 0.56]} s={[0.54, 0.54]} px={[128, 128]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = "#c9a227"; c.beginPath(); c.arc(W / 2, H / 2, 58, 0, 7); c.fill();
        c.fillStyle = "#14141f"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SF", W / 2, H / 2 + 3);
      }} />
      {/* arms */}
      <group position={[1.08, 2.78, 0]} rotation={[0, 0, rzR]}>
        <Box p={[0, -0.58, 0]} s={[0.44, 1.3, 0.52]} color="#1d2a44" line={2} />
        <Ball p={[0, -1.32, 0]} r={0.22} color="#8a5a32" ink={0.03} />
        {pose === "thumb" ? <Box p={[0.05, -1.62, 0.05]} s={[0.16, 0.42, 0.16]} color="#8a5a32" line={1} /> : null}
      </group>
      <group position={[-1.08, 2.78, 0]} rotation={[0, 0, rzL]}>
        <Box p={[0, -0.58, 0]} s={[0.44, 1.3, 0.52]} color="#1d2a44" line={2} />
        <Ball p={[0, -1.32, 0]} r={0.22} color="#8a5a32" ink={0.03} />
      </group>
      {/* neck + head */}
      <Cyl p={[0, 3.12, 0]} rt={0.3} h={0.34} color="#7a4e2a" line={1} />
      <group position={[0, 3.92, 0]} rotation={[0, 0, headTilt]}>
        <Ball p={[0, 0, 0]} r={0.92} color="#8a5a32" s={[1.12, 0.98, 0.95]} ink={0.05} />
        {/* horns + ears */}
        <Cyl p={[-1.02, 0.44, -0.05]} rt={0.09} rb={0.17} h={0.95} color="#e9e4d8" line={2} rot={[0, 0, 0.85]} />
        <Cyl p={[1.02, 0.44, -0.05]} rt={0.09} rb={0.17} h={0.95} color="#e9e4d8" line={2} rot={[0, 0, -0.85]} />
        <Ball p={[-1.08, -0.02, 0]} r={0.3} color="#7a4e2a" s={[1, 0.55, 0.8]} ink={0.03} />
        <Ball p={[1.08, -0.02, 0]} r={0.3} color="#7a4e2a" s={[1, 0.55, 0.8]} ink={0.03} />
        {/* snout + nostrils */}
        <Ball p={[0, -0.34, 0.6]} r={0.5} color="#d9b98c" s={[1.25, 0.72, 0.8]} ink={0.04} />
        <Ball p={[-0.22, -0.3, 1.0]} r={0.07} color="#3a2415" ink={0.01} />
        <Ball p={[0.22, -0.3, 1.0]} r={0.07} color="#3a2415" ink={0.01} />
        {/* sunglasses */}
        <Box p={[-0.42, 0.14, 0.8]} s={[0.74, 0.42, 0.1]} color="#0b0d1a" line={2} />
        <Box p={[0.42, 0.14, 0.8]} s={[0.74, 0.42, 0.1]} color="#0b0d1a" line={2} />
        <Box p={[0, 0.14, 0.8]} s={[0.22, 0.09, 0.1]} color="#0b0d1a" line={1} />
      </group>
    </group>
  );
};

/* =================== S1 0 – 4.15  hook: the worst November on record =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.4, 17.6], look: [0, 4.2, -6], fov: 60 },
  { t: 4.15, pos: [0, 4.2, 16.2], look: [0, 4.2, -6], fov: 58 },
];
const S1 = ({ t }: Ctx) => {
  const hK = seg(t, 2.4, 2.9, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 2.5, 3.0, Easing.out(Easing.back(1.7)));
  const shake = t > 3.0 && t < 3.8 ? Math.sin(t * 55) * 0.06 : 0;
  return (<>
    <Cam t={t} keys={K1} impacts={[[1.0, 0.08]]} />
    <Lights warm="#dfe8ff" />
    <Floor kind="tile" a="#2a1216" b="#200d10" unit={2.4} w={60} d={56} />
    <Box p={[0, 6.2, -12.5]} s={[30, 12.4, 0.4]} color="#2c1218" line={0} />
    <group position={[0, 5.9, -12.2]}><CandleBoard p={[0, 0, 0]} w={13.2} up={false} label="BITCOIN — NOVEMBER" /></group>
    {hK > 0.02 ? <group position={[0, 12.35, -10.4]} scale={[hK, hK, 1]}><Sign p={[0, 0, 0]} s={[12.2, 0.95]} text="WORST NOVEMBER ON RECORD" bg="#2a0f14" fg="#ff9a8a" size={88} frame="#e5233a" /></group> : null}
    {bK > 0.02 ? <group position={[4.2 + shake, 10.2, -10.6]} scale={[bK, bK, 1]}><Tile p={[0, 0, 0]} label="BITCOIN" value="$59,900" pct="-26%" up={false} /></group> : null}
    <Glow p={[0, 7, -11]} r={7} color="#ff4a3c" o={0.15} />
    <Bull p={[-4.55, 0, -3.6]} t={t} pose="point" />
    <Plant p={[6.4, 0, -4.5]} />
  </>);
};

/* =================== S2 4.15 – 15.21  the great ETF exit =================== */
const K2: Key[] = [
  { t: 4.15, pos: [0, 4.4, 17.4], look: [0, 4.2, -6], fov: 60 },
  { t: 15.21, pos: [0, 4.2, 15.4], look: [0, 4.2, -6], fov: 57 },
];
const S2 = ({ t }: Ctx) => {
  const bK = seg(t, 5.25, 5.8, Easing.out(Easing.back(1.7)));
  const rK = seg(t, 7.03, 7.55, Easing.out(Easing.back(1.7)));
  const fK = seg(t, 9.44, 9.95, Easing.out(Easing.back(1.7)));
  const iK = seg(t, 13.62, 14.15, Easing.out(Easing.back(1.7)));
  /* coins stream right, out through the exit door */
  const flee = (i: number) => {
    const ph = ((t * 1.25 + i * 1.75) % 7.2);
    return <BtcCoin key={i} p={[-6.4 + ph * 1.8, 3.1 + Math.sin(ph * 1.6) * 0.25, -8.2]} s={0.8} />;
  };
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#bcd2ff" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#16233a" line={0} />
    {/* the exit door, back right */}
    <Box p={[6.3, 3.3, -11.4]} s={[2.3, 6.6, 0.2]} color="#04060c" line={0} />
    <Box p={[5.0, 3.4, -11.1]} s={[0.5, 6.9, 0.5]} color="#31435f" line={2} />
    <Box p={[7.6, 3.4, -11.1]} s={[0.5, 6.9, 0.5]} color="#31435f" line={2} />
    <Box p={[6.3, 7.05, -11.1]} s={[3.1, 0.5, 0.5]} color="#31435f" line={2} />
    <group position={[6.3, 7.85, -10.9]}><Sign p={[0, 0, 0]} s={[2.3, 0.72]} text="EXIT" bg="#2a0f14" fg="#ff9a8a" size={92} frame="#e5233a" /></group>
    {[0, 1, 2, 3, 4].map(flee)}
    {bK > 0.02 ? <group position={[0, 10.5, -10.7]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={12.8} lines={[{ t: "US BITCOIN ETFs — NOVEMBER", s: 56, c: "#8ae8ff" }, { t: "$5.78 BILLION OUT", s: 86, c: "#ff9a8a" }]} bg="#160d18" frame="#e5233a" /></group> : null}
    {rK > 0.02 ? <group position={[0, 13.5, -10.9]} scale={[rK, rK, 1]}><Sign p={[0, 0, 0]} s={[12.0, 0.9]} text="A RECORD MONTH OF EXITS" bg="#101828" fg="#ffd36a" size={88} frame="#c9a227" /></group> : null}
    {fK > 0.02 ? <group position={[-4.75, 6.35, -10.6]} scale={[fK, fK, 1]}><Tile p={[0, 0, 0]} label="FRIDAY ALONE" value="$389M" pct="OUT" up={false} /></group> : null}
    {iK > 0.02 ? <group position={[-0.35, 6.35, -10.6]} scale={[iK, iK, 1]}><Tile p={[0, 0, 0]} label="BLACKROCK IBIT" value="$327M" pct="OUT" up={false} dim /></group> : null}
    <Bull p={[-4.35, 0, -3.5]} t={t} pose="point" s={0.78} />
  </>);
};

/* =================== S3 15.21 – 25.43  the damage =================== */
const K3: Key[] = [
  { t: 15.21, pos: [0, 4.4, 17.4], look: [0, 4.2, -6], fov: 60 },
  { t: 25.43, pos: [0, 4.2, 15.6], look: [0, 4.2, -6], fov: 58 },
];
const S3 = ({ t }: Ctx) => {
  const mK = seg(t, 17.74, 18.25, Easing.out(Easing.back(1.7)));
  const pK = seg(t, 19.65, 20.15, Easing.out(Easing.back(1.7)));
  const hK = seg(t, 22.2, 22.7, Easing.out(Easing.back(1.7)));
  const headShake = t > 22.3 && t < 24.6 ? Math.sin(t * 7) * 0.09 : 0;
  /* coins tumble off the cliff edge */
  const drop = (i: number) => {
    const ph = ((t * 0.9 + i * 2.3) % 8.2);
    return <BtcCoin key={i} p={[-5.8 + ph * 0.78, 5.2 - Math.max(0, ph - 5.0) * 1.05, -7.8]} s={0.75} />;
  };
  return (<>
    <Cam t={t} keys={K3} impacts={[[15.5, 0.1]]} />
    <Lights warm="#dfe8ff" />
    <Floor kind="tile" a="#241114" b="#1b0d0f" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#2c1218" line={0} />
    <group position={[0, 5.55, -12.2]}><CliffBoard p={[0, 0, 0]} w={13.2} /></group>
    {mK > 0.02 ? <group position={[-4.75, 10.85, -10.6]} scale={[mK, mK, 1]}><Tile p={[0, 0, 0]} label="ONE MONTH" value="-26%" pct="DOWN" up={false} /></group> : null}
    {pK > 0.02 ? <group position={[4.75, 10.85, -10.6]} scale={[pK, pK, 1]}><Tile p={[0, 0, 0]} label="FROM THE PEAK" value="-50%+" pct="BELOW" up={false} /></group> : null}
    {hK > 0.02 ? <group position={[0, 13.5, -10.9]} scale={[hK, hK, 1]}><Sign p={[0, 0, 0]} s={[12.6, 0.9]} text="SHORT-TERM HOLDERS -25.8%" bg="#2a0f14" fg="#ff9a8a" size={80} frame="#e5233a" /></group> : null}
    {[0, 1, 2, 3].map(drop)}
    <Glow p={[0, 8, -11]} r={7} color="#ff4a3c" o={0.14} />
    <Bull p={[4.85, 0, -3.3]} t={t} pose="down" headTilt={headShake} s={0.8} />
  </>);
};

/* =================== S4 25.43 – 32.11  the bull case: Cowen =================== */
const K4: Key[] = [
  { t: 25.43, pos: [0, 4.4, 17.4], look: [0, 4.2, -6], fov: 60 },
  { t: 32.11, pos: [0, 4.2, 15.6], look: [0, 4.2, -6], fov: 58 },
];
const S4 = ({ t }: Ctx) => {
  const qK = seg(t, 25.5, 26.0, Easing.out(Easing.back(1.7)));
  const cK = seg(t, 26.8, 27.35, Easing.out(Easing.back(1.7)));
  const bounce = 0.5 + 0.5 * Math.abs(Math.sin((t - 25.4) * 2.6));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#14261c" b="#0f2016" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#12291a" line={0} />
    <group position={[-1.4, 5.8, -12.2]}><CandleBoard p={[0, 0, 0]} w={11.6} up label="THE CYCLE CHART" /></group>
    <group position={[-3.5, 2.6 + bounce * 0.55, -8.2]}><Arrow3D p={[0, 0, 0]} L={2.6} color="#2fd46a" rot={[0, 0, -0.7]} /></group>
    <Glow p={[-3.5, 3.2, -7.8]} r={2.4} color="#2fd46a" o={0.3} />
    {qK > 0.02 ? <group position={[0, 13.55, -10.9]} scale={[qK, qK, 1]}><Sign p={[0, 0, 0]} s={[10.6, 0.95]} text="IS THIS THE BOTTOM?" bg="#0d2f1a" fg="#8affc1" size={96} frame="#2fd46a" /></group> : null}
    {cK > 0.02 ? <group position={[0.4, 10.55, -10.7]} scale={[cK, cK, 1]}><Board p={[0, 0, 0]} w={12.4} lines={[{ t: "BENJAMIN COWEN", s: 62, c: "#8ae8ff" }, { t: "DECEMBER COULD MARK THE LOW", s: 54, c: "#8affc1" }]} bg="#0d2018" frame="#2fd46a" /></group> : null}
    <Bull p={[4.6, 0, -3.3]} t={t} pose="thumb" s={0.8} />
  </>);
};

/* =================== S5 32.11 – 38.57  the bear case: du Plessis + Hayes =================== */
const K5: Key[] = [
  { t: 32.11, pos: [0, 4.4, 17.4], look: [0, 4.2, -6], fov: 60 },
  { t: 38.57, pos: [0, 4.2, 15.6], look: [0, 4.2, -6], fov: 58 },
];
const S5 = ({ t }: Ctx) => {
  const dK = seg(t, 32.6, 33.15, Easing.out(Easing.back(1.7)));
  const hK = seg(t, 36.08, 36.6, Easing.out(Easing.back(1.7)));
  const headShake = t > 36.4 && t < 38.3 ? Math.sin(t * 7) * 0.09 : 0;
  /* rain streaks over the back wall */
  const rain = (i: number) => {
    const y = 13.5 - ((t * 6.5 + i * 1.37) % 13);
    return <Box key={i} p={[-8.5 + rnd(i * 3.9) * 17, y, -11.6]} s={[0.07, 0.85, 0.04]} color="#7fa8c9" line={0} rot={[0, 0, 0.18]} />;
  };
  return (<>
    <Cam t={t} keys={K5} impacts={[[32.4, 0.09]]} />
    <Lights warm="#cfd8ff" />
    <Floor kind="tile" a="#1d1426" b="#150e1d" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#241430" line={0} />
    {Array.from({ length: 16 }, (_, i) => rain(i))}
    {dK > 0.02 ? <group position={[1.8, 11.15, -10.7]} scale={[dK, dK, 1]}><Board p={[0, 0, 0]} w={11.6} lines={[{ t: "KYLE DU PLESSIS", s: 60, c: "#8ae8ff" }, { t: "BEARISH SUPERCYCLE", s: 62, c: "#ff9a8a" }]} bg="#170d20" frame="#e5233a" /></group> : null}
    {hK > 0.02 ? <group position={[1.8, 6.95, -10.7]} scale={[hK, hK, 1]}><Board p={[0, 0, 0]} w={11.6} lines={[{ t: "ARTHUR HAYES", s: 60, c: "#8ae8ff" }, { t: "BRACED FOR A WEEKEND DUMP", s: 50, c: "#ff9a8a" }]} bg="#170d20" frame="#e5233a" /></group> : null}
    <Glow p={[1.8, 9, -11]} r={7} color="#b04aff" o={0.13} />
    <Bull p={[-4.8, 0, -3.3]} t={t} pose="down" headTilt={headShake} s={0.8} />
  </>);
};

/* =================== S6 38.57 – 46.12  the levels =================== */
const K6: Key[] = [
  { t: 38.57, pos: [0, 4.4, 17.6], look: [0, 4.3, -6], fov: 60 },
  { t: 46.12, pos: [0, 4.2, 15.8], look: [0, 4.3, -6], fov: 58 },
];
const S6 = ({ t }: Ctx) => {
  const sK = seg(t, 38.98, 39.45, Easing.out(Easing.back(2.2)));
  const dK = seg(t, 40.11, 40.6, Easing.out(Easing.back(1.7)));
  const rK = seg(t, 43.32, 43.85, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K6} impacts={[[39.0, 0.09]]} />
    <Lights warm="#bcd2ff" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#16233a" line={0} />
    <group position={[0, 6.55, -12.2]}><ZoneChart p={[0, 0, 0]} w={13.5} /></group>
    {sK > 0.02 ? <group position={[0, 12.9, -10.3]} scale={[sK, sK, 1]}><Stamp p={[0, 0, 0]} w={8.2} text="FUTURES OVERHEATING $59-61K" /></group> : null}
    {dK > 0.02 ? <group position={[-3.35, 3.15, -10.2]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[6.5, 0.9]} text="DEMAND $55K-$57K" bg="#0d2f1a" fg="#8affc1" size={84} frame="#2fd46a" /></group> : null}
    {rK > 0.02 ? <group position={[3.35, 10.15, -10.2]} scale={[rK, rK, 1]}><Sign p={[0, 0, 0]} s={[6.5, 0.9]} text="RESISTANCE $64K-$66K" bg="#2a0f14" fg="#ff9a8a" size={76} frame="#e5233a" /></group> : null}
    <Bull p={[4.95, 0, -3.2]} t={t} pose="point" s={0.76} />
  </>);
};

/* =================== S7 46.12 – 52.80  December decides =================== */
const K7: Key[] = [
  { t: 46.12, pos: [0, 4.4, 17.6], look: [0, 4.3, -6], fov: 60 },
  { t: 52.80, pos: [0, 4.2, 15.6], look: [0, 4.3, -6], fov: 57 },
];
const CalBoard: React.FC<{ p: V3; w: number; top: string; day: string; label: string; col: string }> = ({ p, w, top, day, label, col }) => (
  <CanvasPlane p={p} s={[w, w * 0.92]} px={[512, 471]} frame={col} draw={(c, W, H) => {
    c.fillStyle = "#f5f7fa"; c.fillRect(0, 0, W, H);
    c.fillStyle = col; c.fillRect(0, 0, W, 108);
    c.fillStyle = "#ffffff"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(top, W / 2, 56);
    c.fillStyle = "#14141f"; c.font = "900 168px Inter, Arial"; c.fillText(day, W / 2, 240);
    c.fillStyle = col; c.font = "900 47px Inter, Arial"; c.fillText(label, W / 2, H - 52);
  }} />
);
const S7 = ({ t }: Ctx) => {
  const mK = seg(t, 47.25, 47.8, Easing.out(Easing.back(1.7)));
  const fK = seg(t, 48.38, 48.9, Easing.out(Easing.back(1.7)));
  const eK = seg(t, 49.7, 50.2, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 50.95, 51.45, Easing.out(Easing.back(1.7)));
  const nK = seg(t, 51.45, 52.0, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} impacts={[[51.5, 0.09]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#16233a" line={0} />
    {mK > 0.02 ? <group position={[-3.6, 10.5, -10.6]} scale={[mK, mK, 1]}><CalBoard p={[0, 0, 0]} w={5.6} top="NOVEMBER" day="30" label="MONTHLY CLOSE" col="#38b6d9" /></group> : null}
    {fK > 0.02 ? <group position={[3.6, 10.5, -10.6]} scale={[fK, fK, 1]}><CalBoard p={[0, 0, 0]} w={5.6} top="DEC" day="8-9" label="THE FED" col="#e5233a" /></group> : null}
    {eK > 0.02 ? <group position={[3.55, 6.5, -10.4]} scale={[eK, eK, 1]}><Board p={[0, 0, 0]} w={6.9} lines={[{ t: "ETF FLOWS", s: 58, c: "#8ae8ff" }, { t: "STILL LEAKING", s: 56, c: "#ff9a8a" }]} bg="#160d18" frame="#e5233a" /></group> : null}
    {bK > 0.02 ? <group position={[-4.35, 6.6, -10.4]} scale={[bK, bK, 1]}><Sign p={[0, 0, 0]} s={[6.4, 0.9]} text="THE MARKET WIRE" bg="#12081f" fg="#ffd36a" size={92} frame="#c9a227" /></group> : null}
    {nK > 0.02 ? <group position={[1.6, 3.05, -9.6]} scale={[nK, nK, 1]}><Board p={[0, 0, 0]} w={11.6} bg="#2a0f14" frame="#e5233a" lines={[{ t: "NOT FINANCIAL ADVICE", s: 76, c: "#ff9a8a" }]} /></group> : null}
    <Bull p={[-4.7, 0, -3.5]} t={t} pose="shrug" s={0.78} />
  </>);
};

const CUTS = [0, 4.15, 15.21, 25.43, 32.11, 38.57, 46.12, 52.80];
export const MarketWireV2: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#160a10">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#0a1120" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#160a10">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#0c1f14" trans="flash">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#12081f">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#0a1120" trans="zoom">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#0a1120" trans="whip">{(c) => <S7 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.15 ? "rgba(255,80,60,.07)" : t < 15.21 ? "rgba(120,190,255,.06)" : t < 25.43 ? "rgba(255,80,60,.07)" : t < 32.11 ? "rgba(80,255,150,.05)" : t < 38.57 ? "rgba(150,90,255,.06)" : t < 46.12 ? "rgba(120,190,255,.06)" : "rgba(255,200,110,.06)"} />
      {/* S1 chip: data basis */}
      {t > 0.4 && t < 2.3 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 46, padding: "16px 30px", borderRadius: 18 }}>
            DATA: NOVEMBER 2026 · FARSIDE
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
