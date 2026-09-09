import type * as React from "react";
import { cn } from "@/lib/utils";

import ViewToggleGroup from "./ViewToggleGroup";

export interface PageLayoutProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actionButton?: React.ReactNode;
  stats?: React.ReactNode;
  controls?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
  showViewToggle?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actionButton,
  stats,
  controls,
  children,
  pagination,
  className,
  showViewToggle,
}) => {
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12", className)}>
      {/* Header Row: Title & Action Button */}
      {(title || subtitle || actionButton) && (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </div>
      )}

      {/* Stats Row */}
      {stats && <div className="w-full">{stats}</div>}

      {(controls || showViewToggle) && (
        <div className="w-full flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">{controls}</div>
          {showViewToggle && <div className="shrink-0"><ViewToggleGroup /></div>}
        </div>
      )}

      {/* Data / Content */}
      <div className="w-full">{children}</div>

      {/* Pagination */}
      {pagination && <div className="w-full">{pagination}</div>}
    </div>
  );
};

export default PageLayout;
