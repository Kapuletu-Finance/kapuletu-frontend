"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MessageSquare,
  Star,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ticket } from "../types";

type StatusFilter = "all" | "open" | "in_progress" | "resolved" | "closed";

const STATUS_CONFIG = {
  open: {
    label: "Open",
    colour: "text-blue-600 dark:text-blue-400",
    icon: AlertCircle,
    dotClass: "bg-blue-500",
  },
  in_progress: {
    label: "In Progress",
    colour: "text-amber-600 dark:text-amber-400",
    icon: Loader2,
    dotClass: "bg-amber-400",
  },
  resolved: {
    label: "Resolved",
    colour: "text-green-600 dark:text-green-400",
    icon: CheckCircle2,
    dotClass: "bg-green-500",
  },
  closed: {
    label: "Closed",
    colour: "text-muted-foreground",
    icon: XCircle,
    dotClass: "bg-muted-foreground/30",
  },
};

const PRIORITY_STRIPE: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-blue-400",
  low: "bg-muted-foreground/30",
};

const TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

interface Props {
  tickets: Ticket[] | undefined;
  isLoading: boolean;
  initialFilter?: StatusFilter;
  onSelectTicket: (id: string) => void;
  onBack: () => void;
}

export const TicketList: React.FC<Props> = ({
  tickets,
  isLoading,
  initialFilter = "all",
  onSelectTicket,
  onBack,
}) => {
  const [filter, setFilter] = useState<StatusFilter>(initialFilter);

  const filtered =
    filter === "all" ? (tickets ?? []) : (tickets ?? []).filter((t) => t.status === filter);

  const title =
    filter === "all"
      ? "All Tickets"
      : `${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label ?? filter} Tickets`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Back to Help Center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
            </p>
          )}
        </div>
      </div>

      {/* Status Tabs — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? (tickets?.length ?? 0)
              : (tickets?.filter((t) => t.status === tab.value).length ?? 0);
          const isActive = filter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold rounded-full px-1.5 min-w-[18px] text-center ${
                    isActive ? "bg-primary-foreground/20" : "bg-background"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Ticket Rows */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30" />
          <div>
            <h3 className="font-medium text-lg">No tickets found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "all"
                ? "You haven't submitted any support requests yet."
                : `No ${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label.toLowerCase()} tickets.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => {
            const cfg =
              STATUS_CONFIG[t.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.closed;
            const Icon = cfg.icon;
            return (
              <button
                key={t.ticket_id}
                type="button"
                onClick={() => onSelectTicket(t.ticket_id)}
                className="w-full text-left rounded-xl border bg-card hover:bg-muted/40 active:scale-[0.99] transition-all duration-150 p-4 flex items-stretch gap-4"
              >
                {/* Priority stripe */}
                <div
                  className={`w-1 rounded-full shrink-0 ${PRIORITY_STRIPE[t.priority] ?? PRIORITY_STRIPE.low}`}
                />

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-sm leading-snug">{t.subject}</span>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] font-semibold tracking-wide ${cfg.colour} border-current flex items-center gap-1`}
                    >
                      <Icon
                        className={`w-3 h-3 ${t.status === "in_progress" ? "animate-spin" : ""}`}
                      />
                      {cfg.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="capitalize font-medium">{t.category}</span>
                    <span>·</span>
                    <span className="capitalize flex items-center gap-1">
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${PRIORITY_STRIPE[t.priority] ?? PRIORITY_STRIPE.low}`}
                      />
                      {t.priority} priority
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(t.updated_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {t.has_rating && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Rated
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Chevron hint */}
                <div className="flex items-center text-muted-foreground/40">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
