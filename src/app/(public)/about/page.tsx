import { AboutCtaSection } from "@/features/landing-page/components/about/AboutCtaSection";
import { AboutHeroSection } from "@/features/landing-page/components/about/AboutHeroSection";
import { CoreValuesSection } from "@/features/landing-page/components/about/CoreValuesSection";
import { MissionVisionSection } from "@/features/landing-page/components/about/MissionVisionSection";
import { OurStorySection } from "@/features/landing-page/components/about/OurStorySection";
import { TeamSection } from "@/features/landing-page/components/about/TeamSection";
import { TheProblemSection } from "@/features/landing-page/components/about/TheProblemSection";
import { TrustAndSecuritySection } from "@/features/landing-page/components/about/TrustAndSecuritySection";
import { LandingFooter } from "@/features/landing-page/components/LandingFooter";
import { LandingHeader } from "@/features/landing-page/components/LandingHeader";

export const metadata = {
  title: "About Us | KapuLetu",
  description:
    "Learn about KapuLetu's mission to bring absolute trust, transparency, and simplicity to community and group finance.",
};

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />

      <main className="flex-1 flex flex-col w-full">
        <AboutHeroSection />
        <TheProblemSection />
        <MissionVisionSection />
        <CoreValuesSection />
        <OurStorySection />
        <TrustAndSecuritySection />
        <TeamSection />
        <AboutCtaSection />
      </main>

      <LandingFooter />
    </div>
  );
};

export default AboutPage;
