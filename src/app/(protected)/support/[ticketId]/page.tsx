"use client";

import React from "react";
import { use } from "react";
import { TicketDetailView } from "@/features/support/components/TicketDetailView";
import { useRouter } from "next/navigation";

export default function TicketDetailRoute({ params }: { params: Promise<{ ticketId: string }> }) {
  const router = useRouter();
  const { ticketId } = use(params);

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 space-y-4">
      <TicketDetailView ticketId={ticketId} onBack={() => router.back()} />
    </div>
  );
}
