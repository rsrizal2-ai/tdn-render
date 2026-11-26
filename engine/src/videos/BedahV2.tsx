// Bedah Kasus — Manila fake-police-station case, LONG-FORM V2 (visual rebuild).
// Style: TDN toon engine (Remotion + Three.js), 1280x720 design @30fps, scale 1.5 -> 1920x1080.
// Grammar (user-picked references): ref 4 (Once Upon a Hack) — the MECHANISM is animated:
// packets/calls/data visibly travel through the system. Ref 5 (Under The Table) — CHARACTERS
// ACT OUT every step of the scheme in scenes. Serious documentary tone; no jokes.
// Narration: REUSED v1 mix (film/audio.wav, Helio, 532.576 s, -14.4 LUFS). Captions burned in,
// per-beat, from film/film-times.json (see ./bedahBeats). Victims are never identified — the
// victim character is a generic stand-in, suspects are generic figures.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Sign, Clock, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shelf, Plant, Lamp, Monitor, Chair, Rug, WindowCity } from "../style/props";
import { Cam, Building, Stars, Globe } from "../style/extra";
import { BEATS } from "./bedahBeats";

export const FPS = 30;
export const TOTAL_FRAMES = 15978; // ceil(532.576 * 30)
const WALK = 3.4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const fract = (x: number) => x - Math.floor(x);
const fmtInt = (n: number) => { const s = String(Math.max(0, Math.round(n))); return s.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
const fmtDec = (v: number, d = 1) => { const p = v.toFixed(d).split("."); return fmtInt(Number(p[0])) + (d ? "," + p[1] : ""); };
const useT = () => useCurrentFrame() / FPS;

/* ---------------- cast ---------------- */
const victimLook: Look = { skin: "#f0c8a0", body: "#6d4a7a", outfit: "hoodie", hair: "bob", hairColor: "#14100c", shoe: "#1b1b2a" };
const officerFakeLook: Look = { skin: "#e8b98d", body: "#2b4a77", outfit: "blazer", tie: "#12233d", shirt: "#dfe8f5", hair: "short", hairColor: "#0d0d14", badge: "#ffd36a", hat: "#1d3355", shoe: "#101018" };
const courierLook: Look = { skin: "#caa27e", body: "#c75b21", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#ffd36a", shoe: "#1b1b2a" };
const kbriLook: Look = { skin: "#8a5a34", body: "#33393f", outfit: "suit", tie: "#7a1f1f", shirt: "#eef1f5", hair: "short", hairColor: "#0d0d14", shoe: "#101018" };
const pnpLook: Look = { skin: "#e8b98d", body: "#1f3350", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#8ae8ff", hat: "#16283f", shoe: "#101018" };
const pnp2Look: Look = { skin: "#8a5a34", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#8ae8ff", hat: "#16283f", shoe: "#101018" };
const suspectLook: Look = { skin: "#d9b48f", body: "#3a3f4a", outfit: "hoodie", hair: "short", hairColor: "#0d0d14", shoe: "#101018" };
const suspect2Look: Look = { skin: "#a97a4e", body: "#4a3a3a", outfit: "hoodie", hair: "bob", hairColor: "#0d0d14", shoe: "#101018" };
const reporterLook: Look = { skin: "#f0c8a0", body: "#5a6e46", outfit: "shirt", hair: "short", hairColor: "#14100c", shoe: "#1b1b2a" };
const familyLook: Look = { skin: "#caa27e", body: "#7a5a2e", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", shoe: "#1b1b2a" };

/* ---------------- shared bits ---------------- */
const txt = (c: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "center", weight = 900) => {
  c.fillStyle = color; c.font = `${weight} ${size}px Inter, Arial`; c.textAlign = align; c.textBaseline = "middle"; c.fillText(s, x, y);
};
const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
};

/** Generic canvas board. draw runs every frame — pass time-varying values via closure. */
const Board: React.FC<{ p: V3; w: number; h: number; px?: [number, number]; draw: (c: CanvasRenderingContext2D, W: number, H: number) => void; frame?: string; rot?: V3; face?: boolean }> =
  ({ p, w, h, px = [1024, 512], draw, frame = "#39424e", rot, face }) => (
    <CanvasPlane p={p} s={[w, h]} px={px} frame={frame} rot={rot} face={face} draw={draw} />
  );

/** Indonesian flag on a pole, waving. */
const FlagID: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => {
  const t = useT();
  return (
    <group position={p} scale={[s, s, s]}>
      <Cyl p={[0, 0.18, 0]} rt={0.3} rb={0.38} h={0.36} color="#8a93a5" line={2} />
      <Cyl p={[0, 2.5, 0]} rt={0.045} rb={0.045} h={4.7} color="#c8cfdb" line={1} />
      <Ball p={[0, 4.92, 0]} r={0.09} color="#ffd36a" ink={0.03} />
      <group position={[0.06, 4.28, 0]} rotation={[0, Math.sin(t * 1.9) * 0.16, Math.sin(t * 2.6) * 0.03]}>
        <Box p={[0.62, 0.17, 0]} s={[1.24, 0.34, 0.04]} color="#d42b2b" line={2} />
        <Box p={[0.62, -0.17, 0]} s={[1.24, 0.34, 0.04]} color="#f2f2f2" line={2} />
      </group>
    </group>
  );
};

/** Stylised Garuda Pancasila emblem (geometric, gold on deep red disc). */
const Garuda: React.FC<{ p: V3; w?: number }> = ({ p, w = 1.9 }) => (
  <CanvasPlane p={p} s={[w, w]} px={[512, 512]} draw={(c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.fillStyle = "#5e1420"; c.beginPath(); c.arc(W / 2, H / 2, W * 0.48, 0, 7); c.fill();
    c.strokeStyle = "#ffd36a"; c.lineWidth = 10; c.stroke();
    c.fillStyle = "#f5b921"; c.strokeStyle = "#8a5a00"; c.lineWidth = 5;
    for (const s of [-1, 1]) { // wings: three layered feather arcs
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.ellipse(W / 2 + s * (70 + i * 42), H * 0.44 - i * 16, 92 - i * 14, 30 - i * 4, s * -0.5, 0, 7);
        c.fill(); c.stroke();
      }
      // tail feathers
      for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(W / 2 + s * 26 + i * 8, H * 0.78, 16, 52, s * 0.35, 0, 7); c.fill(); }
    }
    c.beginPath(); c.ellipse(W / 2, H * 0.52, 44, 74, 0, 0, 7); c.fill(); c.stroke(); // body
    c.beginPath(); c.arc(W / 2 + 16, H * 0.30, 27, 0, 7); c.fill(); c.stroke(); // head
    c.beginPath(); c.moveTo(W / 2 + 38, H * 0.30); c.lineTo(W / 2 + 62, H * 0.33); c.lineTo(W / 2 + 38, H * 0.36); c.closePath(); c.fill(); // beak
    // chest shield
    c.fillStyle = "#7a1f2b"; c.beginPath(); c.moveTo(W / 2 - 30, H * 0.44); c.lineTo(W / 2 + 30, H * 0.44); c.lineTo(W / 2 + 30, H * 0.58); c.quadraticCurveTo(W / 2 + 28, H * 0.70, W / 2, H * 0.76); c.quadraticCurveTo(W / 2 - 28, H * 0.70, W / 2 - 30, H * 0.58); c.closePath(); c.fill();
    c.strokeStyle = "#ffd36a"; c.lineWidth = 4; c.stroke();
    c.fillStyle = "#ffd36a"; c.fillRect(W / 2 - 3, H * 0.45, 6, H * 0.28); c.fillRect(W / 2 - 28, H * 0.55, 56, 5);
  }} />
);

/** Official portrait frame (silhouette — no real likeness). */
const Portrait: React.FC<{ p: V3; label: string; w?: number }> = ({ p, label, w = 1.5 }) => (
  <CanvasPlane p={p} s={[w, w * 1.26]} px={[400, 504]} frame="#c9a227" draw={(c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#31456e"); g.addColorStop(1, "#1a2745");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = "#0e1730"; c.fillRect(0, 0, W * 0.16, H); c.fillStyle = "#a12626"; c.fillRect(0, 0, W * 0.16, H * 0.5); // flag sliver
    c.fillStyle = "#e8c9a0"; c.beginPath(); c.arc(W * 0.56, H * 0.40, W * 0.17, 0, 7); c.fill();
    c.fillStyle = "#22304f"; c.beginPath(); c.ellipse(W * 0.56, H * 0.86, W * 0.30, H * 0.30, 0, 0, 7); c.fill();
    c.fillStyle = "#ffd36a"; c.fillRect(W * 0.52, H * 0.60, W * 0.08, H * 0.05);
    c.fillStyle = "#0b0d1a"; c.fillRect(0, H * 0.88, W, H * 0.12);
    txt(c, label, W / 2, H * 0.94, 30, "#f5f7fa");
  }} />
);

/** Police uniform on a display stand. */
const UniformStand: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 0.12, 0]} rt={0.42} rb={0.5} h={0.24} color="#39424e" line={2} />
    <Cyl p={[0, 1.3, 0]} rt={0.05} rb={0.05} h={2.4} color="#8a93a5" line={1} />
    <Box p={[0, 2.85, 0]} s={[1.1, 1.6, 0.52]} color="#2b4a77" line={3} />
    <Box p={[0, 3.62, 0]} s={[0.5, 0.16, 0.54]} color="#1d3355" line={2} />
    <Box p={[-0.5, 3.55, 0]} s={[0.24, 0.12, 0.56]} color="#ffd36a" line={2} />
    <Box p={[0.5, 3.55, 0]} s={[0.24, 0.12, 0.56]} color="#ffd36a" line={2} />
    {[3.3, 2.95, 2.6].map((y) => <Cyl key={y} p={[0, y, 0.28]} rt={0.045} h={0.05} color="#ffd36a" line={1} rot={[Math.PI / 2, 0, 0]} />)}
    <Box p={[-0.3, 3.15, 0.28]} s={[0.2, 0.14, 0.03]} color="#8ae8ff" line={1} />
    <Cyl p={[0, 3.95, 0]} rt={0.3} rb={0.32} h={0.16} color="#1d3355" line={2} />
    <Box p={[0, 3.9, 0.2]} s={[0.66, 0.05, 0.3]} color="#1d3355" line={2} />
  </group>
);

/** Forged official letter. stamp: 0..1 slam-in of the red PALSU stamp. */
const LetterDoc: React.FC<{ p: V3; rot?: V3; org: string; band: string; stamp?: number; w?: number }> = ({ p, rot = [0, 0, 0], org, band, stamp = 0, w = 3.1 }) => (
  <CanvasPlane p={p} s={[w, w * 1.29]} px={[620, 800]} rot={rot} draw={(c, W, H) => {
    c.fillStyle = "#f7f4ea"; c.fillRect(0, 0, W, H);
    c.fillStyle = band; c.fillRect(0, 0, W, 118);
    txt(c, org, W / 2, 48, 44, "#ffffff");
    txt(c, "REPUBLIK INDONESIA", W / 2, 92, 24, "#ffe9a8");
    c.fillStyle = "#c9a227"; c.fillRect(0, 118, W, 6);
    txt(c, "SURAT RESMI — RAHASIA", W / 2, 158, 26, "#5a6274", "center", 700);
    c.fillStyle = "#b9bec9";
    for (let i = 0; i < 9; i++) { const lw = W * (0.82 - (i % 3) * 0.13); c.fillRect(52, 210 + i * 52, lw, 17); }
    c.strokeStyle = "#31456e"; c.lineWidth = 4; c.beginPath(); c.moveTo(W * 0.58, H * 0.86);
    c.bezierCurveTo(W * 0.66, H * 0.80, W * 0.74, H * 0.92, W * 0.84, H * 0.85); c.stroke();
    if (stamp > 0) {
      c.save(); c.translate(W / 2, H * 0.52); c.rotate(-0.22); const sc = 1 + (1 - stamp) * 1.6; c.scale(sc, sc);
      c.globalAlpha = Math.min(1, stamp * 1.6); c.strokeStyle = "#d42b2b"; c.lineWidth = 13; c.strokeRect(-215, -72, 430, 144);
      txt(c, "PALSU", 0, 4, 104, "#d42b2b"); c.restore();
    }
  }} />
);

/** Pressure gauge; value 0..1, jitter adds needle tremble. */
const GaugeDial: React.FC<{ p: V3; value: number; w?: number; alert?: boolean }> = ({ p, value, w = 2.7, alert }) => {
  const t = useT();
  const v = clamp(value + (alert ? Math.sin(t * 31) * 0.012 : 0));
  return (
    <CanvasPlane p={p} s={[w, w]} px={[512, 512]} frame="#39424e" draw={(c, W, H) => {
      c.fillStyle = "#101828"; c.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.54, R = W * 0.36, a0 = Math.PI * 0.85, a1 = Math.PI * 2.15;
      for (let i = 0; i <= 20; i++) { const a = a0 + (a1 - a0) * i / 20, col = i < 11 ? "#2fd46a" : i < 16 ? "#ffd36a" : "#e5233a";
        c.strokeStyle = col; c.lineWidth = i % 5 === 0 ? 9 : 4; c.beginPath();
        c.moveTo(cx + Math.cos(a) * (R - 16), cy + Math.sin(a) * (R - 16)); c.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); c.stroke(); }
      if (alert) { c.fillStyle = `rgba(229,35,58,${0.10 + 0.07 * Math.sin(t * 6)})`; c.fillRect(0, 0, W, H); }
      const a = a0 + (a1 - a0) * v;
      c.strokeStyle = "#f5f7fa"; c.lineWidth = 11; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82); c.stroke();
      c.fillStyle = "#ffd36a"; c.beginPath(); c.arc(cx, cy, 17, 0, 7); c.fill();
      txt(c, "TEKANAN", cx, H * 0.80, 40, "#f5f7fa");
      txt(c, `${Math.round(v * 100)}%`, cx, H * 0.90, 34, v > 0.75 ? "#ff5040" : "#8ae8ff");
    }} />
  );
};

/** Money packet that travels a polyline path (ref-4 mechanism grammar). */
const pathPos = (pts: V3[], d: number): V3 => {
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) { const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], dz = pts[i][2] - pts[i - 1][2]; cum.push(cum[i - 1] + Math.hypot(dx, dy, dz)); }
  const L = cum[cum.length - 1]; let dd = ((d % L) + L) % L;
  let i = 1; while (i < cum.length - 1 && cum[i] < dd) i++;
  const k = (dd - cum[i - 1]) / Math.max(0.0001, cum[i] - cum[i - 1]);
  return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k), lerp(pts[i - 1][2], pts[i][2], k)];
};
const Packet: React.FC<{ p: V3; s?: number; color?: string; label?: string }> = ({ p, s = 1, color = "#2f9e5f", label = "Rp" }) => (
  <group position={p} scale={[s, s, s]}>
    <Box p={[0, 0, 0]} s={[0.66, 0.42, 0.16]} color={color} line={3} />
    <CanvasPlane p={[0, 0, 0.09]} s={[0.52, 0.3]} px={[128, 76]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); txt(c, label, W / 2, H / 2 + 2, 42, "#eafff0"); }} />
  </group>
);
const PathPackets: React.FC<{ pts: V3[]; t: number; n?: number; speed?: number; size?: number; color?: string; label?: string; phase?: number }> =
  ({ pts, t, n = 5, speed = 2.4, size = 1, color, label, phase = 0 }) => {
    const cum: number[] = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
    const L = cum[cum.length - 1];
    return (<>{Array.from({ length: n }, (_, i) => {
      const d = phase + t * speed + (L / n) * i;
      const p = pathPos(pts, d); p[1] += Math.sin(t * 3.1 + i * 1.7) * 0.05;
      return <Packet key={i} p={p} s={size} color={color} label={label} />;
    })}</>);
  };

