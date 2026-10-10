/** Subtle synthesized UI sounds. No assets, no autoplay — context unlocks on first gesture. */
let ctx: AudioContext | null = null;
let enabled = true;

export const soundEnabled = () => enabled;
export function setSoundEnabled(v: boolean) {
  enabled = v;
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  delay = 0,
  slideTo?: number
) {
  const c = ac();
  if (!c || !enabled) return;
  try {
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(20, freq), t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.03);
  } catch {
    /* ignore audio errors */
  }
}

export const sfx = {
  hover() {
    tone(2500, 0.03, "sine", 0.014);
  },
  click() {
    tone(1500, 0.06, "triangle", 0.05);
    tone(3000, 0.05, "sine", 0.025, 0.016);
  },
  open() {
    tone(430, 0.14, "sine", 0.05, 0, 860);
    tone(1240, 0.12, "sine", 0.028, 0.06);
  },
  close() {
    tone(880, 0.1, "sine", 0.035, 0, 430);
  },
  denied() {
    tone(196, 0.16, "sawtooth", 0.05);
    tone(147, 0.22, "sawtooth", 0.045, 0.06);
  },
  nav() {
    tone(680, 0.08, "sine", 0.045, 0, 1040);
    tone(2040, 0.06, "sine", 0.02, 0.03);
  },
  boot() {
    tone(220, 0.5, "sine", 0.04, 0, 660);
    tone(1320, 0.18, "sine", 0.02, 0.25);
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", () => ac(), { once: true });
  window.addEventListener("keydown", () => ac(), { once: true });
}
