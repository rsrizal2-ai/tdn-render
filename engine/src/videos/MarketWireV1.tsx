// The Market Wire #1 — "Stocks Partied, Bitcoin Got Left Out": Friday 27 Nov 2026 close.
// Wall Street and gold closed a huge week in the green (Dow 50,775 +1.18%, S&P 500 7,297
// +1.60%, Nasdaq 24,130 +2.31%; best week since April 2025; chips led: SanDisk +16%,
// Micron +7.6%, Marvell +7.3%, Tesla +5%, Amazon +4%, Nvidia +0.8%). Gold spot $3,653
// (+2.45%), first weekly gain in 3 weeks off Wednesday's 15-month low near $3,426; silver
// ~$43.7 (+5.3%). Crypto slid: BTC ~$59,800 (-3% 24h, briefly under $59,000 after a
// $62,139 high), ETH $1,656 (-5%), WLFI -18%, on continued US spot Bitcoin ETF outflows.
// Twist: whales (1,000-10,000 BTC wallets) added 121,117 BTC this quarter (CryptoQuant).
// Ahead: US jobs report Fri 4 Dec; Fed Dec 8-9, ~98% priced for a 25bp HIKE.
// Host: the channel's cartoon bull mascot (navy suit, sunglasses, gold SF emblem),
// drawn in code from the channel avatar art (saifu-avatar-final.png).
// 9:16 720x1280 30fps, 1635 frames (54.42 s voiceover). Production only — parent releases.
// CUTS = [0, 4.81, 14.81, 22.60, 30.26, 39.47, 47.10, 54.45].
// S1 hook scoreboard / S2 the indexes / S3 chips / S4 gold+silver / S5 crypto bleeds
// S6 the whale twist / S7 what to watch
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

/* ---------- shared boards (same pattern as TdnV18) ---------- */
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

