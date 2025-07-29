'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface BDFolder {
  name: string;
  path: string;
  coverImage?: string;
  pages?: string[];
  description?: string;
  createdAt?: string;
}

interface BDReaderProps {
  folder: BDFolder;
  onBack: () => void;
}

export function BDReader({ folder, onBack }: BDReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (folder.pages) {
      setPages(folder.pages);
      setCurrentPage(0);
    }
    setLoading(false);
  }, [folder.pages]);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement de {folder.name}...</p>
        </div>
      </div>
    );
  }

  if (!pages.length) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold mb-4">BD vide</h2>
          <p className="mb-6">La bande dessinée "{folder.name}" ne contient aucune page.</p>
          <Button onClick={onBack} className="bg-primary hover:bg-primary/90">
            Retour à la bibliothèque
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-white">{folder.name}</h1>
                <p className="text-sm text-gray-400">Page {currentPage + 1} sur {pages.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de lecture */}
      <div className="flex items-center justify-center h-full pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img
              src={pages[currentPage]}
              alt={`Page ${currentPage + 1}`}
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-t border-white/10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-300 px-4 font-medium">
              {currentPage + 1} / {pages.length}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === pages.length - 1}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Barre de progression */}
          <div className="flex-1 mx-8">
            <div className="bg-gray-800/50 rounded-full h-2 relative overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Zones de clic pour navigation */}
      <div 
        className="absolute left-0 top-16 bottom-20 w-1/3 cursor-pointer z-10"
        onClick={goToPreviousPage}
      />
      <div 
        className="absolute right-0 top-16 bottom-20 w-1/3 cursor-pointer z-10"
        onClick={goToNextPage}
      />
    </motion.div>
  );
}
