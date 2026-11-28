// TDN v18 — "The Pattaya Crypto Wash House: 200 Million Baht a Month": Thai police say a
// network washed ~200M baht/month in cash into USDT through two Pattaya properties, raided
// Friday evening 27 Nov 2026; six Chinese nationals arrested (house on Chaiyapruek Road,
// Nong Prue + 17th-floor condo at Lumpini Park Beach, Jomtien). Funds allegedly from
// call-centre scams and online gambling; most alleged victims in China. Five of six held
// student visas, allegedly paid ~50,000 baht/month. Charges: unlicensed digital-asset
// business, working without permits. Led by Police Region 2 commander Wasan Techa-akrakesom.
// Framing: police allegations throughout — accused, NOT convicted.
// Sources: Thai police statements via Thaiger / Chiang Rai Times / ASEAN Now, 28 Nov 2026.
// 9:16 720x1280 30fps, 1901 frames (63.28 s voiceover). Production only — parent releases.
// CUTS = [0, 7.33, 18.91, 24.22, 34.09, 45.71, 56.69, 63.35].
// S1 hook / S2 raid 1: the house / S3 evidence / S4 raid 2: the condo / S5 money trail
// S6 the workers + charges / S7 closer: investigation widening
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

const officer: Look = { skin: "#f2c894", body: "#2e5aa8", outfit: "hoodie", hair: "short", hairColor: "#14141f", badge: "#ffd36a", shoe: "#14141f" };
const worker: Look = { skin: "#fbe3c8", body: "#3a4152", outfit: "hoodie", hair: "short", hairColor: "#0c0c12", shoe: "#1b1b2a" };
const coord: Look = { skin: "#e8b98d", body: "#6a4a8c", outfit: "hoodie", hair: "short", hairColor: "#0c0c12", shoe: "#0c0c12" };
const commander: Look = { skin: "#eec39a", body: "#1d3f75", outfit: "hoodie", hair: "short", hairColor: "#23232e", glasses: true, badge: "#ffd36a", shoe: "#14141f" };

/* ---------- scene wrapper (same pattern as TdnV6–TdnV17) ---------- */
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
/* a USDT coin: green disc with a white T */
const UsdtCoin: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={[s, s, s]}>
    <Cyl p={[0, 0, 0]} rt={0.55} h={0.16} color="#26a17b" rot={[Math.PI / 2, 0, 0]} />
    <CanvasPlane p={[0, 0, 0.1]} s={[0.92, 0.92]} px={[128, 128]} draw={(c, W, H) => {
      c.clearRect(0, 0, W, H); c.fillStyle = "#ffffff"; c.font = "900 82px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillText("T", W / 2, H / 2 + 4);
    }} />
  </group>
);
/* a small house with a pitched roof and lit windows */
const House: React.FC<{ p: V3; s?: number; lit?: string }> = ({ p, s = 1, lit = "#ffd36a" }) => (
  <group position={p} scale={[s, s, s]}>
    <Box p={[0, 1.9, 0]} s={[6.4, 3.8, 3.6]} color="#31456b" line={2} />
    <Box p={[-1.65, 4.6, 0]} s={[4.3, 0.35, 4.1]} color="#7a2d35" line={2} rot={[0, 0, 0.62]} />
    <Box p={[1.65, 4.6, 0]} s={[4.3, 0.35, 4.1]} color="#7a2d35" line={2} rot={[0, 0, -0.62]} />
    <Box p={[0, 1.05, 1.86]} s={[1.15, 2.1, 0.1]} color="#1a1208" line={2} />
    <Ball p={[0.38, 1.05, 1.95]} r={0.07} color="#ffd36a" ink={0.02} />
    <Box p={[-1.9, 2.5, 1.86]} s={[1.3, 1.1, 0.08]} color={lit} line={2} />
    <Box p={[1.9, 2.5, 1.86]} s={[1.3, 1.1, 0.08]} color={lit} line={2} />
  </group>
);

