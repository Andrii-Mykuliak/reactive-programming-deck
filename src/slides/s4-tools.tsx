import React from "react";
import { interpolate } from "remotion";
import { C, F, MARBLES } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Marble } from "./kit";

const ease = (v: number) => {
  const x = clamp01(v);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

/* Tools grouped by explicitness */
const TIERS = [
  { k: "Високий", c: C.teal, tools: [["Observer", "Reactive Extensions"], ["Модель акторів", "Akka"], ["EDA", "Apache Kafka"]] },
  { k: "Середній", c: C.amber, tools: [["async/await", "C#, Python"], ["Співпрограми", "Kotlin, Lua"], ["Promises/Futures", "JavaScript, Java, Scala"]] },
  { k: "Низький", c: C.coral, tools: [["Пули потоків", "Java, C#"], ["Event Loop", "Node.js"]] },
];

const Tools: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Засоби за ступенем експліцитності">
      <Lead size={36}>Реактивне програмування є в багатьох мовах, але різні засоби виражають його з різною явністю.</Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(s(1, 0)) }}>
        <defs>
          <linearGradient id="expl" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={C.coral} />
            <stop offset="0.5" stopColor={C.amber} />
            <stop offset="1" stopColor={C.teal} />
          </linearGradient>
        </defs>
        <rect x={104} y={318} width={10} height={540} rx={5} fill="url(#expl)" />
        <polygon points="109,296 94,324 124,324" fill={C.teal} />
      </svg>
      <At x={136} y={290} step={1} size={24} weight={800} color={C.dim}>
        явність
      </At>
      {TIERS.map((tier, i) => {
        const y = 320 + i * 186;
        return (
          <React.Fragment key={tier.k}>
            <At x={160} y={y + 44} step={i + 1} size={34} weight={800} color={tier.c} font={F.head}>
              {tier.k}
            </At>
            {tier.tools.map(([name, impl], k) => (
              <Panel key={name} x={500 + k * 450} y={y} w={420} h={160} color={tier.c} p={s(i + 1, 6 + k * 6, POP)} pad="20px 24px">
                <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 32, color: C.text }}>{name}</div>
                <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.dim, marginTop: 10 }}>{impl}</div>
              </Panel>
            ))}
          </React.Fragment>
        );
      })}
      <At x={96} y={900} w={1728} step={4} size={30} weight={700}>
        Явні засоби дають чіткі абстракції; неявні ефективні, але ховають реактивність за загальними механізмами.
      </At>
    </Slide>
  );
};

/* Observer pattern: one observable broadcasts to three observers */
const EMIT_EVERY = 34;
const FLY = 40;

const Observer: React.FC = () => {
  const { s, t } = useSteps();
  const now = t(1, 20);
  const SRC = { x: 560, y: 600 };
  const OBS = [380, 600, 820].map((y) => ({ x: 1330, y }));
  const n = now < 0 ? 0 : Math.min(6, Math.floor(now / EMIT_EVERY) + 1);
  const got = () => Array.from({ length: n }, (_, i) => i).filter((i) => now - i * EMIT_EVERY >= FLY).length;
  return (
    <Slide title="Патерн Спостерігач у Rx">
      <Lead size={36}>
        Потоки даних у Rx – <A>observables</A>, а їхні споживачі – <A c={C.amber}>observers</A>. Кожен спостерігач отримує кожну нову подію.
      </Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(s(1, 0)) }}>
        {OBS.map((o, k) => (
          <line key={k} x1={SRC.x + 170} y1={SRC.y} x2={o.x - 10} y2={o.y} stroke={C.line} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" />
        ))}
      </svg>
      <div style={{ position: "absolute", left: SRC.x - 190, top: SRC.y - 90, width: 360, height: 180, borderRadius: 26, border: `3px solid ${C.teal}`, background: `${C.teal}14`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: clamp01(s(1, 0, POP)) }}>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 38, color: C.teal }}>Observable</div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.dim, marginTop: 6 }}>джерело подій</div>
      </div>
      {OBS.map((o, k) => (
        <div key={k} style={{ position: "absolute", left: o.x, top: o.y - 60, width: 440, height: 120, borderRadius: 22, border: `3px solid ${C.amber}`, background: `${C.amber}10`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", boxSizing: "border-box", opacity: clamp01(s(1, 6 + k * 5, POP)) }}>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: C.amber }}>Observer {k + 1}</div>
          <div style={{ fontFamily: F.head, fontWeight: 500, fontSize: 34, color: C.text }}>{got()}</div>
        </div>
      ))}
      {Array.from({ length: n }, (_, i) =>
        OBS.map((o, k) => {
          const u = (now - i * EMIT_EVERY) / FLY;
          if (u < 0 || u > 1) return null;
          const e = ease(u);
          return <Marble key={`${i}-${k}`} x={mix(SRC.x + 170, o.x - 10, e)} y={mix(SRC.y, o.y, e)} r={22} c={MARBLES[i % MARBLES.length]} />;
        }),
      )}
      <At x={96} y={900} w={1728} step={2} size={30} weight={700}>
        Оператори фільтрації, перетворення та згортання дають змогу будувати модульні програми над складними потоками подій.
      </At>
    </Slide>
  );
};

