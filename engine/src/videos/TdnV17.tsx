// TDN v17 — "Hackers Breached the US Air Force's Cloud": Reuters exclusive (27 Nov 2026) —
// hackers breached Cloud One, the US Air Force's flagship cloud platform. Found within the
// past month during an upgrade; disruption followed. One source: a software flaw let the
// intruders reach the control plane. Cloud One (since 2017) combines Microsoft, Amazon,
// Oracle and Google resources and powers scores of apps — personnel data and pay, logistics,
// maintenance. Back-office migration is paused. Reuters could NOT establish who did it, the
// scope, or whether data was stolen. Contractor: SAIC until 2025, then Leidos.
// Framing: attributed to Reuters; unknowns stated as unknown; no attacker speculation.
// 9:16 720x1280 30fps, 2128 frames (70.84 s voiceover). Production only — parent releases.
// CUTS = [0, 2.95, 13.22, 19.71, 30.68, 44.68, 57.48, 65.18, 70.95].
// S1 hook / S2 the platform / S3 the discovery / S4 the control plane / S5 what it runs
// S6 handover + pause / S7 the unknowns / S8 closer: one hidden way in
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

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const intruder: Look = { skin: "#e8b98d", body: "#23232e", outfit: "hoodie", hair: "short", hairColor: "#0c0c12", shoe: "#0c0c12" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV16) ---------- */
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
/* server rack tower: dark cabinet, shelf slots, blinking LEDs (deterministic in t) */
const Rack: React.FC<{ p: V3; h?: number; w?: number; t: number; seed?: number; alarm?: boolean }> = ({ p, h = 4.6, w = 1.9, t, seed = 0, alarm = false }) => (
  <group position={p}>
    <Box p={[0, h / 2, 0]} s={[w, h, 1.1]} color="#1a2233" line={2} />
    <CanvasPlane p={[0, h / 2, 0.58]} s={[w * 0.92, h * 0.94]} px={[256, 640]} draw={(c, W, H) => {
      c.fillStyle = "#11182a"; c.fillRect(0, 0, W, H);
      const rows = 8;
      for (let i = 0; i < rows; i++) {
        const y = 18 + i * ((H - 36) / rows);
        c.fillStyle = "#232f47"; c.fillRect(14, y, W - 28, (H - 36) / rows - 12);
        for (let j = 0; j < 4; j++) {
          const on = (Math.floor(t * 2.2) + i * 3 + j * 7 + seed) % 4 !== 0;
          c.fillStyle = alarm ? (on ? "#ff5a4a" : "#571f18") : (on ? (j % 3 === 0 ? "#2fd46a" : "#38b6d9") : "#1c2a1e");
          c.beginPath(); c.arc(34 + j * 26, y + ((H - 36) / rows - 12) / 2, 6, 0, Math.PI * 2); c.fill();
        }
        c.fillStyle = "#39496b"; c.fillRect(W - 66, y + 8, 44, 5);
      }
    }} />
  </group>
);
/* stylised cloud made of spheres, on a glowing core */
const CloudCore: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#dfe9f5" }) => (
  <group position={p} scale={[s, s, s]}>
    <Ball p={[0, 0, 0]} r={1.15} color={color} ink={0.03} />
    <Ball p={[-1.05, -0.25, 0]} r={0.82} color={color} ink={0.03} />
    <Ball p={[1.05, -0.25, 0]} r={0.86} color={color} ink={0.03} />
    <Ball p={[-0.45, 0.55, 0]} r={0.78} color={color} ink={0.03} />
    <Ball p={[0.5, 0.5, 0.1]} r={0.72} color={color} ink={0.03} />
    <Box p={[0, -0.95, 0]} s={[2.9, 0.5, 1.4]} color={color} line={1} />
  </group>
);
/* glowing jagged crack panel — the software flaw */
const Crack: React.FC<{ p: V3; w: number; glowK: number }> = ({ p, w, glowK }) => (
  <CanvasPlane p={p} s={[w, w * 1.2]} px={[512, 614]} draw={(c, W, H) => {
    c.fillStyle = "#0d1420"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "#2c3d5c"; c.lineWidth = 6; c.strokeRect(10, 10, W - 20, H - 20);
    c.strokeStyle = `rgba(255,${Math.round(120 + 80 * glowK)},60,${0.55 + 0.45 * glowK})`;
    c.lineWidth = 13; c.lineJoin = "round"; c.beginPath();
    c.moveTo(W * 0.52, 8); c.lineTo(W * 0.44, H * 0.22); c.lineTo(W * 0.58, H * 0.4); c.lineTo(W * 0.4, H * 0.58); c.lineTo(W * 0.55, H * 0.78); c.lineTo(W * 0.47, H - 8); c.stroke();
    c.lineWidth = 7; c.beginPath();
    c.moveTo(W * 0.44, H * 0.22); c.lineTo(W * 0.26, H * 0.34); c.moveTo(W * 0.58, H * 0.4); c.lineTo(W * 0.78, H * 0.5); c.moveTo(W * 0.4, H * 0.58); c.lineTo(W * 0.2, H * 0.7); c.stroke();
  }} />
);

