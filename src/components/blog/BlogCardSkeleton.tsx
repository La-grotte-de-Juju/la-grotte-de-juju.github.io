"use client";
import { memo } from 'react';
import { motion } from 'framer-motion';

export const BlogCardSkeleton = memo(function BlogCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.95 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.35, ease:[0.4,0,0.2,1] }}
      className="relative rounded-3xl overflow-hidden bg-card/60 border border-border/50 flex flex-col select-none h-full min-h-[430px]"
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="w-full h-full bg-muted/50" />
        <Shimmer />
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="h-4 rounded bg-muted/50 w-3/4 relative overflow-hidden"><Shimmer /></div>
        <div className="h-3 rounded bg-muted/40 w-1/3 relative overflow-hidden"><Shimmer /></div>
        <div className="space-y-2 mt-2">
          <div className="h-3 rounded bg-muted/40 w-full relative overflow-hidden"><Shimmer /></div>
          <div className="h-3 rounded bg-muted/40 w-[92%] relative overflow-hidden"><Shimmer /></div>
          <div className="h-3 rounded bg-muted/40 w-2/3 relative overflow-hidden"><Shimmer /></div>
        </div>
        <div className="mt-auto flex justify-end pt-4">
          <div className="h-3 rounded bg-muted/40 w-16 relative overflow-hidden"><Shimmer /></div>
        </div>
      </div>
    </motion.div>
  );
});

function Shimmer(){
  return (
    <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black,black,transparent)]" />
  );
}