/* =================== S1 0 – 7.33  hook: 200 million baht a month =================== */
const K1: Key[] = [
  { t: 0, pos: [0, 4.2, 17.2], look: [0, 3.8, -6], fov: 60 },
  { t: 7.33, pos: [0, 4.0, 14.8], look: [0, 3.8, -6], fov: 58 },
];
const S1 = ({ t, f }: Ctx) => {
  const bK = seg(t, 0.35, 0.9, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 5.35, 5.9, Easing.out(Easing.back(1.7)));
  const pulse = 0.55 + 0.45 * Math.sin(t * 5.0);
  return (<>
    <Cam t={t} keys={K1} />
    <Lights warm="#bcd2ff" />
    <Floor kind="tile" a="#131c2e" b="#0f1624" unit={2.4} w={60} d={56} />
    {/* the quiet house at dusk, money glow in the windows */}
    <Glow p={[0, 3.4, -11]} r={4.2} color="#ffb35e" o={0.35 + 0.2 * pulse} />
    <House p={[0, 0, -11]} s={1.25} />
    <House p={[-9.5, 0, -13]} s={0.9} lit="#8ae8ff" />
    <House p={[9.5, 0, -13]} s={0.9} lit="#8ae8ff" />
    {/* street lamps */}
    {[-5.6, 5.6].map((x, i) => (
      <group key={i} position={[x, 0, -5]}>
        <Box p={[0, 2.2, 0]} s={[0.22, 4.4, 0.22]} color="#23232e" line={2} />
        <Ball p={[0, 4.6, 0]} r={0.3} color="#ffe9b0" ink={0.02} />
        <Glow p={[0, 4.6, 0]} r={1.7} color="#ffe9b0" o={0.45} />
      </group>
    ))}
    {/* an officer watches the house from the street */}
    <Person p={[3.9, 0, -3.2]} h={3.8} look={officer} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.35 }} />
    <Plant p={[-4.8, 0, -4]} />
    {bK > 0.02 ? <group position={[0, 11.3, -11]} scale={[bK, bK, 1]}><Board p={[0, 0, 0]} w={11.4} lines={[{ t: "200,000,000 BAHT", s: 88, c: "#ffd36a" }, { t: "EVERY MONTH", s: 80, c: "#f5f7fa" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 8.2, -10.4]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[9.8, 0.95]} text="CASH IN — CRYPTO OUT" bg="#0d2f1a" fg="#8affc1" size={104} frame="#2fd46a" /></group> : null}
  </>);
};

/* =================== S2 7.33 – 18.91  raid 1: five at the terminals =================== */
const K2: Key[] = [
  { t: 7.33, pos: [0, 4.4, 17.6], look: [0, 3.9, -6], fov: 60 },
  { t: 18.91, pos: [0, 4.2, 15.2], look: [0, 3.9, -6], fov: 57 },
];
const S2 = ({ t, f }: Ctx) => {
  const sK = seg(t, 9.55, 10.1, Easing.out(Easing.back(1.7)));
  const uK = seg(t, 16.55, 17.1, Easing.out(Easing.back(1.7)));
  const raidK = clamp(seg(t, 8.6, 9.3));
  /* conveyor: cash bills ride in from the left, leave as USDT coins on the right */
  const beltItem = (i: number) => {
    const ph = ((t * 0.9 + i * 1.55) % 9.3);
    const x = -7.6 + ph;
    return ph < 4.9
      ? <Box key={i} p={[x, 1.62, -3.4]} s={[1.05, 0.1, 0.62]} color="#7fc46a" line={1} />
      : <UsdtCoin key={i} p={[x, 1.68, -3.4]} s={0.85} />;
  };
  return (<>
    <Cam t={t} keys={K2} impacts={[[8.9, 0.1]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1d2a44" b="#182540" unit={2.4} w={60} d={50} />
    {/* back wall + the exchange row: five workers at terminals */}
    <Box p={[0, 5.4, -10.6]} s={[26, 10.8, 0.4]} color="#24334f" line={0} />
    {[-6.4, -3.2, 0, 3.2, 6.4].map((x, i) => (
      <group key={i}>
        <Desk p={[x, 0, -7.6]} w={2.7} top="#33415e" leg="#232f47" />
        <Monitor p={[x, 1.95, -8.3]} s={1.05} screen={i % 2 ? "#12351f" : "#0f2f47"} />
        <Person p={[x, 0, -6.2]} h={3.4} look={worker} f={f + i * 7} pose={{ mood: t > 9.2 ? "shock" : "deadpan", arms: "point", armK: 0.8, armR: [0.65, 0.5], armL: [0.5, 0.55], lookX: i % 2 ? 0.2 : -0.2, hunch: 0.3 }} />
      </group>
    ))}
    {/* the conveyor in front: cash in, crypto out */}
    <Box p={[0, 1.15, -3.4]} s={[16.5, 0.45, 1.7]} color="#39424c" line={2} />
    {[0, 1, 2, 3, 4, 5].map(beltItem)}
    {/* the raiding officer strides in */}
    <Person p={[lerp(-10.5, -8.3, Easing.out(Easing.cubic)(raidK)), 0, -4.6]} h={3.9} look={officer} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.85, armR: [0.85, 0.7], lookX: 0.5, walk: raidK < 1 ? t * 6.4 : 0, speed: 1.6 }} />
    {sK > 0.02 ? <group position={[0, 12.4, -10.2]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.2, 0.95]} text="CHAIYAPRUEK ROAD — NONG PRUE" bg="#101828" fg="#ffd36a" size={88} frame="#c9a227" /></group> : null}
    {uK > 0.02 ? <group position={[5.6, 6.6, -6.8]} scale={[uK, uK, 1]}><Board p={[0, 0, 0]} w={5.6} bg="#0d2f1a" frame="#26a17b" lines={[{ t: "USDT", s: 120, c: "#8affc1" }, { t: "DOLLAR STABLECOIN", s: 52, c: "#f5f7fa" }]} /></group> : null}
  </>);
};

