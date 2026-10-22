import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F, MARBLES } from "./theme";
import { clamp01, mix, POP, SpringCfg, useSteps } from "./steps";
import { useAmbient } from "./clock";

type Dir = "up" | "down" | "left" | "right" | "scale" | "none";

export { clamp01 };

export const useAppear = (step = 0, delay = 0, dir: Dir = "up", dist = 36, cfg?: SpringCfg, exit?: number) => {
  const { s } = useSteps();
  const p = s(step, delay, cfg);
  const out = exit === undefined ? 0 : s(exit, 0);
  const off = (1 - p) * dist;
  const transform =
    dir === "up" ? `translateY(${off}px)`
    : dir === "down" ? `translateY(${-off}px)`
    : dir === "left" ? `translateX(${-off}px)`
    : dir === "right" ? `translateX(${off}px)`
    : dir === "scale" ? `scale(${mix(0.8, 1, p)})`
    : undefined;
  return { opacity: Math.min(1, p) * (1 - out), transform, p };
};

export const Appear: React.FC<{
  step?: number;
  delay?: number;
  dir?: Dir;
  dist?: number;
  pop?: boolean;
  exit?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ step = 0, delay = 0, dir = "up", dist, pop, exit, style, children }) => {
  const a = useAppear(step, delay, dir, dist, pop ? POP : undefined, exit);
  return <div style={{ ...style, opacity: a.opacity, transform: a.transform }}>{children}</div>;
};

/** Absolutely positioned, animated block. */
export const At: React.FC<{
  x: number;
  y: number;
  w?: number;
  step?: number;
  delay?: number;
  dir?: Dir;
  dist?: number;
  pop?: boolean;
  exit?: number;
  size?: number;
  weight?: number;
  color?: string;
  font?: string;
  align?: React.CSSProperties["textAlign"];
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x, y, w, step, delay, dir, dist, pop, exit, size = 36, weight = 700, color = C.text, font = F.body, align, style, children }) => (
  <Appear
    step={step}
    delay={delay}
    dir={dir}
    dist={dist}
    pop={pop}
    exit={exit}
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1.35,
      textAlign: align,
      ...style,
    }}
  >
    {children}
  </Appear>
);

/** Accent-coloured span. */
export const A: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.accentHi }) => (
  <span style={{ color: c }}>{children}</span>
);

/** Inline monospace. */
export const M: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.teal }) => (
  <span style={{ fontFamily: F.mono, color: c, fontWeight: 700, fontVariantLigatures: "none" }}>{children}</span>
);

export const Lead: React.FC<{ children: React.ReactNode; step?: number; delay?: number; y?: number; size?: number; w?: number }> = ({
  children,
  step = 0,
  delay = 10,
  y = 184,
  size = 38,
  w = 1720,
}) => (
  <At x={96} y={y} w={w} step={step} delay={delay} size={size} weight={700}>
    {children}
  </At>
);

/** Deterministic pseudo-random number in [0, 1). */
export const rnd = (n: number) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Ink background: soft glows, a dot grid and faint event lanes with marbles drifting along them. */
export const Backdrop: React.FC<{ lanes?: boolean }> = ({ lanes = true }) => {
  const t = useAmbient();
  const LANES = [300, 560, 820];
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 12% 8%, rgba(62,230,196,0.10) 0%, rgba(0,0,0,0) 42%), radial-gradient(ellipse at 92% 96%, rgba(160,140,255,0.12) 0%, rgba(0,0,0,0) 48%), linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.grid} 1.6px, transparent 1.7px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "20px 20px",
          opacity: 0.9,
        }}
      />
      {lanes && (
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", opacity: 0.22 }}>
          {LANES.map((y, i) => (
            <g key={i}>
              <line x1={0} y1={y} x2={1920} y2={y} stroke={C.line} strokeWidth={1.5} strokeDasharray="2 10" />
              {Array.from({ length: 4 }, (_, k) => {
                const speed = 26 + rnd(i * 7 + k) * 22;
                const x = ((rnd(i * 13 + k * 3) * 1920 + t * speed) % 2040) - 60;
                return <circle key={k} cx={x} cy={y} r={7} fill={MARBLES[(i + k) % MARBLES.length]} />;
              })}
            </g>
          ))}
        </svg>
      )}
    </>
  );
};

