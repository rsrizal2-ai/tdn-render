// Bedah Kasus #2 — Apollo Quiboloy, LONG-FORM (animated style, refs 4+5).
// Style: TDN toon engine (Remotion + Three.js), 1280x720 design @30fps, scale 1.5 -> 1920x1080.
// Grammar: ref 4 — the MECHANISM is animated (donations, papers, people travel through the
// system); ref 5 — CHARACTERS ACT OUT every step. Serious documentary tone; no jokes.
// Framing: ongoing case. Everything is allegation ("menurut dakwaan"); the accused pleaded
// NOT GUILTY and denies all charges. Victims/witnesses are never identified — generic figures
// only, witnesses shown from behind. No detail of alleged acts is depicted.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Sign, Clock, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Plant, Lamp, Monitor, Chair, Rug, WindowCity } from "../style/props";
import { Cam, Building, Stars, Globe } from "../style/extra";
import { BEATS, SECTIONS, DURATION } from "./bedahQBeats";

export const FPS = 30;
export const TOTAL_FRAMES = Math.ceil(DURATION * FPS);
const WALK = 3.4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const fmtInt = (n: number) => { const s = String(Math.max(0, Math.round(n))); return s.replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
const fmtDec = (v: number, d = 1) => { const p = v.toFixed(d).split("."); return fmtInt(Number(p[0])) + (d ? "," + p[1] : ""); };
const useT = () => useCurrentFrame() / FPS;
const SEC = (n: number) => SECTIONS[n - 1];
const at = (id: string) => BEATS.find((b) => b.id === id)!.start;

/* ---------------- cast ---------------- */
const pastorLook: Look = { skin: "#e8b98d", body: "#f2ede2", outfit: "suit", shirt: "#ffffff", tie: "#7a1f1f", hair: "grey", hairColor: "#c9c9c9", shoe: "#101018" };
const memberLook: Look = { skin: "#caa27e", body: "#4a6a8a", outfit: "shirt", hair: "short", hairColor: "#14100c", shoe: "#1b1b2a" };
const member2Look: Look = { skin: "#f0c8a0", body: "#7a5a8a", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", shoe: "#1b1b2a" };
const member3Look: Look = { skin: "#8a5a34", body: "#5a6e46", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", shoe: "#1b1b2a" };
const policeLook: Look = { skin: "#e8b98d", body: "#1f3350", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#8ae8ff", hat: "#16283f", shoe: "#101018" };
const police2Look: Look = { skin: "#8a5a34", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#1b1b2a", badge: "#8ae8ff", hat: "#16283f", shoe: "#101018" };
const senatorLook: Look = { skin: "#f0c8a0", body: "#5e1420", outfit: "blazer", shirt: "#f5f0e6", hair: "bob", hairColor: "#2a1a12", shoe: "#101018" };
const witnessLook: Look = { skin: "#caa27e", body: "#3a3f4a", outfit: "hoodie", hair: "short", hairColor: "#0d0d14", shoe: "#101018" };
const witness2Look: Look = { skin: "#a97a4e", body: "#4a3a3a", outfit: "hoodie", hair: "bob", hairColor: "#0d0d14", shoe: "#101018" };
const officialLook: Look = { skin: "#e8b98d", body: "#33393f", outfit: "suit", tie: "#12233d", shirt: "#eef1f5", hair: "short", hairColor: "#0d0d14", shoe: "#101018" };
const presLook: Look = { skin: "#caa27e", body: "#2b2b33", outfit: "blazer", shirt: "#dfe8f5", hair: "short", hairColor: "#3a3a3a", shoe: "#101018" };
const solicitorLook: Look = { skin: "#f0c8a0", body: "#c75b21", outfit: "shirt", hair: "short", hairColor: "#14100c", badge: "#ffd36a", shoe: "#1b1b2a" };
const passerLook: Look = { skin: "#8a5a34", body: "#38618c", outfit: "shirt", hair: "bob", hairColor: "#0d0d14", shoe: "#1b1b2a" };

/* ---------------- shared bits ---------------- */
const txt = (c: CanvasRenderingContext2D, s: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "center", weight = 900) => {
  c.fillStyle = color; c.font = `${weight} ${size}px Inter, Arial`; c.textAlign = align; c.textBaseline = "middle"; c.fillText(s, x, y);
};
const rr = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
};
const Board: React.FC<{ p: V3; w: number; h: number; px?: [number, number]; draw: (c: CanvasRenderingContext2D, W: number, H: number) => void; frame?: string; rot?: V3; face?: boolean }> =
  ({ p, w, h, px = [1024, 512], draw, frame = "#39424e", rot, face }) => (
    <CanvasPlane p={p} s={[w, h]} px={px} frame={frame} rot={rot} face={face} draw={draw} />
  );
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
/** Money packet that travels (ref 4). */
const Packet: React.FC<{ p: V3; s?: number; color?: string }> = ({ p, s = 1, color = "#2fd46a" }) => (
  <group position={p} scale={[s, s, s]}>
    <Box p={[0, 0, 0]} s={[0.62, 0.4, 0.1]} color={color} line={2} />
    <Box p={[0, 0, 0]} s={[0.14, 0.4, 0.11]} color="#0d5c2a" line={1} />
    <Ball p={[0, 0, 0.06]} r={0.09} color="#eafff0" ink={0.02} />
  </group>
);
/** Flight path of a packet: quadratic arc from a to b, k in 0..1. */
const arcPos = (a: V3, b: V3, hgt: number, k: number): V3 => {
  const x = lerp(a[0], b[0], k), z = lerp(a[2], b[2], k);
  const y = lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * hgt;
  return [x, y, z];
};
/** A KOJC compound building cluster: cathedral + dome + hangar + college block. */
const Compound: React.FC<{ night?: boolean; litK?: number }> = ({ night, litK = 1 }) => {
  const wall = night ? "#2a3049" : "#8a93a5";
  const win = (on: boolean) => (on ? "#ffd36a" : "#39424e");
  return (
    <group>
      <Box p={[0, 0.5, -6]} s={[26, 1, 0.4]} color={wall} line={2} />
      <Box p={[-13, 0.5, 0]} s={[0.4, 1, 12]} color={wall} line={2} />
      <Box p={[13, 0.5, 0]} s={[0.4, 1, 12]} color={wall} line={2} />
      <group position={[-7.5, 0, -3.5]}>
        <Box p={[0, 1.6, 0]} s={[4.6, 3.2, 3]} color={night ? "#3a4160" : "#cfd6e4"} line={3} />
        <Box p={[0, 3.6, 0]} s={[5, 0.9, 3.4]} color={night ? "#232842" : "#7a4a2a"} line={3} />
        <Box p={[0, 5.4, 0]} s={[0.9, 2.8, 0.9]} color={night ? "#3a4160" : "#cfd6e4"} line={3} />
        <Box p={[0, 7.1, 0]} s={[0.16, 0.9, 0.16]} color="#ffd36a" line={1} />
        <Box p={[0, 7.0, 0]} s={[0.7, 0.16, 0.16]} color="#ffd36a" line={1} />
        <Box p={[-1.2, 1.7, 1.53]} s={[0.8, 1.6, 0.05]} color={win(litK > 0.2)} line={1} />
        <Box p={[1.2, 1.7, 1.53]} s={[0.8, 1.6, 0.05]} color={win(litK > 0.45)} line={1} />
      </group>
      <group position={[5.5, 0, -3.8]}>
        <Cyl p={[0, 0.9, 0]} rt={3.1} rb={3.4} h={1.8} color={night ? "#2f3a58" : "#aab7dc"} line={3} />
        <Ball p={[0, 1.8, 0]} r={3.05} color={night ? "#3a4a73" : "#dfe8f5"} s={[1, 0.38, 1]} ink={0.04} />
        <Box p={[-1.4, 0.8, 3.05]} s={[0.7, 1.1, 0.05]} color={win(litK > 0.6)} line={1} />
        <Box p={[1.4, 0.8, 3.05]} s={[0.7, 1.1, 0.05]} color={win(litK > 0.8)} line={1} />
      </group>
      <group position={[9.8, 0, 1.8]}>
        <Box p={[0, 1.1, 0]} s={[4.4, 2.2, 3.4]} color={night ? "#2b3350" : "#9aa7c2"} line={3} />
        <Box p={[0, 2.45, 0]} s={[4.8, 0.5, 3.8]} color={night ? "#1d2440" : "#5a6a8a"} line={2} />
      </group>
      <group position={[-8.6, 0, 2.2]}>
        <Box p={[0, 1.9, 0]} s={[4.2, 3.8, 3]} color={night ? "#333c5c" : "#c2cbdd"} line={3} />
        {[-1.2, 0, 1.2].map((x, i) => (
          <Box key={i} p={[x, 2.6, 1.53]} s={[0.7, 0.9, 0.05]} color={win(litK > 0.3 + i * 0.2)} line={1} />
        ))}
        {[-1.2, 0, 1.2].map((x, i) => (
          <Box key={i} p={[x, 1.1, 1.53]} s={[0.7, 0.9, 0.05]} color={win(litK > 0.55 + i * 0.15)} line={1} />
        ))}
      </group>
      <Box p={[-1.8, 1.15, 5.9]} s={[0.35, 2.3, 0.35]} color={wall} line={2} />
      <Box p={[1.8, 1.15, 5.9]} s={[0.35, 2.3, 0.35]} color={wall} line={2} />
      <Box p={[0, 2.45, 5.9]} s={[4, 0.35, 0.4]} color={wall} line={2} />
    </group>
  );
};

/* ================= SCENE Q1 — HOOK (S1) =================
   Night. The compound ringed by police; a day counter races 1 -> 16; a heartbeat
   pulse glows under the college block; the FBI board stamps in. */
const SceneHook: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(1).start, s1 = SEC(1).end;
  const dayK = seg(t, at("s1b02"), at("s1b02") + (s1 - at("s1b02")) * 0.75);
  const day = 1 + Math.floor(dayK * 15.99);
  const hb = (t * 1.4) % 1;
  return (
    <Stage bg="#0a0e1e">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 8.5, 16.5], look: [0, 1.2, -1], fov: 55 },
        { t: s0 + 8, pos: [0, 6.8, 14.5], look: [0, 1.2, -1], fov: 52 },
        { t: s1, pos: [-1, 5.4, 12.5], look: [-1, 1.3, -1.5], fov: 50 },
      ]} />
      <DimLights a={0.5} d={0.45} />
      <Stars p={[0, 9, -34]} s={[110, 30]} t={t} top="#04060f" bottom="#0d1730" />
      <Floor kind="tile" a="#141a2e" b="#101527" w={44} d={34} unit={2.6} />
      <group position={[0, 0, -3.5]}>
        <Compound night litK={0.9} />
      </group>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const px = Math.sin(a) * 15.5, pz = Math.cos(a) * 10.5 - 4.0;
        if (pz > 3.4 && Math.abs(px) < 3) return null;
        return <Person key={i} p={[px, 0, pz]} h={2.4} look={i % 2 ? policeLook : police2Look} f={f}
          pose={{ mood: "deadpan", arms: "down", lookX: -Math.sin(a) * 0.6 }} />;
      })}
      {[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => (
        <Person key={i} p={[x, 0, 3.4]} h={2.4} look={[memberLook, member2Look, member3Look, memberLook, member2Look][i]} f={f}
          pose={{ mood: "worry", arms: "hold", lookX: 0 }} />
      ))}
      <Glow p={[-8.6, 0.25, -1.3]} r={0.7 + hb * 1.5} color="#ff5040" o={0.5 * (1 - hb)} />
      <Glow p={[-8.6, 0.25, -1.3]} r={0.45} color="#ff5040" o={0.75} />
      <Board p={[7.8, 4.4, -2]} w={5.6} h={2.9} px={[768, 400]} draw={(c, W, H) => {
        c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
        txt(c, "PENGEPUNGAN KOMPLEKS DAVAO", W / 2, H * 0.2, 34, "#8ae8ff", "center", 700);
        txt(c, "HARI " + day, W / 2, H * 0.55, 96, "#ffd36a");
        txt(c, "24 AGU — 8 SEP 2024", W / 2, H * 0.85, 30, "#f5f7fa", "center", 700);
      }} />
      {t >= at("s1b08") ? (() => {
        const k = seg(t, at("s1b08"), at("s1b08") + 0.35, Easing.out(Easing.back(2)));
        return (
          <Board p={[-7.9, 4.3, -1]} w={5.2} h={3} px={[768, 440]} draw={(c, W, H) => {
            c.fillStyle = "#101728"; c.fillRect(0, 0, W, H);
            c.strokeStyle = "#e5233a"; c.lineWidth = 10; c.strokeRect(14, 14, W - 28, H - 28);
            c.save(); c.translate(W / 2, H / 2); c.scale(k, k);
            txt(c, "WANTED BY THE FBI", 0, -H * 0.16, 62, "#e5233a");
            txt(c, "APOLLO C. QUIBOLOY", 0, H * 0.14, 44, "#f5f7fa");
            c.restore();
          }} />
        );
      })() : null}
    </Stage>
  );
};

