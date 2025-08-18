import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import LatestVideosSection from "@/components/home/LatestVideosSection";
import FaqSection from "@/components/home/FaqSection";
import ScrollToTopOnLoad from "@/components/utility/ScrollToTopOnLoad";

export default function Home() {
  return (
    <>
  <ScrollToTopOnLoad />
      <HeroSection />
      <FeaturedSection />
      <FaqSection />
    </>
  );
}
