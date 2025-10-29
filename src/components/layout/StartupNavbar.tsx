"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Menu as MenuIcon, X, Image as ImageIcon, BookText, Lightbulb, LibraryBig } from 'lucide-react';
import AnimatedGlobeIcon from '@/components/ui/AnimatedGlobeIcon';
import { motion, AnimatePresence, MotionStyle } from 'framer-motion';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const StartupNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 50, 1);
      setScrollProgress(progress);
      setIsScrolled(progress > 0.8);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 100);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
  setIsMobile(window.innerWidth < 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open-blur');
    } else {
      document.body.classList.remove('menu-open-blur');
    }
    return () => {
      document.body.classList.remove('menu-open-blur');
    };
  }, [isMenuOpen]);

  const navVariants = {
    hidden: { y: -12, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" }
    }
  };

  const linkVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05, 
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      } 
    },
    tap: { scale: 0.95 }
  };

  const topSpacing = {
    paddingTop: `${Math.max(0, ((1 - scrollProgress) * 35))}px`,
  };

  const navbarStyle: MotionStyle = {
    padding: `${0.2 + ((1 - scrollProgress) * 0.2)}rem ${1 + ((1 - scrollProgress) * 0.25)}rem`,
    borderRadius: `${(1 - scrollProgress) * 1}rem`,
  width: `${scrollProgress * 100 + (1 - scrollProgress) * (isMobile ? 65 : 38)}%`,
    maxWidth: scrollProgress > 0.9 ? '100%' : `${(1 - scrollProgress) * 48 + 36}rem`,
    backgroundColor: `rgba(255, 255, 255, ${0.70 + scrollProgress * 0.15})`,
    backdropFilter: `blur(${8 + scrollProgress * 4}px)`,
    WebkitBackdropFilter: `blur(${8 + scrollProgress * 4}px)`,
    boxShadow: isScrolled 
      ? '0 1px 3px rgba(0, 0, 0, 0.05)' 
      : '0 4px 12px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.04)',
    transformOrigin: 'top center',
    transform: `scale(${1 - ((1 - scrollProgress) * 0.02)})`,
    position: 'relative' as const,
  };

  useEffect(() => {
    const updateVar = () => {
      if (navbarRef.current) {
        const h = navbarRef.current.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--navbar-height', h + 'px');
      }
    };
    updateVar();
    window.addEventListener('resize', updateVar);
    window.addEventListener('scroll', updateVar, { passive: true });
    return () => {
      window.removeEventListener('resize', updateVar);
      window.removeEventListener('scroll', updateVar);
    };
  }, []);

  return (
    <div
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 flex justify-center z-50 transition-all duration-500 ease-in-out`}
      style={topSpacing}
    >
      <motion.nav
        className={`
          transition-all 
          duration-500
          ease-in-out
          flex items-center
          ${isMounted ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}
          ${isScrolled ? 'border-b border-gray-200/50 dark:border-gray-800/50' : 'border border-gray-200/30 dark:border-gray-800/30'}'
        `}
        initial="hidden"
        animate="visible"
        variants={navVariants}
        style={navbarStyle}
      >
        <div 
          className="container mx-auto transition-all duration-500 ease-in-out"
          style={{
            padding: `0 ${(scrollProgress * 0.5) + 0.25}rem`,
          }}
        >
          <div className="flex items-center justify-between h-full w-full py-1">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-1.5">
                <Link href="/" className="flex items-center space-x-1.5">
                  <Image
                    src="/images/juju-logo.webp"
                    alt="La Grotte de Juju Logo"
                    width={30}
                    height={30}
                    className="rounded-full transition-all hover:shadow-md"
                  />
                  <span className="font-bold text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    La Grotte de Juju
                  </span>
                </Link>
                {/* Icône globe animée complexe (lord-icon) */}
                <Link href="/map" className="inline-flex items-center" aria-label="Carte du site">
                  <motion.span
                    className="ml-1 pl-1 flex items-center"
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <AnimatedGlobeIcon size={20} className="select-none pointer-events-none" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-10">
              <div className="flex items-center space-x-4">
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <HoverCard openDelay={100} closeDelay={50}>
                    <HoverCardTrigger asChild>
                      <button 
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-gray-100/40 dark:hover:bg-gray-800/40 cursor-pointer"
                      >
                        Communauté
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-80 p-4 bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 rounded-lg shadow-xl blur-card-backdrop"
                      sideOffset={25}
                      align="center"
                    >
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Link href="/fan-art" className="flex items-start p-2 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 rounded-md transition-colors">
                            <div className="mr-3 mt-1">
                              <ImageIcon className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">Fan art</div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Retrouve les meilleurs fanart sur l&apos;univers de Juju</p>
                            </div>
                          </Link>
                          
                          <Link href="/fan-fiction" className="flex items-start p-2 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 rounded-md transition-colors">
                            <div className="mr-3 mt-1">
                              <BookText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">Fan fiction</div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Tu veux encore plus de contenu ? découvre le meilleur de la commu</p>
                            </div>
                          </Link>
                          
                          <Link href="/theories" className="flex items-start p-2 hover:bg-gray-100/40 dark:hover:bg-gray-800/40 rounded-md transition-colors">
                            <div className="mr-3 mt-1">
                              <Lightbulb className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">Théories</div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Les meilleurs théories (vrai ou pas on sait pas hein qui sait mmh pas moi en tt cas)</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </motion.div>
                
                <motion.div
                  variants={linkVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    href="/bibliotheque" 
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-gray-100/40 dark:hover:bg-gray-800/40"
                  >
                    Bibliothèque
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center ml-auto">
              <div className="md:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1 h-7 w-7 transition-all"
                      aria-label="Menu"
                    >
                      <motion.div
                        animate={{ rotate: isMenuOpen ? 90 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        {isMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
                      </motion.div>
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    id="mobile-menu-container" 
                    side="right" 
                    className="w-[300px] sm:w-[350px] bg-white/80 dark:bg-black/80 border-l-gray-200/50 dark:border-l-gray-800/50 p-0"
                  >
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        className="absolute top-4 left-4 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-0 h-8 w-8 flex items-center justify-center shadow-lg"
                        aria-label="Fermer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </SheetClose>

                    <SheetHeader className="mb-4 text-left pt-16 pb-2 px-6"> 
                      <SheetTitle>La Grotte de Juju</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col space-y-2 px-6 pb-6">
                      <div className="mb-2">
                        <button 
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2.5 rounded-md text-base font-medium flex items-center transition-all hover:pl-4 w-full text-left"
                        >
                          Communauté
                        </button>
                        <div className="pl-6 mt-1 space-y-1">
                          <SheetClose asChild>
                            <Link 
                              href="/fan-art"
                              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 px-3 py-1.5 rounded-md text-sm flex items-center transition-all hover:pl-4"
                            >
                              <ImageIcon className="h-3.5 w-3.5 mr-2 text-purple-500" /> Fan art
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link 
                              href="/fan-fiction" 
                              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 px-3 py-1.5 rounded-md text-sm flex items-center transition-all hover:pl-4"
                            >
                              <BookText className="h-3.5 w-3.5 mr-2 text-purple-500" /> Fan fiction
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link 
                              href="/theories" 
                              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 px-3 py-1.5 rounded-md text-sm flex items-center transition-all hover:pl-4"
                            >
                              <Lightbulb className="h-3.5 w-3.5 mr-2 text-purple-500" /> Théories
                            </Link>
                          </SheetClose>
                        </div>
                      </div>                      <SheetClose asChild>
                        <Link 
                          href="/bd" 
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2.5 rounded-md text-base font-medium flex items-center transition-all hover:pl-4"
                        >
                          <LibraryBig className="mr-2 h-4 w-4" />
                          Bibliothèque
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          href="/liens" 
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 px-3 py-2.5 rounded-md text-base font-medium flex items-center transition-all hover:pl-4"
                        >
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Liens
                        </Link>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="hidden md:block"
              >
                <Link href="/liens" passHref legacyBehavior>
                  <HoverCard openDelay={100} closeDelay={50}>
                    <HoverCardTrigger asChild>
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-purple-600 hover:!bg-purple-700 text-white text-sm h-8 px-4 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20"
                      >
                        <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
                        Liens
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      className="w-auto p-2 bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-800/50 rounded-lg shadow-xl blur-card-backdrop"
                      sideOffset={25}
                      align="center"
                    >
                      <Link href="/liens" passHref legacyBehavior>
                        <a>
                          <Image
                            src="/images/linkplaceholderfullres.webp"
                            alt="Placeholder Liens"
                            width={300}
                            height={150}
                            className="rounded-md cursor-pointer"
                            priority
                          />
                        </a>
                      </Link>
                    </HoverCardContent>
                  </HoverCard>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default StartupNavbar;
