// TDN v16 — "Shot to a Stop" — US warplane disables a ship running the Iran blockade:
// On Thu 26 Nov 2026 a US military aircraft fired precision munitions into the stern of the
// Palau-flagged merchant ship M/V Pacific Archer in the Gulf of Oman after it left Bandar
// Abbas and, per CENTCOM, tried to run the US naval blockade despite repeated warnings.
// Propulsion disabled, civilian crew unharmed. At least the 15th vessel disabled since the
// blockade began in spring, the 6th since it resumed in July after a peace-talks pause.
// Iran (adviser Mohammad Mokhber, via state media): Hormuz will not reopen and the blockade
// will not be allowed to remain. Sources: Reuters; AP; CENTCOM via DVIDS — 27 Nov 2026.
// 9:16 720x1280 30fps, 1969 frames (65.55 s voiceover). Production only — parent handles release.
// CUTS = [0, 8.26, 16.26, 19.83, 30.72, 39.36, 48.68, 58.05, 65.55].
// S1 hook (shot to a stop) / S2 the ship leaves Bandar Abbas / S3 warnings ignored
// S4 the strike / S5 the count: 15th ship / S6 Task Force Iron Gate / S7 Tehran answers
// S8 closer: two fleets, one narrow sea
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Grade, Sign, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, Glow, Plant, Shelf, Monitor } from "../style/props";
import { Cam, Key, Stars, Building } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV15) ---------- */
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
/* open-sea floor: deep blue tile reads as stylised water */
const Sea: React.FC<{ a?: string; b?: string }> = ({ a = "#17608f", b = "#12537e" }) => (
  <Floor kind="tile" a={a} b={b} unit={3} w={90} d={70} />
);
/* big container ship, bow pointing +x, rides at y=0 waterline */
const CargoShip: React.FC<{ p: V3; s?: number; wake?: number; smoke?: number; t: number }> = ({ p, s = 1, wake = 1, smoke = 0, t }) => {
  const bob = Math.sin(t * 0.9 + p[0]) * 0.07;
  const boxCols = ["#c2452d", "#2e6da4", "#3f9142", "#c9a227", "#6a4a8c", "#31517d"];
  return (
    <group position={[p[0], p[1] + bob, p[2]]} scale={[s, s, s]}>
      {/* hull */}
      <Box p={[0, 0.85, 0]} s={[11.5, 1.7, 2.6]} color="#5e2129" line={2} />
      <Box p={[6.35, 0.95, 0]} s={[1.4, 1.5, 2.2]} color="#5e2129" line={2} rot={[0, 0, -0.18]} />
      <Box p={[0, 1.85, 0]} s={[11.9, 0.3, 2.8]} color="#23232e" line={2} />
      {/* container stacks */}
      {[-3.9, -2.2, -0.5, 1.2].map((x, i) => (
        <group key={i} position={[x, 2.0, 0]}>
          <Box p={[0, 0.55, 0]} s={[1.55, 1.1, 2.3]} color={boxCols[i % 6]} line={2} />
          <Box p={[0, 1.62, 0]} s={[1.55, 1.05, 2.3]} color={boxCols[(i + 2) % 6]} line={2} />
          {i % 2 === 0 ? <Box p={[0, 2.66, 0]} s={[1.55, 1.0, 2.3]} color={boxCols[(i + 4) % 6]} line={2} /> : null}
        </group>
      ))}
      {/* bridge tower near the stern */}
      <Box p={[-4.9, 2.9, 0]} s={[1.7, 2.1, 2.2]} color="#e8ecf2" line={2} />
      <Box p={[-4.9, 4.05, 0]} s={[1.9, 0.35, 2.4]} color="#31517d" line={2} />
      <Box p={[-4.9, 3.35, 1.12]} s={[1.5, 0.55, 0.06]} color="#8ae8ff" line={1} />
      <Cyl p={[-5.6, 4.6, 0]} rt={0.16} rb={0.16} h={1.1} color="#23232e" line={1} />
      {/* wake foam trailing the stern */}
      {wake > 0.02 ? <group position={[-6.1, 0.12, 0]}>
        <Box p={[-1.6 * wake, 0, 0]} s={[3.4 * wake, 0.1, 1.6]} color="#dff2ff" line={0} />
        <Box p={[-3.4 * wake, 0, 0.5]} s={[2.2 * wake, 0.08, 0.9]} color="#bfe2f7" line={0} />
        <Box p={[-3.2 * wake, 0, -0.6]} s={[2.0 * wake, 0.08, 0.8]} color="#bfe2f7" line={0} />
      </group> : null}
      {/* damage smoke at the stern */}
      {smoke > 0.02 ? <group position={[-5.6, 2.2, 0]}>
        {[0, 1, 2, 3].map((i) => {
          const ph = (t * 0.45 + i * 0.27) % 1;
          return <Ball key={i} p={[-ph * 1.6, ph * 3.4, (rnd(i * 7) - 0.5) * 0.7]} r={(0.5 + ph * 1.5) * smoke} color={i % 2 ? "#5a6068" : "#31363d"} ink={0} />;
        })}
        <Ball p={[0, 0.3, 0]} r={0.75 * smoke} color="#ff7a2e" ink={0} />
      </group> : null}
    </group>
  );
};
/* grey naval warship, bow +x */
const Warship: React.FC<{ p: V3; s?: number; t: number }> = ({ p, s = 1, t }) => {
  const bob = Math.sin(t * 0.8 + p[0] * 2) * 0.06;
  return (
    <group position={[p[0], p[1] + bob, p[2]]} scale={[s, s, s]}>
      <Box p={[0, 0.8, 0]} s={[10.5, 1.6, 2.2]} color="#5b6672" line={2} />
      <Box p={[5.8, 0.9, 0]} s={[1.3, 1.4, 1.8]} color="#5b6672" line={2} rot={[0, 0, -0.16]} />
      <Box p={[0, 1.75, 0]} s={[10.8, 0.3, 2.4]} color="#39424c" line={2} />
      <Box p={[-0.6, 2.9, 0]} s={[3.6, 2.0, 1.9]} color="#78828e" line={2} />
      <Box p={[-0.6, 4.05, 0]} s={[3.9, 0.32, 2.1]} color="#39424c" line={2} />
      {/* radar mast */}
      <Cyl p={[-1.4, 5.0, 0]} rt={0.09} rb={0.13} h={1.9} color="#39424c" line={1} />
      <Box p={[-1.4, 5.95, 0]} s={[1.7, 0.28, 0.5]} color="#9aa6b2" line={1} rot={[0, Math.sin(t * 1.4) * 0.5, 0]} />
      {/* forward gun turret */}
      <group position={[3.6, 1.9, 0]}>
        <Cyl p={[0, 0.3, 0]} rt={0.75} rb={0.9} h={0.6} color="#78828e" line={2} />
        <Box p={[0.95, 0.55, 0]} s={[1.9, 0.22, 0.22]} color="#39424c" line={1} rot={[0, 0, 0.1]} />
      </group>
      {/* wake */}
      <Box p={[-7.0, 0.12, 0]} s={[3.6, 0.1, 1.4]} color="#dff2ff" line={0} />
    </group>
  );
};
/* fighter jet, nose +x */
const Jet: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 0, 0]} rt={0.34} rb={0.42} h={3.6} color="#8a94a2" line={2} rot={[0, 0, Math.PI / 2]} />
    <Ball p={[1.95, 0.05, 0]} r={0.34} color="#5b6672" ink={0.02} />
    <Box p={[0.45, 0.28, 0]} s={[1.0, 0.3, 0.55]} color="#bfe2f7" line={1} />
    <Box p={[-0.2, -0.1, 0]} s={[1.7, 0.14, 3.3]} color="#78828e" line={2} rot={[0, 0, 0.05]} />
    <Box p={[-1.7, 0.35, 0]} s={[0.8, 0.9, 0.14]} color="#78828e" line={2} />
    <Box p={[-1.7, -0.05, 0]} s={[0.9, 0.14, 1.7]} color="#78828e" line={2} />
  </group>
);
/* Palau flag board: light blue field, golden disc */
const FlagPalau: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.62]} px={[512, 318]} frame="#f5f7fa" draw={(c, W, H) => {
    c.fillStyle = "#4aadd6"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#ffde00"; c.beginPath(); c.arc(W * 0.42, H / 2, H * 0.31, 0, Math.PI * 2); c.fill();
  }} />
);
/* radio warning rings: stroked circles on a transparent canvas (a flat cylinder reads as a disc) */
const RadioRings: React.FC<{ p: V3; t: number }> = ({ p, t }) => (
  <CanvasPlane p={p} s={[5.4, 5.4]} px={[512, 512]} draw={(c, W, H) => {
    c.clearRect(0, 0, W, H); c.strokeStyle = "#ffd36a"; c.lineWidth = 13;
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.55 + i / 3) % 1;
      c.globalAlpha = (1 - ph) * 0.9;
      c.beginPath(); c.arc(W / 2, H / 2, 30 + ph * (W / 2 - 44), 0, Math.PI * 2); c.stroke();
    }
    c.globalAlpha = 1;
  }} />
);
/* stylised strait map: Persian Gulf left, Gulf of Oman right, narrows in the middle */
const HormuzMap: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.78]} px={[1024, 800]} frame="#38b6d9" draw={(c, W, H) => {
    c.fillStyle = "#123c5e"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#8a6f3c"; c.strokeStyle = "#0b0d1a"; c.lineWidth = 9;
    /* Iran — northern shore */
    c.beginPath();
    c.moveTo(0, 0); c.lineTo(W, 0); c.lineTo(W, H * 0.3); c.lineTo(W * 0.68, H * 0.38);
    c.lineTo(W * 0.56, H * 0.47); c.lineTo(W * 0.47, H * 0.4); c.lineTo(W * 0.3, H * 0.34);
    c.lineTo(0, H * 0.42); c.closePath(); c.fill(); c.stroke();
    /* Arabia / Oman — southern shore */
    c.beginPath();
    c.moveTo(0, H); c.lineTo(W, H); c.lineTo(W, H * 0.72); c.lineTo(W * 0.72, H * 0.66);
    c.lineTo(W * 0.6, H * 0.56); c.lineTo(W * 0.55, H * 0.68); c.lineTo(W * 0.42, H * 0.74);
    c.lineTo(0, H * 0.6); c.closePath(); c.fill(); c.stroke();
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#f5f7fa"; c.font = "900 64px Inter, Arial";
    c.fillText("IRAN", W * 0.5, H * 0.16);
    c.fillText("OMAN", W * 0.5, H * 0.88);
    c.fillStyle = "#8ae8ff"; c.font = "900 34px Inter, Arial";
    c.fillText("PERSIAN GULF", W * 0.15, H * 0.64);
    c.fillText("GULF OF OMAN", W * 0.85, H * 0.38);
    c.fillStyle = "#ffd36a"; c.font = "900 42px Inter, Arial";
    c.fillText("STRAIT OF HORMUZ", W * 0.52, H * 0.52);
  }} />
);
/* simplified Iran land map for the Iron Gate scene */
const IranMap: React.FC<{ p: V3; w: number }> = ({ p, w }) => (
  <CanvasPlane p={p} s={[w, w * 0.86]} px={[1024, 880]} frame="#c9a227" draw={(c, W, H) => {
    c.fillStyle = "#0d2036"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#4a5d3a"; c.strokeStyle = "#0b0d1a"; c.lineWidth = 10;
    c.beginPath();
    c.moveTo(W * 0.18, H * 0.3); c.lineTo(W * 0.3, H * 0.12); c.lineTo(W * 0.52, H * 0.08);
    c.lineTo(W * 0.78, H * 0.14); c.lineTo(W * 0.88, H * 0.3); c.lineTo(W * 0.84, H * 0.52);
    c.lineTo(W * 0.9, H * 0.72); c.lineTo(W * 0.7, H * 0.86); c.lineTo(W * 0.44, H * 0.8);
    c.lineTo(W * 0.24, H * 0.88); c.lineTo(W * 0.14, H * 0.62); c.lineTo(W * 0.2, H * 0.44);
    c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#f5f7fa"; c.font = "900 72px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText("IRAN", W * 0.52, H * 0.46);
    c.fillStyle = "#8ae8ff"; c.font = "900 40px Inter, Arial";
    c.fillText("CASPIAN SEA", W * 0.52, H * 0.05 + 18);
    c.fillStyle = "#ffd36a";
    c.fillText("PERSIAN GULF", W * 0.3, H * 0.96);
  }} />
);

