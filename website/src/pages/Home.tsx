import type { Page } from "../components/Nav";
import ArmorStage from "../components/ArmorStage";
import NovaOrb from "../components/NovaOrb";
import { LogoMark } from "../components/Logo";
import { Corners, Reveal, SectionHead, Ticker } from "../components/Hud";
import { IconArrowR, ICON_MAP } from "../components/Icons";
import TiltCard from "../components/TiltCard";
import { HOME_MODULES, DOCTRINE } from "../lib/data";
import { sfx } from "../lib/audio";

export default function Home({ onNavigate }: { onNavigate: (p: Page) => void }) {

  return (
    <>
      {/* ============ SCROLL STAGE // THE ARMOR ============ */}
      <ArmorStage onNavigate={onNavigate} />

      {/* ============ CORE CHAMBER // EMBER ORB ============ */}
      <section data-hue="26" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-10 bg-[hsl(28_92%_56%/0.6)]" />
                <span className="font-hud text-[11px] tracking-[0.42em] text-[hsl(30_95%_64%)]">
                  CORE CHAMBER // EMBER SIGNATURE
                </span>
              </div>
              <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
                The mind beneath
                <br />
                the armor
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-400">
                This is NOVA's living core — a contained ember lattice that thinks in energy.
                It tilts toward your cursor, surges when you reach for it, and spins when you
                take hold. The armor is the body. This is the mind.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="chip flex items-center gap-2 border-[hsl(28_90%_55%/0.4)] text-[hsl(30_90%_70%)]">
                  <span className="anim-pulse h-1 w-1 rounded-full bg-current" /> EMBER CORE: STABLE
                </span>
                <span className="chip border-[hsl(28_90%_55%/0.4)] text-[hsl(30_90%_70%)]">
                  CONTAINMENT: 100%
                </span>
              </div>
              <p className="font-hud mt-6 text-[10px] tracking-[0.3em] text-[hsl(30_60%_62%/0.7)]">
                // HOVER TO CHARGE — DRAG TO SPIN THE LATTICE
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative mx-auto w-full max-w-[600px]">
              <NovaOrb className="w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* ============ WHAT IS NOVA ============ */}
      <section data-hue="215" className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-10 bg-[hsl(var(--hue)_90%_62%/0.6)]" />
                  <span className="font-hud c-hue text-[11px] tracking-[0.42em]">
                    IDENTIFICATION // ENTITY PROFILE
                  </span>
                </div>
                <h2 className="font-display text-3xl font-extrabold uppercase tracking-wide text-white text-glow sm:text-4xl">
                  What is NOVA
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  NOVA is an omnipresent assistant layer that sits beneath your operating system —
                  six fused senses working as one mind. It does not wait in a tab. It watches the
                  state of your world and moves when you do.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Everything below is already wired into the core. Nothing is a roadmap promise —
                  every module ships on day one.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <span className="chip mt-7 inline-flex items-center gap-2">
                  <span className="anim-pulse h-1 w-1 rounded-full bg-current" />
                  NOT A CHATBOT // A PRESENCE
                </span>
              </Reveal>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-8">
            {HOME_MODULES.map((m, i) => {
              const Icon = ICON_MAP[m.icon];
              return (
                <Reveal key={m.index} delay={i * 70}>
                  <TiltCard
                    max={3.5}
                    cursor="link"
                    onClick={() => onNavigate("features")}
                    className="h-full"
                  >
                    <div className="hud-panel hud-panel-hover group flex items-center gap-5 p-5">
                      <span className="font-display c-hue w-10 shrink-0 text-2xl font-black opacity-50">
                        {m.index}
                      </span>
                      <span className="bd-hue c-hue shrink-0 border p-2.5 transition-shadow duration-300 group-hover:shadow-[0_0_16px_hsl(var(--hue)_90%_60%/0.35)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="font-display block text-base font-bold uppercase tracking-wide text-white sm:text-lg">
                          {m.name}
                        </span>
                        <span className="mt-1 block text-sm leading-snug text-slate-400">
                          {m.line}
                        </span>
                      </span>
                      <IconArrowR className="c-hue-faint ml-auto h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[hsl(var(--hue)_95%_70%)]" />
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DOCTRINE ============ */}
      <section
        data-hue="252"
        className="relative border-y border-[hsl(var(--hue)_80%_60%/0.12)] bg-[hsl(var(--hue)_50%_7%/0.3)] py-28"
      >
        <div className="mx-auto max-w-5xl px-6">
          <SectionHead kicker="OPERATING DOCTRINE" title="Three Laws" index="III" />
          {DOCTRINE.map((d, i) => (
            <Reveal key={d.n} delay={i * 90}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-6 border-b border-[hsl(var(--hue)_80%_60%/0.1)] py-9 last:border-0 sm:gap-10">
                <span className="font-display c-hue text-5xl font-black leading-none opacity-40 transition-opacity duration-300 group-hover:opacity-90 sm:text-7xl">
                  {d.n}
                </span>
                <span>
                  <span className="font-display block text-xl font-bold uppercase tracking-widest text-white sm:text-2xl">
                    {d.title}
                  </span>
                  <span className="mt-3 block max-w-2xl text-sm leading-relaxed text-slate-400">
                    {d.body}
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section data-hue="300" className="relative mx-auto max-w-5xl px-6 py-28">
        <Reveal>
          <div className="conic-border">
            <div className="relative bg-[#05080f]/95 px-7 py-12 sm:px-12">
              <Corners className="text-[hsl(var(--hue)_90%_65%/0.8)]" size={16} />
              <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <p className="font-hud c-hue text-[11px] tracking-[0.42em]">FINAL DIRECTIVE //</p>
                  <h2 className="font-display mt-3 text-3xl font-black uppercase leading-tight tracking-wide text-white text-glow sm:text-5xl">
                    Ready to wake NOVA?
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-slate-400">
                    The download bay is pressurizing. The Windows build and full source are in
                    final calibration — the grid activates the moment the signal drops.
                  </p>
                  <button
                    className="btn btn-primary mt-8"
                    onMouseEnter={() => sfx.hover()}
                    onClick={() => {
                      sfx.click();
                      onNavigate("download");
                    }}
                  >
                    PROCEED TO DOWNLOAD BAY
                    <IconArrowR className="h-3.5 w-3.5" />
                  </button>
                  <p className="font-hud c-hue-faint mt-4 text-[10px] tracking-[0.28em]">
                    WINDOWS .EXE + SOURCE .ZIP // PENDING RELEASE
                  </p>
                </div>
                <div className="relative hidden shrink-0 md:block">
                  <LogoMark size={150} glow className="anim-floaty opacity-90" />
                  <span className="font-hud c-hue-faint absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.4em]">
                    CORE // STANDBY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
