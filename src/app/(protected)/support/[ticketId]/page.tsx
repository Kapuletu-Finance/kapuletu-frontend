"use client";

import React from "react";
import { TicketDetailView } from "@/features/support/components/TicketDetailView";
import { useRouter } from "next/navigation";

export default function TicketDetailRoute({ params }: { params: { ticketId: string } }) {
  const router = useRouter();

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 space-y-4">
      <TicketDetailView ticketId={params.ticketId} onBack={() => router.back()} />
    </div>
  );
}
