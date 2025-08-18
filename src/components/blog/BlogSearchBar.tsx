"use client";

import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface BlogSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onReset?: () => void;
}

/* Nouvelle architecture ultra stable:
   - Conteneur flex items-center h-12 (fixe) -> aucune variation de hauteur.
   - Icône & bouton clear en flex-none, input en flex-1 min-w-0.
   - Pas de calques décoratifs susceptibles de provoquer reflow.
   - Aucun wrap: whitespace-nowrap + overflow-hidden contrôlé.
   - Label visuel supprimé (demande utilisateur). Accessibilité via aria-label.
   - Animation d'apparition douce seulement (opacité / légère translation verticale) sans blur.
*/
export function BlogSearchBar({ value, onChange, placeholder = 'Rechercher…', onReset }: BlogSearchBarProps) {
  const controls = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { controls.start({ opacity: 1, y: 0 }); }, [controls]);

  // Raccourcis clavier conservés (/ et Cmd+K, Esc pour effacer) sans interférer layout
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) { e.preventDefault(); inputRef.current?.focus(); }
      else if (e.metaKey && e.key.toLowerCase() === 'k') { e.preventDefault(); inputRef.current?.focus(); }
      else if (e.key === 'Escape' && document.activeElement === inputRef.current) { if (value) { onChange(''); onReset?.(); } else (document.activeElement as HTMLElement)?.blur(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [value, onChange, onReset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={controls}
      transition={{ type: 'spring', stiffness: 170, damping: 22 }}
      className="w-full"
    >
      <div className="relative w-full max-w-2xl">
        <div className="flex items-center h-12 rounded-full bg-muted/35 dark:bg-muted/25 border border-border/60 focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/20 transition px-4 gap-3 overflow-hidden whitespace-nowrap">
          <Search className="w-5 h-5 text-muted-foreground flex-none" aria-hidden />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label="Recherche articles"
            autoComplete="off"
            inputMode="search"
            className="flex-1 min-w-0 bg-transparent text-sm md:text-base outline-none placeholder:text-muted-foreground/55 leading-none"
          />
          {value && (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => { onChange(''); onReset?.(); inputRef.current?.focus(); }}
              className="flex-none text-muted-foreground hover:text-foreground active:scale-95 transition inline-flex items-center justify-center rounded-full h-7 w-7 hover:bg-muted/60"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
