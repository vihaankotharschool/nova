import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useReveal, useFps, useUptime, useClock } from "../hooks";
import { pointerStore } from "../lib/store";
import { TICKER_ITEMS } from "../lib/data";

/* Corner brackets — place inside any relative container. */
export function Corners({ className = "", size = 12 }: { className?: string; size?: number }) {
  const s = { width: size, height: size };
  return (
    <span className={`pointer-events-none absolute inset-0 z-10 ${className}`} aria-hidden>
      <i className="absolute left-0 top-0 border-l border-t border-current" style={s} />
      <i className="absolute right-0 top-0 border-r border-t border-current" style={s} />
      <i className="absolute bottom-0 left-0 border-b border-l border-current" style={s} />
      <i className="absolute bottom-0 right-0 border-b border-r border-current" style={s} />
    </span>
  );
}

/* Scroll-reveal wrapper with stagger delay. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* Section heading block with ghost index. */
export function SectionHead({
  kicker,
  title,
  index,
  right,
}: {
  kicker: string;
  title: string;
  index: string;
  right?: ReactNode;
}) {
  return (
    <div className="relative mb-10 flex flex-wrap items-end justify-between gap-6">
      <Reveal>
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-10 bg-[hsl(var(--hue)_90%_62%/0.6)]" />
          <span className="font-hud text-[11px] tracking-[0.42em] c-hue">{kicker}</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white text-glow sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </Reveal>
      {right ? (
        <Reveal delay={150} className="pb-1">
          {right}
        </Reveal>
      ) : null}
      <span
        className="font-display pointer-events-none absolute -top-8 right-0 select-none text-[6rem] font-black leading-none tracking-tighter opacity-[0.045] lg:text-[9rem]"
        aria-hidden
      >
        {index}
      </span>
    </div>
  );
}

/* Capability ticker band. */
export function Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="font-display px-6 text-sm font-semibold tracking-[0.34em] text-[hsl(var(--hue)_70%_75%/0.55)] sm:px-10">
            {item}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" className="c-hue opacity-60" aria-hidden>
            <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-[hsl(var(--hue)_80%_60%/0.14)] bg-[hsl(var(--hue)_60%_8%/0.35)] py-3.5">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* Live telemetry strip along the bottom — all real values. */
export function TelemetryBar() {
  const fps = useFps();
  const up = useUptime();
  const now = useClock(500);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const id = window.setInterval(
      () => setPos({ x: Math.round(pointerStore.x), y: Math.round(pointerStore.y) }),
      250
    );
    return () => window.clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden items-center justify-between border-t border-[hsl(var(--hue)_80%_60%/0.12)] bg-[#04060c]/70 px-6 py-1.5 font-hud text-[9px] tracking-[0.28em] backdrop-blur-sm md:flex">
      <span className="c-hue-dim">OPERATOR: GUEST // LINK: ENCRYPTED</span>
      <span className="c-hue-faint">
        X:{pad(pos.x % 10000)} Y:{pad(pos.y % 10000)} // FPS:{fps} // UPTIME:
        {pad(Math.floor(up / 60))}:{pad(up % 60)}
      </span>
      <span className="c-hue-dim">
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())} LOCAL
      </span>
    </div>
  );
}

/* Viewport frame + side rails for the "inside the system" feel. */
export function FrameRails() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block" aria-hidden>
      <Corners className="text-[hsl(var(--hue)_90%_65%/0.4)]" size={26} />
      <span className="writing-v c-hue-faint absolute left-5 top-1/2 -translate-y-1/2 rotate-180 font-hud text-[9px] tracking-[0.5em]">
        N.O.V.A // OMNIPRESENT GRID — LINK ESTABLISHED
      </span>
      <span className="writing-v c-hue-faint absolute right-5 top-1/2 -translate-y-1/2 font-hud text-[9px] tracking-[0.5em]">
        SIGNAL ▮▮▮▯ SECURE // SECTOR 07
      </span>
    </div>
  );
}
