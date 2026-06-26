/**
 * HeroVisual.tsx — Premium canvas-based hero visual scene.
 *
 * Design intent: A faithful, production-safe adaptation of the
 * 21st.dev "serafim/splite" visual architecture. Instead of heavy
 * 3D (Spline/Three.js), we use a GPU-friendly Canvas 2D scene with:
 *   - Animated gradient orbs (soft, blurred, drifting)
 *   - Flowing particle field with connection lines
 *   - Floating geometric wireframe shapes (hexagon, rings)
 *   - Subtle mouse parallax (desktop only)
 *   - Color shifts in brand cyan/teal/indigo palette
 *
 * Performance guards:
 *   - Respects prefers-reduced-motion (static poster frame)
 *   - Reduces particle count on small screens
 *   - Pauses when tab hidden / not visible (IntersectionObserver)
 *   - Throttled to ~40fps on low-power (navigator.hardwareConcurrency)
 *   - DPR capped at 2
 *   - No external dependencies — pure React + Canvas
 *
 * Hydration strategy:
 *   Use with `client:visible` so it only hydrates when scrolled into view.
 *   All hero text/CTAs remain server-rendered in Astro — this island
 *   owns the decorative visual layer only.
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Shape {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  sides: number;
  depth: number;
  phase: number;
}

const BRAND_COLORS = {
  cyan: { r: 34, g: 211, b: 238 },
  teal: { r: 20, g: 184, b: 166 },
  indigo: { r: 129, g: 140, b: 248 },
  emerald: { r: 52, g: 211, b: 153 },
};

function rgba(c: { r: number; g: number; b: number }, a: number): string {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const shapesRef = useRef<Shape[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const startTimeRef = useRef<number>(0);

  // Detect environment capabilities
  const getCapabilities = useCallback(() => {
    if (typeof window === 'undefined') {
      return { reducedMotion: false, isMobile: false, lowPower: false, dpr: 1 };
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const cores = (navigator.hardwareConcurrency || 4) as number;
    const lowPower = cores <= 4 || isMobile;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    return { reducedMotion, isMobile, lowPower, dpr };
  }, []);

  // Initialize scene entities based on capabilities
  const initScene = useCallback((w: number, h: number, caps: ReturnType<typeof getCapabilities>) => {
    // Orbs — soft gradient blobs
    const orbCount = caps.lowPower ? 3 : 5;
    orbsRef.current = Array.from({ length: orbCount }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.max(80, (caps.lowPower ? 120 : 180) + Math.random() * 120),
      hue: i % 4,
      alpha: 0.12 + Math.random() * 0.08,
    }));

    // Particles — flowing field
    const particleCount = caps.lowPower ? 25 : 60;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      life: Math.random() * 200,
      maxLife: 150 + Math.random() * 150,
      size: 0.5 + Math.random() * 1.5,
    }));

    // Shapes — floating wireframes
    const shapeCount = caps.lowPower ? 2 : 4;
    shapesRef.current = Array.from({ length: shapeCount }, (_, i) => ({
      x: (0.2 + Math.random() * 0.6) * w,
      y: (0.2 + Math.random() * 0.6) * h,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.003,
      size: 40 + Math.random() * 60,
      sides: i % 2 === 0 ? 6 : 0, // 0 = ring
      depth: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Draw a single frame (used for static poster too)
  const drawFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    caps: ReturnType<typeof getCapabilities>,
  ) => {
    // Clear with subtle gradient base
    const baseGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.7);
    baseGrad.addColorStop(0, 'rgba(10,16,32,0)');
    baseGrad.addColorStop(1, 'rgba(4,7,17,0.3)');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    const colorKeys = Object.values(BRAND_COLORS);

    // Draw orbs (soft blurred gradient blobs)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const orb of orbsRef.current) {
      const color = colorKeys[orb.hue % colorKeys.length];
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, rgba(color, orb.alpha));
      grad.addColorStop(0.5, rgba(color, orb.alpha * 0.4));
      grad.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Draw shapes (wireframe hexagons + rings)
    ctx.save();
    for (const shape of shapesRef.current) {
      const floatY = Math.sin(t * 0.0005 + shape.phase) * 8 * shape.depth;
      const cx = shape.x + mouseRef.current.x * shape.depth * 20;
      const cy = shape.y + floatY + mouseRef.current.y * shape.depth * 20;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(shape.rotation + t * shape.rotationSpeed);

      if (shape.sides === 6) {
        // Hexagon wireframe
        ctx.strokeStyle = rgba(BRAND_COLORS.cyan, 0.15 * shape.depth);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const px = Math.cos(angle) * shape.size;
          const py = Math.sin(angle) * shape.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Inner hexagon
        ctx.strokeStyle = rgba(BRAND_COLORS.indigo, 0.1 * shape.depth);
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const px = Math.cos(angle) * shape.size * 0.6;
          const py = Math.sin(angle) * shape.size * 0.6;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else {
        // Ring with dashed orbit
        ctx.strokeStyle = rgba(BRAND_COLORS.teal, 0.12 * shape.depth);
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting dot
        const dotAngle = t * 0.0008 + shape.phase;
        const dotX = Math.cos(dotAngle) * shape.size;
        const dotY = Math.sin(dotAngle) * shape.size;
        ctx.fillStyle = rgba(BRAND_COLORS.cyan, 0.4 * shape.depth);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();

    // Draw particles + connections
    ctx.save();
    const maxConnDist = caps.lowPower ? 60 : 90;
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      const lifeRatio = p.life / p.maxLife;
      const alpha = Math.sin(lifeRatio * Math.PI) * 0.6;

      // Particle dot
      ctx.fillStyle = rgba(BRAND_COLORS.cyan, alpha * 0.8);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Connection lines (skip on low-power for perf)
      if (!caps.lowPower) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxConnDist) {
            const connAlpha = (1 - dist / maxConnDist) * 0.12;
            ctx.strokeStyle = rgba(BRAND_COLORS.cyan, connAlpha);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }
    ctx.restore();
  }, []);

  // Main animation loop
  const animate = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    caps: ReturnType<typeof getCapabilities>,
  ) => {
    const targetFps = caps.lowPower ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    let lastFrame = performance.now();
    let frameCount = 0;

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);

      const delta = now - lastFrame;
      if (delta < frameInterval) return;
      lastFrame = now - (delta % frameInterval);
      frameCount++;

      const t = now - startTimeRef.current;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      // Update orbs
      for (const orb of orbsRef.current) {
        orb.x += orb.vx + Math.sin(t * 0.0003 + orb.hue) * 0.1;
        orb.y += orb.vy + Math.cos(t * 0.0004 + orb.hue) * 0.1;
        if (orb.x < -orb.radius) orb.x = w + orb.radius;
        if (orb.x > w + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = h + orb.radius;
        if (orb.y > h + orb.radius) orb.y = -orb.radius;
      }

      // Update particles
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.life = 0;
          p.maxLife = 150 + Math.random() * 150;
        }
      }

      // Clear and draw
      ctx.clearRect(0, 0, w, h);
      drawFrame(ctx, w, h, t, caps);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const caps = getCapabilities();
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let isVisible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      canvas.width = w * caps.dpr;
      canvas.height = h * caps.dpr;
      ctx.scale(caps.dpr, caps.dpr);
      initScene(w, h, caps);

      // Draw at least one frame immediately (poster)
      drawFrame(ctx, w, h, 0, caps);
    };

    resize();
    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    // Pause when off-screen
    intersectionObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
      if (!isVisible && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (isVisible && !caps.reducedMotion && !rafRef.current) {
        startTimeRef.current = performance.now();
        animate(ctx, canvas.getBoundingClientRect().width / caps.dpr, canvas.getBoundingClientRect().height / caps.dpr, caps);
      }
    });
    intersectionObserver.observe(canvas);

    // Mouse parallax (desktop only)
    if (!caps.isMobile && !caps.reducedMotion) {
      const handleMouse = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseRef.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      const heroEl = canvas.closest('.split-hero') as HTMLElement | null;
      heroEl?.addEventListener('mousemove', handleMouse as EventListener);
    }

    // Pause when tab hidden
    const handleVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!document.hidden && isVisible && !caps.reducedMotion && !rafRef.current) {
        startTimeRef.current = performance.now();
        const rect = canvas.getBoundingClientRect();
        animate(ctx, rect.width / caps.dpr, rect.height / caps.dpr, caps);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Start animation (unless reduced motion)
    if (!caps.reducedMotion) {
      startTimeRef.current = performance.now();
      const rect = canvas.getBoundingClientRect();
      animate(ctx, rect.width / caps.dpr, rect.height / caps.dpr, caps);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [animate, drawFrame, getCapabilities, initScene]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-visual-canvas"
      aria-hidden="true"
    />
  );
}