/* =================== S1 0 – 4.81  hook: the Friday scoreboard =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.4, 17.6], look: [0, 4.2, -6], fov: 60 },
  { t: 4.81, pos: [0, 4.2, 15.6], look: [0, 4.2, -6], fov: 58 },
];
const S1 = ({ t }: Ctx) => {
  const hK = seg(t, 0.3, 0.8, Easing.out(Easing.back(1.7)));
  const aK = seg(t, 0.45, 0.95, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 1.95, 2.45, Easing.out(Easing.back(1.7)));
  const cK = seg(t, 3.05, 3.55, Easing.out(Easing.back(1.7)));
  const shake = t > 3.55 && t < 4.3 ? Math.sin(t * 55) * 0.07 : 0;
  return (<>
    <Cam t={t} keys={K1} impacts={[[3.1, 0.08]]} />
    <Lights warm="#bcd2ff" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={56} />
    <Box p={[0, 6.2, -12.5]} s={[30, 12.4, 0.4]} color="#16233a" line={0} />
    {hK > 0.02 ? <group position={[0, 12.0, -10.4]} scale={[hK, hK, 1]}><Sign p={[0, 0, 0]} s={[11.4, 0.95]} text="FRIDAY'S SCOREBOARD" bg="#101828" fg="#ffd36a" size={96} frame="#c9a227" /></group> : null}
    {aK > 0.02 ? <group position={[-4.75, 9.3, -10.6]} scale={[aK, aK, 1]}><Tile p={[0, 0, 0]} label="STOCKS" value="PARTY" pct="+2.3%" up /></group> : null}
    {bK > 0.02 ? <group position={[0, 9.3, -10.6]} scale={[bK, bK, 1]}><Tile p={[0, 0, 0]} label="GOLD" value="$3,653" pct="+2.45%" up /></group> : null}
    {cK > 0.02 ? <group position={[4.75 + shake, 9.3, -10.6]} scale={[cK, cK, 1]}><Tile p={[0, 0, 0]} label="BITCOIN" value="$59,800" pct="-3%" up={false} /></group> : null}
    {cK > 0.02 ? <Glow p={[4.75, 9.3, -9.8]} r={3.2} color="#ff4a3c" o={0.3 * cK} /> : null}
    <Bull p={[0, 0, -3.6]} t={t} pose="point" />
    <Plant p={[-6.4, 0, -4.5]} />
    <Plant p={[6.4, 0, -4.5]} />
  </>);
};

/* =================== S2 4.81 – 14.81  the indexes =================== */
const K2: Key[] = [
  { t: 4.81, pos: [0, 4.4, 17.2], look: [0, 4.2, -6], fov: 60 },
  { t: 14.81, pos: [0, 4.2, 15.2], look: [0, 4.2, -6], fov: 57 },
];
const S2 = ({ t }: Ctx) => {
  const dK = seg(t, 4.98, 5.5, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 7.18, 7.7, Easing.out(Easing.back(1.7)));
  const nK = seg(t, 10.58, 11.1, Easing.out(Easing.back(1.7)));
  const wK = seg(t, 12.62, 13.15, Easing.out(Easing.back(1.7)));
  const lt = t - 4.81;
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#14261c" b="#0f2016" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#12291a" line={0} />
    <group position={[0, 5.9, -12.2]}><CandleBoard p={[0, 0, 0]} w={13.5} up label="WALL STREET — FRIDAY" /></group>
    {dK > 0.02 ? <group position={[-4.75, 10.6, -10.4]} scale={[dK, dK, 1]}><Tile p={[0, 0, 0]} label="DOW" value="50,775" pct="+1.18%" up /></group> : null}
    {sK > 0.02 ? <group position={[0, 10.6, -10.4]} scale={[sK, sK, 1]}><Tile p={[0, 0, 0]} label="S&P 500" value="7,297" pct="+1.60%" up /></group> : null}
    {nK > 0.02 ? <group position={[4.75, 10.6, -10.4]} scale={[nK, nK, 1]}><Tile p={[0, 0, 0]} label="NASDAQ" value="24,130" pct="+2.31%" up /></group> : null}
    {wK > 0.02 ? <group position={[0, 13.35, -10.8]} scale={[wK, wK, 1]}><Sign p={[0, 0, 0]} s={[12.2, 0.95]} text="BEST WEEK SINCE APRIL 2025" bg="#0d2f1a" fg="#8affc1" size={86} frame="#2fd46a" /></group> : null}
    {/* confetti */}
    {Array.from({ length: 14 }, (_, i) => {
      const y = 13.5 - ((lt * 1.25 + i * 0.83) % 12.5);
      return <Box key={i} p={[-7.5 + rnd(i * 3.3) * 15, y, -6 - rnd(i * 7.1) * 3]} s={[0.34, 0.22, 0.04]} color={["#2fd46a", "#ffd36a", "#38b6d9", "#ff8ac2"][i % 4]} line={0} rot={[0, 0, lt * 2 + i]} />;
    })}
    <Bull p={[-4.55, 0, -3.4]} t={t} pose="point" s={0.78} />
  </>);
};

