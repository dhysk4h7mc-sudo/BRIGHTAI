/**
 * dotted-surface.js — Interactive dotted-surface canvas for SplitHero.
 *
 * Faithful vanilla-JS port of the previous DottedSurface.tsx React island.
 * Drops the React renderer payload (~185 KB raw / ~58 KB gzipped) for a
 * pure-Canvas implementation that runs only on the homepage hero.
 *
 * Design intent: Faithful production-safe adaptation of the
 * 21st.dev "efferd/dotted-surface" reference — a uniform dot grid that
 * subtly responds to pointer proximity (ripple / repel effect).
 *
 * Architecture:
 *   - Uniform dot grid rendered on Canvas 2D
 *   - Each dot has a base position; pointer creates a localized
 *     displacement + brightness pulse (signature interaction)
 *   - Dots return to rest via spring-like interpolation
 *   - Very low alpha glow at pointer for premium depth
 *
 * Performance guards:
 *   - Respects prefers-reduced-motion (static poster frame, no raf)
 *   - Reduces dot density on small screens / low-power devices
 *   - Pauses when tab hidden or off-screen (IntersectionObserver)
 *   - Throttled to ~45 fps desktop / ~30 fps low-power
 *   - DPR capped at 2
 *   - Zero dependencies — pure browser APIs
 *
 * Lifecycle:
 *   - Init on astro:page-load + DOMContentLoaded fallback
 *   - Cleanup on astro:before-swap (view transitions) + beforeunload
 *   - Re-init on astro:after-swap to rebind the new page's canvas
 *
 * Markup contract (added by SplitHero.astro):
 *   <div class="split-hero__visual" aria-hidden="true">
 *     <canvas class="dotted-surface-canvas"></canvas>
 *   </div>
 */

const SPACING = 36;
const DOT_RADIUS = 1.1;
const INFLUENCE_RADIUS = 140;
const STRENGTH = 16;
const COLOR = 'rgba(75, 166, 156, 0.20)';
const HIGHLIGHT_COLOR = 'rgba(130, 219, 207, 0.95)';
const CONNECTION_COLOR = 'rgba(75, 166, 156, 0.08)';
const CONNECTION_DISTANCE = 56;

let instances = [];

function getCapabilities() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 4;
  const lowPower = cores <= 4 || isMobile;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return { reducedMotion, isMobile, lowPower, dpr };
}

function buildGrid(w, h, caps) {
  const gap = caps.lowPower ? SPACING * 1.5 : SPACING;
  const cols = Math.ceil(w / gap) + 1;
  const rows = Math.ceil(h / gap) + 1;
  const offsetX = (w - (cols - 1) * gap) / 2;
  const offsetY = (h - (rows - 1) * gap) / 2;
  const dots = [];
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
  return dots;
}