/* =================== S3 18.91 – 24.22  the evidence lineup =================== */
const K3: Key[] = [
  { t: 18.91, pos: [0, 4.3, 16.4], look: [0, 4.0, -6], fov: 60 },
  { t: 24.22, pos: [0, 4.1, 14.8], look: [0, 4.0, -6], fov: 58 },
];
const S3 = ({ t, f }: Ctx) => {
  const tile = (x: number, at: number, label: string, sub: string, icon: string, col: string) => {
    const k = seg(t, at, at + 0.45, Easing.out(Easing.back(1.7)));
    return k > 0.02 ? (
      <group key={label} position={[x, 5.6, -8.8]} scale={[k, k, 1]}>
        <CanvasPlane p={[0, 0, 0]} s={[5.9, 4.6]} px={[640, 500]} frame={col} draw={(c, W, H) => {
          c.fillStyle = "#101828"; c.fillRect(0, 0, W, H);
          c.fillStyle = col; c.strokeStyle = col; c.textAlign = "center"; c.textBaseline = "middle";
          if (icon === "computer") { c.strokeRect(W / 2 - 95, 46, 190, 128); c.fillRect(W / 2 - 95, 66, 190, 8); c.fillRect(W / 2 - 14, 174, 28, 26); c.fillRect(W / 2 - 62, 200, 124, 12); }
          else if (icon === "phones") { for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) { if (r === 1 && i === 6) break; c.strokeRect(52 + i * 78, 52 + r * 92, 52, 76); } }
          else if (icon === "router") { c.fillRect(W / 2 - 105, 108, 210, 62); c.lineWidth = 9; c.beginPath(); c.moveTo(W / 2 - 70, 108); c.lineTo(W / 2 - 96, 44); c.moveTo(W / 2, 108); c.lineTo(W / 2, 36); c.moveTo(W / 2 + 70, 108); c.lineTo(W / 2 + 96, 44); c.stroke(); c.beginPath(); c.arc(W / 2 - 52, 139, 9, 0, 7); c.arc(W / 2 + 4, 139, 9, 0, 7); c.fill(); }
          else { c.fillRect(W / 2 - 88, 62, 176, 108); c.beginPath(); c.arc(W / 2 + 48, 116, 17, 0, 7); c.fillStyle = "#101828"; c.fill(); c.fillStyle = col; c.fillRect(W / 2 - 66, 88, 84, 10); c.fillRect(W / 2 - 66, 112, 60, 10); }
          c.fillStyle = "#f5f7fa"; c.font = "900 62px Inter, Arial"; c.fillText(label, W / 2, H - 128);
          c.fillStyle = col; c.font = "900 54px Inter, Arial"; c.fillText(sub, W / 2, H - 58);
        }} />
      </group>
    ) : null;
  };
  return (<>
    <Cam t={t} keys={K3} />
    <Lights warm="#dfe8ff" />
    <Floor kind="carpet" a="#141d30" b="#101828" unit={2} w={52} d={44} />
    {/* the evidence table */}
    <Box p={[0, 0.95, -6.5]} s={[17.5, 0.4, 2.6]} color="#2a3448" line={2} />
    {[-6.2, -2.1, 2.1, 6.2].map((x, i) => <Box key={i} p={[x, 0.45, -6.5]} s={[0.35, 0.9, 2.2]} color="#1a2233" line={1} />)}
    <Monitor p={[-6.3, 1.85, -6.6]} s={0.95} screen="#0f2f47" />
    {[-4.4, -3.5, -2.6].map((x, i) => <Box key={"ph" + i} p={[x, 1.3, -6.4]} s={[0.62, 0.28, 0.14]} color="#39496b" line={1} rot={[0, 0.4 * i, 0]} />)}
    <Box p={[0.4, 1.32, -6.5]} s={[1.5, 0.34, 0.9]} color="#232f47" line={1} />
    {[2.9, 4.1, 5.3].map((x, i) => <Box key={"hw" + i} p={[x, 1.3, -6.4]} s={[0.95, 0.3, 0.6]} color="#26a17b" line={1} />)}
    {/* the officer presents the haul */}
    <Person p={[-8.3, 0, -4.2]} h={3.9} look={officer} f={f} pose={{ mood: "smile", arms: "point", armK: 0.85, armR: [0.85, 0.65], lookX: 0.55 }} />
    {tile(-6.3, 19.7, "COMPUTERS", "SEIZED", "computer", "#38b6d9")}
    {tile(-2.1, 20.5, "13 PHONES", "SEIZED", "phones", "#ffd36a")}
    {tile(2.1, 21.75, "ROUTERS", "SEIZED", "router", "#8affc1")}
    {tile(6.3, 22.55, "3 WALLETS", "HARDWARE", "wallet", "#26a17b")}
  </>);
};

