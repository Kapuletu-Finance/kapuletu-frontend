"use client";

import { AlertTriangle, Clock, MessageCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSupportTicketsQuery } from "../../services/queries";
import { TicketResolutionView } from "./TicketResolutionView";

export const AdminSupportPage: React.FC = () => {
  const { data: tickets, isLoading } = useAdminSupportTicketsQuery("open");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  if (selectedTicketId) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedTicketId(null)}>
          &larr; Back to Dashboard
        </Button>
        <TicketResolutionView
          ticketId={selectedTicketId}
          onResolved={() => setSelectedTicketId(null)}
        />
      </div>
    );
  }

  const renderSLABadge = (deadline: string | null) => {
    if (!deadline) return null;
    const isBreached = new Date(deadline) < new Date();
    return isBreached ? (
      <Badge variant="destructive" className="ml-2">
        SLA Breached
      </Badge>
    ) : (
      <Badge variant="outline" className="ml-2 border-orange-500 text-orange-500">
        SLA Active
      </Badge>
    );
  };

  const renderPriority = (p: string) => {
    if (p === "urgent")
      return (
        <Badge variant="destructive" className="bg-red-600">
          <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
        </Badge>
      );
    if (p === "high")
      return (
        <Badge variant="destructive" className="bg-orange-500">
          High
        </Badge>
      );
    return <Badge variant="secondary">Standard</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Desk</h1>
        <p className="text-muted-foreground mt-2">Manage incoming treasurer tickets and SLAs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs Attention</CardTitle>
          <CardDescription>Tickets sorted by urgency and SLA deadline.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : tickets?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Inbox Zero! 🎉</div>
          ) : (
            <div className="space-y-3">
              {tickets?.map((t: any) => (
                <div
                  key={t.ticket_id}
                  onClick={() => setSelectedTicketId(t.ticket_id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-semibold flex items-center gap-2">
                      {t.subject}
                      {renderPriority(t.priority)}
                      {renderSLABadge(t.sla_deadline)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t.user_name} ({t.email}) • {t.category}
                    </div>
                  </div>
                  <div className="text-sm text-right mt-2 sm:mt-0">
                    <div className="flex items-center text-muted-foreground justify-end gap-1">
                      <Clock className="w-3 h-3" /> Last Reply:{" "}
                      {t.last_reply_at ? new Date(t.last_reply_at).toLocaleDateString() : "N/A"}
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
