// TDN v15 — "The Job Offer Was the Trap" — 164 rescued from a scam compound in India:
// Delhi Police Crime Branch raided an alleged trafficking / cyber-fraud compound in Noida
// Sector 136 (statement Thu 26 Nov 2026) and rescued 164 foreign nationals — 92 Indonesians
// + 72 Malaysians, most aged 19–25 — lured by fake job offers, passports seized on arrival,
// forced to run fake-investment scams targeting people back home. Seized: 355 phones,
// 168 computers, 26 laptops, 53 SIM cards, 174 passports. One suspect arrested (Malaysian,
// 25, role under investigation); two alleged key members on the run; 10+ police teams across
// five states. JUSTICE/PROCESS framing: the 164 are VICTIMS; allegations as allegations.
// Sources: Reuters; The Hindu BusinessLine; Deccan Herald; Hindustan Times — 27 Nov 2026.
// 9:16 720x1280 30fps, 1756 frames (58.44 s voiceover). Production only — parent handles release.
// CUTS = [0, 3.81, 9.54, 15.23, 23.13, 31.23, 37.25, 42.37, 47.82, 53.54, 58.44].
// S1 hook (airport) / S2 the raid / S3 the rescued / S4 the lure / S5 the scam floor
// S6 seized I / S7 seized II / S8 the arrest / S9 the hunt / S10 closer
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
const policeLook: Look = { skin: "#caa27e", body: "#3a4a6b", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#ffd36a", shoe: "#101018" };
const officer2Look: Look = { skin: "#8a5a34", body: "#46586e", outfit: "shirt", hair: "short", hairColor: "#0c0c12", badge: "#8ae8ff", shoe: "#0c0c12" };
const young1: Look = { skin: "#e8b98d", body: "#2e7d5b", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", badge: "#8a8a96", shoe: "#1b1b2a" };
const young2: Look = { skin: "#caa27e", body: "#8c3a4a", outfit: "hoodie", hair: "short", hairColor: "#241a10", badge: "#8a8a96", shoe: "#101018" };
const young3: Look = { skin: "#f0c8a0", body: "#31517d", outfit: "shirt", hair: "short", hairColor: "#0c0c12", badge: "#8a8a96", shoe: "#101018" };
const agentLook: Look = { skin: "#fbe3c8", body: "#23283a", outfit: "shirt", hair: "short", hairColor: "#3a2a1a", badge: "#c9a227", shoe: "#101018" };
const suspectLook: Look = { skin: "#e8b98d", body: "#5b5348", outfit: "hoodie", hair: "short", hairColor: "#14100c", badge: "#8a8a96", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV14) ---------- */
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
/* passport booklet */
const Passport: React.FC<{ p: V3; color?: string; rot?: number }> = ({ p, color = "#7a1f2b", rot = 0 }) => (
  <group position={p} rotation={[0, rot, 0]}>
    <Box p={[0, 0.09, 0]} s={[0.62, 0.18, 0.88]} color={color} line={2} />
    <Ball p={[0, 0.2, 0]} r={0.13} color="#ffd36a" ink={0.02} />
  </group>
);
/* rolling suitcase */
const Suitcase: React.FC<{ p: V3; color: string }> = ({ p, color }) => (
  <group position={p}>
    <Box p={[0, 0.85, 0]} s={[0.95, 1.5, 0.55]} color={color} line={2} />
    <Box p={[0, 1.95, 0]} s={[0.5, 0.55, 0.1]} color="#9aa2ae" line={1} />
    <Ball p={[-0.3, 0.14, 0]} r={0.14} color="#14161c" ink={0.02} />
    <Ball p={[0.3, 0.14, 0]} r={0.14} color="#14161c" ink={0.02} />
  </group>
);
/* pile of seized phones */
const PhonePile: React.FC<{ p: V3; n: number }> = ({ p, n }) => (
  <group position={p}>
    {Array.from({ length: n }, (_, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      return <Box key={i} p={[(col - 1.5) * 0.52, 0.14 + row * 0.26, (rnd(i * 3) - 0.5) * 0.2]} s={[0.44, 0.2, 0.8]} color={i % 5 === 0 ? "#31517d" : "#1c2735"} line={1} rot={[0, (rnd(i) - 0.5) * 0.4, 0]} />;
    })}
  </group>
);
/* stylised India map with the five-state hunt cluster in the north */
const IndiaMap: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w]} px={[1024, 1024]} frame="#38b6d9" draw={(c, W, H) => {
    c.fillStyle = "#0d2036"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#27543a"; c.strokeStyle = "#0b0d1a"; c.lineWidth = 10;
    c.beginPath();
    c.moveTo(430, 90); c.lineTo(560, 110); c.lineTo(610, 190); c.lineTo(700, 210); c.lineTo(790, 260);
    c.lineTo(880, 240); c.lineTo(930, 300); c.lineTo(830, 350); c.lineTo(800, 430); c.lineTo(720, 470);
    c.lineTo(690, 560); c.lineTo(610, 640); c.lineTo(560, 780); c.lineTo(520, 920); c.lineTo(480, 790);
    c.lineTo(430, 660); c.lineTo(340, 600); c.lineTo(250, 520); c.lineTo(160, 470); c.lineTo(210, 380);
    c.lineTo(300, 300); c.lineTo(340, 190); c.lineTo(380, 130); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#8ae8ff"; c.font = "900 58px Inter, Arial"; c.textAlign = "left";
    c.fillText("INDIA", 90, 950);
    c.fillStyle = "#ffd36a"; c.font = "900 38px Inter, Arial";
    c.fillText("ARABIAN SEA", 60, 700); c.fillText("BAY OF BENGAL", 640, 760);
  }} />
);
const MapPin: React.FC<{ p: V3; label: string }> = ({ p, label }) => (
  <group position={p}>
    <Ball p={[0, 0.55, 0]} r={0.34} color="#e5233a" />
    <Cyl p={[0, 0.1, 0]} rt={0.05} rb={0.16} h={0.5} color="#e5233a" line={1} />
    <Sign p={[0, 1.35, 0]} s={[2.9, 0.62]} text={label} bg="#101828" fg="#ffd36a" size={64} frame="#e5233a" />
  </group>
);
/* flag boards */
const FlagID: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[512, 318]} frame="#f5f7fa" draw={(c, W, H) => {
    c.fillStyle = "#e70011"; c.fillRect(0, 0, W, H / 2);
    c.fillStyle = "#ffffff"; c.fillRect(0, H / 2, W, H / 2);
  }} />
);
const FlagMY: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[512, 318]} frame="#f5f7fa" draw={(c, W, H) => {
    for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? "#ffffff" : "#cc0001"; c.fillRect(0, (H / 7) * i, W, H / 7 + 1); }
    c.fillStyle = "#010066"; c.fillRect(0, 0, W * 0.52, H * 4 / 7);
    c.fillStyle = "#fc0";
    c.beginPath(); c.arc(W * 0.2, H * 2 / 7, H * 0.16, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#010066";
    c.beginPath(); c.arc(W * 0.26, H * 2 / 7, H * 0.13, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#fc0";
    c.beginPath(); c.arc(W * 0.4, H * 2 / 7, H * 0.1, 0, Math.PI * 2); c.fill();
  }} />
);
/* wanted board: silhouette only */
const WantedBoard: React.FC<{ p: V3; w: number; caption: string }> = ({ p, w, caption }) => (
  <group position={p}>
    <Box p={[0, 0, 0]} s={[w, w * 1.34, 0.25]} color="#efe6d0" line={2} />
    <CanvasPlane p={[0, 0, 0.16]} s={[w * 0.95, w * 1.27]} px={[512, 690]} draw={(c, W, H) => {
      c.fillStyle = "#efe6d0"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = "#b3122e"; c.font = "900 92px Inter, Arial"; c.fillText("WANTED", W / 2, H * 0.1);
      c.fillStyle = "#23232e";
      c.beginPath(); c.arc(W / 2, H * 0.42, 78, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.ellipse(W / 2, H * 0.78, 128, 92, 0, Math.PI, Math.PI * 2); c.fill();
      c.fillStyle = "#14161c"; c.font = "900 44px Inter, Arial";
      const words = caption.split(" "); let line = "", yy = H * 0.9;
      for (const wd of words) { if (c.measureText(line + wd).width > W - 40) { c.fillText(line, W / 2, yy); yy += H * 0.07; line = ""; } line += wd + " "; }
      c.fillText(line, W / 2, yy);
    }} />
  </group>
);

/* =================== S1 0 – 3.81  hook: the airport =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.8, 13.6], look: [0, 4.0, -6], fov: 60 },
  { t: 3.81, pos: [0, 4.0, 11.8], look: [0, 4.0, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const bK = seg(t, 0.55, 1.05, Easing.out(Easing.back(1.7)));
  const passK = seg(t, 2.1, 2.9, Easing.out(Easing.cubic));
  const doorK = clamp(seg(t, 3.0, 3.6));
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#2c3646" b="#232c3a" unit={2} w={40} d={40} />
    <WallDoor z={-11} W={40} kind="plain" a="#3d4c66" b="#3d4c66" base="#141b2a" />
    {/* tall terminal windows */}
    {[-6.4, 0, 6.4].map((x, i) => <Glow key={i} p={[x, 7.6, -10.7]} r={2.6} color="#bcd7ff" />)}
    <Sign p={[0, 11.5, -10.6]} s={[9.8, 0.9]} text="ARRIVALS — NEW DELHI" bg="#0d1524" fg="#8ae8ff" size={58} frame="#38b6d9" />
    {/* three young travellers with suitcases, walking in */}
    <group position={[lerp(-7.6, -3.4, clamp(seg(t, 0.2, 3.2))), 0, -3.2]}>
      <Person p={[0, 0, 0]} h={3.9} look={young1} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.4 }} />
      <Suitcase p={[0.95, 0, 0.2]} color="#2e7d5b" />
    </group>
    <group position={[lerp(-8.8, -5.4, clamp(seg(t, 0.4, 3.4))), 0, -4.6]}>
      <Person p={[0, 0, 0]} h={3.8} look={young2} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.4 }} />
      <Suitcase p={[0.95, 0, 0.2]} color="#8c3a4a" />
    </group>
    <group position={[lerp(-6.2, -1.6, clamp(seg(t, 0.1, 3.0))), 0, -4.9]}>
      <Person p={[0, 0, 0]} h={4.0} look={young3} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.4 }} />
      <Suitcase p={[0.95, 0, 0.2]} color="#31517d" />
    </group>
    {/* the agent's desk at the door: passports pile up */}
    <Desk p={[4.3, 0, -4.6]} w={4.6} top="#4a3423" leg="#131a29" d={2.2} />
    <Person p={[4.3, 0, -6.1]} h={4.0} look={agentLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 2.0, 2.4), armR: [0.8, 0.6], lookX: -0.4 }} />
    <group position={[3.6, 1.32, -4.4]} scale={[passK, passK, 1]}>
      <Passport p={[0, 0, 0]} /><Passport p={[0.14, 0.17, 0.1]} color="#1f3a6e" rot={0.4} /><Passport p={[-0.1, 0.34, -0.05]} color="#274d27" rot={-0.3} />
    </group>
    {/* sliding door closes behind them on "door" */}
    <group position={[lerp(8.6, 5.9, Easing.inOut(Easing.cubic)(doorK)), 0, -7.6]}>
      <Box p={[0, 2.9, 0]} s={[3.4, 5.8, 0.3]} color="#48586c" line={2} />
      <Box p={[-0.9, 3.3, 0.2]} s={[1.1, 1.7, 0.1]} color="#8ae8ff" line={1} />
    </group>
    {bK > 0.02 ? <group position={[0, 9.2, -9.8]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.2} lines={[{ t: "THE JOB OFFER", s: 96, c: "#f5f7fa" }, { t: "WAS THE TRAP", s: 96, c: "#ff6a5e" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S2 3.81 – 9.54  the raid =================== */
const K2: Key[] = [
  { t: 3.81, pos: [0, 3.8, 13.8], look: [0, 4.4, -6], fov: 60 },
  { t: 9.54, pos: [0, 4.0, 11.6], look: [0, 4.4, -6], fov: 58 },
];
const S2 = ({ t, f }: Ctx) => {
  const moveK = clamp(seg(t, 5.0, 7.4));
  const bK = seg(t, 7.85, 8.4, Easing.out(Easing.back(1.7)));
  const blink = Math.floor(t * 2.4) % 2 === 0;
  const policeCar = (x: number, flip: boolean) => (
    <group key={x} position={[x, 0, -3.4]} rotation={[0, flip ? -0.16 : 0.16, 0]}>
      <Box p={[0, 0.75, 0]} s={[3.6, 1.1, 1.8]} color="#e8ecf2" line={2} />
      <Box p={[0, 1.5, 0]} s={[2.0, 0.7, 1.6]} color="#31517d" line={2} />
      <Box p={[-0.55, 1.95, 0]} s={[0.8, 0.22, 0.5]} color={blink ? "#e5233a" : "#39485c"} line={1} />
      <Box p={[0.55, 1.95, 0]} s={[0.8, 0.22, 0.5]} color={blink ? "#39485c" : "#3a7bd5"} line={1} />
      <Ball p={[-1.2, 0.35, 0.95]} r={0.35} color="#14161c" ink={0.02} />
      <Ball p={[1.2, 0.35, 0.95]} r={0.35} color="#14161c" ink={0.02} />
    </group>
  );
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#cfe0ff" />
    <Stars p={[0, 10, -16]} s={[36, 8]} t={t} top="#04060f" bottom="#0d1626" />
    <Floor kind="tile" a="#1f2632" b="#181e28" unit={2} w={40} d={40} />
    {/* the compound: a plain multi-storey block */}
    <group position={[0, 0, -11.5]}>
      <Box p={[0, 4.4, 0]} s={[13.5, 8.8, 0.6]} color="#2b3648" line={2} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = -5.4 + (i % 4) * 3.6, y = 2.2 + Math.floor(i / 4) * 2.6;
        return <Box key={i} p={[x, y, 0.36]} s={[1.7, 1.5, 0.08]} color={i % 3 === 0 ? "#ffd36a" : "#141c2a"} line={1} />;
      })}
      <Box p={[0, 0.9, 0.5]} s={[2.6, 1.8, 0.3]} color="#14161c" line={2} />
    </group>
    <Sign p={[0, 10.1, -10.9]} s={[10.2, 0.9]} text="SECTOR 136 — NOIDA" bg="#0d1524" fg="#dfe8ff" size={58} frame="#38b6d9" />
    {policeCar(-4.4, false)}
    {policeCar(4.6, true)}
    <SpotCone p={[-7.4, 9.6, -5]} h={9.6} r={3.2} color="#ffe9a8" o={0.12} />
    <StreetLamp p={[-7.4, 0, -5]} h={9.4} />
    {/* officers move in */}
    <group position={[lerp(-6.4, -1.8, Easing.inOut(Easing.cubic)(moveK)), 0, -6.4]}>
      <Person p={[0, 0, 0]} h={3.9} look={policeLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.8, armR: [0.8, 0.6], lookX: 0.5 }} />
    </group>
    <group position={[lerp(6.8, 2.0, Easing.inOut(Easing.cubic)(moveK)), 0, -6.8]}>
      <Person p={[0, 0, 0]} h={3.9} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.5 }} />
    </group>
    <group position={[lerp(-8.2, -3.6, Easing.inOut(Easing.cubic)(moveK)), 0, -8.2]}>
      <Person p={[0, 0, 0]} h={3.9} look={policeLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.5 }} />
    </group>
    {bK > 0.02 ? <group position={[0, 6.9, -9.6]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={8.8} lines={[{ t: "164 RESCUED", s: 110, c: "#2fd46a" }]} /></group> : null}
  </>);
};