/* =================== S4 24.22 – 34.09  raid 2: the 17th-floor condo =================== */
const K4: Key[] = [
  { t: 24.22, pos: [0, 5.4, 19.4], look: [0, 6.4, -8], fov: 60 },
  { t: 34.09, pos: [0, 4.6, 15.4], look: [0, 4.6, -8], fov: 57 },
];
const S4 = ({ t, f }: Ctx) => {
  const flK = seg(t, 26.6, 27.15, Easing.out(Easing.back(1.7)));
  const cK = seg(t, 32.6, 33.15, Easing.out(Easing.back(1.7)));
  const outK = clamp(seg(t, 29.9, 31.4));
  return (<>
    <Cam t={t} keys={K4} />
    <Lights warm="#bcd2ff" />
    <Stars p={[0, 14, -26]} s={[48, 16]} t={t} />
    <Floor kind="tile" a="#101a2c" b="#0c1424" unit={2.6} w={60} d={50} />
    {/* the condo tower: window grid, the 17th floor picked out in gold */}
    <group position={[0, 0, -13]}>
      <Box p={[0, 8.6, 0]} s={[11.5, 17.2, 3]} color="#1d2a44" line={2} />
      <CanvasPlane p={[0, 8.6, 1.56]} s={[10.9, 16.4]} px={[512, 768]} draw={(c, W, H) => {
        c.fillStyle = "#16233a"; c.fillRect(0, 0, W, H);
        const rows = 20, cols = 7;
        for (let r = 0; r < rows; r++) for (let i = 0; i < cols; i++) {
          const is17 = r === rows - 18; // 17th floor counting from the ground
          const lit = is17 || rnd(r * 31 + i * 7) > 0.62;
          c.fillStyle = is17 ? "#ffd36a" : lit ? "#3d5a80" : "#101828";
          c.fillRect(18 + i * ((W - 36) / cols), 16 + r * ((H - 32) / rows), (W - 36) / cols - 12, (H - 32) / rows - 11);
        }
      }} />
      <Box p={[0, 0.75, 1.8]} s={[3.2, 1.5, 0.25]} color="#0a0f1a" line={2} />
    </group>
    <Glow p={[0, 13.9, -11.2]} r={3.4} color="#ffd36a" o={0.3 + 0.35 * flK} />
    {/* neighbouring towers, dimmer */}
    <Box p={[-10.5, 6, -16]} s={[6.5, 12, 2.6]} color="#141f33" line={1} />
    <Box p={[10.5, 5, -16]} s={[6.5, 10, 2.6]} color="#141f33" line={1} />
    {/* the coordinator is brought out of the lobby */}
    <group position={[lerp(0, -2.6, Easing.inOut(Easing.cubic)(outK)), 0, -10.6]}>
      <Person p={[0, 0, 0]} h={3.7} look={coord} f={f} pose={{ mood: "worry", arms: "down", lookX: -0.3, tilt: -0.05, walk: outK > 0 && outK < 1 ? t * 5.4 : 0, speed: 1.4 }} />
    </group>
    <group position={[lerp(1.6, -0.9, Easing.inOut(Easing.cubic)(outK)), 0, -10.9]}>
      <Person p={[0, 0, 0]} h={3.9} look={officer} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.6, armR: [0.55, 0.5], lookX: -0.4, walk: outK > 0 && outK < 1 ? t * 5.4 : 0, speed: 1.4 }} />
    </group>
    {flK > 0.02 ? <group position={[6.9, 13.9, -11.4]} scale={[flK, flK, 1]}><Sign p={[0, 0, 0]} s={[6.9, 0.95]} text="17TH FLOOR" bg="#101828" fg="#ffd36a" size={110} frame="#c9a227" /></group> : null}
    {cK > 0.02 ? <group position={[0, 12.1, -10.6]} scale={[cK, cK, 1]}><Board p={[0, 0, 0]} w={10.2} lines={[{ t: "THE COORDINATOR", s: 78, c: "#ffb35e" }, { t: "ARRESTED", s: 78, c: "#f5f7fa" }]} /></group> : null}
  </>);
};