/** Phone with a fully drawn, animated screen. screen gets (ctx, W, H, t). */
const PhoneProp: React.FC<{ p: V3; rot?: V3; w?: number; screen: (c: CanvasRenderingContext2D, W: number, H: number, t: number) => void }> = ({ p, rot = [0, 0, 0], w = 0.68, screen }) => {
  const t = useT();
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0, -0.045]} s={[w, w * 1.94, 0.09]} color="#14161f" line={3} />
      <CanvasPlane p={[0, 0, 0.012]} s={[w * 0.9, w * 1.8]} px={[300, 600]} draw={(c, W, H) => screen(c, W, H, t)} />
    </group>
  );
};

/** Small floating label chip that pops in at t0. */
const Chip: React.FC<{ p: V3; text: string; t0: number; bg?: string; fg?: string; w?: number; rot?: V3 }> = ({ p, text, t0, bg = "#ffd36a", fg = "#14100c", w = 2.6, rot }) => {
  const t = useT(); const k = seg(t, t0, t0 + 0.35, Easing.out(Easing.back(2.2)));
  if (k <= 0) return null;
  return (
    <group position={p} rotation={rot} scale={[k, k, k]}>
      <CanvasPlane p={[0, 0, 0]} s={[w, w * 0.30]} px={[640, 192]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = bg; rr(c, 6, 6, W - 12, H - 12, 34); c.fill();
        const fs = Math.min(62, (W - 40) / Math.max(1, text.length * 0.66));
        txt(c, text, W / 2, H / 2 + 2, fs, fg);
      }} />
    </group>
  );
};

/** Big stat/plate board whose content switches by time windows. */
const Stage: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <AbsoluteFill style={{ background: bg }}>
    <ThreeCanvas width={1280} height={720} camera={{ fov: 58, position: [0, 2.3, 11], near: 0.1, far: 240 }} gl={{ antialias: true }}>
      <color attach="background" args={[bg]} />{children}
    </ThreeCanvas>
  </AbsoluteFill>
);
const DimLights: React.FC<{ a?: number; d?: number }> = ({ a = 0.75, d = 0.85 }) => (
  <><ambientLight intensity={a} /><directionalLight position={[4, 8, 5]} intensity={d} color="#cdd8ff" /><directionalLight position={[-5, 3, 2]} intensity={0.3} color="#5a76b8" /></>
);

/* ================= SCENE H0 — HOOK (0–31.8) =================
   A phone lights up in a dark room. Inside its screen: the fake officer in his set.
   The set is drawn on the phone's canvas; gold rings highlight flag / portraits / Garuda
   exactly as the narration names them. Money packets fly out of the phone (ref 4),
   then the "office" is exposed as a rented room. */
const hookScreen = (c: CanvasRenderingContext2D, W: number, H: number, t: number) => {
  c.fillStyle = "#05070d"; c.fillRect(0, 0, W, H);
  if (t < 0.4) { txt(c, "23:47", W / 2, H * 0.4, 54, "#3d4a63"); return; }
  if (t < 2.35) { // incoming video call
    const pu = 0.6 + 0.4 * Math.sin(t * 9);
    c.strokeStyle = `rgba(47,212,106,${0.35 * pu})`; c.lineWidth = 5;
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(W / 2, H * 0.34, 44 + i * 30 + Math.sin(t * 9) * 5, 0, 7); c.stroke(); }
    c.fillStyle = "#2fd46a"; c.beginPath(); c.arc(W / 2, H * 0.34, 40, 0, 7); c.fill();
    txt(c, "▶", W / 2, H * 0.345, 44, "#06280f");
    txt(c, "PANGGILAN VIDEO", W / 2, H * 0.52, 30, "#f5f7fa");
    txt(c, "Nomor tak dikenal", W / 2, H * 0.575, 24, "#8a93a5", "center", 700);
    c.fillStyle = "#2fd46a"; rr(c, W * 0.14, H * 0.78, W * 0.3, 64, 32); c.fill();
    c.fillStyle = "#e5233a"; rr(c, W * 0.56, H * 0.78, W * 0.3, 64, 32); c.fill();
    txt(c, "ANGKAT", W * 0.29, H * 0.78 + 33, 24, "#06280f"); txt(c, "TOLAK", W * 0.71, H * 0.78 + 33, 24, "#fff");
    return;
  }
  // live call: the set, drawn in 2D — wall, flag, garuda, portraits, officer bust
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2c3d5f"); g.addColorStop(1, "#1a2745");
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.fillStyle = "#d42b2b"; c.fillRect(14, 26, 34, 44); c.fillStyle = "#f2f2f2"; c.fillRect(14, 70, 34, 44); // flag
  c.fillStyle = "#8a93a5"; c.fillRect(28, 20, 4, 120);
  c.fillStyle = "#5e1420"; c.beginPath(); c.arc(W / 2, 62, 30, 0, 7); c.fill(); // garuda disc
  c.strokeStyle = "#ffd36a"; c.lineWidth = 3; c.stroke();
  c.fillStyle = "#f5b921"; c.beginPath(); c.ellipse(W / 2, 62, 15, 10, 0, 0, 7); c.fill();
  for (const fx of [W - 96, W - 52]) { c.fillStyle = "#c9a227"; c.fillRect(fx - 3, 22, 40, 52); c.fillStyle = "#31456e"; c.fillRect(fx, 25, 34, 46); c.fillStyle = "#e8c9a0"; c.beginPath(); c.arc(fx + 17, 42, 8, 0, 7); c.fill(); } // portraits
  const bob = Math.sin(t * 1.7) * 3;
  c.fillStyle = "#e8b98d"; c.beginPath(); c.arc(W / 2, 218 + bob, 52, 0, 7); c.fill(); // head
  c.fillStyle = "#1d3355"; c.fillRect(W / 2 - 54, 188 + bob, 108, 20); c.fillRect(W / 2 - 30, 172 + bob, 60, 20); // cap
  c.fillStyle = "#2b4a77"; c.beginPath(); c.ellipse(W / 2, 420, 108, 130, 0, 0, 7); c.fill(); // torso
  c.fillStyle = "#ffd36a"; c.fillRect(W / 2 - 8, 300 + bob, 16, 60); // tie placket / badge col
  c.beginPath(); c.arc(W / 2 - 34, 330 + bob, 7, 0, 7); c.fill();
  if (t > 15.4 && t < 20.9) { const m = Math.abs(Math.sin(t * 7)) * 5; c.strokeStyle = "#7a3b2e"; c.lineWidth = 4; c.beginPath(); c.ellipse(W / 2, 252 + bob, 12, 3 + m, 0, 0, 7); c.stroke(); } // mouth moves
  const ring = (x: number, y: number, w: number, h: number, a: number, b: number) => {
    if (t < a || t > b) return; const p = 0.7 + 0.3 * Math.sin(t * 8);
    c.strokeStyle = `rgba(255,211,106,${p})`; c.lineWidth = 6; rr(c, x, y, w, h, 10); c.stroke();
  };
  ring(6, 14, 52, 110, 8.02, 10.73); ring(W - 108, 14, 96, 68, 10.95, 12.44); ring(W / 2 - 40, 24, 80, 78, 12.66, 13.81);
  txt(c, `00:${String(Math.floor(Math.max(0, t - 2.35))).padStart(2, "0")}`, W - 40, 24, 22, "#ff5040", "right", 700);
  if (t >= 21.05 && t < 25.9) { // balance drains on screen
    const k = seg(t, 21.3, 25.2);
    c.fillStyle = "rgba(5,8,16,0.82)"; c.fillRect(0, H * 0.60, W, H * 0.24);
    txt(c, "TABUNGAN ANDA", W / 2, H * 0.645, 22, "#8a93a5", "center", 700);
    c.fillStyle = "#2b3350"; rr(c, W * 0.12, H * 0.685, W * 0.76, 26, 13); c.fill();
    c.fillStyle = "#e5233a"; if (k > 0) { rr(c, W * 0.12, H * 0.685, W * 0.76 * (1 - k), 26, 13); c.fill(); }
    txt(c, "→ REKENING ORANG ASING", W / 2, H * 0.79, 23, "#ffd36a");
  }
  if (t >= 26.07) { const k = seg(t, 26.07, 27.2); c.fillStyle = `rgba(120,128,145,${k * 0.55})`; c.fillRect(0, 0, W, H); }
  if (t >= 28.28) { c.fillStyle = "rgba(5,8,16,0.78)"; c.fillRect(0, H * 0.36, W, H * 0.30);
    txt(c, "BUKAN KANTOR POLISI", W / 2, H * 0.455, 27, "#ff5040");
    txt(c, "RUANGAN SEWAAN — MANILA", W / 2, H * 0.545, 24, "#f5f7fa"); }
};
const SceneHook: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const mood = t < 15 ? "deadpan" : t < 21 ? "worry" : "shock";
  return (
    <Stage bg="#0d1020">
      <Cam t={t} keys={[
        { t: 0, pos: [0, 2.5, 12.2], look: [-1.2, 1.6, -1], fov: 58 },
        { t: 4, pos: [-0.7, 1.95, 7.4], look: [-1.6, 1.55, -0.6], fov: 54 },
        { t: 12, pos: [-1.15, 1.75, 4.9], look: [-1.6, 1.6, -0.55], fov: 50 },
        { t: 21, pos: [-1.3, 1.65, 4.2], look: [-1.6, 1.6, -0.55], fov: 48 },
        { t: 26, pos: [-0.4, 2.1, 8.6], look: [-1.4, 1.5, -0.8], fov: 54 },
        { t: 31.8, pos: [0.4, 2.5, 12], look: [-0.8, 1.6, -1], fov: 58 },
      ]} />
      <DimLights a={0.55} d={0.5} />
      <Floor kind="carpet" a="#232038" b="#1b1830" w={34} d={26} unit={2.4} />
      <WallDoor z={-7} W={34} kind="plain" a="#2a3049" b="#232842" base="#141830" />
      <WindowCity p={[6.4, 3.4, -6.9]} s={[3.4, 3.6]} dusk />
      <Lamp p={[5.2, 0, -3.4]} h={2.8} color="#5a6f9e" />
      <Desk p={[-1.6, 0, -1.1]} w={3.6} top="#3a4160" leg="#232842" />
      <Chair p={[-1.6, 0, -2.3]} rotY={0.2} color="#2b3350" />
      <Person p={[-1.6, 0, -2.05]} h={3.7} look={victimLook} f={f}
        pose={{ mood: t < 26 ? mood : "worry", arms: t > 2.4 ? "hold" : "down", armR: [0.35, 0.42], armL: [-0.35, 0.42], nerv: t > 17 ? 0.62 : 0, sweat: t > 21 ? 0.7 : 0, lookX: 0.1 }} />
      {t < 2.35 && t > 0.35 ? <Glow p={[-1.6, 1.75, -0.35]} r={0.9 + Math.sin(t * 9) * 0.15} color="#2fd46a" o={0.5} /> : null}
      <PhoneProp p={[-1.6, 1.68, -0.55]} w={0.72} screen={hookScreen} />
      {t >= 21.05 && t < 26.2 ? [0, 1, 2].map((i) => {
        const lt = (t - 21.1 - i * 1.15) / 1.7; if (lt < 0 || lt > 1) return null;
        const x = lerp(-1.3, 7.5, Easing.in(Easing.quad)(lt)), y = 1.8 + Math.sin(lt * Math.PI) * 1.5 - lt * 0.4;
        return <Packet key={i} p={[x, y, 0.6]} s={1.15} />;
      }) : null}
      <Plant p={[-6.8, 0, -3.8]} pot="#2b3350" />
    </Stage>
  );
};

/* ================= SCENE H1 — REVEAL (31.8–91.9) =================
   KE Towers at night; stat boards count up beside it; 141 figures fill a grid;
   pins multiply across a map; the four stages light up. */
