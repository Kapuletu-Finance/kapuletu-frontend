"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const DocsHeader: React.FC<{ onOpenMobileNav: () => void }> = ({ onOpenMobileNav }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 w-full overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          {/* Mobile Navigation Trigger */}
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            aria-label="Open navigation menu"
          >
            <IconLibrary name="menu" className="w-5 h-5" />
          </button>

          {/* Desktop Search Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-full max-w-md hidden md:flex items-center bg-muted/30 border border-input rounded-md text-sm text-muted-foreground px-3 py-2 hover:bg-muted/50 transition-colors"
          >
            <IconLibrary name="search" className="w-4 h-4 mr-2 opacity-70" />
            <span>Search documentation...</span>
            <span className="ml-auto text-xs bg-muted border border-border px-1.5 py-0.5 rounded shadow-sm opacity-70">
              ⌘K
            </span>
          </button>

          {/* Mobile Search Trigger */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            aria-label="Search documentation"
          >
            <IconLibrary name="search" className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-6 ml-auto">
          <Link
            href="/contact"
            className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Support
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-primary/90 transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
          >
            Go to App &rarr;
          </Link>
        </div>
      </header>

      {/* Search Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-24 sm:pt-32"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card w-full max-w-2xl border border-border rounded-xl shadow-lg overflow-hidden flex flex-col mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-border">
              <IconLibrary name="search" className="w-5 h-5 text-primary mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Search KapuLetu Help..."
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs bg-muted border border-border px-2 py-1 rounded hover:bg-muted/80"
              >
                ESC
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Recent Searches
              </div>
              <Link
                href="/docs/contributions/inbox"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary group transition-colors"
              >
                <span className="font-medium text-foreground group-hover:text-primary">
                  Understanding the Contribution Inbox
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-primary/70">
                  Contributions
                </span>
              </Link>
              <Link
                href="/docs/whatsapp"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary group transition-colors"
              >
                <span className="font-medium text-foreground group-hover:text-primary">
                  Connecting WhatsApp
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-primary/70">
                  WhatsApp
                </span>
              </Link>
            </div>
            <div className="bg-muted px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>
                <strong className="font-medium text-foreground">KapuLetu</strong> Enterprise Search
              </span>
              <span>
                Navigate with{" "}
                <kbd className="bg-background border border-border px-1 rounded mx-1">↑</kbd>
                <kbd className="bg-background border border-border px-1 rounded mr-1">↓</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
