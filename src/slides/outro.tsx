import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { clamp01 } from "../deck/ui";
import { useAmbient } from "../deck/clock";

/* The classic reactive example: a spreadsheet. An input cell changes and the dependent cells recompute by themselves. */
const PRICES = [100, 120, 80, 150];
const QTYS = [3, 4, 5, 2];
const CYCLE = 3;
const LAG_C = 0.6;
const LAG_D = 1.2;

const stateAt = (k: number) => {
  const price = PRICES[Math.ceil(Math.max(0, k) / 2) % PRICES.length];
  const qty = QTYS[Math.floor(Math.max(0, k) / 2) % QTYS.length];
  const sum = price * qty;
  return { price, qty, sum, vat: Math.round(sum * 1.2) };
};

const COLS = ["A", "B", "C", "D"];
const LABELS = ["Ціна", "Кількість", "Сума", "З ПДВ"];
const FORMULAS = ["", "", "= A2 * B2", "= C2 * 1.2"];
const X0 = 330;
const CW = 315;
const ROW_Y = 600;

const Sheet: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const k = Math.floor(t / CYCLE);
  const age = t - k * CYCLE;
  const now = stateAt(k);
  const before = stateAt(k - 1);
  const changed = k % 2 === 1 ? 0 : 1;
  const shown = [now.price, now.qty, age >= LAG_C ? now.sum : before.sum, age >= LAG_D ? now.vat : before.vat];
  const flash = (since: number) => (since < 0 ? 0 : Math.max(0, 1 - since / 0.9));
  const glow = [changed === 0 ? flash(age) : 0, changed === 1 ? flash(age) : 0, flash(age - LAG_C), flash(age - LAG_D)];
  const active = age < LAG_C ? changed : age < LAG_D ? 2 : 3;
  const cellX = (i: number) => X0 + i * CW;
  const edge = (from: number, to: number, on: number, lift: number) => {
    const x1 = cellX(from) + CW / 2;
    const x2 = cellX(to) + CW / 2;
    const y = ROW_Y + 170;
    return (
      <path
        key={`${from}-${to}`}
        d={`M ${x1} ${y} C ${x1} ${y + lift}, ${x2} ${y + lift}, ${x2} ${y + 6}`}
        fill="none"
        stroke={on > 0.05 ? C.teal : C.line}
        strokeWidth={on > 0.05 ? 2.5 : 1.8}
        opacity={0.5 + 0.5 * on}
        markerEnd="url(#arr)"
      />
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(p) }}>
      <div style={{ position: "absolute", left: X0, top: ROW_Y - 120, width: CW * 4, height: 56, borderRadius: 8, border: `1.5px solid ${C.line}`, background: C.panel, display: "flex", alignItems: "center", gap: 22, padding: "0 20px", boxSizing: "border-box", fontFamily: F.mono, fontSize: 26, fontWeight: 600 }}>
        <span style={{ color: C.faint, fontStyle: "italic" }}>fx</span>
        <span style={{ color: C.dim }}>{`${COLS[active]}2`}</span>
        <span style={{ color: C.text }}>{FORMULAS[active] || String(shown[active])}</span>
      </div>
      {COLS.map((c, i) => (
        <React.Fragment key={c}>
          <div style={{ position: "absolute", left: cellX(i), top: ROW_Y - 50, width: CW, textAlign: "center", fontFamily: F.mono, fontSize: 22, color: C.faint }}>{c}</div>
          <div style={{ position: "absolute", left: cellX(i), top: ROW_Y - 18, width: CW, height: 64, boxSizing: "border-box", border: `1.5px solid ${C.line}`, borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.head, fontStyle: "italic", fontSize: 32, color: C.dim, background: "rgba(20,29,51,0.6)" }}>
            {LABELS[i]}
          </div>
          <div
            style={{
              position: "absolute",
              left: cellX(i),
              top: ROW_Y + 46,
              width: CW,
              height: 110,
              boxSizing: "border-box",
              border: `1.5px solid ${glow[i] > 0.05 || active === i ? (i < 2 ? C.amber : C.teal) : C.line}`,
              background: `rgba(${i < 2 ? "233,184,92" : "79,211,182"},${0.04 + 0.16 * glow[i]})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 54,
              color: i < 2 ? C.text : C.teal,
            }}
          >
            {shown[i]}
          </div>
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: X0 - 44, top: ROW_Y + 82, fontFamily: F.mono, fontSize: 24, color: C.faint }}>2</div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={C.dim} />
          </marker>
        </defs>
        {edge(0, 2, glow[2], 120)}
        {edge(1, 2, glow[2], 70)}
        {edge(2, 3, glow[3], 70)}
      </svg>
      <div style={{ position: "absolute", left: X0, top: ROW_Y + 300, width: CW * 4, textAlign: "center", fontFamily: F.head, fontStyle: "italic", fontSize: 30, color: C.dim }}>
        Електронна таблиця – найпоширеніша реактивна програма: змінюється вхід, і залежні клітинки перераховуються самі.
      </div>
    </div>
  );
};

const Outro: React.FC = () => {
  const { s } = useSteps();
  const words = ["Дякую", "за", "увагу!"];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #111a30 0%, #0a0f1d 75%)`, overflow: "hidden", userSelect: "none" }}>
      <Sheet p={s(0, 20)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 142, color: C.text }}>
        {words.map((w, i) => {
          const p = s(0, 6 + i * 6, POP);
          return (
            <span key={w} style={{ display: "inline-block", whiteSpace: "pre", opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + (i < words.length - 1 ? " " : "")}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: F.head, fontStyle: "italic", fontWeight: 500, fontSize: 44, color: C.dim, opacity: clamp01(s(0, 30)) }}>
        Питання?
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 52, fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: C.faint, opacity: clamp01(s(0, 40)) }}>made with Claude Opus 5.5</div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
