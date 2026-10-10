import { LogoMark } from "./Logo";
import { Corners } from "./Hud";
import { IconSound, IconMute } from "./Icons";
import { sfx } from "../lib/audio";

export type Page = "home" | "features" | "download";

const LINKS: { id: Page; label: string; num: string }[] = [
  { id: "home", label: "HOME", num: "01" },
  { id: "features", label: "FEATURES", num: "02" },
  { id: "download", label: "DOWNLOAD", num: "03" },
];

export default function Nav({
  page,
  onNavigate,
  soundOn,
  onToggleSound,
}: {
  page: Page;
  onNavigate: (p: Page) => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <div
        className="relative flex h-14 w-full max-w-5xl items-center justify-between border border-[hsl(var(--hue)_80%_60%/0.25)] bg-[hsl(var(--hue)_45%_7%/0.5)] px-4 backdrop-blur-md"
        style={{
          clipPath:
            "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
        }}
      >
        <Corners className="text-[hsl(var(--hue)_90%_65%/0.7)]" size={9} />
        <button
          onClick={() => {
            sfx.click();
            onNavigate("home");
          }}
          onMouseEnter={() => sfx.hover()}
          data-cursor="link"
          className="flex items-center gap-3"
        >
          <LogoMark size={34} />
          <span className="flex flex-col items-start leading-none">
            <span className="font-display text-[15px] font-extrabold tracking-[0.3em] text-white">
              N.O.V.A
            </span>
            <span className="font-hud c-hue-dim mt-1 text-[8px] tracking-[0.32em]">
              OMNIPRESENT GRID 0.9
            </span>
          </span>
        </button>

        <nav className="flex items-center">
          {LINKS.map((l) => {
            const active = page === l.id;
            return (
              <button
                key={l.id}
                onClick={() => {
                  sfx.click();
                  onNavigate(l.id);
                }}
                onMouseEnter={() => sfx.hover()}
                data-cursor="link"
                className={`group font-hud relative px-2.5 py-2 text-[11px] tracking-[0.24em] transition-colors sm:px-4 ${
                  active
                    ? "c-hue-bright text-glow-sm"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                <span className="c-hue-faint mr-1.5 hidden sm:inline">{l.num}</span>
                {l.label}
                <span
                  className={`absolute inset-x-2 bottom-0.5 h-px transition-all duration-300 ${
                    active
                      ? "bg-[hsl(var(--hue)_95%_65%)] shadow-[0_0_8px_hsl(var(--hue)_95%_60%)]"
                      : "bg-transparent group-hover:bg-[hsl(var(--hue)_80%_60%/0.4)]"
                  }`}
                />
              </button>
            );
          })}
          <span className="mx-2 hidden h-5 w-px bg-[hsl(var(--hue)_80%_60%/0.25)] md:block" />
          <button
            onClick={onToggleSound}
            onMouseEnter={() => sfx.hover()}
            data-cursor="link"
            title={soundOn ? "Mute UI sounds" : "Enable UI sounds"}
            className="c-hue-dim p-1.5 transition-colors hover:text-[hsl(var(--hue)_92%_68%)]"
          >
            {soundOn ? <IconSound className="h-4 w-4" /> : <IconMute className="h-4 w-4" />}
          </button>
          <span className="hidden items-center gap-1.5 pl-3 lg:flex">
            <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-[hsl(var(--hue)_95%_62%)] shadow-[0_0_8px_hsl(var(--hue)_95%_60%)]" />
            <span className="font-hud c-hue-dim text-[9px] tracking-[0.3em]">ONLINE</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
