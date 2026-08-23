"use client";

import { AlertTriangle, Clock, MessageSquare, PlusCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            High
          </Badge>
        );
      default:
        return <Badge variant="secondary">Standard</Badge>;
    }
  };

  if (isCreating) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Open Support Ticket</h1>
            <p className="text-muted-foreground mt-2">
              Describe your issue in detail. Our enterprise support team will review it based on
              your SLA.
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

  if (selectedTicketId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedTicketId(null)} className="mb-4">
          &larr; Back to Tickets
        </Button>
        <TicketDetailView ticketId={selectedTicketId} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support & Ticketing</h1>
          <p className="text-muted-foreground mt-2">
            Manage your inquiries, feature requests, and support issues.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets?.filter((t) => t.status === "open").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
          <CardDescription>A history of your interactions with our support team.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : tickets?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>You haven't opened any support tickets yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets?.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => setSelectedTicketId(ticket.ticket_id)}
                >
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-3">
                      {ticket.subject}
                      {renderStatusBadge(ticket.status)}
                      {renderPriorityBadge(ticket.priority)}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span>Category: {ticket.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Opened on {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