function drawFrame(ctx, w, h, t, caps, state) {
  ctx.clearRect(0, 0, w, h);

  const dots = state.dots;
  const px = state.pointer.x;
  const py = state.pointer.y;
  const breathe = caps.reducedMotion ? 1 : 0.85 + Math.sin(t * 0.0006) * 0.15;

  if (state.pointer.active && !caps.reducedMotion) {
    const glow = ctx.createRadialGradient(px, py, 0, px, py, INFLUENCE_RADIUS * 1.4);
    glow.addColorStop(0, 'rgba(75, 166, 156, 0.12)');
    glow.addColorStop(0.5, 'rgba(75, 166, 156, 0.04)');
    glow.addColorStop(1, 'rgba(75, 166, 156, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.fillStyle = COLOR;
  const baseRadius = DOT_RADIUS * caps.dpr;

  // Smarter connections between nearby dots (desktop only, off on reduced motion)
  if (!caps.lowPower && !caps.reducedMotion) {
    const cd2 = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    ctx.strokeStyle = CONNECTION_COLOR;
    ctx.lineWidth = 1 * caps.dpr;
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      if (a.brightness < 0.05 && Math.sin(t * 0.0008 + a.x * 0.01) < 0.92) continue;
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const ddx = (a.x + a.dx) - (b.x + b.dx);
        const ddy = (a.y + a.dy) - (b.y + b.dy);
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < cd2) {
          const alpha = 1 - Math.sqrt(d2) / CONNECTION_DISTANCE;
          ctx.globalAlpha = alpha * 0.25 * Math.max(a.brightness, 0.3);
          ctx.beginPath();
          ctx.moveTo((a.x + a.dx) * caps.dpr, (a.y + a.dy) * caps.dpr);
          ctx.lineTo((b.x + b.dx) * caps.dpr, (b.y + b.dy) * caps.dpr);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const drawX = (dot.x + dot.dx) * caps.dpr;
    const drawY = (dot.y + dot.dy) * caps.dpr;

    if (dot.brightness > 0.02) {
      ctx.globalAlpha = Math.min(1, dot.brightness) * breathe;
      ctx.fillStyle = HIGHLIGHT_COLOR;
      ctx.beginPath();
      ctx.arc(drawX, drawY, baseRadius + dot.brightness * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COLOR;
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.9 * breathe;
      ctx.beginPath();
      ctx.arc(drawX, drawY, baseRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function init(canvas) {
  if (!canvas || canvas.dataset.dotInit === '1') return;
  canvas.dataset.dotInit = '1';

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const caps = getCapabilities();
  const state = {
    dots: [],
    pointer: { x: -9999, y: -9999, active: false },
    startTime: 0,
    rafId: 0,
    isVisible: true,
    resizeObserver: null,
    intersectionObserver: null,
    handleVisibility: null,
    handlePointer: null,
    handleLeave: null,
    targetEl: null,
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * caps.dpr;
    canvas.height = h * caps.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    state.dots = buildGrid(w, h, caps);
    drawFrame(ctx, w, h, 0, caps, state);
  };

  const animate = () => {
    const targetFps = caps.lowPower ? 30 : 45;
    const frameInterval = 1000 / targetFps;
    let lastFrame = performance.now();

    const loop = (now) => {
      state.rafId = requestAnimationFrame(loop);
      const delta = now - lastFrame;
      if (delta < frameInterval) return;
      lastFrame = now - (delta % frameInterval);

      const t = now - state.startTime;
      const dots = state.dots;
      const px = state.pointer.x;
      const py = state.pointer.y;
      const r2 = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
      const active = state.pointer.active;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        if (active) {
          const ddx = dot.x - px;
          const ddy = dot.y - py;
          const dist2 = ddx * ddx + ddy * ddy;
          if (dist2 < r2) {
            const dist = Math.sqrt(dist2) || 1;
            const force = (1 - dist / INFLUENCE_RADIUS);
            const angle = Math.atan2(ddy, ddx);
            const targetDx = Math.cos(angle) * force * STRENGTH;
            const targetDy = Math.sin(angle) * force * STRENGTH;
            dot.dx += (targetDx - dot.dx) * 0.18;
            dot.dy += (targetDy - dot.dy) * 0.18;
            dot.brightness += (force - dot.brightness) * 0.2;
          } else {
            dot.dx *= 0.88;
            dot.dy *= 0.88;
            dot.brightness *= 0.88;
          }
        } else {
          dot.dx *= 0.9;
          dot.dy *= 0.9;
          dot.brightness *= 0.9;
        }
      }

      const rect = canvas.getBoundingClientRect();
      drawFrame(ctx, rect.width, rect.height, t, caps, state);
    };

    state.rafId = requestAnimationFrame(loop);
  };

  resize();

  state.resizeObserver = new ResizeObserver(resize);
  state.resizeObserver.observe(canvas);

  state.intersectionObserver = new IntersectionObserver((entries) => {
    state.isVisible = entries[0]?.isIntersecting ?? true;
    if (!state.isVisible && state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    } else if (state.isVisible && !caps.reducedMotion && !state.rafId) {
      state.startTime = performance.now();
      animate();
    }
  });
  state.intersectionObserver.observe(canvas);

  if (!caps.isMobile && !caps.reducedMotion) {
    state.handlePointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.pointer.x = e.clientX - rect.left;
      state.pointer.y = e.clientY - rect.top;
      state.pointer.active = true;
    };
    state.handleLeave = () => {
      state.pointer.active = false;
      state.pointer.x = -9999;
      state.pointer.y = -9999;
    };
    state.targetEl = canvas.closest('.split-hero');
    state.targetEl?.addEventListener('pointermove', state.handlePointer);
    state.targetEl?.addEventListener('pointerleave', state.handleLeave);
  }

  state.handleVisibility = () => {
    if (document.hidden && state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = 0;
    } else if (!document.hidden && state.isVisible && !caps.reducedMotion && !state.rafId) {
      state.startTime = performance.now();
      animate();
    }
  };
  document.addEventListener('visibilitychange', state.handleVisibility);

  if (!caps.reducedMotion) {
    state.startTime = performance.now();
    animate();
  }

  // Cleanup function attached to canvas for view-transition teardown
  canvas._dottedSurfaceCleanup = () => {
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.resizeObserver?.disconnect();
    state.intersectionObserver?.disconnect();
    if (state.handleVisibility) document.removeEventListener('visibilitychange', state.handleVisibility);
    if (state.handlePointer) {
      state.targetEl?.removeEventListener('pointermove', state.handlePointer);
      state.targetEl?.removeEventListener('pointerleave', state.handleLeave);
    }
    canvas.dataset.dotInit = '';
  };

  instances.push(canvas);
}

function cleanupAll() {
  for (const canvas of instances) {
    canvas._dottedSurfaceCleanup?.();
  }
  instances = [];
}

function initAll() {
  const canvases = document.querySelectorAll('.dotted-surface-canvas');
  canvases.forEach(init);
}

function boot() {
  initAll();
}

document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:after-swap', boot);
document.addEventListener('astro:before-swap', cleanupAll);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}