const revealBoard = (t: number) => (c: CanvasRenderingContext2D, W: number, H: number) => {
  c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
  c.strokeStyle = "rgba(140,170,220,.14)"; c.lineWidth = 2;
  for (let gx = 60; gx < W; gx += 76) { c.beginPath(); c.moveTo(gx, 20); c.lineTo(gx, H - 20); c.stroke(); }
  if (t < 45.4) {
    txt(c, "TOTAL KERUGIAN", W / 2, H * 0.24, 44, "#8ae8ff", "center", 700);
    const v = 46.7 * seg(t, 34.6, 40.6);
    txt(c, `Rp ${fmtDec(v)} MILIAR`, W / 2, H * 0.52, 96, "#ffd36a");
    txt(c, "dari 87 korban di Indonesia", W / 2, H * 0.76, 38, "#f5f7fa", "center", 700);
  } else if (t < 51.3) {
    txt(c, "MEREKA MEMBANGUN PANGGUNG", W / 2, H * 0.16, 42, "#f5f7fa");
    c.strokeStyle = "#ffd36a"; c.lineWidth = 6; c.strokeRect(W * 0.30, H * 0.30, W * 0.40, H * 0.52);
    c.fillStyle = "#d42b2b"; c.fillRect(W * 0.34, H * 0.36, 26, 34); c.fillStyle = "#f2f2f2"; c.fillRect(W * 0.34, H * 0.36 + 34, 26, 34);
    c.fillStyle = "#2b4a77"; c.fillRect(W * 0.52, H * 0.52, W * 0.13, H * 0.16);
    c.fillStyle = "#e8b98d"; c.beginPath(); c.arc(W * 0.585, H * 0.47, 17, 0, 7); c.fill();
    txt(c, "1 RUANGAN = 1 KANTOR POLISI PALSU", W / 2, H * 0.92, 36, "#ffd36a");
  } else if (t < 59.6) {
    const n = Math.floor(141 * seg(t, 52.0, 58.6));
    txt(c, `${fmtInt(n)} WNI`, W / 2, H * 0.13, 52, "#ffd36a");
    for (let i = 0; i < 141; i++) { if (i >= n) break;
      const gx = W * 0.08 + (i % 21) * (W * 0.845 / 20), gy = H * 0.30 + Math.floor(i / 21) * 52;
      c.fillStyle = i % 9 === 0 ? "#ff5040" : "#8ae8ff"; c.beginPath(); c.arc(gx, gy, 9, 0, 7); c.fill(); c.fillRect(gx - 8, gy + 11, 16, 20); }
    txt(c, "diduga menjalankan penipuan terstruktur", W / 2, H * 0.93, 34, "#f5f7fa", "center", 700);
  } else if (t < 67.4) {
    txt(c, "24 NOVEMBER 2026", W / 2, H * 0.20, 44, "#8ae8ff", "center", 700);
    txt(c, "139", W / 2, H * 0.50, 130, "#ffd36a");
    txt(c, "tersangka dipulangkan ke Indonesia", W / 2, H * 0.76, 40, "#f5f7fa", "center", 700);
    const px = W * 0.5 + Math.sin(t * 1.3) * W * 0.30;
    c.fillStyle = "#f5f7fa"; c.beginPath(); c.ellipse(px, H * 0.335, 30, 9, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(px + 22, H * 0.335); c.lineTo(px + 44, H * 0.30); c.lineTo(px + 40, H * 0.335); c.closePath(); c.fill();
  } else if (t < 70.6) {
    txt(c, "2 ORANG", W / 2, H * 0.38, 92, "#ffd36a");
    txt(c, "masih diproses di Filipina", W / 2, H * 0.62, 42, "#f5f7fa", "center", 700);
  } else if (t < 83.3) {
    txt(c, "BUKAN KEJADIAN TUNGGAL", W / 2, H * 0.11, 40, "#f5f7fa");
    const n = Math.floor(26 * seg(t, 73.5, 82));
    for (let i = 0; i < n; i++) { const px = W * (0.10 + rnd(i * 3 + 1) * 0.8), py = H * (0.24 + rnd(i * 3 + 2) * 0.44);
      c.fillStyle = "#ff5040"; c.beginPath(); c.arc(px, py, 8, 0, 7); c.fill();
      c.strokeStyle = "rgba(255,80,64,.5)"; c.lineWidth = 3; c.beginPath(); c.arc(px, py, 8 + 5 * (0.5 + 0.5 * Math.sin(t * 3 + i)), 0, 7); c.stroke(); }
    const v = 15000 * seg(t, 74, 82);
    txt(c, `± ${fmtInt(v)} WNI`, W / 2, H * 0.80, 62, "#ffd36a");
    txt(c, "terseret penipuan daring di luar negeri — Jan–Nov 2026 (Kemenlu)", W / 2, H * 0.915, 30, "#8a93a5", "center", 700);
  } else {
    txt(c, "BAGAIMANA PANGGUNG SEKECIL ITU", W / 2, H * 0.24, 46, "#f5f7fa");
    txt(c, "MENGURAS REKENING SEBESAR ITU?", W / 2, H * 0.38, 46, "#f5f7fa");
    for (let i = 0; i < 4; i++) { const on = t > 86.6 + i * 0.9, x = W * (0.14 + i * 0.19);
      c.fillStyle = on ? "#ffd36a" : "#2b3350"; rr(c, x, H * 0.58, W * 0.155, 74, 14); c.fill();
      txt(c, `TAHAP ${i + 1}`, x + W * 0.0775, H * 0.58 + 38, 32, on ? "#14100c" : "#5a6274"); }
    if (t > 89.9) txt(c, "KITA BEDAH, TAHAP DEMI TAHAP", W / 2, H * 0.86, 40, "#8ae8ff");
  }
};
const SceneReveal: React.FC<{ t: number; f: number }> = ({ t }) => {
  const litWin = 0.75 + 0.25 * Math.sin(t * 2.2);
  return (
    <Stage bg="#0a0e1e">
      <Cam t={t} keys={[
        { t: 31.8, pos: [0, 3.2, 14.5], look: [-1, 3.2, -5], fov: 58 },
        { t: 50, pos: [4.6, 2.7, 11], look: [0.6, 2.8, -4], fov: 55 },
        { t: 70, pos: [2.2, 2.4, 9.6], look: [1.8, 2.6, -3.6], fov: 52 },
        { t: 91.9, pos: [0, 2.6, 12], look: [0, 2.8, -4], fov: 56 },
      ]} />
      <DimLights a={0.6} d={0.6} />
      <Stars p={[0, 9, -34]} s={[70, 26]} t={t} />
      <Floor kind="marble" a="#171d2e" b="#12172a" w={44} d={30} unit={2.6} />
      <Building p={[-4.6, 0, -8]} s={[5.6, 11.5, 5]} color="#232c44" seed={7} lit={0.32} trim="#10182c" />
      <Building p={[3.4, 0, -12]} s={[4.2, 8, 4]} color="#1b2338" seed={21} lit={0.22} trim="#0d1424" />
      <Sign p={[-4.6, 11.9, -5.4]} s={[4.6, 0.95]} text="KE TOWERS" bg="#101828" fg="#ffd36a" size={92} />
      <Sign p={[-4.6, 10.8, -5.4]} s={[3.4, 0.6]} text="PASAY CITY — MANILA" bg="#101828" fg="#8ae8ff" size={64} />
      <Box p={[-5.7, 7.4, -5.45]} s={[0.85, 1.05, 0.06]} color="#ffca7a" line={1} />
      <Glow p={[-5.7, 7.4, -5.2]} r={1.5 * litWin} color="#ffca7a" o={0.5} />
      <Board p={[4.1, 2.9, -3.6]} w={7.0} h={4.1} px={[1100, 640]} draw={revealBoard(t)} />
      <Chip p={[4.1, 5.6, -3.4]} text="BEDAH KASUS" t0={32.15} bg="#e5233a" fg="#ffffff" w={3.6} />
    </Stage>
  );
};

/* ================= SCENE H2 — STAGE 1: THE COURIER CALL (91.9–134.7) =================
   Split stage: victim's warm home (left) vs the courier at his desk (right).
   The courier walks in carrying the parcel, takes the call; the victim's NAME and
   ADDRESS chips physically float across the stage into his clipboard (ref 4),
   then become the fuel bar for stage 2. */
const SceneCourier: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const walkK = seg(t, 94.4, 97.4);
  const cx = lerp(10.5, 5.4, walkK);
  const chip1 = seg(t, 109.7, 112.6), chip2 = seg(t, 111.2, 114.2);
  const chipPos = (k: number, y0: number, x1: number, y1: number): V3 => {
    const e = Easing.inOut(Easing.cubic)(k);
    return [lerp(-4.4, x1, e), lerp(y0, y1, e) + Math.sin(e * Math.PI) * 1.1, lerp(-1.2, -2.2, e)];
  };
  const fuel = seg(t, 125.8, 132.5);
  return (
    <Stage bg="#171226">
      <Cam t={t} keys={[
        { t: 91.9, pos: [0, 2.4, 12.4], look: [0, 1.9, -2], fov: 58 },
        { t: 103, pos: [-1.6, 2.1, 10.6], look: [-3.6, 1.8, -2], fov: 54 },
        { t: 114, pos: [1.9, 2.1, 10.6], look: [4.4, 1.9, -2.2], fov: 54 },
        { t: 126, pos: [0.6, 2.2, 11.4], look: [0.8, 1.7, -2], fov: 55 },
        { t: 134.7, pos: [0, 2.3, 12], look: [0, 1.9, -2], fov: 57 },
      ]} />
      <Lights warm="#ffe2b8" />
      <Floor kind="plank" a="#5a4030" b="#4c3527" w={36} d={26} unit={2.2} />
      <WallDoor z={-7} W={36} kind="wood" a="#7a5638" b="#6b4a2f" base="#3c2716" />
      <Box p={[0.55, 3.1, -6.8]} s={[0.1, 6.4, 0.15]} color="#0d1020" line={1} />
      <Glow p={[0.55, 3.4, -6.4]} r={1.1} color="#8ae8ff" o={0.35} />
      {/* victim side */}
      <Desk p={[-4.6, 0, -1.6]} w={3.2} top="#8a5a32" leg="#5a3a20" />
      <Person p={[-4.6, 0, -2.5]} h={3.7} look={victimLook} f={f}
        pose={{ mood: t < 109.5 ? "smile" : t < 119.5 ? "deadpan" : "worry", arms: "hold", armR: [0.3, 0.45], armL: [-0.3, 0.45], nerv: t > 119.5 ? 0.6 : 0, lookX: 0.25 }} />
      <PhoneProp p={[-4.6, 1.62, -1.05]} w={0.6} screen={(c, W, H, tt) => {
        c.fillStyle = "#0a1420"; c.fillRect(0, 0, W, H);
        if (t > 119.5) { const pu = 0.6 + 0.4 * Math.sin(tt * 9); c.strokeStyle = `rgba(255,80,64,${pu})`; c.lineWidth = 6;
          for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(W / 2, H * 0.36, 40 + i * 30, 0, 7); c.stroke(); }
          txt(c, "PANGGILAN KE-2", W / 2, H * 0.58, 30, "#ff5040"); txt(c, "Nomor tak dikenal", W / 2, H * 0.65, 22, "#8a93a5", "center", 700);
        } else { txt(c, "KURIR", W / 2, H * 0.42, 34, "#8ae8ff"); txt(c, "sedang terhubung…", W / 2, H * 0.52, 22, "#8a93a5", "center", 700);
          c.fillStyle = "#2fd46a"; c.beginPath(); c.arc(W / 2, H * 0.30, 26 + Math.sin(tt * 5) * 4, 0, 7); c.fill(); }
      }} />
      {t > 119.5 ? <Glow p={[-4.6, 1.7, -0.7]} r={0.8 + Math.sin(t * 9) * 0.12} color="#ff5040" o={0.45} /> : null}
      {/* courier side */}
      <Desk p={[5.4, 0, -3.1]} w={3.4} top="#4a5468" leg="#2b3350" />
      <Monitor p={[6.6, 1.05, -3.3]} s={1.1} screen="#1c2a5a" />
      <Person p={[cx, 0, -2.2]} h={3.8} look={courierLook} f={f}
        pose={{ mood: "smile", arms: walkK < 1 ? "box" : "hold", armR: [0.42, 0.5], armL: [-0.2, 0.55], walk: walkK < 1 ? (10.5 - cx) * WALK : 0, speed: walkK < 1 ? 0.85 : 0, flip: true, lookX: -0.3 }} />
      {walkK < 1 || t < 103 ? <Box p={[cx - 0.15, 1.32, -1.62]} s={[1.15, 0.85, 0.85]} color="#b98a4e" line={3} /> : null}
      {t >= 103 ? <Box p={[4.15, 1.45, -2.9]} s={[1.15, 0.85, 0.85]} color="#b98a4e" line={3} /> : null}
      <Board p={[7.6, 2.5, -3.4]} w={2.3} h={3.0} px={[460, 600]} rot={[0, -0.35, 0]} draw={(c, W, H) => {
        c.fillStyle = "#e8e2d2"; c.fillRect(0, 0, W, H);
        txt(c, "DATA PENERIMA", W / 2, 44, 32, "#31456e");
        c.fillStyle = "#39424e"; c.fillRect(30, 76, W - 60, 5);
        const rows: [string, number][] = [["NAMA", chip1], ["ALAMAT", chip2]];
        rows.forEach(([lb, k], i) => { const y = 130 + i * 110;
          txt(c, lb, 34, y, 26, "#5a6274", "left", 700);
          c.fillStyle = "#c8cdd8"; rr(c, 30, y + 22, W - 60, 52, 8); c.fill();
          if (k >= 1) { c.fillStyle = "#232842"; for (let s = 0; s < 5; s++) c.fillRect(48 + s * 8, y + 42, 5, 14); txt(c, "✓ TERISI", W - 44, y + 48, 24, "#1e7a3c", "right"); }
        });
        txt(c, "PAKET: 1 KOLI", 34, H - 120, 26, "#5a6274", "left", 700);
        txt(c, chip2 >= 1 ? "STATUS: SIAP DITUDUHKAN" : "STATUS: MENUNGGU DATA", 34, H - 66, 25, chip2 >= 1 ? "#b3242e" : "#5a6274", "left");
      }} />
      {/* data chips fly victim -> clipboard */}
      {chip1 > 0 && chip1 < 1 ? <Chip p={chipPos(chip1, 3.6, 7.35, 3.1)} text="NAMA LENGKAP" t0={109.7} w={2.2} /> : null}
      {chip2 > 0 && chip2 < 1 ? <Chip p={chipPos(chip2, 3.1, 7.35, 2.35)} text="ALAMAT RUMAH" t0={111.2} w={2.2} /> : null}
      {chip1 >= 1 && t < 119 ? <Chip p={[7.35, 3.1, -2.9]} text="NAMA ✓" t0={112.6} bg="#2fd46a" w={1.7} /> : null}
      {chip2 >= 1 && t < 119 ? <Chip p={[7.35, 2.35, -2.9]} text="ALAMAT ✓" t0={114.2} bg="#2fd46a" w={1.7} /> : null}
      {/* fuel bar for stage 2 */}
      {t > 125.6 ? <Board p={[0.4, 0.78, 1.8]} w={6.4} h={0.95} px={[1024, 152]} face draw={(c, W, H) => {
        c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
        txt(c, "IDENTITAS + KEPERCAYAAN =", 30, H / 2, 40, "#8a93a5", "left", 700);
        c.fillStyle = "#2b3350"; rr(c, W * 0.52, H * 0.24, W * 0.33, H * 0.52, 16); c.fill();
        c.fillStyle = "#ffd36a"; if (fuel > 0) { rr(c, W * 0.52, H * 0.24, W * 0.33 * fuel, H * 0.52, 16); c.fill(); }
        txt(c, fuel >= 1 ? "TAHAP 2" : `${Math.round(fuel * 100)}%`, W * 0.925, H / 2, 42, fuel >= 1 ? "#ffd36a" : "#5a6274");
      }} /> : null}
      <Plant p={[-8.6, 0, -3.6]} />
      <Shelf p={[8.9, 0, -5.2]} w={3.2} rows={3} seed={4} />
    </Stage>
  );
};

/* ================= SCENE H3 — STAGE 2: THE FAKE OFFICE SET (134.7–223.7) =================
   The set is a real place the camera tours: uniform -> flag -> portraits -> Garuda,
   each glowing as it is named. The victim watches from a picture-in-picture phone.
   At the end the camera pulls out: the "office" is one lit room in a dark tower floor. */
