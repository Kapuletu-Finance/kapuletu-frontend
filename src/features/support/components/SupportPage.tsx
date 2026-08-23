"use client";

import { MessageSquare, PlusCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTicketsQuery } from "../services/queries";
import { TicketDetailView } from "./TicketDetailView";
import { TicketForm } from "./TicketForm";

export const SupportPage: React.FC = () => {
  const { data: tickets, isLoading } = useTicketsQuery();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="default" className="bg-blue-500">
            Open
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="secondary" className="bg-green-500 text-white">
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isCreating) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto h-full p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Open Support Ticket</h1>
            <p className="text-muted-foreground mt-2">
              Describe your issue in detail. Our enterprise support team will review and respond as
              soon as possible.
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            Cancel
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <TicketForm onSuccess={() => setIsCreating(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support & Ticketing</h1>
          <p className="text-muted-foreground mt-2">
            Manage your inquiries, feature requests, and support issues in real-time.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Pane: Ticket List */}
        <div className="lg:col-span-1 border rounded-lg bg-card overflow-y-auto shadow-sm">
          <div className="p-4 border-b bg-muted/20 sticky top-0 backdrop-blur z-10">
            <h3 className="font-semibold text-lg">My Tickets</h3>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : tickets?.length === 0 ? (
            <div className="p-8 text-center border-dashed rounded-lg m-4">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">No open tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't submitted any support requests yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {tickets?.map((ticket) => (
                <button
                  type="button"
                  key={ticket.ticket_id}
                  onClick={() => setSelectedTicketId(ticket.ticket_id)}
                  className={`flex flex-col text-left p-4 hover:bg-muted/50 transition-colors ${selectedTicketId === ticket.ticket_id ? "bg-muted/80 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"}`}
                >
                  <div className="flex items-center justify-between mb-1 w-full">
                    <span className="font-semibold text-sm truncate pr-2">{ticket.subject}</span>
                    {renderStatusBadge(ticket.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                    <span className="truncate max-w-[120px]">{ticket.category}</span>
                    <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane: Ticket Chat */}
        <div className="lg:col-span-2 h-full min-h-0">
          {selectedTicketId ? (
            <TicketDetailView ticketId={selectedTicketId} />
          ) : (
            <div className="h-full border rounded-lg flex flex-col items-center justify-center text-center p-8 bg-muted/10">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground">Select a ticket</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Choose a ticket from the list on the left to view the conversation and reply to our
                support team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
