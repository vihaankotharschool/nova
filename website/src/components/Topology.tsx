import { useState } from "react";
import { FEATURES } from "../lib/data";
import type { Feature } from "../lib/data";
import { NovaEmblem } from "./Logo";
import {
  IconWave,
  IconEye,
  IconControl,
  IconFlow,
  IconMemory,
  IconPlugin,
  IconRadar,
  IconSliders,
} from "./Icons";
import { sfx } from "../lib/audio";

const NODE_ICONS: Record<string, typeof IconWave> = {
  voice: IconWave,
  vision: IconEye,
  control: IconControl,
  automation: IconFlow,
  memory: IconMemory,
  plugins: IconPlugin,
  awareness: IconRadar,
  interface: IconSliders,
};

const CX = 460;
const CY = 288;
const RX = 345;
const RY = 205;

/** Live core-topology diagram: data pulses travel between NOVA core and modules. */
export default function Topology({ onOpen }: { onOpen: (f: Feature) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const nodes = FEATURES.map((f, i) => {
    const a = (-90 + i * 45) * (Math.PI / 180);
    return { f, x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
  });

  const edgePath = (nx: number, ny: number) => {
    const mx = (CX + nx) / 2;
    const my = (CY + ny) / 2;
    const dx = nx - CX;
    const dy = ny - CY;
    const l = Math.hypot(dx, dy) || 1;
    const px = (-dy / l) * 30;
    const py = (dx / l) * 30;
    return `M ${CX} ${CY} Q ${mx + px} ${my + py} ${nx} ${ny}`;
  };

  const hot = hovered !== null;

  return (
    <div>
      <svg viewBox="0 0 920 580" className="h-auto w-full" role="img" aria-label="NOVA core topology diagram">
        <defs>
          <radialGradient id="topoCoreGlow">
            <stop offset="0%" style={{ stopColor: "hsl(var(--hue) 95% 62% / 0.24)" }} />
            <stop offset="55%" style={{ stopColor: "hsl(var(--hue) 95% 60% / 0.07)" }} />
            <stop offset="100%" style={{ stopColor: "hsl(0 0% 0% / 0)" }} />
          </radialGradient>
        </defs>

        {/* concentric guides */}
        <circle cx={CX} cy={CY} r="118" fill="none" stroke="hsl(var(--hue) 80% 60% / 0.07)" strokeDasharray="1 7" />
        <circle cx={CX} cy={CY} r="160" fill="none" stroke="hsl(var(--hue) 80% 60% / 0.05)" strokeDasharray="1 9" />

        {/* orbit guide */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={RX}
          ry={RY}
          fill="none"
          stroke="hsl(var(--hue) 80% 60% / 0.14)"
          strokeDasharray="2 9"
          className="topo-ring"
        />

        {/* edges */}
        {nodes.map(({ f, x, y }, i) => {
          const d = edgePath(x, y);
          const isHot = hovered === i;
          const dim = hot && !isHot;
          return (
            <g key={f.id}>
              <path
                d={d}
                fill="none"
                className="flowline"
                stroke={
                  isHot ? "hsl(var(--hue) 95% 68% / 0.95)" : "hsl(var(--hue) 85% 60% / 0.4)"
                }
                strokeWidth={isHot ? 1.6 : 1}
                opacity={dim ? 0.18 : 1}
                style={{ animationDelay: `${-i * 0.8}s` }}
              />
              <circle r={isHot ? 3.4 : 2.4} opacity={dim ? 0.15 : 1} style={{ fill: "hsl(var(--hue) 100% 76%)" }}>
                <animateMotion dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}

        {/* core — the NOVA emblem */}
        <g>
          <circle cx={CX} cy={CY} r="92" fill="url(#topoCoreGlow)" />
          <circle cx={CX} cy={CY} r="72" fill="none" stroke="hsl(var(--hue) 80% 60% / 0.14)" strokeDasharray="1 6" />
          <circle cx={CX} cy={CY} r="61" fill="none" stroke="hsl(var(--hue) 90% 62% / 0.42)" strokeDasharray="6 9" className="topo-ring" />
          <circle
            cx={CX}
            cy={CY}
            r="67"
            fill="none"
            stroke="hsl(var(--hue) 90% 62% / 0.2)"
            strokeDasharray="2 11"
            className="anim-spin-rev"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
          {/* tick marks */}
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={CX + 53 * Math.cos(a)}
                y1={CY + 53 * Math.sin(a)}
                x2={CX + 57 * Math.cos(a)}
                y2={CY + 57 * Math.sin(a)}
                stroke="hsl(var(--hue) 85% 65% / 0.35)"
                strokeWidth="1"
              />
            );
          })}
          {/* expanding ping */}
          <circle
            cx={CX}
            cy={CY}
            r="50"
            fill="none"
            stroke="hsl(var(--hue) 95% 70% / 0.45)"
            style={{ transformBox: "fill-box", transformOrigin: "center", animation: "kf-ping-ring 3s ease-out infinite" }}
          />
          <g transform={`translate(${CX - 45}, ${CY - 45}) scale(0.9)`}>
            <NovaEmblem idp="tp" glow />
          </g>
          <text x={CX} y={CY - 80} textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="700" fontSize="14" letterSpacing="5" style={{ fill: "hsl(var(--hue) 95% 80%)", filter: "drop-shadow(0 0 6px hsl(var(--hue) 95% 60% / 0.7))" }}>
            NOVA
          </text>
          <text x={CX} y={CY + 90} textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="8" letterSpacing="3" style={{ fill: "hsl(var(--hue) 60% 72% / 0.8)" }}>
            CORE // ROUTING
          </text>
        </g>

        {/* module nodes */}
        {nodes.map(({ f, x, y }, i) => {
          const Icon = NODE_ICONS[f.id];
          const isHot = hovered === i;
          const dim = hot && !isHot;
          return (
            <g
              key={f.id}
              transform={`translate(${x}, ${y})`}
              className="topo-node"
              opacity={dim ? 0.35 : 1}
              data-cursor="card"
              onMouseEnter={() => {
                sfx.hover();
                setHovered(i);
              }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                sfx.click();
                onOpen(f);
              }}
            >
              <circle r="27" fill="#060a12" stroke="hsl(var(--hue) 90% 62% / 0.5)" strokeWidth={isHot ? 1.6 : 1} />
              <circle r="23.5" style={{ fill: "hsl(var(--hue) 90% 60% / 0.07)" }} />
              <circle r="33" fill="none" stroke="hsl(var(--hue) 90% 62% / 0.3)" strokeDasharray="3 7" className="topo-ring" />
              <g style={{ color: isHot ? "hsl(var(--hue) 100% 80%)" : "hsl(var(--hue) 85% 68%)" }}>
                <Icon x={-11} y={-11} width={22} height={22} />
              </g>
              <text y="-42" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="8" letterSpacing="2" style={{ fill: "hsl(var(--hue) 55% 72% / 0.6)" }}>
                {f.code.split(" ")[0]}
              </text>
              <text y="50" textAnchor="middle" fontFamily="'Orbitron', sans-serif" fontWeight="600" fontSize="10.5" letterSpacing="2" style={{ fill: isHot ? "hsl(var(--hue) 100% 82%)" : "hsl(var(--hue) 70% 78% / 0.9)" }}>
                {f.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* readout strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[hsl(var(--hue)_80%_60%/0.18)] px-5 py-3">
        <p className="font-hud text-[11px] tracking-[0.2em]">
          {hovered !== null ? (
            <>
              <span className="c-hue">DATA ROUTE //</span>{" "}
              <span className="text-slate-300">{FEATURES[hovered].code}</span>{" "}
              <span className="c-hue-dim">— {FEATURES[hovered].tag}</span>
            </>
          ) : (
            <span className="c-hue-dim">HOVER A NODE // TRACE DATA ROUTE</span>
          )}
        </p>
        <p className="font-hud c-hue-faint text-[10px] tracking-[0.24em]">
          CLICK NODE TO OPEN MODULE FILE ▸
        </p>
      </div>
    </div>
  );
}
