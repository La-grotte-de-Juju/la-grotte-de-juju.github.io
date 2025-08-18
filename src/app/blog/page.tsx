"use client";

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';
import AnimateOnScroll from '@/components/animation/AnimateOnScroll';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Calendar, ExternalLink, PlayCircle, Megaphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogSearchBar } from '@/components/blog/BlogSearchBar';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCardSkeleton } from '@/components/blog/BlogCardSkeleton';
import { getBlogDataCached, BlogUnifiedItem } from '@/data/remote-blog';
import { Portal } from '@/components/utility/Portal';

export default function BlogPage() {
  // State
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<BlogUnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterKinds, setFilterKinds] = useState<Set<string>>(new Set()); // 'annonce' | 'nouvelle_video'
  const [visibleCount, setVisibleCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Chargement initial
  // Initial fetch
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBlogDataCached();
        if (!alive) return;
        setItems(data);
      } catch (e: unknown) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Erreur de chargement');
  } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  // Derived filtered list
  const { visibleItems, total } = useMemo(() => {
    const base = items;
    const q = query.trim().toLowerCase();
    const kindFiltered = filterKinds.size === 0 ? base : base.filter(p => filterKinds.has(p.kind));
    if (!q) return { visibleItems: kindFiltered, total: kindFiltered.length };
    const filtered = kindFiltered.filter(p => [p.title, p.description, p.author, p.rawTitle].some(f => f.toLowerCase().includes(q)));
    return { visibleItems: filtered, total: filtered.length };
  }, [query, items, filterKinds]);
  const currentItems = (!query.trim() && visibleItems.length === 0) ? items : visibleItems;
  const displayedItems = currentItems.slice(0, visibleCount);

  // Reset pagination when filters / query change
  useEffect(() => {
    setVisibleCount(12);
  }, [query, filterKinds, items]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver(entries => {
      const first = entries[0];
      if (first.isIntersecting) {
        setVisibleCount(c => c < currentItems.length ? Math.min(c + 9, currentItems.length) : c);
      }
    }, { rootMargin: '250px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [currentItems.length]);

  useEffect(() => {
    if (selected) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = prev; };
    }
  }, [selected]);

  return (
    <div className="relative pb-28">
      {/* Dégradés retirés selon demande utilisateur */}

      {/* HERO */}
  <div className="container relative px-4 md:px-6 pt-20 md:pt-28">
        <AnimateOnScroll animation="crystal-emerge" delay={0.04}>
          <motion.header
            initial={{ opacity:0, y:14 }}
            animate={{ opacity:1, y:0 }}
            transition={{ type:'spring', stiffness:120, damping:20 }}
            className="mx-auto max-w-3xl text-center mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-800 dark:text-white pb-1">
              Le Blog de{' '}
              <span className="relative inline-block">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 blur-lg bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient"
                >
                  La Grotte
                </span>
                <span className="relative z-10 bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient">
                  La Grotte
                </span>
              </span>
            </h1>
            <p className="mt-5 text-muted-foreground md:text-lg leading-relaxed">
              Vidéos, annonces, making-of & anecdotes. Explore les nouveautés de l'univers avec une interface plus claire.
            </p>
          </motion.header>
        </AnimateOnScroll>
      </div>

  {/* BARRE OUTILS STICKY (décalée sous la navbar pour éviter chevauchement) */}
  <div className="sticky top-[var(--navbar-height,4rem)] z-40 backdrop-blur-sm supports-[backdrop-filter]:bg-transparent bg-transparent">
    <div className="container px-4 md:px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <div className="flex-1 min-w-[240px]">
            <BlogSearchBar value={query} onChange={setQuery} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSegment
              active={filterKinds.has('nouvelle_video')}
              label="Vidéos"
              color="pink"
              onClick={() => toggleKind('nouvelle_video', filterKinds, setFilterKinds)}
            />
            <FilterSegment
              active={filterKinds.has('annonce')}
              label="Annonces"
              color="blue"
              onClick={() => toggleKind('annonce', filterKinds, setFilterKinds)}
            />
            {filterKinds.size>0 && (
              <button
                type="button"
                onClick={()=> setFilterKinds(new Set())}
                className="relative h-8 px-4 inline-flex items-center rounded-full border text-[12px] font-medium tracking-wide transition bg-background/70 backdrop-blur-sm hover:border-foreground/30 hover:text-foreground border-border/60 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 data-[active=true]:bg-foreground/10"
              >
                Tout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LISTE */}
      <div className="container px-4 md:px-6 mt-12">
        <motion.div 
          layout 
          className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3" 
          initial={false}
          // Re-stagger subtil lorsque la requête ou les filtres changent
          animate={{ opacity:1 }}
          transition={{ staggerChildren: query || filterKinds.size>0 ? 0.035 : 0.02, when:'beforeChildren' }}
          key={/* force légère relance des animations d'entrée seulement pour les nouveaux éléments */ undefined}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {(!loading ? displayedItems : []).map((p,i) => (
              <motion.div
                key={p.id}
                layout
                variants={{
                  initial: { opacity:0, scale:0.88, y:18, filter:'blur(6px)' },
                  in: { opacity:1, scale:1, y:0, filter:'blur(0px)' },
                  out: { opacity:0, scale:0.8, y:-14, filter:'blur(8px)' }
                }}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ duration:0.28, ease:[0.4,0,0.2,1] }}
              >
                <BlogCard 
                  post={p}
                  index={i}
                  onSelect={(post)=> setSelected(post.id)}
                  disableScrollAnimation={!!query.trim()}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Sentinel & skeleton loader for pagination */}
          {!loading && displayedItems.length < currentItems.length && (
            <div ref={sentinelRef} className="col-span-full flex items-center justify-center py-8 opacity-70 text-[11px] tracking-wide text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Chargement...
              </span>
            </div>
          )}
          {loading && Array.from({ length: 6 }).map((_,i)=> (
            <BlogCardSkeleton key={i} />
          ))}
          {!loading && currentItems.length === 0 && !query.trim() && !error && (
            <EmptyState key="empty-none" title="Rien pour l'instant" desc="Les premières publications arrivent bientôt." />
          )}
          {!loading && currentItems.length === 0 && !!query.trim() && !error && (
            <EmptyState key="empty-search" title="Aucun résultat" desc="Ajuste ta recherche ou réinitialise les filtres." />
          )}
          {!loading && error && (
            <ErrorState message={error} onRetry={async ()=> {
              try {
                setLoading(true);
                const data = await getBlogDataCached();
                setItems(data);
                setError(null);
              } catch(e) { /* noop */ } finally { setLoading(false); }
            }} />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
          {selected && (() => {
            const post = items.find(p => p.id === selected);
            if(!post) return null;
            const date = new Date(post.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric'});
            return (
              <Portal>
                <motion.div
                  key="overlay"
                  className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 bg-background/70 backdrop-blur-sm"
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  exit={{ opacity:0, transition:{ duration:0.25 } }}
                  onClick={()=> setSelected(null)}
                >
                  <motion.div
                    role="dialog" aria-modal="true" aria-label={post.title}
                    className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-background/95 backdrop-blur-xl border border-border/60 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] flex flex-col"
                    initial={{ y:32, scale:0.9, opacity:0, filter:'blur(8px)', clipPath:'inset(0% 0% 0% 0% round 24px)' }}
                    animate={{ y:0, scale:1, opacity:1, filter:'blur(0px)', clipPath:'inset(0% 0% 0% 0% round 24px)' }}
                    exit={{ y:10, scale:0.88, opacity:0, filter:'blur(10px)', clipPath:'inset(40% 40% 40% 40% round 24px)' }}
                    transition={{ type:'spring', stiffness:240, damping:30, mass:0.9 }}
                    onClick={(e)=> e.stopPropagation()}
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      {post.cover && (
                        <img src={post.cover} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${post.kind==='nouvelle_video' ? 'bg-pink-500/70 text-white' : 'bg-blue-600/70 text-white'}`}>{post.kind==='nouvelle_video' ? <><PlayCircle className="w-3.5 h-3.5"/>Vidéo</> : <><Megaphone className="w-3.5 h-3.5"/>Annonce</>}</span>
                        <time className="flex items-center gap-1 text-[11px] text-white/90 bg-black/40 px-2 py-0.5 rounded-md"><Calendar className="w-3.5 h-3.5"/>{date}</time>
                      </div>
                      <button onClick={()=> setSelected(null)} aria-label="Fermer" className="absolute top-2 right-2 text-white/90 hover:text-white bg-black/45 hover:bg-black/65 rounded-full h-9 w-9 flex items-center justify-center transition">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-6 pb-5 overflow-y-auto custom-scrollbar flex-1">
                      <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Message de {post.author}</div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">{post.title}</h2>
                      <div className="space-y-4 text-sm leading-relaxed">
                        {post.description.split(/\n+/).map((para,i)=> (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                      {/* Attachements images */}
                      {/* Séparer les attachments en images et liens */}
                      {(() => {
                        if (!post.attachments || post.attachments.length === 0) return null;
                        const isImageLike = (raw: string) => {
                          try {
                            const u = new URL(raw);
                            const p = u.pathname.toLowerCase();
                            if (/(\.)(jpe?g|png|webp|gif|avif|svg)$/.test(p)) return true;
                            if (u.hostname.toLowerCase().includes('ytimg.com')) return true;
                            return false;
                          } catch { return false; }
                        };
                        const imageAttachments = post.attachments.filter(isImageLike);
                        if (imageAttachments.length === 0) return null;
                        return (
                          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {imageAttachments.map((att,i)=> (
                              <a key={i} href={att} target="_blank" rel="noopener noreferrer" className="group relative aspect-video rounded-lg overflow-hidden border border-border/40 hover:border-primary/50 transition bg-muted/30">
                                <img src={att} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform" onError={(e)=> { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
                              </a>
                            ))}
                          </div>
                        );
                      })()}
                      {/* Liens externes / vidéo */}
                      {(post.videoUrl || (post.externalLinks && post.externalLinks.length>0) || (post.attachments && post.attachments.length>0)) && (() => {
                        // Filtrer doublons + liens image (extensions + heuristique domaines CDN) pour éviter qu'ils deviennent des boutons
                        const isImageLike = (raw: string) => {
                          try {
                            const u = new URL(raw);
                            const p = u.pathname.toLowerCase();
                            if (/(\.)(jpe?g|png|webp|gif|avif|svg)$/.test(p)) return true;
                            // Certains liens Discord ou ytimg sont images même sans extension explicite (rare)
                            const host = u.hostname.toLowerCase();
                            if (host.includes('ytimg.com')) return true;
                            return false;
                          } catch { return false; }
                        };
                        const attachmentNonImages = (post.attachments||[]).filter(a => !isImageLike(a));
                        const baseLinks = [
                          ...(post.externalLinks || []),
                          ...attachmentNonImages,
                        ].filter(l => !isImageLike(l));
                        const uniqueLinks = baseLinks.filter((u,i,a)=> a.indexOf(u)===i);
                        const cleanLinks = uniqueLinks; // plus besoin d'exclure car on a filtré images
                        const labelFromUrl = (raw: string) => {
                          try {
                            const { hostname } = new URL(raw);
                            const base = hostname.replace(/^www\./,'');
                            if (base === 'youtube.com' || base === 'youtu.be') return 'YouTube';
                            if (base === 'discord.com' || base === 'discord.gg') return 'Discord';
                            return base;
                          } catch { return 'Lien'; }
                        };
                        if (!post.videoUrl && cleanLinks.length === 0) return null;
                        return (
                          <div className="mt-8">
                            <div className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground mb-3 flex items-center gap-2">
                              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                              Ressources
                              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {post.videoUrl && (
                                <a
                                  href={post.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/55 p-4 flex flex-col gap-2 transition shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 overflow-hidden"
                                >
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-pink-600/15 text-pink-600 dark:text-pink-400 border border-pink-600/20">
                                      <PlayCircle className="w-4 h-4" />
                                    </span>
                                    <span className="truncate">Voir la vidéo</span>
                                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                                      YouTube
                                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                                    </span>
                                  </div>
                                  {/* Accent sobre underline animé (texte retiré) */}
                                  <span aria-hidden className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500" />
                                </a>
                              )}
                              {cleanLinks.map((l,i)=> (
                                <a
                                  key={i}
                                  href={l}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group relative rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/55 p-4 flex flex-col gap-2 transition shadow-sm hover:shadow-md overflow-hidden"
                                >
                                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground/90">
                                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" /> {labelFromUrl(l)}
                                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 break-all">{l.replace(/^https?:\/\//,'')}</p>
                                  <span aria-hidden className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition">
                                    <span className="absolute top-0 left-[-55%] h-full w-[60%] rotate-[20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-0 group-hover:translate-x-[250%] transition-transform duration-[1200ms] ease-out" />
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-3 flex justify-end gap-3 border-t border-border/40 bg-background/85 backdrop-blur-sm">
                      <Button variant="outline" size="sm" onClick={()=> setSelected(null)}>Fermer</Button>
                    </div>
                  </motion.div>
                </motion.div>
              </Portal>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}

// --- UI petits composants ---
function FilterSegment({ active, label, onClick, color }: { active: boolean; label: string; onClick: () => void; color: 'pink'|'blue' }) {
  const base = color === 'pink'
    ? 'data-[active=true]:bg-pink-500/15 data-[active=true]:text-pink-600 dark:data-[active=true]:text-pink-400 data-[active=true]:border-pink-500/40'
    : 'data-[active=true]:bg-blue-500/15 data-[active=true]:text-blue-600 dark:data-[active=true]:text-blue-400 data-[active=true]:border-blue-500/40';
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={`relative h-8 px-4 inline-flex items-center rounded-full border text-[12px] font-medium tracking-wide transition bg-background/60 backdrop-blur-sm hover:border-foreground/30 hover:text-foreground border-border/60 text-muted-foreground ${base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}>
      <span className="relative z-10">{label}</span>
      {active && <span aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />}
    </button>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-6 }}
      className="col-span-full rounded-2xl border border-dashed border-border/60 p-14 text-center bg-muted/20 backdrop-blur-sm"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-6 }}
      className="col-span-full rounded-2xl border border-destructive/40 p-10 text-center bg-destructive/5"
    >
      <h3 className="text-base font-semibold mb-2 text-destructive">Erreur</h3>
      <p className="text-sm text-muted-foreground mb-5">{message}</p>
      <Button size="sm" variant="outline" onClick={onRetry}>Réessayer</Button>
    </motion.div>
  );
}

function toggleKind(id: string, set: Set<string>, setter: (v: Set<string>)=> void) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id); else next.add(id);
  setter(next);
}
