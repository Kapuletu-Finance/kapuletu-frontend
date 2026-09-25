import Link from "next/link";
import type React from "react";

interface DocsPaginationProps {
  prev?: { title: string; link: string };
  next?: { title: string; link: string };
}

export const DocsPagination: React.FC<DocsPaginationProps> = ({ prev, next }) => {
  if (!prev && !next) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mt-16 pt-8 border-t border-border">
      {prev ? (
        <Link
          href={prev.link}
          className="flex flex-col items-start gap-2 p-4 border border-border rounded-lg bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex-1 group"
        >
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Previous
          </span>
          <span className="font-semibold text-foreground text-sm sm:text-base">{prev.title}</span>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}

      {next ? (
        <Link
          href={next.link}
          className="flex flex-col items-end text-right gap-2 p-4 border border-border rounded-lg bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex-1 group"
        >
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
          <span className="font-semibold text-foreground text-sm sm:text-base">{next.title}</span>
        </Link>
      ) : (
        <div className="flex-1 hidden sm:block" />
      )}
    </div>
  );
};
