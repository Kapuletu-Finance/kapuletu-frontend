"use client";

import { getCookie } from "cookies-next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { env } from "@/env";
import { useScrollspy } from "@/features/landing-page/hooks/useScrollspy";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blogs", label: "Blog" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/docs", label: "Help & Learning" },
];

export const LandingHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeId = useScrollspy(["about", "how-it-works", "features", "pricing", "faqs"], 100);

  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const role = getCookie(env.NEXT_PUBLIC_ROLE_COOKIE_NAME);
    if (role) setUserRole(String(role));
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (pathname !== "/") return false;
      return activeId === id || (activeId === "" && id === "about"); // default about at top
    }
    return pathname.startsWith(href);
  };

  const getHref = (href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      return href.substring(1);
    }
    return href;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-border bg-background/80">
      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        <SiteLogo variant="full" className="scale-[0.75] sm:scale-[0.8] origin-left" />

        <nav className="hidden md:flex items-center gap-6 mr-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={getHref(link.href)}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="md:hidden" />}>
              <IconLibrary name="menu" className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false}>
              <SheetHeader className="py-6 flex flex-col items-center justify-center relative">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col items-center justify-center transition-all duration-200">
                  <SiteLogo
                    variant="full"
                    className="text-2xl"
                    logoClassName="h-10 w-auto object-contain transition-all duration-200"
                  />
                </div>
                <div className="absolute bottom-0 w-4/5 h-px bg-linear-to-r from-transparent via-border to-transparent" />
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={getHref(link.href)}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block py-3 px-4 text-base font-medium rounded-md transition-colors",
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto px-4 pb-8 flex flex-col gap-3 border-t border-border pt-6">
                {isMounted && userRole ? (
                  <Link
                    href={userRole === "admin" ? "/admin" : "/treasurer"}
                    className="block w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-in" className="block w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" className="block w-full" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
                <div className="flex items-center justify-between px-1 pt-4 mt-2 border-t border-border/50">
                  <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                  <ThemeToggle variant="outline" />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <nav className="flex items-center gap-2 sm:gap-4">
            {isMounted && userRole ? (
              <Link
                href={userRole === "admin" ? "/admin" : "/treasurer"}
                className="whitespace-nowrap"
              >
                <Button size="sm" className="px-3 sm:px-4">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link href="/sign-up" className="whitespace-nowrap">
                  <Button size="sm" className="px-3 sm:px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            <div className="hidden md:block">
              <ThemeToggle variant="ghost" />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
