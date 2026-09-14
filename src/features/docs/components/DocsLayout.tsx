"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { DocsBreadcrumbs } from "./DocsBreadcrumbs";
import { DocsHeader } from "./DocsHeader";
import { DocsSidebar } from "./DocsSidebar";
import { DocsTOC } from "./DocsTOC";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar automatically when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <DocsSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <DocsHeader onOpenMobileNav={() => setIsMobileSidebarOpen(true)} />
        <ScrollArea className="flex-1 bg-background" orientation="vertical">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col xl:flex-row xl:gap-8 relative items-start">
            <div className="flex-1 min-w-0 w-full max-w-4xl">
              <DocsBreadcrumbs />
              {children}
            </div>
            <DocsTOC />
          </div>
        </main>
        </ScrollArea>
      </div>
    </div>
  );
};