/* ================= SCENE Q2 — REVEAL (S2) =================
   Day diorama of the compound; the stat board walks the numbers as they are named;
   bars close over the pastor figure for the Pasig cell beat. */
const SceneReveal: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(2).start, s1 = SEC(2).end;
  const panel =
    t < at("s2b04") ? 0 :
    t < at("s2b06") ? 1 :
    t < at("s2b08") ? 2 :
    t < at("s2b10") ? 3 : 4;
  return (
    <Stage bg="#131c33">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 6.5, 17], look: [-0.5, 1.2, -2], fov: 56 },
        { t: s0 + 14, pos: [0.5, 5.4, 15], look: [0, 1.2, -2], fov: 53 },
        { t: s1, pos: [0, 4.6, 13.5], look: [0, 1.3, -2], fov: 51 },
      ]} />
      <Lights warm="#ffeecf" />
      <Floor kind="tile" a="#2c3a5c" b="#25324f" w={44} d={34} unit={2.6} />
      <group position={[0, 0, -3.5]}>
        <Compound litK={1} />
      </group>
      <Person p={[-7.5, 0, -2.9]} h={2.7} look={pastorLook} f={f}
        pose={{ mood: "smile", arms: t < at("s2b10") ? "up" : "down", lookX: 0.2 }} />
      {t >= at("s2b10") ? [-8.6, -7.9, -7.2, -6.5].map((x, i) => {
        const k = seg(t, at("s2b10") + i * 0.09, at("s2b10") + i * 0.09 + 0.3, Easing.out(Easing.bounce));
        return <Box key={i} p={[x, 1.5 + (1 - k) * 4, -1.9]} s={[0.14, 3.4, 0.14]} color="#c8cfdb" line={1} />;
      }) : null}
      <Board p={[7.7, 4.3, -2]} w={6.4} h={3.6} px={[896, 504]} draw={(c, W, H) => {
        c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
        if (panel === 0) {
          txt(c, "BEDAH KASUS", W / 2, H * 0.3, 84, "#ffd36a");
          txt(c, "JATUHNYA SEBUAH KERAJAAN", W / 2, H * 0.58, 46, "#f5f7fa");
          txt(c, "Kingdom of Jesus Christ — Davao, Filipina", W / 2, H * 0.8, 32, "#8ae8ff", "center", 700);
        } else if (panel === 1) {
          txt(c, "PENGIKUT", W / 2, H * 0.18, 36, "#8ae8ff", "center", 700);
          const v = lerp(15, 6000000, seg(t, at("s2b04"), at("s2b06") - 0.3));
          txt(c, v < 1000 ? fmtInt(v) : fmtDec(v / 1000000) + " JUTA", W / 2, H * 0.5, 92, "#ffd36a");
          txt(c, "1985: sktr 15 orang, lalu klaim gereja: 6 juta, sktr 200 negara", W / 2, H * 0.78, 31, "#f5f7fa", "center", 700);
        } else if (panel === 2) {
          txt(c, "KOMPLEKS DAVAO", W / 2, H * 0.2, 38, "#8ae8ff", "center", 700);
          txt(c, "30 HEKTARE", W / 2, H * 0.52, 84, "#ffd36a");
          txt(c, "katedral - stadion - hanggar pesawat", W / 2, H * 0.8, 32, "#f5f7fa", "center", 700);
        } else if (panel === 3) {
          txt(c, "JARINGAN TELEVISI SENDIRI", W / 2, H * 0.22, 36, "#8ae8ff", "center", 700);
          txt(c, "SMNI", W / 2, H * 0.55, 110, "#ffd36a");
          txt(c, "+ sahabat dekat Presiden Duterte", W / 2, H * 0.82, 34, "#f5f7fa", "center", 700);
        } else {
          txt(c, "STATUS HARI INI", W / 2, H * 0.2, 38, "#8ae8ff", "center", 700);
          txt(c, "DITAHAN DI PASIG", W / 2, H * 0.5, 62, "#ff5040");
          txt(c, "mengaku TIDAK BERSALAH — belum ada vonis", W / 2, H * 0.78, 32, "#f5f7fa", "center", 700);
        }
      }} />
      {panel === 1 ? <Globe p={[-9.2, 2.2, -3.5]} r={1.9} rotY={t * 0.15} /> : null}
    </Stage>
  );
};

