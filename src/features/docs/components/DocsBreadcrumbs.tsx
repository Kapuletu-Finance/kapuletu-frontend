"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconLibrary from '@/features/shared/components/IconLibrary';

export const DocsBreadcrumbs = () => {
  const pathname = usePathname();
  
  if (!pathname || pathname === '/docs') return null;

  const paths = pathname.replace('/docs', '').split('/').filter(Boolean);
  
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-y-2 text-sm text-muted-foreground min-w-0 w-full overflow-hidden">
      <Link href="/docs" className="hover:text-foreground transition-colors flex items-center shrink-0">
        <IconLibrary name="home" className="w-4 h-4" />
      </Link>
      
      {paths.map((path, index) => {
        const href = '/docs/' + paths.slice(0, index + 1).join('/');
        const isLast = index === paths.length - 1;
        
        // Basic formatting for the path name
        const label = path.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        return (
          <div key={path} className="flex items-center">
            <IconLibrary name="chevron-right" className="w-4 h-4 mx-2 opacity-50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
