import React from "react";
import { C, F, MARBLES } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { At, clamp01, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { useAmbient } from "../deck/clock";
import { Marble, Num } from "./kit";

/* Title: numbers flow through filter (even) and map (×10), forever. */
const PIPE_Y = 820;
const PX0 = 96;
const PX1 = 1080;
const FILTER_X = 430;
const MAP_X = 760;
const BOX_W = 170;
const SPAWN = 0.95;
const SPEED = 190;

const TitlePipeline: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const marbles: React.ReactNode[] = [];
  const first = Math.max(0, Math.floor((t - (PX1 - PX0) / SPEED) / SPAWN));
  for (let i = first; i <= Math.floor(t / SPAWN); i++) {
    const x = PX0 + (t - i * SPAWN) * SPEED;
    if (x < PX0 || x > PX1) continue;
    const v = (i % 6) + 1;
    const passedFilter = x > FILTER_X + BOX_W / 2;
    const passedMap = x > MAP_X + BOX_W / 2;
    const dropped = v % 2 === 1 && passedFilter;
    const drop = dropped ? clamp01((x - FILTER_X - BOX_W / 2) / 120) : 0;
    if (drop >= 1) continue;
    marbles.push(
      <Marble
        key={i}
        x={x}
        y={PIPE_Y + drop * 90}
        r={passedMap ? 34 : 28}
        c={passedMap ? C.teal : MARBLES[(v + 1) % MARBLES.length]}
        v={passedMap ? v * 10 : v}
        p={1 - drop}
      />,
    );
  }
  const box = (x: number, op: string, note: string, color: string) => (
    <div style={{ position: "absolute", left: x, top: PIPE_Y - 56, width: BOX_W, height: 112, borderRadius: 18, border: `3px solid ${color}`, background: "rgba(16,23,46,0.82)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
      <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 32, color }}>{op}</div>
      <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.dim }}>{note}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(p) }}>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={PX0} y1={PIPE_Y} x2={PX1} y2={PIPE_Y} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <polygon points={`${PX1 + 22},${PIPE_Y} ${PX1},${PIPE_Y - 12} ${PX1},${PIPE_Y + 12}`} fill={C.line} />
      </svg>
      {marbles}
      {box(FILTER_X, "filter", "парні", C.violet)}
      {box(MAP_X, "map", "× 10", C.amber)}
    </div>
  );
};

const TitleSlide: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <At x={96} y={150} step={0} delay={4} size={34} weight={500} color={C.teal} font={F.head} style={{ letterSpacing: 6 }}>
        ЛЕКЦІЯ 12
      </At>
      <At x={90} y={228} step={0} delay={10} size={116} weight={700} font={F.head} style={{ letterSpacing: -2, lineHeight: 1.05 }}>
        Реактивне
      </At>
      <At x={90} y={354} step={0} delay={16} size={116} weight={700} font={F.head} style={{ letterSpacing: -2, lineHeight: 1.05 }}>
        програмування
      </At>
      <At x={96} y={530} step={0} delay={26} size={38} weight={700} color={C.dim}>
        потоки подій, оператори і реакція на зміни
      </At>
      <TitlePipeline p={s(0, 34)} />
      <AuthorBlock />
    </Slide>
  );
};

/* Epigraph: a mouse leaves a trail of events, the events fill a table. */
const EMIT = 9;
const ROWS = 6;
const mousePath = (u: number) => ({
  x: 210 + 520 * u,
  y: 650 + 95 * Math.sin(u * Math.PI * 2.2) - 40 * u,
});

