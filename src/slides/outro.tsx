import React from "react";
import { C, F, MARBLES } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { clamp01, rnd, Slide } from "../deck/ui";
import { useAmbient } from "../deck/clock";
import { Marble } from "./kit";

/* Five event lanes merge into one stream, forever. */
const LANES = [560, 660, 760, 860, 960];
const MERGE_X = 1080;
const OUT_Y = 760;
const X0 = -40;
const X_END = 1980;
const SPEED = 210;

const pathPoint = (lane: number, x: number) => {
  if (x <= MERGE_X - 360) return { x, y: LANES[lane] };
  if (x >= MERGE_X) return { x, y: OUT_Y };
  const u = (x - (MERGE_X - 360)) / 360;
  const e = u * u * (3 - 2 * u);
  return { x, y: LANES[lane] + (OUT_Y - LANES[lane]) * e };
};

const Merge: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const marbles: React.ReactNode[] = [];
  LANES.forEach((_, lane) => {
    for (let k = 0; k < 6; k++) {
      const phase = rnd(lane * 17 + k * 5) * 2020;
      const x = X0 + ((phase + t * SPEED * (0.8 + 0.1 * lane)) % (X_END - X0));
      const pt = pathPoint(lane, x);
      marbles.push(<Marble key={`${lane}-${k}`} x={pt.x} y={pt.y} r={x > MERGE_X ? 22 : 18} c={MARBLES[(lane + k) % MARBLES.length]} />);
    }
  });
  const d = (lane: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= MERGE_X; x += 20) {
      const pt = pathPoint(lane, x);
      pts.push(`${pt.x},${pt.y}`);
    }
    return `M ${pts.join(" L ")}`;
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(p) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {LANES.map((_, lane) => (
          <path key={lane} d={d(lane)} stroke={C.line} strokeWidth={3} fill="none" opacity={0.8} />
        ))}
        <line x1={MERGE_X} y1={OUT_Y} x2={1920} y2={OUT_Y} stroke={C.teal} strokeWidth={5} opacity={0.6} />
      </svg>
      {marbles}
      <div style={{ position: "absolute", left: MERGE_X - 110, top: OUT_Y - 46, width: 200, height: 92, borderRadius: 18, border: `3px solid ${C.teal}`, background: "rgba(16,23,46,0.92)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 34, color: C.teal }}>
        merge
      </div>
    </div>
  );
};

const Outro: React.FC = () => {
  const { s } = useSteps();
  const words = ["Дякую", "за", "увагу!"];
  return (
    <Slide lanes={false}>
      <Merge p={s(0, 10)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 142, color: C.text }}>
        {words.map((w, i) => {
          const p = s(0, 6 + i * 6, POP);
          return (
            <span key={w} style={{ display: "inline-block", whiteSpace: "pre", opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + (i < words.length - 1 ? " " : "")}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 345, textAlign: "center", fontFamily: F.head, fontStyle: "italic", fontWeight: 500, fontSize: 44, color: C.dim, opacity: clamp01(s(0, 30)) }}>
        Питання?
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 52, fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: C.faint, opacity: clamp01(s(0, 40)) }}>made with Claude Opus 5.5</div>
    </Slide>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
