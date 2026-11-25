// TDN v7 — "30 hostages, one supermarket: Colombia's 17-hour siege" — a failed armored-truck
// robbery in Cartagena turns into a 17-hour hostage siege at a supermarket; special forces
// storm the store before dawn and free all 30 hostages (1 captor killed, 4 captured).
// 9:16 720x1280 30fps, 1895 frames (63.07 s voiceover).
// CUTS = [0, 5.82, 15.72, 20.78, 29.43, 35.55, 43.20, 48.86, 57.19, 63.07].
// S1 supermarket morning + the racing clock / S2 the cash truck leaves, the crew is too late
// S3 inside: hostages on the aisle floor, papered windows / S4 the demand note + the cordon
// S5 ten walk free + the president at the command map / S6 1:30 a.m.: the storm
// S7 dawn: everyone walks out alive / S8 the walled old town + 10 years of peace
// S9 TDN sign-off desk (violet-gold).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Easing, Audio, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Box, Cyl, Ball, CanvasPlane, INK } from "../style/toon";
import { Look } from "../style/puppet";
import { Person, Lights, Desk, Clock, Grade, seg, lerp, clamp, V3 } from "../style/kit";
import { Floor, WallDoor, SideWall, Glow, Shaft, Plant, Lamp, Monitor, Chair, Rug, Dust, Shelf } from "../style/props";
import { Cam, Key, Globe } from "../style/extra";
import { Captions } from "../Main";

const FPS = 30, LEAD = 6, TAIL = 8, WALK = 3.4;
type Ctx = { t: number; f: number };
type Trans = "ghost" | "zoom" | "flash" | "whip";
// deterministic pseudo-random (no Math.random in render code)
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const analyst: Look = { skin: "#fbe3c8", body: "#ff8a1c", outfit: "hoodie", hair: "short", hairColor: "#1b1b2a", glasses: true, badge: "#2fd46a", shoe: "#1b1b2a" };
const crewLook: Look = { skin: "#e8c39a", body: "#14161f", outfit: "hoodie", hair: "short", hairColor: "#0d0d14", glasses: true, shoe: "#0d0d14" };
const officerLook: Look = { skin: "#f0c8a0", body: "#274b73", outfit: "shirt", hair: "short", hairColor: "#0d0d14", badge: "#ffd36a", shoe: "#101018" };
const soldierLook: Look = { skin: "#d9a878", body: "#4a5a2a", outfit: "shirt", hair: "short", hairColor: "#141a0d", shoe: "#1c2410" };
const presidentLook: Look = { skin: "#e8c39a", body: "#556b2f", outfit: "shirt", hair: "swept", hairColor: "#2a2a33", shoe: "#1c2410" };
const elderLook: Look = { skin: "#f6ddba", body: "#c98bb0", outfit: "shirt", hair: "grey", hairColor: "#d8dce2", shoe: "#4a3a44" };
const elder2Look: Look = { skin: "#eecfa8", body: "#7ab5c9", outfit: "shirt", hair: "grey", hairColor: "#cfd4dc", shoe: "#33424a" };
const hostageLooks: Look[] = [
  { skin: "#fbe3c8", body: "#3a9e6a", outfit: "shirt", hair: "bob", hairColor: "#3a2410", shoe: "#1b1b2a" },
  { skin: "#c98d5e", body: "#e5b43a", outfit: "shirt", hair: "short", hairColor: "#0d0d14", shoe: "#1b1b2a" },
  { skin: "#f0c8a0", body: "#7a54d6", outfit: "shirt", hair: "bob", hairColor: "#1b1b2a", shoe: "#2a1c33" },
  { skin: "#8a5a34", body: "#d94a4a", outfit: "shirt", hair: "short", hairColor: "#0d0d14", shoe: "#1b1b2a" },
  { skin: "#f6ddba", body: "#3a6fd8", outfit: "shirt", hair: "swept", hairColor: "#5a3a1a", shoe: "#1b1b2a" },
  { skin: "#d9a878", body: "#e0743a", outfit: "shirt", hair: "bob", hairColor: "#241408", shoe: "#1b1b2a" },
];
const sfLook: Look = { skin: "#e8c39a", body: "#171a24", outfit: "hoodie", hair: "short", hairColor: "#0d0d14", shoe: "#0d0d14" };

/* ---------- scene wrapper (same pattern as TdnV6) ---------- */
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

/* ---------- shared bits ---------- */
const Palm: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0.18, 1.7, 0]} rt={0.13} h={3.4} rot={[0, 0, 0.10]} color="#7a5a34" line={1} />
    {[0, 1, 2, 3, 4].map((i) => (
      <Ball key={i} p={[0.35 + Math.cos(i * 1.256) * 0.85, 3.55 + (i % 2) * 0.14, Math.sin(i * 1.256) * 0.85]} r={0.85} s={[1.5, 0.34, 1.5]} color="#2f9e6a" ink={0.04} />
    ))}
    <Ball p={[0.3, 3.2, 0]} r={0.22} color="#5a3a20" ink={0.05} />
  </group>
);

