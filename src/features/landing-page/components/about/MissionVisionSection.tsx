import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const MissionVisionSection: React.FC = () => {
  return (
    <section className="w-full py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border border-border relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 text-primary">
              <IconLibrary name="target" className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <IconLibrary name="target" className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To make group finances simple and safe. We provide community leaders with an
                easy-to-use platform that removes the stress of administration.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border border-border relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300 text-primary">
              <IconLibrary name="eye" className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <IconLibrary name="eye" className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A future where every community group can easily show exactly how their money is
                being used, giving peace of mind to everyone involved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
