import { useRef } from "react";
import type { CSSProperties, PointerEvent as RPointerEvent, ReactNode } from "react";
import { sfx } from "../lib/audio";

/** Cursor-tracking 3D tilt wrapper with an energy glare that follows the pointer. */
export default function TiltCard({
  children,
  className = "",
  onClick,
  max = 7,
  cursor = "card",
  style,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  max?: number;
  cursor?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / Math.max(1, r.width);
    const ny = (e.clientY - r.top) / Math.max(1, r.height);
    el.style.transition = "transform 0.08s ease-out";
    el.style.transform = `perspective(950px) rotateX(${((0.5 - ny) * max).toFixed(2)}deg) rotateY(${(
      (nx - 0.5) * max
    ).toFixed(2)}deg) translateZ(6px)`;
    const glare = glareRef.current;
    if (glare) {
      glare.style.opacity = "1";
      glare.style.background = `radial-gradient(420px circle at ${(nx * 100).toFixed(1)}% ${(
        ny * 100
      ).toFixed(1)}%, hsl(var(--hue) 95% 65% / 0.13), transparent 55%)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)";
    el.style.transform = "perspective(950px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    const glare = glareRef.current;
    if (glare) glare.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      data-cursor={cursor}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => {
        sfx.click();
        onClick?.();
      }}
      style={style}
      className={`group relative will-change-transform ${className}`}
    >
      <div
        ref={glareRef}
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300"
        aria-hidden
      />
      {children}
    </div>
  );
}
