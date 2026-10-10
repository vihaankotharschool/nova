import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { scrollStore } from "../lib/store";

/**
 * The NOVA energy core — real-time WebGL orb built from randomized
 * icosahedron wireframes and orbiting torus rings, rendered through an
 * UnrealBloom pass for the molten glow. Tilts and follows the cursor,
 * surges on hover, spins with drag inertia and reacts to scroll.
 */
interface Props {
  className?: string;
  interactive?: boolean;
  palette?: "hue" | "ember";
}

export default function NovaOrb({ className = "", interactive = true }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mount = mountRef.current;
    if (!wrap || !mount) return;

    let W = Math.max(10, wrap.clientWidth);
    let H = Math.max(10, wrap.clientHeight);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      if (fallbackRef.current) fallbackRef.current.style.display = "block";
      return;
    }

    const dpr = Math.min(1.75, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    /* the bloom pass outputs an opaque black field — screen-blend it away
       so only the glow remains and the orb melts into the page */
    renderer.domElement.style.mixBlendMode = "screen";

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 7.4;

    /* ---- materials: transparent glowing orange wireframe ---- */
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff7a1a,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
    });
    const coreMat = wireMat.clone();
    coreMat.opacity = 0.3;
    const hotMat = new THREE.MeshBasicMaterial({
      color: 0xffa244,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
    });

    /* ---- randomize vertices for the chaotic energy look ---- */
    const randomizeGeometry = (geometry: THREE.BufferGeometry, factor: number) => {
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const noise = 1 + (Math.random() - 0.5) * factor;
        pos.setXYZ(i, pos.getX(i) * noise, pos.getY(i) * noise, pos.getZ(i) * noise);
      }
      pos.needsUpdate = true;
    };

    const orbGroup = new THREE.Group(); // tilt + drag + follow
    const spinGroup = new THREE.Group(); // idle spin
    scene.add(orbGroup);
    orbGroup.add(spinGroup);

    const coreGeo = new THREE.IcosahedronGeometry(1.5, 6);
    randomizeGeometry(coreGeo, 0.1);
    const core = new THREE.Mesh(coreGeo, coreMat);
    spinGroup.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(2.2, 5);
    randomizeGeometry(shellGeo, 0.15);
    const shell = new THREE.Mesh(shellGeo, wireMat);
    spinGroup.add(shell);

    const hotGeo = new THREE.IcosahedronGeometry(0.6, 2);
    randomizeGeometry(hotGeo, 0.2);
    const hotCore = new THREE.Mesh(hotGeo, hotMat);
    spinGroup.add(hotCore);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3, 0.1, 8, 100), wireMat);
    ring1.rotation.x = Math.PI / 3;
    orbGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.1, 8, 100), wireMat);
    ring2.rotation.y = Math.PI / 4;
    orbGroup.add(ring2);

    /* ---- bloom ---- */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 1.5, 0.45, 0.12);
    composer.addPass(bloom);

    /* ---- interaction state ---- */
    let tRotX = -0.2;
    let tRotYTarget = 0;
    let vY = 0;
    let vX = 0;
    let hover = 0;
    let tHover = 0;
    let dragging = false;
    let px = 0;
    let py = 0;
    let ox = 0;
    let oy = 0;
    let tOx = 0;
    let tOy = 0;
    let lastScrollP = scrollStore.p;
    let raf = 0;
    const clock = new THREE.Clock();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left) / Math.max(1, r.width) - 0.5;
      const ny = (e.clientY - r.top) / Math.max(1, r.height) - 0.5;
      if (!dragging) {
        tRotX = -0.2 + ny * 0.6;
        tRotYTarget = nx * 1.0;
      }
      tOx = nx * 0.5;
      tOy = -ny * 0.35;
      if (dragging && interactive) {
        vY = (e.clientX - px) * 0.005;
        vX = (e.clientY - py) * 0.004;
        orbGroup.rotation.y += vY;
        orbGroup.rotation.x += vX;
        px = e.clientX;
        py = e.clientY;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!interactive) return;
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* ok */
      }
    };
    const onUp = () => {
      dragging = false;
    };
    const onEnter = () => {
      tHover = 1;
    };
    const onLeave = () => {
      tHover = 0;
      dragging = false;
      tOx = 0;
      tOy = 0;
      tRotX = -0.2;
      tRotYTarget = 0;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      W = Math.max(10, wrap.clientWidth);
      H = Math.max(10, wrap.clientHeight);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer.setSize(W, H);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    /* ---- animation ---- */
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(0.05, clock.getDelta());
      const drive = reduced ? 0.25 : 1;

      hover += (tHover - hover) * 0.07;
      ox += (tOx - ox) * 0.06;
      oy += (tOy - oy) * 0.06;

      /* scroll reactivity */
      const dScroll = scrollStore.p - lastScrollP;
      lastScrollP = scrollStore.p;

      if (!dragging) {
        orbGroup.rotation.x += (tRotX - orbGroup.rotation.x) * 0.05;
        orbGroup.rotation.y += (tRotYTarget - orbGroup.rotation.y) * 0.02;
        orbGroup.rotation.y += vY;
        orbGroup.rotation.x += vX;
        vY *= 0.93;
        vX *= 0.93;
      }

      const speed = (1 + hover * 1.6) * drive;
      spinGroup.rotation.y += (0.12 + dScroll * 6) * delta * 60 * 0.016 * speed;
      spinGroup.rotation.x += 0.05 * delta * speed;
      core.rotation.y -= 0.2 * delta * speed;
      shell.rotation.z += 0.15 * delta * speed;
      hotCore.rotation.y += 0.6 * delta * speed;
      hotCore.rotation.x -= 0.3 * delta * speed;
      ring1.rotation.z -= 0.5 * delta * speed;
      ring2.rotation.x += 0.4 * delta * speed;

      orbGroup.position.x = ox;
      orbGroup.position.y = oy;

      /* hover surge */
      bloom.strength = 1.5 + hover * 0.7 + Math.sin(clock.elapsedTime * 1.7) * 0.08;
      coreMat.opacity = 0.3 + hover * 0.1;
      hotMat.opacity = 0.42 + hover * 0.16;
      const s = 1 + hover * 0.06;
      spinGroup.scale.setScalar(s);

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      coreGeo.dispose();
      shellGeo.dispose();
      hotGeo.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      wireMat.dispose();
      coreMat.dispose();
      hotMat.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, [interactive]);

  return (
    <div
      ref={wrapRef}
      data-cursor="orb"
      className={`relative aspect-square select-none touch-none ${className}`}
    >
      <div ref={mountRef} className="absolute inset-0" />
      {/* graceful fallback if WebGL is unavailable */}
      <div
        ref={fallbackRef}
        className="absolute inset-0 hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, hsl(36 100% 72% / 0.9), hsl(24 100% 55% / 0.5) 26%, hsl(16 95% 42% / 0.18) 52%, transparent 72%)",
          filter: "blur(1px)",
        }}
        aria-hidden
      />
    </div>
  );
}