// The supermarket front, re-lit per scene. door: 0 shut .. 1 open. papered: windows covered.
const StoreFront: React.FC<{ t: number; sky: [string, string]; wall: string; signBg: string; papered?: boolean; door?: number; lit?: boolean; flashers?: boolean; f: number }> = ({ t, sky, wall, signBg, papered = false, door = 0, lit = false, flashers = false, f }) => (
  <>
    <CanvasPlane p={[0, 13, -30]} s={[80, 34]} px={[800, 340]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, sky[0]); g.addColorStop(1, sky[1]); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Floor kind="tile" a="#6a6f7a" b="#5f646e" unit={2} w={44} d={40} />
    {/* facade */}
    <Box p={[0, 3.1, -7]} s={[17, 6.2, 1.2]} color={wall} line={2} />
    <Box p={[0, 6.55, -7]} s={[17.8, 0.75, 1.7]} color="#e23b3b" line={2} />
    <CanvasPlane p={[0, 5.35, -6.36]} s={[8.6, 1.35]} px={[860, 135]} draw={(c, W, H) => { c.fillStyle = signBg; c.fillRect(0, 0, W, H); c.fillStyle = "#ffffff"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("SUPERMARKET", W / 2, H / 2 + 3); }} />
    {/* windows */}
    {[-5.6, 5.6].map((x, i) => (
      <CanvasPlane key={i} p={[x, 3.1, -6.36]} s={[4.4, 3.4]} px={[440, 340]} frame="#39424e" draw={(c, W, H) => {
        if (papered) {
          c.fillStyle = "#e8dfc8"; c.fillRect(0, 0, W, H);
          c.fillStyle = "rgba(120,100,70,.35)"; c.fillRect(0, H * 0.48, W, 7); c.fillRect(W * 0.49, 0, 7, H);
          c.strokeStyle = "rgba(90,80,60,.5)"; c.lineWidth = 10;
          c.beginPath(); c.moveTo(18, 18); c.lineTo(90, 90); c.moveTo(90, 18); c.lineTo(18, 90); c.stroke();
          c.beginPath(); c.moveTo(W - 108, H - 108); c.lineTo(W - 18, H - 18); c.moveTo(W - 18, H - 108); c.lineTo(W - 108, H - 18); c.stroke();
        } else if (lit) {
          const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#ffd98a"); g.addColorStop(1, "#e8a34a"); c.fillStyle = g; c.fillRect(0, 0, W, H);
          c.fillStyle = "rgba(90,50,10,.55)"; c.fillRect(W * 0.48, 0, 9, H); c.fillRect(0, H * 0.5, W, 9);
        } else {
          const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#bfe4f2"); g.addColorStop(1, "#5f9ec4"); c.fillStyle = g; c.fillRect(0, 0, W, H);
          c.fillStyle = "rgba(255,255,255,.5)"; c.beginPath(); c.moveTo(W * 0.12, H); c.lineTo(W * 0.45, 0); c.lineTo(W * 0.62, 0); c.lineTo(W * 0.29, H); c.fill();
          c.fillStyle = "#39424e"; c.fillRect(W * 0.48, 0, 9, H);
        }
      }} />
    ))}
    {/* the door: frame + a leaf that swings open */}
    <Box p={[0, 2.05, -6.55]} s={[2.9, 4.1, 0.35]} color="#10131c" line={1} />
    {door > 0.02 ? <Box p={[0, 2.05, -6.72]} s={[2.6, 3.9, 0.1]} color="#ffca7a" line={0} /> : null}
    <group position={[-1.3, 0, -6.35]} rotation={[0, -door * 1.9, 0]}>
      <Box p={[1.3, 2.05, 0]} s={[2.6, 4.0, 0.16]} color={lit ? "#7a4a20" : "#2c5a74"} line={2} />
      <Ball p={[2.25, 2.05, 0.16]} r={0.11} color="#ffd36a" ink={0.05} />
    </group>
    <Box p={[0, 4.35, -6.3]} s={[3.4, 0.3, 0.5]} color="#e5b43a" line={1} />
    {flashers ? <>
      <Ball p={[-8.2, 5.6, -6.2]} r={0.30} color={(f >> 2) % 2 ? "#ff2a3a" : "#4a0d12"} ink={0} />
      <Ball p={[8.2, 5.6, -6.2]} r={0.30} color={(f >> 2) % 2 ? "#12264a" : "#2f7bff"} ink={0} />
    </> : null}
  </>
);

/* =================== S1 0 – 5.82  the hook — a normal shopping morning, a clock that races 17 hours =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 3.3, 14.8], look: [0, 3.2, -4], fov: 60 },
  { t: 5.82, pos: [0, 3.1, 13.0], look: [0, 3.3, -4], fov: 58 },
];
const StoreClock: React.FC<{ t: number }> = ({ t }) => (
  <CanvasPlane p={[0, 8.6, -6.9]} s={[3.3, 3.3]} px={[396, 396]} draw={(c, W, H) => {
    // face mood: day cream -> night navy (during the 17-hour race) -> dawn gold
    const race = seg(t, 2.98, 4.9);
    const bgc = race <= 0 ? "#f6f1e6" : race >= 1 ? "#ffe9b8" : race < 0.5 ? "#3a4470" : "#8a6a8f";
    c.fillStyle = "#2b3350"; c.beginPath(); c.arc(W / 2, H / 2, W * 0.49, 0, 7); c.fill();
    c.fillStyle = bgc; c.beginPath(); c.arc(W / 2, H / 2, W * 0.435, 0, 7); c.fill();
    c.fillStyle = race > 0 && race < 1 ? "#ffd36a" : "#2b3350";
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.beginPath(); c.arc(W / 2 + Math.sin(a) * W * 0.375, H / 2 - Math.cos(a) * H * 0.375, i % 3 ? 6 : 11, 0, 7); c.fill(); }
    // start 8:00; during the race the hands sweep 17 hours; end at 1:00
    const hrs = 8 + 17 * seg(t, 2.98, 4.9, Easing.inOut(Easing.cubic));
    const ha = ((hrs % 12) / 12) * Math.PI * 2, ma = (hrs % 1) * Math.PI * 2;
    c.strokeStyle = race > 0 && race < 1 ? "#f6f1e6" : "#1b1b2a"; c.lineCap = "round";
    c.lineWidth = 17; c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(W / 2 + Math.sin(ha) * W * 0.24, H / 2 - Math.cos(ha) * H * 0.24); c.stroke();
    c.lineWidth = 11; c.beginPath(); c.moveTo(W / 2, H / 2); c.lineTo(W / 2 + Math.sin(ma) * W * 0.35, H / 2 - Math.cos(ma) * H * 0.35); c.stroke();
    c.fillStyle = "#e23b3b"; c.beginPath(); c.arc(W / 2, H / 2, 13, 0, 7); c.fill();
  }} />
);
const S1 = ({ t, f }: Ctx) => {
  const walkA = seg(t, 0.4, 3.4), walkB = seg(t, 1.1, 4.3);
  const ax = lerp(-9.5, -1.8, walkA), bx = lerp(10.5, 2.1, walkB);
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#ffd9ae" />
    <StoreFront t={t} f={f} sky={["#2f7fc4", "#a8d8f0"]} wall="#f2c14e" signBg="#1d6a4a" flashers={t > 4.87} />
    <Ball p={[-13, 10.5, -24]} r={2.1} color="#ffd94a" ink={0} />
    <StoreClock t={t} />
    <Palm p={[-10.6, 0, -4.6]} s={1.15} /><Palm p={[10.8, 0, -4.2]} s={1.0} />
    {/* shoppers streaming in with baskets */}
    <Person p={[ax, 0, -2.2]} sy={0} h={3.4} look={hostageLooks[0]} f={f} pose={{ mood: "smile", walk: walkA * 9 * WALK, speed: 0.8, arms: "hold", armK: 1, armR: [0.34, 0.48], armL: [-0.34, 0.48], lookX: 0.3 }} />
    <Box p={[ax, 1.42, -1.95]} s={[0.95, 0.55, 0.6]} color="#c9552e" line={2} />
    <Person p={[bx, 0, -2.6]} sy={0} h={3.45} look={hostageLooks[3]} f={f} pose={{ mood: "smile", walk: walkB * 8.4 * WALK, speed: 0.8, arms: "hold", armK: 1, armR: [0.34, 0.48], armL: [-0.34, 0.48], lookX: -0.3, flip: true }} />
    <Box p={[bx, 1.42, -2.35]} s={[0.95, 0.55, 0.6]} color="#2f7fc4" line={2} />
    {/* the analyst with his own basket — grin until "seventeen hours", then deadpan */}
    <Person p={[3.2, 0, -0.9]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: t > 2.98 ? "deadpan" : "grin", arms: "hold", armK: 1, armR: [0.36, 0.48], armL: [-0.36, 0.48], lookX: -0.2 }} />
    <Box p={[3.2, 1.42, -0.65]} s={[1.0, 0.58, 0.62]} color="#7a4a2a" line={2} />
    <Ball p={[3.0, 1.8, -0.65]} r={0.21} color="#e23b3b" ink={0.05} /><Ball p={[3.45, 1.83, -0.7]} r={0.19} color="#2f9e6a" ink={0.05} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,240,200,.9)" />
  </>);
};

