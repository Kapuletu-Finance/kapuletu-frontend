import type React from "react";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export const generatePagination = (currentPage: number, totalPages: number, siblingCount = 1) => {
  if (totalPages <= 1) return [1];

  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }

  return [];
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  siblingCount = 1,
}) => {
  const paginationRange = generatePagination(currentPage, totalPages, siblingCount);

  return (
    <div className={cn("flex justify-center items-center gap-2 pt-6", className)}>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 border-border bg-transparent shadow-sm text-muted-foreground"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <IconLibrary name="chevron-left" className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1">
        {paginationRange.map((pageNumber, idx) => {
          if (pageNumber === "...") {
            return (
              <div
                key={idx === 1 ? "dots-left" : "dots-right"}
                className="px-2 text-muted-foreground"
              >
                &#8230;
              </div>
            );
          }

          const isCurrent = pageNumber === currentPage;
          return (
            <Button
              key={pageNumber}
              variant={isCurrent ? "default" : "outline"}
              className={cn(
                "rounded-full w-10 h-10 shadow-sm font-semibold",
                !isCurrent &&
                  "border-border bg-transparent text-muted-foreground hover:bg-muted/50",
              )}
              onClick={() => onPageChange?.(pageNumber as number)}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 border-border bg-transparent shadow-sm text-muted-foreground"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <IconLibrary name="chevron-right" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
