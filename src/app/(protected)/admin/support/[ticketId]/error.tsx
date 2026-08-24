"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Support Ticket Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
      <div className="bg-muted p-4 rounded-md mb-6 w-full max-w-md overflow-auto text-left text-sm font-mono text-muted-foreground break-all">
        {error.name}: {error.message}
        <br />
        <br />
        {error.stack?.substring(0, 500)}
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