const SetRoom: React.FC<{ t: number; f: number; lift?: number; dim?: number }> = ({ t, f, lift = 0, dim = 0 }) => (
  <>
    <group position={[0, lift * 7.5, 0]}>
      <WallDoor z={-6.2} W={32} kind="wood" a="#6e4f30" b="#5f4429" base="#3c2716" />
      <Garuda p={[0, 4.35, -6.05]} w={1.85} />
      <Portrait p={[2.35, 3.55, -6.05]} label="PRESIDEN RI" />
      <Portrait p={[4.15, 3.55, -6.05]} label="WAKIL PRESIDEN RI" />
      <FlagID p={[-4.9, 0, -4.6]} s={1.05} />
    </group>
    <Floor kind="marble" a="#9aa2b5" b="#878fa3" w={36} d={28} unit={2.4} />
    <SideWall x={-11} kind="plain" a="#5f4429" b="#54391f" d={26} />
    <SideWall x={11} kind="plain" a="#5f4429" b="#54391f" d={26} />
    <Rug p={[0, 0.02, -1.6]} s={[9, 5.4]} a="#7a1f2b" b="#671a24" />
    <Desk p={[0, 0, -2.7]} w={4.4} top="#e9edf7" leg="#aab7dc" />
    <Monitor p={[-1.5, 1.05, -3]} s={1.05} screen="#1c2a5a" />
    <Monitor p={[1.6, 1.05, -3]} s={1.05} screen="#24304f" />
    <Chair p={[0, 0, -3.9]} color="#3b4a8a" />
    <Person p={[0, 0, -3.75]} h={3.9} look={officerFakeLook} f={f}
      pose={{ mood: "deadpan", arms: (t > 151.4 && t < 155) || (t > 189.9 && t < 195.6) ? "point" : "down", armK: seg(t, 151.6, 152.2) * (1 - seg(t, 154.6, 155.2)) + seg(t, 190.2, 190.8) * (1 - seg(t, 195, 195.6)), armR: [0.75, 0.55], lookX: 0.15 }} />
    <UniformStand p={[5.9, 0, -3.2]} s={1.02} />
    <Shelf p={[-8.6, 0, -5]} w={3.4} rows={4} seed={9} />
    <Plant p={[8.8, 0, -4.6]} />
    <Lamp p={[-6.4, 0, -1.2]} h={3} color="#ffe9a8" />
    <Clock p={[-3.4, 4.5, -6.05]} r={0.62} t={t} speed={0.5} />
    {/* highlight glows as each prop is named */}
    {t > 162 && t < 170.6 ? <Glow p={[5.9, 2.9, -2.6]} r={2.1 + Math.sin(t * 7) * 0.2} color="#ffd36a" o={0.55} /> : null}
    {t > 170.6 && t < 174.3 ? <Glow p={[-4.55, 3.9, -4.2]} r={1.9 + Math.sin(t * 7) * 0.2} color="#ffd36a" o={0.55} /> : null}
    {t > 174.1 && t < 180.9 ? <Glow p={[3.25, 3.55, -5.6]} r={2.3 + Math.sin(t * 7) * 0.2} color="#ffd36a" o={0.5} /> : null}
    {t > 180.8 && t < 184.6 ? <Glow p={[0, 4.35, -5.6]} r={1.8 + Math.sin(t * 7) * 0.2} color="#ffd36a" o={0.6} /> : null}
    {dim > 0 ? <Box p={[0, 3.4, 2]} s={[40, 9, 0.1]} color="#05070d" line={0} /> : null}
  </>
);
const SceneSet: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const lift = seg(t, 213.4, 217.6);
  const trust = seg(t, 184.8, 195.4);
  return (
    <Stage bg="#241a12">
      <Cam t={t} keys={[
        { t: 134.7, pos: [0, 2.4, 11.8], look: [0, 2.1, -2.8], fov: 58 },
        { t: 151, pos: [0, 2.1, 8.2], look: [0, 2.2, -3.2], fov: 54 },
        { t: 162, pos: [1.2, 2.2, 6.4], look: [2.6, 2.4, -3.2], fov: 52 },
        { t: 166, pos: [3.6, 2.3, 3.4], look: [5.9, 2.8, -3.2], fov: 50 },
        { t: 171, pos: [-2.4, 2.5, 3.9], look: [-4.7, 3.6, -4.5], fov: 50 },
        { t: 175, pos: [1.2, 2.9, 3.4], look: [3.25, 3.55, -6], fov: 50 },
        { t: 181.5, pos: [0, 3.1, 4.4], look: [0, 4.3, -6], fov: 48 },
        { t: 186, pos: [0, 2.3, 9.6], look: [0, 2.2, -3], fov: 55 },
        { t: 196, pos: [0, 1.9, 8.4], look: [0, 1.1, 0.6], fov: 55 },
        { t: 208, pos: [0.6, 2, 9.4], look: [0, 1.6, -0.6], fov: 56 },
        { t: 214, pos: [0, 3.4, 13.5], look: [0, 2, -3], fov: 58 },
        { t: 219, pos: [0, 5.6, 17.5], look: [0, 1.2, -3.4], fov: 60 },
        { t: 223.7, pos: [0, 3.2, 13], look: [0, 2, -3], fov: 58 },
      ]} impacts={[[213.2, 0.008]]} />
      {lift > 0.4 ? <DimLights a={0.5} d={0.5} /> : <Lights warm="#ffe9c4" />}
      <SetRoom t={t} f={f} lift={lift} />
      {/* dark tower floor revealed around the set */}
      {lift > 0.05 ? <>
        <Building p={[-13, 0, -14]} s={[6, 13, 5]} color="#141b2e" seed={31} lit={0.15} />
        <Building p={[13.5, 0, -13]} s={[5, 10, 5]} color="#11182a" seed={47} lit={0.12} />
        <Sign p={[0, 6.4, -9]} s={[5.6, 1]} text="KE TOWERS — PASAY CITY" bg="#101828" fg="#8ae8ff" size={80} />
      </> : null}
      {/* victim picture-in-picture */}
      <group position={[6.15, 0.15, 1.6]}>
        <CanvasPlane p={[0, 1.62, 0]} s={[2.35, 3.1]} px={[470, 620]} face draw={(c, W, H) => {
          c.fillStyle = "#131a2c"; c.fillRect(0, 0, W, H);
          c.fillStyle = "#0a0f1e"; c.fillRect(0, 0, W, 64); txt(c, "● PANGGILAN VIDEO", W / 2, 34, 25, "#ff5040");
          const bob = Math.sin(t * 1.9) * 3;
          c.fillStyle = "#f0c8a0"; c.beginPath(); c.arc(W / 2, H * 0.40 + bob, 74, 0, 7); c.fill();
          c.fillStyle = "#14100c"; c.beginPath(); c.arc(W / 2, H * 0.335 + bob, 76, Math.PI, 7); c.fill();
          c.fillStyle = "#6d4a7a"; c.beginPath(); c.ellipse(W / 2, H * 0.78, 108, 96, 0, 0, 7); c.fill();
          c.fillStyle = "#0b0d1a";
          if (t < 184.6) { c.beginPath(); c.arc(W / 2 - 26, H * 0.40 + bob, 6, 0, 7); c.arc(W / 2 + 26, H * 0.40 + bob, 6, 0, 7); c.fill();
            c.strokeStyle = "#0b0d1a"; c.lineWidth = 5; c.beginPath(); c.arc(W / 2, H * 0.475 + bob, 16, 0.3, Math.PI - 0.3); c.stroke(); }
          else { c.beginPath(); c.arc(W / 2 - 26, H * 0.40 + bob, 6, 0, 7); c.arc(W / 2 + 26, H * 0.40 + bob, 6, 0, 7); c.fill();
            c.fillStyle = "#0b0d1a"; c.fillRect(W / 2 - 13, H * 0.485 + bob, 26, 5); }
          txt(c, "KORBAN", W / 2, H * 0.865, 27, "#8a93a5", "center", 700);
          c.fillStyle = "#2b3350"; rr(c, W * 0.14, H * 0.905, W * 0.72, 20, 10); c.fill();
          c.fillStyle = "#2fd46a"; if (trust > 0) { rr(c, W * 0.14, H * 0.905, W * 0.72 * trust, 20, 10); c.fill(); }
          if (trust >= 1) txt(c, "PERCAYA", W / 2, H * 0.955, 24, "#2fd46a");
        }} />
      </group>
      {/* 3-second doubt-killer ring */}
      {t > 184.6 && t < 189.9 ? <Board p={[-3.9, 3.4, -2]} w={2.2} h={2.2} px={[440, 440]} face frame={undefined} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H);
        const k = seg(t, 184.8, 187.8), a = -Math.PI / 2 + k * Math.PI * 2;
        c.strokeStyle = "#2b3350"; c.lineWidth = 22; c.beginPath(); c.arc(W / 2, H / 2, W * 0.36, 0, 7); c.stroke();
        c.strokeStyle = "#ffd36a"; c.beginPath(); c.arc(W / 2, H / 2, W * 0.36, -Math.PI / 2, a); c.stroke();
        txt(c, `${Math.max(0, 3 - Math.floor((t - 184.8)))}`, W / 2, H / 2 - 18, 120, "#f5f7fa");
        txt(c, "DETIK", W / 2, H / 2 + 62, 34, "#8a93a5", "center", 700);
      }} /> : null}
      {/* evidence spread */}
      {t > 195.8 ? <>
        <Desk p={[0, 0, 1.4]} w={8.6} top="#39424e" leg="#232842" d={2.2} />
        <UniformStand p={[-3.4, 1.02, 1.2]} s={0.52} />
        <UniformStand p={[-2.2, 1.02, 1.7]} s={0.52} />
        <Box p={[0.4, 1.35, 1.5]} s={[1.7, 0.65, 0.1]} color="#c9a227" line={2} />
        <Box p={[1.15, 1.3, 1.65]} s={[1.3, 0.55, 0.1]} color="#8a93a5" line={2} />
        <Box p={[3.1, 1.28, 1.4]} s={[1.5, 0.5, 0.7]} color="#5e1420" line={2} />
        <Chip p={[-3.7, 3.25, 1.4]} text="SERAGAM × PULUHAN" t0={198.2} w={3.1} />
        <Chip p={[0.1, 3.75, 1.2]} text="FOTO PRESIDEN + KAPOLRI" t0={201.4} w={3.6} />
        <Chip p={[3.6, 3.2, 1.4]} text="LOGO BARESKRIM" t0={204} w={2.9} />
        <Chip p={[-1.3, 2.5, 1.8]} text="PIAGAM PALSU" t0={206.2} w={2.6} />
      </> : null}
      {/* price of trust */}
      {t > 218.9 ? <>
        <Chip p={[-4.3, 1.7, 0.8]} text="SET INI: MURAH" t0={219.1} bg="#8a93a5" fg="#10131c" w={3.2} />
        <group position={[4.4, 2.1, 0.6]}>
          <Glow p={[0, 0, -0.4]} r={2 + Math.sin(t * 3) * 0.25} color="#ffd36a" o={0.5} />
          <CanvasPlane p={[0, 0, 0]} s={[3.4, 2.5]} px={[680, 500]} face draw={(c, W, H) => {
            c.clearRect(0, 0, W, H);
            c.fillStyle = "#ffd36a"; c.beginPath(); c.moveTo(W / 2, H * 0.16);
            c.bezierCurveTo(W * 0.16, H * 0.30, W * 0.20, H * 0.72, W / 2, H * 0.86);
            c.bezierCurveTo(W * 0.80, H * 0.72, W * 0.84, H * 0.30, W / 2, H * 0.16); c.fill();
            txt(c, "KEPERCAYAAN", W / 2, H * 0.52, 44, "#5e1420");
          }} />
        </group>
        <Chip p={[4.4, 4.15, 0.6]} text="YANG MAHAL: INI" t0={220.9} w={2.9} />
      </> : null}
    </Stage>
  );
};

/* ================= SCENE H4 — STAGE 3: FORGED LETTERS + PRESSURE (223.7–273.6) =================
   Three forged letters fan up one by one; the PALSU stamp slams at "semuanya palsu";
   the pressure gauge climbs with every threat; a single lit door is the "way out". */
const SceneLetters: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const rise = (t0: number) => seg(t, t0, t0 + 0.8, Easing.out(Easing.back(1.4)));
  const stampK = (t0: number) => seg(t, t0, t0 + 0.22, Easing.out(Easing.quad));
  const gaugeV = t < 246.3 ? 0.16 : t < 248.8 ? 0.55 : t < 252.1 ? 0.8 : t < 258.7 ? 0.9 : 0.97;
  const doorOpen = seg(t, 258.8, 261.5);
  return (
    <Stage bg="#1c1420">
      <Cam t={t} keys={[
        { t: 223.7, pos: [0, 2.3, 11.4], look: [0, 2, -2.4], fov: 58 },
        { t: 232, pos: [0, 2, 8.6], look: [0.2, 2.1, -2.2], fov: 53 },
        { t: 244, pos: [0.2, 1.95, 7.6], look: [0.2, 2.1, -2.2], fov: 51 },
        { t: 252, pos: [1.6, 2.1, 8.8], look: [2.6, 1.8, -1.2], fov: 53 },
        { t: 264, pos: [0.8, 2.2, 10.2], look: [1.2, 2, -2], fov: 55 },
        { t: 273.6, pos: [0, 2.3, 11.2], look: [0.4, 2, -2], fov: 57 },
      ]} impacts={[[244.35, 0.02], [245.05, 0.016], [245.75, 0.016]]} />
      <Lights warm="#ffd9b0" />
      <Floor kind="plank" a="#4c3527" b="#3e2b20" w={36} d={26} unit={2.2} />
      <WallDoor z={-7} W={36} kind="plain" a="#4a3a52" b="#40334a" base="#241a2c" />
      <Desk p={[0.2, 0, -2.2]} w={6.4} top="#5a4632" leg="#33241a" d={2} />
      <Person p={[3.9, 0, -3.1]} h={3.9} look={officerFakeLook} f={f}
        pose={{ mood: "angry", arms: "point", armK: seg(t, 246.2, 246.8) * (1 - seg(t, 251.5, 252.1)) + seg(t, 258.6, 259.2) * (1 - seg(t, 263, 263.6)), armR: [0.8, 0.5], lookX: -0.4 }} />
      <Person p={[-4.7, 0, -2.3]} h={3.7} look={victimLook} f={f}
        pose={{ mood: t < 241 ? "worry" : "shock", arms: t > 252 && t < 258.5 ? "head" : "hold", armR: [0.3, 0.45], armL: [-0.3, 0.45], nerv: t > 246 ? 0.75 : 0.3, sweat: t > 241 ? 0.8 : 0, hunch: t > 255 ? 0.5 : 0.15, lookX: 0.4 }} />
      {/* paper stack, then the three letters fan up */}
      <Box p={[-0.9, 1.06, -1.7]} s={[1.7, 0.1, 2.2]} color="#e8e2d2" line={2} rot={[0, 0.25, 0]} />
      {t > 232.4 ? <group position={[-1.85, 1.05 + rise(232.5) * 1.55, -1.9]} rotation={[0, 0.35, 0]}><LetterDoc p={[0, 1.95, 0]} org="KEPOLISIAN" band="#31456e" stamp={stampK(244.35)} w={2.9} /></group> : null}
      {t > 234 ? <group position={[0.25, 1.05 + rise(234.1) * 1.55, -2.05]}><LetterDoc p={[0, 1.95, 0]} org="KEJAKSAAN" band="#5e1420" stamp={stampK(245.05)} w={2.9} /></group> : null}
      {t > 235.6 ? <group position={[2.35, 1.05 + rise(235.7) * 1.55, -1.9]} rotation={[0, -0.35, 0]}><LetterDoc p={[0, 1.95, 0]} org="PPATK" band="#1e5c38" stamp={stampK(245.75)} w={2.9} /></group> : null}
      {/* threats */}
      {t > 246.2 ? <Chip p={[3.9, 4.6, -2.6]} text="DIPROSES PIDANA" t0={246.3} bg="#e5233a" fg="#ffffff" w={3.4} /> : null}
      {t > 248.7 ? <Chip p={[-4.7, 4.55, -1.8]} text="ASET DIBLOKIR" t0={248.8} bg="#e5233a" fg="#ffffff" w={3} /> : null}
      {t > 248.7 ? <group position={[-4.7, 2.6, -1.15]}>
        <Box p={[0, 0, 0]} s={[1.5, 0.95, 0.08]} color="#274b73" line={3} />
        <CanvasPlane p={[0, 0, 0.06]} s={[1.5, 0.95]} px={[300, 190]} draw={(c, W, H) => {
          c.fillStyle = `rgba(140,200,255,${0.25 + 0.2 * Math.sin(t * 4)})`; c.fillRect(0, 0, W, H);
          txt(c, "✕ DIBLOKIR", W / 2, H / 2, 44, "#dff2ff");
        }} />
      </group> : null}
      {/* pressure gauge */}
      <GaugeDial p={[6.1, 1.75, -0.6]} value={gaugeV} alert={t > 246} />
      <Sign p={[6.1, 3.6, -0.6]} s={[2.2, 0.55]} text="TEKANAN NAIK" bg="#101828" fg="#ff5040" size={58} />
      {/* the one lit door: the offered way out */}
      <group position={[8.6, 0, -4.6]}>
        <Box p={[0, 2.2, -0.3]} s={[2.6, 4.6, 0.3]} color="#241a2c" line={2} />
        <Box p={[-0.55 + doorOpen * 0.55, 2.1, 0]} s={[1.15, 4.1, 0.12]} color="#ffd36a" line={2} rot={[0, -doorOpen * 0.9, 0]} />
        {doorOpen > 0 ? <Glow p={[0.4, 2.1, -0.5]} r={2.2 * doorOpen} color="#ffd36a" o={0.5} /> : null}
        {t > 258.8 ? <Chip p={[0, 5.1, 0]} text="“JALAN KELUAR”" t0={259} bg="#ffd36a" w={2.8} /> : null}
      </group>
      {t > 265.4 ? <Chip p={[0.2, 5.15, -1.6]} text="ANCAMAN = TUASNYA" t0={265.5} bg="#e5233a" fg="#fff" w={3.6} /> : null}
    </Stage>
  );
};

