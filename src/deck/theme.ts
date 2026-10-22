import { loadFont as loadSerif } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const serif = loadSerif("normal", { weights: ["500", "600", "700"], subsets: ["latin", "cyrillic"] });
const manrope = loadManrope("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "cyrillic"] });
const mono = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin", "cyrillic"] });

/* Section theme «Декларативні та суміжні парадигми» (lectures 12–14): ink-blue board, serif headings, event lanes, marbles. */
export const F = {
  head: `${serif.fontFamily}, Georgia, serif`,
  title: `${serif.fontFamily}, Georgia, serif`,
  body: `${manrope.fontFamily}, Arial, sans-serif`,
  mono: `${mono.fontFamily}, monospace`,
};

// JetBrains Mono advance width is exactly 0.6em, used to place annotations under code columns.
export const CH = 0.6;

export const C = {
  bg: "#0c1222",
  bg2: "#111a30",
  panel: "#141d33",
  panel2: "#1a2541",
  line: "#2f3c5e",
  grid: "#18223d",
  text: "#eef1fb",
  dim: "#a9b2d0",
  faint: "#5f6b90",
  accent: "#4fd3b6",
  accentHi: "#7fe3cc",
  teal: "#4fd3b6",
  amber: "#e9b85c",
  coral: "#ec7c82",
  red: "#ec7c82",
  violet: "#a596f2",
  lav: "#a596f2",
  blue: "#72adf0",
  mint: "#86d99a",
  orange: "#f0a070",
  pink: "#f08cc4",
  kw: "#a596f2",
  op: "#a9b2d0",
  comment: "#6d7899",
  str: "#e9b85c",
  num: "#f0a070",
};

/** Marble colours cycle through these, in order. */
export const MARBLES = [C.teal, C.amber, C.violet, C.coral, C.blue, C.mint];

export const FPS = 30;
export const W = 1920;
export const H = 1080;