/* Actor model */
const ACT = [
  { x: 480, y: 470 },
  { x: 960, y: 380 },
  { x: 1440, y: 470 },
  { x: 960, y: 700 },
];
const SPAWNED = { x: 1440, y: 760 };
const MSGS: { from: number; to: number; at: number; step: number }[] = [
  { from: 0, to: 1, at: 0, step: 1 },
  { from: 1, to: 2, at: 30, step: 1 },
  { from: 3, to: 0, at: 50, step: 1 },
  { from: 2, to: 3, at: 80, step: 1 },
  { from: 0, to: 3, at: 110, step: 1 },
  { from: 2, to: 4, at: 50, step: 2 },
  { from: 4, to: 1, at: 100, step: 2 },
];
const TRAVEL = 34;
const HOLD = 26;

const Actors: React.FC = () => {
  const { s, t } = useSteps();
  const pos = (i: number) => (i === 4 ? SPAWNED : ACT[i]);
  const spawn = s(2, 10, POP);
  const mailbox = [0, 0, 0, 0, 0];
  const flying: React.ReactNode[] = [];
  MSGS.forEach((m, i) => {
    const tt = t(m.step, 10 + m.at);
    if (tt < 0) return;
    if (tt < TRAVEL) {
      const a = pos(m.from);
      const b = pos(m.to);
      const e = ease(tt / TRAVEL);
      flying.push(<Marble key={i} x={mix(a.x, b.x, e)} y={mix(a.y, b.y, e) - 70 * Math.sin(Math.PI * e)} r={20} c={MARBLES[i % MARBLES.length]} />);
    } else if (tt < TRAVEL + HOLD) {
      mailbox[m.to] += 1;
    }
  });
  const actor = (i: number, p: number, label: string) => {
    const { x, y } = pos(i);
    return (
      <div key={i} style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, opacity: clamp01(p), transform: `scale(${mix(0.6, 1, clamp01(p))})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 90, border: `3px solid ${C.violet}`, background: `${C.violet}18`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.head, fontWeight: 500, fontSize: 30, color: C.text }}>{label}</div>
        <div style={{ position: "absolute", right: -18, top: -10, minWidth: 54, height: 44, borderRadius: 10, border: `2.5px solid ${C.amber}`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.amber }}>
          ✉ {mailbox[i]}
        </div>
      </div>
    );
  };
  return (
    <Slide title="Модель акторів">
      <Lead size={36}>
        <A c={C.violet}>Актор</A> – незалежний компонент, що асинхронно обробляє повідомлення: надсилає їх, відповідає на них і створює інших акторів.
      </Lead>
      {ACT.map((_, i) => actor(i, s(1, i * 5, POP), `A${i + 1}`))}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <line x1={ACT[2].x} y1={ACT[2].y + 92} x2={SPAWNED.x} y2={SPAWNED.y - 92} stroke={C.violet} strokeWidth={3} strokeDasharray="6 8" opacity={clamp01(spawn)} />
      </svg>
      {actor(4, spawn, "A5")}
      {flying}
      <At x={1560} y={SPAWNED.y + 20} step={2} delay={16} size={26} weight={700} color={C.dim}>
        A3 створив A5
      </At>
      <At x={96} y={900} w={1728} step={3} size={30} weight={700}>
        Так будують паралельні й розподілені системи; <A c={C.violet}>Akka</A> – популярна реалізація моделі акторів у великих масштабованих системах.
      </At>
    </Slide>
  );
};

/* async/await, coroutines, promises */
const AsyncTrio: React.FC = () => {
  const { s, lin } = useSteps();
  const seg = (x: number, w: number, color: string, dashed?: boolean, label?: string) => (
    <div style={{ position: "absolute", left: x, top: 0, width: w, height: 40, borderRadius: 10, boxSizing: "border-box", background: dashed ? "transparent" : color, border: dashed ? `2.5px dashed ${color}` : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 20, color: dashed ? color : C.bg }}>
      {label}
    </div>
  );
  return (
    <Slide title="async/await, співпрограми, проміси">
      <Lead size={36}>Засоби середньої явності: асинхронність видно в коді, але вона виглядає майже як звичайний послідовний код.</Lead>
      <Panel x={96} y={310} w={560} h={560} title="async/await" color={C.teal} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.38, color: C.text, marginTop: 8 }}>Асинхронний код виглядає як синхронний, тому його легше читати й писати.</div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 25, color: C.dim, marginTop: 10 }}>C#, Python</div>
        <div style={{ marginTop: 26, padding: "14px 18px", borderRadius: 12, background: C.bg, fontFamily: F.mono, fontWeight: 700, fontSize: 25, color: C.text }}>
          data = <span style={{ color: C.kw }}>await</span> load(url)
        </div>
        <div style={{ position: "relative", marginTop: 26, height: 40, width: 480, opacity: clamp01(lin(1, 20, 20)) }}>
          {seg(0, 140, C.teal)}
          {seg(150, 190, C.teal, true, "await")}
          {seg(350, 130, C.teal)}
        </div>
      </Panel>
      <Panel x={680} y={310} w={560} h={560} title="Співпрограми" color={C.amber} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.38, color: C.text, marginTop: 8 }}>Легковагові конструкції, які можна призупинити й відновити.</div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 25, color: C.dim, marginTop: 10 }}>Kotlin, Lua</div>
        <div style={{ position: "relative", marginTop: 40, height: 40, width: 480, opacity: clamp01(lin(2, 20, 20)) }}>
          {seg(0, 110, C.amber)}
          {seg(118, 110, C.amber, true, "suspend")}
          {seg(236, 110, C.amber)}
          {seg(354, 126, C.amber, true, "suspend")}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", width: 480, marginTop: 14, fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.dim, opacity: clamp01(lin(2, 30, 20)) }}>
          <span>старт</span>
          <span>resume</span>
          <span>…</span>
        </div>
      </Panel>
      <Panel x={1264} y={310} w={560} h={560} title="Promises/Futures" color={C.violet} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.38, color: C.text, marginTop: 8 }}>Об’єкт-результат асинхронної операції; операції об’єднують у ланцюжки й обробляють помилки.</div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 25, color: C.dim, marginTop: 10 }}>JavaScript, Java, Scala</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, marginTop: 22 }}>
          {["load(url)", ".then(parse)", ".then(show)", ".catch(report)"].map((c, k) => (
            <Chip key={c} color={k === 3 ? C.coral : C.violet} size={26} style={{ marginLeft: k ? 30 : 0, opacity: clamp01(s(3, 12 + k * 7)) }}>
              {c}
            </Chip>
          ))}
        </div>
      </Panel>
    </Slide>
  );
};

/* Thread pool */
const TASKS = [40, 70, 30, 55, 45, 35, 60, 30, 50, 40];
const WORKERS = 4;
type Run = { k: number; w: number; start: number; end: number };
const RUNS: Run[] = (() => {
  const free = Array(WORKERS).fill(0);
  return TASKS.map((d, k) => {
    const w = free.indexOf(Math.min(...free));
    const start = free[w];
    free[w] = start + d + 6;
    return { k, w, start, end: start + d };
  });
})();

const ThreadPool: React.FC = () => {
  const { s, t } = useSteps();
  const now = Math.min(t(1, 16), 125);
  const QX = 160;
  const WX = 760;
  const WW = 900;
  const rowY = (w: number) => 380 + w * 120;
  const queued = RUNS.filter((r) => now < r.start);
  return (
    <Slide title="Пули потоків">
      <Lead size={36}>
        Пул потоків виконує асинхронні задачі в окремих потоках. Підходить для обчислювально важких і паралельних задач, але реактивність у коді менш помітна.
      </Lead>
      <At x={QX} y={330} step={1} size={28} weight={800} color={C.dim}>
        черга задач
      </At>
      {queued.map((r, i) => (
        <Marble key={r.k} x={QX + 40 + (i % 4) * 66} y={420 + Math.floor(i / 4) * 66} r={26} c={MARBLES[r.k % MARBLES.length]} v={r.k + 1} p={s(1, 0, POP)} />
      ))}
      {Array.from({ length: WORKERS }, (_, w) => (
        <div key={w} style={{ position: "absolute", left: WX, top: rowY(w) - 40, width: WW, height: 80, borderRadius: 18, border: `2px solid ${C.line}`, background: "rgba(16,23,46,0.6)", opacity: clamp01(s(1, w * 4, POP)) }}>
          <div style={{ position: "absolute", left: -150, top: 18, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.dim }}>потік {w + 1}</div>
        </div>
      ))}
      {RUNS.map((r) => {
        if (now < r.start || now > r.end + 12) return null;
        const u = clamp01((now - r.start) / (r.end - r.start));
        const out = clamp01((now - r.end) / 12);
        const col = MARBLES[r.k % MARBLES.length];
        return (
          <React.Fragment key={r.k}>
            <div style={{ position: "absolute", left: WX + 90, top: rowY(r.w) - 8, width: (WW - 140) * u, height: 16, borderRadius: 8, background: `${col}88`, opacity: 1 - out }} />
            <Marble x={WX + 46} y={rowY(r.w)} r={26} c={col} v={r.k + 1} p={1 - out} glow={0.5} />
          </React.Fragment>
        );
      })}
      <At x={96} y={900} w={1728} step={2} size={30} weight={700}>
        Кожен вільний потік бере наступну задачу з черги; програмі не потрібно чекати, доки завершиться попередня.
      </At>
    </Slide>
  );
};

/* Event Loop */
const STACK = { x: 96, y: 330, w: 460, h: 470 };
const ASYNC_BOX = { x: 700, y: 330, w: 560, h: 230 };
const QUEUE = { x: 700, y: 640, w: 1124, h: 160 };
const CARD_H = 64;
const slot = (k: number) => ({ x: STACK.x + 30, y: STACK.y + STACK.h - 30 - CARD_H - k * (CARD_H + 12) });

const Card: React.FC<{ x: number; y: number; text: string; color: string; p?: number; glow?: number; w?: number }> = ({ x, y, text, color, p = 1, glow = 0, w = 400 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: CARD_H, borderRadius: 14, border: `2.5px solid ${color}`, background: `${color}22`, boxShadow: glow > 0.02 ? `0 0 ${30 * glow}px ${color}` : undefined, display: "flex", alignItems: "center", padding: "0 20px", boxSizing: "border-box", fontFamily: F.mono, fontWeight: 700, fontSize: 28, color, opacity: clamp01(p) }}>
    {text}
  </div>
);

const move = (a: { x: number; y: number }, b: { x: number; y: number }, u: number) => ({ x: mix(a.x, b.x, ease(u)), y: mix(a.y, b.y, ease(u)) });

const EventLoop: React.FC = () => {
  const { s, t, lin } = useSteps();
  const t1 = t(1, 0);
  const t2 = t(2, 0);
  const t3 = t(3, 0);
  const r = (tt: number, a: number, b: number) => interpolate(tt, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const A1 = { x: ASYNC_BOX.x + 30, y: ASYNC_BOX.y + 40 };
  const A2 = { x: ASYNC_BOX.x + 30, y: ASYNC_BOX.y + 130 };
  const Q0 = { x: QUEUE.x + 30, y: QUEUE.y + 48 };
  const Q1 = { x: QUEUE.x + 470, y: QUEUE.y + 48 };
  const S0 = slot(0);
  const S1 = slot(1);

  const mainP = r(t1, 0, 12) * (1 - r(t1, 160, 175));
  const fetchPos = t2 > 50 ? move(A1, Q1, r(t2, 50, 80)) : move(S1, A1, r(t1, 45, 75));
  const fetchQ = t2 > 50;
  const timerPos = t2 > 10 ? move(A2, Q0, r(t2, 10, 40)) : move(S1, A2, r(t1, 110, 140));
  const timerQ = t2 > 10;
  const cards: React.ReactNode[] = [];
  if (t1 >= 0) cards.push(<Card key="main" {...S0} text="main()" color={C.dim} p={mainP} />);
  // fetch and its callback
  if (t3 > 95) {
    const ex = r(t3, 125, 155);
    cards.push(<Card key="f" {...move(Q1, S0, r(t3, 95, 125))} text="onData()" color={C.teal} glow={ex > 0 && ex < 1 ? 1 : 0} p={1 - r(t3, 155, 170)} />);
  } else if (t1 >= 20) {
    cards.push(<Card key="f" {...fetchPos} text={fetchQ ? "onData()" : "fetch(url)"} color={fetchQ ? C.teal : C.blue} p={r(t1, 20, 32)} />);
  }
  if (t3 > 10) {
    const ex = r(t3, 40, 70);
    cards.push(<Card key="tm" {...move(Q0, S0, r(t3, 10, 40))} text="onTimer()" color={C.amber} glow={ex > 0 && ex < 1 ? 1 : 0} p={1 - r(t3, 70, 85)} />);
  } else if (t1 >= 85) {
    cards.push(<Card key="tm" {...timerPos} text={timerQ ? "onTimer()" : "setTimeout(…)"} color={timerQ ? C.amber : C.violet} p={r(t1, 85, 97)} />);
  }
  const spin = (t1 >= 75 && t2 < 50) || (t1 >= 140 && t2 < 10);
  const loopRot = t3 > 0 ? t3 * 4 : 0;
  const caption = (k: number, text: string) => {
    const p = s(k, 14) * (k < 3 ? 1 - lin(k + 1, 0, 8) : 1);
    return (
      <div key={k} style={{ position: "absolute", left: 96, top: 860, width: 1728, fontFamily: F.body, fontWeight: 700, fontSize: 32, lineHeight: 1.38, color: C.text, opacity: clamp01(p) }}>
        {text}
      </div>
    );
  };
  const box = (b: { x: number; y: number; w: number; h: number }, label: string, color: string, p: number) => (
    <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 22, border: `2px solid ${color}`, background: "rgba(16,23,46,0.65)", opacity: clamp01(p) }}>
      <div style={{ position: "absolute", left: 22, top: -40, fontFamily: F.body, fontWeight: 800, fontSize: 26, letterSpacing: 2, color, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
  return (
    <Slide title="Event Loop">
      <Lead size={34}>
        Event Loop постійно перевіряє чергу подій і передає готові задачі на виконання, тож основний потік не блокується очікуванням.
      </Lead>
      {box(STACK, "Стек викликів", C.teal, s(0, 20))}
      {box(ASYNC_BOX, "Асинхронні операції", C.violet, s(0, 26))}
      {box(QUEUE, "Черга завдань", C.amber, s(0, 32))}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(s(0, 36)) }}>
        <g transform={`translate(${QUEUE.x - 75}, ${QUEUE.y + 80}) rotate(${-loopRot})`}>
          <path d="M 0 -42 A 42 42 0 1 1 -40 12" fill="none" stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
          <polygon points="-52,4 -28,4 -40,26" fill={C.amber} />
        </g>
      </svg>
      {spin && (
        <div style={{ position: "absolute", left: ASYNC_BOX.x + ASYNC_BOX.w - 70, top: ASYNC_BOX.y + 90, width: 40, height: 40, borderRadius: 20, border: `5px solid ${C.violet}`, borderTopColor: "transparent", transform: `rotate(${lin(1, 0, 60) * 1440 + t2 * 12}deg)` }} />
      )}
      {cards}
      <div style={{ position: "absolute", left: STACK.x, width: STACK.w, top: STACK.y + STACK.h / 2 - 20, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.dim, opacity: clamp01(s(3, 175)) }}>
        стек порожній
      </div>
      {caption(1, "Асинхронні операції одразу залишають стек: запит і таймер виконуються поза основним потоком.")}
      {caption(2, "Коли операція завершується, її обробник потрапляє в чергу завдань.")}
      {caption(3, "Щойно стек викликів порожній, Event Loop переносить наступне завдання з черги до стеку.")}
    </Slide>
  );
};

export const s4Slides: SlideDef[] = [
  { id: "tools", title: "Засоби за експліцитністю", steps: [40, 50, 50, 50, 50], C: Tools },
  { id: "observer", title: "Спостерігач", steps: [40, 260, 50], C: Observer },
  { id: "actors", title: "Модель акторів", steps: [40, 180, 170, 50], C: Actors },
  { id: "async-trio", title: "async/await, співпрограми, проміси", steps: [40, 60, 60, 60], C: AsyncTrio },
  { id: "pool", title: "Пули потоків", steps: [40, 150, 50], C: ThreadPool },
  { id: "event-loop", title: "Event Loop", steps: [60, 190, 100, 190], C: EventLoop },
];
