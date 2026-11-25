// TDN v5 — "Taiwan's record rally lasted one day" — the Taiex posts its biggest one-day points
// gain ever on Tuesday (+3,310, +8.99%, TSMC limit-up), then plunges 3,440 points on Wednesday
// morning and erases it in hours. 9:16 720x1280 30fps, 918 frames (30.51 s voiceover).
// CUTS = [0, 4.5, 11.9, 17.6, 21.7, 27.9, 30.6].
// S1 Taipei plaza chart board + calendar / S2 staircase mountain, platform ride to 40,122
// S3 the giant TSMC chip lifts the whole market, LIMIT stamp / S4 Seoul column through the 5,000 arch
// S5 Wednesday: the red slide down, the record board cracks / S6 TDN sign-off desk (teal-gold).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Clock, Grade, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Plant, Frame, Lamp, Monitor, Chair, Rug, Dust } from "../style/props";
import { Cam, Key, Globe } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
// deterministic pseudo-random (no Math.random in render code)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const trader: Look = { skin: "#f0c8a0", body: "#0e7a6d", outfit: "shirt", hair: "short", hairColor: "#0d0d14", shoe: "#1b1b2a" };
const greeter: Look = { skin: "#ffd9b3", body: "#7a3aa0", outfit: "hoodie", hair: "swept", hairColor: "#14100a", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV1/TdnV2/TdnV3) ---------- */
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

