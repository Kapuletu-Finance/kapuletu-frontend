"use client";

import React from "react";
import { TicketResolutionView } from "@/features/admin/components/support/TicketResolutionView";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminTicketDetailRoute({ params }: { params: { ticketId: string } }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.back()}>
        &larr; Back to Support Desk
      </Button>
      <TicketResolutionView
        ticketId={params.ticketId}
        onResolved={() => router.push("/admin/support")}
      />
    </div>
  );
}