/* =================== S2 5.82 – 15.72  the failed heist — the cash truck leaves without them =================== */
const K2: Key[] = [
  { t: 5.82, pos: [-2.6, 3.0, 14.8], look: [-2.0, 2.4, -3.5], fov: 62 },
  { t: 15.72, pos: [-1.2, 3.0, 13.8], look: [-1.4, 2.4, -3.5], fov: 60 },
];
const Truck: React.FC<{ x: number }> = ({ x }) => (
  <group position={[x, 0, -4.2]}>
    <Box p={[0, 1.75, 0]} s={[6.4, 3.1, 2.6]} color="#5a6673" line={2} />
    <Box p={[0, 3.42, 0]} s={[6.5, 0.25, 2.7]} color="#39424e" line={1} />
    <Box p={[3.85, 1.3, 0]} s={[1.5, 2.2, 2.4]} color="#6a7683" line={2} />
    <Box p={[4.15, 1.75, 0]} s={[0.5, 0.85, 2.0]} color="#bfe4f2" line={1} />
    <CanvasPlane p={[0, 1.95, 1.33]} s={[4.6, 1.3]} px={[690, 195]} draw={(c, W, H) => { c.fillStyle = "#39424e"; c.fillRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 74px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("ARMORED CASH", W / 2, H / 2 + 3); }} />
    {[-2.2, 2.0, 3.85].map((wx, i) => <Cyl key={i} p={[wx, 0.55, 1.25]} rt={0.55} h={0.3} rot={[Math.PI / 2, 0, 0]} color="#14161f" line={1} />)}
    <Ball p={[4.62, 0.95, 0.8]} r={0.13} color="#ffd94a" ink={0} /><Ball p={[4.62, 0.95, -0.8]} r={0.13} color="#ffd94a" ink={0} />
  </group>
);
const S2 = ({ t, f }: Ctx) => {
  // truck: rolls in 7.4-9.6, idles, then accelerates away 12.6-15.1 and is gone
  const tx = t < 7.4 ? -17 : t < 9.6 ? lerp(-17, -2.5, seg(t, 7.4, 9.6, Easing.out(Easing.cubic))) : t < 12.6 ? -2.5 : -2.5 + Math.pow(t - 12.6, 2) * 3.1;
  // crew: step out from behind the crates 7.8-8.6, then turn to the store at 14.3
  const crewOut = seg(t, 7.8, 8.6), turned = seg(t, 14.3, 14.9);
  return (<>
    <Cam t={t} keys={K2} />
    <Lights warm="#cfe0ee" />
    <CanvasPlane p={[0, 13, -30]} s={[80, 34]} px={[800, 340]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#4a6f9e"); g.addColorStop(1, "#b8cede"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
    <Floor kind="tile" a="#5c6068" b="#52565e" unit={2} w={46} d={40} />
    {/* the store's side wall + loading bay */}
    <Box p={[7.5, 3.0, -7.5]} s={[13, 6.0, 1.2]} color="#d9a83e" line={2} />
    <Box p={[3.2, 1.9, -6.8]} s={[4.6, 3.8, 0.4]} color="#39424e" line={2} />
    <CanvasPlane p={[7.5, 5.1, -6.85]} s={[6.4, 1.0]} px={[640, 100]} draw={(c, W, H) => { c.fillStyle = "#1d6a4a"; c.fillRect(0, 0, W, H); c.fillStyle = "#fff"; c.font = "900 58px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("LOADING BAY", W / 2, H / 2 + 2); }} />
    <Truck x={tx} />
    {/* crates the crew hides behind */}
    <Box p={[-8.3, 0.8, -2.0]} s={[1.9, 1.6, 1.9]} color="#8a6a34" line={2} />
    <Box p={[-8.1, 2.3, -2.1]} s={[1.6, 1.4, 1.6]} color="#9a783e" line={2} />
    <Box p={[-6.6, 0.65, -1.8]} s={[1.5, 1.3, 1.5]} color="#7a5c2c" line={2} />
    {/* the crew */}
    {[-1.1, 0, 1.1].map((off, i) => {
      const cx = lerp(-8.6, -5.9 + off * 1.15, crewOut), cz = -3.1 + Math.abs(off) * 0.3;
      return <Person key={i} p={[cx, 0, cz]} sy={0} h={3.45} look={crewLook} f={f} pose={{ mood: "angry", arms: i === 1 && t < 14.3 ? "point" : "down", armK: i === 1 ? seg(t, 8.1, 8.4) : 0, armR: [0.85, 0.6], lookX: lerp(0.75, -0.55, turned), flip: turned > 0.5 }} />;
    })}
    <Box p={[-4.6, 0.35, -2.2]} s={[0.9, 0.7, 0.55]} color="#23232e" line={2} />
    <CanvasPlane p={[-4.6, 0.42, -1.9]} s={[0.5, 0.5]} px={[100, 100]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = "#2fd46a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("$", W / 2, H / 2 + 4); }} />
    <Palm p={[11.8, 0, -3.4]} s={1.05} /><Plant p={[12.6, 0, -5.6]} s={1.2} />
    <Dust t={t} area={[8, 3, 5]} color="rgba(220,230,240,.9)" />
  </>);
};

/* =================== S3 15.72 – 20.78  inside — the whole store, taken =================== */
const K3: Key[] = [
  { t: 15.72, pos: [0, 3.5, 11.2], look: [0, 2.3, -4], fov: 60 },
  { t: 20.78, pos: [0, 3.3, 9.8], look: [0, 2.4, -4], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K3} />
  <Lights warm="#eaffea" />
  <Floor kind="tile" a="#cfd4c2" b="#c2c9b4" unit={2} w={36} d={36} />
  <WallDoor z={-8.5} W={36} kind="plain" a="#9db89a" b="#9db89a" base="#5f7a5c" />
  <SideWall x={-11} kind="plain" a="#93ae90" b="#93ae90" /><SideWall x={11} kind="plain" a="#93ae90" b="#93ae90" />
  {/* tall back windows, papered over */}
  {[-6.4, 0, 6.4].map((x, i) => (
    <CanvasPlane key={i} p={[x, 4.6, -8.35]} s={[4.6, 3.6]} px={[460, 360]} frame="#5f7a5c" draw={(c, W, H) => {
      c.fillStyle = "#e8dfc8"; c.fillRect(0, 0, W, H);
      c.fillStyle = "rgba(120,100,70,.35)"; c.fillRect(0, H * 0.49, W, 7); c.fillRect(W * 0.49, 0, 7, H);
      c.strokeStyle = "rgba(90,80,60,.5)"; c.lineWidth = 10;
      c.beginPath(); c.moveTo(16, 16); c.lineTo(84, 84); c.moveTo(84, 16); c.lineTo(16, 84); c.stroke();
      c.beginPath(); c.moveTo(W - 100, H - 100); c.lineTo(W - 16, H - 16); c.moveTo(W - 16, H - 100); c.lineTo(W - 100, H - 16); c.stroke();
    }} />
  ))}
  <Glow p={[-4, 7.6, -3]} r={4.5} color="rgba(220,255,220,1)" o={0.22} /><Glow p={[4, 7.6, -3]} r={4.5} color="rgba(220,255,220,1)" o={0.22} />
  {/* the aisle: two stocked shelves */}
  <Shelf p={[-4.1, 0, -4.6]} w={4.6} rows={3} seed={3} wood="#6a7a5e" />
  <Shelf p={[4.1, 0, -4.6]} w={4.6} rows={3} seed={8} wood="#6a7a5e" />
  <Rug p={[0, 0, -1.7]} s={[6.4, 3.4]} a="#a8b89a" b="#7a9a6a" />
  {/* the hostages, huddled on the floor */}
  {hostageLooks.map((lk, i) => {
    const hx = [-2.2, -1.1, 0.1, 1.3, 2.4, -0.5][i], hz = [-2.3, -1.5, -2.4, -1.6, -2.2, -0.9][i];
    return <Person key={i} p={[hx, 0, hz]} sy={0} h={2.95} look={lk} f={f} pose={{ mood: "worry", hunch: 0.5, sweat: i === 2 ? 0.8 : 0, arms: "down", lookX: (rnd(i + 31) - 0.5) * 0.8 }} />;
  })}
  {/* two of the crew stand guard at the aisle ends */}
  <Person p={[-4.3, 0, -0.9]} sy={0} h={3.5} look={crewLook} f={f} pose={{ mood: "angry", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: 0.55 }} />
  <Person p={[4.3, 0, -0.9]} sy={0} h={3.5} look={crewLook} f={f} pose={{ mood: "angry", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: -0.55 }} />
  {/* a tipped shopping cart */}
  <group position={[3.1, 0.35, 0.6]} rotation={[0, 0.5, 1.35]}>
    <Box p={[0, 0, 0]} s={[1.5, 0.9, 0.9]} color="#8a93a6" line={2} />
  </group>
  <Dust t={t} area={[7, 4, 5]} color="rgba(230,255,230,.9)" />
</>);

/* =================== S4 20.78 – 29.43  the demand, and the ring of steel =================== */
const K4: Key[] = [
  { t: 20.78, pos: [0, 3.2, 10.2], look: [0, 3.3, -5], fov: 60 },
  { t: 29.43, pos: [0, 3.6, 14.0], look: [0, 2.9, -4], fov: 62 },
];
const PoliceCar: React.FC<{ p: V3; rotY?: number; f: number }> = ({ p, rotY = 0, f }) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <Box p={[0, 0.85, 0]} s={[3.9, 1.1, 1.9]} color="#f2f0ea" line={2} />
    <Box p={[-0.2, 1.65, 0]} s={[2.0, 0.75, 1.7]} color="#274b73" line={2} />
    <Box p={[0, 0.95, 0.97]} s={[3.9, 0.5, 0.04]} color="#274b73" line={0} />
    <CanvasPlane p={[0, 0.88, 0.99]} s={[2.2, 0.55]} px={[440, 110]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = "#ffd36a"; c.font = "900 72px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("POLICE", W / 2, H / 2 + 2); }} />
    <Box p={[-0.2, 2.14, 0]} s={[1.1, 0.2, 0.5]} color="#10131c" line={1} />
    <Ball p={[-0.48, 2.16, 0]} r={0.15} color={(f >> 2) % 2 ? "#ff2a3a" : "#4a0d12"} ink={0} />
    <Ball p={[0.1, 2.16, 0]} r={0.15} color={(f >> 2) % 2 ? "#12264a" : "#2f7bff"} ink={0} />
    {[-1.35, 1.35].map((wx, i) => <Cyl key={i} p={[wx, 0.42, 0.9]} rt={0.42} h={0.24} rot={[Math.PI / 2, 0, 0]} color="#14161f" line={1} />)}
    {[-1.35, 1.35].map((wx, i) => <Cyl key={i} p={[wx, 0.42, -0.9]} rt={0.42} h={0.24} rot={[Math.PI / 2, 0, 0]} color="#14161f" line={1} />)}
  </group>
);
const DemandNote: React.FC<{ t: number }> = ({ t }) => {
  if (t < 21.35) return null;
  const k = seg(t, 21.35, 21.6, Easing.in(Easing.cubic));
  return (
    <group position={[0, 3.6, -5.9]} scale={[lerp(2.4, 1, k), lerp(2.4, 1, k), 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[5.6, 3.6]} px={[840, 540]} frame="#5a3a20" draw={(c, W, H) => {
        c.fillStyle = "#f6f1e6"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#c22333"; c.font = "900 54px Inter, Arial"; c.textAlign = "center"; c.fillText("THE DEMAND", W / 2, 84);
        c.fillStyle = "#1b1b2a"; c.font = "900 118px Inter, Arial"; c.fillText("7 BILLION", W / 2, 218); c.fillText("PESOS", W / 2, 336);
        c.fillStyle = "#5a5a6a"; c.font = "800 46px Inter, Arial"; c.fillText("≈ 2 MILLION DOLLARS", W / 2, 424);
        c.fillStyle = "#c22333"; c.font = "900 50px Inter, Arial"; c.fillText("...AND A WAY OUT", W / 2, 492);
      }} />
    </group>
  );
};
const S4 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K4} impacts={[[21.6, 0.05]]} />
  <Lights warm="#ffb27a" />
  <StoreFront t={t} f={f} sky={["#3a2c5e", "#c65a4a"]} wall="#d9a83e" signBg="#173f30" papered />
  <DemandNote t={t} />
  {/* the cordon, revealed as the camera pulls back */}
  <PoliceCar p={[-4.3, 0, 2.7]} rotY={0.35} f={f} />
  <PoliceCar p={[4.4, 0, 2.8]} rotY={-0.3} f={f} />
  <Box p={[0, 1.05, 3.4]} s={[13.5, 0.16, 0.06]} color="#ffd94a" line={0} />
  {[-6.5, 6.5].map((x, i) => <Cyl key={i} p={[x, 0.5, 3.4]} rt={0.09} h={1.0} color="#8a93a6" line={1} />)}
  <Person p={[-2.7, 0, 2.3]} sy={0} h={3.45} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: 0.2 }} />
  <Person p={[2.9, 0, 2.5]} sy={0} h={3.45} look={soldierLook} f={f} pose={{ mood: "deadpan", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: -0.2 }} />
  <Person p={[-5.9, 0, 4.4]} sy={0} h={3.3} look={hostageLooks[4]} f={f} pose={{ mood: "worry", arms: "down", lookX: 0.5 }} />
  <Person p={[6.0, 0, 4.5]} sy={0} h={3.35} look={hostageLooks[1]} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.5 }} />
  <Lamp p={[-9.8, 0, -2.4]} h={3.4} color="#ffb27a" /><Lamp p={[9.8, 0, -2.4]} h={3.4} color="#ffb27a" />
  <Dust t={t} area={[8, 4, 5]} color="rgba(255,200,160,.9)" />
