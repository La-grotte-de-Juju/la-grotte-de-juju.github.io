"use client";

import Image from 'next/image';
import { memo, useMemo, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogUnifiedItem } from '@/data/remote-blog';
import { Video, Megaphone, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogUnifiedItem;
  index: number;
  onSelect?: (post: BlogUnifiedItem) => void;
  disableScrollAnimation?: boolean;
}

export const BlogCard = memo(function BlogCard({ post, index, onSelect, disableScrollAnimation = false }: BlogCardProps) {
  const date = new Date(post.date);
  const formatted = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  const shadowBase = '0 2px 6px -2px rgba(0,0,0,0.08), 0 1px 3px -1px rgba(0,0,0,0.04)';
  const shadowHover = '0 6px 22px -6px rgba(0,0,0,0.18), 0 3px 10px -3px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.05)';

  const KindIcon = useMemo(() => post.kind === 'nouvelle_video' ? Video : Megaphone, [post.kind]);

  const [sweeping, setSweeping] = useState(false);
  const [sweepKey, setSweepKey] = useState(0); // force reflow pour relancer l’anim
  const sweepTimeoutRef = useRef<number | null>(null);
  const SWEEP_DURATION = 250; // ms (doit correspondre à tailwind config)

  function triggerSweep() {
  if (sweeping) return;
    setSweeping(true);
    setSweepKey(k => k + 1);
    if (sweepTimeoutRef.current) cancelAnimationFrame(sweepTimeoutRef.current);
    sweepTimeoutRef.current = window.setTimeout(() => {
      setSweeping(false);
    }, SWEEP_DURATION) as unknown as number;
  }

  useEffect(() => () => { if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current); }, []);
  return (
    <motion.article
      layout="position"
      onClick={() => onSelect?.(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(e)=> { if(e.key==='Enter') onSelect?.(post); }}
      initial={false}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.985 }}
      style={{ boxShadow: shadowBase, WebkitTapHighlightColor:'transparent', minHeight: '430px' }}
      onMouseEnter={(e)=> { (e.currentTarget as HTMLElement).style.boxShadow = shadowHover; triggerSweep(); }}
      onMouseLeave={(e)=> { (e.currentTarget as HTMLElement).style.boxShadow = shadowBase; }}
      className="group relative rounded-3xl overflow-hidden bg-card/70 border border-border/50 transition-[box-shadow,transform] duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 select-none flex flex-col h-full"
    >
      {/* Halo doux réduit */}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl">
        <div className="absolute -inset-px rounded-[inherit] bg-gradient-to-br from-primary/25 via-fuchsia-400/10 to-transparent opacity-0 group-hover:opacity-70 transition duration-500" />
      </div>

      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        {post.cover && (
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority={index < 3}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          />
        )}
        {/* Ambient light vignette + glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 group-hover:opacity-55 transition" />
          <div className="absolute -inset-6 bg-[radial-gradient(circle_at_60%_55%,rgba(255,255,255,0.35),transparent_60%)] opacity-0 group-hover:opacity-70 mix-blend-overlay transition duration-700" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_45%,rgba(255,255,255,0.12),transparent_55%)] opacity-0 group-hover:opacity-90 blur-xl transition duration-700" />
        </div>
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-black/55 backdrop-blur-sm text-white/90">
          <KindIcon className="w-3.5 h-3.5" /> {post.kind==='nouvelle_video' ? 'Vidéo' : 'Annonce'}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4 flex flex-col flex-1 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg md:text-xl font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {post.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <time className="text-[11px] text-muted-foreground flex items-center gap-1 before:content-['•'] before:text-xs before:opacity-40 before:mr-2 before:hidden sm:before:inline">{formatted}</time>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
          {post.description}
        </p>

  <div className="flex items-center justify-end pt-1 mt-2">
          <motion.span
            layout
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary relative"
            initial={false}
            whileHover="hover"
          >
            <span>Lire</span>
            <motion.span
              variants={{ hover: { x: 4 } }}
              transition={{ type:'spring', stiffness:260, damping:18 }}
              className="flex"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </motion.span>
        </div>
      </div>

      {/* Light sweep discret */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Light sweep élargi pour éviter la coupure visible sur les bords */}
        <div
          key={sweepKey}
          className={`absolute left-[-60%] w-[75%] h-[170%] -top-[35%] rotate-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 will-change-transform [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] [animation-fill-mode:both] pointer-events-none ${sweeping ? 'animate-card-sweep' : ''}`}
        />
      </div>
  </motion.article>
  );
});
