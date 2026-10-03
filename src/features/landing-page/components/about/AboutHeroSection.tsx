import Image from "next/image";
import type React from "react";

export const AboutHeroSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40 bg-background overflow-hidden flex items-center justify-center border-b border-border">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about/hero_bg.jpg"
          alt="Abstract financial network"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase mb-6 shadow-sm border border-primary/20">
          Our Company
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          Empowering <span className="text-primary drop-shadow-sm">Financial Trust</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          We are building the modern infrastructure for community finance. KapuLetu provides the
          transparency and tools that treasurers need to lead with absolute confidence.
        </p>
      </div>
    </section>
  );
};
