import { Metadata } from "next";
import FanArtGallery from "@/components/fanart/FanArtGallery";
import PageTransition from "@/components/animation/PageTransition";
import AnimateOnScroll from "@/components/animation/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Fan Arts | La Grotte de Juju",
  description: "Découvrez les meilleurs fan arts de la communauté de La Grotte de Juju",
};

export default function FanArtPage() {
  return (
    <PageTransition>
      <div className="container max-w-7xl mx-auto pt-28 md:pt-32 pb-8 md:pb-12 px-4 sm:px-6">
        <AnimateOnScroll animation="glass-morph" duration={1.0}>
          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Les Fan Arts de la grotte de <br />
              {' '}
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 blur-lg bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient"
                  aria-hidden="true"
                >
                  Juju
                </span>
                <span className="relative z-10 bg-apple-gradient from-apple-blue via-apple-purple to-apple-orange bg-[length:200%_auto] bg-clip-text text-transparent animate-apple-gradient">
                  Juju
                </span>
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              Découvrez les créations incroyables de la communauté de La Grotte de Juju.
            </p>
          </div>
        </AnimateOnScroll>
        
        <AnimateOnScroll animation="floating-card" delay={0.3}>
          <FanArtGallery />
        </AnimateOnScroll>
      </div>
    </PageTransition>
  );
}
