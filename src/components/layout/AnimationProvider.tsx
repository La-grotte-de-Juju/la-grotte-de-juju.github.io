"use client";

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";

interface AnimationContextValue {
  animationsReady: boolean;
  setAnimationsReady: (ready: boolean) => void;
  registerReset: (cb: () => void) => void;
  resetAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [animationsReady, setAnimationsReady] = useState(false);
  const resetCallbacks = useRef<Set<() => void>>(new Set());

  const registerReset = useCallback((cb: () => void) => {
    resetCallbacks.current.add(cb);
    return () => resetCallbacks.current.delete(cb);
  }, []);

  const resetAnimations = useCallback(() => {
    setAnimationsReady(false);
    resetCallbacks.current.forEach((cb) => {
      try { cb(); } catch { /* noop */ }
    });
  }, []);

  return (
    <AnimationContext.Provider value={{ animationsReady, setAnimationsReady, registerReset, resetAnimations }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext() {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error("useAnimationContext doit être utilisé dans un AnimationProvider");
  return ctx;
}
