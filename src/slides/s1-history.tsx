import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, Arrow, At, clamp01, Lead, Panel, pulse, Slide } from "../deck/ui";
import { Marble } from "./kit";

/* Timeline */
const MILES = [
  { year: "1960-ті", text: "Системи реагують на зовнішні події: вхід користувача, зміни даних.", c: C.teal },
  { year: "Інтерфейси та ігри", text: "Швидка реакція на події стає критичною; ООП дає гнучкіше керування подіями.", c: C.amber },
  { year: "2000-ні", text: "Мови й фреймворки підтримують декларативну обробку асинхронних подій.", c: C.violet },
  { year: "2013", text: "Реактивний маніфест формулює принципи реактивних систем.", c: C.coral },
];
const TL_Y = 470;
const TL_X0 = 150;
const TL_X1 = 1770;
const MILE_GAP = 26;

const Timeline: React.FC = () => {
  const { s, lin, t } = useSteps();
  const draw = lin(1, 0, 30);
  const xs = MILES.map((_, i) => TL_X0 + 120 + (i * (TL_X1 - TL_X0 - 240)) / (MILES.length - 1));
  return (
    <Slide title="Звідки взялося реактивне програмування">
      <Lead>
        Реактивне програмування – парадигма, у центрі якої <A>реакція</A> на асинхронні події та потоки даних у масштабованих системах.
      </Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={TL_X0} y1={TL_Y} x2={mix(TL_X0, TL_X1, draw)} y2={TL_Y} stroke={C.line} strokeWidth={5} strokeLinecap="round" />
        <polygon points={`${TL_X1 + 24},${TL_Y} ${TL_X1},${TL_Y - 13} ${TL_X1},${TL_Y + 13}`} fill={C.line} opacity={draw > 0.97 ? 1 : 0} />
      </svg>
      {MILES.map((m, i) => {
        const d = 14 + i * MILE_GAP;
        const p = s(1, d, POP);
        const glow = pulse(t(1, d), 6, 22);
        return (
          <React.Fragment key={m.year}>
            <Marble x={xs[i]} y={TL_Y} r={26} c={m.c} p={p} glow={glow} />
            <div style={{ position: "absolute", left: xs[i] - 200, width: 400, top: TL_Y - 110, textAlign: "center", fontFamily: F.head, fontSize: 36, fontWeight: 500, color: m.c, opacity: clamp01(p), whiteSpace: "nowrap" }}>
              {m.year}
            </div>
            <Panel x={xs[i] - 190} y={TL_Y + 60} w={380} h={250} color={m.c} p={s(1, d + 6)}>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.35, color: C.text }}>{m.text}</div>
            </Panel>
          </React.Fragment>
        );
      })}
      <At x={96} y={880} w={1720} step={2} size={34} weight={700} color={C.dim}>
        Сьогодні реактивний підхід – важлива частина розроблення інтерфейсів, вебзастосунків і розподілених систем.
      </At>
    </Slide>
  );
};

/* Drivers of the 2000s */
const DRIVERS = [
  { t: "Мови", d: "Проміси, async/await і потоки (streams) у JavaScript, Scala та інших мовах.", c: C.teal },
  { t: "ReactiveX", d: "RxJS, RxJava та інші бібліотеки дали шаблони для композиції асинхронних потоків.", c: C.amber },
  { t: "Веб і AJAX", d: "Сторінки завантажують дані асинхронно, без перезавантаження всієї сторінки.", c: C.violet },
  { t: "Браузери", d: "Швидші JavaScript-рушії та нові API для асинхронних функцій.", c: C.coral },
  { t: "SPA", d: "Angular, React, Vue.js будують інтерфейси, що реагують на зміни даних і дії користувача.", c: C.blue },
];

const Drivers: React.FC = () => {
  const { s } = useSteps();
  const pos = [
    [96, 340],
    [690, 340],
    [1284, 340],
    [393, 650],
    [987, 650],
  ];
  return (
    <Slide title="Що зрушило 2000-ні">
      <Lead>У 2000-х реактивне програмування отримало новий поштовх: з’явилися засоби для декларативної обробки асинхронних подій.</Lead>
      {DRIVERS.map((d, i) => (
        <Panel key={d.t} x={pos[i][0]} y={pos[i][1]} w={540} h={270} title={d.t} color={d.c} tag={`0${i + 1}`} p={s(1, i * 8, POP)}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.38, color: C.text, marginTop: 6 }}>{d.d}</div>
        </Panel>
      ))}
    </Slide>
  );
};