/** Section label in the top-right corner and corner ticks; the title rule is an event lane. */
export const Frame: React.FC<{ rule?: boolean }> = ({ rule = true }) => {
  const { s } = useSteps();
  const t = useAmbient();
  const p = s(0, 0);
  const tick = (x: number, y: number, dx: number, dy: number) => `M ${x + dx * 26} ${y} L ${x} ${y} L ${x} ${y + dy * 26}`;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {[
          tick(36, 36, 1, 1),
          tick(1884, 36, -1, 1),
          tick(36, 1044, 1, -1),
          tick(1884, 1044, -1, -1),
        ].map((d, i) => (
          <path key={i} d={d} stroke={C.line} strokeWidth={3} fill="none" />
        ))}
        {rule && (
          <g opacity={clamp01(p)}>
            <line x1={96} y1={152} x2={96 + 1728 * clamp01(p)} y2={152} stroke={C.line} strokeWidth={2} />
            {[0, 1, 2].map((k) => {
              const x = 96 + ((t * 70 + k * 576) % 1728);
              return <circle key={k} cx={x} cy={152} r={6} fill={MARBLES[k]} opacity={0.85} />;
            })}
          </g>
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          right: 96,
          top: 50,
          fontFamily: F.body,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: 3,
          color: C.faint,
          textTransform: "uppercase",
        }}
      >
        Декларативні та суміжні парадигми
      </div>
    </>
  );
};

export const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { s } = useSteps();
  const p = s(0, 2);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        top: 70,
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: F.head,
        fontSize: 50,
        fontWeight: 500,
        color: C.text,
        letterSpacing: -0.5,
        whiteSpace: "nowrap",
        clipPath: `inset(-10px ${(1 - p) * 100}% -10px -10px)`,
        transform: `translateX(${(1 - p) * -30}px)`,
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: 9, background: C.teal, boxShadow: `0 0 18px ${C.teal}` }} />
      {children}
    </div>
  );
};

export const Slide: React.FC<{ title?: React.ReactNode; children?: React.ReactNode; frame?: boolean; lanes?: boolean }> = ({
  title,
  children,
  frame = true,
  lanes = true,
}) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: F.body, color: C.text, overflow: "hidden" }}>
    <Backdrop lanes={lanes} />
    {frame && <Frame rule={!!title} />}
    {title ? <Title>{title}</Title> : null}
    {children}
  </AbsoluteFill>
);

/** Rounded panel with an optional coloured heading strip. */
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  title?: React.ReactNode;
  color?: string;
  tag?: string;
  p?: number;
  glow?: number;
  dim?: number;
  pad?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, title, color = C.teal, tag, p = 1, glow = 0, dim = 0, pad = "18px 26px 22px", children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 18,
      background: `linear-gradient(180deg, ${C.panel2} 0%, ${C.panel} 100%)`,
      border: `2px solid ${glow > 0.3 ? color : C.line}`,
      boxShadow: glow > 0.02 ? `0 0 ${34 * glow}px ${color}88` : "0 10px 30px rgba(0,0,0,0.35)",
      boxSizing: "border-box",
      opacity: clamp01(p) * (1 - 0.6 * clamp01(dim)),
      transform: `translateY(${(1 - p) * 26}px)`,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: color }} />
    {title !== undefined && (
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 26px 0 30px" }}>
        <div style={{ fontFamily: F.head, fontSize: 30, fontWeight: 500, color, whiteSpace: "nowrap" }}>{title}</div>
        {tag && <div style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 22, fontWeight: 700, color: C.faint }}>{tag}</div>}
      </div>
    )}
    <div style={{ padding: pad, paddingLeft: 30 }}>{children}</div>
  </div>
);

/** Rounded chip with monospace content. */
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.teal, size = 32, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${size * 0.22}px ${size * 0.5}px`,
      borderRadius: size * 0.5,
      background: `${color}1c`,
      border: `2px solid ${color}`,
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: size,
      color,
      whiteSpace: "pre",
      lineHeight: 1.2,
      fontVariantLigatures: "none",
      ...style,
    }}
  >
    {children}
  </div>
);

/** SVG arrow that draws itself. */
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  step: number;
  delay?: number;
  dur?: number;
  color?: string;
  width?: number;
  curve?: number;
  dash?: string;
}> = ({ x1, y1, x2, y2, step, delay = 0, dur = 18, color = C.dim, width = 4, curve = 0, dash }) => {
  const { lin } = useSteps();
  const p = lin(step, delay, dur);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * curve;
  const cy = my + (dx / len) * curve;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const L = len * (1 + Math.abs(curve) / len);
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const head = 16;
  const pts = [
    [x2, y2],
    [x2 - head * Math.cos(ang - 0.45), y2 - head * Math.sin(ang - 0.45)],
    [x2 - head * Math.cos(ang + 0.45), y2 - head * Math.sin(ang + 0.45)],
  ]
    .map((q) => q.join(","))
    .join(" ");
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      {dash ? (
        <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={dash} opacity={p} />
      ) : (
        <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      )}
      <polygon points={pts} fill={color} opacity={interpolate(p, [0.85, 1], [0, 1], { extrapolateLeft: "clamp" })} />
    </svg>
  );
};

/** Triangular glow that peaks `peak` frames after `tt` reaches 0; zero before that. */
export const pulse = (tt: number, peak: number, width: number) => (tt < 0 ? 0 : Math.max(0, 1 - Math.abs(tt - peak) / width));
