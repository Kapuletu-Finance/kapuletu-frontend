import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

export const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-border bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <SiteLogo variant="full" className="text-xl" logoClassName="h-[1em] w-[1em]" />
        <div className="flex items-center">
          <nav className="hidden md:flex items-center gap-6 mr-6">
            <Link
              href="#about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link href="#faqs" className="text-sm font-medium hover:text-primary transition-colors">
              FAQs
            </Link>
          </nav>
          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="rounded-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