/* ================= SCENE Q3 — EMPIRE (S3) =================
   The pastor preaches on a stage; broadcast waves carry the sermon to houses;
   donation packets flow from the crowd and houses into the compound vault;
   the political layer lands last: a handshake, then a palace silhouette. */
const SceneEmpire: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(3).start, s1 = SEC(3).end;
  const flowOn = t >= at("s3b09");
  return (
    <Stage bg="#161d33">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 3, 11.5], look: [0, 1.6, -2], fov: 56 },
        { t: s0 + 16, pos: [-1.5, 2.6, 9.5], look: [-1, 1.7, -2.5], fov: 53 },
        { t: s1, pos: [0.5, 2.8, 11], look: [0, 1.6, -2], fov: 55 },
      ]} />
      <Lights warm="#ffe9c4" />
      <Floor kind="carpet" a="#2e2440" b="#261d36" w={40} d={30} unit={2.4} />
      {/* stage */}
      <Box p={[-4, 0.35, -4.5]} s={[9, 0.7, 5]} color="#4a3a2a" line={3} />
      <Shaft p={[-4, 6.5, -4.5]} s={[7, 9]} rot={[0.5, 0, 0]} o={0.16} />
      <Glow p={[-4, 3.4, -4.5]} r={2.6} color="#ffd36a" o={0.35} />
      <Person p={[-4, 0.7, -4.2]} h={2.9} look={pastorLook} f={f}
        pose={{ mood: "grin", arms: t < at("s3b06") ? "up" : "point", lookX: 0.3 }} />
      <Sign p={[-4, 5.6, -7.1]} s={[7.6, 1.1]} text="ANAK TUHAN YANG DIANGKAT" bg="#5e1420" fg="#ffd36a" size={64} />
      {/* crowd */}
      {[-7.5, -5.5, -3.5, -1.5, 0.5].map((x, i) => (
        <Person key={i} p={[x, 0, 0.8 + (i % 2) * 0.7]} h={2.3} look={[memberLook, member2Look, member3Look, member2Look, memberLook][i]} f={f}
          pose={{ mood: "smile", arms: "up", lookX: -0.2 }} />
      ))}
      {/* TV studio: camera + SMNI board, broadcast arcs to houses */}
      <group position={[5.9, 0, -4.6]}>
        <Box p={[0, 1.5, 0]} s={[2.2, 1.4, 1.6]} color="#232842" line={3} />
        <Cyl p={[0.4, 1.6, 0.9]} rt={0.32} rb={0.38} h={0.7} color="#39424e" rot={[Math.PI / 2, 0, 0]} line={2} />
        <Box p={[-0.5, 3.1, 0]} s={[0.18, 1.8, 0.18]} color="#39424e" line={1} />
        <Ball p={[-0.5, 4.1, 0]} r={0.14} color="#e5233a" ink={0.02} />
      </group>
      <Sign p={[5.9, 5.2, -5.6]} s={[3.6, 0.95]} text="SMNI" bg="#101728" fg="#8ae8ff" size={110} />
      {/* houses receiving the broadcast */}
      {[3.2, 5.6, 8.0].map((x, i) => (
        <group key={i} position={[x, 0, 1.6]}>
          <Box p={[0, 0.8, 0]} s={[2, 1.6, 1.8]} color="#3a4160" line={2} />
          <Box p={[0, 1.85, 0]} s={[2.4, 0.5, 2.1]} color="#7a4a2a" line={2} />
          <Box p={[0, 0.85, 0.93]} s={[0.55, 0.7, 0.05]} color="#ffd36a" line={1} />
        </group>
      ))}
      {/* donation packets: crowd + houses -> vault at the compound gate */}
      {flowOn ? [0, 1, 2, 3, 4, 5].map((i) => {
        const lt = ((t - at("s3b09")) * 0.28 + i / 6) % 1;
        const from: V3 = i % 2 ? [3.2 + (i - 1) * 1.2, 1.2, 1.6] : [-6 + i * 1.2, 1.4, 0.9];
        return <Packet key={i} p={arcPos(from, [2.3, 1.1, -0.5], 1.6, lt)} s={0.95} />;
      }) : null}
      <group position={[2.3, 0, -0.5]}>
        <Box p={[0, 0.75, 0]} s={[2.4, 1.5, 1.2]} color="#5a6a8a" line={3} />
        <Box p={[0, 1.62, 0]} s={[2.6, 0.25, 1.35]} color="#39424e" line={2} />
        <Sign p={[0, 0.78, 0.68]} s={[2.2, 0.6]} text="PERSEMBAHAN" bg="#101728" fg="#ffd36a" size={72} />
      </group>
      {/* political layer: handshake + palace, from s3b12 */}
      {t >= at("s3b12") ? (
        <group>
          <Person p={[6.6, 0, -1.4]} h={2.7} look={pastorLook} f={f} pose={{ mood: "smile", arms: "down", armR: [0.42, 0.5], lookX: 0.7 }} />
          <Person p={[8.2, 0, -1.4]} h={2.7} look={presLook} f={f} pose={{ mood: "smile", arms: "down", armL: [-0.42, 0.5], lookX: -0.7 }} />
          <Board p={[7.4, 4.9, -3.4]} w={5.4} h={1.5} px={[900, 250]} draw={(c, W, H) => {
            c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
            txt(c, "IMAN  +  MEDIA  +  KEKUASAAN", W / 2, H / 2, 56, "#ffd36a");
          }} />
        </group>
      ) : null}
    </Stage>
  );
};

