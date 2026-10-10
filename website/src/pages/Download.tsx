import { useState } from "react";
import type { ReactNode } from "react";
import type { Page } from "../components/Nav";
import { Corners, Reveal } from "../components/Hud";
import { IconWindows, IconArchive, IconLock, IconArrowR } from "../components/Icons";
import { PHASES, REQUIREMENTS, WINDOWS_META, SOURCE_META } from "../lib/data";
import { sfx } from "../lib/audio";

function DownloadPanel({
  icon,
  title,
  file,
  meta,
  action,
  locked = true,
}: {
  icon: ReactNode;
  title: string;
  file: string;
  meta: string[][];
  action: string;
  locked?: boolean;
}) {
  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(false);

  const denied = () => {
    sfx.denied();
    setFlash(true);
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
    window.setTimeout(() => setFlash(false), 2200);
  };

  return (
    <div className={`hud-panel hud-panel-hover relative p-7 ${shake ? "shake" : ""}`}>
      <Corners
        className={locked ? "text-[hsl(38_85%_58%/0.55)]" : "text-[hsl(var(--hue)_90%_65%/0.7)]"}
        size={13}
      />
      {locked ? (
        <span className="font-hud anim-pulse absolute right-5 top-5 border border-dashed border-[hsl(38_85%_58%/0.55)] px-2.5 py-1 text-[9px] tracking-[0.3em] text-[hsl(38_88%_64%)]">
          COMING SOON
        </span>
      ) : (
        <span className="font-hud absolute right-5 top-5 flex items-center gap-2 border border-[hsl(var(--hue)_85%_60%/0.45)] bg-[hsl(var(--hue)_85%_60%/0.08)] px-2.5 py-1 text-[9px] tracking-[0.3em] text-[hsl(var(--hue)_92%_72%)]">
          <span className="anim-pulse h-1 w-1 rounded-full bg-current" />
          AVAILABLE
        </span>
      )}

      <div className="flex items-center gap-4">
        <span className="bd-hue c-hue border p-3.5">{icon}</span>
        <div>
          <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white sm:text-2xl">
            {title}
          </h3>
          <p className="font-hud c-hue-dim mt-1 text-[11px] tracking-[0.24em]">{file}</p>
        </div>
      </div>

      <div className="mt-6">
        {meta.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between border-b border-white/[0.06] py-2.5"
          >
            <span className="font-hud c-hue-faint text-[10px] tracking-[0.3em]">{k}</span>
            <span className="font-hud text-[11px] tracking-[0.14em] text-slate-300">{v}</span>
          </div>
        ))}
      </div>

      {locked ? (
        <div className="mt-5 flex items-center gap-2.5">
          <IconLock className="h-4 w-4 text-[hsl(38_88%_62%)]" />
          <span className="font-hud text-[10px] tracking-[0.3em] text-[hsl(38_80%_66%/0.85)]">
            RELEASE SIGNAL REQUIRED
          </span>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-2.5">
          <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-[hsl(var(--hue)_95%_62%)] shadow-[0_0_8px_hsl(var(--hue)_95%_60%)]" />
          <span className="font-hud c-hue text-[10px] tracking-[0.3em]">
            TRANSFER CHANNEL OPEN
          </span>
        </div>
      )}

      {locked ? (
        <button
          onClick={denied}
          onMouseEnter={() => sfx.hover()}
          data-cursor="off"
          className="btn btn-locked mt-5 w-full justify-center"
          aria-disabled="true"
        >
          <IconLock className="h-3.5 w-3.5" />
          {action} — LOCKED
        </button>
      ) : (
        <button
          onClick={() => {
            /* TODO: wire the attached NOVA source archive (.zip) here */
          }}
          onMouseEnter={() => sfx.hover()}
          data-cursor="link"
          className="btn btn-primary mt-5 w-full justify-center"
        >
          <IconArrowR className="h-3.5 w-3.5" />
          {action}
        </button>
      )}

      {flash && (
        <p className="kf-bootline font-hud mt-4 border border-[hsl(38_85%_55%/0.4)] bg-[hsl(38_85%_50%/0.08)] px-3 py-2.5 text-[10px] leading-relaxed tracking-[0.18em] text-[hsl(38_90%_70%)]">
          ▸ TRANSMISSION BLOCKED — NO RELEASE SIGNAL. This channel opens when NOVA goes public. No
          phantom files, no fake links.
        </p>
      )}
    </div>
  );
}

