import Image from "next/image";
import type React from "react";

export const TheProblemSection: React.FC = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl border border-border group">
            <div className="aspect-[4/3] relative w-full">
              <Image
                src="/images/about/problem.jpg"
                alt="Chaotic manual paperwork vs clean digital dashboard"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center space-x-2 text-primary font-semibold tracking-wider uppercase text-sm">
              <span className="w-8 h-[2px] bg-primary"></span>
              <span>Why We Started</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Managing Group Money Doesn't Have to Be Hard
            </h2>

            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Many groups still use messy spreadsheets, paper notebooks, and WhatsApp chats to
                track their money.
              </p>
              <p>
                This makes it easy to lose track of who paid what, causing confusion and breaking
                trust among members. On top of that, treasurers end up spending hours doing tedious,
                manual math.
              </p>
              <p className="font-medium text-foreground">
                We built KapuLetu to fix this, once and for all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
