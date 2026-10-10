/**
 * N.O.V.A emblem — faithful reproduction of the reference mark:
 * brushed-steel segmented ring (with grain texture and machined grooves),
 * dark cell separators, electric-blue glow cells with per-cell hotspots,
 * and the metal downward-triangle frame around a white-hot blue core.
 * `NovaEmblem` renders raw 0..100 geometry for embedding; `LogoMark` wraps it.
 */
function tri(r: number) {
  return [90, 210, 330]
    .map((a) => {
      const t = (a * Math.PI) / 180;
      return `${(50 + r * Math.cos(t)).toFixed(2)},${(50 + r * Math.sin(t)).toFixed(2)}`;
    })
    .join(" ");
}

/* spoke pairs flanking each triangle vertex */
const SPOKES = [68, 112, 188, 232, 308, 352];

/* glow hotspot per blue cell: [x, y, radius, strength] */
const CELLS: [number, number, number, number][] = [
  [50, 17.5, 13, 0.5], // top trapezoid
  [24.5, 33, 7, 0.4], // top-left corner
  [75.5, 33, 7, 0.4], // top-right corner
  [21.5, 66, 10, 0.45], // left quad
  [78.5, 66, 10, 0.45], // right quad
  [37.5, 80.5, 6.5, 0.4], // bottom-left
  [62.5, 80.5, 6.5, 0.4], // bottom-right
];

export function NovaEmblem({ idp = "nv", glow = false }: { idp?: string; glow?: boolean }) {
  const blue = `${idp}-blue`;
  const bright = `${idp}-bright`;
  const cell = `${idp}-cell`;
  const metal = `${idp}-metal`;
  const metal2 = `${idp}-metal2`;
  const soft = `${idp}-soft`;
  const grain = `${idp}-grain`;
  return (
    <>
      <defs>
        <radialGradient id={blue} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#eafdff" />
          <stop offset="24%" stopColor="#6fe0ff" />
          <stop offset="56%" stopColor="#14a8ec" />
          <stop offset="100%" stopColor="#04618f" />
        </radialGradient>
        <radialGradient id={bright} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="42%" stopColor="#b8f2ff" />
          <stop offset="100%" stopColor="#37cdff" />
        </radialGradient>
        <radialGradient id={cell} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9f4ff" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#46c8ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#46c8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={metal} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b6bcc6" />
          <stop offset="34%" stopColor="#878e98" />
          <stop offset="58%" stopColor="#5a606a" />
          <stop offset="100%" stopColor="#31363d" />
        </linearGradient>
        <linearGradient id={metal2} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#aab1bb" />
          <stop offset="50%" stopColor="#6b727c" />
          <stop offset="100%" stopColor="#42474e" />
        </linearGradient>
        <filter id={soft} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* brushed steel grain — anisotropic noise clipped to the metal */}
        <filter id={grain} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08 0.85" numOctaves="3" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.52  0 0 0 0 0.55  0 0 0 0 0.6  0 0 0 0.4 0"
            result="tint"
          />
          <feComposite in="tint" in2="SourceGraphic" operator="in" result="clipped" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="clipped" />
          </feMerge>
        </filter>
      </defs>

      {glow && (
        <circle cx="50" cy="50" r="46" fill={`url(#${blue})`} opacity="0.55" filter={`url(#${soft})`} />
      )}

      {/* ---- metal ring ---- */}
      <g filter={`url(#${grain})`}>
        <circle cx="50" cy="50" r="49" fill={`url(#${metal})`} />
      </g>
      <circle cx="50" cy="50" r="49" fill="none" stroke="#1c2026" strokeWidth="1.8" />
      {/* machined grooves in the ring band */}
      <circle cx="50" cy="50" r="47.4" fill="none" stroke="#20242a" strokeWidth="0.5" opacity="0.85" />
      <circle cx="50" cy="50" r="46.4" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.4" />
      <circle cx="50" cy="50" r="38.6" fill="none" stroke="#20242a" strokeWidth="0.5" opacity="0.8" />

      {/* ---- energy cells ---- */}
      <circle cx="50" cy="50" r="37.6" fill={`url(#${blue})`} />
      {CELLS.map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`url(#${cell})`} opacity={o} />
      ))}

      {/* ---- spokes + triangle frame (textured metal) ---- */}
      <g filter={`url(#${grain})`}>
        {SPOKES.map((a) => (
          <g key={a} transform={`rotate(${a} 50 50)`}>
            <rect x="48.05" y="0.3" width="3.9" height="14.6" fill={`url(#${metal2})`} />
            <rect x="48.05" y="0.3" width="3.9" height="14.6" fill="none" stroke="#1d2126" strokeWidth="0.6" />
            <line x1="48.5" y1="0.8" x2="48.5" y2="14.4" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.4" />
          </g>
        ))}
        <path
          d={`M ${tri(37.6).replace(/ /g, " L ")} Z M ${tri(28.2).replace(/ /g, " L ")} Z`}
          fill={`url(#${metal2})`}
          fillRule="evenodd"
          stroke="#1d2126"
          strokeWidth="0.8"
        />
      </g>
      {/* frame grooves + bevels */}
      <path d={`M ${tri(36.4).replace(/ /g, " L ")} Z`} fill="none" stroke="#20242a" strokeWidth="0.5" opacity="0.85" />
      <path d={`M ${tri(35.6).replace(/ /g, " L ")} Z`} fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.4" />
      <path d={`M ${tri(29.2).replace(/ /g, " L ")} Z`} fill="none" stroke="#20242a" strokeWidth="0.5" opacity="0.8" />

      <circle cx="50" cy="50" r="37.6" fill="none" stroke="#1d2126" strokeWidth="1.2" />

      {/* ---- inner seam + core ---- */}
      <polygon points={tri(24)} fill="none" stroke="#171b20" strokeWidth="1.6" opacity="0.92" />
      <polygon points={tri(22)} fill={`url(#${blue})`} filter={`url(#${soft})`} />
      <polygon points={tri(12.5)} fill={`url(#${bright})`} opacity="0.95" />

      {/* ---- bevel highlights / shadows ---- */}
      <path d="M15.5 27 A41.5 41.5 0 0 1 45.5 9" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M84.5 73 A41.5 41.5 0 0 1 57.5 90.8" stroke="#000000" strokeOpacity="0.34" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M20 78 A41 41 0 0 0 33 88" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  );
}

export function LogoMark({
  size = 40,
  className = "",
  glow = false,
}: {
  size?: number;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="NOVA emblem"
    >
      <NovaEmblem idp={`nv${size}`} glow={glow} />
    </svg>
  );
}
