"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export const DocsTOC = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    // Small delay to ensure the new page's DOM has fully rendered
    const timer = setTimeout(() => {
      const allElements = Array.from(document.querySelectorAll('article h2, article h3'));
      // Filter out headings that are inside links/cards so they don't clutter the TOC
      const elements = allElements.filter(elem => !elem.closest('a') && !elem.closest('button'));
      
      const parsed = elements.map((elem) => {
        if (!elem.id) {
          elem.id = elem.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
        }
        return {
          id: elem.id,
          text: elem.textContent || '',
          level: Number(elem.tagName.replace('H', '')),
        };
      });
      
      setHeadings(parsed);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0px 0px -80% 0px' }
      );

      elements.forEach((elem) => observer.observe(elem));
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24 pl-6 border-l border-border/50">
        <h4 className="font-semibold text-sm mb-4">On this page</h4>
        <ul className="space-y-2.5 text-sm">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={cn(
                "transition-colors",
                heading.level === 3 ? "pl-4" : "",
                activeId === heading.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <a href={`#${heading.id}`} className="block truncate">
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