export default function Download({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <>
      {/* ============ BAY HEADER ============ */}
      <section data-hue="268" className="relative mx-auto max-w-7xl px-6 pb-14 pt-36">
        <div className="relative mb-10 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-10 bg-[hsl(var(--hue)_90%_62%/0.6)]" />
              <span className="font-hud c-hue text-[11px] tracking-[0.42em]">
                TRANSFER BAY 07 // STATUS: HOLD
              </span>
            </div>
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white text-glow sm:text-4xl lg:text-5xl">
              Download Bay
            </h2>
          </Reveal>
          <Reveal delay={150} className="pb-1">
            <div className="flex flex-wrap gap-2.5">
              <span className="chip flex items-center gap-2">
                <span className="anim-pulse h-1 w-1 rounded-full bg-current" />
                SOURCE: OPEN
              </span>
              <span className="chip flex items-center gap-2 border-[hsl(38_85%_55%/0.4)] text-[hsl(38_88%_64%)]">
                <IconLock className="h-3 w-3" />
                BUILD: LOCKED
              </span>
            </div>
          </Reveal>
          <span className="font-display pointer-events-none absolute -top-10 right-0 select-none text-[6rem] font-black leading-none tracking-tighter opacity-[0.045] lg:text-[9rem]" aria-hidden>
            03
          </span>
        </div>

        <Reveal delay={100}>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
            Two channels are hardwired into this bay. The source archive is open and ready to pull;
            the signed Windows build stays sealed until the release signal drops, then activates
            exactly as it looks.
          </p>
        </Reveal>
      </section>

      {/* ============ THE TWO CONTROLS ============ */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <DownloadPanel
              icon={<IconWindows className="h-9 w-9" />}
              title="Download NOVA for Windows"
              file="NOVA-SETUP-0.9.EXE"
              meta={WINDOWS_META}
              action="DOWNLOAD .EXE"
            />
          </Reveal>
          <Reveal delay={140}>
            <DownloadPanel
              icon={<IconArchive className="h-9 w-9" />}
              title="Download Source Code"
              file="NOVA-SOURCE-0.9.ZIP"
              meta={SOURCE_META}
              action="DOWNLOAD .ZIP"
              locked={false}
            />
          </Reveal>
        </div>
      </section>

      {/* ============ PROTOCOL + REQUIREMENTS ============ */}
      <section data-hue="286" className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* release protocol */}
          <div>
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[hsl(var(--hue)_90%_62%/0.6)]" />
                <span className="font-hud c-hue text-[11px] tracking-[0.4em]">RELEASE PROTOCOL</span>
              </div>
            </Reveal>
            <div className="relative ml-2 space-y-8 border-l border-dashed border-[hsl(var(--hue)_80%_60%/0.25)] pl-8">
              {PHASES.map((p, i) => {
                const active = p.state === "ACTIVE";
                const locked = p.state === "LOCKED";
                return (
                  <Reveal key={p.code} delay={i * 120}>
                    <div className="relative">
                      <span
                        className={`absolute -left-[41px] top-1 flex h-4 w-4 items-center justify-center rounded-full border ${
                          active
                            ? "border-[hsl(var(--hue)_95%_62%)] bg-[hsl(var(--hue)_95%_60%/0.25)] shadow-[0_0_12px_hsl(var(--hue)_95%_60%/0.6)]"
                            : locked
                              ? "border-[hsl(38_85%_55%/0.6)]"
                              : "border-[hsl(var(--hue)_60%_60%/0.4)]"
                        }`}
                      >
                        {active && (
                          <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-[hsl(var(--hue)_100%_75%)]" />
                        )}
                      </span>
                      <div className="hud-panel hud-panel-hover p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="font-hud c-hue-faint text-[10px] tracking-[0.3em]">
                            {p.code}
                          </span>
                          <span
                            className={`chip ${
                              active
                                ? ""
                                : locked
                                  ? "border-[hsl(38_85%_55%/0.5)] text-[hsl(38_88%_64%)]"
                                  : "text-slate-400"
                            } ${active ? "anim-pulse" : ""}`}
                          >
                            {p.state}
                          </span>
                        </div>
                        <p className="font-display mt-2 text-lg font-bold uppercase tracking-wide text-white">
                          {p.name}
                        </p>
                        <p className="mt-1.5 text-sm text-slate-400">{p.note}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* system requirements */}
          <div>
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[hsl(var(--hue)_90%_62%/0.6)]" />
                <span className="font-hud c-hue text-[11px] tracking-[0.4em]">
                  SYSTEM REQUIREMENTS
                </span>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="hud-panel relative p-6">
                <Corners className="text-[hsl(var(--hue)_90%_65%/0.6)]" size={12} />
                {REQUIREMENTS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-3 last:border-0"
                  >
                    <span className="font-hud c-hue-faint text-[10px] tracking-[0.28em]">{k}</span>
                    <span className="font-hud text-right text-[11px] tracking-[0.12em] text-slate-300">
                      {v}
                    </span>
                  </div>
                ))}
                <p className="font-hud c-hue-dim mt-5 text-[10px] leading-relaxed tracking-[0.2em]">
                  // NOVA'S OFFLINE CORE RUNS WITHOUT A NETWORK. CLOUD MODULES LIGHT UP WHEN YOU
                  ALLOW THEM.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CLOSING ============ */}
      <section data-hue="300" className="relative mx-auto max-w-7xl px-6 pb-28">
        <Reveal>
          <div className="hud-panel relative flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <Corners className="text-[hsl(var(--hue)_90%_65%/0.6)]" size={12} />
            <div>
              <p className="font-hud c-hue text-[10px] tracking-[0.4em]">STANDING ORDER //</p>
              <p className="font-display mt-2 max-w-xl text-xl font-bold uppercase leading-snug tracking-wide text-white sm:text-2xl">
                When the signal drops, this bay activates.
              </p>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Until then — inspect the capability matrix, or return to the core and watch the orb
                breathe.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <button
                className="btn btn-primary"
                onMouseEnter={() => sfx.hover()}
                onClick={() => {
                  sfx.click();
                  onNavigate("features");
                }}
              >
                CAPABILITY MATRIX
                <IconArrowR className="h-3.5 w-3.5" />
              </button>
              <button
                className="btn"
                onMouseEnter={() => sfx.hover()}
                onClick={() => {
                  sfx.click();
                  onNavigate("home");
                }}
              >
                RETURN TO CORE
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
