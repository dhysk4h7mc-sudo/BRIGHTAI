import { useId } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { motion, useAnimation } from "motion/react";
import { cn } from "../lib/utils";

type Props = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
};

export const SparklesCore = (props: Props) => {
  const {
    id,
    className,
    background = "transparent",
    minSize = 0.4,
    maxSize = 1,
    particleDensity = 1200,
    particleColor = "#FFFFFF",
  } = props;

  const controls = useAnimation();
  const defaultId = useId();

  void controls.start({
    opacity: 1,
    transition: { duration: 1 },
  });

  return (
    <ParticlesProvider
      init={async (engine) => {
        const { loadSlim } = await import("@tsparticles/slim");
        await loadSlim(engine);
      }}
    >
      <motion.div
        animate={controls}
        className={cn("opacity-0", className)}
      >
        <Particles
          id={id ?? defaultId}
          options={{
            fullScreen: { enable: false },
            background: { color: background },
            fpsLimit: 120,
            particles: {
              number: { value: particleDensity },
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
            detectRetina: true,
          }}
        />
      </motion.div>
    </ParticlesProvider>
  );
};

export default SparklesCore;