/* =================== S1 0 – 2.95  hook: the Air Force's cloud was hacked =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.0, 16.6], look: [0, 3.6, -6], fov: 60 },
  { t: 2.95, pos: [0, 3.9, 14.6], look: [0, 3.6, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const bK = seg(t, 0.55, 1.1, Easing.out(Easing.back(1.7)));
  const pulse = 0.55 + 0.45 * Math.sin(t * 5.2);
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#bcd2ff" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={56} />
    {/* corridor of racks receding both sides */}
    {[-7.5, -4.6].map((x, i) => <Rack key={"l" + i} p={[x, 0, -4 - i * 5]} h={6.4} w={2.2} t={t} seed={i * 3 + 1} />)}
    {[7.5, 4.6].map((x, i) => <Rack key={"r" + i} p={[x, 0, -4 - i * 5]} h={6.4} w={2.2} t={t} seed={i * 5 + 2} />)}
    {/* the cloud core at the end of the corridor, pulsing red at its base */}
    <Glow p={[0, 5.4, -13]} r={4.6} color="#7fb2ff" o={0.5} />
    <Glow p={[0, 2.2, -12.4]} r={2.6 * pulse + 1.2} color="#ff4a3c" o={0.55} />
    <CloudCore p={[0, 5.6, -13]} s={1.5} />
    <Box p={[0, 0.5, -13]} s={[4.6, 1.0, 2.6]} color="#232f47" line={2} />
    {/* the intruder, hooded, at a terminal in the right foreground */}
    <Desk p={[3.8, 0, -2.5]} w={3.0} top="#2a3448" leg="#1a2233" />
    <Monitor p={[3.8, 1.85, -3.1]} s={1.15} screen="#3a0f14" />
    <Person p={[3.8, 0, -1.2]} h={3.5} look={intruder} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.85, armR: [0.7, 0.55], armL: [0.45, 0.5], lookX: -0.5, hunch: 0.35 }} />
    {bK > 0.02 ? <group position={[0, 10.9, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={10.6} lines={[{ t: "THE AIR FORCE'S CLOUD", s: 74, c: "#f5f7fa" }, { t: "WAS HACKED", s: 96, c: "#ff6a5e" }]} /></group> : null}
  </>);
};

