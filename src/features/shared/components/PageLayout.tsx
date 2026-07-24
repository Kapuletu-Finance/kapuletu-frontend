import type * as React from "react";
import { cn } from "@/lib/utils";

export interface PageLayoutProps {
  breadcrumbs?: React.ReactNode;
  actionButton?: React.ReactNode;
  stats?: React.ReactNode;
  controls?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  breadcrumbs,
  actionButton,
  stats,
  controls,
  children,
  pagination,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12", className)}>
      {/* Header Row: Breadcrumbs & Action Button */}
      {(breadcrumbs || actionButton) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {breadcrumbs ? <div className="flex-1">{breadcrumbs}</div> : <div className="flex-1" />}
          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </div>
      )}

      {/* Stats Row */}
      {stats && <div className="w-full">{stats}</div>}

      {/* Controls Row */}
      {controls && <div className="w-full">{controls}</div>}

      {/* Data / Content */}
      <div className="w-full">{children}</div>

      {/* Pagination */}
      {pagination && <div className="w-full">{pagination}</div>}
    </div>
  );
};

export default PageLayout;
