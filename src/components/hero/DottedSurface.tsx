/**
 * DottedSurface.tsx — Interactive dotted-surface hero visual.
 *
 * Design intent: Faithful production-safe adaptation of the
 * 21st.dev "efferd/dotted-surface" reference — a uniform dot grid
 * that subtly responds to pointer proximity (ripple / repel effect).
 *
 * Architecture:
 *   - Uniform dot grid rendered on Canvas 2D
 *   - Each dot has a base position; pointer creates a localized
 *     displacement + brightness pulse (the signature interaction)
 *   - Dots return to rest via spring-like interpolation
 *   - Very low alpha glow at pointer for premium depth
 *
 * Performance guards:
 *   - Respects prefers-reduced-motion (static poster frame, no raf)
 *   - Reduces dot density on small screens / low-power devices
 *   - Pauses when tab hidden or off-screen (IntersectionObserver)
 *   - Throttled to ~45fps on low-power (navigator.hardwareConcurrency)
 *   - DPR capped at 2
 *   - No external dependencies — pure React + Canvas
 *
 * Hydration strategy:
 *   Use with `client:visible` so it only hydrates when scrolled into view.
 *   All hero text/CTAs remain server-rendered in Astro.
 */

import React, { useEffect, useRef, useCallback } from 'react';

interface Dot {
  x: number;        // base x
  y: number;        // base y
  dx: number;       // current displacement x
  dy: number;       // current displacement y
  brightness: number; // current brightness boost (0..1)
}

interface Props {
  /** Dot grid spacing in px (desktop) */
  spacing?: number;
  /** Base dot radius in px */
  dotRadius?: number;
  /** Pointer influence radius in px */
  influenceRadius?: number;
  /** Pointer displacement strength */
  strength?: number;
  /** Base dot color */
  color?: string;
  /** Pointer-highlighted dot color */
  highlightColor?: string;
  className?: string;
}

