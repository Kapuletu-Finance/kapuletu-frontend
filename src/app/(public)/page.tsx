import { AboutUsSection } from "@/features/landing/components/AboutUsSection";
import { CtaSection } from "@/features/landing/components/CtaSection";
import { FaqsSection } from "@/features/landing/components/FaqsSection";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { HowItWorksSection } from "@/features/landing/components/HowItWorksSection";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingHeader } from "@/features/landing/components/LandingHeader";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center">
        <HeroSection />
        <AboutUsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FaqsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Home;
