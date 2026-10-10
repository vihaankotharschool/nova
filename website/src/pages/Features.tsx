import { useState } from "react";
import type { Page } from "../components/Nav";
import type { Feature } from "../lib/data";
import { FEATURES } from "../lib/data";
import { Corners, Reveal, SectionHead } from "../components/Hud";
import TiltCard from "../components/TiltCard";
import Topology from "../components/Topology";
import FeatureModal from "../components/FeatureModal";
import {
  IconArrowR,
  IconWave,
  IconEye,
  IconControl,
  IconFlow,
  IconMemory,
  IconPlugin,
  IconRadar,
  IconSliders,
} from "../components/Icons";
import { sfx } from "../lib/audio";

const FEATURE_ICONS: Record<string, typeof IconWave> = {
  voice: IconWave,
  vision: IconEye,
  control: IconControl,
  automation: IconFlow,
  memory: IconMemory,
  plugins: IconPlugin,
  awareness: IconRadar,
  interface: IconSliders,
};

export default function Features({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [selected, setSelected] = useState<Feature | null>(null);

  return (
    <>
      {/* ============ REGISTRY HEADER ============ */}
      <section data-hue="225" className="relative mx-auto max-w-7xl px-6 pb-16 pt-36">
        <SectionHead
          kicker="MODULE REGISTRY // 08 UNITS"
          title="Capability Matrix"
          index="02"
          right={
            <span className="chip flex items-center gap-2">
              <span className="anim-pulse h-1 w-1 rounded-full bg-current" />
              ALL MODULES INTEGRATED
            </span>
          }
        />

        {/* topology diagram */}
        <Reveal>
          <div className="hud-panel relative overflow-hidden">
            <Corners className="text-[hsl(var(--hue)_90%_65%/0.7)]" size={14} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(var(--hue)_80%_60%/0.18)] px-5 py-3.5">
              <span className="font-hud c-hue text-[11px] tracking-[0.32em]">
                CORE TOPOLOGY // LIVE DATA ROUTES
              </span>
              <span className="font-hud c-hue-faint flex items-center gap-2 text-[10px] tracking-[0.24em]">
                <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-[hsl(var(--hue)_100%_75%)]" />
                DATA PACKET IN TRANSIT
              </span>
            </div>
            <div
              className="relative p-2 sm:p-4"
              style={{
                background:
                  "radial-gradient(circle at 50% 46%, hsl(var(--hue) 70% 15% / 0.32), transparent 62%)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--hue) 80% 60% / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--hue) 80% 60% / 0.04) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                  maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                }}
              />
              <Topology onOpen={setSelected} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ MODULE FILES ============ */}
      <section data-hue="258" className="relative mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          kicker="MODULE FILES // SELECT TO DECRYPT"
          title="Open a Module"
          index="Σ"
          right={
            <span className="font-hud c-hue-faint text-[10px] tracking-[0.3em]">
              CLICK ANY CARD FOR FULL FILE ▸
            </span>
          }
        />

        <div className="relative">
          {/* ambient glow the glass cards refract */}
          <div aria-hidden className="pointer-events-none absolute -inset-x-8 -top-20 bottom-0">
            <div className="absolute left-[18%] top-[16%] h-[440px] w-[440px] rounded-full bg-[hsl(var(--hue)_90%_55%/0.13)] blur-[130px]" />
            <div className="absolute bottom-[12%] right-[14%] h-[400px] w-[400px] rounded-full bg-[hsl(calc(var(--hue)+70)_90%_55%/0.1)] blur-[130px]" />
          </div>

          <div className="relative grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[f.id];
              return (
                <Reveal key={f.id} delay={(i % 2) * 110} className="h-full">
                  <TiltCard onClick={() => setSelected(f)} className="h-full" max={4}>
                    <div className="group/card relative flex h-full flex-col rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[hsl(var(--hue)_90%_62%/0.55)] hover:bg-white/[0.05] hover:shadow-[0_22px_60px_-18px_hsl(var(--hue)_90%_55%/0.35),0_0_0_1px_hsl(var(--hue)_90%_60%/0.18)] sm:p-8">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[hsl(var(--hue)_85%_60%/0.35)] bg-[hsl(var(--hue)_85%_60%/0.08)] text-[hsl(var(--hue)_92%_68%)] shadow-[inset_0_0_14px_hsl(var(--hue)_90%_60%/0.12)] transition-all duration-300 group-hover/card:border-[hsl(var(--hue)_90%_65%/0.7)] group-hover/card:shadow-[0_0_20px_hsl(var(--hue)_90%_60%/0.4),inset_0_0_14px_hsl(var(--hue)_90%_60%/0.2)]">
                        <Icon className="h-5 w-5" />
                      </span>

                      <h3 className="mt-6 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover/card:text-[hsl(var(--hue)_95%_70%)] sm:text-2xl">
                        {f.name}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.desc}</p>

                      <span className="font-hud mt-6 flex items-center gap-2 text-[10px] tracking-[0.3em] text-transparent transition-colors duration-300 group-hover/card:text-[hsl(var(--hue)_80%_72%/0.9)]">
                        OPEN MODULE FILE
                        <IconArrowR className="h-3 w-3 transition-transform duration-300 group-hover/card:translate-x-1" />
                      </span>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ FOOTER BAND ============ */}
      <section data-hue="288" className="relative mx-auto max-w-7xl px-6 pb-28">
        <Reveal>
          <div className="hud-panel relative flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <Corners className="text-[hsl(var(--hue)_90%_65%/0.6)]" size={12} />
            <div>
              <p className="font-hud c-hue text-[10px] tracking-[0.4em]">SINGLE ORGANISM //</p>
              <p className="font-display mt-2 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
                Every module feeds the core.
              </p>
              <p className="mt-2 max-w-lg text-sm text-slate-400">
                Voice tells it what you want. Vision shows it what you mean. Control, Automation
                and Memory make it so — without you lifting a finger.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-4">
              <button
                className="btn btn-primary"
                onMouseEnter={() => sfx.hover()}
                onClick={() => {
                  sfx.click();
                  onNavigate("download");
                }}
              >
                ENTER DOWNLOAD BAY
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

      {selected && <FeatureModal feature={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
