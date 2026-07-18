"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/blogs", label: "Blog" },
  { href: "#faqs", label: "FAQs" },
];

export const LandingHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-border bg-background/80">
      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <SiteLogo variant="full" className="text-xl" logoClassName="h-[1em] w-[1em]" />

        <nav className="hidden md:flex items-center gap-6 mr-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false}>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-3 px-2 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto px-4 pb-4 flex flex-col gap-3 border-t border-border pt-4">
                <Link href="/sign-in" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="block">
                  <Button className="w-full">Get Started</Button>
                </Link>
                <div className="flex justify-center pt-1">
                  <ThemeToggle variant="ghost" />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link href="/sign-up" className="whitespace-nowrap">
              <Button size="sm" className="rounded-full px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
            <ThemeToggle variant="ghost" />
          </nav>
        </div>
      </div>
    </header>
  );
};