/* Reactive Manifesto */
const PRINCIPLES = [
  { en: "Responsive", ua: "Відповідь на зміни", d: "Система швидко реагує на запити за будь-яких умов, тому залишається доступною й корисною.", c: C.teal, x: 560, y: 380 },
  { en: "Resilient", ua: "Відмовостійкість", d: "Система працює під час збоїв і відновлюється після них, зберігаючи стан і продовжуючи обробку.", c: C.coral, x: 870, y: 580 },
  { en: "Elastic", ua: "Еластичність", d: "Система масштабується вгору або вниз під навантаження без втрати продуктивності.", c: C.amber, x: 250, y: 580 },
  { en: "Message Driven", ua: "Керованість повідомленнями", d: "Компоненти обмінюються асинхронними повідомленнями, тому вони слабко зв’язані.", c: C.violet, x: 560, y: 780 },
];
const NODE_W = 390;
const NODE_H = 116;

const Manifesto: React.FC = () => {
  const { s } = useSteps();
  const c = (i: number) => ({ x: PRINCIPLES[i].x, y: PRINCIPLES[i].y });
  const GAP = 12;
  const top = (i: number, dx: number) => ({ x: c(i).x + dx, y: c(i).y - NODE_H / 2 - GAP });
  const bottom = (i: number, dx: number) => ({ x: c(i).x + dx, y: c(i).y + NODE_H / 2 + GAP });
  // 0 Responsive, 1 Resilient, 2 Elastic, 3 Message Driven
  const links: [{ x: number; y: number }, { x: number; y: number }][] = [
    [top(3, -110), bottom(2, 80)],
    [top(3, 110), bottom(1, -80)],
    [top(2, 80), bottom(0, -110)],
    [top(1, -80), bottom(0, 110)],
  ];
  return (
    <Slide title="Реактивний маніфест, 2013">
      <Lead size={34}>
        Йонас Бонер, Роланд Кун, Девід Фарлі та інші описали чотири властивості систем, які витримують вимоги сучасних застосунків.
      </Lead>
      {links.map(([a, b], i) => (
        <Arrow key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} step={1} delay={30 + i * 6} color={C.dim} width={4} />
      ))}
      <Arrow x1={c(2).x + NODE_W / 2 + GAP} y1={c(2).y} x2={c(1).x - NODE_W / 2 - GAP} y2={c(1).y} step={1} delay={54} color={C.dim} width={4} both />
      {PRINCIPLES.map((p, i) => {
        const appear = s(1, i * 7, POP);
        const active = s(i + 2, 0) * (i < 3 ? 1 - s(i + 3, 0) : 1);
        return (
          <div
            key={p.en}
            style={{
              position: "absolute",
              left: p.x - NODE_W / 2,
              top: p.y - NODE_H / 2,
              width: NODE_W,
              height: NODE_H,
              borderRadius: 20,
              border: `3px solid ${p.c}`,
              background: `linear-gradient(180deg, ${p.c}30, ${p.c}12), ${C.bg}`,
              boxShadow: active > 0.05 ? `0 0 ${40 * active}px ${p.c}` : undefined,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: clamp01(appear),
              transform: `scale(${mix(0.8, 1, clamp01(appear)) * (1 + 0.05 * active)})`,
            }}
          >
            <div style={{ fontFamily: F.head, fontWeight: 500, fontSize: 30, color: p.c }}>{p.en}</div>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 24, color: C.text, marginTop: 4, whiteSpace: "nowrap" }}>{p.ua}</div>
          </div>
        );
      })}
      {PRINCIPLES.map((p, i) => (
        <Panel key={p.en} x={1100} y={330 + i * 150} w={724} h={136} color={p.c} p={s(i + 2, 4)} glow={s(i + 2, 0) * (i < 3 ? 1 - s(i + 3, 0) : 1)} pad="16px 24px 16px">
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, lineHeight: 1.36, color: C.text }}>{p.d}</div>
        </Panel>
      ))}
    </Slide>
  );
};

/* How the principles support each other: means → form → value. */
const TIERS = [
  { k: "Засіб", v: "Керованість повідомленнями", c: C.violet },
  { k: "Форма", v: "Еластичність + відмовостійкість", c: C.amber },
  { k: "Цінність", v: "Відповідь на зміни", c: C.teal },
];

