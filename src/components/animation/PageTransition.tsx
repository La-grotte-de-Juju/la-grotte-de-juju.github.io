"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useAnimationContext } from "@/components/layout/AnimationProvider";

interface PageTransitionProps {
  children: ReactNode;
  blurIntensity?: number; 
  animationsReady?: boolean; // possibilité de forcer via prop
}

// Animations modernes style Apple avec des courbes de Bézier élégantes
const variants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    filter: "blur(20px)",
    borderRadius: "24px",
    rotateX: 8,
    transformPerspective: 1000,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    borderRadius: "0px",
    rotateX: 0,
    transformPerspective: 1000,
  },
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.96,
    filter: "blur(15px)",
    borderRadius: "20px",
    rotateX: -4,
    transformPerspective: 1000,
  },
};

// Transition fluide inspirée des animations Apple
const appleTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.8,
  duration: 0.6,
};

export default function PageTransition({ children, blurIntensity = 20, animationsReady }: PageTransitionProps) {
  const pathname = usePathname();
  let ready = animationsReady;
  try {
    const ctx = useAnimationContext();
    if (ready === undefined) ready = ctx.animationsReady;
  } catch {
    // si pas de provider, on laisse animer directement
    ready = true;
  }

  const customVariants = {
    initial: {
      ...variants.initial,
      filter: `blur(${blurIntensity}px)`,
    },
    animate: {
      ...variants.animate,
      filter: "blur(0px)",
    },
    exit: {
      ...variants.exit,
      filter: `blur(${blurIntensity * 0.8}px)`,
    },
  };

  return (
    <div style={{ 
      perspective: "1600px", 
      overflow: "visible",
      transformStyle: "preserve-3d"
    }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={pathname}
          initial="initial"
          animate={ready ? "animate" : "initial"}
          exit="exit"
          variants={customVariants}
          transition={{
            ...appleTransition,
            opacity: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
            filter: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
            borderRadius: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
          }}
          style={{
            transformOrigin: "center center",
            willChange: "transform, opacity, filter, borderRadius",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Effet de fond subtil avec gradient animé */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(236, 72, 153, 0.03) 100%)",
              backdropFilter: "blur(0px)",
              zIndex: -1,
              borderRadius: "20px",
              width: "100%",
              height: "100%",
            }}
            initial={{ 
              opacity: 0.6, 
              backdropFilter: `blur(${blurIntensity * 0.3}px)`,
              scale: 1.02
            }}
            animate={{ 
              opacity: 0, 
              backdropFilter: "blur(0px)",
              scale: 1,
              transition: { delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } 
            }}
            exit={{ 
              opacity: 0.4, 
              backdropFilter: `blur(${blurIntensity * 0.2}px)`,
              scale: 1.01,
              transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
            }}
          />
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
