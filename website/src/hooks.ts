import { useEffect, useRef, useState } from "react";

/** One-shot scroll reveal via IntersectionObserver. */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const SCRAMBLE_CHARS = "█▓▒░<>/\\|+=*#";

/** Decode-scramble text effect. */
export function useScramble(text: string, active: boolean, speed = 26) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    let lastT = 0;
    const step = (t: number) => {
      if (t - lastT >= speed) {
        lastT = t;
        frame += 1;
        const reveal = Math.floor(frame / 2);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          if (i < reveal) s += text[i];
          else if (text[i] === " ") s += " ";
          else s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setOut(s);
        if (reveal >= text.length) return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, active, speed]);
  return out;
}

/** Real FPS meter. */
export function useFps() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const loop = (t: number) => {
      frames += 1;
      if (t - last >= 500) {
        setFps(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

/** Session uptime in seconds. */
export function useUptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => setS(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return s;
}

/** Ticking clock. */
export function useClock(intervalMs = 500) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
