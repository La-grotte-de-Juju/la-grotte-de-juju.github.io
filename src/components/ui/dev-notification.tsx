"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const SITE_VERSION = "testchannel-verbêta-1.10.0";
const DEV_TITLE = "Site en développement";
const DEV_MESSAGE = "Ce site peut contenir des bugs, des fonctionnalités manquantes, etc.";

const devImages = [
  "/images/dev img/1.webp",
  "/images/dev img/2.webp",
  "/images/dev img/3.webp",
  "/images/dev img/4.webp",
  "/images/dev img/5.webp",
  "/images/dev img/6.webp",
  "/images/dev img/indev.webp",
];

const getRandomDevImage = () => {
  const randomIndex = Math.floor(Math.random() * devImages.length);
  return devImages[randomIndex];
};

const devCardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
  exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
};

export function DevNotification() {
  const [showCard, setShowCard] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setShowCard(true);
    setIsClosing(false);
    setCurrentImage(getRandomDevImage());
  }, [pathname]);

  const dismissCard = () => {
    setIsClosing(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setShowCard(false);
      setIsClosing(false);
    }, 300);
  };

  const reportBug = () => {
    if (typeof window !== 'undefined') {
      window.open('https://form.typeform.com/to/DEoa7nkM', '_blank');
    }
  };

  return (
    <AnimatePresence>
      {showCard && currentImage && (
        <motion.div
          className="fixed bottom-5 right-5 z-[200] w-96 max-w-[calc(100vw-40px)] rounded-xl overflow-hidden tinted-surface"
          initial="hidden"
          animate={isClosing ? "exit" : "visible"}
          exit="exit"
          variants={devCardVariants}
          key={`dev-notification-${pathname}`}
        >
          <div className="relative h-40 w-full">
            <Image
              src={currentImage}
              alt="Image de développement aléatoire"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-5">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{DEV_TITLE}</h3>
            </div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-orange-600 dark:text-orange-400">Attention :</span> {DEV_MESSAGE}
            </p>
            
            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400">
              <p>Version du site : {SITE_VERSION}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <motion.div
                whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                whileTap={{ scale: 0.90, transition: { type: "spring", stiffness: 350, damping: 10 } }}
              >
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={reportBug}
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Signaler un bug
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                whileTap={{ scale: 0.90, transition: { type: "spring", stiffness: 350, damping: 10 } }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={dismissCard}
                >
                  Fermer
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
