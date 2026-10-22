import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { s1Slides } from "./s1-history";
import { s2Slides } from "./s2-principles";
import { s3Slides } from "./s3-frp";
import { s4Slides } from "./s4-tools";
import { s5Slides, s6Slides, summarySlide } from "./s5-eda";
import { outroSlide } from "./outro";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...s1Slides,
  agendaSlide(1),
  ...s2Slides,
  agendaSlide(2),
  ...s3Slides,
  agendaSlide(3),
  ...s4Slides,
  agendaSlide(4),
  ...s5Slides,
  agendaSlide(5),
  ...s6Slides,
  summarySlide,
  outroSlide,
];
