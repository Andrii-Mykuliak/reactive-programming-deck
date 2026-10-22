import { useEffect, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/** Seconds since the slide mounted; keeps running while the player is paused. */
export const useClock = () => {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      setSec((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return sec;
};

/** Ambient time: the player clock while it runs, the wall clock while it is paused (static in renders). */
export const useAmbient = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clock = useClock();
  return Math.max(frame / fps, clock);
};
