import HomeHeroSection from "@/components/HomeHeroSection";
import HomeFeatureSection from "@/components/HomeFeatureSection";
import HomeAboutSection from "@/components/HomeAboutSection";

export default function Home() {
  return (
    <div className="flex flex-col space-y-16">
      <HomeHeroSection />
      <HomeFeatureSection />
      <HomeAboutSection />
    </div>
  );
}
