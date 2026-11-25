// TDN v6 — "Huawei: guilty on 10 of 12 counts" — a Brooklyn federal jury convicts China's
// Huawei on 10 of 12 criminal counts (bank/wire fraud, money laundering, Iran sanctions,
// trade-secret theft) but acquits it of acting as a criminal enterprise. 9:16 720x1280
// 30fps, 945 frames (31.43 s voiceover).
// CUTS = [0, 3.1, 8.85, 15.03, 18.66, 23.03, 28.62, 31.43].
// S1 courthouse steps + the giant gavel / S2 the verdict board: 12 count cards flip guilty
// S3 the verdict sheet: five charge stamps slam / S4 evidence bench: router + robot
// S5 the twist: last two cards flip NOT GUILTY, the enterprise banner is X'd out
// S6 press podium + APPEAL stamp + Sep 2027 calendar / S7 TDN sign-off desk (crimson-navy).
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
const judge: Look = { skin: "#e8c39a", body: "#23232e", outfit: "shirt", hair: "swept", hairColor: "#cfd4dc", glasses: true, shoe: "#101018" };
const lawyer: Look = { skin: "#f0c8a0", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#0d0d14", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV1/TdnV2/TdnV3/TdnV5) ---------- */
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

/* ---------- shared: the verdict board (S2 counts, S5 twist) ---------- */
const VerdictBoard: React.FC<{ t: number; mode: "count" | "twist" }> = ({ t, mode }) => (
  <CanvasPlane p={[0, 4.35, -6.5]} s={[9.6, 5.0]} px={[1152, 600]} frame="#2a1c10" draw={(c, W, H) => {
    c.fillStyle = "#171019"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#c9a227"; c.font = "900 40px Inter, Arial"; c.textAlign = "left"; c.fillText("THE TWELVE COUNTS", 44, 62);
    c.fillStyle = "#8a7a9a"; c.font = "800 30px Inter, Arial"; c.textAlign = "right"; c.fillText("BROOKLYN · NEW YORK", W - 44, 62);
    const cols = 6, rows = 2, mx = 44, my = 92, gx = 18, gy = 20;
    const cw = (W - mx * 2 - gx * (cols - 1)) / cols, ch = (H - my - 30 - gy * (rows - 1)) / rows;
    for (let i = 0; i < 12; i++) {
      const col = i % cols, row = Math.floor(i / cols);
      const x = mx + col * (cw + gx), y = my + row * (ch + gy);
      let p = -1, back: "guilty" | "notguilty" = "guilty";
      if (mode === "count") {
        if (i < 10) p = seg(t, 6.0 + i * 0.21, 6.3 + i * 0.21);
      } else {
        if (i < 10) p = 1;
        else { back = "notguilty"; p = seg(t, i === 10 ? 19.4 : 19.9, (i === 10 ? 19.4 : 19.9) + 0.3); }
      }
      const sq = p < 0 || p >= 1 ? 1 : Math.max(0.1, Math.abs(Math.cos(p * Math.PI)));
      const w2 = cw * sq, x2 = x + (cw - w2) / 2;
      const isBack = p >= 0.5;
      c.fillStyle = !isBack ? "#3a4356" : back === "guilty" ? "#7e1a22" : "#0d4a44";
      c.fillRect(x2, y, w2, ch);
      c.strokeStyle = !isBack ? "#8a93a6" : back === "guilty" ? "#e5233a" : "#2fd4b8"; c.lineWidth = 5; c.strokeRect(x2, y, w2, ch);
      if (sq > 0.45) {
        c.textAlign = "center";
        if (!isBack) {
          c.fillStyle = "#aab4c8"; c.font = "800 30px Inter, Arial"; c.fillText("COUNT", x + cw / 2, y + ch * 0.38);
          c.fillStyle = "#e8ecf4"; c.font = "900 74px Inter, Arial"; c.fillText(String(i + 1), x + cw / 2, y + ch * 0.78);
        } else if (back === "guilty") {
          c.fillStyle = "#ffd9d4"; c.font = "900 52px Inter, Arial"; c.textBaseline = "middle"; c.fillText("GUILTY", x + cw / 2, y + ch / 2 + 2); c.textBaseline = "alphabetic";
        } else {
          c.fillStyle = "#c8fff2"; c.font = "900 48px Inter, Arial"; c.fillText("NOT", x + cw / 2, y + ch * 0.44);
          c.fillText("GUILTY", x + cw / 2, y + ch * 0.76);
        }
      }
    }
  }} />
);

/* =================== S1 0 – 3.1  "the biggest tech trials on Earth just ended in New York" — courthouse + gavel =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.4, 13.2], look: [0, 3.4, -4], fov: 60 },
  { t: 3.1, pos: [0, 3.1, 11.4], look: [0, 3.5, -4], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const strike = t < 2.10 ? 0 : t < 2.28 ? seg(t, 2.10, 2.28, Easing.in(Easing.cubic)) : t < 2.45 ? 1 : 1 - seg(t, 2.45, 2.95, Easing.out(Easing.cubic));
  return (<>
    <Cam t={t} keys={K1} impacts={[[2.28, 0.07]]} />
    <Lights warm="#ffd9ae" />
    <CanvasPlane p={[0, 14, -34]} s={[92, 38]} px={[900, 380]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1c2a5e"); g.addColorStop(0.62, "#4a4a8f"); g.addColorStop(1, "#c65a4a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Ball p={[-24, 9.5, -30]} r={1.8} color="#f2f0ea" ink={0} />
    <Floor kind="tile" a="#4c4a5e" b="#43415a" unit={2} w={46} d={46} />
    {/* skyline behind the courthouse */}
    {[-17, -13.5, 13, 16.5, 20].map((x, i) => <Box key={i} p={[x, 2.4 + rnd(i + 8) * 1.6, -16]} s={[3, 4.8 + rnd(i + 8) * 3.4, 3]} color="#232c52" line={1} />)}
    {/* the courthouse: steps, columns, entablature, gable */}
    <Box p={[0, 0.3, -6]} s={[15, 0.6, 6.5]} color="#8b8fa3" line={1} />
    <Box p={[0, 0.85, -5.2]} s={[13, 0.5, 5]} color="#9a9eb2" line={1} />
    <Box p={[0, 1.32, -4.6]} s={[11.4, 0.45, 3.8]} color="#a8abc0" line={1} />
    {[-4.6, -2.75, -0.9, 0.9, 2.75, 4.6].map((x, i) => <Cyl key={i} p={[x, 4.35, -6]} rt={0.42} h={5.6} color="#c6c9d8" line={1} />)}
    <Box p={[0, 7.35, -6]} s={[12.4, 0.55, 2.6]} color="#a8abc0" line={1} />
    <Box p={[-3.1, 8.15, -6]} s={[6.6, 0.4, 2.4]} rot={[0, 0, 0.16]} color="#9a9eb2" line={1} />
    <Box p={[3.1, 8.15, -6]} s={[6.6, 0.4, 2.4]} rot={[0, 0, -0.16]} color="#9a9eb2" line={1} />
    <CanvasPlane p={[0, 6.55, -4.62]} s={[5.6, 0.95]} px={[700, 120]} draw={(c, W, H) => { c.fillStyle = "#2c3049"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FEDERAL COURT", W / 2, H / 2 + 2); }} />
    {/* the giant gavel on the steps: it strikes on "ended" */}
    <Cyl p={[3.6, 1.68, -2.2]} rt={0.62} h={0.22} color="#5a3a20" line={2} />
    <group position={[3.6, 1.82, -2.2]} rotation={[0, 0, lerp(-0.52, 0.10, strike)]}>
      <Cyl p={[0.85, 0.1, 0]} rt={0.09} h={1.9} rot={[0, 0, Math.PI / 2 - 0.12]} color="#8a5a2a" line={1} />
      <Cyl p={[1.78, 0.28, 0]} rt={0.24} h={0.85} rot={[0, 0, Math.PI / 2]} color="#6e4520" line={2} />
      <Cyl p={[1.78, 0.28, 0]} rt={0.26} h={0.3} rot={[0, 0, Math.PI / 2]} color="#c9a227" line={1} />
    </group>
    <Lamp p={[-6.4, 0, -2.6]} h={3.4} color="#ffd9ae" /><Lamp p={[6.9, 0, -3.4]} h={3.4} color="#ffd9ae" />
    <Plant p={[-8.6, 0, -4.8]} s={1.3} /><Plant p={[8.8, 0, -5.2]} s={1.3} />
    <Person p={[-3.4, 1.55, -1.6]} sy={1.55} h={3.5} look={analyst} f={f} pose={{ mood: t > 2.35 ? "deadpan" : "grin", arms: "point", armK: 1, armR: [-0.75, 0.62], lookX: -0.6 }} />
    <Dust t={t} area={[7, 4, 5]} color="rgba(200,210,255,.85)" />
  </>);
};

