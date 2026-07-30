import { AboutUsSection } from "@/features/landing-page/components/AboutUsSection";
import { CtaSection } from "@/features/landing-page/components/CtaSection";
import { FaqsSection } from "@/features/landing-page/components/FaqsSection";
import { FeaturesSection } from "@/features/landing-page/components/FeaturesSection";
import { HeroSection } from "@/features/landing-page/components/HeroSection";
import { HowItWorksSection } from "@/features/landing-page/components/HowItWorksSection";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";
import { PricingSection } from "@/features/landing-page/components/PricingSection";

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1 flex flex-col items-center">
        <HeroSection />
        <AboutUsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <FaqsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Home;
