import { useEffect, useState } from "react";
import { useReveal } from "../hooks";
import { Corners } from "./Hud";
import type { FeatureId } from "../lib/data";

/* Small animated HUD visuals — one per module. All procedural. */

function VisualWave({ className = "" }: { className?: string }) {
  const bars = [10, 18, 28, 22, 34, 44, 30, 52, 40, 60, 34, 48, 26, 38, 18, 28, 44, 32, 22, 14];
  return (
    <div className={`flex h-full w-full items-center justify-center gap-[3px] ${className}`}>
      {bars.map((h, i) => (
        <span
          key={i}
          className="eq-bar c-hue"
          style={{
            height: h,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.9 + (i % 5) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

function VisualScan({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div
        className="absolute inset-3 border border-[hsl(var(--hue)_80%_60%/0.2)]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--hue) 80% 60% / 0.07) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--hue) 80% 60% / 0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="scan-beam" />
      <Corners className="c-hue" size={10} />
      <div className="anim-pulse absolute left-[16%] top-[32%] h-8 w-16 border border-[hsl(calc(var(--hue)+62)_92%_68%/0.7)]" />
      <span className="font-hud c-shift absolute left-[16%] top-[23%] text-[8px] tracking-[0.2em]">
        OBJ.84 // 0.98
      </span>
      <div
        className="anim-pulse absolute bottom-[24%] right-[18%] h-6 w-12 border border-[hsl(calc(var(--hue)+62)_92%_68%/0.5)]"
        style={{ animationDelay: "0.7s" }}
      />
      <span className="font-hud c-shift absolute bottom-[16%] right-[18%] text-[8px] tracking-[0.2em] opacity-70">
        TXT // PARSED
      </span>
    </div>
  );
}

const TERM_LINES = [
  "> nova.open('browser')",
  "> nova.navigate('release-bay')",
  "> nova.form.fill('#notify', 'operator')",
  "> nova.verify() — action confirmed",
  "> task.complete",
];

function VisualTerminal({ className = "" }: { className?: string }) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    setN(0);
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= TERM_LINES.length) {
          window.clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 620);
    return () => window.clearInterval(id);
  }, [inView]);
  return (
    <div ref={ref} className={`flex h-full w-full flex-col justify-center gap-1.5 px-5 ${className}`}>
      {TERM_LINES.slice(0, n).map((l) => (
        <p key={l} className="kf-bootline font-hud c-hue-dim text-[10px] tracking-wide">
          {l}
        </p>
      ))}
      <span className="font-hud c-hue anim-blink text-[10px]">▌</span>
    </div>
  );
}

function VisualFlow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={`h-full w-full ${className}`} aria-hidden>
      <path
        d="M22 50 C 50 16, 78 16, 100 50"
        fill="none"
        stroke="hsl(var(--hue) 85% 60% / 0.45)"
        strokeWidth="1"
        className="flowline"
      />
      <path
        d="M100 50 C 122 84, 150 84, 178 50"
        fill="none"
        stroke="hsl(var(--hue) 85% 60% / 0.45)"
        strokeWidth="1"
        className="flowline"
        style={{ animationDelay: "-2s" }}
      />
      <circle r="2.6" style={{ fill: "hsl(var(--hue) 100% 75%)" }}>
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M22 50 C 50 16, 78 16, 100 50" />
      </circle>
      <circle r="2.6" style={{ fill: "hsl(calc(var(--hue) + 62) 100% 75%)" }}>
        <animateMotion dur="2.4s" begin="0.6s" repeatCount="indefinite" path="M100 50 C 122 84, 150 84, 178 50" />
      </circle>
      {[
        [22, 50, "TRIGGER"],
        [100, 50, "ENGINE"],
        [178, 50, "EXECUTE"],
      ].map(([x, y, label]) => (
        <g key={label as string}>
          <circle
            cx={x as number}
            cy={y as number}
            r="6"
            fill="#060a12"
            stroke="hsl(var(--hue) 90% 62% / 0.7)"
            strokeWidth="1"
          />
          <circle cx={x as number} cy={y as number} r="2" style={{ fill: "hsl(var(--hue) 95% 70%)" }} />
          <text
            x={x as number}
            y={(y as number) + 20}
            textAnchor="middle"
            fontFamily="'Share Tech Mono', monospace"
            fontSize="6"
            letterSpacing="1.5"
            style={{ fill: "hsl(var(--hue) 55% 72% / 0.75)" }}
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function VisualMemory({ className = "" }: { className?: string }) {
  const lit = new Set([2, 5, 9, 12, 17, 21, 26, 29]);
  return (
    <div className={`grid h-full w-full grid-cols-8 content-center gap-1 p-5 ${className}`}>
      {Array.from({ length: 32 }, (_, i) => (
        <span
          key={i}
          className={`aspect-square border ${
            lit.has(i)
              ? "anim-pulse border-[hsl(var(--hue)_90%_62%/0.6)] bg-[hsl(var(--hue)_90%_60%/0.22)]"
              : "border-[hsl(var(--hue)_70%_55%/0.15)]"
          }`}
          style={lit.has(i) ? { animationDelay: `${(i % 7) * 0.3}s` } : undefined}
        />
      ))}
    </div>
  );
}

function hexPoints(cx: number, cy: number, r: number) {
  let pts = "";
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return pts.trim();
}

function VisualPlugins({ className = "" }: { className?: string }) {
  const cells: [number, number][] = [
    [100, 30],
    [75, 55],
    [125, 55],
    [50, 80],
    [100, 80],
    [150, 80],
  ];
  return (
    <svg viewBox="0 0 200 110" className={`h-full w-full ${className}`} aria-hidden>
      {cells.map(([x, y], i) => (
        <polygon
          key={i}
          points={hexPoints(x, y, 14)}
          fill={i === 0 ? "hsl(var(--hue) 90% 60% / 0.16)" : "hsl(var(--hue) 90% 60% / 0.04)"}
          stroke="hsl(var(--hue) 90% 62% / 0.45)"
          strokeWidth="1"
          className="anim-pulse"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
      <circle cx="100" cy="30" r="2.5" style={{ fill: "hsl(var(--hue) 100% 78%)" }} />
    </svg>
  );
}

function VisualRadar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className="bd-hue relative aspect-square h-[78%] overflow-hidden rounded-full border">
        <div className="bd-hue absolute inset-[18%] rounded-full border opacity-60" />
        <div className="bd-hue absolute inset-[38%] rounded-full border opacity-40" />
        <div className="radar-sweep absolute inset-0 rounded-full" />
        <span className="anim-pulse absolute left-[30%] top-[36%] h-1 w-1 rounded-full bg-[hsl(calc(var(--hue)+62)_92%_70%)]" />
        <span
          className="anim-pulse absolute bottom-[28%] right-[26%] h-1 w-1 rounded-full bg-[hsl(var(--hue)_95%_70%)]"
          style={{ animationDelay: "1s" }}
        />
      </div>
    </div>
  );
}

function VisualSliders({ className = "" }: { className?: string }) {
  const labels = ["HUE DRIFT", "CORE GLOW", "PARTICLE DENSITY"];
  return (
    <div className={`flex h-full w-full flex-col justify-center gap-4 px-8 pt-3 ${className}`}>
      {labels.map((label, i) => (
        <div key={label} className="relative">
          <span className="font-hud c-hue-faint absolute -top-3.5 left-0 text-[8px] tracking-[0.28em]">
            {label}
          </span>
          <div className="relative h-[3px] bg-[hsl(var(--hue)_70%_55%/0.2)]">
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 bg-[hsl(var(--hue)_95%_68%)] shadow-[0_0_10px_hsl(var(--hue)_95%_60%)]"
              style={{ animation: `kf-knob ${3 + i * 0.9}s ease-in-out ${i * 0.5}s infinite` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function VisualAdapt({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center ${className}`}>
      <div className="relative aspect-square h-[72%]">
        <div className="bd-hue-strong anim-spin-slow absolute inset-0 rounded-full border border-dashed">
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[hsl(var(--hue)_95%_68%)] shadow-[0_0_8px_hsl(var(--hue)_95%_60%)]" />
        </div>
        <div className="bd-hue anim-spin-rev absolute inset-[20%] rounded-full border">
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[hsl(calc(var(--hue)+62)_92%_70%)]" />
        </div>
        <div className="anim-pulse absolute inset-[41%] rounded-full bg-[hsl(var(--hue)_95%_65%/0.3)]" />
      </div>
    </div>
  );
}

export default function FeatureVisual({
  id,
  className = "",
}: {
  id: FeatureId;
  className?: string;
}) {
  switch (id) {
    case "voice":
      return <VisualWave className={className} />;
    case "vision":
      return <VisualScan className={className} />;
    case "control":
      return <VisualTerminal className={className} />;
    case "automation":
      return <VisualFlow className={className} />;
    case "memory":
      return <VisualMemory className={className} />;
    case "plugins":
      return <VisualPlugins className={className} />;
    case "awareness":
      return <VisualRadar className={className} />;
    case "interface":
      return <VisualSliders className={className} />;
    default:
      return <VisualAdapt className={className} />;
  }
}
