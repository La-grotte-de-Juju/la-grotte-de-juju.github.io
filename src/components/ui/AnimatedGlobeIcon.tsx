"use client";
import React from 'react';
import Lottie from 'lottie-react';
import globeData from '@/animations/globe';

interface AnimatedGlobeIconProps { size?: number; className?: string; opacity?: number; }

export default function AnimatedGlobeIcon({ size = 20, className = '', opacity = 0.45 }: AnimatedGlobeIconProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <svg
        className="absolute inset-0 w-full h-full text-black/50"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 2.5 4.5 6 4.5 9s-1.5 6.5-4.5 9c-3-2.5-4.5-6-4.5-9s1.5-6.5 4.5-9Z" />
        <ellipse cx="12" cy="12" rx="9" ry="4.2" />
      </svg>
      <Lottie
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        animationData={globeData as any}
        loop
        autoplay
        style={{ width: size, height: size, filter: 'brightness(0) contrast(1.1)' }}
      />
    </span>
  );
}