const Pyramid: React.FC = () => {
  const { s } = useSteps();
  const BASE_Y = 930;
  const TIER_H = 170;
  const CX = 560;
  const W0 = 960;
  const notes = [
    "Асинхронні повідомлення розподіляють завдання між компонентами й не блокують ресурси.",
    "Слабкий зв’язок ізолює збої, а перерозподіл повідомлень підлаштовує систему під навантаження.",
    "Разом це дає стабільну й швидку реакцію на запити користувачів.",
  ];
  return (
    <Slide title="Як принципи підсилюють один одного">
      <Lead>Чотири принципи утворюють цілісний підхід: кожен рівень спирається на попередній.</Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        {TIERS.map((tr, i) => {
          const p = s(i + 1, 0, POP);
          const yb = BASE_Y - i * (TIER_H + 14);
          const yt = yb - TIER_H;
          const wb = W0 - (i * (W0 - 280)) / 3;
          const wt = W0 - ((i + 1) * (W0 - 280)) / 3;
          const pts = [
            [CX - wb / 2, yb],
            [CX + wb / 2, yb],
            [CX + wt / 2, yt],
            [CX - wt / 2, yt],
          ]
            .map((q) => q.join(","))
            .join(" ");
          return (
            <g key={tr.k} opacity={clamp01(p)} transform={`translate(0, ${(1 - p) * 30})`}>
              <polygon points={pts} fill={`${tr.c}22`} stroke={tr.c} strokeWidth={3} strokeLinejoin="round" />
            </g>
          );
        })}
      </svg>
      {TIERS.map((tr, i) => {
        const p = s(i + 1, 4);
        const yb = BASE_Y - i * (TIER_H + 14);
        return (
          <div key={tr.k} style={{ position: "absolute", left: CX - 300, width: 600, top: yb - TIER_H + 34, textAlign: "center", opacity: clamp01(p) }}>
            <div style={{ fontFamily: F.body, fontWeight: 800, fontSize: 24, letterSpacing: 3, color: tr.c, textTransform: "uppercase" }}>{tr.k}</div>
            <div style={{ fontFamily: F.head, fontWeight: 500, fontSize: i === 2 ? 28 : 30, color: C.text, marginTop: 8, whiteSpace: "nowrap" }}>{tr.v}</div>
          </div>
        );
      })}
      {notes.map((n, i) => (
        <Panel key={i} x={1060} y={BASE_Y - TIER_H - i * (TIER_H + 14) + 4} w={764} h={TIER_H - 8} color={TIERS[i].c} p={s(i + 1, 10)} pad="18px 26px">
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text }}>{n}</div>
        </Panel>
      ))}
    </Slide>
  );
};

/* Reactive and declarative */
const HOW = ["підписатися на подію", "перевірити умову в обробнику", "оновити спільну змінну", "викликати наступний крок вручну"];
const WHAT = [
  { t: "потік подій", c: C.dim },
  { t: "filter", c: C.violet },
  { t: "map", c: C.amber },
  { t: "реакція", c: C.teal },
];

const Declarative: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Реактивне і декларативне">
      <Lead>
        Обидва підходи описують, <A>що</A> має статися з даними, а не <A c={C.amber}>як</A> керувати потоком виконання.
      </Lead>
      <Panel x={96} y={330} w={820} h={470} title="Як: керування вручну" color={C.amber} p={s(1, 0, POP)}>
        {HOW.map((h, i) => (
          <div key={h} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: i ? 22 : 14, opacity: clamp01(s(1, 8 + i * 6)) }}>
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.amber, width: 40 }}>{i + 1}.</div>
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, color: C.text }}>{h}</div>
          </div>
        ))}
      </Panel>
      <Panel x={1004} y={330} w={820} h={470} title="Що: опис потоку" color={C.teal} p={s(2, 0, POP)}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginTop: 6 }}>
          {WHAT.map((w, i) => {
            const p = s(2, 8 + i * 8, POP);
            return (
              <React.Fragment key={w.t}>
                {i > 0 && <div style={{ width: 4, height: 24, background: C.line, opacity: clamp01(p) }} />}
                <div style={{ padding: "10px 36px", borderRadius: 40, border: `2.5px solid ${w.c}`, background: `${w.c}1c`, fontFamily: F.mono, fontWeight: 700, fontSize: 32, color: w.c, opacity: clamp01(p), transform: `scale(${mix(0.85, 1, clamp01(p))})` }}>{w.t}</div>
              </React.Fragment>
            );
          })}
        </div>
      </Panel>
      <At x={96} y={840} w={1728} step={3} size={33} weight={700}>
        Потоки даних та їхні зміни – центральні елементи, а деталі керування залишаються абстрактними. Такий код модульніший, гнучкіший і легший у підтримці.
      </At>
    </Slide>
  );
};

export const s1Slides: SlideDef[] = [
  { id: "timeline", title: "Звідки взялося", steps: [40, 140, 50], C: Timeline },
  { id: "drivers", title: "2000-ні", steps: [40, 90], C: Drivers },
  { id: "manifesto", title: "Реактивний маніфест", steps: [40, 80, 40, 40, 40, 40], C: Manifesto },
  { id: "pyramid", title: "Засіб, форма, цінність", steps: [40, 50, 50, 50], C: Pyramid },
  { id: "declarative", title: "Реактивне і декларативне", steps: [40, 60, 70, 50], C: Declarative },
];