const MouseDemo: React.FC = () => {
  const { s, t } = useSteps();
  const tt = Math.max(0, t(0, 40));
  const u = Math.min(1, tt / 150);
  const n = Math.floor((u * 150) / EMIT) + (tt > 0 ? 1 : 0);
  const events = Array.from({ length: n }, (_, i) => {
    const pt = mousePath(Math.min(1, (i * EMIT) / 150));
    return { ...pt, ms: i * 40 };
  });
  const cur = mousePath(u);
  const pad = s(0, 30, POP);
  const tableP = s(0, 36, POP);
  const shown = events.slice(-ROWS);
  return (
    <>
      <div style={{ position: "absolute", left: 150, top: 470, width: 650, height: 340, borderRadius: 26, border: `2px solid ${C.line}`, background: "rgba(16,23,46,0.7)", opacity: clamp01(pad) }} />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(pad) }}>
        {events.map((e, i) => (
          <circle key={i} cx={e.x} cy={e.y} r={9} fill={MARBLES[i % MARBLES.length]} opacity={0.35 + 0.65 * (i / Math.max(1, n - 1))} />
        ))}
        <path d={`M ${cur.x} ${cur.y} l 0 34 l 9 -9 l 7 15 l 6 -3 l -7 -14 l 13 -1 Z`} fill={C.text} stroke={C.bg} strokeWidth={2} />
      </svg>
      <div style={{ position: "absolute", left: 900, top: 470, width: 860, borderRadius: 22, border: `2px solid ${C.line}`, background: "rgba(16,23,46,0.85)", opacity: clamp01(tableP), transform: `translateY(${(1 - tableP) * 20}px)`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "16px 34px", fontFamily: F.body, fontWeight: 800, fontSize: 28, color: C.dim, borderBottom: `2px solid ${C.line}` }}>
          <span>x</span>
          <span>y</span>
          <span>час, мс</span>
        </div>
        {Array.from({ length: ROWS }, (_, r) => {
          const e = shown[r];
          const isNew = e && r === shown.length - 1;
          return (
            <div key={r} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 34px", height: 44, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: isNew ? C.teal : C.text, background: isNew ? "rgba(62,230,196,0.08)" : undefined }}>
              {e ? (
                <>
                  <span>{Math.round(e.x)}</span>
                  <span>{Math.round(e.y)}</span>
                  <span>{e.ms}</span>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

const QUOTE = ["Your", "mouse", "is", "a", "database."];

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <div style={{ position: "absolute", left: 150, top: 170, fontFamily: F.head, fontSize: 92, fontWeight: 700, letterSpacing: -1, color: C.text, whiteSpace: "nowrap" }}>
        {QUOTE.map((w, i) => {
          const p = s(0, 4 + i * 5, POP);
          const hl = w === "mouse" ? C.amber : w === "database." ? C.teal : undefined;
          return (
            <span key={i} style={{ display: "inline-block", whiteSpace: "pre", color: hl, opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + " "}
            </span>
          );
        })}
      </div>
      <At x={156} y={318} step={0} delay={30} size={30} weight={700} color={C.dim}>
        Erik Meijer, «Your Mouse is a Database», ACM Queue, 2012
      </At>
      <MouseDemo />
      <At x={150} y={856} w={1620} step={1} size={36} weight={700}>
        Події від миші утворюють <span style={{ color: C.teal }}>колекцію</span>, яку можна опитувати, як таблицю бази даних, тільки її рядки надходять <span style={{ color: C.amber }}>з часом</span>.
      </At>
      <At x={150} y={966} w={1620} step={1} delay={18} size={28} weight={600} color={C.dim}>
        Ерік Мейєр – один із творців бібліотеки Reactive Extensions (Rx)
      </At>
    </Slide>
  );
};

const AGENDA = [
  "Історія розвитку реактивного програмування",
  "Основні принципи реактивного програмування",
  "Функціональне реактивне програмування",
  "Засоби реалізації реактивних принципів",
  "Подійно-орієнтована архітектура",
  "Реактивні бібліотеки та фреймворки",
];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = !full && i === active ? s(0, 10) : 0;
        const dim = full || i === active ? 1 : 0.32;
        const color = MARBLES[i % MARBLES.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 96,
              top: 206 + i * 128,
              width: 1500,
              height: 104,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 30px",
              borderRadius: 20,
              boxSizing: "border-box",
              border: `2px solid ${on > 0.5 ? color : "transparent"}`,
              background: on > 0.5 ? `${color}14` : undefined,
              boxShadow: on > 0.5 ? `0 0 ${30 * on}px ${color}55` : undefined,
              opacity: clamp01(p) * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            <Num n={i + 1} color={color} />
            <div style={{ fontFamily: F.body, fontSize: 44, fontWeight: 800, color: C.text, whiteSpace: "nowrap" }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [200, 80], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [70], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