/* =================== S1 0 – 8.26  hook: shot to a stop =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.4, 17.6], look: [0, 3.4, -6], fov: 60 },
  { t: 8.26, pos: [0, 4.2, 15.4], look: [0, 3.4, -6], fov: 57 },
];
const S1 = ({ t, f }: Ctx) => {
  const shipX = lerp(-2.2, 0.8, clamp(seg(t, 0, 8.26)));
  const jetK = clamp(seg(t, 1.15, 2.6));
  const bK = seg(t, 2.95, 3.5, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 5.3, 5.85, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K1} impacts={[[2.55, 0.05]]} />
    <Lights warm="#ffd9a8" />
    <Sea />
    {/* dawn sky glow on the horizon */}
    <Glow p={[-9, 8.5, -22]} r={4.5} color="#ffb35e" />
    <Glow p={[10, 9.5, -24]} r={3.4} color="#ff9a5e" />
    <CargoShip p={[shipX, 0, -6]} s={0.95} t={t} />
    {/* the warplane streaks across on "shot" */}
    {jetK > 0 && jetK < 1 ? <Jet p={[lerp(-16, 17, Easing.in(Easing.cubic)(jetK)), 9.6, -13]} s={0.9} /> : null}
    {bK > 0.02 ? <group position={[0, 10.6, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.6} lines={[{ t: "SHOT TO A STOP", s: 100, c: "#ff6a5e" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 7.2, -10.6]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.4, 0.95]} text="RUNNING THE IRAN BLOCKADE" bg="#101828" fg="#ffd36a" size={118} frame="#c9a227" /></group> : null}
  </>);
};