/* =================== S2 3.1 – 8.85  "convicted China's Huawei on ten of twelve criminal counts" — the verdict board =================== */
const K2: Key[] = [
  { t: 3.1, pos: [0, 3.2, 12.6], look: [0, 3.6, -4], fov: 60 },
  { t: 8.85, pos: [0, 3.5, 10.6], look: [0, 3.9, -4], fov: 57 },
];
const Courtroom: React.FC<{ t: number; f: number; mode: "count" | "twist" }> = ({ t, f, mode }) => (<>
  <Floor kind="tile" a="#4a3220" b="#412c1c" unit={2} w={40} d={40} />
  <CanvasPlane p={[0, 5.4, -8.6]} s={[24, 11]} px={[1000, 460]} draw={(c, W, H) => {
    c.fillStyle = "#3a2415"; c.fillRect(0, 0, W, H);
    c.fillStyle = "rgba(0,0,0,.22)"; for (let i = 0; i < 6; i++) c.fillRect(60 + i * 155, 0, 8, H);
    c.fillStyle = "rgba(255,200,120,.10)"; c.fillRect(0, H * 0.06, W, 10);
  }} />
  <VerdictBoard t={t} mode={mode} />
  {mode === "twist" ? (
    <CanvasPlane p={[0, 7.62, -6.4]} s={[7.8, 1.2]} px={[975, 150]} draw={(c, W, H) => {
      c.save(); c.globalAlpha = 1 - seg(t, 22.5, 23.0) * 0.55;
      c.fillStyle = "#10131c"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "#565e70"; c.lineWidth = 6; c.strokeRect(6, 6, W - 12, H - 12);
      c.fillStyle = "#9aa3b5"; c.font = "900 74px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText("CRIMINAL ENTERPRISE", W / 2, H / 2 + 3);
      const xp = seg(t, 21.5, 22.3);
      if (xp > 0) {
        c.strokeStyle = "#e5233a"; c.lineWidth = 15; c.lineCap = "round";
        c.beginPath(); c.moveTo(W * 0.06, H * 0.82); c.lineTo(W * 0.06 + (W * 0.88) * Math.min(1, xp * 1.6), H * 0.82 - (H * 0.64) * Math.min(1, xp * 1.6)); c.stroke();
        if (xp > 0.55) { const q = (xp - 0.55) / 0.45; c.beginPath(); c.moveTo(W * 0.06, H * 0.18); c.lineTo(W * 0.06 + (W * 0.88) * q, H * 0.18 + (H * 0.64) * q); c.stroke(); }
      }
      c.restore();
    }} />
  ) : null}
  {/* the bench + the judge + the SINCE 2018 plaque */}
  <Box p={[0, 0.95, -4.4]} s={[9.6, 1.9, 1.1]} color="#5a3a20" line={2} />
  <Box p={[0, 2.0, -4.4]} s={[10.1, 0.22, 1.4]} color="#6e4a28" line={1} />
  <Person p={[0, 1.55, -5.3]} sy={1.55} h={3.3} look={judge} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0 }} />
  <CanvasPlane p={[-3.6, 1.0, -3.82]} s={[2.2, 0.85]} px={[440, 170]} draw={(c, W, H) => { c.fillStyle = "#10131c"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SINCE 2018", W / 2, H / 2 + 2); }} />
  <Box p={[3.4, 2.22, -4.3]} s={[0.8, 0.06, 1.0]} color="#f2f0ea" line={1} /><Box p={[3.5, 2.28, -4.35]} s={[0.8, 0.06, 1.0]} color="#dfe6ee" rot={[0, 0.2, 0]} line={1} />
  <Lamp p={[-7.8, 0, -3.6]} h={3.6} color="#ffca7a" /><Lamp p={[7.8, 0, -3.6]} h={3.6} color="#ffca7a" />
</>);
const S2 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K2} />
  <Lights warm="#ffca7a" />
  <Courtroom t={t} f={f} mode="count" />
  <Dust t={t} area={[7, 4, 5]} color="rgba(255,215,160,.85)" />
