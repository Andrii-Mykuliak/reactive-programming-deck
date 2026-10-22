import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Lane, Marble, OpBox } from "./kit";

/* Asynchrony: three tasks, each work–wait–work, run blocking and asynchronously on one thread. */
type Seg = { task: number; from: number; to: number; wait?: boolean };
const TASK_C = [C.teal, C.amber, C.violet];
const SYNC: Seg[] = [0, 1, 2].flatMap((k) => [
  { task: k, from: k * 4, to: k * 4 + 1 },
  { task: k, from: k * 4 + 1, to: k * 4 + 3, wait: true },
  { task: k, from: k * 4 + 3, to: k * 4 + 4 },
]);
const ASYNC: Seg[] = [0, 1, 2].flatMap((k) => [
  { task: k, from: k, to: k + 1 },
  { task: k, from: k + 1, to: k + 3, wait: true },
  { task: k, from: k + 3, to: k + 4 },
]);
const UNIT = 100;
const GX = 330;

const Gantt: React.FC<{ y: number; segs: Seg[]; step: number; title: string; total: number; color: string }> = ({ y, segs, step, title, total, color }) => {
  const { s, lin } = useSteps();
  const head = lin(step, 12, 20 * total) * total;
  return (
    <>
      <At x={96} y={y - 6} step={step} size={30} weight={800} color={color}>
        {title}
      </At>
      {[0, 1, 2].map((k) => (
        <div key={k} style={{ position: "absolute", left: 230, top: y + 52 + k * 58, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: TASK_C[k], opacity: clamp01(s(step, 4)) }}>
          {"ABC"[k]}
        </div>
      ))}
      {segs.map((g, i) => {
        const vis = clamp01((head - g.from) / (g.to - g.from));
        if (vis <= 0) return null;
        const col = TASK_C[g.task];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: GX + g.from * UNIT,
              top: y + 50 + g.task * 58,
              width: (g.to - g.from) * UNIT * vis - 4,
              height: 42,
              borderRadius: 10,
              boxSizing: "border-box",
              background: g.wait ? `repeating-linear-gradient(135deg, ${col}22 0 10px, transparent 10px 20px)` : col,
              border: g.wait ? `2px dashed ${col}99` : undefined,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: GX + total * UNIT + 16, top: y + 100, fontFamily: F.mono, fontWeight: 700, fontSize: 32, color, opacity: clamp01(s(step, 12 + 20 * total)) }}>
        {total} од. часу
      </div>
    </>
  );
};

const Async: React.FC = () => (
  <Slide title="Асинхронність">
    <Lead>
      Операції виконуються, <A>не чекаючи</A> завершення одна одної, тож система обробляє багато подій без блокування.
    </Lead>
    <Gantt y={318} segs={SYNC} step={1} title="Синхронно" total={12} color={C.coral} />
    <Gantt y={586} segs={ASYNC} step={2} title="Асинхронно" total={6} color={C.teal} />
    <At x={96} y={866} w={1728} step={3} size={32} weight={700}>
      Заштриховані відрізки – очікування відповіді. Асинхронні виклики, проміси й потоки дають змогу робити іншу роботу, поки триває очікування.
    </At>
  </Slide>
);

/* Non-blocking: requests arrive at a one-thread server. */
const ARRIVE = 14;
const N_REQ = 9;
const IO = 46;
const CPU = 6;
type Job = { a: number; start: number; end: number };
const NOW_CAP = 215;

const schedule = (blocking: boolean): Job[] => {
  const out: Job[] = [];
  let free = 0;
  for (let i = 0; i < N_REQ; i++) {
    const a = i * ARRIVE;
    const start = Math.max(a, free);
    const end = start + CPU + IO;
    free = blocking ? end : start + CPU;
    out.push({ a, start, end });
  }
  return out;
};

const ServerLane: React.FC<{ y: number; blocking: boolean; step: number; title: string; color: string }> = ({ y, blocking, step, title, color }) => {
  const { t, s } = useSteps();
  const now = Math.min(t(step, 10), NOW_CAP);
  const jobs = schedule(blocking);
  const QX = 300;
  const SX = 760;
  const DX = 1340;
  const waiting = jobs.filter((j) => now >= j.a && now < j.start);
  const running = jobs.filter((j) => now >= j.start && now < j.end);
  const done = jobs.filter((j) => now >= j.end).length;
  const p = s(step, 0, POP);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(p) }}>
      <At x={96} y={y - 30} step={step} size={30} weight={800} color={color}>
        {title}
      </At>
      <div style={{ position: "absolute", left: QX - 30, top: y + 30, width: 420, height: 100, borderRadius: 18, border: `2px dashed ${C.line}` }} />
      <div style={{ position: "absolute", left: QX - 30, top: y + 140, width: 420, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.dim }}>черга: {waiting.length}</div>
      {waiting.map((j, k) => (
        <Marble key={j.a} x={QX + 360 - k * 64} y={y + 80} r={24} c={C.amber} />
      ))}
      <div style={{ position: "absolute", left: SX, top: y + 10, width: 480, height: 140, borderRadius: 20, border: `3px solid ${color}`, background: `${color}12` }} />
      <div style={{ position: "absolute", left: SX, top: y + 160, width: 480, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 26, color: C.dim }}>
        {blocking ? "потік чекає на введення-виведення" : "очікування не займає потік"}
      </div>
      {running.map((j, k) => {
        const u = clamp01((now - j.start) / (j.end - j.start));
        return <Marble key={j.a} x={SX + 60 + (blocking ? 180 * u : k * 66 + 20 * u)} y={y + 80} r={24} c={color} glow={0.4} />;
      })}
      <div style={{ position: "absolute", left: DX, top: y + 30, width: 400, height: 100, borderRadius: 18, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.head, fontWeight: 500, fontSize: 40, color }}>
        готово: {done}
      </div>
    </div>
  );
};