/* ================= SCENE H5 — STAGE 4: MONEY FLOWS (273.6–330.6) =================
   Ref 4 in full: the transfer is a machine drawn in space. Packets leave the victim,
   pause inside the "PENITIPAN" vault (the trick), split to mule accounts, and land in
   Manila. A second, crueller branch: loan-app money flows UP into the same pipe. */
const SceneMoney: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  // flow phase with a full stop during the "penitipan" pause (286.7–288.8)
  const phase = t < 286.7 ? (t - 278) * 2.3 : t < 288.8 ? 8.7 * 2.3 : 8.7 * 2.3 + (t - 288.8) * 2.3;
  const mainPath: V3[] = [[-6.1, 1.7, -1], [-2.6, 1.7, -1], [1.4, 1.7, -1], [4.35, 1.7, -1]];
  const splitA: V3[] = [[4.35, 1.7, -1], [5.6, 1.7, -3.1]];
  const splitB: V3[] = [[4.35, 1.7, -1], [5.9, 1.7, -1]];
  const splitC: V3[] = [[4.35, 1.7, -1], [5.6, 1.7, 1.1]];
  const pinjolPath: V3[] = [[-1.6, 1.15, 3.4], [-2.2, 1.5, 1.2], [-2.6, 1.7, -1]];
  const loss = 46.7 * seg(t, 303.4, 312.6);
  const dots = Math.floor(87 * seg(t, 303.4, 312.6));
  return (
    <Stage bg="#0a1224">
      <Cam t={t} keys={[
        { t: 273.6, pos: [0, 3.6, 14], look: [0, 1.6, -1], fov: 58 },
        { t: 285, pos: [1.4, 2.9, 11.2], look: [0.4, 1.5, -1], fov: 54 },
        { t: 297, pos: [-0.6, 3, 11.6], look: [-0.6, 1.4, 0.6], fov: 55 },
        { t: 305, pos: [0, 3.2, 12.4], look: [0.6, 2, -1.6], fov: 55 },
        { t: 316, pos: [2.6, 2, 7.6], look: [3.6, 0.9, 1.9], fov: 52 },
        { t: 322, pos: [0, 3.3, 12.6], look: [0.4, 2, -1.4], fov: 56 },
        { t: 330.6, pos: [0, 3.4, 13.4], look: [0.2, 1.8, -1.2], fov: 57 },
      ]} />
      <DimLights a={0.8} d={0.9} />
      <Floor kind="marble" a="#131c33" b="#0f1628" w={40} d={28} unit={2.4} />
      <Stars p={[0, 10, -30]} s={[64, 24]} t={t} />
      {/* path rails */}
      {[[mainPath], [splitA], [splitB], [splitC]].map((wrap, wi) => { const pts = wrap[0]; return pts.slice(1).map((p2, i) => {
        const p1 = pts[i], mx = (p1[0] + p2[0]) / 2, mz = (p1[2] + p2[2]) / 2, len = Math.hypot(p2[0] - p1[0], p2[2] - p1[2]);
        const ang = Math.atan2(p2[2] - p1[2], p2[0] - p1[0]);
        return <Box key={`${wi}-${i}`} p={[mx, 1.62, mz]} s={[len, 0.07, 0.3]} color="#2b4a77" line={1} rot={[0, -ang, 0]} />;
      }); })}
      {/* victim node */}
      <Person p={[-7.6, 0, -1]} h={3.8} look={victimLook} f={f}
        pose={{ mood: t < 297 ? "deadpan" : "worry", arms: t > 289 && t < 293 ? "shrug" : "hold", armR: [0.32, 0.45], armL: [-0.32, 0.45], hunch: t > 297 ? 0.45 : 0.1, lookX: 0.5 }} />
      <Sign p={[-7.6, 4.35, -1]} s={[2.4, 0.6]} text="KORBAN" bg="#101828" fg="#f5f7fa" size={64} />
      <PhoneProp p={[-6.35, 1.7, -1]} w={0.6} screen={(c, W, H) => {
        c.fillStyle = "#0a1420"; c.fillRect(0, 0, W, H);
        txt(c, "M-BANKING", W / 2, H * 0.2, 30, "#8ae8ff");
        const k = t > 278 ? 1 - seg(t, 278.2, 296) * 0.92 : 1;
        c.fillStyle = "#2b3350"; rr(c, W * 0.1, H * 0.34, W * 0.8, 30, 15); c.fill();
        c.fillStyle = "#2fd46a"; if (k > 0.02) { rr(c, W * 0.1, H * 0.34, W * 0.8 * k, 30, 15); c.fill(); }
        txt(c, t > 288.8 ? "“DITITIPKAN”" : "TRANSFER…", W / 2, H * 0.55, 27, "#ffd36a");
        txt(c, "Rp ••••••••", W / 2, H * 0.68, 26, "#8a93a5", "center", 700);
      }} />
      {/* penitipan vault */}
      <group position={[-2.6, 0, -1]}>
        <Box p={[0, 1.05, 0]} s={[1.7, 2.1, 1.7]} color="#31456e" line={3} />
        <Box p={[0, 2.2, 0]} s={[1.85, 0.22, 1.85]} color="#ffd36a" line={2} />
        <Sign p={[0, 2.75, 0]} s={[2.3, 0.55]} text="“PENITIPAN”" bg="#101828" fg="#ffd36a" size={60} />
        {t > 286.7 && t < 288.9 ? <Glow p={[0, 1.6, 0]} r={1.6} color="#ffd36a" o={0.55} /> : null}
      </group>
      {/* mule accounts */}
      {[[5.9, -3.4, -0.5], [6.4, -1, 0], [5.9, 1.4, 0.5]].map(([x, z, ry], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, ry, 0]}>
          <Box p={[0, 1.55, 0]} s={[1.8, 1.15, 0.09]} color={i === 1 ? "#7a4a8c" : "#274b73"} line={3} />
          <CanvasPlane p={[0, 1.55, 0.06]} s={[1.66, 1.02]} px={[332, 204]} draw={(c, W, H) => {
            c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(0, 0, W, H * 0.3);
            txt(c, "ATM", 20, 34, 34, "#ffd36a", "left");
            txt(c, `REK. PENAMPUNG ${i + 1}`, W / 2, H * 0.62, 27, "#f5f7fa");
            txt(c, "•••• " + (4400 + i * 137), W / 2, H * 0.82, 24, "#8a93a5", "center", 700);
          }} />
        </group>
      ))}
      <Sign p={[6.15, 3.15, -1]} s={[3, 0.6]} text="REKENING PENAMPUNG" bg="#101828" fg="#8ae8ff" size={56} />
      <Building p={[9.6, 0, -3.4]} s={[2.6, 5.4, 2.4]} color="#232c44" seed={12} lit={0.4} />
      <Sign p={[9.6, 5.9, -2.2]} s={[2.2, 0.55]} text="MANILA" bg="#101828" fg="#ffd36a" size={60} />
      {/* flows */}
      {t > 278 ? <PathPackets pts={mainPath} t={t} n={t > 300 ? 8 : 6} size={1.05} phase={phase} speed={0} /> : null}
      {t > 278 ? <><PathPackets pts={splitA} t={t} n={2} size={0.95} phase={phase * 0.62} speed={0} />
        <PathPackets pts={splitB} t={t} n={2} size={0.95} phase={phase * 0.62 + 1.2} speed={0} />
        <PathPackets pts={splitC} t={t} n={2} size={0.95} phase={phase * 0.62 + 2.4} speed={0} /></> : null}
      {/* pinjol branch */}
      <PhoneProp p={[-1.6, 1.05, 3.6]} w={0.62} rot={[0, 0.5, 0]} screen={(c, W, H) => {
        c.fillStyle = "#200d16"; c.fillRect(0, 0, W, H);
        txt(c, "PINJOL", W / 2, H * 0.2, 36, "#ff5040");
        txt(c, "CAIR CEPAT!", W / 2, H * 0.32, 26, "#ffd36a");
        c.fillStyle = "#e5233a"; rr(c, W * 0.14, H * 0.5, W * 0.72, 74, 37); c.fill();
        txt(c, "AJUKAN", W / 2, H * 0.5 + 38, 30, "#ffffff");
        if (t > 297.9) txt(c, "UTANG BARU → PELAKU", W / 2, H * 0.78, 22, "#ff5040");
      }} />
      <Sign p={[-3.7, 2.85, 3.6]} s={[2.6, 0.55]} text="VARIAN KEJAM: PINJOL" bg="#101828" fg="#ff5040" size={52} />
      {t > 297.9 ? <PathPackets pts={pinjolPath} t={t} n={3} size={0.9} color="#c22e3a" label="!" phase={(t - 297.9) * 2.3} speed={0} /> : null}
      {/* loss counter */}
      <Board p={[0.4, 5.15, -4.4]} w={8.6} h={2.2} px={[1100, 300]} draw={(c, W, H) => {
        c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
        if (t < 303) { txt(c, "UANG MENGALIR KE REKENING PENAMPUNG", W / 2, H * 0.5, 44, "#8ae8ff"); }
        else {
          txt(c, `TOTAL KERUGIAN: Rp ${fmtDec(loss)} MILIAR`, W / 2, H * 0.30, 54, "#ffd36a");
          for (let i = 0; i < 87; i++) { if (i >= dots) break; const gx = W * 0.06 + (i % 29) * (W * 0.885 / 28), gy = H * 0.52 + Math.floor(i / 29) * 34;
            c.fillStyle = "#ff5040"; c.beginPath(); c.arc(gx, gy, 7, 0, 7); c.fill(); c.fillRect(gx - 6, gy + 8, 12, 15); }
          txt(c, t > 321.7 ? "87 KORBAN — DATA SEMENTARA, BISA BERTAMBAH" : "87 korban terdata (Bareskrim Polri)", W / 2, H * 0.90, 32, "#f5f7fa", "center", 700);
        }
      }} />
      {/* evidence table */}
      {t > 315.8 ? <>
        <Desk p={[3.6, 0, 2.2]} w={4.6} top="#39424e" leg="#232842" d={1.9} />
        {[0, 1, 2, 3].map((i) => <Box key={i} p={[2.2 + i * 0.95, 1.12, 2]} s={[0.78, 0.5, 0.06]} color={i % 2 ? "#7a4a8c" : "#274b73"} line={2} rot={[0, (rnd(i) - 0.5) * 0.5, 0]} />)}
        {[0, 1].map((i) => <Box key={i} p={[2.6 + i * 1.3, 1.14, 2.7]} s={[0.85, 0.16, 1.1]} color="#31456e" line={2} />)}
        <Chip p={[3.6, 2.6, 2.2]} text="KARTU ATM + BUKU TABUNGAN — SITAAN" t0={316.2} w={4.4} />
      </> : null}
    </Stage>
  );
};

/* ================= SCENE H6 — HOW IT WAS EXPOSED (330.6–448.8) =================
   Acted beats + mechanism inserts: KBRI report -> phone forensics -> coordination ->
   the PNP raid -> evidence -> charges -> repatriation -> the network that remains. */
