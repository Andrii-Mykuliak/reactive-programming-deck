import React from "react";
import { C, F, MARBLES } from "../deck/theme";
import { mix, POP, useSteps } from "../deck/steps";
import { clamp01 } from "../deck/ui";

export type Ev = { at: number; v?: React.ReactNode; c?: string; w?: number };

/** A single marble. */
export const Marble: React.FC<{ x: number; y: number; r?: number; w?: number; c?: string; v?: React.ReactNode; p?: number; glow?: number; size?: number }> = ({
  x,
  y,
  r = 30,
  w,
  c = C.teal,
  v,
  p = 1,
  glow = 0,
  size,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - (w ?? r * 2) / 2,
      top: y - r,
      width: w ?? r * 2,
      height: r * 2,
      borderRadius: r,
      background: `radial-gradient(circle at 35% 30%, ${c} 0%, ${c}cc 55%, ${c}88 100%)`,
      boxShadow: glow > 0.02 ? `0 0 ${30 * glow}px ${c}` : `0 4px 14px rgba(0,0,0,0.4)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: size ?? r * 0.9,
      color: "#0b1020",
      opacity: clamp01(p),
      transform: `scale(${mix(0.3, 1, clamp01(p))})`,
      whiteSpace: "nowrap",
    }}
  >
    {v}
  </div>
);

/**
 * Marble lane: a time axis that draws itself, then each event appears when the playhead passes it.
 * `at` is the event position in [0, 1] along the lane.
 */
export const Lane: React.FC<{
  x: number;
  y: number;
  w: number;
  events: Ev[];
  step: number;
  delay?: number;
  dur?: number;
  label?: React.ReactNode;
  labelW?: number;
  r?: number;
  complete?: number;
  error?: number;
  color?: string;
}> = ({ x, y, w, events, step, delay = 0, dur = 60, label, labelW = 0, r = 28, complete, error, color = C.dim }) => {
  const { lin, s, t } = useSteps();
  const draw = lin(step, delay, 14);
  const head = lin(step, delay + 10, dur);
  const x0 = x + labelW;
  const span = w - labelW - 40;
  return (
    <>
      {label !== undefined && (
        <div
          style={{
            position: "absolute",
            left: x,
            top: y - 24,
            width: labelW - 20,
            height: 48,
            display: "flex",
            alignItems: "center",
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 28,
            color,
            opacity: clamp01(draw * 2),
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible" }}>
        <line x1={x0} y1={y} x2={x0 + (w - labelW) * draw} y2={y} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <polygon points={`${x0 + w - labelW},${y} ${x0 + w - labelW - 18},${y - 10} ${x0 + w - labelW - 18},${y + 10}`} fill={C.line} opacity={draw > 0.95 ? 1 : 0} />
        {complete !== undefined && head >= complete && (
          <line x1={x0 + span * complete} y1={y - 30} x2={x0 + span * complete} y2={y + 30} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
        )}
        {error !== undefined && head >= error && (
          <g stroke={C.coral} strokeWidth={6} strokeLinecap="round">
            <line x1={x0 + span * error - 18} y1={y - 18} x2={x0 + span * error + 18} y2={y + 18} />
            <line x1={x0 + span * error + 18} y1={y - 18} x2={x0 + span * error - 18} y2={y + 18} />
          </g>
        )}
      </svg>
      {events.map((e, i) => {
        const on = head >= e.at;
        const since = on ? t(step, delay + 10 + e.at * dur) : -1;
        const p = on ? s(step, delay + 10 + e.at * dur, POP) : 0;
        const glow = since >= 0 ? Math.max(0, 1 - since / 20) : 0;
        return <Marble key={i} x={x0 + span * e.at} y={y} r={r} w={e.w} c={e.c ?? MARBLES[i % MARBLES.length]} v={e.v} p={p} glow={glow} />;
      })}
    </>
  );
};

/** Operator box placed between two lanes. */
export const OpBox: React.FC<{ x: number; y: number; w: number; h?: number; p: number; color?: string; children: React.ReactNode; glow?: number }> = ({
  x,
  y,
  w,
  h = 72,
  p,
  color = C.violet,
  children,
  glow = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 14,
      border: `2.5px solid ${color}`,
      background: `${color}18`,
      boxShadow: glow > 0.02 ? `0 0 ${28 * glow}px ${color}` : undefined,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: 32,
      color,
      boxSizing: "border-box",
      opacity: clamp01(p),
      transform: `scaleX(${mix(0.85, 1, clamp01(p))})`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

/** Numbered marker, the same one the agenda uses. */
export const Num: React.FC<{ n: number; color?: string; size?: number }> = ({ n, color = C.teal, size = 64 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      border: `3px solid ${color}`,
      background: `${color}1f`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.head,
      fontWeight: 600,
      fontVariantNumeric: "lining-nums",
      fontSize: size * 0.54,
      color,
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);

/** Bullet line with a small marble. */
export const Bullet: React.FC<{ x: number; y: number; w: number; step: number; delay?: number; color?: string; size?: number; children: React.ReactNode }> = ({
  x,
  y,
  w,
  step,
  delay = 0,
  color = C.teal,
  size = 34,
  children,
}) => {
  const { s } = useSteps();
  const p = s(step, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        display: "flex",
        gap: 22,
        alignItems: "flex-start",
        fontFamily: F.body,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.35,
        color: C.text,
        opacity: clamp01(p),
        transform: `translateX(${(1 - p) * -24}px)`,
      }}
    >
      <span style={{ marginTop: size * 0.42, width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 12px ${color}`, flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  );
};
