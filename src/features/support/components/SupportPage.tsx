"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTicketsQuery } from "../services/queries";
import { SupportDashboard } from "./SupportDashboard";
import { TicketDetailView } from "./TicketDetailView";
import { TicketForm } from "./TicketForm";
import { TicketList } from "./TicketList";

// ─── View State Machine ─────────────────────────────────────────────────────
// dashboard → list (w/ optional filter) → chat
// Any view can open the new-ticket dialog
type View =
  | { type: "dashboard" }
  | { type: "list"; filter?: string }
  | { type: "chat"; ticketId: string; fromFilter?: string };

export const SupportPage: React.FC = () => {
  const { data: tickets, isLoading } = useTicketsQuery();
  const [view, setView] = useState<View>({ type: "dashboard" });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ── Navigation helpers ───────────────────────────────────────────────────

  // From Dashboard: clicking a KPI card opens the list, optionally pre-filtered
  // Clicking a recent ticket row opens the chat directly
  const handleDashboardOpen = (ticketId: string, statusFilter?: string) => {
    if (ticketId) {
      setView({ type: "chat", ticketId, fromFilter: statusFilter });
    } else {
      setView({ type: "list", filter: statusFilter });
    }
  };

  // From List: clicking a ticket opens the chat
  const handleSelectTicket = (ticketId: string) => {
    const currentFilter = view.type === "list" ? view.filter : undefined;
    setView({ type: "chat", ticketId, fromFilter: currentFilter });
  };

  // Back navigation: chat → list (if came from list) or dashboard; list → dashboard
  const handleBack = () => {
    if (view.type === "chat") {
      if (view.fromFilter) {
        setView({ type: "list", filter: view.fromFilter });
      } else {
        setView({ type: "dashboard" });
      }
    } else {
      setView({ type: "dashboard" });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {/* ── Dashboard ── */}
      {view.type === "dashboard" && (
        <SupportDashboard
          tickets={tickets}
          isLoading={isLoading}
          onOpenTicket={handleDashboardOpen}
          onNewTicket={() => setIsFormOpen(true)}
        />
      )}

      {/* ── Ticket List ── */}
      {view.type === "list" && (
        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          initialFilter={
            (view.filter as "all" | "open" | "in_progress" | "resolved" | "closed") ?? "all"
          }
          onSelectTicket={handleSelectTicket}
          onBack={handleBack}
        />
      )}

      {/* ── Chat Thread ── */}
      {view.type === "chat" && (
        <div className="space-y-4">
          <TicketDetailView ticketId={view.ticketId} onBack={handleBack} />
        </div>
      )}

      {/* ── New Ticket Dialog ── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Open a Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and our team will get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <TicketForm
            onSuccess={() => {
              setIsFormOpen(false);
              // After creating, go to the list so they can see the new ticket
              setView({ type: "list", filter: "open" });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
