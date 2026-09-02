"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DocsSidebar } from './DocsSidebar';
import { DocsHeader } from './DocsHeader';
import { DocsBreadcrumbs } from './DocsBreadcrumbs';
import { DocsTOC } from './DocsTOC';

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
      <DocsSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <DocsHeader onOpenMobileNav={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col xl:flex-row xl:gap-8 relative items-start">
            <div className="flex-1 min-w-0 w-full max-w-4xl">
              <DocsBreadcrumbs />
              {children}
            </div>
            <DocsTOC />
          </div>
        </main>
      </div>
    </div>
  );
};
