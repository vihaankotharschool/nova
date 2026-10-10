import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import type { Page } from "./components/Nav";
import Cursor from "./components/Cursor";
import Background from "./components/Background";
import Boot from "./components/Boot";
import { TelemetryBar, FrameRails } from "./components/Hud";
import { LogoMark } from "./components/Logo";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Download from "./pages/Download";
import { hueStore, scrollStore } from "./lib/store";
import { setSoundEnabled, sfx } from "./lib/audio";

export default function App() {
  const [booted, setBooted] = useState(false);
  const [page, setPage] = useState<Page>("home");
  const [wipe, setWipe] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const wipeTimer = useRef<number | null>(null);

  /* ---- scroll-driven hue engine: colors morph between sections ---- */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-hue]"));
      const mid = window.innerHeight * 0.45;
      let target = 192;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          target = parseFloat(el.dataset.hue || "192");
          break;
        }
      }
      hueStore.target = target;
      const d = ((target - hueStore.v + 540) % 360) - 180;
      hueStore.v += d * 0.055;
      document.documentElement.style.setProperty("--hue", hueStore.v.toFixed(2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onScroll = () => {
      const el = document.documentElement;
      scrollStore.p = Math.min(1, window.scrollY / Math.max(1, el.scrollHeight - window.innerHeight));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ---- navigation with cinematic shutter wipe ---- */
  const navigate = useCallback(
    (p: Page) => {
      if (p === page) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      sfx.nav();
      setWipe(true);
      if (wipeTimer.current) window.clearTimeout(wipeTimer.current);
      wipeTimer.current = window.setTimeout(() => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 270);
    },
    [page]
  );

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) sfx.click();
  };

  const pageLinks: { id: Page; label: string }[] = [
    { id: "home", label: "HOME" },
    { id: "features", label: "FEATURES" },
    { id: "download", label: "DOWNLOAD" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* ambient layers */}
      <Background />
      <div className="grid-overlay pointer-events-none fixed inset-0 z-[1]" aria-hidden />

      {/* system chrome */}
      <FrameRails />
      <TelemetryBar />
      <Nav page={page} onNavigate={navigate} soundOn={soundOn} onToggleSound={toggleSound} />

      {/* pages */}
      {booted && (
        <main key={page} className="page-enter relative z-10">
          {page === "home" && <Home onNavigate={navigate} />}
          {page === "features" && <Features onNavigate={navigate} />}
          {page === "download" && <Download onNavigate={navigate} />}

          <footer className="relative border-t border-[hsl(var(--hue)_80%_60%/0.14)] px-6 pb-12 pt-10">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <LogoMark size={30} />
                <div>
                  <p className="font-display text-sm font-extrabold tracking-[0.3em] text-white">
                    N.O.V.A
                  </p>
                  <p className="font-hud c-hue-faint mt-0.5 text-[8px] tracking-[0.3em]">
                    NEXT-GEN OMNIPRESENT VIRTUAL ASSISTANT
                  </p>
                </div>
              </div>
              <nav className="flex gap-5">
                {pageLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      sfx.click();
                      navigate(l.id);
                    }}
                    onMouseEnter={() => sfx.hover()}
                    data-cursor="link"
                    className={`font-hud text-[10px] tracking-[0.3em] transition-colors ${
                      page === l.id ? "c-hue" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </nav>
              <p className="font-hud c-hue-faint text-[9px] tracking-[0.26em]">
                © 2026 NOVA SYSTEMS // BUILD 0.9.1
              </p>
            </div>
          </footer>
        </main>
      )}

      {/* cinematic overlays (above content, below nav/modal) */}
      <div className="vignette pointer-events-none fixed inset-0 z-[44]" aria-hidden />
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-[45] h-28"
        style={{
          animation: "kf-scanbar 9s linear infinite",
          background:
            "linear-gradient(180deg, transparent, hsl(var(--hue) 90% 60% / 0.05), transparent)",
        }}
        aria-hidden
      />
      <div className="scanlines pointer-events-none fixed inset-0 z-[46]" aria-hidden />
      <div className="noise pointer-events-none fixed inset-0 z-[47]" aria-hidden />

      {/* boot sequence */}
      {!booted && <Boot onDone={() => setBooted(true)} />}

      {/* page shutter */}
      {wipe && (
        <div
          className="pointer-events-none fixed inset-0 z-[65]"
          onAnimationEnd={() => setWipe(false)}
          aria-hidden
        >
          <div className="shutter-top" />
          <div className="shutter-bot" />
          <div className="shutter-line" />
        </div>
      )}

      <Cursor />
    </div>
  );
}