</>);

/* =================== S3 8.85 – 15.03  the five charges — stamps on the verdict sheet =================== */
const K3: Key[] = [
  { t: 8.85, pos: [0, 4.6, 12.2], look: [0, 3.2, -4], fov: 60 },
  { t: 15.03, pos: [0, 4.1, 10.6], look: [0, 3.3, -4], fov: 57 },
];
const Stamp: React.FC<{ t: number; t0: number; p: [number, number, number]; s: [number, number]; rot: number; lines: string[]; ink?: string }> = ({ t, t0, p, s, rot, lines, ink = "#c22333" }) => {
  if (t < t0 - 0.15) return null;
  const k = seg(t, t0 - 0.15, t0 + 0.05, Easing.in(Easing.cubic));
  return (
    <group position={p} rotation={[0, 0, rot]} scale={[lerp(2.3, 1, k), lerp(2.3, 1, k), 1]}>
      <CanvasPlane p={[0, 0, 0]} s={s} px={[620, Math.round(620 * (s[1] / s[0]))]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H);
        c.strokeStyle = ink; c.lineWidth = 13; c.strokeRect(12, 12, W - 24, H - 24);
        c.fillStyle = ink; c.textAlign = "center"; c.textBaseline = "middle";
        const fs = lines.length > 1 ? H * 0.30 : H * 0.42;
        c.font = `900 ${fs}px Inter, Arial`;
        lines.forEach((ln, i) => c.fillText(ln, W / 2, H * (lines.length > 1 ? 0.30 + i * 0.40 : 0.52)));
      }} />
    </group>
  );
};
const S3 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K3} impacts={[[10.62, 0.05], [13.62, 0.05]]} />
  <Lights warm="#ffd9ae" />
  <Floor kind="tile" a="#4a3220" b="#412c1c" unit={2} w={40} d={40} />
  <Box p={[0, 0.55, -4.4]} s={[13, 1.1, 4.6]} color="#5a3a20" line={2} />
  {/* the giant verdict sheet on its easel */}
  <Cyl p={[-3.4, 1.6, -5.2]} rt={0.07} h={3.4} rot={[0, 0, 0.3]} color="#3a3f4a" line={1} />
  <Cyl p={[3.4, 1.6, -5.2]} rt={0.07} h={3.4} rot={[0, 0, -0.3]} color="#3a3f4a" line={1} />
  <CanvasPlane p={[0, 3.9, -4.6]} s={[9.2, 5.9]} px={[920, 590]} frame="#5a3a20" draw={(c, W, H) => {
    c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#c22333"; c.fillRect(0, 0, W, 14);
    c.fillStyle = "#1b1b2a"; c.font = "900 64px Inter, Arial"; c.textAlign = "center"; c.fillText("U.S. v. HUAWEI", W / 2, 92);
    c.fillStyle = "#5a5a6a"; c.font = "800 34px Inter, Arial"; c.fillText("VERDICT SHEET — BROOKLYN, NEW YORK", W / 2, 142);
    c.strokeStyle = "rgba(90,90,110,.30)"; c.lineWidth = 3;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(60, 210 + i * 74); c.lineTo(W - 60, 210 + i * 74); c.stroke(); }
    c.strokeStyle = "rgba(27,27,42,.55)"; c.lineWidth = 4; c.beginPath();
    c.moveTo(W * 0.62, H - 52); c.bezierCurveTo(W * 0.68, H - 86, W * 0.74, H - 20, W * 0.80, H - 58); c.bezierCurveTo(W * 0.84, H - 82, W * 0.88, H - 34, W * 0.93, H - 52); c.stroke();
  }} />
  <Stamp t={t} t0={8.9} p={[-2.3, 4.75, -4.2]} s={[3.3, 1.5]} rot={-0.12} lines={["BANK FRAUD"]} />
  <Stamp t={t} t0={9.8} p={[2.35, 5.0, -4.2]} s={[3.3, 1.5]} rot={0.10} lines={["WIRE FRAUD"]} />
  <Stamp t={t} t0={10.6} p={[-0.1, 3.55, -4.2]} s={[4.3, 1.6]} rot={-0.05} lines={["MONEY LAUNDERING"]} />
  <Stamp t={t} t0={11.8} p={[-2.45, 2.15, -4.2]} s={[3.6, 1.5]} rot={0.13} lines={["IRAN SANCTIONS"]} />
  <Stamp t={t} t0={13.6} p={[2.3, 2.3, -4.2]} s={[4.2, 1.6]} rot={-0.09} lines={["TRADE SECRET", "THEFT"]} />
  {/* desk dressing: papers, a mug, the small gavel resting */}
  <Box p={[-5.2, 1.14, -3.6]} s={[1.1, 0.07, 1.4]} color="#f2f0ea" line={1} /><Box p={[-5.1, 1.21, -3.65]} s={[1.1, 0.07, 1.4]} color="#dfe6ee" rot={[0, 0.22, 0]} line={1} />
  <Cyl p={[5.3, 1.32, -3.8]} rt={0.26} h={0.5} color="#c2372f" line={1} />
  <Cyl p={[4.6, 1.16, -5.4]} rt={0.4} h={0.16} color="#5a3a20" line={1} />
  <Dust t={t} area={[7, 4, 5]} color="rgba(255,220,180,.85)" />
