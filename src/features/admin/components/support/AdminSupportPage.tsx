"use client";

import { AlertTriangle, Clock, Loader2, MessageCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminSupportTicketsQuery } from "../../services/queries";
import { TicketResolutionView } from "./TicketResolutionView";

type StatusFilter = "open" | "in_progress" | "resolved" | "closed";

interface TicketQueueItem {
  ticket_id: string;
  subject: string;
  priority: string;
  status: string;
  category: string;
  user_name: string;
  email: string;
  sla_deadline: string | null;
  last_reply_at: string | null;
}

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const AdminSupportPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const { data: tickets, isLoading } = useAdminSupportTicketsQuery(statusFilter);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  if (selectedTicketId) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedTicketId(null)}>
          &larr; Back to Support Desk
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
      <Badge variant="destructive" className="ml-1 text-xs">
        SLA Breached
      </Badge>
    ) : (
      <Badge variant="outline" className="ml-1 border-orange-500 text-orange-500 text-xs">
        SLA Active
      </Badge>
    );
  };

  const renderPriority = (p: string) => {
    if (p === "urgent")
      return (
        <Badge variant="destructive" className="bg-red-600 text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
        </Badge>
      );
    if (p === "high")
      return (
        <Badge variant="destructive" className="bg-orange-500 text-xs">
          High
        </Badge>
      );
    return (
      <Badge variant="secondary" className="text-xs">
        Standard
      </Badge>
    );
  };

  const renderStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      open: "bg-blue-500/10 text-blue-600 border-blue-500/30",
      in_progress: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
      resolved: "bg-green-500/10 text-green-600 border-green-500/30",
      closed: "bg-muted text-muted-foreground",
    };
    return (
      <Badge variant="outline" className={`text-xs ${map[status] || ""}`}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Support Desk</h1>
        <p className="text-sm text-muted-foreground">Manage incoming treasurer tickets and SLAs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {STATUS_TABS.find((t) => t.value === statusFilter)?.label} Tickets
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {isLoading ? "..." : tickets?.length || 0}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">in queue</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Queue</CardTitle>
          <CardDescription>Sorted by urgency and SLA deadline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading tickets...
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : tickets?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {statusFilter === "open"
                ? "Inbox Zero! 🎉 No open tickets."
                : `No ${statusFilter.replace("_", " ")} tickets.`}
            </div>
          ) : (
            <div className="space-y-3">
              {tickets?.map((t: TicketQueueItem) => (
                <button
                  key={t.ticket_id}
                  type="button"
                  onClick={() => setSelectedTicketId(t.ticket_id)}
                  className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-semibold flex items-center gap-2 flex-wrap">
                      {t.subject}
                      {renderPriority(t.priority)}
                      {renderStatusBadge(t.status)}
                      {renderSLABadge(t.sla_deadline)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t.user_name} ({t.email}) &bull; {t.category}
                    </div>
                  </div>
                  <div className="text-sm text-right mt-2 sm:mt-0 shrink-0">
                    <div className="flex items-center text-muted-foreground justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {t.last_reply_at
                        ? new Date(t.last_reply_at).toLocaleDateString()
                        : "No replies yet"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
