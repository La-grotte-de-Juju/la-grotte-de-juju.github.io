"use client";

import { useRef, ReactNode, memo, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useAnimationContext } from "@/components/layout/AnimationProvider";

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: "modern-fade" | "apple-slide" | "elastic-scale" | "glass-morph" | "floating-card" | "perspective-tilt" | "liquid-rise" | "spring-bounce" | "smooth-reveal" | "depth-push" | "magnetic-pull" | "crystal-emerge";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  intensity?: number;
  stabilize?: boolean; // Empêche de repasser en hidden juste à la limite du viewport
}
const modernAnimations = {
  "modern-fade": {
    hidden: { 
      opacity: 0, 
      filter: "blur(8px) brightness(1.1)",
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      filter: "blur(0px) brightness(1)",
      scale: 1
    },
  },
  "apple-slide": {
    hidden: { 
      opacity: 0,
      y: 40,
      scale: 0.96,
      filter: "blur(6px)",
      rotateX: 3
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      rotateX: 0
    },
  },
  "elastic-scale": {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      filter: "blur(4px)",
      rotateZ: -2
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotateZ: 0
    },
  },
  "glass-morph": {
    hidden: { 
      opacity: 0,
      scale: 0.94,
      filter: "blur(12px) saturate(1.2)",
      backdropFilter: "blur(0px)",
      borderRadius: "24px"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px) saturate(1)",
      backdropFilter: "blur(20px)",
      borderRadius: "12px"
    },
  },
  "floating-card": {
    hidden: { 
      opacity: 0,
      y: 60,
      scale: 0.92,
      rotateX: 8,
      rotateY: -4,
      filter: "blur(8px)",
      transformPerspective: 1000
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px)",
      transformPerspective: 1000
    },
  },
  "perspective-tilt": {
    hidden: { 
      opacity: 0,
      rotateX: 15,
      rotateY: -10,
      scale: 0.9,
      filter: "blur(6px)",
      transformPerspective: 1200,
      transformOrigin: "center bottom"
    },
    visible: { 
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      filter: "blur(0px)",
      transformPerspective: 1200,
      transformOrigin: "center center"
    },
  },
  "liquid-rise": {
    hidden: { 
      opacity: 0,
      y: 80,
      scaleY: 0.7,
      scaleX: 1.1,
      filter: "blur(10px)",
      skewY: 2
    },
    visible: { 
      opacity: 1,
      y: 0,
      scaleY: 1,
      scaleX: 1,
      filter: "blur(0px)",
      skewY: 0
    },
  },
  "spring-bounce": {
    hidden: { 
      opacity: 0,
      scale: 0.3,
      filter: "blur(8px)",
      rotate: -10
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotate: 0
    },
  },
  "smooth-reveal": {
    hidden: { 
      opacity: 0,
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1,
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
      filter: "blur(0px)"
    },
  },
  "depth-push": {
    hidden: { 
      opacity: 0,
      z: -100,
      scale: 1.2,
      filter: "blur(20px) brightness(0.8)"
    },
    visible: { 
      opacity: 1,
      z: 0,
      scale: 1,
      filter: "blur(0px) brightness(1)"
    },
  },
  "magnetic-pull": {
    hidden: { 
      opacity: 0,
      x: -60,
      y: 30,
      scale: 0.85,
      filter: "blur(8px)",
      rotateZ: -5
    },
    visible: { 
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      rotateZ: 0
    },
  },
  "crystal-emerge": {
    hidden: { 
      opacity: 0,
      scale: 0.6,
      rotateX: -20,
      rotateY: 20,
      filter: "blur(15px) brightness(1.5) saturate(0.5)",
      transformPerspective: 1000
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: "blur(0px) brightness(1) saturate(1)",
      transformPerspective: 1000
    },
  }
};

const AnimateOnScroll = memo(function AnimateOnScroll({
  children,
  animation = "modern-fade",
  duration = 0.8,
  delay = 0,
  threshold = 0.15,
  className = "",
  once = false,
  intensity = 1,
  stabilize = true,
}: AnimateOnScrollProps) {
  const ref = useRef(null);
  let animationsReady = true;
  try {
    const ctx = useAnimationContext();
    animationsReady = ctx.animationsReady;
  } catch {
    animationsReady = true;
  }
  const rawInView = useInView(ref, {
  once: false,
    amount: threshold,
    margin: "80px 0px 80px 0px",
  });

  const [hasEntered, setHasEntered] = useState(false);
  const [stableInView, setStableInView] = useState(false);

  useEffect(() => {
    if (rawInView) {
      setHasEntered(true);
      setStableInView(true);
    } else if (!rawInView && !once && !stabilize) {
      setStableInView(false);
    } else if (!rawInView && !once && stabilize) {
      const timeout = setTimeout(() => {
        setStableInView((prev) => (rawInView ? prev : false));
      }, 180); // 180ms de latence
      return () => clearTimeout(timeout);
    }
  }, [rawInView, once, stabilize]);

  const isActive = once ? hasEntered : stableInView;

  const selectedAnimation = modernAnimations[animation] || modernAnimations["modern-fade"];
  
  const getTransitionConfig = () => {
    const baseConfig = {
      duration: Math.min(duration * intensity, 1.2),
      delay: Math.min(delay, 0.6),
      ease: [0.25, 0.1, 0.25, 1], // Courbe de Bézier Apple
    };

    switch (animation) {
      case "spring-bounce":
        return {
          type: "spring",
          stiffness: 400 * intensity,
          damping: 20,
          mass: 0.8,
          delay: Math.min(delay, 0.4),
        };
      case "elastic-scale":
        return {
          type: "spring",
          stiffness: 300 * intensity,
          damping: 25,
          delay: Math.min(delay, 0.3),
        };
      case "liquid-rise":
        return {
          ...baseConfig,
          ease: [0.32, 0.72, 0, 1], // Ease out back
          duration: Math.min(duration * intensity, 1.0),
        };
      case "glass-morph":
        return {
          ...baseConfig,
          ease: [0.4, 0, 0.2, 1], // Ease in out
          duration: Math.min(duration * intensity, 0.9),
        };
      case "smooth-reveal":
        return {
          ...baseConfig,
          ease: [0.6, 0, 0.4, 1], // Custom smooth
          duration: Math.min(duration * intensity, 1.1),
        };
      default:
        return baseConfig;
    }
  };

  const shouldPreserve3D = [
    "floating-card", 
    "perspective-tilt", 
    "crystal-emerge", 
    "depth-push"
  ].includes(animation);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
  animate={isActive && animationsReady ? "visible" : "hidden"}
      variants={selectedAnimation}
      transition={getTransitionConfig()}
      style={{
        ...(shouldPreserve3D ? { perspective: "1200px", transformStyle: "preserve-3d" } : {}),
        willChange: "opacity, transform", // réduit le coût (éviter filter/backdrop en will-change sur trop d'éléments)
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

export default AnimateOnScroll;
