import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Ev, Lane, OpBox } from "./kit";

/* FRP = functional + reactive */
const Venn: React.FC = () => {
  const { s } = useSteps();
  const join = s(2, 0);
  const R = 270;
  const CY = 590;
  const dx = mix(380, 200, join);
  const circle = (cx: number, color: string, title: string, items: string[], side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        left: cx - R,
        top: CY - R,
        width: R * 2,
        height: R * 2,
        borderRadius: R,
        border: `3px solid ${color}`,
        background: `${color}14`,
        opacity: clamp01(s(1, side < 0 ? 0 : 8, POP)),
      }}
    >
      <div style={{ position: "absolute", top: 150, left: side < 0 ? 70 : 170, width: 300, textAlign: side < 0 ? "left" : "right" }}>
        <div style={{ fontFamily: F.head, fontWeight: 600, fontSize: 38, color }}>{title}</div>
        {items.map((it) => (
          <div key={it} style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.text, marginTop: 12 }}>
            {it}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Slide title="Функціональне реактивне програмування">
      <Lead size={36}>
        FRP поєднує ідеї функційного програмування з реактивними патернами, щоб системи ефективно реагували на зміни даних або середовища.
      </Lead>
      {circle(960 - dx, C.violet, "Функційне", ["функції вищого порядку", "незмінні дані"], -1)}
      {circle(960 + dx, C.teal, "Реактивне", ["потоки подій", "асинхронність"], 1)}
      <div style={{ position: "absolute", left: 960 - 90, top: CY - 50, width: 180, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 76, color: C.text, opacity: clamp01(s(2, 12, POP)), textShadow: `0 0 30px ${C.teal}` }}>
        FRP
      </div>
      <At x={96} y={900} w={1728} step={3} size={32} weight={700}>
        Програми з функцій вищого порядку й незмінних даних простіше розуміти та підтримувати.
      </At>
    </Slide>
  );
};

/* Key aspects, each with a small picture */
const Continuous: React.FC<{ p: number }> = ({ p }) => {
  const pts = Array.from({ length: 60 }, (_, i) => `${i * 6},${40 + 26 * Math.sin(i / 6)}`).join(" ");
  return (
    <svg width={380} height={120} style={{ opacity: clamp01(p) }}>
      <polyline points={pts} fill="none" stroke={C.teal} strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={102} x2={370} y2={102} stroke={C.line} strokeWidth={3} />
      {[30, 120, 150, 260, 330].map((x, i) => (
        <circle key={i} cx={x} cy={102} r={10} fill={C.amber} />
      ))}
    </svg>
  );
};

const ASPECTS = [
  { t: "Неперервні й дискретні потоки", d: "Постійно змінні значення, як-от дані сенсора, і події, що відбуваються в певні моменти.", c: C.teal, pic: "flow" },
  { t: "Функційні абстракції", d: "map, filter і fold перетворюють потоки, не змінюючи джерел даних.", c: C.violet, pic: "ops" },
  { t: "Час як основна складова", d: "Потоки змінюються з часом, тому важливі часові відношення між подіями.", c: C.amber, pic: "time" },
  { t: "Незмінність даних", d: "Незмінні структури зменшують кількість помилок, пов’язаних зі станом.", c: C.coral, pic: "lock" },
];