const SceneUnmask: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const w = t < 339.3 ? 1 : t < 358.2 ? 2 : t < 371.2 ? 3 : t < 376 ? 4 : t < 393 ? 5 : t < 399.4 ? 6 : t < 410.7 ? 7 : t < 418.5 ? 8 : t < 425 ? 9 : t < 439.1 ? 10 : 11;
  return (
    <Stage bg="#0b0f1c">
      {/* W1 — the unexpected door: KBRI Manila */}
      {w === 1 ? <>
        <Cam t={t} keys={[{ t: 330.6, pos: [0, 3, 13.5], look: [0, 3, -6], fov: 58 }, { t: 339.3, pos: [1, 2.8, 11.5], look: [0.4, 3.2, -6], fov: 55 }]} />
        <DimLights a={0.6} d={0.6} />
        <Stars p={[0, 10, -32]} s={[66, 24]} t={t} />
        <Floor kind="marble" a="#171d2e" b="#12172a" w={44} d={30} unit={2.6} />
        <Building p={[0, 0, -8]} s={[7, 9, 5]} color="#2a3350" seed={5} lit={0.4} trim="#131a2e" />
        <Sign p={[0, 9.6, -5.4]} s={[6.4, 1.05]} text="KBRI MANILA" bg="#101828" fg="#ffd36a" size={88} />
        <FlagID p={[-4.6, 0, -4.4]} s={1.15} />
        <PathPackets pts={[[-11, 2.2, 0.5], [-6, 3.4, -1.5], [-1.8, 2.4, -3.6]]} t={t} n={3} size={0.8} color="#ffd36a" label="!" speed={2.6} />
        <Chip p={[0, 5.4, -2]} text="PINTU YANG TIDAK MEREKA DUGA" t0={333.9} w={5.2} />
      </> : null}
      {/* W2 — two men report to the embassy */}
      {w === 2 ? <>
        <Cam t={t} keys={[{ t: 339.3, pos: [0, 2.4, 11.6], look: [0, 2, -2.6], fov: 58 }, { t: 349, pos: [-0.6, 2.1, 9.4], look: [-0.4, 2, -2.8], fov: 54 }, { t: 358.2, pos: [-0.4, 2, 8.6], look: [0, 2.1, -2.9], fov: 53 }]} />
        <Lights warm="#ffe2b8" />
        <Floor kind="plank" a="#5a4030" b="#4c3527" w={36} d={26} unit={2.2} />
        <WallDoor z={-7} W={36} kind="wood" a="#7a5638" b="#6b4a2f" door={{ x: -7.6, w: 2.4, h: 4.2 }} base="#3c2716" />
        <FlagID p={[6.9, 0, -5.6]} s={1.1} />
        <Sign p={[0, 5.6, -6.85]} s={[5.4, 0.9]} text="KEDUTAAN BESAR RI — MANILA" bg="#5e1420" fg="#ffd36a" size={62} />
        <Desk p={[0.4, 0, -2.9]} w={4.6} top="#e9edf7" leg="#aab7dc" />
        <Person p={[1.1, 0, -3.8]} h={3.9} look={kbriLook} f={f}
          pose={{ mood: t < 353.9 ? "deadpan" : "shock", arms: t > 353.9 ? "hold" : "down", armR: [0.35, 0.5], armL: [-0.35, 0.5], lookX: -0.2 }} />
        {[-1, 1].map((s, i) => { const wk = seg(t, 340 + i * 0.7, 344.5 + i * 0.7); const x = lerp(-7.4, -2.35 + s * 1.05, wk);
          return <Person key={i} p={[x, 0, -1.9]} h={3.75} look={i ? suspect2Look : reporterLook} f={f}
            pose={{ mood: "worry", arms: wk < 1 ? "down" : "hold", armR: [0.3, 0.42], armL: [-0.3, 0.42], walk: wk < 1 ? (x + 7.4) * WALK : 0, speed: wk < 1 ? 0.8 : 0, lookX: 0.35 }} />; })}
        <Box p={[-3.3, 1.35, -1.55]} s={[0.55, 0.75, 0.1]} color="#5e1420" line={2} rot={[0, 0.3, 0]} />
        {t > 345.4 ? <Chip p={[0.4, 4.9, -2.4]} text="MENGAKU KORBAN PERDAGANGAN ORANG" t0={345.6} w={5} /> : null}
        {t > 353.9 ? <PhoneProp p={[0.05, 1.75, -2.2]} w={0.55} screen={(c, W, H) => {
          c.fillStyle = "#0a1420"; c.fillRect(0, 0, W, H);
          txt(c, "MEMERIKSA PONSEL…", W / 2, H * 0.3, 26, "#8ae8ff");
          c.fillStyle = "#2fd46a"; const n = Math.floor(4 * seg(t, 354.2, 357.6));
          for (let i = 0; i < n; i++) { rr(c, W * 0.12, H * (0.42 + i * 0.12), W * 0.76, 34, 8); c.fill(); }
          if (t > 358) txt(c, "INDIKASI PENIPUAN!", W / 2, H * 0.9, 26, "#ff5040");
        }} /> : null}
      </> : null}
      {/* W3 — the phone turns the case around */}
      {w === 3 ? <>
        <Cam t={t} keys={[{ t: 358.2, pos: [0, 2.6, 11], look: [0, 2.6, -2], fov: 56 }, { t: 371.2, pos: [0.4, 2.5, 9.6], look: [0.2, 2.6, -2], fov: 53 }]} />
        <DimLights a={0.7} d={0.7} />
        <Floor kind="marble" a="#171d2e" b="#12172a" w={40} d={28} unit={2.6} />
        <PhoneProp p={[-3.4, 3.1, -2]} w={1.55} screen={(c, W, H, tt) => {
          c.fillStyle = "#0a1420"; c.fillRect(0, 0, W, H);
          txt(c, "BUKTI DIGITAL", W / 2, 44, 30, "#8ae8ff");
          const off = (tt * 26) % 120;
          for (let i = 0; i < 9; i++) { const y = 96 + i * 62 - off; if (y < 70 || y > H - 40) continue;
            const mine = i % 3 === 0; c.fillStyle = mine ? "#1e4d33" : "#232c44"; rr(c, mine ? W * 0.34 : W * 0.06, y, W * 0.6, 44, 12); c.fill();
            c.fillStyle = "rgba(245,247,250,.55)"; c.fillRect((mine ? W * 0.34 : W * 0.06) + 14, y + 17, W * 0.6 - 60 - (i % 3) * 30, 10); }
          const marks = [360.7, 364.5, 368.2];
          marks.forEach((mt, i) => { if (t > mt) { c.strokeStyle = "#e5233a"; c.lineWidth = 5; const y = 96 + ((i * 3 + 1) * 62 - ((t * 26) % 120)); rr(c, W * 0.04, Math.max(74, Math.min(H - 90, y)), W * 0.68, 52, 10); c.stroke(); } });
          txt(c, "SKRIP PANGGILAN • REKENING • DAFTAR KORBAN", W / 2, H - 26, 19, "#ff5040", "center", 700);
        }} />
        <Board p={[3.6, 3, -2.4]} w={6.6} h={4.6} px={[1000, 700]} draw={(c, W, H) => {
          c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
          txt(c, "JEJARING DI BALIK DUA PONSEL", W / 2, H * 0.09, 36, "#f5f7fa");
          const n = Math.floor(120 * seg(t, 361, 370.5));
          const nodes: [number, number][] = [];
          for (let i = 0; i < n; i++) { const nx = W * (0.08 + rnd(i * 5 + 1) * 0.84), ny = H * (0.2 + rnd(i * 5 + 2) * 0.6); nodes.push([nx, ny]); }
          c.strokeStyle = "rgba(138,232,255,.25)"; c.lineWidth = 2;
          nodes.forEach(([nx, ny], i) => { if (i > 0) { const [px2, py2] = nodes[Math.max(0, i - 3)]; c.beginPath(); c.moveTo(px2, py2); c.lineTo(nx, ny); c.stroke(); } });
          nodes.forEach(([nx, ny], i) => { c.fillStyle = i === 0 ? "#ffd36a" : "#8ae8ff"; c.beginPath(); c.arc(nx, ny, i === 0 ? 11 : 6, 0, 7); c.fill(); });
          txt(c, t > 360.6 ? "100+ WNI TERLIBAT" : "MENELUSURI…", W / 2, H * 0.93, 40, "#ffd36a");
        }} />
        {t > 358.1 ? <Chip p={[0, 6.15, -2]} text="DI SITULAH SEMUANYA BERBALIK" t0={358.3} bg="#e5233a" fg="#fff" w={5.2} /> : null}
      </> : null}
      {/* W4 — coordination KBRI x PNP */}
      {w === 4 ? <>
        <Cam t={t} keys={[{ t: 371.2, pos: [0, 2.8, 12], look: [0, 2.6, -2], fov: 57 }, { t: 376, pos: [0, 2.7, 11.4], look: [0, 2.6, -2], fov: 56 }]} />
        <DimLights a={0.7} d={0.7} />
        <Floor kind="marble" a="#171d2e" b="#12172a" w={40} d={28} unit={2.6} />
        <Building p={[-5.4, 0, -4]} s={[4.4, 6.4, 3.6]} color="#2a3350" seed={8} lit={0.4} />
        <Sign p={[-5.4, 7, -2.2]} s={[3.6, 0.8]} text="KBRI + ATASE POLRI" bg="#101828" fg="#ffd36a" size={58} />
        <Building p={[5.4, 0, -4]} s={[4.4, 6.4, 3.6]} color="#1f3350" seed={14} lit={0.4} />
        <Sign p={[5.4, 7, -2.2]} s={[3.6, 0.8]} text="KEPOLISIAN FILIPINA" bg="#101828" fg="#8ae8ff" size={58} />
        <PathPackets pts={[[-3.1, 4.6, -2.2], [0, 5.6, -2.2], [3.1, 4.6, -2.2]]} t={t} n={3} size={0.75} color="#ffd36a" label="☎" speed={3} />
        <PathPackets pts={[[3.1, 3.4, -2.2], [0, 2.4, -2.2], [-3.1, 3.4, -2.2]]} t={t} n={3} size={0.75} color="#8ae8ff" label="✉" speed={3} />
        <Chip p={[0, 1.15, 0.6]} text="KOORDINASI LINTAS NEGARA" t0={371.5} w={4.6} />
      </> : null}
      {/* W5 — THE RAID, 3 Nov 2026 */}
      {w === 5 ? <>
        <Cam t={t} keys={[{ t: 376, pos: [0, 2.6, 13], look: [0, 2.6, -4], fov: 58 }, { t: 379.5, pos: [0, 2.2, 9], look: [0, 2, -3], fov: 55 }, { t: 382.4, pos: [0, 2.3, 10.6], look: [0, 2.2, -3], fov: 56 }, { t: 393, pos: [0, 2.2, 11.4], look: [0, 2, -1.6], fov: 57 }]} impacts={[[379.6, 0.03]]} />
        {t < 382.4 ? <>
          <DimLights a={0.55} d={0.55} />
          <Stars p={[0, 10, -32]} s={[66, 24]} t={t} />
          <Floor kind="marble" a="#141a2c" b="#101524" w={44} d={30} unit={2.6} />
          <Building p={[0, 0, -9]} s={[9, 13, 5]} color="#1d2742" seed={19} lit={0.25} trim="#0d1424" />
          <Sign p={[0, 13.5, -6.4]} s={[4.8, 0.95]} text="KE TOWERS — TOWER C" bg="#101828" fg="#8ae8ff" size={72} />
          <Chip p={[0, 10.9, -4]} text="3 NOVEMBER 2026" t0={376.2} bg="#e5233a" fg="#fff" w={3.8} />
          {[0, 1, 2].map((i) => { const wk = seg(t, 376.3 + i * 0.5, 379.4 + i * 0.5); const x = lerp(10.5 - i * 1.6, 1.8 - i * 1.7, wk);
            return <Person key={i} p={[x, 0, -2.6 + (i % 2) * 0.7]} h={3.85} look={i % 2 ? pnp2Look : pnpLook} f={f}
              pose={{ mood: "deadpan", arms: "point", armR: [0.7, 0.45], walk: wk < 1 ? (10.5 - i * 1.6 - x) * WALK : 0, speed: wk < 1 ? 1 : 0, flip: true, lookX: -0.5 }} />; })}
          <Box p={[0, 1.5, -6.35]} s={[2.4, 3, 0.25]} color={t > 379.5 ? "#ffd36a" : "#0d1424"} line={3} />
        </> : <>
          <Lights warm="#ffdcb0" />
          <SetRoom t={t} f={f} />
          {[-4.4, -2.2, 2.4, 4.6].map((x, i) => <Person key={i} p={[x, 0, -0.9 - (i % 2) * 0.5]} h={3.75} look={i % 2 ? suspect2Look : suspectLook} f={f}
            pose={{ mood: "shock", arms: "up", lookX: i < 2 ? 0.3 : -0.3 }} />)}
          {[-6.4, 6.6].map((x, i) => <Person key={i} p={[x, 0, -0.4]} h={3.9} look={i ? pnp2Look : pnpLook} f={f}
            pose={{ mood: "deadpan", arms: "point", armR: [0.75, 0.5], lookX: i ? -0.55 : 0.55 }} />)}
          {/* evidence boxes fill up */}
          {[0, 1, 2].map((i) => { const bx = -3.4 + i * 3.4, fillK = seg(t, 383 + i * 2.6, 390 + i * 1.2);
            return <group key={i} position={[bx, 0, 2.6]}>
              <Box p={[0, 0.55, 0]} s={[2.9, 1.1, 1.7]} color="#8a6a34" line={3} />
              <Sign p={[0, 0.62, 0.87]} s={[2.3, 0.5]} text="BARANG BUKTI" bg="#5e1420" fg="#ffd36a" size={52} />
              {fillK > 0.1 ? <Box p={[-0.6, 1.25, 0]} s={[0.9, 0.35 + fillK * 0.3, 0.7]} color={i === 0 ? "#2b4a77" : i === 1 ? "#14161f" : "#e8e2d2"} line={2} rot={[0, 0.2 * i, 0]} /> : null}
              {fillK > 0.45 ? <Box p={[0.55, 1.3, 0.1]} s={[0.8, 0.4 + fillK * 0.25, 0.6]} color={i === 1 ? "#2b4a77" : "#39424e"} line={2} rot={[0, -0.3, 0]} /> : null}
            </group>; })}
          <Board p={[0, 5.9, -3]} w={6.8} h={1.25} px={[1100, 200]} draw={(c, W, H) => {
            c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
            const n = Math.floor(320 * seg(t, 382.6, 392.4));
            txt(c, `BARANG BUKTI DISITA: ${fmtInt(n)}+`, W / 2, H / 2, 62, "#ffd36a");
          }} />
        </>}
      </> : null}
      {/* W6 — police report, Bareskrim */}
      {w === 6 ? <>
        <Cam t={t} keys={[{ t: 393, pos: [0, 2.4, 10.5], look: [0, 2.4, -2], fov: 56 }, { t: 399.4, pos: [0, 2.3, 9.4], look: [0, 2.4, -2], fov: 54 }]} impacts={[[395.2, 0.02]]} />
        <DimLights a={0.75} d={0.8} />
        <Floor kind="marble" a="#1a2138" b="#151b30" w={40} d={28} unit={2.6} />
        <WallDoor z={-7} W={36} kind="plain" a="#2a3350" b="#232c46" base="#12172a" />
        <group position={[0, 0.4, -2]} rotation={[0.06, 0, 0]}>
          <CanvasPlane p={[0, 2.6, 0]} s={[5.6, 4.6]} px={[840, 690]} frame="#39424e" draw={(c, W, H) => {
            c.fillStyle = "#f7f4ea"; c.fillRect(0, 0, W, H);
            c.fillStyle = "#31456e"; c.fillRect(0, 0, W, 104);
            txt(c, "LAPORAN POLISI", W / 2, 40, 44, "#ffffff");
            txt(c, "BARESKRIM POLRI — DITTIPIDSIBER", W / 2, 80, 25, "#ffe9a8", "center", 700);
            txt(c, "Perkara: penipuan daring lintas negara", 46, 160, 30, "#39424e", "left", 700);
            txt(c, "Markas: Tower C, KE Towers, Pasay City", 46, 208, 30, "#39424e", "left", 700);
            txt(c, "Tersangka: 141 WNI — Korban: 87 orang", 46, 256, 30, "#39424e", "left", 700);
            c.fillStyle = "#b9bec9"; for (let i = 0; i < 4; i++) c.fillRect(46, 310 + i * 44, W - 92 - (i % 2) * 120, 15);
            txt(c, "11 NOVEMBER 2026", W - 46, H - 130, 36, "#31456e", "right");
            if (t > 395.1) { c.save(); c.translate(W * 0.30, H * 0.80); c.rotate(-0.18); const k = seg(t, 395.1, 395.35); c.scale(1 + (1 - k) * 1.5, 1 + (1 - k) * 1.5);
              c.strokeStyle = "#1e7a3c"; c.lineWidth = 10; c.strokeRect(-150, -48, 300, 96); txt(c, "TERCATAT", 0, 2, 56, "#1e7a3c"); c.restore(); }
          }} />
        </group>
      </> : null}
      {/* W7 — repatriation flight */}
      {w === 7 ? <>
        <Cam t={t} keys={[{ t: 399.4, pos: [0, 3.4, 13], look: [0, 3.4, -4], fov: 58 }, { t: 410.7, pos: [0, 3, 12], look: [0, 2.8, -3], fov: 56 }]} />
        <DimLights a={0.6} d={0.6} />
        <Stars p={[0, 9, -30]} s={[66, 24]} t={t} />
        <Floor kind="marble" a="#12172a" b="#0e1322" w={44} d={30} unit={2.6} />
        <Sign p={[-8.6, 1.1, -2]} s={[2.8, 0.7]} text="MANILA" bg="#101828" fg="#8ae8ff" size={64} />
        <Sign p={[8.6, 1.1, -2]} s={[4.4, 0.7]} text="JAKARTA — SOEKARNO-HATTA" bg="#101828" fg="#ffd36a" size={52} />
        {(() => { const k = seg(t, 400.2, 408.2, Easing.inOut(Easing.cubic)); const x = lerp(-9.5, 9.5, k), y = 4.6 + Math.sin(k * Math.PI) * 2.6 - k * 1.6;
          return <group position={[x, y, -3]} rotation={[0, 0, lerp(0.1, -0.16, k)]}>
            <Cyl p={[0, 0, 0]} rt={0.34} rb={0.34} h={3.4} color="#dfe6f2" line={2} rot={[0, 0, Math.PI / 2]} />
            <Box p={[-0.2, -0.1, 0]} s={[1.7, 0.1, 2.6]} color="#b9c4d8" line={2} />
            <Box p={[-1.65, 0.35, 0]} s={[0.5, 0.85, 0.1]} color="#e5233a" line={2} />
            <Box p={[1.8, 0.1, 0]} s={[0.5, 0.3, 0.34]} color="#b9c4d8" line={2} />
            <Ball p={[1.95, 0.45, 0]} r={0.09} color={Math.sin(t * 6) > 0 ? "#ff5040" : "#571318"} ink={0.02} />
            {[0.5, 0.9, 1.3].map((wx) => <Box key={wx} p={[wx, 0.12, 0.36]} s={[0.22, 0.16, 0.03]} color="#ffd36a" line={0} />)}
          </group>; })()}
        {t > 408.4 ? <>
          {[-3.4, -1.7, 0, 1.7, 3.4].map((x, i) => <Person key={i} p={[x, 0, 0.8]} h={3.6} look={i % 2 ? suspect2Look : suspectLook} f={f} pose={{ mood: "worry", arms: "down", lookX: i < 2 ? 0.3 : -0.3 }} />)}
          {[-5.1, 5.1].map((x, i) => <Person key={i} p={[x, 0, 0.8]} h={3.85} look={i ? pnp2Look : pnpLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: i ? -0.4 : 0.4 }} />)}
          <Chip p={[0, 5.3, 0]} text="139 TERSANGKA TIBA — DIPROSES DITTIPIDSIBER" t0={408.6} w={6.4} />
        </> : null}
      </> : null}
      {/* W8 — layered charges */}
      {w === 8 ? <>
        <Cam t={t} keys={[{ t: 410.7, pos: [0, 2.6, 11.6], look: [0, 2.5, -2], fov: 57 }, { t: 418.5, pos: [0, 2.5, 10.8], look: [0, 2.5, -2], fov: 55 }]} impacts={[[416.6, 0.025]]} />
        <DimLights a={0.75} d={0.8} />
        <Floor kind="marble" a="#1a2138" b="#151b30" w={40} d={28} unit={2.6} />
        <WallDoor z={-7} W={36} kind="plain" a="#2a3350" b="#232c46" base="#12172a" />
        {[["PENIPUAN", 410.8, -4.3, "#7a1f2b"], ["MANIPULASI DATA ELEKTRONIK", 412.6, 0, "#31456e"], ["PENCUCIAN UANG", 414.4, 4.3, "#1e5c38"]].map(([label, t0, x, col]) => {
          const k = seg(t, Number(t0), Number(t0) + 0.7, Easing.out(Easing.cubic)); if (k <= 0) return null;
          return <group key={label as string} position={[Number(x), 0.4, -2]} rotation={[0, (1 - k) * -1.1, 0]}>
            <CanvasPlane p={[0, 2.6, 0]} s={[3.7, 4.4]} px={[560, 660]} frame={col as string} draw={(c, W, H) => {
              c.fillStyle = "#101828"; c.fillRect(0, 0, W, H);
              c.fillStyle = col as string; c.fillRect(0, 0, W, 86); txt(c, "PASAL BERLAPIS", W / 2, 45, 32, "#ffffff");
              const words = (label as string).split(" ");
              words.forEach((word, i) => txt(c, word, W / 2, H * 0.38 + i * 74, words.length > 2 ? 52 : 64, "#f5f7fa"));
              txt(c, "UU ITE • KUHP • TPPU", W / 2, H * 0.82, 28, "#8a93a5", "center", 700);
            }} />
          </group>; })}
        {t > 416.5 ? <Board p={[0, 0.95, 1.6]} w={6.2} h={1.15} px={[1024, 190]} face draw={(c, W, H) => {
          c.fillStyle = "#5e1420"; c.fillRect(0, 0, W, H);
          txt(c, "ANCAMAN MAKSIMAL: 15 TAHUN PENJARA", W / 2, H / 2, 56, "#ffd36a");
        }} /> : null}
      </> : null}
      {/* W9 — OJK: money back to victims */}
      {w === 9 ? <>
        <Cam t={t} keys={[{ t: 418.5, pos: [0, 3, 12.4], look: [0, 2.2, -2], fov: 57 }, { t: 425, pos: [0, 2.9, 11.8], look: [0, 2.2, -2], fov: 56 }]} />
        <DimLights a={0.75} d={0.8} />
        <Floor kind="marble" a="#131c33" b="#0f1628" w={40} d={28} unit={2.4} />
        <Building p={[6.8, 0, -3.6]} s={[3, 6, 2.6]} color="#232c44" seed={23} lit={0.35} />
        <Sign p={[6.8, 6.6, -2.2]} s={[2.6, 0.65]} text="MANILA" bg="#101828" fg="#8ae8ff" size={60} />
        <Sign p={[0, 5.6, -3]} s={[3.4, 0.85]} text="POLRI × OJK" bg="#101828" fg="#ffd36a" size={66} />
        {[-6.9, -5.2, -3.5].map((x, i) => <Person key={i} p={[x, 0, -1]} h={3.6} look={i === 1 ? familyLook : victimLook} f={f} pose={{ mood: "smile", arms: "down", lookX: 0.5 }} />)}
        <Sign p={[-5.2, 4.2, -1]} s={[2.6, 0.6]} text="PARA KORBAN" bg="#101828" fg="#f5f7fa" size={56} />
        <PathPackets pts={[[5.6, 1.8, -2.4], [1.5, 2.6, -1.6], [-2.9, 1.9, -1]]} t={t} n={4} size={1} speed={2.2} />
        <Chip p={[0.8, 1.05, 1.4]} text="PENGEMBALIAN UANG DIUPAYAKAN" t0={419.2} bg="#2fd46a" fg="#06280f" w={5} />
      </> : null}
      {/* W10 — inside the network: 2 years vs 2–6 months; stamped passports */}
      {w === 10 ? <>
        <Cam t={t} keys={[{ t: 425, pos: [0, 2.6, 11.6], look: [0, 2.5, -2], fov: 57 }, { t: 439.1, pos: [0, 2.5, 10.8], look: [0, 2.5, -2], fov: 55 }]} />
        <DimLights a={0.75} d={0.8} />
        <Floor kind="marble" a="#1a2138" b="#151b30" w={40} d={28} unit={2.6} />
        <WallDoor z={-7} W={36} kind="plain" a="#2a3350" b="#232c46" base="#12172a" />
        <Board p={[-3.6, 3.1, -3]} w={6.8} h={4} px={[1024, 600]} draw={(c, W, H) => {
          c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
          txt(c, "SUDAH BERAPA LAMA DI JARINGAN INI?", W / 2, H * 0.12, 36, "#f5f7fa");
          const b1 = seg(t, 428.2, 432.6), b2 = seg(t, 433.4, 435.8);
          txt(c, "SEBAGIAN", 40, H * 0.34, 32, "#8a93a5", "left", 700);
          c.fillStyle = "#2b3350"; rr(c, 40, H * 0.42, W - 80, 54, 12); c.fill();
          c.fillStyle = "#e5233a"; if (b1 > 0) { rr(c, 40, H * 0.42, (W - 80) * b1, 54, 12); c.fill(); }
          txt(c, "2 TAHUN", W - 40, H * 0.34, 40, "#ff5040", "right");
          txt(c, "SEBAGIAN LAIN", 40, H * 0.62, 32, "#8a93a5", "left", 700);
          c.fillStyle = "#2b3350"; rr(c, 40, H * 0.70, W - 80, 54, 12); c.fill();
          c.fillStyle = "#ffd36a"; if (b2 > 0) { rr(c, 40, H * 0.70, (W - 80) * 0.22 * b2, 54, 12); c.fill(); }
          txt(c, "2–6 BULAN", W - 40, H * 0.62, 40, "#ffd36a", "right");
        }} />
        <group position={[4.3, 0.3, -2.4]} rotation={[0, -0.3, 0]}>
          <CanvasPlane p={[0, 2.4, 0]} s={[3.1, 4.1]} px={[620, 820]} frame="#5e1420" draw={(c, W, H) => {
            c.fillStyle = "#f7f4ea"; c.fillRect(0, 0, W, H);
            txt(c, "PASPOR — RI", W / 2, 52, 38, "#5e1420");
            c.fillStyle = "#c8cdd8"; c.fillRect(40, 92, W - 80, 4);
            const stamps = [436.3, 437.1, 437.9, 438.5];
            stamps.forEach((st, i) => { if (t < st) return; const sx = 130 + (i % 2) * 250, sy = 190 + Math.floor(i / 2) * 190;
              c.save(); c.translate(sx, sy); c.rotate((rnd(i) - 0.5) * 0.7);
              c.strokeStyle = i % 2 ? "#31456e" : "#7a1f2b"; c.lineWidth = 7; c.beginPath(); c.arc(0, 0, 74, 0, 7); c.stroke();
              txt(c, ["MANILA", "KUALA L.", "BANGKOK", "SINGAPURA"][i], 0, -12, 27, i % 2 ? "#31456e" : "#7a1f2b");
              txt(c, "2025–2026", 0, 24, 22, i % 2 ? "#31456e" : "#7a1f2b", "center", 700); c.restore(); });
            if (t < 436.1) txt(c, "PENUH CAP LINTAS NEGARA", W / 2, H * 0.55, 30, "#8a93a5", "center", 700);
          }} />
        </group>
      </> : null}
      {/* W11 — the machine stops; the network may not */}
      {w === 11 ? <>
        <Cam t={t} keys={[{ t: 439.1, pos: [0, 3, 12.4], look: [0, 2.8, -3], fov: 57 }, { t: 448.8, pos: [0, 2.9, 11.6], look: [0, 2.8, -3], fov: 56 }]} />
        <DimLights a={0.65} d={0.65} />
        <Stars p={[0, 10, -32]} s={[66, 24]} t={t} />
        <Floor kind="marble" a="#10172a" b="#0c1220" w={44} d={30} unit={2.6} />
        <Board p={[0, 3.4, -4]} w={11.6} h={5.6} px={[1200, 580]} draw={(c, W, H) => {
          c.fillStyle = "#0a1120"; c.fillRect(0, 0, W, H);
          const cities: [string, number, number][] = [["JAKARTA", 0.16, 0.62], ["MANILA", 0.30, 0.38], ["KUALA LUMPUR", 0.13, 0.52], ["BANGKOK", 0.20, 0.30], ["KAMBOJA", 0.26, 0.22], ["MYANMAR", 0.10, 0.18], ["DUBAI", 0.52, 0.30], ["SINGAPURA", 0.22, 0.55]];
          c.strokeStyle = "rgba(138,232,255,.28)"; c.lineWidth = 2.5;
          cities.forEach(([nm, fx, fy], i) => { if (i === 0) return; const [_, ax, ay] = cities[1];
            c.beginPath(); c.moveTo(W * ax, H * ay); c.quadraticCurveTo(W * (ax + fx) / 2, H * Math.min(ay, fy) - 40, W * fx, H * fy); c.stroke(); });
          cities.forEach(([nm, fx, fy], i) => { const dead = nm === "MANILA" && t > 444.1;
            const pulse = dead ? 0 : 0.5 + 0.5 * Math.sin(t * 2.6 + i * 1.3);
            c.fillStyle = dead ? "#39424e" : i === 1 ? "#ffd36a" : "#8ae8ff";
            c.beginPath(); c.arc(W * fx, H * fy, dead ? 9 : 10 + pulse * 4, 0, 7); c.fill();
            txt(c, dead ? nm + " ✕" : nm, W * fx, H * fy + 34, 25, dead ? "#5a6274" : "#f5f7fa", "center", 700); });
          txt(c, t > 444.1 ? "MESIN MANILA: BERHENTI" : "SATU MESIN DARI JARINGAN BESAR", W / 2, H * 0.86, 42, "#ffd36a");
          if (t > 446.5) txt(c, "JARINGANNYA? MUNGKIN BELUM.", W / 2, H * 0.94, 34, "#ff5040");
        }} />
      </> : null}
    </Stage>
  );
};

