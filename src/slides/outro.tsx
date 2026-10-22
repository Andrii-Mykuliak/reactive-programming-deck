import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MARBLES } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { clamp01, rnd } from "../deck/ui";
import { useAmbient } from "../deck/clock";

/* Event streams spiral in from every edge and merge in a pulsing core that sends rings of light outwards. */
const CX = 960;
const CY = 650;
const ARMS = 16;
const R0 = 1250;
const TWIST = 2.3;
const PER_ARM = 4;
const TRAIL = 9;
const RING_EVERY = 0.55;
const RING_LIFE = 3.2;

const armPoint = (k: number, u: number) => {
  const a = (k / ARMS) * Math.PI * 2 + TWIST * u * u;
  const r = R0 * (1 - u);
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) * 0.82 };
};

const armPath = (k: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const p = armPoint(k, i / 60);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return `M ${pts.join(" L ")}`;
};
const ARM_PATHS = Array.from({ length: ARMS }, (_, k) => armPath(k));

const Vortex: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const marbles: React.ReactNode[] = [];
  let arrivals = 0;
  for (let k = 0; k < ARMS; k++) {
    const speed = 0.16 + rnd(k * 3.1) * 0.08;
    for (let j = 0; j < PER_ARM; j++) {
      const u = (t * speed + j / PER_ARM + rnd(k * 7 + j)) % 1;
      if (u > 0.94) arrivals += 1;
      const col = MARBLES[(k + j) % MARBLES.length];
      for (let q = TRAIL - 1; q >= 0; q--) {
        const uq = u - q * 0.011;
        if (uq < 0) continue;
        const pt = armPoint(k, uq);
        const size = (5 + 13 * uq) * (1 - q / TRAIL);
        marbles.push(<circle key={`${k}-${j}-${q}`} cx={pt.x} cy={pt.y} r={Math.max(1, size)} fill={col} opacity={(1 - q / TRAIL) * (0.35 + 0.65 * uq)} />);
      }
    }
  }
  const rings: React.ReactNode[] = [];
  const n0 = Math.floor((t - RING_LIFE) / RING_EVERY);
  for (let n = Math.max(0, n0); n <= Math.floor(t / RING_EVERY); n++) {
    const age = t - n * RING_EVERY;
    if (age < 0 || age > RING_LIFE) continue;
    const a = age / RING_LIFE;
    rings.push(
      <ellipse key={n} cx={CX} cy={CY} rx={70 + a * 1100} ry={(70 + a * 1100) * 0.82} fill="none" stroke={MARBLES[n % MARBLES.length]} strokeWidth={6 * (1 - a) + 1} opacity={(1 - a) * 0.75} />,
    );
  }
  const beat = 0.5 + 0.5 * Math.sin(t * 7);
  const core = 64 + 10 * beat + Math.min(12, arrivals * 1.5);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(p) }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="coreGrad">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor={C.teal} />
          <stop offset="1" stopColor={C.teal} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="haze">
          <stop offset="0" stopColor={C.violet} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.violet} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={CX} cy={CY} rx={760} ry={560} fill="url(#haze)" />
      {ARM_PATHS.map((d, k) => (
        <path key={k} d={d} fill="none" stroke={MARBLES[k % MARBLES.length]} strokeWidth={1.5} opacity={0.18} />
      ))}
      <g filter="url(#glow)">{rings}</g>
      <g filter="url(#glow)">{marbles}</g>
      <circle cx={CX} cy={CY} r={core * 2.4} fill="url(#coreGrad)" opacity={0.55} />
      <circle cx={CX} cy={CY} r={core} fill="url(#coreGrad)" filter="url(#glow)" />
      <text x={CX} y={CY + 12} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={34} fill={C.bg}>
        merge
      </text>
    </svg>
  );
};

const Outro: React.FC = () => {
  const { s } = useSteps();
  const words = ["Дякую", "за", "увагу!"];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #121c38 0%, #070b16 70%)`, overflow: "hidden" }}>
      <Vortex p={s(0, 4)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 142, color: C.text, textShadow: "0 6px 40px rgba(0,0,0,0.8)" }}>
        {words.map((w, i) => {
          const p = s(0, 6 + i * 6, POP);
          return (
            <span key={w} style={{ display: "inline-block", whiteSpace: "pre", opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + (i < words.length - 1 ? " " : "")}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: F.head, fontStyle: "italic", fontWeight: 500, fontSize: 44, color: C.dim, opacity: clamp01(s(0, 30)), textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>
        Питання?
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 52, fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: C.faint, opacity: clamp01(s(0, 40)) }}>made with Claude Opus 5.5</div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
