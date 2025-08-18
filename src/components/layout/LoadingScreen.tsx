"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  show: boolean;
  onFinished: () => void;
  minimumDuration?: number; // durée minimale d'affichage pour éviter un flash
}

export default function LoadingScreen({ show, onFinished, minimumDuration = 800 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(show);
  const [contentVisible, setContentVisible] = useState(false); // apparition progressive du contenu loader
  const startTimeRef = useRef<number | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Nettoyage timers
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (contentTimerRef.current) clearTimeout(contentTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (show) {
      // (Ré)ouverture
      startTimeRef.current = performance.now();
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      setVisible(true);
      setContentVisible(false);
      contentTimerRef.current = setTimeout(() => setContentVisible(true), 120);
    } else {
      // Fermeture: on coupe le contenu tout de suite (petit fade/scale out) puis on laisse la couche blanche s'éteindre
      setContentVisible(false);
      const now = performance.now();
      const elapsed = startTimeRef.current ? now - startTimeRef.current : minimumDuration;
      const remaining = Math.max(0, minimumDuration - elapsed);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      exitTimerRef.current = setTimeout(() => {
        setVisible(false); // déclenche l'animation de sortie via AnimatePresence
      }, remaining);
    }
  }, [show, minimumDuration]);

  const containerVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, scale: 0.985, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
  } as const;

  return (
    <AnimatePresence onExitComplete={onFinished} mode="sync">
      {visible && (
        <motion.div
          key="loading-screen"
          className="loading-screen"
            // On garde l'opacité pleine (le fade global se fait à la sortie)
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Couche gradient / glow */}
          <motion.div
            className="loading-gradient-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: contentVisible ? 1 : 0, filter: contentVisible ? "blur(0px)" : "blur(2px)" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            aria-hidden="true"
          />
          {/* Contenu (gif + texte) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: contentVisible ? 1 : 0, scale: contentVisible ? 1 : 0.92, y: contentVisible ? 0 : 6 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div className="loading-gif">
              <Image
                src="/images/JujuLoading512px.gif"
                alt="Chargement en cours..."
                width={180}
                height={180}
                priority
                className="rounded-full z-20 relative"
              />
            </div>
            <div className="loading-text-wrapper mt-4">
              <span className="loading-text relative inline-block text-sm font-medium tracking-wide text-neutral-600/70">
                Chargement
                <span className="sweep-light" aria-hidden="true" />
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