/* ================= SCENE H7 — PROTECT YOURSELF (448.8–506.5) =================
   The checklist ticks itself, rule by rule, while a small stage on the right acts
   each rule out: stop the transfer, kill the video call, dial 110, refuse the
   "courier", and — hardest of all — just stop and breathe. */
const RULES: { tick: number; label: string; sub: string }[] = [
  { tick: 454.6, label: "POLISI ASLI TIDAK PERNAH", sub: "meminta transfer uang — untuk apa pun" },
  { tick: 464.2, label: "PROSES HUKUM TIDAK BERJALAN", sub: "lewat panggilan video — surat resmi bisa diverifikasi" },
  { tick: 471.6, label: "DITEKAN? TUTUP TELEPONNYA", sub: "lalu hubungi sendiri 110 / kantor polisi terdekat" },
  { tick: 481.8, label: "JANGAN KONFIRMASI DATA PRIBADI", sub: "ke penelepon “kurir” — urus paket di aplikasi resmi" },
  { tick: 491.1, label: "BERHENTI. PANIK = SENJATA MEREKA", sub: "“hari ini juga” = tanda penipuan — beri jeda 10 menit" },
];
const SceneProtect: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const rule = t < 464.1 ? 0 : t < 471.5 ? 1 : t < 481.6 ? 2 : t < 491 ? 3 : 4;
  return (
    <Stage bg="#141a26">
      <Cam t={t} keys={[
        { t: 448.8, pos: [0, 2.7, 12.8], look: [0, 2.5, -2.6], fov: 58 },
        { t: 480, pos: [0.4, 2.5, 11.8], look: [0.2, 2.5, -2.6], fov: 55 },
        { t: 506.5, pos: [0, 2.5, 11.2], look: [0, 2.5, -2.6], fov: 54 },
      ]} />
      <Lights warm="#e8ecf5" />
      <Floor kind="tile" a="#3d465c" b="#343e52" w={38} d={28} unit={2.2} />
      <WallDoor z={-7.5} W={38} kind="plain" a="#2e3850" b="#28324a" base="#161c2c" />
      <FlagID p={[-8.9, 0, -6.4]} s={0.95} />
      <Board p={[-3.55, 2.95, -3.4]} w={7.9} h={4.7} px={[1180, 700]} draw={(c, W, H) => {
        c.fillStyle = "#0e1626"; c.fillRect(0, 0, W, H);
        txt(c, "CEK SEBELUM PERCAYA", W / 2, 52, 46, "#ffd36a");
        c.fillStyle = "#ffd36a"; c.fillRect(W * 0.08, 84, W * 0.84, 4);
        RULES.forEach((r, i) => { const y = 128 + i * 108, active = rule === i, done = t > r.tick;
          c.fillStyle = active ? "rgba(255,211,106,0.13)" : "rgba(255,255,255,0.03)"; rr(c, 26, y - 44, W - 52, 92, 14); c.fill();
          c.strokeStyle = done ? "#2fd46a" : "#5a6274"; c.lineWidth = 5; rr(c, 48, y - 24, 52, 52, 10); c.stroke();
          if (done) { const k = seg(t, r.tick, r.tick + 0.45); c.strokeStyle = "#2fd46a"; c.lineWidth = 9; c.lineCap = "round";
            c.beginPath(); c.moveTo(58, y + 2); c.lineTo(58 + 14 * Math.min(1, k * 2), y + 2 + 13 * Math.min(1, k * 2));
            if (k > 0.5) { c.moveTo(72, y + 15); c.lineTo(72 + 22 * (k - 0.5) * 2, y + 15 - 26 * (k - 0.5) * 2); } c.stroke(); }
          txt(c, `${i + 1}. ${r.label}`, 128, y - 12, 35, done || active ? "#f5f7fa" : "#8a93a5", "left");
          txt(c, r.sub, 128, y + 26, 27, "#8a93a5", "left", 700);
        });
      }} />
      {/* right stage: the rule, acted out */}
      <group position={[4.6, 0, -2.2]}>
        {rule === 0 ? <>
          <Person p={[0.4, 0, -0.6]} h={3.8} look={officerFakeLook} f={f} pose={{ mood: "angry", arms: "point", armR: [0.8, 0.5], lookX: -0.3 }} />
          <CanvasPlane p={[-1.3, 2.2, 0.6]} s={[1.9, 2.2]} px={[380, 440]} face draw={(c, W, H) => {
            c.clearRect(0, 0, W, H); c.fillStyle = "#2fd46a";
            c.beginPath(); c.moveTo(W / 2, 16); c.lineTo(W - 20, H * 0.24); c.lineTo(W - 34, H * 0.62); c.quadraticCurveTo(W * 0.98, H * 0.9, W / 2, H - 14);
            c.quadraticCurveTo(W * 0.02, H * 0.9, 34, H * 0.62); c.lineTo(20, H * 0.24); c.closePath(); c.fill();
            const k = seg(t, 455.4, 456.2); c.strokeStyle = "#0b2e18"; c.lineWidth = 22; c.lineCap = "round";
            c.beginPath(); c.moveTo(W * 0.30, H * 0.52); c.lineTo(W * 0.30 + W * 0.4 * k, H * 0.52 - H * 0.0 * k); c.stroke();
            c.beginPath(); c.moveTo(W * 0.30, H * 0.30); c.lineTo(W * 0.30 + W * 0.4 * k, H * 0.30 + H * 0.22 * k); c.stroke();
            txt(c, "TRANSFER", W / 2, H * 0.80, 30, "#0b2e18");
          }} />
          <Packet p={[-2.2, 1.5 + Math.sin(t * 2) * 0.08, 0.9]} s={1.1} />
        </> : null}
        {rule === 1 ? <>
          <PhoneProp p={[-0.9, 1.9, 0.2]} w={0.85} screen={(c, W, H) => {
            c.fillStyle = "#1a2745"; c.fillRect(0, 0, W, H);
            c.fillStyle = "#e8b98d"; c.beginPath(); c.arc(W / 2, H * 0.36, 52, 0, 7); c.fill();
            c.fillStyle = "#2b4a77"; c.beginPath(); c.ellipse(W / 2, H * 0.78, 100, 90, 0, 0, 7); c.fill();
            const k = seg(t, 464.6, 465.4); c.strokeStyle = "#e5233a"; c.lineWidth = 16; c.lineCap = "round";
            c.beginPath(); c.moveTo(W * 0.12, H * 0.1); c.lineTo(W * 0.12 + W * 0.76 * k, H * 0.1 + H * 0.8 * k); c.stroke();
            c.beginPath(); c.moveTo(W * 0.88, H * 0.1); c.lineTo(W * 0.88 - W * 0.76 * k, H * 0.1 + H * 0.8 * k); c.stroke();
          }} />
          <group position={[1.5, 0.6, 0]} rotation={[0, -0.25, 0]}><LetterDoc p={[0, 1.9, 0]} org="SURAT PANGGILAN" band="#31456e" w={2.2} /></group>
          <Chip p={[0.3, 4.6, 0.2]} text="DATANG TERTULIS — BISA DIVERIFIKASI" t0={467.4} w={4.6} />
        </> : null}
        {rule === 2 ? <>
          <Person p={[0.2, 0, -0.6]} h={3.8} look={victimLook} f={f}
            pose={{ mood: t < 473 ? "worry" : "smile", arms: "point", armK: t > 475.8 ? (0.5 + 0.5 * Math.sin(t * 5)) : 0, armR: [0.55, 0.5], lookX: 0.3 }} />
          <group position={[-1.5, 1.35, 0.5]} rotation={[0, 0.4, seg(t, 471.7, 472.3) * 1.9]}>
            <Box p={[0, 0, 0]} s={[0.55, 1.05, 0.08]} color="#14161f" line={2} />
          </group>
          {t > 475.7 ? <Board p={[0.4, 4.35, 0]} w={3.4} h={1.5} px={[680, 300]} face draw={(c, W, H) => {
            c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
            txt(c, "HUBUNGI SENDIRI:", W / 2, H * 0.26, 36, "#8a93a5", "center", 700);
            txt(c, "1 1 0", W / 2, H * 0.66, 96, "#2fd46a");
          }} /> : null}
        </> : null}
        {rule === 3 ? <>
          <Person p={[1.2, 0, -0.6]} h={3.8} look={courierLook} f={f} pose={{ mood: "smile", arms: "box", lookX: -0.3 }} />
          <Box p={[1.05, 1.3, 0.05]} s={[1.05, 0.8, 0.8]} color="#b98a4e" line={3} />
          <Person p={[-1.6, 0, -0.5]} h={3.7} look={victimLook} f={f}
            pose={{ mood: "deadpan", arms: "down", lookX: Math.sin(t * 2.4) * (t > 483 && t < 487 ? 0.55 : 0.2) }} />
          <Chip p={[1.2, 4.5, 0]} text="“KONFIRMASI NAMA & ALAMAT?”" t0={482.2} w={4} />
          <Chip p={[-1.6, 4.5, 0]} text="TIDAK. URUS DI APLIKASI." t0={486.6} bg="#2fd46a" fg="#06280f" w={3.9} />
        </> : null}
        {rule === 4 ? <>
          <group position={[-1.2, 0, 0]}>
            <CanvasPlane p={[0, 2.2, 0]} s={[2.3, 2.3]} px={[460, 460]} face draw={(c, W, H) => {
              c.clearRect(0, 0, W, H); c.fillStyle = "#e5233a";
              c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8, x = W / 2 + Math.cos(a) * W * 0.42, y = H / 2 + Math.sin(a) * H * 0.42; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.fill();
              c.strokeStyle = "#ffffff"; c.lineWidth = 10; c.stroke();
              txt(c, "BERHENTI", W / 2, H / 2, 52, "#ffffff");
            }} />
          </group>
          <Clock p={[1.7, 2.6, 0]} r={0.95} t={t * 14} speed={1} />
          <Chip p={[1.7, 4.35, 0]} text="JEDA 10 MENIT" t0={493.4} w={2.7} />
          {t > 500.6 ? <>
            <Person p={[2.9, 0, -0.7]} h={3.6} look={familyLook} f={f} pose={{ mood: "smile", arms: "down", walk: (2.9) * 0, lookX: -0.4 }} />
            <Chip p={[0.6, 5.15, 0]} text="CERITAKAN KE KELUARGA" t0={500.9} bg="#2fd46a" fg="#06280f" w={3.8} />
          </> : null}
        </> : null}
      </group>
    </Stage>
  );
};