/* =================== S2 2.95 – 13.22  the platform: Cloud One =================== */
const K2: Key[] = [
  { t: 2.95, pos: [0, 4.4, 17.8], look: [0, 4.2, -6], fov: 60 },
  { t: 13.22, pos: [0, 4.2, 15.2], look: [0, 4.2, -6], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const sK = seg(t, 4.8, 5.35, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 9.85, 10.4, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1b2a44" b="#16233a" unit={2.6} w={64} d={54} />
    {/* the citadel: a tower of racks crowned by the cloud */}
    {[-2.6, 0, 2.6].map((x, i) => <Rack key={i} p={[x, 0, -11]} h={7.6} w={2.3} t={t} seed={i * 4 + 1} />)}
    {[-1.3, 1.3].map((x, i) => <Rack key={"u" + i} p={[x, 7.6, -11]} h={2.6} w={2.3} t={t} seed={i * 6 + 3} />)}
    <Glow p={[0, 12.6, -11]} r={4.4} color="#8ae8ff" o={0.5} />
    <CloudCore p={[0, 12.4, -11]} s={1.6} />
    {/* side rows of racks */}
    {[-8.6, 8.6].map((x, i) => <Rack key={"s" + i} p={[x, 0, -7]} h={5.6} w={2.1} t={t} seed={i * 7 + 2} />)}
    {[-8.6, 8.6].map((x, i) => <Rack key={"s2" + i} p={[x, 0, -1]} h={5.6} w={2.1} t={t} seed={i * 9 + 5} />)}
    {/* the analyst on duty, presenting the platform */}
    <Person p={[-4.6, 0, -3.5]} h={3.9} look={analyst} f={f} pose={{ mood: "smile", arms: "point", armK: seg(t, 3.4, 3.9), armR: [0.85, 0.75], lookX: 0.45 }} />
    <Plant p={[5.6, 0, -3]} />
    {sK > 0.02 ? <group position={[0, 9.9, -10.4]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[9.2, 1.0]} text="CLOUD ONE" bg="#0d2f47" fg="#8ae8ff" size={130} frame="#38b6d9" /></group> : null}
    {bK > 0.02 ? <group position={[0, 6.9, -9.8]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={10.4} lines={[{ t: "THE DIGITAL BACKBONE", s: 76, c: "#ffd36a" }, { t: "OF THE AIR FORCE", s: 76, c: "#f5f7fa" }]} /></group> : null}
  </>);
};

/* =================== S3 13.22 – 19.71  the discovery, during the upgrade =================== */
const K3: Key[] = [
  { t: 13.22, pos: [0, 4.2, 15.4], look: [0, 3.8, -6], fov: 60 },
  { t: 19.71, pos: [0, 4.0, 13.6], look: [0, 3.8, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const found = t >= 14.0;
  const stK = seg(t, 14.0, 14.45, Easing.out(Easing.back(2.2)));
  const sK = seg(t, 17.75, 18.3, Easing.out(Easing.back(1.7)));
  const prog = clamp(seg(t, 13.3, 19.4));
  return (<>
    <Cam t={t} keys={K3} impacts={[[14.0, 0.1]]} />
    <Lights warm={found ? "#ffd2c4" : "#ffe9c4"} />
    <Floor kind="tile" a="#20304e" b="#1a2740" unit={2.4} w={56} d={48} />
    {/* upgrade console */}
    <Desk p={[0, 0, -4.5]} w={6.4} top="#33415e" leg="#232f47" />
    <Monitor p={[-1.7, 2.0, -5.2]} s={1.3} screen={found ? (Math.floor(t * 6) % 2 ? "#5a1216" : "#2a0d20") : "#1c3a5a"} />
    <Monitor p={[1.7, 2.0, -5.2]} s={1.3} screen={found ? (Math.floor(t * 6 + 1) % 2 ? "#5a1216" : "#2a0d20") : "#1c3a5a"} />
    <Rack p={[-6.8, 0, -6]} h={6.2} w={2.1} t={t} seed={4} alarm={found} />
    <Rack p={[6.8, 0, -6]} h={6.2} w={2.1} t={t} seed={8} alarm={found} />
    {/* the upgrade progress bar, filling until the discovery */}
    <group position={[0, 9.6, -9]}>
      <Sign p={[0, 1.05, 0]} s={[9.6, 0.9]} text="SYSTEM UPGRADE IN PROGRESS" bg="#101828" fg="#8ae8ff" size={92} frame="#38b6d9" />
      <Box p={[0, 0, 0]} s={[9.6, 0.62, 0.2]} color="#232f47" line={2} />
      <Box p={[-4.8 + (9.2 * prog) / 2, 0, 0.14]} s={[Math.max(0.05, 9.2 * prog), 0.4, 0.1]} color={found ? "#ff5a4a" : "#2fd46a"} line={0} />
    </group>
    {/* the analyst spots it */}
    <Person p={[0, 0, -2.2]} h={3.9} look={analyst} f={f} pose={{ mood: found ? "shock" : "smile", arms: "point", armK: 0.8, armR: [0.7, 0.7], lookX: 0.1, nerv: found ? 0.7 : 0 }} />
    {found ? <Glow p={[0, 8.6, -10]} r={3.6} color="#ff4a3c" o={0.4} /> : null}
    {stK > 0.02 ? <group position={[2.4, 6.2, -5.6]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={6.0} text="INTRUDER FOUND" /></group> : null}
    {sK > 0.02 ? <group position={[0, 12.2, -10.5]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.6, 0.95]} text="DISRUPTION ACROSS THE PLATFORM" bg="#2a0f14" fg="#ff9a8a" size={92} frame="#e5233a" /></group> : null}
  </>);
};

/* =================== S4 19.71 – 30.68  the control plane =================== */
const K4: Key[] = [
  { t: 19.71, pos: [0, 5.2, 17.6], look: [0, 5.2, -6], fov: 60 },
  { t: 30.68, pos: [0, 5.0, 15.4], look: [0, 5.2, -6], fov: 57 },
];
const S4 = ({ t, f }: Ctx) => {
  const flawK = seg(t, 22.75, 23.3, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 23.85, 24.4, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 27.35, 27.9, Easing.out(Easing.back(1.7)));
  /* the climb: crack at the base (22.8) -> layer 1 -> layer 2 -> the control deck (26.6) */
  const climb = clamp(seg(t, 22.9, 26.6));
  const ix = lerp(-5.4, 0.6, Easing.inOut(Easing.cubic)(climb));
  const iy = climb < 0.4 ? lerp(0, 2.55, climb / 0.4) : climb < 0.75 ? lerp(2.55, 5.05, (climb - 0.4) / 0.35) : lerp(5.05, 7.55, (climb - 0.75) / 0.25);
  const slab = (y: number, col: string) => (
    <group position={[0, y, -7]}>
      <Box p={[0, 0.8, 0]} s={[13.5, 1.6, 3.6]} color={col} line={2} />
      {[-5.4, -2.7, 0, 2.7, 5.4].map((x, i) => <Box key={i} p={[x, 0.8, 1.85]} s={[2.2, 1.1, 0.08]} color="#39496b" line={1} />)}
    </group>
  );
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#dfe8ff" />
    <Floor kind="tile" a="#16233a" b="#121c30" unit={2.6} w={60} d={50} />
    {/* three stacked server layers */}
    {slab(0, "#1d2a44")}
    {slab(2.5, "#22314e")}
    {slab(5.0, "#273858")}
    {/* the control deck on top */}
    <group position={[0, 7.5, -7]}>
      <Box p={[0, 0.45, 0]} s={[9.5, 0.9, 3.4]} color="#31456b" line={2} />
      <Box p={[0, 2.6, -0.6]} s={[6.8, 3.4, 0.35]} color="#0d1a2e" line={2} />
      <CanvasPlane p={[0, 2.6, -0.4]} s={[6.2, 2.9]} px={[640, 300]} draw={(c, W, H) => {
        c.fillStyle = "#0a2f47"; c.fillRect(0, 0, W, H);
        c.strokeStyle = "#38b6d9"; c.lineWidth = 5;
        for (let i = 0; i < 4; i++) { c.strokeRect(26 + i * 12, 30 + i * 26, W - 52 - i * 24, H - 60 - i * 40); }
        c.fillStyle = "#ffd36a"; c.beginPath(); c.arc(W / 2, H / 2, 17, 0, Math.PI * 2); c.fill();
        c.fillStyle = "#8ae8ff"; c.font = "900 34px Inter, Arial"; c.textAlign = "center";
        c.fillText("MASTER CONTROL", W / 2, 34);
      }} />
    </group>
    {/* the cracked panel at the base — the flaw */}
    <group position={[-5.0, 0, -4.6]}>
      <Crack p={[0, 1.7, 0]} w={2.6} glowK={0.5 + 0.5 * Math.sin(t * 4.4)} />
    </group>
    <Glow p={[-5.0, 1.7, -4.2]} r={2.2} color="#ff9a3c" o={0.5} />
    {/* the intruder climbs through the layers to the top */}
    <Person p={[ix, iy, -4.15]} h={3.1} look={intruder} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.7, armR: [0.6, 0.8], lookX: 0.3, hunch: climb > 0 && climb < 1 ? 0.4 : 0.1 }} />
    {flawK > 0.02 ? <group position={[-4.5, 5.6, -6.5]} scale={[flawK, flawK, 1]}><Sign p={[0, 0, 0]} s={[7.6, 0.9]} text="ONE SOFTWARE FLAW" bg="#2a0f14" fg="#ffb35e" size={104} frame="#e5233a" /></group> : null}
    {bK > 0.02 ? <group position={[1.8, 12.6, -9]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.8} lines={[{ t: "THE CONTROL PLANE", s: 82, c: "#8ae8ff" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0.6, 6.85, -4.8]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.2, 0.95]} text="ABOVE EVERYTHING IT RUNS" bg="#101828" fg="#ffd36a" size={104} frame="#c9a227" /></group> : null}
  </>);
};

/* =================== S5 30.68 – 44.68  what it runs: 2017, the giants, the apps =================== */
const K5: Key[] = [
  { t: 30.68, pos: [0, 4.6, 16.8], look: [0, 4.6, -6], fov: 60 },
  { t: 44.68, pos: [0, 4.4, 15.0], look: [0, 4.6, -6], fov: 57 },
];
const S5 = ({ t, f }: Ctx) => {
  const sK = seg(t, 31.9, 32.45, Easing.out(Easing.back(1.7)));
  const chip = (x: number, at: number, label: string, col: string) => {
    const k = seg(t, at, at + 0.5, Easing.out(Easing.back(1.7)));
    return k > 0.02 ? <group key={label} position={[x, 8.3, -9]} scale={[k, k, 1]}><Board p={[0, 0, 0]} w={4.9} bg="#0d1524" frame={col} lines={[{ t: label, s: 74, c: col }]} /></group> : null;
  };
  const tile = (x: number, y: number, at: number, label: string, icon: string, col: string) => {
    const k = seg(t, at, at + 0.5, Easing.out(Easing.back(1.7)));
    return k > 0.02 ? (
      <group key={label} position={[x, y, -8.6]} scale={[k, k, 1]}>
        <CanvasPlane p={[0, 0, 0]} s={[5.5, 3.1]} px={[640, 360]} frame={col} draw={(c, W, H) => {
          c.fillStyle = "#101828"; c.fillRect(0, 0, W, H);
          c.fillStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
          if (icon === "file") { c.fillRect(W / 2 - 42, 26, 84, 108); c.fillStyle = "#101828"; c.fillRect(W / 2 - 28, 52, 56, 9); c.fillRect(W / 2 - 28, 76, 56, 9); c.fillRect(W / 2 - 28, 100, 38, 9); }
          else if (icon === "coin") { c.beginPath(); c.arc(W / 2, 80, 56, 0, Math.PI * 2); c.fill(); c.fillStyle = "#101828"; c.font = "900 74px Inter, Arial"; c.fillText("$", W / 2, 84); }
          else if (icon === "truck") { c.fillRect(W / 2 - 78, 44, 104, 62); c.fillRect(W / 2 + 30, 62, 48, 44); c.fillStyle = "#101828"; c.beginPath(); c.arc(W / 2 - 44, 112, 15, 0, Math.PI * 2); c.arc(W / 2 + 48, 112, 15, 0, Math.PI * 2); c.fill(); }
          else { c.save(); c.translate(W / 2, 80); c.rotate(0.7); c.fillRect(-13, -58, 26, 92); c.restore(); c.beginPath(); c.arc(W / 2 - 26, 118, 21, 0, Math.PI * 2); c.fill(); }
          c.fillStyle = "#f5f7fa"; c.font = "900 47px Inter, Arial";
          const words = label.split(" ");
          if (words.length > 1) { c.fillText(words[0], W / 2, H - 88); c.fillText(words.slice(1).join(" "), W / 2, H - 38); }
          else c.fillText(label, W / 2, H - 56);
        }} />
      </group>
    ) : null;
  };
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1d2c47" b="#182640" unit={2.6} w={60} d={50} />
    <Rack p={[-6.6, 0, -6]} h={6.8} w={2.0} t={t} seed={2} />
    <Rack p={[6.6, 0, -6]} h={6.8} w={2.0} t={t} seed={6} />
    {sK > 0.02 ? <group position={[0, 12.3, -10]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.4, 1.0]} text="SINCE 2017 — ONE-STOP SHOP" bg="#0d2f47" fg="#8ae8ff" size={100} frame="#38b6d9" /></group> : null}
    {chip(-5.85, 36.1, "MICROSOFT", "#7fb2ff")}
    {chip(-1.95, 37.0, "AMAZON", "#ffb35e")}
    {chip(1.95, 37.7, "ORACLE", "#ff8a8a")}
    {chip(5.85, 38.45, "GOOGLE", "#8affc1")}
    {tile(-3.1, 4.6, 42.0, "PERSONNEL RECORDS", "file", "#38b6d9")}
    {tile(3.1, 4.6, 42.95, "PAY", "coin", "#c9a227")}
    {tile(-3.1, 1.2, 43.55, "LOGISTICS", "truck", "#2fd46a")}
    {tile(3.1, 1.2, 44.05, "MAINTENANCE", "wrench", "#ff8a1c")}
  </>);
};