</>);

/* =================== S4 15.03 – 18.66  "from Cisco's router code to T-Mobile's phone-testing robot" — the evidence bench =================== */
const K4: Key[] = [
  { t: 15.03, pos: [-2.6, 3.2, 11.8], look: [-2.2, 2.4, -3.5], fov: 60 },
  { t: 18.66, pos: [2.4, 3.1, 11.4], look: [2.6, 2.4, -3.5], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const tapPh = Math.max(0, Math.sin((t - 17.0) * 6.2));
  const armRot = t > 17.0 ? -0.45 - tapPh * 0.30 : -0.45;
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#cfe8ff" />
    <Floor kind="tile" a="#2c343c" b="#262d34" unit={2} w={42} d={42} />
    <CanvasPlane p={[0, 5.6, -9.8]} s={[26, 11.5]} px={[1040, 460]} draw={(c, W, H) => {
      c.fillStyle = "#1d2733"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "rgba(90,180,200,.16)"; c.lineWidth = 3;
      for (let i = 1; i < 10; i++) { c.beginPath(); c.moveTo((W / 10) * i, 0); c.lineTo((W / 10) * i, H); c.stroke(); }
      for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(0, (H / 5) * i); c.lineTo(W, (H / 5) * i); c.stroke(); }
      c.fillStyle = "rgba(140,220,240,.5)"; c.font = "900 44px Inter, Arial"; c.textAlign = "left"; c.fillText("EVIDENCE LAB", 40, 66);
    }} />
    {/* the bench */}
    <Box p={[0, 1.02, -3.5]} s={[12.4, 0.3, 3.4]} color="#39424e" line={2} />
    {[-5.6, 5.6].map((x, i) => <Box key={i} p={[x, 0.45, -3.5]} s={[0.35, 0.9, 2.8]} color="#232a33" line={1} />)}
    {/* EXHIBIT A: the router + its code screen */}
    <group position={[-3.3, 1.17, -3.6]}>
      <Box p={[0, 0.36, 0]} s={[2.7, 0.72, 1.9]} color="#232a36" line={2} />
      {[-1.05, -0.55, 0, 0.55, 1.05].map((x, i) => <Ball key={i} p={[x, 0.36, 0.97]} r={0.075} color={((f >> 3) + i) % 2 ? "#2fd46a" : "#0d3a1e"} ink={0} />)}
      {[-0.9, 0, 0.9].map((x, i) => <Cyl key={i} p={[x, 1.15, -0.6]} rt={0.05} h={0.95} rot={[0, 0, (i - 1) * 0.22]} color="#8a93a6" line={1} />)}
    </group>
    <CanvasPlane p={[-3.3, 3.35, -4.9]} s={[3.5, 2.0]} px={[700, 400]} frame="#10131c" draw={(c, W, H) => {
      c.fillStyle = "#0a1410"; c.fillRect(0, 0, W, H);
      c.font = "700 25px monospace"; c.textAlign = "left";
      for (let r = 0; r < 9; r++) {
        const y = 44 + r * 40, off = Math.floor(t * 2 + r * 3) % 5;
        c.fillStyle = r % 3 ? "#2fae5f" : "#7dffb0";
        for (let sgm = 0; sgm < 4; sgm++) { const wdt = 40 + rnd(r * 17 + sgm * 31 + off) * 110; c.fillRect(28 + sgm * 165, y - 16, wdt, 15); }
      }
      c.fillStyle = "#7dffb0"; c.font = "900 30px Inter, Arial"; c.fillText("ROUTER SOURCE CODE", 28, 34);
    }} />
    <CanvasPlane p={[-3.3, 1.32, -1.72]} s={[1.7, 0.6]} px={[340, 120]} draw={(c, W, H) => { c.fillStyle = "#ffd36a"; c.fillRect(0, 0, W, H); c.fillStyle = "#1b1b2a"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("EXHIBIT A", W / 2, H / 2 + 2); }} />
    {/* EXHIBIT B: the phone-testing robot */}
    <group position={[3.2, 1.17, -3.9]}>
      <Cyl p={[0, 0.14, 0]} rt={0.72} h={0.28} color="#39424e" line={2} />
      <Cyl p={[0, 0.85, 0]} rt={0.17} h={1.2} color="#5a6a7a" line={1} />
      <group position={[0, 1.5, 0]} rotation={[0, 0, armRot]}>
        <Cyl p={[0.55, 0, 0]} rt={0.11} h={1.3} rot={[0, 0, Math.PI / 2]} color="#7a8a9c" line={1} />
        <group position={[1.15, 0, 0]} rotation={[0, 0, -armRot * 0.7]}>
          <Cyl p={[0.4, 0, 0]} rt={0.09} h={1.0} rot={[0, 0, Math.PI / 2]} color="#5a6a7a" line={1} />
          <Ball p={[0.85, -0.1, 0]} r={0.16} color="#e5233a" ink={1} />
        </group>
      </group>
      <Ball p={[0, 1.55, 0]} r={0.2} color="#ffd36a" ink={1} />
    </group>
    {/* the phone it taps */}
    <Box p={[4.35, 1.22, -3.1]} s={[0.95, 0.09, 1.65]} color="#10131c" line={1} />
    <CanvasPlane p={[4.35, 1.28, -3.1]} s={[0.82, 1.5]} px={[164, 300]} draw={(c, W, H) => {
      const flash = t > 17.0 && Math.sin((t - 17.0) * 6.2) > 0.86;
      c.fillStyle = flash ? "#bfe8ff" : "#274b73"; c.fillRect(0, 0, W, H);
      c.fillStyle = flash ? "#10131c" : "#9fd0ff"; c.font = "900 44px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TAP!", W / 2, H / 2);
    }} />
    <CanvasPlane p={[3.6, 1.32, -1.72]} s={[1.7, 0.6]} px={[340, 120]} draw={(c, W, H) => { c.fillStyle = "#ffd36a"; c.fillRect(0, 0, W, H); c.fillStyle = "#1b1b2a"; c.font = "900 52px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("EXHIBIT B", W / 2, H / 2 + 2); }} />
    <Glow p={[-3.3, 2.6, -2.6]} r={2.6} color="rgba(64,200,160,1)" o={0.20} />
    <Glow p={[3.8, 2.6, -2.6]} r={2.6} color="rgba(255,64,160,1)" o={0.16} />
    <Person p={[-6.1, 0, -1.0]} sy={0} h={3.3} look={analyst} f={f} pose={{ mood: "grin", arms: "down", lookX: 0.65 }} />
    <Dust t={t} area={[7, 4, 5]} color="rgba(190,230,255,.9)" />
  </>);
};