/* ================= SCENE H8 — OUTRO (506.5–532.6) =================
   Back in the set. One by one, its lights die: room, uniform, phone. What remains
   is the number — and tomorrow morning, somewhere else, a phone that gets hung up. */
const SceneOutro: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const roomDim = 1 - seg(t, 507.2, 508.4) * 0.55;
  const uniOff = seg(t, 509.6, 510.2), phoneOff = seg(t, 511.3, 511.9);
  return (
    <Stage bg="#07090f">
      <Cam t={t} keys={[
        { t: 506.5, pos: [0, 2.4, 11.6], look: [0, 2.1, -2.8], fov: 58 },
        { t: 515, pos: [0, 2.2, 10], look: [0, 2.2, -3], fov: 55 },
        { t: 520, pos: [0.4, 2.2, 10.6], look: [0.6, 2.1, -2], fov: 55 },
        { t: 532.6, pos: [0, 2.3, 11.2], look: [0, 2.2, -2], fov: 56 },
      ]} />
      <ambientLight intensity={0.32 * roomDim + 0.1} />
      <directionalLight position={[4, 8, 5]} intensity={0.4 * roomDim} color="#cdd8ff" />
      {t < 519.8 ? <>
        <SetRoom t={t} f={f} />
        {uniOff < 1 ? <Glow p={[5.9, 2.9, -2.6]} r={1.9} color="#ffe9a8" o={0.5 * (1 - uniOff)} /> : null}
        {phoneOff < 1 ? <Glow p={[1.6, 1.6, -1.6]} r={1.1} color="#2fd46a" o={0.5 * (1 - phoneOff)} /> : null}
        {t > 511.8 ? <Board p={[0, 3.1, -0.5]} w={7.6} h={1.9} px={[1100, 280]} face draw={(c, W, H) => {
          c.fillStyle = "rgba(7,9,15,0.88)"; c.fillRect(0, 0, W, H);
          const a = t < 515.7 ? seg(t, 512, 513) : 1 - seg(t, 518.6, 519.6) * 0.75;
          c.globalAlpha = Math.max(0.15, a);
          txt(c, "SATU RUANGAN. SATU SERAGAM. SATU PANGGILAN.", W / 2, H * 0.30, 42, "#f5f7fa");
          txt(c, "Rp 46,7 MILIAR", W / 2, H * 0.68, 54, "#ffd36a"); c.globalAlpha = 1;
        }} /> : null}
        {t > 515.9 ? <Chip p={[0, 5.3, -1]} text="YANG DICURI: KEPERCAYAAN PADA INSTITUSI" t0={516.2} w={6.2} /> : null}
      </> : <>
        {/* tomorrow morning: the call that fails */}
        <Floor kind="plank" a="#6b4a2f" b="#5a3d27" w={36} d={26} unit={2.2} />
        <WallDoor z={-7} W={36} kind="wood" a="#8a6a44" b="#7a5c39" base="#4c3520" />
        <WindowCity p={[6.6, 3.6, -6.9]} s={[3.6, 3.8]} />
        <Lamp p={[-6.6, 0, -3]} h={2.8} color="#ffe9a8" />
        <Desk p={[1.2, 0, -1.4]} w={3.4} top="#8a5a32" leg="#5a3a20" />
        <PhoneProp p={[1.2, 1.62, -0.85]} w={0.6} screen={(c, W, H, tt) => {
          c.fillStyle = "#0a1420"; c.fillRect(0, 0, W, H);
          if (t < 523.4) { const pu = 0.6 + 0.4 * Math.sin(tt * 9); c.strokeStyle = `rgba(47,212,106,${pu})`; c.lineWidth = 6;
            for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(W / 2, H * 0.36, 40 + i * 30, 0, 7); c.stroke(); }
            txt(c, "PANGGILAN VIDEO", W / 2, H * 0.58, 29, "#f5f7fa"); txt(c, "Nomor tak dikenal", W / 2, H * 0.65, 22, "#8a93a5", "center", 700);
          } else { txt(c, "PANGGILAN DITOLAK", W / 2, H * 0.5, 28, "#2fd46a"); }
        }} />
        {t < 523.4 ? <Glow p={[1.2, 1.7, -0.5]} r={0.85 + Math.sin(t * 9) * 0.12} color="#2fd46a" o={0.45} /> : null}
        {(() => { const wk = seg(t, 523.6, 525.6); const x = lerp(0.2, 6.5, wk);
          return <Person p={[x, 0, -2.1]} h={3.7} look={victimLook} f={f}
            pose={{ mood: "smile", arms: "down", walk: wk > 0 && wk < 1 ? x * WALK : 0, speed: wk > 0 && wk < 1 ? 0.8 : 0, lookX: -0.5 }} />; })()}
        {t > 525.5 ? <Board p={[0, 3.3, -3]} w={8.8} h={3.1} px={[1100, 390]} draw={(c, W, H) => {
          const k = seg(t, 525.7, 526.6); c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
          c.globalAlpha = k;
          txt(c, "BEDAH KASUS", W / 2, H * 0.34, 84, "#ffd36a");
          txt(c, "Mesin kejahatan berikutnya, kita bongkar bersama.", W / 2, H * 0.60, 36, "#f5f7fa", "center", 700);
          txt(c, "Usulkan kasusnya di kolom komentar — sampai jumpa.", W / 2, H * 0.80, 32, "#8ae8ff", "center", 700);
          c.globalAlpha = 1;
        }} /> : null}
      </>}
    </Stage>
  );
};

/* ================= captions + stage chips (DOM overlays) ================= */
const CaptionsID: React.FC = () => {
  const t = useT();
  const idx = BEATS.findIndex((b) => t >= b.start - 0.02 && t < b.end + 0.18);
  if (idx < 0) return null;
  const b = BEATS[idx];
  const pop = seg(t, b.start, b.start + 0.14, Easing.out(Easing.back(2)));
  return (
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 34, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ maxWidth: 1060, background: "rgba(4,6,12,0.72)", borderRadius: 14, padding: "13px 26px 15px", textAlign: "center",
        fontFamily: "Inter, Arial", fontWeight: 800, fontSize: 33, lineHeight: 1.28, color: "#fff",
        transform: `scale(${0.96 + pop * 0.04})`, textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>{b.cap}</div>
    </div>
  );
};
const CHIPS: { a: number; b: number; label: string }[] = [
  { a: 92.2, b: 96.4, label: "TAHAP 1 — PANGGILAN KURIR" },
  { a: 135.1, b: 139.3, label: "TAHAP 2 — POLISI PALSU & SET-NYA" },
  { a: 224, b: 228.2, label: "TAHAP 3 — SURAT PALSU & ANCAMAN" },
  { a: 273.9, b: 278.1, label: "TAHAP 4 — UANG MENGALIR" },
  { a: 330.9, b: 335.1, label: "CARA TERBONGKAR" },
  { a: 449.2, b: 453.4, label: "LINDUNGI DIRI" },
];
const StageChip: React.FC = () => {
  const t = useT();
  const chip = CHIPS.find((ch) => t >= ch.a && t < ch.b);
  if (!chip) return null;
  const k = Math.min(seg(t, chip.a, chip.a + 0.3), 1 - seg(t, chip.b - 0.3, chip.b));
  return (
    <div style={{ position: "absolute", top: 30, left: 36, opacity: k, transform: `translateX(${(1 - k) * -24}px)`,
      background: "#e5233a", color: "#fff", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 25,
      padding: "9px 18px", borderRadius: 8, letterSpacing: 0.5 }}>{chip.label}</div>
  );
};

/* ================= master + parts ================= */
const SCENES: { a: number; b: number; el: React.FC<{ t: number; f: number }> }[] = [
  { a: 0, b: 31.8, el: SceneHook },
  { a: 31.8, b: 91.9, el: SceneReveal },
  { a: 91.9, b: 134.7, el: SceneCourier },
  { a: 134.7, b: 223.7, el: SceneSet },
  { a: 223.7, b: 273.6, el: SceneLetters },
  { a: 273.6, b: 330.6, el: SceneMoney },
  { a: 330.6, b: 448.8, el: SceneUnmask },
  { a: 448.8, b: 506.5, el: SceneProtect },
  { a: 506.5, b: 532.6, el: SceneOutro },
];
const XF = 0.35;
export const BedahV2Master: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SCENES.map((s, i) => {
        if (t < s.a - 0.02 || t > s.b + XF) return null;
        // incoming scene fades in over the outgoing one (which stays mounted, opaque, beneath)
        const o = i === 0 ? 1 : seg(t, s.a, s.a + XF);
        const El = s.el;
        return <AbsoluteFill key={i} style={{ opacity: o }}><El t={t} f={f} /></AbsoluteFill>;
      })}
      <CaptionsID />
      <StageChip />
    </AbsoluteFill>
  );
};
const Part: React.FC<{ start: number }> = ({ start }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={-Math.round(start * FPS)} durationInFrames={TOTAL_FRAMES}>
      <BedahV2Master />
    </Sequence>
    <Audio src={staticFile("mix.wav")} startFrom={Math.round(start * FPS)} />
  </AbsoluteFill>
);
export const BedahV2P1: React.FC = () => <Part start={0} />;
export const BedahV2P2: React.FC = () => <Part start={134.7} />;
export const BedahV2P3: React.FC = () => <Part start={273.6} />;
export const BedahV2P4: React.FC = () => <Part start={390} />;
