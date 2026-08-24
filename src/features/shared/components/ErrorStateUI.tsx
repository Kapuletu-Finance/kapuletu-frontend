"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import IconLibrary from "@/features/shared/components/IconLibrary";
import { SiteLogo } from "@/features/shared/components/SiteLogo";

export interface ErrorStateUIProps {
  statusCode?: number | string;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  error?: Error & { digest?: string };
}

export const ErrorStateUI: React.FC<ErrorStateUIProps> = ({
  statusCode,
  title,
  message,
  actionLabel = "Return Home",
  actionHref = "/",
  onAction,
  error,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="flex flex-col items-center text-center max-w-2xl w-full">
        <SiteLogo width={56} height={56} className="mb-8" />

        {statusCode && (
          <h1 className="text-8xl font-bold tracking-tighter text-muted/40 select-none mb-4 font-sans">
            {statusCode}
          </h1>
        )}

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4 font-sans">
          {title}
        </h2>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {onAction ? (
            <Button onClick={onAction} className="font-medium px-8 py-6 rounded-full" size="lg">
              {actionLabel}
            </Button>
          ) : (
            <Link href={actionHref}>
              <Button className="font-medium px-8 py-6 rounded-full" size="lg">
                {actionLabel}
              </Button>
            </Link>
          )}

          {error && (
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="font-medium px-8 py-6 rounded-full"
              size="lg"
            >
              <IconLibrary name="info" className="mr-2 h-4 w-4" />
              {showDetails ? "Hide Details" : "View Details"}
            </Button>
          )}
        </div>

        {error && showDetails && (
          <div className="mt-8 w-full bg-muted/30 border border-border p-6 rounded-xl text-left overflow-auto max-h-[300px]">
            <h4 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
              <IconLibrary name="alert" className="h-4 w-4" />
              Developer Information
            </h4>
            <div className="text-xs font-mono text-muted-foreground break-words space-y-4">
              <p>
                <strong>Message:</strong> {error.message}
              </p>
              {error.digest && (
                <p>
                  <strong>Digest:</strong> {error.digest}
                </p>
              )}
              {error.stack && (
                <div className="bg-background/50 p-4 rounded border border-border/50">
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