/* ================= SCENE Q4 — MONEY MACHINE (S4) =================
   Ref 4 core: a system space. Left: Davao. Right: Los Angeles street.
   Step chips 1-5 light as the indictment's alleged assembly line is narrated:
   members fly in -> street soliciting for the "foundation" -> the split
   (operations vs lifestyles) -> kept in the US (rings / student visa) ->
   a suitcase of cash flies back. */
const SceneMoney: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(4).start, s1 = SEC(4).end;
  const step =
    t < at("s4b05") ? 0 :
    t < at("s4b07") ? 1 :
    t < at("s4b10") ? 2 :
    t < at("s4b14") ? 3 :
    t < at("s4b17") ? 4 : 5;
  const chipLabels = ["1  VISA", "2  GALANG DANA", "3  UANG MENGALIR", "4  DITAHAN DI AS", "5  TUNAI KELUAR"];
  return (
    <Stage bg="#0b1122">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 4.2, 12.8], look: [0, 1.4, -1], fov: 57 },
        { t: s0 + 20, pos: [1, 3.4, 11], look: [0.5, 1.5, -1], fov: 54 },
        { t: s1, pos: [0, 3.8, 12], look: [0, 1.4, -1], fov: 56 },
      ]} />
      <DimLights a={0.85} d={0.9} />
      <Floor kind="tile" a="#131c33" b="#0f1729" w={46} d={32} unit={2.6} />
      {/* DAVAO node (left) */}
      <group position={[-8.4, 0, -1]}>
        <Box p={[0, 1.1, 0]} s={[3, 2.2, 2.4]} color="#3a4160" line={3} />
        <Box p={[0, 2.45, 0]} s={[3.4, 0.5, 2.7]} color="#7a4a2a" line={2} />
        <Box p={[0, 3.4, 0]} s={[0.14, 1.1, 0.14]} color="#ffd36a" line={1} />
        <Box p={[0, 3.35, 0]} s={[0.6, 0.14, 0.14]} color="#ffd36a" line={1} />
        <Sign p={[0, 0.75, 1.28]} s={[2.8, 0.62]} text="DAVAO" bg="#101728" fg="#f5f7fa" size={84} />
      </group>
      {/* LOS ANGELES street (right) */}
      <group position={[7.6, 0, -1]}>
        <Box p={[-1.8, 2, -1]} s={[2.6, 4, 2]} color="#2c3a5c" line={3} />
        <Box p={[1.9, 2.7, -1]} s={[2.4, 5.4, 2]} color="#33436a" line={3} />
        {[-0.6, 0.6].map((x, i) => <Box key={i} p={[x - 1.8, 3, 0.03]} s={[0.6, 0.8, 0.05]} color="#ffd36a" line={1} />)}
        <Sign p={[0, 0.6, 1.35]} s={[3.6, 0.66]} text="LOS ANGELES" bg="#101728" fg="#f5f7fa" size={76} />
      </group>
      {/* solicitor with the charity box + a passer-by who donates */}
      <Person p={[6.4, 0, 1.8]} h={2.5} look={solicitorLook} f={f} pose={{ mood: "smile", arms: "box", lookX: 0.5 }} />
      <group position={[6.4, 0, 2.6]}>
        <Box p={[0, 1.05, 0]} s={[0.85, 0.62, 0.5]} color="#e8eef8" line={2} />
        <Sign p={[0, 1.06, 0.28]} s={[0.8, 0.5]} text="CJF" bg="#e8eef8" fg="#5e1420" size={110} frame="#e8eef8" />
      </group>
      {(() => {
        const wk = clamp((Math.sin(t * 0.55) + 1) / 2);
        const px = lerp(9.8, 7.6, wk);
        return <Person p={[px, 0, 2.9]} h={2.5} look={passerLook} f={f}
          pose={{ mood: "smile", arms: wk > 0.85 ? "point" : "down", walk: wk > 0.05 && wk < 0.95 ? wk * WALK * 2 : 0, speed: wk > 0.05 && wk < 0.95 ? 0.7 : 0, lookX: -0.6 }} />;
      })()}
      {/* foundation junction box (centre) */}
      <group position={[0.5, 0, -1.6]}>
        <Box p={[0, 1.5, 0]} s={[3.6, 3, 0.7]} color="#1d2a4a" line={3} />
        <Sign p={[0, 2.45, 0.42]} s={[3.3, 0.8]} text="CHILDREN'S JOY" bg="#101728" fg="#8ae8ff" size={64} />
        <Sign p={[0, 1.62, 0.42]} s={[3.3, 0.62]} text="FOUNDATION" bg="#101728" fg="#8ae8ff" size={64} />
        <Sign p={[0, 0.62, 0.42]} s={[3.3, 0.72]} text="yayasan amal — kata jaksa: PALSU" bg="#5e1420" fg="#ffd36a" size={46} />
      </group>
      {/* split destinations: operations pipe (down-left, back to Davao) + lifestyle houses (right) */}
      {[3.9, 6.1, 8.3].map((x, i) => (
        <group key={i} position={[x, 0, -4.6]}>
          <Box p={[0, 0.95, 0]} s={[2.1, 1.9, 1.9]} color="#4a3a5e" line={2} />
          <Box p={[0, 2.1, 0]} s={[2.5, 0.45, 2.2]} color="#241a33" line={2} />
          <Box p={[0, 0.95, 0.98]} s={[0.6, 0.85, 0.05]} color="#ffd36a" line={1} />
        </group>
      ))}
      <Sign p={[6.1, 4.35, -4.6]} s={[5.8, 0.72]} text="GAYA HIDUP: CALABASAS - LAS VEGAS - HAWAII" bg="#101728" fg="#ff9db0" size={44} />
      <Sign p={[-4.9, 3.95, -4.4]} s={[5.2, 0.72]} text="OPERASIONAL GEREJA" bg="#101728" fg="#8ae8ff" size={52} />
      {/* packets: step 1 — members fly Davao -> LA */}
      {step >= 1 ? [0, 1, 2].map((i) => {
        const lt = ((t - at("s4b05")) * 0.16 + i / 3) % 1;
        return <Packet key={"m" + i} p={arcPos([-8.4, 2.6, -1], [7.6, 3.2, -1], 3.4, lt)} s={0.9} color="#8ae8ff" />;
      }) : null}
      {/* packets: step 2/3 — street donations into the foundation box */}
      {step >= 2 ? [0, 1, 2, 3].map((i) => {
        const lt = ((t - at("s4b07")) * 0.3 + i / 4) % 1;
        return <Packet key={"d" + i} p={arcPos([6.4, 1.5, 2.4], [0.5, 2.2, -1.2], 1.1, lt)} s={0.85} />;
      }) : null}
      {/* packets: step 3 — the split */}
      {step >= 3 ? [0, 1].map((i) => {
        const lt = ((t - at("s4b10")) * 0.24 + i / 2) % 1;
        return <Packet key={"o" + i} p={arcPos([0.5, 2, -1.6], [-7, 2.4, -2.5], 1.8, lt)} s={0.9} />;
      }) : null}
      {step >= 3 ? [0, 1].map((i) => {
        const lt = ((t - at("s4b10")) * 0.24 + 0.5 + i / 2) % 1;
        return <Packet key={"l" + i} p={arcPos([0.5, 2, -1.6], [6.1, 2.2, -4.2], 1.5, lt)} s={0.9} color="#ff9db0" />;
      }) : null}
      {/* step 4 — rings + student visa board near the solicitor */}
      {step >= 4 ? (
        <group>
          <Board p={[8.4, 3.9, 1.6]} w={3.2} h={2} px={[640, 380]} draw={(c, W, H) => {
            c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
            txt(c, "PERNIKAHAN PURA-PURA", W / 2, H * 0.28, 40, "#ffd36a");
            c.strokeStyle = "#ffd36a"; c.lineWidth = 9;
            c.beginPath(); c.arc(W / 2 - 34, H * 0.62, 30, 0, 7); c.stroke();
            c.beginPath(); c.arc(W / 2 + 34, H * 0.62, 30, 0, 7); c.stroke();
            txt(c, "atau VISA PELAJAR PALSU", W / 2, H * 0.88, 34, "#f5f7fa", "center", 700);
          }} />
        </group>
      ) : null}
      {/* step 5 — suitcase of cash flies back to Davao */}
      {step >= 5 ? [0, 1].map((i) => {
        const lt = ((t - at("s4b17")) * 0.13 + i / 2) % 1;
        const p = arcPos([7.6, 3.4, -1], [-8.4, 3, -1], 4.2, lt);
        return (
          <group key={"c" + i} position={p}>
            <Box p={[0, 0, 0]} s={[0.95, 0.62, 0.3]} color="#7a4a2a" line={2} />
            <Box p={[0, 0.36, 0]} s={[0.4, 0.12, 0.1]} color="#39424e" line={1} />
          </group>
        );
      }) : null}
      {/* step chips across the top */}
      <Board p={[0, 6.15, -3]} w={12.4} h={1.05} px={[1600, 124]} draw={(c, W, H) => {
        c.fillStyle = "rgba(6,9,18,0.85)"; c.fillRect(0, 0, W, H);
        chipLabels.forEach((label, i) => {
          const x = (i + 0.5) * (W / 5);
          const on = step >= i + 1;
          c.fillStyle = on ? "#e5233a" : "#232842";
          rr(c, x - W * 0.093, H * 0.14, W * 0.186, H * 0.72, 14); c.fill();
          txt(c, label, x, H / 2, 30, on ? "#ffffff" : "#5a6a8a");
        });
      }} />
      {/* indictment tag */}
      <Sign p={[-7.6, 5.5, -3]} s={[4.4, 0.8]} text="MENURUT DAKWAAN JAKSA AS — 42 PASAL" bg="#5e1420" fg="#ffd36a" size={40} />
    </Stage>
  );
};

