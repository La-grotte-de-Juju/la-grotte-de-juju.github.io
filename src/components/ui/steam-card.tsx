'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface SteamCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  shineIntensity?: number;
  borderRadius?: string;
  shadowColor?: string;
}

export function SteamCard({
  children,
  className = '',
  intensity = 6,
  shineIntensity = 0.4,
  borderRadius = '0.75rem',
  shadowColor = 'rgba(0, 0, 0, 0.35)',
}: SteamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  const shineX = useTransform(mouseX, [-0.5, 0.5], [0, 100], {
    clamp: true,
  });
  const shineY = useTransform(mouseY, [-0.5, 0.5], [0, 100], {
    clamp: true,
  });

  const shadowIntensity = useTransform(
    mouseY,
    [-0.5, 0, 0.5],
    [0.7, 1, 0.7]
  );
  const shadowBlur = useTransform(
    mouseY, 
    [-0.5, 0, 0.5], 
    [15, 25, 15]
  );
  const shadowX = useTransform(
    mouseX, 
    [-0.5, 0, 0.5], 
    [-10, 0, 10]
  );
  const shadowY = useTransform(
    mouseY, 
    [-0.5, 0, 0.5], 
    [-10, 0, 10]
  );
  
  const boxShadow = useTransform(
    [shadowBlur, shadowX, shadowY, shadowIntensity],
    ([blur, x, y, intensity]) => 
      `${x}px ${y}px ${blur}px ${shadowColor.replace(')', `, ${intensity})`).replace('rgba', 'rgba')}`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const relativeX = (e.clientX - centerX) / rect.width;
    const relativeY = (e.clientY - centerY) / rect.height;
    
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const refractionX = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const refractionY = useTransform(mouseY, [-0.5, 0.5], [-5, 5]);

  return (
    <div 
      ref={cardRef}
      className={`${className} relative`}
      style={{ 
        perspective: '1500px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          borderRadius,
          boxShadow: isHovered ? boxShadow : '0px 7px 20px rgba(0, 0, 0, 0.2)',
          transition: 'box-shadow 0.3s ease',
          backfaceVisibility: 'hidden',
        }}
        whileHover={{ scale: 1.03 }}
      >
        {/* Fond de la carte avec effet de réfraction */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            borderRadius,
            transformStyle: 'preserve-3d',
            transform: isHovered ? `translateX(${refractionX}px) translateY(${refractionY}px)` : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
        
        {/* Contenu de la carte */}
        <div className="relative z-10 w-full h-full" style={{ borderRadius }}>
          {children}
        </div>

        {/* Effet de reflet holographique */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: isHovered
              ? `linear-gradient(
                  ${shineX}deg,
                  rgba(255, 255, 255, 0) 0%,
                  rgba(255, 255, 255, ${shineIntensity}) 25%,
                  rgba(255, 255, 255, ${shineIntensity * 0.75}) 50%,
                  rgba(255, 255, 255, 0) 100%
                )`
              : 'none',
            borderRadius,
            transformStyle: 'preserve-3d',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Effet de lueur brillante */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: isHovered
              ? `radial-gradient(
                  circle at ${shineX}% ${shineY}%,
                  rgba(255, 255, 255, ${shineIntensity}),
                  transparent 50%
                )`
              : 'none',
            borderRadius,
            transformStyle: 'preserve-3d',
            mixBlendMode: 'plus-lighter',
          }}
        />

        {/* Effet de reflet au bord */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: isHovered
              ? `linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.15) 0%,
                  rgba(255, 255, 255, 0.05) 15%,
                  rgba(255, 255, 255, 0) 50%
                )`
              : 'none',
            borderRadius,
            transformStyle: 'preserve-3d',
          }}
        />
      </motion.div>
    </div>
  );
}