/* =================== S5 34.09 – 45.71  the money trail =================== */
const K5: Key[] = [
  { t: 34.09, pos: [0, 4.6, 17.4], look: [0, 4.4, -6], fov: 60 },
  { t: 45.71, pos: [0, 4.4, 15.2], look: [0, 4.4, -6], fov: 57 },
];
const S5 = ({ t, f }: Ctx) => {
  const nK = seg(t, 35.95, 36.5, Easing.out(Easing.back(1.7)));
  const dK = seg(t, 38.2, 38.75, Easing.out(Easing.back(1.7)));
  const aK = seg(t, 41.1, 41.65, Easing.out(Easing.back(1.7)));
  const gK = seg(t, 42.3, 42.85, Easing.out(Easing.back(1.7)));
  const chK = seg(t, 44.95, 45.5, Easing.out(Easing.back(1.7)));
  /* cash packets flow left -> right along the trail */
  const pkt = (i: number) => {
    const ph = ((t * 1.15 + i * 2.3) % 13.8);
    return <Box key={i} p={[-7.4 + ph, 3.1 + Math.sin(ph * 1.4) * 0.35, -7.5]} s={[1.0, 0.55, 0.12]} color={ph > 11 ? "#26a17b" : "#7fc46a"} line={1} rot={[0, 0, Math.sin(ph * 1.4) * 0.2]} />;
  };
  const chev = (x: number, i: number) => <Box key={"c" + i} p={[x, 3.1, -7.6]} s={[0.55, 0.55, 0.1]} color="#ffd36a" line={0} rot={[0, 0, Math.PI / 4]} />;
  return (<>
    <Cam t={t} keys={K5} />
    <Lights warm="#ffe9c4" />
    <Floor kind="carpet" a="#131c2e" b="#0f1624" unit={2} w={56} d={46} />
    {/* the trail line */}
    <Box p={[0, 3.05, -7.7]} s={[16.5, 0.14, 0.14]} color="#39496b" line={0} />
    {[-4.6, -0.6, 3.4].map(chev)}
    {[0, 1, 2, 3, 4, 5].map(pkt)}
    {/* source boards, left */}
    {aK > 0.02 ? <group position={[-5.6, 9.6, -9.5]} scale={[aK, aK, 1]}><Board p={[0, 0, 0]} w={7.6} bg="#2a0f14" frame="#e5233a" lines={[{ t: "CALL-CENTRE", s: 66, c: "#ff9a8a" }, { t: "SCAMS", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {gK > 0.02 ? <group position={[-5.6, 6.2, -9.5]} scale={[gK, gK, 1]}><Board p={[0, 0, 0]} w={7.6} bg="#241031" frame="#7a4a8c" lines={[{ t: "ONLINE", s: 66, c: "#d3a6ff" }, { t: "GAMBLING", s: 66, c: "#f5f7fa" }]} /></group> : null}
    {/* destination board, right */}
    {chK > 0.02 ? <group position={[6.1, 7.9, -9.5]} scale={[chK, chK, 1]}><Board p={[0, 0, 0]} w={6.6} bg="#2a0f14" frame="#e5233a" lines={[{ t: "CHINA", s: 96, c: "#ff9a8a" }, { t: "MOST ALLEGED VICTIMS", s: 40, c: "#f5f7fa" }]} /></group> : null}
    {/* the scale of it, top centre */}
    {nK > 0.02 ? <group position={[0.8, 12.6, -10.5]} scale={[nK, nK, 1]}><Board p={[0, 0, 0]} w={10.6} lines={[{ t: "200,000,000 BAHT", s: 80, c: "#ffd36a" }, { t: "EVERY MONTH", s: 68, c: "#f5f7fa" }]} /></group> : null}
    {dK > 0.02 ? <group position={[0.8, 10.2, -10.5]} scale={[dK, dK, 1]}><Sign p={[0, 0, 0]} s={[9.2, 0.9]} text="≈ 6,000,000 US DOLLARS" bg="#0d2f1a" fg="#8affc1" size={92} frame="#2fd46a" /></group> : null}
    <Plant p={[-8.6, 0, -4]} />
    <Plant p={[8.6, 0, -4]} />
  </>);
};

/* =================== S6 45.71 – 56.69  the workers + the charges =================== */
const K6: Key[] = [
  { t: 45.71, pos: [0, 4.4, 16.8], look: [0, 4.2, -6], fov: 60 },
  { t: 56.69, pos: [0, 4.2, 15.0], look: [0, 4.2, -6], fov: 57 },
];
const S6 = ({ t, f }: Ctx) => {
  const vK = seg(t, 47.0, 47.55, Easing.out(Easing.back(1.7)));
  const pK = seg(t, 49.2, 49.75, Easing.out(Easing.back(1.7)));
  const uK = seg(t, 53.25, 53.7, Easing.out(Easing.back(2.2)));
  const wK = seg(t, 56.15, 56.6, Easing.out(Easing.back(2.2)));
  const visa = (x: number, y: number, dly: number) => {
    const k = seg(t, 47.0 + dly, 47.5 + dly, Easing.out(Easing.back(1.7)));
    return k > 0.02 ? (
      <group key={x} position={[x, y, -6.4]} scale={[k, k, 1]}>
        <CanvasPlane p={[0, 0, 0]} s={[2.6, 1.65]} px={[440, 280]} frame="#38b6d9" draw={(c, W, H) => {
          c.fillStyle = "#0d2f47"; c.fillRect(0, 0, W, H);
          c.fillStyle = "#8ae8ff"; c.font = "900 54px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
          c.fillText("STUDENT", W / 2, 62); c.fillText("VISA", W / 2, 122);
          c.fillStyle = "#f5f7fa"; c.beginPath(); c.arc(W / 2, 205, 34, 0, 7); c.fill();
          c.fillRect(W / 2 - 44, 238, 88, 30);
        }} />
      </group>
    ) : null;
  };
  return (<>
    <Cam t={t} keys={K6} impacts={[[53.3, 0.09], [56.2, 0.09]]} />
    <Lights warm="#ffe9c4" />
    <Floor kind="tile" a="#1b2a44" b="#16233a" unit={2.6} w={60} d={50} />
    {/* three of the workers, visa cards floating over them */}
    {[-5.2, 0, 5.2].map((x, i) => (
      <Person key={i} p={[x, 0, -4.6]} h={3.7} look={worker} f={f + i * 11} pose={{ mood: "worry", arms: "down", lookX: i === 1 ? 0 : i === 0 ? 0.3 : -0.3, nerv: 0.55 }} />
    ))}
    {visa(-5.2, 5.6, 0)}
    {visa(0, 5.9, 0.18)}
    {visa(5.2, 5.6, 0.36)}
    {/* the charge sheet behind them */}
    <group position={[0, 8.6, -10.5]}>
      <CanvasPlane p={[0, 0, 0]} s={[11.5, 5.6]} px={[880, 430]} frame="#c9a227" draw={(c, W, H) => {
        c.fillStyle = "#e9e4d8"; c.fillRect(0, 0, W, H);
        c.fillStyle = "#23232e"; c.textAlign = "center"; c.textBaseline = "middle";
        c.font = "900 74px Inter, Arial"; c.fillText("CHARGE SHEET", W / 2, 66);
        c.fillStyle = "#5a6274";
        for (let i = 0; i < 4; i++) c.fillRect(90, 140 + i * 62, W - 180 - (i % 2) * 190, 17);
      }} />
    </group>
    {pK > 0.02 ? <group position={[0, 12.9, -10.8]} scale={[pK, pK, 1]}><Board p={[0, 0, 0]} w={9.6} lines={[{ t: "50,000 BAHT", s: 84, c: "#ffd36a" }, { t: "A MONTH", s: 72, c: "#f5f7fa" }]} /></group> : null}
    {uK > 0.02 ? <group position={[-2.2, 9.2, -9.9]} scale={[uK, uK, 1]}><Stamp p={[0, 0, 0]} w={6.8} text="UNLICENSED" /></group> : null}
    {wK > 0.02 ? <group position={[2.4, 7.6, -9.9]} scale={[wK, wK, 1]}><Stamp p={[0, 0, 0]} w={7.4} text="NO WORK PERMIT" /></group> : null}
    {vK > 0.02 ? <group position={[8.1, 12.9, -10.8]} scale={[vK, vK, 1]}><Sign p={[0, 0, 0]} s={[5.4, 0.9]} text="5 OF 6" bg="#0d2f47" fg="#8ae8ff" size={110} frame="#38b6d9" /></group> : null}
  </>);
};

/* =================== S7 56.69 – 63.35  closer: the investigation is widening =================== */
const K7: Key[] = [
  { t: 56.69, pos: [0, 4.4, 17.6], look: [0, 4.4, -6], fov: 60 },
  { t: 63.35, pos: [0, 4.2, 15.4], look: [0, 4.4, -6], fov: 57 },
];
const S7 = ({ t, f }: Ctx) => {
  const cK = seg(t, 59.25, 59.8, Easing.out(Easing.back(1.7)));
  const sK = seg(t, 61.65, 62.2, Easing.out(Easing.back(1.7)));
  const brandK = seg(t, 62.55, 63.05, Easing.out(Easing.back(1.7)));
  return (<>
    <Cam t={t} keys={K7} />
    <Lights warm="#bcd2ff" />
    <Stars p={[0, 13, -24]} s={[46, 15]} t={t} />
    <Floor kind="tile" a="#101a2c" b="#0c1424" unit={2.6} w={60} d={50} />
    {/* the house again, now behind police tape */}
    <House p={[0, 0, -12]} s={1.15} lit="#5a7292" />
    <group position={[0, 1.7, -6.2]} rotation={[0, 0, 0.045]}>
      <Box p={[0, 0, 0]} s={[15.5, 0.55, 0.06]} color="#ffd36a" line={1} />
      <CanvasPlane p={[0, 0, 0.06]} s={[15.5, 0.55]} px={[1400, 50]} draw={(c, W, H) => {
        c.clearRect(0, 0, W, H); c.fillStyle = "#14141f"; c.font = "900 34px Inter, Arial"; c.textAlign = "center"; c.textBaseline = "middle";
        for (let i = 0; i < 6; i++) c.fillText("POLICE LINE", 120 + i * 245, H / 2);
      }} />
    </group>
    {[-7.9, 7.9].map((x, i) => <Box key={i} p={[x, 0.85, -6.2]} s={[0.22, 1.7, 0.22]} color="#23232e" line={1} />)}
    {/* the commander, front and centre */}
    <Person p={[0, 0, -3.4]} h={4.0} look={commander} f={f} pose={{ mood: "deadpan", arms: "point", armK: 0.7, armR: [0.8, 0.6], lookX: 0.25 }} />
    <Person p={[-3.4, 0, -3.8]} h={3.8} look={officer} f={f} pose={{ mood: "deadpan", arms: "down", lookX: 0.3 }} />
    <Person p={[3.4, 0, -3.8]} h={3.8} look={officer} f={f} pose={{ mood: "deadpan", arms: "down", lookX: -0.3 }} />
    {cK > 0.02 ? <group position={[0, 12.6, -11]} scale={[cK, cK, 1]}><Board p={[0, 0, 0]} w={11.2} lines={[{ t: "POLICE REGION 2", s: 76, c: "#8ae8ff" }, { t: "CMDR. WASAN TECHA-AKRAKESOM", s: 44, c: "#f5f7fa" }]} /></group> : null}
    {sK > 0.02 ? <group position={[0, 9.9, -10.6]} scale={[sK, sK, 1]}><Sign p={[0, 0, 0]} s={[11.6, 0.95]} text="INVESTIGATION STILL WIDENING" bg="#101828" fg="#ffd36a" size={92} frame="#c9a227" /></group> : null}
    {brandK > 0.02 ? <group position={[0, 6.4, -9.8]} scale={[brandK, brandK, 1]}><Sign p={[0, 0, 0]} s={[8.6, 0.95]} text="THE DAILY TOON NEWS" bg="#12081f" fg="#ffd36a" size={100} frame="#7a4a8c" /></group> : null}
  </>);
};

const CUTS = [0, 7.33, 18.91, 24.22, 34.09, 45.71, 56.69, 63.35];
export const TdnV18: React.FC = () => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("mix.wav")} />
      <Scene first start={CUTS[0]} end={CUTS[1]} bg="#0a1120">{(c) => <S1 {...c} />}</Scene>
      <Scene start={CUTS[1]} end={CUTS[2]} bg="#101f38" trans="zoom">{(c) => <S2 {...c} />}</Scene>
      <Scene start={CUTS[2]} end={CUTS[3]} bg="#0d1830">{(c) => <S3 {...c} />}</Scene>
      <Scene start={CUTS[3]} end={CUTS[4]} bg="#080f1e" trans="flash">{(c) => <S4 {...c} />}</Scene>
      <Scene start={CUTS[4]} end={CUTS[5]} bg="#0a1120">{(c) => <S5 {...c} />}</Scene>
      <Scene start={CUTS[5]} end={CUTS[6]} bg="#132239" trans="zoom">{(c) => <S6 {...c} />}</Scene>
      <Scene start={CUTS[6]} end={CUTS[7]} bg="#080f1e" trans="whip">{(c) => <S7 {...c} />}</Scene>
      <Grade t={t} shaft={false} tint={t < 7.33 ? "rgba(255,170,80,.07)" : t < 18.91 ? "rgba(255,200,110,.06)" : t < 24.22 ? "rgba(120,190,255,.07)" : t < 34.09 ? "rgba(90,130,200,.08)" : t < 45.71 ? "rgba(255,120,90,.06)" : t < 56.69 ? "rgba(255,190,90,.06)" : "rgba(90,130,200,.08)"} />
      {/* S2 chip (9.5–16s): source attribution */}
      {t > 9.5 && t < 16 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(10,16,30,.88)", color: "#ffd36a", fontFamily: "Inter, Arial", fontWeight: 900, fontSize: 50, padding: "16px 30px", borderRadius: 18 }}>
            SOURCE: THAI POLICE STATEMENTS
          </span>
        </div>
      ) : null}
      <Captions />
    </AbsoluteFill>
  );
};