</>);

/* =================== S5 29.43 – 35.55  ten walk free; the president takes charge =================== */
const K5: Key[] = [
  { t: 29.43, pos: [-2.4, 3.1, 12.0], look: [-3.0, 2.8, -4], fov: 60 },
  { t: 32.6, pos: [-0.4, 3.1, 11.8], look: [0.4, 2.9, -4], fov: 59 },
  { t: 35.55, pos: [2.3, 3.1, 11.6], look: [3.4, 3.0, -4], fov: 58 },
];
const ReleasedBoard: React.FC<{ t: number }> = ({ t }) => {
  if (t < 30.1) return null;
  const k = seg(t, 30.1, 30.45, Easing.out(Easing.back(1.8)));
  return (
    <group position={[-3.0, 4.9, -6.2]} scale={[k, k, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[3.3, 1.5]} px={[660, 300]} frame="#10131c" draw={(c, W, H) => {
        c.fillStyle = "#10131c"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#8a93a6"; c.font = "800 52px Inter, Arial"; c.textAlign = "center"; c.fillText("RELEASED", W / 2, 92);
        c.fillStyle = "#2fd46a"; c.font = "900 150px Inter, Arial"; c.fillText("10", W / 2, 252);
      }} />
    </group>
  );
};
const S5 = ({ t, f }: Ctx) => {
  const doorK = seg(t, 30.0, 30.7);
  const presX = lerp(10.5, 5.9, seg(t, 33.6, 34.5, Easing.out(Easing.cubic)));
  const presWalk = seg(t, 33.6, 34.5);
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#c9a0e8" />
    <StoreFront t={t} f={f} sky={["#241a4a", "#7a4472"]} wall="#b8902f" signBg="#122e24" papered door={doorK} flashers />
    <ReleasedBoard t={t} />
    {/* the freed: three elderly women walk out slowly, escorted */}
    {[0, 1, 2].map((i) => {
      const wk = seg(t, 30.45 + i * 0.55, 33.3 + i * 0.55);
      const wx = lerp(-0.4, -4.6 - i * 0.9, wk), wz = lerp(-5.6, -1.2, wk);
      return (
        <group key={i} position={[wx, 0, wz]}>
          <Person p={[0, 0, 0]} sy={0} h={3.15} look={i === 1 ? elder2Look : elderLook} f={f} pose={{ mood: "smile", hunch: 0.3, walk: wk * 4.4 * WALK, speed: 0.45, arms: "down", lookX: -0.3, flip: true }} />
          <Cyl p={[-0.62, 0.75, 0.15]} rt={0.045} h={1.5} color="#8a6a34" line={1} />
        </group>
      );
    })}
    <Person p={[-2.2, 0, -3.4]} sy={0} h={3.45} look={officerLook} f={f} pose={{ mood: "smile", arms: "point", armK: 1, armR: [-0.8, 0.55], lookX: -0.5 }} />
    {/* the command post: table, map, radios — and the president */}
    <Desk p={[5.6, 0, -3.2]} w={3.4} top="#39424e" leg="#14161f" d={1.4} />
    <CanvasPlane p={[5.6, 4.6, -6.3]} s={[4.6, 3.1]} px={[690, 465]} frame="#10131c" draw={(c, W, H) => {
      c.fillStyle = "#17352e"; c.fillRect(0, 0, W, H);
      c.strokeStyle = "#7adbc8"; c.lineWidth = 7; c.beginPath();
      c.moveTo(30, H * 0.72); c.bezierCurveTo(W * 0.3, H * 0.5, W * 0.45, H * 0.85, W * 0.62, H * 0.6); c.bezierCurveTo(W * 0.75, H * 0.42, W * 0.85, H * 0.6, W - 26, H * 0.4); c.stroke();
      c.fillStyle = "#ffd36a"; c.font = "900 56px Inter, Arial"; c.textAlign = "left"; c.fillText("CARTAGENA", 30, 66);
      c.strokeStyle = "#e5233a"; c.lineWidth = 11; const cx = W * 0.55, cy = H * 0.58;
      c.beginPath(); c.moveTo(cx - 26, cy - 26); c.lineTo(cx + 26, cy + 26); c.moveTo(cx + 26, cy - 26); c.lineTo(cx - 26, cy + 26); c.stroke();
      c.fillStyle = "#8ae8ff"; c.font = "800 34px Inter, Arial"; c.fillText("THE STORE", cx + 42, cy + 12);
    }} />
    <Box p={[4.6, 1.25, -3.1]} s={[0.7, 0.45, 0.4]} color="#10131c" line={1} />
    <Cyl p={[4.45, 1.85, -3.1]} rt={0.03} h={0.9} rot={[0, 0, 0.25]} color="#8a93a6" line={0} />
    <Box p={[6.6, 1.22, -3.3]} s={[0.9, 0.4, 0.6]} color="#23232e" line={1} />
    <Person p={[presX, 0, -2.2]} sy={0} h={3.5} look={presidentLook} f={f} pose={{ mood: "deadpan", walk: presWalk * 4.6 * WALK, speed: 0.7, arms: t > 34.4 ? "point" : "down", armK: seg(t, 34.4, 34.7), armR: [-0.7, 0.66], lookX: -0.45, flip: true }} />
    <Person p={[8.3, 0, -3.6]} sy={0} h={3.45} look={soldierLook} f={f} pose={{ mood: "deadpan", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: -0.4 }} />
    <Lamp p={[-9.8, 0, -2.4]} h={3.4} color="#c9a0e8" /><Lamp p={[9.8, 0, -2.4]} h={3.4} color="#c9a0e8" />
    <Dust t={t} area={[8, 4, 5]} color="rgba(220,190,255,.9)" />
  </>);
};

