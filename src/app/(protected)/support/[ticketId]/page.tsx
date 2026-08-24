"use client";

import React from "react";
import { Suspense, use } from "react";
import { TicketDetailView } from "@/features/support/components/TicketDetailView";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function TicketContent({ params }: { params: Promise<{ ticketId: string }> }) {
  const router = useRouter();
  const { ticketId } = use(params);

  return <TicketDetailView ticketId={ticketId} onBack={() => router.back()} />;
}

export default function TicketDetailRoute({ params }: { params: Promise<{ ticketId: string }> }) {
  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 space-y-4">
      <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-lg" />}>
        <TicketContent params={params} />
      </Suspense>
    </div>
  );
}