/* =================== S5 18.66 – 23.03  "But the jury cleared Huawei of the biggest charge of all" — the twist =================== */
const K5: Key[] = [
  { t: 18.66, pos: [0, 3.5, 10.4], look: [0, 3.9, -4], fov: 57 },
  { t: 23.03, pos: [0, 3.3, 12.8], look: [0, 3.7, -4], fov: 60 },
];
const S5 = ({ t, f }: Ctx) => {
  const burst = t > 19.6 && t < 20.6 ? (t - 19.6) / 1.0 : 0;
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe2ae" />
    <Courtroom t={t} f={f} mode="twist" />
    {burst > 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
      <Ball key={i} p={[3.6 + (rnd(i + 13) - 0.5) * 3.4, 3.3 + burst * (1.2 + rnd(i + 27) * 1.6), -5.4]} r={0.12} color={["#ffd36a", "#2fd4b8", "#7dffce", "#ffffff"][i % 4]} ink={0} />
    )) : null}
    <Dust t={t} area={[7, 4, 5]} color="rgba(255,225,170,.9)" />
  </>);
};

/* =================== S6 23.03 – 28.62  "Huawei calls the verdict baseless... Sentencing lands in September 2027" — podium + calendar =================== */
const K6: Key[] = [
  { t: 23.03, pos: [-1.4, 3.1, 11.2], look: [-1.6, 3.4, -3], fov: 60 },
  { t: 26.3, pos: [-0.6, 3.1, 11.0], look: [0.2, 3.5, -3], fov: 59 },
  { t: 28.62, pos: [1.9, 3.3, 10.6], look: [3.6, 3.9, -3], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const calK = seg(t, 27.15, 27.5, Easing.out(Easing.back(1.8)));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#d8e8ff" />
    <Floor kind="carpet" a="#232c3e" b="#1e2636" unit={2} w={34} d={34} />
    <WallDoor z={-7.5} W={34} kind="plain" a="#2c3852" b="#2c3852" base="#1a2233" />
    <SideWall x={-12} kind="plain" a="#26324a" b="#26324a" /><SideWall x={12} kind="plain" a="#26324a" b="#26324a" />
    {/* the statement board */}
    <CanvasPlane p={[-2.2, 4.5, -7.2]} s={[8.6, 4.4]} px={[1032, 528]} frame="#12161f" draw={(c, W, H) => {
      c.fillStyle = "#1a2233"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#8ae8ff"; c.font = "800 40px Inter, Arial"; c.textAlign = "center"; c.fillText("HUAWEI — ON THE VERDICT", W / 2, 84);
      c.fillStyle = "#ffffff"; c.font = "900 96px Inter, Arial";
      c.fillText("“NO LEGAL OR", W / 2, 216); c.fillText("FACTUAL MERIT”", W / 2, 330);
      c.fillStyle = "#8a93a6"; c.font = "800 38px Inter, Arial"; c.fillText("THE CHARGES, SAYS THE COMPANY, HAVE NONE", W / 2, 428);
      c.fillStyle = "#c9a227"; c.fillRect(W * 0.3, 462, W * 0.4, 8);
    }} />
    <Glow p={[-2.2, 4.5, -6.4]} r={5.4} color="rgba(90,160,255,1)" o={0.18} />
    {/* the podium + the lawyer + microphones */}
    <Desk p={[-3.6, 0, -2.4]} w={2.6} top="#39424e" leg="#1a2233" d={1.2} />
    <Cyl p={[-4.1, 1.35, -2.2]} rt={0.035} h={0.8} rot={[0.5, 0, 0.3]} color="#10131c" line={0} /><Ball p={[-4.22, 1.72, -2.02]} r={0.11} color="#10131c" ink={1} />
    <Cyl p={[-3.1, 1.35, -2.2]} rt={0.035} h={0.8} rot={[0.5, 0, -0.3]} color="#10131c" line={0} /><Ball p={[-2.98, 1.72, -2.02]} r={0.11} color="#10131c" ink={1} />
    <Person p={[-3.6, 0, -3.5]} sy={0} h={3.5} look={lawyer} f={f} pose={{ mood: "deadpan", arms: t > 25.4 ? "point" : "down", armK: seg(t, 25.4, 25.7), armR: [0.7, 0.6], lookX: 0.3 }} />
    {/* the APPEAL stamp slams on "fight on" */}
    <Stamp t={t} t0={25.5} p={[1.6, 2.6, -1.6]} s={[3.2, 1.5]} rot={-0.14} lines={["APPEAL"]} ink="#2f8cff" />
    {/* the September 2027 calendar, the 14th circled */}
    {calK > 0.02 ? (
      <group position={[5.1, 4.5, -7.15]} scale={[calK, calK, 1]}>
        <CanvasPlane p={[0, 0, 0]} s={[3.1, 3.7]} px={[465, 555]} frame="#8a2a20" draw={(c, W, H) => {
          c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
          c.fillStyle = "#274b73"; c.fillRect(0, 0, W, H * 0.20);
          c.fillStyle = "#fff"; c.font = "900 54px Inter, Arial"; c.textAlign = "center"; c.fillText("SEP 2027", W / 2, H * 0.135);
          c.fillStyle = "#1b1b2a"; c.font = "900 185px Inter, Arial"; c.fillText("14", W / 2, H * 0.60);
          c.fillStyle = "#5a5a6a"; c.font = "800 40px Inter, Arial"; c.fillText("SENTENCING", W / 2, H * 0.82);
          if (t > 27.45) {
            c.strokeStyle = "#e5233a"; c.lineWidth = 13;
            c.beginPath(); c.ellipse(W / 2, H * 0.475, W * 0.33, H * 0.185, -0.06, 0, 7); c.stroke();
          }
        }} />
      </group>
    ) : null}
    <Plant p={[-8.6, 0, -4.8]} s={1.25} /><Lamp p={[8.8, 0, -4.4]} h={3.3} color="#d8e8ff" />
    <Chair p={[7.6, 0, -1.8]} rotY={-0.5} color="#39424e" />
    <Dust t={t} area={[7, 5, 5]} color="rgba(200,225,255,.9)" />
  </>);
};