const NonBlocking: React.FC = () => (
  <Slide title="Неблокуючі операції">
    <Lead size={36}>
      Програма не чекає завершення довгого процесу, а береться за інші задачі. Ресурси використовуються ефективніше.
    </Lead>
    <ServerLane y={360} blocking step={1} title="Блокуючий сервер" color={C.coral} />
    <ServerLane y={620} blocking={false} step={2} title="Неблокуючий сервер" color={C.teal} />
    <At x={96} y={880} w={1728} step={3} size={32} weight={700}>
      Неблокуючі операції дають <A>вищу пропускну здатність</A> і менші затримки, тому без них не обходяться масштабовані й відмовостійкі застосунки.
    </At>
  </Slide>
);

/* Streams: filter, map, merge on one diagram. */
const SRC = [
  { at: 0.06, v: "1" },
  { at: 0.2, v: "4" },
  { at: 0.36, v: "2" },
  { at: 0.52, v: "5" },
  { at: 0.7, v: "3" },
  { at: 0.88, v: "6" },
];
const KEEP = SRC.filter((e) => +e.v > 2);
const B_EV = [
  { at: 0.3, v: "a", c: C.blue },
  { at: 0.62, v: "b", c: C.blue },
];
const LX = 96;
const LW = 1600;
const LBL = 300;

const Streams: React.FC = () => {
  const { s } = useSteps();
  const kept = KEEP.map((e) => ({ ...e, c: C.amber }));
  const mapped = KEEP.map((e) => ({ at: e.at, v: `${+e.v * 10}`, c: C.teal }));
  const merged = [...mapped, ...B_EV].sort((a, b) => a.at - b.at);
  return (
    <Slide title="Потоки даних">
      <Lead size={34}>
        Дані – неперервна послідовність подій у часі. Потік можна <A>фільтрувати</A>, <A c={C.amber}>перетворювати</A> й <A c={C.blue}>комбінувати</A> з іншими потоками.
      </Lead>
      <Lane x={LX} y={330} w={LW} labelW={LBL} label="A" events={SRC} step={1} dur={50} />
      <OpBox x={LX + LBL} y={370} w={LW - LBL - 40} p={s(2, 0)} color={C.violet}>
        filter(x =&gt; x &gt; 2)
      </OpBox>
      <Lane x={LX} y={490} w={LW} labelW={LBL} label="filter(A)" events={kept} step={2} delay={10} dur={40} />
      <OpBox x={LX + LBL} y={530} w={LW - LBL - 40} p={s(3, 0)} color={C.amber}>
        map(x =&gt; x * 10)
      </OpBox>
      <Lane x={LX} y={650} w={LW} labelW={LBL} label="map(…)" events={mapped} step={3} delay={10} dur={40} />
      <Lane x={LX} y={760} w={LW} labelW={LBL} label="B" events={B_EV} step={4} dur={30} />
      <OpBox x={LX + LBL} y={800} w={LW - LBL - 40} p={s(4, 30)} color={C.blue}>
        merge(map(…), B)
      </OpBox>
      <Lane x={LX} y={930} w={LW} labelW={LBL} label="результат" events={merged} step={4} delay={40} dur={40} />
    </Slide>
  );
};

/* Explicitness levels */
const LEVELS = [
  { k: "Низький", d: "Зворотні виклики (callbacks) та інші неявні механізми. Реактивність прихована, код складніше розуміти й підтримувати.", c: C.coral, h: 330 },
  { k: "Середній", d: "Об’єкти Future і Promise роблять асинхронні операції явними, ними легше керувати.", c: C.amber, h: 430 },
  { k: "Високий", d: "RxJava, Reactor, Akka Streams: потоки даних – центр дизайну, асинхронність видно прямо в коді.", c: C.teal, h: 530 },
];

const Explicitness: React.FC = () => {
  const { s } = useSteps();
  const BOTTOM = 860;
  return (
    <Slide title="Ступені експліцитності">
      <Lead>Ступінь експліцитності показує, наскільки явно асинхронність і реактивність виражені в коді.</Lead>
      {LEVELS.map((l, i) => (
        <Panel key={l.k} x={96 + i * 590} y={BOTTOM - l.h} w={550} h={l.h} title={l.k} color={l.c} p={s(i + 1, 0, POP)}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.38, color: C.text, marginTop: 8 }}>{l.d}</div>
        </Panel>
      ))}
      <At x={96} y={892} w={1728} step={4} size={30} weight={700} color={C.dim}>
        Вибір залежить від проєкту, досвіду команди й задачі: високий ступінь дає чітку модульну архітектуру, низький достатній для простих сценаріїв.
      </At>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "async", title: "Асинхронність", steps: [40, 280, 160, 50], C: Async },
  { id: "nonblocking", title: "Неблокуючі операції", steps: [40, 240, 240, 50], C: NonBlocking },
  { id: "streams", title: "Потоки даних", steps: [40, 80, 70, 70, 100], C: Streams },
  { id: "explicit", title: "Ступені експліцитності", steps: [40, 40, 40, 40, 50], C: Explicitness },
];

