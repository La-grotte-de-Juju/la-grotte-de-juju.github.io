'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  metallicEffect?: boolean;
  intensity?: number;
  borderRadius?: string;
  performanceMode?: 'auto' | 'reduced' | 'off';
}

export function Card3D({
  children,
  className = '',
  glowColor = 'rgba(255, 255, 255, 0.8)',
  metallicEffect = true,
  intensity = 15,
  borderRadius = '0.75rem',
  performanceMode = 'auto',
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  const [isPointerCoarse, setIsPointerCoarse] = useState(false);
  const rAF = useRef<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  
  const safeIntensity = Math.min(intensity, 12);
  
  const rotateY = useTransform(mouseX, [-1, 1], [-safeIntensity, safeIntensity]);
  const rotateX = useTransform(mouseY, [-1, 1], [safeIntensity, -safeIntensity]);
  
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);
  
  const effectivePerformance = (() => {
    if (performanceMode === 'off') return 'off';
    if (performanceMode === 'reduced') return 'reduced';
    if (shouldReduceMotion) return 'reduced';
    if (isPointerCoarse) return 'off';
    return 'auto';
  })();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered || effectivePerformance === 'off') return;
    if (rAF.current) cancelAnimationFrame(rAF.current);
    const run = () => {
      if (!cardRef.current) return;
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      const mappedX = (x * 2) - 1;
      const mappedY = (y * 2) - 1;
      mouseX.set(mappedX);
      mouseY.set(mappedY);
      setMousePosition({ x, y });
    };
    rAF.current = requestAnimationFrame(run);
  }, [isHovered, effectivePerformance, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    if (rAF.current) cancelAnimationFrame(rAF.current);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    if (effectivePerformance === 'off') return;
    setIsHovered(true);
  }, [effectivePerformance]);
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const listener = () => setIsPointerCoarse(mq.matches);
    listener();
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => () => { if (rAF.current) cancelAnimationFrame(rAF.current); }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`${className} relative transition-transform`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        perspective: '1200px',
  zIndex: isHovered ? 999 : 1,
        position: 'relative',
        cursor: 'pointer',
  transition: 'z-index 0.01s',
      }}
      whileHover={effectivePerformance === 'off' ? undefined : { 
        scale: effectivePerformance === 'reduced' ? 1.03 : 1.08,
        zIndex: 999,
        transition: { scale: { type: "spring", stiffness: 260, damping: 20 } }
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{
          rotateX: effectivePerformance === 'off' ? 0 : smoothRotateX,
          rotateY: effectivePerformance === 'off' ? 0 : smoothRotateY,
          transformStyle: 'preserve-3d',
          borderRadius,
          transformOrigin: 'center center',
          boxShadow: isHovered 
            ? '0 25px 50px rgba(0, 0, 0, 0.35)' 
            : '0 10px 20px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s',
          position: 'relative',
          willChange: isHovered ? 'transform' : 'auto',
        }}
      >
        <div 
          className="w-full h-full relative z-10"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'translateZ(10px)',
            borderRadius,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {children}
        </div>
        
    {isHovered && effectivePerformance !== 'off' && (
          <>
      {metallicEffect && effectivePerformance === 'auto' && (
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  borderRadius,
                  background: `linear-gradient(
                    ${45 + (mousePosition.x * 30)}deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.1) 15%, 
                    rgba(255, 255, 255, 0.2) 30%,
                    rgba(255, 255, 255, 0) 60%
                  )`,
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(8px)',
                  mixBlendMode: 'overlay',
                }}
              />
            )}
            
            {effectivePerformance === 'auto' && <div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                borderRadius,
                background: `radial-gradient(
                  circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                  ${glowColor} 0%,
                  rgba(255, 255, 255, 0.05) 20%,
                  transparent 40%
                )`,
                opacity: 0.6,
                transformStyle: 'preserve-3d',
                transform: 'translateZ(10px)',
                mixBlendMode: 'soft-light',
              }}
            />}
            
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                borderRadius,
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
                transformStyle: 'preserve-3d',
                transform: 'translateZ(5px)',
              }}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
