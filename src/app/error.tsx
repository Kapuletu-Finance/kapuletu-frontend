"use client";

import { useEffect } from "react";
import { ErrorStateUI } from "@/features/shared/components/ErrorStateUI";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Application Error Caught:", error);
  }, [error]);

  return (
    <ErrorStateUI
      statusCode={500}
      title="Application Error"
      message="We encountered an unexpected error while trying to process your request. Our team has been notified. Please try again."
      actionLabel="Try Again"
      onAction={() => reset()}
      error={error}
    />
  );
}