/* =================== S6 35.55 – 43.20  1:30 a.m. — the storm =================== */
const K6: Key[] = [
  { t: 35.55, pos: [0, 3.0, 12.4], look: [0, 3.1, -4], fov: 60 },
  { t: 43.20, pos: [0, 2.9, 10.9], look: [0, 3.0, -4], fov: 58 },
];
const Clock130: React.FC = () => (
  <CanvasPlane p={[0, 8.75, -6.9]} s={[3.1, 3.85]} px={[372, 462]} draw={(c, W, H) => {
    c.fillStyle = "#0d1226"; c.beginPath(); c.arc(W / 2, W / 2, W * 0.47, 0, 7); c.fill();
    c.strokeStyle = "#8a93a6"; c.lineWidth = 7; c.beginPath(); c.arc(W / 2, W / 2, W * 0.47, 0, 7); c.stroke();
    c.fillStyle = "#aab4c8";
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; c.beginPath(); c.arc(W / 2 + Math.sin(a) * W * 0.375, W / 2 - Math.cos(a) * W * 0.375, i % 3 ? 5 : 10, 0, 7); c.fill(); }
    const ha = (1.5 / 12) * Math.PI * 2, ma = Math.PI;
    c.strokeStyle = "#f6f1e6"; c.lineCap = "round";
    c.lineWidth = 16; c.beginPath(); c.moveTo(W / 2, W / 2); c.lineTo(W / 2 + Math.sin(ha) * W * 0.23, W / 2 - Math.cos(ha) * W * 0.23); c.stroke();
    c.lineWidth = 10; c.beginPath(); c.moveTo(W / 2, W / 2); c.lineTo(W / 2 + Math.sin(ma) * W * 0.34, W / 2 - Math.cos(ma) * W * 0.34); c.stroke();
    c.fillStyle = "#e5233a"; c.beginPath(); c.arc(W / 2, W / 2, 12, 0, 7); c.fill();
    c.fillStyle = "#ffd36a"; c.font = "900 64px Inter, Arial"; c.textAlign = "center"; c.fillText("1:30 AM", W / 2, H - 38);
  }} />
);
const SfFigure: React.FC<{ t: number; f: number; i: number }> = ({ t, f, i }) => {
  const adv = seg(t, 39.6 + i * 0.18, 41.2 + i * 0.18, Easing.out(Easing.cubic));
  const x = lerp(-8.5 + i * 1.7, -2.6 + i * 1.7, adv), z = lerp(-0.5, -3.4 + (i % 2) * 0.5, adv);
  const done = t > 42.3;
  return (
    <group position={[x, 0, z]}>
      <Person p={[0, 0, 0]} sy={0} h={3.35} look={sfLook} f={f} pose={{ mood: "deadpan", hunch: done ? 0.05 : 0.38, walk: adv * 6.5 * WALK, speed: 0.85, arms: done && i === 1 ? "up" : "hold", armK: 1, armR: [0.3, 0.78], armL: [-0.3, 0.78], lookX: 0.4 }} />
      <Ball p={[0, 3.02, 0]} r={0.5} s={[1.12, 0.6, 1.12]} color="#232733" ink={0.05} />
    </group>
  );
};
const S6 = ({ t, f }: Ctx) => {
  const doorK = seg(t, 40.43, 40.75);
  const flash1 = t > 37.77 && t < 38.25 ? 1 - (t - 37.77) / 0.48 : 0;
  const flash2 = t > 38.35 && t < 38.8 ? 1 - (t - 38.35) / 0.45 : 0;
  return (<>
    <Cam t={t} keys={K6} impacts={[[37.85, 0.10], [38.4, 0.07], [40.5, 0.06]]} />
    <Lights warm="#8aa8ff" />
    <StoreFront t={t} f={f} sky={["#05081a", "#131c3f"]} wall="#4a3c1e" signBg="#0d2019" papered lit door={doorK} />
    <Ball p={[12.5, 10.8, -24]} r={1.5} color="#e8ecf4" ink={0} />
    <Clock130 />
    {/* flash-bang bursts at the door */}
    {flash1 > 0 ? <Glow p={[-1.8, 2.2, -5.6]} r={3.6} color="rgba(255,170,60,1)" o={0.85 * flash1} /> : null}
    {flash2 > 0 ? <Glow p={[1.9, 2.4, -5.6]} r={3.6} color="rgba(255,220,150,1)" o={0.85 * flash2} /> : null}
    {doorK > 0 ? <Glow p={[0, 2.2, -6.0]} r={3.2} color="rgba(255,190,90,1)" o={0.35 * doorK} /> : null}
    {[0, 1, 2, 3].map((i) => <SfFigure key={i} t={t} f={f} i={i} />)}
    <Person p={[7.6, 0, 0.8]} sy={0} h={3.45} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: -0.5 }} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(170,200,255,.9)" />
  </>);
};