/* =================== S6 44.68 – 57.48  handover, then the pause =================== */
const K6: Key[] = [
  { t: 44.68, pos: [0, 4.4, 16.6], look: [0, 4.0, -6], fov: 60 },
  { t: 57.48, pos: [0, 4.2, 14.8], look: [0, 4.0, -6], fov: 57 },
];
const S6 = ({ t, f }: Ctx) => {
  const aK = seg(t, 46.75, 47.3, Easing.out(Easing.back(1.7)));
  const lK = seg(t, 49.0, 49.55, Easing.out(Easing.back(1.7)));
  const stK = seg(t, 52.35, 52.8, Easing.out(Easing.back(2.2)));
  const qK = seg(t, 56.25, 56.8, Easing.out(Easing.back(1.7)));
  const stopped = t >= 51.7;
  const belt = stopped ? 0 : (t * 1.35) % 3.1;
  const appBox = (i: number) => {
    const x = -8.5 + ((i * 3.1 + belt) % 15.5);
    const tip = stopped && i === 2 ? -0.5 : 0;
    return (
      <group key={i} position={[x, 1.65, -6]} rotation={[0, 0, tip]}>
        <Box p={[0, 0.55, 0]} s={[1.7, 1.1, 1.3]} color={["#2e6da4", "#3f9142", "#6a4a8c", "#c2452d", "#31517d"][i % 5]} line={2} />
      </group>
    );
  };
  return (<>
    <Cam t={t} keys={K6} impacts={[[51.7, 0.13]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#24334f" b="#1d2a42" unit={2.4} w={60} d={50} />
    {/* contractor boards, top left */}
    {aK > 0.02 ? <group position={[-3.8, 11.9, -10.5]} scale={[aK, aK, 1]}>
      <Board p={[0, 0, 0]} w={6.4} lines={[{ t: "SAIC", s: 96, c: "#f5f7fa" }]} />
      {lK > 0.5 ? <group position={[0, 0, 0.2]}>
        <Box p={[0, 0, 0]} s={[5.4, 0.3, 0.1]} color="#e5233a" line={0} rot={[0, 0, 0.5]} />
        <Box p={[0, 0, 0]} s={[5.4, 0.3, 0.1]} color="#e5233a" line={0} rot={[0, 0, -0.5]} />
      </group> : null}
    </group> : null}
    {lK > 0.02 ? <group position={[-3.8, 9.3, -10.5]} scale={[lK, lK, 1]}><Board p={[0, 0, 0]} w={7.6} bg="#0d2417" frame="#2fd46a" lines={[{ t: "LEIDOS — SINCE 2025", s: 62, c: "#8affc1" }]} /></group> : null}
    {/* the conveyor of back-office apps heading for the cloud gate */}
    <Box p={[0, 1.05, -6]} s={[19, 0.5, 2.2]} color="#39424c" line={2} />
    {[0, 1, 2, 3, 4].map(appBox)}
    <group position={[7.6, 0, -9.5]}>
      <Glow p={[0, 4.6, 0]} r={3.2} color="#8ae8ff" o={0.5} />
      <CloudCore p={[0, 4.8, 0]} s={1.05} />
      <Box p={[0, 0.4, 0]} s={[3.6, 0.8, 2.2]} color="#232f47" line={2} />
    </group>
    {/* the barrier slams down at "paused" */}
    <group position={[5.2, 0, -4.2]}>
      <Box p={[0, 1.6, 0]} s={[0.5, 3.2, 0.5]} color="#2b2f36" line={2} />
      <group position={[0, 3.1, 0]} rotation={[0, 0, stopped ? -1.35 : 0]}>
        <Box p={[2.2, 0, 0]} s={[4.6, 0.42, 0.36]} color="#e5233a" line={2} />
        <Box p={[1.2, 0, 0.02]} s={[0.8, 0.44, 0.38]} color="#f5f7fa" line={1} />
        <Box p={[3.2, 0, 0.02]} s={[0.8, 0.44, 0.38]} color="#f5f7fa" line={1} />
      </group>
    </group>
    {stK > 0.02 ? <group position={[0.4, 6.9, -7.5]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={7.2} text="MIGRATION PAUSED" /></group> : null}
    {qK > 0.02 ? <group position={[0, 13.1, -11]} scale={[qK, qK, 1]}><Sign p={[0, 0, 0]} s={[10.8, 0.95]} text="HOW DEEP DOES IT GO?" bg="#101828" fg="#ffd36a" size={108} frame="#c9a227" /></group> : null}
  </>);
};

/* =================== S7 57.48 – 65.18  the unknowns =================== */
const K7: Key[] = [
  { t: 57.48, pos: [0, 4.4, 16.2], look: [0, 4.4, -6], fov: 60 },
  { t: 65.18, pos: [0, 4.2, 14.6], look: [0, 4.4, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const sK = seg(t, 58.2, 58.75, Easing.out(Easing.back(1.7)));
  const q = (y: number, at: number, text: string) => {
    const k = seg(t, at, at + 0.5, Easing.out(Easing.back(1.7)));
    const uk = seg(t, at + 0.55, at + 0.95, Easing.out(Easing.back(2.2)));
    return k > 0.02 ? (
      <group key={text} position={[0, y, -9.5]}>
        <group scale={[k, k, 1]}><Board p={[0, 0, 0]} w={10.8} lines={[{ t: text, s: 78, c: "#f5f7fa" }]} /></group>
        {uk > 0.02 ? <group position={[3.4, -0.4, 0.3]} scale={[uk, uk, 1]}><Stamp p={[0, 0, 0]} w={4.6} text="UNKNOWN" color="#ffd36a" /></group> : null}
      </group>
    ) : null;
  };
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#cfd8ea" />
    <Floor kind="carpet" a="#101623" b="#0c111d" unit={2} w={44} d={40} />
    {/* one pool of light in a dark room */}
    <Glow p={[0, 7.5, -9]} r={5.2} color="#ffe9b0" o={0.35} />
    <Glow p={[0, 12.8, -10]} r={2.2} color="#fff3cf" o={0.5} />
    {/* the analyst stands small beneath the questions */}
    <Person p={[0, 0, -4.5]} h={3.6} look={analyst} f={f} pose={{ mood: "worry", arms: "down", lookX: 0, tilt: -0.04 }} />
    {sK > 0.02 ? <group position={[0, 13.2, -11]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.8, 0.95]} text="REUTERS COULD NOT ESTABLISH" bg="#101828" fg="#ffd36a" size={96} frame="#c9a227" /></group> : null}
    {q(10.3, 61.2, "WHO DID IT?")}
    {q(7.6, 62.5, "HOW FAR DID THEY GET?")}
    {q(4.9, 64.05, "WAS DATA STOLEN?")}
  </>);
};

/* =================== S8 65.18 – 70.95  closer: one hidden way in =================== */
const K8: Key[] = [
  { t: 65.18, pos: [0, 4.4, 17.8], look: [0, 4.6, -6], fov: 60 },
  { t: 70.95, pos: [0, 4.2, 15.6], look: [0, 4.6, -6], fov: 57 },
];
const S8 = ({ t, f }: Ctx) => {
  const bK = seg(t, 67.4, 67.95, Easing.out(Easing.back(1.7)));
  const brandK = seg(t, 69.3, 69.85, Easing.out(Easing.back(1.7)));
  const doorK = clamp(seg(t, 66.0, 67.2));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#bcd2ff" />
    <Stars p={[0, 13, -24]} s={[46, 15]} t={t} />
    <Floor kind="tile" a="#101a2c" b="#0c1424" unit={2.6} w={60} d={50} />
    {/* the citadel at night */}
    {[-2.6, 0, 2.6].map((x, i) => <Rack key={i} p={[x, 0, -11]} h={7.2} w={2.3} t={t} seed={i * 3 + 2} />)}
    <CloudCore p={[0, 9.6, -11]} s={1.4} color="#c7d5e8" />
    <Glow p={[0, 9.6, -11]} r={3.8} color="#5f83b8" o={0.4} />
    {/* one small door at the base, ajar, red light spilling out */}
    <group position={[0, 0, -8.2]}>
      <Box p={[0, 1.5, 0]} s={[2.5, 3.1, 0.3]} color="#0a0f1a" line={2} />
      <Glow p={[0, 1.5, 0.5]} r={1.6 + doorK * 1.6} color="#ff4a3c" o={0.65} />
      <group position={[-1.15, 0, 0.2]} rotation={[0, -doorK * 1.15, 0]}>
        <Box p={[1.15, 1.5, 0]} s={[2.3, 3.0, 0.16]} color="#7a1f24" line={2} />
        <Ball p={[2.0, 1.5, 0.16]} r={0.11} color="#ffd36a" ink={0.02} />
      </group>
    </group>
    {bK > 0.02 ? <group position={[0, 12.9, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={10.6} lines={[{ t: "WHO CAME THROUGH IT?", s: 76, c: "#ff9a8a" }]} /></group> : null}
    {brandK > 0.02 ? <group position={[0, 5.9, -9.6]} scale={[brandK, brandK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={100} frame="#7a4a8c" /></group> : null}
  </>);
};

const CUTS = [0, 2.95, 13.22, 19.71, 30.68, 44.68, 57.48, 65.18, 70.95];
export const TdnV17: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0a1120">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#101f38" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#14233d">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#0d1830" trans="flash">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#132239" trans="zoom">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#182740">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#070b14" trans="whip">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#080f1e">{(c) => <S8 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 2.95 ? "rgba(255,80,60,.07)" : t < 13.22 ? "rgba(120,190,255,.07)" : t < 19.71 ? "rgba(255,170,90,.07)" : t < 30.68 ? "rgba(110,160,255,.08)" : t < 44.68 ? "rgba(255,200,110,.06)" : t < 57.48 ? "rgba(255,190,90,.06)" : t < 65.18 ? "rgba(255,220,150,.05)" : "rgba(90,130,200,.08)"} />
      {/* S2 chip (5–11.5s): source attribution */}
      {t > 5 && t < 11.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            SOURCE: REUTERS EXCLUSIVE
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
