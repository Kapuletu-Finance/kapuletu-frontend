"use client";

import React from "react";
import { Suspense, use } from "react";
import { TicketResolutionView } from "@/features/admin/components/support/TicketResolutionView";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function AdminTicketContent({ params }: { params: Promise<{ ticketId: string }> }) {
  const router = useRouter();
  const { ticketId } = use(params);

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.back()}>
        &larr; Back to Support Desk
      </Button>
      <TicketResolutionView
        ticketId={ticketId}
        onResolved={() => router.push("/admin/support")}
      />
    </div>
  );
}

export default function AdminTicketDetailRoute({ params }: { params: Promise<{ ticketId: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-lg" />}>
      <AdminTicketContent params={params} />
    </Suspense>
  );
}