/* =================== S3 14.81 – 22.60  chips did the lifting =================== */
const K3: Key[] = [
  { t: 14.81, pos: [0, 4.4, 17.2], look: [0, 4.2, -6], fov: 60 },
  { t: 22.60, pos: [0, 4.2, 15.4], look: [0, 4.2, -6], fov: 57 },
];
const S3 = ({ t }: Ctx) => {
  const tile = (x: number, y: number, at: number, label: string, value: string, pct: string, dim?: boolean) => {
    const k = seg(t, at, at + 0.5, Easing.out(Easing.back(1.7)));
    return k > 0.02 ? <group key={label} position={[x, y, -10.6]} scale={[k, k, 1]}><Tile p={[0, 0, 0]} label={label} value={value} pct={pct} up dim={dim} /></group> : null;
  };
  const hK = seg(t, 15.0, 15.5, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1d2a44" b="#182540" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#1a2742" line={0} />
    {/* circuit traces on the back wall */}
    {[-8, -4, 0, 4, 8].map((x, i) => <Box key={i} p={[x, 6.4, -12.2]} s={[0.14, 11.5, 0.06]} color="#2b4a73" line={0} />)}
    {[3.2, 6.4, 9.6].map((y, i) => <Box key={"h" + i} p={[0, y, -12.2]} s={[24, 0.14, 0.06]} color="#2b4a73" line={0} />)}
    {hK > 0.02 ? <group position={[0, 13.3, -10.8]} scale={[hK, hK, 1]}><Sign p={[0, 0, 0]} s={[11.8, 0.95]} text="CHIPS DID THE LIFTING" bg="#101828" fg="#8ae8ff" size={92} frame="#38b6d9" /></group> : null}
    {tile(-4.75, 10.4, 16.95, "CHIP", "SANDISK", "+16%", false)}
    {tile(0, 10.4, 18.8, "CHIP", "MICRON", "+7.6%", false)}
    {tile(4.75, 10.4, 20.0, "CHIP", "MARVELL", "+7.3%", false)}
    {tile(-4.75, 6.6, 21.32, "EV", "TESLA", "+5%", false)}
    {tile(0, 6.6, 21.6, "TECH", "AMAZON", "+4%", false)}
    {tile(4.75, 6.6, 21.9, "AI CHIP", "NVIDIA", "+0.8%", true)}
    <Bull p={[4.65, 0, -3.2]} t={t} pose="thumb" s={0.78} />
  </>);
};

/* =================== S4 22.60 – 30.26  gold & silver shine =================== */
const K4: Key[] = [
  { t: 22.60, pos: [0, 4.4, 17.4], look: [0, 4.2, -6], fov: 60 },
  { t: 30.26, pos: [0, 4.2, 15.4], look: [0, 4.2, -6], fov: 57 },
];
const Bar: React.FC<{ p: V3; color: string; s?: number }> = ({ p, color, s = 1 }) => (
  <Box p={p} s={[1.9 * s, 0.52 * s, 1.0 * s]} color={color} line={2} rot={[0, 0.25, 0]} />
);
const S4 = ({ t }: Ctx) => {
  const gK = seg(t, 24.7, 25.25, Easing.out(Easing.back(1.7)));
  const fK = seg(t, 26.55, 27.1, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 28.55, 29.1, Easing.out(Easing.back(1.7)));
  const bounce = 0.5 + 0.5 * Math.abs(Math.sin((t - 22.6) * 2.4));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe9c4" />
    <Floor kind="marble" a="#241d10" b="#1c160b" unit={2.2} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#2a2110" line={0} />
    {/* the 15-month-low floor the metals bounced off */}
    <Box p={[0, 0.65, -8.6]} s={[17, 0.28, 2.2]} color="#4a3a16" line={2} />
    <group position={[-3.6, 1.75, -7.6]}><Sign p={[0, 0, 0]} s={[7.6, 0.75]} text="15-MONTH LOW $3,426" bg="#101828" fg="#ffd36a" size={88} frame="#c9a227" /></group>
    <group position={[-0.4, 3.1 + bounce * 0.5, -8.2]}><Arrow3D p={[0, 0, 0]} L={2.6} color="#2fd46a" rot={[0, 0, -0.7]} /></group>
    {/* gold stack + board */}
    {[-5.6, -3.9].map((x, i) => <Bar key={"g" + i} p={[x, 1.05, -6.6]} color="#e8b93c" />)}
    <Bar p={[-4.75, 1.58, -6.6]} color="#ffd94d" />
    <Glow p={[-4.75, 1.6, -6.2]} r={2.6} color="#ffd36a" o={0.4} />
    {gK > 0.02 ? <group position={[-4.75, 9.9, -10.6]} scale={[gK, gK, 1]}><Tile p={[0, 0, 0]} label="GOLD" value="$3,653" pct="+2.45%" up /></group> : null}
    {/* silver stack + board */}
    {[4.0, 5.6].map((x, i) => <Bar key={"s" + i} p={[x, 1.05, -6.6]} color="#c7cfdd" />)}
    <Bar p={[4.8, 1.58, -6.6]} color="#e8eef8" />
    <Glow p={[4.8, 1.6, -6.2]} r={2.4} color="#dfe8ff" o={0.35} />
    {sK > 0.02 ? <group position={[4.75, 9.9, -10.6]} scale={[sK, sK, 1]}><Tile p={[0, 0, 0]} label="SILVER" value="$43.7" pct="+5.3%" up /></group> : null}
    {fK > 0.02 ? <group position={[0, 13.3, -10.8]} scale={[fK, fK, 1]}><Sign p={[0, 0, 0]} s={[12.4, 0.95]} text="FIRST WEEKLY GAIN IN 3 WEEKS" bg="#0d2f1a" fg="#8affc1" size={80} frame="#2fd46a" /></group> : null}
    <Bull p={[2.6, 0, -3.3]} t={t} pose="point" s={0.8} />
  </>);
};

