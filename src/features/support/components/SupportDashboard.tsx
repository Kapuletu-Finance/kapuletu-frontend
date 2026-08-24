"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Headphones,
  Loader2,
  MessageSquare,
  PlusCircle,
  Star,
  XCircle,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ticket } from "../types";

const parseSafeDate = (d?: string | null) => {
  if (!d) return new Date();
  const date = new Date(d.replace(" ", "T"));
  return isNaN(date.getTime()) ? new Date() : date;
};

interface Props {
  tickets: Ticket[] | undefined;
  isLoading: boolean;
  onOpenTicket: (id: string, statusFilter?: string) => void;
  onNewTicket: () => void;
}

const STATUS_CONFIG = {
  open: {
    label: "Open",
    colour: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: AlertCircle,
  },
  in_progress: {
    label: "In Progress",
    colour: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: Loader2,
  },
  resolved: {
    label: "Resolved",
    colour: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    colour: "text-muted-foreground",
    bg: "bg-muted/40",
    border: "border-border",
    icon: XCircle,
  },
};

const KpiCard: React.FC<{
  status: keyof typeof STATUS_CONFIG;
  count: number;
  onClick: () => void;
}> = ({ status, count, onClick }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold uppercase tracking-wide ${cfg.colour}`}>
          {cfg.label}
        </span>
        <Icon
          className={`w-4 h-4 ${cfg.colour} ${status === "in_progress" ? "animate-spin" : ""}`}
        />
      </div>
      <div className={`text-4xl font-bold ${cfg.colour}`}>{count}</div>
      <div className="text-xs text-muted-foreground mt-1 group-hover:underline">View tickets →</div>
    </button>
  );
};

export const SupportDashboard: React.FC<Props> = ({
  tickets,
  isLoading,
  onOpenTicket,
  onNewTicket,
}) => {
  const counts = {
    open: tickets?.filter((t) => t.status === "open").length ?? 0,
    in_progress: tickets?.filter((t) => t.status === "in_progress").length ?? 0,
    resolved: tickets?.filter((t) => t.status === "resolved").length ?? 0,
    closed: tickets?.filter((t) => t.status === "closed").length ?? 0,
  };

  const recent = tickets?.slice(0, 5) ?? [];
  const hasTickets = (tickets?.length ?? 0) > 0;

  const priorityColour = (p: string) => {
    if (p === "urgent") return "bg-red-500";
    if (p === "high") return "bg-orange-400";
    if (p === "medium") return "bg-blue-400";
    return "bg-muted-foreground/30";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Help Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Need assistance? We're here to help you resolve any issues quickly.
          </p>
        </div>
        <Button onClick={onNewTicket} className="gap-2 shrink-0">
          <PlusCircle className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(counts) as (keyof typeof counts)[]).map((status) => (
            <KpiCard
              key={status}
              status={status}
              count={counts[status]}
              onClick={() => onOpenTicket("", status)}
            />
          ))}
        </div>
      )}

      {/* Recent Tickets */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : hasTickets ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Tickets</h2>
            <button
              type="button"
              onClick={() => onOpenTicket("", "all")}
              className="text-sm text-primary hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="space-y-2">
            {recent.map((t) => {
              const cfg =
                STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.closed;
              return (
                <button
                  key={t.ticket_id}
                  type="button"
                  onClick={() => onOpenTicket(t.ticket_id)}
                  className="w-full text-left rounded-xl border bg-card hover:bg-muted/40 transition-colors p-4 flex items-center gap-4"
                >
                  {/* Priority stripe */}
                  <div
                    className={`w-1 self-stretch rounded-full shrink-0 ${priorityColour(t.priority)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{t.subject}</span>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] font-semibold ${cfg.colour} border-current`}
                      >
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="capitalize">{t.category}</span>
                      <span>·</span>
                      <Clock className="w-3 h-3" />
                      <span>{parseSafeDate(t.updated_at).toLocaleDateString()}</span>
                      {t.has_rating && (
                        <>
                          <span>·</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>Rated</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Headphones className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">You're all clear!</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              No support tickets yet. If you need assistance, our team is ready to help — open a
              ticket and we'll get back to you promptly.
            </p>
          </div>
          <Button onClick={onNewTicket} size="lg" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Open a Support Ticket
          </Button>
        </div>
      )}
    </div>
  );
};
