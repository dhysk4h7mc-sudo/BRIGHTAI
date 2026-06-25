import { useId, useState, useEffect, useRef } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { motion, useAnimation } from "motion/react";

type Props = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
};

/**
 * Phase 13 — Adaptive Performance Hardening
 *
 * Detects device capabilities at mount and adjusts:
 *   - Particle density (500 desktop / 200 mobile / 80 low-end)
 *   - FPS cap      (120 desktop / 60 mobile / 30 low-end)
 *   - Pauses when tab is hidden (visibilitychange)
 *   - Respects prefers-reduced-motion (renders nothing)
 *   - Reduces on slow connections (2g / save-data)
 *   - Uses pauseOnOutsideViewport for scroll-based pause
 */

interface DeviceProfile {
  density: number;
  fps: number;
  shouldRender: boolean;
}

function detectDevice(defaultDensity: number): DeviceProfile {
  if (typeof window === "undefined") {
    return { density: defaultDensity, fps: 60, shouldRender: true };
  }

  // ── Hard stop: prefers-reduced-motion ──
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return { density: 0, fps: 0, shouldRender: false };

  // ── Hard stop: save-data / slow connection ──
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return { density: 0, fps: 0, shouldRender: false };
  if (conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
    return { density: 60, fps: 24, shouldRender: true };
  }

  // ── Device classification ──
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const _nav = navigator as unknown as { deviceMemory?: number };
  const lowMem = _nav.deviceMemory != null && _nav.deviceMemory < 4;
  const isLowEnd = isMobile && (lowCPU || lowMem);

  if (isLowEnd) return { density: 80, fps: 30, shouldRender: true };
  if (isMobile)  return { density: 200, fps: 60, shouldRender: true };

  return { density: defaultDensity, fps: 120, shouldRender: true };
}

export const SparklesCore = (props: Props) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 500,
    particleColor = "#FFFFFF",
  } = props;

  const controls = useAnimation();
  const defaultId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Adaptive device profile ──
  const [profile, setProfile] = useState<DeviceProfile>({
    density: particleDensity,
    fps: 60,
    shouldRender: true,
  });

  useEffect(() => {
    setProfile(detectDevice(particleDensity));
  }, [particleDensity]);

  // ── Initial fade-in (client only) ──
  useEffect(() => {
    if (profile.shouldRender) {
      controls.start({ opacity: 1, transition: { duration: 1 } });
    }
  }, [profile.shouldRender, controls]);

  // ── Pause on visibility change ──
  useEffect(() => {
    if (!profile.shouldRender) return;

    const handleVisibility = () => {
      if (document.hidden) {
        controls.stop();
      } else {
        controls.start({ opacity: 1, transition: { duration: 0.6 } });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [profile.shouldRender, controls]);

  // ── Don't render at all for reduced-motion / save-data ──
  if (!profile.shouldRender) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{ width: "100%", height: "100%", opacity: 0 }}
        aria-hidden="true"
      />
    );
  }

  return (
    <ParticlesProvider
      init={async (engine) => {
        const { loadSlim } = await import("@tsparticles/slim");
        await loadSlim(engine);
      }}
    >
      <motion.div
        ref={containerRef}
        animate={controls}
        className={className}
        style={{ opacity: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <Particles
          id={id ?? defaultId}
          options={{
            fullScreen: { enable: false },
            background: { color: background },
            fpsLimit: profile.fps,
            particles: {
              number: { value: profile.density },
              color: { value: particleColor },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: {
                  enable: true,
                  speed: 4,
                  sync: false,
                  startValue: "random",
                },
              },
              size: {
                value: { min: minSize, max: maxSize },
              },
              move: {
                enable: true,
                speed: { min: 0.1, max: 1 },
              },
              links: { enable: false },
            },
            pauseOnOutsideViewport: true,
            detectRetina: true,
            interactivity: {
              events: {
                onHover: { enable: false },
                onClick: { enable: false },
                resize: { enable: true },
              },
            },
          }}
        />
      </motion.div>
    </ParticlesProvider>
  );
};

export default SparklesCore;