/* =================== S7 43.20 – 48.86  dawn — everyone walks out alive =================== */
const K7: Key[] = [
  { t: 43.20, pos: [0, 3.1, 12.8], look: [0, 2.9, -3], fov: 60 },
  { t: 48.86, pos: [0, 3.0, 11.6], look: [0, 2.9, -3], fov: 58 },
];
const S7 = ({ t, f }: Ctx) => {
  const outK = (i: number) => seg(t, 43.5 + i * 0.5, 46.3 + i * 0.5);
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#ffd9ae" />
    <StoreFront t={t} f={f} sky={["#7a4a8f", "#ffb27a"]} wall="#f2c14e" signBg="#1d6a4a" door={1} />
    <Ball p={[-12.5, 6.8, -24]} r={1.9} color="#ffd94a" ink={0} />
    <Glow p={[0, 2.4, -6.0]} r={3.4} color="rgba(255,190,90,1)" o={0.30} />
    {/* the freed stream out into the dawn */}
    {[0, 1, 2, 3, 4].map((i) => {
      const k = outK(i);
      const wx = lerp(0, -4.4 + i * 1.55, k), wz = lerp(-5.4, 0.8 - (i % 2) * 0.7, k);
      return <Person key={i} p={[wx, 0, wz]} sy={0} h={3.35} look={hostageLooks[i]} f={f} pose={{ mood: i % 2 ? "laugh" : "smile", walk: k * 6.8 * WALK, speed: 0.75, arms: i === 2 && k > 0.85 ? "up" : "down", armK: 1, lookX: (rnd(i + 51) - 0.5) * 0.6 }} />;
    })}
    {/* a hug at the tape line */}
    <Person p={[-4.2, 0, 2.0]} sy={0} h={3.3} look={hostageLooks[5]} f={f} pose={{ mood: "laugh", arms: "hold", armK: 1, armR: [0.42, 0.8], armL: [-0.1, 0.8], lookX: 0.6 }} />
    <Person p={[-3.2, 0, 2.1]} sy={0} h={3.4} look={hostageLooks[1]} f={f} pose={{ mood: "laugh", arms: "hold", armK: 1, armR: [0.1, 0.8], armL: [-0.42, 0.8], lookX: -0.6, flip: true }} />
    <Box p={[0, 1.05, 3.6]} s={[15.5, 0.16, 0.06]} color="#ffd94a" line={0} />
    {/* the medic van */}
    <group position={[4.9, 0, -3.8]} rotation={[0, -0.15, 0]}>
      <Box p={[0, 1.35, 0]} s={[4.4, 2.3, 2.1]} color="#f2f0ea" line={2} />
      <Box p={[2.6, 1.0, 0]} s={[1.1, 1.6, 1.9]} color="#dfe6ee" line={2} />
      <CanvasPlane p={[0, 1.5, 1.07]} s={[1.15, 1.15]} px={[230, 230]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = "#e23b3b"; c.fillRect(W * 0.38, H * 0.12, W * 0.24, H * 0.76); c.fillRect(W * 0.12, H * 0.38, W * 0.76, H * 0.24); }} />
      {[-1.4, 1.4, 2.6].map((wx, i) => <Cyl key={i} p={[wx, 0.45, 1.0]} rt={0.45} h={0.24} rot={[Math.PI / 2, 0, 0]} color="#14161f" line={1} />)}
    </group>
    {/* the four surviving captors, led away hunched between officers (from 45.3) */}
    {t > 45.0 ? [0, 1, 2, 3].map((i) => (
      <Person key={i} p={[2.9 + i * 0.95, 0, 1.6]} sy={0} h={3.2} look={crewLook} f={f} pose={{ mood: "deadpan", hunch: 0.55, arms: "down", lookX: 0 }} />
    )) : null}
    {t > 45.0 ? <>
      <Person p={[2.0, 0, 1.7]} sy={0} h={3.45} look={officerLook} f={f} pose={{ mood: "deadpan", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: 0.4 }} />
      <Person p={[6.6, 0, 1.7]} sy={0} h={3.45} look={soldierLook} f={f} pose={{ mood: "deadpan", arms: "hold", armK: 1, armR: [0.3, 0.8], armL: [-0.3, 0.8], lookX: -0.4 }} />
    </> : null}
    <Palm p={[-10.6, 0, -4.6]} s={1.15} /><Palm p={[10.8, 0, -4.2]} s={1.0} />
    <Dust t={t} area={[8, 4, 5]} color="rgba(255,230,190,.9)" />
  </>);
};