/* =================== S1 0 – 4.5  "the best day in its history. It lasted one day." — plaza chart board =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.6, 12.8], look: [0, 3.0, -3], fov: 60 },
  { t: 4.5, pos: [0, 3.2, 11.0], look: [0, 3.2, -3], fov: 58 },
];
const ChartBoard: React.FC<{ t: number }> = ({ t }) => (
  <CanvasPlane p={[0.8, 4.6, -6.5]} s={[9.2, 5.4]} px={[920, 540]} frame="#10131c" draw={(c, W, H) => {
    c.fillStyle = "#0d1522"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(120,160,220,.18)"; c.lineWidth = 2;
    for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(0, (H / 5) * i); c.lineTo(W, (H / 5) * i); c.stroke(); }
    for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo((W / 6) * i, 0); c.lineTo((W / 6) * i, H); c.stroke(); }
    c.fillStyle = "#9fd0ff"; c.font = "900 54px Inter, Arial"; c.textAlign = "left"; c.fillText("TAIEX", 36, 70);
    c.fillStyle = "#5a7ba6"; c.font = "800 34px Inter, Arial"; c.fillText("TUESDAY 24 NOV", 36, 118);
    // the line: flat, then a rocket (progress p over "best day", 1.5 -> 2.6 s)
    const pts: [number, number][] = [[0.05, 0.78], [0.18, 0.77], [0.32, 0.79], [0.46, 0.76], [0.58, 0.63], [0.68, 0.45], [0.78, 0.29], [0.88, 0.16], [0.96, 0.09]];
    const p = seg(t, 1.5, 2.6, Easing.out(Easing.cubic));
    const upto = 3 + p * (pts.length - 1 - 3);
    c.strokeStyle = "#2fd46a"; c.lineWidth = 11; c.lineJoin = "round"; c.beginPath();
    pts.forEach(([x, y], i) => { if (i <= Math.floor(upto)) { const px = x * W, py = y * H; if (i === 0) c.moveTo(px, py); else c.lineTo(px, py); } });
    const fi = Math.min(pts.length - 2, Math.floor(upto)), fr = upto - fi;
    const hx = lerp(pts[fi][0], pts[fi + 1][0], fr) * W, hy = lerp(pts[fi][1], pts[fi + 1][1], fr) * H;
    c.lineTo(hx, hy); c.stroke();
    c.fillStyle = "#2fd46a"; c.beginPath(); c.arc(hx, hy, 15, 0, 7); c.fill();
    c.fillStyle = "#eafff1"; c.beginPath(); c.arc(hx, hy, 7, 0, 7); c.fill();
    if (t > 2.6) { c.fillStyle = "#ffd36a"; c.font = "900 64px Inter, Arial"; c.textAlign = "right"; c.fillText("+9%", W - 36, 84); }
  }} />
);
const CalendarPage: React.FC<{ t: number }> = ({ t }) => (
  <CanvasPlane p={[-4.7, 3.3, -3.2]} s={[2.3, 2.7]} px={[460, 540]} frame="#8a2a20" draw={(c, W, H) => {
    c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#c2372f"; c.fillRect(0, 0, W, H * 0.22);
    c.fillStyle = "#fff"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.fillText("NOV", W / 2, H * 0.155);
    c.fillStyle = "#1b1b2a"; c.font = "900 190px Inter, Arial"; c.fillText("24", W / 2, H * 0.62);
    c.fillStyle = "#5a5a6a"; c.font = "800 44px Inter, Arial"; c.fillText("TUESDAY", W / 2, H * 0.82);
    if (t > 3.31) {
      c.strokeStyle = "#e5233a"; c.lineWidth = 26; c.lineCap = "round";
      c.beginPath(); c.moveTo(W * 0.14, H * 0.3); c.lineTo(W * 0.86, H * 0.9); c.stroke();
      c.beginPath(); c.moveTo(W * 0.86, H * 0.3); c.lineTo(W * 0.14, H * 0.9); c.stroke();
      c.fillStyle = "#e5233a"; c.font = "900 58px Inter, Arial"; c.fillText("1 DAY!", W / 2, H * 0.965);
    }
  }} />
);
const S1 = ({ t, f }: Ctx) => {
  const candleH = lerp(0.5, 3.4, seg(t, 1.5, 2.6, Easing.out(Easing.cubic)));
  const confetti = t > 3.0 && t < 4.1 ? (t - 3.0) / 1.1 : 0;
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffd9ae" />
    <CanvasPlane p={[0, 14, -32]} s={[90, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a4a8f"); g.addColorStop(0.6, "#7a6aa8"); g.addColorStop(1, "#ff9a4a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[24, 8.5, -30]} r={2.9} color="#ffd36a" ink={0} />
    <Floor kind="tile" a="#4a5468" b="#414b5e" unit={2} w={44} d={44} />
    {/* skyline + the Taipei tower silhouette */}
    {[-16, -12.5, 13.5, 17].map((x, i) => <Box key={i} p={[x, 2 + rnd(i + 3) * 2, -14]} s={[3, 4 + rnd(i + 3) * 4, 3]} color="#2c3a58" line={1} />)}
    <group position={[-9.5, 0, -13]}>
      {[0, 1, 2, 3, 4, 5].map((i) => <Box key={i} p={[0, 0.9 + i * 1.55, 0]} s={[2.9 - i * 0.32, 1.5, 2.9 - i * 0.32]} color="#33507e" line={1} />)}
      <Cyl p={[0, 10.4, 0]} rt={0.07} h={1.8} color="#9fd0ff" line={1} />
    </group>
    <ChartBoard t={t} />
    {/* candle row at the board's base; the last one rockets with the line */}
    {[-3.2, -1.5, 0.2, 1.9].map((x, i) => (
      <group key={i} position={[x, 0, -3.4]}>
        <Box p={[0, 0.55, 0]} s={[0.55, 1.1, 0.55]} color="#2fae5f" line={1} />
        <Cyl p={[0, 1.35, 0]} rt={0.045} h={0.55} color="#2fae5f" line={1} />
      </group>
    ))}
    <group position={[3.6, 0, -3.4]}>
      <Box p={[0, candleH / 2, 0]} s={[0.62, candleH, 0.62]} color="#2fd46a" line={2} />
      <Cyl p={[0, candleH + 0.3, 0]} rt={0.05} h={0.6} color="#2fd46a" line={1} />
    </group>
    <Cyl p={[-4.7, 0.85, -3.2]} rt={0.09} h={1.7} color="#3a3f4a" line={1} />
    <CalendarPage t={t} />
    {/* confetti burst at "history" */}
    {confetti > 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
      <Ball key={i} p={[0.8 + (rnd(i + 7) - 0.5) * 8.5, 7.6 - confetti * (2.6 + rnd(i + 21) * 2.2), -5.4 + rnd(i + 40) * 1.6]} r={0.13} color={["#ffd36a", "#2fd46a", "#ff6a8a", "#6ab8ff"][i % 4]} ink={0} />
    )) : null}
    <Person p={[3.9, 0, -1.0]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: t > 3.35 ? "deadpan" : "grin", arms: "point", armK: 1, armR: [-0.8, 0.6], lookX: -0.65 }} />
    <Dust t={t} area={[6, 4, 5]} color="rgba(255,220,180,.85)" />
  </>);
};