const Aspects: React.FC = () => {
  const { s } = useSteps();
  const pos = [
    [96, 300],
    [974, 300],
    [96, 650],
    [974, 650],
  ];
  return (
    <Slide title="Ключові аспекти FRP">
      {ASPECTS.map((a, i) => {
        const p = s(i + 1, 0, POP);
        return (
          <Panel key={a.t} x={pos[i][0]} y={pos[i][1]} w={850} h={320} title={a.t} color={a.c} p={p}>
            <div style={{ display: "flex", gap: 26, alignItems: "flex-start", marginTop: 8 }}>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, width: a.pic === "flow" ? 380 : 470 }}>{a.d}</div>
              <div style={{ marginTop: 6 }}>
                {a.pic === "flow" && <Continuous p={s(i + 1, 10)} />}
                {a.pic === "ops" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["map", "filter", "fold"].map((o, k) => (
                      <Chip key={o} color={[C.amber, C.violet, C.teal][k]} size={28} style={{ opacity: clamp01(s(i + 1, 10 + k * 5)) }}>
                        {o}
                      </Chip>
                    ))}
                  </div>
                )}
                {a.pic === "time" && (
                  <svg width={260} height={150} style={{ opacity: clamp01(s(i + 1, 10)) }}>
                    <circle cx={75} cy={75} r={62} fill="none" stroke={C.amber} strokeWidth={5} />
                    <line x1={75} y1={75} x2={75} y2={30} stroke={C.amber} strokeWidth={5} strokeLinecap="round" />
                    <line x1={75} y1={75} x2={110} y2={92} stroke={C.text} strokeWidth={5} strokeLinecap="round" />
                    <line x1={160} y1={75} x2={250} y2={75} stroke={C.line} strokeWidth={4} />
                    <polygon points="258,75 244,67 244,83" fill={C.line} />
                  </svg>
                )}
                {a.pic === "lock" && (
                  <div style={{ display: "flex", gap: 14, opacity: clamp01(s(i + 1, 10)) }}>
                    {["[1,2]", "[1,2,3]"].map((v, k) => (
                      <div key={v} style={{ padding: "12px 16px", borderRadius: 12, border: `2.5px solid ${k ? C.coral : C.faint}`, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: k ? C.coral : C.dim }}>
                        {v}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        );
      })}
    </Slide>
  );
};

/* Search while typing: input → debounceTime → map → switchMap */
const W_IN: Ev[] = [
  { at: 0.03, v: "р", w: 70 },
  { at: 0.13, v: "ре", w: 80 },
  { at: 0.24, v: "реа", w: 96 },
  { at: 0.48, v: "реак", w: 112 },
  { at: 0.63, v: "реакт", w: 128 },
];
const W_DEB: Ev[] = [
  { at: 0.36, v: "реа", w: 96, c: C.violet },
  { at: 0.76, v: "реакт", w: 128, c: C.violet },
];
const W_REQ: Ev[] = [
  { at: 0.36, v: "?q=реа", w: 150, c: C.amber },
  { at: 0.76, v: "?q=реакт", w: 186, c: C.amber },
];
const W_RES: Ev[] = [
  { at: 0.5, v: "12 рез.", w: 150, c: C.teal },
  { at: 0.9, v: "4 рез.", w: 136, c: C.teal },
];

const Search: React.FC = () => {
  const { s } = useSteps();
  const X = 96;
  const WW = 1250;
  const LB = 230;
  const note = (y: number, step: number, text: string) => (
    <At x={1380} y={y} w={444} step={step} delay={6} size={28} weight={700} color={C.dim}>
      {text}
    </At>
  );
  return (
    <Slide title="Приклад: пошук під час введення">
      <Lead size={34}>
        Результати пошуку з’являються самі, поки користувач вводить текст: потік змін поля проходить через оператори.
      </Lead>
      <Lane x={X} y={350} w={WW} labelW={LB} label="введення" events={W_IN} step={1} dur={70} r={26} />
      <OpBox x={X + LB} y={392} w={WW - LB - 40} h={64} p={s(2, 0)} color={C.violet}>
        debounceTime(300)
      </OpBox>
      {note(392, 2, "чекає паузи у введенні, щоб не слати запит на кожну літеру")}
      <Lane x={X} y={500} w={WW} labelW={LB} label="текст" events={W_DEB} step={2} delay={10} dur={60} r={26} />
      <OpBox x={X + LB} y={542} w={WW - LB - 40} h={64} p={s(3, 0)} color={C.amber}>
        map(text =&gt; запит)
      </OpBox>
      {note(542, 3, "перетворює текст на пошуковий запит")}
      <Lane x={X} y={650} w={WW} labelW={LB} label="запити" events={W_REQ} step={3} delay={10} dur={60} r={26} />
      <OpBox x={X + LB} y={692} w={WW - LB - 40} h={64} p={s(4, 0)} color={C.teal}>
        switchMap(пошук)
      </OpBox>
      {note(692, 4, "виконує запит і бере відповідь лише на останній")}
      <Lane x={X} y={800} w={WW} labelW={LB} label="результат" events={W_RES} step={4} delay={10} dur={60} r={26} />
      <At x={96} y={880} w={1728} step={5} size={32} weight={700}>
        Логіку описано декларативно: <A>що</A> робити з потоком подій, а не як вручну керувати таймерами й запитами.
      </At>
    </Slide>
  );
};

/* React and FRP */
const BOX_W = 104;
const BOX_H = 46;
const TREE: { x: number; y: number; d: number }[] = [
  { x: 380, y: 30, d: 0 },
  { x: 260, y: 140, d: 1 },
  { x: 500, y: 140, d: 1 },
  { x: 190, y: 250, d: 2 },
  { x: 330, y: 250, d: 2 },
  { x: 500, y: 250, d: 2 },
];
const TREE_EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
];
const RENDER_AT = 30;
const LEVEL_GAP = 14;