/* ================= SCENE Q5 — SENATE (S5) =================
   A hearing room. The senator presides; witnesses testify from behind (never
   identified); the accused's chair stays EMPTY while a subpoena paper slides
   toward it and stops; the contempt stamp slams; two charge cards land. */
const SceneSenate: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(5).start, s1 = SEC(5).end;
  return (
    <Stage bg="#141a2c">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 2.9, 9.6], look: [0, 1.6, -2], fov: 56 },
        { t: s0 + 15, pos: [-1, 2.5, 8.2], look: [-0.5, 1.6, -2], fov: 53 },
        { t: s1, pos: [0, 2.8, 9.2], look: [0, 1.6, -2], fov: 55 },
      ]} />
      <Lights warm="#f2e6cf" />
      <Floor kind="wood" a="#4a3421" b="#3d2b1a" w={40} d={30} unit={2.4} />
      <WallDoor z={-7.5} W={40} kind="panel" a="#5e4630" b="#4d3826" base="#241708" />
      {/* dais + senator */}
      <Box p={[0, 0.5, -4.6]} s={[11, 1, 3.4]} color="#4a3421" line={3} />
      <Desk p={[0, 0, -3.4]} w={9.5} top="#6b4a2a" leg="#3d2b1a" />
      <Person p={[0, 1, -4.4]} h={2.6} look={senatorLook} f={f}
        pose={{ mood: "deadpan", arms: t > at("s5b06") ? "point" : "down", lookX: 0.1 }} />
      <Sign p={[0, 4.6, -6.4]} s={[8.6, 0.95]} text="DENGAR PENDAPAT SENAT — RESOLUSI 884" bg="#101728" fg="#f5f7fa" size={52} />
      {/* witness table: witnesses from BEHIND, faces never shown */}
      <Desk p={[-3.4, 0, 0.8]} w={5.4} top="#5e4630" leg="#33241a" />
      <Person p={[-4.6, 0, 1.9]} h={2.4} look={witnessLook} f={f} pose={{ mood: "worry", arms: "down", nerv: 0.4, lookX: 0 }} />
      <Person p={[-2.4, 0, 1.9]} h={2.4} look={witness2Look} f={f} pose={{ mood: "worry", arms: "down", nerv: 0.55, lookX: 0 }} />
      {/* privacy screen: witnesses are NEVER shown face-on / identified */}
      <Box p={[-3.5, 1.95, 2.75]} s={[4.8, 1.6, 0.14]} color="#141e33" line={2} />
      <Sign p={[-3.5, 2.62, 2.84]} s={[4.6, 0.55]} text="SAKSI — IDENTITAS DILINDUNGI" bg="#101728" fg="#8ae8ff" size={44} />
      {/* the empty chair + nameplate */}
      <Chair p={[3.6, 0, 1.6]} rotY={Math.PI} color="#232842" />
      <Sign p={[3.6, 0.72, 2.8]} s={[2.6, 0.55]} text="A. QUIBOLOY" bg="#101728" fg="#ffd36a" size={64} />
      {/* subpoena paper slides toward the empty chair, then stops */}
      {(() => {
        const k = seg(t, at("s5b08"), at("s5b08") + 2.2, Easing.out(Easing.cubic));
        const px = lerp(0.6, 3.3, k), py = 1.75 - k * 0.35;
        return (
          <group position={[px, py, 0.6]} rotation={[-0.5, 0, 0]}>
            <Box p={[0, 0, 0]} s={[0.85, 1.15, 0.03]} color="#e8eef8" line={2} />
            <Sign p={[0, 0.3, 0.03]} s={[0.7, 0.3]} text="SUBPOENA" bg="#e8eef8" fg="#5e1420" size={52} frame="#e8eef8" />
          </group>
        );
      })()}
      {/* contempt stamp */}
      {t >= at("s5b12") ? (() => {
        const k = seg(t, at("s5b12"), at("s5b12") + 0.3, Easing.out(Easing.back(2.4)));
        return (
          <Board p={[7.6, 3.4, -1]} w={4.6} h={2.2} px={[760, 360]} draw={(c, W, H) => {
            c.fillStyle = "#101728"; c.fillRect(0, 0, W, H);
            c.save(); c.translate(W / 2, H / 2); c.scale(k, k); c.rotate(-0.06);
            c.strokeStyle = "#e5233a"; c.lineWidth = 12; c.strokeRect(-W * 0.42, -H * 0.34, W * 0.84, H * 0.68);
            txt(c, "PENGHINAAN SENAT", 0, -H * 0.1, 52, "#e5233a");
            txt(c, "PERINTAH PENANGKAPAN — 19 MAR 2024", 0, H * 0.18, 30, "#f5f7fa", "center", 700);
            c.restore();
          }} />
        );
      })() : null}
      {/* the two Philippine charge cards */}
      {t >= at("s5b13") ? [0, 1].map((i) => {
        const k = seg(t, at("s5b13") + i * 1.4, at("s5b13") + i * 1.4 + 0.5, Easing.out(Easing.cubic));
        return (
          <Board key={i} p={[-8.3 + i * 0.15, 3.9 - i * 0.1, -1.5]} w={4.4} h={2.1} px={[720, 340]} draw={(c, W, H) => {
            c.fillStyle = "#101728"; c.fillRect(0, 0, W, H);
            c.save(); c.translate(W / 2, H / 2); c.scale(k, k);
            if (i === 0) {
              txt(c, "DEPARTEMEN KEHAKIMAN", 0, -H * 0.26, 34, "#8ae8ff", "center", 700);
              txt(c, "PERLINDUNGAN ANAK", 0, H * 0.04, 46, "#ffd36a");
              txt(c, "RA 7610 — Maret 2024", 0, H * 0.3, 32, "#f5f7fa", "center", 700);
            } else {
              txt(c, "DEPARTEMEN KEHAKIMAN", 0, -H * 0.26, 34, "#8ae8ff", "center", 700);
              txt(c, "PERDAGANGAN ORANG", 0, H * 0.04, 46, "#ffd36a");
              txt(c, "RA 9208 — kualifikasi berat", 0, H * 0.3, 32, "#f5f7fa", "center", 700);
            }
            c.restore();
          }} />
        );
      }) : null}
    </Stage>
  );
};