export default function DottedSurface({
  spacing = 28,
  dotRadius = 1.1,
  influenceRadius = 130,
  strength = 14,
  color = 'rgba(34, 211, 238, 0.22)',
  highlightColor = 'rgba(103, 232, 249, 0.85)',
  className = 'dotted-surface-canvas',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const startTimeRef = useRef<number>(0);

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

  const buildGrid = useCallback((
    w: number,
    h: number,
    caps: ReturnType<typeof getCapabilities>,
  ) => {
    const gap = caps.lowPower ? spacing * 1.5 : spacing;
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;
    const dots: Dot[] = [];
    // Offset so grid is centered
    const offsetX = (w - (cols - 1) * gap) / 2;
    const offsetY = (h - (rows - 1) * gap) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: offsetX + c * gap,
          y: offsetY + r * gap,
          dx: 0,
          dy: 0,
          brightness: 0,
        });
      }
    }
    dotsRef.current = dots;
  }, [spacing]);

  const drawFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    caps: ReturnType<typeof getCapabilities>,
  ) => {
    ctx.clearRect(0, 0, w, h);

    const dots = dotsRef.current;
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;
    void px; void py;
    const r2 = influenceRadius * influenceRadius;
    const gap = caps.lowPower ? spacing * 1.5 : spacing;

    // Subtle ambient breathing on base alpha (desktop only)
    const breathe = caps.reducedMotion ? 1 : 0.85 + Math.sin(t * 0.0006) * 0.15;

    // Pointer soft glow (premium depth)
    if (pointerRef.current.active && !caps.reducedMotion) {
      const glow = ctx.createRadialGradient(px, py, 0, px, py, influenceRadius * 1.4);
      glow.addColorStop(0, 'rgba(34, 211, 238, 0.10)');
      glow.addColorStop(0.5, 'rgba(34, 211, 238, 0.03)');
      glow.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.fillStyle = color;
    const baseRadius = dotRadius * caps.dpr;

    // Single-pass draw: base dots + highlight near pointer
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const drawX = (dot.x + dot.dx) * caps.dpr;
      const drawY = (dot.y + dot.dy) * caps.dpr;

      if (dot.brightness > 0.02) {
        // Highlighted dot — blend toward highlight color
        ctx.globalAlpha = Math.min(1, dot.brightness) * breathe;
        ctx.fillStyle = highlightColor;
        ctx.beginPath();
        ctx.arc(drawX, drawY, baseRadius + dot.brightness * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
      } else {
        // Base dot — uniform grid texture
        ctx.globalAlpha = 0.9 * breathe;
        ctx.beginPath();
        ctx.arc(drawX, drawY, baseRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }, [color, highlightColor, dotRadius, influenceRadius, spacing]);

  const animate = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    caps: ReturnType<typeof getCapabilities>,
  ) => {
    const targetFps = caps.lowPower ? 30 : 45;
    const frameInterval = 1000 / targetFps;
    let lastFrame = performance.now();

    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const delta = now - lastFrame;
      if (delta < frameInterval) return;
      lastFrame = now - (delta % frameInterval);

      const t = now - startTimeRef.current;
      const dots = dotsRef.current;
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const r2 = influenceRadius * influenceRadius;
      const active = pointerRef.current.active;

      // Update each dot: spring back to rest + pointer influence
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        // Pointer influence
        if (active) {
          const ddx = dot.x - px;
          const ddy = dot.y - py;
          const dist2 = ddx * ddx + ddy * ddy;
          if (dist2 < r2) {
            const dist = Math.sqrt(dist2) || 1;
            const force = (1 - dist / influenceRadius);
            const angle = Math.atan2(ddy, ddx);
            const targetDx = Math.cos(angle) * force * strength;
            const targetDy = Math.sin(angle) * force * strength;
            dot.dx += (targetDx - dot.dx) * 0.18;
            dot.dy += (targetDy - dot.dy) * 0.18;
            dot.brightness += (force - dot.brightness) * 0.2;
          } else {
            // Spring back to rest
            dot.dx *= 0.88;
            dot.dy *= 0.88;
            dot.brightness *= 0.88;
          }
        } else {
          // No pointer: gentle spring back
          dot.dx *= 0.9;
          dot.dy *= 0.9;
          dot.brightness *= 0.9;
        }
      }

      drawFrame(ctx, w, h, t, caps);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [drawFrame, influenceRadius, strength]);

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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      buildGrid(w, h, caps);
      // Poster frame
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
        const rect = canvas.getBoundingClientRect();
        animate(ctx, rect.width, rect.height, caps);
      }
    });
    intersectionObserver.observe(canvas);

    // Pointer tracking (desktop only)
    if (!caps.isMobile && !caps.reducedMotion) {
      const handlePointer = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointerRef.current.x = e.clientX - rect.left;
        pointerRef.current.y = e.clientY - rect.top;
        pointerRef.current.active = true;
      };
      const handleLeave = () => {
        pointerRef.current.active = false;
        pointerRef.current.x = -9999;
        pointerRef.current.y = -9999;
      };
      const heroEl = canvas.closest('.split-hero') as HTMLElement | null;
      heroEl?.addEventListener('pointermove', handlePointer);
      heroEl?.addEventListener('pointerleave', handleLeave);
    }

    // Pause when tab hidden
    const handleVisibility = () => {
      if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!document.hidden && isVisible && !caps.reducedMotion && !rafRef.current) {
        startTimeRef.current = performance.now();
        const rect = canvas.getBoundingClientRect();
        animate(ctx, rect.width, rect.height, caps);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Start animation (unless reduced motion)
    if (!caps.reducedMotion) {
      startTimeRef.current = performance.now();
      const rect = canvas.getBoundingClientRect();
      animate(ctx, rect.width, rect.height, caps);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [animate, buildGrid, drawFrame, getCapabilities]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}