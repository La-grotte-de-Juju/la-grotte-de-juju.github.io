'use client';

import Link from 'next/link';
import { Home, AlertTriangle, MapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/animation/PageTransition';

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 150,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 1,
      },
      filter: "drop-shadow(0 0 0px rgba(250, 204, 21, 0))",
    },
  };

  const revisedIconVariants = {
    hidden: { opacity: 0, scale: 0.5, filter: "drop-shadow(0 0 0px rgba(250, 204, 21, 0))" },
    visible: {
      opacity: 1,
      scale: [1, 1.1, 1],
      filter: [
        "drop-shadow(0 0 0px rgba(250, 204, 21, 0))",
        "drop-shadow(0 0 25px rgba(250, 204, 21, 0.85))",
        "drop-shadow(0 0 0px rgba(250, 204, 21, 0))",
      ],
      transition: {
        scale: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        filter: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <PageTransition>
  {/* Retrait du fond blanc pour laisser voir le dégradé global */}
  <div className="flex flex-col min-h-screen text-slate-800 items-center justify-center">
        <main className="flex flex-grow flex-col items-center justify-center text-center px-4 py-16 md:py-24">
          <motion.div
            className="max-w-lg w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={revisedIconVariants} className="mb-8 flex justify-center">
              <AlertTriangle className="w-24 h-24 text-yellow-500" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold mb-6 text-purple-600"
            >
              404
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold mb-6 text-slate-700"
            >
              Oops! Page non trouvée.
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 mb-8 leading-relaxed"
            >
              Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
              Peut-être que vous vous êtes égaré dans les méandres de la grotte ?
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <Link href="/" legacyBehavior>
                <a className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 w-full md:w-auto">
                  <Home className="w-5 h-5 mr-3" />
                  Retourner à l'accueil
                </a>
              </Link>
              <Link href="/map" legacyBehavior> 
                <a className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transform hover:scale-105 w-full md:w-auto">
                  <MapIcon className="w-5 h-5 mr-3" />
                  Carte de la grotte
                </a>
              </Link>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