/* ================= SCENE Q6 — MANHUNT (S6) =================
   Top-down plan of the compound on a giant board; a 16-day timeline strip fills;
   the police ring tightens; a cutaway under the college block shows sonar rings
   converging on a hidden room; the 24-hour ultimatum clock runs down; the gate
   opens and the pastor walks out between officers; a plane arc to Manila. */
const SceneManhunt: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(6).start, s1 = SEC(6).end;
  const dayK = seg(t, at("s6b03"), at("s6b14"));
  const day = 1 + Math.floor(dayK * 15.99);
  const ultK = seg(t, at("s6b14"), at("s6b15"));
  const ultH = Math.max(0, Math.round(24 * (1 - ultK)));
  return (
    <Stage bg="#0a0e1e">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 9, 16], look: [0, 1, -1], fov: 55 },
        { t: s0 + 18, pos: [0, 7.2, 14], look: [0, 1.1, -1], fov: 52 },
        { t: s1, pos: [-1, 5.6, 12.5], look: [-0.5, 1.2, -1.5], fov: 50 },
      ]} />
      <DimLights a={0.55} d={0.5} />
      <Stars p={[0, 9, -34]} s={[110, 30]} t={t} top="#04060f" bottom="#0d1730" />
      <Floor kind="tile" a="#131a2e" b="#0f1527" w={46} d={34} unit={2.6} />
      <group position={[0, 0, -3.5]}>
        <Compound night litK={0.85} />
      </group>
      {/* police ring, tightening as the days pass */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const shrink = 1 - dayK * 0.14;
        const px = Math.sin(a) * 15.5 * shrink, pz = Math.cos(a) * 10.5 * shrink - 4.0;
        if (pz > 3.2 && Math.abs(px) < 3.2) return null;
        return <Person key={i} p={[px, 0, pz]} h={2.4} look={i % 2 ? policeLook : police2Look} f={f}
          pose={{ mood: "deadpan", arms: "down", lookX: -Math.sin(a) * 0.6 }} />;
      })}
      {/* members' human barrier at the gate */}
      {[-3.4, -2.2, -1.1, 0, 1.1, 2.2, 3.4].map((x, i) => (
        <Person key={i} p={[x, 0, 3.6]} h={2.35} look={[memberLook, member2Look, member3Look, memberLook, member2Look, member3Look, memberLook][i]} f={f}
          pose={{ mood: "worry", arms: "hold", lookX: 0 }} />
      ))}
      {/* underground cutaway: sonar rings converge on the hidden room */}
      {t >= at("s6b10") ? (
        <group position={[-8.6, 0, -1.3]}>
          <Box p={[0, -0.55, 2.6]} s={[5.4, 0.12, 1.6]} color="#0a0e1e" line={0} />
          <Box p={[0, -1.5, 3.1]} s={[2.2, 1.7, 1.2]} color="#3a2c1c" line={2} />
          <Glow p={[0, -1.4, 3.8]} r={0.5} color="#ff5040" o={0.8} />
          {[0, 1, 2].map((i) => {
            const ph = ((t * 0.7 + i / 3) % 1);
            return <Glow key={i} p={[0, -1.4, 3.85]} r={0.3 + ph * 1.6} color="#ff5040" o={0.55 * (1 - ph)} />;
          })}
          <Sign p={[0.9, 0.35, 3.6]} s={[3.6, 0.55]} text="DETEKSI DETAK JANTUNG — kata polisi" bg="#101728" fg="#ff9db0" size={36} />
        </group>
      ) : null}
      {/* timeline board: day counter + ultimatum */}
      <Board p={[7.9, 4.7, -2]} w={5.8} h={3.1} px={[820, 440]} draw={(c, W, H) => {
        c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
        if (t < at("s6b14")) {
          txt(c, "PERBURUAN — AGU/SEP 2024", W / 2, H * 0.16, 32, "#8ae8ff", "center", 700);
          txt(c, "HARI " + day + " / 16", W / 2, H * 0.44, 76, "#ffd36a");
          c.fillStyle = "#232842"; rr(c, W * 0.1, H * 0.62, W * 0.8, 26, 13); c.fill();
          c.fillStyle = "#e5233a"; rr(c, W * 0.1, H * 0.62, W * 0.8 * dayK, 26, 13); c.fill();
          txt(c, "lebih dari 2.000 personel dikerahkan", W / 2, H * 0.85, 30, "#f5f7fa", "center", 700);
        } else {
          txt(c, "ULTIMATUM POLISI", W / 2, H * 0.2, 38, "#8ae8ff", "center", 700);
          txt(c, ultH + " JAM", W / 2, H * 0.55, 96, ultH <= 6 ? "#ff5040" : "#ffd36a");
          txt(c, "menyerah — atau digerebek", W / 2, H * 0.85, 32, "#f5f7fa", "center", 700);
        }
      }} />
      {/* the surrender: gate opens, pastor walks out between two officers */}
      {t >= at("s6b15") ? (() => {
        const wk = seg(t, at("s6b15"), at("s6b15") + 4.5);
        const z = lerp(2.1, 5.1, wk);
        return (
          <group>
            <Person p={[0, 0, z]} h={2.6} look={pastorLook} f={f}
              pose={{ mood: "deadpan", arms: "down", walk: wk < 1 ? wk * WALK * 3 : 0, speed: wk < 1 ? 0.55 : 0, lookX: 0 }} />
            <Person p={[-1.5, 0, z + 0.2]} h={2.55} look={policeLook} f={f}
              pose={{ mood: "deadpan", arms: "down", walk: wk < 1 ? wk * WALK * 3 : 0, speed: wk < 1 ? 0.55 : 0, lookX: 0.3 }} />
            <Person p={[1.5, 0, z + 0.2]} h={2.55} look={police2Look} f={f}
              pose={{ mood: "deadpan", arms: "down", walk: wk < 1 ? wk * WALK * 3 : 0, speed: wk < 1 ? 0.55 : 0, lookX: -0.3 }} />
          </group>
        );
      })() : null}
      {/* plea board after the flight to Manila */}
      {t >= at("s6b18") ? (
        <Board p={[-8, 4.5, -2]} w={5.4} h={2.4} px={[800, 356]} draw={(c, W, H) => {
          c.fillStyle = "#101728"; c.fillRect(0, 0, W, H);
          txt(c, "13 SEP 2024 — PASIG & QUEZON CITY", W / 2, H * 0.24, 30, "#8ae8ff", "center", 700);
          txt(c, "PLEDOI: TIDAK BERSALAH", W / 2, H * 0.56, 52, "#ffd36a");
          txt(c, "pesannya ke jemaat: \"Tatag lang\" — tetap kuat", W / 2, H * 0.82, 30, "#f5f7fa", "center", 700);
        }} />
      ) : null}
    </Stage>
  );
};

