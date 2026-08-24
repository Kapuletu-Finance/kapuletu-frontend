"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTicketsQuery } from "../services/queries";
import { SupportDashboard } from "./SupportDashboard";
import { TicketForm } from "./TicketForm";
import { TicketList } from "./TicketList";

const SupportPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("view") || "dashboard";
  const filter = searchParams.get("status") || "all";

  const { data: tickets, isLoading } = useTicketsQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDashboardOpen = (ticketId: string, statusFilter?: string) => {
    if (ticketId) {
      router.push(`/support/${ticketId}`);
    } else {
      router.push(`/support?view=list&status=${statusFilter || "all"}`);
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    router.push(`/support/${ticketId}`);
  };

  const handleBack = () => {
    router.push(`/support`);
  };

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {viewType === "dashboard" && (
        <SupportDashboard
          tickets={tickets}
          isLoading={isLoading}
          onOpenTicket={handleDashboardOpen}
          onNewTicket={() => setIsFormOpen(true)}
        />
      )}

      {viewType === "list" && (
        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          initialFilter={(filter as "all" | "open" | "in_progress" | "resolved" | "closed")}
          onSelectTicket={handleSelectTicket}
          onBack={handleBack}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Open a Support Ticket</DialogTitle>
            <DialogDescription>
              We're here to help. Fill out the details below and we'll get back to you shortly.
            </DialogDescription>
          </DialogHeader>
          <TicketForm onSuccess={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const SupportPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SupportPageContent />
    </Suspense>
  );
};