/* =================== S5 30.26 – 39.47  crypto bleeds =================== */
const K5: Key[] = [
  { t: 30.26, pos: [0, 4.4, 17.4], look: [0, 4.2, -6], fov: 60 },
  { t: 39.47, pos: [0, 4.2, 15.6], look: [0, 4.2, -6], fov: 58 },
];
const S5 = ({ t }: Ctx) => {
  const bK = seg(t, 31.62, 32.15, Easing.out(Easing.back(1.7)));
  const eK = seg(t, 34.05, 34.6, Easing.out(Easing.back(1.7)));
  const wK = seg(t, 36.4, 36.9, Easing.out(Easing.back(1.7)));
  const lK = seg(t, 37.78, 38.3, Easing.out(Easing.back(1.7)));
  const headShake = t > 34.2 && t < 36.4 ? Math.sin(t * 7) * 0.09 : 0;
  /* coins leak away to the right and drop */
  const leak = (i: number) => {
    const ph = ((t * 0.85 + i * 1.9) % 8.5);
    return <BtcCoin key={i} p={[-1 + ph * 0.9, 3.4 - Math.max(0, ph - 5.5) * 0.55, -7.6]} s={0.8} />;
  };
  return (<>
    <Cam t={t} keys={K5} impacts={[[30.5, 0.1]]} />
    <Lights warm="#dfe8ff" />
    <Floor kind="tile" a="#2a1216" b="#200d10" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#2c1218" line={0} />
    <group position={[-2.0, 6.1, -12.2]}><CandleBoard p={[0, 0, 0]} w={11.6} up={false} label="CRYPTO — 24 HOURS" /></group>
    {bK > 0.02 ? <group position={[-4.9, 10.9, -10.5]} scale={[bK, bK, 1]}><Tile p={[0, 0, 0]} label="BITCOIN" value="$59,800" pct="-3%" up={false} /></group> : null}
    {eK > 0.02 ? <group position={[-0.2, 10.9, -10.5]} scale={[eK, eK, 1]}><Tile p={[0, 0, 0]} label="ETHEREUM" value="$1,656" pct="-5%" up={false} /></group> : null}
    {wK > 0.02 ? <group position={[4.5, 10.9, -10.5]} scale={[wK, wK, 1]}><Tile p={[0, 0, 0]} label="WLFI" value="PLUNGED" pct="-18%" up={false} dim /></group> : null}
    {[0, 1, 2, 3, 4].map(leak)}
    {lK > 0.02 ? <group position={[0.6, 13.35, -10.8]} scale={[lK, lK, 1]}><Sign p={[0, 0, 0]} s={[11.8, 0.95]} text="ETF MONEY LEAKING OUT" bg="#2a0f14" fg="#ff9a8a" size={92} frame="#e5233a" /></group> : null}
    <Glow p={[0, 8, -11]} r={7} color="#ff4a3c" o={0.16} />
    <Bull p={[4.85, 0, -3.3]} t={t} pose="down" headTilt={headShake} s={0.8} />
  </>);
};