/* ================= SCENE Q7 — THREE COURT FRONTS (S7) =================
   Three courthouses side by side; each status board updates as its front is
   narrated; the extradition paper packet travels from Makati up to a US
   courthouse; BURON stamps land on the two associates' cards. */
const Court: React.FC<{ x: number; label: string; sub: string; status: string; statusColor: string; on: boolean }> =
  ({ x, label, sub, status, statusColor, on }) => (
    <group position={[x, 0, -2.5]}>
      <Box p={[0, 0.3, 0]} s={[4.6, 0.6, 2.6]} color="#39424e" line={2} />
      {[-1.7, -0.57, 0.57, 1.7].map((cx, i) => (
        <Cyl key={i} p={[cx, 2.1, 0.6]} rt={0.26} rb={0.26} h={3} color={on ? "#cfd6e4" : "#5a6a8a"} line={2} />
      ))}
      <Box p={[0, 3.85, 0]} s={[4.9, 0.55, 2.6]} color={on ? "#7a4a2a" : "#3a3444"} line={2} />
      <Box p={[0, 4.45, 0]} s={[3.4, 0.65, 2]} color={on ? "#7a4a2a" : "#3a3444"} line={2} />
      <Sign p={[0, 5.35, 0]} s={[4.4, 0.8]} text={label} bg="#101728" fg={on ? "#ffd36a" : "#5a6a8a"} size={64} />
      <Board p={[0, 1.85, 1.45]} w={4.2} h={1.5} px={[760, 270]} draw={(c, W, H) => {
        c.fillStyle = "#0d1526"; c.fillRect(0, 0, W, H);
        txt(c, sub, W / 2, H * 0.3, 34, "#8ae8ff", "center", 700);
        txt(c, status, W / 2, H * 0.68, 40, statusColor);
      }} />
    </group>
  );
const SceneCourts: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(7).start, s1 = SEC(7).end;
  return (
    <Stage bg="#10182c">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 3.6, 13.5], look: [0, 2, -2], fov: 56 },
        { t: s0 + 16, pos: [-0.5, 3, 11.5], look: [0, 2.1, -2], fov: 53 },
        { t: s1, pos: [0, 3.4, 12.5], look: [0, 2, -2], fov: 55 },
      ]} />
      <Lights warm="#e8eef8" />
      <Floor kind="tile" a="#232f4d" b="#1d2942" w={44} d={30} unit={2.6} />
      <Court x={-8.6} label="PASIG" sub="Perdagangan orang kualifikasi"
        status={t >= at("s7b04") ? "BUKTI JAKSA: SELESAI" : "SIDANG BERJALAN"}
        statusColor="#ffd36a" on={t >= at("s7b02") && t < at("s7b05")} />
      <Court x={0} label="QUEZON CITY" sub="Perlindungan anak — RA 7610"
        status={t >= at("s7b05") ? "JAKSA MASIH MENAMPILKAN BUKTI" : "SIDANG BERJALAN"}
        statusColor="#ffd36a" on={t >= at("s7b05") && t < at("s7b07")} />
      <Court x={8.6} label="MAKATI" sub="Ekstradisi ke Amerika Serikat"
        status={t >= at("s7b10") ? "SURAT PERINTAH PENANGKAPAN" : "PETISI DOJ — 9 NOV 2026"}
        statusColor={t >= at("s7b10") ? "#ff5040" : "#ffd36a"} on={t >= at("s7b07")} />
      {/* the pastor, detained, centre-front with two guards */}
      <Person p={[0, 0, 3.4]} h={2.6} look={pastorLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0 }} />
      <Person p={[-1.6, 0, 3.6]} h={2.55} look={policeLook} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.3 }} />
      <Person p={[1.6, 0, 3.6]} h={2.55} look={police2Look} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
      {/* extradition paper travels Makati -> US courthouse miniature */}
      {t >= at("s7b08") ? (() => {
        const lt = ((t - at("s7b08")) * 0.22) % 1;
        const p = arcPos([8.6, 5.2, -2], [11.7, 5.8, -4], 1.6, lt);
        return (
          <group position={p} rotation={[0, 0, Math.sin(lt * Math.PI) * 0.3]}>
            <Box p={[0, 0, 0]} s={[0.8, 1.1, 0.03]} color="#e8eef8" line={2} />
            <Sign p={[0, 0.28, 0.03]} s={[0.66, 0.28]} text="EKSTRADISI" bg="#e8eef8" fg="#5e1420" size={44} frame="#e8eef8" />
          </group>
        );
      })() : null}
      <group position={[11.7, 0, -4.5]}>
        <Box p={[0, 1.5, 0]} s={[2.6, 3, 1.8]} color="#2c3a5c" line={2} />
        <Sign p={[0, 3.6, 0]} s={[2.8, 0.66]} text="LOS ANGELES" bg="#101728" fg="#8ae8ff" size={52} />
      </group>
      {/* BURON cards for the two associates */}
      {t >= at("s7b11") ? ["TERESITA DANDAN", "HELEN PANILAG"].map((name, i) => {
        const k = seg(t, at("s7b11") + i * 1.2, at("s7b11") + i * 1.2 + 0.4, Easing.out(Easing.back(1.8)));
        return (
          <Board key={name} p={[-9.4 + i * 5.2, 6.1, -3]} w={4.9} h={1.7} px={[820, 284]} draw={(c, W, H) => {
            c.fillStyle = "#101728"; c.fillRect(0, 0, W, H);
            txt(c, name, W / 2, H * 0.3, 42, "#f5f7fa");
            c.save(); c.translate(W / 2, H * 0.68); c.scale(k, k);
            txt(c, "BURON", 0, 0, 46, "#e5233a");
            c.restore();
          }} />
        );
      }) : null}
      {/* scales note: extradition is not a verdict */}
      {t >= at("s7b14") ? (
        <Sign p={[0, 6.6, -3]} s={[8.8, 0.85]} text="EKSTRADISI BUKAN VONIS BERSALAH" bg="#5e1420" fg="#ffd36a" size={52} />
      ) : null}
    </Stage>
  );
};

/* ================= SCENE Q8 — LESSONS (S8) =================
   A giant checklist board; each red flag ticks in as it is named; the final
   donor-check row lands at the bottom. The compound sits dimmed behind. */