/* =================== S2 8.26 – 16.26  the ship leaves Bandar Abbas =================== */
const K2: Key[] = [
  { t: 8.26, pos: [0, 4.4, 17.8], look: [0, 3.6, -6], fov: 60 },
  { t: 16.26, pos: [0, 4.2, 15.4], look: [0, 3.6, -6], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const shipX = lerp(-4.6, 2.8, clamp(seg(t, 8.26, 16.26)));
  const flagK = seg(t, 11.35, 11.9, Easing.out(Easing.back(1.7)));
  const bK = seg(t, 15.15, 15.7, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#ffe9c4" />
    <Sea />
    {/* the port of Bandar Abbas: skyline + container cranes behind */}
    <group position={[0, 0, -20]}>
      <Building p={[-11, 0, 0]} s={[4.4, 7.5, 3]} color="#4a5468" seed={3} />
      <Building p={[-6, 0, 0]} s={[3.6, 10, 3]} color="#39445a" seed={7} />
      <Building p={[7.5, 0, 0]} s={[4.8, 8.5, 3]} color="#424e63" seed={5} />
      <Building p={[12.5, 0, 0]} s={[3.4, 6, 3]} color="#4a5468" seed={9} />
      {/* gantry cranes */}
      {[-2.2, 3.4].map((x, i) => (
        <group key={i} position={[x, 0, 1]}>
          <Box p={[-1.5, 4.4, 0]} s={[0.35, 8.8, 0.35]} color="#c2452d" line={2} />
          <Box p={[1.5, 4.4, 0]} s={[0.35, 8.8, 0.35]} color="#c2452d" line={2} />
          <Box p={[0.4, 8.9, 0]} s={[5.6, 0.4, 0.4]} color="#c2452d" line={2} />
        </group>
      ))}
    </group>
    <Sign p={[0, 12.3, -17]} s={[10.6, 0.95]} text="BANDAR ABBAS — IRAN" bg="#0d1524" fg="#8ae8ff" size={120} frame="#38b6d9" />
    <CargoShip p={[shipX, 0, -6.5]} s={0.92} t={t} />
    {flagK > 0.02 ? <group position={[4.6, 8.9, -9.6]} scale={[flagK, flagK, 1]}>
      <FlagPalau p={[0, 0, 0]} w={3.6} />
      <Sign p={[0, -1.7, 0]} s={[4.6, 0.9]} text="FLAG OF PALAU" bg="#101828" fg="#f5f7fa" size={66} frame="#c9a227" />
    </group> : null}
    {bK > 0.02 ? <group position={[0, 10.9, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.2} lines={[{ t: "BOUND FOR SINGAPORE", s: 82, c: "#8affc1" }]} /></group> : null}
  </>);
};

/* =================== S3 16.26 – 19.83  warnings ignored =================== */
const K3: Key[] = [
  { t: 16.26, pos: [0, 4.2, 15.2], look: [0, 3.4, -6], fov: 60 },
  { t: 19.83, pos: [0, 4.0, 13.4], look: [0, 3.4, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const sK = seg(t, 17.45, 18.0, Easing.out(Easing.back(1.7)));
  const stK = seg(t, 18.55, 19.0, Easing.out(Easing.back(2.2)));
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#dfe8ff" />
    <Sea a="#17557e" b="#11456a" />
    {/* US warship on the left, cargo ship pressing on to the right */}
    <Warship p={[-4.4, 0, -7.5]} s={0.92} t={t} />
    <CargoShip p={[5.6, 0, -10.5]} s={0.82} t={t} />
    <RadioRings p={[-1.2, 6.4, -7.5]} t={t} />
    <Sign p={[-4.4, 11.6, -9.8]} s={[8.8, 0.9]} text="U.S. NAVY — STOP!" bg="#0d1524" fg="#dfe8ff" size={104} frame="#38b6d9" />
    {sK > 0.02 ? <group position={[2.8, 9.3, -10.2]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[9.8, 0.95]} text="REPEATED WARNINGS" bg="#101828" fg="#ffd36a" size={112} frame="#c9a227" /></group> : null}
    {stK > 0.02 ? <group position={[3.4, 5.9, -6.4]} scale={[stK, stK, 1]}><Stamp p={[0, 0, 0]} w={5.6} text="IGNORED" /></group> : null}
  </>);
};

/* =================== S4 19.83 – 30.72  the strike =================== */
const K4: Key[] = [
  { t: 19.83, pos: [0, 4.4, 17.8], look: [0, 3.6, -6], fov: 60 },
  { t: 30.72, pos: [0, 4.2, 15.2], look: [0, 3.4, -6], fov: 57 },
];
const S4 = ({ t, f }: Ctx) => {
  const jetK = clamp(seg(t, 20.1, 22.3));
  const misK = clamp(seg(t, 21.55, 23.75));
  const hit = t >= 23.75;
  const slowK = clamp(seg(t, 24.4, 28.2));
  const shipX = lerp(-0.5, 1.7, Easing.out(Easing.cubic)(slowK));
  const wake = 1 - slowK * 0.92;
  const smokeK = hit ? clamp(seg(t, 23.75, 24.6)) : 0;
  const bK = seg(t, 25.5, 26.05, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 29.15, 29.7, Easing.out(Easing.back(1.7)));
  /* missile arc: from the jet's last position down to the stern */
  const mx = lerp(4.2, -5.3, misK), my = lerp(9.8, 2.6, misK * misK) + Math.sin(misK * Math.PI) * 1.2;
  return (<>
    <Cam t={t} keys={K4} impacts={[[23.75, 0.14]]} />
    <Lights warm="#ffd9a8" />
    <Sea />
    <Glow p={[11, 9, -24]} r={3.6} color="#ff9a5e" />
    <CargoShip p={[shipX, 0, -6.5]} s={0.95} t={t} wake={wake} smoke={smokeK} />
    {jetK > 0 && jetK < 1 ? <Jet p={[lerp(-15, 15, Easing.in(Easing.cubic)(jetK)), 10.4, -14]} s={0.95} /> : null}
    {misK > 0 && misK < 1 ? <group position={[mx, my, -8]} rotation={[0, 0, -0.7]}>
      <Cyl p={[0, 0, 0]} rt={0.16} rb={0.2} h={1.7} color="#e8ecf2" line={1} rot={[0, 0, Math.PI / 2]} />
      <Ball p={[-1.05, 0, 0]} r={0.34} color="#ffb35e" ink={0} />
    </group> : null}
    {hit && t < 24.35 ? <Glow p={[-5.2, 2.9, -6.3]} r={lerp(1.2, 5.2, clamp(seg(t, 23.75, 24.35)))} color="#ffcf8a" /> : null}
    {bK > 0.02 ? <group position={[0, 10.8, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.8} lines={[{ t: "PROPULSION", s: 84, c: "#f5f7fa" }, { t: "KNOCKED OUT", s: 84, c: "#ff6a5e" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 7.4, -10.4]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.2, 0.95]} text="CIVILIAN CREW UNHARMED" bg="#0d2417" fg="#8affc1" size={108} frame="#2fd46a" /></group> : null}
  </>);
};

/* =================== S5 30.72 – 39.36  the count =================== */
const K5: Key[] = [
  { t: 30.72, pos: [0, 4.6, 16.5], look: [0, 3.2, -6], fov: 60 },
  { t: 39.36, pos: [0, 4.4, 14.6], look: [0, 3.2, -6], fov: 58 },
];
const S5 = ({ t, f }: Ctx) => {
  const bK = seg(t, 32.15, 32.7, Easing.out(Easing.back(1.7)));
  const b2K = seg(t, 35.65, 36.2, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 37.85, 38.4, Easing.out(Easing.back(1.7)));
  const miniShip = (i: number) => {
    const col = i % 5, row = Math.floor(i / 5);
    const x = -5.6 + col * 2.8, z = -5.2 - row * 3.4;
    const isLast = i === 14;
    const on = seg(t, 31.1 + i * 0.14, 31.5 + i * 0.14, Easing.out(Easing.back(1.7)));
    return on > 0.02 ? (
      <group key={i} position={[x, 0, z]} scale={[on * 0.3, on * 0.3, on * 0.3]}>
        <Box p={[0, 0.85, 0]} s={[9.5, 1.7, 2.4]} color={isLast ? "#8c2f39" : "#3d4756"} line={2} />
        <Box p={[-3.4, 2.6, 0]} s={[1.5, 1.9, 2.0]} color={isLast ? "#e8ecf2" : "#59636f"} line={2} />
        <Box p={[1.2, 2.2, 0]} s={[4.6, 1.0, 2.1]} color={isLast ? "#c2452d" : "#4a5462"} line={2} />
        {!isLast ? <group position={[0, 3.6, 0]}>
          <Box p={[0, 0, 0]} s={[2.6, 0.32, 0.32]} color="#e5233a" line={0} rot={[0, 0, 0.7]} />
          <Box p={[0, 0, 0]} s={[2.6, 0.32, 0.32]} color="#e5233a" line={0} rot={[0, 0, -0.7]} />
        </group> : null}
      </group>
    ) : null;
  };
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#dfe8ff" />
    <Sea a="#17557e" b="#11456a" />
    {Array.from({ length: 15 }, (_, i) => miniShip(i))}
    {bK > 0.02 ? <group position={[0, 12.1, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={9.6} lines={[{ t: "15TH SHIP DISABLED", s: 84, c: "#ffd36a" }]} /></group> : null}
    {b2K > 0.02 ? <group position={[0, 9.9, -11]} scale={[b2K, b2K, 1]}><Board p={[0, 0, 0]} w={8.2} bg="#14240f" frame="#2fd46a" lines={[{ t: "6TH SINCE JULY", s: 84, c: "#8affc1" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 7.6, -10.6]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[10.6, 0.9]} text="AFTER A PAUSE FOR PEACE TALKS" bg="#101828" fg="#8ae8ff" size={100} frame="#38b6d9" /></group> : null}
  </>);
};

/* =================== S6 39.36 – 48.68  Task Force Iron Gate =================== */
const K6: Key[] = [
  { t: 39.36, pos: [0, 4.2, 15.2], look: [0, 4.4, -6], fov: 60 },
  { t: 48.68, pos: [0, 4.0, 13.4], look: [0, 4.4, -6], fov: 58 },
];
const S6 = ({ t, f }: Ctx) => {
  const bK = seg(t, 41.55, 42.1, Easing.out(Easing.back(1.7)));
  const gateK = clamp(seg(t, 42.3, 43.1));
  const sK = seg(t, 46.35, 46.9, Easing.out(Easing.back(1.7)));
  const truck = (x: number, z: number, col: string) => (
    <group key={x} position={[x, 0, z]}>
      <Box p={[0, 1.0, 0]} s={[2.6, 1.6, 1.3]} color={col} line={2} />
      <Box p={[1.7, 0.75, 0]} s={[0.9, 1.1, 1.25]} color="#39424c" line={2} />
      <Ball p={[-0.8, 0.32, 0.68]} r={0.32} color="#14161c" ink={0.02} />
      <Ball p={[0.9, 0.32, 0.68]} r={0.32} color="#14161c" ink={0.02} />
    </group>
  );
  return (<>
    <Cam t={t} keys={K6} impacts={[[43.1, 0.1]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#4c4436" b="#403a2e" unit={2.4} w={60} d={50} />
    {/* the map backdrop */}
    <group position={[0, 8.3, -13]}>
      <IranMap p={[0, 0, 0]} w={14.5} />
    </group>
    {/* the iron gate slams shut across the border road */}
    <group position={[0, 0, -5.5]}>
      <Box p={[-3.4, 2.6, 0]} s={[0.55, 5.2, 0.55]} color="#2b2f36" line={2} />
      <Box p={[3.4, 2.6, 0]} s={[0.55, 5.2, 0.55]} color="#2b2f36" line={2} />
      <group position={[0, lerp(6.4, 2.45, Easing.in(Easing.cubic)(gateK)), 0]}>
        <Box p={[0, 0, 0]} s={[6.4, 4.6, 0.35]} color="#3a4048" line={2} />
        {[-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => <Box key={i} p={[x, 0, 0.22]} s={[0.35, 4.4, 0.1]} color="#59636f" line={1} />)}
        <Box p={[0, 0.4, 0.26]} s={[6.2, 0.7, 0.08]} color="#c9a227" line={1} />
      </group>
    </group>
    {/* trucks stopped at the gate */}
    {truck(-1.8, -2.2, "#c2452d")}
    {truck(1.9, -1.4, "#31517d")}
    {bK > 0.02 ? <group position={[0, 11.9, -11.5]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={10.2} lines={[{ t: "TASK FORCE IRON GATE", s: 76, c: "#ffd36a" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 9.6, -11]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.2, 0.9]} text="LAND BORDERS + THE CASPIAN SEA" bg="#101828" fg="#8ae8ff" size={100} frame="#38b6d9" /></group> : null}
  </>);
};

/* =================== S7 48.68 – 58.05  Tehran answers =================== */
const K7: Key[] = [
  { t: 48.68, pos: [0, 4.2, 15.2], look: [0, 4.4, -6], fov: 60 },
  { t: 58.05, pos: [0, 4.0, 13.2], look: [0, 4.4, -6], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const qK = seg(t, 52.75, 53.3, Easing.out(Easing.back(1.7)));
  const aK = seg(t, 51.2, 51.7, Easing.out(Easing.back(1.7)));
  const q2K = seg(t, 55.55, 56.1, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffd9a8" />
    <Floor kind="carpet" a="#1d2a3d" b="#17222f" unit={2} w={44} d={40} />
    {/* the strait map, huge behind */}
    <group position={[0, 7.6, -13.5]}>
      <HormuzMap p={[0, 0, 0]} w={15} />
    </group>
    {/* a boom barrier across the strait stays DOWN */}
    <group position={[0, 1.1, -6]}>
      <Box p={[-4.6, 1.5, 0]} s={[0.5, 3.0, 0.5]} color="#2b2f36" line={2} />
      <Box p={[4.6, 1.5, 0]} s={[0.5, 3.0, 0.5]} color="#2b2f36" line={2} />
      <Box p={[0, 2.9, 0]} s={[9.4, 0.5, 0.4]} color="#e5233a" line={2} />
      {[-3, -1, 1, 3].map((x, i) => <Box key={i} p={[x, 2.9, 0.02]} s={[0.9, 0.52, 0.42]} color="#f5f7fa" line={1} />)}
    </group>
    {/* a small ship waits, stopped, before the barrier */}
    <CargoShip p={[0.5, 0, -9.5]} s={0.55} t={t} wake={0.06} />
    {aK > 0.02 ? <group position={[0, 12.4, -12]} scale={[aK, aK, 1]}><Sign p={[0, 0, 0]} s={[11.6, 0.9]} text="ADVISER TO IRAN'S SUPREME LEADER" bg="#101828" fg="#ffd36a" size={96} frame="#c9a227" /></group> : null}
    {qK > 0.02 ? <group position={[0, 10.2, -11.5]} scale={[qK, qK, 1]}><Board p={[0, 0, 0]} w={11.2} bg="#2a0f14" frame="#e5233a" lines={[{ t: "“THE STRAIT WILL NOT", s: 66, c: "#f5f7fa" }, { t: "BE REOPENED”", s: 66, c: "#ff9a8a" }]} /></group> : null}
    {q2K > 0.02 ? <group position={[0, 5.6, -10.6]} scale={[q2K, q2K, 1]}><Board p={[0, 0, 0]} w={10.6} lines={[{ t: "THE BLOCKADE WILL", s: 62, c: "#f5f7fa" }, { t: "NOT REMAIN IN PLACE", s: 62, c: "#ff9a8a" }]} /></group> : null}
  </>);
};

/* =================== S8 58.05 – 65.55  closer: two fleets, one narrow sea =================== */
const K8: Key[] = [
  { t: 58.05, pos: [0, 4.4, 18.4], look: [0, 3.4, -6], fov: 60 },
  { t: 65.55, pos: [0, 4.2, 15.8], look: [0, 3.4, -6], fov: 57 },
];
const S8 = ({ t, f }: Ctx) => {
  const bK = seg(t, 60.15, 60.7, Easing.out(Easing.back(1.7)));
  const brandK = seg(t, 63.6, 64.15, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K8} />
    <Lights warm="#ffd9a8" />
    <Sea a="#14486e" b="#0e3a5c" />
    <Glow p={[0, 9.5, -26]} r={4.2} color="#ff9a5e" />
    {/* the standoff: US warship left, Iranian patrol boat right, a runner approaching */}
    <Warship p={[-4.7, 0, -8.5]} s={0.8} t={t} />
    <group position={[5.1, 0, -8.5]} scale={[-0.56, 0.56, 0.56]}>
      <Warship p={[0, 0, 0]} s={1} t={t} />
    </group>
    <CargoShip p={[lerp(-1.5, 0.4, clamp(seg(t, 58.05, 65.55))), 0, -14.5]} s={0.66} t={t} wake={0.5} />
    {bK > 0.02 ? <group position={[0, 11.3, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={10.4} lines={[{ t: "NEITHER SIDE", s: 80, c: "#f5f7fa" }, { t: "WILL BACK DOWN", s: 80, c: "#ff6a5e" }]} /></group> : null}
    {brandK > 0.02 ? <group position={[0, 8.2, -10.6]} scale={[brandK, brandK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={100} frame="#7a4a8c" /></group> : null}
  </>);
};

const CUTS = [0, 8.26, 16.26, 19.83, 30.72, 39.36, 48.68, 58.05, 65.55];
export const TdnV16: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0d2f47">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#10354f" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#0d2f47">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#0d2f47" trans="flash">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#0d2f47" trans="zoom">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#241d12">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#131c29" trans="whip">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#0a2740">{(c) => <S8 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 8.26 ? "rgba(255,170,80,.08)" : t < 16.26 ? "rgba(255,200,110,.06)" : t < 19.83 ? "rgba(110,160,255,.08)" : t < 30.72 ? "rgba(255,150,80,.09)" : t < 39.36 ? "rgba(110,160,255,.07)" : t < 48.68 ? "rgba(255,190,90,.07)" : t < 58.05 ? "rgba(255,140,90,.08)" : "rgba(255,150,80,.08)"} />
      {/* S3 chip (16.5–19.5s): attribution for the warnings claim */}
      {t > 16.5 && t < 19.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            U.S. CENTRAL COMMAND SAYS
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