const ReactVsFrp: React.FC = () => {
  const { s, t } = useSteps();
  const flash = (d: number) => {
    const tt = t(1, RENDER_AT + d * LEVEL_GAP);
    return tt < 0 ? 0 : Math.max(0, 1 - Math.abs(tt - 8) / 16);
  };
  const changed = t(1, 18) >= 0;
  const chip = s(1, 18, POP);
  return (
    <Slide title="React і FRP">
      <Lead size={36}>React перегукується з FRP, але не є його класичним представником.</Lead>
      <Panel x={96} y={300} w={840} h={540} title="React" color={C.blue} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>
          Декларативний інтерфейс: зміна <A c={C.blue}>стану</A> спричиняє повторний рендеринг компонентів.
        </div>
        <svg width={640} height={310} style={{ position: "absolute", left: 100, top: 210, overflow: "visible" }}>
          {TREE_EDGES.map(([a, b], i) => (
            <path
              key={i}
              d={`M ${TREE[a].x} ${TREE[a].y + BOX_H} C ${TREE[a].x} ${TREE[a].y + BOX_H + 34}, ${TREE[b].x} ${TREE[b].y - 34}, ${TREE[b].x} ${TREE[b].y}`}
              fill="none"
              stroke={C.dim}
              strokeWidth={3}
              opacity={0.55}
            />
          ))}
          <g opacity={clamp01(s(1, 6))}>
            <rect x={0} y={TREE[0].y} width={170} height={BOX_H} rx={23} fill={C.bg} stroke={C.amber} strokeWidth={3} />
            <text x={85} y={TREE[0].y + 31} textAnchor="middle" fontFamily={F.mono} fontWeight={700} fontSize={24} fill={C.amber} style={{ transform: `scale(${changed ? 1 + 0.12 * (1 - clamp01(chip)) : 1})`, transformOrigin: "85px 53px" }}>
              {`стан: ${changed ? 2 : 1}`}
            </text>
            <line x1={182} y1={TREE[0].y + BOX_H / 2} x2={TREE[0].x - BOX_W / 2 - 14} y2={TREE[0].y + BOX_H / 2} stroke={C.amber} strokeWidth={3} />
            <polygon points={`${TREE[0].x - BOX_W / 2 - 4},${TREE[0].y + BOX_H / 2} ${TREE[0].x - BOX_W / 2 - 18},${TREE[0].y + BOX_H / 2 - 8} ${TREE[0].x - BOX_W / 2 - 18},${TREE[0].y + BOX_H / 2 + 8}`} fill={C.amber} />
          </g>
          {TREE.map((n, i) => {
            const f = flash(n.d);
            return (
              <rect
                key={i}
                x={n.x - BOX_W / 2}
                y={n.y}
                width={BOX_W}
                height={BOX_H}
                rx={12}
                fill={f > 0.02 ? C.blue : C.bg}
                fillOpacity={f > 0.02 ? 0.25 + 0.75 * f : 1}
                stroke={C.blue}
                strokeWidth={3}
                style={{ filter: f > 0.05 ? `drop-shadow(0 0 ${14 * f}px ${C.blue})` : undefined }}
              />
            );
          })}
        </svg>
      </Panel>
      <Panel x={984} y={300} w={840} h={540} title="FRP" color={C.teal} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>
          Ширший фокус: <A>потоки подій</A> і реактивні змінні, що змінюються в часі.
        </div>
      </Panel>
      <Lane x={1030} y={640} w={760} events={[{ at: 0.1 }, { at: 0.34 }, { at: 0.5 }, { at: 0.78 }]} step={2} delay={10} dur={50} r={24} />
      <At x={96} y={880} w={1728} step={3} size={32} weight={700}>
        React не має повного набору засобів для асинхронних потоків, тому в React-застосунках часто додають <A>RxJS</A>.
      </At>
    </Slide>
  );
};

/* FRP libraries and languages */
const LIBS = [
  { t: "ReactiveX", d: "Сімейство бібліотек для реактивного програмування в багатьох мовах.", chips: ["RxJS", "RxJava", "Rx.NET", "RxSwift"], c: C.teal },
  { t: "Bacon.js", d: "Невелика бібліотека FRP для JavaScript: проста обробка потоків подій і даних.", chips: [], c: C.amber },
  { t: "Cycle.js", d: "Фреймворк для вебзастосунків, де компоненти – чисті функції над потоками даних.", chips: [], c: C.violet },
  { t: "F# та Elm", d: "Підтримка FRP на рівні мови; Elm використовує FRP для вебінтерфейсів.", chips: [], c: C.coral },
];

const Libraries: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Бібліотеки та мови FRP">
      {LIBS.map((l, i) => (
        <Panel key={l.t} x={96 + (i % 2) * 878} y={250 + Math.floor(i / 2) * 330} w={850} h={300} title={l.t} color={l.c} p={s(1, i * 8, POP)}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.38, color: C.text, marginTop: 8 }}>{l.d}</div>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            {l.chips.map((c) => (
              <Chip key={c} color={l.c} size={26}>
                {c}
              </Chip>
            ))}
          </div>
        </Panel>
      ))}
      <At x={96} y={930} w={1728} step={2} size={30} weight={700} color={C.dim}>
        Усі вони дають інструменти для асинхронних потоків даних і подій у складних інтерактивних системах.
      </At>
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "frp", title: "FRP", steps: [40, 50, 60, 40], C: Venn },
  { id: "aspects", title: "Ключові аспекти FRP", steps: [30, 40, 40, 40, 40], C: Aspects },
  { id: "search", title: "Пошук під час введення", steps: [40, 90, 80, 80, 80, 50], C: Search },
  { id: "react", title: "React і FRP", steps: [40, 90, 80, 50], C: ReactVsFrp },
  { id: "frp-libs", title: "Бібліотеки FRP", steps: [40, 60, 40], C: Libraries },
];

