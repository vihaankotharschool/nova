import { useEffect, useRef } from "react";
import { hueStore } from "../lib/store";

/** Ambient layer: rising dust motes + falling data streams, hue-tinted. */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
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

    const dust = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: 0.25 + Math.random() * 0.75,
      v: 6 + Math.random() * 16,
    }));
    const streams = Array.from({ length: 12 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 90 + Math.random() * 170,
      len: 60 + Math.random() * 150,
      a: 0.04 + Math.random() * 0.08,
    }));

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const hue = hueStore.v;
      ctx.clearRect(0, 0, W, H);

      for (const d of dust) {
        d.y -= d.v * d.z * dt;
        if (d.y < -4) {
          d.y = H + 4;
          d.x = Math.random() * W;
        }
        ctx.fillStyle = `hsla(${hue}, 85%, 72%, ${0.035 + d.z * 0.09})`;
        ctx.fillRect(d.x, d.y, d.z * 1.6, d.z * 1.6);
      }

      for (const s of streams) {
        s.y += s.speed * dt;
        if (s.y - s.len > H) {
          s.y = -s.len - Math.random() * 300;
          s.x = Math.random() * W;
        }
        const g = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
        g.addColorStop(0, "hsla(0, 0%, 0%, 0)");
        g.addColorStop(1, `hsla(${hue + 40}, 95%, 65%, ${s.a})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.len);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.fillStyle = `hsla(${hue + 40}, 100%, 78%, ${s.a * 2.2})`;
        ctx.fillRect(s.x - 1, s.y - 2, 2, 2);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}
