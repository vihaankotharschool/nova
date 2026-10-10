import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Feature } from "../lib/data";
import FeatureVisual from "./MiniVisuals";
import { Corners } from "./Hud";
import { IconClose } from "./Icons";
import { sfx } from "../lib/audio";

/** Full module file — pops up when a feature card or topology node is clicked. */
export default function FeatureModal({
  feature,
  onClose,
}: {
  feature: Feature;
  onClose: () => void;
}) {
  const handleClose = () => {
    sfx.close();
    onClose();
  };

  useEffect(() => {
    sfx.open();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sfx.close();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[72] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/72 backdrop-blur-[3px]"
        onClick={handleClose}
        data-cursor="link"
      />
      <div className="modal-in hud-panel relative w-full max-w-3xl overflow-hidden">
        <Corners className="text-[hsl(var(--hue)_90%_65%/0.8)]" size={14} />

        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-[hsl(var(--hue)_80%_60%/0.2)] px-6 py-3.5">
          <div className="flex items-center gap-3">
            <span className="font-hud c-hue text-[11px] tracking-[0.3em]">{feature.code}</span>
            <span className="chip hidden sm:inline">CORE MODULE // INTEGRATED</span>
          </div>
          <button
            onClick={handleClose}
            onMouseEnter={() => sfx.hover()}
            data-cursor="link"
            className="c-hue-dim p-1 transition-colors hover:text-[hsl(var(--hue)_100%_80%)]"
            aria-label="Close module file"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="grid max-h-[70vh] gap-6 overflow-y-auto p-6 md:grid-cols-5 md:p-7">
          <div className="hud-panel md:col-span-2">
            <div className="aspect-square p-2">
              <FeatureVisual id={feature.id} />
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="font-display pointer-events-none select-none text-[4rem] font-black leading-none tracking-tight text-white opacity-[0.06]">
              {feature.index}
            </p>
            <h3 className="font-display -mt-6 text-2xl font-extrabold uppercase tracking-wide text-white text-glow-sm sm:text-3xl">
              {feature.name}
            </h3>
            <p className="font-hud c-hue mt-2 text-[11px] tracking-[0.24em]">{feature.tag}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{feature.desc}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{feature.detail}</p>

            <p className="font-hud c-hue mt-6 text-[10px] tracking-[0.34em]">SUBSYSTEMS //</p>
            <ul className="mt-2.5 space-y-1.5">
              {feature.subs.map((s) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="c-hue mt-0.5 text-xs">▸</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[hsl(var(--hue)_80%_60%/0.2)] px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {feature.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <button onClick={handleClose} onMouseEnter={() => sfx.hover()} className="btn">
            <IconClose className="h-3.5 w-3.5" />
            CLOSE FILE
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
