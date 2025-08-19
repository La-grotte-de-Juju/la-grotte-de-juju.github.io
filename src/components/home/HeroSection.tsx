"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion"; // framer uniquement pour le bouton interactif / loader
import Image from "next/image";

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoElement, setVideoElement] = useState<JSX.Element | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false); // pour déclencher les animations après hydration

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handlePlayClick = () => {
    if (!videoElement) {
      setIsVideoLoading(true);
      setVideoElement(
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          preload="auto"
          onLoadStart={() => setIsVideoLoading(true)}
          onCanPlay={() => {
            setIsVideoLoading(false);
            if (videoRef.current) {
              videoRef.current.play();
              setIsPlaying(true);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        >
          <source src="/images/headervideo/header.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      );
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playButtonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      boxShadow: "0px 0px 20px rgba(255, 133, 241, 0.7)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
      },
    },
  };
  // Génération style inline pour delays (si mounted)
  const delay = (ms:number): React.CSSProperties => mounted ? { animationDelay: ms + 'ms' } : {};

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden bg-center bg-cover bg-hero-pattern">
  <div className="absolute inset-0 bg-black/70 backdrop-blur-[6px]" />
      <div className="relative z-10 container px-4 md:px-6 text-center text-white">
        <h1
          className={`hero-fade-item text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none title-font mb-6 ${mounted ? 'is-visible' : ''}`}
          style={delay(40)}
        >
          Bienvenue dans <br />
          <span
            className={`relative inline-block hero-fade-item ${mounted ? 'is-visible' : ''}`}
            style={delay(140)}
          >
            <span
              className="absolute inset-0 blur-lg bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient"
              aria-hidden="true"
            >
              La Grotte de Juju
            </span>
            <span className="relative z-10 bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient">
              La Grotte de Juju
            </span>
          </span>
        </h1>

        <p
          className={`hero-fade-item max-w-[700px] mx-auto text-base md:text-lg mb-8 ${mounted ? 'is-visible' : ''}`}
          style={delay(240)}
        >
          Ici, tu pourras rester au courant des nouveautés de la chaîne, qu'il s'agisse des dernières vidéos, des créations en cours ou de l'univers qui prend forme peu à peu ! Tu auras même la chance de lire des bandes dessinées mettant en scène tes personnages préférés.
        </p>

        <div
          className={`hero-fade-item w-full max-w-2xl mx-auto mt-8 rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 bg-white/10 backdrop-blur-xl ${mounted ? 'is-visible' : ''}`}
          style={delay(340)}
        >
          <div className="bg-transparent px-6 py-3 flex items-center justify-center relative">
            <div className="absolute left-6 flex items-center space-x-2">
              <span className="w-3 h-3 bg-[#FF605C] rounded-full"></span>
              <span className="w-3 h-3 bg-[#FFBD44] rounded-full"></span>
              <span className="w-3 h-3 bg-[#00CA4E] rounded-full"></span>
            </div>
            <div className="text-xs font-medium text-white/70">La Grotte de Juju</div>
          </div>

          <div className="aspect-video relative rounded-b-3xl overflow-hidden">
            {!isPlaying && (
              <div className="absolute inset-0 z-10">
                <Image
                  src="/images/headervideo/thumbnail.webp"
                  alt="Aperçu vidéo"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                  <motion.button
                    onClick={handlePlayClick}
                    className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg"
                    variants={{
                      initial: { scale: 1 },
                      hover: {
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        },
                      },
                      tap: {
                        scale: 0.95,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        },
                      },
                    }}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Lancer la vidéo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-10 h-10 ml-1.5"
                    >
                      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                    </svg>
                  </motion.button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent py-4 px-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                    </svg>
                  </div>
                  <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-white rounded-full"></div>
                  </div>
                  <div className="text-xs text-white/80 font-medium">0:00</div>
                </div>
              </div>
            )}

            {isVideoLoading && (
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <motion.p
                    className="text-white text-sm font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.2, duration: 0.3 },
                    }}
                  >
                    Chargement...
                  </motion.p>
                </div>
              </motion.div>
            )}

            {videoElement}
          </div>
        </div>
      </div>
      <style jsx>{`
        .hero-fade-item {
          opacity: 0;
          transform: translateY(20px) scale(.988);
          filter: blur(2px);
        }
        .hero-fade-item.is-visible {
          animation: heroFadeLift .65s cubic-bezier(.25,.1,.25,1) forwards;
        }
        @keyframes heroFadeLift {
          0% { opacity:0; transform:translateY(20px) scale(.988); filter:blur(2px); }
          40% { opacity:1; filter:blur(0.6px); }
          100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-fade-item, .hero-fade-item.is-visible { animation:none!important; opacity:1!important; transform:none!important; filter:none!important; }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
