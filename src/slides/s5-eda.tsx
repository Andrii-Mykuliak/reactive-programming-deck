import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Marble, Num } from "./kit";

const ease = (v: number) => {
  const x = clamp01(v);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

/* Event-driven architecture: producers → broker topics → subscribed consumers */
const TOPICS = [
  { name: "замовлення", c: C.teal },
  { name: "оплата", c: C.amber },
  { name: "доставка", c: C.violet },
];
const PRODUCERS = ["Сервер", "Інтерфейс", "Сенсор"];
const CONSUMERS = [
  { name: "Облік", subs: [0, 1] },
  { name: "Сповіщення", subs: [1, 2] },
  { name: "Аналітика", subs: [0, 1, 2] },
];
const EVENTS = [0, 1, 2, 1, 0, 2, 1, 0].map((topic, i) => ({ topic, producer: i % 3, at: i * 26 }));
const PX = 110;
const PW = 300;
const BX = 700;
const BW = 520;
const CX = 1500;
const CW = 324;
const rowY = (k: number) => 430 + k * 170;
const laneY = (k: number) => 440 + k * 150;
const IN = 26;
const ALONG = 36;
const OUT = 30;

const Eda: React.FC = () => {
  const { s, t } = useSteps();
  const now = t(2, 10);
  const received = [0, 0, 0];
  const marbles: React.ReactNode[] = [];
  EVENTS.forEach((e, i) => {
    const tt = now - e.at;
    if (tt < 0) return;
    const c = TOPICS[e.topic].c;
    const p0 = { x: PX + PW, y: rowY(e.producer) };
    const b0 = { x: BX + 30, y: laneY(e.topic) };
    const b1 = { x: BX + BW - 30, y: laneY(e.topic) };
    if (tt < IN) {
      const u = ease(tt / IN);
      marbles.push(<Marble key={i} x={mix(p0.x, b0.x, u)} y={mix(p0.y, b0.y, u)} r={20} c={c} />);
    } else if (tt < IN + ALONG) {
      const u = (tt - IN) / ALONG;
      marbles.push(<Marble key={i} x={mix(b0.x, b1.x, u)} y={b0.y} r={20} c={c} />);
    } else {
      const u = ease((tt - IN - ALONG) / OUT);
      CONSUMERS.forEach((cons, k) => {
        if (!cons.subs.includes(e.topic)) return;
        if (u >= 1) {
          received[k] += 1;
          return;
        }
        marbles.push(<Marble key={`${i}-${k}`} x={mix(b1.x, CX, u)} y={mix(b1.y, rowY(k), u)} r={20} c={c} />);
      });
    }
  });
  const node = (x: number, y: number, w: number, label: string, color: string, p: number, extra?: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: y - 60, width: w, height: 120, borderRadius: 20, border: `3px solid ${color}`, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box", opacity: clamp01(p), transform: `scale(${mix(0.85, 1, clamp01(p))})` }}>
      <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 32, color: C.text }}>{label}</div>
      {extra}
    </div>
  );
  return (
    <Slide title="Подійно-орієнтована архітектура">
      <Lead size={34}>
        Компоненти спілкуються через <A>події</A> – значущі зміни стану системи. Підхід поширений у мікросервісах, IoT і реактивних застосунках.
      </Lead>
      {["Видавці", "Брокер подій", "Споживачі"].map((h, i) => (
        <At key={h} x={[PX, BX, CX][i]} y={300} step={1} delay={i * 6} size={26} weight={800} color={C.dim} style={{ letterSpacing: 2, textTransform: "uppercase" }}>
          {h}
        </At>
      ))}
      {PRODUCERS.map((p, k) => node(PX, rowY(k), PW, p, C.blue, s(1, k * 4, POP)))}
      <div style={{ position: "absolute", left: BX, top: 360, width: BW, height: 460, borderRadius: 26, border: `3px solid ${C.line}`, background: "rgba(16,23,46,0.7)", opacity: clamp01(s(1, 10, POP)) }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.dim }}>Apache Kafka, шина подій</div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(s(1, 16)) }}>
        {TOPICS.map((tp, k) => (
          <line key={k} x1={BX + 30} y1={laneY(k)} x2={BX + BW - 30} y2={laneY(k)} stroke={tp.c} strokeWidth={3} strokeDasharray="6 9" opacity={0.7} />
        ))}
      </svg>
      {TOPICS.map((tp, k) => (
        <div key={tp.name} style={{ position: "absolute", left: BX + 30, top: laneY(k) - 54, fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: tp.c, opacity: clamp01(s(1, 18)) }}>
          {tp.name}
        </div>
      ))}
      {CONSUMERS.map((cons, k) =>
        node(
          CX,
          rowY(k),
          CW,
          cons.name,
          C.teal,
          s(1, 20 + k * 4, POP),
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {cons.subs.map((sb) => (
              <span key={sb} style={{ width: 14, height: 14, borderRadius: 7, background: TOPICS[sb].c }} />
            ))}
            <span style={{ marginLeft: 8, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.text }}>{received[k]}</span>
          </div>,
        ),
      )}
      {marbles}
      <At x={96} y={900} w={1728} step={3} size={30} weight={700}>
        Видавці генерують події, брокер координує їхню доставку, а споживачі обробляють лише ті події, на які підписані.
      </At>
    </Slide>
  );
};

