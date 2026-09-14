import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const HeroSection = () => {
  return (
    <section className="w-full py-20 md:py-32 flex flex-col md:flex-row items-center justify-between px-4 relative overflow-hidden container mx-auto gap-10">
      <div className="flex-1 flex flex-col items-start text-left">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 text-balance">
          Modern Finance Management for <span className="text-primary">Treasurers & Groups</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 text-balance">
          Simplify bookkeeping, automate collections, and track contributions with a secure platform
          designed for treasurers and financial managers.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8">
              Get Started for Free <IconLibrary name="arrow-right" className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base h-12 px-8 bg-transparent"
            >
              See How It Works
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center w-full animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
        <Image
          src="/landing-page/hero.webp"
          alt="Kapuletu Platform"
          width={600}
          height={400}
          className="rounded-2xl shadow-2xl object-cover"
          priority
        />
      </div>
    </section>
  );
};
