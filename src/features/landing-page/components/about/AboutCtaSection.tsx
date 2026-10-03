import Link from "next/link";
import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const AboutCtaSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Build Trust in Your Community?
        </h2>
        <p className="text-lg md:text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of other treasurers who have already ditched the spreadsheets and embraced
          radical transparency.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-8 py-4 bg-background text-primary rounded-lg font-bold hover:bg-background/90 transition-colors flex items-center justify-center gap-2"
          >
            Create Free Account
            <IconLibrary name="arrow-right" className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-primary-foreground text-primary-foreground rounded-lg font-bold hover:bg-primary-foreground/10 transition-colors flex items-center justify-center gap-2"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};