/* =================== S2 4.5 – 11.9  "the Taiex rocketed 3,310 points" — the staircase mountain =================== */
const K2: Key[] = [
  { t: 4.5, pos: [-4.2, 2.8, 12.2], look: [-3.5, 2.0, -3], fov: 60 },
  { t: 8.0, pos: [-0.5, 4.2, 11.6], look: [1.5, 3.6, -3], fov: 58 },
  { t: 11.9, pos: [2.2, 5.6, 11.2], look: [4.5, 5.0, -3], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const p = seg(t, 5.6, 10.8, Easing.inOut(Easing.cubic));
  const px = lerp(-5.6, 5.9, p), py = 1.15 + (px + 5.6) * 0.355;
  const flagK = seg(t, 11.05, 11.5, Easing.out(Easing.back(2.2)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffeec4" />
    <CanvasPlane p={[0, 15, -34]} s={[95, 40]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#5db1f2"); g.addColorStop(1, "#dff4ff"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Floor kind="tile" a="#7a9a5e" b="#6d8c54" unit={2.4} w={48} d={48} />
    {/* the staircase mountain: green steps climbing left -> right */}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <group key={i}>
        <Box p={[-6.3 + i * 1.55, 0.28 + i * 0.55, -3.5]} s={[2.3, 0.56 + i * 0.55, 3.4]} color={i % 2 ? "#3f9e4d" : "#359145"} line={1} />
        <Box p={[-6.3 + i * 1.55, 0.62 + i * 1.1, -1.72]} s={[1.55, 0.1, 0.1]} color="#7dffb0" line={0} />
      </group>
    ))}
    <Box p={[7.6, 2.75, -3.5]} s={[2.6, 5.5, 3.6]} color="#359145" line={1} />
    {/* the diagonal rail + the lift platform the trader rides */}
    <Box p={[0.15, 3.0, -4.9]} s={[17.5, 0.3, 0.45]} rot={[0, 0, 0.341]} color="#8a93a6" line={1} />
    <Box p={[px, py, -3.5]} s={[2.5, 0.26, 2.5]} color="#e5233a" line={2} />
    <Box p={[px, py - 0.45, -3.5]} s={[0.3, 0.7, 0.3]} color="#5a6274" line={1} />
    <Person p={[px, py + 0.13, -3.5]} sy={py + 0.13} h={3.1} look={trader} f={f} pose={{ mood: "grin", arms: "point", armK: 1, armR: [0.8, 0.66], lookX: 0.7 }} />
    {/* the summit flag, planted on "recorded" */}
    <Cyl p={[7.3, 6.7, -3.5]} rt={0.07} h={2.6} color="#d8d8e0" line={1} />
    {flagK > 0.02 ? (
      <group position={[8.32, 7.75, -3.5]} scale={[flagK, flagK, flagK]}>
        <CanvasPlane p={[0, 0, 0]} s={[2.05, 1.15]} px={[512, 288]} draw={(c, W, H) => { c.fillStyle = "#0d3a1e"; c.fillRect(0, 0, W, H); c.fillStyle = "#7dffb0"; c.font = "900 118px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("40,122", W / 2, H / 2 + 4); }} />
      </group>
    ) : null}
    {/* clouds + the tiny city far below */}
    {[[-8, 9.5, -16], [6, 10.5, -18], [13, 8.6, -15]].map(([x, y, z], i) => (
      <group key={i} position={[x, y, z]}>
        <Ball p={[0, 0, 0]} r={1.15} color="#ffffff" ink={0} /><Ball p={[1.1, -0.25, 0]} r={0.85} color="#ffffff" ink={0} /><Ball p={[-1.1, -0.3, 0]} r={0.8} color="#ffffff" ink={0} />
      </group>
    ))}
    {[-13, -9, 11, 14.5].map((x, i) => <Box key={i} p={[x, 0.8 + rnd(i + 60) * 0.8, -11]} s={[1.8, 1.6 + rnd(i + 60) * 1.6, 1.8]} color="#a8bdd4" line={1} />)}
    <Dust t={t} area={[7, 5, 5]} color="rgba(230,255,235,.9)" />
  </>);
};

/* =================== S3 11.9 – 17.6  "One company did the lifting" — the giant chip holds up the market =================== */
const K3: Key[] = [
  { t: 11.9, pos: [0, 1.7, 12.6], look: [0, 2.8, -3], fov: 60 },
  { t: 17.6, pos: [0, 2.1, 10.4], look: [0, 3.0, -3], fov: 57 },
];
const S3 = ({ t, f }: Ctx) => {
  const lift = seg(t, 12.6, 15.8, Easing.inOut(Easing.cubic));
  const liftY = lift * 0.85 + (lift > 0 && lift < 1 ? Math.sin(f * 0.9) * 0.035 : 0);
  const platY = 2.62 + liftY;
  const stampK = seg(t, 16.55, 17.0, Easing.in(Easing.cubic));
  return (<>
    <Cam t={t} keys={K3} impacts={[[17.0, 0.06]]} />
    <Lights warm="#d8f4ff" />
    <Floor kind="tile" a="#14555e" b="#114a52" unit={2} w={40} d={40} />
    <CanvasPlane p={[0, 5.2, -9.5]} s={[21, 10.5]} px={[1050, 525]} draw={(c, W, H) => {
      c.fillStyle = "#0a2e35"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(64,200,190,.35)"; c.lineWidth = 5;
      for (let i = 0; i < 7; i++) { const y = 60 + i * 66; c.beginPath(); c.moveTo(0, y); c.lineTo(W * (0.3 + rnd(i) * 0.5), y); c.lineTo(W * (0.3 + rnd(i) * 0.5), y + 66); c.lineTo(W, y + 66); c.stroke(); }
      c.fillStyle = "rgba(64,200,190,.5)"; for (let i = 0; i < 26; i++) { c.beginPath(); c.arc(rnd(i + 90) * W, rnd(i + 130) * H, 7, 0, 7); c.fill(); }
    }} />
    {/* THE giant chip: legs, slab body, arms straining up to the platform */}
    <group position={[0, liftY * 0.35, -3]}>
      {[-1.5, 1.5].map((x) => [-1.1, 1.1].map((z) => <Box key={`${x}${z}`} p={[x, 0.55, z]} s={[0.55, 1.1, 0.55]} color="#2a3242" line={1} />))}
      <Box p={[0, 1.5, 0]} s={[4.8, 0.8, 4.8]} color="#31517a" line={2} />
      {[0, 1, 2, 3, 4, 5].map((i) => <Cyl key={i} p={[-2.62, 1.5, -1.9 + i * 0.76]} rt={0.09} h={0.5} rot={[0, 0, Math.PI / 2]} color="#c8cfd8" line={1} />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <Cyl key={i + 9} p={[2.62, 1.5, -1.9 + i * 0.76]} rt={0.09} h={0.5} rot={[0, 0, Math.PI / 2]} color="#c8cfd8" line={1} />)}
      <CanvasPlane p={[0, 1.5, 2.43]} s={[3.4, 1.15]} px={[680, 230]} draw={(c, W, H) => { c.fillStyle = "#1d3556"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffffff"; c.font = "900 120px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TSMC", W / 2, H / 2 + 4); }} />
      <Cyl p={[-2.95, 2.35, 0]} rt={0.17} h={1.9} rot={[0, 0, 0.5]} color="#233048" line={1} />
      <Cyl p={[2.95, 2.35, 0]} rt={0.17} h={1.9} rot={[0, 0, -0.5]} color="#233048" line={1} />
    </group>
    {/* the platform it lifts: the whole market on top */}
    <group position={[0, platY, -3]}>
      <Box p={[0, 0, 0]} s={[8.4, 0.35, 5.6]} color="#5a4a38" line={2} />
      <CanvasPlane p={[-1.6, 1.75, -2.2]} s={[4.6, 2.6]} px={[690, 390]} frame="#10131c" draw={(c, W, H) => {
        c.fillStyle = "#0d1522"; c.fillRect(0, 0, W, H);
        c.strokeStyle = "#2fd46a"; c.lineWidth = 10; c.lineJoin = "round"; c.beginPath();
        c.moveTo(W * 0.06, H * 0.8); c.lineTo(W * 0.35, H * 0.72); c.lineTo(W * 0.6, H * 0.4); c.lineTo(W * 0.94, H * 0.12); c.stroke();
        c.fillStyle = "#7dffb0"; c.font = "900 62px Inter, Arial"; c.textAlign = "left"; c.fillText("TAIEX 40,122", 26, 66);
      }} />
      <Box p={[2.9, 0.75, -1.9]} s={[1.3, 1.15, 1.3]} color="#8aa6c8" line={1} /><Box p={[3.1, 1.65, -1.9]} s={[0.95, 0.7, 0.95]} color="#6d8ab0" line={1} />
      <Box p={[3.4, 0.5, 0.9]} s={[0.9, 0.65, 0.9]} color="#c8a86a" line={1} />
      <Person p={[-3.3, 0.18, 0.9]} sy={0.18} h={1.55} look={trader} f={f} pose={{ mood: "grin", arms: "point", armK: 1, armR: [0.7, 0.6], lookX: 0.4 }} />
      <Person p={[1.2, 0.18, 1.4]} sy={0.18} h={1.55} look={greeter} f={f} pose={{ mood: "grin", arms: "point", armK: 1, armR: [-0.7, 0.6], lookX: -0.4 }} />
    </group>
    {/* strain dust at the chip's feet while the lift is on */}
    {lift > 0.02 && lift < 0.98 ? [0, 1, 2, 3].map((i) => <Ball key={i} p={[-2.4 + i * 1.6, 0.3, -0.6]} r={0.3 + lift * 0.25} color="#9fb6bd" ink={0} />) : null}
    {/* the LIMIT stamp slams in on "limit" */}
    {stampK > 0.02 ? (
      <group position={[3.3, 3.6, 1.6]} rotation={[0, -0.15, lerp(-0.55, -0.12, stampK)]} scale={[lerp(2.4, 1, stampK), lerp(2.4, 1, stampK), 1]}>
        <CanvasPlane p={[0, 0, 0]} s={[3.1, 1.55]} px={[620, 310]} draw={(c, W, H) => {
          c.clearRect(0, 0, W, H);
          c.strokeStyle = "#e5233a"; c.lineWidth = 17; c.strokeRect(14, 14, W - 28, H - 28);
          c.fillStyle = "#e5233a"; c.font = "900 104px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
          c.fillText("LIMIT +10%", W / 2, H / 2 + 4);
        }} />
      </group>
    ) : null}
    <Dust t={t} area={[7, 4, 5]} color="rgba(200,240,255,.9)" />
  </>);
};

/* =================== S4 17.6 – 21.7  "Seoul partied too" — the column through the 5,000 arch =================== */
const K4: Key[] = [
  { t: 17.6, pos: [0, 2.4, 12.4], look: [0, 2.6, -3], fov: 60 },
  { t: 21.7, pos: [0, 3.6, 11.4], look: [0, 3.9, -3], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const colH = lerp(1.2, 6.4, seg(t, 19.2, 21.3, Easing.out(Easing.cubic)));
  const burst = t > 20.88 && t < 21.7 ? (t - 20.88) / 0.82 : 0;
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffc4d8" />
    <CanvasPlane p={[0, 14, -32]} s={[90, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3a2a6e"); g.addColorStop(0.65, "#8a3a7a"); g.addColorStop(1, "#c65a8a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[-22, 11, -30]} r={1.7} color="#f2f0ea" ink={0} />
    <Floor kind="tile" a="#3c3550" b="#352e46" unit={2} w={44} d={44} />
    {/* the hill + tower silhouette (Seoul) */}
    <Ball p={[8.2, -1.6, -11]} r={4.6} color="#2c2444" s={[1.5, 0.75, 1]} ink={0} />
    <group position={[8.2, 1.8, -11]}>
      <Cyl p={[0, 1.6, 0]} rt={0.42} h={3.2} color="#4a3a72" line={1} />
      <Cyl p={[0, 3.5, 0]} rt={0.85} h={0.7} color="#5a4a8a" line={1} />
      <Cyl p={[0, 4.5, 0]} rt={0.06} h={1.4} color="#c9b8ff" line={1} />
      <Ball p={[0, 5.25, 0]} r={0.14} color="#ff6a8a" ink={0} />
    </group>
    {/* the finish arch: two poles + the 5,000 banner */}
    <Cyl p={[-2.4, 2.8, -3]} rt={0.13} h={5.6} color="#c9a227" line={1} /><Cyl p={[2.4, 2.8, -3]} rt={0.13} h={5.6} color="#c9a227" line={1} />
    <CanvasPlane p={[0, 5.95, -3]} s={[5.6, 1.2]} px={[700, 150]} draw={(c, W, H) => {
      c.fillStyle = "#ffd36a"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#1b1b2a"; c.font = "900 92px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText("★ 5,000 ★", W / 2, H / 2 + 3);
    }} />
    {/* the Kospi column grows up through the arch */}
    <Box p={[0, colH / 2, -3]} s={[1.7, colH, 1.7]} color="#2f8cff" line={2} />
    <Box p={[0, colH + 0.16, -3]} s={[1.85, 0.32, 1.85]} color="#7dffb0" line={1} />
    <CanvasPlane p={[0, 1.1, -2.05]} s={[1.9, 0.95]} px={[380, 190]} draw={(c, W, H) => { c.fillStyle = "#10131c"; c.fillRect(0, 0, W, H); c.fillStyle = "#6ab8ff"; c.font = "900 74px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("KOSPI", W / 2, H / 2 + 2); }} />
    {/* ribbon burst as the column crosses the banner */}
    {burst > 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
      <Ball key={i} p={[(rnd(i + 11) - 0.5) * 5.4, 5.6 - burst * (1.6 + rnd(i + 31) * 2.4), -2.6]} r={0.12} color={["#ffd36a", "#ff6a8a", "#7dffb0", "#6ab8ff"][i % 4]} ink={0} />
    )) : null}
    {/* balloons + the greeters */}
    {[-4.6, 4.9].map((x, i) => (
      <group key={i} position={[x, 0, -0.6]}>
        <Cyl p={[0, 1.5, 0]} rt={0.025} h={3} color="#d8d8e0" line={0} />
        <Ball p={[0, 3.35 + Math.sin(f * 0.05 + i * 2) * 0.12, 0]} r={0.46} color={i ? "#ff6a8a" : "#ffd36a"} />
      </group>
    ))}
    <Person p={[-3.5, 0, -0.7]} sy={0} h={3.4} look={greeter} f={f} pose={{ mood: "grin", arms: "point", armK: 1, armR: [0.8, 0.68], lookX: 0.55 }} />
    <Person p={[3.7, 0, -1.1]} sy={0} h={3.4} look={trader} f={f} pose={{ mood: "grin", arms: "point", armK: 1, armR: [-0.8, 0.68], lookX: -0.55 }} />
    <Dust t={t} area={[6, 4, 5]} color="rgba(255,200,230,.85)" />
  </>);
};

/* =================== S5 21.7 – 27.9  "Then came Wednesday" — the red slide, the record erased =================== */
const K5: Key[] = [
  { t: 21.7, pos: [1.5, 6.2, 11.8], look: [0.5, 3.6, -3], fov: 60 },
  { t: 25.3, pos: [-1.5, 3.0, 11.0], look: [-1, 1.8, -3], fov: 58 },
  { t: 27.9, pos: [0, 2.4, 10.6], look: [0.3, 1.6, -2], fov: 57 },
];
const S5 = ({ t, f }: Ctx) => {
  const p = seg(t, 22.94, 25.3, Easing.in(Easing.cubic));
  const sx = lerp(5.6, -5.4, p), sy = 5.62 - (5.6 - sx) * 0.41;
  const raining = t > 22.9 && t < 26.6;
  return (<>
    <Cam t={t} keys={K5} impacts={[[26.7, 0.07]]} />
    <Lights warm="#ffb9a0" />
    <CanvasPlane p={[0, 14, -32]} s={[90, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#4a3a44"); g.addColorStop(0.6, "#7a4040"); g.addColorStop(1, "#a04a3a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[23, 7.5, -30]} r={2.6} color="#ff8a5e" ink={0} />
    <Floor kind="tile" a="#5e4a48" b="#54403e" unit={2.2} w={46} d={46} />
    {/* the ruined staircase: grey steps, some tilted, one dropped */}
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <Box key={i} p={[-6.3 + i * 1.55, (0.28 + i * 0.55) * (i === 4 ? 0.45 : 1), -6.8]} s={[2.3, 0.56 + i * 0.55, 3]} color={i % 2 ? "#6a5a58" : "#61524f"} rot={[0, 0, i === 2 ? 0.16 : i === 6 ? -0.13 : 0]} line={1} />
    ))}
    {/* the summit flag, still up there, grey now */}
    <Cyl p={[6.9, 6.4, -3.5]} rt={0.07} h={2.4} color="#8a8a96" line={1} />
    <CanvasPlane p={[7.95, 7.35, -3.5]} s={[1.95, 1.1]} px={[512, 288]} draw={(c, W, H) => { c.fillStyle = "#3a3f3a"; c.fillRect(0, 0, W, H); c.fillStyle = "#9ab8a0"; c.font = "900 118px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("40,122", W / 2, H / 2 + 4); }} />
    {/* the slide itself */}
    <Box p={[0.05, 3.05, -3.5]} s={[12.9, 0.3, 2.7]} rot={[0, 0, 0.39]} color="#a02c22" line={2} />
    <Box p={[0.05, 2.72, -3.5]} s={[12.9, 0.35, 0.4]} rot={[0, 0, 0.39]} color="#5e2019" line={1} />
    {/* the sled + the trader riding it down */}
    <Box p={[sx, sy + 0.02, -3.5]} s={[1.7, 0.2, 1.5]} rot={[0, 0, 0.39]} color="#ffd36a" line={2} />
    <Person p={[sx, sy + 0.12, -3.5]} sy={sy + 0.12} h={2.6} look={trader} f={f} pose={{ mood: "worry", sweat: 0.85, arms: "hold", armK: 1, armR: [0.3, 0.78], armL: [-0.3, 0.78], lookX: -0.3 }} />
    {/* red candles rain down during the plunge */}
    {raining ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
      const yy = 9.5 - ((t * 1.45 + rnd(i + 5) * 7.5) % 9);
      return <Box key={i} p={[-6.5 + rnd(i + 55) * 13, yy, -5.5 + rnd(i + 75) * 3]} s={[0.34, 0.85, 0.34]} rot={[0, 0, (f * 0.04 + i) % 0.9 - 0.45]} color="#e5233a" line={1} />;
    }) : null}
    {/* the record board at the bottom: it cracks and is stamped ERASED on the word */}
    <Box p={[0.5, 0.5, 0.9]} s={[3.4, 0.5, 0.5]} color="#3a3f4a" line={1} />
    <CanvasPlane p={[0.5, 1.95, 0.9]} s={[4.7, 2.3]} px={[705, 345]} frame="#10131c" draw={(c, W, H) => {
      c.fillStyle = "#0d1522"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#7dffb0"; c.font = "900 58px Inter, Arial"; c.textAlign = "center"; c.fillText("RECORD", W / 2, H * 0.3);
      c.font = "900 108px Inter, Arial"; c.fillText("+3,310", W / 2, H * 0.68);
      if (t > 26.68) {
        c.strokeStyle = "rgba(240,248,255,.9)"; c.lineWidth = 5;
        c.beginPath(); c.moveTo(W * 0.08, H * 0.05); c.lineTo(W * 0.3, H * 0.42); c.lineTo(W * 0.26, H * 0.66); c.lineTo(W * 0.48, H * 0.97); c.stroke();
        c.beginPath(); c.moveTo(W * 0.9, H * 0.1); c.lineTo(W * 0.68, H * 0.5); c.lineTo(W * 0.78, H * 0.8); c.stroke();
        c.save(); c.translate(W / 2, H / 2); c.rotate(-0.16);
        c.strokeStyle = "#e5233a"; c.lineWidth = 10; c.strokeRect(-W * 0.31, -H * 0.21, W * 0.62, H * 0.42);
        c.fillStyle = "#e5233a"; c.font = "900 96px Inter, Arial"; c.textBaseline = "middle"; c.fillText("ERASED", 0, 4);
        c.restore();
      }
    }} />
    <Glow p={[0.5, 2.0, 1.6]} r={2.4} color="rgba(229,35,58,1)" o={t > 26.68 ? 0.3 : 0.1} />
    <Dust t={t} area={[7, 5, 5]} color="rgba(255,190,170,.85)" />
  </>);
};

/* =================== S6 27.9 – 30.6  "The Daily Toon News — the world, in toons." — sign-off, teal-gold studio =================== */
const K6: Key[] = [
  { t: 27.9, pos: [0, 3.1, 9.8], look: [0, 2.9, -2], fov: 60 },
  { t: 30.6, pos: [0, 3.0, 8.4], look: [0, 3.0, -2], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => (
  <>
    <Cam t={t} keys={K6} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#0d2f36" b="#0a2830" unit={2.0} w={30} d={30} />
    <WallDoor z={-7} W={30} kind="plain" a="#0f3a3f" b="#0f3a3f" base="#082528" />
    <SideWall x={-11} kind="plain" a="#123f45" b="#123f45" /><SideWall x={11} kind="plain" a="#123f45" b="#123f45" />
    {/* the big TDN screen, teal-gold livery */}
    <CanvasPlane p={[0, 4.9, -6.8]} s={[9.6, 5.2]} px={[960, 520]} frame="#04181c" draw={(c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#07272e"); g.addColorStop(1, "#0f4a52"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = "#c9a227"; c.beginPath(); c.arc(W * 0.5, H * 0.36, 74, 0, 7); c.fill();
      c.fillStyle = "#07272e"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("T", W * 0.5, H * 0.36 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 150px Inter, Arial"; c.fillText("TDN", W * 0.5, H * 0.62);
      c.fillStyle = "#c9a227"; c.fillRect(0, H * 0.82, W, H * 0.18);
      c.fillStyle = "#07272e"; c.font = "900 44px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W * 0.5, H * 0.91);
    }} />
    <Glow p={[0, 4.9, -6.2]} r={5.2} color="rgba(64,200,190,1)" o={0.22} />
    <Globe p={[5.4, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
    <Cyl p={[5.4, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.4, 0.06, -5.2]} rt={0.55} h={0.12} color="#14555e" line={1} />
    {/* the anchor desk */}
    <Desk p={[0, 0, -2.6]} w={5.6} top="#14555e" leg="#082528" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#04181c"; c.fillRect(0, 0, W, H); c.fillStyle = "#c9a227"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    <Box p={[-1.7, 1.12, -2.5]} s={[0.85, 0.05, 1.1]} color="#f2f0ea" line={1} /><Box p={[-1.6, 1.17, -2.55]} s={[0.85, 0.05, 1.1]} color="#dfe6ee" rot={[0, 0.25, 0]} line={1} />
    <Monitor p={[2.1, 1.05, -2.7]} rot={[0, -0.35, 0]} screen="#c9a227" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#14555e" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Clock p={[-7.6, 6.3, -4.95]} r={0.55} t={t} /><Frame p={[8.2, 3.4, -6.9]} s={[1.3, 1.0]} art={1} />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#0a2830" b="#c9a227" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, -0.35]} color="255,226,174" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(220,255,250,.9)" />
    {/* the anchor signs off */}
    <Person p={[0, 0, -3.6]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 28.1 && t < 28.7 ? 0.08 : 0,
      arms: t > 29.9 ? "point" : "down", armK: seg(t, 29.9, 30.2), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>
);

const CUTS = [0, 4.5, 11.9, 17.6, 21.7, 27.9, 30.6];
export const TdnV5: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  const ptsCount = Math.round(seg(t, 6.37, 8.48) * 3310);
  const chipSegs = Math.min(4, Math.round(seg(t, 14.2, 14.83) * 4));
  const dropCount = Math.round(seg(t, 23.18, 25.13) * 3440);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#2a4a8f">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#5db1f2">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#0a2e35">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#3a2a6e">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#4a3a44">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#0f3a3f" trans="flash">{(c) => <S6 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 4.5 ? "rgba(255,150,60,.08)" : t < 11.9 ? "rgba(60,200,120,.07)" : t < 17.6 ? "rgba(60,180,200,.07)" : t < 21.7 ? "rgba(190,90,220,.08)" : t < 27.9 ? "rgba(255,60,40,.09)" : "rgba(255,190,80,.06)"} />
      {/* S2 points counter as a screen-space HUD chip (6.2–9.9s) */}
      {t > 6.2 && t < 9.9 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,26,14,.88)", color: "#7dffb0", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 62, padding: "16px 30px", borderRadius: 18 }}>
            +{ptsCount.toLocaleString("en-US")} POINTS
          </span>
        </div>
      ) : null}
      {/* S3 market-share chip (13.9–15.9s): ten segments, four fill = TSMC's 40% */}
      {t > 13.9 && t < 15.9 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,22,26,.88)", color: "#8ae8ff", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 54, padding: "16px 30px", borderRadius: 18 }}>
            <span style={{ display: "inline-flex", gap: 7, marginBottom: 8 }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <span key={i} style={{ display: "inline-block", width: 30, height: 24, borderRadius: 6, background: i < chipSegs ? "#8ae8ff" : "rgba(138,232,255,.22)", border: "3px solid #8ae8ff" }} />
              ))}
            </span>
            <br />TSMC = 40% OF THE MARKET
          </span>
        </div>
      ) : null}
      {/* S5 plunge counter (23.1–25.7s) */}
      {t > 23.1 && t < 25.7 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,4,6,.88)", color: "#ff6a5e", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 62, padding: "16px 30px", borderRadius: 18 }}>
            −{dropCount.toLocaleString("en-US")} IN ONE MORNING
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
