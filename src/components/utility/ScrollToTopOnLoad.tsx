"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Force le scroll en haut lors de l'arrivée sur la page d'accueil (ou lorsqu'on la recharge).
 * Désactive la restauration automatique du scroll pour éviter que le navigateur replace
 * la position précédente après un back/reload.
 */
export default function ScrollToTopOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (pathname === "/") {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    }
  }, [pathname]);

  return null;
}
