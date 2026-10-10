import { useEffect, useRef, useState } from "react";
import { hueStore, pointerStore } from "../lib/store";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
}

/**
 * Replaces the native cursor: glowing dot + lagging energy ring,
 * light-trail particles, burst on click, HUD targeting reticle over the orb,
 * dashed ring over cards/links, amber lock over disabled controls.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const retRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );

  useEffect(() => {
    if (!supported) return;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const ret = retRef.current;
    const canvas = canvasRef.current;
    if (!root || !dot || !ring || !ret || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let tx = W / 2;
    let ty = H / 2;
    let dxp = tx, dyp = ty;
    let rxp = tx, ryp = ty;
    let exp = tx, eyp = ty;
    let pressScale = 1;
    let sparks: Spark[] = [];
    let lastSpawnX = -100;
    let lastSpawnY = -100;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      pointerStore.x = tx;
      pointerStore.y = ty;
      pointerStore.nx = tx / Math.max(1, W);
      pointerStore.ny = ty / Math.max(1, H);
      pointerStore.inside = true;
      if (root.dataset.hidden === "true") {
        root.dataset.hidden = "false";
        dxp = rxp = exp = tx;
        dyp = ryp = eyp = ty;
      }
      const dist = Math.hypot(tx - lastSpawnX, ty - lastSpawnY);
      if (dist > 6) {
        lastSpawnX = tx;
        lastSpawnY = ty;
        sparks.push({
          x: tx,
          y: ty,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1,
          hue: hueStore.v,
        });
        if (sparks.length > 80) sparks.shift();
      }
      const el = e.target as Element | null;
      const attr =
        el && el.closest ? el.closest("[data-cursor]")?.getAttribute("data-cursor") : null;
      const fallback =
        el && el.closest
          ? el.closest("a,button,[role=button],input,select,textarea,label")
          : null;
      root.dataset.mode = attr || (fallback ? "link" : "default");
    };

    const onDown = (e: PointerEvent) => {
      root.dataset.press = "true";
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * 1.7,
          vy: Math.sin(a) * 1.7,
          life: 1,
          hue: hueStore.v + 40,
        });
      }
    };
    const onUp = () => {
      root.dataset.press = "false";
    };
    const onLeave = () => {
      root.dataset.hidden = "true";
      pointerStore.inside = false;
    };
    const onEnter = () => {
      if (tx > 0) root.dataset.hidden = "false";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const loop = () => {
      dxp += (tx - dxp) * 0.55;
      dyp += (ty - dyp) * 0.55;
      rxp += (tx - rxp) * 0.2;
      ryp += (ty - ryp) * 0.2;
      exp += (tx - exp) * 0.28;
      eyp += (ty - eyp) * 0.28;
      const targetScale = root.dataset.press === "true" ? 0.72 : 1;
      pressScale += (targetScale - pressScale) * 0.3;

      dot.style.transform = `translate3d(${dxp}px, ${dyp}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rxp}px, ${ryp}px, 0) translate(-50%, -50%) scale(${pressScale})`;
      ret.style.transform = `translate3d(${exp}px, ${eyp}px, 0) translate(-50%, -50%) rotate(${
        (performance.now() / 40) % 360
      }deg)`;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      sparks = sparks.filter((s) => (s.life -= 0.045) > 0);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        ctx.fillStyle = `hsla(${s.hue + 30}, 100%, 70%, ${s.life * 0.38})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.life * 2.6, 0, 6.2832);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <div
      ref={rootRef}
      className="cursor-root"
      data-mode="default"
      data-press="false"
      data-hidden="true"
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div ref={ringRef} className="cursor-ring" style={{ left: 0, top: 0 }} />
      <div ref={dotRef} className="cursor-dot" style={{ left: 0, top: 0 }} />
      <div ref={retRef} className="cursor-reticle" style={{ left: 0, top: 0 }}>
        <svg
          viewBox="0 0 74 74"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="h-full w-full"
        >
          <path d="M4 18V8a4 4 0 0 1 4-4h10M56 4h10a4 4 0 0 1 4 4v10M70 56v10a4 4 0 0 1-4 4H56M18 70H8a4 4 0 0 1-4-4V56" />
          <circle cx="37" cy="37" r="11" strokeDasharray="3 5" opacity="0.8" />
          <path d="M37 30v-5M37 49v-5M30 37h-5M49 37h-5" opacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
