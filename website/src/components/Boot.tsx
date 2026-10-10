import { useEffect, useRef, useState } from "react";
import { BOOT_LINES } from "../lib/data";
import { LogoMark } from "./Logo";
import { sfx } from "../lib/audio";

/** Cinematic boot sequence — the threshold into the system. Click to skip. */
export default function Boot({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const skipped = useRef(false);

  useEffect(() => {
    sfx.boot();
    const ids: number[] = [];
    BOOT_LINES.forEach((_, i) => {
      ids.push(window.setTimeout(() => setCount(i + 1), 230 * (i + 1)));
    });
    const tLeaving = window.setTimeout(
      () => setLeaving(true),
      230 * (BOOT_LINES.length + 1) + 400
    );
    const tEnd = window.setTimeout(onDone, 230 * (BOOT_LINES.length + 1) + 400 + 520);
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(tLeaving);
      window.clearTimeout(tEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    if (skipped.current) return;
    skipped.current = true;
    setLeaving(true);
    window.setTimeout(onDone, 320);
  };

  const progress = Math.round((count / BOOT_LINES.length) * 100);

  return (
    <div
      onClick={skip}
      className={`fixed inset-0 z-[75] flex items-center justify-center bg-[#020409] transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      data-cursor="link"
    >
      <div className="w-[min(520px,90vw)]">
        <div className="mb-8 flex items-center gap-4">
          <LogoMark size={52} glow className="anim-pulse" />
          <div>
            <p className="font-display text-xl font-extrabold tracking-[0.42em] text-white text-glow-sm">
              N.O.V.A
            </p>
            <p className="font-hud c-hue-dim mt-1 text-[10px] tracking-[0.34em]">
              ESTABLISHING NEURAL LINK
            </p>
          </div>
        </div>

        <div className="hud-panel p-4">
          <div className="min-h-[132px]">
            {BOOT_LINES.slice(0, count).map((line, i) => (
              <p key={line} className="kf-bootline font-hud text-[11px] leading-relaxed tracking-wide">
                <span className="c-hue mr-2">&gt;</span>
                <span className={i === BOOT_LINES.length - 1 ? "c-hue-bright" : "text-slate-400"}>
                  {line}
                </span>
                {i === count - 1 && <span className="c-hue anim-blink ml-1">▌</span>}
              </p>
            ))}
          </div>
          <div className="mt-4 h-px w-full bg-[hsl(var(--hue)_70%_55%/0.2)]">
            <div
              className="h-px bg-[hsl(var(--hue)_95%_65%)] shadow-[0_0_10px_hsl(var(--hue)_95%_60%)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-hud c-hue-dim text-[9px] tracking-[0.3em]">
              KERNEL 0.9.1
            </span>
            <span className="font-hud c-hue text-[9px] tracking-[0.3em]">{progress}%</span>
          </div>
        </div>

        <p className="font-hud c-hue-faint mt-6 text-center text-[9px] tracking-[0.4em]">
          CLICK ANYWHERE TO SKIP SEQUENCE
        </p>
      </div>
    </div>
  );
}