/* =================== S6 39.47 – 47.10  the whale twist =================== */
const K6: Key[] = [
  { t: 39.47, pos: [0, 4.6, 18.2], look: [0, 4.4, -6], fov: 60 },
  { t: 47.10, pos: [0, 4.4, 16.0], look: [0, 4.4, -6], fov: 57 },
];
const Whale: React.FC<{ p: V3; t: number }> = ({ p, t }) => {
  const rise = seg(t, 39.7, 41.6, Easing.out(Easing.cubic));
  const y = p[1] - 3.4 + rise * 3.4 + Math.sin(t * 1.3) * 0.14;
  return (
    <group position={[p[0], y, p[2]]}>
      <Ball p={[0, 0, 0]} r={1.5} color="#33507a" s={[2.4, 1.05, 1.05]} ink={0.06} />
      <Ball p={[0.1, -0.28, 0.18]} r={1.32} color="#bcd2ff" s={[2.25, 0.85, 0.92]} ink={0.02} />
      <Box p={[-4.3, 0.42, 0]} s={[1.5, 0.95, 0.24]} color="#33507a" line={2} rot={[0, 0, 0.5]} />
      <Box p={[-4.3, -0.35, 0]} s={[1.35, 0.85, 0.24]} color="#33507a" line={2} rot={[0, 0, -0.5]} />
      <Box p={[0.1, -1.05, 0]} s={[1.15, 0.75, 0.2]} color="#33507a" line={2} rot={[0, 0, 0.35]} />
      <Ball p={[2.62, 0.28, 0.98]} r={0.12} color="#0b0d1a" ink={0.01} />
      <Box p={[2.1, -0.6, 1.02]} s={[1.25, 0.09, 0.05]} color="#16233a" line={0} rot={[0, 0, -0.14]} />
    </group>
  );
};
const S6 = ({ t }: Ctx) => {
  const wK = seg(t, 40.95, 41.5, Easing.out(Easing.back(1.7)));
  const dK = seg(t, 46.3, 46.85, Easing.out(Easing.back(1.7)));
  /* coins stream from the left toward the whale's mouth */
  const feed = (i: number) => {
    const ph = ((t * 1.15 + i * 2.05) % 9.6);
    return <BtcCoin key={i} p={[-8.6 + ph, 5.6 + Math.sin(ph * 1.2) * 0.3, -8.6]} s={0.85} />;
  };
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#bcd2ff" />
    <Stars p={[0, 13.5, -26]} s={[48, 15]} t={t} />
    <Floor kind="tile" a="#0a1a30" b="#081426" unit={2.6} w={60} d={52} />
    {/* bubbles */}
    {Array.from({ length: 10 }, (_, i) => {
      const y = 1 + ((t * 0.55 + i * 1.31) % 10.5);
      return <Ball key={i} p={[-8 + rnd(i * 5.7) * 16, y, -9 - rnd(i * 3.1) * 3]} r={0.1 + rnd(i) * 0.13} color="#8ae8ff" ink={0.01} />;
    })}
    <Whale p={[1.8, 5.4, -9.5]} t={t} />
    {[0, 1, 2, 3, 4].map(feed)}
    {wK > 0.02 ? <group position={[0, 11.9, -10.8]} scale={[wK, wK, 1]}><Board p={[0, 0, 0]} w={12.6} lines={[{ t: "WHALES ADDED 121,117 BTC", s: 74, c: "#ffd36a" }, { t: "THIS QUARTER", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {dK > 0.02 ? <group position={[0, 9.3, -10.6]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[9.8, 0.95]} text="BUYING THE DIP" bg="#0d2f1a" fg="#8affc1" size={100} frame="#2fd46a" /></group> : null}
    <Bull p={[-4.7, 0, -3.3]} t={t} pose="thumb" s={0.8} />
  </>);
};

/* =================== S7 47.10 – 54.45  what to watch =================== */
const K7: Key[] = [
  { t: 47.10, pos: [0, 4.4, 17.6], look: [0, 4.3, -6], fov: 60 },
  { t: 54.45, pos: [0, 4.2, 15.6], look: [0, 4.3, -6], fov: 57 },
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
  const jK = seg(t, 48.05, 48.6, Easing.out(Easing.back(1.7)));
  const fK = seg(t, 49.68, 50.25, Easing.out(Easing.back(1.7)));
  const rK = seg(t, 52.3, 52.75, Easing.out(Easing.back(2.2)));
  const bK = seg(t, 52.62, 53.15, Easing.out(Easing.back(1.7)));
  const nK = seg(t, 53.3, 53.85, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} impacts={[[52.35, 0.09]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={52} />
    <Box p={[0, 6.4, -12.5]} s={[30, 12.8, 0.4]} color="#16233a" line={0} />
    {jK > 0.02 ? <group position={[-3.6, 10.5, -10.6]} scale={[jK, jK, 1]}><CalBoard p={[0, 0, 0]} w={5.6} top="FRIDAY · DEC" day="4" label="JOBS REPORT" col="#38b6d9" /></group> : null}
    {fK > 0.02 ? <group position={[3.6, 10.5, -10.6]} scale={[fK, fK, 1]}><CalBoard p={[0, 0, 0]} w={5.6} top="DEC" day="8–9" label="THE FED MEETS" col="#e5233a" /></group> : null}
    {rK > 0.02 ? <group position={[3.1, 6.45, -10.2]} scale={[rK, rK, 1]}><Stamp p={[0, 0, 0]} w={7.6} text="RATE HIKE 98% PRICED IN" /></group> : null}
    {bK > 0.02 ? <group position={[-4.35, 6.6, -10.4]} scale={[bK, bK, 1]}><Sign p={[0, 0, 0]} s={[6.4, 0.9]} text="THE MARKET WIRE" bg="#12081f" fg="#ffd36a" size={92} frame="#c9a227" /></group> : null}
    {nK > 0.02 ? <group position={[0, 3.1, -9.6]} scale={[nK, nK, 1]}><Board p={[0, 0, 0]} w={11.6} bg="#2a0f14" frame="#e5233a" lines={[{ t: "NOT FINANCIAL ADVICE", s: 76, c: "#ff9a8a" }]} /></group> : null}
    <Bull p={[0, 0, -3.5]} t={t} pose="shrug" s={0.8} />
  </>);
};

const CUTS = [0, 4.81, 14.81, 22.60, 30.26, 39.47, 47.10, 54.45];
export const MarketWireV1: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0a1120">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#0c1f14" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#101f38">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#171106" trans="flash">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#160a10">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#081426" trans="zoom">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#0a1120" trans="whip">{(c) => <S7 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.81 ? "rgba(120,190,255,.06)" : t < 14.81 ? "rgba(80,255,150,.05)" : t < 22.60 ? "rgba(120,190,255,.06)" : t < 30.26 ? "rgba(255,190,90,.08)" : t < 39.47 ? "rgba(255,80,60,.07)" : t < 47.10 ? "rgba(90,160,255,.07)" : "rgba(255,200,110,.06)"} />
      {/* S1 chip: data basis */}
      {t > 0.4 && t < 4.6 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 46, padding: "16px 30px", borderRadius: 18 }}>
            DATA: FRI CLOSE · CRYPTO 24H
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