/* Pros and cons */
const PROS = [
  ["Гнучкість і масштабованість", "компоненти додають і вилучають без змін в інших частинах"],
  ["Відмовостійкість", "компоненти слабко зв’язані, збій одного не зупиняє всю систему"],
  ["Асинхронність", "події обробляються асинхронно, система швидко реагує"],
];
const CONS = [
  ["Складність керування", "моніторинг і відстеження потоків подій у великих системах"],
  ["Затримки", "асинхронна доставка може затримувати обробку подій"],
  ["Залежність від інфраструктури", "потрібні високопродуктивні брокери й шини подій"],
];

const ProsCons: React.FC = () => {
  const { s } = useSteps();
  const col = (items: string[][], x: number, title: string, color: string, step: number) => (
    <Panel x={x} y={260} w={850} h={600} title={title} color={color} p={s(step, 0, POP)}>
      {items.map(([k, v], i) => (
        <div key={k} style={{ marginTop: i ? 26 : 14, opacity: clamp01(s(step, 10 + i * 8)) }}>
          <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 32, color }}>{k}</div>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.36, color: C.text, marginTop: 4 }}>{v}</div>
        </div>
      ))}
    </Panel>
  );
  return (
    <Slide title="EDA: переваги і недоліки">
      {col(PROS, 96, "Переваги", C.teal, 1)}
      {col(CONS, 974, "Недоліки", C.coral, 2)}
    </Slide>
  );
};

/* Libraries by language */
const FAM = { rx: C.teal, actor: C.violet, other: C.amber };
const LANGS: { lang: string; libs: [string, keyof typeof FAM][] }[] = [
  { lang: "C#", libs: [["Rx.NET", "rx"], ["Akka.NET", "actor"]] },
  { lang: "F#", libs: [["TPL Dataflow", "other"], ["Elmish", "other"]] },
  { lang: "Java", libs: [["RxJava", "rx"], ["Project Reactor", "other"]] },
  { lang: "C++", libs: [["RxCpp", "rx"], ["cpp.react", "other"]] },
  { lang: "JavaScript", libs: [["RxJS", "rx"], ["Redux-Observable", "other"]] },
  { lang: "Kotlin", libs: [["RxKotlin", "rx"], ["Kotlin Flow", "other"]] },
  { lang: "Rust", libs: [["Tokio", "other"], ["Actix", "actor"]] },
  { lang: "Ruby", libs: [["Celluloid", "actor"], ["EventMachine", "other"]] },
  { lang: "Haskell", libs: [["reactive-banana", "other"], ["Reflex", "other"], ["Yampa", "other"]] },
  { lang: "Python", libs: [["RxPY", "rx"], ["Tornado", "other"]] },
  { lang: "Swift", libs: [["Combine", "other"], ["RxSwift", "rx"]] },
  { lang: "Scala", libs: [["Akka", "actor"], ["Monix", "other"]] },
];

const Libs: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Реактивні бібліотеки та фреймворки">
      <div style={{ position: "absolute", left: 96, top: 186, display: "flex", gap: 40, fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.dim, opacity: clamp01(s(0, 10)) }}>
        {[
          ["сімейство Rx", FAM.rx],
          ["модель акторів", FAM.actor],
          ["інші підходи", FAM.other],
        ].map(([k, c]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            {k}
          </span>
        ))}
      </div>
      {LANGS.map((l, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <Panel key={l.lang} x={96 + col * 440} y={260 + row * 236} w={412} h={214} title={l.lang} color={C.dim} p={s(row + 1, col * 5, POP)} pad="14px 22px">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
              {l.libs.map(([name, fam]) => (
                <Chip key={name} color={FAM[fam]} size={24}>
                  {name}
                </Chip>
              ))}
            </div>
          </Panel>
        );
      })}
      <At x={96} y={980} w={1728} step={4} size={28} weight={700} color={C.dim}>
        Реалізації Rx є майже для кожної мови, тому навички роботи з потоками легко переносяться між екосистемами.
      </At>
    </Slide>
  );
};

/* Summary */
const POINTS = [
  "Реактивне програмування описує систему як реакцію на асинхронні події та потоки даних.",
  "Реактивний маніфест вимагає, щоб система відповідала на зміни, була відмовостійкою й еластичною та спиралася на асинхронні повідомлення.",
  "Асинхронність, неблокуючі операції та обробка потоків дають змогу працювати з багатьма подіями без простоїв.",
  "FRP поєднує функції вищого порядку й незмінні дані з потоками подій, тому реактивний код залишається декларативним.",
  "Засоби реалізації відрізняються явністю: від пулів потоків і Event Loop до Rx, акторів і подійно-орієнтованої архітектури.",
];

const Summary: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Підсумки">
      {POINTS.map((pt, i) => {
        const p = s(i + 1, 0);
        return (
          <div key={i} style={{ position: "absolute", left: 96, top: 214 + i * 156, width: 1728, display: "flex", gap: 30, alignItems: "flex-start", opacity: clamp01(p), transform: `translateX(${(1 - p) * -30}px)` }}>
            <Num n={i + 1} color={[C.teal, C.amber, C.violet, C.coral, C.blue][i]} size={60} />
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 34, lineHeight: 1.38, color: C.text, marginTop: 4 }}>{pt}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s5Slides: SlideDef[] = [
  { id: "eda", title: "EDA", steps: [40, 50, 300, 50], C: Eda },
  { id: "eda-pros", title: "Переваги і недоліки EDA", steps: [30, 60, 60], C: ProsCons },
];

export const s6Slides: SlideDef[] = [{ id: "libs", title: "Бібліотеки за мовами", steps: [40, 40, 40, 40, 50], C: Libs }];

export const summarySlide: SlideDef = { id: "summary", title: "Підсумки", steps: [30, 40, 40, 40, 40, 40], C: Summary };