/* =================== S8 48.86 – 57.19  the twist — ten years of peace, in the walled city =================== */
const K8: Key[] = [
  { t: 48.86, pos: [-2.4, 3.5, 12.6], look: [-2.4, 3.4, -5], fov: 60 },
  { t: 57.19, pos: [2.6, 3.5, 12.2], look: [3.2, 3.1, -5], fov: 58 },
];
const PeaceMedallion: React.FC<{ t: number }> = ({ t }) => {
  if (t < 51.4) return null;
  const k = seg(t, 51.4, 51.85, Easing.out(Easing.back(1.7)));
  return (
    <group position={[-1.6, 5.1, -5.6]} scale={[k, k, 1]}>
      <CanvasPlane p={[0, 0, 0]} s={[3.6, 3.6]} px={[540, 540]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H);
        c.fillStyle = "#f6f1e6"; c.beginPath(); c.arc(W / 2, H / 2, W * 0.48, 0, 7); c.fill();
        c.strokeStyle = "#c9a227"; c.lineWidth = 14; c.beginPath(); c.arc(W / 2, H / 2, W * 0.45, 0, 7); c.stroke();
        c.fillStyle = "#1d6a4a"; c.font = "900 215px Inter, Arial"; c.textAlign = "center"; c.fillText("10", W / 2, H * 0.60);
        c.fillStyle = "#1b1b2a"; c.font = "900 56px Inter, Arial"; c.fillText("YEARS OF", W / 2, H * 0.76);
        c.fillText("PEACE", W / 2, H * 0.875);
      }} />
    </group>
  );
};
const Dove: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const k = seg(t, 52.2 + i * 0.5, 56.5 + i * 0.5);
  if (k <= 0) return null;
  const x = lerp(-1.6, 2.8 + i * 2.4, k), y = lerp(5.6, 8.6 + i * 0.7, k) + Math.sin(t * 3 + i) * 0.15;
  const flap = Math.sin(t * 11 + i * 2) * 0.55;
  return (
    <group position={[x, y, -5.2]}>
      <Ball p={[0, 0, 0]} r={0.30} s={[1.35, 0.85, 0.9]} color="#ffffff" ink={0.05} />
      <Ball p={[0.38, 0.10, 0]} r={0.17} color="#ffffff" ink={0.05} />
      <Box p={[-0.25, 0.16, 0.28]} s={[0.62, 0.07, 0.34]} rot={[flap, 0, 0]} color="#eef2f6" line={1} />
      <Box p={[-0.25, 0.16, -0.28]} s={[0.62, 0.07, 0.34]} rot={[-flap, 0, 0]} color="#eef2f6" line={1} />
    </group>
  );
};
const S8 = ({ t, f }: Ctx) => (<>
  <Cam t={t} keys={K8} />
  <Lights warm="#ffd9ae" />
  <CanvasPlane p={[0, 13, -30]} s={[84, 34]} px={[840, 340]} draw={(c, W, H) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3a8fc4"); g.addColorStop(0.55, "#a8d8e8"); g.addColorStop(0.78, "#2f8f9e"); g.addColorStop(1, "#1f7a8a"); c.fillStyle = g; c.fillRect(0, 0, W, H); }} />
  <Ball p={[13, 11, -26]} r={2.0} color="#ffd94a" ink={0} />
  <Floor kind="tile" a="#c9a877" b="#bb9a66" unit={2} w={44} d={40} />
  {/* the old-town wall with crenellations */}
  <Box p={[-1, 0.85, -6.5]} s={[15, 1.7, 1.3]} color="#9a7a54" line={2} />
  {[-7.6, -6.2, -4.8, -3.4, -2.0, -0.6, 0.8, 2.2, 3.6, 5.0].map((x, i) => <Box key={i} p={[x, 1.95, -6.5]} s={[0.85, 0.5, 1.3]} color="#8a6c46" line={1} />)}
  {/* terracotta rooftops + the church tower behind the wall */}
  {[-6.5, -3.4, 0.2, 3.4].map((x, i) => (
    <group key={i} position={[x, 0, -9.5 - (i % 2) * 1.2]}>
      <Box p={[0, 1.5, 0]} s={[2.7, 3.0, 2.2]} color={["#f2e3c8", "#eed9b0", "#f6ead2", "#ecd7ac"][i]} line={1} />
      <Cyl p={[0, 3.55, 0]} rt={0.06} rb={2.05} h={1.3} color="#c9552e" line={1} />
    </group>
  ))}
  <group position={[6.3, 0, -10.5]}>
    <Box p={[0, 3.1, 0]} s={[1.7, 6.2, 1.7]} color="#f2e3c8" line={2} />
    <Cyl p={[0, 6.9, 0]} rt={0.06} rb={1.5} h={1.6} color="#a83e22" line={1} />
    <Ball p={[0, 5.6, 0]} r={0.34} color="#c9a227" ink={0.05} />
  </group>
  {/* the cruise ship on the teal sea */}
  <group position={[8.6, 0, -13.5]}>
    <Box p={[0, 0.75, 0]} s={[6.8, 1.1, 1.9]} color="#f2f0ea" line={2} />
    <Box p={[0, 1.75, 0]} s={[5.6, 0.95, 1.6]} color="#ffffff" line={1} />
    <Box p={[-0.4, 2.55, 0]} s={[4.4, 0.7, 1.35]} color="#eef2f6" line={1} />
    <Cyl p={[1.6, 3.35, 0]} rt={0.34} h={1.0} color="#e23b3b" line={1} />
    <CanvasPlane p={[0, 1.75, 0.83]} s={[4.6, 0.6]} px={[690, 90]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = "#274b73"; for (let i = 0; i < 12; i++) c.fillRect(28 + i * 54, 22, 30, 30); }} />
  </group>
  <PeaceMedallion t={t} />
  <Dove t={t} i={0} /><Dove t={t} i={1} />
  <Palm p={[-9.8, 0, -3.6]} s={1.1} /><Palm p={[10.4, 0, -4.4]} s={0.95} />
  <Person p={[-5.8, 0, 0.4]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: "grin", arms: "point", armK: 1, armR: [0.85, 0.62], lookX: 0.65 }} />
  <Dust t={t} area={[8, 4, 5]} color="rgba(255,240,200,.9)" />