/* =================== S7 28.62 – 31.43  "The Daily Toon News — the world, in toons." — sign-off, crimson-navy studio =================== */
const K7: Key[] = [
  { t: 28.62, pos: [0, 3.1, 9.8], look: [0, 2.9, -2], fov: 60 },
  { t: 31.43, pos: [0, 3.0, 8.4], look: [0, 3.0, -2], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => (
  <>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#2a0f1e" b="#220c18" unit={2.0} w={30} d={30} />
    <WallDoor z={-7} W={30} kind="plain" a="#33162b" b="#33162b" base="#1c0a16" />
    <SideWall x={-11} kind="plain" a="#2b1222" b="#2b1222" /><SideWall x={11} kind="plain" a="#2b1222" b="#2b1222" />
    <CanvasPlane p={[0, 4.9, -6.8]} s={[9.6, 5.2]} px={[960, 520]} frame="#160510" draw={(c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#200a1c"); g.addColorStop(1, "#571f3d"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = "#c22a3a"; c.beginPath(); c.arc(W * 0.5, H * 0.36, 74, 0, 7); c.fill();
      c.fillStyle = "#ffffff"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("T", W * 0.5, H * 0.36 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 150px Inter, Arial"; c.fillText("TDN", W * 0.5, H * 0.62);
      c.fillStyle = "#e5b83a"; c.fillRect(0, H * 0.82, W, H * 0.18);
      c.fillStyle = "#200a1c"; c.font = "900 44px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W * 0.5, H * 0.91);
    }} />
    <Glow p={[0, 4.9, -6.2]} r={5.2} color="rgba(255,90,120,1)" o={0.20} />
    <Globe p={[5.4, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
    <Cyl p={[5.4, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.4, 0.06, -5.2]} rt={0.55} h={0.12} color="#571f3d" line={1} />
    <Desk p={[0, 0, -2.6]} w={5.6} top="#571f3d" leg="#1c0a16" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#160510"; c.fillRect(0, 0, W, H); c.fillStyle = "#e5b83a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    <Box p={[-1.7, 1.12, -2.5]} s={[0.85, 0.05, 1.1]} color="#f2f0ea" line={1} /><Box p={[-1.6, 1.17, -2.55]} s={[0.85, 0.05, 1.1]} color="#dfe6ee" rot={[0, 0.25, 0]} line={1} />
    <Monitor p={[2.1, 1.05, -2.7]} rot={[0, -0.35, 0]} screen="#e5b83a" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#571f3d" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Clock p={[-7.6, 6.3, -4.95]} r={0.55} t={t} /><Frame p={[8.2, 3.4, -6.9]} s={[1.3, 1.0]} art={1} />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#220c18" b="#c22a3a" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, -0.35]} color="255,226,174" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(255,220,235,.9)" />
    <Person p={[0, 0, -3.6]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 28.8 && t < 29.4 ? 0.08 : 0,
      arms: t > 30.85 ? "point" : "down", armK: seg(t, 30.85, 31.1), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>
);

const CUTS = [0, 3.1, 8.85, 15.03, 18.66, 23.03, 28.62, 31.43];
export const TdnV6: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#1c2a5e">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#3a2415">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#3a2415">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#1d2733">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#3a2415">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#2c3852">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#33162b" trans="flash">{(c) => <S7 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 3.1 ? "rgba(70,110,255,.08)" : t < 8.85 ? "rgba(255,170,60,.07)" : t < 15.03 ? "rgba(255,120,60,.07)" : t < 18.66 ? "rgba(60,200,190,.07)" : t < 23.03 ? "rgba(255,190,80,.08)" : t < 28.62 ? "rgba(90,140,255,.08)" : "rgba(255,120,90,.07)"} />
      {/* S2 verdict chip (7.3–8.85s) */}
      {t > 7.3 && t < 8.85 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,6,8,.88)", color: "#ff8a7a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 56, padding: "16px 30px", borderRadius: 18 }}>
            10 OF 12 COUNTS — GUILTY
          </span>
        </div>
      ) : null}
      {/* S5 twist chip (19.4–22.9s) */}
      {t > 19.4 && t < 22.9 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(4,26,22,.88)", color: "#7dffce", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 46, padding: "16px 30px", borderRadius: 18 }}>
            CLEARED OF THE BIGGEST CHARGE
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
