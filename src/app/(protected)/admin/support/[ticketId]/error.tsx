"use client";

import { useEffect } from "react";
import { ErrorStateUI } from "@/features/shared/components/ErrorStateUI";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin Support Ticket Error Boundary Caught:", error);
  }, [error]);

  return (
    <ErrorStateUI
      statusCode={500}
      title="Something went wrong!"
      message="We encountered an unexpected error while trying to load this ticket. Please try again or contact support if the issue persists."
      actionLabel="Try Again"
      onAction={() => reset()}
      error={error}
    />
  );
}
