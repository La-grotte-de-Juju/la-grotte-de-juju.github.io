"use client";

import RootLayout from "@/components/layout/RootLayout";
import LoadingScreen from "@/components/layout/LoadingScreen";
import PageTransition from "@/components/animation/PageTransition";
import { usePathname } from "next/navigation";
import { DevNotification } from "@/components/ui/dev-notification";
import CustomScrollbar from "@/components/ui/CustomScrollbar"; // Import du composant
import { AnimationProvider, useAnimationContext } from "@/components/layout/AnimationProvider";
import { useEffect, useRef, useState } from "react";

function BodyContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { animationsReady, setAnimationsReady, resetAnimations } = useAnimationContext();
  const [showLoader, setShowLoader] = useState(true);
  const firstPathRef = useRef<string | null>(null);

  useEffect(() => {
    const finish = () => setShowLoader(false);
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    const fallback = setTimeout(finish, 5000);
    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (firstPathRef.current === null) {
      firstPathRef.current = pathname;
      return;
    }
    resetAnimations();
    setShowLoader(true);
    const readyTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 400);
    return () => clearTimeout(readyTimeout);
  }, [pathname, resetAnimations]);

  const handleLoaderFinished = () => {
    // Laisse un très léger délai pour que le DOM du loader soit retiré avant lancement animations
    requestAnimationFrame(() => {
      setTimeout(() => setAnimationsReady(true), 40);
    });
  };

  // Fallback: si pour une raison le loader resterait affiché >6s, forcer
  useEffect(() => {
    const force = setTimeout(() => {
      setAnimationsReady(true);
      setShowLoader(false);
    }, 6000);
    return () => clearTimeout(force);
  }, [setAnimationsReady]);

  return (
    <>
      <LoadingScreen show={showLoader} onFinished={handleLoaderFinished} />
      <div className={showLoader ? "opacity-0" : "opacity-100 transition-opacity duration-300"}>
        <RootLayout>
          <PageTransition key={pathname} animationsReady={animationsReady}>
            <main className="flex-grow">{children}</main>
          </PageTransition>
        </RootLayout>
        <DevNotification />
        <CustomScrollbar />
      </div>
    </>
  );
}

export default function ClientBody({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Tolère éventuel trailing slash ou sous-segments (ex: /fiches-personnages?x=1)
  const isFichesPersos = pathname?.startsWith("/fiches-personnages");
  const bodyClass = isFichesPersos
    ? "antialiased min-h-screen bg-white fiche-persos-page"
    : "antialiased min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-gray-800";

  return (
    <body
      className={bodyClass}
      // style inline pour écraser toute image de fond provenant de classes utilitaires si page fiches persos
      style={isFichesPersos ? { backgroundColor: '#ffffff', backgroundImage: 'none' } : undefined}
      suppressHydrationWarning
    >
      <AnimationProvider>
        <BodyContent>{children}</BodyContent>
      </AnimationProvider>
    </body>
  );
}