/* =================== S3 9.54 – 15.23  the rescued =================== */
const K3: Key[] = [
  { t: 9.54, pos: [0, 3.8, 13.2], look: [0, 4.0, -6], fov: 60 },
  { t: 15.23, pos: [0, 4.0, 11.4], look: [0, 4.0, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const c1 = seg(t, 10.4, 10.9, Easing.out(Easing.back(1.7)));
  const c2 = seg(t, 11.85, 12.35, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 13.95, 14.45, Easing.out(Easing.back(1.7)));
  const chip = (k: number, x: number, flag: React.ReactNode, txt: string, col: string) => k > 0.02 ? (
    <group key={txt} position={[x, 8.6, -8.8]} scale={[k, k, 1]}>
      {flag}
      <Sign p={[0, -1.75, 0]} s={[4.4, 0.95]} text={txt} bg="#101828" fg={col} size={56} frame="#c9a227" />
    </group>
  ) : null;
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#33415e" b="#2a3650" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#46586e" b="#46586e" base="#1a2334" />
    <Sign p={[0, 11.5, -10.6]} s={[9.2, 0.9]} text="SAFE — AFTER THE RAID" bg="#0d2417" fg="#8affc1" size={56} frame="#2fd46a" />
    {/* rows of rescued young people, seated and resting */}
    {[-4.6, 0, 4.6].map((x, i) => (
      <group key={i} position={[x, 0, -4.4]}>
        <Desk p={[0, 0, 0]} w={3.6} top="#4a3423" leg="#131a29" d={1.8} />
        <Person p={[0, 0, 1.1]} h={3.4} look={[young1, young2, young3][i]} f={f} pose={{ mood: "worry", arms: "down", lookX: 0 }} />
      </group>
    ))}
    <Person p={[-6.3, 0, -2.6]} h={3.9} look={young3} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.3 }} />
    <Person p={[6.3, 0, -2.6]} h={3.9} look={young1} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.3 }} />
    {/* an officer hands a passport back */}
    <Person p={[1.9, 0, -2.4]} h={3.9} look={policeLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 12.6, 13.1), armR: [0.8, 0.6], lookX: -0.3 }} />
    <Passport p={[1.2, 2.2, -2.2]} color="#7a1f2b" rot={0.3} />
    {chip(c1, -3.4, <FlagID p={[0, 0, 0]} w={3.9} />, "92 INDONESIANS", "#ff9a8a")}
    {chip(c2, 3.4, <FlagMY p={[0, 0, 0]} w={3.9} />, "72 MALAYSIANS", "#8ae8ff")}
    {sK > 0.02 ? <group position={[0, 5.6, -9.4]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="MOST AGED 19–25" bg="#101828" fg="#ffd36a" size={60} frame="#c9a227" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S4 15.23 – 23.13  the lure =================== */
const K4: Key[] = [
  { t: 15.23, pos: [0, 3.8, 13.2], look: [0, 4.2, -6], fov: 60 },
  { t: 23.13, pos: [0, 4.0, 11.4], look: [0, 4.2, -6], fov: 58 },
];
const S4 = ({ t, f }: Ctx) => {
  const adK = seg(t, 15.6, 16.15, Easing.out(Easing.back(1.7)));
  const drawK = clamp(seg(t, 19.1, 19.9));
  const lockK = seg(t, 20.9, 21.4, Easing.out(Easing.back(2.0)));
  const bK = seg(t, 19.35, 19.85, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 21.5, 22.0, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#33302a" b="#2a2721" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#54492f" b="#54492f" base="#221b0d" door={{ x: 5.4, w: 3.0, h: 5.4 }} />
    {/* the glowing job ad */}
    {adK > 0.02 ? <group position={[-2.9, 7.9, -10.2]} scale={[adK, adK, 1]}>
      <Board p={[0, 0, 0]} w={8.4} bg="#14240f" frame="#2fd46a" lines={[{ t: "HIGH-PAY JOBS", s: 92, c: "#8affc1" }, { t: "WORK IN INDIA", s: 92, c: "#ffd36a" }]} />
    </group> : null}
    <Glow p={[-2.9, 7.9, -9.6]} r={2.2} color="#2fd46a" />
    {/* plane ticket card */}
    <group position={[3.9, 8.3, -9.8]} rotation={[0, -0.15, 0.08]}>
      <Box p={[0, 0, 0]} s={[3.4, 2.0, 0.16]} color="#f5f7fa" line={2} />
      <CanvasPlane p={[0, 0, 0.1]} s={[3.2, 1.8]} px={[440, 250]} draw={(c, W, H) => {
        c.fillStyle = "#f5f7fa"; c.fillRect(0, 0, W, H); c.textAlign = "center"; c.textBaseline = "middle";
        c.fillStyle = "#31517d"; c.font = "900 62px Inter, Arial"; c.fillText("✈ BOARDING PASS", W / 2, H * 0.3);
        c.fillStyle = "#14161c"; c.font = "900 54px Inter, Arial"; c.fillText("HOME → DELHI", W / 2, H * 0.68);
      }} />
    </group>
    {/* signing the contract */}
    <Desk p={[-2.6, 0, -4.8]} w={5.2} top="#4a3423" leg="#131a29" d={2.2} />
    <Person p={[-2.6, 0, -2.9]} h={3.9} look={young1} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 17.2, 17.7), armR: [0.8, 0.6], lookX: 0 }} />
    <Box p={[-2.6, 1.3, -4.6]} s={[1.5, 0.08, 1.1]} color="#f5f7fa" line={1} rot={[0, 0.25, 0]} />
    {/* the agent slides the passport into a drawer, and shuts it */}
    <group position={[3.6, 0, -5.2]}>
      <Box p={[0, 1.1, 0]} s={[2.6, 2.2, 1.8]} color="#39485c" line={2} />
      <group position={[0, 0, lerp(0.85, 0.1, Easing.inOut(Easing.cubic)(drawK))]}>
        <Box p={[0, 1.5, 0]} s={[2.2, 0.7, 1.5]} color="#2c3646" line={2} />
        <Passport p={[0, 1.95, 0]} color="#7a1f2b" />
      </group>
    </group>
    <Person p={[5.9, 0, -3.4]} h={4.0} look={agentLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    {/* padlock snaps onto the door */}
    {lockK > 0.02 ? <group position={[5.4, 3.1, -10.2]} scale={[lockK, lockK, 1]}>
      <Cyl p={[0, 0.55, 0]} rt={0.3} rb={0.3} h={0.18} color="#9aa2ae" line={1} rot={[Math.PI / 2, 0, 0]} />
      <Box p={[0, -0.25, 0]} s={[1.0, 1.1, 0.35]} color="#c9a227" line={2} />
    </group> : null}
    {bK > 0.02 ? <group position={[0, 10.9, -10.4]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={8.2} lines={[{ t: "PASSPORTS SEIZED", s: 84, c: "#ff6a5e" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 5.9, -9.6]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[9.6, 0.95]} text="MOVEMENTS RESTRICTED" bg="#160d0d" fg="#ff9a8a" size={58} frame="#e5233a" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S5 23.13 – 31.23  the scam floor =================== */
const K5: Key[] = [
  { t: 23.13, pos: [0, 3.8, 13.0], look: [0, 4.2, -6], fov: 60 },
  { t: 31.23, pos: [0, 4.0, 11.2], look: [0, 4.2, -6], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const bK = seg(t, 23.6, 24.15, Easing.out(Easing.back(1.7)));
  const flagK = seg(t, 26.35, 26.9, Easing.out(Easing.back(1.7)));
  const aK = seg(t, 28.95, 29.5, Easing.out(Easing.back(1.7)));
  const deskRow = (z: number, off: number) => (
    <group key={z} position={[0, 0, z]}>
      {[-4.4, 0, 4.4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Desk p={[0, 0, 0]} w={3.4} top="#2c3646" leg="#0d1119" d={1.7} />
          <Monitor p={[0, 1.32, -0.3]} screen={i % 2 ? "#27407c" : "#3d2c5e"} />
          <Person p={[0, 0, 1.05]} h={3.3} look={[young2, young3, young1][(i + off) % 3]} f={f} pose={{ mood: "worry", arms: "down", lookX: 0 }} />
          <Box p={[0.8, 1.32, 0.35]} s={[0.3, 0.55, 0.12]} color="#14161c" line={1} rot={[0, 0, 0.2]} />
        </group>
      ))}
    </group>
  );
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#dfe8ff" />
    <Floor kind="tile" a="#232a38" b="#1b212e" unit={2} w={40} d={40} />
    <WallDoor z={-11} W={40} kind="plain" a="#2e3a4f" b="#2e3a4f" base="#10151f" />
    {deskRow(-6.6, 0)}
    {deskRow(-3.4, 1)}
    {/* overseer at the back */}
    <Person p={[6.6, 0, -8.6]} h={4.1} look={agentLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.5 }} />
    {bK > 0.02 ? <group position={[0, 10.6, -10.3]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.4} lines={[{ t: "FAKE INVESTMENT SCAMS", s: 78, c: "#ff6a5e" }]} /></group> : null}
    {flagK > 0.02 ? <group position={[0, 7.3, -10.1]} scale={[flagK, flagK, 1]}>
      <FlagID p={[-2.6, 0, 0]} w={3.4} />
      <FlagMY p={[2.6, 0, 0]} w={3.4} />
      <Sign p={[0, -1.6, 0]} s={[8.8, 0.9]} text="VICTIMS BACK HOME" bg="#101828" fg="#ffd36a" size={58} frame="#c9a227" />
    </group> : null}
    {aK > 0.02 ? <group position={[0, 4.4, -9.8]} scale={[aK, aK, 1]}><Board p={[0, 0, 0]} w={9.0} bg="#2a0f14" frame="#e5233a" lines={[{ t: "THOSE WHO REFUSED", s: 66, c: "#f5f7fa" }, { t: "WERE ASSAULTED — POLICE SAY", s: 48, c: "#ff9a8a" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S6 31.23 – 37.25  seized I: phones + computers =================== */
const K6: Key[] = [
  { t: 31.23, pos: [0, 3.8, 12.8], look: [0, 4.2, -6], fov: 60 },
  { t: 37.25, pos: [0, 4.0, 11.2], look: [0, 4.2, -6], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const pK = seg(t, 33.3, 33.85, Easing.out(Easing.back(1.7)));
  const cK = seg(t, 35.55, 36.1, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K6} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#262e3d" b="#1e2531" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#303c52" b="#303c52" base="#121826" />
    <Sign p={[0, 11.4, -10.6]} s={[9.8, 0.9]} text="POLICE EVIDENCE ROOM" bg="#0d1524" fg="#dfe8ff" size={58} frame="#38b6d9" />
    {/* long evidence table */}
    <Box p={[0, 0.55, -5.6]} s={[13.5, 1.1, 3.0]} color="#39485c" line={2} />
    <PhonePile p={[-4.2, 1.1, -5.6]} n={16} />
    {/* desktop towers + monitors */}
    <group position={[3.4, 1.1, -5.6]}>
      {[0, 1.9, 3.8].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Box p={[0, 0.75, 0.3]} s={[0.8, 1.5, 1.1]} color="#1c2735" line={2} />
          <Monitor p={[0, 1.15, -0.55]} screen="#27407c" />
        </group>
      ))}
    </group>
    <Person p={[-6.6, 0, -3.2]} h={3.9} look={policeLook} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 32.8, 33.3), armR: [0.8, 0.6], lookX: 0.4 }} />
    <Person p={[7.0, 0, -3.2]} h={3.9} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.4 }} />
    {pK > 0.02 ? <group position={[-4.2, 8.9, -8.6]} scale={[pK, pK, 1]}><Board p={[0, 0, 0]} w={6.4} lines={[{ t: "355", s: 120, c: "#ffd36a" }, { t: "PHONES", s: 64, c: "#f5f7fa" }]} /></group> : null}
    {cK > 0.02 ? <group position={[4.3, 8.9, -8.6]} scale={[cK, cK, 1]}><Board p={[0, 0, 0]} w={6.4} lines={[{ t: "168", s: 120, c: "#ffd36a" }, { t: "COMPUTERS", s: 64, c: "#f5f7fa" }]} /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S7 37.25 – 42.37  seized II: laptops, SIMs, passports =================== */
const K7: Key[] = [
  { t: 37.25, pos: [0, 3.8, 12.8], look: [0, 4.2, -6], fov: 60 },
  { t: 42.37, pos: [0, 4.0, 11.2], look: [0, 4.2, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const lK = seg(t, 37.55, 38.05, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 38.85, 39.35, Easing.out(Easing.back(1.7)));
  const pK = seg(t, 40.35, 40.9, Easing.out(Easing.back(1.7)));
  const noteK = seg(t, 41.35, 41.85, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#2a3040" b="#212836" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#35425c" b="#35425c" base="#141a28" />
    <Sign p={[0, 11.4, -10.6]} s={[9.8, 0.9]} text="POLICE EVIDENCE ROOM" bg="#0d1524" fg="#dfe8ff" size={58} frame="#38b6d9" />
    <Box p={[0, 0.55, -5.6]} s={[13.5, 1.1, 3.0]} color="#39485c" line={2} />
    {/* laptops laid open in a row */}
    {[-5.6, -3.9, -2.2].map((x, i) => (
      <group key={i} position={[x, 1.1, -5.4]}>
        <Box p={[0, 0.06, 0]} s={[1.4, 0.12, 1.0]} color="#9aa2ae" line={1} />
        <Box p={[0, 0.55, -0.5]} s={[1.4, 1.0, 0.08]} color="#27407c" line={1} rot={[-0.35, 0, 0]} />
      </group>
    ))}
    {/* SIM cards fanned on a tray */}
    <group position={[0.6, 1.16, -5.2]}>
      <Box p={[0, 0, 0]} s={[2.4, 0.1, 1.6]} color="#14161c" line={1} />
      {[-0.7, 0, 0.7].map((x, i) => <Box key={i} p={[x, 0.12, 0]} s={[0.55, 0.06, 0.75]} color={i === 1 ? "#ffd36a" : "#f5f7fa"} line={1} rot={[0, (i - 1) * 0.35, 0]} />)}
    </group>
    {/* the passport mountain */}
    <group position={[4.6, 1.1, -5.6]}>
      <Passport p={[0, 0, 0]} /><Passport p={[0.75, 0, 0.2]} color="#1f3a6e" rot={0.5} /><Passport p={[-0.7, 0, 0.25]} color="#274d27" rot={-0.4} />
      <Passport p={[0.35, 0.17, -0.1]} color="#7a1f2b" rot={0.2} /><Passport p={[-0.3, 0.17, 0.1]} color="#1f3a6e" rot={-0.2} />
      <Passport p={[0.05, 0.34, 0.05]} color="#274d27" rot={0.35} />
    </group>
    <Person p={[-6.8, 0, -3.2]} h={3.9} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 39.8, 40.3), armR: [0.8, 0.6], lookX: 0.4 }} />
    {lK > 0.02 ? <group position={[-3.9, 8.9, -8.6]} scale={[lK, lK, 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "26", s: 110, c: "#ffd36a" }, { t: "LAPTOPS", s: 60, c: "#f5f7fa" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0.6, 8.9, -8.6]} scale={[sK, sK, 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "53", s: 110, c: "#ffd36a" }, { t: "SIM CARDS", s: 60, c: "#f5f7fa" }]} /></group> : null}
    {pK > 0.02 ? <group position={[4.9, 8.9, -8.6]} scale={[pK, pK, 1]}><Board p={[0, 0, 0]} w={5.6} lines={[{ t: "174", s: 110, c: "#ffd36a" }, { t: "PASSPORTS", s: 60, c: "#f5f7fa" }]} /></group> : null}
    {noteK > 0.02 ? <group position={[0, 5.9, -9.4]} scale={[noteK, noteK, 1]}><Sign p={[0, 0, 0]} s={[10.6, 0.95]} text="MORE PASSPORTS THAN PEOPLE" bg="#160d0d" fg="#ff9a8a" size={54} frame="#e5233a" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S8 42.37 – 47.82  the arrest =================== */
const K8: Key[] = [
  { t: 42.37, pos: [0, 3.8, 12.8], look: [0, 4.2, -6], fov: 60 },
  { t: 47.82, pos: [0, 4.0, 11.2], look: [0, 4.2, -6], fov: 58 },
];
const S8 = ({ t, f }: Ctx) => {
  const idK = seg(t, 44.25, 44.75, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 45.35, 45.9, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 46.45, 46.95, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#2c2438" b="#231c2e" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#3c3252" b="#3c3252" base="#171226" door={{ x: -4.6, w: 3.0, h: 5.4 }} />
    <Sign p={[0, 11.4, -10.6]} s={[9.6, 0.9]} text="DELHI POLICE — CRIME BRANCH" bg="#0d1524" fg="#dfe8ff" size={54} frame="#38b6d9" />
    {/* the suspect, flanked by two officers */}
    <Person p={[0, 0, -4.2]} h={3.9} look={suspectLook} f={f} pose={{ mood: "worry", arms: "down", lookX: 0 }} />
    <Person p={[-2.2, 0, -4.4]} h={3.9} look={policeLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.3 }} />
    <Person p={[2.2, 0, -4.4]} h={3.9} look={officer2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    {/* handcuffs glint between officer and suspect */}
    <group position={[1.15, 1.5, -3.9]}>
      <Cyl p={[0, 0, 0]} rt={0.22} rb={0.22} h={0.1} color="#c7ccd4" line={1} rot={[Math.PI / 2, 0, 0]} />
      <Cyl p={[0.42, 0, 0]} rt={0.22} rb={0.22} h={0.1} color="#c7ccd4" line={1} rot={[Math.PI / 2, 0, 0]} />
    </group>
    <Desk p={[-5.6, 0, -6.2]} w={4.2} top="#4a3423" leg="#131a29" d={2.0} />
    <Passport p={[-5.6, 1.32, -6.0]} color="#1f3a6e" rot={0.3} />
    {idK > 0.02 ? <group position={[0, 9.9, -9.8]} scale={[idK, idK, 1]}><Sign p={[0, 0, 0]} s={[10.4, 0.95]} text="A 25-YEAR-OLD MALAYSIAN MAN" bg="#101828" fg="#8ae8ff" size={54} frame="#38b6d9" /></group> : null}
    {bK > 0.02 ? <group position={[0, 7.6, -9.6]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={8.8} lines={[{ t: "1 SUSPECT ARRESTED", s: 80, c: "#ff6a5e" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 5.2, -9.2]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.6, 0.95]} text="ROLE UNDER INVESTIGATION" bg="#0d1524" fg="#ffd36a" size={54} frame="#c9a227" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S9 47.82 – 53.54  the hunt =================== */
const K9: Key[] = [
  { t: 47.82, pos: [0, 3.8, 12.8], look: [0, 4.4, -6], fov: 60 },
  { t: 53.54, pos: [0, 4.0, 11.2], look: [0, 4.4, -6], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => {
  const wK = seg(t, 48.15, 48.7, Easing.out(Easing.back(1.7)));
  const rK = seg(t, 49.9, 50.4, Easing.out(Easing.back(2.2)));
  const pinK = (at: number) => seg(t, at, at + 0.4, Easing.out(Easing.back(2.0)));
  const bK = seg(t, 51.0, 51.55, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 52.65, 53.15, Easing.out(Easing.back(1.7)));
  const pins: { at: number; x: number; y: number; label: string }[] = [
    { at: 48.6, x: 0.35, y: 1.35, label: "DELHI" },
    { at: 49.1, x: 1.45, y: 1.15, label: "UTTAR PRADESH" },
    { at: 49.6, x: -0.55, y: 1.7, label: "HARYANA" },
    { at: 50.1, x: -1.05, y: 2.35, label: "PUNJAB" },
    { at: 50.6, x: -1.75, y: 0.95, label: "RAJASTHAN" },
  ];
  return (<>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1c2735" b="#16202c" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#24344a" b="#24344a" base="#0d1522" />
    <group position={[0.4, 6.9, -10]}>
      <IndiaMap p={[0, 0, 0]} w={8.2} />
      {pins.map((pn) => { const k = pinK(pn.at); return k > 0.02 ? (
        <group key={pn.label} position={[pn.x, pn.y, 0.15]} scale={[k, k, 1]}><MapPin p={[0, 0, 0]} label={pn.label} /></group>
      ) : null; })}
    </group>
    {/* two wanted boards flank the map */}
    {wK > 0.02 ? <group position={[-5.1, 3.4, -7.6]} scale={[wK, wK, 1]}><WantedBoard p={[0, 0, 0]} w={2.9} caption="ALLEGED KEY MEMBER" /></group> : null}
    {wK > 0.02 ? <group position={[5.9, 3.4, -7.6]} scale={[wK, wK, 1]}><WantedBoard p={[0, 0, 0]} w={2.9} caption="ALLEGED KEY MEMBER" /></group> : null}
    {rK > 0.02 ? <group position={[0, 1.35, -5.6]} scale={[rK, rK, 1]}><Stamp p={[0, 0, 0]} w={6.2} text="ON THE RUN" /></group> : null}
    {bK > 0.02 ? <group position={[0, 11.2, -10.2]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={8.6} lines={[{ t: "10+ POLICE TEAMS", s: 84, c: "#8ae8ff" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 9.0, -9.8]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[8.8, 0.9]} text="ACROSS FIVE STATES" bg="#101828" fg="#ffd36a" size={58} frame="#c9a227" /></group> : null}
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

/* =================== S10 53.54 – 58.44  closer =================== */
const K10: Key[] = [
  { t: 53.54, pos: [0, 3.8, 12.6], look: [0, 4.2, -6], fov: 60 },
  { t: 58.44, pos: [0, 4.0, 10.9], look: [0, 4.2, -6], fov: 58 },
];
const S10 = ({ t, f }: Ctx) => {
  const bK = seg(t, 53.85, 54.4, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 55.55, 56.05, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K10} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#241d33" b="#1c1628" unit={2} w={38} d={38} />
    <WallDoor z={-11} W={38} kind="plain" a="#372c4e" b="#372c4e" base="#150f22" />
    <Desk p={[0, 0, -5.6]} w={6.4} top="#4a3423" leg="#131a29" d={2.4} />
    <Monitor p={[-1.9, 1.32, -5.9]} screen="#27407c" />
    <Person p={[0.6, 0, -3.3]} h={4.0} look={analyst} f={f} pose={{ mood: "deadpan", arms: "point", armK: seg(t, 56.4, 56.9), armR: [0.8, 0.6], lookX: 0 }} />
    {/* one passport, back in its owner's hands */}
    <Passport p={[2.2, 1.35, -5.2]} color="#7a1f2b" rot={-0.3} />
    <Shelf p={[-8.2, 0, -8.6]} /><Plant p={[7.9, 0, -6.6]} />
    {bK > 0.02 ? <group position={[0, 9.7, -9.8]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.4} lines={[{ t: "THE JOB OFFER", s: 84, c: "#f5f7fa" }, { t: "WAS THE TRAP", s: 84, c: "#ff6a5e" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 6.9, -9.2]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[9.8, 0.95]} text="THE HUNT IS FAR FROM OVER" bg="#101828" fg="#ff9a8a" size={54} frame="#e5233a" /></group> : null}
    <Sign p={[0, 11.7, -10.5]} s={[7.6, 0.85]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={62} frame="#7a4a8c" />
    <Dust t={t} area={[8, 4, 5]} />
  </>);
};

const CUTS = [0, 3.81, 9.54, 15.23, 23.13, 31.23, 37.25, 42.37, 47.82, 53.54, 58.44];
export const TdnV15: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#141b2a">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#04060f" trans="flash">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#1a2334" trans="zoom">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#221b0d">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#10151f" trans="whip">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#121826">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#141a28" trans="zoom">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#171226">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#0d1522" trans="flash">{(c) => <S9 {...c} />}</Scene>
      <Scene start={CUTS[9]} end={CUTS[10]} bg="#150f2a">{(c) => <S10 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 3.81 ? "rgba(255,190,90,.07)" : t < 9.54 ? "rgba(90,120,255,.10)" : t < 15.23 ? "rgba(120,255,170,.06)" : t < 23.13 ? "rgba(255,190,90,.08)" : t < 31.23 ? "rgba(120,150,255,.08)" : t < 42.37 ? "rgba(255,190,90,.07)" : t < 47.82 ? "rgba(170,140,255,.07)" : t < 53.54 ? "rgba(120,170,255,.08)" : "rgba(170,140,255,.07)"} />
      {/* S4 chip (15.5–18.3s): the allegation framing for the lure */}
      {t > 15.5 && t < 18.3 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            POLICE SAY: PROMISED WELL-PAID WORK
          </span>
        </div>
      ) : null}
      {/* S5 chip (24.9–27.9s): who the scams targeted */}
      {t > 24.9 && t < 27.9 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(16,18,24,.88)", color: "#8ae8ff", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            FORCED TO SCAM PEOPLE BACK HOME
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