const SceneLessons: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(8).start, s1 = SEC(8).end;
  const rows = [
    { at: "s8b04", label: "1. Pemimpin tak bisa dikritik, tak bisa diganti" },
    { at: "s8b06", label: "2. Ketaatan total dijadikan syarat keselamatan" },
    { at: "s8b08", label: "3. Uang mengalir ke atas, laporan tak pernah turun" },
    { at: "s8b10", label: "4. Kritik dari luar selalu disebut serangan politik" },
  ];
  return (
    <Stage bg="#0d1425">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 3.4, 12.5], look: [0, 2.2, -2], fov: 56 },
        { t: s1, pos: [0, 3.2, 11.5], look: [0, 2.3, -2], fov: 54 },
      ]} />
      <DimLights a={0.6} d={0.55} />
      <Floor kind="tile" a="#18223c" b="#141d33" w={44} d={30} unit={2.6} />
      <group position={[0, 0, -6]} scale={[0.8, 0.8, 0.8]}>
        <Compound night litK={0.35} />
      </group>
      <Board p={[0, 3.1, 0.5]} w={11.6} h={5.4} px={[1280, 596]} draw={(c, W, H) => {
        c.fillStyle = "rgba(10,15,28,0.96)"; c.fillRect(0, 0, W, H);
        txt(c, "MEMBACA POLANYA — TANDA BAHAYA", W / 2, H * 0.09, 44, "#ffd36a");
        rows.forEach((row, i) => {
          const y = H * (0.24 + i * 0.155);
          const on = t >= at(row.at);
          c.strokeStyle = on ? "#e5233a" : "#39424e"; c.lineWidth = 5;
          rr(c, W * 0.045, y - 30, 60, 60, 10); c.stroke();
          if (on) { c.strokeStyle = "#e5233a"; c.lineWidth = 11; c.beginPath(); c.moveTo(W * 0.045 + 12, y); c.lineTo(W * 0.045 + 27, y + 16); c.lineTo(W * 0.045 + 50, y - 18); c.stroke(); }
          txt(c, row.label, W * 0.1, y, 39, on ? "#f5f7fa" : "#5a6a8a", "left", 700);
        });
        const donor = t >= at("s8b12");
        c.fillStyle = donor ? "#12351f" : "#141c30"; rr(c, W * 0.045, H * 0.87 - 34, W * 0.91, 68, 12); c.fill();
        txt(c, "SEBELUM BERDONASI: cek laporan keuangan + tata kelola yayasannya", W / 2, H * 0.87, 36, donor ? "#7be495" : "#5a6a8a");
      }} />
      {/* a lone member figure turns and walks away from the compound */}
      {(() => {
        const wk = seg(t, at("s8b14"), s1);
        const px = lerp(-3.5, -7.5, wk), pz = lerp(2.8, 4.6, wk);
        return <Person p={[px, 0, pz]} h={2.4} look={member2Look} f={f}
          pose={{ mood: "deadpan", arms: "down", walk: wk > 0 && wk < 1 ? wk * WALK * 3 : 0, speed: wk > 0 && wk < 1 ? 0.6 : 0, lookX: -0.5 }} />;
      })()}
    </Stage>
  );
};

/* ================= SCENE Q9 — OUTRO (S9) =================
   Dusk over the compound; the windows go dark one by one; far away, a single
   small lit cell window remains; the end card lands. */
const SceneOutro: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const s0 = SEC(9).start, s1 = SEC(9).end;
  const litK = 1 - seg(t, at("s9b03"), at("s9b06")) * 0.95;
  return (
    <Stage bg="#0a0e1e">
      <Cam t={t} keys={[
        { t: s0, pos: [0, 5, 15], look: [0, 1.2, -1.5], fov: 55 },
        { t: s1, pos: [0, 4, 13.5], look: [0, 1.3, -1.5], fov: 53 },
      ]} />
      <DimLights a={0.5} d={0.45} />
      <Stars p={[0, 9, -34]} s={[110, 30]} t={t} top="#04060f" bottom="#0d1730" />
      <Floor kind="tile" a="#131a2e" b="#0f1527" w={44} d={34} unit={2.6} />
      <group position={[0, 0, -3.5]}>
        <Compound night litK={litK} />
      </group>
      {/* one lit cell window, far right */}
      <group position={[9.6, 0, 2]}>
        <Box p={[0, 1.4, 0]} s={[2.6, 2.8, 2.2]} color="#232842" line={2} />
        <Box p={[0, 1.7, 1.13]} s={[0.7, 0.9, 0.05]} color="#ffd36a" line={1} />
        <Box p={[0, 1.7, 1.16]} s={[0.08, 0.9, 0.03]} color="#101018" line={0} />
        <Box p={[0.24, 1.7, 1.16]} s={[0.08, 0.9, 0.03]} color="#101018" line={0} />
        <Box p={[-0.24, 1.7, 1.16]} s={[0.08, 0.9, 0.03]} color="#101018" line={0} />
      </group>
      {t >= at("s9b07") ? (
        <Board p={[0, 4.6, -2]} w={9.6} h={2.6} px={[1100, 300]} draw={(c, W, H) => {
          c.fillStyle = "rgba(10,15,28,0.97)"; c.fillRect(0, 0, W, H);
          txt(c, "BEDAH KASUS", W / 2, H * 0.32, 76, "#ffd36a");
          txt(c, "Kasus berjalan — kami ikuti sidangnya.", W / 2, H * 0.68, 38, "#f5f7fa", "center", 700);
        }} />
      ) : null}
    </Stage>
  );
};

/* ================= driver / captions / chips ================= */
const SCENES = [SceneHook, SceneReveal, SceneEmpire, SceneMoney, SceneSenate, SceneManhunt, SceneCourts, SceneLessons, SceneOutro];
const XF = 0.35;
const CaptionsID: React.FC = () => {
  const t = useT();
  const b = BEATS.find((x) => t >= x.start && t < x.end);
  if (!b) return null;
  const pop = 1 + 0.05 * Math.max(0, 1 - (t - b.start) * 6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ transform: `scale(${pop})`, background: "rgba(5,7,13,0.88)", color: "#fff", fontFamily: "Inter, Arial", fontWeight: 800, fontSize: 27, lineHeight: 1.25, padding: "10px 22px", borderRadius: 14, maxWidth: "86%", textAlign: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>
        {b.cap}
      </div>
    </div>
  );
};
const CHIPS: Record<number, string> = {
  1: "PENGEPUNGAN 16 HARI",
  2: "KERAJAAN DALAM ANGKA",
  3: "MEMBANGUN KERAJAAN",
  4: "MESIN UANG — MENURUT DAKWAAN",
  5: "SENAT MEMANGGIL",
  6: "PERBURUAN 16 HARI",
  7: "TIGA FRONT PENGADILAN",
  8: "MEMBACA POLANYA",
  9: "PENUTUP",
};
const StageChip: React.FC = () => {
  const t = useT();
  const s = SECTIONS.find((x) => t >= x.start && t < x.end);
  if (!s) return null;
  return (
    <div style={{ position: "absolute", top: 22, left: 24, background: "#e5233a", color: "#fff", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 19, letterSpacing: 1.5, padding: "7px 14px", borderRadius: 8, boxShadow: "0 3px 10px rgba(0,0,0,0.45)" }}>
      {CHIPS[s.n]}
    </div>
  );
};
export const BedahQFilm: React.FC = () => {
  const f = useCurrentFrame(); const t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      {SECTIONS.map((s, i) => {
        const Scene = SCENES[i];
        const from = Math.round((s.start - (i > 0 ? XF : 0)) * FPS);
        const dur = Math.round((s.end - s.start + (i > 0 ? XF : 0) + (i < SECTIONS.length - 1 ? XF : 0)) * FPS);
        const fadeIn = i > 0 ? Math.min(1, Math.max(0, (t - (s.start - XF)) / XF)) : 1;
        const fadeOut = i < SECTIONS.length - 1 ? Math.min(1, Math.max(0, (s.end + XF - t) / XF)) : 1;
        return (
          <Sequence key={s.n} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
              <Scene t={t} f={f} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <CaptionsID />
      <StageChip />
    </AbsoluteFill>
  );
};
/** One render part: the full film, offset so this part's window starts at frame 0. */
const Part: React.FC<{ start: number }> = ({ start }) => (
  <AbsoluteFill>
    <Sequence from={-Math.round(start * FPS)}>
      <BedahQFilm />
    </Sequence>
  </AbsoluteFill>
);
export const BedahQP1: React.FC = () => <Part start={0} />;
export const BedahQP2: React.FC = () => <Part start={PART2_START} />;
export const BedahQP3: React.FC = () => <Part start={PART3_START} />;
export const BedahQP4: React.FC = () => <Part start={PART4_START} />;
export const PART2_START = 151.3;
export const PART3_START = 250.4;
export const PART4_START = 396.6;
