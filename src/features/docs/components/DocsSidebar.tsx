"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname() || "";

  const isActive = (href: string) => {
    if (
      href === "/docs/getting-started/welcome" ||
      href === "/docs/getting-started/first-30-minutes"
    ) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getLinkClass = (href: string) => {
    const active = isActive(href);
    return `text-sm flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
      active
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border h-screen overflow-hidden transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 md:sticky md:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <ScrollArea className="h-full w-full" orientation="vertical">
        <div className="p-4 relative">
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground bg-muted/50 rounded-md"
            aria-label="Close sidebar"
          >
            <IconLibrary name="close" className="w-5 h-5" />
          </button>

          <div className="mb-8 pl-2 mt-2">
            <SiteLogo variant="full" />
          </div>

          <nav className="space-y-6">
            <div>
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 pl-2">
                Get Started
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/docs/getting-started/welcome"
                    className={getLinkClass("/docs/getting-started/welcome")}
                  >
                    <IconLibrary name="info" className="w-4 h-4" /> Welcome
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/getting-started/first-30-minutes"
                    className={getLinkClass("/docs/getting-started/first-30-minutes")}
                  >
                    <IconLibrary name="target" className="w-4 h-4" /> First 30 Minutes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 pl-2">
                Treasury Workflows
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/docs/groups" className={getLinkClass("/docs/groups")}>
                    <IconLibrary name="users" className="w-4 h-4" /> Groups & Members
                  </Link>
                </li>
                <li>
                  <Link href="/docs/fundraising" className={getLinkClass("/docs/fundraising")}>
                    <IconLibrary name="activity" className="w-4 h-4" /> Fundraising
                  </Link>
                </li>
                <li>
                  <Link href="/docs/contributions" className={getLinkClass("/docs/contributions")}>
                    <IconLibrary name="inbox" className="w-4 h-4" /> Contributions & Inbox
                  </Link>
                </li>
                <li>
                  <Link href="/docs/expenses" className={getLinkClass("/docs/expenses")}>
                    <IconLibrary name="credit-card" className="w-4 h-4" /> Expenses
                  </Link>
                </li>
                <li>
                  <Link href="/docs/reports" className={getLinkClass("/docs/reports")}>
                    <IconLibrary name="report" className="w-4 h-4" /> Reports & Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 pl-2">
                Administration
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/docs/whatsapp" className={getLinkClass("/docs/whatsapp")}>
                    <IconLibrary name="message-circle" className="w-4 h-4" /> WhatsApp Processing
                  </Link>
                </li>
                <li>
                  <Link href="/docs/security" className={getLinkClass("/docs/security")}>
                    <IconLibrary name="shield" className="w-4 h-4" /> Account & Security
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        </ScrollArea>
      </aside>
    </>
  );
};
