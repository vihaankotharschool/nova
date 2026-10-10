import { useEffect, useMemo, useRef, useState } from "react";
import type { Page } from "./Nav";
import { pointerStore } from "../lib/store";
import { IconArrowR, IconChevronD } from "./Icons";
import { sfx } from "../lib/audio";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => t * t * (3 - 2 * t);

const VIEWS = [
  { src: "/images/nova-armor.jpg", alt: "NOVA armor, front view" },
  { src: "/images/nova-three.jpg", alt: "NOVA armor, three-quarter view" },
  { src: "/images/nova-side.jpg", alt: "NOVA armor, side view" },
];

/**
 * Cinematic scroll stage. The hero copy is present from the first frame and
 * exits as you scroll; the Mark-85-class armor (three crossfading renders:
 * front / three-quarter / side) faces you with its head fully in frame, then
 * sweeps right, turns, recedes, blurs and fades out. Reversible on scroll-up.
 */
export default function ArmorStage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const secRef = useRef<HTMLElement>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const viewRefs = useRef<(HTMLImageElement | null)[]>([]);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const ready = loaded >= VIEWS.length;

  const sparks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: 40 + Math.random() * 44,
        top: 22 + Math.random() * 62,
        delay: (i * 0.47) % 5,
        dur: 3.2 + Math.random() * 2.8,
        size: 1 + Math.random() * 2.2,
      })),
    []
  );

  useEffect(() => {
    const mount = performance.now();
    let raf = 0;

    /* copy exits upward as scroll begins */
    const exit = (el: HTMLElement | null, o: number, allowPointer = false) => {
      if (!el) return;
      el.style.opacity = o.toFixed(2);
      el.style.transform = `translateY(${((1 - o) * -42).toFixed(1)}px)`;
      if (allowPointer) el.style.pointerEvents = o > 0.5 ? "auto" : "none";
    };
    /* copy rises in as the armor fades */
    const enter = (el: HTMLElement | null, o: number, allowPointer = false) => {
      if (!el) return;
      el.style.opacity = o.toFixed(2);
      el.style.transform = `translateY(${((1 - o) * 42).toFixed(1)}px)`;
      if (allowPointer) el.style.pointerEvents = o > 0.5 ? "auto" : "none";
    };

    const loop = (now: number) => {
      const sec = secRef.current;
      let p = 0;
      if (sec) {
        const rect = sec.getBoundingClientRect();
        p = clamp01(-rect.top / Math.max(1, rect.height - window.innerHeight));
      }
      const intro = ease(clamp01((now - mount) / 1400));
      const mx = reduced ? 0 : (pointerStore.nx - 0.5) * 2;

      /* crossfade the three poses: front -> three-quarter -> side */
      const views = viewRefs.current;
      if (views[0]) views[0].style.opacity = (1 - ease(seg(p, 0.2, 0.38))).toFixed(2);
      if (views[1])
        views[1].style.opacity = (ease(seg(p, 0.2, 0.38)) * (1 - ease(seg(p, 0.52, 0.7)))).toFixed(2);
      if (views[2]) views[2].style.opacity = ease(seg(p, 0.52, 0.7)).toFixed(2);

      /* sweep right, push in then settle, blur into the background */
      const x = p < 0.28 ? 0 : p < 0.72 ? ease((p - 0.28) / 0.44) * 22 : 22 + ease((p - 0.72) / 0.28) * 8;
      const scale = p < 0.3 ? lerp(1.0, 1.14, ease(p / 0.3)) : lerp(1.14, 1.02, ease((p - 0.3) / 0.7));
      const fade = ease(seg(p, 0.5, 1));
      const turn = ease(seg(p, 0.3, 1));

      const fig = figRef.current;
      if (fig) {
        fig.style.transform = `translate3d(${(x + mx * 1.3).toFixed(2)}%, 0, 0) scale(${(scale * lerp(1.06, 1, intro)).toFixed(3)}) perspective(1400px) rotateY(${(-turn * 6 + mx * 4).toFixed(2)}deg)`;
        fig.style.filter = `blur(${(fade * 18 + (1 - intro) * 12).toFixed(1)}px) brightness(${(1 - fade * 0.5).toFixed(2)})`;
        fig.style.opacity = (intro * (1 - seg(p, 0.82, 1) * 0.3)).toFixed(2);
      }

      /* headline leads at the start, then exits upward */
      const oExit = (1 - ease(seg(p, 0.14, 0.42))) * intro;
      exit(kickerRef.current, oExit);
      exit(titleRef.current, oExit);
      /* supporting copy lands as the armor fades out */
      const oIn = ease(seg(p, 0.58, 0.85)) * intro;
      enter(paraRef.current, oIn);
      enter(ctaRef.current, oIn, true);
      enter(chipsRef.current, oIn);

      /* HUD */
      const stat = statRef.current;
      if (stat) stat.style.opacity = ((1 - seg(p, 0.05, 0.22)) * intro).toFixed(2);
      const hint = hintRef.current;
      if (hint) hint.style.opacity = ((1 - seg(p, 0, 0.08)) * intro).toFixed(2);

      const sweep = sweepRef.current;
      if (sweep) {
        const sp = ease(seg(p, 0.24, 0.78));
        sweep.style.transform = `translateX(${lerp(-70, 190, sp).toFixed(1)}%) skewX(-18deg)`;
        sweep.style.opacity = (Math.sin(sp * Math.PI) * 0.5).toFixed(2);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <section ref={secRef} data-hue="198" className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the armor — three crossfading poses, head fully in frame */}
        <div data-cursor="orb" className="absolute inset-0 z-10">
          <div
            ref={figRef}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: 0, transformOrigin: "50% 22%" }}
          >
            {/* chest glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-[39%] h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, hsl(192 100% 64% / 0.3), hsl(192 100% 55% / 0.09) 45%, transparent 70%)",
                filter: "blur(6px)",
              }}
              aria-hidden
            />
            {VIEWS.map((v, i) => (
              <img
                key={v.src}
                ref={(el) => {
                  viewRefs.current[i] = el;
                }}
                src={v.src}
                alt={v.alt}
                draggable={false}
                onLoad={() => setLoaded((n) => Math.min(VIEWS.length, n + 1))}
                onError={() => setLoaded((n) => Math.min(VIEWS.length, n + 1))}
                className="absolute left-1/2 top-[1%] h-[126%] w-auto -translate-x-1/2 select-none object-contain"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  maskImage: "radial-gradient(ellipse 62% 56% at 50% 38%, black 64%, transparent 92%)",
                  WebkitMaskImage: "radial-gradient(ellipse 62% 56% at 50% 38%, black 64%, transparent 92%)",
                }}
              />
            ))}

          </div>

          {/* rising nano sparks */}
          {!reduced && (
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {sparks.map((s, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-[hsl(192_100%_72%)]"
                  style={{
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    width: s.size,
                    height: s.size,
                    boxShadow: "0 0 8px hsl(192 100% 60% / 0.9)",
                    animation: `kf-spark ${s.dur}s linear ${s.delay}s infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* light sweep */}
          <div
            ref={sweepRef}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent, hsl(198 100% 75% / 0.14), hsl(198 100% 85% / 0.22), transparent)",
              opacity: 0,
            }}
            aria-hidden
          />
        </div>

        {/* loading state */}
        <div
          className={`pointer-events-none absolute bottom-10 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        >
          <span className="font-hud flex items-center gap-2.5 text-[9px] tracking-[0.4em] text-[hsl(198_70%_70%/0.8)]">
            <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-[hsl(198_100%_68%)]" />
            INITIALIZING CORE // LATTICE ASSEMBLY {loaded}/{VIEWS.length}
          </span>
        </div>

        {/* opening status — top right now that copy sits left */}
        <div ref={statRef} className="absolute right-8 top-28 z-20 hidden lg:block" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3">
            <span className="font-hud text-[10px] tracking-[0.3em] text-slate-500">
              ARMOR LINK ESTABLISHED //
            </span>
            <span className="font-hud text-[11px] tracking-[0.42em] text-[hsl(198_80%_72%)]">
              SYSTEM ONLINE
            </span>
            <span className="anim-pulse h-2 w-2 rounded-full bg-[hsl(198_95%_62%)] shadow-[0_0_10px_hsl(198_95%_60%)]" />
          </div>
        </div>

        {/* hero copy — present at start, exits on scroll */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 lg:justify-start lg:pl-[7%]">
          <div className="max-w-2xl text-center lg:text-left">
            <p ref={kickerRef} className="font-hud text-[11px] tracking-[0.5em] text-[hsl(198_95%_66%)] sm:text-xs" style={{ opacity: 0 }}>
              NEXT-GEN OMNIPRESENT VIRTUAL ASSISTANT
            </p>
            <h1 ref={titleRef} className="font-display mt-5 text-[clamp(2.5rem,5.6vw,5rem)] font-black leading-[1.04] text-white" style={{ opacity: 0 }}>
              N.O.V.A —{" "}
              <span className="text-[hsl(198_100%_62%)]" style={{ textShadow: "0 0 44px hsl(198 100% 55% / 0.65)" }}>
                Next-Gen
              </span>
              <br />
              Omnipresent Virtual Assistant
            </h1>
            <p ref={paraRef} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 lg:mx-0" style={{ opacity: 0 }}>
              An intelligence that lives inside your machine — hearing, seeing, operating,
              remembering. You speak. <span className="text-slate-200">It acts.</span>
            </p>
            <div ref={ctaRef} className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start" style={{ opacity: 0 }}>
              <button className="btn btn-primary" onMouseEnter={() => sfx.hover()} onClick={() => { sfx.click(); onNavigate("features"); }}>
                ENTER CAPABILITY MATRIX
                <IconArrowR className="h-3.5 w-3.5" />
              </button>
              <button className="btn" onMouseEnter={() => sfx.hover()} onClick={() => { sfx.click(); onNavigate("download"); }}>
                DOWNLOAD BAY
                <IconChevronD className="h-3.5 w-3.5" />
              </button>
            </div>
            <div ref={chipsRef} className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start" style={{ opacity: 0 }}>
              <span className="chip flex items-center gap-2">
                <span className="anim-pulse h-1 w-1 rounded-full bg-current" /> CORE: ONLINE
              </span>
              <span className="chip">LATTICE: SYNCED</span>
              <span className="chip">VAULT: SEALED</span>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div ref={hintRef} className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2.5" style={{ opacity: 0 }}>
          <span className="font-hud text-[9px] tracking-[0.45em] text-[hsl(198_60%_70%/0.7)]">
            SCROLL TO ENGAGE
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-[hsl(198_70%_55%/0.25)]">
            <span
              className="absolute left-0 h-3 w-px bg-[hsl(198_95%_68%)] shadow-[0_0_8px_hsl(198_95%_60%)]"
              style={{ animation: "kf-scan-y 1.6s cubic-bezier(0.4,0,0.6,1) infinite" }}
            />
          </span>
        </div>

        {/* blends */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-[#04060c] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-28 bg-gradient-to-t from-[#04060c] to-transparent" />
      </div>
    </section>
  );
}
