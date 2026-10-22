import { loadFont as loadUnbounded } from "@remotion/google-fonts/Unbounded";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const unbounded = loadUnbounded("normal", { weights: ["400", "500", "700"], subsets: ["latin", "cyrillic"] });
const manrope = loadManrope("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "cyrillic"] });
const mono = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin", "cyrillic"] });

/* Section theme «Декларативні та суміжні парадигми» (lectures 12–14): ink-blue signal board, event lanes, marbles. */
export const F = {
  head: `${unbounded.fontFamily}, sans-serif`,
  title: `${unbounded.fontFamily}, sans-serif`,
  body: `${manrope.fontFamily}, Arial, sans-serif`,
  mono: `${mono.fontFamily}, monospace`,
};

// JetBrains Mono advance width is exactly 0.6em, used to place annotations under code columns.
export const CH = 0.6;

export const C = {
  bg: "#0b1020",
  bg2: "#0f1630",
  panel: "#141c33",
  panel2: "#1b2542",
  line: "#2d3a5f",
  grid: "#1a2442",
  text: "#eef1fb",
  dim: "#a9b2d0",
  faint: "#5f6b90",
  accent: "#3ee6c4",
  accentHi: "#6ff5d8",
  teal: "#3ee6c4",
  amber: "#ffbe55",
  coral: "#ff6f7d",
  red: "#ff6f7d",
  violet: "#a08cff",
  lav: "#a08cff",
  blue: "#5aa9ff",
  mint: "#7be08f",
  orange: "#ff9a5c",
  pink: "#ff7ac3",
  kw: "#a08cff",
  op: "#a9b2d0",
  comment: "#6d7899",
  str: "#ffbe55",
  num: "#ff9a5c",
};

/** Marble colours cycle through these, in order. */
export const MARBLES = [C.teal, C.amber, C.violet, C.coral, C.blue, C.mint];

export const FPS = 30;
export const W = 1920;
export const H = 1080;