</>);

/* =================== S9 57.19 – 63.07  sign-off — TDN desk, violet-gold =================== */
const K9: Key[] = [
  { t: 57.19, pos: [0, 3.1, 9.8], look: [0, 2.9, -2], fov: 60 },
  { t: 63.07, pos: [0, 3.0, 8.4], look: [0, 3.0, -2], fov: 58 },
];
const S9 = ({ t, f }: Ctx) => (
  <>
    <Cam t={t} keys={K9} />
    <Lights warm="#ffe2ae" />
    <Floor kind="carpet" a="#1e0f30" b="#180b26" unit={2.0} w={30} d={30} />
    <WallDoor z={-7} W={30} kind="plain" a="#2c1445" b="#2c1445" base="#140826" />
    <SideWall x={-11} kind="plain" a="#251138" b="#251138" /><SideWall x={11} kind="plain" a="#251138" b="#251138" />
    <CanvasPlane p={[0, 4.9, -6.8]} s={[9.6, 5.2]} px={[960, 520]} frame="#0f0518" draw={(c, W, H) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1c0b33"); g.addColorStop(1, "#4a2072"); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.fillStyle = "#7a3fd1"; c.beginPath(); c.arc(W * 0.5, H * 0.36, 74, 0, 7); c.fill();
      c.fillStyle = "#ffffff"; c.font = "900 62px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("T", W * 0.5, H * 0.36 + 2);
      c.fillStyle = "#ffffff"; c.font = "900 150px Inter, Arial"; c.fillText("TDN", W * 0.5, H * 0.62);
      c.fillStyle = "#e5b83a"; c.fillRect(0, H * 0.82, W, H * 0.18);
      c.fillStyle = "#1c0b33"; c.font = "900 44px Inter, Arial"; c.fillText("THE DAILY TOON NEWS", W * 0.5, H * 0.91);
    }} />
    <Glow p={[0, 4.9, -6.2]} r={5.2} color="rgba(150,90,255,1)" o={0.20} />
    <Globe p={[5.4, 2.5, -5.2]} r={1.7} rotY={t * 0.4} />
    <Cyl p={[5.4, 0.45, -5.2]} rt={0.09} h={0.9} color="#8a93a6" line={1} /><Cyl p={[5.4, 0.06, -5.2]} rt={0.55} h={0.12} color="#4a2072" line={1} />
    <Desk p={[0, 0, -2.6]} w={5.6} top="#4a2072" leg="#140826" d={1.9} />
    <CanvasPlane p={[0, 0.62, -1.62]} s={[3.4, 0.8]} px={[680, 160]} draw={(c, W, H) => { c.fillStyle = "#0f0518"; c.fillRect(0, 0, W, H); c.fillStyle = "#e5b83a"; c.font = "900 84px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("TDN", W / 2, H / 2 + 2); }} />
    {/* the grocery bag on the desk */}
    <group position={[1.85, 1.05, -2.5]}>
      <Box p={[0, 0.5, 0]} s={[0.95, 1.0, 0.65]} color="#c9a06a" line={2} />
      <Box p={[0, 1.04, 0]} s={[0.99, 0.14, 0.69]} color="#a87f4c" line={1} />
      <Ball p={[-0.2, 1.22, 0]} r={0.17} color="#e23b3b" ink={0.05} /><Ball p={[0.22, 1.25, 0.05]} r={0.15} color="#2f9e6a" ink={0.05} />
      <CanvasPlane p={[0, 0.5, 0.34]} s={[0.62, 0.4]} px={[248, 160]} draw={(c, W, H) => { c.clearRect(0, 0, W, H); c.fillStyle = "#5a3a20"; c.font = "900 44px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("FOOD", W / 2, H / 2); }} />
    </group>
    <Box p={[-1.7, 1.12, -2.5]} s={[0.85, 0.05, 1.1]} color="#f2f0ea" line={1} /><Box p={[-1.6, 1.17, -2.55]} s={[0.85, 0.05, 1.1]} color="#dfe6ee" rot={[0, 0.25, 0]} line={1} />
    <Monitor p={[2.9, 1.05, -3.1]} rot={[0, -0.35, 0]} screen="#e5b83a" />
    <Chair p={[-4.9, 0, -1.4]} rotY={0.4} color="#4a2072" /><Plant p={[-8.3, 0, -4.6]} s={1.2} /><Lamp p={[8.4, 0, -4.2]} h={3.2} color="#ffe2ae" />
    <Clock p={[-7.6, 6.3, -4.95]} r={0.55} t={t} />
    <Rug p={[0, 0, 0.8]} s={[7.5, 3.8]} a="#180b26" b="#7a3fd1" />
    <Shaft p={[1.5, 4.5, -2]} s={[2.6, 9]} rot={[0, 0, -0.35]} color="255,226,174" o={0.12} /><Dust t={t} area={[6, 6, 4]} color="rgba(230,210,255,.9)" />
    <Person p={[0, 0, -3.6]} sy={0} h={3.5} look={analyst} f={f} pose={{ mood: "grin", squash: t > 57.4 && t < 58.0 ? 0.08 : 0,
      arms: t > 62.4 ? "point" : "down", armK: seg(t, 62.4, 62.65), armR: [0.35, 0.55], lookX: 0.1 }} />
  </>
);

const CUTS = [0, 5.82, 15.72, 20.78, 29.43, 35.55, 43.20, 48.86, 57.19, 63.07];
export const TdnV7: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#3a7ca5">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#5a7a9c">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#20261e">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#4a2c50">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#33244a">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#0d1430">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#7a4a2a">{(c) => <S7 {...c} />}</Scene>
      <Scene start={CUTS[7]} end={CUTS[8]} bg="#2a6a7a">{(c) => <S8 {...c} />}</Scene>
      <Scene start={CUTS[8]} end={CUTS[9]} bg="#241038" trans="flash">{(c) => <S9 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 5.82 ? "rgba(255,180,60,.07)" : t < 15.72 ? "rgba(70,110,255,.06)" : t < 20.78 ? "rgba(120,255,170,.05)" : t < 29.43 ? "rgba(255,120,60,.08)" : t < 35.55 ? "rgba(150,90,255,.08)" : t < 43.20 ? "rgba(60,90,255,.09)" : t < 48.86 ? "rgba(255,170,60,.08)" : t < 57.19 ? "rgba(60,200,190,.06)" : "rgba(150,90,255,.07)"} />
      {/* S3 hostage-count chip (19.05–20.9s) */}
      {t > 19.05 && t < 20.9 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(26,6,8,.88)", color: "#ff8a7a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 56, padding: "16px 30px", borderRadius: 18 }}>
            ABOUT 30 HOSTAGES
          </span>
        </div>
      ) : null}
      {/* S7 outcome chip (45.3–48.9s) */}
      {t > 45.3 && t < 48.9 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(8,14,26,.88)", color: "#ffd9d4", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 48, padding: "16px 30px", borderRadius: 18 }}>
            1 CAPTOR KILLED · 4 CAPTURED
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
